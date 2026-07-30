# V2 bounded-chain method — craft, evidence, and the drift ledger

Companion to `SKILL.md`. Read before the first V2 run.

---

## 1. The evidence this method is built on

Two write-ups from Mitchell Gamache, three days apart, same no-cuts chain, different verticals:

- **Auto Block Party British** — 07.24.26 (Auto – Forms, 4×6 clips)
- **SPANISH Home Baby Shower** — 07.27.26 (Home – Forms, 4×6 clips, 44 rolls → 24 finals)

### The drift ledger — what recurred, and why it recurred

| Drift class | Solved 07-24 | Re-hit 07-27 | Root cause | V2 disposition |
|---|---|---|---|---|
| Full wide as ref → crowd / extra people crammed in | "crop the wide to just the destinations" | ✅ hallucinated **men into an all-women cast**, swapped the house | destination described in prose, not given in pixels | **eliminated** — end frame IS the destination |
| Destination not in the seam → model guesses position | "cropped-wide destinations ref anchors position + identity" | ✅ blind pans, **15 rolls on one clip** | blind pan | **eliminated** |
| Wrong speaker delivers the line | disambiguate both directions | ✅ pan overshot P4 | no terminus | **eliminated** |
| Camera wanders / pans the wrong way | "name the direction AND the stop" | ✅ panned LEFT twice, wandered once | verbal direction, no coordinate system | **eliminated** |
| Seam re-stage | "describe from the ACTUAL seam, never an idealized frame" | ✅ V1 c06 opened on a close-up off a byte-identical seam | prompt led with character, not shot size | gate catches; start frame + shot-size lead |
| Off-camera host line mouthed on screen | off-camera-host lock | ✅ same bug, re-derived | generic negative too weak | **stochastic** — name the person by Outfit ID |
| Mid-clip jump cut | 🔴 **"1fps strips MISS it — scan at 2–3fps"** | ✅ hit again; the later write-up **reverted to `fps=1`** | QC blind spot | gate uses ffmpeg's **native scene detector** — every frame, exact timestamps (clean 0.023 vs real cut 0.252) |
| Clone / repeated faces | describe cast from the RENDER, not the prompt | ✅ V4 women too alike; V2 women cloned the parent's archetypes | identity carried as prose | plate + Outfit IDs + divergence check |

**The finding that matters more than any single fix:** five classes were solved on 07-24 and re-hit on
07-27 *by the same editor*. V1's fixes are prose lessons in a playbook. Prose does not survive three
days. **Every V2 guard that can be mechanical is mechanical** — that is the whole design constraint.

---

## 2. Planning camera positions

For a K-clip chain you need **K+1 positions**. Clip *n* runs `pos(n-1) → pos(n)`.

Standard 6-clip interview:

| Clip | Start → End | Beat |
|---|---|---|
| c01 | pos00 → pos01 | host opener + P1 |
| c02 | pos01 → pos02 | travel to P2 |
| c03 | pos02 → pos03 | travel to P3 |
| c04 | pos03 → pos04 | reveal P4 *(historically the killer — 34% of all rolls)* |
| c05 | pos04 → pos05 | closer / OG |
| c06 | pos05 → pos06 | group pull-back + phone CTA |

Rules for positions:

- **One hop per clip.** A position pair should cover 1–2 new speakers, never more. Two hops in one
  clip re-introduces ambiguity the end frame can't resolve.
- **Both endpoints must contain their speaker.** If pos04 doesn't show P4, the clip is still partly
  blind — regenerate the position, don't fire and hope.
- **Consecutive positions must share visible anchors** (a fence line, a table, the same three people
  at frame edge). Shared anchors are what let the model interpolate a real move instead of a cross-fade.
- **Any clip following a group-reveal pull-back opens on the WIDE.** Lead the prompt with shot size.
- **Editor-supplied frames are first-class.** A DaVinci frame grab from approved footage is a
  legitimate position — on 07-27 an editor grab solved a clip that had failed repeatedly, first try.
  V2 should *invite* these, not treat them as a fallback.

### The panorama variant (strongest geometry)

When positions must be exactly consistent: generate ONE wide panoramic plate containing the whole
cast line, crop 9:16 windows for each position, then NB-Pro-extend each crop back to full frame.

This is the **crop-then-extend** method (Mitchell, 07-27), originally derived to strip NB Pro's
letterbox bands — two prompt-based attempts to "fill the bands" failed because the model reads hard
band edges as image content and faithfully reproduces them. Deterministic crop, then extend, worked
immediately.

```python
# measure band rows by row-variance, crop to bandless content, then extend via NB Pro
import numpy as np
from PIL import Image
a = np.asarray(Image.open(src).convert("RGB")).astype(float)
rowvar = a.reshape(a.shape[0], -1).var(axis=1)
keep = np.where(rowvar > rowvar.max() * 0.02)[0]
Image.open(src).crop((0, int(keep[0]), a.shape[1], int(keep[-1]) + 1)).save(cropped)
```

**Prompting a model to remove its own letterbox is a losing game.** Same principle as bounded clips:
change the input, don't argue with the output.

---

## 3. Prompt template — bounded travel clip

