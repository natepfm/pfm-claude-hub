---
name: veo-life
description: PFM's "Veo Life" still-to-subtle-motion pipeline — takes finished social-proof / b-roll STILLS and brings them to life as 6-second locked-camera cinemagraph clips (breathing + slow blinks + one scene-matched atmospheric motion, no audio) via Veo 3.1 Lite img2vid. Use whenever an editor says "bring these to life", "veo life", "subtle life", "animate these stills", "make them breathe", "turn the best ones into videos", "cinemagraph these", "make the social proof move", tags stills with a blue Finder tag for animation, or finishes a still batch and wants motion versions. Handles intake (blue-tag scan / named files / folder), per-still prompt build from the locked cinemagraph template, gated preflight, detached batch fire with per-clip streaming (Rule 5), an OFFERED filmstrip QC pass (delegated to visual-qc), and manifest delivery. 4×-production-proven (SMA, SaveMaxHomes EN+ES, Auto Calls — 55 clips). NOT for: talking heads or dialogue clips (ugc-talking-head-veo / hvg-flow), news-anchor wall cinemagraphs needing a D-locked end frame (anchor-wall-composite feeds those), generating the source stills themselves (hig-flow / nano-banana-prompting), or any clip where the character should act, gesture, or speak.
---

# Veo Life — bring stills to subtle life

## ⚡ Backgrounding rule (locked 2026-06-09)

Every long-running Bash call in this skill runs with `run_in_background: true` — fires, downloads, QC passes, anything expected >30s. Hard trigger: **3+ generations in one action = always backgrounded.** Foreground Bash times out at ~2 min mid-gen and reads as "stuck," blocking the editor's chat. Foreground is ONLY for quick (<30s) utility calls whose stdout the next step strictly needs (e.g., serial ref uploads returning UUIDs). While a backgrounded step runs, keep the chat free; report when the completion notification lands.


Take a set of approved stills (usually social proof) and produce 6-second, 9:16, audio-free cinemagraph clips: the person breathes and blinks, one background element moves gently, everything else — camera, expression, phone, text — stays planted. The result reads as a live photo, not a video performance. Editors drop these into feeds/CTV edits where motion stops the scroll but acting would break the candid illusion.

This is a **gated flow**: invoking it satisfies Hard Rule 1's check-and-ask. All other hard rules still bind — Lucid asset handoff (📁 + 🔗 + 🦊) on every folder mention, and a full preflight with an AskUserQuestion fire card when the batch is ≥20 clips (under 20, a plain markdown **Fire?** line is the gate).

## Why the recipe is shaped this way

Veo wants to *direct* — given a person, it will turn heads, add gestures, invent glances and reactions. Every line of the locked template exists to suppress that: the clip must feel like a photograph that happens to be alive. The single atmospheric motion is what sells it — pure breathing reads as a glitch, but steam off a mug or rain on a window gives the eye one honest moving thing and makes the stillness look intentional.

## Step 1 — Intake

Three intake modes, in order of preference:

1. **Blue Finder tag scan** (default when the editor says "the ones I tagged"): scan the stills folder for `com.apple.metadata:_kMDItemUserTags` containing Blue. Report the count and filenames back to the editor before building anything — they asked "how many did I tag" last time; always answer that first.

```bash
python3 ~/.claude/skills/veo-life/scripts/scan_finder_tags.py "<stills folder>" [tag_color]
```

(Any tag color works — pass "green" if the editor says "the green ones"; defaults to blue.)

2. **Named files** — editor lists them or links a Lucid folder + IDs.
3. **Whole folder** — "do all of them"; confirm the count before slate build.

**Curate before you spend.** Read every source still (or at minimum the riskiest) before animating. Defective sources — phone-UI chrome, baked timestamps, carrier logos — make defective clips at 12 cr each. Exclude and flag; offer a still refire instead.

## Step 2 — Slate build

