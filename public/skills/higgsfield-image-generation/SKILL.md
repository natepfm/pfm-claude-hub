---
name: higgsfield-image-generation
description: Drive image generation through the Higgsfield MCP end-to-end — upload reference images, fire generations, poll for completion, and download results into the user's project folder. Use this whenever the user asks Claude to generate images directly via Higgsfield (rather than just write prompts to copy-paste), wants to fire off Nano Banana / Nano Banana Pro / NB Pro generations, asks for camera-roll b-roll for an ad, references the Higgsfield platform, or has the Higgsfield MCP tools available and wants Claude to actually run image generation rather than describe one. Triggers especially on requests like "generate this image", "fire off these prompts", "let's run this through Higgsfield", "make me a few variations", "another one of [character] but [variation]", or any ad-creative b-roll generation work where the Higgsfield MCP is the obvious tool. Pair with the iphone-cameraroll-prompting skill when the output should look like real phone snaps rather than studio shots.
---

# Higgsfield Image Generation

This skill drives the Higgsfield MCP to actually generate images, not just write prompts. If the user wants prompts they can copy-paste themselves into the Higgsfield UI, write the prompts and stop — this skill doesn't apply.

The Higgsfield MCP tools are namespaced `mcp__8e9e70fb-f82a-467f-bde0-e9daaeb5b439__*`. Key tools you'll use:

- `models_explore` — browse and recommend models
- `balance` — check credits
- `media_upload` — get presigned URLs to upload reference images
- `media_confirm` — finalize uploads after curl
- `generate_image` — fire generations
- `job_display` — poll for completion and get result URLs

For prompt craft (what to actually write in the `prompt` field), use the **iphone-cameraroll-prompting** skill alongside this one.

## Model lineup (the names are confusing)

The Higgsfield UI uses friendly names that don't match the MCP model IDs. This trips people up regularly:

| Higgsfield UI name | MCP `model` id | When to use |
|---|---|---|
| Nano Banana Pro | `nano_banana_2` | Default for ad b-roll. Highest quality, 4K capable, best text rendering. |
| Nano Banana 2 | `nano_banana_flash` | Fast variant, lower quality. Use only when explicitly asked. |
| Nano Banana | `nano_banana` | NB1 budget. Skip unless cost is an extreme constraint. |
| Soul Cast | `soul_cast` | Higgsfield's character-consistency specialist. Worth trying for character-locked work. |
| Soul 2 | `soul_2` | UGC-style realism. Good for portraits, fashion. |

**When the user says "NB2" or "Nano Banana 2" in conversation**, verify which they mean — many people use "NB2" loosely for whichever Nano Banana they're using. Default to `nano_banana_2` for podcast story ad b-roll unless they correct you.

## Cost reality (verified empirically)

At `nano_banana_2`:
- **1k resolution: ~2 credits per generation**
- **2k resolution: ~4-5 credits per generation**
- 4k: untested, presumably more

For camera-roll-style content, 1k is plenty — real iPhone snaps aren't pin-sharp. **Default to `params: {resolution: "1k"}`** unless the output is for hero placement that needs to hold up at high crops.

Always check `balance` at the start of a session and again after big batches so you can keep the user informed about runway.

## The full workflow

### Step 1: Plan the upload

Identify the reference images you'll need. For a typical ad b-roll generation, that's:
- A character master (e.g., the protagonist solo, the couple, the family)
- A shirt or wardrobe item to put on the character
- Optionally, a prior generation as a reference for character continuity (see "Image-as-reference trick" below)

Don't re-upload images that are already uploaded in this session. Track media IDs as you go — keep a mental ledger so you can reuse them.

### Step 2: Upload via presigned URL

```
mcp__8e9e70fb-f82a-467f-bde0-e9daaeb5b439__media_upload({
  method: "upload_url",
  files: [
    {filename: "ref-name.png", content_type: "image/png"},
    ...
  ]
})
```

Returns an array of `{upload_url, media_id, ...}`. Then run a Bash command with parallel curls to actually push the files up:

```bash
curl -X PUT -H "Content-Type: image/png" \
  --data-binary @"/full/path/to/ref.png" \
  '<presigned_url>' \
  -w "Name: %{http_code}\n" -s -o /dev/null &
# ...more curls...
wait
```

**Gotchas:**
- File paths with spaces must be double-quoted in the curl command. Always.
- Use `&` for parallel uploads, end the block with `wait` so the Bash call doesn't return until all uploads finish.
- Verify HTTP 200 on every curl. Anything else means the upload failed and the media_id won't resolve later.

