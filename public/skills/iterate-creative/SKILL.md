---
name: iterate-creative
description: |
  Create iteration requests in the Notion Video Task Manager for winning ad creatives. Use this skill whenever the user wants to: scale a winning ad by doing more states, create a Spanish translation of a working request, pivot a working concept to a different vertical (e.g. auto → home), adapt a request for a different offer type (e.g. Forms → Calls), duplicate a batch and do the next batch of states, or create any variation of an existing creative request in Notion. Trigger on phrases like "iterate", "do more states", "Spanish version", "calls version", "duplicate this request", "batch 2", "scale this", "this one's working let's do more", or any reference to creating variations of existing Video Task Manager requests. Also trigger when the user pastes a Notion link to a Video Task Manager request and wants to build off it.
---

# Iterate Creative — Video Task Manager Workflow

> **PFM FORK — 2026-07-29.** Forked from the bundled vendor copy so PFM owns and distributes it.
> The vendor copy lives in an ephemeral session cache and cannot be edited durably. Change vs the
> vendor version: **Step 3.5 — the 🎬 Editor Kit** (asset provenance at request birth: timelines
> AND elements). Maintainer: Gabe M. Everything else is unchanged from the original.

You are helping Dima scale winning ad creatives by creating iteration requests in the Notion Video Task Manager. The core loop is simple: something is working → create a new request that builds on it with variations.

## How This Works

Dima identifies winners from the ads manager, then tells you what iteration he wants. You fetch the original request from Notion, understand its structure, and create a new request that preserves everything that made it work while changing only the variables he specifies.

The thinking behind this: affiliate marketing at scale is about finding what works and doing more of it, fast. Every hour between "this is working" and "we have 10 more variations running" is money left on the table. Your job is to make that gap as close to zero as possible.

## Step 1: Understand the Request

When Dima gives you a winning request (usually a Notion link or a name to search for), fetch it immediately using `notion-fetch`. You need to understand:

- The full page content (Instructions, Assets, Examples, Copy sections)
- All properties (Vertical, Videos count, Priority, assigned people, Status)
- The script/copy in detail — you'll need this for translations or adaptations

## Step 2: Determine the Iteration Type

Dima will tell you what he wants, but it usually falls into one of these patterns:

### More States (Batch Continuation)
The simplest iteration. Same everything, just more states from the top states list.

- **Naming**: Add "Batch 2", "Batch 3", etc. OR add "2", "3" to the end of the name
- **Instructions**: "Same as this project: [link to original]. Just do more states." Then list which states were already done, and list the new states.
- **Copy**: Point back to the original ("Same as Batch 1: [link]")
- **Properties**: Identical to original. Videos count = number of new states.
- **Assigned**: Same person as original unless Dima specifies someone else

### Spanish Translation
A working English request gets a Spanish version.

- **Naming**: Add "SPANISH" before the vertical keyword (e.g., "Stories - SPANISH Auto Body Shop")
- **Instructions**: "Same thing as this project but now in spanish: [link to English version]" plus production-specific notes
- **Copy**: Translate the full script to localized US Spanish. Use natural, conversational American Spanish — "carro" not "coche", "manejas" not "conduces". Keep proper nouns, brand names, and state names in English. Put the Spanish script first, then the English version below labeled "English Version for Reference"
- **Translation notes to include**: If there are character names, make them placeholders [NOMBRE] and provide example Spanish names (male: Diego, Carlos, Miguel, Alejandro, Javier, Luis, Mateo, Rafael; female: Sofia, Valentina, Camila, Isabella, Lucia, Mariana, Gabriela, Andrea)
- **Properties**: Same Vertical, Content, Priority. Videos count may differ.
- **Spanish requests are typically BRANDLESS** — no brand names like "Save Max Auto" etc. Note this in the instructions.
- **Production notes**: Specify whether to use Sora (generate actors speaking Spanish from scratch) or Eleven Labs (regenerate voiceover from Spanish script). Ask Dima if not clear.

### Vertical Pivot
A concept that works for one vertical gets adapted for another (e.g., auto body shop → real estate office for home insurance).

- **Naming**: Replace the vertical identifier in the name (e.g., "Stories - Home Real Estate Office")
- **Instructions**: "Same concept as this project but for [new vertical] in a [new setting]: [link to original]." Describe the new environment and character types.
- **Copy**: Rewrite the script for the new vertical. Change the product details, dollar amounts, and CTA to match the new offer.
- **Properties**: Update Vertical to the new one. Adjust Videos count as specified.

### Aspect Ratio / Format Variation
A working vertical (9:16) video gets a horizontal (16:9) version, or vice versa.

- **Naming**: Add "Horizontal" or the format descriptor to the name (e.g., "50 States - BRANDLESS Spanish Best State Podcast - Horizontal")
- **Instructions**: "Can we please get horizontal 16x9 versions of these videos from this project: [link]. Same exact everything but optimized for horizontal as if it was made like that off the bat."
- **Copy**: Same as the original
- **Properties**: Same Vertical, Content, Priority. Videos count matches the number of states/videos being reformatted.

