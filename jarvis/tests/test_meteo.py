from datetime import datetime

from jarvis import tools
from jarvis.tools import TOOLS
from jarvis.tools.meteo import summarize

tools.load()


def test_meteo_tool_registered():
    assert "meteo" in TOOLS


def test_summarize_offline():
    hours = [f"2026-11-24T{h:02d}:00" for h in range(24)]
    d = {"current": {"temperature_2m": 8.2, "apparent_temperature": 2.4, "weather_code": 3, "wind_speed_10m": 28},
         "hourly": {"time": hours, "temperature_2m": [h / 2 for h in range(24)],
                    "precipitation_probability": [h for h in range(24)], "weather_code": [3] * 24},
         "daily": {"time": ["2026-11-24", "2026-11-25"], "temperature_2m_min": [5, 4.6], "temperature_2m_max": [10, 9.7],
                   "weather_code": [3, 61], "precipitation_probability_max": [20, 85]}}
    text = summarize(d, "Nailloux (Occitanie)", now=datetime(2026, 11, 24, 10, 0))
    assert text.splitlines()[0] == "Nailloux (Occitanie) maintenant : 8 °C (ressenti 2), couvert, vent 28 km/h."
    assert "Cet après-midi : 6 à 9 °C, couvert, risque de pluie 18 %." in text
    assert "Mercredi : 5 à 10 °C, pluie faible, pluie 85 %." in text
