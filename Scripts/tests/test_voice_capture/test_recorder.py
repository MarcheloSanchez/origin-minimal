import numpy as np
import pytest

scipy_wavfile = pytest.importorskip("scipy.io.wavfile")

from voice_capture.recorder import write_wav  # noqa: E402


def test_write_wav_roundtrip(tmp_path):
    samplerate = 16000
    data = (np.random.rand(16000) * 1000).astype(np.int16)
    out = tmp_path / "rec.wav"
    write_wav(out, data, samplerate)
    assert out.exists()
    sr, read_back = scipy_wavfile.read(str(out))
    assert sr == samplerate
    assert np.array_equal(read_back, data)


from voice_capture.recorder import _concat_blocks  # noqa: E402


def test_concat_blocks_empty_returns_empty_int16():
    out = _concat_blocks([])
    assert out.shape == (0, 1)
    assert out.dtype == np.int16


def test_concat_blocks_preserves_order():
    a = np.array([[1], [2]], dtype="int16")
    b = np.array([[3]], dtype="int16")
    out = _concat_blocks([a, b])
    assert np.array_equal(out, np.array([[1], [2], [3]], dtype="int16"))
    assert out.dtype == np.int16


import sys  # noqa: E402
import types  # noqa: E402


def test_record_until_keypress_collects_then_stops(monkeypatch):
    captured = {}

    class FakeStream:
        def __init__(self, **kw):
            captured["kw"] = kw
            captured["cb"] = kw["callback"]
            self.entered = False
            self.exited = False

        def __enter__(self):
            self.entered = True
            captured["stream"] = self
            return self

        def __exit__(self, *a):
            self.exited = True

    fake_sd = types.ModuleType("sounddevice")
    fake_sd.InputStream = FakeStream
    monkeypatch.setitem(sys.modules, "sounddevice", fake_sd)

    from voice_capture.recorder import record_until_keypress

    def wait():
        cb = captured["cb"]
        cb(np.array([[1], [2]], dtype="int16"), 2, None, None)
        cb(np.array([[3]], dtype="int16"), 1, None, None)

    out = record_until_keypress(16000, wait_for_stop=wait)

    assert captured["stream"].entered is True
    assert captured["stream"].exited is True
    assert captured["kw"]["samplerate"] == 16000
    assert captured["kw"]["channels"] == 1
    assert captured["kw"]["dtype"] == "int16"
    assert np.array_equal(out, np.array([[1], [2], [3]], dtype="int16"))
