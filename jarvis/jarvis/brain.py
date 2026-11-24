import re
from datetime import datetime

import ollama

from jarvis import memory
from jarvis.tools import CONFIRM, TOOLS

PERSONA = """Tu es Jarvis, l'IA personnelle de l'utilisateur, comme le J.A.R.V.I.S. de Tony Stark dans les films Iron Man. Tu parles français.
Ton : naturel, direct et efficace, avec un humour sec et subtil, comme un partenaire de confiance plutôt qu'un domestique.
Utilise les outils pour agir. Pour une tâche de code lourde, délègue à demander_claude. Retiens avec souviens_toi ce qui mérite d'être retenu.
Nous sommes le {now}. Sers-t'en pour calculer les dates des rappels (« dans 20 minutes », « demain à 9 h »).
Souvenirs utiles pour cette demande :
{facts}

RÈGLES (toujours) :
1. Vouvoie l'utilisateur, même s'il te tutoie : « vous », jamais « tu ». « Monsieur » de temps en temps seulement.
2. N'invente rien : ni agenda, ni appareils, ni météo, ni fichiers. Seuls comptent les souvenirs ci-dessus et les résultats d'outils. Si tu ne sais pas, dis-le ou propose de chercher.
3. Une à trois phrases courtes, l'information utile d'abord. Pas de markdown, de listes ni d'emoji : c'est lu à voix haute."""

# Outils lents : Jarvis prévient avant de se lancer, pour ne pas laisser un long silence.
ANNOUNCE = {"demander_claude": "Je confie cela à Claude, monsieur. Cela peut prendre quelques minutes.",
            "recherche_web": "Je consulte Internet, monsieur."}

YES = {"oui", "confirme", "confirmé", "vas-y", "affirmatif", "ok", "d'accord", "go"}


def strip_think(text):
    """Retire le raisonnement des modèles « thinking » (Qwen3 2507 ignore think=False) : seule la réponse est dite."""
    text = text or ""
    if "</think>" in text:
        text = text.rsplit("</think>", 1)[1]
    return re.sub(r"<think>.*", "", text, flags=re.S).strip()


STOP = set("avec dans pour quoi quel quelle quels quelles elle elles nous vous sont être avoir fait faire plus moins très "
           "comme mais donc alors cette cela ceci tout tous toute toutes bien aussi encore même".split())
ALL_FACTS = re.compile(r"(que sais[- ]tu|ce que tu sais|qu'est-ce que tu sais|souviens|rappelle|mémoire|oublie)", re.I)


def _words(text):
    return {w[:6] for w in re.findall(r"[a-zàâçéèêëîïôûùüÿœ]{4,}", text.lower()) if w not in STOP}


def relevant_facts(facts, question):
    """Souvenirs utiles à la question (mots en commun), ou tous si l'on parle de la mémoire elle-même.
    Un petit modèle qui voit toujours les mêmes souvenirs finit par les citer à tout propos."""
    if ALL_FACTS.search(question):
        return facts
    q = _words(question)
    return [f for f in facts if _words(f) & q]


def explain_error(e):
    """Message clair quand le cerveau (Ollama) ne répond pas."""
    s = str(e).lower()
    if "out-of-memory" in s or "allocate" in s or "out of memory" in s:
        return ("Pas assez de mémoire pour charger mon modèle : un jeu ou une appli gourmande occupe le PC. "
                "Réessayez quand elle sera fermée.")
    if "connect" in s or "refused" in s:
        return "Je n'arrive pas à joindre Ollama. Vérifiez qu'il est lancé, son icône doit être dans la zone de notification."
    return f"Mon cerveau a un problème : {e}"


def is_yes(text):
    words = set(re.findall(r"[\w'-]+", text.lower()))
    return bool(words & YES) and "non" not in words


class Brain:
    def __init__(self, cfg, confirm, announce=None):
        self.cfg, self.confirm = cfg["ollama"], confirm
        self.announce = announce or (lambda text: None)
        self.client = ollama.Client(host=self.cfg["host"])
        self.history = []

    @property
    def options(self):
        # Contexte réduit : moins de VRAM/RAM pour le cache du modèle, génération plus rapide.
        return {"num_ctx": self.cfg.get("num_ctx", 3072)}

    def warmup(self):
        self.client.generate(model=self.cfg["model"], prompt="", keep_alive=self.cfg["keep_alive"], options=self.options)

    def _trim(self):
        """Garde les derniers échanges, en commençant toujours par un message de l'utilisateur."""
        h = self.history[-self.cfg.get("historique", 12):]
        while h and h[0].get("role") != "user":
            h = h[1:]
        self.history = h

    def _chat(self, messages, on_text):
        """Un tour du modèle en streaming. Les phrases sont transmises à `on_text` dès qu'elles sont complètes
        (si le modèle répond sans appeler d'outil), pour que la voix démarre avant la fin de la génération."""
        from jarvis.voice import SentenceStream
        stream = SentenceStream(on_text) if on_text else None
        content, calls = "", []
        for chunk in self.client.chat(model=self.cfg["model"], messages=messages, tools=list(TOOLS.values()), think=False,
                                      keep_alive=self.cfg["keep_alive"], options=self.options, stream=True):
            m = chunk.message
            if m.tool_calls:
                calls.extend(m.tool_calls)
            if m.content:
                content += m.content
                if stream and not calls and not content.lstrip().startswith("<"):
                    stream.feed(m.content)
        if stream and not calls and not content.lstrip().startswith("<"):
            stream.close()
        return strip_think(content), calls

    def ask(self, text, on_text=None):
        """Réponse finale. Avec `on_text`, chaque phrase est aussi transmise dès qu'elle est prête."""
        self.history.append({"role": "user", "content": text})
        self._trim()
        facts = relevant_facts(memory.facts(), text)
        from jarvis.tools.system import date_heure
        system = {"role": "system", "content": PERSONA.format(
            facts="\n".join(facts) or "rien qui concerne cette demande",
            now=f"{date_heure()} ({datetime.now():%Y-%m-%d %H:%M})")}
        for _ in range(6):
            content, calls = self._chat([system, *self.history], on_text)
            self.history.append({"role": "assistant", "content": content, **({"tool_calls": calls} if calls else {})})
            if not calls:
                return content
            for call in calls:
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
        if name in ANNOUNCE:
            self.announce(ANNOUNCE[name])
        try:
            return str(TOOLS[name](**args))
        except Exception as e:
            return f"Erreur : {e}"
