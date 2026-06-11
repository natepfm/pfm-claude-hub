---
name: stage-request
description: >-
  PFM's AGF (Asset Gen Flow) staging skill — takes a written Video Task Manager request and
  makes it fire-ready: resolves the source creative's master prompt + reference images, sets up
  the project folder on Lucid, writes the verbatim dialogue manifest + 🤖 Asset Generation
  section, then routes at the editor's choice — send to AGF (flip Ready; the mini fires it) or
  generate locally now. Use on "/stage request", "stage request", "stage this request", or after
  writing a VTM request that needs generation. Eligibility is RESOLVABILITY, not creative shape:
  stage any creative (state batch, VSL→Calls conversion, re-edit regen, vertical pivot) whose
  AI-generatable assets resolve; stage only the generatable subset of a mixed edit+gen request.
  Anything unresolved stays Needs Staging with the gaps named. NOT for firing gens (AGF cycle /
  hvg-flow) or writing the request itself.
---

# /stage request — AGF Staging (v1: State Variations)

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


You take a written VTM request and make it **fire-ready** for AGF (Asset Gen Flow): assets staged in a real project folder, links on the page, property flipped. You are the bridge between "Dima wrote a request" and "the machine can generate from it with zero questions."

## Eligibility — what AGF can stage (check FIRST)

AGF stages any creative whose **AI-generatable assets resolve** — the creative's SHAPE does not matter. Per-state batch, format/runtime conversion (VSL → Calls cut), single-state re-edit that regenerates a few lines, vertical pivot of an existing character — all qualify. What matters is whether staging can hand the fire cycle everything it needs with **zero fire-time guesses.** Stage when ALL THREE resolve:

1. **A resolvable asset source** — a parent / sibling / OG creative whose **master prompt** (the locked voice + scene blocks) AND **reference image(s)** exist on Lucid. This is what new clips fire against. Usually a linked parent/sibling/"OG" request, or the original creative this one is a version of. (A Florida-version-of-Houston where Houston is already built is the textbook easy stage — Houston's assets ARE the source.)
2. **A clear generatable gen-scope** — exactly which clips (or images) are the AI-generatable deliverable. **A request can be PARTIALLY in scope.** When it mixes generation with editor work (a re-edit that regenerates only the "yellow" lines, a conversion that adds a banner + dual export), stage ONLY the generatable subset and document the editor-side remainder in the 🤖 section. AGF delivers raw assets, never a finished creative — so "stage the 7 VO lines that regenerate" is valid even when the rest is a Resolve re-edit.
3. **Canonical content** — every in-scope generatable line resolves to verbatim text from the request's Copy (the dialogue manifest, Step 3.5). A line whose literal text can't be found in the Copy can't be staged.

If all three resolve → stage it. If any can't (no findable master/ref, nothing AI-generatable, a missing line's dialogue, a new character with no master) → set `Asset Gen = Needs Staging`, write the named gap (see "Gap path"), stop. **Never improvise assets to force a stage. Never expand scope to swallow editor work** — the generatable subset is the only thing you stage.

> **The "state-variation only" gate is retired (Sam, 2026-06-11).** State variations are the most common shape, not the boundary. Declining a stageable conversion/re-edit because "it's not a per-state batch" is the exact failure this section exists to prevent — it bounced the Roku Calls VSL Florida twice before this fix. Eligibility = resolvability, never shape.

## Step 0 — Environment check (silent)

- Confirm Lucid Link is mounted: `/Volumes/ads/PFM MEDIA MASTER FOLDER/` must list. If not reachable (or this Cowork session lacks permission to it), STOP and tell the user: staging needs Lucid access — either grant this session access to `/Volumes/ads` or ask Sam/an editor to run `/stage request` on their machine. Do NOT do a Notion-only half-stage unless the user explicitly asks for it (and then leave Asset Gen at `Needs Staging`).
- Identify the target request: the one just written in this session, or the URL the user pastes. If neither, ask for the request URL — this is the one input you may request.

## Step 1 — Parse the request (silent)

Fetch the request page. Extract:

