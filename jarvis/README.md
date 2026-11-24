# Jarvis

Assistant vocal local pour Windows. Voir [le cahier des charges](docs/CAHIER_DES_CHARGES.md).

## Prérequis
- Python 3.11 (`winget install Python.Python.3.11`)
- [Ollama](https://ollama.com/download) (`winget install Ollama.Ollama`)
- Pilote NVIDIA à jour
- Optionnel : [Claude Code](https://docs.claude.com/claude-code) pour le relais de code

## Installation
```powershell
cd jarvis
powershell -ExecutionPolicy Bypass -File setup.ps1
```
Le script crée le venv en Python 3.11, installe les dépendances, télécharge le mot d'activation,
la voix Piper, Whisper small (dans `models/`) et le modèle `qwen3:4b-instruct-2507-q4_K_M`.

## Lancement
```powershell
.\.venv\Scripts\python -m jarvis              # HUD + icône de notification + voix : dites « Hey Jarvis »
.\.venv\Scripts\python -m jarvis --montrer    # idem, HUD ouvert dès le lancement
.\.venv\Scripts\python -m jarvis --sans-hud   # voix seule (V1)
.\.venv\Scripts\python -m jarvis --texte      # clavier, pour tester sans micro
.\.venv\Scripts\python -m jarvis --micro      # niveau du micro en direct, pour régler les seuils
.\.venv\Scripts\python -m jarvis --demarrage oui   # lancer Jarvis avec Windows (non pour retirer)
```
Avant de lancer Jarvis, vérifiez qu'Ollama tourne (icône dans la zone de notification).

## HUD (V2)
- Fenêtre plein écran cachée au repos ; elle s'ouvre à « Hey Jarvis » (ou par l'icône de notification)
  et se masque après `hud.masquer_apres_s` secondes sans activité. Échap la masque aussitôt.
- Panneaux : heure, météo, agenda, système, musique, conversation. Déplacez-les par leur titre,
  redimensionnez-les par le coin, retirez-les avec ×, ajoutez-en avec + (en bas à gauche), ⟲ rétablit
  la disposition par défaut. La disposition est mémorisée dans `data/hud_layout.json`.
- Le réacteur réagit à votre voix pendant l'écoute et à celle de Jarvis quand il parle.

## Réglages (`config.yaml`)
- `hud.ecran` : écran du HUD (0 = principal, -1 = dernier ; mettez l'index du 20" une fois branché).
- `hud.meteo` : ville et coordonnées. `hud.agenda_ics` : adresse iCal secrète (Google, iCloud, Outlook) ou fichier `.ics`.
- `listen.silence_rms` : seuil de début de parole ; réglez-le avec `--micro` (entre le bruit de fond et votre voix).
- `wake.threshold` : sensibilité de « Hey Jarvis ».

Tests : `.\.venv\Scripts\python -m pytest`
