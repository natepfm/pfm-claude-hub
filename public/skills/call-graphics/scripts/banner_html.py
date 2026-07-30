#!/usr/bin/env python3
"""SMA CTV call banner — HTML/CSS via headless Chrome (deterministic layout, exact digits).

Replaces the gpt_image_2 roll: diffusion cannot honour "centered at the 50% mark" or
"right-aligned to the edge", which is why the number kept drifting left with a dead right half.

Layout (Sam, locked): wordmark LEFT (size unchanged) | 'CALL <number>' dead-CENTRE of the frame and
the biggest element | 'FREE 5 MINUTE RATE CHECK' pushed RIGHT | band full-width, no dead space.

The number is AUTO-FIT: render -> measure the real pixels -> shrink until it clears the rate-check
zone by a set gap. No guessing, no collisions.

Output: 1920x1080 RGBA, transparent above the band -> editor drops it on the timeline at 100%.

Usage: sma_banner_html.py "<phone>" "<output png path>"
"""
import base64, os, subprocess, sys, tempfile
from PIL import Image

PHONE, OUT = sys.argv[1], sys.argv[2]


def opt(flag, default):
    return sys.argv[sys.argv.index(flag) + 1] if flag in sys.argv else default
# 🔴 TWO-CTA STANDARD (Rus, 2026-07-30; binding on every AUTO CTV ad). The band's right zone
# carries the website CTA. There is no fourth zone — .wm / .call / .rate are the only three
# absolutely-positioned slots and a second cyan element would break measure(), which takes the
# LEFTMOST cyan pixel to find the right zone. The rate-check message did not leave the ad: it
# still ships on the end card (its `midline` defaults to "Free 5 minute rate check").
# measure() keys on COLOUR, not content, so swapping this string leaves the fit loop untouched.
RIGHT = opt("--right", "SMA.INSURE")
if not RIGHT.strip():
    sys.exit("REFUSED: --right is empty. Every AUTO CTV ad carries two CTAs (CALL <number> + the "
             "website). A silent default is how a call-only banner shipped before this rule existed. "
             "Pass --right \"SMA.INSURE\" (or the approved string for this creative).")


W, H = 1920, 1080
BAND_H = 200                      # ~18.5% of frame — the taller-banner house default
BAND_TOP = H - BAND_H
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
WM_PATH = ("/Volumes/ads/PFM MEDIA MASTER FOLDER/7. SMA Organic/SMA - Brand Folder/"
           "Logos/savemaxauto-wordmark.png")
WM_URI = "data:image/png;base64," + base64.b64encode(open(WM_PATH, "rb").read()).decode()

PAD, WM_W = 64, 300
DIV_X = PAD + WM_W + 40
BRAND_ZONE_END = DIV_X + 30       # ignore everything left of this when measuring
MIN_GAP = 46                      # required clear px between number and rate check
RATE_PX, RATE_LS = 38, 0.06

def html(call_px):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ width:{W}px; height:{H}px; background:transparent; overflow:hidden;
  font-family:'Avenir Next Condensed','HelveticaNeue-CondensedBold','Arial Narrow',
              -apple-system,'SF Pro Display',sans-serif;
  -webkit-font-smoothing:antialiased; }}
.band {{ position:absolute; left:0; right:0; bottom:0; height:{BAND_H}px;
  background:linear-gradient(180deg,#0B1A33 0%,#0E2140 55%,#102647 100%); }}
.band::before {{ content:""; position:absolute; left:0; right:0; top:0; height:3px;
  background:linear-gradient(90deg,#4FC3E8,#7DD6E5 50%,#4FC3E8); opacity:.95; }}
.wm {{ position:absolute; left:{PAD}px; top:50%; transform:translateY(-50%);
  width:{WM_W}px; display:block; }}
.divider {{ position:absolute; left:{DIV_X}px; top:50%; transform:translateY(-50%);
  width:3px; height:{int(BAND_H*0.52)}px; border-radius:2px;
  background:linear-gradient(180deg,rgba(125,214,229,.15),#7DD6E5 50%,rgba(125,214,229,.15)); }}
.call {{ position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
  white-space:nowrap; color:#FFFFFF; font-weight:700; font-size:{call_px}px;
  letter-spacing:.005em; line-height:1; font-variant-numeric:tabular-nums;
  text-shadow:0 3px 14px rgba(0,0,0,.45); }}
.rate {{ position:absolute; right:{PAD}px; top:50%; transform:translateY(-50%);
  white-space:nowrap; color:#7DD6E5; font-weight:700; font-size:{RATE_PX}px;
  letter-spacing:{RATE_LS}em; line-height:1; }}
</style></head><body><div class="band">
  <img class="wm" src="{WM_URI}"/><div class="divider"></div>
  <div class="call">CALL {PHONE}</div>
  <div class="rate">{RIGHT}</div>
</div></body></html>"""

tmp = tempfile.mkdtemp(prefix="sma_banner_")

def render(call_px, dest):
    src = os.path.join(tmp, "b.html")
    open(src, "w").write(html(call_px))
    shot = os.path.join(tmp, "shot.png")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    f"--window-size={W},{H}", "--force-device-scale-factor=2",
                    "--default-background-color=00000000",
                    f"--screenshot={shot}", "file://" + src],
                   check=True, capture_output=True)
    im = Image.open(shot).convert("RGBA").resize((W, H), Image.LANCZOS)
    im.save(dest)
    return im

def measure(im):
    """Return (number_right_edge, rate_left_edge) by colour, ignoring the brand panel."""
    px = im.convert("RGB").load()
    num_max, rate_min = None, None
    for x in range(BRAND_ZONE_END, W):
        for y in range(BAND_TOP + 10, H - 10, 2):
            r, g, b = px[x, y]
            if r > 205 and g > 205 and b > 205:                     # white  -> the number
                num_max = x if num_max is None else max(num_max, x)
            elif b > 150 and g > 140 and r < 150 and (b - r) > 55:  # cyan   -> rate check
                rate_min = x if rate_min is None else min(rate_min, x)
    return num_max, rate_min

size = 104
for attempt in range(14):
    im = render(size, OUT)
    num_r, rate_l = measure(im)
    if num_r is None or rate_l is None:
        print(f"  [{attempt}] size={size} — could not measure both zones"); break
    gap = rate_l - num_r
    print(f"  [{attempt}] call={size}px  number_right={num_r}  rate_left={rate_l}  gap={gap}px")
    if gap >= MIN_GAP:
        print(f"✓ fit at {size}px (gap {gap}px ≥ {MIN_GAP}px)")
        break
    size -= 4
else:
    print("⚠ hit iteration cap")

a = im.getchannel("A"); lo, hi = a.getextrema()
print(f"saved: {OUT}")
print(f"  RGBA={im.mode=='RGBA'}  alpha[{lo},{hi}]  above-band transparent={a.getpixel((W//2,40))==0}")
print(f"  band {BAND_H}px ({BAND_H/H*100:.1f}% of frame) · number is live text, digits exact")
