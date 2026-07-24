---
name: assetgen-rokuctv-calls-breakingnews
description: "THE asset-gen pipeline for a Roku CTV Calls BREAKING NEWS 16:9 creative (alias: /ag.rctv.c.bn). Runs END TO END as ONE job — reuse-first staging → Rachel standups → banner/endcard → CALL NOW chyrons + CITY headline strips → Steve wall composites → BOTH Steve close halves (L11a AND L11b) → city-named files → digit-verify → additive DaVinci import → delivery. Use when a Roku/CTV Calls breaking-news request drops (state variant, CITY variant, or new number set) — Car Chase, Car Repo, Home Eviction BN family — or when the editor says 'run the roku bn flow', '/ag.rctv.c.bn', 'asset gen for the breaking news calls creative'. NOT for podcast story ads (hvg-flow), VSLs (vsl-state-variations), or Forms creatives."
---

# AssetGen — Roku CTV Calls Breaking News (/ag.rctv.c.bn)

The complete asset-gen job for a Roku CTV Calls BN 16:9 creative. **Run ALL steps as one pipeline — the editor never chases individual steps.** Locked from the WA Cities Car Chase/Repo build (2026-07-08). All 16:9. Numbers are graphics-only — never spoken, never a gen multiplier. Every fire streams results the instant they land (Rule 5).

## ⚡ Backgrounding rule
Every gen >30s runs `run_in_background: true`; 3+ gens in one action = always backgrounded. Never chain `cmd &` inside a backgrounded shell (orphans the fire — 07-08 Tacoma miss).

## The pipeline (per variant × concept)

**0. Stage reuse-first** (via `stage-request` on an initial batch; iterations fire direct). Only the state/city-variable AI lines regenerate — BN family: Steve intro L2, Rachel standup L3, Rachel rate-VO L7, Steve close L11. A CITY variant of a built state = usually ONLY Rachel's L3 + the graphics/wall/close set. Refs are SCENE frames: Rachel field refs (`Field Reporter - Street BG` for Chase-street, `News Anchor - Field (Rachel Torres)` for Repo-home), `Studio Anchor - v2_c3d4.png` for Steve. Ref aspect == render aspect (16:9).

**1. Rachel standups** — `veo3_1_lite --generate_audio true`, 16:9, 8s, count=1, frame_to_video single `--image`. Onset protection: **"Yeah," throwaway lead** ("Yeah, thanks Steve. I'm standing…" — editor trims; delivered line stays "Thanks Steve…") + clipped-onset negatives + anti-Canadian negatives when a Vancouver-WA is in the set (BG locks to the field ref, city is spoken-only).

**2. call-graphics** — Banner + EndCard per tracking number (Apple Navy default / match siblings; gpt_image_2 2k; fire.py variant accepts only Roku|TD — last-4 digits identify city jobs). **Banner MUST get the transparency pass** (gpt_image_2 outputs opaque RGB): PIL — first row with mean brightness <235 ≈ ribbon top (~85% down), alpha=0 above it, ribbon untouched. EndCard stays opaque (full-frame). Digit-verify every card.

