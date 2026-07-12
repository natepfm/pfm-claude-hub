---
name: reskin-trending-video
description: Reskin or "copy" a trending/reference video into a brand-safe AI video generation prompt that swaps the original subject for a brand mascot or character. Use this whenever the user uploads or links a reference clip (TikTok, Reels, Shorts, a trend, a competitor ad, any video) and wants to recreate it with their own character — phrases like "reskin this", "copy this video", "make a version of this trend with Max", "swap the guy for our mascot", "do this but with our character", "recreate this ad", "use this as a reference for a Seedance/Kling prompt". Also trigger when the user pastes a video and asks what's in it before reskinning, or asks whether to use Seedance vs Kling Motion Control for carrying a reference over. Always use this skill before writing a reskin prompt so the reference gets inspected, the right engine gets chosen, and IP/brand-safety pitfalls (watermarks, real plates/PII, vapes/alcohol, recognizable IP) get caught. NOT for: a fresh video prompt with no reference clip (use ugc-cinematic-prompt directly), one-off CLI fires (higgsfield-image-generation), or full gated Veo batches (hvg-flow).
---

# Reskin Trending Video

Turn a reference clip into a brand-safe generation prompt that keeps the trend's structure and pacing while swapping the original subject for the user's character/mascot. The output is a ready-to-run prompt (Seedance 11-block by default), plus a post-production plan for the parts a generator can't render cleanly.

This skill **orchestrates the workflow**. For the actual Seedance block format, **defer to the `ugc-cinematic-prompt` skill** — invoke it for the prompt body rather than reinventing the 11 blocks here. This skill's job is everything *around* the body: inspecting the ref, picking the engine, deciding the references + exclusions, and the post-pro plan.

## The loop

