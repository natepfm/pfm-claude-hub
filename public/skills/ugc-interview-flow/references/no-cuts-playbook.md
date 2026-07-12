# Skill Proposal: UGC Interview Flow — NO-CUTS ONE-TAKE EDITION

- Proposed by: Zach Hustead
- Date: 2026-07-07 (major scope revision 2026-07-08 after the full 8-way Block Party matrix shipped)
- Vertical / area: Broad by design — Auto, Home, and future verticals (HVAC mentioned). First live project: Home – Forms.
- Frequency: Frequent — recurring house format across verticals.

## One-liner
Produce PFM's UGC group-interview creatives as **fake-continuous "no cuts" one-takes**: a host walks a real-feeling location interviewing several people who each answer with their item + rate, generated as a chain of Seedance 2.0 clips whose joints are pixel-matched so the editor can butt-join them into one seamless take.

## ⚠️ SCOPE SHIFT (Zach, 2026-07-08)
The skill's **main focus is now ensuring we can make NO-CUTS videos on demand.** The multi-cut interview variant still exists as the easy case, but the hard capability this skill must encode — and the reason it exists — is the one-take chain: boss-level requests for "looks like it's all one take with no cuts." This was proven across the ENTIRE 8-way Block Party matrix (V1–V8, 28 approved clips, every joint gated).

## Trigger — when should Claude run this?
Editor says **"UGC Interview Flow"** / "no cuts version" / "one-take" — or drops a Notion VTM request in the UGC Interview format (e.g. "UGC Interview - Stories - <Setting>") and asks to produce it.

## THE NO-CUTS METHOD (fully battle-proven, 8 versions shipped 2026-07-08)

