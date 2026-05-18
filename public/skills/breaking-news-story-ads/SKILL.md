---
name: breaking-news-story-ads
description: Write PFM story ad scripts that are wrapped as a local 6pm news segment (LATU News or equivalent fake affiliate). Use whenever the user asks to draft a "breaking news" or "local news style" story ad, rework a standard story ad into a news-segment wrapper, write anchor copy or field reporter packages for a PFM creative, or produce chyrons/lower thirds for the LATU News format. Triggers on mentions of LATU News, breaking news angle, local news format, anchor desk, field reporter, "6 o'clock news" wrapper, or news-segment story ads.
---

# Breaking News Story Ads — PFM

This skill encodes how Power Fox Media writes story ad scripts wrapped as a local 6pm news segment. It assumes the reader already knows the PFM 6-beat story structure (`story-ad-playbook.md`) and the vertical-specific compliance rules (`verticals/*.md`). This skill is the **wrapper layer on top of those** — how to make a story ad sound like it actually aired on LATU News at 6pm last night.

## Why this skill exists

Local news has a specific voice — short present-tense sentences, dense "tonight" markers, anchor-to-reporter tosses, sign-off lines, chyrons. That voice is load-bearing: when it's right, the ad reads as real reportage and the viewer's ad-defense drops. When it's off by a word (wrong tense, missing toss, lead buried, dead sign-off), it reads as a skit and the trust collapses. This skill exists so that the news wrapper is indistinguishable from a real broadcast — while the underlying PFM story ad (hook → context → issue → lander → payoff → CTA) still hits all six beats underneath.

**Compliance reminder:** Breaking news / local news framing is approved at PFM as of 2026-04-16. The fake-urgency rule still stands for anchor copy — no viewer-facing deadlines, no "new program," no government implication. The news format covers the *story* (a neighbor helped a family), not the *offer*.

## The three flavors

Every PFM news-wrapped ad falls into one of three flavors. Identify which one the ask is before writing — they share DNA but differ in body content and source material.

### Flavor A — News-wraps-existing-story-ad (re-frame a winner)

Source: an existing winning PFM control (security-cam podcast story, UGC, etc.).
Body: anchor + Rachel Torres reporter glued around **reused SOTs from the source footage**, plus 1–2 fresh interview cutaways (typically the Hero Husband in a sit-down).
Source footage's narrator track is REMOVED — clips play as "silent viral video" with only scene dialogue (screams, confession, locksmith line, payoff) running as SOTs.
Reference: Home Eviction State BREAKING NEWS.

### Flavor B — News-wraps-LC-as-viral-podcast-clip

Source: a long-copy Facebook ad (no existing video asset).
Body: anchor introduces a "viral podcast clip" → guest-on-podcast lines + guest-being-interviewed cutaways carry the story → optional 1–2 street vox pops near the end → Rachel VO threads it together.
Distinct speaker labels: `Guest on Podcast`, `Guest being interviewed`, `Street Interview 1 / 2`.
Reference: LC to Video - NEWS Moving States Podcast Story.

### Flavor C — Pure breaking news (no source asset)

Source: a Notion brief / original concept.
Body: anchor + Rachel + fresh senior/customer testimonials. No reused footage, all-new dialogue.
If asked, supports multiple opening text-hook variants on the same body (Hook A/B/C tested via on-screen text only).
Reference: Concealed - Senior Breaking News.

## Default talent

Unless the request specifies otherwise:
- **Anchor at desk:** Lauren Hayes (female, mid-40s, neutral broadcast)
- **Field reporter:** Rachel Torres (female, early-mid 30s, subtle Latina warmth)

These two are the recurring PFM news-talent. Reuse them by default; only propose new names if Sam asks for a fresh face or the brief specifies a male anchor.

## Workflow — master first, variations on request

1. **Write the master template first.** State variables as `[BRACKETED_TOKENS]`, no values filled. Deliver to Sam, get sign-off.
2. **Only after the master is locked**, generate state/variant fills on Sam's go.
3. **Hook variants** (A/B/C testing different opening text on the same body) — only produce on explicit request.

