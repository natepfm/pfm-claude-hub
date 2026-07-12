#!/usr/bin/env python3
"""Counter GLOW overlays v2 — Sam 07-10 ("the NUMBERS need to ray or glow").
The count digits themselves light up: QVC-red digits + layered gold glow rendered at
glyph level (CSS text-shadow) as a LIT state per value, animated normal->lit->normal
with an extra PIL bloom. States render from the CURRENT v3.1 template (real SMA
wordmark chip — the stale-template logo drop is fixed by exec'ing the live script).
Usage: qvc_counter_glow.py <60|10>
"""
import os, sys, math, shutil, subprocess, tempfile
from PIL import Image, ImageChops, ImageFilter

MODE = sys.argv[1]
FPS = 24
W, H = 1920, 1080
SRC = ("/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/Auto - Completed Creatives/"
       "Auto - 2026/Auto - July 2026/07.08.26 - Roku CTV Calls - SaveMaxAuto Live QVC - Houston/"
       "Elements/Graphics/Broadcast Overlays v3.1")
OUTDIR = SRC + " Animated"
FF = shutil.which("ffmpeg") or os.path.expanduser("~/bin/ffmpeg")

# ---- exec the CURRENT v3.1 template (real SMA wordmark chip)
v3 = open(os.path.expanduser("~/.claude/skills/qvc-screen-graphics/scripts/qvc_overlays_v3.py")).read()
prefix = v3.split("# ------------------------------------------------------------------ render all")[0]
ns = {}
exec(prefix, ns)
ns_out = {"OUT": SRC}
ns.update(ns_out)

LIT_SPAN = ('<span style="color:#c8102e; text-shadow:0 0 6px rgba(232,182,76,.95), '
            '0 0 14px rgba(232,182,76,.75), 0 0 28px rgba(232,182,76,.5);">')

PHONE = "(713) 936-4745"

def state_files(count):
    """Render normal + PHONELIT states for a count value (skip if already on disk).
    The LIT state lights the PHONE NUMBER (the CTA), not the counter — Sam 07-10."""
    slug = count.replace(",", "").replace("+", "plus")
    normal, lit = f"Order Bar - {slug}.png", f"Order Bar - {slug} PHONELIT.png"
    body = ns["order_bar"](count)
    if not os.path.exists(os.path.join(SRC, normal)):
        ns["render"](normal, body)
        print("rendered", normal, flush=True)
    needle = f">{PHONE}</div>"
    assert needle in body, "phone needle not found"
    lit_body = body.replace(needle, f">{LIT_SPAN}{PHONE}</span></div>")
    if not os.path.exists(os.path.join(SRC, lit)):
        ns["render"](lit, lit_body)
        print("rendered", lit, flush=True)
    return normal, lit

def load(name): return Image.open(os.path.join(SRC, name)).convert("RGBA")
def ease_in_out(p): return 3 * p * p - 2 * p * p * p

def diff_bbox(a, b, pad=44):
    bb = ImageChops.difference(a, b).convert("RGB").getbbox()
    x0, y0, x1, y1 = bb
    return (max(0, x0 - pad), max(0, y0 - pad), min(W, x1 + pad), min(H, y1 + pad))

class Enc:
    def __init__(self):
        self.tmp = tempfile.mkdtemp(prefix="glow_")
        self.i = 0
        self.total = 0
        self.lines = ["ffconcat version 1.0"]
    def add(self, img, nframes):
        f = f"f_{self.i:05d}.png"; self.i += 1
        self.total += nframes
        img.save(os.path.join(self.tmp, f))
        self.lines.append(f"file '{f}'")
        self.lines.append(f"duration {nframes / FPS:.6f}")
    def finish(self, name):
        last = [l for l in self.lines if l.startswith("file")][-1]
        self.lines.append(last)
        lst = os.path.join(self.tmp, "list.txt")
        open(lst, "w").write("\n".join(self.lines))
        dest = os.path.join(OUTDIR, name)
        subprocess.run([FF, "-y", "-f", "concat", "-safe", "0", "-i", lst,
                        "-vf", f"fps={FPS}", "-frames:v", str(self.total),
                        "-c:v", "prores_ks", "-profile:v", "4444",
                        "-pix_fmt", "yuva444p10le", dest], check=True, capture_output=True)
        shutil.rmtree(self.tmp)
        return dest

GLOW_FRAMES = 32  # ~1.33s per light-up

def light_burst(enc, normal, lit):
    """Digits blend to red-gold LIT + PIL bloom, then back. Glyph-true glow."""
    bb = diff_bbox(normal, lit)
    reg_n, reg_l = normal.crop(bb), lit.crop(bb)
    # bloom layer from the lit-vs-normal glyph diff
    mask = ImageChops.difference(reg_l, reg_n).convert("L").point(lambda v: min(255, v * 3))
    mask = mask.filter(ImageFilter.GaussianBlur(9))
    gold = Image.new("RGBA", reg_n.size, (255, 208, 112, 0))
    gold.putalpha(mask)
    for i in range(GLOW_FRAMES):
        p = (i + 1) / GLOW_FRAMES
        env = math.sin(math.pi * p) ** 0.85
        reg = Image.blend(reg_n, reg_l, env)
        bloom = gold.copy()
        bloom.putalpha(bloom.getchannel("A").point(lambda v: int(v * 0.85 * env)))
        reg.alpha_composite(bloom)
        f = normal.copy()
        f.paste(reg, bb[:2])
        enc.add(f, 1)

def tick_frames(enc, a, b):
    bb = diff_bbox(a, b, pad=10)
    x0, y0, x1, y1 = bb; rw, rh = x1 - x0, y1 - y0
    ca, cb = a.crop(bb), b.crop(bb)
    for i in range(14):
        p = ease_in_out((i + 1) / 14)
        f = a.copy()
        reg = Image.new("RGBA", (rw, rh), (0, 0, 0, 0))
        off = int(rh * p)
        reg.alpha_composite(ca, (0, -off))
        reg.alpha_composite(cb, (0, rh - off))
        f.paste(reg, (x0, y0))
        enc.add(f, 1)

if MODE == "60":
    COUNTS = ["4,251", "4,262", "4,274", "4,285", "4,293", "4,300+"]
    pairs = [state_files(c) for c in COUNTS]
    imgs = [(load(n), load(l)) for n, l in pairs]
    enc = Enc()
    cycle = 10 * FPS
    anim = 14 + GLOW_FRAMES
    enc.add(imgs[0][0], cycle)
    for k in range(1, 6):
        tick_frames(enc, imgs[k - 1][0], imgs[k][0])
        light_burst(enc, imgs[k][0], imgs[k][1])
        enc.add(imgs[k][0], cycle - anim)
    dest = enc.finish("Phone Glow 60s - ticks 4251 to 4300plus.mov")
    print("ENCODED60", dest, flush=True)
else:
    n, l = state_files("4,300+")
    normal, lit = load(n), load(l)
    enc = Enc()
    pre = 5 * FPS
    enc.add(normal, pre)
    light_burst(enc, normal, lit)
    enc.add(normal, 10 * FPS - pre - GLOW_FRAMES)
    dest = enc.finish("Phone Glow 10s - 4300plus loop.mov")
    print("ENCODED10", dest, flush=True)

r = subprocess.run([FF, "-i", dest], capture_output=True, text=True)
info = [x.strip() for x in r.stderr.splitlines() if "Video:" in x or "Duration" in x]
print("\n".join(info))
print("ALPHA", "PASS" if any("yuva" in x for x in info) else "FAIL")
