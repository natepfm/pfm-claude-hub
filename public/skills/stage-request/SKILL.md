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

## 🔴 HARD RULE — the clip reference is a SCENE frame, NEVER the bare character master (locked 2026-07-06)

The image you stage into **🖼 Character Refs** — the frame the Veo clips fire against (`--start-image`) — MUST be a **scene frame**: the character composed *in the actual shot* (seated at the podcast desk with mic + headphones — the JRE / podcast seed; the news desk; whatever the creative's set is). It is **NEVER the bare character master** — the full-body, studio-backdrop, standing model-sheet / scale-anchor plate.

**Why:** the master is an *identity* plate — it defines WHO the person is, for *deriving* the character. Veo i2v generates FROM the start frame's composition, so feeding a full-body studio-standing plate produces a standing studio shot, not the seated podcast shot — the whole batch comes out wrong-framed. (Cost us all 84 host clips on **50 States – Home Best State Podcast – Ronald Curtis**, 2026-07-06: staged `Curtis_Holloway_Master_f7ab.png` as the ref instead of the podcast seed. The identity was correct — the *shot* was wrong.)

**How to apply — every character-swap / new-host podcast, or any scene-based clip fire:**
- The staged clip reference is the **scene seed** — a `*_JRE_Seed_*`, a podcast/news placement frame, the actual first frame of the shot. NOT `*_Master_*` / `*model_sheet*` / `*scale*` / a full-body studio plate.
- **If only a bare master exists and no scene seed → do NOT stage the master as the ref.** Build the scene seed first (`jre-swap` for a JRE podcast, `character-studio` placement for a fresh scene), then stage THAT. If you can't build it in this session → Gap it: `Needs Staging — scene reference must be built (only a character master exists)`.
- The master still belongs in the folder as the identity source — it just is **not** the fire reference. Both can sit in `Elements/Footage/Reference/`; the 🖼 Character Refs slot names the **scene seed**.

## Eligibility — what AGF can stage (check FIRST)

AGF stages any creative whose **AI-generatable assets resolve** — the creative's SHAPE does not matter. Per-state batch, format/runtime conversion (VSL → Calls cut), single-state re-edit that regenerates a few lines, vertical pivot of an existing character — all qualify. What matters is whether staging can hand the fire cycle everything it needs with **zero fire-time guesses.** Stage when ALL THREE resolve:

1. **A resolvable asset source** — a parent / sibling / OG creative whose **master prompt** (the locked voice + scene blocks) AND **reference image(s)** exist on Lucid. This is what new clips fire against. Usually a linked parent/sibling/"OG" request, or the original creative this one is a version of. (A Florida-version-of-Houston where Houston is already built is the textbook easy stage — Houston's assets ARE the source.)
2. **A clear generatable gen-scope** — exactly which clips (or images) are the AI-generatable deliverable. **A request can be PARTIALLY in scope.** When it mixes generation with editor work (a re-edit that regenerates only the "yellow" lines, a conversion that adds a banner + dual export), stage ONLY the generatable subset and document the editor-side remainder in the 🤖 section. AGF delivers raw assets, never a finished creative — so "stage the 7 VO lines that regenerate" is valid even when the rest is a Resolve re-edit.
3. **Canonical content** — every in-scope generatable line resolves to verbatim text from the request's Copy (the dialogue manifest, Step 3.5). A line whose literal text can't be found in the Copy can't be staged.

If all three resolve → stage it. If any can't (no findable master/ref, nothing AI-generatable, a missing line's dialogue, a new character with no master) → set `Asset Gen = Needs Staging`, write the named gap (see "Gap path"), stop. **Never improvise assets to force a stage. Never expand scope to swallow editor work** — the generatable subset is the only thing you stage.

> **The "state-variation only" gate is retired (Sam, 2026-06-11).** State variations are the most common shape, not the boundary. Declining a stageable conversion/re-edit because "it's not a per-state batch" is the exact failure this section exists to prevent — it bounced the Roku Calls VSL Florida twice before this fix. Eligibility = resolvability, never shape.

> **VSL is fully stageable — but via its OWN workflow, not the standard one (Sam, 2026-07-11).** A VSL request stages fine; just don't run it through the regular per-clip protocol. VSLs carry **per-line `Slide:` directives and many more reference images** (per-slide / rotating-pool / start+end ref modes) — there's simply more to resolve. Stage it the VSL way (the shape `vsl-state-variations` / the Format-B path handle), map every slide's ref, then route. Nikolai usually stages these. Never treat "it's a VSL" as a reason it can't go to the mini — it can.

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
   - **Reference image(s):** `Elements/Footage/Reference/*.png|jpg`. **⚠️ Pick the SCENE frame the clips fire against — NOT the bare character master** (see the 🔴 HARD RULE above). For a podcast/news/scene creative the fire reference is the **scene seed** (`*_JRE_Seed_*`, a placement frame showing the character in the set), never `*_Master_*` / model-sheet / full-body studio plate. If the parent has only a master and no scene seed, that's a gap — build the seed or Gap it; do not fall back to staging the master as the ref. Include `_resized` variants if present.
3. If the parent folder can't be found, or has no prompts, or no usable **scene** reference (only a bare master) → Gap path with the specific missing piece named.

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
4. Create the project folder at `<month folder>/<MM.DD.YY> - <Project Name from the request title>/` with the **FULL canonical template — every folder, even the empty ones** (mirrors the `[Template]` reference project; locked by Sam 2026-06-17). Use the helper:
   ```
   bash ~/.claude/skills/stage-request/scaffold_project.sh "<absolute new project folder path>"
   ```
   Builds the complete tree — `Creatives/`, `Elements/Audio/{Music,SFX,VO}/`, `Elements/Footage/{B-Roll,Primary,Reference,Veo}/`, `Elements/Graphics/`, `Elements/Prompts/`. Idempotent: re-running it on an existing project just backfills any missing folders, never touches what's there.
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

## Step 5 — Write the 🤖 Asset Gen section (COMPACT format, locked by Sam 2026-06-11)

Write this callout at the **TOP of the request page** — first block under the title, above Instructions. New requests born from the VTM templates carry a blank scaffold there: fill it IN PLACE. Re-staging an already-staged request: update in place. Re-staging a request with the LEGACY verbose section (old numbered format, anywhere on the page): replace it with this compact format at the top. Never duplicate a section.

```
<callout icon="🤖" color="gray_bg">
	**Asset Gen** — staged ✅ <MM.DD> by <stager> · **<N> clips ≈ <cr> cr**
	<table header-row="false" header-column="true">
<tr>
<td>**📁 Project Folder**</td>
<td>[<project folder name> ↗](<LinkYourFile>)</td>
</tr>
<tr>
<td>**🖼 Character Refs**</td>
<td>[Refs ↗](<LinkYourFile>) `<exact ref filename(s)>`</td>
</tr>
<tr>
<td>**📝 Prompts**</td>
<td>[Prompts ↗](<LinkYourFile>) `<master file>` • `<dialogue manifest>`</td>
</tr>
<tr>
<td>**🎬 Fire**</td>
<td>`<model>` <flags> · <aspect> · <duration> · count=1 · <W> wave(s)</td>
</tr>
<tr>
<td>**🗒 Notes**</td>
<td><one-line run context the editor / fire cycle should see at a glance — non-blocking FYIs. Em dash `—` when there's nothing run-specific.></td>
</tr>
	</table>
	⚠️ <flags line — ONLY when needed: SMA disclaimer / descoped lines / editor-side remainder / graphics notes. Omit entirely when clean.>
	### Staging details {toggle="true"}
		📁 `<absolute Lucid path>`
		<everything verbose lives here, collapsed: staged-from provenance (which parent/OG and why) · ref visual description · voice lock · disclosed transformations · descope reasoning · output layout if non-obvious>
</callout>
```

Rules:
- **The callout icon + bold first words ARE the title** — renders as "🤖 Asset Gen — staged ✅ …". No heading block, no explainer paragraph, no checkbox (the `Asset Gen` property is the only switch — one source of truth).
- **`by <stager>` on the title line = traceability (locked 2026-07-07)** — stamp WHO staged it so a downstream bug has a debuggable owner. Resolve the stager by fetching Notion `self` (`notion-fetch` id `"self"` → the authenticated user's name/email) and use that name; if it's the shared master account (the mini or a master-account session), write `PFM Master (mini)`. The reason this matters: the SPANISH Florida VSL delivery showed only the shared master account, so the assigned editor (Nicolai) "didn't recall staging it" — because a master-account flow did, with no human on record. The delivery comment (AGF Step 6 / route (b)) echoes this `by <stager>` so every delivery carries its stager.
- **Visible part = title line + the 2×2 table + optional ⚠️** + the collapsed Staging details toggle. Anything longer goes in the toggle — the fire cycle reads toggle content as section content.
- **Filling a blank scaffold** (every new request is born with one, at the top): the scaffold's cells hold *italic hint text* and it carries a `How to stage this` toggle (editor instructions). On staging: replace each cell's hint with the real value, rewrite the title line to `staged ✅`, **delete the `How to stage this` toggle** and write the `Staging details` toggle in its place. An editor may have hand-filled some cells — verify their values (files exist on disk) and keep what's correct.
- **The raw 📁 Lucid path lives in the toggle** (first line) — that satisfies the handoff rule on the page without bloating the visible section. In-chat handoffs still show the full 📁/🔗/🦊 set inline as always.
- Model spec from the source master (typically `veo3_1_lite` — ALWAYS `+ generate_audio true`, 12 cr/clip). Clip-count math stays on the title line: `<N> clips ≈ <cr> cr`.
- SMA brand → the ⚠️ line MUST include: **SMA disclaimer required** — "This advertisement contains synthetic performers created with artificial intelligence."
- **🗒 Notes vs ⚠️ vs the toggle — three distinct lanes, don't blur them:**
  - **🗒 Notes** (visible table row) = soft, non-blocking run context worth seeing at a glance: the look-lock approach ("2-look run: Commercial + Realism"), TTS quirks ("$-amounts spelled out for TTS"), character handling ("Chad runs NSFW-hot — cool down between waves"), wave rationale, recurring-holdout heads-up. FYI, not action-required. Keep it to ONE line; anything longer goes in the toggle.
  - **⚠️ flags line** = HARD flags that change what ships or block a clean fire: SMA disclaimer, descoped lines, editor-side remainder, missing-piece warnings. Action-required.
  - **Staging details toggle** = deep, collapsed provenance: staged-from, ref descriptions, voice lock, transformations, output layout.
  - When in doubt: does it block or change the deliverable? → ⚠️. Is it just useful to know? → 🗒 Notes. Is it long/archival? → toggle. Nothing run-specific → Notes cell is an em dash `—`.

## Step 5.9 — Independent verify BEFORE arming (fresh-context gate, locked 2026-07-07)

**Nothing grades its own homework.** Before you route or flip anything, spawn a **fresh-context subagent** (Agent tool, `general-purpose`) that did NOT see your staging reasoning and hand it ONLY: (a) the request URL, (b) the exact 🖼/📝/🎬 cells + ⚠️ line you just wrote, (c) the actual reference filename(s) on disk (`ls Elements/Footage/Reference/`). Its job is to **REFUTE the stage** — default to FAIL when uncertain; the stager was confident, and confidence is not evidence. It re-reads the request from scratch and checks:

1. **🔴 Reference is a SCENE frame, not a bare master** — the staged 🖼 Character Refs file must be a scene seed (`*_JRE_Seed_*`, a placement frame in the set), NEVER `*_Master*` / `*model_sheet*` / `*scale*` / a full-body studio plate. (This is the exact check that would have caught the Ronald Curtis 84-clip miss, 2026-07-06. See the 🔴 HARD RULE at the top.)
2. **Dialogue is canonical** — every in-scope line in the manifest is verbatim from the request's Copy (spot-check ≥3 lines against the page), not derived from a parent master/change-log.
3. **Count math holds** — manifest lines × multipliers (states/aspects/platform) == the 🎬 Fire clip count == the credit math.
4. **Folder + vertical** — the 📁 path exists on disk and sits in the correct vertical tree.
5. **SMA disclaimer** — if the brand is SaveMaxAuto/SMA, the ⚠️ line carries the disclaimer requirement.
6. **🔴 Aspect-match — reference aspect == render aspect** — for EVERY render aspect the 🎬 Fire declares (9:16 and/or 16:9), the reference image(s) that fire against it must exist IN THAT ASPECT. A vertical (9:16) reference feeding a horizontal (16:9) render (or vice-versa) **pillarboxes → black bars down the sides**. **VSLs are the sharp edge:** the per-line slides AND the "No Slide Reference Shots" pool (speaker / on-stage lines cycle this pool) must EACH exist in every requested aspect — a 9:16-only no-slide pool used for 16:9 speaker clips is the exact bug that pillarboxed 14 speaker clips on the SPANISH Avg Auto State Florida VSL (delivered 2026-06-24, caught + refired by the editor 2026-07-07). Confirm on disk that the ref dir holds the render aspect; if a request wants BOTH aspects, both slide sets + both pools must exist. Mismatch → FAIL.

The subagent returns exactly one line: `PASS: <what it confirmed>` or `FAIL: <the specific defect + which check>`. **On FAIL: do NOT proceed to Step 6 / do NOT flip `Ready`.** Fix the staged section, then re-verify (fresh subagent again). On PASS: proceed to routing. This gate is cheap (one read-only subagent) and it is the difference between catching a mis-stage now vs. after 84 wrong clips ship. Per the DONE law: "staged" is not done until this check passes.

## Step 6 — Report + route (the fork — added by Sam 2026-06-10)

Staging is done; now the editor chooses where it fires. Do NOT flip any property until they answer.

**⚠️ Oversized-batch check FIRST (mirrors the mini's hard ceiling, locked 2026-06-17):** if the staged batch exceeds **300 clips OR ~4,000 cr**, route (a) "Send to mini" will be REFUSED — the AGF cycle bounces anything over that ceiling back to Needs Staging (the guardrail against unattended runaway spend). When you're over the ceiling, say so up front and steer the editor to either **(1) split it into smaller batches** (each under the ceiling) and stage those, or **(2) fire route (b) supervised locally** (where the human preflight + `fire` gate covers the spend). Do NOT arm an oversized request to the mini — it will only bounce. (Ceiling is tunable but must stay in sync with the `agf` cycle skill's rail.)

1. Report the stage to the user: Lucid handoff (📁 path + 🔗 link + 🦊 Fox.io link for the project folder), what was staged from where, and the clip/credit math.
2. Then present the route as an **AskUserQuestion card** (sanctioned card #2, Sam 2026-06-11 — supersedes the old plain-markdown house rule for THIS fork only): header `Route`, question *"Staged — where should this fire?"*, options:
   - **🤖 Send to mini** — "hands-off: the mini claims it within ~3 min and runs the full cycle (fire → QC → deliver), queued behind anything already generating"
   - **💻 Generate locally** — "fires in THIS session immediately, no queue — for projects that can't wait"

   A typed `a`/`b`/"send to mini"/"local" in chat counts the same. Only offer the card if this session can actually fire local: Lucid mounted AND `which higgsfield` resolves. In a Cowork session (Dima) or any machine without the CLI, skip the card entirely — say it's staged and route (a) automatically.
3. Either route: do NOT touch the main `Status` property — that's the creative lifecycle, not AGF's.

### Route (a) — send to AGF

Set `Asset Gen` → **`Ready`** (update_properties: `{"Asset Gen": "Ready"}`), then **re-fetch the page and confirm the value actually stuck** — a property write can return success yet silently no-op (observed 2026-06-10 racing a fresh schema change). If it didn't stick, set it again and re-verify. Never report an arming on an unverified flip. Tell the editor the mini picks it up on the next watcher poll (~3 min).

### Route (b) — generate locally, right now

1. **FIRST set `Asset Gen` → `Generating (Local)`** + re-fetch verify. This value is invisible to the mini by design (watcher + cycle match only `Ready`/`Generating`) — it is the lock that keeps AGF's hands off while you fire here. **Never fire locally on `Ready` or plain `Generating`** — the mini will claim it or "orphan-recover" it mid-run and double-fire.
2. **≥20 clips? Full preflight + explicit `fire` confirm before spend** (CLAUDE.md Hard Rule 3 — choosing (b) does not bypass the threshold). Under 20, the (b) answer IS the authorization — fire immediately.
3. Fire the staged batch in this session under the AGF fire conventions: refs uploaded serially first → UUIDs; **smoke fire one clip + verify the full chain** before the rest; waves ≤64 at `max_workers=16`; count=1 per line; backgrounded shells; dialogue VERBATIM from the staged dialogue manifest; per-wave mp4 counts on disk vs expected.
4. After counts verify: local/in-chat fires are NEVER auto-QC'd. After delivery, OFFER QC via a plain multi-choice ask (run audio-qc / run visual-qc / skip). AGF/mini runs keep mandatory QC.
5. Deliver exactly like AGF would: house delivery comment on the request (`✅ Assets Generated [folder ↗]` + any manual-fire `Note:` lines) — **echo the `by <stager>` from the 🤖 section title into the comment** (`· staged by <stager>`) so the delivery carries its debuggable owner — full Lucid handoff (📁/🔗/🦊) in chat, then `Asset Gen` → **`Delivered`** + verify.
6. If the local run dies partway: leave it at `Generating (Local)` and give the editor the recovery fork — resume here, or flip the property to `Ready` to hand the remainder to AGF (its resume logic diffs the folder against the expected math and fires only the gap).

## Gap path — when staging can't complete

Set `Asset Gen` → **`Needs Staging`** (if not already) and append a short note to the 🤖 section area (create a minimal section if none exists) naming EXACTLY what's missing, e.g.:

> ⚠ **Staging incomplete — needs an editor:**
> - No master prompt found in the parent's `Elements/Prompts/` (parent: <link>)
> - <or> No reference image found for <character> — needs a character master built
> - <or> Only a bare character master exists — the clip reference must be a scene seed (build via `jre-swap` / `character-studio` placement first)

Then tell the user what an editor needs to create before `/stage request` can succeed. Never set `Ready` on a gap. Never invent or substitute assets (e.g., do NOT grab a different character's ref or a "close enough" prompt).

### Missing character / reference image → recovery card (sanctioned card #3, Sam 2026-06-11)

When the gap is specifically a **missing character or reference image** (the character has no master, or the ref the prompts point at can't be found), do NOT dead-end — after setting `Needs Staging` + writing the gap note, present an **AskUserQuestion card**: header `Missing ref`, question *"No reference image found for <character> — how do you want to handle it?"*, options:

- **🆕 Make from scratch** — "build the character master + reference image now from a description" → chain into `pfm-character-master` (or `ugc-talking-head-ref` for UGC talking-head creatives), get the editor's pick, drop the master into the Character Library + the ref into the project, then RESUME staging from where it stopped
- **🔗 Link existing** — "I'll give you a link/path to one already made" → editor pastes a Lucid path or LinkYourFile link; verify the file exists, copy it into the project's `Elements/`, resume staging
- **🦊 Fox.io:** queue the folder in Fox.io's From Claude rail — `python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py --fox-drop "<absolute path>" "<label>"` — then render `🦊 Fox.io: <label> → From Claude rail` (opens in Fox.io in a NEW tab; clicking consumes the entry)
- **📤 Upload a ref image** — "I'll drop an image; build the character masters + reference from it" → editor attaches a photo; feed it to `pfm-character-master` as the source likeness, deliver the master set, then resume staging

Whichever route resolves the ref: re-run the staging checks and continue to Step 6 — the request only leaves `Needs Staging` when staging actually completes. Non-character gaps (missing master prompt, out-of-scope shape) keep the plain Needs-Staging handoff above — no card.

## House rules that ride along

- **Lucid handoff** on every folder mention: 📁 raw path + 🔗 LinkYourFile + 🦊 Fox.io rail drop (`linkyourfile.py --fox-drop`) (CLAUDE.md Hard Rule 2).
- **cp, never mv** — parent folders keep their assets.
- **No AUTOMATIC Status changes, no @-tags, no delivery comments** — staging is not delivery. **One offered exception (Sam 2026-07-11):** when you're handed a request that is already `Staged` (Asset Gen) but its `Status` is NOT `In progress`, **ASK the editor** if they'd like to move `Status → In progress` — plain-markdown offer, NEVER an auto-flip. If yes, set `Status = In progress` and re-fetch to verify it stuck; if no, leave it. This is the one Status touch staging offers; everything else stays hands-off.
- **SMA = disclaimer warning** in the section (Hard Rule 4).
- **Verify before creating** — `ls` every tree level; never `mkdir -p` a path you haven't confirmed exists through the month-folder level.
- **Idempotent** — re-running /stage on an already-staged request refreshes links/section in place; it never duplicates folders or sections. If the project folder already exists with content, use it (don't recreate, don't overwrite existing files).

## What this skill does NOT do

- **Fire generations unprompted** — firing happens only via route (b) after the editor explicitly picks it at the Step 6 fork (or machine-side via the AGF cycle). Never start generating straight out of staging.
- **Write the request** — notion-state-batches / iterate-creative do that.
- **Create new characters, refs, or prompts SILENTLY** — character/ref creation happens ONLY as an editor-chosen route from the Missing-ref card (which chains to `pfm-character-master` / `ugc-talking-head-ref`); never invent or substitute assets without that explicit choice. Missing master PROMPTS still go to an editor — no card for those.
- **Flip Status / post delivery comments / turn in creatives** — out of scope, always.
