from pathlib import Path

from voice_capture import config


def test_vault_root_env_override(monkeypatch):
    monkeypatch.setenv("ORIGIN_VAULT", "/tmp/fake-vault")
    assert config.vault_root() == Path("/tmp/fake-vault")


def test_inbox_dir_appends_inbox(monkeypatch):
    monkeypatch.setenv("ORIGIN_VAULT", "/tmp/fake-vault")
    assert config.inbox_dir() == Path("/tmp/fake-vault") / "+Inbox"


def test_default_constants():
    assert config.DEFAULT_MODEL == "small"
    assert config.DEFAULT_DURATION == 120
    assert config.DEFAULT_SAMPLERATE == 16000


def test_vault_root_without_env_points_at_repo(monkeypatch):
    monkeypatch.delenv("ORIGIN_VAULT", raising=False)
    root = config.vault_root()
    assert root.name == "Origin_DEV_v2.0"


def test_recordings_dir_is_under_voice_capture_package():
    d = config.recordings_dir()
    assert d.name == "_recordings"
    assert d.parent.name == "voice_capture"
