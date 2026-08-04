"""Score how noisy a voice transcription is. Never strips — only scores.

Messiness is a separate axis from length (see proposal M2). Signals are
additive; >= 2 triggered signals => messy. Whisper confidence is an
optional signal — mobile captures have none, so its absence must not
change the score for otherwise-clean text (M7).
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field

# Bilingual FILLER words (M6: NOT the classification keywords in
# quick-process-*.js — those are intentional and unrelated).
_FILLER = {
    # Czech
    "no", "jako", "prostě", "takže", "vlastně", "hele", "jakoby",
    "teda", "jakože", "že jo", "nějak",
    # English
    "um", "uh", "like", "so", "basically", "actually", "right",
}

_FILLER_DENSITY_MAX = 0.12      # >12% filler tokens -> messy signal
_FILLER_DENSITY_SEVERE = 0.35   # >35% filler tokens -> second signal (very noisy)
_RUNON_SENTENCE_WORDS = 40      # any sentence longer than this -> signal
_PUNCT_WORDS_PER_MARK = 25      # < 1 sentence-ender per 25 words -> signal
_LOW_CONFIDENCE_LOGPROB = -0.9  # avg_logprob below this -> signal (if present)

_WORD_RE = re.compile(r"[^\W\d_]+", re.UNICODE)
_SENT_SPLIT_RE = re.compile(r"[.!?]+")


@dataclass
class MessScore:
    value: int = 0
    signals: list[str] = field(default_factory=list)

    @property
    def is_messy(self) -> bool:
        return self.value >= 2


def _words(text: str) -> list[str]:
    return _WORD_RE.findall(text.lower())


def _filler_density(words: list[str]) -> float:
    if not words:
        return 0.0
    hits = sum(1 for w in words if w in _FILLER)
    return hits / len(words)


def _max_sentence_words(text: str) -> int:
    sentences = [s for s in _SENT_SPLIT_RE.split(text) if s.strip()]
    return max((len(_words(s)) for s in sentences), default=0)


def _punct_sparse(text: str, n_words: int) -> bool:
    marks = len(_SENT_SPLIT_RE.findall(text))
    if n_words < _PUNCT_WORDS_PER_MARK:  # too short to judge
        return False
    return marks == 0 or (n_words / marks) > _PUNCT_WORDS_PER_MARK


def score(text: str, avg_logprob: float | None = None) -> MessScore:
    words = _words(text)
    result = MessScore()

    density = _filler_density(words)
    if density > _FILLER_DENSITY_MAX:
        result.value += 1
        result.signals.append(f"filler density {density:.0%}")
        if density > _FILLER_DENSITY_SEVERE:
            result.value += 1
            result.signals.append(f"severe filler density {density:.0%}")

    longest = _max_sentence_words(text)
    if longest > _RUNON_SENTENCE_WORDS:
        result.value += 1
        result.signals.append(f"run-on sentence ({longest} words)")

    if _punct_sparse(text, len(words)):
        result.value += 1
        result.signals.append("sparse punctuation")

    if avg_logprob is not None and avg_logprob < _LOW_CONFIDENCE_LOGPROB:
        result.value += 1
        result.signals.append(f"low Whisper confidence ({avg_logprob:.2f})")

    return result
