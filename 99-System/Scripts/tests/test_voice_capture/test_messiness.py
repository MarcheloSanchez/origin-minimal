from voice_capture.messiness import score


def test_clean_short_capture_is_not_messy():
    r = score("Buy milk and call the dentist tomorrow.")
    assert r.is_messy is False
    assert r.value < 2


def test_filler_heavy_czech_is_messy():
    text = "no takže prostě vlastně jsem jako chtěl no jakoby říct že prostě to takže"
    r = score(text)
    assert r.is_messy is True
    assert "filler density" in " ".join(r.signals)


def test_runon_no_punctuation_is_messy():
    text = " ".join(["word"] * 60)  # 60 words, zero punctuation
    r = score(text)
    assert r.is_messy is True


def test_low_confidence_adds_signal_only_when_present():
    clean = "Short clean note about the plan."
    assert score(clean, avg_logprob=None).value == score(clean).value
    assert score(clean, avg_logprob=-1.2).value > score(clean).value
