#!/usr/bin/env python3
"""phone_lander.py — SaveMaxAuto in-scene phone screens, HTML/CSS via headless Chrome.

🔴 PHONE SCREENS ARE NEVER DIFFUSION. The reference ad's fatal tell was garbled "AI mush" behind
superimposed clean text. Digits here are live text, so they are exact by construction, and the
screens cost 0 credits — on the source build the entire phone-UI system was part of the ~1.7% of
spend that was stills. Same method as call-graphics/banner_html.py, same reason.

Design recreated from the APPROVED assets on 08.03.26 - Skit - DMV Single Mom
(lander_results_58.png, lander_cta_79_931.png), themselves a recreation of the proven
SaveMaxAuto lander from the 07.31.26 Auto Block Party build. Recreate the PROVEN lander —
do not design a new one (a custom green "RateGuard" screen and a custom tier page were both
built and both rejected before this one landed).

Composite the output into a phone mockup and pass it as --image at generation time so the screen
reads legible in-shot.

Usage:
  phone_lander.py results --rate 58 --out screen.png
      [--headline "4 Discounts Applied"] [--badge "Congratulations!"]
      [--row "✅|Currently Insured Discount"] ...   (repeatable; defaults to the proven four)
  phone_lander.py cta --rate 79 --saving 931 --out screen.png
      [--headline "Full Coverage Locked In"] [--badge "You're all set!"]

Both accept --width/--height (default 1080x2340), --cta "Claim Now", --brand-left/--brand-right.
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile

NAVY = "#16324e"
CYAN = "#12b5e8"
GREEN = "#12a150"
GREEN_BG = "#d6f5e0"
PAGE_BG = "#eef1f6"
ROW_BG = "#f2f5f9"
GREY = "#8a94a3"

RESULTS_ROWS = ["✅|Currently Insured Discount", "🛡️|Claims-free Discount",
                "📄|Multi-Policy Discount", "🎖️|Safe Driver Discount"]
CTA_ROWS = ["🚗|Same policy you had", "✅|Every discount applied"]

CHROME_CANDIDATES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
]


def find_chrome():
    env = os.environ.get("PFM_CHROME")
    if env and os.path.exists(env):
        return env
    for c in CHROME_CANDIDATES:
        if os.path.exists(c):
            return c
    return shutil.which("chromium") or shutil.which("google-chrome")


def rows_html(rows):
    out = []
    for spec in rows:
        emoji, _, label = spec.partition("|")
        if not label:
            emoji, label = "✅", emoji
        out.append(
            '<div class="row"><span class="ico">%s</span>'
            '<span class="lbl">%s</span><span class="tick">✓</span></div>'
            % (emoji.strip(), label.strip()))
    return "\n".join(out)


def build_html(a, rows, saving):
    saving_html = ('<div class="saving">Saving about $%s / year</div>' % saving) if saving else ""
    return """<!doctype html><html><head><meta charset="utf-8"><style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
html,body {{ width:{w}px; height:{h}px; background:{page_bg};
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif; -webkit-font-smoothing:antialiased; }}
.status {{ display:flex; justify-content:space-between; align-items:center;
  padding:52px 60px 0; font-size:40px; font-weight:700; color:{navy}; }}
/* Status glyphs are drawn, not typed: unicode signal/battery characters render as tofu blocks in
   headless Chrome, and a phone CU is exactly where that shows. */
.sysicons {{ display:flex; align-items:flex-end; gap:16px; }}
.bars {{ display:flex; align-items:flex-end; gap:5px; }}
.bars i {{ width:9px; background:{navy}; border-radius:2px; display:block; }}
.bars i:nth-child(1) {{ height:12px; }} .bars i:nth-child(2) {{ height:19px; }}
.bars i:nth-child(3) {{ height:26px; }} .bars i:nth-child(4) {{ height:33px; }}
.wifi {{ width:34px; height:26px; border:6px solid {navy}; border-bottom:none;
  border-radius:34px 34px 0 0; margin-bottom:2px; }}
