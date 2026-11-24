import os
from datetime import datetime, timedelta

from jarvis import tools
from jarvis.tools import CONFIRM, TOOLS, fichiers, presse_papier, rappels

tools.load()


def test_services_registered():
    assert {"minuteur", "rappel", "rappels_en_cours", "annuler_rappel", "presse_papier", "copier", "chercher_fichiers"} <= TOOLS.keys()
    assert "annuler_rappel" in CONFIRM


def test_timer_and_reminder(tmp_path):
    rappels.init(tmp_path / "r.db", start=False)
    assert "Minuteur n°1" in rappels.minuteur(10, "pâtes")
    soon = (datetime.now() + timedelta(hours=2)).strftime("%Y-%m-%d %H:%M")
    assert "programmé" in rappels.rappel(soon, "appeler le garage")
    assert "déjà passée" in rappels.rappel("2020-01-01 10:00", "trop tard")
    assert "illisible" in rappels.rappel("demain matin", "x")
    assert "pâtes" in rappels.rappels_en_cours() and "garage" in rappels.rappels_en_cours()
    assert rappels.due() == []
    later = rappels.due(now=datetime.now() + timedelta(minutes=11))
    assert [r["message"] for r in later] == ["pâtes"]
    assert rappels.due(now=datetime.now() + timedelta(minutes=12)) == []  # annoncé une seule fois
    assert "annulé" in rappels.annuler_rappel(2)
    assert rappels.rappels_en_cours() == "Aucun minuteur ni rappel en cours."


def test_late_reminder_is_flagged(tmp_path):
    rappels.init(tmp_path / "r.db", start=False)
    rappels._add(datetime.now() - timedelta(minutes=30), "réunion", "rappel")
    (r,) = rappels.due()
    assert r["retard"]


def test_clipboard_roundtrip():
    before = presse_papier.read()
    try:
        presse_papier.copier("Café noir, été — ✓")
        assert presse_papier.presse_papier() == "Café noir, été — ✓"
    finally:
        presse_papier.write(before)


def test_file_search(tmp_path):
    (tmp_path / "Documents" / "Projets" / "node_modules").mkdir(parents=True)
    (tmp_path / "Documents" / "Facture_EDF_mars.pdf").write_text("x")
    (tmp_path / "Documents" / "Projets" / "Cahier des charges.md").write_text("x")
    (tmp_path / "Documents" / "Projets" / "node_modules" / "facture edf.js").write_text("x")
    old = tmp_path / "Documents" / "facture edf 2019.pdf"
    old.write_text("x")
    os.utime(old, (0, 0))
    found, complete = fichiers.search("facture EDF", [tmp_path / "Documents"])
    assert complete and [p.name for p in found] == ["Facture_EDF_mars.pdf", "facture edf 2019.pdf"]
    assert [p.name for p in fichiers.search("cahier charges", [tmp_path])[0]] == ["Cahier des charges.md"]
    assert fichiers.search("été", [tmp_path])[0] == []