Never volunteer state fills or hook variants in the same pass as the master draft.

## The hard rules

### Rule 1. Present tense, active voice, "tonight"

Every news segment is written in the present tense even when the events are retrospective. The event was yesterday; the *story* is tonight. "Tonight" appears at least **3 times** in a 2:00 segment — anchor intro, reporter toss, closing stand-up or anchor tag.

- Bad: `Yesterday afternoon, a West Elmwood family nearly lost their home.`
- Good: `A West Elmwood family is home tonight, after a scare yesterday afternoon that nearly cost them everything.`

Tense flow in a standard 3-sentence opening:

1. **Present** — the now-state. (*"A family is home tonight."*)
2. **Past** — what happened. (*"Just yesterday morning, they thought they had lost everything."*)
3. **Present** — emotional now-state. (*"Tonight, they're calling their neighbor a hero."*)

Never lead with *"Yesterday…"* — that's the tell that it's a day-old story. Lead with tonight's angle. The past event becomes the "after" clause.

### Rule 2. Short sentences. One idea per sentence. 12–18 words average.

Broadcast writes for the ear, not the eye. If you can't say it in one breath, cut it. Hard ceiling **20 words per sentence** — 15 average. This is tighter than the Veo per-clip rule (which is about the clip, not the sentence).

- Bad: `A West Elmwood mother who was just days from eviction was saved last night by her neighbor who happens to be a mortgage broker, in what locals are calling an incredible act of kindness.`
- Good: `A West Elmwood mother is home tonight. Just days ago, she thought she was losing everything. Then her neighbor knocked on the door.`

### Rule 3. Anchors always do the intro → toss → tag structure

Every news-wrapped PFM ad has three fixed anchor moments:

1. **INTRO** (from the anchor desk, :10–:20) — hook the viewer, give who/what/where/when in 2 sentences, toss to the reporter.
2. **TOSS** to reporter — *"Eyewitness News reporter Sarah Chen is live on Maple Street tonight. Sarah?"*
3. **TAG** (back at the desk after the package, :10–:15) — emotional reaction, how-to-help line that becomes the CTA, kick to break.

Never start a PFM news-wrapped ad with the reporter. Never end on the reporter without a tag-back to the anchor. The anchor frame is what makes it read as news.

### Rule 4. The reporter package has a fixed shape

A 1:00–1:30 field reporter package should contain:

- **Opening:** 3 seconds of nat sound (door opening, hammer, dog barking) OR an opening stand-up.
- **Track 1 (VO):** sets the scene, introduces the subject. :10–:18.
- **SOT 1 (sound bite):** the subject speaks — the struggle. :08–:12.
- **Track 2 (VO):** advances the story to the helper. :12–:18.
- **SOT 2:** the helper speaks — why they stepped in. :08–:12.
- **Track 3 (VO):** the mechanism / the fix lands here. :12–:18.
- **SOT 3 (emotional payoff bite):** often the subject repeating what the helper said. :06–:10.
- **Closing stand-up:** reporter on-camera, sign-off line. :08–:12.

**Three sound bites is the sweet spot.** Four max. Subject → helper → emotional payoff. The payoff bite is often the subject quoting the helper back to camera — this is a load-bearing local-news trope that creates a verbal clasp between the two humans.

### Rule 5. Sign-off line is formulaic and mandatory

Every reporter package ends with a sign-off. PFM uses **LATU News** as the fake affiliate. Accepted forms:

- `[Reporter Name], LATU News, [Neighborhood].`
- `Reporting live in [Neighborhood], [Reporter Name], LATU News.`
- `For LATU News, I'm [Reporter Name] in [Neighborhood].`

After the sign-off, the reporter addresses the anchor by first name for the tag-back:
- *"Mark and Janet, back to you."*
- *"Just an incredible story, Janet. Back to you at the desk."*

### Rule 6. Write to the footage, not over it

The narration should never tell the viewer what they can already see. Footage of a locksmith at the door + reporter saying *"a locksmith is at the door"* = amateur. Instead, **reference the picture obliquely** and advance the story.

