---
name: social-proof-phone-quote
description: PFM's "customer holding the discount quote on their phone" generator — the social-proof shot where a real-looking person holds up a phone and the branded quote/discount page is ON the screen, sharp and natural, in ONE image. The locked technique: pass the phone-screen graphic as a REFERENCE and build the whole scene around it in a single NB Pro gen ("holds a modern iPhone with the screen facing the camera — the phone screen displays exactly the image in reference 1, unchanged, sharp and readable"). NEVER post-composite a screenshot onto a blank held phone (always reads pasted/fake) and NEVER describe the screen generically (garbles). Use when an editor says "social proof", "customer holding the quote", "person holding their phone with the rate", "holding the discount quote", "phone quote shot", "put the quote page on their phone", "rate-reveal holding shot", "more of him holding the new rate", or needs the held-phone-with-quote look for any brand (SaveMaxAuto / SaveMaxHomes / etc.) — whether a batch of varied generic customers OR a specific story character holding their result. Default: Nano Banana Pro (`nano_banana_2`) 1k, count=1, 9:16 (or 3:4), iPhone camera-roll style. The phone-screen graphic itself is a text-precise UI page built in gpt_image_2 (or pulled from the brand's Phone Screen Discount Pages library). NOT for: building the quote page graphic itself (that's gpt_image_2 / the quote-template step), full-frame screenshot reveals with no person (just show the page), or non-phone social proof.
---

# Social-Proof Phone Quote (PFM)

The shot: a believable real person (or couple) holds up a phone, and the **brand's discount-quote page is on the screen** — crisp, branded, naturally lit and angled, all in **one image**. This is PFM's highest-converting social-proof asset and the "him holding the new rate" beat in story ads.

## 🔴 THE LOCK — screen-as-reference, one pass

The result looks real ONLY when the phone screen is generated *as part of the scene*, with the page handed in as a reference image:

- **Pass the phone-screen graphic as a `--image` reference** (it's `reference 1`).
- In the prompt, place the phone and command the screen: *"He holds a modern iPhone vertically at chest height with the screen facing the camera — the phone screen displays exactly the image in reference 1, unchanged, sharp and readable."*
- NB Pro renders person + phone + screen together → the page sits on the glass with correct perspective, glow, and lighting.

**Two ways that DON'T work (both produced rejected output 2026-06-14):**
- ❌ Generate a blank-screen held-phone photo, then composite the screenshot on in a second pass → reads pasted/stuck-on, "looks so unnatural."
- ❌ Describe the screen generically in prose ("a quote app showing $172") with no reference → garbled, off-brand, "sucks."

## Default config

- Model **`nano_banana_2`**, **1k**, **count=1**, **9:16** (or 3:4 for feed). iPhone camera-roll style (load `nano-banana-prompting`).
- Anti-glossy, authentic skin (pores, laugh lines), real-person feel, slightly handheld off-center framing.
- **Fire mechanics = the shared spine** (`~/.claude/skills/hig-flow/fire_batch.py`; contract in `hig-flow/PIPELINE-SPEC.md`) — it pre-uploads, fires, streams per gen (Rule 5), and serial-downloads with verify. You own the screen-as-reference craft + ref order; the spine fires it. Fire ≥20 needs a preflight (Hard Rule 3) — dry-run the spine (no `--fire`) for the cost line.

## The two inputs

1. **The phone-screen graphic** (the page that goes on the screen). Text-precise UI → **gpt_image_2**. Either build it (clone the brand quote template, swap rate/discounts/domain — digit-verify) or pull a pre-made one from the brand's library:
   - SMA examples + screens: `…/7. SMA Organic/SMA - Brand Folder/Social Proof/` → `Images - Customers Holding Discount Quotes/` (gold-standard results, with `_prompts/*.json`) and `Phone Screen Discount Pages/` (`$39.png … $99.png`, per-rate screens).
   - SaveMaxHomes quote template: `…/Davinci Power Bins - PFM/Client Assets - DPW/SaveMaxHomes - Client Assets/Quote Pages/`.
2. **(Optional) a character master** — when it must be a *specific* person (a story character), add their master as `reference 2` and pin the face: *"The man is <Name> from reference 2 — keep his face and build identical to reference 2."* For generic social-proof variety, skip it and describe the person in prose (vary age/ethnicity/setting — see `feedback_social_proof_selfie_variety`).

## Prompt template (locked — from the SMA Social Proof shots)

```
iPhone camera roll snapshot, candid <setting> moment. <person: either "The man is <Name> from reference 2, keep face identical to reference 2" OR a prose description — age, hair, wardrobe>. <generic setting details, no brand names>, <natural light>. He holds a modern iPhone vertically at chest height with the screen facing the camera — the phone screen displays exactly the image in reference 1, unchanged, sharp and readable. <genuine expression — relieved grin / proud smile / surprised>. Authentic skin with pores and natural texture, real-person feel, slightly handheld framing. Negative: no glossy retouch, no plastic skin, no studio lighting, no stock-photo polish, no AI hand warping, no extra fingers, no carrier logos on phone status bar, no Apple Pay, no notifications, no watermark, no text overlay.
```
- **Selfie variant:** "candid selfie … arm-extended selfie angle … free hand holds a modern iPhone vertically beside his head with the screen facing the camera — …". Keep the selfie arm minimal (`feedback_selfie_arm_framing`).
- **Couple variant:** add the partner as `reference 3`, "he holds the phone between them with the screen facing the camera — …".
- **Ref order matters:** `reference 1` = the phone screen (always). `reference 2` = the character. `reference 3` = the partner.

## Per-rate / per-state

The number on the phone = whichever screen graphic you reference. For a rate/state spread, pre-build one screen page per rate (the SMA library is organized exactly this way: `$39.png … $99.png`) and fire each scene against the matching screen. For a story character across states, swap the screen reference to that state's quote page (the per-state monthly payoff). One scene, N screens → N matched shots.

## Flow
1. Build or pull the phone-screen graphic(s) (gpt_image_2, digit-verified).
2. (If specific person) confirm the character master.
3. Write scenes from the template — vary setting / framing / expression; selfie + 3rd-person + couple mix.
4. Build the job list — **`refs` in strict order: screen page FIRST, then character master, then partner** (`["<screen>.png", "<character>.png", "<partner>.png"]`); `count: 1`; `naming` `{nn}_{shot}_{hex}.png`; `outDir` the project's social-proof folder; `manifest` `"md"`. Then call the spine:

   ```bash
   python3 ~/.claude/skills/hig-flow/fire_batch.py "$JOBLIST" --fire --project-root "$(pwd)"
   ```

   It streams each result as it lands (relay per Rule 5: 📲 CloudFront + widget, before download/QC/picks) + serial-downloads. Local fires are NEVER auto-QC'd — after the results are SHOWN, **OFFER QC** via a plain ask (checks: the on-screen page reads sharp + the face holds; AGF/mini keeps mandatory QC). When a shot misses: name the miss in one line, SHOW it, STOP — the refire is the editor's call, never self-initiated.
5. The spine prints the flat-folder **Lucid handoff** (📁/🔗/🦊 From Claude rail) — relay it.

## What NOT to do
- ❌ Post-composite a screenshot onto a blank phone (the pasted look).
- ❌ Generic prose screen with no reference (garbles, off-brand).
- ❌ Build the screen page in NB Pro (text garbles — that's gpt_image_2's job).
- ❌ Carrier logos / Apple Pay / notifications / status-bar brands on the phone (negative stack, every shot).

## Cross-references
`iphone-broll` (the broader b-roll-regen flow that calls this for its phone beats) · `hig-flow` (gated image batches) · `call-graphics` / quote-template step (builds the screen pages) · `nano-banana-prompting`. Memories: `feedback_social_proof_selfie_variety`, `feedback_selfie_arm_framing`, `feedback_pfm_brand_clean_rules`. Gold-standard reference: `7. SMA Organic/SMA - Brand Folder/Social Proof/Images - Customers Holding Discount Quotes/`.

## 🔴 DIGIT GATE — mechanical digit-verify (G3, mandatory — added 07.17.26)

Any output whose graphics carry NUMBERS (tracking numbers, rates, board values, quote pages) delivers ONLY through the shared digit gate:

```
python3 ~/.claude/skills/call-graphics/scripts/digit_gate.py init "<output dir>" --expected "<the exact number(s)>"
# → gate CLOSES. For EACH listed file: Read the PNG, compare char-for-char, then confirm/fail it:
python3 ~/.claude/skills/call-graphics/scripts/digit_gate.py confirm "<dir>" "<file>"     # or: fail "<dir>" "<file>" "reason"
python3 ~/.claude/skills/call-graphics/scripts/digit_gate.py status "<dir>"               # exit 0 = gate open
```

**Delivery/handoff is FORBIDDEN while `status` exits nonzero.** Run `init` right after download; confirm per-file only after actually Reading that file (attestation, like ref-check — one file at a time, never blanket). FAILED files get fixed/refired, then confirmed. Include the "VERIFIED n/n" line in the delivery report.
