import argparse
import os
import re
import sys
import threading
import traceback

from jarvis import config, memory, tools
from jarvis.brain import Brain, explain_error, is_yes
from jarvis.tools import rappels
from jarvis.tools.system import SLEEP_REQUEST


def text_mode(cfg):
    brain = Brain(cfg, lambda p: is_yes(input(f"Jarvis : Tu me demandes {elide(p)}. Tu confirmes ? > ")),
                  announce=lambda t: print("Jarvis :", t))
    try:
        while True:
            text = input("Vous > ").strip()
            if text:
                try:
                    print("Jarvis :", brain.ask(text))
                except Exception as e:
                    brain.history.clear()
                    print("Jarvis :", explain_error(e))
    except (EOFError, KeyboardInterrupt):
        print("\nJarvis : À plus tard.")


ONLINE = "Jarvis est prêt."
SLEEP = "Je me mets en veille. Appelle-moi si tu as besoin."
SLEEP_WORDS = re.compile(r"\ben veille\b|\bbonne nuit\b|\bc'est tout\b(?! à fait)|\btu peux (disposer|te reposer)\b"
                         r"|\bvous pouvez (disposer|vous reposer)\b|\bfin de (la )?conversation\b|\bau revoir\b"
                         r"|\b(va|tu peux|vous pouvez) (dormir|te coucher|vous coucher)\b|\bva te coucher\b"
                         r"|\bcouche[- ]toi\b|\barr[êe]te (de m'[ée]couter|d'[ée]couter)\b", re.I)
# Ordres courts, reconnus seulement s'ils forment toute la phrase (« dors », pas « je dors mal »).
SLEEP_SHORT = re.compile(r"^\W*(dors|dodo|c'est bon|ça suffit|ca suffit|stop|repos|tais[- ]toi|silence|veille)"
                         r"(\W+(jarvis|merci|maintenant))*\W*$", re.I)


def elide(phrase):
    """« de éteindre » -> « d'éteindre »."""
    return ("d'" if phrase[:1].lower() in "aeiouyéèêàâîôûh" else "de ") + phrase


def is_sleep(text):
    """« Mets-toi en veille », « c'est tout », « bonne nuit »… : fin de la conversation."""
    return bool(SLEEP_WORDS.search(text) or SLEEP_SHORT.match(text.strip()))


