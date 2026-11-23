import sqlite3

from jarvis.tools import tool

_db = None


def init(path):
    global _db
    path.parent.mkdir(parents=True, exist_ok=True)
    _db = sqlite3.connect(path, check_same_thread=False)
    _db.execute("CREATE TABLE IF NOT EXISTS faits (id INTEGER PRIMARY KEY, texte TEXT, cree TEXT DEFAULT CURRENT_TIMESTAMP)")


def facts():
    return [t for (t,) in _db.execute("SELECT texte FROM faits ORDER BY id")]


@tool()
def souviens_toi(fait: str) -> str:
    """Mémorise durablement un fait sur l'utilisateur ou ses préférences.

    Args:
      fait: le fait à retenir, formulé en une phrase
    """
    with _db:
        _db.execute("INSERT INTO faits (texte) VALUES (?)", (fait,))
    return "Mémorisé"


@tool(confirm="effacer des souvenirs")
def oublie(sujet: str) -> str:
    """Efface les souvenirs contenant un mot ou une expression.

    Args:
      sujet: mot ou expression à rechercher dans les souvenirs
    """
    with _db:
        n = _db.execute("DELETE FROM faits WHERE texte LIKE ?", (f"%{sujet}%",)).rowcount
    return f"{n} souvenir(s) effacé(s)"
