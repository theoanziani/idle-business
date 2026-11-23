import re

import numpy as np
import sounddevice as sd
from piper import PiperVoice


class Voice:
    def __init__(self, model_path):
        self.v = PiperVoice.load(str(model_path))
        self.rate = self.v.config.sample_rate

    def say(self, text):
        text = re.sub(r"[*#`_>|]", "", text).strip()
        if not text:
            return
        audio = b"".join(c.audio_int16_bytes for c in self.v.synthesize(text))
        sd.play(np.frombuffer(audio, np.int16), self.rate, blocking=True)

    def chime(self):
        t = np.linspace(0, 0.15, int(self.rate * 0.15), False)
        tone = np.concatenate([np.sin(2 * np.pi * f * t) for f in (880, 1320)]) * 0.2
        sd.play(tone.astype(np.float32), self.rate, blocking=True)
