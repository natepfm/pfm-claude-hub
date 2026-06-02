---
name: notion-asset-delivery
description: PFM's delivery-comment poster for the Notion Video Task Manager. Posts the right house-format delivery comment to a VTM request — `✅ Assets Generated [folder ↗](link)` for a raw-asset handoff (Status untouched, no count) or `✅ Completed Creatives (#): [folder ↗](link)` for a finished-creative turn-in (Status → Done + Dima V/Gabriel Moss tags) — auto-building the LinkYourFile link from the folder path so the editor never hand-makes it. STATUS RULE (Sam 2026-06-01): a routine asset delivery leaves the request Status UNTOUCHED — dropping generated clips in the folder is a raw-asset handoff, not a finished creative, so the request stays "Requested." The skill sets Status → "Done" AND @-tags Dima V + Gabriel Moss ONLY when the editor explicitly asks to report a COMPLETED creative ("mark done", "report complete", "move to Done"). Use when an editor says "post the delivery comment", "deliver this to Notion", "drop the folder link on the request", "post completed creatives", "I'm done editing — post the delivery", or finishes a gen flow and wants to notify the requester — and, for the Done path, "mark <request> done" / "report this completed creative". Also auto-offered by hvg-flow at its final-report step; usable standalone anytime you have a delivered folder (after a vsl / hig batch or after an edit). The skill builds the link + composes the comment SILENTLY, then stops at ONE hard confirm (exact comment text + target request) before posting — it NEVER auto-posts. NOT for: building request pages or state batches (use notion-state-batches), generating the assets themselves (use hvg-flow / hig-flow / vsl-state-variations), or any comment other than a delivery notification.
---

# notion-asset-delivery

Posts the **delivery comment** to a Notion Video Task Manager request when creatives are done
and dropped in the project folder. Two things are tedious by hand and this skill does them for
you: (1) building the **LinkYourFile** folder link, and (2) composing the comment in PFM house
format. It does both silently, then stops at **one hard confirm** before posting. **It never
auto-posts** — a delivery comment is teammate-visible, so the editor signs off on the exact text
first.

## Status handling — DEFAULT is hands-off (Sam, 2026-06-01)

**Posting a delivery comment does NOT change the request Status.** Dropping the generated assets
in the folder and linking them is a *raw-asset handoff to the editor* — the finished **creative**
does not exist yet. So the request **stays at "Requested."** Do **NOT** flip it to "In progress"
or "Done" on a routine delivery. (Real bug: the skill used to auto-flip to "Done" on every post —
Sam caught it on the Sarah Herman state batches 2026-06-01 and had them reverted to "Requested.")

**"Done" is a separate, explicit action — never inferred.** Set **Status → "Done"** ONLY when the
editor/Sam explicitly asks to **report a completed creative** ("mark this done", "report complete",
"move it to Done"). When you do, the delivery comment **MUST @-tag BOTH** of these, every time:

- **Dima V** — `<mention-user url="65ec1d09-9170-4f79-a5cd-9b955e411b61"/>`
- **Gabriel Moss** — `<mention-user url="27dd872b-594c-81f8-bef8-0002275b5ee0"/>`

**⚠️ Mention syntax — pass the BARE UUID in `url=`, NEVER `user://<UUID>`.** `notion-create-comment`'s
markdown parser prepends `user://` itself; passing `user://<UUID>` stores `user://user://<UUID>` and
the tag silently fails — no chip, no notification (verified bug, 2026-06-01). So `url="65ec1d09-…"`,
not `url="user://65ec1d09-…"`. Same rule for the optional requester mention in Step 5.

(House rule, Sam 2026-06-01 — mirrors his own completed-creative deliveries, e.g. the Spanish Car
Chase Broad report. The two tags are mandatory on the Done path and are NOT the same as the
optional requester-mention below.)

**Two distinct events — never conflate them (this is the trap that caused the Sarah bug):**
1. **Asset generation / delivery** — Claude fires the clips/images, drops them in the folder, posts
   the **`✅ Assets Generated [folder ↗](link)`** comment (no count). A raw-materials handoff; **Status stays "Requested."**
   (The Sarah Herman clip batches were this — NOT a turn-in.)
