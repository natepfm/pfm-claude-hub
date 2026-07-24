---
name: ugc-interview-flow
description: PFM's UGC group-interview creative pipeline, TWO MODES (alias /ag.ugc.interview.flow). A host interviews several people in a real-feeling location, each answering with their item + rate, full demographic matrix off one script. MODE A "NO-CUTS" — fake-continuous one-take, chained Seedance clips with pixel-matched joints the editor butt-joins (open settings: block party, car meet, jobsite; proven Home Block Party 28 clips + Auto Car Meet 32 clips, both 8-way). MODE B "CUTS" — shared brandless location masters + distinct-identity demographic cast cards, then INDEPENDENT per-station Seedance clips (multi-room / aisle-heavy locations where a one-take breaks; proven Home Depot Crew 32 clips + Home Cleaners Crew 40 clips, both 8-way). Contributed + maintained by Zach Hustead (v1 07-07, v2 07-14). Use when an editor says "UGC Interview Flow", "no cuts version" / "one-take" (Mode A), "cuts version" / "same style as Home Depot / Auto Dealership / Cleaners" (Mode B), or drops a VTM request in the UGC Interview format ("UGC Interview - <Setting> Crew/Party/Meet" family). NOT for: single-presenter UGC (ugc-talking-head-ref/-veo), Veo podcast story ads (hvg-flow), or writing the request itself.
---

# UGC Interview Flow — group interviews, two modes

> Maintainer: **Zach Hustead** — improvements route via `propose-skill` UPDATE mode ("propose an update to ugc-interview-flow"), Sam merges + re-distributes.

## 🔀 Mode gate (FIRST decision, before anything fires)
**Pick by LOCATION, confirm with the editor:**
- **Mode A — NO-CUTS** (`references/no-cuts-playbook.md`): open settings where a continuous walk is plausible — block party, car meet, jobsite yard. Output = chained clips the editor butt-joins into one seamless take.
- **Mode B — CUTS** (`references/cuts-playbook.md`): multi-room or aisle-heavy locations (house interior, big-box store) where a chained take can't keep the space proportionally accurate. Output = independent per-station clips off location masters + cast cards.
Editor names it ("no cuts" / "cuts" / "like Home Depot") → that's the mode. Ambiguous → ask, one line. **Read the chosen playbook before ANY run — the playbook is law.** Script-is-LAW, the demographic matrix, verbatim rates, and the SMA/NY disclaimer gates apply identically in BOTH modes.

---

# Mode A — the NO-CUTS one-take method

**Full playbook: `references/no-cuts-playbook.md`** — Zach's complete method with every gen-proven gotcha, both worked matrices, and the Round-2 continuity rules. This section is the operating summary; the playbook is law.

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

## Naming — Mode A (locked in practice)

`Elements/Footage/Reference/V<N> - <Demographic> - No Cuts/` (wide + seams) · `Elements/Footage/Veo/V<N> - <Demographic> - No Cuts/` → `<Project>_V<N>NC_clip0<K>_v0<M>.mp4` · deliverable = approved clips per version, **no stitch files ever**.

---

# Mode B — the CUTS method (location masters + cast cards)

**Full playbook: `references/cuts-playbook.md`** — read it before any Mode B run. The operating shape:

1. **Fetch + format the request** (Copy is usually a rough competitor rip — rebuild attribution, add host bridges, flag missing rates); editor stamps the locked script + 8-way matrix. Scaffold the full project folder.
2. **Wave 1 — location masters** (NB Pro 9:16 1k): one per interview station, ONE coherent brandless location. 🔴 Text-only fires go SERIAL with a gap (parallel trips a fake "Not authenticated"); `--image` edit passes are parallel-safe. Editor stamps each.
3. **Wave 2 — cast cards** (NB Pro, `--image` = station master): one card per worker + host, per version. 🔴 DISTINCT written identity per worker (one demo string = triplets) · "ordinary-attractive, NOT model-glamorous" · uniforms BLANK + anti-brand negatives · host = phone-free selfie plate. ≥20 → Fire? gate; post-landing agent audit → surgical 2-credit wipes on flags only.
4. **Wave 3 — clips** (Seedance 2.0, 720p, `--start-image` = card): one per station, duration = spoken load. 🔴 15s hard cap (18s silently drops the clip at validation). CTA clip: lander PNG via `--medias`, host pulls the phone MID-CLIP with the free hand. ≥20 → Fire? gate; auto-retry 502s.
5. **QC** — ffmpeg physics + high-pass radio probe + Whisper verbatim (🔴 spoken numbers transcribe as digits → read flagged transcripts before refiring). Deliver per-version folders; Resolve import = Project bin > Elements > V1–V8.

**The locked prompt-stack (all of it, every clip):** anti-radio audio block ("a few feet away off-camera", NEVER "phone-distance") · chant guard ("each line ONCE… then wordless") · CTA screen-orientation lock + check every CTA (~3-in-8 land backwards regardless) · selfie-arm/free-hand rules · word-flub respells · planted blocking + per-station physical closer. Details + naming in the playbook.

## Cross-refs
`ugc-cinematic-prompt` (Seedance prompt body craft) · `labs-voice-swap` (host unify) · `add-ai-disclaimer` (NY) · `nano-banana-prompting` (masters/wides/cards) · contributed via `propose-skill` by **Zach Hustead** — the flywheel's first shipped skill, and its first v2 (Cuts Edition, shipped 07-15).