After the curls succeed, call `media_confirm` with the `media_ids` array. The media is now usable in `generate_image`.

### Step 3: Fire the generation

```
mcp__8e9e70fb-f82a-467f-bde0-e9daaeb5b439__generate_image({
  model: "nano_banana_2",
  prompt: "...",
  aspect_ratio: "9:16",  // 9:16 vertical for camera-roll, 4:3 horizontal for landscape phone shots
  count: 2,  // 1 or 2 — count=2 occasionally returns only 1 result silently
  medias: [
    {value: "<media_id_or_prior_job_id>", role: "image"},
    {value: "<another_media_id>", role: "image"}
  ],
  params: {
    resolution: "1k"
  }
})
```

**Legacy nested params shape:** the `params.params.resolution` nesting looks redundant but it's the shape the MCP accepts. The response will include `adjustments.params.resolution` confirming the resolution was honored.

Returns an array of jobs with `id` and `status: "pending"`. Save those IDs immediately — you'll need them for polling.

### Step 4: Poll (don't spam)

Wait 20-25 seconds, then call `job_display` with the job IDs. NB Pro typically completes in 30-90 seconds. Don't poll more often than every ~20s — the platform docs say not to spam-poll.

```
mcp__8e9e70fb-f82a-467f-bde0-e9daaeb5b439__job_display({
  ids: ["job-uuid-1", "job-uuid-2"]
})
```

A completed job has `status: "completed"` and a `results.rawUrl` pointing at the full-resolution PNG.

**Sleep blocking gotcha:** Claude Code's Bash tool blocks `sleep N` for N >= 25, and blocks chained shorter sleeps. Use `sleep 20` standalone between polls. If you genuinely need longer waits, the Monitor tool with an `until` loop is the technically correct alternative, but it's rarely worth the setup for short polls — just call `job_display` again after another `sleep 20`.

### Step 5: Handle stuck and lost jobs

Two common failure modes worth knowing about:

**Stuck jobs:** It's common for one job in a `count: 2` call to hang in `in_progress` for 3-5 minutes while the other completes normally. The stuck one usually completes eventually. Don't poll it more than every 30s.

**Silently lost jobs:** Sometimes a `count: 2` call returns only one job ID in the response. The second was never queued. You'll only notice when you can't poll for the second variation because it doesn't exist.

If a job is stuck past ~3 minutes with no progress, or if you got back fewer job IDs than you asked for, fire a `count: 1` backup with the same prompt and references. Don't worry the user about this — it's a quirk of the platform. Quietly handle it and proceed.

### Step 6: Download results

`results.rawUrl` is a CloudFront URL serving the full PNG. Use Bash + curl to download into the user's project folder, parallel where possible:

```bash
cd "/path/to/project/B-Roll Photos"
curl -sSL "<rawUrl1>" -o "L14-Description-v1.png" -w "L14-v1: %{http_code}\n" &
curl -sSL "<rawUrl2>" -o "L14-Description-v2.png" -w "L14-v2: %{http_code}\n" &
wait
```

**Filename pattern for podcast story ad b-roll:** `LXX_short_description_vNN_<HEX>.png` (e.g. `L14_insurance_app_v01_a3f2.png`). Breakdown:
- `LXX` — script line tag so editors can grep by line later.
- `_short_description_` — human-readable scene slug.
- `_vNN` — take number (`v01`, `v02`, etc). If a line gets re-fired, increment (`v03`, `v04`) so prior versions aren't overwritten.
- `_<HEX>` — **required** unique 4-char lowercase hex tag (e.g. `a3f2`, `b7c1`, `9eee`) immediately before `.png`. **Every file in the same folder must have a unique hash.** This is non-optional.

**Why the hash matters:** DaVinci Resolve (Sam's editor) auto-groups files in the Media Pool when their filenames are identical except for a sequential number. Without the trailing hash, `L01_dad_register_v01.png` and `L01_dad_register_v02.png` get stacked into a single unusable "image sequence" clip. The unique trailing hex tag breaks the pattern so each file imports as an individual still. See memory `feedback_broll_filename_unique_hash.md` for the full rule.

**How to generate the hash during firing:** in the Python download script, track a set of used tags this session and append a random 4-char tag from `[0-9a-f]` to each file's name before `.png`. Skip files that already match the `_[a-f0-9]{4}\.png$` pattern (idempotent — won't double-tag on re-runs).