- Bad: `Track: "A locksmith is at the door." Footage: locksmith at the door.`
- Good: `Track: "By the time the Marshes got home, the bank had already sent someone." Footage: locksmith at the door.`

Leave :02–:04 gaps of pure nat sound between tracks. Don't wall-to-wall the narration. Nat pops are structural — plan them at scene changes.

### Rule 7. Anchor copy must respect the PFM compliance floor

The news wrapper doesn't buy new language freedoms. Inside the anchor copy, these still apply:

- ❌ No government or authority implication ("new law," "new state program," "officials announce")
- ❌ No viewer-facing deadlines ("this ends tonight," "only 48 hours left")
- ❌ No "they keep trying to take this down"
- ❌ No "breaking news: the government just released…" style fake news-of-offer framing
- ❌ No "program" language anywhere — use *site, service, tool*
- ✅ "Breaking news" as a format label is fine (chyron text, anchor lead-in)
- ✅ News framing of the *human story* is fine — a family's eviction scare, a neighbor who helped

The test: does the news copy cover a **story** (something that happened to people) or an **offer** (a thing the viewer should click on)? Cover the story. The site/tool enters only when the Hero introduces it inside the package — never in the anchor copy.

### Rule 8. Chyrons are ALL CAPS in the script, stacked and specific

Every on-air chyron gets written into the script in ALL CAPS in the video column. Standard formats:

**Story-label banners (top of screen):**
- `BREAKING NEWS`
- `LOCAL HEROES`
- `NEIGHBORS HELPING NEIGHBORS`
- `COMMUNITY STEPS UP`
- `JUST IN`
- `HAPPENING NOW`

**Person IDs (lower third, two lines):**
```
Line 1: JESSICA MARSH
Line 2: MOTHER OF THREE
```
```
Line 1: DAVID GOMEZ
Line 2: HELPED STOP EVICTION
```

**Location tags (corner or under main chyron):**
- `LIVE — WEST ELMWOOD`
- `EARLIER TODAY — MAPLE STREET`
- `YESTERDAY — ELMWOOD`

**PFM compliance inside chyrons:**

- ❌ Hero Wife's chyron is never `INSURANCE AGENT` or `FORMER INSURANCE AGENT` — same rule as the dialogue.
- ✅ `MORTGAGE BROKER` (Home), `DEALERSHIP ASST. MANAGER` (Auto), `FINANCIAL ADVISOR` (Loans) — consistent with the Hero framings in the playbook.
- ❌ No chyron that implies government ("STATE PROGRAM ANNOUNCED," "NEW FEDERAL LAW").
- ✅ Neutral story-label chyrons ("LOCAL HEROES", "NEIGHBORS HELPING NEIGHBORS") are the safe anchor.
- **Delay the Hero's profession reveal.** If the original ad's dramatic choice is to reveal the Hero's job mid-scene (like HBF-1 does with *"She didn't know I was a mortgage broker"*), the *opening* story-label chyron must not spoil it. Open with a neutral banner (`LOCAL HEROES`) and only swap in the profession chyron (`MORTGAGE BROKER`) at the exact moment the Hero reveals it in dialogue.

### Rule 9. Map the news wrapper onto the 6 PFM beats

The news segment is a **wrapper**, not a replacement. The 6 PFM beats still live underneath it. Standard mapping for a 2:00 wrapped ad:

| PFM Beat | News Segment Placement |
|---|---|
| 1. Hook | Anchor intro cold-open line + the first :03–:05 of footage (nat pop on the visible crisis) |
| 2. Context | Anchor intro setup sentences + Track 1 of reporter package |
| 3. Financial-struggle issue (confession) | SOT 1 (subject bite) + Track 2 leading into the helper |
| 4. Lander as solution (mechanism) | Track 3 — Hero introduces the site. This is the load-bearing beat. |
| 5. Double payoff | SOT 3 (emotional payoff bite) + closing stand-up describing the outcome |
| 6. CTA | Anchor tag — the how-to-help / how-to-check-your-rate line |

