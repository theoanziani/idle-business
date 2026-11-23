import argparse
import threading

from jarvis import config, memory, tools
from jarvis.brain import Brain, is_yes


def text_mode(cfg):
    brain = Brain(cfg, lambda p: is_yes(input(f"Jarvis : {p}. Confirmez-vous, monsieur ? > ")))
    while True:
        print("Jarvis :", brain.ask(input("Vous > ")))


def voice_mode(cfg):
    from jarvis.ears import Ears
    from jarvis.voice import Voice

    voice, ears = Voice(config.resolve(cfg["voice"]["model"])), Ears(cfg)

    def confirm(phrase):
        voice.say(f"Vous me demandez de {phrase}. Confirmez-vous, monsieur ?")
        return is_yes(ears.listen())

    brain = Brain(cfg, confirm)
    voice.say("Jarvis en ligne. À votre service, monsieur.")
    while True:
        ears.wait_wake()
        for warm in (brain.warmup, ears.whisper):
            threading.Thread(target=warm, daemon=True).start()
        voice.chime()
        text = ears.listen()
        if not text:
            continue
        print("Vous :", text)
        answer = brain.ask(text)
        print("Jarvis :", answer)
        voice.say(answer)


def main():
    p = argparse.ArgumentParser(prog="jarvis")
    p.add_argument("--texte", action="store_true", help="mode clavier, sans micro ni voix")
    args = p.parse_args()
    cfg = config.load()
    memory.init(config.resolve(cfg["memory"]["path"]))
    tools.load()
    (text_mode if args.texte else voice_mode)(cfg)


if __name__ == "__main__":
    main()
