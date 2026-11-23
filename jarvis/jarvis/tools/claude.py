import shutil
import subprocess

from jarvis import config
from jarvis.tools import tool


@tool()
def demander_claude(tache: str, projet: str = "") -> str:
    """Délègue une tâche de code lourde à Claude Code (lire, modifier, tester un projet).
    À utiliser pour le développement ou quand l'utilisateur dit « demande à Claude ».

    Args:
      tache: la consigne complète pour Claude
      projet: nom du dossier du projet (vide si aucun)
    """
    root = config.resolve(config.load()["claude"]["projects_dir"])
    r = subprocess.run([shutil.which("claude") or "claude", "-p", tache], cwd=root / projet, capture_output=True,
                       text=True, encoding="utf-8", timeout=900)
    return (r.stdout or r.stderr).strip()[-3000:]
