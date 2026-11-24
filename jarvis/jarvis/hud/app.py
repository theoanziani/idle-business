"""Fenêtre HUD : pywebview (WebView2) en plein écran.

Économie de mémoire : au repos il n'existe aucune fenêtre (WebView2 libère ~300 Mo). « Hey Jarvis » la crée
(~0,4 s, en parallèle de la voix) ; la masquer la détruit. La conversation et l'état sont gardés côté Python
et renvoyés à chaque ouverture.
"""
import json
import threading
import time
from collections import deque
from pathlib import Path

import webview

from jarvis import config
from jarvis.hud import data

WEB = Path(__file__).parent / "web"


class Api:
    """Fonctions appelables depuis le JavaScript (window.pywebview.api.*)."""

    def __init__(self, hud, cfg):
        self._hud = hud
        self._layout = data.Layout(config.resolve(cfg.get("layout", "data/hud_layout.json")))
        self._weather = data.Cached(lambda: data.weather(cfg["meteo"]), 900)
        self._agenda = data.Cached(lambda: data.agenda(cfg.get("agenda_ics", "")), 600)

    def charger_disposition(self):
        return self._layout.load()

    def enregistrer_disposition(self, layout):
        return self._layout.save(layout)

    def historique(self):
        """Conversation et état courant, pour une fenêtre qui vient d'être (re)créée."""
        return {"messages": list(self._hud.history), "etat": self._hud.current_state}

    def systeme(self):
        return data.system()

    def meteo(self):
        return self._weather()

    def agenda(self):
        return self._agenda()

    def musique(self):
        return data.music()

    def musique_action(self, action):
        return data.music_action(action)

    def envoyer(self, texte):
        """Demande tapée dans le panneau conversation."""
        if self._hud.on_text:
            threading.Thread(target=self._hud.on_text, args=(texte,), daemon=True).start()
        return True

    def masquer(self):
        threading.Thread(target=self._hud.hide, daemon=True).start()
        return True

    def activite(self):
        """Souris ou clavier dans le HUD : repousse le masquage automatique."""
        self._hud._last_activity = time.time()
        return True


class Hud:
    def __init__(self, cfg):
        self.cfg = cfg.get("hud", {})
        self.on_text = None
        self.window = None
        self.history = deque(maxlen=60)
        self.current_state = "idle"
        self._api = Api(self, self.cfg)
        self._want_show = threading.Event()
        self._ready = threading.Event()
        self._quitting = False
        self._last_activity = time.time()

    @property
    def visible(self):
        return self.window is not None

    def _screen(self):
        screens = webview.screens
        i = self.cfg.get("ecran", -1)
        return screens[i] if -len(screens) <= i < len(screens) else screens[0]

    def run(self):
        """Boucle du thread principal (exigence de pywebview) : une fenêtre par ouverture du HUD."""
        if self.cfg.get("ouvert", False):
            self._want_show.set()
        while not self._quitting:
            if not self._want_show.wait(0.5):  # attente courte : Ctrl+C reste possible dans la console
                continue
            if self._quitting:
                break
            self._want_show.clear()
            screen = self._screen()
            self._ready.clear()
            self.window = webview.create_window(
                "Jarvis", url=str(WEB / "index.html"), js_api=self._api, frameless=True, fullscreen=True,
                screen=screen, width=screen.width, height=screen.height, background_color="#02070c",
                text_select=False, easy_drag=False)
            self.window.events.loaded += self._ready.set
            self._last_activity = time.time()
            webview.start(debug=self.cfg.get("debug", False), private_mode=False)  # rend la main à la fermeture
            self.window = None

    # --- Python -> JS -------------------------------------------------------------
    def _js(self, fn, *args):
        w = self.window
        if w and self._ready.is_set():
            try:
                w.evaluate_js(f"window.jarvis && jarvis.{fn}({','.join(json.dumps(a, ensure_ascii=False) for a in args)})")
            except Exception:
                pass

    def state(self, s):
        """idle, ecoute, reflexion, parole."""
        self._last_activity = time.time()
        self.current_state = s
        self._js("etat", s)

    def level(self, v):
        self._js("niveau", round(float(v), 3))

    def message(self, role, text):
        self._last_activity = time.time()
        self.history.append({"role": role, "text": text})
        self._js("message", role, text)

    # --- Fenêtre ------------------------------------------------------------------
    def show(self):
        self._last_activity = time.time()
        if not self.window:
            self._want_show.set()

    def hide(self):
        """Détruit la fenêtre : WebView2 rend sa mémoire. Elle sera recréée au prochain réveil."""
        w = self.window
        if w:
            try:
                w.destroy()
            except Exception:
                pass

    def toggle(self):
        self.hide() if self.visible else self.show()

    def idle_watch(self):
        """Masque le HUD après `masquer_apres_s` secondes sans activité."""
        delay = self.cfg.get("masquer_apres_s", 90)
        while delay and not self._quitting:
            time.sleep(5)
            if self.visible and time.time() - self._last_activity > delay:
                self.hide()

    def close(self):
        self._quitting = True
        self._want_show.set()
        self.hide()
