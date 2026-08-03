from datetime import datetime

from voice_capture.cli import main, run

NOW = datetime(2026, 5, 15, 14, 30, 5)


def test_run_writes_note(tmp_path):
    inbox = tmp_path / "+Inbox"
    path = run(
        "buy milk and refactor the auth layer",
        model="base",
        inbox=inbox,
        now=NOW,
        dry_run=False,
    )
    assert path is not None
    text = path.read_text(encoding="utf-8")
    assert "buy milk and refactor the auth layer" in text
    assert "status: 📥inbox" in text
    assert path.parent == inbox


def test_run_dry_run_writes_nothing(tmp_path, capsys):
    inbox = tmp_path / "+Inbox"
    result = run("hello", model="base", inbox=inbox, now=NOW, dry_run=True)
    assert result is None
    assert not inbox.exists()
    assert "status: 📥inbox" in capsys.readouterr().out


def test_main_text_flag_end_to_end(tmp_path):
    rc = main(["--text", "a quick spoken idea", "--vault", str(tmp_path)])
    assert rc == 0
    notes = list((tmp_path / "+Inbox").glob("*.md"))
    assert len(notes) == 1
    assert "a quick spoken idea" in notes[0].read_text(encoding="utf-8")


def test_main_dry_run_no_write(tmp_path, capsys):
    rc = main(["--text", "x", "--vault", str(tmp_path), "--dry-run"])
    assert rc == 0
    assert not (tmp_path / "+Inbox").exists()


import numpy as np  # noqa: E402
import pytest  # noqa: E402

import voice_capture.recorder as rec  # noqa: E402
import voice_capture.transcriber as tr  # noqa: E402


def test_main_no_duration_uses_keypress(tmp_path, monkeypatch):
    seen = {}
    monkeypatch.setattr(
        rec,
        "record_until_keypress",
        lambda sr: seen.setdefault("sr", sr) or np.zeros((1, 1), dtype="int16"),
    )
    monkeypatch.setattr(
        rec,
        "record",
        lambda d, sr: pytest.fail("fixed-length record() must not run"),
    )
    monkeypatch.setattr(rec, "write_wav", lambda *a, **k: None)
    monkeypatch.setattr(tr, "transcribe", lambda *a, **k: "spoken idea")

    rc = main(["--vault", str(tmp_path)])
    assert rc == 0
    assert seen["sr"] == 16000
    notes = list((tmp_path / "+Inbox").glob("*.md"))
    assert len(notes) == 1
    assert "spoken idea" in notes[0].read_text(encoding="utf-8")


def test_wav_kept_on_write_failure(tmp_path):
    from voice_capture import cli

    wav = tmp_path / "rec.wav"
    wav.write_bytes(b"fake")

    # note write raises -> wav must survive for --retranscribe
    assert cli.cleanup_recording(wav, note_written=None) is False
    assert wav.exists()
    assert cli.cleanup_recording(wav, note_written=tmp_path / "note.md") is True
    assert not wav.exists()


def test_main_with_duration_uses_fixed_length(tmp_path, monkeypatch):
    seen = {}
    monkeypatch.setattr(
        rec,
        "record",
        lambda d, sr: seen.setdefault("d", d) or np.zeros((1, 1), dtype="int16"),
    )
    monkeypatch.setattr(
        rec,
        "record_until_keypress",
        lambda sr: pytest.fail("keypress mode must not run when --duration given"),
    )
    monkeypatch.setattr(rec, "write_wav", lambda *a, **k: None)
    monkeypatch.setattr(tr, "transcribe", lambda *a, **k: "timed idea")

    rc = main(["--duration", "5", "--vault", str(tmp_path)])
    assert rc == 0
    assert seen["d"] == 5
    notes = list((tmp_path / "+Inbox").glob("*.md"))
    assert "timed idea" in notes[0].read_text(encoding="utf-8")