class Assistant:
    """Boucle vocale V1, avec branchements facultatifs vers le HUD."""

    def __init__(self, cfg, hud=None):
        self.cfg, self.hud = cfg, hud
        self.lock = threading.Lock()
        self.voice = self.ears = None
        self.on_notify = None  # notification Windows (icône de notification)
        self.brain = Brain(cfg, self.confirm, self.announce)
        rappels.on_due = self.remind

    def _hud(self, fn, *a):
        if self.hud:
            getattr(self.hud, fn)(*a)

    def confirm(self, phrase):
        question = f"Tu me demandes {elide(phrase)}. Tu confirmes ?"
        self._hud("message", "jarvis", question)
        self.say(question)
        if not self.ears:
            return False
        self._hud("state", "ecoute")
        answer = self.ears.listen()
        self._hud("message", "vous", answer or "…")
        return is_yes(answer)

    def remind(self, r):
        """Minuteur ou rappel arrivé à échéance : bip, HUD et annonce vocale (après l'échange en cours)."""
        what = "Minuteur terminé" if r["genre"] == "minuteur" else "Rappel"
        text = f"{what} : {r['message']}." if r["message"] != "minuteur" else f"{what}."
        if r.get("retard"):
            text += f" Il était prévu à {r['quand']:%H:%M}."
        with self.lock:
            print("Jarvis :", text, flush=True)
            self._hud("show")
            self._hud("message", "jarvis", text)
            if self.on_notify:
                self.on_notify(text)
            if self.voice:
                self.voice.chime()
            self.say(text)

    def announce(self, text):
        """Prévient avant un outil lent, puis repasse en réflexion pendant qu'il travaille."""
        print("Jarvis :", text)
        self._hud("message", "jarvis", text)
        self.say(text)
        self._hud("state", "reflexion")

    def say(self, text):
        if self.voice:
            self._hud("state", "parole")
            self.voice.say(text)
        self._hud("state", "idle")

    def handle(self, text):
        with self.lock:
            print("Vous :", text, flush=True)
            self._hud("message", "vous", text)
            self._hud("state", "reflexion")
            spoken = []

            def speak_now(sentence):  # la voix démarre dès la première phrase générée
                if not spoken:
                    self._hud("state", "parole")
                spoken.append(sentence)
                self.voice.feed(sentence)

            try:
                answer = self.brain.ask(text, on_text=speak_now if self.voice else None)
            except Exception as e:
                self.brain.history.clear()
                answer = explain_error(e)
            print("Jarvis :", answer, flush=True)
            self._hud("message", "jarvis", answer)
            if spoken:
                self.voice.wait()
                self._hud("state", "idle")
            else:
                self.say(answer)

    def start_audio(self):
        from jarvis.brain import ANNOUNCE
        from jarvis.ears import Ears
        from jarvis.voice import Speaker

        vcfg = dict(self.cfg["voice"], model=config.resolve(self.cfg["voice"]["model"]))
        self.voice = Speaker(vcfg, config.resolve(vcfg.get("cache", "data/voix_cache")))
        self.voice.prefetch([ONLINE, *ANNOUNCE.values()])
        self.ears = Ears(self.cfg)
        if self.hud:
            self.voice.on_level = self.ears.on_level = self.hud.level

    def loop(self):
        self.say(ONLINE)
        while True:
            self.ears.wait_wake()
            print("[réveil]", flush=True)
            self._hud("show")
            self._hud("state", "ecoute")
            for warm in (self.brain.warmup, self.ears.whisper):
                threading.Thread(target=warm, daemon=True).start()
            self.voice.chime()
            self.conversation()

    def conversation(self):
        """Après « Hey Jarvis » : écoute continue, sans mot d'activation, jusqu'à « mets-toi en veille »."""
        while True:
            self._hud("state", "ecoute")
            text = self.ears.listen()
            self._hud("level", 0)
            if not text:
                continue  # silence : on reste à l'écoute
            if is_sleep(text):
                print("Vous :", text, flush=True)
                self._hud("message", "vous", text)
                self._hud("message", "jarvis", SLEEP)
                self.say(SLEEP)
                self.sleep()
                return
            self.handle(text)
            if SLEEP_REQUEST.is_set():  # le modèle a compris une demande de veille (outil mettre_en_veille)
                SLEEP_REQUEST.clear()
                self.sleep()
                return

    def sleep(self):
        """Veille : décharge le modèle et Whisper pour rendre la VRAM tout de suite (au lieu d'attendre 5 min)."""
        self._hud("state", "idle")
        for unload in (self.brain.unload, self.ears.unload):
            try:
                unload()
            except Exception as e:
                print(f"[veille] {e}", flush=True)
        print("[veille]", flush=True)


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
    a = Assistant(cfg, hud)
    hud.on_text = a.handle

    def quit_all():
        hud.close()
        os._exit(0)

    tray = Tray(hud.show, quit_all, data.get_autostart,
                lambda on: data.set_autostart(on, config.Path(sys.executable), config.ROOT))
    tray.start()
    a.on_notify = tray.notify

    def worker():
        threading.Thread(target=hud.idle_watch, daemon=True).start()
        try:
            a.start_audio()
        except Exception as e:
            traceback.print_exc()
            hud.message("jarvis", f"Micro ou voix indisponible ({e}). Tu peux toujours m'écrire dans le HUD.")
            tray.notify("Micro ou voix indisponible : mode clavier dans le HUD.")
            return
        tray.notify("Jarvis en ligne. Dis « Hey Jarvis », puis parle librement ; « mets-toi en veille » pour finir.")
        a.loop()

    threading.Thread(target=worker, daemon=True, name="voix").start()
    hud.run()  # thread principal : crée la fenêtre à chaque ouverture, la détruit à chaque masquage


def mic_check(cfg, seconds=15):
    """Affiche le niveau du micro en direct, pour régler listen.silence_rms et wake.threshold."""
    import numpy as np
    import sounddevice as sd
    from openwakeword.model import Model

    wake = Model(wakeword_models=[cfg["wake"]["model"]], inference_framework="onnx")
    seuil = cfg["listen"]["silence_rms"]
    print(f"Micro : {sd.query_devices(kind='input')['name']}. Parle normalement, puis dis « Hey Jarvis » ({seconds} s).")
    peak = best = 0
    frames = []
    with sd.InputStream(samplerate=16000, channels=1, dtype="int16", blocksize=1280) as s:
        for _ in range(int(seconds * 16000 / 1280)):
            f = s.read(1280)[0][:, 0].copy()
            frames.append(f)
            rms = float(np.sqrt(np.mean(f.astype(np.float32) ** 2)))
            score = max(wake.predict(f).values())
            peak, best = max(peak, rms), max(best, score)
            bar = "#" * min(50, int(rms / 40))
            print(f"\rRMS {rms:6.0f} {'PAROLE' if rms > seuil else '      '} réveil {score:.2f} |{bar:<50}|", end="", flush=True)
    print(f"\nPic : {peak:.0f}. Réglez listen.silence_rms entre le bruit de fond et ce pic (actuel : {seuil}).")
    print(f"Meilleur score « Hey Jarvis » : {best:.2f} (réveil au-dessus de wake.threshold = {cfg['wake']['threshold']}).")
    import wave
    path = config.resolve("data/micro.wav")
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1), w.setsampwidth(2), w.setframerate(16000), w.writeframes(np.concatenate(frames).tobytes())
    print(f"Enregistrement : {path}")


