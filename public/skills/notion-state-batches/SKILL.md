---
name: notion-state-batches
description: PFM's state-continuation batch builder for the Notion Video Task Manager. Takes a completed "Batch 1" creative request (broad + first 5 states) and produces the state-continuation batches (Batch 2-6, closing all 50 states) — or a named variant like a reaction-hook version — mirroring PFM's locked state-batch conventions (the pattern originated with Breaking News but applies to any creative-type state batch). Use this whenever an editor drops a Notion Video Task Manager "Batch 1" URL and says any of "make batches 2-6", "make the state continuations", "do more states", "make a state-specific version", "scale this to all 50 states", "add a reaction hook variant", or pastes a Batch 1 link and asks to build the follow-on batches. Also use when a Batch 1 master script gets revised and the existing state batches need to be re-synced to match. Handles the locked state cadence (B2=10, B3=10, B4=10, B5=5, B6=10 Final), the 4-callout page structure, per-state toggles, a/an article handling, dropping duplicate states + adding the orphan to Batch 6 for full 50-state coverage, the single-user-create + multi-user-update dance, and sequential firing so cross-batch links resolve. NOT for: writing an original Batch 1 from scratch (hand-crafted per concept — build manually or via iterate-creative), Spanish translation (use spanish-translation), or generating the actual videos (use hvg-flow).
---

# Notion State Batches (PFM)

Build the state-continuation batches for a PFM creative once Batch 1 is locked. The pattern originated with Breaking News, but it applies to any creative-type state batch (podcast, VSL, UGC, etc. — the fan-out mechanics are identical). Editor drops the Batch 1 Notion URL, you read its master script + properties, then produce Batches 2-6 (and optional variants) that mirror it — same script, only the per-state variables swapped, following the locked state cadence that every Auto/Home state portfolio uses.

The whole point: Batch 1 is the creative work (concept, script, talent, footage). Batches 2-6 are mechanical fan-out — same package, new states. This skill makes that fan-out fast and consistent so it stops eating editor time and stops drifting between stories.

**Architecture:** Notion MCP only — `notion-fetch` (read Batch 1 + prior batches), `notion-create-pages` (fire each batch), `notion-update-page` (multi-user assignment + master re-syncs). No CLI, no other tools.

**Trigger phrases:** "make batches 2-6", "make the state continuations", "do more states", "make a state-specific version", "scale this to all 50 states", "add a reaction hook variant" — or any time an editor pastes a Video Task Manager Batch 1 URL and asks for the follow-on batches.

## Why this skill exists / what to protect

These requests go into a **live, shared production database** that other editors read and act on. Two consequences drive everything below:

1. **Don't create junk.** Every page you fire is real work someone may pick up. Confirm before mass-creating, and never leave half-built or duplicate batches lying around.
2. **Consistency is the product.** The value is that Car Chase, Car Repo, Karen HOA, and every future BN run share the exact same state cadence and structure, so performance is comparable across stories. Don't freelance the cadence or the page shape.

## Execution model — confirm Batch 2, then fire the rest

The locked workflow Sam uses: **build Batch 2 first, show it, get a yes, then fire Batches 3-6 in one pass.** Batch 2 is the proof that you've read the master correctly and the structure is right. Once it's approved, the rest are the same machine with different state lists, so they don't each need a sign-off.

Do NOT use AskUserQuestion cards for any of the confirmations — Sam dislikes them. Render every choice as plain markdown in chat.

Step by step:

1. **Fetch Batch 1** with `notion-fetch`. Read: the master script (state version), the per-state fill format, which line numbers are the state variables, the properties (Vertical, Priority, assignee), the footage style note, and the talent list. Note the story's 5 Batch-1 states.
2. **Determine the cadence + dupes.** Lay the Car Chase cadence (see `references/state-cadence-and-data.md`) over the story. If any Batch 2-6 state is already in this story's Batch 1, drop it from its batch and note the orphan (see Dupe handling below).
3. **Build Batch 2** (10 states) and show the editor the link + a short readback. Stop here for a yes.
4. **On approval, fire Batches 3, 4, 5, 6** sequentially (sequential matters — see Cross-batch chaining). Report all links + a coverage tally at the end.