### Combo Creative (Mashing Two Winners Together)
Two different winning creatives get combined into a single video (e.g., podcast edit on top half + satisfying broll on bottom half).

- **Naming**: Combine the two concept names (e.g., "50 States - Auto Best State Podcast + Satisfying Video")
- **Instructions**: Reference BOTH original projects, explain which element comes from each, and how they're combined. Loom video walkthroughs may be included.
- **Copy**: Usually uses the audio/script from one of the two originals
- **Properties**: Videos count matches state count being done

### Group State Variation
Instead of one state per video, group 3 states together per video.

- **Naming**: Add "GROUP" to the name (e.g., "50 States - Home Best GROUP State Satisfying Video")
- **Instructions**: Reference the single-state original, explain we're now doing groups of states. List the specific groups.
- **Copy**: Adapt the script to reference multiple states — "The best states to own a home in right now are STATE, STATE, and STATE"
- **Properties**: Videos count = number of groups, not number of states

### Duration Variation
A working creative gets cut to a shorter format (e.g., 30-second version).

- **Naming**: Add the duration (e.g., "50 States - Home Average State Podcast - 30 Seconds")
- **Instructions**: Reference the original and specify the target duration. Note what to keep and what to cut.

### Offer Type Adaptation (Forms → Calls or vice versa)
Same creative concept but for a different offer type.

- **Naming**: Add "Calls" or "Forms" to distinguish
- **Instructions**: "Same concept as this project but adapted for [Auto Calls / Auto Forms]: [link]." List the key differences.
- **Copy**: Adapt the script. The main changes are in the CTA and dollar amounts.

**Key differences between Forms and Calls:**

| | Forms | Calls |
|---|---|---|
| CTA | Fill out the form / enter info on the site | Click the link below and CALL |
| Urgency | No urgency or time-pressure language | "Call before they close at 5 PM today" (this is the ONLY approved urgency line — only for Auto Calls) |
| Time frame | "Takes 30 seconds" / "Takes 5 minutes" | "Only takes about 5 minutes on the phone" |

**No fake urgency.** Do not add urgency language to any creative. The only approved urgency is "call before they close at 5 PM today" and that is exclusively for Auto Calls. No countdown timers, no "limited time", no "offer expires", no "spots filling up" — none of that in any vertical.

## Step 3: Check Compliance Numbers

Before writing or adapting any script, check the approved numbers for the target vertical. These are hard limits — never go below the minimum rate or use unapproved savings claims.

### Auto Forms
- Rate as low as **$30**/month
- Save up to **$800**/year
- Drivers who switch save nearly **$950** on average

### Auto Calls
- Rate as low as **$50**/month (NEVER below $50)
- Save up to **$713**/year
- Drivers who switch save nearly **$713** on average

### Home Forms
- Rate as low as **$30**/month
- Rate as low as **$360**/year
- Save up to **$800**/year
- Homeowners who switch save nearly **$950** on average

When pivoting scripts between verticals, update ALL dollar amounts to match the target vertical.

### Qualifier Lines by Vertical
Each vertical has a different "catch" / qualifier in the script:
- **Auto**: "The catch is you need to have zero DUI's in the last 5 years"
- **Home**: "The catch is you need to have zero claims in the last 3 years"

### BRANDLESS Rule
Spanish creatives are almost always BRANDLESS — no brand names like "Save Max Auto" or any company name. Note this explicitly in the instructions when creating Spanish iterations. If Dima says "brandless" for an English creative, follow the same rule.

## Step 3.5: Resolve the Parent's Assets — the 🎬 Editor Kit

