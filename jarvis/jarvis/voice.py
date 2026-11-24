"""Voix de Jarvis.

Voix principale : Microsoft Rémy (edge-tts, en ligne). Pour la latence :
- chaque phrase est synthétisée dès qu'elle est connue (le cerveau les envoie au fil de l'eau) et jouée dans l'ordre
  pendant que les suivantes se téléchargent ;
- tout ce qui a déjà été dit est gardé en cache sur le disque (data/voix_cache) ;
- coupures réseau : quelques essais rapides, puis repli sur la voix locale Piper (chargée seulement si besoin).
"""
import asyncio
import hashlib
import queue
import re
import threading
import time
from concurrent.futures import ThreadPoolExecutor

import numpy as np
import sounddevice as sd


def clean(text):
    """Texte prêt à dire : sans markdown ni émojis."""
    text = re.sub("[\U0001F000-\U0001FAFF☀-➿️‍]", "", text or "")
    return re.sub(r" {2,}", " ", re.sub(r"[*#`_>|]", "", text)).strip()


def split_sentences(text):
    """Découpe en phrases (fin . ! ? … suivie d'un espace) ; ignore les morceaux sans lettre."""
    parts = re.split(r"(?<=[.!?…])\s+", clean(text))
    return [p for p in parts if re.search(r"\w", p)]


class SentenceStream:
    """Reçoit le texte morceau par morceau (streaming du LLM) et rend chaque phrase dès qu'elle est complète."""

    def __init__(self, emit):
        self.emit, self.buf = emit, ""

    def feed(self, piece):
        self.buf += piece or ""
        while True:
            m = re.search(r"[.!?…](?=\s)", self.buf)
            if not m:
                return
            sentence, self.buf = self.buf[:m.end()], self.buf[m.end():]
            if re.search(r"\w", sentence):
                self.emit(sentence.strip())

    def close(self):
        if re.search(r"\w", self.buf):
            self.emit(self.buf.strip())
        self.buf = ""


class Speaker:
    def __init__(self, cfg, cache_dir):
        self.cfg = cfg
        self.edge_voice = cfg.get("edge")
        self.rate = cfg.get("vitesse", "+0%")
        self.piper_path = cfg.get("model")
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.on_level = lambda v: None  # niveau de la voix 0..1 (HUD)
        self.on_start = lambda: None    # appelé quand la première phrase commence à sortir
        self._piper = None
        self._piper_lock = threading.Lock()
        # Une phrase synthétisée à la fois, dans l'ordre : la suivante se prépare pendant que la précédente est lue.
        # (Plusieurs phrases en parallèle se ralentissaient mutuellement : 6,5 s au lieu de 2 s pour la première.)
        self._pool = ThreadPoolExecutor(max_workers=cfg.get("phrases_paralleles", 1), thread_name_prefix="voix")
        self._queue = queue.Queue()
        threading.Thread(target=self._player, daemon=True, name="lecteur").start()
        self.stats = {"cache": 0, "edge": 0, "piper": 0}

    # --- Synthèse -------------------------------------------------------------------
    def _key(self, text):
        return hashlib.sha1(f"{self.edge_voice}|{self.rate}|{text}".encode("utf-8")).hexdigest()

    async def _edge_mp3(self, text):
        import edge_tts
        data = bytearray()
        async for chunk in edge_tts.Communicate(text, self.edge_voice, rate=self.rate).stream():
            if chunk["type"] == "audio":
                data += chunk["data"]
        return bytes(data)

    def _edge(self, text):
        """MP3 de Rémy. Sur ce réseau, une connexion sur deux est coupée net (~0,1 s) : on en lance plusieurs
        en parallèle, on relance aussitôt celles qui échouent, et on garde la première réussie. None si délai dépassé."""
        return asyncio.run(self._edge_race(text, self.cfg.get("paralleles", 3), self.cfg.get("delai_max_s", 4)))

    async def _edge_race(self, text, width, budget):
        loop = asyncio.get_running_loop()
        deadline = loop.time() + budget
        pending = {asyncio.ensure_future(self._edge_mp3(text)) for _ in range(width)}
        try:
            while pending:
                left = deadline - loop.time()
                if left <= 0:
                    return None
                done, pending = await asyncio.wait(pending, timeout=left, return_when=asyncio.FIRST_COMPLETED)
                for task in done:
                    if not task.exception() and task.result():
                        return task.result()
                    if loop.time() < deadline - 0.5:  # coupée : on relance aussitôt
                        pending.add(asyncio.ensure_future(self._edge_mp3(text)))
            return None
        finally:
            for task in pending:
                task.cancel()

    def _decode(self, mp3):
        import miniaudio
        d = miniaudio.decode(mp3, output_format=miniaudio.SampleFormat.SIGNED16, nchannels=1)
        return np.frombuffer(d.samples, np.int16), d.sample_rate

    def piper(self):
        with self._piper_lock:
            if self._piper is None:
                from piper import PiperVoice
                self._piper = PiperVoice.load(str(self.piper_path))
            return self._piper

    def _synth_local(self, text):
        v = self.piper()
        return np.frombuffer(b"".join(c.audio_int16_bytes for c in v.synthesize(text)), np.int16), v.config.sample_rate

    def synth(self, text):
        """(audio int16, fréquence) pour une phrase : cache disque, sinon Rémy, sinon Piper."""
        if self.edge_voice:
            path = self.cache_dir / f"{self._key(text)}.mp3"
            if path.exists():
                self.stats["cache"] += 1
                return self._decode(path.read_bytes())
            mp3 = self._edge(text)
            if mp3:
                path.write_bytes(mp3)
                self.stats["edge"] += 1
                return self._decode(mp3)
        self.stats["piper"] += 1
        return self._synth_local(text)

    def prefetch(self, phrases):
        """Met en cache des phrases fréquentes (en arrière-plan)."""
        for p in phrases:
            for s in split_sentences(p):
                self._pool.submit(self._safe_synth, s)

    def _safe_synth(self, text):
        try:
            return self.synth(text)
        except Exception as e:
            print(f"[voix] échec de synthèse : {e}", flush=True)
            return None

    # --- Lecture --------------------------------------------------------------------
    def feed(self, sentence):
        """Ajoute une phrase : synthèse lancée tout de suite, lecture dans l'ordre d'arrivée."""
        sentence = clean(sentence)
        if sentence:
            self._queue.put(self._pool.submit(self._safe_synth, sentence))

    def wait(self):
        self._queue.join()

    def say(self, text):
        for s in split_sentences(text):
            self.feed(s)
        self.wait()

    def _player(self):
        while True:
            fut = self._queue.get()
            try:
                res = fut.result()
                if res is not None:
                    self.on_start()
                    self._play(*res)
            except Exception as e:
                print(f"[voix] échec de lecture : {e}", flush=True)
            finally:
                self._queue.task_done()

    def _play(self, audio, rate):
        step = int(rate * 0.05)
        levels = [np.sqrt(np.mean(audio[i:i + step].astype(np.float32) ** 2)) / 6000 for i in range(0, len(audio), step)]
        sd.play(audio, rate)
        t0 = time.time()
        for i, lv in enumerate(levels):
            time.sleep(max(0.0, t0 + i * 0.05 - time.time()))
            self.on_level(min(1.0, lv))
        sd.wait()
        self.on_level(0.0)

    def chime(self):
        rate = 24000
        t = np.linspace(0, 0.15, int(rate * 0.15), False)
        tone = np.concatenate([np.sin(2 * np.pi * f * t) for f in (880, 1320)]) * 0.2
        sd.play(tone.astype(np.float32), rate, blocking=True)