.batt {{ width:56px; height:28px; border:5px solid {navy}; border-radius:9px; padding:3px;
  position:relative; margin-bottom:2px; }}
.batt::after {{ content:""; position:absolute; right:-11px; top:9px; width:5px; height:10px;
  background:{navy}; border-radius:0 3px 3px 0; }}
.batt i {{ display:block; height:100%; width:88%; background:{navy}; border-radius:4px; }}
.brand {{ text-align:center; font-size:66px; font-weight:800; letter-spacing:-1px;
  margin:56px 0 40px; color:{navy}; }}
.brand span {{ color:{cyan}; }}
.card {{ margin:0 48px; background:#fff; border-radius:44px; padding:44px 44px 52px;
  box-shadow:0 18px 60px rgba(22,50,78,.10); }}
.dots {{ display:flex; gap:18px; justify-content:center; margin-bottom:36px; }}
.dot {{ width:20px; height:20px; border-radius:50%; background:#ccd5e0; }}
.dot.on {{ background:{cyan}; }}
.badge {{ display:block; width:fit-content; margin:0 auto 40px; background:{green_bg};
  color:{green}; font-size:44px; font-weight:800; padding:26px 52px; border-radius:999px; }}
h1 {{ text-align:center; font-size:60px; font-weight:800; color:{navy}; margin-bottom:40px;
  letter-spacing:-1px; }}
.row {{ display:flex; align-items:center; background:{row_bg}; border-radius:26px;
  padding:30px 34px; margin-bottom:22px; }}
.ico {{ font-size:44px; width:70px; }}
.lbl {{ flex:1; font-size:42px; font-weight:700; color:{navy}; }}
.tick {{ font-size:46px; font-weight:800; color:{green}; }}
.rate {{ background:{row_bg}; border-radius:26px; padding:40px 20px 44px; margin:36px 0 30px;
  text-align:center; }}
.rate .cap {{ font-size:40px; font-weight:700; color:{grey}; margin-bottom:10px; }}
.rate .amt {{ font-size:130px; font-weight:800; color:{navy}; letter-spacing:-4px; line-height:1; }}
.rate .per {{ font-size:60px; font-weight:800; color:{navy}; letter-spacing:-2px; }}
.saving {{ margin-top:18px; font-size:44px; font-weight:800; color:{green}; }}
.cta {{ background:{cyan}; color:#fff; text-align:center; font-size:60px; font-weight:800;
  padding:40px 0; border-radius:26px; box-shadow:0 0 44px rgba(18,181,232,.45); }}
.sub {{ text-align:center; font-size:42px; color:{grey}; margin-top:28px; }}
</style></head><body>
<div class="status"><div>9:41</div><div class="sysicons">
  <span class="bars"><i></i><i></i><i></i><i></i></span>
  <span class="wifi"></span><span class="batt"><i></i></span></div></div>
<div class="brand">{brand_l}<span>{brand_r}</span></div>
<div class="card">
  <div class="dots"><i class="dot"></i><i class="dot"></i><i class="dot"></i><i class="dot on"></i></div>
  <div class="badge">🎉 {badge}</div>
  <h1>{headline}</h1>
  {rows}
  <div class="rate">
    <div class="cap">Your new rate</div>
    <div><span class="amt">${rate}</span><span class="per">/month</span></div>
    {saving}
  </div>
  <div class="cta">{cta}</div>
  <div class="sub">Start New Search</div>
</div></body></html>""".format(
        w=a.width, h=a.height, page_bg=PAGE_BG, navy=NAVY, cyan=CYAN, green=GREEN,
        green_bg=GREEN_BG, row_bg=ROW_BG, grey=GREY, brand_l=a.brand_left, brand_r=a.brand_right,
        badge=a.badge, headline=a.headline, rows=rows_html(rows), rate=a.rate,
        saving=saving_html, cta=a.cta)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("screen", choices=["results", "cta"])
    ap.add_argument("--rate", required=True, help="monthly rate, digits only (e.g. 58)")
    ap.add_argument("--saving", default=None, help="yearly saving, digits only (cta screen)")
    ap.add_argument("--out", required=True)
    ap.add_argument("--headline", default=None)
    ap.add_argument("--badge", default=None)
    ap.add_argument("--row", action="append", default=[], help='"emoji|Label", repeatable')
    ap.add_argument("--cta", default="Claim Now")
    ap.add_argument("--brand-left", default="SaveMax")
    ap.add_argument("--brand-right", default="Auto")
    ap.add_argument("--width", type=int, default=1080)
    ap.add_argument("--height", type=int, default=2340)
    a = ap.parse_args()

    if not str(a.rate).strip().isdigit():
        sys.exit("REFUSED: --rate must be digits only (the screen renders it verbatim; a stray "
                 "'$' or '/mo' lands twice)")
    if a.saving and not str(a.saving).strip().isdigit():
        sys.exit("REFUSED: --saving must be digits only")
    if a.screen == "cta" and not a.saving:
        # The proven CTA screen carries the yearly saving under the rate; the narrator says it out
        # loud, and a screen that omits it contradicts the VO on the money shot.
        sys.exit("REFUSED: the cta screen needs --saving (the yearly figure the narrator names)")

    if a.screen == "results":
        a.headline = a.headline or "4 Discounts Applied"
        a.badge = a.badge or "Congratulations!"
        rows = a.row or RESULTS_ROWS
    else:
        a.headline = a.headline or "Full Coverage Locked In"
        a.badge = a.badge or "You're all set!"
        rows = a.row or CTA_ROWS

    chrome = find_chrome()
    if not chrome:
        sys.exit("REFUSED: no Chrome/Chromium found (set $PFM_CHROME). This screen is HTML by law — "
                 "do NOT fall back to a diffusion model for phone UI.")
    try:
        from PIL import Image
    except ImportError:
        sys.exit("ERROR: Pillow required — pip3 install Pillow")

    html = build_html(a, rows, a.saving)
    out = os.path.abspath(a.out)
    os.makedirs(os.path.dirname(out), exist_ok=True)

    # 🔴 This is call-graphics/banner_html.py's PROVEN invocation, flag for flag: a file:// source
    # in a temp dir, no --user-data-dir, no --no-sandbox, render at 2x and downsample for crisp
    # type. Adding --user-data-dir made Chrome hang indefinitely on macOS during this build; the
    # subprocess timeout below means a hang can never take a session with it. Chrome also writes
    # the shot into its own temp dir and Pillow copies it to the destination — Chrome cannot always
    # write directly into a Lucid path.
    with tempfile.TemporaryDirectory(prefix="pfm_lander_") as tmp:
        page = os.path.join(tmp, "lander.html")
        shot = os.path.join(tmp, "shot.png")
        with open(page, "w") as f:
            f.write(html)
        try:
            r = subprocess.run([
                chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                "--window-size=%d,%d" % (a.width, a.height),
                "--force-device-scale-factor=2",
                "--screenshot=%s" % shot, "file://" + page,
            ], capture_output=True, text=True, timeout=120)
        except subprocess.TimeoutExpired:
            sys.exit("REFUSED: Chrome timed out rendering the screen (120s).")
        if not os.path.exists(shot) or os.path.getsize(shot) == 0:
            sys.exit("REFUSED: Chrome produced no screenshot: %s" % (r.stderr or r.stdout)[:300])
        Image.open(shot).convert("RGB").resize((a.width, a.height), Image.LANCZOS).save(out)

    if not os.path.exists(out) or os.path.getsize(out) == 0:
        sys.exit("REFUSED: screenshot did not land at %s" % out)
    print("screen -> %s" % out)
    print("rate $%s/month%s" % (a.rate, " · saving about $%s/year" % a.saving if a.saving else ""))
    print("Composite into a phone mockup and pass it as --image at generation time.")


if __name__ == "__main__":
    main()
