---
name: qvc-screen-graphics
description: "PFM's QVC Live SCREEN-GRAPHICS generator — the on-screen overlay package for SaveMaxAuto Live (QVC-style) CTV creatives: Deal Panel rate states + IDLE, discount checklist tick states + IDLE, order bar / live caller counter, caller lower-thirds, city stat pill, CONNECTING overlay, channel bug. Method v3: HTML/CSS rendered by headless Chrome → 1920×1080 RGBA PNGs (exact digits, native alpha, zero credits), states as template params on ONE layout, PLUS the animation pass — PIL keyframe engine → ProRes 4444 alpha MOVs (entrances, value ticks, check pops, crossfades), one clip per beat. Use when an editor says 'board graphics', 'qvc graphics', 'the savings board', 'screen graphics for the shopping channel creative', 'make the deal card / checklist / counter states', 'animate the overlays', or a QVC Live city/state variant needs its graphics package. NOT for: banner + end card with the tracking number (call-graphics owns those), Veo/Kling host clips (assetgen-rokuctv-calls-qvc), or non-QVC news graphics (bn-lower-thirds / call-graphics)."
---

# QVC Screen Graphics (/qvc-screen-graphics)

The overlay package for SaveMaxAuto Live QVC creatives. **Graphics are OVERLAYS, never in-frame** (Sam, locked 07-08) — Veo frames stay clean; everything here composites in the edit. All output **PNG** (Sam, locked 07-08).

**THE METHOD (v3, Sam-approved 07-09): the whole package is built in HTML/CSS rendered by headless Chrome.** Ref impl: `scripts/qvc_overlays_v3.py`. Real typography (-apple-system/SF Pro, tracking, tabular-nums), gradients, soft shadows, hairline strokes; transparent capture via `--headless=new --default-background-color=00000000 --force-device-scale-factor=2`, then LANCZOS downscale to 1920×1080. Digits stay exact, states stay template params, alpha stays native. PIL remains fine for trivial patches; gpt_image_2 only if an element truly needs rendered art. (v1 gpt-base cards and the v2 pure-PIL pass were both rejected — the record + their still-useful craft lessons live in `references/method-history.md`; their scripts in `references/legacy/`.)

## 🔴 The locked laws

1. **Reference-first, unconditionally.** `Elements/Footage/Reference/QVC Example/qvc_example_aesthetic_ref.png` IS the spec. Read it, sample its actual colors (`getpixel`), and measure its layout proportions BEFORE any design decision. Never design from the genre in your head — that mistake shipped twice (07-08 set plate, 07-09 boards). A PreToolUse reference-check hook (installed 07-09) blocks `higgsfield generate create` without a fresh `~/.claude/.ref_checked` marker — touch the marker in its OWN Bash call BEFORE any fire; a touch inside the fire command never runs.
2. **The example look = live TV, not ad cards:** flat **semi-transparent** white panels (~92% alpha), gray label strips, QVC-red accent blocks ~(190,15,45), **hairline rules**, small condensed broadcast type, lots of small data rows, **edge-anchored** (left spec column, bottom order bar + red deal tag, translucent corner bug). Never full-bleed centered cards.
3. **ONE approved base per element + parameterized state swaps — never re-roll for a value change.** Re-rolling drifts layout; the board only "ticks" cleanly if every state is pixel-registered on the SAME base. In v3 that's free (states are template params in the same HTML). For any rendered-art element (gpt_image_2 fallback) the same law applies via PIL patches — the editor approves each base BEFORE states (`feedback_approved_layout_edit_base_never_reroll`; PIL patch craft: `references/method-history.md`).
4. **ANY brand mark = the REAL SMA asset passed as a REFERENCE, never described in prose** (Sam 07-09, set-plate sign miss). The SaveMaxAuto logo is **navy "SaveMax" + bright-blue italic "Auto"** (NOT gold single-color text — that gold approximation is what got rejected). Files: `2. Client Media Assets/SMA - Brand Folder/Logos/savemaxauto-wordmark.png` (white "SaveMax" + cyan "Auto" — for DARK backgrounds/navy signs) and `…-wordmarktm-color.png` (navy+blue — for light backgrounds). For a gpt_image_2 sign/prop that carries the logo, upload the wordmark and pass it as a second `--image` ref with "render the exact logo from reference 2." Same law for the SET-PLATE branding (props/signs), not just overlays. In v3 HTML, embed the real wordmark PNG directly.
5. **gpt_image_2 edits accumulate HAZE — never stack edit-on-edit; always re-edit from the SHARPEST base** (Sam 07-09: "the images look like there's some weird overlay over it"). Each img2img pass re-encodes and softens; original→logofix→propfix was already visibly hazy at 2 passes deep. When a new change is needed, go back to the crispest source (the original plate) and apply ALL accumulated changes in ONE pass with the needed refs (base + wordmark). Add "sharp, high-clarity, no haze or overlay" to the prompt. Keep set-plate lineage ≤1 edit-generation deep whenever possible.
6. **Verify with a named check:** (a) alpha audit — every file RGBA, alpha_min=0, all 4 corner pixels alpha=0; (b) composite the set over a real scene frame and Read it with your own eyes before delivery; (c) digit-verify every value state (a wrong rate is a dead creative).
7. **Still filenames must carry NO sibling-varying digits AT ALL** — DaVinci's ImportMedia sequence-detects digit runs even mid-name with a constant tail ("_v01 still.png"/"_v02 still.png" STILL grouped into `_v[01-03] still.png`; a word after the number is NOT enough). Version stills with LETTERS: `_vA/_vB/_vC` (or unique words). Single-file and dict-form re-imports of a sequence-trapped file return EMPTY — the only fix is rename + reimport. Cost two rename rounds on the Houston import (07-09).

