"""Local Whisper transcription wrapper.

The model loader and language detector are injectable so unit tests never
touch torch/whisper. The real implementations lazy-import whisper.

Language handling: this user speaks Czech (primary) and English (secondary)
only. Whisper's unconstrained auto-detect misfires on short Czech clips
(commonly picking Polish). So when no language is forced we run Whisper's
own language detection but *restrict the choice to cs vs en* — it can never
wander to a third language.
"""

from __future__ import annotations

import os
import shutil
from dataclasses import dataclass
from glob import glob
from pathlib import Path
from typing import Any, Callable, Mapping, Optional

ModelLoader = Callable[[str], Any]
LanguageDetector = Callable[[Any, Path], str]


@dataclass
class TranscriptionResult:
    text: str
    avg_logprob: float | None = None
    no_speech_prob: float | None = None


def _ensure_ffmpeg_on_path() -> None:
    """Whisper shells out to `ffmpeg` by name. On Windows it is often only
    installed under a versioned WinGet package dir that isn't on PATH for the
    shell that launched us. Locate it and prepend its dir so the subprocess
    call in whisper.load_audio() succeeds — independent of machine PATH state.
    """
    if shutil.which("ffmpeg"):
        return

    local = os.environ.get("LOCALAPPDATA", "")
    candidates: list[str] = []
    if local:
        # WinGet stable shim (when present)
        candidates.append(
            os.path.join(local, "Microsoft", "WinGet", "Links", "ffmpeg.exe")
        )
        # WinGet versioned package dir (version string varies — glob it)
        candidates += glob(
            os.path.join(
                local,
                "Microsoft",
                "WinGet",
                "Packages",
                "Gyan.FFmpeg*",
                "**",
                "bin",
                "ffmpeg.exe",
            ),
            recursive=True,
        )
    # Common Chocolatey / Scoop locations as a fallback
    candidates += glob(r"C:\ProgramData\chocolatey\bin\ffmpeg.exe")
    candidates += glob(
        os.path.expanduser(r"~\scoop\apps\ffmpeg\current\bin\ffmpeg.exe")
    )

    for exe in candidates:
        if exe and os.path.isfile(exe):
            bin_dir = os.path.dirname(exe)
            os.environ["PATH"] = bin_dir + os.pathsep + os.environ.get("PATH", "")
            return

    raise RuntimeError(
        "ffmpeg not found. Whisper needs ffmpeg to decode audio.\n"
        "Install it with:  winget install Gyan.FFmpeg\n"
        "then restart the shell (or it will be auto-detected next run)."
    )


def _pick_cs_or_en(probs: Mapping[str, float]) -> str:
    """Collapse Whisper's full language-probability map to the only two
    languages this user produces. Ties go to Czech (the primary language).
    """
    return "cs" if probs.get("cs", 0.0) >= probs.get("en", 0.0) else "en"


def _default_loader(model_name: str) -> Any:
    import whisper  # heavy; imported lazily on real use only

    return whisper.load_model(model_name)


def _default_detector(model: Any, wav_path: Path) -> str:
    """Run Whisper's language detection on the first 30s, then constrain the
    result to cs/en so it can never drift to Polish or another language.
    """
    import whisper

    audio = whisper.load_audio(str(wav_path))
    audio = whisper.pad_or_trim(audio)
    mel = whisper.log_mel_spectrogram(audio, model.dims.n_mels).to(model.device)
    _, probs = model.detect_language(mel)
    return _pick_cs_or_en(probs)


def transcribe(
    wav_path: Path,
    model_name: str = "base",
    language: Optional[str] = None,
    loader: ModelLoader = _default_loader,
    detector: LanguageDetector = _default_detector,
) -> TranscriptionResult:
    _ensure_ffmpeg_on_path()
    model = loader(model_name)
    if language is None:
        language = detector(model, wav_path)
    result = model.transcribe(str(wav_path), language=language, fp16=False)
    text = (result.get("text") or "").strip()
    segments = result.get("segments") or []
    logprobs = [s["avg_logprob"] for s in segments if s.get("avg_logprob") is not None]
    nospeech = [s["no_speech_prob"] for s in segments if s.get("no_speech_prob") is not None]
    return TranscriptionResult(
        text=text,
        avg_logprob=(sum(logprobs) / len(logprobs)) if logprobs else None,
        no_speech_prob=max(nospeech) if nospeech else None,
    )
