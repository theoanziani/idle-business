import difflib
import re
import shutil
import subprocess
from pathlib import Path

from jarvis import config
from jarvis.tools import tool

VOICE = ("Tu es appelé par Jarvis, un assistant vocal. Termine par un résumé en français de trois phrases au plus, "
         "sans markdown ni liste ni code, car il sera lu à voix haute.")


def _cfg():
    return config.load().get("claude", {})


def find_cli(cfg=None):
    cfg = cfg if cfg is not None else _cfg()
    for c in (cfg.get("cli"), shutil.which("claude"), Path.home() / ".local/bin/claude.exe", Path.home() / ".local/bin/claude"):
        if c and Path(c).exists():
            return str(c)
    return None


def _norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower().replace("é", "e").replace("è", "e"))


def roots(cfg=None):
    cfg = cfg if cfg is not None else _cfg()
    dirs = cfg.get("projects_dirs") or [cfg.get("projects_dir", "~/Documents")]
    return [p for p in (config.resolve(d) for d in dirs) if p.is_dir()]


def find_project(name, dirs):
    """Dossier de projet le plus proche du nom dit à l'oral (« idle business » -> « Idle Business »)."""
    candidates = {}
    for root in dirs:
        for p in root.iterdir():
            if p.is_dir() and not p.name.startswith("."):
                candidates.setdefault(_norm(p.name), p)
    key = _norm(name)
    if not key:
        return None
    if key in candidates:
        return candidates[key]
    inside = [k for k in candidates if key in k or k in key]
    if len(inside) == 1:
        return candidates[inside[0]]
    close = difflib.get_close_matches(key, candidates, n=1, cutoff=0.6)
    return candidates[close[0]] if close else None


@tool()
def demander_claude(tache: str, projet: str = "") -> str:
    """Délègue une tâche de code lourde à Claude Code (lire, modifier, tester un projet).
    À utiliser pour le développement ou quand l'utilisateur dit « demande à Claude ».

    Args:
      tache: la consigne complète pour Claude
      projet: nom du dossier du projet, tel que l'utilisateur l'a dit (vide si aucun)
    """
    cfg = _cfg()
    cli = find_cli(cfg)
    if not cli:
        return "Claude Code est introuvable sur ce PC (installez-le ou réglez claude.cli dans config.yaml)."
    dirs = roots(cfg)
    if not dirs:
        return "Aucun dossier de projets trouvé (claude.projects_dirs dans config.yaml)."
    cwd = dirs[0]
    if projet:
        cwd = find_project(projet, dirs)
        if not cwd:
            noms = sorted(p.name for d in dirs for p in d.iterdir() if p.is_dir() and not p.name.startswith("."))
            return f"Projet « {projet} » introuvable. Projets disponibles : {', '.join(noms[:30])}."
    cmd = [cli, "-p", tache, "--permission-mode", cfg.get("permission_mode", "auto"), "--append-system-prompt", VOICE]
    try:
        r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace",
                           timeout=cfg.get("timeout_s", 900))
    except subprocess.TimeoutExpired:
        return f"Claude n'a pas terminé dans le délai imparti (projet {cwd.name})."
    out = (r.stdout or r.stderr).strip()
    return f"[projet : {cwd.name}] " + (out[-3000:] or f"Claude n'a rien renvoyé (code {r.returncode}).")
