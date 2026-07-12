#!/usr/bin/env python3
"""Animate the QVC v3.1 overlays — PIL keyframe engine -> ProRes 4444 (real alpha).
The static state PNGs are the keyframes; animation = transforms + auto-diffed
region slides. Digits stay pixel-exact (never re-rendered), alpha native.
Outputs 24fps .mov overlay clips, full-frame 1920x1080, drop-at-100%."""
import os, math, shutil, subprocess, tempfile
from PIL import Image, ImageChops, ImageDraw, ImageFilter

FPS = 24
W, H = 1920, 1080
SRC = ("/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/Auto - Completed Creatives/"
       "Auto - 2026/Auto - July 2026/07.08.26 - Roku CTV Calls - SaveMaxAuto Live QVC - Houston/"
       "Elements/Graphics/Broadcast Overlays v3.1")
OUT = SRC + " Animated"
os.makedirs(OUT, exist_ok=True)
FF = shutil.which("ffmpeg") or os.path.expanduser("~/bin/ffmpeg")

def load(name): return Image.open(os.path.join(SRC, name)).convert("RGBA")

def ease_out_cubic(p): return 1 - (1 - p) ** 3
def ease_in_out(p): return 3 * p * p - 2 * p * p * p

def encode(frames, name):
    tmp = tempfile.mkdtemp(prefix="anim_")
    for i, im in enumerate(frames):
        im.save(f"{tmp}/f_{i:04d}.png")
    dest = os.path.join(OUT, name)
    subprocess.run([FF, "-y", "-framerate", str(FPS), "-i", f"{tmp}/f_%04d.png",
                    "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le",
                    dest], check=True, capture_output=True)
    shutil.rmtree(tmp)
    n = len(frames)
    print(f"encoded {name}  ({n}f / {n/FPS:.2f}s)")

def blank(): return Image.new("RGBA", (W, H), (0, 0, 0, 0))

def with_alpha(im, a):
    out = im.copy()
    al = out.getchannel("A").point(lambda v: int(v * a))
    out.putalpha(al)
    return out

# ---------------------------------------------------------------- entrances
def slide_in(png, dx, dy, frames=18, settle=6):
    """Slide the whole overlay in from an offset with ease-out + alpha ramp, then hold."""
    src = load(png)
    seq = []
    for i in range(frames):
        p = ease_out_cubic((i + 1) / frames)
        f = blank()
        f.alpha_composite(with_alpha(src, min(1.0, p * 1.6)),
                          (int(dx * (1 - p)), int(dy * (1 - p))))
        seq.append(f)
    seq += [src.copy() for _ in range(settle)]
    return seq

# ---------------------------------------------------------------- diff-region transitions
def diff_bbox(a, b, pad=8):
    # RGB diff — Pillow>=10 getbbox() is alpha_only by default, and our states
    # share identical alpha (same panel, different digits)
    bb = ImageChops.difference(a, b).convert("RGB").getbbox()
    if bb is None: return None
    return (max(0, bb[0]-pad), max(0, bb[1]-pad), min(W, bb[2]+pad), min(H, bb[3]+pad))

def region_slide(png_a, png_b, frames=14, hold=8, flash=False, direction="up"):
    """Old value slides out / new slides in, inside the auto-diffed changed region."""
    a, b = load(png_a), load(png_b)
    bb = diff_bbox(a, b)
    x0, y0, x1, y1 = bb; rw, rh = x1-x0, y1-y0
    ca, cb = a.crop(bb), b.crop(bb)
    seq = [a.copy() for _ in range(4)]
    for i in range(frames):
        p = ease_in_out((i + 1) / frames)
        f = a.copy()
        reg = Image.new("RGBA", (rw, rh), (0, 0, 0, 0))
        off = int(rh * p) * (1 if direction == "up" else -1)
        reg.alpha_composite(ca, (0, -off))
        reg.alpha_composite(cb, (0, (rh - off) if direction == "up" else (off - rh)))
        f.paste(reg, (x0, y0))
        seq.append(f)
    end = b.copy()
    if flash:
        for i in range(6):
            g = 1 - abs(1 - (i / 2.5))  # up-down pulse
            f = end.copy()
            ov = Image.new("RGBA", (rw, rh), (255, 255, 255, int(120 * max(0, g))))
            f.alpha_composite(ov, (x0, y0))
            seq.append(f)
    seq += [end.copy() for _ in range(hold)]
    return seq

