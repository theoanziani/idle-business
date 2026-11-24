"""Données des panneaux : système, météo, agenda, musique, disposition. Sans dépendance à pywebview (testable)."""
import asyncio
import json
import re
import subprocess
import time
import urllib.request
from datetime import datetime, timedelta

import psutil

from jarvis.tools.system import _press

WMO = {0: "ciel dégagé", 1: "plutôt dégagé", 2: "partiellement nuageux", 3: "couvert", 45: "brouillard", 48: "brouillard givrant",
       51: "bruine légère", 53: "bruine", 55: "bruine dense", 61: "pluie faible", 63: "pluie", 65: "forte pluie",
       71: "neige faible", 73: "neige", 75: "forte neige", 80: "averses", 81: "averses", 82: "fortes averses",
       95: "orage", 96: "orage et grêle", 99: "orage et grêle"}


class Layout:
    """Disposition des panneaux, mémorisée dans un fichier JSON."""

    def __init__(self, path):
        self.path = path

    def load(self):
        try:
            return json.loads(self.path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            return None

    def save(self, layout):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(layout, ensure_ascii=False, indent=1), encoding="utf-8")
        return True


_nvml = None


def _gpu():
    global _nvml
    try:
        import pynvml
        if _nvml is None:
            pynvml.nvmlInit()
            _nvml = pynvml.nvmlDeviceGetHandleByIndex(0)
        u = pynvml.nvmlDeviceGetUtilizationRates(_nvml)
        m = pynvml.nvmlDeviceGetMemoryInfo(_nvml)
        t = pynvml.nvmlDeviceGetTemperature(_nvml, pynvml.NVML_TEMPERATURE_GPU)
        return {"gpu": u.gpu, "vram": round(m.used / 2**30, 1), "vram_total": round(m.total / 2**30, 1), "gpu_temp": t}
    except Exception:
        _nvml = False if _nvml is None else _nvml
        return {}


_cpu = None


def _cpu_sampler():
    """psutil mémorise le dernier relevé par thread, or pywebview répond depuis un thread neuf à chaque appel :
    un thread dédié mesure donc le CPU en continu."""
    global _cpu
    import threading

    def loop():
        global _cpu
        while True:
            _cpu = psutil.cpu_percent(interval=1.5)

    _cpu = 0.0
    threading.Thread(target=loop, daemon=True, name="cpu").start()


def system():
    if _cpu is None:
        _cpu_sampler()
    vm = psutil.virtual_memory()
    return {"cpu": _cpu, "ram": vm.percent, "ram_used": round(vm.used / 2**30, 1),
            "ram_total": round(vm.total / 2**30, 1), **_gpu()}


class Cached:
    """Appelle `fn` au plus une fois toutes les `ttl` secondes."""

    def __init__(self, fn, ttl):
        self.fn, self.ttl, self.at, self.value = fn, ttl, 0.0, None

    def __call__(self):
        if time.time() - self.at > self.ttl:
            try:
                self.value = self.fn()
            except Exception as e:
                self.value = {"erreur": str(e)}
            self.at = time.time()
        return self.value


def weather(cfg):
    url = (f"https://api.open-meteo.com/v1/forecast?latitude={cfg['latitude']}&longitude={cfg['longitude']}"
           "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m"
           "&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=4")
    with urllib.request.urlopen(url, timeout=10) as r:
        d = json.load(r)
    c, day = d["current"], d["daily"]
    return {"ville": cfg["ville"], "temp": round(c["temperature_2m"]), "ressenti": round(c["apparent_temperature"]),
            "ciel": WMO.get(c["weather_code"], "?"), "vent": round(c["wind_speed_10m"]), "humidite": c["relative_humidity_2m"],
            "jours": [{"date": day["time"][i], "max": round(day["temperature_2m_max"][i]), "min": round(day["temperature_2m_min"][i]),
                       "ciel": WMO.get(day["weather_code"][i], "?")} for i in range(1, len(day["time"]))]}


def _ics_date(v):
    v = v.rstrip("Z")
    return datetime.strptime(v[:15], "%Y%m%dT%H%M%S") if "T" in v else datetime.strptime(v[:8], "%Y%m%d")


def parse_ics(text, now=None, days=7):
    """Événements à venir d'un calendrier iCalendar (sans gestion des récurrences)."""
    now = now or datetime.now()
    text = re.sub(r"\r?\n[ \t]", "", text)  # lignes repliées
    events = []
    for block in re.findall(r"BEGIN:VEVENT(.*?)END:VEVENT", text, re.S):
        start = re.search(r"^DTSTART[^:]*:(\S+)", block, re.M)
        title = re.search(r"^SUMMARY[^:]*:(.*)$", block, re.M)
        if not start:
            continue
        when = _ics_date(start.group(1))
        if now - timedelta(hours=1) <= when <= now + timedelta(days=days):
            events.append({"debut": when.isoformat(timespec="minutes"),
                           "titre": (title.group(1).strip() if title else "(sans titre)").replace("\\,", ",")})
    return sorted(events, key=lambda e: e["debut"])[:8]


def agenda(_source=None):
    """Événements des 7 prochains jours, tous calendriers confondus (voir jarvis.tools.agenda)."""
    from jarvis.tools import agenda as ag
    if not ag.calendars():
        return {"evenements": [], "info": "Aucun agenda configuré : python -m jarvis --ajouter-agenda"}
    now = datetime.now()
    evs, errors = ag.events(now - timedelta(hours=1), now + timedelta(days=7))
    out = {"evenements": [{"debut": e["debut"].isoformat(timespec="minutes"),
                           "titre": e["titre"] + (" (journée)" if e["journee"] else "")} for e in evs[:12]]}
    if errors:
        out["info"] = "Inaccessible : " + " ; ".join(errors)
    return out


async def _smtc():
    from winrt.windows.media.control import GlobalSystemMediaTransportControlsSessionManager as M
    s = (await M.request_async()).get_current_session()
    if not s:
        return {}
    p = await s.try_get_media_properties_async()
    playing = s.get_playback_info().playback_status == 4
    return {"titre": p.title, "artiste": p.artist, "album": p.album_title, "lecture": playing,
            "appli": s.source_app_user_model_id}


def music():
    try:
        return asyncio.run(_smtc())
    except Exception:
        return {}


def music_action(action):
    if action in ("lecture_pause", "suivant", "precedent"):
        _press(action)
    return music()


def autostart_command(python, root):
    """Commande lancée au démarrage de Windows : pythonw (sans console) sur le lanceur .pyw du projet."""
    pyw = python.with_name("pythonw.exe")
    return f'"{pyw if pyw.exists() else python}" "{root / "jarvis_demarrage.pyw"}"'


def get_autostart():
    import winreg
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run") as key:
            winreg.QueryValueEx(key, "Jarvis")
        return True
    except OSError:
        return False


def set_autostart(enabled, python, root):
    """Ajoute ou retire Jarvis du démarrage de Windows (valeur « Jarvis » de la clé Run de l'utilisateur)."""
    import winreg
    key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_SET_VALUE)
    with key:
        if enabled:
            winreg.SetValueEx(key, "Jarvis", 0, winreg.REG_SZ, autostart_command(python, root))
        else:
            try:
                winreg.DeleteValue(key, "Jarvis")
            except FileNotFoundError:
                pass
    return enabled
