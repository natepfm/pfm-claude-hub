---
name: podcast-guest-veo
description: PFM's locked voice + audio treatment for PODCAST-GUEST Veo master prompts — the single-narrator-on-a-podcast-set talking head (Discount Pod Guy, Gavin Hollis, Jason Whitaker class). Use whenever an editor writes or revises a Veo master for a podcast creative, says "podcast prompt", "podcast master", "podcast voice", "fix the podcast audio", "the audio sounds off on the podcast clips", hands over a raw JSON prompt for a podcast character, or a staging flow (stage-request / hvg-flow) needs a NEW podcast-guest master built. Encodes the v2 audio treatment validated on the Car Chase Podcast Roku Calls A/B (2026-06-11): voice-lock discipline, the voice-only/close/dry/clean audio block with a NAMED dead-quiet studio (no ambient vacuum), cold-open + clean-finish performance timing (no instructed end pause), and the full podcast audio negative stack (off-screen host voice, audience, echo/reverb, musical tails). NOT for: UGC phone-on-a-stand talking heads (ugc-talking-head-veo — different audio spec), news-segment/anchor work (feedback_veo_news_segment_music_bleed conventions), writing the script itself (veo-script-writing / lc-to-video-podcast), or firing batches (hvg-flow / AGF).
---

# Podcast Guest — Veo voice + audio treatment

How to write (or repair) the Veo master prompt for a **podcast-guest talking head**: one narrator, seated on a podcast set, broadcast mic in frame, telling a story straight to camera. Locked 2026-06-11 after a controlled A/B on Car Chase Podcast Roku Calls — v01 (no audio block) vs v02 (this treatment) — editor-confirmed better.

## Why podcast prompts break differently

A podcast frame *implies* things Veo will happily render into the AUDIO unless told otherwise: a host (off-screen "mm-hm"s, chuckles, crosstalk), a room (echo, reverb off the curtain wall, hiss), a show (intro stings, bed music, musical tails), and "realism" requests it over-delivers (mouth clicks, lip smacks). The fix is never "no audio" or "ONLY voice" — blanket negation creates the **ambient vacuum** Veo fills unpredictably. The fix is a **named, benign, non-musical environment** plus targeted negatives.

## The six locked rules

### 1. Voice lock — verbatim, STRICT, never paraphrased

The editor's voice description IS the character. Carry it as a `voice_lock` block in the master JSON (`character_id`, `consistency: STRICT`, `do_not_drift: true`, `voice_description` verbatim) and fold the same description word-for-word into the prose template. Every clip in the project uses the IDENTICAL voice wording — copy-paste, don't paraphrase; paraphrase = drift. If no voice lock exists yet (new character), draft one, flag it as NEW in the master's `derived_from`, and get the editor's ear on the first clips before a batch.

### 2. The audio block — voice-only, close/dry/clean, NAMED quiet environment

Every podcast master prompt carries this sentence pair (adapted to the character) after the dialogue:

> Audio: only his voice, captured close, dry and clean by the broadcast microphone in the acoustically dead, silent podcast studio, with light natural breaths between phrases. No other sound: no music, no off-screen host voice, no audience, no echo or reverb, no sound effects.

