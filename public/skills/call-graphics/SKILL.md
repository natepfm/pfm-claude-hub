---
name: call-graphics
description: >-
  PFM's CTV call-graphics COMPONENT — Banner (bottom-third phone strip) + EndCard (full-frame close) carrying a call tracking number, from the brand template library. Use on: 'call graphics', 'phone graphics', 'the banner/endcard' as a standalone ask. Full-project Roku wording ('roku bn/qvc', 'run the pipeline') routes to the assetgen-rokuctv pipelines, which call this internally.
---

# Call Graphics


## 🔴 TWO-CTA STANDARD — AUTO CTV (Rus, CEO, 2026-07-30; binding)

Every AUTO CTV ad carries **two** CTAs: `CALL <number>` and `SMA.INSURE`. Presence, not
persistence — the end card is the guaranteed carrier and both appear there together.

- **Banner** (`banner_html.py`): the right zone IS the website. `--right` defaults to
  `SMA.INSURE`; an empty value is REFUSED. There is no fourth zone (a second cyan element
  breaks `measure()`, which finds the right zone by leftmost cyan pixel), so the rate-check
  string moved OFF the band. It did not leave the ad — the end card's `--midline` still
  carries "Free 5 minute rate check".
- **EndCard** (`endcard_html.py`): `--website` (default `SMA.INSURE`) renders as a cyan row
  under the rule. Empty is REFUSED. Hierarchy is deliberate: the number stays the biggest
  element in white, the website reads clearly secondary. Co-equal CTAs split response toward
  the cheaper action, and Auto Calls is the paid product.
- **Breaking News is exempt from the band** — the chyron owns the lower third and the
  AI-performer disclaimer sits below it, so a phone band stacks three deep and breaks the
  broadcast illusion. BN carries both CTAs on the end card only.
- **The gate**: `digit_gate.py init <dir> --auto-ctv --website "SMA.INSURE"` verifies the URL
  the same way it verifies digits, and `status` REFUSES an `--auto-ctv` set that never
  declared one. Prose already failed here once: four active requests were built call-only
  under a spec nobody re-read.

Not clickable is not the point — Roku's "the phone number IS the CTA" spec governs
interactivity, and a burned URL is not clickable either.


## 🔴🔴 APPLE NAVY IS RENDERED IN HTML — NEVER DIFFUSION (Sam, locked 2026-07-28, escalated)

**Both pieces of the Apple Navy set are built by HTML/CSS → headless Chrome. NEVER by
`gpt_image_2` / `fire.py`.** Firing a banner through a diffusion model is a defect, not a style
choice — Sam: *"I never want to see a banner made with all that blank space again… if you make
another banner that way, I'm gonna be very angry."* The EndCard moved to the same method on
2026-07-28 (Sam approved `vB`).

```bash
python3 ~/.claude/skills/call-graphics/scripts/banner_html.py  "(786) 664-2467" "<out.png>"
python3 ~/.claude/skills/call-graphics/scripts/endcard_html.py "(786) 664-2467" "<out.png>" \
    [--rate "$50/month"] [--midline "Free 5 minute rate check"] [--urgency "Call before 5 PM today"]
```

**🔴 THE TYPE SPLIT (Sam, locked 2026-07-28 — do not "unify" it):** the **number** is
`Avenir Next Condensed` (punchy, broadcast); **all sentence text** is `-apple-system / SF Pro
Display` — the Apple keynote face the design is named for. An all-condensed card was explicitly
rejected: *"I actually really like the old font better… keep that font for the number, but I want
the old font for the text."* Both renderers already encode this; keep it.

**Why (the failure this rule exists to stop):** a diffusion model cannot be *told* where the 50%
mark is. The Apple Navy prompt already said "centred at the horizontal centre" and "right-aligned
toward the right edge" — GPT Image 2 ignored both across multiple rolls, clustering everything into
the left ~60% and leaving a dead navy void in the right half. Two prompt rewrites (bigger number,
bigger rate check, an explicit "FILL THE WIDTH" clause) did not fix it, because the problem is the
tool, not the wording. Same lesson the QVC package already learned — see `qvc-screen-graphics`,
whose v3 method is HTML/CSS for exactly this reason.

