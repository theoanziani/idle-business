from types import SimpleNamespace as NS

from jarvis import memory, tools
from jarvis.brain import Brain
from jarvis.tools import TOOLS
from jarvis.tools.claude import find_project

tools.load()


def test_find_project_by_spoken_name(tmp_path):
    docs, desk = tmp_path / "Documents", tmp_path / "Desktop"
    for d in (docs / "Idle Business", docs / "chess-souverain", desk / "BotTrading", docs / ".cache"):
        d.mkdir(parents=True)
    dirs = [docs, desk]
    assert find_project("idle business", dirs).name == "Idle Business"
    assert find_project("Chess Souverain", dirs).name == "chess-souverain"
    assert find_project("bot trading", dirs).name == "BotTrading"
    assert find_project("le bot trading", dirs).name == "BotTrading"
    assert find_project("cache", dirs) is None
    assert find_project("projet inexistant", dirs) is None


def test_slow_tool_is_announced(tmp_path, monkeypatch):
    said = []
    monkeypatch.setitem(TOOLS, "demander_claude", lambda tache, projet="": "Tous les tests passent.")
    memory.init(tmp_path / "m.db")
    b = Brain({"ollama": {"host": "", "model": "x", "keep_alive": "1m"}}, lambda p: False, said.append)
    call = NS(function=NS(name="demander_claude", arguments={"tache": "lance les tests", "projet": "x"}))
    replies = iter([NS(content="", tool_calls=[call]), NS(content="Tout est vert, monsieur.", tool_calls=None)])
    b.client = NS(chat=lambda **kw: iter([NS(message=next(replies))]))
    assert b.ask("demande à Claude de lancer les tests") == "Tout est vert, monsieur."
    assert said and "Claude" in said[0]
