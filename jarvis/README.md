# Jarvis

Assistant vocal local pour Windows. Voir [le cahier des charges](docs/CAHIER_DES_CHARGES.md).

## Prérequis
- Python 3.11 (python.org, cocher « Add to PATH »)
- [Ollama](https://ollama.com/download)
- Pilote NVIDIA à jour
- Optionnel : [Claude Code](https://docs.claude.com/claude-code) pour le relais de code

## Installation
```powershell
cd jarvis
powershell -ExecutionPolicy Bypass -File setup.ps1
```

## Lancement
```powershell
.\.venv\Scripts\python -m jarvis          # voix : dites « Hey Jarvis »
.\.venv\Scripts\python -m jarvis --texte  # clavier, pour tester sans micro
```

Réglages dans `config.yaml` (modèle, seuil du mot d'activation, sensibilité du micro, dossier des projets).
Tests : `.\.venv\Scripts\python -m pytest`