**Videos are exempt.** This rule applies to `.png` (and other still-image) downloads only. `.mp4` Veo clips keep their plain `_v01/_v02.mp4` versioning — Resolve doesn't auto-group video files the same way.

## Image-as-reference trick for character AND setting continuity

When the same element — a recurring guest character OR a recurring setting — needs to appear consistently across multiple shots, describing it by text alone is unreliable. Identities drift, kitchens get redrawn, parking lots come out as different parking lots. The model is doing a fresh interpretation each generation.

**The fix:** pass a prior generation (or any project shot containing the element) as a `medias` reference for the next shot. The model treats it as a lock and preserves whatever you point it at.

### For recurring guest characters

E.g., the wife when only the couple master exists, the son, "the Asian guy in the maroon fleece who showed up in the parking lot in shot 24."

Workflow:
1. Generate the first shot using whatever refs you have (character masters + shirts)
2. Once you have a result you like, download it
3. For the second shot, upload that downloaded image as a new reference (it counts as a normal media_id after upload + confirm)
4. In the prompt: "the same [character description] from reference image 1, just at a different angle / different moment / different framing"

Dramatically more reliable than re-describing a recurring character by text. Especially valuable for one-off characters introduced mid-script (the hardware-store guy, the neighbor with a dog, the woman in the next car at a red light) where you don't have a dedicated character master.

You can pass a prior generation's `id` (the job_id) directly in the `medias` array as `value` — no need to re-download and re-upload. But for clarity and persistence across sessions, downloading and uploading as a new ref is more durable.

### For recurring settings

E.g., the protagonist's kitchen, his driveway, the hardware-store parking lot, the inside of his truck cab. The model invents a new variation of any room or location on every generation if you only describe it in prose, even with detailed prompt language.

Same workflow as above, just pointing the reference at a setting instead of a person:
1. Pick an existing project shot that shows the setting clearly
2. Upload it as a media reference (or pass it by job_id if it was a Higgsfield gen)
3. In the prompt, name what the reference is for: *"Same exact kitchen as reference image 3 — preserve the kitchen environment precisely. Use reference image 3 ONLY for the kitchen environment, not for pose or expression."*

The "use reference X ONLY for [setting], not [pose/expression]" framing matters. Without it, the model pulls pose, framing, and other elements from the reference and fights what you actually want in the new shot.

See **iphone-cameraroll-prompting** for more on setting-continuity prompt language.

## Common patterns

### Batch-firing multiple lines

When generating b-roll for multiple script lines (e.g., L14, L15, L16, L18), don't fire them one at a time and wait for each. Fire all the `generate_image` calls back-to-back, then poll `job_display` once with all the IDs. Saves significant wall-clock time and keeps the user from waiting between batches.

### Tracking what's uploaded

Keep a mental ledger of media IDs in the conversation. Re-uploading the same reference wastes a round-trip and an API call. The protagonist character master should be uploaded once at session start; shirts get uploaded as you cycle through them. Couple/family masters get uploaded the first time they're needed.

### Quality vs cost tradeoff

If the user is iterating on a prompt to get the look right, drop to `count: 2` at `1k` for ~4 credits per attempt. Once the prompt is dialed, you can re-run finals at `2k` for ~10 credits per pair if the placement demands it. For most podcast story ad camera-roll content, 1k is fine as the final.

If credits are getting low, drop to `count: 1` for ~2 credits per shot. You lose the safety net of two variations but stretch the runway considerably.

## Communication patterns

- **Before a big batch**: state how many credits the batch will burn so the user can sanity-check budget.
- **After a batch**: report new balance.
- **When something fails silently** (stuck job, failed upload, missing variation): tell the user matter-of-factly and explain the recovery you're doing. Don't catastrophize a single missing image.
- **When uploading**: list the reference images you're sending up so the user can confirm.
- **Filename callouts after download**: list the saved filenames so the user can find them in their folder. Don't make them guess.

## When NOT to use this skill

- The user wants prompts they can copy-paste themselves into the Higgsfield UI. Write the prompts and stop — driving the API is overkill for that.
- The user is on a different image-generation platform (Veo Flow, Midjourney, Runway, Sora). Different MCPs, different conventions. This skill is Higgsfield-specific.
- The user wants video generation. There's a separate `generate_video` tool with its own model lineup and parameters — different flow.
- The Higgsfield MCP tools aren't actually available in the session. Check the deferred-tools list before assuming.
