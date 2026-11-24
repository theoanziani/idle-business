"""Notes : un simple fichier Markdown dans les Documents, lisible et modifiable à la main."""
from datetime import datetime
from pathlib import Path

from jarvis import config
from jarvis.tools import tool


def path(cfg=None):
    cfg = cfg if cfg is not None else config.load()
    return config.resolve((cfg.get("notes") or {}).get("fichier", "~/Documents/Notes Jarvis.md"))


@tool()
def noter(texte: str) -> str:
    """Ajoute une note (idée, liste de courses, chose à ne pas oublier) dans le carnet de notes.

    Args:
      texte: le contenu de la note
    """
    p = path()
    p.parent.mkdir(parents=True, exist_ok=True)
    new = not p.exists()
    with open(p, "a", encoding="utf-8") as f:
        if new:
            f.write("# Notes Jarvis\n\n")
        f.write(f"- {datetime.now():%d/%m/%Y %H:%M} — {texte.strip()}\n")
    return "Noté."


@tool()
def lire_notes(recherche: str = "") -> str:
    """Relit les notes du carnet (les plus récentes, ou celles qui contiennent un mot).

    Args:
      recherche: mot à chercher dans les notes (vide pour les dernières)
    """
    p = path()
    if not p.exists():
        return "Le carnet de notes est vide."
    notes = [l[2:].strip() for l in p.read_text(encoding="utf-8").splitlines() if l.startswith("- ")]
    if recherche:
        notes = [n for n in notes if recherche.lower() in n.lower()]
    if not notes:
        return f"Aucune note avec « {recherche} »." if recherche else "Le carnet de notes est vide."
    return "\n".join(notes[-15:])