**The locked banner layout** (all four, every time):
1. **SaveMaxAuto wordmark LEFT** — the real PNG asset, never redrawn; cyan divider after it.
2. **`CALL <number>` DEAD-CENTRE of the frame** (`left:50%; translateX(-50%)`) and **the single
   biggest element** — it is what the audience must see.
3. **`FREE 5 MINUTE RATE CHECK` pushed RIGHT**, cyan, right-aligned to the padding.
4. **NO dead space.** The band spans full width and all three zones carry weight.

The script **auto-fits** the number: it renders, measures the actual pixels by colour, and shrinks
the type until it clears the rate-check zone by ≥46px — so the two can never collide and the layout
never needs a lucky roll. Digits are live text, so they are exact by construction (a diffusion
banner could always transpose one). Output is 1920×1080 RGBA, **transparent above the band** — the
editor drops it on the timeline at 100%, no cropping or keying.

`fire.py` / `gpt_image_2` now applies only to the **other designs** (Apple Light, Midnight
Cinematic, Savings Green, Broadcast Bold), which have no HTML implementation yet. For **Apple Navy
— the shipping default — both pieces are HTML.** If a design needs a variant, change the HTML; do
not go back to a prompt.

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


Generate the phone-number brand graphics for a CTV Calls creative: **Banner** (bottom-third strip, on screen ~0:12 → end) and **EndCard** (full-frame close), one per tracking number (Roku and/or Trade Desk). These are creative-type-agnostic — breaking news, podcast, VSL, UGC all use the same cards. (The anchor wall composite is a separate, breaking-news-only flow: `anchor-wall-composite`.)

## The template libraries (source of truth)

Each **brand** has its own template library + wordmark, resolved by `fire.py --brand <KEY>` (the registry lives in `scripts/fire.py` → `BRANDS`). Registered brands:

| Brand | Key | Template library (under `/Volumes/ads/PFM MEDIA MASTER FOLDER/`) | Wordmark |
|---|---|---|---|
| SaveMaxAuto | `SMA` | `7. SMA Organic/SMA - Brand Folder/Endcard & Banner Graphic Templates/` | `…/SMA - Brand Folder/Logos/savemaxauto-wordmark.png` |
| SaveMaxHomes | `SMH` | `2. Client Media Assets/SaveMaxHomes - Client Assets/Endcard & Banner Graphic Templates/` | `…/SaveMaxHomes - Client Assets/Logos/savemaxhomes-wordmark.png` |

**New brand:** add a `BRANDS` entry in `fire.py` (or pass `--lib` + `--wordmark` for a one-off). `--brand` defaults to **SMA** so existing calls keep working.

