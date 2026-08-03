"""Voice-to-note CLI: record -> local Whisper -> raw +Inbox capture.

Classification/routing is intentionally NOT done here — that is the
capture-processor agent's job (run /process-capture afterwards).
"""

from __future__ import annotations

import argparse
import sys
from datetime import datetime
from pathlib import Path

from . import config
from .note_builder import build_capture_note
from .note_writer import write_capture
from .title import derive_title


def _reconfigure_stdout() -> None:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


def run(
    transcription,
    *,
    model: str,
    inbox: Path,
    now: datetime,
    dry_run: bool,
) -> Path | None:
    from .transcriber import TranscriptionResult

    if isinstance(transcription, TranscriptionResult):
        text, confidence = transcription.text, transcription
    else:  # --text path passes a bare string, no confidence
        text, confidence = transcription, None

    title = derive_title(text, now)
    content = build_capture_note(text, title, now, model, confidence=confidence)
    if dry_run:
        print(content)
        return None
    path = write_capture(content, title, inbox)
    print(f"✅ Voice note created: {path}")
    print("   Next: run /process-capture to classify and file it.")
    return path


def cleanup_recording(wav: Path, note_written: Path | None) -> bool:
    """Delete the retained wav only if the note write succeeded.

    Returns True if the wav was deleted, False if it was kept (so the
    caller can point the user at --retranscribe).
    """
    if note_written is None:
        return False
    wav.unlink(missing_ok=True)
    return True


def main(argv: list[str] | None = None) -> int:
    _reconfigure_stdout()
    parser = argparse.ArgumentParser(prog="voice_capture")
    parser.add_argument(
        "--duration",
        type=int,
        default=None,
        help="Fixed recording length in seconds. Omit to record until you press Enter.",
    )
    parser.add_argument("--model", default=config.DEFAULT_MODEL)
    parser.add_argument(
        "--language",
        default=None,
        help="Force language (e.g. cs, en). Default: auto-detect.",
    )
    parser.add_argument(
        "--vault",
        default=None,
        help="Vault root override (default: auto / $ORIGIN_VAULT).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the note instead of writing it.",
    )
    parser.add_argument(
        "--text",
        default=None,
        help="Skip recording; use this text verbatim.",
    )
    args = parser.parse_args(argv)

    inbox = (Path(args.vault) / "+Inbox") if args.vault else config.inbox_dir()
    now = datetime.now()

    wav: Path | None = None
    if args.text is not None:
        transcription = args.text
    else:
        from .recorder import record, record_until_keypress, write_wav
        from .transcriber import transcribe

        rec_dir = config.recordings_dir()
        rec_dir.mkdir(parents=True, exist_ok=True)
        wav = rec_dir / f"rec-{now:%Y%m%d-%H%M%S}.wav"

        if args.duration is None:
            print("🎤 Recording… press Enter to stop (Ctrl+C to abort)")
            data = record_until_keypress(config.DEFAULT_SAMPLERATE)
        else:
            print(f"🎤 Recording {args.duration}s... (Ctrl+C to abort)")
            data = record(args.duration, config.DEFAULT_SAMPLERATE)
        write_wav(wav, data, config.DEFAULT_SAMPLERATE)
        print("📝 Transcribing locally (no cloud)...")
        try:
            transcription = transcribe(wav, args.model, args.language)
        except Exception as exc:  # keep the wav — recording is unrecoverable
            print(f"❌ Transcription failed: {exc}")
            print(f"   Recording kept at: {wav}")
            return 1

    note_path = run(
        transcription, model=args.model, inbox=inbox, now=now, dry_run=args.dry_run
    )
    if wav is not None and not args.dry_run:
        if not cleanup_recording(wav, note_path):
            print(f"   Recording kept at: {wav}")
    return 0
