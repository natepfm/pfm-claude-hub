---
name: wr.request
description: "[request-writer, creator-facing] Turn a creative brief into a correctly-spec'd PFM Notion REQUEST in the Video Task Manager — sets the spec properties, applies the naming grammar (display-name title), builds the locked body (the four callouts + one static numbered script; the spec lives in the VTM properties, NOT a body table), and for a variant/derivative wires the Parent Creative relation + a REUSE/NEW map + a keyed 2-col delta-script. This is the enforcement surface so requests are BORN in the locked format instead of freehand. Use when a creator / strategist says \"write a request\", \"make a Notion request\", \"create a request\", \"spec this request\", \"new request for X\", \"turn this brief into a request\", \"draft a VTM request\", or hands a brief that should become a request. NOT for: writing the CONTENT that goes inside (beats → wr.beats, AI script → wr.aiscript, LC podcast → wr.pod.lc, state batches → wr.batches), staging/generating (ag.stage), or reformatting an already-live request (see the rollout gate)."
---

# wr.request — write a spec'd PFM Notion request

Creators hand-write requests their own way. A request is instructions for Claude to fire skills, so an inconsistent one costs a clarifying round every time. This skill produces the **locked request format** — properties filled, spec on top, one clean script — so the request fires without a question. It writes the request PAGE; the wr. family writes the CONTENT that goes inside it.

## ✅ Rollout status — LIVE (approved 2026-07-13)
The request format is **APPROVED and LIVE** — Dima signed off; Sam "notion changes approved, implement across the board" (2026-07-13). Use this on **every new request going forward** — new requests are born in this format, no confirm needed.
- **Forward-only by default.** Still do NOT retroactively reformat a live, in-flight request unless Sam explicitly scopes a backfill (title↔folder mismatch + mid-fire risk are real). New + test copies only get the format automatically.
- The optional per-line **prompt-direction 3rd column** is **NOT adopted** (Sam 2026-07-13: "just dima" — Dima signed off the format; the David-gated 3rd column is shelved). **Keep the delta table 2 columns.**

## Step 1 — Intake (ask ONLY what you can't infer from the brief)
Pull everything you can from the brief; ask the gaps in one short plain-markdown list (never AskUserQuestion — those cards are reserved). Fields:
- **Vertical + Lead Type** — e.g. `Auto - Forms`, `Home - Calls`, `Loans.Personal - Forms` (the VTM `Vertical` select).
- **Platform** — blank = **Facebook** (the default). Fill only for a specific platform (`Roku CTV`, `AppLovin`, `Snap`…).
- **Creative Type** — the format(s). **Stackable up to two**, method/pipeline first then delivery format: `LC2VID - Podcast`, `Breaking News`, `VSL`, `UGC`, `Animated - Pixar`. (Codes shared with the creative-naming convention: bn/pod/vsl/ugc/anim/qvc/lc2vid.)
- **Concept** — the angle/story: `Car Chase`, `Good Neighbor`, `Denied Car Loan`.
- **Deliverables / # videos** — the count + the split (e.g. "8 = Broad V+H + FL/TX/WA V+H").
- **Geo** — blank = **Broad**. Fill the state(s)/region when scoped.
- **Language** — blank = **English**. Fill for Spanish etc.
- **Aspect** — blank = the **platform default** (FB/AppLovin/Snap → 9:16, Roku CTV → 16:9). Fill only when it deviates (a 16:9 on FB, a Square 1:1).
- **Batch · Brand · Variant · Runtime** — fill when they apply (Batch `B1`; Brand only for a specific advertiser like SMA/SMH; Variant = Remake/Hook Tests/V2; Runtime `≈2:45`).
- **Derivative?** — is this a variant of an existing creative? If yes, get the **Parent** (the OG/sibling request) → drives Step 5.
- **Assets / refs · Examples · Copy** — what footage/refs to reuse, tone/format examples, and the script (or a pointer to the wr. skill that will write it).

**Blank = default is the rule** (Sam 2026-07-11): store only what DEVIATES. Don't fill Platform=Facebook, Language=English, Geo=Broad, or the platform-default Aspect — leave them blank.

