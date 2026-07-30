#!/usr/bin/env python3
"""SMA CTV EndCard — HTML/CSS via headless Chrome. Matches banner_html.py's type + palette.

Full-frame 1920x1080 navy card (opaque — it's a full-screen close, not an overlay).
Number is AUTO-FIT to the frame width so it can never clip or need a lucky roll; digits are live
text, so they are exact by construction.

Usage: endcard_html.py "<phone>" "<output png>" [--rate "$50/month"] [--urgency "Call before 5 PM today"]
"""
import base64, os, subprocess, sys, tempfile
from PIL import Image

PHONE, OUT = sys.argv[1], sys.argv[2]

def opt(flag, default):
    return sys.argv[sys.argv.index(flag) + 1] if flag in sys.argv else default

RATE     = opt("--rate", "$50/month")
URGENCY  = opt("--urgency", "Call before 5 PM today")
MIDLINE  = opt("--midline", "Free 5 minute rate check")

# 🔴 TWO-CTA STANDARD (Rus, 2026-07-30). The end card is the GUARANTEED carrier: every Auto CTV
# format has one, it is the last thing on screen, and it has room. Both CTAs appear here together.
# Hierarchy is deliberate — the number stays the biggest element in white; the website reads
# clearly secondary in cyan. Co-equal CTAs split response toward the cheaper action.
WEBSITE  = opt("--website", "SMA.INSURE")
if not WEBSITE.strip():
    sys.exit("REFUSED: --website is empty. Every AUTO CTV end card carries two CTAs "
             "(CALL <number> + the website). Pass --website \"SMA.INSURE\".")

W, H = 1920, 1080
SIDE_PAD = 110                      # number must never come closer than this to the edge
V_PAD    = 40                       # nor may the STACK come closer than this to top/bottom
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
WM_PATH = ("/Volumes/ads/PFM MEDIA MASTER FOLDER/7. SMA Organic/SMA - Brand Folder/"
           "Logos/savemaxauto-wordmark.png")
WM_URI = "data:image/png;base64," + base64.b64encode(open(WM_PATH, "rb").read()).decode()

def html(num_px):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ width:{W}px; height:{H}px; overflow:hidden;
  font-family:-apple-system,'SF Pro Display','Helvetica Neue',Helvetica,sans-serif;
  -webkit-font-smoothing:antialiased; }}
/* same navy as the banner, with a soft centre lift so the card doesn't read flat */
.bg {{ position:absolute; inset:0;
  background:
    radial-gradient(ellipse 78% 62% at 50% 46%, rgba(28,62,110,.62) 0%, rgba(11,26,51,0) 70%),
    linear-gradient(180deg,#0B1A33 0%,#0E2140 55%,#102647 100%); }}
.wrap {{ position:absolute; inset:0; display:flex; flex-direction:column;
  align-items:center; justify-content:center; }}
.wm {{ width:360px; display:block; margin-bottom:78px; }}
.num {{ font-family:'Avenir Next Condensed','HelveticaNeue-CondensedBold','Arial Narrow',sans-serif;
  color:#FFFFFF; font-weight:700; font-size:{num_px}px; line-height:1;
  letter-spacing:.005em; white-space:nowrap; font-variant-numeric:tabular-nums;
  text-shadow:0 6px 30px rgba(0,0,0,.45); }}
.rule {{ width:250px; height:3px; margin:60px 0 54px;
  background:linear-gradient(90deg,rgba(125,214,229,0),#7DD6E5 50%,rgba(125,214,229,0));
  border-radius:2px; }}
.line {{ font-weight:600; letter-spacing:.005em; line-height:1; margin-bottom:32px;
  color:#FFFFFF; font-size:56px; }}
.line.small {{ font-size:52px; }}
.accent {{ color:#3CD881; }}
.urgency {{ color:#7DD6E5; font-size:54px; font-weight:600; letter-spacing:.005em;
  line-height:1; margin-bottom:0; }}
.website {{ color:#7DD6E5; font-size:56px; font-weight:700; letter-spacing:.02em;
  line-height:1; margin-bottom:34px; }}
</style></head><body>
  <div class="bg"></div>
  <div class="wrap">
    <img class="wm" src="{WM_URI}"/>
    <div class="num">{PHONE}</div>
    <div class="rule"></div>
    <div class="website">{WEBSITE}</div>
    <div class="line">Rates as low as <span class="accent">{RATE}</span></div>
    <div class="line small">{MIDLINE}</div>
    <div class="urgency">{URGENCY}</div>
  </div>
</body></html>"""

tmp = tempfile.mkdtemp(prefix="sma_endcard_")

def render(num_px, dest):
    src = os.path.join(tmp, "e.html"); open(src, "w").write(html(num_px))
    shot = os.path.join(tmp, "shot.png")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    f"--window-size={W},{H}", "--force-device-scale-factor=2",
                    f"--screenshot={shot}", "file://" + src],
                   check=True, capture_output=True)
    im = Image.open(shot).convert("RGB").resize((W, H), Image.LANCZOS)
    im.save(dest)
    return im

def stack_span(im):
    """Top/bottom pixel extent of the whole content stack — the VERTICAL guard.

    🔴 The fit loop used to check horizontal margins ONLY, while body is overflow:hidden, so a
    stack that grew too tall (e.g. adding the website row) would silently CLIP with no warning.
    A renderer exists precisely so nothing is left to chance; "probably still fits" is not a check.
    """
    px = im.load()
    top = bot = None
    for y in range(H):
        for x in range(0, W, 3):
            r, g, b = px[x, y]
            # any content pixel: white text, cyan text, green accent, or the wordmark
            if (r > 200 and g > 200 and b > 200) or (b > 150 and g > 140 and (b - r) > 55) \
               or (g > 170 and r < 130 and b < 170):
                top = y if top is None else top
                bot = y
                break
    return top, bot


def number_span(im):
    """Left/right pixel extent of the big white number row (measured, not assumed)."""
    px = im.load()
    band = range(int(H * 0.34), int(H * 0.56))     # the number's vertical zone
    lo = hi = None
    for x in range(W):
        for y in band:
            r, g, b = px[x, y]
            if r > 225 and g > 225 and b > 225:
                lo = x if lo is None else lo
                hi = x
                break
    return lo, hi

# start deliberately OVERSIZE and shrink — that maximises the number instead of settling small
size = 300
for attempt in range(24):
    im = render(size, OUT)
    lo, hi = number_span(im)
    if lo is None:
        print(f"  [{attempt}] size={size} — number not detected"); break
    top, bot = stack_span(im)
    v_ok = top is not None and top >= V_PAD and (H - bot) >= V_PAD
    print(f"  [{attempt}] num={size}px  span=({lo},{hi})  side=({lo}, {W-hi})  "
          f"vert=({top}, {H-bot if bot else '?'})")
    if lo >= SIDE_PAD and (W - hi) >= SIDE_PAD and v_ok:
        print(f"✓ fit at {size}px (side ≥ {SIDE_PAD}px, top/bottom ≥ {V_PAD}px)")
        break
    size -= 6
else:
    print("⚠ hit iteration cap")

print(f"saved: {OUT}")
print(f"  1920x1080 opaque · number is live text, digits exact · type matches banner_html.py")
