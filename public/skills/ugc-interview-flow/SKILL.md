---
name: ugc-interview-flow
description: PFM's UGC group-interview creative pipeline — fake-continuous "NO-CUTS" one-takes (alias-to-be /ag.ugc.interview.flow). A host walks a real-feeling location (block party, car meet, jobsite) interviewing several people who each answer with their item + rate, generated as a chain of Seedance 2.0 clips whose joints are pixel-matched so the editor butt-joins them into one seamless take. Battle-proven twice at full scale (Home Block Party 8-way / 28 clips; Auto Car Meet 8-way / 32 clips). Contributed by Zach Hustead (07-07, revised 07-08/09/10). Use when an editor says "UGC Interview Flow", "no cuts version", "one-take", "make it look like one take", or drops a VTM request in the UGC Interview format ("UGC Interview - Stories - <Setting>", the "Stories - <Setting> Crew/Party/Meet" family) and wants it produced. Handles the full demographic matrix off one script (per-version voice + props/set adaptation, same structure/rates/beats). NOT for: single-presenter UGC (ugc-talking-head-ref/-veo), Veo podcast story ads (hvg-flow), or writing the request itself.
---

# UGC Interview Flow — the NO-CUTS one-take method

**Full playbook (read before ANY run): `references/no-cuts-playbook.md`** — Zach Hustead's complete method with every gen-proven gotcha, both worked matrices, and the Round-2 continuity rules. This file is the operating summary; the playbook is law.

## The core loop — one clip at a time, chained off real endings

1. **Script is LAW.** Fetch the Notion request FIRST; Copy-section dialogue goes into prompts **verbatim**. Demographic adaptations only (voice + props/set dressing per cast) + editor-called compliance edits. NO paraphrase, NO compressed beats, NO invented CTAs. (A paraphrase once turned "$490/yr" into "$90/yr" — a floor breach that survived two approvals.) Structural change = show original-vs-proposed side by side, editor chooses. Dollar amounts spelled as words.
2. **Wide reference per demographic version** (NB Pro, 9:16, 1k, camera-roll style): entire cast head-to-toe, interview travels LEFT→RIGHT, OG/closer far right, clear walking lane, **distinct outfits per person** (they're the identity handles — and wardrobe collisions melt identity downstream). Editor stamps the wide before any video fires.
3. **Clip 1** fires with the wide as `--start-image` (Seedance 2.0, 720p, ≤15s, 9:16 — never `--image`). Travel clips cover ONE hop (1-2 new speakers max).
4. **Every later clip's start-image = the PREVIOUS approved clip's real last frame** (`ffmpeg -sseof -0.3`). The butt-joint is pixel-clean by construction. The editor stitches — **Claude NEVER assembles/concats (hard rule, locked).**
5. **Editor rubber-stamps every clip before the next fires.** Per landing: 📁 + 🔗 + 📲 + gate number + dense filmstrip + Whisper-small transcript (Rule 5 — shown the instant it lands).

## The self-gating fire loop (mechanical seam check — not creative QC)

Every chained fire wraps in: fire → download → extract frame 0 → pixel-diff vs the seam (PIL mean abs diff) → **auto-refire if diff ≥ ~20-22** (max 5 attempts; 502/504 = gateway noise, retry). Seedance re-stages the start frame ~30-50% of fires; the gate catches what eyeballing misses. This auto-refire is a MECHANICAL integrity check like digit-verify — creative misses (performance, wrong read) still go to the editor per STOP-ASSUMING. Motion caveat: lively seams inflate the diff (20-24 is often a keeper — examine the strip first). Endpoint gates aren't enough: always scan a dense mid-clip strip (fps=1; after any "random transition" reject, fps=2).

## Prompt anatomy (6 blocks, order matters — full craft in playbook §Prompt anatomy)

① "Amateur vertical iPhone video, one continuous handheld shot, no cuts." ② Start-frame description **written from LOOKING at the seam image** (push-in when the destination is already visible; reveal only for genuinely out-of-frame — the #1 lesson). ③ Reference scope: cropped-wide medias of ONLY this clip's destinations + off-screen bracket — but DROP the crop when the destination's face is already in the seam. ④ Motion: eased head ("HOLDS with gentle sway, then eases into the pan"), one unbroken move; endings keep breathing sway (sway→sway across every cut). ⑤ Dialogue inline with the pan, speakers ON CAMERA lips synced, host = off-camera deep male voice, everyone speaks UP, no dead air. ⑥ Setting lock + background freeze + ambience bed named POSITIVELY (audio is a continuity surface) + anti-haze stack (style rides the seam) + negative wall (anti-cut, anti-passerby, anti-invention).

## Non-negotiables from the playbook

- **Dead-air closer:** tighten `--duration` to the dialogue + end on a mouth-busy physical action (sip / nod / grill flip); every prop has an on-screen SOURCE and held props never vanish.
- **Casting:** roster lock via imagery, never text alone; describe destinations from the RENDERED pixels, not the wide's prompt; wardrobe collisions → the EMPTY-BEAT PAN fix.
- **Voices:** proper nouns are traps (swap to sayable words — editor's call); host voice varies per clip → labs-voice-swap unify pass in post; on-camera voice clashes → re-roll or labs conform.
- **Dead tails cost zero gens** — trim at the join, hand the editor the timecode; don't refire good clips for sluggish endings.
- **Phone screens:** name the actual elements + lander via `--medias` UUID; small print garbles at 720p — that's a post screen-comp.
- **NY cuts** need the synthetic-performers disclaimer (`add-ai-disclaimer`).

## Naming (locked in practice)

`Elements/Footage/Reference/V<N> - <Demographic> - No Cuts/` (wide + seams) · `Elements/Footage/Veo/V<N> - <Demographic> - No Cuts/` → `<Project>_V<N>NC_clip0<K>_v0<M>.mp4` · deliverable = approved clips per version, **no stitch files ever**.

## Cross-refs
`ugc-cinematic-prompt` (Seedance prompt body craft) · `labs-voice-swap` (host unify) · `add-ai-disclaimer` (NY) · `nano-banana-prompting` (the wide) · contributed via `propose-skill` by **Zach Hustead** — the flywheel's first shipped skill.