The Mechanism still has to land in Beat 4 inside the package. The news wrapper doesn't get to skip it. *"A site that compares rates and finds missing discounts on your existing policy"* must appear in the Hero's dialogue or in a reporter track that frames the Hero's explanation.

### Rule 10. The anchor tag IS the CTA

In a standard PFM story ad, the CTA is a text overlay at the end. In a news-wrapped ad, the CTA lives inside the anchor's tag after the package. This is the single biggest structural difference.

Good tag-CTA patterns:

- *"If you want to check your own rate, we've posted a link on our website. Just head to LATU-dot-com and look for Sarah's story."*
- *"We've got a link on our website for anyone who wants to see if they're overpaying. LATU-dot-com, tap the top story."*
- *"Tap the link below to see if you could lower your rate. Mark?"*

**What NOT to do in the anchor tag:**
- ❌ *"Visit our sponsor at [URL]"* — reads as paid placement, breaks the frame.
- ❌ *"This incredible new program is helping homeowners…"* — "program" is banned.
- ❌ *"You won't believe what you could save"* — "will save" violation and fake-urgency-adjacent.
- ❌ *"Before this offer expires tonight…"* — fake urgency.

The anchor tag is still compliance-bound. "Could," "may," possibility-framing — same rules as any PFM copy.

## Writing habits that make news copy sing

### "Tonight" density target

In a 2:00 wrapped ad, "tonight" should appear **3–5 times** total. Less than 3 and the immediacy collapses. More than 5 and it reads as parody. Placement: anchor intro (1–2), reporter toss (1), closing stand-up or tag (1).

### Station name density

Say the station name (LATU News, LATU, or Channel 7) **at least 4 times** per 2:00 segment. Anchor intro, reporter toss, reporter sign-off, anchor tag. This is a real-broadcast pattern — stations brand aggressively inside every segment.

### The "Rule of Three"

The ear likes threes. Any list in anchor copy should be a list of three:
- *"Three kids. Three months behind on rent. Three days from eviction."*
- *"No warning. No backup plan. No way out."*

Don't do two. Don't do four. Three.

### Load-bearing clichés to lean on

These are tropes that function. They make the copy read as real news. Stack without shame:

- *"A [neighborhood] family is recovering tonight after…"*
- *"Our cameras were rolling when…"*
- *"A dramatic moment caught on camera."*
- *"Take a look at this."*
- *"In a story you'll only see on LATU News…"*
- *"What we know at this hour…"*
- *"[Name] says she is still in disbelief tonight."*
- *"[Name] tells LATU News…"*
- *"A [neighborhood] neighborhood is coming together tonight…"*
- *"Close-knit community"*
- *"It could have been so much worse."*
- *"Here's what happened."*
- *"Just moments ago…"*
- *"It all started when…"*

### Parody-level clichés to avoid or use sparingly

Meme-ified. Use at most one, and only if it's genuinely right:

- *"Local man does [thing]."*
- *"An area woman…"*
- *"You won't BELIEVE what happened next."*
- *"The video is going viral."*
- *"Brought to tears…"*
- *"An angel on earth."*
- *"Only one word to describe it: miraculous."*
- *"Faith in humanity restored."* (borderline — sometimes works)

### Words that flag amateur writing (cut them)

- "Individual" → say *man* or *woman*
- "Utilize" → say *use*
- "Altercation" → say *fight* or *confrontation*
- "Indicated" → say *said*
- "At this point in time" → say *now*
- "In an effort to" → say *to*
- Past perfect ("had gone," "had said") — almost never right for broadcast

### Quote attribution goes FIRST, not last

Broadcast rule: put *"police say"* before the claim, not after. Reader's ear needs to know who's talking before they hear the claim.

- Bad: `The eviction was a misunderstanding, the bank says.`
- Good: `The bank says the eviction was a misunderstanding.`

### Numbers

