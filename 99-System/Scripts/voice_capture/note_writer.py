"""Write a capture note into +Inbox with a collision-safe filename."""

from __future__ import annotations

from pathlib import Path

MAX_STEM = 60


def _safe_stem(title: str) -> str:
    stem = title.strip()[:MAX_STEM].rstrip()
    return stem or "Voice Note"


def write_capture(content: str, title: str, inbox: Path) -> Path:
    inbox.mkdir(parents=True, exist_ok=True)
    stem = _safe_stem(title)
    target = inbox / f"{stem}.md"
    n = 2
    while target.exists():
        target = inbox / f"{stem} {n}.md"
        n += 1
    target.write_text(content, encoding="utf-8")
    return target
