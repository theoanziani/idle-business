import ctypes
import re
import subprocess
from datetime import datetime

from jarvis.tools import tool

JOURS = "lundi mardi mercredi jeudi vendredi samedi dimanche".split()
MOIS = "janvier février mars avril mai juin juillet août septembre octobre novembre décembre".split()
KEYS = {"monter": 0xAF, "baisser": 0xAE, "muet": 0xAD,
        "lecture_pause": 0xB3, "suivant": 0xB0, "precedent": 0xB1}


# Le modèle n'emploie pas toujours le mot exact : « pause », « play », « suivante », « augmenter »…
MUSIC = {"lecture_pause": ("pause", "lecture", "play", "reprend", "joue", "stop", "arret", "arrêt", "toggle"),
         "suivant": ("suiv", "next", "prochain", "passe", "skip"),
         "precedent": ("préc", "prec", "previous", "prev", "retour", "avant")}
VOLUME = {"monter": ("mont", "augment", "plus", "fort", "hausse", "up"),
          "baisser": ("baiss", "dimin", "moins", "bas", "down"),
          "muet": ("muet", "mute", "coup", "silence", "sourdine")}


def _alias(action, table):
    a = (action or "").lower().strip()
    if a in table:
        return a
    said = re.findall(r"\w+", a)  # début de mot : « couper » ne doit pas matcher « up »
    return next((k for k, syns in table.items() if any(w.startswith(s) for w in said for s in syns)), None)


def _press(key, times=1):
    vk = KEYS[key]
    for _ in range(times):
        ctypes.windll.user32.keybd_event(vk, 0, 0, 0)
        ctypes.windll.user32.keybd_event(vk, 0, 2, 0)


def _run(cmd, timeout=60):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    return (r.stdout + r.stderr).strip()[-2000:] or "OK"


@tool()
def date_heure() -> str:
    """Donne la date et l'heure actuelles."""
    n = datetime.now()
    return f"{JOURS[n.weekday()]} {n.day} {MOIS[n.month - 1]} {n.year}, {n:%H:%M}"


@tool()
def ouvrir(cible: str) -> str:
    """Ouvre une application, un fichier, un dossier ou une adresse web.

    Args:
      cible: nom de l'application (ex. notepad, chrome), chemin ou URL
    """
    subprocess.Popen(["cmd", "/c", "start", "", cible])
    return f"{cible} ouvert"


@tool()
def musique(action: str) -> str:
    """Contrôle le lecteur de musique en cours (Apple Music, etc.).

    Args:
      action: lecture_pause, suivant ou precedent
    """
    key = _alias(action, MUSIC)
    if not key:
        return f"Action inconnue « {action} » : lecture_pause, suivant ou precedent."
    _press(key)
    return "OK"


@tool()
def volume(action: str, pas: int = 5) -> str:
    """Règle le volume du PC.

    Args:
      action: monter, baisser ou muet
      pas: nombre de crans (1 cran = 2 %)
    """
    key = _alias(action, VOLUME)
    if not key:
        return f"Action inconnue « {action} » : monter, baisser ou muet."
    _press(key, 1 if key == "muet" else pas)
    return "OK"


@tool()
def verrouiller() -> str:
    """Verrouille la session Windows."""
    ctypes.windll.user32.LockWorkStation()
    return "OK"


@tool(confirm="éteindre l'ordinateur")
def eteindre() -> str:
    """Éteint l'ordinateur."""
    return _run(["shutdown", "/s", "/t", "5"])


@tool(confirm="exécuter une commande PowerShell")
def powershell(commande: str) -> str:
    """Exécute une commande PowerShell sur le PC et renvoie sa sortie. Pour tout ce que les autres outils ne couvrent pas.

    Args:
      commande: la commande PowerShell
    """
    return _run(["powershell", "-NoProfile", "-Command", commande], timeout=120)
