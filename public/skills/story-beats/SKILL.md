---
name: story-beats
description: Generate locked beat skeletons for PFM story ads from a reference creative + Sam's tweaks (or an original idea). Default baseline is 6 beats; expand when the story demands it. Use when Sam says "beat this out," "write beats for," "story beats," "help me beat out this idea," or feeds a reference script he wants to adapt. Beats include must-hit dialogue anchors (Mechanism line, ticking-clock line, emotional hinges, CTA); connective dialogue waits for the dialogue pass.
---

# PFM Story Beats Generator

> **Request format is LIVE (2026-07-13).** This skill writes the CONTENT for a request, not the request page. When your output goes into a Notion request, write it into the locked body shape — the Copy callout holds ONE static numbered script (one line per clip); hard values (rates, numbers) go in tables, never loose prose. The page shell, spec properties, and display-name title belong to [[wr.request]] / the VTM template — don't set properties or rename requests from here. Format spec: [[project_skills_workflow_audit]].

**Purpose:** Turn a reference creative + Sam's tweaks (or a raw idea) into a locked beat skeleton. Baseline is the 6-beat structure; more convoluted stories can expand it. Beats lock the **structure + must-hit dialogue anchors** before the dialogue pass fills in the connective tissue. PFM shoots improv-heavy — talent is directed to character, not lines — so beats that include the load-bearing lines are exactly what the dialogue pass and the shoot both need.

## When to Activate

