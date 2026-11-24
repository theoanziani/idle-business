"""Minuteurs et rappels : enregistrés dans SQLite (ils survivent à un redémarrage), annoncés à l'heure dite."""
import sqlite3
import threading
import time
from datetime import datetime, timedelta

from jarvis.tools import tool

_db = None
_lock = threading.Lock()
_thread = None
on_due = lambda rappel: print(f"[rappel] {rappel['message']}", flush=True)  # remplacé par Jarvis (voix, HUD)


def init(path, start=True):
    global _db, _thread
    path.parent.mkdir(parents=True, exist_ok=True)
    _db = sqlite3.connect(path, check_same_thread=False)
    _db.execute("CREATE TABLE IF NOT EXISTS rappels (id INTEGER PRIMARY KEY, quand TEXT, message TEXT, "
                "genre TEXT, fait INTEGER DEFAULT 0)")
    if start and _thread is None:
        _thread = threading.Thread(target=_loop, daemon=True, name="rappels")
        _thread.start()


def _add(quand, message, genre):
    with _lock, _db:
        return _db.execute("INSERT INTO rappels (quand, message, genre) VALUES (?, ?, ?)",
                           (quand.isoformat(timespec="seconds"), message, genre)).lastrowid


def pending():
    with _lock:
        rows = _db.execute("SELECT id, quand, message, genre FROM rappels WHERE fait = 0 ORDER BY quand").fetchall()
    return [{"id": i, "quand": datetime.fromisoformat(q), "message": m, "genre": g} for i, q, m, g in rows]


def due(now=None):
    """Rappels arrivés à échéance : marqués faits et renvoyés (y compris ceux manqués pendant que Jarvis était éteint)."""
    now = now or datetime.now()
    out = [r for r in pending() if r["quand"] <= now]
    if out:
        with _lock, _db:
            _db.executemany("UPDATE rappels SET fait = 1 WHERE id = ?", [(r["id"],) for r in out])
    for r in out:
        r["retard"] = now - r["quand"] > timedelta(minutes=2)
    return out


def _loop():
    while True:
        try:
            for r in due():
                threading.Thread(target=on_due, args=(r,), daemon=True).start()
        except Exception as e:
            print(f"[rappels] {e}", flush=True)
        time.sleep(1)


def _fmt(d):
    today = datetime.now().date()
    jour = "aujourd'hui" if d.date() == today else "demain" if d.date() == today + timedelta(days=1) else d.strftime("le %d/%m")
    return f"{jour} à {d:%H:%M}" + (f":{d:%S}" if d.second else "")


@tool()
def minuteur(minutes: float, libelle: str = "") -> str:
    """Lance un minuteur (compte à rebours). Jarvis prévient à la fin.

    Args:
      minutes: durée en minutes (ex. 0.5 pour 30 secondes, 90 pour une heure et demie)
      libelle: à quoi il sert (ex. « pâtes »), vide sinon
    """
    if minutes <= 0:
        return "Durée invalide."
    fin = datetime.now() + timedelta(minutes=minutes)
    n = _add(fin, libelle or "minuteur", "minuteur")
    return f"Minuteur n°{n} réglé, fin {_fmt(fin)}."


@tool()
def rappel(quand: str, message: str) -> str:
    """Programme un rappel à une date et heure précises. Jarvis le dira à voix haute le moment venu.

    Args:
      quand: date et heure au format AAAA-MM-JJ HH:MM (calculée à partir de la date actuelle)
      message: ce qu'il faut rappeler
    """
    try:
        d = datetime.fromisoformat(quand.strip().replace("T", " "))
    except ValueError:
        return "Date illisible : utilisez le format AAAA-MM-JJ HH:MM."
    if d <= datetime.now():
        return f"Cette heure est déjà passée ({d:%Y-%m-%d %H:%M})."
    n = _add(d, message, "rappel")
    return f"Rappel n°{n} programmé {_fmt(d)} : {message}."


@tool()
def rappels_en_cours() -> str:
    """Liste les minuteurs et rappels à venir."""
    rows = pending()
    if not rows:
        return "Aucun minuteur ni rappel en cours."
    return "\n".join(f"n°{r['id']} {r['genre']} {_fmt(r['quand'])} : {r['message']}" for r in rows)


@tool(confirm="annuler un rappel")
def annuler_rappel(numero: int) -> str:
    """Annule un minuteur ou un rappel à venir.

    Args:
      numero: son numéro (voir rappels_en_cours)
    """
    with _lock, _db:
        n = _db.execute("UPDATE rappels SET fait = 1 WHERE id = ? AND fait = 0", (numero,)).rowcount
    return f"Rappel n°{numero} annulé." if n else f"Aucun rappel n°{numero} en cours."