One folder per design, each holding `design.md` (Banner + EndCard prompts with `{PHONE}` placeholders — banner is the FIRST ``` code block, endcard the SECOND) plus preview PNGs. The SAME design names exist per brand; the prompts differ only by brand (wordmark + accent suffix + per-brand compliance line, e.g. SMA "$50/month" vs SMH "$600/year"). Current designs:

| Design | Vibe |
|---|---|
| **Apple Navy** | The locked original — Apple keynote dark (shipped in 4+ projects) |
| **Apple Light** | Keynote light mode — airy, daytime cuts |
| **Midnight Cinematic** | Film title card — theatrical premium |
| **Savings Green** | Money-coded emerald — trustworthy, calm |
| **Broadcast Bold** | Network-news blue + gold — urgent |

New designs may be added over time — always list what's actually in the **brand's** folder (a brand may not have every design's `design.md` built yet), not just this table.

**🔴 Banner geometry default — DEFAULT TO THE TALLER BANNER (Sam, updated 2026-07-11):** the banner must land at **~1/5 of frame (≈20% on screen)** — tall enough that the compliance / disclaimer line ALWAYS fits. Recent gens have been coming out too THIN (~1/6–1/7 of frame); that is the miss to correct. Spec the ribbon at the **bottom ~18–20%** WITH a **VERTICAL RHYTHM breathing-room block** (text rides slightly high in the band, clear navy dead space under the number ≈ a third of the band's height) so it reliably renders at the full ~1/5. **Never default to the thin ribbon.** Guardrails still hold: a 12% spec renders too narrow (the 07-08 Houston miss); a 30% spec renders way too tall (06-11) — the taller default sits between, landing at ~1/5. Both brands' Apple Navy `design.md` carry the calibrated language — if a design's `design.md` still specs the thin 12–15%, bump it to this taller treatment at fire time.

## Workflow

### 1. Intake (silent — no questions you can answer from context)

- **Brand**: from the Notion request / project (SaveMaxAuto/SMA, SaveMaxHomes/SMH, …). Resolves which library + wordmark `fire.py` uses via `--brand`. If the brand has no library registered yet, say so and stop.
- **Project folder**: from session context / cwd. Graphics land in `<project>/Elements/Graphics/<variant subfolder>/` — reuse the variant subfolder the project already uses (e.g. `Nationwide - Washington/`), else create one named for the variant (a Broad creative can land in `Elements/Graphics/` directly).
- **Tracking numbers**: from the Notion request or chat. Render the number in the format the request locks — local numbers as `(XXX) XXX-XXXX` (parens, single space after the paren, flush hyphen), toll-free numbers as `1-XXX-XXX-XXXX` (toll-free is conventionally shown with the leading 1). `fire.py` accepts both and renders EXACTLY what you pass — never reformat a number the request locked. When the request is silent on format, default a local number to `(XXX) XXX-XXXX`.
- **Variants**: Roku and/or Trade Desk — one Banner + one EndCard per number. "We only have the Roku numbers right now" is common; fire what exists, note what's deferred.
- Never ask the editor to re-paste a Notion URL or project folder that's already in the session.

### 2. Ask the design (the one required stop)

Plain markdown chat — never AskUserQuestion cards. List the designs in the **brand's** library with their one-line vibes, plus anything relevant (e.g. "the project's earlier graphics used Apple Navy"). Bundle into this same message anything genuinely missing from intake (numbers, variants, an unusual phone format). Sister-variant projects usually want the same design as their siblings for consistency.

### 3. Confirm + fire

One short confirm line (brand + pieces × numbers × design + cost at ~7 cr/graphic + output folder), then fire on the editor's go. If the editor already gave brand + design + numbers + go in one message, skip straight to firing. A batch ≥20 graphics (rare) requires the full Rule-3 preflight.

Fire via the bundled script (handles extraction, wordmark upload, parallel fire, download + naming).
🔴 **NON-Apple-Navy designs only. An Apple Navy `"piece":"Banner"` OR `"piece":"EndCard"` job
here is a rule violation — those go through `banner_html.py` / `endcard_html.py` (see the locked
rule at the top of this skill).**

```bash
python3 ~/.claude/skills/call-graphics/scripts/fire.py \
  --brand SMH \
  --design "Apple Navy" \
  --out "<project>/Elements/Graphics/<subfolder>" \
  --jobs '[{"piece":"Banner","variant":"Roku","phone":"1-833-338-5059"},
           {"piece":"EndCard","variant":"Roku","phone":"1-833-338-5059"}]'
