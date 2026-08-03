from datetime import datetime

from voice_capture.note_builder import build_capture_note

NOW = datetime(2026, 5, 15, 14, 30, 5)


def test_contains_raw_capture_yaml():
    note = build_capture_note("hello world", "hello world", NOW, "base")
    assert note.startswith("---\n")
    assert 'title: "hello world"' in note
    assert "type: atomic" in note
    assert "status: 📥inbox" in note
    assert "created: 2026-05-15" in note
    assert "captured_via: voice" in note
    assert "transcription_model: whisper-base" in note


def test_body_in_content_section():
    note = build_capture_note("the actual spoken text", "the actual", NOW, "base")
    content_idx = note.index("## Content")
    context_idx = note.index("## Context")
    assert "the actual spoken text" in note[content_idx:context_idx]


def test_h1_matches_title():
    note = build_capture_note("x", "My Title", NOW, "small")
    assert "\n# My Title\n" in note


def test_has_processing_notes_checklist():
    note = build_capture_note("x", "x", NOW, "base")
    assert "## Processing Notes" in note
    assert "- [ ] Determine type (atomic/effort/source/moc)" in note


def test_source_marked_voice_capture():
    note = build_capture_note("x", "x", NOW, "base")
    assert "**Source**: voice capture" in note


def test_transcription_not_translated():
    cz = "toto je český přepis bez překladu"
    note = build_capture_note(cz, "toto je", NOW, "base")
    assert cz in note


def test_confidence_fields_written_when_present():
    from voice_capture.transcriber import TranscriptionResult

    conf = TranscriptionResult(text="x", avg_logprob=-0.42, no_speech_prob=0.08)
    note = build_capture_note("x", "T", NOW, "small", confidence=conf)
    assert "transcription_confidence: -0.42" in note
    assert "transcription_no_speech: 0.08" in note


def test_confidence_fields_absent_when_none():
    note = build_capture_note("x", "T", NOW, "small", confidence=None)
    assert "transcription_confidence" not in note
    assert "transcription_no_speech" not in note
