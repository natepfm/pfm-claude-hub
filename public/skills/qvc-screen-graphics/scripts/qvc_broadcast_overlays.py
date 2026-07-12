#!/usr/bin/env python3
"""QVC broadcast overlays v2 — literal recreation of the pinned QVC example aesthetic.
Flat semi-transparent white panels, hairline rules, edge-anchored, condensed broadcast type.
Full-frame 1920x1080 RGBA so every file drops straight onto the timeline as an overlay.
All content strings verbatim from the approved v1 boards. Pure PIL: exact digits, native alpha."""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1920, 1080
OUT = ("/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/Auto - Completed Creatives/"
       "Auto - 2026/Auto - July 2026/07.08.26 - Roku CTV Calls - SaveMaxAuto Live QVC - Houston/"
       "Elements/Graphics/Broadcast Overlays v2")
os.makedirs(OUT, exist_ok=True)

SUP = "/System/Library/Fonts/Supplemental/"
def F(name, size):
    return ImageFont.truetype(SUP + name, size)
def cond_b(s): return F("Arial Narrow Bold.ttf", s)   # condensed bold — broadcast labels
def cond(s):   return F("Arial Narrow.ttf", s)
def bold(s):   return F("Arial Bold.ttf", s)
def black(s):  return F("Arial Black.ttf", s)         # big numbers

# palette sampled from the example frame
WHITE_P   = (250, 250, 248, 235)   # panel white (semi-transparent like the example)
GRAY_P    = (206, 209, 206, 235)   # gray label strips
RED       = (186, 14, 42, 245)     # QVC red blocks
RED_TAG   = (204, 16, 50, 245)     # brighter tag red
NAVY      = (12, 28, 58, 245)      # SMA brand chip
GOLD      = (212, 168, 74, 255)
INK       = (24, 24, 26, 255)      # text black
WHT       = (255, 255, 255, 255)
GAP       = 3                      # hairline gap between stacked rows

def canvas(): return Image.new("RGBA", (W, H), (0, 0, 0, 0))

def text(d, xy, s, font, fill, anchor="lm"):
    d.text(xy, s, font=font, fill=fill, anchor=anchor)

def row(d, x0, y, w, h, bg):
    d.rectangle([x0, y, x0 + w, y + h], fill=bg)
    return y + h + GAP

# ---------------------------------------------------------------- deal panel (left column)
def deal_panel(rate, flash=False):
    im = canvas(); d = ImageDraw.Draw(im)
    x0, w = 79, 384; y = 96; cx = x0 + w // 2
    # header
    y0 = y; y = row(d, x0, y, w, 66, WHITE_P)
    text(d, (cx, y0 + 34), "TODAY'S DEAL", cond_b(46), INK, "mm")
    d.line([x0 + 14, y0 + 58, x0 + w - 14, y0 + 58], fill=RED_TAG, width=4)
    # description block
    y0 = y; y = row(d, x0, y, w, 150, WHITE_P)
    text(d, (cx, y0 + 30), "FULL COVERAGE AUTO", cond_b(38), INK, "mm")
    text(d, (cx, y0 + 72), "HOUSTON  |  2021 FORD F-150", cond_b(32), INK, "mm")
    text(d, (cx, y0 + 116), "SAME COVERAGE AS BEFORE", cond(30), (70, 70, 74, 255), "mm")
    # compare label + struck price
    y0 = y; y = row(d, x0, y, w, 42, GRAY_P)
    text(d, (cx, y0 + 21), "MOST HOUSTON DRIVERS PAY", cond_b(27), INK, "mm")
    y0 = y; y = row(d, x0, y, w, 62, WHITE_P)
    text(d, (cx, y0 + 31), "$235/MO", cond_b(50), INK, "mm")
    bb = d.textbbox((cx, y0 + 31), "$235/MO", font=cond_b(50), anchor="mm")
    d.line([bb[0] - 10, bb[3] - 6, bb[2] + 10, bb[1] + 6], fill=RED_TAG, width=7)
    # live rate label + red block
    y0 = y; y = row(d, x0, y, w, 42, GRAY_P)
    text(d, (cx, y0 + 21), "YOUR RATE  -  LIVE", cond_b(27), INK, "mm")
    y0 = y; y = row(d, x0, y, w, 96, RED)
    text(d, (cx, y0 + 48), f"${rate}/MO", black(56), WHT, "mm")
    if flash:
        d.rectangle([x0, y0, x0 + w, y0 + 96], outline=GOLD, width=6)
    # floor line
    y0 = y; row(d, x0, y, w, 50, WHITE_P)
    w1 = d.textlength("AS LOW AS  ", font=cond_b(30))
    w2 = d.textlength("$50/MO", font=cond_b(40))
    lx = cx - (w1 + w2) / 2
    text(d, (lx, y0 + 25), "AS LOW AS  ", cond_b(30), INK, "lm")
    text(d, (lx + w1, y0 + 25), "$50/MO", cond_b(40), RED_TAG, "lm")
    return im