1. Inspect the reference (don't skip — describe it back before prompting).
2. Capture intent: what stays, what changes, where the character goes, what it does.
3. Pick the engine: Seedance vs Kling Motion Control.
4. Write the prompt (via `ugc-cinematic-prompt`) with a REFERENCES block + exclusions baked in.
5. Hand over the post-production plan for what won't render (UI, screens, small text, multi-scene cuts).
6. Iterate on beats/timing/gestures; keep character tokens stable.
7. Optional — fire it via the Higgsfield CLI.

---

## Step 1 — Inspect the reference

Never prompt from a clip you haven't actually looked at. Run the bundled script to get metadata, frames, and a single contact sheet, then **Read** the contact sheet:

```bash
bash ~/.claude/skills/reskin-trending-video/scripts/inspect_video.sh "/path/to/<clip>.mp4" "<session scratchpad dir>/vidinspect"
```

(Use the session's scratchpad directory from the system prompt as the output location — not `/tmp`.)

Then **Read** `<session scratchpad dir>/vidinspect/contact_sheet.jpg` (if `montage`/ImageMagick isn't installed, Read the individual frames in `<session scratchpad dir>/vidinspect/frames/`).

Describe the clip back to the user in plain terms: the beat structure (e.g. "establish → cut to phone → cut back → reveal"), what's in frame, the energy/joke, and — critically — flag every **problem element** you spot, because these decide the prompt's exclusions and the engine choice:

- **Watermarks / platform logos** (TikTok bug, bouncing handle, end cards). Note if fixed-corner (croppable) or bouncing (not cleanly removable).
- **Real PII / specifics**: license plates, addresses, names, phone numbers, app screens with real data.
- **Brand-unsafe objects**: vapes/e-cigs, cigarettes, smoke, alcohol, drinks, drugs, anything a regulated brand (insurance, finance, health) can't be near.
- **Recognizable IP / real people**: copyrighted characters, branded footage, identifiable individuals.
- **Subject body type**: human, animal, object — matters for engine choice and for whether a gesture maps onto the character.
- **Multi-subject interactions**: daps, handoffs, two people talking — these constrain the approach (see single-subject trick below).

Then ask what they want to do. Don't write the prompt yet.

---

## Step 2 — Capture intent

A reskin keeps the *structure* and swaps the *subject*. Pin down:

- **What stays**: the beat order, pacing, framing, the joke mechanic.
- **What changes**: which subject becomes the character, and where (driver's seat, hood, leaning out a window).
- **What the character does**: the specific action per beat. Get this concrete — "chill head nod then a dap" beats "be funny".
- **Duration**: match the usable length of the ref. **Seedance 2.0 caps at 15 seconds** — if the ref is longer, the reskin is a 15s-or-under slice (or splits into shots — see post-pro). When the user adds beats (a walk-off, an extra reveal), bump the duration so it doesn't get crammed — call this out.

---

## Step 3 — Pick the engine

The deciding question: **does the user need the literal motion carried over, or just the concept/structure/vibe?**

Both engines run on Higgsfield (job-set-types `seedance_2_0` / `kling3_0` — see `hvg-flow/refs/model-lineup.md`), so testing either is cheap.

**Seedance — the default for reskins.** A generative, identity-driven model. It holds a character from reference stills and recreates a *concept* rather than copying exact choreography. Choose Seedance when:
- The action is describable in words (sitting, leaning, nodding, reacting).
- The subject changes body type (human → dog): a generator re-stages it naturally instead of mismapping a skeleton.
- The beat involves **two subjects** (dap, handoff, conversation) — motion-transfer tools are single-subject, so interactions must be generated, not transferred.
- The user wants freedom to reroll and isn't wedded to frame-exact movement.

**Kling Motion Control — only for literal motion transfer.** It extracts a reference video's actual movement (limb angles, weight shifts, timing) and maps it frame-by-frame onto one character image, letting you change the environment via prompt. Choose it only when:
- The user needs *exact* choreography (a specific dance, a precise performance) that's hard to describe but easy to show.
- The motion maps onto a **similar skeleton** (human ref → human-presenting character). Human → quadruped maps badly.
- It's a **single subject**, full body visible, steady moderate movement, **no hard cuts** in the ref.

If the ref has cuts, multiple subjects, or a body-type mismatch, Motion Control will choke — route to Seedance. State the recommendation and the one-line why; don't make the user guess.

---

## Step 4 — Write the prompt

**Invoke `ugc-cinematic-prompt` for the 11-block Seedance body.** On top of that, a reskin needs two things the base format doesn't emphasize — add them to / around the body:

### A REFERENCES block at the very top

Make the role of every input explicit, because the #1 reskin failure is the model copying the ref's watermark/text/subject instead of just its timing:

```
REFERENCES
Character references (visual, must match exactly): @CHAR_A, @CHAR_B, ...
  These define the character's appearance (and any in-scene photo of them).
Motion and pacing reference only: @SOURCE_CLIP — use ONLY for shot timing,
  beat structure, and framing. Do NOT copy its visual content; do NOT reproduce
  any watermark, on-screen text, app UI, license plate, address, logo, or the
  original human/subject. The subject is <CHARACTER>, not the person in the reference.
```

**Critical setup note to pass to the user:** for a clip with a watermark or real PII, do *not* feed it as a heavy *visual* reference — only as motion/pacing. Character stills are the visual truth. If their tool has only one combined reference slot, lean on the stills and keep the clip out as a visual input, using it just to eyeball timing. Trim platform end cards/outros off the ref first (see snippet below).

### Exclusions, spread across blocks (not just one line)

Negative phrasing in a positive-description model isn't a guarantee, and one mention is easy to miss — so repeat the key exclusions across STYLE, ENVIRONMENT, CHARACTER, and PHYSICS. Standard set:
- `no watermarks, no on-screen text, no captions, no platform UI, no logos burned into frame`
- For brand-unsafe objects seen in the ref: name them explicitly as absent and state the character's hands/paws stay empty, and call out where junk creeps in (cup holders, console, table).
- Tell the user negative prompts can backfire (occasionally make the model fixate on the excluded object); the reliable fix for a bad render is a reroll.

### PFM brand-safety overlay (for PFM creative work)

When the reskin is for a PFM ad (insurance / finance / home), the IP/brand-safety pass above stacks **on top of** PFM's standing creative rules — apply both:
- **No carrier or brand names/logos** (State Farm, Progressive, Geico, Allstate, Walmart, etc.), **no celebrities, no political figures, no government imagery.**
- **"Could save," never "will save."** No "program" language. "Free" only for a free quote/signup.
- If the reskin implies an authority figure, keep them **outside the carrier/agent space** (never "insurance agent").

Full rules: `6. Claude PFM/CLAUDE.md`. (Non-PFM / generic reskins: skip this overlay — only the IP/watermark/PII pass applies.)

### The single-subject interaction trick

When the trend has a two-person beat (dap, fist bump, handoff) but you want one character, keep it single-subject: have **a hand/fist enter from the frame edge** to meet the character, with the other person off-camera. This reads as the interaction without the two-character rendering mess. A "no-look" version (character doesn't break its gaze/pose) often plays funnier and is easier to render.

Trim a platform end card / outro off the reference:

```bash
ffmpeg -v error -y -i in.mp4 -t <usable_seconds> -c:v libx264 -crf 18 -preset veryfast -c:a aac out_trimmed.mp4
```

---

## Step 5 — Post-production plan

Generators have known blind spots. Don't oversell a one-take result — hand over the plan:

- **Phone screens / app UI / small text**: rendered as illegible mush. If the punchline depends on a screen (an app showing the character's photo, a match reveal), generate the shot with the device in hand, then **composite a real screenshot in post**. Offer to build that graphic (e.g. a clean fake app screen with the character's photo dropped in).
- **Multi-scene single generations** (exterior → interior → walking POV in one clip): the more hard cuts, the more unstable one pass gets. Offer to **split into separate shots and stitch** in the edit (also the move when the trend is longer than Seedance's 15s cap).
- **Trending audio**: keep the prompt's audio generic/diegetic so nothing copyrighted bakes in; the user lays the trend sound on top in post. If they'll swap audio, make it dialogue-free (and if the character "speaks", note mouth-closed so there's no lip flap to fight).

---

## Step 6 — Iterate

Reskins are conversational. Common adjustments and how to handle them:
- "Move the beat later / earlier" → shift it in the TIME STAMPS and the relevant block; re-check total duration.
- "Add an ending (walk-off, second reveal)" → add the beat and **bump duration**; flag if it now needs splitting into shots.
- "Drop the dialogue / no 'sup'" → make it pure gesture, mouth closed, dialogue-free; note audio gets swapped in post.
- "Remove X object" → add it to the exclusion set across blocks.
Keep the same character tokens across every revision and across a series (Part 1 / Part 2) so the character, vehicle, and styling stay consistent.

---

## Step 7 — Optional: fire it (Higgsfield CLI)

**The prompt is the deliverable.** Once it's locked, offer to fire it — don't auto-fire. If the editor says yes, run it through the Higgsfield **CLI**, never the UI (PFM thesis: CLI for firing; the Higgsfield MCP is read-only inspection only — see `higgsfield-image-generation` and memory `feedback_higgsfield_workflow.md`).

- **Seedance** → `seedance_2_0`. **Kling Motion Control** → `kling3_0` (no underscore). Default **count=1**.
- Verified model IDs, costs, Kling params (`mode: pro|std`, `duration`, `sound`), and aspect-ratio defaults → `hvg-flow/refs/model-lineup.md`. **Verify against the live CLI** (`higgsfield model list`) before firing.
- Download into the editor's project folder with PFM filename conventions (unique 4-char hex suffix so DaVinci doesn't auto-group). Follow the download + naming rules in `higgsfield-image-generation`.

---

## Output shape

Deliver: (1) a short read-back of the ref with flagged problem elements, (2) the engine pick with a one-line why, (3) the full prompt in a fenced block (built via `ugc-cinematic-prompt`, with the REFERENCES block + exclusions), (4) which reference tokens to load and their roles, (5) the post-production plan and any offer to build composite assets, (6) the optional CLI fire offer. Keep prose tight; the prompt is the deliverable.

## Cross-references

- **Prompt body format (the 11 blocks)** → `ugc-cinematic-prompt`
- **Model lineup / costs / CLI flags** → `hvg-flow/refs/model-lineup.md`
- **Higgsfield CLI firing + download conventions** → `higgsfield-image-generation`
- **PFM creative rules** → `6. Claude PFM/CLAUDE.md`
