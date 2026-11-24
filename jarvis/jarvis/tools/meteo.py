import json
import urllib.parse
import urllib.request
from datetime import datetime

from jarvis import config
from jarvis.hud.data import WMO
from jarvis.tools import tool

JOURS = "lundi mardi mercredi jeudi vendredi samedi dimanche".split()


def _get(url):
    with urllib.request.urlopen(url, timeout=10) as r:
        return json.load(r)


def geocode(ville):
    q = urllib.parse.urlencode({"name": ville, "count": 1, "language": "fr", "format": "json"})
    hits = _get(f"https://geocoding-api.open-meteo.com/v1/search?{q}").get("results") or []
    if not hits:
        return None
    h = hits[0]
    return {"ville": h["name"], "region": h.get("admin1", ""), "latitude": h["latitude"], "longitude": h["longitude"]}


def summarize(d, place, now=None):
    """Texte court à partir d'une réponse Open-Meteo (actuel, cet après-midi, soirée, trois jours)."""
    now = now or datetime.now()
    c, h, day = d["current"], d["hourly"], d["daily"]
    lines = [f"{place} maintenant : {round(c['temperature_2m'])} °C (ressenti {round(c['apparent_temperature'])}), "
             f"{WMO.get(c['weather_code'], '?')}, vent {round(c['wind_speed_10m'])} km/h."]
    today = now.strftime("%Y-%m-%d")
    for label, hours in (("cet après-midi", range(13, 19)), ("ce soir", range(19, 24))):
        idx = [i for i, t in enumerate(h["time"]) if t.startswith(today) and int(t[11:13]) in hours and int(t[11:13]) >= now.hour]
        if idx:
            temps = [h["temperature_2m"][i] for i in idx]
            pluie = max(h["precipitation_probability"][i] for i in idx)
            ciel = WMO.get(max((h["weather_code"][i] for i in idx)), "?")
            lines.append(f"{label.capitalize()} : {round(min(temps))} à {round(max(temps))} °C, {ciel}, risque de pluie {pluie} %.")
    for i in range(1, min(4, len(day["time"]))):
        j = datetime.strptime(day["time"][i], "%Y-%m-%d")
        lines.append(f"{JOURS[j.weekday()].capitalize()} : {round(day['temperature_2m_min'][i])} à "
                     f"{round(day['temperature_2m_max'][i])} °C, {WMO.get(day['weather_code'][i], '?')}, "
                     f"pluie {day['precipitation_probability_max'][i]} %.")
    return "\n".join(lines)


@tool()
def meteo(ville: str = "") -> str:
    """Donne la météo réelle (actuelle, cet après-midi, ce soir et les trois prochains jours) d'une ville.
    Toujours utiliser cet outil pour la météo : ne jamais l'inventer.

    Args:
      ville: nom de la ville (vide pour la ville de l'utilisateur)
    """
    if ville:
        loc = geocode(ville)
        if not loc:
            return f"Ville « {ville} » introuvable."
    else:
        loc = config.load().get("hud", {}).get("meteo")
        if not loc:
            return "Aucune ville par défaut (hud.meteo dans config.yaml)."
    q = urllib.parse.urlencode({
        "latitude": loc["latitude"], "longitude": loc["longitude"], "timezone": "auto", "forecast_days": 4,
        "current": "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
        "hourly": "temperature_2m,precipitation_probability,weather_code",
        "daily": "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max"})
    place = loc["ville"] + (f" ({loc['region']})" if loc.get("region") else "")
    return summarize(_get(f"https://api.open-meteo.com/v1/forecast?{q}"), place)
