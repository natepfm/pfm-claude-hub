---
name: ag.skit.continuous
description: >-
  PFM's CONTINUOUS-TAKE SKIT builder — rebuild a proven story ad as a ~2-minute AI skit with a
  recurring cast, using ONE master still per station and firing every clip in that station off it
  (never off the previous clip's frame). Use on: "continuous shot skit", "build a skit", "run the
  skit flow", "make this ad as a continuous take", or a request to remake a proven story ad as a
  skit with a recurring cast.
---

# ag.skit.continuous — station master-stills, not a seam chain

Born from **`08.03.26 - Skit - DMV Single Mom`** (Auto–Forms, 9:16, ~2:30, Seedance 2.0, ~3,869
credits over 2 days). Proposed by Mitch, 2026-08-04. The creative was built **both ways in one
project**, which is what settled the architecture — see [the method reference](references/station-master-method.md)
for the evidence, the worked example, and the full gotcha catalog.

## 🔴 PRE-FIRE CHECKLIST — read at the TOP, every run, no exceptions

Each law below is ALSO a refusal in `scripts/fire_skit_clip.py`, so skipping the read still can't
skip the law.

1. **One master still per STATION; every clip in that station fires off it.** Never off a prior
   clip's last frame. A station = one setting + one camera setup. Want camera variety inside a
   station? Build 2–3 master ANGLES — still stills, still no chaining.
2. **720p standard is the DEFAULT.** 1080p is exactly 2× the credits (135 vs 67.5 per 15s clip) and
   on the source build ~19 unnecessary 1080p fires cost ~1,300 credits — a THIRD of the project.
   The gate refuses `std_1080` without a `legibility_reason` on the clip.
3. **Seams are an OPTION for one beat that genuinely needs unbroken camera motion — never the
   spine.** A seam pulls from an already-darker, crunchier output, so quality compounds downward.
   The gate refuses a video-derived start frame unless the clip declares a `seam:` block with a
   reason AND the frame came through `make_seam.sh`.
4. **Outfit IDs paste VERBATIM into every prompt, and hard-lock through big gestures.** A phone
   flip / reach / turn is where Seedance drifts wardrobe — and that drift, not the child, was the
   real NSFW-upload trigger. The gate refuses a prompt missing any on-camera character's Outfit ID.
5. **Static-first.** Fixed camera, handheld shake only. A camera move is a deliberate per-clip
   purchase (`move_reason` required). Face-hiding moves (walk-away, follow-from-behind, OTS) are
   nearly free; moves that keep re-rendering FACES are where drift lives.
6. **ONE take per clip.** Video is 67.5 cr a fire; the two-takes-for-options habit doubles spend.
   Refire only on a real miss, with a reason code. Images may canary in small batches; video does not.
7. **Phone screens are HTML → headless Chrome, never diffusion.** `scripts/phone_lander.py`.
   Exact digits, $0, no "AI mush." Recreate the PROVEN SMA lander — don't design a new one.
8. **Off-camera VO by design.** Lip-sync cannot be trusted on this engine, so nothing on camera
   should have to sync. Narrator is POV; the clerk is behind glass; reveals are phone-CU.
9. **Refires land as the next `vN` IN PLACE.** Never overwrite, rename, or relocate a prior take.
10. **Stream every clip the instant it lands** (Rule 5) — 📲 + folder 📁/🔗 — before your QC read.
    **The editor stitches; Claude never assembles.**

## The spine

```
watch the reference (story AND set blocking)
  → clip map (verbatim dialogue → bounded clips, ~12–15s ceiling)
  → cast masters + Outfit IDs          [GPT Image 2; kids fire prose-only]
  → ONE master still per station        [NB Pro; cast composited into the locked plate]
  → phone screens                       [HTML → Chrome PNG]
  → fire every clip off its station master   [Seedance 2.0, 720p, static-first, one take]
  → editor stitches, comps screens + captions, exports, publishes the .drt
```

| Phase | What | Spend | Gate |
|---|---|---|---|
| 0 Map | watch reference · `CLIP-MAP.md` · scaffold project | 0 | editor reviews the map |
| 1 Cast | masters + Outfit IDs written FROM the renders | ~4 cr/master | editor stamps each master |
| 2 Stations | one master still per setting/camera setup | ~2 cr/still | editor locks the plate |
| 3 Screens | HTML landers (reveal + CTA) | 0 | editor approves the numbers |
| 4 Fire | canary one clip → roll the station | ~67.5 cr/clip | preflight + Fire? at ≥20 items |
| 5 Finish | editor stitch · captions · export · `/r.creative` | 0 | — |

Stage-gated, one beat at a time — never a one-shot pipeline. Show the result, then STOP.

## Canon — `Elements/Prompts/SKIT.yaml`

```yaml
skit:
  title: "DMV Single Mom"
  aspect: "9:16"
  vertical: "Auto - Forms"
  ny: false                    # true → the AI-performer disclaimer is required in the final cut

cast:
  MOM:
    master: Elements/Footage/Reference/DMV Mom Master/Mom_Master_v02.png
    outfit_id: |
      An early-30s woman, fair skin, dirty-blonde hair pulled back in a low ponytail...
  TODDLER:
    master: Elements/Footage/Reference/DMV Toddler Master/Toddler_Master.png
    upload_blocked: true       # photoreal young child — moderation refuses the upload; PROSE ONLY
    outfit_id: |
      A roughly 2-year-old girl with true toddler proportions...

stations:
  DMV_COUNTER:
    master_still: Elements/Footage/Reference/DMV Set Plates/DMV_Set_Plate_v02_t3_a9c6.png
  CAR_POV:
    master_still: Elements/Footage/Reference/DMV Car POV Plate/CarPOV_Plate_t3_trueP0V_HERO.png

clips:
  - id: clip01
    station: DMV_COUNTER
    move: static               # static | follow_behind | push_in | ots | pov_drift | custom
    duration: 15
    profile: std_720           # std_1080 requires legibility_reason
    generate_audio: true
    cast_on_camera: [MOM, TODDLER, DAUGHTER]
    image_refs: [MOM, DAUGHTER]      # upload_blocked cast may NOT appear here
    dialogue: "NARR (whisper): I'm at the counter next to this mom..."
    prompt: |
      <the shot prompt, with every on-camera Outfit ID pasted verbatim>
```

## Run it

```bash
python3 ~/.claude/skills/ag.skit.continuous/scripts/fire_skit_clip.py <SKIT.yaml> --clip clip01 --dry-run
python3 ~/.claude/skills/ag.skit.continuous/scripts/fire_skit_clip.py <SKIT.yaml> --clip clip01
python3 ~/.claude/skills/ag.skit.continuous/scripts/fire_skit_clip.py <SKIT.yaml> --clip clip01 --verdict pass
```

`--dry-run` proves every refusal and quotes the cost without spending. Output lands in
`Elements/Footage/Clips/<id>_v<NN>.mp4` with a `.json` provenance sidecar and an extracted
`_frame1.png`; state goes to `fired_pending_qc` — only the editor's word makes it a keeper.

Phone screens:

```bash
python3 ~/.claude/skills/ag.skit.continuous/scripts/phone_lander.py results \
  --rate 58 --out "Elements/Graphics/Phone Screens/lander_results_58.png"
python3 ~/.claude/skills/ag.skit.continuous/scripts/phone_lander.py cta \
  --rate 79 --saving 931 --out "Elements/Graphics/Phone Screens/lander_cta_79_931.png"
```

Optional seam helper (de-crunch only; the grade stays OFF because Sam grades in post):

```bash
~/.claude/skills/ag.skit.continuous/scripts/make_seam.sh <clip.mp4> <timestamp> <out.png>
```

## The prompt shape

The station master carries the world. The clip prompt carries what changes over time, plus the
identity blocks the plate can't guarantee:

```
SHOT       who is visible, framing, the exact starting state shown in the master still
ACTION     one continuous action, expression, body behaviour, and the dialogue
CAMERA     fixed (handheld shake only) — or the ONE declared move
AUDIO      dialogue, voice quality, ambience; state explicitly when there is no music
IDENTITY   every on-camera character's Outfit ID, verbatim, hard-locked through any gesture
PRESERVE   what must not change + what must not appear
```

Two wordings that are load-bearing, both learned the hard way:

- **Kill the ease-in.** Seedance opens slightly zoomed and settles onto the start frame, which reads
  as a zoom-out. Counter with: *"the very first frame is exactly the reference image; the camera does
  not start zoomed or reframed and settle onto it."*
- **Lock the top through the gesture.** *"stays in the white crew-neck t-shirt, no tank top, no bare
  shoulders, top never changes"* — in the prompt AND the negative.

## Known ceiling — say this out loud before anyone expects broadcast

Even done right: residual limb/baby morphing, no true lip-sync, background-crowd faces distort.
The source build landed ~5/10 on a blunt Gemini review. This ships as **performance creative**, not
broadcast-clean. The biggest quality levers are reducing on-hip toddler screen time and staging
prominent children beside the adult rather than clinging.

## Where it sits

`wr.request` / a proven ad → **`ag.skit.continuous`** → editor stitch (`e.assemble.*`) →
`e.timeline.export` → `/r.creative`.

## Not for

NOT for: UGC group interviews (`ugc-interview-flow-v2` — bounded clips off one plate, a static
interview LINE, not a narrative), multi-shot scene creatives that want a full canon state machine
(`ag.scene.flow` + `ag.storyboard` + `ag.clip.flow`), single talking heads (`ag.ugc.veo`,
`ag.pod.guest`), b-roll batches (the type skills), or any real shoot.