**3. bn-lower-thirds** — CALL NOW chyron per number + **HEADLINE strip per CITY × concept** (city variants get city headlines — "SEATTLE SINGLE FATHER'S CAR REPO GOES VIRAL" — not just the state's). LATU 2048×289, export transparent+lossless+pro. City-cycling: `copy-design` the state page into a 1-page scratch copy, then edit→export→edit→export through the cities (team decks stay pristine). Decks: Car Chase `DAHKyFyh2lE` (WA p47), Car Repo `DAHKycjF4nY` (WA p48), Phone deck `DAHO0nPr4OM`; scratch copies: the current per-creative deck (see `bn-lower-thirds` — ⚠️ Canva retirement in progress). ⚠ Canva is being retired (see `project_canva_transition_july_2026` memory) — confirm it's still the path first.

**4. anchor-wall-composite** — Steve EndCard-wall composite PER end card: gpt_image_2 **1k** 16:9, anchor frame FIRST `--image`, end card SECOND. Verify the FULL phone number incl. the opening paren on the wall (the wall curve eats it).

**5. Steve close cinemagraphs — BOTH HALVES, L11a AND L11b, one each per composite** ("WHERE IS 11A?!" — never skip a half). **D-locked**: the composite UUID as BOTH `--start-image` AND `--end-image`. `veo3_1_lite --generate_audio true`, 16:9, 8s. Master blocks (car_chase_roku_calls_master.md L12a/L12b) verbatim, with:
- L11a dialogue: "Wow, just incredible. If you're a <STATE> driver, you can check your rate right now and see if your policy is missing discounts. Call Save Max Auto at the number on your screen." (cold open 'Wow')
- L11b dialogue: "Rates as low as fifty dollars a month, and it only takes about five minutes on the phone. Call before they close at 5 PM today." (cold open 'Rates')
- Dialogue identical across cities — only the wall differs.
- DROP the "no actual phone number appearing on screen" negative (the number IS on the wall by design).
- **AUDIO CLARITY BLOCK (anti-muffle, added 07-08 after muffled v1s):** audio.capture = "His voice is captured CLOSE, DRY, CLEAN and CRISP by the studio broadcast microphone in an acoustically treated, dead-quiet news studio. Bright, present, fully articulated broadcast clarity — every consonant crisp, the voice forward in the mix, no distance, no room sound." + environment "dead-quiet treated broadcast studio, zero room tone" + negatives "muffled voice, muddy audio, distant-sounding voice, voice behind glass, low-pass filtered audio, underwater sound, roomy sound, echo, reverb, boomy low-mid voice, off-mic voice".

**6. NSFW false-positives are stochastic per-clip** — identical dialogue passes on siblings. Refire with a **v0N slug bump** (id/title change = new prompt fingerprint), dialogue untouched. Refires never overwrite (v01 stays). **Cap the API ladder at ~3 consecutive trips on one clip** — 3+ means it's deterministic for that combo, not stochastic (Tacoma Repo L2 hit 6 straight on 07-08 through id bumps + body rewords + neutral metadata, ~72 cr wasted), and the escape hatch is the **manual UI fire**: hand the editor the copy-paste package (full prompt + ref image 📲/📁/🔗 + settings line: model / D-lock both frames / 16:9 / 8s / audio ON) — the Higgsfield UI frequently passes what the API rejects. Editor files their own gen; take their word it's done.

**7. Naming** — CITY/state + concept in EVERY filename, number kept at the end for cross-check: `Banner - Seattle Chase (206) 864-6493 - Apple Navy - GPT_xxxx.png`, `BN Lower Third CALL NOW - Tacoma Repo (253) 247-4635 - LATU_xxxx.png`, `car_chase_roku_calls_seattle_L11b_v01.mp4`, `Studio Anchor EndCard Wall - Vancouver Chase (360) 363-0907 - GPT_xxxx.png`.

**8. Deliver** — digit-verify every graphic + composite (Read each PNG); stream every gen as it lands (📲 tappable + widget, BEFORE QC); DaVinci: **first import = whole-folder mirror; ANY later add = ADDITIVE ONLY** (never `DeleteFolders`, never touch `Creatives/`; verify timelines + Creatives unchanged — see `feedback_davinci_import_whole_folder`); Notion `✅ Assets Generated` comment + `Asset Gen` property lifecycle; full 📁/🔗/🦊 handoff; NY AI-disclaimer flag for the final cut (NY-market variants ONLY — Rule 4 is NY-scoped, never all-SMA).

## Numbers-TBD fork (staging never waits on the phone lines)

The pipeline splits on the tracking numbers: **number-independent** (staging, Rachel standups — Step 1, CITY/state HEADLINE strips — Step 3) vs **number-dependent** (Banner/EndCard — Step 2, CALL NOW chyrons — Step 3, wall composites — Step 4, Steve closes — Step 5). The number is never spoken in any clip (house convention: "the number's on your screen"), so the standups are ALWAYS fire-ready regardless.

- **Numbers REAL** — run the full pipeline, Steps 0–8, in order.
- **Numbers TBD** — stage + fire the number-independent set NOW; **HOLD** everything number-dependent. The dialogue manifest marks the close clips `HELD (number TBD)`, and the 🤖 section's clip math covers only the fire-ready subset with the arrival sequence spelled out:
  > ☎ number lands → call-graphics → anchor-wall-composite → fire L11a/b → CALL NOW chyron
- At the route fork, with numbers TBD also offer **(c) hold everything** for one combined pass when numbers land — some editors prefer a single AGF run.

## The completion pass (when the numbers land)

Its own trigger — "TX numbers are in: (XXX) XXX-XXXX / …". Per creative:
1. **Step 2** — Banner + EndCard with the real number (digit-verify character-for-character).
2. **Step 4** — Steve wall composite from the new EndCard (verify the FULL number incl. the opening paren).
3. Update the dialogue manifest (un-HOLD the close clips, record the number) + the 🤖 section (add the close-clip math) → flip `Asset Gen = Ready` for the remainder (AGF's resume diffs the folder and fires only the gap) — or fire locally on the editor's call.
4. **Step 3** — CALL NOW chyron per number.
5. **Steps 7–8** — city-named files, digit-verify, stream every gen as it lands, deliver with the full 📁/🔗/🦊 handoff of everything new. Remind that the on-screen rate graphic + number drop-in stay edit-time.

## Reusable fire scripts (WA Cities build — adapt, don't re-derive)
`…/Auto - July 2026/07.08.26 - Car Chase + Car Repo Breaking News - WA Cities Roku CTV Calls/Elements/Prompts/`:
- `wa_cities_L3_fire.py` — Rachel standups (onset-protected)
- `wa_cities_anchor_wall_fire.py` — Steve wall composites
- `wa_cities_L11a_wall_fire.py` / `wa_cities_L11b_v2_clarity_fire.py` — D-locked closes (v2 = with the clarity block; use THIS as the base)

## Cost quick-math
Veo Lite +audio ≈ 12 cr/clip · gpt_image_2 2k card ≈ 7 cr · 1k composite ≈ 5-7 cr. A 3-city × 2-concept run ≈ 6 standups + 12 cards + 6 chyrons/headlines (Canva, free) + 6 composites + 12 closes ≈ **300 cr** before retries.

## Cross-references
`stage-request` (gate) · `call-graphics` · `bn-lower-thirds` · `anchor-wall-composite` · memories: `project_roku_bn_graphics_checklist`, `feedback_davinci_import_whole_folder`, `project_canva_transition_july_2026`.

## 🔴 DIGIT GATE — mechanical digit-verify (G3, mandatory — added 07.17.26)

Any output whose graphics carry NUMBERS (tracking numbers, rates, board values, quote pages) delivers ONLY through the shared digit gate:

```
python3 ~/.claude/skills/call-graphics/scripts/digit_gate.py init "<output dir>" --expected "<the exact number(s)>"
# → gate CLOSES. For EACH listed file: Read the PNG, compare char-for-char, then confirm/fail it:
python3 ~/.claude/skills/call-graphics/scripts/digit_gate.py confirm "<dir>" "<file>"     # or: fail "<dir>" "<file>" "reason"
python3 ~/.claude/skills/call-graphics/scripts/digit_gate.py status "<dir>"               # exit 0 = gate open
```

**Delivery/handoff is FORBIDDEN while `status` exits nonzero.** Run `init` right after download; confirm per-file only after actually Reading that file (attestation, like ref-check — one file at a time, never blanket). FAILED files get fixed/refired, then confirmed. Include the "VERIFIED n/n" line in the delivery report.
