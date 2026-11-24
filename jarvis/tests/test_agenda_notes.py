from datetime import date, datetime

from jarvis import config, tools
from jarvis.tools import TOOLS, agenda, notes

tools.load()

ICS = """BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:1
DTSTART;TZID=Europe/Paris:20261103T183000
DTEND;TZID=Europe/Paris:20261103T200000
RRULE:FREQ=WEEKLY;BYDAY=TU
SUMMARY:Entraînement trail
LOCATION:Stade
END:VEVENT
BEGIN:VEVENT
UID:2
DTSTART;VALUE=DATE:20261125
DTEND;VALUE=DATE:20261126
SUMMARY:Anniversaire de Léa
END:VEVENT
BEGIN:VEVENT
UID:3
DTSTART:20261125T080000Z
DTEND:20261125T090000Z
SUMMARY:Dentiste
END:VEVENT
END:VCALENDAR
"""


def test_tools_registered():
    assert {"agenda", "noter", "lire_notes"} <= TOOLS.keys()


def test_events_with_recurrence_and_timezones():
    evs = sorted(agenda.events_between(ICS, datetime(2026, 11, 24), datetime(2026, 11, 26), "Google"),
                 key=lambda e: e["debut"])
    assert [(e["titre"], e["debut"].strftime("%d %H:%M"), e["journee"]) for e in evs] == [
        ("Entraînement trail", "24 18:30", False),  # mardi : occurrence de la règle hebdomadaire
        ("Anniversaire de Léa", "25 00:00", True),
        ("Dentiste", "25 09:00", False),  # 08:00 UTC -> 09:00 à Paris
    ]
    assert agenda.fmt(evs[0]) == "mardi 24 18:30 : Entraînement trail, Stade"


def test_parse_day():
    mardi = date(2026, 11, 24)
    assert agenda.parse_day("demain", mardi) == date(2026, 11, 25)
    assert agenda.parse_day("vendredi", mardi) == date(2026, 11, 27)
    assert agenda.parse_day("mardi", mardi) == date(2026, 12, 1)
    assert agenda.parse_day("2026-12-24", mardi) == date(2026, 12, 24)


def test_agenda_tool_uses_local_calendars(tmp_path, monkeypatch):
    (tmp_path / "cal.ics").write_text(ICS, encoding="utf-8")
    monkeypatch.setattr(agenda, "calendars", lambda cfg=None: [{"nom": "Test", "ics": str(tmp_path / "cal.ics")}])
    assert "Dentiste" in agenda.agenda("2026-11-25")
    assert agenda.agenda("2026-11-27") .startswith("Rien de prévu")


def test_notes(tmp_path, monkeypatch):
    monkeypatch.setattr(notes, "path", lambda cfg=None: tmp_path / "Notes.md")
    assert notes.lire_notes() == "Le carnet de notes est vide."
    notes.noter("Acheter des piles")
    notes.noter("Idée : un mode nuit pour Jarvis")
    assert "piles" in notes.lire_notes() and "mode nuit" in notes.lire_notes("nuit")
    assert notes.lire_notes("banane").startswith("Aucune note")


def test_local_config_merge(tmp_path):
    base, local = tmp_path / "c.yaml", tmp_path / "l.yaml"
    base.write_text("hud:\n  ecran: -1\n  meteo:\n    ville: Paris\n", encoding="utf-8")
    config.save_local({"agenda": {"calendriers": [{"nom": "G", "ics": "x"}]}, "hud": {"meteo": {"ville": "Nailloux"}}}, local)
    cfg = config.load(base, local)
    assert cfg["hud"] == {"ecran": -1, "meteo": {"ville": "Nailloux"}}
    assert cfg["agenda"]["calendriers"][0]["nom"] == "G"