- **Asset-source link(s)** — mention-pages in Instructions/Assets/Examples callouts: the "master", "Batch 1", the "OG"/parent, or a sibling version. This is where the master prompt + reference(s) live.
- **Gen scope** — what's actually AI-generatable here and which lines/clips it covers. Watch for **mixed requests**: a re-edit or conversion where only some lines regenerate (`yellow = regenerate`, "unchanged lines reuse the existing audio/visuals") means the gen scope is JUST those lines — the rest (re-edit, banner, export) is editor work you do NOT stage.
- **Multipliers** — what multiplies the in-scope line set: target states (per-state toggles), platform variants (e.g. a number-speaking line fired once per Roku/Trade Desk number), aspect variants. Each is a multiplier on the gen-scope clip count.
- **Deliverable spec** — count, aspect, runtime, formats.
- **Vertical** — drives which Lucid tree the project folder lives in.
- **Brand** — if SaveMaxAuto/SMA in any form, the staged section MUST carry the SMA disclaimer warning line (CLAUDE.md Hard Rule 4).

If there's no findable asset source, or nothing in the request is AI-generatable (pure editor work) → Gap path.

## Step 2 — Resolve the parent's assets (silent)

1. Fetch the parent request. Find its project folder — check (in order): its own 🤖 Asset Generation section, delivery comments (`✅ Assets Generated [folder ↗]` LinkYourFile links — decode the base64 `p=` param to get the path), or a folder path written in the page.
2. In the parent's project folder, locate:
   - **Master prompt:** `Elements/Prompts/*.json` (locked master) and/or the Veo-ready master script (`.txt`/`.md`). Both if present.
   - **Reference image(s):** `Elements/Footage/Reference/*.png|jpg` — the master ref(s) the prompt template names. Include `_resized` variants if present.
3. If the parent folder can't be found, or has no prompts, or no refs → Gap path with the specific missing piece named.

## Step 3 — Resolve the project folder (the careful step)

**RULE ZERO — one project folder per creative; batches are SUBFOLDERS (locked by Sam 2026-06-10 after the B5 staging mistake):** if this request is a Batch N continuation of a creative whose project folder ALREADY EXISTS (find it via the parent request's own 🤖 section, delivery comments, or the prior batches' folder), **do NOT create a new project folder.** Reuse the existing one:

- Outputs → `<existing project>/Elements/Footage/Veo/Batch N/<State>/`
- Refs + prompts are already in that project's `Elements/` — verify they exist; copy in only what's missing
- The 🤖 section's Project Folder = the EXISTING folder, with the note "(existing project — Batch N outputs land in `Elements/Footage/Veo/Batch N/`)" and section 4's output-layout line updated to match

Create a brand-NEW project folder ONLY when the creative genuinely has no home: a new concept, or a vertical pivot whose project lives in a different vertical's tree (e.g., the Blake Auto → Blake Home pivot). When in doubt, reuse — a stray batch folder inside the right project beats a duplicate project folder every time.

**And NEVER derive a vertical's folder path from another vertical's convention.** Folder trees are NOT parallel across verticals (e.g., Home Insurance lives at `Home Insurance - Completed Creatives/Home Insurance - 2026/Home - June 2026/` — note the year folder repeats the vertical name but the month folder doesn't, unlike Auto's `Auto - Completed Creatives/Auto - 2026/Auto - June - 2026/`). The procedure when a new folder IS warranted:

1. `ls "/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/"` → find the vertical's actual `- Completed Creatives` folder by name.
2. `ls` into it → find the current year folder, then the current month folder. Use the EXACT naming pattern you see. If the month folder doesn't exist yet, mirror the prior month's exact pattern.
3. Look for a `[Template]` folder at the month level — if present, note the project-name pattern in use (e.g., `MM.DD.26 - <Type> - <Name>`).
4. Create: `<month folder>/<MM.DD.YY> - <Project Name from the request title>/` with the standard skeleton:
   ```
   Creatives/
   Elements/Prompts/
   Elements/Footage/Reference/
   Elements/Footage/Veo/
   ```
5. Copy in (cp, never mv — parents keep their assets):
   - Parent's master prompt JSON + master script → `Elements/Prompts/`
   - Parent's reference image(s) → `Elements/Footage/Reference/`

## Step 3.5 — Build the DIALOGUE MANIFEST (the canon step — locked by Sam 2026-06-10 after the L21 bounce)

**The request's Copy section is the CANONICAL source of dialogue. Not the parent's master files, not change logs, not prior batches — the Copy.** Editors make creative changes in the request and forget to update masters; what's written in the Copy IS the creative. Therefore:

