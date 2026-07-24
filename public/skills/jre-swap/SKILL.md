---
name: jre-swap
description: >-
  Put a new PFM character onto an EXISTING JRE-style podcast set (red velvet curtain / SM7B
  mic / over-ear headphones) by RECREATING a locked reference frame and swapping only the
  person — not by describing a scene from scratch. You pass the existing JRE character's
  podcast reference image (the scene template — e.g. Blake Anderson's podcast master) plus
  the new character's identity reference(s), and the model recreates that exact frame with
  the new face. Use when an editor says "JRE swap", "put / get <character> on the JRE podcast / on the pod / on Joe Rogan",
  "swap the podcast character", "make the <new character> version of the <existing>
  podcast", or stages a character variation of an existing podcast creative (Christian Hall
  = a Blake Anderson swap). Guarantees the set / framing / solo composition match the parent
  exactly. Locked 2026-06-12 (Christian Hall build) after prose-generated placements drifted
  (host bleeding into frame, scene variance). TEAM (distributed; was local-only v1). NOT for: a
  brand-new podcast scene with no existing reference (use character-studio's podcast placement
  archetype), building the character master itself (pfm-character-master — spec or photo),
  or firing the Veo clips (hvg-flow).
---

# JRE Swap — recreate the locked podcast frame, swap only the person

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call runs `run_in_background: true` — fires, downloads, anything >30s. **3+ generations in one action = always backgrounded.** Foreground only for quick (<30s) utility calls whose stdout the next step needs (serial ref uploads → UUIDs). Report when the completion notification lands.

## Why this exists (the lesson that created it)

PFM's JRE-style podcast creatives (Blake Anderson, Sarah Herman, Barry Black — the red velvet curtain / SM7B / over-ear-headphones set) are shot as **solo** guests talking to an unseen host. When a new character needs the same set, generating that scene **from prose** drifts every time: a host's head bleeds into the foreground, the framing wanders, the curtain/mic/lighting shift. The fix Sam locked 2026-06-12 (Christian Hall build): **don't describe the scene — recreate the existing locked frame and swap only the person.** The set is guaranteed identical because it's the parent's actual reference image; only the identity changes.

This is the image-recreation counterpart to `character-studio` (the placement skill, which builds a placement from prose). When a locked JRE reference already exists (it almost always does for a variation), use THIS.

## The contract

You need two things:

1. **Scene-template ref** — the existing JRE character's podcast reference image (solo, locked). This is the frame to recreate.
2. **Identity ref(s)** — the new character's clean face: their character master (`pfm-character-master` — spec or photo mode) and/or clean likeness photos.

Output: a podcast placement still of the NEW character on the SAME set, solo, ready to feed Veo (`hvg-flow` / the AGF batch) as the `--image` reference.

## Step 1 — The scene-template ref

**DEFAULT (locked by Sam 2026-06-12) — the canonical JRE scene template:**
```
/Volumes/ads/PFM MEDIA MASTER FOLDER/1. PFM Media Assets/AI Generation Assets - PFM/AI Characters/JRE Characters/JRE Podcast - Master.png
```
This is THE reference for JRE podcasts. It has the **authentic, gritty, real-broadcast-capture look** — warm, slightly soft, natural skin texture — that the recreations need. Use it for every JRE swap unless the editor names a different scene template.

**Why not the parent's own podcast master:** the per-project AI masters (e.g. `Blake_Podcast_MASTER_*.png`) recreate **too clean / too polished** — Sam rejected the Blake-resized recreations as "too clean." The canonical `JRE Podcast - Master.png` carries the grit, so the swap inherits it.

Confirm it's **solo** (no host in frame) — that's the whole point; the recreation inherits the solo composition. Use a `_resized` variant only if a ref is >2000px (the model auto-resizes; the canonical is ~2MB so no resize needed).

## Step 2 — Get the new character's identity ref(s)

The new character's master (preferred — `pfm-character-master` builds it, spec or photo mode) and/or 1–2 clean likeness photos (a front-on headshot is the strongest single identity ref). Pass the cleanest face; a photo that already shows the target wardrobe (blazer + headphones) is a bonus — it locks wardrobe too.