# ---------------------------------------------------------------- checklist (right column)
CHECK_ITEMS = ["SAFE DRIVER", "MULTI POLICY", "MULTI CAR", "PAPERLESS", "HOMEOWNER"]
def checklist(checked, highlight=None):
    im = canvas(); d = ImageDraw.Draw(im)
    x0, w = 1457, 384; y = 96; cx = x0 + w // 2
    y0 = y; y = row(d, x0, y, w, 66, WHITE_P)
    text(d, (cx, y0 + 34), "DISCOUNTS FOUND LIVE", cond_b(40), INK, "mm")
    d.line([x0 + 14, y0 + 58, x0 + w - 14, y0 + 58], fill=RED_TAG, width=4)
    for i, item in enumerate(CHECK_ITEMS):
        y0 = y; y = row(d, x0, y, w, 64, WHITE_P)
        if highlight == i:
            d.rectangle([x0, y0, x0 + w, y0 + 64], fill=(248, 238, 210, 240))
            d.rectangle([x0, y0, x0 + w, y0 + 64], outline=GOLD, width=4)
        bx, by = x0 + 26, y0 + 14  # checkbox 36px
        d.rectangle([bx, by, bx + 36, by + 36], outline=INK, width=4)
        if i in checked:
            d.line([bx + 7, by + 19, bx + 15, by + 28], fill=RED_TAG, width=7)
            d.line([bx + 15, by + 28, bx + 30, by + 7], fill=RED_TAG, width=7)
        label_font = cond_b(34)
        lx = bx + 56
        if i == 4:  # homeowner gets the brand star
            star_cx, star_cy = lx + 12, y0 + 32
            pts = []
            import math
            for k in range(10):
                r = 14 if k % 2 == 0 else 6
                a = -math.pi / 2 + k * math.pi / 5
                pts.append((star_cx + r * math.cos(a), star_cy + r * math.sin(a)))
            d.polygon(pts, fill=GOLD)
            lx += 34
        text(d, (lx, y0 + 32), item, label_font, INK, "lm")
    return im

