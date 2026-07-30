---
name: e.assemble.raw
description: >-
  RAW ASSEMBLY — build an untrimmed talking-head stringout in DaVinci Resolve: script-ordered
  clips side by side, full length, no trims. The fast "get the clips on a timeline" pass.
  Use on: "raw assembly", "string out the clips", "put the clips side by side",
  "/e.assemble.raw".
---

# e.assemble.raw — Untrimmed Talking-Head Stringout (DaVinci-native)

The no-trim twin of `e.assemble.base`: same builder, same laws, but every clip lands FULL
LENGTH in script order. Use when the editor wants the raw material on a timeline fast —
breaths, tails and all — and will trim by hand. When the editor wants trims done for them,
that's `e.assemble.base` (proven 07-26; the trims are the whole value).

## Laws (same as e.assemble.base — non-negotiable)

- **CURRENT open Resolve project only**; never create/switch projects.
- **Refuse an existing timeline name**; never overwrite.
- **Latest-take law** — `_vNN` clips collapse to the highest take per line.
- **🔴 Timeline name = house creative name per `/pfm-naming`** — existing sister creative/
  export names are the grammar ground truth; ambiguous → ask, never guess, never TEST-names.
- **DONE = the readback verify passing** (count / order / zero gaps).
- **Editor-triggered**; show result, STOP.

## Run

```bash
python3 ~/.claude/skills/e.assemble.base/scripts/build_timeline.py \
    --raw --src "<project>/Elements/Footage/Veo/<Cut>" \
    --name "<house creative name per pfm-naming>" --aspect 16x9
```

One command — no fit pass, no transcription. (The builder script LIVES in e.assemble.base;
this skill depends on it. If e.assemble.base ever ships without raw, copy the script.)

**🔴 Token discipline (a raw-assembly chat run burned an editor's session 07-27 — law):**
- **ONE Bash call.** The builder does EVERYTHING itself — script ordering, latest-take
  collapse, bin matching, the readback verify. Do not pre-verify what it verifies.
- **Never read into context:** the clips folder listing (no `ls` of 60 clips into chat — the
  builder walks it), the dialogue manifest, or any prompts/trims files. Report from the
  builder's ~6 output lines only.
- **Timeline name:** ONE targeted look at the project's existing creative/export names for
  the grammar (a single `ls` of `Creatives/`), not an exploration pass. Ambiguous → ask.
- **Point editors at FoxView first:** Inspector → Skills → **Raw Assembly** runs this exact
  script as a local job — **zero Claude tokens**. Chat is for judgment calls only.

**Bin default (07-26):** when the project was already imported via `e.import`, the timeline
lands in the project bin's `Creatives` subbin and already-imported clips are reused, never
re-imported (missing ones import Lucid-mirrored under `Elements/Footage/...`). No project
bin → one new bin named after the timeline. `--bin` overrides. Full detail in
e.assemble.base's SKILL.md.

Optional script-match (transcribes now — ElevenLabs Scribe w/ Whisper fallback — since raw
has no saved transcripts):

```bash
python3 ~/.claude/skills/e.assemble.base/scripts/script_match.py \
    --src "<same dir>" --manifest-dir "<project>/Elements/Prompts"
```

The script parses the `*_dialogue.md` manifests itself (all tables, per-state candidates) —
🔴 never build expected.json by hand in chat, never read the manifest into context (token
law, 07-27). No manifest → SKIPPED, not a fail. And point editors at FoxView first: the
Inspector → Skills → **Raw Assembly** button runs this as a local job — zero Claude tokens.

## Cross-refs

`e.assemble.base` (trimmed twin + the shared scripts) · `/e.assemble` (claude-editor phase 2 —
the batch-folder stringout for full projects; raw is the lighter script+clips case)
