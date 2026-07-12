#!/usr/bin/env python3
"""QVC broadcast overlays v3 — HTML/CSS via headless Chrome (transparent capture at 2x).
Same v2 layout/composition (approved), executed with real typography + gradients + shadows.
Full-frame 1920x1080 RGBA overlays; digits exact; states are template params."""
import os, subprocess, tempfile, base64
from PIL import Image

W, H = 1920, 1080
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT = ("/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/Auto - Completed Creatives/"
       "Auto - 2026/Auto - July 2026/07.08.26 - Roku CTV Calls - SaveMaxAuto Live QVC - Houston/"
       "Elements/Graphics/Broadcast Overlays v3.1")
os.makedirs(OUT, exist_ok=True)
TMP = tempfile.mkdtemp(prefix="qvc_v31_")

# real SaveMaxAuto wordmark (white "SaveMax" + cyan "Auto") for dark backgrounds → embed as data URI
WM_PATH = "/Volumes/ads/PFM MEDIA MASTER FOLDER/2. Client Media Assets/SMA - Brand Folder/Logos/savemaxauto-wordmark.png"
WM_URI = "data:image/png;base64," + base64.b64encode(open(WM_PATH, "rb").read()).decode()

CSS = """
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1920px; height:1080px; background:transparent; overflow:hidden;
  font-family:-apple-system,"SF Pro Display","Helvetica Neue",sans-serif;
  -webkit-font-smoothing:antialiased; }
.panel { position:absolute; border-radius:10px; overflow:hidden;
  background:linear-gradient(180deg,rgba(255,255,255,.97) 0%,rgba(240,243,246,.93) 100%);
  border:1px solid rgba(255,255,255,.7);
  box-shadow:0 10px 34px rgba(0,0,0,.32), inset 0 1px 0 rgba(255,255,255,.9); }
.hdr { display:flex; align-items:center; justify-content:center; height:64px;
  font-size:34px; font-weight:800; letter-spacing:.08em; color:#14161a; white-space:nowrap;
  border-bottom:3px solid #c8102e; background:linear-gradient(180deg,#ffffff,#f2f4f6); }
.row { display:flex; align-items:center; justify-content:center;
  border-top:1px solid rgba(20,22,26,.10); color:#14161a; }
.lbl { height:40px; font-size:21px; font-weight:700; letter-spacing:.12em; color:#3c434c;
  background:linear-gradient(180deg,rgba(222,227,232,.96),rgba(210,216,222,.96)); }
.num { font-variant-numeric:tabular-nums; }
.redblock { background:linear-gradient(180deg,#e01935 0%,#a30d24 100%); color:#fff;
  text-shadow:0 2px 6px rgba(0,0,0,.35);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35), inset 0 -10px 22px rgba(0,0,0,.22); }
.flash { outline:4px solid #e8b64c; outline-offset:-4px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35), 0 0 26px rgba(232,182,76,.75); }
.strike { position:relative; }
.strike::after { content:""; position:absolute; left:-6%; right:-6%; top:50%;
  height:7px; background:linear-gradient(90deg,#e01935,#c8102e); border-radius:4px;
  transform:rotate(-5deg); box-shadow:0 1px 3px rgba(0,0,0,.3); }
.chip { display:flex; flex-direction:column; align-items:center; justify-content:center;
  background:linear-gradient(180deg,#1a2a4d 0%,#0a1326 100%); border-radius:8px;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.18); }
.tag { position:absolute; display:flex; flex-direction:column; align-items:center;
  justify-content:center; border-radius:10px; color:#fff;
  background:linear-gradient(180deg,#e01935,#a30d24);
  box-shadow:0 10px 30px rgba(0,0,0,.35), inset 0 0 0 2px rgba(255,255,255,.85),
             inset 0 0 0 6px rgba(255,255,255,0.0), inset 0 1px 0 rgba(255,255,255,.4);
  text-shadow:0 2px 5px rgba(0,0,0,.35); }
.check { width:34px; height:34px; border:3.5px solid #2a2f36; border-radius:7px;
  margin:0 20px 0 24px; flex:none; position:relative; background:rgba(255,255,255,.7); }
.check.on::after { content:""; position:absolute; left:6px; top:2px; width:12px; height:20px;
  border:solid #c8102e; border-width:0 5px 5px 0; transform:rotate(40deg); }
.star { color:#d9a63e; margin-right:10px; font-size:30px;
  text-shadow:0 1px 2px rgba(0,0,0,.25); }
.hilite { background:linear-gradient(180deg,rgba(250,240,214,.98),rgba(244,228,188,.96)) !important;
  box-shadow:inset 0 0 0 3px #d9a63e; }
"""

