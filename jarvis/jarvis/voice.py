import re
import time

import numpy as np
import sounddevice as sd
from piper import PiperVoice


class Voice:
    def __init__(self, model_path):
        self.v = PiperVoice.load(str(model_path))
        self.rate = self.v.config.sample_rate
        self.on_level = lambda v: None  # niveau de la voix 0..1 pendant la parole (HUD)

    def say(self, text):
        text = re.sub(r"[*#`_>|]", "", text).strip()
        if not text:
            return
        audio = np.frombuffer(b"".join(c.audio_int16_bytes for c in self.v.synthesize(text)), np.int16)
        self._play(audio)

    def _play(self, audio):
        step = int(self.rate * 0.05)
        levels = [np.sqrt(np.mean(audio[i:i + step].astype(np.float32) ** 2)) / 6000 for i in range(0, len(audio), step)]
        sd.play(audio, self.rate)
        t0 = time.time()
        for i, lv in enumerate(levels):
            time.sleep(max(0.0, t0 + i * 0.05 - time.time()))
            self.on_level(min(1.0, lv))
        sd.wait()
        self.on_level(0.0)

    def chime(self):
        t = np.linspace(0, 0.15, int(self.rate * 0.15), False)
        tone = np.concatenate([np.sin(2 * np.pi * f * t) for f in (880, 1320)]) * 0.2
        sd.play(tone.astype(np.float32), self.rate, blocking=True)
