---
name: e.assemble.base
description: >-
  BASE ASSEMBLY — build a breath-trimmed talking-head stringout in DaVinci Resolve directly
  (no fcpxml bridge): script-ordered clips, canonical head/tail trims, per-clip in/outs via
  the Resolve API, structural + script-match verification. Use on: "base assembly",
  "assemble the talking head timeline", "build the trimmed stringout", "/e.assemble.base".
---

# e.assemble.base — Trimmed Talking-Head Stringout (DaVinci-native)

Proven 2026-07-26 on DaughterRanOverFerrari (Gavin) Broad 16x9 — 63 clips, trims computed +
built + twice-verified in ~10 min, no fcpxml. Sam-approved after the tail refit. Applies
**any time there is a script and matching talking-head clips** — LCtoVid podcasts, UGC
talking heads, any L##-per-line clip set.

**What it is NOT:** full LCtoVid construction. PiP, b-roll fill, fades, retimes stay in
Palmier + the fcpxml route (`lctovid-podcast-palmier`). The Resolve API **cannot retime**
(probed 07-26: `SetProperty("Speed")` returns False; `RetimeProcess` is the algorithm enum,
not a rate) and cannot crossfade — this skill ships native-speed hard cuts, "half the work
done" before the editor opens the timeline. Raw (untrimmed) variant = `e.assemble.raw`.

## Laws inherited (non-negotiable)

- **CURRENT open Resolve project only** — never create/switch/load projects (claude-editor law).
- **Refuse an existing timeline name** — never overwrite; editor deletes/renames first.
- **Latest-take law** — `_vNN` clips collapse to the highest take per line (built into both
  fit_trims.py and build_timeline.py).
- **🔴 Timeline name = the house creative name per `/pfm-naming`** — derive it before building;
  the project's EXISTING creative/export names are ground truth for the grammar (sister files
  beat memory). Ambiguous → ask the editor, don't guess. Never leave a TEST-style name on a
  real assembly.
- **DONE = a check passed** — the build script's readback verify (count/order/in-outs/zero
  gaps) plus script-match. Anything else is "not verified".
- **Editor-triggered** — like /e.assemble, this runs when the editor asks. Show the result,
  STOP; the next iteration is the editor's call.

## The locked trim recipe (do not re-derive — each rule was paid for)

- **HEAD:** `speech_span()` (canonical, imported from `lctovid-podcast-palmier`) — energy
  onset behind a 120-900Hz voiced-band bandpass, threshold = band mean +6dB d=0.15, guardrail
  onset>1.2s → 0.20s. `inF = max(0, round(onset*24) - LEAD_IN(2))`.
- **TAIL:** `transcribe_words()` → last real word end (non-lexical fillers stripped) →
  `tail_pos()`: clamp back to the last actually-voiced moment, pad forward to first sustained
  room tone +0.03s, floor `TAIL_PAD` / cap `TAIL_CAP`, **never the clip end**. `tail_pos()` is
  still the VERBATIM `fit_lctovid.py` port — pad/cap are overridden at the CALL SITE
  (`--tail-pad` / `--tail-cap`), the function body is untouched. A flat pad chops word releases
  → audible clicks — that was the v1 defect Sam caught immediately.
- **🔴 FILLER CEILING (added 07-27, Sam-approved by ear — "PERFECT").** When a trailing filler
  is stripped, the cut may never come within `FILLER_GAP` (0.12s) of where that filler STARTS.
  Why: Scribe's timestamps run late at BOTH ends, so the forward pad was landing back on top of
  the off-camera "mm-hmm" the strip had just removed — the trims sounded loose on podcast clips.
  Neither the floor nor the cap fixed it (each moved 0-2 frames); the start-ceiling did.
  0.04s was still catching the filler's onset — 0.12s is the dialed value.
  **KNOWN GAP:** verbal acknowledgments ("Right.", "okay", "sure", "yep", "exactly") are NOT in
  `FILLERS`, so a host backchannel using those still survives. Deliberate — they are real words
  and stripping them risks cutting genuine speech (the failure mode that got Whisper demoted).
  Extending into that class is Sam's call, not a bug to fix silently.
- **🔴 Transcriber = ElevenLabs Scribe, Whisper offline fallback** (`transcribe_words()`
  default). Locked 07-26: Whisper base.en DROPPED trailing words on 2/63 clips (L22/L44,
  ~1.3s of real speech each) — Scribe caught them. Whisper is fallback only.
