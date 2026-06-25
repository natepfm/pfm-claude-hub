# Changelog

Recent changes to PFM Claude skills, scripts, and tooling. Newest first.

When something here changes that affects what editors run on their machines, run the **Update my skills** command from the [Home page](/) to sync.

---

## 2026-06-25

### Skill fix — Veo scripts never break mid-sentence (`veo-script-writing` + `lc-to-video-podcast`)

Run **Update my skills** to get it.

When a script gets chopped by word-count instead of by sentence, every clip starts mid-thought — and since each clip is its own Veo gen with its own TTS, the audio lands on a cold pickup and a false stop. It sounds robotic. Both Veo writing skills now carry a hard, top-line rule: **clip boundaries follow sentences, never the word count.** Every clip starts and ends on a complete sentence (a long one may only split before an *and / but / so / or* where the rest still stands on its own). When sentence integrity and the 17–22-word target collide, integrity wins — a clean short or slightly-long clip beats one that breaks a sentence. It ships with the real before/after that caught it, so the word-count target can't steamroll it again.

**Nothing to say** — it applies automatically whenever Claude writes or rebalances a Veo script.

## 2026-06-13

### New skill — `labs-voice-swap` (fix Max the Dog's voice through ElevenLabs)

Run **Update my skills** to get it.

Kling nails Max the Dog's Pixar animation and demeanor but his **voice** never comes out right. The house fix has always been to re-voice his clips through ElevenLabs — now it's one step. `labs-voice-swap` takes Max's finished clips and re-voices every talking line through our locked **"Max the DOG"** voice using speech-to-speech, which keeps the original timing and cadence so his mouth still matches (lip-sync holds — no drift).

Point it at your clip folder after the Max clips download. It re-voices only Max's talking clips, drops the new versions in a `VoiceSwapped/` subfolder (your Veo originals stay untouched), and flags any clip whose timing slipped so you can re-run just that one. Use the `VoiceSwapped/` versions in your edit. Works for any character with an ElevenLabs voice, but Max is the locked case — **every** Max creative gets the swap.

**Say:** "swap Max's voice", "run the Max clips through ElevenLabs", "re-voice these", "fix the voice on these clips".

## 2026-06-11

### New skill — `veo-life` (bring stills to life)

Run **Update my skills** to get it.

`veo-life` turns your finished social-proof / b-roll **stills** into 6-second **cinemagraphs** — the person breathes and blinks, one background element drifts gently, and everything else (camera, expression, phone, on-screen text) stays planted. The result reads as a live photo, not a video performance, so it stops the scroll without breaking the candid look that makes social proof work.

Point it at a folder, name the files, or blue-tag the keepers in Finder. It builds the per-still cinemagraph prompts, runs a gated preflight, fires the batch (Veo 3.1 Lite, audio-free), runs a 100% filmstrip QC pass, and delivers with a manifest. Already proven across SMA, SaveMaxHomes (EN + ES), and Auto Calls — 55 clips.

**Say:** "bring these to life", "veo life", "cinemagraph these stills", "make the social proof move".

### New skill — `podcast-guest-veo` (locked podcast-guest audio spec)

Run **Update my skills** to get it.

The locked voice + audio treatment for **podcast-guest talking heads** (Discount Pod Guy, Gavin Hollis, Jason Whitaker class) — the v2 spec validated on the Car Chase Podcast Roku Calls A/B. It kills the musical-tail and ambient-vacuum artifacts Veo adds to podcast clips, locks the dry / close / clean studio voice with a named dead-quiet room (no vacuum), and handles cold-open + clean-finish timing. Use it whenever you're writing or revising a podcast Veo master, or the audio sounds off on podcast clips.

**Say:** "podcast master", "fix the podcast audio", "the audio sounds off on these podcast clips".

### New — the CTV Breaking-News stack (6 skills)

Run **Update my skills** to get them all.

A per-state CTV breaking-news Calls variation used to be a scavenger hunt across clips, lower thirds, call graphics, and the anchor wall. Now it's one request in → everything out:

- **`ctv-bn-variation`** — the orchestrator. Drop a CTV BN state-variation request URL and say "make the `<state>` version" — it produces the state Veo clips plus the full graphics suite below, in dependency order. Handles the fork where the state's tracking numbers are still TBD.
- **`bn-lower-thirds`** — LATU lower thirds from the shared Canva decks: per-state HEADLINE strip + CALL NOW phone strip, text-fit verified so nothing bleeds into the NEW AT 11 block, exported transparent straight into the state's Graphics folder.
- **`call-graphics`** — SaveMaxAuto Banner + EndCard with the real tracking number, fired from the 5-design template library. Every output is digit-verified so the phone number is never garbled.
- **`anchor-wall-composite`** — takes the finished EndCard and renders it onto the video wall behind Steve, producing the locked reference frame his close-line cinemagraphs fire from.
- **`ugc-talking-head-ref`** + **`ugc-talking-head-veo`** — new UGC presenter in two steps: `ref` generates the locked 9:16 "talking to a phone on a stand" character stills; once you pick your hero image, `veo` writes the locked master prompt + per-clip dialogue manifest, fire-ready.

Every piece works standalone too — need just a lower third or just a banner number swap, ask for exactly that.

### New — `/stage request` staging for Asset Gen Flow (AGF)

Run **Update my skills** to get it (Cowork users: re-install the plugin, now **v1.3.2**).

`/stage request` takes a written Video Task Manager request and makes it fire-ready for AGF — it resolves the source creative's master prompt + reference images, sets up the project folder on Lucid, writes a verbatim per-line dialogue manifest + the 🤖 **Asset Generation** section, then routes the request: **send to AGF** (the office mini fires it hands-off) or **generate locally now**.

Eligibility is **resolvability, not creative shape** — it stages any creative whose AI-generatable assets resolve: per-state batches, VSL→Calls conversions, single-state re-edit regens, vertical pivots. For a mixed edit+gen request it stages only the generatable subset and leaves the rest to the editor. Anything it can't resolve stays **Needs Staging** with the gaps named — it never guesses.

---

## 2026-06-04

### New slash command — `/report` (assets + creative)

Run **Update my skills** to get it. Two paths picked by the argument:

