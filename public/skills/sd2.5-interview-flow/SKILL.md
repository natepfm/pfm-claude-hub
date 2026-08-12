---
name: sd2.5-interview-flow
description: >-
  SD2.5 Interview Flow — PFM's NO-SEAM CHAIN method for group-interview UGC on Seedance 2.5:
  every clip fires off the RAW last frame of the prior approved take, with the editor-stamped
  master plate riding every fire as the identity ref and hard travel/cut/blur gates in the fire
  path. Use on: "sd2.5 interview", "run the sd2.5 flow", "no-seam chain", "run the chain flow",
  "sd2.5 clips". (Supersedes ugc-interview-flow-v2, the bounded start+end-keyframe method.)
---

# SD2.5 Interview Flow — the no-seam chain method

> **Lineage.** V1 (`ugc-interview-flow`) chained blind pans — prose destinations, 83% credit
> overage. V2 (bounded start+end keyframes, built 07-27 from two Mitchell Gamache drift
> write-ups) proved real endpoints kill the blind-pan class — 24/24 shipped on its first live
> run — but GENERATED end frames repaint the scene, and "background drift" became its own
> failure class. **SD2.5 — this skill, locked 2026-08-10/11 — chains again, off REAL pixels:**
> each clip's `--start-image` is the verified rip of the prior APPROVED take, the stamped master
> plate rides every fire as the identity `--image` ref, and deterministic hard gates
> (plate-blur / cut / travel) sit in the fire path with one auto-refire. Proven live 08-11
> (House Party Seniors, 12 clips: blur gate 4/4 plates, travel gate caught + auto-fixed 2 real
> centre-pushes, cut gate clean 12/12). The bounded method is retired — its history and drift
> ledger stay below and in `references/bounded-chain-method.md` because its lessons still bind.

## 🔴 PRE-FIRE CHECKLIST — read TOP OF SKILL, run EVERY fire, no exceptions