def add_calendar():
    """Ajoute un agenda (adresse iCal secrète) dans config.local.yaml, sans l'afficher à l'écran."""
    import getpass
    from datetime import datetime, timedelta

    from jarvis.tools import agenda as ag

    print("Ajout d'un agenda. L'adresse iCal secrète reste sur ce PC (config.local.yaml, jamais sur GitHub).")
    nom = input("Nom de l'agenda (ex. Google, iCloud, Outlook) : ").strip() or "Agenda"
    url = getpass.getpass("Colle l'adresse iCal secrète puis Entrée (elle ne s'affiche pas) : ").strip()
    if not url:
        print("Aucune adresse : rien n'a été ajouté.")
        return
    try:
        evs = ag.events_between(ag.fetch(url, ttl=0), datetime.now(), datetime.now() + timedelta(days=30), nom)
    except Exception as e:
        print(f"Impossible de lire cet agenda ({type(e).__name__}) : vérifie l'adresse. Rien n'a été ajouté.")
        return
    cals = [c for c in (config.load().get("agenda") or {}).get("calendriers") or [] if c.get("ics") != url]
    config.save_local({"agenda": {"calendriers": cals + [{"nom": nom, "ics": url}]}})
    print(f"Agenda « {nom} » ajouté : {len(evs)} événement(s) dans les 30 prochains jours.")


def add_mail():
    """Ajoute une boîte mail : adresse dans config.local.yaml, mot de passe d'application dans le Gestionnaire
    d'identification de Windows (jamais dans un fichier). Le mot de passe se tape sans s'afficher."""
    import getpass

    import keyring

    from jarvis.tools import mails

    print("Ajout d'une boîte mail (lecture seule). Utilise un MOT DE PASSE D'APPLICATION, pas ton mot de passe habituel.")
    adresse = input("Adresse mail : ").strip()
    if "@" not in adresse:
        print("Adresse invalide : rien n'a été ajouté.")
        return
    serveur = input(f"Serveur IMAP [{mails.server_for(adresse)}] : ").strip() or mails.server_for(adresse)
    pwd = getpass.getpass("Mot de passe d'application (il ne s'affiche pas) : ").strip().replace(" ", "")
    account = {"nom": input("Nom court (ex. Gmail, iCloud) : ").strip() or adresse, "adresse": adresse, "serveur": serveur}
    try:
        box = mails.connect(account, pwd)
        _, data = box.uid("search", None, "UNSEEN")
        box.logout()
    except Exception as e:
        print(f"Connexion refusée ({type(e).__name__}). Vérifie le mot de passe d'application. Rien n'a été ajouté.")
        return
    keyring.set_password(mails.SERVICE, adresse, pwd)
    comptes = [a for a in mails.accounts() if a["adresse"] != adresse]
    config.save_local({"mails": {"comptes": comptes + [account]}})
    print(f"Boîte « {account['nom']} » ajoutée : {len(data[0].split()) if data and data[0] else 0} message(s) non lu(s).")


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
    p.add_argument("--micro", action="store_true", help="affiche le niveau du micro pour régler les seuils, puis quitte")
    p.add_argument("--entrainer-reveil", action="store_true",
                   help="enregistre votre « Hey Jarvis » et entraîne un vérificateur contre les faux réveils")
    p.add_argument("--ajouter-agenda", action="store_true",
                   help="ajoute un agenda Google, iCloud ou Outlook (adresse iCal secrète, gardée sur ce PC)")
    p.add_argument("--ajouter-mail", action="store_true",
                   help="ajoute une boîte mail en lecture seule (mot de passe d'application rangé dans Windows)")
    args = p.parse_args()
    if args.ajouter_mail:
        return add_mail()
    if args.ajouter_agenda:
        return add_calendar()
    if args.entrainer_reveil:
        from jarvis import reveil
        return reveil.session(config.load())
    if args.micro:
        return mic_check(config.load())
    if args.demarrage:
        from jarvis.hud import data
        data.set_autostart(args.demarrage == "oui", config.Path(sys.executable), config.ROOT)
        print("Démarrage avec Windows :", "activé" if args.demarrage == "oui" else "désactivé")
        return
    cfg = config.load()
    memory.init(config.resolve(cfg["memory"]["path"]))
    tools.load()
    rappels.init(config.resolve(cfg.get("rappels", {}).get("path", "data/rappels.db")))
    if args.texte:
        text_mode(cfg)
    elif args.sans_hud:
        voice_mode(cfg)
    else:
        hud_mode(cfg, args.montrer)


if __name__ == "__main__":
    main()