- **`/report assets`** — raw asset handoff. Posts `✅ Assets Generated [folder ↗](link)` to the Notion request. Status stays "Requested," no @-tags. Use after a Veo / b-roll / slide batch lands in the folder.
- **`/report creative`** — finished-creative turn-in. Posts `<@Dima V> <@Gabriel Moss> ✅ Completed Creatives (#): [folder ↗](link)`, flips Status → Done, with the creative count. Use when you've finished editing and are shipping.

Both paths route through the `notion-asset-delivery` skill — same LinkYourFile build, same rich-text @-mention format, same hard-confirm gate before anything posts. Auto-finds the Notion URL + delivered folder from session context (never re-asks).

### New slash command — `/check-notion`

Run **Update my skills** to get it. Mid-session, type `/check-notion` and Claude refetches the Notion request you're working on and reports any updates since you last looked — new comments, status changes, body edits (revised dialogue, new state toggles), assignee/tag changes. Read-only: it never posts back to Notion. Useful between gen batches when you want to know if requirements shifted (a Dima comment on L17 dialogue, a status flip by someone else, etc.) without losing your place in the session.

It auto-finds the Notion URL from session context (your earlier messages, prior fetch calls, or a `_HANDOFF.md` in the project folder) — never re-asks if it's already in context.

### New — ElevenLabs MCP for Claude Code

Claude Code can now drive ElevenLabs directly — list voices, fire TTS, design voices, the whole API — in any session on your Mac. ~5 minute one-time setup. Once wired, ask things like *"what voices are available?"* or *"generate TTS for 'hello' using Adam"* and Claude handles the API + saves the mp3s. Persists across every project — set up once, use everywhere.

This is the foundation for a future batch TTS skill (`elevenlabs-tts`) that'll add per-line manifests + delivery folders + cost reports the way `hig-flow` / `hvg-flow` do. Coming when use cases firm up.

