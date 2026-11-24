import gc
import os
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


class Ears:
    def __init__(self, cfg):
        self.wcfg, self.lcfg, self.scfg = cfg["wake"], cfg["listen"], cfg["whisper"]
        self.wake = Model(wakeword_models=[self.wcfg["model"]], inference_framework="onnx")
        self.stream = sd.InputStream(samplerate=RATE, channels=1, dtype="int16", blocksize=FRAME)
        self.stream.start()
        self._whisper, self._last, self._lock = None, 0.0, threading.Lock()
        self.on_level = lambda v: None  # niveau du micro 0..1 pendant l'écoute (HUD)

    def _read(self):
        return self.stream.read(FRAME)[0][:, 0]

    def _flush(self):
        self.stream.read(self.stream.read_available)

    def wait_wake(self):
        self._flush()
        while True:
            if self._whisper and time.time() - self._last > self.scfg["idle_unload_s"]:
                self._whisper = None
                gc.collect()
            if max(self.wake.predict(self._read()).values()) > self.wcfg["threshold"]:
                self.wake.reset()
                return

    def whisper(self):
        with self._lock:
            if not self._whisper:
                _cuda_dlls()
                from faster_whisper import WhisperModel
                self._whisper = WhisperModel(self.scfg["model"], device=self.scfg["device"], compute_type=self.scfg["compute_type"])
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
        return " ".join(s.text for s in segs).strip()