```

`--brand` defaults to SMA (omit it for Auto work). `--dry-run` prints the job plan without spending. Model is locked to `gpt_image_2` 2k 16:9 with the **brand's** wordmark as ref (the script uploads it fresh each run) — never NB Pro for brand graphics.

**🔴 Rule 5 — show every graphic the instant it lands:** as each Banner/EndCard finishes generating, surface it to the editor immediately — 📲 tappable CloudFront link + the Higgsfield widget (`job_display` / `show_generations`) — labeled (piece, variant, number), BEFORE download, BEFORE the digit-verify pass, BEFORE any pick. Verification verdicts come after the reveal, below it, never as a gate.

### 4. Verify (always, before handoff)

Read every output PNG and check:
- **Phone digits character-for-character** against the intended number, in the intended format — transposed/missing digits (or a reformatted number) are the #1 failure. Refire any miss (2-retry cap, then flag to the editor).
- **Wordmark integrity** — real brand lettering (SaveMax**Auto** / SaveMax**Homes**), no invented marks, no stray dot artifacts between 'SaveMax' and the suffix.
- **Banner shape** — the TALLER ribbon in the bottom ~1/5 (~20%, NOT a thin 1/6–1/7), crop area (top) clean and empty, brand appears ONCE (left-panel wordmark only — the brand is NOT spelled out in the text area).

### 5. Deliver

Four-link handoff (these are single shown graphics): 📁 raw `/Volumes/ads/…` path in backticks + 🔗 clickable link via `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<path>"` + 🦊 rail drop via the same helper with `--fox-drop` + 📲 **Tappable** — each shown graphic uploaded via `higgsfield upload create "<file>" --json` (CloudFront URL, tappable on the editor's phone, no Lucid; locked 2026-06-15). List what landed per variant. **NEW YORK cuts only:** if the creative is a NY cut with synthetic performers, add the one-line reminder that the AI-performer disclaimer still needs to be in the final edit (Hard Rule 4 — scope corrected 2026-07-17 to NY-only; non-NY creatives never carry it). The graphics never carry the disclaimer themselves.

## Failure modes

- **Queue stall** (CLI returns empty `[]` after ~3 min): just refire — second attempt typically lands in ~2 min.
- **Digit miss / extra digits / reformatted number**: refire with the same prompt (the format language is already maximal); 2-retry cap then surface.
- **Duplicate brand in banner text area**: the template forbids it, but if it appears, refire — don't hand off.
- **Wordmark UUID**: never reuse a cached UUID across sessions — the script uploads fresh every run.
- **Brand has no `design.md` for the requested design**: a brand's library may have preview PNGs but not every `design.md` yet. `fire.py` lists which designs are buildable; if the one you need is missing, build its `design.md` (adapt the sibling brand's, swapping wordmark + accent suffix + the per-brand compliance line) before firing.

## File naming

`<Banner|EndCard> <Roku|TD> <last-4-digits> - <Design> - GPT_<4-hex>.png` — e.g. `Banner Roku 8286 - Apple Navy - GPT_3f2a.png`. The script does this automatically (last-4 = the final four digits regardless of phone format).

## 🔴 DIGIT GATE — mechanical digit-verify (G3, mandatory — added 07.17.26)

Any output whose graphics carry NUMBERS (tracking numbers, rates, board values, quote pages) delivers ONLY through the shared digit gate:

```
python3 ~/.claude/skills/call-graphics/scripts/digit_gate.py init "<output dir>" --expected "<the exact number(s)>"
# → gate CLOSES. For EACH listed file: Read the PNG, compare char-for-char, then confirm/fail it:
python3 ~/.claude/skills/call-graphics/scripts/digit_gate.py confirm "<dir>" "<file>"     # or: fail "<dir>" "<file>" "reason"
python3 ~/.claude/skills/call-graphics/scripts/digit_gate.py status "<dir>"               # exit 0 = gate open
```

**Delivery/handoff is FORBIDDEN while `status` exits nonzero.** Run `init` right after download; confirm per-file only after actually Reading that file (attestation, like ref-check — one file at a time, never blanket). FAILED files get fixed/refired, then confirmed. Include the "VERIFIED n/n" line in the delivery report.

## Not for

NOT for: the anchor wall composite (use anchor-wall-composite — that's breaking-news-only), Veo video gens (use hvg-flow), b-roll images (use hig-flow), one-off image experiments (use higgsfield-image-generation), or a brand that has no template library yet (say so and stop).
