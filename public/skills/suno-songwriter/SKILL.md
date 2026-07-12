---
name: suno-songwriter
description: Write Suno v5 song prompts (lyrics + style block) for ad-to-song workflows. Use whenever the user wants to make a Suno song, turn an ad script into a song, write a jingle, or generate Suno-ready lyrics — explicit cues include "Suno", "make this a song", "song version", "jingle", "Suno prompt", "turn this into a song", "ad song", "song from this script". When an ad script appears alongside any music or song mention, ASSUME this skill applies. Do NOT trigger for general lyrics writing, poetry, music theory, lyrics analysis of existing songs, or other AI music tools (Udio, AIVA, MusicGen).
---

# Suno Songwriter

Sam turns ad scripts into Suno v5 songs that feed downstream into a Veo claymation ad pipeline. Songs are short, hook-driven, and hyper-aggressive about their offer. This skill captures the workflow that's been validated in production.

## Working with Sam

Defaults unless he says otherwise:
- **Suno v5**, Custom Mode (not Simple)
- **Male lead vocal**
- **Workspace: "PIXAR Songs"**
- **Unlimited credits** — generate 6-10 takes per song; don't optimize for cost
- Songs are inputs to a downstream **Veo claymation ad** workflow, so the lyrics need to support visual storyboarding

## The Process

Always run in this order. Don't skip ahead — the iteration loop is where the song gets good.

### 1. Clarify before drafting