def render(name, body):
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{body}</body></html>"
    src = os.path.join(TMP, name.replace(" ", "_").replace(",", "").replace("+", "p") + ".html")
    with open(src, "w") as f: f.write(html)
    png2x = os.path.join(TMP, "shot.png")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--window-size=1920,1080", "--force-device-scale-factor=2",
                    "--default-background-color=00000000",
                    f"--screenshot={png2x}", "file://" + src],
                   check=True, capture_output=True)
    im = Image.open(png2x).convert("RGBA").resize((W, H), Image.LANCZOS)
    im.save(os.path.join(OUT, name))

# ------------------------------------------------------------------ deal panel
def deal_panel(rate, flash, idle=False):
    fl = " flash" if flash else ""
    if idle:
        # between-calls state: no caller-specific vehicle or live rate
        mid = """
  <div class="row" style="height:46px; font-size:25px; font-weight:700; letter-spacing:.03em;">HOUSTON</div>
  <div class="row" style="height:42px; font-size:21px; font-weight:600; color:#4a525c;">SAME COVERAGE, LOWER RATE</div>
  <div class="row lbl">MOST HOUSTON DRIVERS PAY</div>
  <div class="row num" style="height:62px; font-size:44px; font-weight:800;"><span class="strike">$235/MO</span></div>"""
    else:
        mid = f"""
  <div class="row" style="height:46px; font-size:25px; font-weight:700; letter-spacing:.03em;">HOUSTON&nbsp;&nbsp;•&nbsp;&nbsp;2021 FORD F-150</div>
  <div class="row" style="height:42px; font-size:21px; font-weight:600; color:#4a525c;">SAME COVERAGE AS BEFORE</div>
  <div class="row lbl">MOST HOUSTON DRIVERS PAY</div>
  <div class="row num" style="height:62px; font-size:44px; font-weight:800;"><span class="strike">$235/MO</span></div>
  <div class="row lbl">YOUR RATE &nbsp;—&nbsp; LIVE</div>
  <div class="row num redblock{fl}" style="height:96px; font-size:64px; font-weight:900; letter-spacing:.01em;">${rate}/MO</div>"""
    return f"""
<div class="panel" style="left:79px; top:96px; width:384px;">
  <div class="hdr">TODAY'S DEAL</div>
  <div class="row" style="height:56px; font-size:31px; font-weight:800;">FULL COVERAGE AUTO</div>{mid}
  <div class="row num" style="height:52px; font-size:26px; font-weight:800;">AS LOW AS&nbsp;<span style="color:#c8102e; font-size:34px;">$50/MO</span></div>
</div>"""

# ------------------------------------------------------------------ checklist
ITEMS = ["SAFE DRIVER", "MULTI POLICY", "MULTI CAR", "PAPERLESS", "HOMEOWNER"]
def checklist(checked, hilite=None):
    rows = ""
    for i, it in enumerate(ITEMS):
        cls = "row" + (" hilite" if hilite == i else "")
        star = '<span class="star">★</span>' if i == 4 else ""
        on = " on" if i in checked else ""
        rows += (f'<div class="{cls}" style="height:64px; justify-content:flex-start; '
                 f'font-size:29px; font-weight:800; letter-spacing:.04em;">'
                 f'<span class="check{on}"></span>{star}{it}</div>')
    return f"""
<div class="panel" style="left:1457px; top:96px; width:384px;">
  <div class="hdr" style="font-size:26px; letter-spacing:.06em;">DISCOUNTS FOUND LIVE</div>
  {rows}
</div>"""

# ------------------------------------------------------------------ order bar
def order_bar(count):
    return f"""
<div class="panel" style="left:79px; top:907px; width:856px; height:115px; display:flex; align-items:center;">
  <div class="chip" style="width:176px; height:91px; margin-left:12px;">
    <img src="{WM_URI}" style="width:148px; display:block;"/>
    <div style="font-size:34px; font-weight:900; letter-spacing:.30em; color:#fff; margin-top:6px; padding-left:.30em;">LIVE</div>
  </div>
  <div style="margin-left:28px;">
    <div class="num" style="font-size:27px; font-weight:800; letter-spacing:.06em; color:#3c434c;">CALLS TODAY: &nbsp;{count}</div>
    <div class="num" style="font-size:48px; font-weight:900; color:#14161a; letter-spacing:.01em;">(713) 936-4745</div>
  </div>
</div>
<div class="tag" style="left:955px; top:915px; width:302px; height:107px;">
  <div style="font-size:34px; font-weight:800; letter-spacing:.10em;">TODAY'S</div>
  <div style="font-size:42px; font-weight:900; letter-spacing:.16em; padding-left:.16em;">DEAL</div>
</div>"""

# ------------------------------------------------------------------ caller LT / connecting / bug
def caller_lt(name):
    return f"""
<div class="panel" style="left:79px; top:930px; width:800px; height:92px; display:flex; align-items:center;">
  <div class="tag" style="position:static; width:212px; height:68px; margin-left:12px; border-radius:8px; flex:none;">
    <div style="font-size:26px; font-weight:900; letter-spacing:.08em; white-space:nowrap;">LIVE CALLER</div>
  </div>
  <div style="margin-left:26px; font-size:38px; font-weight:800; color:#14161a; letter-spacing:.02em; white-space:nowrap;">{name} &nbsp;—&nbsp; HOUSTON, TX</div>
</div>"""

