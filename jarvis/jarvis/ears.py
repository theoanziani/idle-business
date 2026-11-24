import gc
import os
import re
import sys
import threading
import time
from pathlib import Path

import numpy as np
import sounddevice as sd
from openwakeword.model import Model

RATE, FRAME = 16000, 1280  # 80 ms


def _cuda_dlls():
    """Rend visibles les DLL CUDA installées par pip (nvidia-cublas / cudnn) sous Windows."""
    if sys.platform == "win32":
        for d in Path(sys.prefix, "Lib/site-packages/nvidia").glob("*/bin"):
            os.add_dll_directory(str(d))
            os.environ["PATH"] = f"{d};{os.environ['PATH']}"


# Phrases que Whisper invente sur du bruit ou du silence (apprises sur des sous-titres de vidéos).
HALLUCINATIONS = re.compile(r"sous-titr|amara\.org|merci d'avoir regard|abonnez-vous|n'oubliez pas de vous abonner"
                            r"|^\W*(merci|musique)\W*$", re.I)


def clean_transcript(segments):
    """Garde les segments où Whisper entend vraiment de la parole ; retire hallucinations et répétitions."""
    kept = []
    for s in segments:
        text = s.text.strip()
        if not text or HALLUCINATIONS.search(text):
            continue
        if getattr(s, "no_speech_prob", 0) > 0.6 and getattr(s, "avg_logprob", 0) < -0.8:
            continue
        if kept and text.lower() == kept[-1].lower():  # « C'est une idée. C'est une idée. C'est une idée. »
            continue
        kept.append(text)
    return " ".join(kept).strip()


def load_wake(cfg):
    """Modèle « Hey Jarvis », avec le vérificateur entraîné sur la voix de l'utilisateur s'il existe
    (python -m jarvis --entrainer-reveil). Renvoie (modèle, seuil de réveil)."""
    from jarvis import config
    w = cfg["wake"]
    verifier = config.resolve(w.get("verifier", "data/reveil_verificateur.pkl"))
    if verifier.exists():
        model = Model(wakeword_models=[w["model"]], inference_framework="onnx",
                      custom_verifier_models={w["model"]: str(verifier)},
                      custom_verifier_threshold=w.get("verifier_base", 0.05))
        return model, w.get("verifier_threshold", 0.5)
    return Model(wakeword_models=[w["model"]], inference_framework="onnx"), w["threshold"]


class Ears:
    def __init__(self, cfg):
        self.wcfg, self.lcfg, self.scfg = cfg["wake"], cfg["listen"], cfg["whisper"]
        self.wake, self.threshold = load_wake(cfg)
        self.stream = sd.InputStream(samplerate=RATE, channels=1, dtype="int16", blocksize=FRAME)
        self.stream.start()
        self._whisper, self._last, self._lock = None, 0.0, threading.Lock()
        self.on_level = lambda v: None  # niveau du micro 0..1 pendant l'écoute (HUD)

    def _read(self):
        """Lit 80 ms. Si le pilote lâche (MME error 6, micro réinitialisé par Windows), on rouvre le flux."""
        for attempt in range(20):
            try:
                return self.stream.read(FRAME)[0][:, 0]
            except sd.PortAudioError as e:
                print(f"[micro] {e} : réouverture du flux", flush=True)
                try:
                    self.stream.close()
                except Exception:
                    pass
                time.sleep(min(5, 0.5 * (attempt + 1)))
                try:
                    self.stream = sd.InputStream(samplerate=RATE, channels=1, dtype="int16", blocksize=FRAME)
                    self.stream.start()
                except sd.PortAudioError:
                    pass
        raise RuntimeError("Micro indisponible après plusieurs tentatives.")

    def _flush(self):
        self.stream.read(self.stream.read_available)

    def wait_wake(self):
        self._flush()
        while True:
            if self._whisper and time.time() - self._last > self.scfg["idle_unload_s"]:
                self._whisper = None
                gc.collect()
            if max(self.wake.predict(self._read()).values()) > self.threshold:
                self.wake.reset()
                return

    def whisper(self):
        with self._lock:
            if not self._whisper:
                _cuda_dlls()
                from faster_whisper import WhisperModel
                from jarvis import config
                name = self.scfg["model"]  # nom (« small ») ou dossier local téléchargé par setup.ps1
                local = config.resolve(name)
                self._whisper = WhisperModel(str(local) if local.is_dir() else name, device=self.scfg["device"],
                                             compute_type=self.scfg["compute_type"])
        self._last = time.time()
        return self._whisper

    def record(self):
        self._flush()
        frames, spoke, silent = [], False, 0.0
        step = FRAME / RATE
        for _ in range(int(self.lcfg["max_s"] / step)):
            f = self._read()
            frames.append(f)
            rms = np.sqrt(np.mean(f.astype(np.float32) ** 2))
            self.on_level(min(1.0, rms / 4000))
            loud = rms > self.lcfg["silence_rms"]
            spoke |= loud
            silent = 0.0 if loud else silent + step
            limit = self.lcfg["silence_s"] if spoke else self.lcfg["start_timeout_s"]
            if silent >= limit:
                break
        return np.concatenate(frames) if spoke else None

    def listen(self):
        audio = self.record()
        if audio is None:
            return ""
        segs, _ = self.whisper().transcribe(audio.astype(np.float32) / 32768, language="fr", vad_filter=True)
        return clean_transcript(segs)
