"""Build the full Zhara logo asset suite from assets/logo/zhara-logo-source.png.

Requires: pip install pillow numpy; brew install potrace
Run from anywhere: python3 tools/build_logo.py
"""
import os, re, subprocess, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SITE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = f"{SITE}/assets/logo/zhara-logo-source.png"
OUT = f"{SITE}/assets/logo"
ORANGE = np.array([254, 99, 23])
NAVY = np.array([9, 26, 65])
WHITE = np.array([255, 255, 255])
HEX = lambda c: "#%02X%02X%02X" % tuple(int(v) for v in c)

src = np.asarray(Image.open(SRC).convert("RGB")).astype(float)

# --- separate the two inks from the white background --------------------
# alpha per ink = how far the pixel moved from white toward that ink colour
def ink_alpha(ink):
    d = (255 - src) / np.maximum(255 - ink, 1)
    # weight channels by how much the ink differs from white
    w = (255 - ink) / (255 - ink).sum()
    return np.clip((d * w).sum(2), 0, 1)

is_orange = (src[:, :, 0] - src[:, :, 2]) > 12
a_orange = np.where(is_orange, ink_alpha(ORANGE), 0)
a_navy = np.where(~is_orange, ink_alpha(NAVY), 0)
# kill background noise / jpeg-ish speckle
FLOOR = 0.12
a_orange = np.clip((a_orange - FLOOR) / (0.95 - FLOOR), 0, 1)
a_navy = np.clip((a_navy - FLOOR) / (0.95 - FLOOR), 0, 1)

def bbox(mask):
    ys, xs = np.where(mask > 0.02)
    return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1

full_box = bbox(np.maximum(a_orange, a_navy))
mark_box = bbox(a_orange)

def rgba(colour_orange, colour_navy, box):
    x0, y0, x1, y1 = box
    ao, an = a_orange[y0:y1, x0:x1], a_navy[y0:y1, x0:x1]
    alpha = np.maximum(ao, an)
    rgb = np.where((ao >= an)[..., None], colour_orange, colour_navy)
    img = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    return Image.fromarray(img, "RGBA")

full = rgba(ORANGE, NAVY, full_box)
full_on_dark = rgba(ORANGE, WHITE, full_box)
full_white = rgba(WHITE, WHITE, full_box)
full_black = rgba(NAVY, NAVY, full_box)
mark = rgba(ORANGE, NAVY, mark_box)
mark_white = rgba(WHITE, WHITE, mark_box)

def resize_w(img, w):
    h = round(img.height * w / img.width)
    return img.resize((w, h), Image.LANCZOS)

def square(img, size, pad=0.12, bg=None):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0) if bg is None else bg)
    inner = round(size * (1 - 2 * pad))
    scale = inner / max(img.size)
    m = img.resize((max(1, round(img.width * scale)), max(1, round(img.height * scale))), Image.LANCZOS)
    canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
    return canvas

os.makedirs(OUT, exist_ok=True)

# --- raster: full logo -------------------------------------------------
for name, img in [("zhara-logo", full), ("zhara-logo-on-dark", full_on_dark),
                  ("zhara-logo-white", full_white), ("zhara-logo-mono", full_black)]:
    img.save(f"{OUT}/{name}.png", optimize=True)            # native size
    for w in (380, 760, 1520):
        resize_w(img, w).save(f"{OUT}/{name}-{w}.png", optimize=True)

# --- raster: mark ------------------------------------------------------
for name, img in [("zhara-mark", mark), ("zhara-mark-white", mark_white)]:
    for s in (256, 512, 1024):
        square(img, s, pad=0.04).save(f"{OUT}/{name}-{s}.png", optimize=True)

# --- icons -------------------------------------------------------------
for s in (16, 32, 48):
    square(mark, s, pad=0.04 if s <= 32 else 0.06).save(f"{OUT}/favicon-{s}.png", optimize=True)