### Core loop — one clip at a time, chained off real endings
1. **Script is LAW.** Fetch the Notion request FIRST; the Copy section's dialogue goes into prompts **verbatim**. Demographic adaptations only (mom→daughter, my girl→my husband, Ayo→Alright ladies, dad→brother for old casts) + editor-called compliance edits (e.g. "damn" removed). NO paraphrase, NO compressed beats, NO invented CTAs, NO folded clips. (A paraphrase once turned "$490/yr" into "$90/yr" — a Home-Forms floor breach that survived two approvals.) Show original-vs-proposed side by side for any structural change and let the editor choose. Spell all dollar amounts as words ("four hundred ninety a year").
2. **Wide reference per demographic version** (NB Pro, 9:16 1k, iPhone-camera-roll style): ENTIRE cast in frame head-to-toe, interview travels LEFT→RIGHT, OG/closer FAR RIGHT reading oldest/wisest, a CLEAR walking lane in front, distinct outfits per person (they become the prompt's identity handles). Editor stamps the wide before any video fires.
3. **Clip 1** fires with the wide as `--start-image`. Travel clips each cover ONE hop (1–2 new speakers max). Black-voice script (5 speakers + negotiate close) = 4 clips; White-voice (4 speakers) = 3 clips.
4. **Every later clip's start-image = the PREVIOUS approved clip's real last frame** (`ffmpeg -sseof -0.3`). Butt-joint is pixel-clean by construction. The editor stitches — **Claude NEVER assembles/concats** (hard rule, locked).
5. **Editor rubber-stamps every clip** before the next fires. Heads-up per landing: 📁 path + 🔗 LinkYourFile + 📲 tappable + gate number + dense strip + Whisper transcript.

### The self-gating fire loop (default for every chained clip)
Wrap every fire in a loop that: fires → downloads → extracts frame 0 → pixel-diffs vs the seam (PIL mean abs diff) → **auto-refires if diff ≥ ~20–22** (max 5 attempts) → retries 502/504s (gateway noise, not rejections). Seedance re-stages the start frame ~30–50% of fires even when told "the first frame is EXACTLY the provided start image." The gate catches what eyeballing misses — it killed ~15 broken joints in one session.
- **Motion caveat:** seams with people mid-gesture/mid-flip inflate the diff; 20–24 "fails" on lively seams are often keepers — examine the strip before refiring.
- **Endpoint gates aren't enough:** always examine a dense mid-clip filmstrip (fps=1 tile) — mid-clip cuts, wandering pans, and passersby hide between clean endpoints.

### Prompt anatomy per clip (6 blocks, in order)
1. Camera/format: "Amateur vertical iPhone video, one continuous handheld shot, no cuts."
2. **Start-frame description WRITTEN FROM LOOKING AT THE SEAM IMAGE** — this is the #1 lesson. If the destination person is already visible in the seam (Seedance loves ending on two-shots), prompt a PUSH-IN; "pan to reveal" someone already on screen contradicts the image and re-stages every take (~10 wasted gens). Reveal language only for genuinely out-of-frame destinations.
3. Reference scope: cropped-wide medias showing ONLY this clip's destinations ("the ONLY N people the camera will reach, in left-to-right order… reveal NO other person") + off-screen bracket ("the first two are behind the camera, NOT seen again; immediately right of X is Y — no one between them"). **BUT drop the medias crop entirely when the destination's face is already in the start-image** — a second image with different framing fights the seam and drags frame 1 toward the crop's geometry.
4. Motion: clip 1 = gentle push (NOT a walk-in if the wide is already at conversational distance — the model manufactures distance to walk through); travel clips = "ALREADY panning right at frame one, ONE VISIBLE UNBROKEN move, never freezes/holds/skips."
5. Dialogue inline with the pan; speakers talk **ON CAMERA, lips synced** ("no off-camera narration, no speaking before the camera reaches her") — otherwise whole lines become VO over the wrong person. Host = off-camera DEEP MALE voice (defaults female if unspecified), covers camera moves per the no-leading-silence rule. Everyone speaks UP (loud, fully audible). Fast, no dead air.
6. Setting lock + background-freeze + negative wall (anti-cut, anti-invention, anti-passerby: "no one walking through the frame, no one crossing in front of the camera", anti-junk).

### Dead-air is the enemy — end every clip with a physical closer
Leftover seconds after a short line get filled with doubled lines or rogue tail dialogue ("This been the what?"). Fixes, all proven: tighten `--duration` to the dialogue + give the last speaker a mouth-busy action closer — **sip of a drink** / **proud nod, lips pressed** / **turn back and flip the grill**. Every prop needs an on-screen SOURCE (phone from chest pocket / picked off the food table / grill side shelf — "hand visibly goes there, grabs it, brings it up") and held props NEVER vanish (cup stays in the same hand the whole clip). Phone raise = beside the shoulder, face fully visible, "EXACTLY the webpage from the reference image" (lander via `--medias` JSON, uploaded UUID).

### Casting stability
- Roster lock via imagery, not just text — text alone CANNOT hold a cast; every failure mode (invented grill-guys, phantom duplicates of the leftmost person, re-shuffled lineups) traces to the model not SEEING who it must match.
- Position lock for group openers: enumerate the left-to-right order in the prompt, "never trade places, never step behind one another," camera does NOT travel past the clip's last speaker.
- Known model prior: the OG line "This the lowest it ever been" renders "ever was" in ~every take across all demographics — editor consistently passed "ever was"; don't burn gens fighting it.
- Host voice varies per clip → finish-line **labs-voice-swap unify pass** in post (host is off-camera, zero lip risk).

### QC + delivery per clip
Dense strip (examined BY EYE before presenting) + Whisper-small transcript checked against the script (rates especially, vs the vertical's compliance floor) + gate number. Tappable links come from the job JSON or a fresh `higgsfield upload create` of the delivered file — NEVER reconstructed from memory. Files land in the version's Lucid folder BEFORE links are shown.

## Ground rules (unchanged)
1. Seedance 2.0, 720p, ≤15s clips, `--start-image` (never `--image`), 9:16.
2. One setting per request, N demographic versions; scripts differ in voice, not structure.
3. Vertical-agnostic — pull vertical + compliance (rate floors, annual vs monthly) from the request.
4. Brandless — "the same site."

## Naming / file conventions (locked in practice)
- `Elements/Footage/Reference/V<N> - <Demographic> - No Cuts/` → wide (`BlockParty_V5NC_wide_5men_v01.png`), seams (`..._SeamA_from_clip1.png`, `SeamB_from_clip2.png`, …)
- `Elements/Footage/Veo/V<N> - <Demographic> - No Cuts/` → `<Project>_V<N>NC_clip0<K>_v0<M>.mp4`
- Deliverable = the set of approved clips per version. NO stitch files, ever.

## Worked example — the full 8-way matrix (real, shipped 2026-07-08)
**Project:** `/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/Home Insurance - Completed Creatives/Home Insurance - 2026/Home - July 2026/07.07.26 - Stories - UGC Interview Home Block Party/`
**Request:** [UGC Interview - Stories - Home Block Party](https://www.notion.so/powerfoxmedia/UGC-Interview-Stories-Home-Block-Party-39516771e78081e894fbe89bdc7ff7bb) (Home – Forms, 8 videos)
**Shipped:** V1 Old Black Men (4 clips) · V2 Old Black Women (4) · V3 Old White Men (3) · V4 Old White Women (3) · V5 MA Black Men (4) · V6 MA Black Women (4) · V7 MA White Men (3) · V8 MA White Women (3) — 28 approved clips, every joint gated, Black-voice scripts on V1/2/5/6 ending in the host↔OG negotiate exchange + $550 lander flash, White-voice on V3/4/7/8 ending in the "One site… Links below" close + $470 flash.

## Gotchas index (each cost real gens — encode ALL of these)
- Describe the seam from LOOKING at it (push-in vs reveal) — ~10 gens
- Drop the wide-crop medias when destination is already in the start image — the references fight
- Walk-ins fail on conversational-distance wides — use gentle push
- Full wide as medias = model crams all N people into the pan and duplicates the leftmost — crop to destinations only
- Text-only roster locks do nothing; scoped image refs are the mechanism
- Short line + long duration = doubled line / rogue tail — physical closer + tight duration
- Props materialize without a scripted source; held items vanish without a "stays in hand" clause
- Passerby crossing frame kills takes — "space between camera and cast stays EMPTY"
- Stiff openers: "ALREADY mid-conversation, chuckling, gesturing" + chatter dies as host cuts in
- Motion-inflated gate numbers (20–24) on lively seams = examine before refiring
- Whisper-base garbles rates — use small model + editor ear-pass; "seven-ten" transcribes as "711"
- NY cuts need the synthetic-performers disclaimer (`add-ai-disclaimer`)
- Double-backgrounding fire scripts orphans the loop and eats the log — one clean background bash per loop; artifacts in scratchpad are the fallback record

## Round 2 lessons — Auto Car Meet testbed (2026-07-09, V7 shipped 4/4 joints gated 10.6–14.0)
The method transferred to a second vertical (Auto – Forms, monthly rates, car-meet setting) with six NEW rules, all gen-proven:
1. **AUDIO is a continuity surface.** Name the ambience bed positively in EVERY clip ("constant low location murmur — distant chatter, far-off engine idle, breeze over the mic — never going silent"); only negative the conflict sounds (close revs, horns, spikes), never room tone. A dead-silent outdoor clip is an instant editor reject, and per-clip invented soundscapes make pixel-clean joints audible.
2. **MOTION is a continuity surface.** No still-to-whip-pan joints: every clip ending keeps "constant subtle handheld sway, never perfectly static" (breathing tail); every next clip opens "camera HOLDS with gentle sway for a beat, then eases into the pan, starting slow and accelerating like a person turning" (eased head). Sway→sway across the cut.
3. **Style rides the seam.** A hazy/dreamy take infects every downstream clip via the chain. Anti-haze stack in the prompt (positive "air perfectly CLEAR, image SHARP" + no haze/fog/bloom/glow/soft-focus negatives) — and consider de-hazing the seam PNG locally before firing the next clip.
4. **Identity refs have a sharp on/off rule.** A far-position cast member whose only signal is a thumbnail crop mutates every take — fix with a full-res face crop from approved footage as a medias ref ("his FACE must match the reference EXACTLY"). But DROP that ref the instant the face is already in the start image — it becomes a competing framing + style bleed (32/41 gate fails → 13.7 first try on removal). Ref to INTRODUCE a face; seam carries it after.
5. **Dead tails cost zero gens.** Don't refire a good clip for a sluggish ending — pick the next seam at the intended TRIM point and hand the editor the timecode; tail dead-time disappears at the join.
6. **Wide staging craft:** panoramic background demands steal camera height (describe background as "glimpses" to keep the lens at chest level); explicitly kill lighting drama (flat overcast/plain blue) or the wide reads staged; location clutter (tool chests, coolers, chairs) is what makes it read like a real event. NB Pro edit passes handle sky swaps/prop moves without touching faces.

**Per-demographic adaptation covers PROPS/SET, not just voice (Zach, 2026-07-09):** each demographic version adapts the script's named items AND the wide's set dressing (e.g. car types at a car meet) to fit the cast — same structure, same rates, same beats.

## Round 2 final lessons (Car Meet full 8-way shipped 2026-07-10 — 32 clips)
7. **Wardrobe collisions melt identity.** If the seam contains a person dressed like the next clip's destination (two camel trenches), the pan produces re-stages (gates 50-60), mid-shot face/hair morphs, teleporting people — structural, refires won't fix. Fix: the EMPTY-BEAT PAN ("she slides out of the left of frame; for a brief moment the frame shows only the car's bodywork — no people; then the camera settles on a COMPLETELY DIFFERENT woman") + describe the destination by her DIFFERENTIATORS + anti-morph negatives. Prevention: keep signature outfits unique per cast member at wide time.
8. **Describe the CAST from the render, not the wide's prompt.** NB renders drift ("curly afro" prompt → sunglasses + pulled-back hair render); describing a destination from prompt text makes the video model invent a person matching the words and SKIP the real one. Every destination description comes from looking at the pixels.
9. **Proper nouns are voice traps.** "Tahoe" mispronounced across three takes (director notes AND phonetic respell both lost); "Grand Marquis"/"Infiniti"/"Chevelle" all garble-prone. Cheapest fix: swap to a word the engine can say ("Yukon" landed first try) — editor's call since it's a script change. Ear-check every fancy proper noun.
10. **Phone screens need a content lock.** "EXACTLY the webpage from the reference" alone still garbles; name the actual elements ("SaveMaxAuto header, the large $59/month, the blue Claim Now button — SHARP, STEADY, square to camera") + no-blur/no-garble/no-invented-interface negatives. Small print will still garble at 720p — that ceiling is a post screen-comp, not another roll.
11. **On-camera speaker voices re-roll every take.** A character's C4 voice can clash with her C3 voice; no prompt lever reliably clones timbre. Re-roll until close, or conform in post with labs-voice-swap (same line = timing/lip-sync carries).
12. **Scan transitions at 2fps.** A mid-clip jump can hide between 1fps tiles AND clean endpoint gates — after any "random transition" reject, strip at fps=2 and confirm the travel is contiguous frame-to-frame before presenting.

## Why a skill (vs a one-off)
The no-cuts one-take is now a boss-requested house capability. It took ~2 days and dozens of burned gens to derive the method; encoded as a skill, any editor gets the whole pipeline — script fidelity, wide staging, seam chaining, self-gating fires, dead-air control, prop logic, QC gates — on the first try, for any setting, any vertical, any demographic matrix.