- The studio is **named** ("acoustically dead, silent podcast studio") — that's the anti-vacuum move.
- "close, dry and clean" describes the capture, not a mic *character* (don't ask for "radio processing" / "podcast EQ" — processing requests create artifacts).
- **Light natural breaths YES; "mouth sounds" NEVER** — "subtle breath and mouth sounds for realism" reads harmless and delivers clicks/smacks. Strip "mouth sounds" from any editor-supplied prompt.
- Bed music is an EDIT-time asset (the OG projects keep a Podcast Background Music folder) — gens ship music-free, always.

### 3. Performance timing — cold open, clean finish, NO instructed end pause

> He is already speaking as the clip begins, his first word landing on frame one with no wind-up, and he finishes his final word cleanly and simply holds his warm expression to the end of the clip.

- Cold open kills the auto-generated intro sting (same mechanism as the UGC + news fixes).
- **Never instruct a pause after the final word** ("small pause after speaking" is a common editor-JSON line) — instructed end silence is dead air Veo fills with musical tails and murmurs. The hold is VISUAL (expression), not audio. Editors trim tails in the cut.

### 4. The podcast audio negative stack (append to the master's negatives)

```
no background music, no musical sting, no score intro, no music swell at cold open, no musical tail, no music at the end of the clip, no silent pre-roll, no breath-in pre-roll pause, no off-screen host voice, no second voice, no interviewer voice, no crosstalk, no audience, no laughter, no applause, no crowd noise, no echo, no reverb, no roomy sound, no room hiss, no sound effects, no foley, no mouth clicks, no lip smacks
```

The host/audience group is podcast-specific — UGC and news stacks don't carry it, and it's exactly what the guest framing invites.

### 5. Delivery texture — conversational, NEVER commercial (Sam, 2026-06-11: "too commercially sounding")

Performance adjectives like "energetic", "authority", "speaks directly" read as PITCHMAN direction to Veo — and on mechanism/CTA lines (where the copy itself is salesy: "Here's why X is special…", "Call before they close…") the model doubles down into a radio-ad read. The performance block must pull AGAINST the salesy copy:

> He looks into the camera with a relaxed, conversational podcast-guest delivery, … unhurried, like he is telling a story to a friend across the table, thinking as he talks, with natural storytelling pauses and small imperfections in his phrasing rhythm. Even when he explains or recommends something, his read stays casual and offhand, a guy sharing what happened, never a sales pitch, never an advertisement read.

And the negative stack carries: `no commercial voiceover tone, no announcer cadence, no pitchman delivery, no radio-ad energy, no punched-up salesy emphasis, no advertisement read`.

A voice lock that says "energetic / speaks with authority" describes the CHARACTER's voice, not the read — keep the accent/age/warmth, redirect the energy into conversational storytelling. The brand lines are exactly where this matters most; QC them first when reviewing a batch.

### 6. Editor-supplied JSON prompts get NORMALIZED, never fired raw

Editors hand over raw JSON prompts (voice_lock / camera / performance / audio blocks). Keep every block's **content**, but restructure: config rides in the master JSON wrapper; the actual Veo prompt is the house **prose** template with `{LINE}`. Raw JSON-as-prompt hit 83% NSFW on the Karen HOA family and the CLI rejects leading-`{` prompts. While normalizing, apply rules 2–5 (this is where "mouth sounds", "end with a small pause", and pitchman performance adjectives get caught).

## Master config (locked defaults)

- `veo3_1_lite` + `--generate_audio true` (12 cr/clip) · 8s · count=1 per line
- 16:9 for CTV cuts, 9:16 for social
- Single shared ref, frame-to-video `--image <UUID>` (no D-lock — natural seated motion is wanted), ref under 2000px
- Locked camera ("Locked camera, no movement, framing and set matching the reference image exactly"), minimal gestures, facial-driven, precise lip sync
- Continuity negatives ride along (identity drift, wardrobe/environment/lighting change, second person, warped headphones/mic/glasses, UI/text/chyron stack)

## Reference build (validated example)

`06.11.26 - Car Chase Podcast Roku CTV Calls/Elements/Prompts/car_chase_podcast_roku_calls_master.json` — the v2 master this skill locks. Character: Discount Pod Guy (Podcast Father), voice_lock `HOME_EVICTION___PODCAST_STATE_V1` ("50 year old, Boston accent, friendly, speaks with authority, energetic"). Its `master_prompt_template` is the copy-adapt starting point for any new podcast-guest master. Per-character templates live in the Prompts Library (`1. PFM Media Assets/AI Generation Assets - PFM/Prompts Library/`) — check it before re-deriving, add new characters to it after locking.

## A/B test discipline (how this got locked)

When an editor flags audio quality on a delivered batch: audit the master against rules 2–4, fix, refire a 2–3 clip test as the next `_vNN` (never overwrite — per-line next-version naming; a line may already have a QC-refire v02), editor listens against the prior version, then refire the remainder on their go. Don't refire a full batch on an unvalidated prompt change.

## Cross-references

- `ugc-talking-head-veo` — the UGC sibling (phone-on-a-stand look); its audio spec differs, don't mix the two
- `lc-to-video-podcast` / `veo-script-writing` — produce the script this consumes
- `stage-request` / `hvg-flow` — the flows that consume the master this skill writes
- Memory: `feedback_veo_audio_artifacts` (UGC scope), `feedback_veo_news_segment_music_bleed` (news scope — the named-ambient principle), `feedback_veo_json_cinemagraph_nsfw_risk`, `feedback_regen_no_overwrite`
