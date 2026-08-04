"""Derive a filesystem- and YAML-safe note title from a transcription."""

from __future__ import annotations

import re
from datetime import datetime

_INVALID = re.compile(r'[\\/:*?"<>|]')
_WS = re.compile(r"\s+")
MAX_TITLE = 50


def derive_title(transcription: str, now: datetime) -> str:
    text = (transcription or "").strip()
    if not text:
        return f"Voice Note {now:%Y-%m-%d %H-%M-%S}"
    cleaned = _WS.sub(" ", _INVALID.sub("", text)).strip()
    title = " ".join(cleaned.split(" ")[:6]).strip()
    if len(title) > MAX_TITLE:
        title = title[:MAX_TITLE].rstrip()
    if not title:
        return f"Voice Note {now:%Y-%m-%d %H-%M-%S}"
    return title