## Step 2 — Derive the naming
**Single source for all naming = the `pfm-naming` skill** — this section mirrors it; if they disagree, `pfm-naming` wins. Two renderings you produce here (the third, **Full Name**, is an auto formula — don't set it):
- **Display name = the page TITLE** (`Task Name (Angle - Concept)` property): `[Platform - ] <Creative Type> - <Concept> [ - <variant tail>]`. **No Vertical/Lead** (the chips show them). **Plain-hyphen separators** ` - ` — NEVER em dashes. The **variant tail is whatever actually VARIES** on this request — Batch, Geo, Language, Aspect, Hook Tests, or **Character/Vertical when that's the differentiator**.
  - e.g. `LC2VID - Podcast - Car Chase - B1` · `Roku CTV - QVC - SaveMax Live - Houston` · `Breaking News - Car Repo - Spanish`.
- **Compact code** (a short internal identifier, not a property, rarely needed): `<VERT>-<LEAD>[-<PLAT>]-<TYPE>-<CONCEPT>[-<variant>]`, defaults omitted — e.g. `AU-F-LC2VID-POD-CARCHASE-B1`. 🔴 **NOT a timeline/export/folder name.**
- **🔒 Creative / Timeline / Export name — LOCKED (Sam 2026-07-13):** `Vertical - Lead - [Platform] - VARIABLE - Creative Type - Concept - [tail] - MM.DD.YY`, plain ` - ` hyphens, defaults omitted. **`VARIABLE`** = the per-timeline differentiator — the ONE thing that changes per timeline within a project: the **state** (each state-swap = its own timeline) or a **text hook** (`H1`/`H2`/`H3`). Platform stays in the front cluster (omitted when default = Facebook). Carries the whole Full-Name tail; **ends with the date** (`MM.DD.YY`, matching the folder). Timeline name = creative name = export filename (you export by timeline name, one rule for all three). e.g. `Auto - Forms - Texas - LC2VID - Podcast - Car Chase - 07.14.26`.
- **Project folder — LOCKED (Sam 2026-07-14):** `MM.DD.YY - <display name>` = `MM.DD.YY - [Platform - ] Creative Type - Concept - [tail]`. **Folders do NOT start with Vertical/Lead** (only the creative/timeline name carries those — its export identity needs every value); a specified Platform leads (e.g. `MM.DD.YY - Roku CTV - QVC - …`). One folder holds ALL its timelines/states → **no VARIABLE** in the folder name.
- **🔴 Strip the ` - N Video(s)` tail** the Dima Full-Name formula appends — it is a display-only artifact and NEVER carries into a folder / timeline / creative / export name.

## Step 3 — Set the properties on the new page
Create the page in the **Video Task Manager** data source `18a16771-e780-81fb-9293-000b742fce5e` via `notion-create-pages` (`parent: {"data_source_id": "18a16771-e780-81fb-9293-000b742fce5e"}`). Set:
- **`Task Name (Angle - Concept)`** (title) = the display name from Step 2.
- **`Vertical`** (select) = the vertical+lead value · **`Content`** = `Video` (or Static) · **`Videos`** (number) = the count · **`MB`** = the requesting media buyer if given · **`Status`** = `Requested`.
- **Spec properties (text — fill only non-defaults):** `Platform` · `Creative Type` · `Concept` · `Geo` · `Language` · `Aspect` · `Batch` · `Brand` · `Variant` · `Runtime`.
- **`Parent Creative`** (relation) = the parent page URL, **only for a derivative** (Step 5).
Leave the `Asset Gen` property EMPTY — staging owns it.

## Step 4 — Build the body (the locked shape)
The four callouts ALWAYS, in order, each opened with its `## <Heading>` + `---`. **🔴 NO Spec table in the body (removed 2026-07-13, Sam)** — the at-a-glance spec lives ENTIRELY in the VTM properties now (Creative Type · Concept · Geo · Platform · Aspect · Batch · …), shown as board columns; never duplicate it as a body table.
1. **Instructions** — what to make, the deliverables count, and any hard rules. Hard values (rate ladders, tracking numbers, counters) go in a **table**, never loose in prose (kills the fat-finger error class).
2. **Assets** — footage/refs to reuse (+ attach source PDFs/links).
3. **Examples** — tone/format reference creatives, PLUS **always include the CREATIVE-NAME example (Sam 2026-07-13):** render this creative's derived timeline/export name from the locked grammar (Step 2) so the editor sees exactly what to name the timeline + export — `Vertical - Lead - [Platform] - VARIABLE - Creative Type - Concept - [tail] - MM.DD.YY` (VARIABLE = this timeline's state or hook; strip the Video(s) tail). e.g. `Auto - Forms - Texas - LC2VID - Podcast - Car Chase - 07.14.26`. If the creative fans out per state/hook, show one representative example + name the VARIABLE.
4. **Copy** — **ONE static numbered script** (one line per clip), written once. Gen-iteration state (what passed QC, what's refiring) lives in the Asset Gen layer, NEVER in the script. If the script isn't written yet, drop a pointer to the wr. skill that writes it (`wr.aiscript` / `wr.pod.lc` / `wr.beats`) and leave the numbered block for it to fill.

Use flowing text / bold-prefix lines, **not Notion tables**, for anything with full-sentence content (Notion tables don't fill width). Tables are only for short tabular data (rate ladders, the delta below).

## Step 5 — Derivatives (variant of an existing creative)
When this is a variant of a Parent (a Seattle version, a sister-vertical, a hook-test batch):
- Set **`Parent Creative`** → the parent page (the board shows the family; the fire skill auto-pulls the base).
- In Instructions, add a **REUSE / NEW map** — a short list of what's inherited vs net-new (footage ♻️ REUSE, narrator ♻️ REUSE, script 🆕 NEW…). Don't regen the base — that's the profit lever.
- In Copy, instead of a full script, give a **2-COLUMN delta table** keyed to the parent's line numbers: `Line # | the new/swapped line`. **Two columns only** — no Source column (the base line is one click away on the Parent link; repeating it bloats + risks drift).

## Step 6 — Create + confirm
Create the page, then confirm with the creator: the **display-name title**, the properties set, and the **request link** — plus a one-line "fires without a question" check (or name the one gap if the script is still pending a wr. skill). Don't stage or generate — that's `ag.stage` (a separate step the editor triggers).

## What this skill does NOT do
- **Write the content** — beats (`wr.beats`), AI script (`wr.aiscript`), LC podcast (`wr.pod.lc`), state batches (`wr.batches`). This builds the request shell + wires the script in.
- **Stage or generate** — `ag.stage` owns that.
- **Reformat live requests** — new/test only until the rollout is live (see the gate).
- **Touch `Asset Gen` or `Status` beyond `Requested`** — staging + the lifecycle own those.

## Cross-references
Encodes the locked design in `project_skills_workflow_audit` (the "NOTION REQUEST FORMAT — LOCKED" + naming sections). **🔴 THIS SKILL is the SOLE enforcement surface for the format (Sam 2026-07-13) — the VTM Notion page-template approach is DROPPED.** (Building the template by copying the callouts out of a scaffold row linked them as a Notion *synced block*; deleting/breaking the source orphaned every new request. Not worth the fragility.) The skill builds the full formatted body itself on every request, so there is NO Notion-template dependency — leave the VTM templates alone. Overlaps Dima's request/compliance lane — coordinate at his skill import.