def stat_pill(label, value):
    """Small CONNECTING-style pill for stat beats (e.g. the L03 Houston average)."""
    return f"""
<div class="panel" style="left:610px; top:886px; width:700px; height:84px; display:flex; align-items:center; justify-content:center;">
  <div style="width:22px; height:22px; border-radius:50%; margin-right:22px; flex:none;
       background:radial-gradient(circle at 35% 30%, #ffd97a, #d9a63e);
       box-shadow:0 0 12px rgba(217,166,62,.8);"></div>
  <div style="font-size:32px; font-weight:800; letter-spacing:.05em; color:#14161a; white-space:nowrap;">{label}&nbsp;
    <span style="color:#c8102e; font-size:38px;" class="num">{value}</span></div>
</div>"""

CONNECTING = """
<div class="panel" style="left:650px; top:886px; width:620px; height:84px; display:flex; align-items:center;">
  <div style="width:26px; height:26px; border-radius:50%; margin-left:28px; flex:none;
       background:radial-gradient(circle at 35% 30%, #ff5f74, #c8102e);
       box-shadow:0 0 14px rgba(200,16,46,.8);"></div>
  <div style="margin-left:24px; font-size:34px; font-weight:800; letter-spacing:.06em; color:#14161a;">CONNECTING LIVE CALLER...</div>
</div>"""

BUG = f"""
<div style="position:absolute; right:60px; top:986px; display:flex; align-items:center; opacity:.9;
     filter:drop-shadow(0 1px 6px rgba(0,0,0,.6));">
  <div style="width:14px; height:14px; border-radius:50%; background:#e01935; margin-right:14px;
       box-shadow:0 0 10px rgba(224,25,53,.9);"></div>
  <img src="{WM_URI}" style="height:30px; display:block;"/>
  <div style="font-size:28px; font-weight:900; letter-spacing:.20em; color:#fff; margin-left:14px;
       padding-left:.20em;">LIVE</div>
</div>"""

# ------------------------------------------------------------------ render all
jobs = {}
for rate, fl in [("240", False), ("190", False), ("120", False), ("58", False), ("58", True)]:
    jobs[f"Deal Panel - {rate}{' FLASH' if fl else ''}.png"] = deal_panel(rate, fl)
jobs["Deal Panel - IDLE.png"] = deal_panel("", False, idle=True)
jobs["Checklist - 0 IDLE.png"] = checklist(set())
jobs["Stat Pill - HOUSTON AVG 235.png"] = stat_pill("HOUSTON AVERAGE:", "$235/MO")
jobs["Checklist - 1 SAFE DRIVER.png"] = checklist({0})
jobs["Checklist - 2 MULTI POLICY.png"] = checklist({0, 1})
jobs["Checklist - 3 HOMEOWNER.png"] = checklist({0, 1, 4}, hilite=4)
for c in ["4,217", "4,251", "4,300+"]:
    jobs[f"Order Bar - {c.replace(',', '').replace('+', 'plus')}.png"] = order_bar(c)
jobs["Caller LT - MARCUS.png"] = caller_lt("MARCUS")
jobs["Caller LT - LINDA.png"] = caller_lt("LINDA")
jobs["CONNECTING.png"] = CONNECTING
jobs["Channel Bug.png"] = BUG

for name, body in jobs.items():
    render(name, body)
    print("rendered", name)

# ------------------------------------------------------------------ alpha audit
fails = []
for name in sorted(jobs):
    im = Image.open(os.path.join(OUT, name))
    a = im.getchannel("A"); lo, hi = a.getextrema()
    corners = [a.getpixel(p) for p in [(0,0),(W-1,0),(0,H-1),(W-1,H-1)]]
    ok = im.mode == "RGBA" and lo == 0 and all(c == 0 for c in corners)
    if not ok: fails.append(name)
    print(f"{'PASS' if ok else 'FAIL'}  {name:38s} alpha[{lo},{hi}] corners={corners}")
print("ALPHA AUDIT:", "ALL PASS" if not fails else f"FAILS: {fails}")

# ------------------------------------------------------------------ preview composite
scene = ("/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/Auto - Completed Creatives/"
         "Auto - 2026/Auto - July 2026/07.08.26 - Roku CTV Calls - SaveMaxAuto Live QVC - Houston/"
         "Elements/Footage/Reference/Scene Frames/SMA_Live_F1_two_shot_v01_60c9.png")
base = Image.open(scene).convert("RGBA").resize((W, H))
for layer in ["Deal Panel - 240.png", "Checklist - 1 SAFE DRIVER.png", "Order Bar - 4217.png", "Channel Bug.png"]:
    base.alpha_composite(Image.open(os.path.join(OUT, layer)))
prev = os.path.join(OUT, "_preview_composite.png")
base.convert("RGB").save(prev, quality=92)
print("preview:", prev)