Rules buried mid-skill get skipped under momentum (Sam, 07-28: fixes "buried somewhere in the
middle… that's why it's missing things"). So the laws live HERE, first, as a checklist — and each
one is ALSO enforced in code, so skipping the read still can't skip the law:

0. 🔴🔴 **THE PLATE IS EDITOR-APPROVED BEFORE ANY CLIP FIRES — no exceptions (Sam, 2026-08-10:
   "we must approve the plates before we fire dude. THATS CRUCIAL").** The flow is plate → show it
   (📲 + 📁 + 🔗) → STOP → the editor stamps it in chat → only then does the chain run hands-off.
   "Do all of them" / "run the chains" authorizes the CHAINS, never skipping the stamp. A bad plate
   poisons every clip chained off it (~$28/version).
   **ENFORCED IN CODE:** `chain_fire.py` refuses any fire whose plate lacks a sibling
   `<plate>.stamped` marker; touch the marker ONLY on the editor's explicit approval, never
   pre-touch it. Direct 3-media fires (the c03 phone close) inherit the stamp from the chain —
   never direct-fire against an unstamped plate.

0b. 🔴🔴 **PLATES ARE DEEP-FOCUS — a blurred/bokeh background is an auto-REFUSE (Sam, 2026-08-11:
   the HouseParty Seniors plates' blurred backgrounds "hold when we move in and that doesnt look
   like iphone anymore"; he cut the whole project over it).** Every plate-gen / cast-swap prompt
   MUST carry a deep-focus clause — *"everything in sharp focus front to back, deep depth of
   field, no background blur, no bokeh — an ordinary iPhone main-lens snapshot"* — and never any
   portrait/bokeh wording. **ENFORCED IN CODE:** `chain_fire.py` runs `gates.py plate` on the
   stamped plate before ANY fire (Laplacian background-vs-subject ratio; calibrated PASS band
   1.23–3.22 on five shipped plates vs 0.003–0.096 on blurred specimens, threshold 0.30). A
   blurred plate refuses even when stamped — editor override only via `<plate>.blur_ok`.

0c. 🔴🔴 **EVERY LANDED TAKE PASSES THE HARD GATES BEFORE THE SEAM ADVISORY (Sam, 2026-08-11:
   "LOCK IT NOW AND PROVE IT'S LOCKED" — the wrong-travel c01 class shipped TWICE (Indian V4,
   HouseParty V1) and a mid-take hard cut shipped once (HouseParty V4)).**
   **ENFORCED IN CODE, in `chain_fire.py` on every landing:** (a) **cut gate** — `gates.py cuts`,
   ffmpeg scene-score ≥0.2 inside a one-take = FAIL (goods measure <0.1, a real cut measured
   0.427); (b) **travel gate** — pass `--travel left` on every c01-class clip: the take must open
   WIDE (≥4 faces) AND push toward the LEFT end first (facebox mean-x drift ≥ +0.05 within 6s;
   editor-good takes measure +0.113..+0.372, the editor-bad wrong-target take measured +0.021).
   A hard-gate failure keeps the take as its `vN` in place and **auto-refires ONCE**; a second
   failure stops (exit 4) and hands all takes to the editor. The old SSIM check is a seam
   ADVISORY only — it never drives gate refires. **A low SSIM / exit-2 "EXHAUSTED" line means
   gates PASSED, advisory low, editor's call — plate-chained starts always read 0.24–0.46 and
   that is normal.** Do not treat exit 2 as a failure.
0d. 🔴 **CHAIN MECHANICS — rip + third media (locked 2026-08-11, HouseParty Seniors run).**
   (a) **Last-frame rips are verified before they feed a fire:** rip with
   `ffmpeg -y -v error -sseof -1 -i <clip>.mp4 -vsync 0 -update 1 -frames:v 999 <LASTFRAME>.png`
   — `-sseof -0.05` seeks past the final frame and silently writes NOTHING, and writing straight
   to Lucid can drop the file. Rip to LOCAL scratch, `file`-verify it's a real PNG, then `cp` to
   the chain folder; fire from the verified copy.
   (b) **c03-class clips (phone close, screen art) pass the screen PNG via
   `chain_fire.py --extra-image <screen.png>`** — appended as an additional `--image` ref after
   the plate, so the 3-media fire still runs through every gate instead of a hand-rolled direct fire.
1. **NO improvised clip prompts at fire time.** Every prompt comes from `scripts/build_prompts.py`
   (spec JSON in → guarded prompts out) **or is a LOCKED per-clip prompt file already in
   `Elements/Prompts/`** (the proven chain run fires builder-built c01s + the `_minimal_v01`
   c02/c03 files). Hand-writing a prompt inside the fire loop is how guards silently vanish
   between clips — measured cost: ~half of 48 fires discarded. If a prompt needs something the
   builder can't say, extend the builder (or edit the locked file as a new version), then fire.
2. **Declare a `move` for every clip** — `approach` (the opener walk-up) / `hold` / `ease` / `reveal_keep` / `pullback3` / `pushin1` only.
   Move TYPE is the real cut driver: scale-change pulls splice, scale-preserving pans never cut
   here. The builder refuses undeclared-sanctioned moves at build time — a bad move never
   reaches a fire.
3. **Full-cast pull-backs are BANNED as a first attempt.** The only sanctioned zoom-out is
   `pullback3` (≤3 characters in the end frame, slow glide). The builder AND the fire gate both
   refuse violations. (V2 c05 cut 5× in a row on the full-group pull — ~250+ credits.)
4. **Two cut-gate failures on the same seam = STOP — built into the chain.** `chain_fire.py`
   auto-refires a hard-gate failure ONCE, then exits 4 with every take kept in place — a third
   identical roll is impossible by construction. Before firing again, CHANGE something: re-rip a
   cleaner seam frame, re-anchor to a plate crop (hop rule), or change the move. No gambling to
   attempt 5. (The bounded era's `.cut_ledger.json` breaker lives only in the legacy scripts.)
5. **Clean visual + bad audio = `labs-voice-swap`, never a visual re-roll.**
6. **Camera positions come from ONE panoramic plate, crop-then-extend — as the DEFAULT,** not the
   "purest form" option. 34 per-clip end-frame stills on one project was the tell.
7. **Every clip streams the instant it lands** (Rule 5), refires land as the next `vN` in place,
   and the editor stitches — Claude never assembles.
8. 🔴 **METHOD B IS THE DEFAULT for pan/pullback/push-in clips — fire SEAM-ONLY, no end image**
   (`seamOnly: true` + a prose `destination`). A *generated* end frame repaints the scene, so the
   render morphs between two backgrounds — that is the "background drift / background shift" class,
   and it cost most of 07-29. Editor, verbatim: **"stop reimagining the backgrounds."** Never
   generate a per-clip NB aim frame. In the chain path the ONLY image refs on a fire are the
   stamped plate and sanctioned `--extra-image` media (the c03 screen art) — an unsanctioned
   extra ref fights the start frame (measured start diff 51.9 vs the clean 12–17 band).
9. 🔴 **Duration matches the line — target 165–190 WPM (build-time lint WARNS, the editor
   decides; `chain_fire.py` hard-refuses any duration outside 4–30s, Seedance 2.5's ceiling) — and pans are SMALL nudges.** A long clip over too little
   dialogue leaves dead tail, and a full-person-width pan gives the model room to splice — those
   two settings, not prompt wording, are the real mid-clip-cut drivers. Editor also reads a big
   pan as *"too much panning."*
10. 🔴 **Placement comes from the MASTER PLATE, named explicitly.** Spell the left-to-right order
    in the destination (e.g. "P3 LEFT, P4 MIDDLE, OG RIGHT; OG stays rightmost; nobody to OG's
    right") + headcount negatives. Vague prose ("OG in the middle") re-orders the cast.
11. 🔴 **Stillness = the PEOPLE only.** Bodies planted, no walking/stepping/gesturing — but the
    **camera keeps its natural handheld UGC shake**. Never render a locked-off camera.
12. 🔴 **CANARY only for UNPROVEN methods.** A method this file already locks (the c01→c02→c03
    chain with the hard gates) fires ALL versions' c01s in parallel — the gates are the safety
    net, and that is exactly how the proven 08-11 run shipped 12/12 clean. Canary-one-clip-first
    applies when trying a NEW move/method this file doesn't cover yet.
13. 🔴 **A green gate is mechanical, and Claude does NOT look — the EDITOR is the content check
    (NO AUTOMATIC QC, system law 2026-08-04).** Stream every take the instant it lands (📲 +
    📁/🔗, no verdict) and the editor reads content failures (wrong person, placement, screen
    legibility) from there. Claude reads frames ONLY when the editor asks.
14. 🔴 **EVERY dialogue beat for that clip ships in the prompt — NEVER truncate the script to fit
    the builder.** Count the beats in the request's Copy for the clip (host question, answer, mid-clip
    host interjection, the one-word button) and verify each appears. If the builder can't express a
    beat, EXTEND IT (`followUp` exists for exactly this) — measured 07-29: the c06 closer shipped
    missing "Wait, you can negotiate? / Always." because a tool limit silently edited the script.
    Script is law (Phase 0 #1); a tooling gap is never a licence to shorten a line.
    **ENFORCED IN CODE:** put the clip's verbatim beats in `"script": [...]` and `build_prompts.py`
    HARD-FAILS (exit 1, no prompt written) if the built prompt drops one — verified 07-29 by
    re-running the original mistake. A clip with no `script` list builds with a loud ⚠ UNVERIFIED.
15. 🔴 **CAST IDENTITY NEEDS REAL PIXELS, NEVER PROSE.** If a clip reveals anyone who is NOT already
    visible in its seam, the render WILL invent them (measured 07-29: a pullback off a tight single
    produced two fabricated men — wrong jackets, wrong faces). Prose wardrobe descriptions do not
    hold identity. Anchor it with a **REAL frame** — the approved earlier clip's last frame that
    contains those people (e.g. the c03 seam holding P3·P4·OG), passed via
    `chain_fire.py --extra-image`. A real frame is NOT the banned generated aim frame: real
    footage carries the true faces AND the true background, so nothing repaints. Generated end
    frames stay banned (see #8).

16. 🔴 **REFERENCE-FIRST, and the EDITOR outranks the analysis tool.** Before building any clip that
    has a precedent (a reskin's parent build, or a clip the editor points at), WATCH it with
    `watch-video` and lift the measurable parameters — move type, move start/stop timecodes,
    static tail, start/end framing, dialogue beats and pause lengths — then encode those numbers.
    (`watch-video` is EDITOR-INVOKED — never watch your own landed output unless the editor asks;
    NO AUTOMATIC QC is the system law.)
    🔴 When the analysis and the editor disagree about their own footage, **the editor is right**:
    on 07-29 Gemini reported the reference closer had "no parallax" and the editor said it was a
    forward camera move with visible parallax — believing the tool cost another roll.

17. 🔴 **B0 — NEVER ISOLATE A NON-FINAL CLIP (the root fix, 2026-08-06).** Every non-final clip
    lands on **≥2 characters** so the next speaker is ALREADY real pixels in the seam — an isolate
    forces the next clip to introduce someone from off-frame and the model invents them (the whole
    reveal-morph class). Follow the CANONICAL SLIDING-WINDOW MAP in `build_prompts.py` (a 3-wide
    window slides right one seat per clip; only the final closer's `pushin1` isolates). **ENFORCED
    IN CODE:** the builder refuses `inFrame<2` on any non-final clip — an isolating spec never
    produces a prompt, so it never reaches a fire. Scaffold specs from `sliding_window(cast)`.
18. 🔴 **B8 — the PHONE-SCREEN CLOSER + LANDER are PHASE-0, never mid-fire discoveries.** BEFORE the
    first fire: **(a) source the lander from the CURRENT discount-lander canon for the vertical**
    (Sam, locked 2026-08-11 — "use the right graphic moving forward, for home and auto creatives"):
    **AUTO** → template `2. Client Media Assets/SaveMaxAuto 2026 - Client Assets/Discount Lander -
    SMA/Quote Pages PNG/1.png` (the 🎉 Congratulations / 4 Discounts Applied page); a proven
    ready-made phone mockup at $52/mo lives in the Block Party Asian / Australian / Russian
    projects' `Elements/Graphics/SaveMaxAuto_52mo_phone_mockup.png` (sha256 94e4e89b…, all three
    byte-identical) — byte-copy it when the scripted rate matches, rebuild from the template when
    it doesn't. **HOME** → the current Home discount lander under `2. Client Media Assets/Discount
    Landers (Auto + Home)/HOMES - DISCOUNT LANDER/` (or the SaveMaxHomes 2026 client assets).
    🔴 **A matching RATE is not a matching STYLE** — the 2026-08-11 DealershipSr V1 closer shipped a
    stale-style mockup grabbed off a sibling project because its $52 matched; the retired "YOUR NEW
    RATE!" pages and any pre-current-lander mockup are NEVER the source (memory
    `feedback-discount-lander-current-quote-page`); never re-render the lander from a repo. **(b)
    composite it into a small phone MOCKUP** and fire the closer **in-gen at 1080p
    (`chain_fire.py --resolution 1080p --extra-image <mockup>`)** with the content-lock prompt —
    the model must see "a phone," not a full-screen app. 🔴 **Never comp the screen in post;
    garbled screen = re-fire at 1080p.** Full recipe: `references/bounded-chain-method.md` §4.
19. 🔴 **CLIP OUTPUTS LAND IN PER-VERSION SUBFOLDERS — never loose at a tree root** (Sam, locked
    2026-08-10; destination updated to match the proven 08-11 chain run). One folder per cast
    version, named after the version — the chain runs use
    `Elements/Footage/Veo/<V# - Cast Name> - T25 Chain/` (that is where the proven House Party
    Seniors run landed and where `chain_fire.py --outdir` points); a Primary-tree project mirrors
    the `Elements/Footage/Reference/` names instead (`bash scripts/primary_subfolders.sh
    "<project>"` — idempotent, refuses rather than clobber). The law is the same either way: a
    flat root becomes an unsortable pile the moment the second version starts firing.
20. 🔴 **CLIP COUNT IS DERIVED, NEVER INHERITED** (Sam, locked 2026-08-12, BlockPartyGA). The
    number of clips comes from the DIALOGUE BUDGET against Seedance 2.5's 30s ceiling — never
    from copying a prior project's shape. Adjacent beats that share one framing and whose
    combined duration fits ≤30s are ONE clip (one seam fewer to hide); a split must be EARNED
    by the ceiling or a framing change. Measured miss: GA c03 (8s) + c04 (13s) = 21s shipped as
    two clips because the Dealership 4-clip template was copied unchecked. **ENFORCED IN CODE:**
    `build_prompts.py` prints a 🔴 MERGE CHECK on every adjacent same-inFrame pair totaling ≤30s
    — resolve the flag (merge, or state why the split stands) before firing.

21. 🔴 **CHAIN CLIPS FIRE LEAN — the builder emits it, the fire path enforces it** (Sam, locked
    2026-08-12; proven BlockPartyGA lean test + HOASeniors V1/V2 — 4 chain clips, 4 first-take
    passes, best seam SSIMs of any chain: 0.588 / 0.632 ACCEPTED at ~3k chars vs ~19k full
    builds). On a seam-chained fire the seam pixels already carry everyone on screen; each
    speaker gets exactly ONE compact wardrobe anchor (position-only prose loses people — GA lean
    round 1 skipped P4). Voice gender+age pins, air lines, real-time-speed and the PHONE
    SCALE/SCREEN locks stay. **ENFORCED IN CODE, both ends:** `build_prompts.py` writes
    `*_prompt_lean.txt` for every seam-chained clip (with anchor / air / poison / script-line
    refusals inside `build_lean()`), and `chain_fire.py` REFUSES any seam-chained fire whose
    prompt exceeds 6,000 chars (`--fat-ok` = explicit editor override). The first clip fires off
    the PLATE and keeps the full build — the lean law is for clips riding a seam.

22. 🔴 **THE EDITOR CHOOSES THE FIRE MODE — never blow through a chain by default** (Sam, locked
    2026-08-12: "i dont want you to automatically blow through them each time"). Before a chain's
    first fire, ASK the editor: **stepwise** (one clip at a time, editor checks each take before
    the next fires) or **continuous** (straight through, forced stops only)? 5+ cast chains
    especially can go nuanced clip to clip. **ENFORCED IN CODE:** `chain_fire.py` refuses ANY
    fire without `<chain folder>/.fire_mode` containing the editor's answer ('stepwise' or
    'continuous' — written only after they answer), and in stepwise mode refuses each seam fire
    until the prior take carries an editor-OK marker (`<take>.mp4.ok`, touched only on their
    call). The editor can switch modes mid-chain by rewriting `.fire_mode`.

> **2026-08-06 hardening (LOCAL, Mitchell — Bar Mitzvah post-mortem B0–B7; every guard verified by a
> test-spec run).** B0 isolate guard + `sliding_window()` · B1 auto reveal face-ref (`revealRef` → a
> fixed-geometry crop attached as a multimodal identity anchor; **opt-in backup to B0**, not blind on
> every reveal) · B2 version token in output filenames (`…_V3_c07_v01.mp4`; joblist needs a top-level
> `"version"`) · B3 one fixed face-crop geometry, never tighter · B4 auto position-lock on `pushin1`
> · B5 furniture negative (`noObjects`, default true; set false for furniture-legit scenes) · B6
> `propagate_spec_edit.py` matrix-wide fix · B7 `seam.py` fresh-versioned seam basenames.

## ⚡ THE FAST PATH — the chain order, every time (proven 2026-08-11, House Party Seniors: 12/12 clean, 2 wrong-travels auto-caught)

Editor hands over: **the Notion request** + the plate sources (parent plates to reuse and/or cast-swap). Then:

| Step | Who | Spend | Output |
|---|---|---|---|
| 0. **Request is canon** — fetch the Notion request; the Copy section is the dialogue law | Claude | **0** | scripts + rates verbatim |
| 1. **Plates** — reuse parent wides and/or `gpt_image_2` cast-swaps (`--aspect_ratio 9:16 --quality high`, deep-focus clause MANDATORY); every candidate runs `gates.py plate` before it's shown | Claude | ~1 gen/swap | plate candidates |
| 2. **STAMP GATE** — show plates (📲 + 📁/🔗), STOP; editor approves in chat → `touch <plate>.png.stamped` | editor | 0 | stamped plates |
| 3. **Specs + prompts** — spec JSON per version → `build_prompts.py` for the heavy c01s; c02/c03 use the locked `_minimal_v01` prompt files | Claude | **0** | guarded prompts on disk |
| 4. **c01 wave** — ALL versions in parallel, each via `chain_fire.py --travel left`; the travel + cut gates are the net (one auto-refire, then editor) | Claude | ~4 gens | c01 keepers |
| 5. **Chain** — per version as its prior clip lands: rip last frame (`-sseof -1`, LOCAL, `file`-verify, cp to Lucid) → fire c02 → rip → fire c03 with `--extra-image <screen art>` | Claude | ~8 gens | full chains |
| 6. **Stream + verify** — every take shown the INSTANT it lands (📲 + folder 📁/🔗, no verdict); batch ends with an mp4-count check on disk and the 🦊 rail drop | both | refires only | delivered set |

**Budget check:** a clean 4-version run is **~12–14 fires for 12 clips** (gate auto-refires included). The 08-11 run used 14. If you are well past that, stop and ask what got skipped.

**The editor's decisions** are the plate stamps in step 2 and the take reads in step 6 — Claude never QCs pixels and never assembles.

## 🔴 ANTI-DRIFT LAW (added 07-30 from the Seedance 2.0 storyboard + CLI research)

The research's central finding matches this skill's own post-mortems from the other direction:
**drift is a workflow-topology problem before it is a model problem.** Six rules, five of them now
enforced in code rather than remembered:

1. **Pixels carry canon; prose specifies the delta.** The start frame owns identity, wardrobe, set,
   grade and blocking. The prompt should own what CHANGES over time.
2. 🔴 **ONE reference mode per clip — code-enforced.** Reference modes are DISTINCT provider
   scenarios: pick one deliberately, never let refs accumulate. The chain's declared mode IS
   start-frame + identity ref (`--start` rip + `--plate`), and `chain_fire.py` enforces it by
   construction — the only additional media it can even accept is the sanctioned
   `--extra-image` (c03 screen art). What's banned is undeclared extras riding along: an
   unsanctioned ref fights the start frame (our measurement agreed before the research did —
   start diff 51.9 vs the clean 12–17 band).
3. 🔴 **Duration = dialogue budget — code-enforced 4–30s (Seedance 2.5's ceiling).** *(Corrected
   2026-08-11, Sam: an earlier draft capped this at 15s and the gate faithfully blocked real
   fires — House Party's proven takes run 19–25s. Long takes are the norm of this flow, not an
   exception.)* Buy the runtime the DIALOGUE needs (~150 wpm arithmetic) and no more: extra
   runway beyond the words is where the model invents dead tails, a second camera move,
   unwanted dialogue, reframing and identity degradation. Never buy a long clip for a short
   beat — and never starve a long beat into a rushed read.
4. 🔴 **Explicit render profile — no vendor defaults.** The chain fire orders `resolution` /
   `bitrate_mode` / `generate_audio` explicitly on every fire (`720p` default, `1080p` only via
   `--resolution 1080p` for the phone closer's on-screen text · `high` — quoted the SAME price
   as `standard` on 07-30, free quality · audio on). Never lean on a vendor default; a stray
   `genre` preset re-acts the performance — leave genre untouched.
5. 🔴 **Provenance sidecar per clip — code-enforced.** `chain_fire.py` writes `<take>.mp4.json`
   at landing: model / resolution / duration / travel, the prompt FILE path + its sha256, the
   start / plate / extra-image paths, the result URL and the fire timestamp — then merges the
   gate verdict and seam SSIM after gating. The prompt file named in the sidecar IS the exact
   prompt (the sha256 proves it unchanged). "Which prompt made this?" must never be unanswerable
   again. The write is best-effort by design: a sidecar hiccup never discards a landed take.
6. 🔴 **THE HOP RULE — the one this skill still violates by design.** Every generative step is a
   drift event; the research caps edit chains at **two hops** and rebuilds from clean canon on the
   third. **A 6-clip seam chain is a 6-hop chain** — c03 already sits at hop 3. Mitigations, in
   order of preference: re-anchor a mid-ladder clip to a crop-then-extend still off the MASTER PLATE
   instead of the previous take; QC identity/wardrobe against the plate (not against the previous
   clip) at every hop; rebuild from the plate the moment a face or garment starts moving.
   **Also: never blindly seam off the final encoded frame** — it is frequently motion-blurred,
   mid-blink or mid-phoneme. Extract several candidates near the end and seam off the latest CLEAN
   one.

**Cheap mechanic test before a risky shape:** `seedance_2_0_mini` at 720p/5s quoted **12.5 cr** vs
**67.5 cr** for a 15s standard clip. Prove a new handoff, move type or transition topology on Mini
before spending the full model on it. A Mini pass does not prove the full model reproduces the
performance — only that the mechanic is understandable.

**Protect a winning take.** If a 720p clip has the right face, performance, blocking and audio, do
NOT reroll it for resolution — route it through `bytedance_video_upscale` (1080p/2K/4K, `aigc`
preset). Rerolling gambles a won performance. The exception is on-screen TEXT legibility (the phone
closer): the model needs the pixels at generation time, so that still fires at 1080p.

## Move-type law (hard table — keyframe source + background language pair to the move)

| move | camera | destination anchor — rides as REFS/prose (the chain fires NO end frame) | background language | cut risk |
|---|---|---|---|---|
| `hold` | none | the seam itself | FROZEN allowed (only here) | none seen |
| `ease` | lateral, scale-preserving | shifted crop of the plate | "stable through the move" — NEVER frozen | none seen |
| `reveal_keep` | pan, constant scale | crop containing next person | same | none seen |
| `pullback3` | slow widen, ≤3 chars | crop of PLATE, ≤3 people | same | low (the 3-shot held first try) |
| `pushin1` | slow tighten to a SINGLE | prose (seam-only) | same | low (07-29 closer) |
| `approach` | **THE OPENER** — host WALKS UP (forward, real parallax) from the wide to the first speaker, ends waist-up | seam-only off the **master WIDE** | lean/move-led | low (08-04) |
| ~~full-cast pull~~ | — | — | — | **BANNED — 5-cut streak** |

Pairing a camera move with "pixel-for-pixel / frozen background" language is the contradiction
that pastes people into frozen frames (V4 c03, 3 burns). The builder makes that pairing
impossible — another reason prompts are never hand-written.

🔴 **`approach` (the opener) is fired seam-only off the UNTOUCHED master wide — never a cropped/zoomed
start frame** (Mitchell 08-04: "the starting frame NEEDS to be the master wides… don't zoom in"). It
gets its OWN lean, move-led prompt in `build_approach()` — the general block stack (~11.5k chars of
stillness + negatives) SMOTHERED the camera move and Seedance rendered dead-static (measured 08-04,
BlockPartyEN V1 c01). The fix was FEWER guards, move stated first, and "static / no camera movement /
same size the whole clip" in the negatives. Reproduces the proven Spanish `V1_clip01` push-in.
🔴 **Bystanders read NATURAL, not frozen** (same day): planted so nobody walks off, but alive — nods,
smiles, small glances, weight shifts. Freezing them ("feet still, mouths closed") looked stiff; the
`approach` block and `stillness:false` both encode the alive-but-planted version.

## Why V2 existed — the bounded experiment (history that still binds)

V1 chains clips: each clip's start frame is the previous clip's last frame, and the **destination is
described in prose**. That makes every travel clip a **blind pan** — the model gets one starved
close-up plus a verbal instruction ("pan right and stop") with no coordinate system and no pixels for
what's off-frame. So it invents. Measured cost across two builds: **44 rolls for 24 finals (83%
overage), one clip alone eating 34% of all video rolls.**

Worse, the failures **recur**. Five drift classes solved on 07-24 were re-hit on 07-27 by the same
editor, because V1's fixes are *prose lessons* that live in a playbook, not guards that live in the
fire path.

**V2's thesis: make drift structurally impossible instead of asking the model to avoid it.**

## The mechanic — verified 2026-07-27

`higgsfield generate create` does **per-model media-role validation**, and it discriminates:

| Model | `--start-image` + `--end-image` | cr/clip |
|---|---|---|
| **seedance_2_0** | ✅ accepted | 22.5 |
| seedance_2_0_mini | ✅ accepted | 12.5 |
| kling3_0 | ✅ accepted | 10 |
| seedance1_5 | ✅ accepted | 4.8 |
| veo3_1 | ❌ *"Model accepts a single image input."* | — |
| nano_banana_2 | ❌ *"Model accepts only --image (no roles…)"* | — |

Verified through the **non-spending** `higgsfield generate cost` endpoint. Veo and NB Pro reject the
flag, so acceptance is meaningful — the backend knows which models take an end frame.

**How it resolved:** the live runs answered it. Real endpoints DID kill the blind-pan class
(24/24 on the first bounded run, 07-28) — but *generated* end frames repainted backgrounds, and
that became its own drift class. SD2.5 keeps the bounded era's real lesson (**real pixels beat
prose**) and drops its liability (generated aim frames): the chain's start frames are rips of
approved footage, and the only aim that exists is the prose destination plus the plate. This
section is history; the run path is Phase 2's chain.

---

## The pipeline

### Phase 0 — LOCK (zero video credits)

1. **Script is LAW.** Fetch the Notion request FIRST. The **request's Copy section is the canonical
   dialogue** — never the parent creative's master files, even on a reskin where the parent script is
   sitting right there looking authoritative. (This exact rule was violated on 07-27 and cost four
   c04 regens.) Verbatim, no paraphrase, dollar amounts spelled as words.
2. **ONE master plate per version** (NB Pro, 9:16 1k): entire cast head-to-toe in FINAL positions,
   FINAL wardrobe, FINAL environment, interview travels LEFT→RIGHT, closer far right, clear walking
   lane. Editor stamps the plate before anything downstream fires.
3. **Outfit IDs — written FROM THE RENDER, never from the plate's prompt.** For each cast member, a
   verbatim wardrobe + physical block ("the man in the faded blue work shirt, grey moustache, tan
   cap"). NB renders drift from their prompts; describing from prompt text makes the video model
   invent a person matching the words and skip the real one. Outfit IDs are pasted verbatim into
   every downstream prompt and **never paraphrased**. Wardrobe change = new ID.
4. **Reskin cast-divergence check.** If this is a reskin, pull the parent creative's plate and steer
   the new cast deliberately AWAY from its archetypes. Repeating a winner's script is the point;
   repeating its faces is the #1 visual AI tell ("son quintillizas o qué" — 445-comment analysis).

### Phase 1 — CAMERA POSITIONS as stills (cheap, editor-gated)

In the CHAIN, position stills have exactly two jobs: the **c01 START** (the untouched master
wide) and the **re-anchor stock** for the hop rule (Anti-drift #6 — when a mid-ladder face or
garment starts moving, rebuild from a plate crop, not the drifted take). Routine clips start
off the prior take's verified rip, not a still. (The bounded era consumed a full
`pos00`…`pos06` ladder — clip *K* ran `pos(K-1) → pos(K)`; the chain doesn't.)

When a still IS needed — a re-anchor, or a c01 start that isn't the master wide itself — fire it
off the locked plate (NB Pro, plate as `--image` + that position's Outfit IDs), **~2 cr**, and the
editor approves it before it anchors any video spend. The chain does NOT pre-buy a `pos00`…`pos06`
ladder — that was the bounded era; routine clips start off the prior take's verified rip.

**This is where iteration belongs.** Every framing argument, every "that's the wrong person," every
"the house looks different" gets settled at 2 credits instead of 22.5.

**DEFAULT method (promoted 07-28 — per-clip still regeneration burned 34 NB fires in one
project):** generate **one wide panoramic plate** containing the whole cast line, then **crop**
9:16 windows for each position and NB-Pro-extend each crop back to full frame (the
crop-then-extend method, Mitchell 07-27). Positions are then literal crops of ONE image, so
geometry is consistent *by construction*, not by luck. Per-position bespoke stills are the
fallback for when a position genuinely can't be a crop, not the starting point.

### Phase 2 — THE CHAIN FIRES (one clip at a time, off real pixels)

Each clip is ONE `chain_fire.py` invocation. c01 starts off the UNTOUCHED master wide; every
later clip starts off the **verified rip of the prior APPROVED take** (the 0d recipe — rip to
local scratch, `file`-verify it's a real PNG, copy in, fire from the verified copy). The stamped
plate rides EVERY fire as the identity ref.

    scripts/chain_fire.py --prompt <c01_prompt.txt> \
        --start <master-wide-or-prior-rip>.png --plate <stamped-plate>.png \
        --duration 12 --outdir "<Primary/V1 - ...>" --clip <Token_V1_c01> \
        [--travel left]               # arm the travel gate on every c01-class opener
        [--extra-image <screen.png>]  # c03-class third media (screen art) only

There IS a chain again — SD2.5's bet, against V2's — because the start frame is REAL pixels,
not a generated aim frame: nothing repaints. What protects the chain is not hope, it's the
gates below plus the hop-rule mitigations (Anti-drift law #6). The editor stamps each take
before the next clip seams off it — "run the chains" authorizes the chain, never the stamps.

### Phase 3 — THE HARD GATES (in the fire path, not in a lesson)

`chain_fire.py` runs these automatically — the plate gate before any fire, cut + travel on
every landing. You never invoke them by hand on the happy path. Standalone, for diagnosis or
an editor ask:

    scripts/gates.py plate  <plate.png>               # blur gate — iPhone deep focus
    scripts/gates.py cuts   <clip.mp4>                # hard-cut gate
    scripts/gates.py travel <clip.mp4> --expect left  # c01 travel gate (facebox drift)

| Gate | What it catches | Calibration (all measured on shipped takes) |
|---|---|---|
| **plate** | bokeh/pro-camera background riding into every clip | PASS band 1.23–3.22 vs blurred 0.003–0.096; threshold 0.30 |
| **cuts** | a hard cut inside a one-take walk-and-talk | goods <0.1, a real cut 0.427; threshold 0.2 |
| **travel** | opener pushing to the wrong person / centre | good drift +0.113..+0.372, the bad take +0.021; floor +0.05 |

Gate behavior is locked (0c): a failure keeps the take as its `vN` in place and auto-refires
ONCE; a second failure exits 4 and hands all takes to the editor. The SSIM seam check is an
ADVISORY only — it never drives gate refires. **All gates fail CLOSED** (hardened 2026-08-11,
Sol audit): unreadable media or a missing tool is a refusal by name, never a silent pass.

🔴 **Never QC cuts off a 1fps filmstrip** — it misses them (Mitchell 07-24, re-hit 07-27 when a
later write-up reverted to `fps=1`). The native detector reads every frame; that lesson is why
the cut gate exists.

**Creative misses never auto-refire** — they go to the editor per STOP-ASSUMING.

> **Dependencies:** `ffmpeg` + `ffprobe` (PFM installs them to `~/bin`, which is NOT on a stock
> PATH — every script resolves `$PFM_FFMPEG`/`$PFM_FFPROBE` → `~/bin` → PATH, never a bare
> name); `swiftc` (gates.py compiles `facebox.swift` at runtime); `numpy` + `Pillow` (plate
> gate); the `higgsfield` CLI. Run the one-liner in `PREREQS.md` on any new machine before the
> first fire — it checks all of these the same way the scripts resolve them.

---

## Prompt anatomy — chain clips

A chain clip has a REAL start frame and NO end frame — so unlike the bounded era, the prose
**`destination` is load-bearing again**: it is the only aim the model gets. The builder writes
it per checklist #10 — placement named from the MASTER PLATE, explicit left-to-right order,
headcount negatives. What the START FRAME owns and prose must never re-describe: identity,
wardrobe, set, grade, and the opening blocking — re-describing the visible frame just hands the
model licence to repaint it. (The bounded era's delete-the-destination rule applied only when a
real end frame carried the aim; with no end frame it would leave the model aimless — the V1
blind pan all over again.)

**Every chain prompt carries** (all builder-emitted — hand-writing violates checklist #1):
1. Format — "Amateur vertical iPhone video, one continuous handheld shot, no cuts."
2. Motion — ONE move, stated first, eased at both ends, constant subtle handheld sway (the
   `approach` opener gets its own lean block — see the move-type law).
3. Destination prose per #10 — explicit placement + headcount negatives.
4. Dialogue verbatim, speakers **on camera, lips synced**; **off-camera host lock naming the
   person by Outfit ID** — "the man in the faded blue work shirt does NOT say it, does NOT mouth
   it…" Generic "no one mouths the host line" is proven insufficient.
5. **Positive bystander direction** — "relaxed and alive, easy agreeing nods, warm little
   smiles, shifting weight… NOT stiff, frozen, robotic or statue-like; they just do not SPEAK
   the line." Directing non-speakers to "hold still, mouth closed" renders corpses.
6. **Lead + tail air (0d)** — ~1s of alive silence at BOTH ends; `chain_fire.py` refuses a
   prompt missing either line.
7. Continuity bed + negative wall — sway across the join, ambience named positively, anti-haze,
   anti-cut, anti-passerby, anti-invention; duration tightened to the dialogue.

🔴 **LEAN CHAIN PROMPTS — the proven target is ~2–3k chars, and Outfit IDs are NOT needed on
chain fires (proven 2026-08-12, Block Party GA lean test, Sam-approved).** The plate (identity
ref on every fire) + the real seam pixels carry WHO everyone is; the prompt carries only what
changes. A/B receipts: c02 reveal at 2.8k vs the 19.5k full build — gates clean both rounds.
The ONE rule the test bought: **seam pixels only cover people already on screen — every speaker
the camera has yet to REVEAL needs exactly ONE compact anchor** (a single wardrobe tag, e.g.
"the woman in the plum top"; a bare positional phrase is NOT enough — v01 used "the next
neighbor" alone and the camera skipped her). What always stays regardless of leanness: verbatim
dialogue, voice gender+age pins, the real-time-speed line, lead+tail air, planted-bystanders,
and the c04-class PHONE SCALE / SCREEN locks. Full Outfit-ID blocks remain a PLATE-GEN tool
(Phase 0 #3) — they pin identity where no pixels exist yet, not on chain fires where they do.

## What V2 fixes vs. what stays stochastic

**Structurally eliminated** (the end frame makes them impossible): wandering camera · panning the
wrong direction · overshooting the speaker · hallucinated extra people · swapped environment ·
wrong speaker delivering the line · destination-not-in-seam guessing.

**Still stochastic — budget re-rolls:** mid-clip jump cuts (intermittent Seedance behavior) ·
accent slips · audio garble · off-camera lip-lock · dead tails.

🔴 When the visual is clean but the audio is off, **conform in post (`labs-voice-swap`) — do not
re-roll the visual dice.**

## Carried forward from V1 (do not re-derive)

- **Phone-screen closer:** composite the lander into a **small phone mockup** first, then pass THAT
  via `chain_fire.py --resolution 1080p --extra-image` — the model sees "a phone," not "a
  full-screen app." Kills the ~1-in-3 full-frame lander splash. Recipe in
  `references/bounded-chain-method.md` §4.
- **Never the editor's job to comp a screen in post.** Garbled screen = re-fire at 1080p.
- **Spell years and numbers phonetically** — "twenty twenty-six" + negative on the prior year.
- **Proper nouns are traps**; swap to sayable words, editor's call.
- **Dead tails cost zero gens** — trim at the join, hand the editor the timecode.

## House laws that bind here

- 🔴 **Rule 5 — show every gen the instant it lands.** 📁 + 🔗 + 📲 + widget + gate number +
  filmstrip, per clip, before QC and before any pick. Never batch-wait, never QC-gate.
- 🔴 **Refires ADD the next `vN` in place** — never overwrite, rename, `rm`, or relocate a prior take.
- 🔴 **Claude NEVER assembles or concatenates.** The editor stitches. Deliverable = approved clips.
- 🔴 **STOP ASSUMING** — result lands → show it → STOP. The next iteration is the editor's call.
- 🔴 **DONE = a named check passed** (mp4 count on disk, gate exit 0, LinkYourFile resolves).
  Otherwise the word is "not verified."
- **Lucid handoff:** every folder mention carries 📁 + 🔗; deliveries add 🦊; shown assets add 📲.
- **9:16 default** unless the request explicitly says otherwise.
- **NY cuts only** need the synthetic-performers disclaimer (`add-ai-disclaimer`) — never gate a
  non-NY creative on it.
- **Fires ≥20 items need a full preflight + explicit Fire? confirmation.**

## Files

- `scripts/chain_fire.py` — 🔴 THE fire path: plate-stamp + blur-gate preflight, the fire, cut +
  travel gates on every landing, one auto-refire, SSIM seam advisory, `vN` in place, provenance.
- `scripts/gates.py` — the deterministic hard gates (plate / cuts / travel), fail-closed;
  compiles `facebox.swift` on demand for the travel gate.
- `scripts/build_prompts.py` — 🔴 THE canonical prompt builder (spec JSON → guarded prompts +
  clip-meta fragment). Every clip prompt comes from here; hand-writing is a violation of
  checklist #1. Refuses >3-character pullbacks and isolating non-final clips at build time.
- `scripts/facebox.swift` — Vision face-box helper the travel gate compiles at runtime (`swiftc`).
- `scripts/seam.py` — 🔴 B7 fresh-versioned seam extraction: writes the next free
  `<stem>_seam_vNN.png` off an approved clip (default a late clean frame; `--candidates N` fans
  out), so a re-seam never collides and the cut-breaker sees a new seam as new.
- `scripts/propagate_spec_edit.py` — 🔴 B6 matrix-wide fix propagation: apply one clip-level spec
  edit to every version spec at once (`--specs … --clip c04 --set-json '{…}'`), with per-file `.bak`.
- `scripts/primary_subfolders.sh` — Phase-0 per-version output folders under `Primary/` (checklist #19).
- `PREREQS.md` — the new-machine prereq check + per-tool fixes; run before the first fire.
- `references/bounded-chain-method.md` — the bounded-era craft file: position planning, joblist
  schema, the **phone-mockup recipe (§4 — still canon)**, and the complete V1→V2 drift ledger.
  Its fire/gate commands are superseded by the chain path — see the banner at its top.
- **LEGACY, not in the run path:** `scripts/fire_bounded.py` is a REFUSAL STUB (running it
  prints a redirect to `chain_fire.py` and exits — the bounded fire cannot spend from this
  skill). `scripts/gate.py` — the bounded era's five-check gate — is kept runnable for manual
  forensics only (it never spends); nothing in this skill invokes either.