**PFM addition (Gabe M's proposal, scoped by Sam 07.29.26). Runs on every derivative request that
has a parent. Skips cleanly when there is no parent.**

The problem this solves: a reassigned editor (Mitch picking up Zach's original) loses an afternoon
hunting for the parent's assets. Resolve them at request birth instead.

**🔴 Resolve BOTH the timelines AND the elements.** The published `.drt` usually carries the same
media the elements rows point at — that overlap is fine and wanted. Sam, 07.29.26: *"I kind of want
to have the timelines and have the stuff in a folder, so let's have it do both."* Never drop the
elements rows because the timeline resolved.

**🔴 A pointer that does not resolve NEVER ships as prose.** Every row is verified on disk or
printed as a named ⚠ BLOCKER. The script enforces this — there is no third state.

1. **Find the parent's project folder** — decode the LinkYourFile links in the parent VTM page's
   delivery comments into the real `/Volumes/ads/...` path. Fallback: the canonical
   completed-creatives tree + PFM naming grammar. Last resort: one batched question to the
   requester. **Never guess a path into a request.**

2. **Run the resolver:**

```bash
python3 ~/.claude/skills/iterate-creative/editor_kit.py \
  --project-folder "/Volumes/ads/.../<parent project>" \
  --variant "<state/city>"      # optional — biases which conform base is picked first
```

It walks the canonical tree and emits verified rows: **Project Folder · Timelines · Parent
Timelines · Conform Base · Graphics · Refs · Prompts · Audio**, each with 📁 raw path + 🔗
LinkYourFile link.

3. **The Timeline row.** `.drt` files live in `<project>/Creatives/Timelines/` — published by
   `/e.export` on every render and by `/e.timeline.export` standalone. If the folder is empty, the
   row prints the blocker *and* the fix: ask the original editor to run `/e.timeline.export`, or
   conform from the finished cut. That line is the whole point — the assignee learns in 5 seconds
   what used to cost an afternoon.

4. **Paste the Kit into the request's Assets callout**, under the existing prose reference to the
   original. Show it in the pre-create summary so the requester can veto or add rows.

`Elements/` is **read-only** here — the Kit points, it never renames, moves, or copies (DaVinci
media links break). Parents delivered as multiple links in one comment (dual-aspect) → resolve ALL
links and union the evidence. Archived parents stay read-only.

## Step 4: Create the Page in Notion

Use `notion-create-pages` with these exact settings:

**Parent:**
```json
{"type": "data_source_id", "data_source_id": "18a16771-e780-81fb-9293-000b742fce5e"}
```

**Properties to set:**
- `Task Name (Angle - Concept)`: The new request name
- `Vertical`: Must be one of: "Auto - Both", "Auto - Calls", "Auto - Forms", "Bloom - Signups", "Bathroom - Forms", "Debt Relief", "Ecom", "FE - Calls", "Home - Calls", "Home - Forms", "HVAC", "Life - Forms", "Loans", "Medicare", "MVA - Forms", "Snap", "Windows - Forms", "Omni", "Organic"
- `Content`: "Video" (or as specified)
- `Priority`: Same as original (usually "High")
- `Videos`: Number of videos requested
- `Status`: "Requested"
- `""` (unnamed person property): User ID of the assigned person

**Known Team Member IDs:**
- Sam Schiller: `2804532e-3881-4d79-9b82-5a322ce4db00`
- Zach (user ID `2ffd872b-594c-81df-be49-0002cc7ef0b7`)
- Team member: `1bdd872b-594c-8108-8507-0002ec1079ad`
- Team member: `30ad872b-594c-8127-861c-0002d4d10408`
- Team member: `65ec1d09-9170-4f79-a5cd-9b955e411b61`

If Dima mentions someone by name and they're not in this list, search for them with `notion-search` using `query_type: "user"`.

**Page Content Structure:**
Every request uses 4 callout blocks. This is the template:

```
<callout icon="/icons/question-mark_orange.svg" color="gray_bg">
	## Instructions
	---
	[Instructions content here]
</callout>
<callout icon="/icons/cassette_orange.svg" color="gray_bg">
	## Assets
	---
	[Assets content or reference to original]
	[+ the 🎬 Editor Kit block from Step 3.5 — verified rows and named blockers]
</callout>
<callout icon="/icons/attachment_orange.svg" color="gray_bg">
	## Examples
	---
	[Examples content or reference to original]
</callout>
<callout icon="/icons/pencil_orange.svg" color="gray_bg">
	## Copy
	---
	[Script/copy content]
</callout>
```

**Icon:** Always `🎞️` for video requests.

**Referencing the original project:** Use `<mention-page url="https://www.notion.so/[page-id]"/>` to create a clickable link to the original request.

## Step 5: Verify

After creating the page, fetch it back with `notion-fetch` to confirm the content rendered correctly. Share the link with Dima.

## Reference Data

The `references/` folder contains data useful for writing and adapting scripts:

- **`references/insurance-discounts.md`** — Complete list of real auto and home insurance discounts with savings percentages. Read this when creating scripts that use a "discount angle" or when Dima asks for discount-themed content.
- **`references/property-taxes-by-state.md`** — Property tax rates for all 50 states ranked highest to lowest, plus ad angle ideas. Read this when creating home insurance content that references property taxes or cost of living, or when picking states to target.

Read these files when they're relevant to the iteration being created — don't load them every time.

## Important Reminders

- Always fetch the original request first — don't assume you know what's in it
- Always reference the original working request in the Instructions section
- When Dima says "assign Sam" or "assign Zach", look up their user ID from the list above
- If the original had 2 people assigned and Dima only mentions 1 for the new request, just assign the 1 he mentioned
- Status on new requests is always "Requested" unless Dima says otherwise
- If Dima pastes a Notion URL, extract the page ID and fetch it directly
- When doing Spanish translations, the translation quality matters — use natural, conversational US Spanish that sounds like how a real person in America would speak Spanish, not formal textbook Spanish