- Round: *"nearly twenty thousand dollars"* — not *"19,847 dollars."*
- Spell out below 12; digits for amounts.
- *"Nineteen hundred dollars"* reads better aloud than *"$1,900."*
- Dollar amounts in broadcast: *"twenty dollars a month,"* not *"$20 a month."*

## Template — 2:00 news-wrapped PFM story ad

A complete scaffolding. Fill each bracket. This is the HBF eviction story in the news format — use as a pattern.

```
[TRT 2:00]

[VIDEO COLUMN]                          [AUDIO COLUMN]

────────────────────────────────────────────────────────────────────────

ANCHOR 2-SHOT                            (ANCHOR 1)
CG TOP: BREAKING NEWS                    Good evening. I'm [Anchor 1 Name].
CG BOTTOM: LOCAL HEROES
                                         (ANCHOR 2)
                                         And I'm [Anchor 2 Name]. We begin 
                                         tonight with a [neighborhood] 
                                         family who says they are home 
                                         this evening, because of the 
                                         woman next door.

                                         (ANCHOR 1)
                                         Just 24 hours ago, [Subject Name]
                                         watched a locksmith walk up her 
                                         driveway with orders to change 
                                         the locks. Tonight, her family 
                                         is calling a neighbor a hero.

                                         (ANCHOR 2)
                                         LATU News reporter [Reporter 
                                         Name] is live in [Neighborhood] 
                                         tonight. [First name]?

────────────────────────────────────────────────────────────────────────

REPORTER LIVE SHOT                       (REPORTER)
CG: LIVE — [NEIGHBORHOOD]                [Anchor first name], I am 
CG: [REPORTER NAME] / LATU NEWS          standing outside the home on 
                                         Maple Street. And the scene here 
                                         tonight is very different from 
                                         what it was just yesterday 
                                         morning. Take a look.

────────────────────────────────────────────────────────────────────────

TAKE PKG                                 (PACKAGE BEGINS)
TRT 1:25
OC: "...LATU News, [Neighborhood]."

NAT POP :03                              NAT: LOCKSMITH DRILL

B-ROLL: LOCKSMITH AT DOOR                (REPORTER VO — Track 1)
B-ROLL: FAMILY STANDING IN DRIVEWAY      By the time the Marsh family got 
                                         home on Tuesday morning, the 
                                         bank had already sent someone. 
                                         The locks were coming off. The 
                                         eviction was happening.

SOT 1 — SUBJECT WIFE                     (SUBJECT WIFE)
CG: JESSICA MARSH                        "I had the paperwork in my hand.
CG: ALMOST EVICTED YESTERDAY              I was counting the hours. I 
                                          really thought we were done."

B-ROLL: STRUGGLING COUPLE WITH           (REPORTER VO — Track 2)
LOCKSMITH                                [Subject Name] says she had been 
B-ROLL: HERO WIFE APPROACHING            falling behind for months. And 
                                         she had not told her neighbors. 
                                         But across the street — [Hero 
                                         Name] saw what was happening. 
                                         And she walked over.

SOT 2 — HERO WIFE                        (HERO WIFE)
CG: [HERO NAME]                          "I could see they were caught off
CG: STEPPED IN TO HELP                    guard. I just — I had to help."

B-ROLL: HERO HUSBAND ON PHONE            (REPORTER VO — Track 3)
B-ROLL: HERO WIFE + SUBJECT WIFE         While the husbands called the 
ON PORCH                                 lender, [Hero Wife] pulled 
                                         [Subject Wife] aside. And that 
                                         is when she learned what was 
                                         really behind all of this.

SOT 3 — SUBJECT WIFE                     (SUBJECT WIFE)
                                         "Honestly, it was the home 
                                         insurance. It kept getting 
                                         higher and higher. It rolled 
                                         into the mortgage, and we just 
                                         couldn't keep up."

B-ROLL: HERO WIFE ON PHONE SHOWING       (REPORTER VO — Track 4, THE 
SCREEN                                   MECHANISM LANDS HERE)
                                         That is when [Hero Name] told 
                                         her something [Subject Name] did
                                         not know. [Hero Name] is a 
                                         mortgage broker. And she says 
                                         she sees this happen to families 
                                         all the time.

CG UPDATE: [HERO NAME]                   
CG UPDATE: MORTGAGE BROKER               

SOT 4 — HERO WIFE                        (HERO WIFE)
                                         "A lot of homeowners are 
                                          overpaying and they honestly 
                                          have no idea. There is a site 
                                          I use for all my clients that 
                                          checks for missing discounts 
                                          on their home insurance."

B-ROLL: PHONE SCREEN SHOWING RATE         (REPORTER VO — Track 5)
DROP                                     The site ran [Subject Name]'s 
                                         info. It found four discounts 
                                         she was missing. And her rate 
                                         dropped by nearly fifteen 
                                         hundred dollars a year — on 
                                         average.

SOT 5 — SUBJECT WIFE (PAYOFF BITE)       (SUBJECT WIFE)
                                         "She said, 'There are savings 
                                          you don't know about.' And she 
                                          was right."

B-ROLL: FAMILIES HUGGING                 (REPORTER VO — Track 6)
B-ROLL: LOCKSMITH LEAVING                The lender accepted the payment. 
                                         The locksmith got the release 
                                         order. And tonight, the Marsh 
                                         family is not going anywhere.

CLOSING STAND-UP                         (REPORTER)
CG: [REPORTER NAME] / LATU NEWS          [Subject Name] says she still 
                                         cannot believe it. And she says 
                                         she will not forget what her 
                                         neighbor did for her family. 
                                         Reporting live in [Neighborhood]
                                         tonight, [Reporter Full Name], 
                                         LATU News.

────────────────────────────────────────────────────────────────────────

ANCHOR 2-SHOT                            (ANCHOR 1)
CG: LATU.COM/RATECHECK                   [Reporter first name], thank you.
                                         What a story.

                                         (ANCHOR 2)
                                         And we have got a link on our 
                                         website for anyone who wants to 
                                         check their own rate. Just head 
                                         to LATU-dot-com and tap the 
                                         story at the top of the page.

                                         (ANCHOR 1)
                                         We will be right back.
```

