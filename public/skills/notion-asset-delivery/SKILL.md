---
name: notion-asset-delivery
description: PFM's delivery-comment poster for the Notion Video Task Manager. Posts the house-format "✅ Completed Creatives (#): <LinkYourFile folder link>" comment (plus any manual-fire / status notes) to a VTM request — auto-building the LinkYourFile link from the folder path so the editor never hand-makes it. Use when an editor says "post the delivery comment", "deliver this to Notion", "mark [request] delivered", "drop the folder link on the request", "post completed creatives", "I'm done editing — post the delivery", or finishes a gen flow / an edit and wants to notify the requester. Also auto-offered by hvg-flow at its final-report step; usable standalone anytime you have a delivered folder (after a vsl / hig batch or after an edit). The skill builds the link + composes the comment SILENTLY, then stops at ONE hard confirm (exact comment text + target request) before posting — it NEVER auto-posts. NOT for: building request pages or state batches (use notion-state-batches), generating the assets themselves (use hvg-flow / hig-flow / vsl-state-variations), or any comment other than a delivery notification.
---

# notion-asset-delivery

Posts the **delivery comment** to a Notion Video Task Manager request when creatives are done
and dropped in the project folder. Two things are tedious by hand and this skill does them for
you: (1) building the **LinkYourFile** folder link, and (2) composing the comment in PFM house
format. It does both silently, then stops at **one hard confirm** before posting. **It never
auto-posts** — a delivery comment is teammate-visible, so the editor signs off on the exact text
first.

## The locked comment format (Sam, 2026-05-31)

```
✅ Completed Creatives (#): <LinkYourFile folder link>
<any notes, one tight line each>
```

- **`(#)`** — number of completed creatives delivered. The skill counts the video files in the
  folder as a **suggestion**; the editor sets the final number (a "creative" may be several files —
  16:9 + 9:16, multiple hooks — so the raw file count is only a hint).
- **`<LinkYourFile folder link>`** — auto-generated from the folder path (see Step 2). Rendered as a
  short hyperlink (label = folder / state name), **never** a pasted raw path or a 200-char raw URL.
- **`<notes>`** — optional. Manual-fire flags or any status note, in tight house style:
  - `Note: **L19 still needs a manual fire** — it repeatedly hit Veo's NSFW filter.`
  - `Update: **L40** also still needs a manual fire — same Veo NSFW-filter issue as L19.`
- **DO NOT** include: dialogue text, slide-vs-CTA backstory, "originally fired against Florida"
  context, a "— Claude, <date>" signature, or `⚠️`-heavy headers. Scannable status only —
  teammates (Nicolai, Dima, etc.) read these. (See `feedback_notion_manual_flag_comment_format`.)

Optional leading `@`-mention of the requester (see Step 5) so they get notified.

**Worked example** (Texas Auto VSL, 4 creatives, one line still needs a manual fire):

```
✅ Completed Creatives (4): [Texas](https://linkyourfile.com/link?p=…)
Note: **L19 still needs a manual fire** — it repeatedly hit Veo's NSFW filter.
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
5. **Who to @-mention** — optional; the request's Assignee by default (Step 5).

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
creative count.

## Step 4 — Compose the comment (silent)

Assemble the markdown exactly in the locked format: the `✅ Completed Creatives (#):` line with the
folder linked as a short label, then any notes lines (newline-separated, tight house style). Prefix
with the `@`-mention from Step 5 if used.

## Step 5 — Preflight: show the exact comment, then WAIT (hard gate)

Show the editor, in **plain markdown chat** (NOT `AskUserQuestion` — see
`feedback_no_askuserquestion_in_pfm_flows`):

- the **exact comment text** that will post (rendered),
- the **target request** (title + URL),
- the resolved **count** and **folder link**,
- who (if anyone) will be **@-mentioned**,
- a one-line reminder that **this is a comment teammates will see**.

> Ready to post this to **<request title>**:
>
> > ✅ Completed Creatives (4): [Texas](https://linkyourfile.com/link?p=…)
> > Note: **L19 still needs a manual fire** — it repeatedly hit Veo's NSFW filter.
>
> Tagging **@<assignee>**. Reply `post` to send it, or tell me what to change (count, notes, tag, folder).

**@-mention resolution (optional):** to notify the requester, `notion-fetch` the request page, read
its **Assignee / People** property → the user's id + name, and prefix the comment with
`<mention-user url="user://<id>"/>`. Confirm the name in the preflight. If there's no assignee, it's
ambiguous (multiple people), or the editor declines, **post without a mention** — the page comment
still notifies followers.

**Wait for an explicit `post` / `yes`.** Never post on inference. Posting a delivery comment is a
teammate-visible action — it requires the editor's explicit go every time.

## Step 6 — Post + confirm

Post with `notion-create-comment` (page-level):

```
notion-create-comment(page_id="<request id>", markdown="<the composed comment>")
```

Then confirm to the editor with the posted comment's URL. Done.

## What NOT to do

- **Never auto-post.** The preflight confirm in Step 5 is mandatory, every time.
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
- Memory: `feedback_notion_manual_flag_comment_format` (house format + the LinkYourFile link fact),
  `feedback_pfm_no_redundant_notion_redrop`, `feedback_no_askuserquestion_in_pfm_flows`.
