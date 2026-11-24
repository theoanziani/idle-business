"""Fenêtre HUD : pywebview (WebView2) en plein écran, cachée au repos, ouverte à « Hey Jarvis »."""
import json
import threading
import time
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
        self._hud.hide()
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
        self.visible = False
        self._ready = threading.Event()
        self._quitting = False
        self._last_activity = time.time()

    def _screen(self):
        screens = webview.screens
        i = self.cfg.get("ecran", -1)
        return screens[i] if -len(screens) <= i < len(screens) else screens[0]

    def create(self):
        screen = self._screen()
        self.window = webview.create_window(
            "Jarvis", url=str(WEB / "index.html"), js_api=Api(self, self.cfg), hidden=not self.cfg.get("ouvert", False),
            frameless=True, fullscreen=True, screen=screen, width=screen.width, height=screen.height,
            background_color="#02070c", text_select=False, easy_drag=False)
        self.window.events.loaded += self._ready.set
        self.window.events.closing += self._on_closing
        self.visible = self.cfg.get("ouvert", False)
        return self.window

    def _on_closing(self):
        """Alt+F4 ou fermeture depuis la barre des tâches : on masque au lieu de détruire,
        sinon le prochain « Hey Jarvis » n'aurait plus de fenêtre à rouvrir. Seul « Quitter » ferme vraiment."""
        if self._quitting:
            return True
        threading.Thread(target=self.hide, daemon=True).start()
        return False

    def run(self, worker):
        """Bloque le thread principal (exigence de pywebview) ; `worker` tourne dans un thread à part."""
        webview.start(worker, debug=self.cfg.get("debug", False), private_mode=False)

    # --- Python -> JS -------------------------------------------------------------
    def _js(self, fn, *args):
        if self.window and self._ready.is_set():
            try:
                self.window.evaluate_js(f"window.jarvis && jarvis.{fn}({','.join(json.dumps(a, ensure_ascii=False) for a in args)})")
            except Exception:
                pass

    def state(self, s):
        """idle, ecoute, reflexion, parole."""
        self._last_activity = time.time()
        self._js("etat", s)

    def level(self, v):
        self._js("niveau", round(float(v), 3))

    def message(self, role, text):
        self._last_activity = time.time()
        self._js("message", role, text)

    # --- Fenêtre ------------------------------------------------------------------
    def show(self):
        self._last_activity = time.time()
        if self.window and not self.visible:
            self.window.show()
            self.visible = True
            self._js("apparition")

    def hide(self):
        if self.window and self.visible:
            self.window.hide()
            self.visible = False

    def toggle(self):
        self.hide() if self.visible else self.show()

    def idle_watch(self):
        """Masque le HUD après `masquer_apres_s` secondes sans activité vocale."""
        delay = self.cfg.get("masquer_apres_s", 90)
        while delay:
            time.sleep(5)
            if self.visible and time.time() - self._last_activity > delay:
                self.hide()

    def close(self):
        self._quitting = True
        if self.window:
            self.window.destroy()
