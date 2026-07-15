---
name: pfm-naming
description: "[system-wide reference — THE single source for PFM naming] The locked naming convention for every PFM surface: Notion request title (display name), project folder, DaVinci timeline, and creative/export filename. Use whenever anyone asks to name (or check the name of) a timeline, export, creative, project folder, or Notion request — \"what do I name this timeline\", \"name this export\", \"what's the folder called\", \"is this named right\", \"naming convention\" — or whenever ANY skill creates/renames one of those things. Carries the display-name vs Full-Name distinction, the VARIABLE slot (per-timeline state or text hook), the Video(s)-tail strip rule, and worked examples. Locked by Sam 2026-07-14."
---

# PFM Naming — the locked convention (Sam, 2026-07-14)

One system across Notion, Lucid, DaVinci, and exports. Four renderings, each derived from the request's spec properties. **Separator everywhere: ` - ` (space-hyphen-space) — NEVER flush dashes (`Home-Forms-…` is a legacy mistake), NEVER em dashes.** Defaults stay invisible (English / 9:16-platform-default / Facebook / Broad never render).

## The four renderings

| Surface | Format |
|---|---|
| **1. Request title** (Notion page title) | `[Platform - ] Creative Type - Concept [ - variant tail]` |
| **2. Project folder** | `MM.DD.YY - [Platform - ] Creative Type - Concept [ - tail]` |
| **3. Timeline** (DaVinci) | `Vertical - Lead - [Platform] - VARIABLE - Creative Type - Concept - [tail] - MM.DD.YY` |
| **4. Creative / Export filename** | = the timeline name, verbatim (exports render by timeline name) |

## 1 — Request title = the DISPLAY NAME (not the Full Name)

Two different names live on a request — don't conflate them:
- **Display name** = the page TITLE a human writes/reads on the board: `[Platform - ] Creative Type - Concept [ - variant tail]`. **No Vertical/Lead** — the board's property chips already show those. The **variant tail** is whatever actually varies on this request (Batch `B1`, Geo, Language, Hook Tests, Character — the differentiator).
- **Full Name** = the auto FORMULA property (Dima's) that prepends `Vertical - Lead - ` and appends ` - N Video(s)`. Nobody types it; it exists for board sorting. **🔴 The ` - N Video(s)` tail is a display artifact — it NEVER carries into any folder / timeline / creative / export name.**

Examples:
- `LC2VID - Podcast - Car Chase - B1`
- `Roku CTV - QVC - SaveMax Live - Houston`
- `Breaking News - Car Repo - Spanish`
- `UGC Interview - House Party`

## 2 — Project folder

`MM.DD.YY - <display name>` — the date, then the display name. **No Vertical/Lead** (folders live inside the vertical's tree already); a specified Platform leads. **No VARIABLE** — one folder holds ALL its timelines/states.

Examples:
- `07.14.26 - LC2VID - Podcast - Car Chase - B1`
- `07.14.26 - Roku CTV - QVC - SaveMax Live`
- `07.14.26 - Breaking News - Car Repo - Spanish`
- `07.14.26 - UGC Interview - House Party`

## 3 + 4 — Timeline / Creative / Export (one rule for all three)

`Vertical - Lead - [Platform] - VARIABLE - Creative Type - Concept - [tail] - MM.DD.YY`

- **Front cluster** = `Vertical - Lead` (e.g. `Auto - Forms`, `Home - Calls`) + Platform only when specified (`Auto - Calls - Roku CTV`). This name is the creative's export identity, so unlike the folder it carries **every** value.
- **VARIABLE** = the ONE thing that changes per timeline within the project: the **state** (each state-swap = its own timeline) or the **text hook** (`H1`/`H2`/`H3`). Only this segment differs across a project's timelines — everything else stays identical so they sort cleanly in DaVinci.
- **Tail** = any remaining variant tokens from the request (Batch, Language…), defaults omitted.
- **Ends with the date** `MM.DD.YY`, matching the project folder's date.
- 🔴 Strip the Full-Name formula's ` - N Video(s)` tail. 🔴 Never a compact code (`AU-F-…`) — that's an internal identifier only.

Examples:
- `Auto - Forms - Texas - LC2VID - Podcast - Car Chase - B1 - 07.14.26` *(state VARIABLE)*
- `Auto - Forms - H2 - LC2VID - Podcast - Car Chase - B1 - 07.14.26` *(text-hook VARIABLE)*
- `Auto - Calls - Roku CTV - Houston - QVC - SaveMax Live - 07.14.26` *(platform + state)*
- `Home - Forms - Broad - Breaking News - Karen HOA - Spanish - 07.14.26` *(base cut + language tail)*

## Who defers here

This skill is the **single source**. `wr.request` (request titles + the Examples-callout creative-name example), `stage-request` (folders), `claude-editor` (timelines), `/e.export` (filenames = timeline name, natively) all follow this page — if any of them disagrees, THIS page wins and the other needs updating.