1. **Assemble the complete per-line dialogue table at stage time** — every in-scope generatable line × every multiplier (states / platform variants / aspects, if any), VERBATIM from the request's Copy (per-state toggles or the "new script" block override the master template; the master template fills any non-overridden line). Strip the `[bracket]` highlight markers around swapped values (they're visual emphasis, not content); keep everything else character-for-character — contractions, phrasing, all of it. **Beware on-screen-only tokens bleeding into spoken lines:** a written line like `call XXX-XXX-XXXX on your screen right now` carries a banner placeholder, not spoken digits — the VO never reads literal digits (house convention: "call the number on your screen"). Resolve it the way the already-built sibling/OG resolved the same line; if no sibling settled it, descope that one line (note why) rather than guessing whether digits are spoken.
2. **Every in-scope line must resolve to literal text.** If a line is referenced in the scope (e.g., "include L21") but its verbatim dialogue does NOT exist in the request's Copy → that line CANNOT be staged: either descope it (note why in the section) or gap the whole stage — never delegate dialogue resolution to fire time, never pull dialogue from parent masters/change-logs (those are for voice/scene blocks ONLY).
3. **Mechanical grammar only:** the a/an article fix before state names (house convention from notion-state-batches) is the ONE permitted transformation — apply it and disclose it in the section. Nothing else gets "fixed."
4. **Write the manifest into the project**: `Elements/Prompts/<slug>_<batch>_dialogue.md` — one line per clip: `<STATE> · L<NN> · <speaker> — "<verbatim dialogue>"`. The 🤖 section's Prompts entry links/names this file. The fire cycle consumes it literally — zero dialogue decisions at fire time.

## Step 4 — Build the LinkYourFile links

A LinkYourFile URL is `https://linkyourfile.com/link?p=<base64 of the absolute path>` (URL-safe: encode `=` padding as `%3D`). Build three:

1. Project folder root
2. `<project>/Elements/Footage/Reference`
3. `<project>/Elements/Prompts`

On a machine with the script available, use it: `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute path>"`. Otherwise base64-encode the path directly (`echo -n "<path>" | base64` — then replace trailing `=` with `%3D`).

## Step 5 — Write the 🤖 Asset Generation section

Append this callout to the END of the request page (Notion markdown; keep this exact shape — the AGF fire cycle parses it):

```
<callout icon="🤖" color="gray_bg">
	## Asset Generation
	---
	*Claude reads this section when it checks the request. Property = Ready means assets are staged and AGF may run the gen flow end-to-end (pull refs → fire → QC → refire flagged → deliver).*
	- [x] **Ready for asset generation**
	---
	**1. Project Folder** — <one-liner: fresh build / variation of which parent>
	📁 `<absolute Lucid path>`
	🔗 [Open project folder ↗](<LinkYourFile URL>)
	**2. Character Reference Images** — ref used on every prompt: `<exact filename(s)>` (<one-line visual description>)
	🔗 [Elements/Footage/Reference ↗](<LinkYourFile URL>)
	**3. Prompts** — <what's in there: master script + locked master JSON, where it came from> (reuse, do not re-derive)
	🔗 [Elements/Prompts ↗](<LinkYourFile URL>)
	**4. Model + Gens Per Line** — `<model>` <flags> · <aspect> · <duration> · count=1 per line
	<base-vs-state line math> = **<N> clips** (~<N×rate> cr at <rate> cr/clip)
</callout>
```

Rules for section 4 (the inline spec):
- Model comes from the parent's master (typically `veo3_1_lite` — which ALWAYS carries `+ generate_audio true`, 12 cr/clip).
- Count math: `<base lines fired once> + <state lines> × <number of states> = total clips`, count=1 per line (PFM default).
- If the brand is SMA, add a line: `⚠ **SMA disclaimer required** — every final creative must include: "This advertisement contains synthetic performers created with artificial intelligence."`

If the page already has a 🤖 Asset Generation section (re-staging), UPDATE it in place — never append a duplicate.

## Step 6 — Report + route (the fork — added by Sam 2026-06-10)

Staging is done; now the editor chooses where it fires. Do NOT flip any property until they answer.

