from datetime import datetime
from pathlib import Path

from jarvis.hud import data


def test_layout_roundtrip(tmp_path):
    lay = data.Layout(tmp_path / "sub" / "hud.json")
    assert lay.load() is None
    panels = [{"id": "a", "type": "meteo", "x": 2, "y": 3, "w": 18, "h": 26}]
    assert lay.save(panels)
    assert data.Layout(tmp_path / "sub" / "hud.json").load() == panels


def test_parse_ics():
    ics = ("BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nDTSTART;TZID=Europe/Paris:20261125T093000\r\nSUMMARY:Dentiste\\, Dr\r\n"
           " Martin\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20261124\r\nSUMMARY:Anniversaire\r\nEND:VEVENT\r\n"
           "BEGIN:VEVENT\r\nDTSTART:20270101T000000Z\r\nSUMMARY:Trop loin\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n")
    ev = data.parse_ics(ics, now=datetime(2026, 11, 24, 0, 30))
    assert [e["titre"] for e in ev] == ["Anniversaire", "Dentiste, DrMartin"]
    assert ev[1]["debut"] == "2026-11-25T09:30"


def test_cached_calls_once_and_catches_errors():
    n = []
    c = data.Cached(lambda: n.append(1) or len(n), ttl=60)
    assert c() == 1 and c() == 1
    boom = data.Cached(lambda: 1 / 0, ttl=60)
    assert "erreur" in boom()


def test_system_stats_shape():
    s = data.system()
    assert 0 <= s["cpu"] <= 100 and 0 <= s["ram"] <= 100


def test_autostart_command_uses_pythonw_launcher(tmp_path):
    (tmp_path / "pythonw.exe").touch()
    cmd = data.autostart_command(tmp_path / "python.exe", Path("C:/j"))
    assert "pythonw.exe" in cmd and "jarvis_demarrage.pyw" in cmd
