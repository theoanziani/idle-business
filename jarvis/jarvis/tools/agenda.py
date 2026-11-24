"""Agenda : calendriers iCal (Google, iCloud, Outlook) en lecture seule, récurrences comprises.

Les adresses iCal sont secrètes : elles vivent dans config.local.yaml (jamais sur GitHub), ajoutées avec
`python -m jarvis --ajouter-agenda`.
"""
import time
import urllib.request
from datetime import date, datetime, timedelta

from jarvis import config
from jarvis.tools import tool

JOURS = "lundi mardi mercredi jeudi vendredi samedi dimanche".split()
_cache = {}  # url -> (horodatage, texte)


def calendars(cfg=None):
    cfg = cfg if cfg is not None else config.load()
    cals = list((cfg.get("agenda") or {}).get("calendriers") or [])
    legacy = (cfg.get("hud") or {}).get("agenda_ics")
    if legacy:
        cals.append({"nom": "Agenda", "ics": legacy})
    return cals


def fetch(url, ttl=600):
    """Texte iCal d'une adresse (ou d'un fichier local), gardé 10 minutes."""
    now = time.time()
    if url in _cache and now - _cache[url][0] < ttl:
        return _cache[url][1]
    if url.startswith(("http://", "https://", "webcal://")):
        req = urllib.request.Request(url.replace("webcal://", "https://"), headers={"User-Agent": "Jarvis"})
        with urllib.request.urlopen(req, timeout=15) as r:
            text = r.read().decode("utf-8", "replace")
    else:
        text = config.resolve(url).read_text(encoding="utf-8", errors="replace")
    _cache[url] = (now, text)
    return text


def _local(dt):
    """datetime/date iCal -> datetime locale naïve (journée entière : minuit, all_day=True)."""
    if isinstance(dt, datetime):
        return (dt.astimezone().replace(tzinfo=None) if dt.tzinfo else dt), False
    return datetime(dt.year, dt.month, dt.day), True


def events_between(ics_text, start, end, source=""):
    import icalendar
    import recurring_ical_events
    cal = icalendar.Calendar.from_ical(ics_text)
    out = []
    for ev in recurring_ical_events.of(cal).between(start, end):
        begin, all_day = _local(ev.get("DTSTART").dt)
        out.append({"debut": begin, "journee": all_day, "titre": str(ev.get("SUMMARY", "(sans titre)")),
                    "lieu": str(ev.get("LOCATION", "") or ""), "source": source})
    return out


def events(start, end, cfg=None):
    out, errors = [], []
    for c in calendars(cfg):
        try:
            out += events_between(fetch(c["ics"]), start, end, c.get("nom", ""))
        except Exception as e:
            errors.append(f"{c.get('nom', 'agenda')} : {e}")
    return sorted(out, key=lambda e: (e["debut"], not e["journee"])), errors


def parse_day(jour, today=None):
    """« aujourd'hui », « demain », « après-demain », « mercredi », « 2026-12-03 » -> date."""
    today = today or date.today()
    j = (jour or "aujourd'hui").lower().strip()
    if j in ("aujourd'hui", "aujourdhui", "ce jour", ""):
        return today
    if j == "demain":
        return today + timedelta(days=1)
    if j in ("après-demain", "apres-demain"):
        return today + timedelta(days=2)
    for i, name in enumerate(JOURS):
        if j.startswith(name):
            return today + timedelta(days=(i - today.weekday()) % 7 or 7)
    return date.fromisoformat(j[:10])


def fmt(e, with_day=True):
    d = e["debut"]
    day = f"{JOURS[d.weekday()]} {d.day}" if with_day else ""
    hour = "toute la journée" if e["journee"] else f"{d:%H:%M}"
    where = f", {e['lieu']}" if e["lieu"] else ""
    return f"{day} {hour} : {e['titre']}{where}".strip()


@tool()
def agenda(jour: str = "aujourd'hui", nb_jours: int = 1) -> str:
    """Lit l'agenda de l'utilisateur (Google, iCloud, Outlook) : rendez-vous et événements à venir.

    Args:
      jour: premier jour : « aujourd'hui », « demain », « après-demain », un jour de la semaine ou AAAA-MM-JJ
      nb_jours: nombre de jours à couvrir (1 pour un seul jour, 7 pour la semaine)
    """
    if not calendars():
        return "Aucun agenda configuré. Lance « python -m jarvis --ajouter-agenda » pour en ajouter un."
    try:
        d = parse_day(jour)
    except ValueError:
        return f"Jour illisible : {jour}."
    start = datetime(d.year, d.month, d.day)
    evs, errors = events(start, start + timedelta(days=max(1, min(int(nb_jours), 31))))
    lines = [fmt(e) for e in evs[:20]]
    if not lines:
        lines = [f"Rien de prévu ({jour}{f', {nb_jours} jours' if nb_jours > 1 else ''})."]
    if errors:
        lines.append("Inaccessible : " + " ; ".join(errors))
    return "\n".join(lines)