def region_pop(png_a, png_b, frames=12, hold=8):
    """New content pops in over the diffed region (scale overshoot + fade)."""
    a, b = load(png_a), load(png_b)
    bb = diff_bbox(a, b)
    x0, y0, x1, y1 = bb; rw, rh = x1-x0, y1-y0
    cb = b.crop(bb)
    seq = [a.copy() for _ in range(3)]
    for i in range(frames):
        p = (i + 1) / frames
        s = 1.0 + 0.45 * (1 - ease_out_cubic(p))   # 1.45 -> 1.0 overshoot
        f = a.copy()
        sw, sh = int(rw * s), int(rh * s)
        big = cb.resize((sw, sh), Image.LANCZOS)
        f.alpha_composite(with_alpha(big, min(1.0, p * 1.8)),
                          (x0 - (sw - rw)//2, y0 - (sh - rh)//2))
        seq.append(f)
    seq += [b.copy() for _ in range(hold)]
    return seq

def crossfade(png_a, png_b, frames=12, hold=8):
    """Whole-element crossfade (for state changes whose layout differs, e.g. IDLE -> live)."""
    a, b = load(png_a), load(png_b)
    seq = [a.copy() for _ in range(4)]
    for i in range(frames):
        pr = ease_in_out((i + 1) / frames)
        f = a.copy()
        f.alpha_composite(with_alpha(b, pr))
        seq.append(f)
    seq += [b.copy() for _ in range(hold)]
    return seq

# ---------------------------------------------------------------- pulse loops
def pulse_loop(png, cx, cy, radius, rgba=(224, 25, 53), frames=48, fade_in=8):
    """Fade the overlay in, then a seamless glow pulse at (cx, cy)."""
    src = load(png)
    seq = [with_alpha(src, ease_out_cubic((i+1)/fade_in)) for i in range(fade_in)]
    glow = Image.new("RGBA", (radius*6, radius*6), (0,0,0,0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([radius*2, radius*2, radius*4, radius*4], fill=rgba + (200,))
    glow = glow.filter(ImageFilter.GaussianBlur(radius))
    for i in range(frames):
        g = 0.5 + 0.5 * math.sin(2 * math.pi * i / frames)
        f = src.copy()
        f.alpha_composite(with_alpha(glow, 0.55 * g), (cx - radius*3, cy - radius*3))
        seq.append(f)
    return seq

# ---------------------------------------------------------------- build the set
jobs = []
# entrances
jobs.append(("Deal Panel - IN.mov",       slide_in("Deal Panel - 240.png", -420, 0)))
jobs.append(("Checklist - IN.mov",        slide_in("Checklist - 0 IDLE.png", 420, 0)))  # entrance is BLANK (Sam 07-09)
jobs.append(("Order Bar - IN.mov",        slide_in("Order Bar - 4217.png", 0, 240)))
jobs.append(("Caller LT MARCUS - IN.mov", slide_in("Caller LT - MARCUS.png", -420, 0)))
jobs.append(("Caller LT LINDA - IN.mov",  slide_in("Caller LT - LINDA.png", -420, 0)))
# deal ticks (rate drop, place on dialogue beats)
jobs.append(("Deal Tick - 240 to 190.mov", region_slide("Deal Panel - 240.png", "Deal Panel - 190.png")))
jobs.append(("Deal Tick - 190 to 120.mov", region_slide("Deal Panel - 190.png", "Deal Panel - 120.png")))
jobs.append(("Deal Tick - 120 to 58 FLASH.mov",
             region_slide("Deal Panel - 120.png", "Deal Panel - 58 FLASH.png", flash=True, hold=12)))
# checklist pops
jobs.append(("Check Pop - 2 MULTI POLICY.mov",
             region_pop("Checklist - 1 SAFE DRIVER.png", "Checklist - 2 MULTI POLICY.png")))
jobs.append(("Check Pop - 3 HOMEOWNER.mov",
             region_pop("Checklist - 2 MULTI POLICY.png", "Checklist - 3 HOMEOWNER.png", hold=12)))
# counter ticks
jobs.append(("Counter Tick - 4217 to 4251.mov", region_slide("Order Bar - 4217.png", "Order Bar - 4251.png")))
jobs.append(("Counter Tick - 4251 to 4300plus.mov", region_slide("Order Bar - 4251.png", "Order Bar - 4300plus.png")))
# loops (dot pulse): CONNECTING dot ~ (679, 928+42) per layout; bug dot at right ~ (1860-?, 1000)
jobs.append(("CONNECTING - IN loop.mov", pulse_loop("CONNECTING.png", 690, 928, 16)))
jobs.append(("Channel Bug - IN loop.mov", pulse_loop("Channel Bug.png", 1571, 1000, 10)))

# idle/new elements (07-09)
jobs.append(("Deal Panel IDLE - IN.mov",    slide_in("Deal Panel - IDLE.png", -420, 0)))
jobs.append(("Deal Go Live - IDLE to 240.mov", crossfade("Deal Panel - IDLE.png", "Deal Panel - 240.png")))
jobs.append(("Check Pop - 1 SAFE DRIVER.mov",
             region_pop("Checklist - 0 IDLE.png", "Checklist - 1 SAFE DRIVER.png")))
jobs.append(("Stat Pill - IN loop.mov", pulse_loop("Stat Pill - HOUSTON AVG 235.png", 648, 928, 12, rgba=(217, 166, 62))))

for name, frames in jobs:
    encode(frames, name)

# ---------------------------------------------------------------- verify alpha on every mov
print("\n=== ALPHA VERIFY ===")
fails = []
for name, _ in jobs:
    p = os.path.join(OUT, name)
    r = subprocess.run([FF, "-i", p], capture_output=True, text=True)
    line = next((l for l in r.stderr.splitlines() if "Video:" in l), "")
    ok = "yuva" in line
    print(("PASS " if ok else "FAIL ") + name + "  " + line)
    if not ok: fails.append(name)
print("ALPHA:", "ALL PASS" if not fails else f"FAILS {fails}")
print(f"DONE {len(jobs)} animated overlays -> {OUT}")
