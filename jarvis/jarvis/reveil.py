"""Vérificateur du mot d'activation entraîné sur la voix de l'utilisateur (openWakeWord « custom verifier »).

Le modèle « hey_jarvis » est entraîné sur un accent anglais : avec un accent français il ne dépasse parfois pas 0,12,
d'où un seuil bas… qui laisse passer d'autres voix. Le vérificateur (régression logistique sur les mêmes
caractéristiques audio) apprend à reconnaître CETTE voix disant « Hey Jarvis » et rejette le reste.
"""
import pickle
import re
import time
import wave

import numpy as np

RATE = 16000


def _save(path, audio):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1), w.setsampwidth(2), w.setframerate(RATE), w.writeframes(audio.tobytes())


def _record(seconds):
    """Enregistre ; si le pilote du micro lâche (MME error 6, déjà observé sur ce PC), on rouvre et on recommence."""
    import sounddevice as sd
    for attempt in range(5):
        try:
            out = []
            with sd.InputStream(samplerate=RATE, channels=1, dtype="int16", blocksize=1280) as s:
                for _ in range(int(seconds * RATE / 1280)):
                    out.append(s.read(1280)[0][:, 0].copy())
            return np.concatenate(out)
        except sd.PortAudioError as e:
            print(f"\n  [micro] {e} — on recommence cette prise.", flush=True)
            time.sleep(1 + attempt)
    raise RuntimeError("Micro indisponible.")


def _countdown(label, n=2):
    for i in range(n, 0, -1):
        print(f"\r  {label} dans {i}…   ", end="", flush=True)
        time.sleep(1)
    print()


def record_session(folder, n_pos=12, n_neg=4):
    folder.mkdir(parents=True, exist_ok=True)
    print("\n=== 1/2 : dites « Hey Jarvis » à chaque TOP, à votre distance habituelle ===")
    for i in range(1, n_pos + 1):
        if (folder / f"pos_{i:02d}.wav").exists():  # reprise d'une session interrompue
            continue
        _countdown(f"Prise {i}/{n_pos}")
        print(f"  >>> TOP {i}/{n_pos} : « Hey Jarvis » <<<", flush=True)
        _save(folder / f"pos_{i:02d}.wav", _record(2.5))
    print("\n=== 2/2 : parlez normalement, SANS dire « Hey Jarvis » ===")
    consignes = ["Racontez votre journée", "Lisez une phrase à voix haute", "Parlez comme au téléphone",
                 "Laissez une vidéo, de la musique ou la télé tourner (ou le silence)"]
    for i in range(1, n_neg + 1):
        if (folder / f"neg_{i:02d}.wav").exists():
            continue
        _countdown(f"Prise {i}/{n_neg} : {consignes[(i - 1) % len(consignes)]}", 3)
        print(f"  >>> TOP {i}/{n_neg} : parlez 6 secondes <<<", flush=True)
        _save(folder / f"neg_{i:02d}.wav", _record(6))


def train(folder, output, base_threshold=0.05):
    """Entraîne le vérificateur (format openWakeWord) à partir des prises enregistrées."""
    import openwakeword
    from openwakeword.custom_verifier_model import get_reference_clip_features, train_verifier_model

    oww = openwakeword.Model(wakeword_models=["hey_jarvis"], inference_framework="onnx")
    pos_clips, neg_clips = sorted(folder.glob("pos_*.wav")), sorted(folder.glob("neg_*.wav"))
    pos = [get_reference_clip_features(str(p), oww, "hey_jarvis", threshold=base_threshold, N=5) for p in pos_clips]
    pos = [p for p in pos if len(p)]
    if not pos:
        raise ValueError("Aucune prise « Hey Jarvis » exploitable (micro trop faible ?).")
    neg = np.vstack([get_reference_clip_features(str(n), oww, "hey_jarvis", threshold=0.0, N=1) for n in neg_clips])
    pos = np.vstack(pos)
    model = train_verifier_model(np.vstack((pos, neg)), np.array([1] * len(pos) + [0] * len(neg)))
    output.parent.mkdir(parents=True, exist_ok=True)
    with open(output, "wb") as f:
        pickle.dump(model, f)
    return len([p for p in pos_clips]), len(pos), len(neg)