If the editor explicitly says "fire all of them" up front, you can skip the Batch-2 stop — but still build them sequentially.

## The locked state cadence

Every BN portfolio uses the **same** state distribution, mirroring the original Car Chase BN, so stories are directly A/B comparable. The full state lists, suggested cities, and article handling live in `references/state-cadence-and-data.md` — read it before building. Summary:

| Batch | Count | States |
|---|---|---|
| Batch 1 | 5 | (already done — varies per story) |
| Batch 2 | 10 | VA, UT, ID, KS, AZ, MD, MI, MO, IL, NM |
| Batch 3 | 10 | IA, GA, OH, NE, OR, MN, AL, TN, MA, WI |
| Batch 4 | 10 | OK, IN, AR, DE, ME, WV, NV, CT, KY, NC |
| Batch 5 | 5 | NY, CA, NJ, SC, LA (held-back high-volume states) |
| Batch 6 (Final) | 10 | MS, RI, SD, HI, MT, NH, AK, ND, WY, VT |

Videos per batch = states × 2 (one vertical 9:16 + one horizontal 16:9 per state).

**Cities and dollar numbers are NOT fixed by this skill** — they depend on the story's vertical (Auto vs Home use different Bankrate averages, and sometimes different cities, e.g. Texas → Austin for Auto, Houston for Home). Pull them from Batch 1's own table where it overlaps, and from the per-vertical reference tables in `references/state-cadence-and-data.md` for the new states. The cadence (which states land in which batch) is the locked part; the numbers are looked up per vertical.

## Dupe handling + 50-state coverage

Batch 1's 5 states are chosen per-story and won't always match Car Chase's Batch 1. When a story's Batch 1 used a state that the cadence assigns to a later batch:

- **Drop the dupe** from that batch (e.g., Karen HOA Batch 1 used Oklahoma, so Karen HOA Batch 4 drops Oklahoma → 9 states / 18 videos). Do not insert a replacement to force the count back to 10 — Sam confirmed he wants it dropped, not swapped.
- **Catch the orphan.** If Batch 1 swapped IN a state that ISN'T in Car Chase's Batch 1, then Car Chase's Batch-1 state it replaced is now uncovered. Add that orphan to Batch 6 so the final set still closes all 50 states. Call it out explicitly in Batch 6's Instructions (e.g., "+ Washington — added to close the 50-state gap").

Always end Batch 6 with a coverage check: Batch 1 (5) + 2 + 3 + 4 + 5 + 6, minus dupes, plus orphans, should equal 50 unique states. If it doesn't, say so.

## Naming + spec properties (request format is LIVE — 2026-07-13)

Each batch is a **derivative** of Batch 1, so it's born in the locked request format (grammar per [[wr.request]]):

