from types import SimpleNamespace as NS

from jarvis import memory, tools
from jarvis.brain import Brain, is_yes
from jarvis.tools import CONFIRM, TOOLS

tools.load()


def test_is_yes():
    assert is_yes("Oui, vas-y")
    assert is_yes("je confirme")
    assert not is_yes("non")
    assert not is_yes("non, oui enfin non")
    assert not is_yes("")


def test_strip_think():
    from jarvis.brain import strip_think
    assert strip_think("Okay, let me see...\n</think>\n\nIl est 9 h, monsieur.") == "Il est 9 h, monsieur."
    assert strip_think("<think>hmm</think>Bien.") == "Bien."
    assert strip_think("<think>coupé en plein raisonnement") == ""
    assert strip_think(None) == ""


def test_irreversible_tools_need_confirmation():
    assert {"eteindre", "powershell", "oublie"} <= CONFIRM.keys()
    assert "date_heure" not in CONFIRM


def test_memory(tmp_path):
    memory.init(tmp_path / "m.db")
    memory.souviens_toi("préfère le café noir")
    memory.souviens_toi("projet idle-business")
    assert memory.facts() == ["préfère le café noir", "projet idle-business"]
    assert memory.oublie("café") == "1 souvenir(s) effacé(s)"
    memory.init(tmp_path / "m.db")
    assert memory.facts() == ["projet idle-business"]


def _call(name, **args):
    return NS(function=NS(name=name, arguments=args))


class FakeClient:
    def __init__(self, replies):
        self.replies = iter(replies)

    def chat(self, **kw):
        m = next(self.replies)
        return iter([NS(message=m)]) if kw.get("stream") else NS(message=m)


def make_brain(tmp_path, replies, answer):
    memory.init(tmp_path / "m.db")
    b = Brain({"ollama": {"host": "", "model": "x", "keep_alive": "1m"}}, lambda p: answer)
    b.client = FakeClient(replies)
    return b


def test_refused_confirmation_blocks_action(tmp_path, monkeypatch):
    ran = []
    monkeypatch.setitem(TOOLS, "eteindre", lambda: ran.append(1))
    b = make_brain(tmp_path, [NS(content="", tool_calls=[_call("eteindre")]), NS(content="Bien, monsieur.", tool_calls=None)], False)
    assert b.ask("éteins le PC") == "Bien, monsieur."
    assert not ran
    assert b.history[-2]["content"] == "Action annulée par l'utilisateur."


def test_safe_tool_runs_without_confirmation(tmp_path):
    b = make_brain(tmp_path, [NS(content="", tool_calls=[_call("souviens_toi", fait="aime le thé")]), NS(content="Noté.", tool_calls=None)], False)
    assert b.ask("retiens que j'aime le thé") == "Noté."
    assert memory.facts() == ["aime le thé"]


def test_explain_error():
    from jarvis.brain import explain_error
    assert "mémoire" in explain_error(Exception("llama-server reported out-of-memory during startup"))
    assert "Ollama" in explain_error(Exception("Failed to connect to Ollama"))


def test_relevant_facts():
    from jarvis.brain import relevant_facts
    facts = ["Je préfère le café noir", "Mon projet s'appelle idle business"]
    assert relevant_facts(facts, "Quelle heure est-il ?") == []
    assert relevant_facts(facts, "Fais-moi un café") == ["Je préfère le café noir"]
    assert relevant_facts(facts, "Que sais-tu de moi ?") == facts


def test_sleep_phrases():
    from jarvis.__main__ import is_sleep
    for t in ("Mets-toi en veille.", "Merci, c'est tout.", "Bonne nuit Jarvis", "Tu peux disposer", "Au revoir"):
        assert is_sleep(t), t
    for t in ("C'est tout à fait ça.", "Quelle heure est-il ?", "Je dors mal en ce moment"):
        assert not is_sleep(t), t


def test_weather_context(monkeypatch):
    from jarvis.brain import weather_context
    asked = []
    monkeypatch.setitem(TOOLS, "meteo", lambda ville="": asked.append(ville) or "10 °C, couvert")
    assert "10 °C" in weather_context("Quel temps fait-il cet après-midi ?") and asked[-1] == ""
    weather_context("Est-ce qu'il va pleuvoir à Toulouse demain ?")
    assert asked[-1] == "Toulouse"
    weather_context("Quelle est la météo à Saint-Jean-de-Luz ?")
    assert asked[-1] == "Saint-Jean-de-Luz"
    assert weather_context("Quelle heure est-il ?") == ""


def test_action_aliases_and_elision():
    from jarvis.__main__ import elide
    from jarvis.tools.system import MUSIC, VOLUME, _alias
    assert _alias("pause", MUSIC) == "lecture_pause" and _alias("piste suivante", MUSIC) == "suivant"
    assert _alias("augmenter", VOLUME) == "monter" and _alias("couper le son", VOLUME) == "muet"
    assert _alias("danse", MUSIC) is None
    assert elide("éteindre l'ordinateur") == "d'éteindre l'ordinateur" and elide("effacer") == "d'effacer"
    assert elide("supprimer") == "de supprimer"


def test_emojis_removed():
    from jarvis.brain import strip_think
    from jarvis.voice import clean
    assert strip_think("Salut ! 😊 Ça roule 🚀") == "Salut ! Ça roule"
    assert clean("Bien reçu 👍") == "Bien reçu"
