from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent


def load(path=ROOT / "config.yaml"):
    return yaml.safe_load(Path(path).read_text(encoding="utf-8"))


def resolve(p):
    p = Path(p).expanduser()
    return p if p.is_absolute() else ROOT / p