If no master and no clean photo exist → this is a gap; build the master first (`pfm-character-master`).

## Step 3 — Fire the swap via the spine

**Model = `nano_banana_2` (NB Pro) — locked by Sam 2026-06-12.** NB Pro **preserves the source environment** (curtain / set / mic stay put) and renders the **gritty paused-video-frame look** far better than GPT Image 2. GPT (tested first on the Christian build) altered the curtain too much and came out "too clean / too polished, like a glossy photo" — Sam rejected it twice. NB Pro with the paused-YouTube-frame language nailed it. 16:9, 1k. **Default = ONE take (`count: 1`)** — additional takes only when the editor asks for them.

The fire mechanics are the shared **pipeline spine** (`~/.claude/skills/hig-flow/fire_batch.py`; contract in `hig-flow/PIPELINE-SPEC.md`) — it pre-uploads the refs serially, fires, streams each take, and serial-downloads with verify. Write a **one-shot job list** — the scene template is the FIRST ref, identity ref(s) follow (order matters; the spine passes `--image` in list order), `count: 1` (bump only on editor ask):

```json
{
  "project": { "name": "<Character> JRE Swap", "slug": "<char>_jre", "vertical": "..." },
  "gen": { "model": "nano_banana_2", "resolution": "1k", "count": 1, "aspect": "16:9" },
  "outDir": "Elements/Footage/Primary/Environment Placements/",
  "naming": "{char}_JRE_Swap_{v}_{hex}.png",
  "manifest": "none",
  "shots": [{
    "shotId": "<char>_jre_swap", "char": "<Character>",
    "refs": ["<CANONICAL_JRE_SCENE path>", "<identity ref path>"],
    "aspect": "16:9",
    "prompt": "<the paused-frame swap prompt below, verbatim>"
  }]
}
```

```bash
python3 ~/.claude/skills/hig-flow/fire_batch.py "$JOBLIST" --fire --project-root "$(pwd)"
```

It streams `LANDED <shot>_v01: <url>` the instant the take lands (v02/v03 lines only when the editor asked for extra takes) — **relay each to the editor the instant it prints** (Rule 5: 📲 CloudFront + widget, before download/QC/picks). (Bare, no `--fire`, dry-runs for a preflight.)

**The prompt shape (locked) — the north star is "a paused frame from a YouTube podcast video (with no UI)":**

> An extracted, paused frame from a YouTube podcast video — the kind of long-form podcast interview you would pause mid-stream. It must look like a real frozen frame from a streaming video, not a photograph.
>
> **Keep the EXACT same environment as the first reference image, completely unchanged** — same deep red velvet curtain backdrop, same warm podcast lighting, same desk, same camera angle and chest-up framing. Do NOT alter, redraw, or restyle the background or set.
>
> **CRITICAL — the microphone:** a large black foam-windscreen Shure SM7B podcast microphone on a boom arm, prominently in the FOREGROUND directly in front of them at chin height, big and close to camera, dominating the lower-center foreground. Match the mic's large size and foreground prominence from the first reference exactly — not small, not pushed aside, not missing. (NB Pro shrinks/drops the mic if you don't hard-call it.)
>
> Replace ONLY the person with the man/woman from the SECOND [and THIRD] reference image(s) — <NEW CHARACTER NAME>. Match their face/hair/[beard] exactly: <one-line identity>. Dress them in <scene wardrobe — e.g. navy blazer over open-collar white shirt> with over-ear black studio headphones on. Seated leaning slightly toward the mic, speaking mid-sentence, eyes off-camera-left to the unseen host, hands resting naturally.
>
> The whole frame has the authentic look of a paused YouTube podcast stream: natural video softness, slight motion blur, real video-compression texture, true-to-life imperfect lighting and skin, slightly lower contrast like a video still. NOT a sharp glossy photograph, NOT a studio portrait, NOT advertising-clean.
>
> **Solo shot — only this one person in frame, no host, no second person.**
>
> Negative: no missing/tiny microphone, **no YouTube interface, no UI, no play button, no progress bar, no scrubber, no video-player chrome, no timestamps, no view count, no subscribe button**, no on-screen text, no captions, no overlays, no watermarks, no logos, no second person, no host in frame, no glossy advertising photo, no studio-glamour lighting, no plastic over-smoothed skin, [brand-clean stack per `feedback_pfm_brand_clean_rules`], no celebrity face, no recognizable real podcaster.

