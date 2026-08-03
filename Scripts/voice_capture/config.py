"""Configuration and vault-path resolution for voice_capture."""

from __future__ import annotations

import os
from pathlib import Path

# config.py -> voice_capture/ -> Scripts/ -> 99-System/ -> <vault root>
_VAULT_ROOT = Path(__file__).resolve().parents[3]

DEFAULT_MODEL = "small"  # base misdetects short Czech as Polish; small is reliable
DEFAULT_DURATION = 120  # seconds
DEFAULT_SAMPLERATE = 16000


def vault_root() -> Path:
    """Resolve the Origin vault root. ORIGIN_VAULT env var wins."""
    env = os.environ.get("ORIGIN_VAULT")
    if env:
        return Path(env)
    return _VAULT_ROOT


def inbox_dir() -> Path:
    """Absolute path to the vault's +Inbox folder."""
    return vault_root() / "+Inbox"


def recordings_dir() -> Path:
    """Durable folder for retained recordings (crash-safe; not auto-deleted).

    Lives inside the package so it travels with the CLI; gitignored via
    _recordings/.gitignore. Cleaned per-run only after the note write succeeds.
    """
    return Path(__file__).resolve().parent / "_recordings"
