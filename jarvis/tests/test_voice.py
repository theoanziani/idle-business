from types import SimpleNamespace as NS

import numpy as np

from jarvis import memory
from jarvis.brain import Brain
from jarvis.voice import SentenceStream, Speaker, split_sentences


def test_split_sentences():
    assert split_sentences("Bien, monsieur. Il est 9 h 30 ! Autre chose ?") == ["Bien, monsieur.", "Il est 9 h 30 !", "Autre chose ?"]
    assert split_sentences("**Gras** et 8.5 °C.") == ["Gras et 8.5 °C."]
    assert split_sentences(" ... ") == []


def test_sentence_stream_emits_as_soon_as_complete():
    out = []
    s = SentenceStream(out.append)
    for piece in ["Il est ", "9 h 30, mon", "sieur. Le ciel", " est couvert", "."]:
        s.feed(piece)
    assert out == ["Il est 9 h 30, monsieur."]
    s.close()
    assert out == ["Il est 9 h 30, monsieur.", "Le ciel est couvert."]


def make_speaker(tmp_path, edge_result):
    sp = Speaker({"edge": "fr-FR-RemyMultilingualNeural", "model": "x"}, tmp_path / "cache")
    sp._edge = lambda text: edge_result
    sp._decode = lambda mp3: (np.frombuffer(mp3, np.int16), 24000)
    sp._synth_local = lambda text: (np.zeros(10, np.int16), 22050)
    return sp


def test_speaker_caches_online_voice(tmp_path):
    sp = make_speaker(tmp_path, b"\x01\x00\x02\x00")
    assert sp.synth("Bonjour.")[1] == 24000 and sp.stats["edge"] == 1
    sp._edge = lambda text: (_ for _ in ()).throw(AssertionError("ne doit plus appeler le réseau"))
    assert sp.synth("Bonjour.")[1] == 24000 and sp.stats["cache"] == 1


def test_speaker_falls_back_to_local_voice(tmp_path):
    sp = make_speaker(tmp_path, None)
    assert sp.synth("Bonjour.")[1] == 22050 and sp.stats["piper"] == 1


def test_brain_streams_sentences(tmp_path):
    memory.init(tmp_path / "m.db")
    b = Brain({"ollama": {"host": "", "model": "x", "keep_alive": "1m"}}, lambda p: False)
    pieces = ["Il est 9 h", " 30, monsieur. Le", " ciel est couvert."]
    b.client = NS(chat=lambda **kw: iter(NS(message=NS(content=p, tool_calls=None)) for p in pieces))
    heard = []
    assert b.ask("quelle heure ?", on_text=heard.append) == "Il est 9 h 30, monsieur. Le ciel est couvert."
    assert heard == ["Il est 9 h 30, monsieur.", "Le ciel est couvert."]