## The package (Houston maiden, 18 overlays — `scripts/qvc_overlays_v3.py`)

Deal Panel ×5 rate states (incl. 58 FLASH) **+ blank IDLE** · Checklist ×3 tick states **+ blank IDLE (0 checks)** · Order Bar ×3 counter states (w/ phone + TODAY'S DEAL tag) · Caller LT ×2 (**nowrap — fixed 800px, name+city must never wrap**, Sam screenshot 07-09) · city stat pill (e.g. HOUSTON AVG $235/MO, for the anchor beat) · CONNECTING · channel bug. All full-frame **1920×1080 RGBA overlays, elements pre-positioned like the example** — the editor drops each file on the timeline at 100%, done. City variants = edit the value/name constants, rerun — free.

**IDLE law (Sam, 07-09): every persistent panel gets a blank version** — Deal Panel and Checklist stay on screen through no-caller stretches and cannot show a caller's values before/between callers. IDLE→first-value is an animated crossfade tick.

Banner + End card (tracking number) = **call-graphics**, not here.

## Animation — BUILT 07-09 (`scripts/qvc_animate_overlays.py`): PIL keyframe engine → ProRes 4444 alpha MOVs

The state PNGs ARE the keyframes; diffusion never touches a digit. Recipe: (a) entrances = whole-layer slide+ease+alpha ramp; (b) value ticks = **auto-diffed changed-region** slide-out/slide-in (`ImageChops.difference(a,b).convert("RGB").getbbox()` — MUST convert to RGB first: Pillow≥10 `getbbox()` is alpha_only by default and states share identical alpha, returns None); (c) check pops = diffed-region scale-overshoot; (d) loops = sinusoidal glow pulse on the dot; (e) IDLE→value = crossfade tick. Encode `prores_ks -profile:v 4444 -pix_fmt yuva444p10le` (lands as 12le, fine — verify `yuva` in the stream via `ffmpeg -i`; ffprobe may not exist on the machine). Each tick/pop is its OWN short clip so the editor places drops on dialogue beats — never bake a full pre-timed sequence. **Entrance law (Sam, 07-09): panels slide in in their BLANK/IDLE state** — a checklist entering with an item pre-checked kills the "found live" mechanic; every check fires as its own pop after entrance. Houston set: 18 clips in `Elements/Graphics/Broadcast Overlays v3.1 Animated/`.

**Long-hold glow overlays (`scripts/qvc_counter_glow.py`, Sam 07-10):** timed pulse overlays where the **PHONE NUMBER (the CTA — not the counter; Sam corrected this twice)** lights up every 10s — a `PHONELIT` state per counter value (QVC-red digits + layered gold CSS text-shadow so the glow hugs the glyphs) blended normal→lit→normal with a PIL bloom, counter ticking between pulses. Houston: `Phone Glow 60s` (ticks 4,251→4,300+) + `Phone Glow 10s` loop. Craft laws baked in the script: (a) long clips = unique frames + ffmpeg concat with `-frames:v <total>` (the restated last concat entry silently pads ~8s without it, and a 1440-frame hold as PNGs is 12GB); (b) 🔴 **new states MUST render from the CURRENT template** — a stale script copy cost the SMA wordmark chip mid-clip on 07-10 (this skill's `qvc_overlays_v3.py` is now the synced current one; keep it that way).

## Workflow (v3)

1. **Reference pass.** Open the pinned QVC example ref, sample colors + measure proportions (law 1). Pull the city/state values, caller names, rates, and phone from the request/session — digits are template params, never free-drawn.
2. **Build/adapt the HTML templates** in `scripts/qvc_overlays_v3.py` — one template per element, states as parameter dicts, the real SMA wordmark PNG embedded (law 4). New city = edit the constants, rerun (free).
3. **Render** via headless Chrome (transparent capture flags above), LANCZOS downscale to 1920×1080 RGBA.
4. **Verify (law 6):** alpha audit script pass + composite the full set over a real scene frame and Read it + digit-verify every state on a contact sheet.
5. **Deliver** to `Elements/Graphics/<package folder>/` with letter-versioned filenames (law 7) and the full handoff below. gpt_image_2 fallback elements additionally follow laws 3/5 (approved base, no edit-stacking) before their states render.

## Delivery — 🔴 Rule 5 + full handoff

**Stream, don't batch:** each graphic (or rendered state set) is SHOWN the instant it lands — 📲 tappable CloudFront link (`higgsfield upload create "<file>" --json`, hero/representative pick for a big set) **+ the Higgsfield widget** (`show_generations` / `job_display`) for any gpt_image_2 fires — BEFORE QC reads or picks. My verdicts come after the reveal, never as a gate.

Every delivery renders all four surfaces:
- **📁 Path:** raw `/Volumes/ads/…` path in backticks
- **🔗 Open:** `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute path>"`
- **🦊 Fox.io:** same helper with `--fox-drop "<absolute path>" "<label>"` (or `--both`) → render `🦊 Fox.io: <label> → From Claude rail`
- **📲 Tappable:** CloudFront link for the shown graphic(s)

## Cross-refs

`assetgen-rokuctv-calls-qvc` (parent pipeline, step 4) · `call-graphics` (banner/endcard) · `references/method-history.md` (v1/v2 record + PIL registration lessons) · `references/legacy/` (superseded v1 scripts) · `feedback_approved_layout_edit_base_never_reroll` · `feedback_pfm_brand_clean_rules` (logo=PIL law). Ref impl: `scripts/` + the Houston project's `Elements/Prompts/`.
