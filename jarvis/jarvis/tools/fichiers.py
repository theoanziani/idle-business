"""Recherche de fichiers dans les dossiers de l'utilisateur, par mots du nom (insensible à la casse et aux accents)."""
import os
import time
import unicodedata
from datetime import datetime
from pathlib import Path

from jarvis.tools import tool

SKIP = {"node_modules", ".git", ".venv", "venv", "__pycache__", "AppData", "site-packages", "$RECYCLE.BIN"}
ROOTS = ["Desktop", "Documents", "Downloads", "Pictures", "Music", "Videos", "OneDrive"]


def _norm(s):
    s = unicodedata.normalize("NFKD", s.lower())
    return "".join(c for c in s if not unicodedata.combining(c))


def search(query, roots, limit=8, budget_s=4.0):
    """Fichiers et dossiers dont le nom contient tous les mots de `query`, les plus récents d'abord."""
    words = [w for w in _norm(query).replace("_", " ").replace("-", " ").replace(".", " ").split() if w]
    if not words:
        return [], False
    hits, t0, complete = [], time.time(), True
    for root in roots:
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP and not d.startswith(".")]
            for name in dirnames + filenames:
                n = _norm(name)
                if all(w in n for w in words):
                    p = Path(dirpath, name)
                    try:
                        hits.append((p.stat().st_mtime, p))
                    except OSError:
                        pass
            if time.time() - t0 > budget_s:
                complete = False
                break
        if not complete:
            break
    hits.sort(reverse=True)
    return [p for _, p in hits[:limit]], complete


@tool()
def chercher_fichiers(nom: str) -> str:
    """Cherche des fichiers ou dossiers de l'utilisateur (Bureau, Documents, Téléchargements, Images, Musique,
    Vidéos, OneDrive) dont le nom contient ces mots. Pour en ouvrir un ensuite, utiliser l'outil ouvrir avec son chemin.

    Args:
      nom: mots du nom à chercher (ex. « facture edf », « cahier des charges »)
    """
    home = Path.home()
    found, complete = search(nom, [home / r for r in ROOTS if (home / r).is_dir()])
    if not found:
        return f"Aucun fichier contenant « {nom} »." + ("" if complete else " (recherche interrompue : trop de fichiers)")
    lines = [f"{p.name} — {p.parent} — modifié le {datetime.fromtimestamp(p.stat().st_mtime):%d/%m/%Y}" for p in found]
    return "\n".join(lines) + ("" if complete else "\n(recherche partielle : trop de fichiers)")