white_bg = (255, 255, 255, 255)
square(mark, 180, pad=0.18, bg=white_bg).save(f"{OUT}/apple-touch-icon.png", optimize=True)
square(mark, 192, pad=0.14, bg=white_bg).save(f"{OUT}/android-chrome-192.png", optimize=True)
square(mark, 512, pad=0.14, bg=white_bg).save(f"{OUT}/android-chrome-512.png", optimize=True)
# maskable: logo must sit inside the 80% safe zone
square(mark, 512, pad=0.24, bg=white_bg).save(f"{OUT}/maskable-512.png", optimize=True)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
square(mark, 256, pad=0.04).save(f"{SITE}/favicon.ico", sizes=ico_sizes)

# --- OG image 1200x630 -------------------------------------------------
og = Image.new("RGBA", (1200, 630), (255, 255, 255, 255))
logo = resize_w(full, 780)
og.alpha_composite(logo, ((1200 - logo.width) // 2, (600 - logo.height) // 2))
ImageDraw.Draw(og).rectangle([0, 620, 1200, 630], fill=tuple(ORANGE) + (255,))
og.convert("RGB").save(f"{SITE}/assets/og.png", optimize=True)

# --- SVG via potrace (trace each ink at 4x for smooth curves) -----------
SCALE = 4
def trace(alpha, box):
    x0, y0, x1, y1 = box
    a = Image.fromarray((alpha[y0:y1, x0:x1] * 255).astype(np.uint8), "L")
    a = a.resize((a.width * SCALE, a.height * SCALE), Image.LANCZOS)
    bw = a.point(lambda v: 0 if v >= 128 else 255).convert("1")  # ink = black
    with tempfile.TemporaryDirectory() as t:
        bw.save(f"{t}/in.bmp")
        subprocess.run(["potrace", f"{t}/in.bmp", "-s", "-o", f"{t}/out.svg",
                        "--turdsize", "8", "--alphamax", "1.0", "--opttolerance", "0.2",
                        "--unit", "10"], check=True)
        svg = open(f"{t}/out.svg").read()
    g = re.search(r"(<g transform=.*?</g>)", svg, re.S).group(1)
    g = re.sub(r'fill="[^"]*"', "", g)
    g = re.sub(r"\s+stroke=\"none\"", "", g)
    return g

def svg_doc(box, layers, title):
    x0, y0, x1, y1 = box
    w, h = (x1 - x0) * SCALE, (y1 - y0) * SCALE
    body = "\n".join(f'<g fill="{fill}">{g}</g>' for fill, g in layers)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'role="img" aria-label="{title}">\n<title>{title}</title>\n{body}\n</svg>\n')

g_mark_full = trace(a_orange, full_box)
g_word_full = trace(a_navy, full_box)
g_mark = trace(a_orange, mark_box)

variants = {
    "zhara-logo.svg": (HEX(ORANGE), HEX(NAVY)),
    "zhara-logo-on-dark.svg": (HEX(ORANGE), "#FFFFFF"),
    "zhara-logo-white.svg": ("#FFFFFF", "#FFFFFF"),
    "zhara-logo-mono.svg": (HEX(NAVY), HEX(NAVY)),
}
for fname, (fo, fn) in variants.items():
    open(f"{OUT}/{fname}", "w").write(svg_doc(full_box, [(fo, g_mark_full), (fn, g_word_full)], "Zhara"))
open(f"{OUT}/zhara-mark.svg", "w").write(svg_doc(mark_box, [(HEX(ORANGE), g_mark)], "Zhara"))
open(f"{OUT}/zhara-mark-white.svg", "w").write(svg_doc(mark_box, [("#FFFFFF", g_mark)], "Zhara"))
# favicon.svg: square viewBox around the mark
mx0, my0, mx1, my1 = mark_box
mw, mh = (mx1 - mx0) * SCALE, (my1 - my0) * SCALE
side = max(mw, mh)
fav = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-(side-mw)/2} {-(side-mh)/2} {side} {side}">\n'
       f'<g fill="{HEX(ORANGE)}">{g_mark}</g>\n</svg>\n')
open(f"{OUT}/favicon.svg", "w").write(fav)

print("full", full.size, "mark", mark.size, "ratio", round(full.width / full.height, 3))
