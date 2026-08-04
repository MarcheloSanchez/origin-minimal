from voice_capture.note_writer import write_capture


def test_writes_file_and_returns_path(tmp_path):
    inbox = tmp_path / "+Inbox"
    p = write_capture("CONTENT", "My Note", inbox)
    assert p == inbox / "My Note.md"
    assert p.read_text(encoding="utf-8") == "CONTENT"


def test_creates_inbox_if_missing(tmp_path):
    inbox = tmp_path / "+Inbox"
    assert not inbox.exists()
    write_capture("x", "T", inbox)
    assert inbox.is_dir()


def test_collision_appends_counter(tmp_path):
    inbox = tmp_path / "+Inbox"
    p1 = write_capture("a", "Same", inbox)
    p2 = write_capture("b", "Same", inbox)
    p3 = write_capture("c", "Same", inbox)
    assert p1.name == "Same.md"
    assert p2.name == "Same 2.md"
    assert p3.name == "Same 3.md"


def test_long_title_truncated_to_60(tmp_path):
    inbox = tmp_path / "+Inbox"
    p = write_capture("x", "T" * 200, inbox)
    assert len(p.stem) <= 60


def test_blank_title_uses_fallback_stem(tmp_path):
    inbox = tmp_path / "+Inbox"
    p = write_capture("x", "   ", inbox)
    assert p.stem == "Voice Note"