Ask the user about:
- **Genre/vibe** — americana banjo stomp, indie pop, kids singalong, dark trap, country, pop-punk, etc. Pitch 2-3 directions if they don't have one in mind.
- **Length** — full ~2min Suno song (cut the best 30-60s for the ad afterward) vs. tight ad-length song (~30-45s sung). Tight is the default for ads.
- **Hook** — the one phrase that should be the earworm. If the user hasn't named one, propose 2-3.
- **Vocal** — male, female, duet, gang. Sam's default is male.
- **Suno version** — v5 unless specified.
- **Compliance lines** — sing them or speak them? Sam: always sing.
- **Multi-song campaign** — same melody with swapped verses, or fully distinct songs? (Suno's swap-verse workflow is mixed; usually better to make distinct songs that share chorus/bridge/CTA structure.)

If the user gives you a script longer than ~15 lines, also ask whether you can compress overlapping lines or need to preserve every beat.

### 2. Draft V1 — the structural pass

For ad-length songs, default to **V-C-V-C-Bridge-C**. Tight, no instrumental sections, the song moves.

Lay out section by section. Cover every script beat across the song. For long scripts, merge overlapping ideas; the bridge is a great place to compress "even if you have a great rate, why not check"-type lines. End with a coverage check (1-15 line by line) to confirm nothing was lost.

### 3. Critical review — DO NOT SKIP

After V1, do an honest read for **catchiness** and **aggression**. The V1 will almost always have these weaknesses. Name them out loud to the user before drafting V2:

- **Chorus has too many ideas.** Real singalong choruses hammer ONE phrase. If your chorus has 4 distinct lines competing for attention, collapse it. The earworm pattern is the hook chanted 4× per chorus, with one short info line tucked between two of the chants.
- **Big numbers buried.** If the most aggressive stat (savings amount, "9 out of 10", social proof) lives in the bridge, promote it to a chorus. Each chorus should drop a different piece of info — typically offer → social proof → CTA across C1, C2, C3.
- **No interjections.** Stomp/singalong/folk genres live on `(hey!)`, `(woo!)`, `(NOTHIN'!)` gang-vocal callbacks. Without them, Suno will render polite folk-pop instead of a stomp.
- **Soft phrases dulling the edge.** Cut `my friend`, `well stop it`, hedges like `you may be...`. Replace with shouts and sealed declaratives (`don't you believe it`, `boom, you've sealed your fate`).

### 4. V2 — the punch pass

Rewrite the chorus as a **chant pattern**. Add descriptive section tags like `[Chorus - gang vocals, hand claps]`. Bake `(hey!)` and shouted call-and-response interjections into the lyrics. Cut soft phrases.

Show the user V2 with a brief explanation of what changed and why. Ask if it lands before going further.

### 5. Late-stage edits — offer placement

After V2 is approved, sanity-check **timing**: in a tight ad song, the offer (specific dollar amount, percentage, or core promise) should land in the **first 10 seconds**. If it's stuck in V2, lift it into V1 lines 3-4. The chorus can then echo it abstractly. This is the single highest-leverage late-stage edit for ad songs.

### 6. Style prompt — only after lyrics are locked

See "Style Prompt Formula" below. Don't write the style prompt before lyrics — the lyrics inform what production direction makes sense.

## Lyric Mechanics for Suno v5

Suno v5 reads structured lyrics. These conventions are not cosmetic — they change how the model performs the song.

**Section tags** drive structure and production direction:
- Basic: `[Verse 1]`, `[Chorus]`, `[Bridge]`, `[Outro]`
- Descriptive: `[Chorus - gang vocals, louder]`, `[Bridge - stomp, build]`, `[Verse 2 - whispered]`

Use descriptive tags to **escalate energy across choruses**:
```
[Chorus] → [Chorus - gang vocals, louder] → [Chorus - full gang vocals, stomp clap]
```
This pushes Suno to ramp intensity through the song instead of flat-lining.

**Drop duplicate section labels.** A bare `[Chorus]` immediately followed by `[Chorus - gang vocals, louder]` is read as two consecutive section breaks and confuses the model. Pick one tag per section.

**Interjections in parens** become gang-vocal callbacks: `Texas is the best! (hey!)` `what you got to lose? (NOTHIN'!)`. Use them especially in choruses and bridges. They're the single biggest lever for getting "stomp energy" out of Suno.

**ALL CAPS = shout.** Use sparingly. Capping everything makes Suno normalize. Capping strategically (`TEXAS IS THE BEST!` in the final chorus) reads as a shouted gang vocal. Save it for the climax.

**Breath beats and dramatic pauses** are marked with commas or line breaks — never em dashes (banned in Suno lyrics, locked law): `Five little minutes, that's all that it takes!` For a bigger pause, break the line: `Five little minutes` / `that's all that it takes!`

**Spell out numbers** for clarity: `three-sixty-nine` over `$369`, `thirty-nine a month` over `$39/mo`. Suno usually sings either, but spelled-out is safer for singalong cadence and avoids Suno reading "$" as "dollar sign."

**4000 char limit** on the lyrics box. Plenty for ad songs.

## Style Prompt Formula

Stack descriptors comma-separated, **front-loaded** with the most important. Suno weights early descriptors highest. Format:

```
<primary genre>, <secondary genre/feel>, <vocal direction>, <instrumentation>,
<production notes>, <BPM>, <key>, <reference artists>
```

Each piece earns its place:

- **Genre stack first** — `americana banjo stomp, kids singalong` not `kids singalong, americana banjo stomp` if the stomp is primary.
- **Vocal direction** — `male lead vocal, gang vocal callbacks` locks who sings what. Without this, Suno may render the lead doing his own (hey!)s.
- **Instrumentation** — explicit list. "Banjo stomp" implies banjo but not claps, fiddle, foot stomps. Spell them out.
- **BPM** — give a number. 138 BPM for a stomp, 90 for a slow ballad, 145 for trap, 110-120 for indie pop.
- **Key** — `major key` for sunny songs prevents Suno drifting to minor on Americana/folk. `minor key` for moody/dramatic.
- **Production notes** — `dry intimate production, raw and unpolished` for stomp/folk; `polished, modern, big mix` for pop; `lo-fi, tape saturation, distant` for atmosphere.
- **Reference artists** — Suno responds well to `X meets Y` shorthand. `mumford & sons meets sesame street`.

Style prompt hard limit: under 1,000 characters.

**Worked example (Americana banjo stomp, kids singalong):**
```
americana banjo stomp, kids singalong, male lead vocal, gang vocal callbacks,
hand claps, foot stomps, driving acoustic guitar, fiddle accents, big group
"hey!" shouts, anthemic, joyful, energetic, 138 BPM, major key, dry intimate
production, raw and unpolished, mumford & sons meets sesame street
```

## Ad-Song Specific Patterns

### V-C-V-C-Bridge-C structure

For 30-60s ad songs, default structure:

| Section | Job |
|---|---|
| V1 | Hook attention; **land the OFFER in lines 3-4** (within first 10s) |
| C1 | Chant the hook; reinforce offer abstractly |
| V2 | Solution mechanic — how it works, the catch/qualifier |
| C2 | Chant + drop social proof (savings amount, "switchers saving X") |
| Bridge | Urgency — "5 minutes", "only you can save", call-and-response shout |
| C3 | Chant + CTA (tap the link, type your zip, click below) |

### The chorus chant rule

The chorus is the earworm. Hammer **ONE** phrase 4× per chorus, with a short info line tucked between two of the chants:

```
HOOK! (callback!)
HOOK! (callback!)
[short info line — different in each chorus]
HOOK!
```

Each chorus drops different info. **Same chant, fresh info each time.** This is how singalong choruses get stuck in heads — repetition of the chant + variation in the info line.

### Sing the compliance, don't speak it

Compliance lines (the catch — "zero claims in three years", "zero DUIs in five years", "must be 18+") should be **sung**, not delivered as spoken-word breaks. Spoken sections feel like ad reads and break the song's spell. Sam's preference; hold it unless overridden.

### Multi-song campaigns

When making a paired set (home + auto, life + dental, etc.), keep the **chorus, bridge, and CTA chorus identical**. Swap only V1 specifics (the offer details) and V2 specifics (the catch). This makes the campaign read as one world.

If a swap breaks a rhyme (e.g., "$369/year" rhymes with "clear"; "$39/month" doesn't), **rebuild the rhyme pair in that verse only** — don't disturb the chorus.

## Production Tips

- **Generate 6-10 takes minimum.** Suno v5 has variance — even a great prompt produces duds. 4-6 generations per song is standard; pick the best.
- **Use Persona to lock voices across campaign songs.** When you find a take with a male voice you love, save it as a Persona in Suno (... menu on the song → Save as Persona). Use that Persona for the matched campaign song. Otherwise the two songs will sound like different singers.
- **One phrase, not multiple ideas, in the chorus.** This is the single most common thing that makes Suno output sound generic. Real kids-singalong / banjo-stomp choruses chant one phrase. If you find yourself writing four different chorus lines, you're writing a verse.
- **Section tag escalation across choruses.** `[Chorus]` → `[Chorus - gang vocals, louder]` → `[Chorus - full gang vocals, stomp clap]`. Tells Suno to ramp intensity instead of flat-line.

## Worked Example: Texas Insurance Songs

The campaign that validated this workflow (two songs, Americana banjo stomp + kids singalong, "Texas is the best!" hook) lives in `references/texas-example.md` — weak V1 chorus vs chant-pattern V2, the late-stage offer fix, and the multi-song parallel. Read it when you need a concrete before/after.

## When NOT to trigger this skill

- General lyrics writing without Suno mention — "write a poem", "write a song" with no Suno context
- Music theory questions
- Lyrics analysis or feedback on existing recorded songs
- Non-Suno AI music tools (Udio, AIVA, MusicGen, Stable Audio)
- Karaoke or music transcription tasks
