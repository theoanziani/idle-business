import re

import ollama

from jarvis import memory
from jarvis.tools import CONFIRM, TOOLS

PERSONA = """Tu es Jarvis, le majordome numérique britannique de l'utilisateur. Tu parles français, tu le vouvoies et l'appelles « monsieur ».
Ton : poli, flegmatique, pince-sans-rire. Tes réponses sont lues à voix haute : phrases courtes, pas de markdown, pas de listes, pas d'emoji.
Utilise les outils pour agir. Pour une tâche de code lourde, délègue à demander_claude. Retiens avec souviens_toi ce qui mérite d'être retenu.
Ce que tu sais de l'utilisateur :
{facts}"""

YES = {"oui", "confirme", "confirmé", "vas-y", "affirmatif", "ok", "d'accord", "go"}


def strip_think(text):
    """Retire le raisonnement des modèles « thinking » (Qwen3 2507 ignore think=False) : seule la réponse est dite."""
    text = text or ""
    if "</think>" in text:
        text = text.rsplit("</think>", 1)[1]
    return re.sub(r"<think>.*", "", text, flags=re.S).strip()


def is_yes(text):
    words = set(re.findall(r"[\w'-]+", text.lower()))
    return bool(words & YES) and "non" not in words


class Brain:
    def __init__(self, cfg, confirm):
        self.cfg, self.confirm = cfg["ollama"], confirm
        self.client = ollama.Client(host=self.cfg["host"])
        self.history = []

    def warmup(self):
        self.client.generate(model=self.cfg["model"], prompt="", keep_alive=self.cfg["keep_alive"])

    def ask(self, text):
        self.history = self.history[-20:] + [{"role": "user", "content": text}]
        system = {"role": "system", "content": PERSONA.format(facts="\n".join(memory.facts()) or "rien pour l'instant")}
        for _ in range(6):
            msg = self.client.chat(model=self.cfg["model"], messages=[system, *self.history], tools=list(TOOLS.values()),
                                   think=False, keep_alive=self.cfg["keep_alive"]).message
            self.history.append(msg)
            msg.content = strip_think(msg.content)
            if not msg.tool_calls:
                return msg.content
            for call in msg.tool_calls:
                f = call.function
                self.history.append({"role": "tool", "tool_name": f.name, "content": self.run(f.name, f.arguments)})
        return "Je crains de tourner en rond, monsieur."

    def run(self, name, args):
        if name not in TOOLS:
            return f"Outil inconnu : {name}"
        if name in CONFIRM:
            detail = " : " + ", ".join(map(str, args.values())) if args else ""
            if not self.confirm(CONFIRM[name] + detail):
                return "Action annulée par l'utilisateur."
        try:
            return str(TOOLS[name](**args))
        except Exception as e:
            return f"Erreur : {e}"