**Four mandatory locks** (each a defect Sam hit on the Christian build, 2026-06-12):
1. **Solo** — no host / second person bleeding into frame.
2. **Stream-frame look** — "paused YouTube video frame," video softness/compression, NOT a glossy photo.
3. **Environment preserved** — curtain/set held from the canonical ref, not redrawn (the GPT failure mode).
4. **Mic prominent** — big SM7B foreground; NB Pro shrinks it without a hard call.

## Step 4 — Download (the spine handled it)

The spine already serial-downloaded the take(s) with verify+retry (parallel downloads race Lucid sync and drop files — `feedback_verify_veo_download_count`; lost 2/3 takes on the Christian build before this was locked) and named them `<Character>_JRE_Swap_v<NN>_<hex>.png` (unique hex per file) in `Elements/Footage/Primary/Environment Placements/`.

## Step 5 — Offer QC (the editor decides)

Local fires are NEVER auto-QC'd. The take is already SHOWN (Rule 5) — after it lands, OFFER QC via a plain ask (AGF/mini keeps mandatory QC). The checklist when the editor takes the offer:
1. **Scene/environment** — curtain, set, framing, lighting preserved from the canonical ref (not redrawn)?
2. **Solo** — NO host / second person anywhere in frame? (the #1 reject reason)
3. **Stream-frame look** — reads as a paused YouTube video still (soft, video texture), NOT a glossy photo?
4. **Mic** — large SM7B prominent in the foreground (not shrunk, shifted, or missing)?
5. **Identity** — face/hair/beard match the new character's refs?

When a take misses: name the miss in one line, SHOW it, STOP — the refire (next v-number) is the editor's call, never self-initiated. Flag the stakes when relevant: a host-edge, drifted face, redrawn curtain, shrunken mic, or glossy-photo finish propagates into every downstream Veo clip.

## Step 6 — Deliver + downstream

- **Lucid handoff** — the spine printed 📁 path + 🔗 LinkYourFile + 🦊 From Claude rail drop on the fire; relay it (Hard Rule 2).
- The chosen swap still is **Veo-ready** — it becomes the `--image` reference for the podcast clips (`hvg-flow`, or the AGF batch for a staged request). Don't fire the clips here.
- If this swap was the blocking ref for a `/stage request` gap, the gap is now cleared — name this file as the character reference in the request's 🤖 section and (re-)stage.

## House rules

- **Model = `nano_banana_2` (NB Pro).** Preserves the environment + gives the gritty paused-stream-frame look; GPT Image 2 altered the curtain and rendered too clean (rejected). Recreation/edit, not from-prose.
- **Four locks** every fire: solo / stream-frame look / environment preserved / mic prominent.
- **Serial downloads** with verify+retry (Lucid race).
- **Canonical scene UUID first** in the `--image` order, identity ref(s) after.
- **No overwrite** — increment `v<NN>`; **unique hex** per PNG (DaVinci auto-group guard).
- **count=1, ONE take default** — additional takes only on editor ask.
- **CLI only**, pre-uploaded UUIDs, max_workers=16 if ever parallelized — MCP firing forbidden.

## Cross-references

- `pfm-character-master` — builds the new character's master (spec or photo mode) that feeds this as the identity ref.
- `character-studio` — the placement skill; its prose-podcast archetype is the fallback when NO existing JRE frame exists.
- `hvg-flow` — consumes the chosen swap still as the Veo `--image` for the podcast clips.
- Prompts Library: `Podcast Guest - Blake Anderson.md`, `LC-to-Video Podcast Host - Sarah Herman.md`, `Podcast Host - Barry Black.md` — existing JRE-set references / scene templates.
- Memory: `feedback_character_master_always_gpt_image_2`, `feedback_verify_veo_download_count`, `feedback_character_placement_one_ref_wins`, `feedback_pfm_brand_clean_rules`, `feedback_two_link_lucid_handoff`.
