"""Presse-papier Windows (texte Unicode) via l'API Win32 : instantané, accents conservés."""
import ctypes
import sys
import time

from jarvis.tools import tool

CF_UNICODETEXT, GMEM_MOVEABLE = 13, 0x0002

if sys.platform == "win32":
    u32, k32 = ctypes.windll.user32, ctypes.windll.kernel32
    u32.OpenClipboard.argtypes, u32.OpenClipboard.restype = [ctypes.c_void_p], ctypes.c_int
    u32.GetClipboardData.argtypes, u32.GetClipboardData.restype = [ctypes.c_uint], ctypes.c_void_p
    u32.SetClipboardData.argtypes, u32.SetClipboardData.restype = [ctypes.c_uint, ctypes.c_void_p], ctypes.c_void_p
    k32.GlobalAlloc.argtypes, k32.GlobalAlloc.restype = [ctypes.c_uint, ctypes.c_size_t], ctypes.c_void_p
    k32.GlobalLock.argtypes, k32.GlobalLock.restype = [ctypes.c_void_p], ctypes.c_void_p
    k32.GlobalUnlock.argtypes = [ctypes.c_void_p]


def _open():
    for _ in range(20):  # une autre appli peut tenir le presse-papier un court instant
        if u32.OpenClipboard(None):
            return
        time.sleep(0.05)
    raise OSError("presse-papier occupé")


def read():
    _open()
    try:
        h = u32.GetClipboardData(CF_UNICODETEXT)
        if not h:
            return ""
        p = k32.GlobalLock(h)
        try:
            return ctypes.wstring_at(p)
        finally:
            k32.GlobalUnlock(h)
    finally:
        u32.CloseClipboard()


def write(text):
    data = (text + "\0").encode("utf-16-le")
    h = k32.GlobalAlloc(GMEM_MOVEABLE, len(data))
    p = k32.GlobalLock(h)
    ctypes.memmove(p, data, len(data))
    k32.GlobalUnlock(h)
    _open()
    try:
        u32.EmptyClipboard()
        u32.SetClipboardData(CF_UNICODETEXT, h)
    finally:
        u32.CloseClipboard()


@tool()
def presse_papier() -> str:
    """Lit le texte actuellement copié dans le presse-papier (pour le résumer, le traduire, le corriger…)."""
    t = read()
    if not t.strip():
        return "Le presse-papier ne contient pas de texte."
    return t if len(t) <= 3000 else t[:3000] + f"\n[… tronqué, {len(t)} caractères au total]"


@tool()
def copier(texte: str) -> str:
    """Copie un texte dans le presse-papier, pour que l'utilisateur puisse le coller.

    Args:
      texte: le texte à copier
    """
    write(texte)
    return f"Copié ({len(texte)} caractères)."
