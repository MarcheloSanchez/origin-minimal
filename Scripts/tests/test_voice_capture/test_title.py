from datetime import datetime

from voice_capture.title import derive_title

NOW = datetime(2026, 5, 15, 14, 30, 5)


def test_first_six_words():
    t = derive_title("refactor the auth module to use oauth tokens please", NOW)
    assert t == "refactor the auth module to use"


def test_empty_falls_back_to_timestamp():
    assert derive_title("", NOW) == "Voice Note 2026-05-15 14-30-05"


def test_whitespace_only_falls_back():
    assert derive_title("   \n\t  ", NOW) == "Voice Note 2026-05-15 14-30-05"


def test_strips_path_invalid_chars():
    t = derive_title('idea: build a/b test? "now"', NOW)
    assert "/" not in t and ":" not in t and "?" not in t and '"' not in t


def test_czech_preserved_not_translated():
    t = derive_title("nápad na refaktoring autentizace pomocí tokenů dnes", NOW)
    assert t == "nápad na refaktoring autentizace pomocí tokenů"


def test_long_single_token_truncated_to_50():
    t = derive_title("x" * 200, NOW)
    assert len(t) <= 50