1. Report the stage to the user: two-link handoff (📁 path + 🔗 link for the project folder), what was staged from where, and the clip/credit math.
2. Then ask, **in plain markdown chat** (never an AskUserQuestion card — house rule):

   > **Where should this fire?**
   > **a. Send to AGF** — hands-off: the mini claims it within ~3 minutes and runs the full cycle (fire → QC → deliver), queued behind anything already generating.
   > **b. Generate locally now** — fires in THIS session immediately, no queue. Good when the project can't wait.

   Only offer (b) if this session can actually fire: Lucid mounted AND `which higgsfield` resolves. In a Cowork session (Dima) or any machine without the CLI, skip the fork — say it's staged and route (a) automatically.
3. Either route: do NOT touch the main `Status` property — that's the creative lifecycle, not AGF's.

### Route (a) — send to AGF

Set `Asset Gen` → **`Ready`** (update_properties: `{"Asset Gen": "Ready"}`), then **re-fetch the page and confirm the value actually stuck** — a property write can return success yet silently no-op (observed 2026-06-10 racing a fresh schema change). If it didn't stick, set it again and re-verify. Never report an arming on an unverified flip. Tell the editor the mini picks it up on the next watcher poll (~3 min).

### Route (b) — generate locally, right now

1. **FIRST set `Asset Gen` → `Generating (Local)`** + re-fetch verify. This value is invisible to the mini by design (watcher + cycle match only `Ready`/`Generating`) — it is the lock that keeps AGF's hands off while you fire here. **Never fire locally on `Ready` or plain `Generating`** — the mini will claim it or "orphan-recover" it mid-run and double-fire.
2. **≥20 clips? Full preflight + explicit `fire` confirm before spend** (CLAUDE.md Hard Rule 3 — choosing (b) does not bypass the threshold). Under 20, the (b) answer IS the authorization — fire immediately.
3. Fire the staged batch in this session under the AGF fire conventions: refs uploaded serially first → UUIDs; **smoke fire one clip + verify the full chain** before the rest; waves ≤64 at `max_workers=16`; count=1 per line; backgrounded shells; dialogue VERBATIM from the staged dialogue manifest; per-wave mp4 counts on disk vs expected.
4. After counts verify, **offer** audio-qc (editor's call in an interactive session — don't auto-run it).
5. Deliver exactly like AGF would: house delivery comment on the request (`✅ Assets Generated [folder ↗]` + any manual-fire `Note:` lines), two-link handoff in chat, then `Asset Gen` → **`Delivered`** + verify.
6. If the local run dies partway: leave it at `Generating (Local)` and give the editor the recovery fork — resume here, or flip the property to `Ready` to hand the remainder to AGF (its resume logic diffs the folder against the expected math and fires only the gap).

## Gap path — when staging can't complete

Set `Asset Gen` → **`Needs Staging`** (if not already) and append a short note to the 🤖 section area (create a minimal section if none exists) naming EXACTLY what's missing, e.g.:

> ⚠ **Staging incomplete — needs an editor:**
> - No master prompt found in the parent's `Elements/Prompts/` (parent: <link>)
> - <or> No reference image found for <character> — needs a character master built
> - <or> Not a state variation (no parent link / no state list) — out of AGF v1 scope

Then tell the user what an editor needs to create before `/stage request` can succeed. Never set `Ready` on a gap. Never invent or substitute assets (e.g., do NOT grab a different character's ref or a "close enough" prompt).

## House rules that ride along

- **Two-link handoff** on every folder mention: 📁 raw path + 🔗 LinkYourFile (CLAUDE.md Hard Rule 2).
- **cp, never mv** — parent folders keep their assets.
- **No Status changes, no @-tags, no delivery comments** — staging is not delivery.
- **SMA = disclaimer warning** in the section (Hard Rule 4).
- **Verify before creating** — `ls` every tree level; never `mkdir -p` a path you haven't confirmed exists through the month-folder level.
- **Idempotent** — re-running /stage on an already-staged request refreshes links/section in place; it never duplicates folders or sections. If the project folder already exists with content, use it (don't recreate, don't overwrite existing files).

## What this skill does NOT do

- **Fire generations unprompted** — firing happens only via route (b) after the editor explicitly picks it at the Step 6 fork (or machine-side via the AGF cycle). Never start generating straight out of staging.
- **Write the request** — notion-state-batches / iterate-creative do that.
- **Create new characters, refs, or prompts** — gaps go to an editor; this skill only stages what exists.
- **Flip Status / post delivery comments / turn in creatives** — out of scope, always.
