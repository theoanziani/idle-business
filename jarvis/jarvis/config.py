from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
LOCAL = ROOT / "config.local.yaml"  # réglages privés (adresses d'agenda…) : jamais envoyés sur GitHub


def merge(base, extra):
    """Fusion récursive : `extra` complète ou remplace `base`."""
    out = dict(base)
    for k, v in (extra or {}).items():
        out[k] = merge(out[k], v) if isinstance(v, dict) and isinstance(out.get(k), dict) else v
    return out


def load(path=ROOT / "config.yaml", local=LOCAL):
    cfg = yaml.safe_load(Path(path).read_text(encoding="utf-8"))
    if local and Path(local).exists():
        cfg = merge(cfg, yaml.safe_load(Path(local).read_text(encoding="utf-8")) or {})
    return cfg


def save_local(update, local=LOCAL):
    """Ajoute des réglages privés dans config.local.yaml."""
    current = yaml.safe_load(Path(local).read_text(encoding="utf-8")) if Path(local).exists() else {}
    Path(local).write_text(yaml.safe_dump(merge(current or {}, update), allow_unicode=True, sort_keys=False),
                           encoding="utf-8")


def resolve(p):
    p = Path(p).expanduser()
    return p if p.is_absolute() else ROOT / p