## Before/after rewrite examples

### Example A: buried lede + past tense

Bad (buried, past-tense):
> *"Yesterday, a mother of three named Jessica Marsh, who is a resident of West Elmwood and was struggling financially, was approached by her neighbor — a mortgage broker named [Hero Name] — who offered to help her when she was facing eviction due to rising home insurance rates that had been rolled into her mortgage."*

Good (lede up, tense flipped, sentences split):
> *"A West Elmwood mother is home tonight. Just yesterday, Jessica Marsh thought she was losing everything. Then her neighbor knocked on the door."*

### Example B: reporter narrating the picture

Bad (telling us what we can see):
> *"And here you can see the locksmith at the front door, drilling into the lock, while Jessica Marsh stands in the driveway visibly upset."*

Good (oblique, advancing the story):
> *"By the time the Marsh family got home, the bank had already sent someone. And there was no way to stop what was about to happen."*

### Example C: weak sign-off

Bad (no location, no station, no tag-back):
> *"So yeah, really moving story. Back to the studio."*

Good (standard sign-off):
> *"Reporting live in West Elmwood tonight, I'm [Reporter Name], LATU News. Mark and Janet, back to you."*

### Example D: anchor tag that breaks compliance

Bad (fake urgency + "program" language):
> *"Incredible. And if you want to get into this amazing new program before it's gone, rates like these won't last long."*

Good (possibility-framed, news-native):
> *"Incredible. And if you want to see if you could lower your own rate, we have got a link on our website. Just head to LATU-dot-com."*

## Integration with the Veo Script Writing skill

This skill produces the **content** of a news-wrapped ad. When the script moves into Veo production, the Veo Script Writing rules still apply on top:

- Every numbered dialogue line is still capped at 15–22 words per Veo clip (with 24 hard ceiling).
- No ALL CAPS in dialogue — **but ALL CAPS is required for chyron text in the video column.** Veo generates the on-screen chyron from the video-column annotation; it will render the chyron text correctly when it's in brackets or the video column, and it won't read it as shouting. Keep ALL CAPS out of the audio/dialogue column only.
- No dashes in dialogue. Commas and periods only.
- State-token lines still get their own numbered line.