- Sam provides a reference creative and says he wants to adapt/tweak it
- Sam describes a new story-ad idea and asks to beat it out
- Sam says "beat this out," "give me beats," "story beats," or similar
- Sam feeds a past winner and wants a fresh variant
- **Do NOT activate for:** iteration prompts (Stage 3, that's a different skill), full scripts with dialogue (separate pass), or non-story-ad creative

## Core Principles

1. **Beats lock structure + must-hit dialogue. Connective dialogue waits.** PFM shoots improv-heavy — talent understands their character, hits a handful of load-bearing lines, and the scene plays out loose around those anchors. Beats should include any line the performance hangs on: the Mechanism reveal, the ticking-clock line, the CTA, emotional hinges. Leave the connective/color dialogue for the dialogue pass. Never write a full line-by-line script at this stage.
2. **Lead with the Hero — "how do they credibly know the site?"** Every story ad has a Hero who delivers the fix. Lock the Hero first. The question is *how do they credibly know about the site*, not *what's their job*. Personal experience alone ("I used this myself") is a first-class Hero framing — profession is an optional bonus layer. See `context/story-ad-playbook.md` Hero framework.
3. **6 beats is the baseline, not a ceiling.** The 6-beat structure is the gold-standard default. More convoluted stories can and do expand the structure — extra beats for multi-POV, parallel storylines, misdirection, bigger ensembles, longer emotional arcs. Default to 6; expand when the story demands it; never drop below the six functional moments.
4. **Every story ad needs a ticking clock.** In-scene pressure between characters that forces the scene forward. Tow driver about to hook the car, locksmith about to change the locks, Karen about to call the cops. This is a positive storytelling device — NOT fake urgency (which is viewer-facing and banned). If Sam's input doesn't already have one, find a believable place to add it.
5. **The Mechanism (Auto/Home): the lander finds missing discounts.** Every Auto and Home creative must frame the fix as *"our site compares rates AND finds missing discounts on the existing policy"* — not just "compares rates." This has to land in Beat 4 (or wherever the lander is introduced). Loans/Debt Relief has a different mechanism (consolidation).
6. **"Insurance" is a trigger word — delay the reveal until Beat 3.** Viewers scroll the moment they hear "insurance" early, because their brain flags the content as a commercial. Beat 1 (Hook) and Beat 2 (Context) must show the *visible* crisis (tow truck, locksmith, driveway garage sale, smoking engine) without ever saying "insurance." Beat 3 is the earliest the word can enter the story, and it should come out of the struggling character's mouth as a **confession**, not as exposition. Signs, props, and text overlays follow the same rule — the hook visual can reference the *effect* (*"SELLING CHRISTMAS TO KEEP MY HOME"*), never the *cause* (*"insurance is bankrupting me"*). Full rationale in `context/story-ad-playbook.md` section "The insurance reveal."
7. **Double payoff = anti-ad camouflage.** Every PFM story ad must land **two wins together** at the resolution — the fix to the immediate visible crisis AND the fix to the root cause (insurance). Without the second payoff, the ad is too clean — *"character has problem → product solves it → end"* is the unmistakable shape of a commercial and viewers clock it. The second win (Christmas saved, car released, home kept, repair covered) is what disguises the first. **A beat sheet that only resolves the insurance problem is not ready — rebuild it.** Full rationale in `context/story-ad-playbook.md` section "Double payoff = anti-ad camouflage."
8. **Compliance is non-negotiable.** Every beat gets checked against `context/pfm-creative-rules.md` and the relevant vertical file. Violations kill the ad at review.
9. **Scripts-primary, shot-list-minimal.** Never annotate camera direction per line. No "CLOSE UP" / "HANDHELD." PFM shoots with continuous second-camera coverage — that's solved.
10. **Skit count default: 1.** Sam will usually specify skit count and vertical in his prompt. Parse those from the input. If missing, ask.

## Workflow

### Step 1 — Load context (REQUIRED, do this first)

Before drafting anything, read:

- `context/story-ad-playbook.md` — the 6-beat structure, Hero framework, GOOD NEIGHBOR reference
- `context/pfm-creative-rules.md` — cross-vertical non-negotiables
- `context/verticals/{auto,home,loans}-*.md` — the relevant vertical's compliance layer (read only the one that matches the project)

If Sam hasn't said which vertical yet, ask before loading. Default assumption per `CLAUDE.md`: **Auto or Home.**

### Step 2 — Parse and gather inputs

**Parse first, ask second.** Sam will usually specify the vertical, funnel, and skit count directly in his prompt (e.g. *"Beat this out for ABF and HBF, 1 skit"*). Pull those from the input. Only ask about things he didn't specify.

What the skill needs before drafting:

1. **Reference or original?** Is this built from a reference creative (paste it or point to a file in `knowledge/`), or an original idea?
2. **Vertical + funnel:** Which vertical(s) and funnel(s)? (e.g., "ABF" = Auto Broad Forms, "HBF" = Home Broad Forms). Parse from Sam's prompt; ask if not stated. Auto Calls (ABC) and Home Calls (HBC) are both active funnels.
3. **Tweaks:** If reference-based, what's Sam changing? Setting, inciting incident, Hero framing, character shape, tone, ticking clock?
4. **Skit count:** Default 1. Parse from Sam's prompt; ask if not stated.
5. **Hero — "how do they credibly know the site?"** Lock this first. Personal experience alone is a valid baseline (*"I used this site, it worked for me"*) — the Hero does NOT need a profession. If the input is ambiguous about Hero credibility, propose 2–3 options: (a) friendly stranger/neighbor with personal experience, (b) profession + personal experience layered (e.g., Mortgage Broker who also used it), (c) something specific to the story. Let Sam pick.
6. **Ticking clock:** Is there one in the input? If yes, note it. If not, propose a believable source of in-scene time pressure that fits the setting.

### Step 3 — Draft the beats

Output the beat structure for each skit. Keep each beat to **2–5 tight sentences** of action + emotional arc. **Include must-hit dialogue lines inline** where they anchor the beat's function — the Mechanism reveal, the ticking-clock line, the CTA, emotional hinges. Mark must-hit lines in italics and quotes. For connective/color lines, use placeholders like *"authority/mechanism dialogue at the dialogue pass."*

**Default to 6 beats.** Use the baseline structure below unless the story is ambitious enough to warrant more. If Sam's reference / tweaks / premise clearly call for a larger structure (multi-POV, parallel storylines, misdirection, extended setup, bigger ensemble, longer emotional arc), **expand to 7–10+ beats as needed.** Never drop below the six functional moments; adding beats is allowed, skipping them is not. If you choose to expand, say so explicitly in the output header ("Beat count: 8 — expanded for [reason]") so Sam knows it was deliberate.

The 6 baseline beats (from `story-ad-playbook.md`):

1. **Hook** — stop the scroll. Visual + verbal inside 1–2 seconds. **Never mentions "insurance."** Show the *visible* crisis, not the cause.
2. **Context** — establish the people and situation. **Still no mention of "insurance."** Build emotional investment first.
3. **Issue caused by financial struggle** — the concrete problem the lander solves. **This is the earliest the word "insurance" can enter**, and it comes out of the struggling character's mouth as a confession.
4. **Lander as the solution** — the Hero introduces the site/service. Mechanism line lands here.
5. **Solves the overall issue** — emotional payoff, resolution. **Must be a double payoff** — both the insurance fix AND the larger visible/emotional crisis land at the same time.
6. **CTA** — tap/call.

For each beat, name the **action**, the **emotional register**, and (where it matters) which character is driving. Include any **must-hit dialogue** the beat's function depends on — the line the Mechanism reveal hangs on, the ticking-clock line, the CTA, emotional hinges. For everything else (small talk, color, connective dialogue), use placeholders like *"connective dialogue at the dialogue pass"* or describe the intent without writing the line.

### Step 4 — Run the compliance checklist

Before delivering, verify every beat against these (details in `context/pfm-creative-rules.md` and the vertical file):

- [ ] Hero has credible reason to share — personal experience or profession (or both). Not an insurance agent / ex-agent / lender insider.
- [ ] **The Mechanism (Auto/Home):** Beat 4 frames the fix as *"compares rates AND finds missing discounts on the existing policy"* — not just "compares rates." Loans uses consolidation mechanism instead.
- [ ] **Insurance reveal delayed to Beat 3.** No mention of "insurance" in Beat 1 (Hook) or Beat 2 (Context), including in signs, props, and text overlays. Beat 3 is the earliest, and it comes out as a character confession, not exposition.
- [ ] **Double payoff present.** The resolution solves the root cause (insurance) AND a larger visible/emotional crisis — Christmas saved, car released, home kept, repair covered. If only the insurance problem is being solved, the beat sheet reads as an ad and needs to be rebuilt.
- [ ] **Ticking clock present** — in-scene time pressure driving the scene forward. (Ticking clocks are *encouraged*, not flagged as urgency. Only flag if *missing*.)
- [ ] Villain framing is **the system / economy / missing discounts / rate creep** — not the carrier (Loans exception: banks are allowed)
- [ ] No "program" language — use *site / tool / service*
- [ ] Savings framed as possibility — *could save*, *as low as*, never *will save*
- [ ] No **viewer-facing** fake urgency — no "ends today," no countdowns pointed at the viewer. (In-scene ticking clocks are fine, see above.)
- [ ] No brands, carriers, celebrities, politicians, or government imagery
- [ ] Rates framed monthly or yearly — never daily/weekly
- [ ] Rate floors — Auto: $19/month absolute, $39/month team practical; Home Forms: $30/month or $360/year; Home Calls: $50/month, claimed "as low as $600/year"; Loans: APR format
- [ ] "Free" used only for *quote* or *signup* — nothing else
- [ ] **Vertical-specific** (Home): no discussion of "agents" at all; banned words *benefit/apply/application*
- [ ] **Vertical-specific** (Auto): no repo-as-theft framing
- [ ] Hero passes the "outside the carrier/agent/lender space" test
- [ ] SMA / SaveMaxAuto creative? The final creative MUST carry, verbatim: "This advertisement contains synthetic performers created with artificial intelligence." Flag it explicitly in the draft (typically the closing on-screen/VO beat).

Flag any beat that fails. Don't silently rewrite — show Sam what broke and propose the fix.

### Step 5 — Deliver in the output format below

## Output Format

```
# [Project name] — Story Beats

**Vertical / Funnel:** [e.g., ABF — Auto Broad Forms]
**Hero:** [who, + authority framing]
**Relational shape:** [solo / Hero + partner / Hero + counterpart / etc.]
**Skit count:** [N]
**Beat count:** [6 (baseline) OR "N — expanded for [reason]"]
**Source:** [reference name OR "original"]

---

## Skit #1 — [working title]

**Premise:** [1 sentence — what's happening, where, to whom]

**Beat 1 — Hook**
[2–5 sentences: visual + action, who's on screen, the scroll-stopper]

**Beat 2 — Context**
[2–5 sentences: people, situation, establish stakes]

**Beat 3 — Financial-struggle issue**
[2–5 sentences: the concrete problem that sets up the fix]

**Beat 4 — Lander as solution**
[2–5 sentences: Hero enters the fix. Must-hit line for the Mechanism reveal written inline in italics + quotes (e.g., *"It compares rates AND finds the discounts your carrier never told you about"*). Connective dialogue deferred to the dialogue pass.]

**Beat 5 — Resolution / emotional payoff**
[2–5 sentences: what changes, what lands emotionally, the before→after]

**Beat 6 — CTA**
[1–2 sentences: tap / call, and which on-screen direction]

*(For expanded structures: add beats between Context and Resolution as the story requires. Keep Hook at the start and CTA at the end. Number sequentially — Beat 7, Beat 8, etc. Label each with its function: e.g., "Beat 4 — Second POV reveal," "Beat 5 — Misdirection," "Beat 6 — Lander as solution.")*

---

## Compliance notes
[Any flags from Step 4. If clean, say "Clean — passes all cross-vertical and [vertical]-specific checks."]

## Open questions for Sam
[Anything unclear, any judgment calls I made that he should confirm, any Hero/shape decisions I want him to sanity-check]
```

If Sam asked for multiple skits, repeat the Skit block. Keep the compliance notes and open questions sections at the end, not per-skit.

## Example (compact)

**Input:** Sam says *"Beat me out an ABF variant of GOOD NEIGHBOR but make it a mechanic shop instead of a repo scene. Single skit."*

**Output excerpt (Beat 1 + 4 only, for length):**

> **Beat 1 — Hook.** Hero (mechanic shop assistant manager) is walking to her car at the end of a shift. A customer she just finished helping is sitting in the driver's seat of an older sedan, head in hands, hazards blinking. Struggling Husband is on the phone with his wife — they can't afford the repair bill they just got quoted.
>
> **Beat 4 — Lander as solution.** Hero leans in: she's seen this exact situation with customers all the time. Quiet pivot — the repair isn't the root cause, the insurance is. She pulls up her phone and runs his info while he's still on hold. Must-hit Mechanism line: *"This site pulls up your existing policy and finds the discounts your carrier never told you about — that's what killed my rate."* Connective dialogue (small talk, his reaction, the rate reveal delivery) deferred to dialogue pass.

**Compliance flag on this example:** Hero is *"assistant manager at a mechanic/dealership"* — outside the carrier/agent space, clean. Villain is *"missing discounts / rate creep,"* not the carrier. Language stays *"site,"* not *"program."* Passes.

## What to Avoid

- **Writing connective / color dialogue.** Must-hit lines belong in beats — the Mechanism reveal, the ticking-clock line, the CTA, emotional hinges. Everything else (small talk, reaction lines, reveals that aren't load-bearing) waits for the dialogue pass.
- **Writing a full line-by-line script at beat stage.** If every character has dialogue in every beat, it's too dense — strip back to anchors.
- **Per-line shot direction.** No "CLOSE UP," "HANDHELD," "CUT TO." Beats describe action, not camera.
- **Assuming multi-skit output.** Default to 1 skit. Ask if unclear.
- **Locking in "Hero Couple + Struggling Couple" as the default shape.** That was GOOD NEIGHBOR's shape. Other projects use other shapes. Let the story decide.
- **Silently fixing compliance violations.** Always flag them for Sam so he sees the decision.
- **Restating compliance rules in full.** They live in `context/pfm-creative-rules.md` and the vertical files. Reference, don't duplicate.

## Final Note

Structure comes from this skill. The PFM voice and GOOD NEIGHBOR reference come from `context/story-ad-playbook.md`. The compliance guardrails come from `context/pfm-creative-rules.md` and the vertical files. This skill orchestrates them — it doesn't replace them.

When beats are approved, the dialogue pass fills in the connective tissue around the must-hit anchors. PFM shoots improv-heavy — the anchors are what the performance hangs on; everything else is a scaffold for talent to improvise around. See `context/story-ad-playbook.md` section on improv-heavy shooting.

