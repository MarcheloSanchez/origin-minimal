from pathlib import Path

from voice_capture.transcriber import _pick_cs_or_en, transcribe


class FakeModel:
    def __init__(self):
        self.calls = []

    def transcribe(self, path, language=None, fp16=False):
        self.calls.append({"path": path, "language": language, "fp16": fp16})
        return {"text": "  transcribed text  "}


# Detector stub for the language=None path (keeps tests torch/whisper-free).
def fake_detector(_model, _path):
    return "cs"


def test_returns_stripped_text():
    model = FakeModel()
    out = transcribe(
        Path("rec.wav"),
        "base",
        None,
        loader=lambda name: model,
        detector=fake_detector,
    )
    assert out.text == "transcribed text"


def test_passes_language_and_fp16_false():
    model = FakeModel()
    transcribe(Path("rec.wav"), "small", "cs", loader=lambda name: model)
    assert model.calls[0]["language"] == "cs"
    assert model.calls[0]["fp16"] is False
    assert model.calls[0]["path"] == "rec.wav"


def test_loader_receives_model_name():
    seen = {}

    def loader(name):
        seen["name"] = name
        return FakeModel()

    transcribe(
        Path("rec.wav"),
        "medium",
        None,
        loader=loader,
        detector=fake_detector,
    )
    assert seen["name"] == "medium"


def test_missing_text_key_returns_empty():
    class NoText:
        def transcribe(self, *a, **k):
            return {}

    out = transcribe(
        Path("x.wav"),
        "base",
        None,
        loader=lambda n: NoText(),
        detector=fake_detector,
    )
    assert out.text == ""


def test_explicit_language_skips_detector():
    model = FakeModel()

    def boom(_m, _p):  # must never be called when language is forced
        raise AssertionError("detector should be skipped when language given")

    transcribe(
        Path("rec.wav"),
        "small",
        "en",
        loader=lambda name: model,
        detector=boom,
    )
    assert model.calls[0]["language"] == "en"


def test_detector_result_is_passed_through():
    model = FakeModel()
    transcribe(
        Path("rec.wav"),
        "small",
        None,
        loader=lambda name: model,
        detector=lambda _m, _p: "en",
    )
    assert model.calls[0]["language"] == "en"


def test_pick_cs_or_en_prefers_higher_probability():
    assert _pick_cs_or_en({"cs": 0.9, "en": 0.1, "pl": 0.8}) == "cs"
    assert _pick_cs_or_en({"cs": 0.2, "en": 0.7, "pl": 0.95}) == "en"


def test_pick_cs_or_en_ties_go_to_czech():
    assert _pick_cs_or_en({"cs": 0.4, "en": 0.4}) == "cs"


def test_pick_cs_or_en_handles_missing_keys():
    assert _pick_cs_or_en({"pl": 0.99}) == "cs"  # both default 0.0 -> tie -> cs
    assert _pick_cs_or_en({"en": 0.3}) == "en"


def test_transcribe_returns_aggregated_confidence():
    class SegmentedModel:
        def transcribe(self, *a, **k):
            return {
                "text": "  ahoj svete  ",
                "segments": [
                    {"avg_logprob": -0.2, "no_speech_prob": 0.05},
                    {"avg_logprob": -0.6, "no_speech_prob": 0.30},
                ],
            }

    result = transcribe(
        Path("x.wav"),
        "base",
        None,
        loader=lambda name: SegmentedModel(),
        detector=fake_detector,
    )
    assert result.text == "ahoj svete"
    assert result.avg_logprob == -0.4  # mean of segment logprobs
    assert result.no_speech_prob == 0.30  # worst (max) no-speech


def test_transcribe_confidence_none_when_no_segments():
    out = transcribe(
        Path("rec.wav"),
        "base",
        None,
        loader=lambda name: FakeModel(),
        detector=fake_detector,
    )
    assert out.avg_logprob is None
    assert out.no_speech_prob is None