Output folder: the brand folder's `Social Proof/Video/` (or wherever the editor points). Files land as `<slug>_<id>_v01.mp4`; slug pattern `<project>_life` (e.g. `ac_call_life`, `smh_socialproof_life`).

Write into the output folder:
- `_<slug>_prompts.json` — the fire spec: `{project, slug, model: "veo3_1_lite", duration: 6, aspectRatio, generateAudio: false, sourceFolder, outputFolder, clips: [{id, source, prompt}]}`
- `_<slug>_config.json` + `<slug>_shots.xlsx` — pending manifest via `~/.claude/skills/hig-flow/build_xlsx.py` (works for video; set modelDisplay "Veo 3.1 Lite (Veo Life cinemagraph, 6s)", estCostPerImage 12)

### The locked prompt template (validated across 55 clips)

```
Cinemagraph style. {who} like a still photograph that's slowly coming to life.
Subtle natural breathing only, slow soft blinks. No head turns, no scripted action,
no glances down. Expression unchanged throughout. Locked camera, no camera motion.
{lock} 9:16 vertical, 6 seconds, single continuous take. {atmo}
Negative: no head turn, no acting, no glance down, no scene change, no music,
no audio, no screen content change, no text morphing, no warping.
```

- **{who}** — one plain clause naming the subject as they appear in the still: "The woman laughing on the phone at the coffee shop window". For couples/groups: "Both of them breathe softly and blink slowly."
- **{lock}** — pin every holdable object: "The phone stays exactly in place at the ear." / "...perfectly still in his hand." / "...still between them." Phones, documents, mugs, pens, gesture hands ("His gesturing hand holds still."). If a readable screen/document is in frame, lock it explicitly: "The policy stays perfectly still and readable."
- **{atmo}** — exactly ONE scene-matched atmospheric motion, always secondary to the human. Menu (extend freely, same energy):

| Scene element | Atmo line |
|---|---|
| mug / coffee pot | "A thin wisp of steam rises from the mug." |
| window in rain | "Rain streaks slide gently down the window glass." |
| lake / harbor | "Thin mist drifts over the water; faint ripples cross the surface." |
| pool | "The water ripples softly, reflections shimmering in slow motion." |
| ocean | "Small waves roll slowly in the distance." |
| outdoors generally | "A gentle breeze stirs loose strands of hair / the canopy edge / a sleeve / a page corner." |
| string lights / lamps | "A barely perceptible warm flicker." |
| job site / gravel | "Faint dust drifts across the lot." |
| curtains | "The sheer curtains sway almost imperceptibly." |
| porch swing | "The swing sways a fraction of an inch." |
| car interior | "Sunlight shifts faintly through the windshield." |
| nothing usable | omit — pure breathing, and add "Background people remain completely still." |

- **Background people** (markets, barbershops, food courts): always append "Background shoppers/people/diners stay completely still." Frozen extras read as cinemagraph convention; warping extras read as AI.

### Hard constraint — no D-lock on people

Never fire these as start-frame + end-frame with the same image (D-lock). Same-UUID start+end freezes the *character* too — kills the breathing. D-lock is correct only for news-anchor wall cinemagraphs where total stillness is wanted. Veo Life = **single `--image` reference + breathing language**. (See memory `feedback-d-lock-kills-character-motion`.)

## Step 3 — Preflight (the gate)

Show: project, brief, model lock (`veo3_1_lite` · img2vid · 6s · 9:16 · audio off), item count, cost (12 cr/clip × N, current balance via `higgsfield account status`), **link handoff output** (backticked `/Volumes/ads/...` path + linkyourfile link; the 🦊 rail drop fires at delivery), a table of ID → still → atmo motion, one representative full prompt, then **Fire?** — AskUserQuestion card (🔥 Fire / Hold) if ≥20 items, plain markdown otherwise. No fire without explicit confirmation.

## Step 4 — Fire (detached chain) + STREAM EVERY CLIP AS IT LANDS (RULE-5)