The news wrapper adds **script layout** complexity (two-column, anchor vs reporter vs SOT), but the per-clip Veo rules are unchanged inside each numbered clip.

## Variations beyond the full LATU wrapper

The full wrapper in the template above is the default, but PFM also runs **compressed wrappers** as tested variants. Pick the format that fits the creative, not the other way around.

### Full LATU wrapper (~2:15–2:30)

The template up top. Use when:
- The story is rich enough to carry a field reporter package (multiple SOTs, multiple beats of footage)
- You want max local-news authority feel
- Street interviews or extra social-proof bites are valuable
- The creative is the hero asset for the vertical and will run broad

Structure: anchor intro → reporter toss → reporter package (VO + SOTs + stand-ups) → closing stand-up + sign-off → anchor tag CTA.

### Compressed "channel-surfing clip" wrapper (~1:45–2:00)

A shorter variant meant to feel like the viewer channel-surfed onto a news segment already in progress. Use when:
- Converting an existing proven story-ad control into a news variation (don't re-invent — re-frame)
- Testing format against an existing podcast or long-form control
- You want minimal anchor screen time and a tight package

Structure: anchor desk cold open (brief — 2–4 beats) → toss to reporter on scene → reporter VO + interview cutaways + existing footage SOTs → reporter closing + sign-off → anchor CTA tag.

Key differences from the full wrapper:
- **No street interviews.** The subject + one interview character (Hero, Hero's spouse, etc.) do all the non-footage work.
- **Shorter anchor bookends.** The intro is 2–3 lines max, the tag is 1–2 lines. Anchor doesn't carry the narrative.
- **Reporter does most of the storytelling VO.** Anchor hands off early and stays off until the CTA.
- **Existing in-scene dialogue from the underlying control runs as SOTs.** You are NOT re-recording scene dialogue — the screams, the confession, the ticking-clock lines, the "God bless you guys" — all live as sound-on-tape from the source footage.

### Converting an existing story ad into a news wrapper — the variation pattern

When the ask is *"make a breaking news version of [our winning control]"* — do NOT re-originate. Re-frame:

1. **Keep the existing in-scene dialogue as SOTs.** Scream, confession, ticking-clock line, emotional payoff line — all preserved as source-footage audio.
2. **Cut the existing narrator VO** if there is one (some controls have Hero Wife narration, podcast host, etc.). That narration track is REMOVED in the news version — the footage plays as "silent video that went viral" with only scene dialogue audible.
3. **Add the anchor bookends** — cold open at the top + CTA tag at the end.
4. **Add the reporter layer** — VO threads the story together between the existing SOTs, live standups open and close the package.
5. **Add 1–2 on-camera interview characters** — usually the Hero Husband or Hero Wife, filmed as a sit-down cutaway in their home. This replaces the podcast host or narrator's role from the control.

The underlying story beats (hook → context → issue → lander → payoff → CTA) stay identical. You are re-dressing the story, not rewriting it.

**Example:** The Home Eviction state podcast control had Hero Wife narrating the story in past tense over Ring footage. The news variation cut her narration, added a female anchor at desk + Rachel Torres field reporter + Hero Husband sit-down interview. Same footage, same story beats, same $1,500 savings reveal — totally different feel.

## State-variable embedding in news-wrapped ads

When the creative is a state-specific batch (WA, TN, MN, CA, CT, etc.), the script needs state-variable lines embedded throughout — but not so many that the base template loses cohesion.

**Sweet spot: 2–5 state-variable lines per script.** Fewer than 2 and the state specificity collapses; more than 5 and you are rewriting the whole script per state instead of swapping values.

### Where state-variable lines land

1. **Anchor intro** — *"Tonight, a viral video of a [STATE] couple nearly losing their home is spreading across social media."* Establishes state in the first breath.
2. **Rachel live standup (if applicable)** — *"I'm standing outside the home in [CITY]."* Grounds the viewer in a specific place.
3. **State-stat line** — mid-package, usually Rachel VO citing the Bankrate or Experian state average: *"The average [STATE] homeowner now pays [STATE ANNUAL RATE] a year on home insurance. That's [STATE MONTHLY RATE] every month."*
4. **Reporter closing (optional)** — *"In [CITY], I'm Rachel Torres, LATU News."* — the sign-off city.
5. **Anchor CTA tag** — *"If you're a [STATE] homeowner, you can check your rate right now."*

Hit 2–4 of these consistently per variant. Skip the ones that don't fit the beat structure.

### Formatting convention for state-variable lines

In the master template, state-variable tokens get color-coded (red in Notion) so the variable slots are visually obvious. In filled state versions, the same lines get a yellow background on the full line so translators/editors can scan which lines swap per state.

```
Master: Tonight, a viral video of a [STATE] couple nearly losing their home...
WA fill: Tonight, a viral video of a [Washington] couple nearly losing their home...  (yellow highlight on full line)
```

Use square brackets `[STATE]`, `[CITY]`, `[STATE ANNUAL RATE]`, `[STATE MONTHLY RATE]` as token format. Keep variable names short and obvious.

### Building a state-batch workflow

1. Write and approve the master template first (red-bracketed tokens).
2. Fill state #1 fully (yellow highlights on variable lines). Run the creative.
3. Once state #1 is approved, fill the remaining states using the same structure with swapped values — should take minutes per state if the master is locked.
4. Keep a variable reference table at the top of the Notion doc:

| State | [CITY] | [STATE ANNUAL RATE] | [STATE MONTHLY RATE] |
|---|---|---|---|
| Washington | Tacoma | $1,539 | $128 |
| Tennessee | ... | ... | ... |

## Veo prompts live in the project Excel

This skill produces the **script**, not the per-clip Veo prompts. Veo JSON prompts now live in the project's Excel manifest, generated downstream by the `hvg-flow` skill. Don't emit Veo prompt blocks inside the script doc.

## Final checklist before a news-wrapped script ships

| Check | What to verify |
|---|---|
| Present tense + "tonight" | First sentence of anchor intro is present tense. "Tonight" appears 3+ times. |
| Sentence length | Average 12–18 words. Hard ceiling 20 per sentence. |
| Intro → toss → tag | Anchor intro ends in a toss. Reporter package ends in a sign-off + tag-back. Anchor tag closes the segment. |
| Sign-off line | Ends with `[Reporter Full Name], LATU News, [Neighborhood].` |
| 3 sound bites | Subject → Helper → Emotional payoff. |
| Mechanism lands in the package | "Site that checks for missing discounts" appears in Hero's line or reporter track. |
| CTA lives in anchor tag | Not in a text overlay only. Anchor voices a how-to-help line. |
| Chyrons specified | All chyrons written in ALL CAPS in video column. Hero's profession chyron doesn't spoil the reveal. |
| Compliance in anchor copy | No government, no fake urgency, no "program," no "will save." |
| Write to picture | No lines narrate what the footage shows. Nat pops planned. |
| 6 PFM beats still present | Hook, Context, Issue, Lander, Payoff, CTA — map each to a section of the wrapper. |
| Read it aloud | Every line deliverable in one breath at 160 WPM. |

## TLDR

1. Present tense. "Tonight" 3+ times.
2. 12–18 word sentences. Cut anything over 20.
3. Anchor intro → reporter toss → package → sign-off → anchor tag. Every time.
4. 3 sound bites per package: subject, helper, emotional payoff.
5. Sign-off: `[Name], LATU News, [Neighborhood].` — always.
6. Write AROUND the footage, not OVER it. Leave nat pop gaps.
7. Chyrons in ALL CAPS, specific, and don't spoil the Hero's reveal.
8. 6 PFM beats still live underneath the wrapper.
9. CTA lives in the anchor tag. Still compliance-bound.
10. Read it out loud.
