$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
function Assert-Ok($etape) { if ($LASTEXITCODE -ne 0) { throw "Échec : $etape (code $LASTEXITCODE)" } }
# Python 3.11 exigé : les paquets audio (onnxruntime, piper) ne suivent pas toujours la dernière version.
$py = Get-Command py -ErrorAction SilentlyContinue
if ($py) { & py -3.11 -m venv .venv } else { python -m venv .venv }
Assert-Ok "création du venv (Python 3.11 installé ?)"
.\.venv\Scripts\python -m pip install -U pip; Assert-Ok "mise à jour de pip"
.\.venv\Scripts\python -m pip install -r requirements.txt; Assert-Ok "installation des dépendances"
.\.venv\Scripts\python -c "import openwakeword.utils as u; u.download_models(['hey_jarvis'])"; Assert-Ok "modèle hey_jarvis"
New-Item -ItemType Directory -Force voices | Out-Null
$base = "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/tom/medium/fr_FR-tom-medium.onnx"
Invoke-WebRequest $base -OutFile voices\fr_FR-tom-medium.onnx
Invoke-WebRequest "$base.json" -OutFile voices\fr_FR-tom-medium.onnx.json
ollama pull qwen3:4b; Assert-Ok "téléchargement du modèle Ollama"
Write-Host "Installation terminée. Lancez : .\.venv\Scripts\python -m jarvis"