- **🔴 ElevenLabs key required for full-quality trims.** Scribe needs the shared PFM
  ElevenLabs key at `~/.claude/.elevenlabs_key` (chmod 600) or env `ELEVENLABS_API_KEY`.
  Distribution = Sam DMs it privately (same pattern as the shared Gemini key) — NEVER via
  #claude-pfm, the hub (no-creds-on-hub law), or x.sync (keys never sync). Editor setup is
  one Terminal line: `echo "<key>" > ~/.claude/.elevenlabs_key && chmod 600 ~/.claude/.elevenlabs_key`.
  Without it the skill still runs but silently degrades to Whisper — the exact mode that
  dropped words above. Verify signal in the fit log: `[stt] elevenlabs scribe_v2` per clip;
  `[stt] elevenlabs FAILED … falling back` = degraded trims.
- 24fps everywhere. No retime, no fades (API can't; see above).

## Run (ONE call — 🔴 token law, locked 2026-07-27)

```bash
# fit → build → script match, one backgrounded call (Resolve open on the right project first)
python3 ~/.claude/skills/e.assemble.base/scripts/run_all.py \
    --src "<project>/Elements/Footage/Veo/<Cut>" \
    --name "<house creative name per pfm-naming>" --aspect 16x9
```

The orchestrator chains all three phases and prints ONE compact summary (fit DONE line +
Scribe-degraded warnings, build RESULT, script-match RESULT/FLAGs). Per-clip logs stream to
`Elements/Prompts/<cut>_assembly_log.txt` on disk. Script match builds its expected lines
straight from the project's `Elements/Prompts/*_dialogue.md` manifests (all tables merge;
per-state variants become candidates, best similarity wins; no manifest → SKIPPED, not a
fail). Exit: 0 clean · 1 match flags (timeline still built) · 2 fit/build failure.

**🔴 Token discipline (this skill burned an editor's session 07-27 — these are law):**
- **ONE Bash call, backgrounded.** Never run the three scripts as separate turns; never poll
  the background task — report when the completion notification lands.
- **Never read into context:** trims.json, transcripts, the assembly log, or the dialogue
  manifest (script_match parses it itself — never build expected.json by hand in chat).
  Report from the printed summary only.
- **Point editors at FoxView first:** the Inspector → Skills → **Base Assembly** button runs
  these exact scripts as local jobs — **zero Claude tokens**. Chat is for judgment calls
  (naming, mixed cuts, recovering a failed run), not the happy path.
- Individual scripts (`fit_trims.py` / `build_timeline.py` / `script_match.py`) remain for
  partial re-runs — e.g. re-match after a manifest fix without re-transcribing.

## Bin behavior (Sam 07-26, changed live during FoxView testing)

The editor's real workflow is **Send to DaVinci (`e.import`) first, then assembly** — so the
clips and the Lucid-mirroring bins are usually ALREADY in the pool. With no `--bin`:

- Root bin named after the Lucid project folder found (what `e.import` creates) → the
  timeline goes into that bin's **`Creatives`** subbin (same home as `claude_editor_assemble`
  timelines); already-imported clips are matched **anywhere inside the project bin** (nothing
  re-imported); genuinely-missing clips import into the Lucid-mirroring
  `Elements/Footage/...` subbin — never into Creatives.
- No project bin (standalone use) → old behavior: one new root bin named after the timeline.
- Explicit `--bin` overrides everything with the old semantics.

## Review gate

After the three checks pass, the editor scrubs the timeline in Resolve — ears grade what
measurement can't (pacing back-to-back, hard-cut ticks). Report the trim table summary
(head range, total cut, outliers) with the handoff. No renders, no exports — /e.export is
its own editor-triggered step.

## Cross-refs

`e.assemble.raw` (untrimmed twin) · `lctovid-podcast-palmier` (full construction; the
canonical trim source — `scripts/asm_lib.py` VENDORS speech_span/transcribe_words/edge
constants from it verbatim so this skill is self-contained for team machines; if the
canonical changes, re-port asm_lib) · `feedback_palmier_breath_trim_voiced_band` ·
`feedback_lctovid_adaptive_edge_fitting` · `project_davinci_resolve_mcp_eval` (the
API-ceiling evidence)
