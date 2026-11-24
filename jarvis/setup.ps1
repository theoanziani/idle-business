$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
python -m venv .venv
.\.venv\Scripts\python -m pip install -U pip
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python -c "import openwakeword.utils as u; u.download_models(['hey_jarvis'])"
New-Item -ItemType Directory -Force voices | Out-Null
$base = "https://huggingface.co/rhasspy/piper-voices/resolve/main/fr/fr_FR/tom/medium/fr_FR-tom-medium.onnx"
Invoke-WebRequest $base -OutFile voices\fr_FR-tom-medium.onnx
Invoke-WebRequest "$base.json" -OutFile voices\fr_FR-tom-medium.onnx.json
ollama pull qwen3:4b
Write-Host "Installation terminée. Lancez : .\.venv\Scripts\python -m jarvis"