**To set it up:** see the [Set Up ElevenLabs MCP SOP](/resources#sops) on Resources. Mac-only for now; Windows comes later if there's demand.

### Two new skills — `pfm-character-master` + `pixar-state-music-video`

Run **Update my skills** to get them.

- **`pfm-character-master`** — generate a PFM character master sheet for *any* new character (human, animal, mascot, kid, antagonist, supporting talent) in PFM's locked format: 5 angles (front / side / 3-quarter / back / sitting) on a neutral light-grey backdrop, with a **5'10" human silhouette anchor next to the character at correct proportional scale**. The scale anchor is the load-bearing part — without it, NB Pro improvises and dogs come out at human-scale, kids at adult-height. Downstream b-roll prompts that use this master as a reference inherit the scale lock automatically.
- **`pixar-state-music-video`** — per-state Pixar Best State Music Video asset generator (Auto + Home). Auto-fires a 3D Pixar anthropomorphic state-outline mascot + 12 locked-structure scene frames via NB Pro using state-derived tokens (signature terrain, body color, cap, vehicle), and preps the state-filled lyrics + a ready-to-paste Suno style block. Semi-auto: skill handles Higgsfield + Suno prompt; human runs Suno take-gen + pick; Mark assembles the edit. Validated blind on Oregon.

## 2026-06-02

### Two new skills — `reskin-trending-video` + `ugc-cinematic-prompt` (video gen)

Run **Update my skills** to get them. Both came in through the **Skill Proposals** inbox — captured by **Drake**.

- **`reskin-trending-video`** — drop a trending clip (TikTok / Reels / a competitor ad) and turn it into a brand-safe gen prompt that keeps the trend's structure + pacing but swaps the subject for *your* character. It inspects the reference first (an ffmpeg contact sheet so Claude actually looks at the clip), flags the pitfalls that get a reskin killed — watermarks, license plates / real PII, vapes / alcohol, recognizable IP — then picks the engine for you: **Seedance** when the action is describable or the body type changes, **Kling Motion Control** only for literal frame-exact motion transfer on a matching skeleton. Writes the prompt with a REFERENCES block + exclusions spread across the blocks (so the model copies the *timing*, not the watermark), and hands you a post-pro plan for the parts a generator can't render (phone screens, multi-cut sequences, trending audio).
- **`ugc-cinematic-prompt`** — the Seedance 2.0 prompt-body format the reskin flow leans on, also usable standalone for any video prompt. A strict 11-block structure (STYLE, ENVIRONMENT, CHARACTER, PRODUCT, CONTEXT, ENERGY, CAMERA, LIGHTING, PHYSICS, AUDIO, TIME STAMPS), beats scaled to your chosen length (15s hard cap), no forced house style — whatever you ask for is the north star.

Both deliver the **prompt** as the output, with an optional Higgsfield **CLI** fire path (`seedance_2_0` / `kling3_0`) so you can run it without leaving Claude. Code-only (they need ffmpeg + the Higgsfield CLI).

## 2026-06-01

### New skill — `propose-skill` (contribute your workflows)

Run **Update my skills** to get it. Found a repeatable process you keep doing in your projects? Say **"this should be a skill"** and Claude turns it into a Skill Proposal — it reconstructs the workflow from your session, asks a couple quick questions, and drops it in the shared **Skill Proposals** inbox on Lucid Link for Sam to review and build into a real skill for everyone. **You never write any code** — Claude captures the whole thing. If it ships, you'll pull it like any other skill, credited to you. This is how the system keeps getting better from what *you* discover.

## 2026-05-31

### New skill — `notion-asset-delivery`

Run **Update my skills** to get it. Posts the delivery comment to a Notion request when your creatives are done — `✅ Completed Creatives (#): <link>` plus any manual-fire notes. It auto-builds the LinkYourFile folder link (no more hand-making it) and drafts the comment in house format, then shows it to you and waits — it **never posts without your `post` confirmation**. Auto-offered by `hvg-flow` at the end of a batch; you can also run it standalone anytime ("post the delivery comment for this request").

## 2026-05-30

### Nano Banana + VSL fires now default to count=1

`count=1` (one image per prompt) is now the default for **all** image gens — `hig-flow` b-roll and one-off `higgsfield-image-generation` at 1k, plus `vsl-state-variations` slides at 2k. (Veo video was already count=1.) Opt into `count=2` when you want a pick. Roughly halves image-batch credit cost; pairs with QC-before-refire.

### Two new skills — `suno-songwriter` + `vsl-state-variations`

Run **Update my skills** to get them.
- **`suno-songwriter`** — turn an ad script into a Suno v5 song (lyrics + style block).
- **`vsl-state-variations`** — generate per-state VSL variants (edit-swap slides + Veo Lite clips).

## 2026-05-29

### The hub is now a 4-page Editors Hub

The single Claude page became four: **Onboarding** (first-day setup, built from the Editor Onboarding SOP), **Claude** (the pipeline — how to use it, setup, skills, troubleshooting), **Creatives** (the new Creative Library), and **Resources**.

### Creative Library (Creatives tab)

Every creative type we make (Story Ad, Breaking News, Podcast, UGC, VSL, Song Ad, 3D Pixar), the variations we test, the verticals, and the building blocks — each mapped to the skill that builds it.

### Resources — Landers, Shared assets, SOPs & guides

Landing pages by vertical, the shared PFM Media Assets folders (one click straight to LinkYourFile), and the SOP + Loom how-to library.

## 2026-05-27

### `hvg-flow` streamlined — silent setup, 2 confirmation stops (was 9 gates)

Gate-by-gate confirmation was slower than just running the batch, especially for experienced editors who hit "yes, next" eight times before anything fired. The 6 friction gates now run **silently**; the flow stops for you at only the points where a wrong call costs real credits.

**Runs silently now** (no stop, just does it):
- cwd / CLI / auth check (hard-stops loud only if something's actually broken)
- Notion fetch + parse (request shape, state variations)
- model lock → defaults to Veo Lite count=1
- master prompt draft
- L1 test (skipped unless you ask)
- Excel manifest write

**Still stops for you** (the credit-burning decisions):
- **Reference assignment** — but only when it's ambiguous. Unambiguous refs (one shared image, or every line has its own slide) roll straight into the preflight with no separate stop.
- **Consolidated preflight** — one block showing everything about to happen (brief, refs, model + count, clip count, cost, output, a representative prompt) → single "Fire?"

**Net:** a clean project reaches a *single* confirmation (the preflight). A project that needs a reference decision gets two. Never more than two. Hard-stops (bad folder, missing CLI, low credits, missing refs) still interrupt regardless.

Nothing about safety changed — the preflight still shows full cost + a representative prompt before any spend, and for state-variation runs the state list shows there too. What's gone is the eight intermediate "confirm? confirm? confirm?" round-trips. Speed target: trigger → preflight in under 90 seconds on a clean project.

`hig-flow` (the image pipeline) got the same treatment the same day — its shot list folds into the consolidated preflight, so the preflight doubles as shot-list sign-off (cut / add / tweak shots there before firing). Re-run `bash claude-pfm-update.sh` to pick up both.

### Complete system audit — final summary

End-to-end pass over hub + skills + memory + Lucid Link mirror + source-of-truth drift. Twelve items closed (in execution order):

1. **Local `hvg-flow` synced** — 45 lines of local-only "Batch/State subfolder" docs that were about to be reverted by the next `update.sh` are now mirrored to Lucid Link + hub.
2. **`story-beats` restored** — was missing from Lucid Link + local install but still in the hub catalog + Cowork plugin; restored from hub copy.
3. **Team `CLAUDE.md` rewritten** — old "for Sam personally, not the editing team" scope section replaced with current-reality team-deployed listing (12 skills, hub + Lucid Link as source of truth).
4. **Superseded memory file deleted** — `feedback_veo_no_camera_move.md` (claim invalidated by 2026-05-26 `feedback_veo_start_end_keyframes_cinemagraph.md`).
5. **MEMORY.md index fixed** — 2 substantive unindexed feedback files added (`feedback_higgsfield_cli_concurrency_race`, `feedback_veo_lite_audio_flag_always`).
6. **Hub skill count drift fixed** — `Overview.tsx` now reads `{skills.length}` from `skills.ts` instead of hardcoded "10" in two places.
7. **`higgsfield-veo-batch` retired** — full removal, all cross-refs cleaned up in audio-qc / visual-qc / hvg-flow / higgsfield-image-generation / hub / CLAUDE.md / MEMORY.md. Folder archived to `_archive/skills/` on Lucid Link.
8. **MCP-vs-CLI canonicalized** — memory (`feedback_higgsfield_workflow.md`) is the source of truth; hub panel + skill body openings now use "FORBIDDEN" wording consistently and point to memory; stale higgsfield-veo-batch refs in canonical memory cleaned up.
9. **Changelog top 5 + collapsed archive** — `ChangelogSection.tsx` now parses `## YYYY-MM-DD` date headers, renders the most recent 5 inline, wraps older entries in a `<details>` collapsible.
10. **`hig-flow` vs `higgsfield-image-generation` sharpened** — both descriptions now explicitly call out the trigger boundary: hig-flow REQUIRES a Notion request URL; higgsfield-image-generation is for one-off work with no Notion required.
11. **`iphone-cameraroll-prompting` folded into `nano-banana-prompting`** — see dedicated entry below.
12. **`hvg-flow` reference content extracted** — Gate 4 per-mode follow-ups + Gate 5 full model lineup / cost ladder / CLI args / Kling specifics / aspect ratio defaults moved to load-on-demand sub-docs `hvg-flow/refs/reference-modes.md` and `hvg-flow/refs/model-lineup.md`. Main SKILL.md dropped from 909 → 867 lines with brief inline summaries + pointers to refs/.

Plus polish: 2 memory feedback files had dash-case `name:` values from old slug-copy patterns; normalized to Title Case sentences to match the other 48 files.

Skill count is now 10 (was 12 before audit — `higgsfield-veo-batch` retired + `iphone-cameraroll-prompting` folded). All mirrors verified consistent: Lucid Link = hub public = skills.ts = 10.

Re-run `bash claude-pfm-update.sh` to pick everything up.

### `iphone-cameraroll-prompting` folded into `nano-banana-prompting`

The two image-prompting skills had overlapping triggers and both targeted Nano Banana — `iphone-cameraroll-prompting` even said in its own description "apply BEFORE writing any Nano Banana prompt for character b-roll", which already read as a sub-rule of nano-banana-prompting rather than a sibling. Folded the camera-roll content in as a new section ("iPhone camera-roll style — minimal prompts for character b-roll") inside `nano-banana-prompting/SKILL.md`.

The section preserves all the camera-roll discipline — anchor phrases, anti-glossy words list, phone-screen problem, brand-name negative block, reference image discipline, aging-photos trick, selfies vs third-person framing, concrete good/bad examples — and adds a clear "when to use camera-roll style vs the structured templates above" boundary so editors know which mode applies. The `nano-banana-prompting` skill now covers three distinct prompt-craft modes:

1. **Structured layered prompts** (Rules 1-7 + kill-switch closer) for social-proof batches and character-consistent scenes
2. **Broadcast news / interview / anchor / field reporter** aesthetic (broadcast ENG camera, lavalier mics, off-camera eye line, anti-stock discipline)
3. **iPhone camera-roll style** (minimal beats verbose, anchor phrases, anti-glossy discipline) for podcast story-ad b-roll where authenticity beats polish

**Cross-references updated:** every other skill that referenced `iphone-cameraroll-prompting` now points to `nano-banana-prompting` instead (`hig-flow`, `higgsfield-image-generation`, `hvg-flow`, `lc-to-video-podcast`). Same applies to the hub's `Overview.tsx` skills callout + folder tree, `README.md` sync script, team `CLAUDE.md` skills list, and the hub's `skills.ts` catalog (10 entries now, down from 11).

**For Cowork users:** the `pfm-writing-skills.plugin` source has `iphone-cameraroll-prompting/` removed; Sam will rebuild + re-upload the .plugin so Cowork installs pick up the consolidated `nano-banana-prompting` skill on next install.

The skill folder is archived to `_archive/skills/iphone-cameraroll-prompting/` on Lucid Link — recoverable if the split is ever wanted again.

### System audit pass — `higgsfield-veo-batch` retired, hub clutter cleaned up

End-to-end audit of the hub + skills + memory + Lucid Link mirror, fixing inconsistencies and removing legacy weight.

**Retired: `higgsfield-veo-batch` skill.** The legacy HVG.1 webapp manifest path is no longer used — `hvg-flow` (the in-Claude 9-gate flow) supersedes it cleanly. Removed from `skills.ts`, hub `public/skills/`, editor mirrors, and cross-references in `audio-qc` / `visual-qc` / `hvg-flow` / `higgsfield-image-generation` descriptions. The skill folder is archived to `_archive/skills/higgsfield-veo-batch/` on Lucid Link — recoverable if the HVG.1 workflow ever needs to come back, but no longer loaded into editor sessions. Editors with old `~/.claude/skills/higgsfield-veo-batch/` directories can `rm -rf` them or just leave them — they'll stop auto-loading once they're not in Lucid Link's mirror.

**Other audit fixes shipped same day:**
- `story-beats` skill was missing from Lucid Link and Sam's local install but still in the hub catalog + the Cowork `pfm-writing-skills.plugin` — editors hitting the hub download got an orphan. Restored to both Claude Code installs from the hub copy.
- `hvg-flow` SKILL.md had 45 lines of locally-edited "Batch/State subfolder" docs that hadn't been mirrored back — about to be silently overwritten on next `claude-pfm-update.sh`. Synced.
- Team `CLAUDE.md` (auto-loaded at every editor session start) was stuck on "v1 = Sam personally, not the editing team" framing from before the team rollout. Rewritten to current reality (12 deployed skills, hub + Lucid Link as source of truth).
- `MEMORY.md` index: deleted the explicitly-superseded `feedback_veo_no_camera_move.md` file, added bullets for 2 substantive feedback files that were unindexed (`feedback_higgsfield_cli_concurrency_race`, `feedback_veo_lite_audio_flag_always`).
- Hub `Overview.tsx` skill count was hardcoded "10" in two places while `skills.ts` had 12 — now dynamic via `{skills.length}`. Drift can't recur.

Re-run `bash claude-pfm-update.sh` to pick everything up.

## 2026-05-26

### `audio-qc` Phase 3 — unexpected music / non-speech audio detection

Audio QC now catches non-speech audio energy (musical stings, musical tails, musical beds) that Veo sometimes adds despite the prompt-level negatives in `feedback_veo_audio_artifacts.md`. Previously these slipped through — `dialogue_mismatch` only fired if the music corrupted the dialogue enough to drop similarity. Clean dialogue + music bleed went undetected.

**How it works (zero-cost piggyback):**
- Phase 1 already parses silence intervals via ffmpeg's `silencedetect` filter
- Phase 2 already gets per-segment speech timestamps from Whisper's transcribe output
- Phase 3 just does interval math — invert silence → non-silent regions, subtract speech segments → non-speech audio regions
- Filter regions < 0.30s (drops breath / word-gap noise)
- Flag `unexpected_music` if any single region > 0.40s OR cumulative > 0.60s

No additional ffmpeg passes. No new model downloads. Runtime cost is essentially zero — adds to the same Phase 2 loop.

**What it catches:**
- Cold-open musical stings (~0.5-1.5s at clip start before dialogue)
- Musical tails after dialogue ends
- Musical beds with detectable speech gaps
- Any non-speech audio in a dialogue-expected clip

**Escalation rule:** only escalates `OK` → `unexpected_music`. Doesn't override `dialogue_mismatch` / `clipped` / `low_volume` as primary flag — those stay primary and music regions still show up in a dedicated report section via the `has_unexpected_music` field.

**Caveat:** if Whisper missed any spoken words (silent voice, muffled audio, unusual accent), they'd appear as false-positive music. The 0.30s minimum-region filter handles short bursts; longer false positives need a spot-check. Bias is to over-flag.

**Report changes:** new "Unexpected music / non-speech audio" section in `audio_qc_report_<date>.md` listing affected clips + per-clip music region timestamps. Recovery patterns added to the audio-qc skill body for cold-open sting / musical tail / musical bed.

Auto-runs whenever Phase 2 runs (i.e. whenever `--manifest` is passed). Re-run `bash claude-pfm-update.sh` to pick it up.

### `visual-qc` skill — per-clip filmstrip pass for VSL slide defects

New sibling skill to `audio-qc`. Catches what you can SEE that audio can't — background morphs, slide text garble, hallucinated overlays (the canonical L19 "Jake" label defect), hard cuts. Built primarily for VSL-style projects with per-line slide references where the LED screen and on-screen text MUST stay frozen across the 8s clip.

**What the scanner does:**
- Extracts 5 stills per clip at fixed timestamps (0s / 2s / 4s / 6s / 7.8s)
- Scales each to ~480px wide and hstacks into a single filmstrip PNG per clip — `<veo_root>/qc/strip_<slug>.png` (per-state subfolders for state-routed batches)
- For caption-slide clips (rate text / name labels / ZIP codes / dollar amounts), additionally pulls 4s / 6s / 7.8s at FULL native resolution to `<veo_root>/qc/caption/<slug>_<t>s.png` — the 480px filmstrip is too small to spot subtle text defects
- Writes a JSON index of all artifacts

**What Claude does:**
- Walks the index, Reads each filmstrip
- Applies pass/fail criteria per clip: ✓ (clean) / ✗ (defect with reason + timestamp) / 🔍 VERIFY (ambiguous — editor's eyes make the call)
- Reads full-res end frames for caption-slide clips
- Writes a markdown report alongside the audio QC report

**The "don't rationalize" rule:** if something ambiguous shows up — faint floating text, edge artifact, partial occlusion — flag it as 🔍 VERIFY, don't talk yourself into "probably a reflection." The L19 "Jake" hallucinated label defect was missed once for exactly that reason. The bias is to over-flag, not under-flag.

**Regen workflow:** pre-delivery defects regen on Veo 3.1 Lite + audio on at count=1, **overwriting the bad take** (explicit exception to `feedback_regen_no_overwrite.md` — the bad clip never entered any timeline). 2-retry cap; after that, surface to editor for Fast escalation decision.

**Integration:** `hvg-flow` Step 11 and `higgsfield-veo-batch` Step 6 now offer visual QC as a second pass after audio QC (sequential offers). Editor can skip it (default for podcast-style work where there's nothing to morph) or opt in with `yes` / `yes L02,L17,L19` (with caption-slide L-numbers).

**Editor command:**
```
python3 ~/.claude/skills/visual-qc/visual_qc_scan.py "<project>/Elements/Footage/Veo" \
  --caption-clips L02,L17,L19,L20,L27,L28 \
  --workers 8
```

Skill files: `~/.claude/skills/visual-qc/SKILL.md` + `visual_qc_scan.py`. Memory entry: `feedback_visual_qc_workflow.md`. Re-run `bash claude-pfm-update.sh` to pick it up. **Sam, also add `Bash(python3 *visual-qc/visual_qc_scan.py *)` to the Lucid Link `settings.json` allowlist next to the audio-qc entry** so first-run permission prompt is skipped.

### Default fire shape — count=1 per prompt (was count=2)

**`count=1` is the new locked default** for all PFM Higgsfield video fires (`hvg-flow`, `higgsfield-veo-batch`, ad-hoc CLI). Previously count=2 was the default to give A/B picks per line — refire-on-QC-fail is the new safety net instead (paired with the partial-return discipline + audio QC Phase 2 dialogue verification, both below).

**The math:**
- Old default (Lite audio × count=2): 24 cr/line
- New default (Lite audio × count=1): 12 cr/line
- ~50% cost cut on dialogue batches
- ~50% cost cut on silent b-roll (16 cr/line → 8 cr/line)

**Editor opt-in to count=2** when audio variance matters or a line is high-stakes — surface at Gate 5 of `hvg-flow`. Per-line ("L01 and L17 at count=2, rest count=1") or per-batch ("fire everything at count=2") both work.

**Why this works:**
- count=1 + audio QC + refire-on-flag covers most lines first try
- The ~10-20% that fail QC get refired as v02 — same effective cost as the old count=2 default
- Editor saves credits AND manifest stays cleaner
- `Partial` status is now rare — only meaningful on opt-in count≥2 lines

Files updated: `hvg-flow` SKILL.md (Gate 5 default block + cost ladder + Gate 7 L1 test + Step 8 config example + Step 11 status legend + Step 11 final-report buckets), `higgsfield-veo-batch` SKILL.md (preflight + speed budget + Step 6 sections), `build_xlsx.py` (config-schema default `countPerPrompt: 1`). Re-run `bash claude-pfm-update.sh` to pick it up.

### Partial-return discipline — QC the survivor before any refire

When a Veo batch comes back with a `Partial` row (one variation made it, one didn't — usually NSFW filter), the surviving variation is often perfectly usable on its own. `hvg-flow` Step 11 and `higgsfield-veo-batch` Step 6 now make this explicit:

- **Partial + survivor passes audio QC** → final report recommends "accept as-is", no refire prompt
- **Partial + survivor flagged by QC** → final report recommends "refire", surfaces the flag
- **Total fail (0 of 2)** → automatic refire candidate (nothing to QC)

Reflexive refires on Partial rows burn ~12-27 cr per row AND clutter the manifest with a v3 entry for a row whose v01 was already fine. The QC offer landing before the final report already creates the right *ordering*, but the rule wasn't *stated* — an editor scanning the manifest could refire on instinct without checking the survivor.

If QC is declined, partials get bucketed as "needs editor review" — the rule can't be applied without QC signal. Memory entry: `feedback_partial_returns_qc_before_refire.md`. Re-run `claude-pfm-update.sh` to pick it up.

### `audio-qc` Phase 2 — Whisper dialogue verification folded back in
After an M-series speed test showed Whisper transcribes 8s clips in ~0.3s (vs the 10-15s/clip the original handoff doc estimated), we folded the Whisper pass back into the audio-qc scanner as a default phase whenever a project's Excel manifest is available.

**What the scanner now does:**
- *Phase 1 — ffmpeg audio-physics* (parallel, ~90s per ~350 clips): silent / low_volume / clipped / no_audio flags (unchanged)
- *Phase 2 — Whisper dialogue verification* (sequential, ~2 min per ~350 clips on M-series): transcribes each clip, fuzzy-matches transcript against the manifest's `dialogue` column, flags `dialogue_mismatch` on similarity below threshold (default 0.70)

Phase 2 catches the **real "audio cut mid-word" cases** that the disabled cut_off heuristic was supposed to but couldn't — if a clip is actually missing trailing words, the transcript won't include them and similarity drops below threshold. Spot-test on 55 L14 clips: 0 dialogue mismatches, 100% match on 49 / >95% on 4 / 77-90% on 4 (the dip is Whisper mistranscribing dollar amounts like "fifteen hundred" as "1500" — not missing words).

**Phase 2 is opt-in via `--manifest`** — `hvg-flow` Step 11 and `higgsfield-veo-batch` Step 6 pass the project's Excel manifest automatically when offering the QC pass. Without a manifest, Phase 1 still runs. Total runtime for a typical 350-clip batch with both phases: ~3-4 min.

### Whisper added to the Mac installer
`claude-pfm-setup.sh` step 6 installs OpenAI Whisper via pip3 (user install + symlink to `~/bin/whisper`). PyTorch deps make this a ~3-5 min step on a fresh Mac; install is wrapped in try/continue so failures don't abort the rest of the installer (Phase 1 of audio-qc still works without Whisper).

Re-run `claude-pfm-setup.sh` on already-set-up machines to pick up Whisper. Idempotent — skips what's already installed.

### Canva connector — lower thirds graphics on demand
The **Canva** connector is now part of the standard editor onboarding (Setup step 3). PFM uses a **single shared Canva account** — Sam will share the credentials separately, not via the hub.

**What it unlocks:** when you're in a breaking-news project and the script has chyron specs (`BREAKING NEWS`, `JESSICA MARSH / MOTHER OF THREE`, `LIVE — WEST ELMWOOD`, etc.), you can now ask Claude to "build the lower thirds" and it'll generate the actual graphics directly in the shared Canva account using the PFM LATU News brand kit — then drop PNGs into `Elements/Footage/Primary/Lower Thirds/`. No more manually rebuilding chyrons in Canva from a script-side spec.

`breaking-news-story-ads` skill body updated with the full workflow + the LATU News brand style spec.

### `audio-qc` cut_off heuristic disabled — false-positive on PFM news-read content
After spot-checking ~150 cut_off-flagged clips from the Car Repo Breaking News scan, every one ended cleanly — the heuristic was a false-alarm machine. Rachel's continuous narration + breath + ambient fills the full 8s window above -35 dB without leaving any tail silence, but the dialogue is intact. The silencedetect-based check couldn't tell "audio actually cut mid-word" apart from "audio cleanly fills the 8s window with no quiet tail."

**Scanner patched** (`audio_qc_scan.py`) — cut_off branch in the flag-decision logic is commented out with full rationale. The scanner still computes tail-silence-seconds and includes it in the report for visibility, but the flag is never set. Skill body updated to reflect the new flag set: `silent / low_volume / clipped / no_audio / error`.

**New empirical baseline (Car Repo scan, 325 clips):** 276 OK (85%), 49 clipped (15%). Clipped concentrates on Steve cinemagraph intros + closes ("Tonight!" + "Wow, just incredible!") peaking at 0 dBFS — a content fingerprint, not random distortion. Recovery for that pattern is **normalize-on-import in DaVinci** rather than re-firing, since the prompt is already as soft-delivery as it can be. Re-enable cut_off detection only when there's a better signal (e.g., amplitude envelope analysis on the last ~100ms vs the rest of the clip).

### `max_workers` bumped 8 → 16 across all skills — 2× throughput on Enterprise
After the Higgsfield Enterprise migration on 2026-05-25, two empirical Enterprise tests landed:
- **2026-05-25, 100-worker test:** 50/100 jobs returned empty — race carries over from Team plan at high concurrency.
- **2026-05-26, 16-worker test (Car Repo B5 wave 1, 50 jobs):** race clean. The only misses were NSFW filter rejections (3 zero-take cells), not auth errors.

The credential-store race cliff sits somewhere between 16 and 100 workers — 16 is safe, 100 fails half the jobs. `max_workers` is now locked at **16** across `hvg-flow`, `hig-flow`, `higgsfield-veo-batch`, and `higgsfield-image-generation`. 

**What editors see:** Veo + NB Pro batches run ~2× faster than the prior 8-worker cap, with no measurable reliability cost. A 50-job wave that took ~12-15 min now lands in ~5-8 min. Re-run `claude-pfm-update.sh` to pick up the new skills.

---

## 2026-05-25

### New `audio-qc` skill — Veo audio fast-pass
After every Veo batch downloads, you can now run an automatic audio quality check on the clips before importing to DaVinci. ffmpeg-based parallel scanner, ~90s for ~350 clips. Flags `silent` / `low_volume` / `cut_off` / `clipped` / `no_audio` and writes a markdown report straight into the Veo folder.

Validated on Car Chase Breaking News B1-B5 — caught L12 (95% cut_off) and L03 (79% cut_off) as systemic script-line-too-long issues, not random takes. The flag table makes the "fix at the script level vs. re-fire individually" call obvious at a glance.

**Auto-offered, not auto-fired.** `hvg-flow` Step 11 and `higgsfield-veo-batch` Step 6 now ask plainly in chat after downloads complete:

> All N clips downloaded and the manifest is updated. Want me to run an audio QC pass? Flags silent / low_volume / cut_off / clipped / no_audio in ~90s.
>
> Reply `yes` to run it or `no` (or `skip`) to go straight to the final report.

The flow is gated like everything else — explicit opt-in. Initial design included an optional Whisper transcription pass for dialogue-content verification; we decided that level of QC was overkill for PFM's real failure modes (most issues show up clearly in ffmpeg flags) and stripped it out. The skill is fast-pass only.

### settings.json allowlist addition
- `Bash(python3 *audio-qc/audio_qc_scan.py *)` — no permission prompt on QC runs

Re-run `claude-pfm-update.sh` to pick up the new `audio-qc` skill, the updated `hvg-flow` + `higgsfield-veo-batch` skills, and the refreshed settings.json.

---

## 2026-05-22

### ffmpeg added to the Mac installer
`claude-pfm-setup.sh` now installs **ffmpeg** to `~/bin/ffmpeg` as part of the one-shot install. This is what Claude (and skills) use to read video file metadata — duration, dimensions, codec — without needing to open the file in a player. Static binary pulled from evermeet.cx (~80MB, idempotent — re-running the installer skips if `~/bin/ffmpeg` is already present).

On already-set-up editor machines: re-run `claude-pfm-setup.sh` to get ffmpeg. It'll skip everything that's already installed and just add the ffmpeg step. Or run the install snippet directly:

```bash
mkdir -p ~/bin && cd /tmp && \
  curl -L -o ffmpeg.zip "https://evermeet.cx/ffmpeg/getrelease/zip" && \
  unzip -o ffmpeg.zip -d ~/bin/ && \
  chmod +x ~/bin/ffmpeg && \
  ~/bin/ffmpeg -version
```

Windows equivalent pending — `evermeet.cx` is Mac-only. Windows editors should sit tight until the cross-platform path is added.

---

## 2026-05-21

### CLI is the default for ALL Higgsfield image and video gens — MCP is read-only inspection only
Hardened the CLI-vs-MCP rule across memory + every Higgsfield skill. The MCP `generate_image` / `generate_video` tools are now explicitly **forbidden** for actual firing. MCP stays in play only for read-only ops — `balance`, `transactions`, `models_explore`, `select_workspace`, `show_*`. This applies to every gen — one-off tests, character masters, re-fires, exploratory variations, everything. Previously this rule lived implicitly in `feedback_higgsfield_workflow.md`; now it's surfaced in the memory index, the `higgsfield-image-generation` skill (rewritten from MCP-driven to CLI-driven), and the convention banners on `higgsfield-veo-batch` + cross-references in `hvg-flow` / `hig-flow`.

The "MCP vs CLI" panel on the home page now reflects the new lock — MCP is described as inspection-only, not "one-off exploratory firing."

### Concurrency rewrite — UUIDs + Python ThreadPool `max_workers=16`
The previous bash-background-jobs concurrency pattern (`& + wait` with `--image <local_path>`) hit the Higgsfield CLI's credential-store race under load — concurrent CLI processes contend on the auth file while uploading per-job, and most jobs come back empty past ~10 in flight. New locked pattern (verified empirically on 100-job runs):

1. **Pre-upload** every unique reference image **serially**, capture UUIDs.
2. Fire the batch via **Python `ThreadPoolExecutor(max_workers=16)`**, passing UUIDs to `--image` / `--start-image` / `--end-image` (never local file paths).
3. Bash `&` past ~10 jobs is deprecated. Don't use.

Applied to `hvg-flow`, `hig-flow`, `higgsfield-veo-batch`, and `higgsfield-image-generation`. Cap will be revisited after Higgsfield Enterprise call — if Enterprise allows higher concurrency cleanly, workers can be raised.

### Veo cost table corrected — empirical 2026-05-20 numbers
Previous skills documented stale costs (Fast at 22 cr, Lite at "8 cr with audio"). New verified numbers across `hvg-flow` + `higgsfield-veo-batch`:

| Model | Cost / 8s clip | Audio |
|---|---|---|
| Lite — silent | 8 cr | ✗ |
| Lite — with `--generate_audio true` | 12 cr | ✓ |
| Fast | ~27 cr | ✓ (default) |
| Preview (base) | ~58 cr | ✓ |
| Preview (Ultra) — `--quality ultra` | ~87 cr | ✓ |

Two flags newly documented: **`--generate_audio true`** (Lite ships silent without it — known gotcha that caused silent shipping in past batches) and **`--quality basic\|high\|ultra`** (Preview Ultra is the top-tier quality knob).

### veo-script-writing — no camera device names rule
New Rule 3b: words like `iPhone`, `phone`, `GoPro`, `DSLR`, `dash cam`, `Ring camera` in the spoken dialogue or scene description make Veo render that physical device in frame. Device-aesthetic cues belong in the Veo prompt's visual block as indirect markers, not named in the script. Compliance scan + the breaking-news integration checklist both updated to call this out.

### breaking-news-story-ads — three flavors + default talent
Aligned the LL copy of `breaking-news-story-ads` to the most recent Cowork plugin source. Adds:

- **The three flavors** — Flavor A (news-wraps-existing-story-ad re-frame), Flavor B (news-wraps-LC-as-viral-podcast-clip), Flavor C (pure breaking news no source asset). Each with source/body description + reference creative.
- **Default talent** — Lauren Hayes (anchor) + Rachel Torres (field reporter) are the recurring PFM news-talent. Reuse by default; only propose new names if explicitly requested.
- **Workflow gating** — master template first, state/variant fills only after master is locked.
- Removed the stale "Frame-to-video JSON patterns" section. Per-clip Veo prompts now live in the project's Excel manifest built by `hvg-flow`, not embedded inside the script doc.

### PowerFox Enterprise plan — concurrency cap pending
Skills now say "PowerFox Enterprise plan" wherever they reference Higgsfield concurrency. Server-side cap is high enough on Enterprise that it's no longer the practical bottleneck — `max_workers=16` is the defensive default driven by the client-side CLI credential-store race observed on the old Team plan, and will be revisited after the first real Enterprise batch fire.

### Install command — no sudo
`higgsfield-veo-batch` and `hvg-flow` install hints both now use `npm install -g @higgsfield/cli` (no sudo) to match `claude-pfm-setup.sh`. Sudo isn't needed on properly-configured editor machines and triggers prompts for password.

---

## 2026-05-20

### Never re-ask for Notion URL or project folder mid-session
Hardened the handoff between `lc-to-video-podcast` and `hvg-flow` so editors aren't asked to "drop the Notion URL again" when the URL and project folder are already in session context. The chained handoff now flows: script-locked → editor says any HVG trigger → `hvg-flow` enters Gate 1 immediately with the already-known URL + cwd. No re-paste, no redundant prompting. Same fix applies to any in-session chain where the URL was established earlier (script review → fire, edits → fire, etc.).

### Veo word ceiling raised — 24 → 30
Veo line ceiling moved from 24 to 30 words across `veo-script-writing`, `lc-to-video-podcast`, and `higgsfield-veo-batch`. Target sweet spot stays **17-22 words** with the long-lean discipline intact — the extra room is reserved for beats that genuinely earn a longer landing (~9-10s at podcast pace). Closing line still gets the 12-15 word short-line exception.

Quick reference: floor 15 words / target 17-22 / hard ceiling 30 / closer 12-15.

### Hub — "How it works" overview section added
New visual overview on the home page (anchor: **How it works** in the sidebar). Five panels designed for sharing the system with non-editor stakeholders:

1. **Context layers** — how Claude is trained up on PFM (memory → skills → context folder → Notion brief)
2. **MCP vs CLI** — side-by-side comparison of the two ways Claude talks to Higgsfield, and why PFM uses the CLI for production
3. **Notion drop flow** — what happens when an editor drops a Notion URL or project folder reference
4. **The 9 gates** — visual stepper of every gate Claude walks with an editor, with one-line descriptions
5. **Team folder breakdown** — what's inside `6. Claude PFM/` on Lucid Link

This sits between the daily-use commands at the top and the per-OS setup walkthroughs below.

---

## 2026-05-18

### PFM conventions enforced on ALL Higgsfield fires (not just gated flows)
Closes a gap where one-off CLI calls, manual re-fires, and exploratory gens outside the structured `hvg-flow` / `hig-flow` 9-gate flows were skipping PFM-specific conventions — brand-clean negatives, ambient audio direction, character master format, no [STATE LINE] tags, count=1 vs count=2, filename hex suffixes for Resolve, etc.

Three reinforcing signals locked in:

- **New memory entry** so the rule fires across all sessions: whenever Claude is about to invoke Higgsfield (CLI or MCP) for PFM work, it must self-impose `hvg-flow` (video) or `hig-flow` (image) conventions first.
- **`higgsfield-image-generation` skill** now opens with a "PFM CONVENTIONS — non-negotiable" callout listing the must-apply rules and cross-referencing `hig-flow`.
- **`higgsfield-veo-batch` skill** same — opens with the matching callout cross-referencing `hvg-flow`.

This is a discipline fix. The difference editors will notice: fewer first-draft fires that need re-runs because something obvious (brand-clean negative, audio block, ref format, count) was skipped.

### hvg-flow — strict protocol initiation on Notion link / project folder
Hardened auto-trigger behavior so the skill never freelances between gates. When an editor drops a Notion URL or references a PFM project folder path, the model now enters Gate 1 immediately — no head-start Notion fetches, no early shell commands, no brief parsing or format guessing before the gates instruct it, no "would you like to…" alternative offers.

If an editor pastes ahead-of-schedule info (e.g., the master prompt at session start), the skill acknowledges it but still walks gates in order, using the early input at the corresponding gate.

This is a discipline fix, not a feature change — but the difference editors will notice is fewer surprise tool calls between gates and tighter, more predictable conversations.

### veo-script-writing — Gate 0, [STATE LINE] strip, no 3-4s beats
Three hardenings landed today after an editor's LC-to-Video output shipped with `[STATE LINE]` trailing annotations and choppy 3-4s "punchy beats":

- **Gate 0 — LC handoff.** When `/veo-script-writing` is invoked on a Notion request titled "LC to Video —" or on a multi-paragraph long-copy Facebook ad, the skill now surfaces a handoff proposal to `lc-to-video-podcast` and waits for explicit editor confirmation before rebalancing.
- **Strip `[STATE LINE]` trailing tags.** Real bracketed placeholders inside a line (`[STATE]`, `[ROAD]`, `[STATE_RATE_YEAR]`) stay; trailing meta-annotations come out. Scan-and-strip pass runs before delivery.
- **No 3-4s "punchy" beats.** Lines like `"Impact. Bumper gone."` are always merge candidates. Every Veo clip lands in the 15-24 word window, leans long. Closing line is the only short-line exception (12-15 words).

### lc-to-video-podcast — same hardenings
Mirror updates to the floor-15 + no-3-4s-beats rule. Word floor moved from 12 → 15 to enforce 6-8s leaning long.

---

## 2026-05-14

### Higgsfield enterprise migration → PowerFox workspace
Editors moved off the shared `powerfoxlogin@gmail.com` Higgsfield account onto a **PowerFox enterprise workspace** with 1.1M+ shared credits. NB Pro images now bill **0 credits** via the Unlimited entitlement on this workspace (must be explicitly selected — workspace UUID `e7479d4c-0d59-4be5-9057-abce9fe30f39`).

- New script: `claude-pfm-account-switch.sh` — handles logout, login with personal email, workspace set, and verification in one shot.
- Higgsfield MCP in Claude Desktop has separate auth — must be reconnected per-editor (Settings → Connectors → Higgsfield → Disconnect/Reconnect).

---

## 2026-05-13

### hvg-flow — permission prompt refactor + AskUserQuestion killed
- `hvg-flow` Gate 8 heredoc Python and Step 10 parallel mp4 download refactored into checked-in helper (`download_parallel.sh`). Allowlisted as `Bash(bash *hvg-flow/download_parallel.sh *)` — no more "Allow once" prompts mid-run.
- Both `hvg-flow` and `hig-flow` now explicitly tell Claude to NEVER use the `AskUserQuestion` tool for gate confirmations. Multi-choice questions render as plain markdown chat instead.
- Gate 4 (reference mode + assignment) rewritten — asks reference image AND reference mode together, always shows all 5 modes (A-E) with plain-English "when to use" descriptions.

### Editor onboarding scripts
Three Lucid Link scripts shipped:
- `claude-pfm-setup.sh` — one-shot Mac installer (Homebrew → Node → Git → Higgsfield CLI → skills + settings).
- `claude-pfm-setup-windows.sh` — Windows post-prereqs installer (after manual Git/Node/Python installs).
- `claude-pfm-update.sh` — pull latest skills + settings from Lucid Link.

---

## 2026-05-12

### veo-script-writing — no em/en dashes, no ALL CAPS in lines
Strip every em/en dash and ALL CAPS word from balanced Veo lines even when the brief contains them. `[BRACKETED_TOKEN]` placeholders keep their caps as the exception. Scan-and-strip pass runs before delivery.
