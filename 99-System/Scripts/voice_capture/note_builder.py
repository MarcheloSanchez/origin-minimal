"""Render a raw +Inbox quick-capture note.

Output mirrors the existing Origin v2.0 quick-capture template
(verified against +Inbox/Creating minimal-vault.md). It deliberately
does NOT classify, tag, or route — the capture-processor agent owns that.
"""

from __future__ import annotations

from datetime import datetime

_TEMPLATE = """\
---
title: "{title}"
type: atomic
status: 📥inbox
created: {created}
tags:
processing_priority:
related:
captured_via: voice
transcription_model: whisper-{model}{conf_lines}
---

# {title}

## Content
<!-- Quick capture - don't organize, just capture -->

{body}


## Context
**Why captured**:
**Source**: voice capture
**Next action**:

## Processing Notes
- [ ] Clarify and expand
- [ ] Determine type (atomic/effort/source/moc)
- [ ] Add proper tags
- [ ] Move to appropriate folder
- [ ] Create connections
"""


def build_capture_note(
    transcription: str,
    title: str,
    now: datetime,
    model: str,
    confidence: object | None = None,
) -> str:
    conf_lines = ""
    if confidence is not None and getattr(confidence, "avg_logprob", None) is not None:
        conf_lines = (
            f"\ntranscription_confidence: {confidence.avg_logprob:.2f}"
            f"\ntranscription_no_speech: {confidence.no_speech_prob:.2f}"
        )
    return _TEMPLATE.format(
        title=title,
        created=f"{now:%Y-%m-%d}",
        body=(transcription or "").strip(),
        model=model,
        conf_lines=conf_lines,
    )
