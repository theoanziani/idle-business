"""Icône de la zone de notification (pystray)."""
from PIL import Image, ImageDraw
import pystray


def icon_image(size=64):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c, cyan = size / 2, (60, 220, 255, 255)
    for r, w in ((size * 0.46, 3), (size * 0.32, 2)):
        d.ellipse((c - r, c - r, c + r, c + r), outline=cyan, width=w)
    r = size * 0.16
    d.ellipse((c - r, c - r, c + r, c + r), fill=(180, 245, 255, 255))
    return img


class Tray:
    def __init__(self, on_show, on_quit, autostart_get, autostart_set):
        self.icon = pystray.Icon("jarvis", icon_image(), "Jarvis — dis « Hey Jarvis »", menu=pystray.Menu(
            pystray.MenuItem("Afficher le HUD", lambda: on_show(), default=True),
            pystray.MenuItem("Lancer avec Windows", lambda: autostart_set(not autostart_get()),
                             checked=lambda _: autostart_get()),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem("Quitter", lambda: (self.icon.stop(), on_quit())),
        ))

    def start(self):
        self.icon.run_detached()

    def notify(self, text):
        try:
            self.icon.notify(text, "Jarvis")
        except Exception:
            pass