```
Amateur vertical iPhone video, one continuous handheld shot, no cuts.

The camera travels continuously from the first frame to the last frame in ONE
unbroken move, eased at both ends — it holds with gentle sway for a beat, eases
into the move, and settles. Constant subtle handheld sway throughout, never
perfectly static.

<OUTFIT ID of speaker> says, on camera, lips synced, word for word:
"<VERBATIM LINE FROM THE REQUEST'S COPY SECTION>"

The host's question is OFF-CAMERA only. <OUTFIT ID of the person on screen>
does NOT say it, does NOT mouth it, does NOT move his lips at all during
"<host line>".

Everyone else is relaxed and alive — easy agreeing nods, warm little smiles,
shifting their weight, glancing between him and the camera. They are NOT stiff,
frozen, robotic or statue-like; they just do not SPEAK the line.

Air perfectly CLEAR, image SHARP. Warm afternoon backyard ambience, low chatter
and distant music under the dialogue.

Negative: jump cut, hard cut, splice, edit, snapping to a new framing, haze, fog,
bloom, soft focus, new or different people, passersby, text overlay, watermark.
```

**Do NOT add:** the destination description, the direction, "and STOPS there", reveal-vs-push-in
language, cropped-destination refs, or identity/scene guard stacks. With an end frame those don't
just waste tokens — they **fight the end frame**, exactly as V1 learned that a cropped-wide ref
fights a seam that already contains the face ("32/41 gate fails → 13.7 first try on removal").

---

## 4. The phone-screen closer (carried from V1, 07-24 — do not re-derive)

Feeding the lander PNG as a raw app-screen `--image` renders it **FULL-FRAME mid-clip** on roughly
1 in 3 fires, destroying the take. Prompting "stays small in hand" only partly helps.

**Structural fix — composite the lander into a small phone mockup first, and pass THAT.** The model
sees "a phone," not "a full-screen app."

```python
from PIL import Image, ImageDraw
W, H = 720, 1280
canvas = Image.new('RGB', (W, H), (232, 232, 236))          # plain gray margin = "small phone"
px0, py0, px1, py1 = 190, 280, 530, 1000                     # body well inside the frame
body = Image.new('RGB', (px1 - px0, py1 - py0), (12, 12, 14))
mask = Image.new('L', body.size, 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, body.size[0] - 1, body.size[1] - 1], radius=48, fill=255)
canvas.paste(body, (px0, py0), mask)
land = Image.open(LANDER).convert('RGB').resize((px1 - px0 - 24, py1 - py0 - 28))
canvas.paste(land, (px0 + 12, py0 + 14))
canvas.save(MOCKUP)
```

Fire the closer at **1080p `mode std`** with the mockup as `--image` alongside the bounded keyframes.
Keep the content lock in the prompt (name the actual elements — "the large $550/year, the button —
SHARP, STEADY, square to camera") plus no-blur / no-garble / no-invented-interface negatives. The
ref and the content lock work together, not instead of each other.

🔴 **It is never the editor's job to comp the screen in post.** Garbled screen = re-fire at 1080p.

Also: "raise the phone in ONE smooth motion, HOLD STEADY, no fumbling / wobbling / repositioning."

---

## 5. Job list example

```json
{
  "project": "07.27.26 - UGC Interview - SPANISH Home Baby Shower",
  "gen": {"model": "seedance_2_0", "resolution": "720p", "aspect": "9:16",
          "duration": 12, "estCostPerClip": 22.5},
  "outDir": "Elements/Footage/Veo/V4 - Middle-Age Hispanic Women - No Cuts",
  "clips": [
    {"clipId": "c04",
     "prompt": "Amateur vertical iPhone video, one continuous handheld shot…",
     "startImage": "Elements/Footage/Reference/V4 - No Cuts/pos03.png",
     "endImage":   "Elements/Footage/Reference/V4 - No Cuts/pos04.png",
     "refs": [], "duration": 12}
  ]
}
```

```bash
scripts/fire_bounded.py joblist.json --project-root "<project>"          # dry run
scripts/fire_bounded.py joblist.json --project-root "<project>" --fire   # spends
```

---

## 6. Model options

| Model | cr/clip | Notes |
|---|---|---|
| `seedance_2_0` | 22.5 | house default; 480p/720p/1080p/4k, `genre`, `bitrate_mode` |
| `seedance_2_0_mini` | 12.5 | cheap mechanic test; caps at 720p |
| `kling3_0` | 10 | fallback; `mode pro/std/4k` |
| `seedance1_5` | 4.8 | cheapest bounded test rung; duration 4/8/12 only |

`veo3_1` and `nano_banana_2` **reject** `--end-image` and cannot be used for bounded clips.

Validate any change without spending:

```bash
higgsfield generate cost seedance_2_0 --prompt "…" --start-image a.png --end-image b.png --json
```

---

## 7. Honest limits

- **The mechanic is validated, the result is not.** `--end-image` is accepted for `seedance_2_0` at
  the cost/validation layer. Whether the render visually honors the end frame is unproven until a
  live fire. Everything in §1's "eliminated" column is a **hypothesis** until that test lands.
- **Stochastic classes survive V2:** mid-clip jump cuts, accent slips, audio garble, off-camera
  lip-lock, dead tails. Budget re-rolls. Clean visual + bad audio → conform in post
  (`labs-voice-swap`), don't re-roll the visual dice.
- **Protect good takes over canonical perfection.** Twice on 07-27 the right call was *not*
  re-rolling — a patchable apron wordmark and a slightly long closer line the editor could smooth-cut.
  A compliant imperfection in a good take beats a dice-roll that may come back worse.
