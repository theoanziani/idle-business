import importlib

TOOLS = {}
CONFIRM = {}


def tool(confirm=None):
    """Enregistre une fonction comme outil. `confirm` : phrase annoncée avant une action irréversible."""
    def deco(f):
        TOOLS[f.__name__] = f
        if confirm:
            CONFIRM[f.__name__] = confirm
        return f
    return deco


def load():
    for m in ("tools.system", "tools.web", "tools.meteo", "tools.claude", "tools.rappels", "tools.presse_papier",
              "tools.fichiers", "tools.agenda", "tools.notes", "memory"):
        importlib.import_module(f"jarvis.{m}")