def evaluate(folder, verifier, base_threshold=0.05):
    """Score maximal de chaque prise, avec le vérificateur (ce que Jarvis utilisera)."""
    from openwakeword.model import Model
    m = Model(wakeword_models=["hey_jarvis"], inference_framework="onnx",
              custom_verifier_models={"hey_jarvis": str(verifier)}, custom_verifier_threshold=base_threshold)
    res = {}
    for clip in sorted(folder.glob("*.wav")):
        with wave.open(str(clip)) as w:
            a = np.frombuffer(w.readframes(w.getnframes()), np.int16)
        a = np.concatenate([np.zeros(RATE // 2, np.int16), a, np.zeros(RATE // 2, np.int16)])
        m.reset()
        res[clip.name] = max(max(m.predict(a[i:i + 1280]).values()) for i in range(0, len(a) - 1280, 1280))
    return res


WAKE_HEARD = re.compile(r"jar|arvi|harv|djav|jav", re.I)  # Whisper entend « Hey Jarvis », « Head Jarvis », « Et Jarvis »…
NOT_SPEECH = re.compile(r"sous-titr|amara|merci d'avoir", re.I)


def looks_like_wake(text):
    """Whisper (en français) déforme souvent « Hey Jarvis » : « Hey Jobbies », « Hey Jean », « Et j'en revise »…
    On accepte donc toute courte prise de parole (1 à 4 mots) qui n'est pas une hallucination."""
    t = text.strip()
    if not t or NOT_SPEECH.search(t):
        return False
    return bool(WAKE_HEARD.search(t)) or 1 <= len(re.findall(r"[\w']+", t)) <= 4


def guided_session(cfg, folder, n_pos=10, n_neg=3):
    """Entraînement guidé à la voix : consignes parlées, bip avant chaque prise, chaque prise vérifiée par Whisper
    (une prise sans « Hey Jarvis » est recommencée). Pas besoin de regarder l'écran."""
    from faster_whisper import WhisperModel

    from jarvis import config
    from jarvis.ears import _cuda_dlls
    from jarvis.voice import Speaker

    vcfg = dict(cfg["voice"], model=config.resolve(cfg["voice"]["model"]))
    voice = Speaker(vcfg, config.resolve(vcfg.get("cache", "data/voix_cache")))
    _cuda_dlls()
    stt = WhisperModel(str(config.resolve(cfg["whisper"]["model"])), device=cfg["whisper"]["device"],
                       compute_type=cfg["whisper"]["compute_type"])

    def heard(audio):
        a = audio.astype(np.float32)
        a = a / max(np.abs(a).max(), 1) * 0.5
        return " ".join(s.text for s in stt.transcribe(a, language="fr")[0]).strip()

    folder.mkdir(parents=True, exist_ok=True)
    voice.say("Entraînement du mot d'activation. Après chaque bip, dis Hey Jarvis, à ta distance habituelle.")
    i = len(list(folder.glob("pos_*.wav")))
    fails = 0
    while i < n_pos and fails < 8:
        voice.chime()
        audio = _record(2.5)
        text = heard(audio)
        if looks_like_wake(text):
            i += 1
            _save(folder / f"pos_{i:02d}.wav", audio)
            print(f"  ✓ prise {i}/{n_pos} : « {text} »", flush=True)
        else:
            fails += 1
            print(f"  ✗ « {text or '(rien)'} » : on recommence", flush=True)
            voice.say("Je n'ai pas entendu Hey Jarvis. On recommence.")
    if i < n_pos:
        voice.say("Je n'arrive pas à bien t'entendre. On réessaiera plus tard.")
        raise RuntimeError(f"seulement {i} prises valides")
    voice.say("Parfait. Maintenant, parle normalement pendant six secondes après chaque bip, sans dire Hey Jarvis.")
    j = len(list(folder.glob("neg_*.wav")))
    while j < n_neg:
        voice.chime()
        audio = _record(6)
        text = heard(audio)
        if WAKE_HEARD.search(text):
            voice.say("Sans dire Hey Jarvis, s'il te plaît.")
            continue
        if len(re.findall(r"[\w']+", text)) < 4:
            voice.say("Je n'ai presque rien entendu. Parle un peu plus, s'il te plaît.")
            continue
        j += 1
        _save(folder / f"neg_{j:02d}.wav", audio)
        print(f"  ✓ phrase normale {j}/{n_neg} : « {text} »", flush=True)
    voice.say("Merci. J'entraîne le vérificateur.")
    return voice


def session(cfg):
    from jarvis import config
    folder = config.resolve("data/reveil")
    output = config.resolve(cfg["wake"].get("verifier", "data/reveil_verificateur.pkl"))
    base = cfg["wake"].get("verifier_base", 0.05)
    seuil = cfg["wake"].get("verifier_threshold", 0.5)
    voice = guided_session(cfg, folder)
    print("\nEntraînement…", flush=True)
    n, npos, nneg = train(folder, output, base)
    print(f"Vérificateur enregistré : {output} ({n} prises, {npos} exemples positifs, {nneg} négatifs)")
    scores = evaluate(folder, output, base)
    pos = [v for k, v in scores.items() if k.startswith("pos")]
    neg = [v for k, v in scores.items() if k.startswith("neg")]
    print(f"« Hey Jarvis » reconnus : {sum(v > seuil for v in pos)}/{len(pos)}  (scores {', '.join(f'{v:.2f}' for v in pos)})")
    print(f"Faux réveils sur la parole normale : {sum(v > seuil for v in neg)}/{len(neg)}  (scores {', '.join(f'{v:.2f}' for v in neg)})")
    voice.say(f"C'est bon. J'ai reconnu {sum(v > seuil for v in pos)} Hey Jarvis sur {len(pos)}.")
