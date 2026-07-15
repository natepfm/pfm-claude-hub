---
name: wr.cutoff
description: "[writing task, opt-in] Write a CUT-OFF / interrupted Veo dialogue line so the TTS cuts clean — end the fragment with an em-dash (—), never a '?' or ellipsis, which make Veo voice a garbage syllable into the gap. THE sanctioned narrow exception to PFM's no-dash Veo dialogue law: the em-dash goes ONLY at the cut point of a deliberately interrupted line; everywhere else the no-dash law stands. Use when a script calls for someone being cut off, stopping mid-word, trailing into an interruption, or one character finishing another's sentence — editor says 'wr.cutoff', 'cut-off line', 'she gets interrupted here', 'he can't say the word', 'they finish each other's sentence', 'handle this interruption for Veo'. Josiah Akimenko's technique (verified on the Wife Flooded the House L45 refire). NOT for: normal pauses (commas), trailing-off moods on COMPLETED lines, short-line gibberish/music tails (--duration fix), or the '-ty'→D number flap (reword instead)."
---

# wr.cutoff — clean Veo cut-offs with an em-dash

> Maintainer: **Josiah Akimenko** — improvements route via `propose-skill` UPDATE mode, Sam merges + re-distributes.

When a scripted beat has a speaker **deliberately cut off** — stopping mid-word, interrupted, or having their sentence finished by someone else — the punctuation on the fragment decides whether Veo's TTS cuts clean or hallucinates a filler syllable into the gap.

## The rule
1. End the fragment with an **em-dash (—) exactly at the cut point**: `"With the—"`
2. **Never** a question mark (`"With the?"`) and **never** an ellipsis (`"With the..."` / `"With the...?"`) — both make Veo voice garbage into the gap.
3. Keep the completing speaker's line intact and immediately after: `And I said, with the flood.`
4. Still stochastic — the em-dash makes a clean cut the **default**, not a guarantee. Spot-check cut-off lines in QC; a rare take may need one refire.

## The evidence (real, Wife Flooded the House L45, 07-13)
Beat: the wife trails off because she can't say "flood"; the husband finishes it.
- `"With the?"` → Veo said **"With the hod?"** (garbage syllable)
- Refires with `?` and ellipsis variants → **"Ha" / "haw" / "fud" / "A"** — all filled the gap
- `"With the—"` → **clean cut-off, no filler** → promoted to `_Shared/L45.mp4` and shipped

Shipped line: `She said, "twelve hundred? For the whole year?" Yeah. "With the—" And I said, with the flood.`

## 🔴 Scope — this is the ONE exception to the no-dash law
PFM's Veo dialogue law bans dashes and ellipses everywhere (`feedback_veo_no_em_dashes` — they cause pause/read defects on normal lines). This skill is the **single sanctioned exception**: an em-dash **only at the cut point of a deliberately interrupted line**. It never licenses dashes anywhere else in dialogue, and it's **opt-in** — invoked when the script calls for a cut-off beat, not an automatic rewrite pass.

## Not this skill (adjacent Veo dialogue issues)
- Normal mid-sentence pauses → commas, unaffected.
- Short-line gibberish / music tails → a `--duration` fix, not punctuation.
- The "-ty"→D number flap (thirty→thirdy) → reword to dodge (`wr.numbers` / `feedback_veo_audio`).

## Output
No new files — the em-dash form is what gets written into the script's numbered line, the dialogue manifest, and the Veo `dialogue` field the fire sends. Cross-refs: `wr.aiscript` (the base dialogue law) · `wr.pod.lc` / `wr.bn` (inheriting writers).
