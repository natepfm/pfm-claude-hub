# QVC Screen Graphics — method history (v1 → v2 → v3)

> Moved out of `SKILL.md` on 2026-07-09 when v3 (HTML → headless Chrome) became THE method. This file preserves the v1/v2 record and the craft lessons they produced — several of those lessons (approved-base law, PIL patch registration, gray-key transparency) still back the current pipeline's PIL patches and the animation engine. Superseded scripts live in `legacy/` beside this file.

## v1 — gpt_image_2 bases + PIL state swaps (07-08 maiden, REJECTED as the front door)

The original approach: render each element's base ONCE in gpt_image_2 (2k, quality high) with exact text, digit-verify by Reading the PNG, then PIL-patch value regions for states. It produced glossy full-bleed "hero ad cards" — rounded corners against WHITE, no alpha, centered maximalist design. Sam rejected them: **unusable as overlays** and not what the pinned QVC example looks like. gpt bases remain a fallback only for an element that genuinely needs rendered art.

### v1 elements + states (Houston maiden reference)

| Element | Base | States | Alpha |
|---|---|---|---|
| Savings Board (hero) | gpt 16:9 "$240 LIVE RATE + meter" | $240→$190→$120→$58 + $58 FLASH (gold text + gold border); meter shortens per state (frac 0.97/0.75/0.45/0.16) | opaque |
| Discount checklist | gpt 3:4 all-unchecked, HOMEOWNER hero last w/ gold star | +safe → +multi policy → +HOMEOWNER (gold ticks, flash border on hero) | opaque |
| Caller counter chip | gpt 16:9 chip on FLAT GRAY (keyable) | 4,217 → 4,251 → 4,300+ | keyed PNG |
| Deal Card | gpt 3:4 full spec card (ITEM/VEHICLE/COVERAGE/anchor strike/WAS→NOW/AS LOW AS) | base + optional pre-save (cover NOW band) | opaque |
| Caller lower-third | gpt 16:9 "NAME · CITY, ST" on gray | per caller (PIL name swap) | keyed PNG |
| CONNECTING… + number | pure PIL | 1 | transparent |
| Channel bug | PIL: SMA wordmark (`SMA - Brand Folder/Logos/savemaxauto-wordmark.png`) + red LIVE tag | 1 | transparent |

### v1 workflow (superseded — kept for the record)

1. Fire bases (gpt_image_2 2k) with EXACT text; Read each → digit-verify. Editor approves each base before states (approved-base law).
2. Run `legacy/qvc_states_registration_final.py` (adapt the STATES/text values per city — future: texts JSON). Boards/checklist/counters/LTs/CONNECTING/bug all render from it.
3. Contact-sheet EVERY output; verify digits + registration; iterate constants only via measured scans.
4. Deliver to `Elements/Graphics/Board States/` + full 📁/🔗/🦊 handoff; city variants = edit values, rerun (PIL states are free).

Scripts: `legacy/qvc_graphics_states_v1_draft.py` (draft) and `legacy/qvc_states_registration_final.py` (final v1 state renderer).

## 🔴 PIL registration lessons (each cost a render round, 07-08 maiden — STILL APPLY to any PIL patch today)

1. **NEVER guess patch regions or sample colors at fixed points.** Sample fills as the DARKEST median of several candidate patches (a single point lands on white glyphs or the gold meter). Compute chip bounds with a non-gray bbox scan (keyable bases have flat gray bg — trivial bbox). Find text boundaries by white-column scan in the text band — and scan from PAST the previous text run (the first scan from 0.42w caught the old name's trailing S, not the next word).
2. **Cover regions fully incl. glyph descenders** (board number bottoms peeked below the patch) but NEVER into neighboring art (a too-tall patch clipped "LIVE RATE"; a too-wide patch beheaded HOUSTON's H). Verify EVERY state visually on a contact sheet — the digit-verify law applies to PIL states, not just gpt bases.
3. **Redraw what the patch erases**: the LT's gold underline segment, the "·" separator (recenter between the new name and the next word).
4. **Transparency**: keyable bases render on FLAT solid gray → keyout by bg-tolerance flood (tol≈28). gpt can't output alpha; the gray-key pass is the recipe (BN banner precedent).
5. Fonts: Arial Black (`/System/Library/Fonts/Supplemental/Arial Black.ttf`) passes at broadcast size against gpt's heavy sans.

## v2 — pure-PIL broadcast recreation of the pinned example (07-09, interim)

After the v1 rejection, the package was rebuilt in pure PIL to match the pinned example's live-TV look: flat semi-transparent white panels (~92% alpha), gray label strips, QVC-red accent blocks ~(190,15,45), hairline rules, small condensed broadcast type (Arial Narrow Bold), lots of small data rows, edge-anchored layout (left spec column, bottom order bar + red deal tag, translucent corner bug). Ref impl: `../scripts/qvc_broadcast_overlays.py` (Houston maiden, 15 overlays: Deal Panel ×5 rate states incl. 58 FLASH, Checklist ×3, Order Bar ×3 counter states w/ phone + TODAY'S DEAL tag, Caller LT ×2, CONNECTING, channel bug). City variants = edit the value/name constants, rerun — free.

**Why v2 was superseded the same day:** PIL's system-font/flat-shape output read "cheap" (Sam, 07-09). The layout language and element inventory carried straight into v3; only the renderer changed (HTML/CSS in headless Chrome — real typography, gradients, soft shadows, hairline strokes).
