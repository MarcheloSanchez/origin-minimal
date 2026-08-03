"""Microphone capture (sounddevice) and WAV writing (scipy).

sounddevice is lazy-imported inside record() so the package and
non-recording tests do not require audio hardware/drivers.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np


def _concat_blocks(blocks: list[np.ndarray]) -> np.ndarray:
    """Join captured mono int16 audio blocks into one array.
    Empty input -> a zero-length (0, 1) int16 array.
    """
    if not blocks:
        return np.zeros((0, 1), dtype="int16")
    return np.concatenate(blocks, axis=0)


def write_wav(path: Path, data: np.ndarray, samplerate: int) -> None:
    from scipy.io import wavfile

    wavfile.write(str(path), samplerate, data)


def record(duration: int, samplerate: int) -> np.ndarray:
    import sounddevice as sd  # hardware; imported lazily

    frames = int(duration * samplerate)
    recording = sd.rec(frames, samplerate=samplerate, channels=1, dtype="int16")
    sd.wait()
    return recording


def record_until_keypress(samplerate: int, wait_for_stop=input) -> np.ndarray:
    """Record mono int16 audio until wait_for_stop() returns.

    sounddevice is lazy-imported (same pattern as record()). The stream
    callback copies each block into a buffer; wait_for_stop defaults to
    input (blocks until Enter). The user-facing prompt is printed by the
    caller (cli.py), not here, to avoid a duplicate message.
    """
    import sounddevice as sd  # hardware; imported lazily

    blocks: list[np.ndarray] = []

    def _callback(indata, frames, time, status):  # noqa: ANN001
        blocks.append(indata.copy())

    with sd.InputStream(
        samplerate=samplerate,
        channels=1,
        dtype="int16",
        callback=_callback,
    ):
        wait_for_stop()

    return _concat_blocks(blocks)