# ---------------------------------------------------------------- order bar (bottom strip)
def order_bar(count):
    im = canvas(); d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = 79, 907, 935, 1022
    d.rectangle([x0, y0, x1, y1], fill=WHITE_P)
    # brand chip
    d.rectangle([x0 + 10, y0 + 10, x0 + 186, y1 - 10], fill=NAVY)
    text(d, (x0 + 98, y0 + 38), "SAVEMAXAUTO", cond_b(28), GOLD, "mm")
    text(d, (x0 + 98, y0 + 74), "LIVE", cond_b(44), WHT, "mm")
    # counter + phone
    tx = x0 + 214
    text(d, (tx, y0 + 30), f"CALLS TODAY:  {count}", cond_b(36), INK, "lm")
    text(d, (tx, y0 + 78), "(713) 936-4745", black(52), INK, "lm")
    # red deal tag (separate block, like the example's TODAY'S SPECIAL VALUE)
    tx0, tx1 = 955, 1258
    d.rectangle([tx0, y0 + 8, tx1, y1], fill=RED_TAG)
    d.rectangle([tx0 + 6, y0 + 14, tx1 - 6, y1 - 6], outline=WHT, width=2)
    text(d, ((tx0 + tx1) // 2, y0 + 42), "TODAY'S", cond_b(42), WHT, "mm")
    text(d, ((tx0 + tx1) // 2, y0 + 86), "DEAL", cond_b(50), WHT, "mm")
    return im

# ---------------------------------------------------------------- caller lower third
def caller_lt(name):
    im = canvas(); d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = 79, 930, 780, 1022
    d.rectangle([x0, y0, x1, y1], fill=WHITE_P)
    d.rectangle([x0 + 10, y0 + 10, x0 + 216, y1 - 10], fill=RED_TAG)
    text(d, (x0 + 113, (y0 + y1) // 2), "LIVE CALLER", cond_b(34), WHT, "mm")
    text(d, (x0 + 244, (y0 + y1) // 2), f"{name}  -  HOUSTON, TX", cond_b(46), INK, "lm")
    return im

# ---------------------------------------------------------------- connecting + channel bug
def connecting():
    im = canvas(); d = ImageDraw.Draw(im)
    w, h = 620, 84; x0, y0 = (W - w) // 2, 886
    d.rectangle([x0, y0, x0 + w, y0 + h], fill=(250, 250, 248, 225))
    d.ellipse([x0 + 26, y0 + 28, x0 + 54, y0 + 56], fill=RED_TAG)
    text(d, (x0 + 78, y0 + 42), "CONNECTING LIVE CALLER...", cond_b(42), INK, "lm")
    return im

def channel_bug():
    im = canvas(); d = ImageDraw.Draw(im)
    text(d, (1860, 1006), "SAVEMAXAUTO LIVE", cond_b(36), (255, 255, 255, 175), "rm")
    return im

# ---------------------------------------------------------------- render all states
files = {}
for rate, flash in [("240", False), ("190", False), ("120", False), ("58", False), ("58", True)]:
    key = f"Deal Panel - {rate}{' FLASH' if flash else ''}.png"
    files[key] = deal_panel(rate, flash)
files["Checklist - 1.png"] = checklist({0})
files["Checklist - 2.png"] = checklist({0, 1})
files["Checklist - 3 HOMEOWNER.png"] = checklist({0, 1, 4}, highlight=4)
for c in ["4,217", "4,251", "4,300+"]:
    files[f"Order Bar - {c.replace(',', '').replace('+', 'plus')}.png"] = order_bar(c)
files["Caller LT - MARCUS.png"] = caller_lt("MARCUS")
files["Caller LT - LINDA.png"] = caller_lt("LINDA")
files["CONNECTING.png"] = connecting()
files["Channel Bug.png"] = channel_bug()

for name, im in files.items():
    im.save(os.path.join(OUT, name))
print(f"rendered {len(files)} overlays -> {OUT}")

# ---------------------------------------------------------------- verification: alpha audit
fails = []
for name in sorted(files):
    im = Image.open(os.path.join(OUT, name))
    if im.mode != "RGBA":
        fails.append(f"{name}: mode={im.mode}"); continue
    a = im.getchannel("A")
    lo, hi = a.getextrema()
    corners = [a.getpixel(p) for p in [(0, 0), (W - 1, 0), (0, H - 1), (W - 1, H - 1)]]
    ok = lo == 0 and all(c == 0 for c in corners)
    print(f"{'PASS' if ok else 'FAIL'}  {name:36s} alpha[{lo},{hi}] corners={corners}")
    if not ok: fails.append(name)
print("ALPHA AUDIT:", "ALL PASS" if not fails else f"FAILS: {fails}")

# ---------------------------------------------------------------- preview composite over set frame
scene = ("/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/Auto - Completed Creatives/"
         "Auto - 2026/Auto - July 2026/07.08.26 - Roku CTV Calls - SaveMaxAuto Live QVC - Houston/"
         "Elements/Footage/Reference/Scene Frames/SMA_Live_F1_two_shot_v01_60c9.png")
base = Image.open(scene).convert("RGBA").resize((W, H))
for layer in ["Deal Panel - 240.png", "Checklist - 1.png", "Order Bar - 4217.png", "Channel Bug.png"]:
    base.alpha_composite(Image.open(os.path.join(OUT, layer)))
prev = os.path.join(OUT, "_preview_composite.png")
base.convert("RGB").save(prev, quality=92)
print("preview:", prev)
