import argparse
import os
import sys
import threading
import traceback

from jarvis import config, memory, tools
from jarvis.brain import Brain, is_yes


def text_mode(cfg):
    brain = Brain(cfg, lambda p: is_yes(input(f"Jarvis : {p}. Confirmez-vous, monsieur ? > ")))
    while True:
        print("Jarvis :", brain.ask(input("Vous > ")))


class Assistant:
    """Boucle vocale V1, avec branchements facultatifs vers le HUD."""

    def __init__(self, cfg, hud=None):
        self.cfg, self.hud = cfg, hud
        self.lock = threading.Lock()
        self.voice = self.ears = None
        self.brain = Brain(cfg, self.confirm)

    def _hud(self, fn, *a):
        if self.hud:
            getattr(self.hud, fn)(*a)

    def confirm(self, phrase):
        question = f"Vous me demandez de {phrase}. Confirmez-vous, monsieur ?"
        self._hud("message", "jarvis", question)
        self.say(question)
        if not self.ears:
            return False
        self._hud("state", "ecoute")
        answer = self.ears.listen()
        self._hud("message", "vous", answer or "…")
        return is_yes(answer)

    def say(self, text):
        if self.voice:
            self._hud("state", "parole")
            self.voice.say(text)
        self._hud("state", "idle")

    def handle(self, text):
        with self.lock:
            print("Vous :", text)
            self._hud("message", "vous", text)
            self._hud("state", "reflexion")
            try:
                answer = self.brain.ask(text)
            except Exception as e:
                answer = f"Mon cerveau ne répond pas, monsieur ({e}). Ollama est-il lancé ?"
            print("Jarvis :", answer)
            self._hud("message", "jarvis", answer)
            self.say(answer)

    def start_audio(self):
        from jarvis.ears import Ears
        from jarvis.voice import Voice

        self.voice = Voice(config.resolve(self.cfg["voice"]["model"]))
        self.ears = Ears(self.cfg)
        if self.hud:
            self.voice.on_level = self.ears.on_level = self.hud.level

    def loop(self):
        self.say("Jarvis en ligne. À votre service, monsieur.")
        while True:
            self.ears.wait_wake()
            self._hud("show")
            self._hud("state", "ecoute")
            for warm in (self.brain.warmup, self.ears.whisper):
                threading.Thread(target=warm, daemon=True).start()
            self.voice.chime()
            text = self.ears.listen()
            self._hud("level", 0)
            if not text:
                self._hud("state", "idle")
                continue
            self.handle(text)


def voice_mode(cfg):
    a = Assistant(cfg)
    a.start_audio()
    a.loop()


def hud_mode(cfg, show):
    from jarvis.hud import data
    from jarvis.hud.app import Hud
    from jarvis.tray import Tray

    if show:
        cfg.setdefault("hud", {})["ouvert"] = True
    hud = Hud(cfg)
    hud.create()
    a = Assistant(cfg, hud)
    hud.on_text = a.handle

    def quit_all():
        hud.close()
        os._exit(0)

    tray = Tray(hud.show, quit_all, data.get_autostart,
                lambda on: data.set_autostart(on, config.Path(sys.executable), config.ROOT))
    tray.start()

    def worker():
        threading.Thread(target=hud.idle_watch, daemon=True).start()
        try:
            a.start_audio()
        except Exception as e:
            traceback.print_exc()
            hud.message("jarvis", f"Micro ou voix indisponible ({e}). Le clavier reste à votre service, monsieur.")
            tray.notify("Micro ou voix indisponible : mode clavier dans le HUD.")
            return
        tray.notify("Jarvis en ligne. Dites « Hey Jarvis ».")
        a.loop()

    hud.run(worker)


def _redirect_output():
    """Sous pythonw (démarrage avec Windows) il n'y a pas de console : on écrit dans data/jarvis.log."""
    if sys.stdout is None or sys.stderr is None:
        log = config.resolve("data/jarvis.log")
        log.parent.mkdir(parents=True, exist_ok=True)
        sys.stdout = sys.stderr = open(log, "a", encoding="utf-8", buffering=1)


def main():
    _redirect_output()
    p = argparse.ArgumentParser(prog="jarvis")
    p.add_argument("--texte", action="store_true", help="mode clavier, sans micro ni voix ni HUD")
    p.add_argument("--sans-hud", action="store_true", help="mode vocal seul (V1), sans fenêtre ni icône")
    p.add_argument("--montrer", action="store_true", help="ouvre le HUD dès le lancement")
    p.add_argument("--demarrage", choices=["oui", "non"], help="lancer (ou non) Jarvis avec Windows, puis quitter")
    args = p.parse_args()
    if args.demarrage:
        from jarvis.hud import data
        data.set_autostart(args.demarrage == "oui", config.Path(sys.executable), config.ROOT)
        print("Démarrage avec Windows :", "activé" if args.demarrage == "oui" else "désactivé")
        return
    cfg = config.load()
    memory.init(config.resolve(cfg["memory"]["path"]))
    tools.load()
    if args.texte:
        text_mode(cfg)
    elif args.sans_hud:
        voice_mode(cfg)
    else:
        hud_mode(cfg, args.montrer)


if __name__ == "__main__":
    main()