- **Title = display-name grammar** — `[Platform - ] <Creative Type> - <Concept> - <variant tail>`, plain ` - ` hyphens, **never em dashes**. The variant tail on a state batch = the **Batch** token (`B2`, `B3`…); the states live in the body, not the title, when there are more than two. Pull Creative Type + Concept from Batch 1 verbatim — only Batch/Geo vary. (If Batch 1's title predates the format, still write the NEW batch titles in-grammar.)
- **Spec properties (rich-text, non-defaults ONLY — blank = default):** set on each batch at creation — `Creative Type` + `Concept` inherited from B1, `Batch` = `B2`/`B3`/…, `Geo` = the batch's states (leave blank if the set is Broad). Leave Platform/Language/Aspect blank unless they deviate.
- **`Parent Creative` relation → Batch 1** — set every batch's Parent Creative to the B1 page (the profit-lever relation: the board shows the family, the fire skill auto-pulls the base). Set it with `notion-update-page` after create (relation value = the B1 page ID). B1 is the parent; B2–B6 are its variants.

Everything below (the 4 callouts, assignee dance, coverage check) is unchanged.

## Page structure — 4 callouts, in this order

Every batch page is created under data source `18a16771-e780-81fb-9293-000b742fce5e` with icon `🎞️` and these four callouts. The exact icon URLs matter (they render the colored chips). Match Batch 1's Vertical, Priority, and Content properties; Status is always `Requested`.

1. **Instructions** — `<callout icon="/icons/question-mark_orange.svg" color="gray_bg">`
   - "Same as Batches 1-N" + `<mention-page>` links to ALL prior batches in the chain
   - "Already done — do NOT redo" list, broken out by batch
   - "Batch N = X NEW states only" + the numbered state list
   - Deliverables count (states × 2)
   - Talent REUSE list (pull the exact roles from Batch 1 — Anchor, Field Reporter, Hero, Subject, Antagonist)
   - The state-variable line numbers (e.g., **L2, L3, L11, L23**)
   - "Sister Breaking News in market — for direct A/B" links to the same-numbered batch of other BN stories when they exist (Car Chase / Car Repo / Karen HOA)
2. **Assets** — `<callout icon="/icons/cassette_orange.svg" color="gray_bg">`
   - "Master script — pull from Batch 1" + mention-page
   - State averages source (Bankrate)
   - Footage style note (copy the story's note from Batch 1 — doorbell POV, smart-glasses POV, phone footage, garage-sale aesthetic, etc.)
3. **Examples** — `<callout icon="/icons/attachment_orange.svg" color="gray_bg">`
   - Format precedent (Batch 1 + prior batches) + sister BN links
   - The line: "Build each Batch N state exactly like the earlier batches. Horizontal cuts should look like they were framed 16:9 from the start, not cropped down from vertical."
4. **Copy** — `<callout icon="/icons/pencil_orange.svg" color="gray_bg">`
   - "Master script = IDENTICAL to Batch 1. Do not rewrite." + mention-page
   - "Only the X state-variable lines change per state: **L#, L#, L#, L#**." + the 4 state variables (STATE, CITY, STATE ANNUAL RATE, STATE MONTHLY RATE)
   - **Article note** — list which states in THIS batch take "an" (see article rule below)
   - "Same energy every state" reminder
   - On-screen graphic precise numbers list (exact Bankrate avg per state)
   - State variable reference table (4 columns: State / CITY / ANNUAL / MONTHLY, VO-rounded values)
   - One toggle per state (see per-state toggle format)
   - TEXT HOOKS toggle (Primary + Alt A + Alt B with [STATE] token — copy from Batch 1)

### Per-state toggle format

Each state shows ONLY the lines that actually change — the editor pulls everything else from the Batch 1 master. Indentation is one tab for the `###` header, two tabs for the lines inside.

```
### N. STATE NAME {toggle="true"}
		**State-variable lines only** (L#, L#, L#, L#). All other lines match the Batch 1 master template.
		1. <span underline="true">Steve (at desk):</span> <span color="yellow_bg">[line with [STATE] swapped]</span>
		2. <span underline="true">Rachel Torres (live standup):</span> <span color="yellow_bg">[line with [CITY] swapped]</span>
		3. <span underline="true">Rachel Torres (VO):</span> <span color="yellow_bg">[rate line with [STATE] + annual + monthly]</span>
		4. <span underline="true">Steve (at desk):</span> <span color="yellow_bg">[closing line with [STATE]]</span>
```

The sub-numbers (1-4) are just display order; the `(L#, L#, ...)` descriptor tells the editor which master lines they map to. The line wording, speaker labels, and which lines are state-variable all come from Batch 1 — read them off the master, don't invent them. Different stories have different state-variable lines (Car Chase: L2/L3/L9/L12/L21/L22; Car Repo: L2/L3/L11/L14/L22/L23; Karen HOA: L2/L3/L11/L23). Mirror whatever Batch 1 uses.

### VO numbers vs graphic numbers

- **Spoken VO** uses rounded numbers: "over $X,X00" a year, "over $XXX" a month.
- **On-screen graphic** shows the exact Bankrate state average (e.g., $3,536/yr · $295/mo).
- The state variable reference table holds the VO-rounded values; the graphic-numbers list holds the exact ones.

### Article handling (a/an)

The intro and closing lines usually read "a [STATE] homeowner/driver" or "If you're a [STATE]..." Vowel-SOUND states take "an": **Alabama, Alaska, Arizona, Arkansas, Idaho, Illinois, Indiana, Iowa, Ohio, Oklahoma, Oregon.** Everyone else takes "a" — including Utah ("a Utah", Y-sound). The rate line ("The average [STATE] homeowner...") has no article, so it's never affected. Call out the "an" states for the batch in the Copy section's article note so the editor doesn't miss them.

## Assignee — every Requested request MUST have one (the create + update dance)

**Hard rule (Sam, 2026-06-02): never create a Requested VTM request with an empty assignee.** The assignee is the people property named `""` (blank-name field — see `feedback_notion_request_status_lifecycle`). `notion-create-pages` accepts only ONE user UUID (comma-separated or `user://`-prefixed both fail validation), so:

1. **Carry Batch 1's assignee.** Read Batch 1's `""` people property and create each new batch assigned to it: `"": "<batch-1-assignee-uuid>"`. Add any additional assignees with `notion-update-page` using a JSON-array-as-string: `properties: {"": "[\"<uuid1>\", \"<uuid2>\"]"}`.
2. **If Batch 1 has NO assignee — ASK the editor who should own these before you finish.** Do NOT default to Sam-only, do NOT leave it blank. (Supersedes the old "Sam-only, don't ask" default — that left the Home Moving States B1/B3-B7 with no editor, which Sam flagged 2026-06-02.)
3. **Look up a UUID with `notion-search` `query_type: "user"`** — it returns guests too. `notion-get-users` only lists org-domain members and silently drops Gmail-domain editors (e.g. Nicolai), so don't trust it for the roster. (Sam's own UUID, if needed: `2804532e-3881-4d79-9b82-5a322ce4db00`.)

## Cross-batch chaining — fire sequentially

Each batch's Instructions and Examples sections link to ALL prior batches via `<mention-page>`. You only know a batch's URL after it's created, so **create them in order** (2 → 3 → 4 → 5 → 6), feeding each new URL into the next batch's references. Don't fire them in parallel or the links won't resolve. Also link the same-numbered batch of sister BN stories (Car Chase / Car Repo / Karen HOA) when they exist, since the whole portfolio is run for A/B comparison.

## Reaction-hook variant (and other named variants)

Sometimes the ask isn't "next batches" — it's a variant of an existing batch that adds something to the front. The reaction-hook variant is the established one:

- It's a **new standalone request** (usually a clone of Batch 1, broad + its 5 states), not a new batch in the 2-6 chain.
- Add a **REACTION HOOKS toggle directly above the [MASTER TEMPLATE] toggle** in the Copy section. It holds the broad hook, the `This [STATE]...` master hook, and per-state copy-paste fills.
- Lead state hooks with "This [STATE]" so there's no a/an swap needed.
- Each state toggle also gets a `**Reaction hook:**` line at the top showing its filled hook in context.
- Title it descriptively (e.g., "Stories - [Name] - Reaction Hook - Breaking News - Batch 1").
- Keep the hook story-framed (curiosity/drama), never an insurance rate claim — the offer mechanics stay inside the news package.

For any other variant the editor describes, the same principle holds: clone the right base, add the new element where they want it, keep everything else identical to the source.

## Re-syncing batches when the master changes

If Batch 1's master script gets revised after the state batches already exist, **update the existing batches — don't create duplicates.** They already have the right metadata (state lists, cross-refs, deliverables); only the wording is stale.

- Use `notion-update-page` with `update_content` and `replace_all_matches: true` so one operation fixes the same line across all states in a batch.
- Typical edits: descriptor line-number bumps, a line that got split, a prefix/suffix added or removed, a sign-off line dropped.
- You can run the update across all affected batches (2-6) in parallel since each is an independent page (parallel is fine for UPDATES — only CREATES need to be sequential for the cross-links).
- Spot-check one batch with `notion-fetch` afterward to confirm the replace landed.

## After firing — verify + report

- Fetch the just-built Batch 2 (and at least one later batch) to confirm the toggles and properties rendered.
- Report every batch as a clickable link, with its state list and video count.
- Give the coverage tally (should reach 50 unique states at Batch 6).
- Confirm every batch has an assignee — a Requested request is never left blank (if Batch 1 was unassigned, you should have asked who to assign at creation).

## Reference

`references/state-cadence-and-data.md` — the locked Batch 2-6 state lists, suggested cities per vertical (Auto + Home), the Bankrate VO-rounded + graphic numbers we've used, and the full a/an article list. Read it before building any batch.