**🔴 RULE-5: Show every gen the instant it lands — 📲 CloudFront + widget (`job_display`/`show_generations`) — before download, QC, or picks. QC verdicts come AFTER the reveal, below it, never as a gate.** The firing mechanism MUST expose each `result_url` the moment it exists — surface each clip to the editor (📲 tappable link + widget, labeled v-number + still name) as it completes, never one end-of-batch dump.

CLI only — `higgsfield generate create veo3_1_lite --prompt "..." --image <UUID> --duration 6 --aspect_ratio 9:16 --generate_audio false --wait --wait-timeout 6m --json`. MCP firing is forbidden.

Use the detached chain pattern so the batch survives harness timeouts:

1. **Runner** (idempotent Python in /tmp): skip clips whose `dest` exists with size>0 → serial ref uploads (`higgsfield upload create <still> --json`, 3 attempts, [5,15]s backoff, UUID cache JSON in /tmp) → `ThreadPoolExecutor(max_workers=10)` fires → parse result URL from JSON stdout (fallback regex `https://...mp4`) → **stream each clip's `result_url` to the editor the instant it returns** (log lines the watcher can relay live), then download it the moment its job finishes.
2. **Chain script**: `runner → sleep 20 → runner again (auto-sweep) → touch /tmp/<slug>_DONE`. Launch with `nohup ... &` (sandbox disabled), plus a harness-tracked background watcher polling the DONE marker — the watcher relays each newly-landed clip to chat as it appears, not at the end.
3. **One sweep only.** Jobs that finish do so in ≤~300s; 600s+ waits always die. After the sweep pass, remaining stalls are accepted losses — report them, don't solo-retry with long timeouts (house rule, editor-confirmed).

## Step 5 — Filmstrip QC (EDITOR-INVOKED only — 🔴 no QC, no QC ask on local fires)

**Local fires get ZERO QC and ZERO QC questions (Sam 2026-07-20).** The clips are already in the editor's hands from Step 4 — deliver and stop. End the report with one passive line: *"QC available on request: `/qc.video` (filmstrips) · `/qc.g` (Gemini watch)."* Run QC only if the editor explicitly asks. AGF/mini runs keep mandatory QC (autonomous, nobody watching).

On yes: **delegate the mechanics to `visual-qc` — the single filmstrip owner.** Point its scanner at the output folder (its 5-frame strips + ✓/✗/🔍 criteria apply; `scripts/filmstrip.sh` remains as the quick 3-frame helper for a single 6s clip). Cinemagraph-specific fail signals: warping faces/hands, text morph, head turn / new gesture, scene drift, hallucinated overlays; pass = near-identical frames with only micro-shifts.

Verdicts render BELOW the already-shown clips, as the skill's recommendation — the editor picks. On editor-confirmed fails: refire as next `vNN` with the violated constraint reinforced in the negative line; bin defective takes to the project's `Outdated/` with a `_DEFECT_<reason>` suffix. Flag borderline motion (e.g. a couple leaning in) to the editor rather than silently keeping or killing it.

## Step 6 — Finalize + report (a summary, NOT the first reveal)

Every clip was already shown as it landed (Step 4) — this report is the wrap-up, never the editor's first sight of anything. Rewrite the config statuses (✓ / ✗ with notes), rebuild the xlsx, and report: delivered count, stalls/losses, QC outcome with any flags (if the offered pass ran), manifest name, **Lucid handoff (📁/🔗/🦊)** to the output folder, and the post-run balance.

## Cross-references

- Source stills: `nano-banana-prompting` (raw straight-off-the-phone variant) via `hig-flow`
- Talking heads / dialogue clips: `ugc-talking-head-veo`, `hvg-flow` — not this skill
- Anchor wall stills: `anchor-wall-composite` (D-lock territory)
- Post-batch audio QC: not needed here — clips are fired with `--generate_audio false`; if a clip somehow carries audio, that's a QC fail (refire)