2. **Turning in the project** — the completed creative is reported/delivered (Sam's call). This is
   the **routine close-out that fires EVERY time a project is turned in — not a rare exception:**
   the comment carries the **mandatory Dima V + Gabriel Moss tags** and Status flips → **"Done."**
   Never skip the tags on a turn-in, and don't treat the Done path as unusual — every finished
   project ends here.

## The two locked comment formats (Sam, 2026-06-01) — pick by event

Two distinct labels, one per event. Pick by **intent** (which of the two events above), NOT by file count.

**① Assets Generated** — a raw-asset handoff (gen flow finished / "post the assets" / "post the delivery"). **No count.** Status UNTOUCHED, no mandatory tags.

```
✅ Assets Generated [folder ↗](LinkYourFile link)
<any notes, one tight line each>
```

**② Completed Creatives** — a finished-creative report / turn-in ("report this", "mark done", "turn it in", "<project> is done"). Carries the **mandatory Dima V + Gabriel Moss tags** (leading) and flips **Status → Done**. Takes the `(#)` count.

```
<@Dima V> <@Gabriel Moss>
✅ Completed Creatives (#): [folder ↗](LinkYourFile link)
<any notes, one tight line each>
```

**Shared rules (both formats):**
- **`[folder ↗](link)`** — the LinkYourFile link, auto-generated from the folder path (see Step 2), rendered as a short hyperlink (label = folder / state name). **Never** a raw path or a 200-char raw URL.
- **`(#)`** — count of completed creatives, on **② only**; the file count is a **suggestion** (a "creative" may be several files — 16:9 + 9:16, multiple hooks — so the raw count is a hint, the editor sets the final number). **① Assets Generated takes NO count.**
- **`<notes>`** — optional, on either (most common on ① at handoff). Manual-fire flags / status notes in tight house style:
  - `Note: **L19 still needs a manual fire** — it repeatedly hit Veo's NSFW filter.`
  - `Update: **L40** also still needs a manual fire — same Veo NSFW-filter issue as L19.`
- **DO NOT** include: dialogue text, slide-vs-CTA backstory, "originally fired against Florida" context, a "— Claude, <date>" signature, or `⚠️`-heavy headers. Scannable status only — teammates (Nicolai, Dima, etc.) read these. (See `feedback_notion_manual_flag_comment_format`.)
- The **Dima V + Gabriel Moss tags appear ONLY on ②** (the Done path). An optional leading `@`-mention of the requester (Step 5) can go on either — separate from the mandatory pair.

**Worked examples:**

① Asset handoff (Status stays "Requested"):
```
✅ Assets Generated [Texas](https://linkyourfile.com/link?p=…)
Note: **L19 still needs a manual fire** — it repeatedly hit Veo's NSFW filter.
```

② Finished-creative turn-in (Status → Done):
```
<@Dima V> <@Gabriel Moss>
✅ Completed Creatives (4): [Texas](https://linkyourfile.com/link?p=…)
```

## Inputs — gather from context first, ask only for what's missing

1. **The Notion request page** — its VTM URL. In a chained session (a gen flow or edit just
   finished), it is **already in context — do NOT re-ask for it** (see
   `feedback_pfm_no_redundant_notion_redrop`). Only ask if the session started cold.
2. **The folder to link** — defaults to the current project folder (cwd). If the finished
   creatives live in a subfolder (e.g. `…/Creatives/<State>`), use that. Confirm if unsure.
3. **The count `(#)`** — suggested from a file count (Step 3); editor confirms/overrides.
4. **Notes** — from the just-run flow's manifest/QC (✗ rows / NSFW flags) if chained, or whatever
   the editor states. None is fine — omit the notes lines entirely.
5. **Delivery vs. completed-creative report** — is this a routine asset handoff (default → Status
   untouched) or did the editor explicitly say "mark done / report complete" (→ Status "Done" +
   Dima V & Gabriel Moss tags)? Default to routine unless the editor says otherwise.
6. **Who to @-mention** — optional requester mention; the request's Assignee by default (Step 5).

## Step 1 — Identify the request + folder (silent)

- Resolve the request page ID from the URL already in context (or the one the editor gives).
- Resolve the absolute folder path. Default to cwd; if the editor names a subfolder, join it.
  Confirm the path is inside the Lucid Link mount (`/Volumes/ads/…`) — that's what the link encodes.

## Step 2 — Build the LinkYourFile link (silent)

```bash
python3 ~/.claude/skills/notion-asset-delivery/linkyourfile.py "<absolute folder path>"
```

Prints the `https://linkyourfile.com/link?p=…` URL. The encoder is round-trip-verified against real
PFM delivery links (`--selftest`) — the `p=` param is the standard-base64 of the path, URL-encoded.
**Don't hand-build the link or paste a raw path** — always use the helper.

## Step 3 — Suggest the count (silent)

Count video deliverables in the folder as a hint for `(#)`:

```bash
find "<absolute folder path>" -maxdepth 1 -type f \( -iname '*.mp4' -o -iname '*.mov' \) | wc -l
```

Surface it as a suggestion in the preflight ("I count N video files — how many completed
creatives is that?"). **The editor's number wins** — never silently assume the file count is the
creative count. **Count applies to the finished-creative turn-in (② Completed Creatives) only — the ① Assets Generated handoff takes no count, so skip this step for a handoff.**

## Step 4 — Compose the comment (silent)

Assemble the markdown in the right format **for the event** (see "The two locked comment formats"):
- **Asset handoff (①)** → `✅ Assets Generated [folder ↗](link)` (no count) + any notes lines.
- **Finished-creative turn-in (②)** → prepend the mandatory Dima V + Gabriel Moss `<mention-user .../>` tags, then `✅ Completed Creatives (#): [folder ↗](link)` + any notes.

Notes lines are newline-separated, tight house style. Add the optional requester `@`-mention from Step 5 if used (either event).

## Step 5 — Preflight: show the exact comment, then WAIT (hard gate)

Show the editor, in **plain markdown chat** (NOT `AskUserQuestion` — see
`feedback_no_askuserquestion_in_pfm_flows`):

- the **exact comment text** that will post (rendered),
- the **target request** (title + URL),
- the resolved **count** and **folder link**,
- who (if anyone) will be **@-mentioned**,
- **what happens to Status** — say it explicitly: routine delivery → *"Status stays Requested
  (unchanged)"*; completed-creative report → *"Status → Done, tagging Dima V + Gabriel Moss"*,
- a one-line reminder that **this is a comment teammates will see**.

> Ready to post this to **<request title>**:
>
> > ✅ Assets Generated [Texas](https://linkyourfile.com/link?p=…)
> > Note: **L19 still needs a manual fire** — it repeatedly hit Veo's NSFW filter.
>
> _Asset handoff — the request **Status stays "Requested"** (unchanged)._ Reply `post` to send
> it, or tell me what to change (notes, tag, folder).

For a **completed-creative report**, the closing line instead reads:

> _Reporting a completed creative — this tags **@Dima V** + **@Gabriel Moss** and flips **Status →
> Done**._ Reply `post` to send it, or tell me what to change.

**Requester @-mention (optional):** to also notify the requester, `notion-fetch` the request page,
read its **Assignee / People** property → the user's id + name, and prefix the comment with
`<mention-user url="<id>"/>` (BARE UUID — never `user://<id>`; see the mention-syntax warning above). Confirm the name in the preflight. If there's no assignee, it's
ambiguous, or the editor declines, **post without it** — the page comment still notifies followers.

**Wait for an explicit `post` / `yes`.** Never post on inference. Posting a delivery comment is a
teammate-visible action — it requires the editor's explicit go every time.

## Step 6 — Post + confirm (status change ONLY on a completed-creative report)

1. Post the comment with `notion-create-comment` (page-level):

```
notion-create-comment(page_id="<request id>", markdown="<the composed comment>")
```

2. **Status:**
   - **Routine delivery (default): do NOTHING to Status.** The request stays "Requested." This is
     the common case (a gen flow just handed off clips).
   - **Completed-creative report ONLY** (editor explicitly said mark-done / report-complete, and the
     comment already carries the Dima V + Gabriel Moss tags): flip **Status → "Done"**:

```
notion-update-page(page_id="<request id>", command="update_properties",
                   properties={"Status": "Done"})
```

If the Status write errors (e.g. "Done" isn't a valid option on that data source — some boards use
"Completed"/"Delivered"), post the comment anyway, then tell the editor the status couldn't
auto-flip and ask which option to use. Don't let a status hiccup block the delivery comment.

3. Confirm to the editor: the posted comment's URL, and — only if you changed it — "Status → Done."
   For a routine delivery, explicitly note "Status left at Requested." Done.

## What NOT to do

- **Never auto-post.** The preflight confirm in Step 5 is mandatory, every time.
- **Never change the request Status on a routine delivery** — it stays "Requested." Status → "Done"
  happens ONLY on an explicit completed-creative report, and that comment MUST tag Dima V + Gabriel
  Moss. (Don't flip to "In progress" either — gen/delivery is hands-off on Status.)
- **Never paste a raw path or raw URL** as the link — always the LinkYourFile helper output,
  rendered as a short labeled hyperlink.
- **Never invent the count or the notes.** The count is editor-confirmed; notes come from the
  flow's manifest/QC or the editor. No backstory, no dialogue, no signature, no `⚠️` headers.
- **Don't re-ask for the Notion URL or project folder** mid-session — they persist across chained
  skills (see `feedback_pfm_no_redundant_notion_redrop`).
- **Don't post anything other than a delivery comment** with this skill. Revisions, questions, or
  threaded replies are out of scope.

## Cross-references

- `hvg-flow` auto-offers this skill at its final report. Usable standalone after any other flow
  (`vsl-state-variations`, `hig-flow`) or after an edit — just invoke it with the request + folder.
- `notion-state-batches` — builds the request pages (this skill closes them out).
- Memory: `feedback_notion_request_status_lifecycle` (the status rule + Dima V / Gabriel Moss tag
  IDs), `feedback_notion_manual_flag_comment_format` (house format + the LinkYourFile link fact),
  `feedback_pfm_no_redundant_notion_redrop`, `feedback_no_askuserquestion_in_pfm_flows`.
