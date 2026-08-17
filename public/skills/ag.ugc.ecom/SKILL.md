---
name: ag.ugc.ecom
description: >-
  PFM's Ecom/DTC UGC pipeline — turns an Ecom VTM request into delivered 9:16 UGC ad clips via
  Higgsfield Marketing Studio (marketing_studio_video): scrape the real product into the MS
  library, lock one avatar, cut the script to duration-sized lines, one style preset per line,
  fire through the gated script (720p locked, guard stack auto-appended), stream results.
  Use on: "run the ecom UGC flow", "/ag.ugc.ecom", "make the marketing studio ads",
  "UGC ads for <ecom product>", or an Ecom-vertical VTM request for talking-head/UGC product
  ads. NOT for PFM insurance creatives — those route to the Veo/Seedance UGC skills.
---

# ag.ugc.ecom — Ecom VTM request → Marketing Studio UGC clips

> Maintainer: Nicolai M — propose changes with "propose an update to ag.ugc.ecom", never by hand-editing this file (the team sync overwrites by name).

Proposed by Nicolai M (08.12.26, RemyCloud run: 19 delivered, 13 refires of 32 gens — every
refire traced to a guard block missing on the first fire). This skill ships the guard stack
in fire #1. Marketing Studio is its own surface: avatar/product/preset model, its own CLI
quirks — nothing here transfers from Veo or Seedance.

## ✅ The checklist (in order — each step gates the next)

1. **Fetch the VTM request** — concept, hooks, format spec, avatar persona, verbatim Copy block.
2. **Confirm with the editor:** which concept · which style presets · clip duration. These three
   drive everything downstream. (Presets from the read-only MCP
   `show_marketing_studio(action='presets')` — the `ms` CLI has NO presets subcommand.)
3. **Scaffold the project** — `~/.claude/skills/stage-request/scaffold_project.sh` on
   `4. PFM Project Files/Ecommerce/<Brand>/<MM.DD.YY> - <Type> - <Name>/` (FULL canonical tree).
4. **Scrape the product:** `higgsfield ms products fetch --url <sales page> --wait`, then verify
   with `ms products list --json` that status is `completed` and images landed. This step is why
   the product looks real.
5. **Pick the avatar:** `ms avatars list --json`, download `preview_url`s, contact sheet, choose
   against the brief's persona (📲 the sheet; editor picks). Custom avatars beat presets for 35+.
6. **Cut the script + write the manifest** — `Elements/Prompts/ms_manifest.yaml` from
   [templates/ms_manifest.yaml](templates/ms_manifest.yaml). Cut ONLY on natural beat
   boundaries; the script refuses under/over-band lines, so merge short beats now.
7. **Dry-run:** `fire_ms.py <manifest> --batch --dry-run` — lints every line, prints every
   assembled prompt with the guard stack, quotes cost. Fix refusals here, not mid-spend.
8. **Smoke test ONE clip:** `fire_ms.py <manifest> --line <id>` → show it (📲 + 📁/🔗) → STOP.
   Editor's go → `fire_ms.py <manifest> --smoke-ok`.
9. **Fire the batch:** `fire_ms.py <manifest> --batch` — concurrent, each result streamed the
   instant it lands (Rule 5). ≥20 items → full preflight + Fire? card in chat first, then
   `--preflight-confirmed`.
10. **Deliver** — folder-first 📁/🔗/🦊 on the run folder, per-asset 📲. **Offer** the
    editor-invoked QC passes; never run them (see law below).

## 🔴 The laws (all enforced in `scripts/fire_ms.py` — prose here is the pointer)

- **720p LOCKED on every fire (Sam, 08.12.26).** Half the credits (35 vs 70/clip at 7s), no
  visible downgrade on a phone feed. The script hardcodes it; `--allow-1080 "<editor reason>"`
  is the only exception, and a brief saying "1080×1920" is a deliverable spec, NOT a gen
  resolution — never infer.
- **`--avatar_ids`/`--product_ids` are JSON arrays** — a bare UUID silently passes
  `generate cost` and fails create. The script builds the arrays; never hand-type the flags.
- **One style preset per line, exactly.** Script refuses missing/multiple.
- **Word band scales with duration** (2.0–2.9 w/s → 14–20 words at 7s). Under-band = merge
  (short lines attract garbled ad-libs — real output: "Joni found it diggily"); over-band =
  split (a 20-word line can silently truncate at 7s).
- **Numbers written out in dialogue** ("Thirty-eight percent", never "38%") — captions carry
  the numeral. Script refuses digits/%/$ in spoken lines.
- **Guard stack rides EVERY prompt, auto-appended:** identity lock (verbatim physical block +
  no-substitution — MS swapped to a different woman for 3 consecutive clips on an identical
  base prompt), product accuracy (it invents rigid foam blocks and face zippers), packaging
  (it invents cartons and once a BRANDED box — a compliance problem; unboxing style allows
  plain unbranded packaging only), no-ad-lib, pacing.
- **Refires = next vN IN PLACE** (locked 2026-07-17). ⚠ This CORRECTS the proposal's
  `_superseded/` relocation — that move put a defective take in the delivery folder on the
  RemyCloud run. Both takes stay in the working folder; the editor sees both.
- **Smoke gate:** batch refuses without the `.smoke_ok` stamp — one clip proven + editor's go.
- **🔴 NO AUTOMATIC QC (Sam, locked 08-04; QC rewritten editor-invoked on this skill's
  approval, 08-13).** The script downloads and reports; Claude never looks. On delivery,
  OFFER: `audio-qc` (Whisper transcript + levels — audio varied −14.9 to −34.9 dB mean across
  one project; normalize on import) and `visual-qc` (filmstrip). Both editor-invoked only.
  If the editor runs the transcript pass: **read every CTA transcript by eye** — "Tap below" →
  "Tap a low" scored 0.970 against a 0.90 gate; similarity thresholds are the wrong test for
  short CTAs. And never call a batch clean off one dimension.

## Engine notes (what MS does to your prompt)

- MS rewrites the prompt into a long `enhanced_prompt` but **does honor verbatim dialogue** —
  split across its internal shot list, spoken word-for-word.
- **Room/background is NOT consistent between clips** — each is a plausible room but they
  differ. Flag it to the editor if the cut is back-to-back without b-roll bridges.
- `show_marketing_studio_generations` overflows the token limit — use
  `show_generation_by_ids` with explicit job IDs.
- Whisper `speech_end` overshoots file length — confirm suspected truncation with a windowed
  check on the last second before spending a refire.
- Cost is linear: 5 cr/s at 720p, 10 cr/s at 1080p ($0.07/credit).

## Outputs

- Clips: `Elements/Footage/Veo/<Concept> <Hook>/<Concept>_<Hook>_<NN>_<style>_v<NN>.mp4`
  (+ `.json` provenance sidecar per take, written by the script)
- Manifest: `Elements/Prompts/ms_manifest.yaml` (+ `.smoke_ok` stamp beside it)
- Worked example: RemyCloud — request
  [RemyCloud - Meta Video Ads](https://app.notion.com/p/3b916771e780811b88aace88caef4427),
  product `ea9e22c0-5ee6-4ed1-a265-b1f7530993f9`, avatar Margaret
  `239035c9-3ef7-441e-adb0-ef547ebc543b`, styles selfie_testimonial/unboxing/ugc.

## Not for

PFM insurance/lead-gen creatives (Veo + Seedance skills own those) · group interviews
(`sd2.5-interview-flow`) · narrative skits (`ag.skit.*`, `ag.scene.flow*`) · DTC static ads
(`ms dtc-ads` — adjacent surface, unexplored, NOT in this skill).
