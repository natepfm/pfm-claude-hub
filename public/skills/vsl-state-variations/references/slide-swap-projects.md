# State-variant slide projects — NB Pro slide-swap craft

Moved from `hig-flow/SKILL.md` (2026-07-09) — the image-side craft for per-state versions of a winning VSL/ad (Florida → Colorado, etc.).

- **Only fire shots where the visual changes between states.** Narration / no-slide lines reuse the broad/winner version's `LXX - Generic.png` files unchanged — Chad-on-plain-plate is state-agnostic.
- **Edit-style prompts must swap ALL state/city/name tokens, not just the headline data.** A common failure: prompt says "replace rate with $230" and gets a great rate swap — but leaves "Tampa" or "Orlando" still written on the slide because the prompt never told NB Pro to touch the city. Default prompt structure:
  ```
  TWO (or N) changes required:
  (1) Replace <rate/number> with <new value> in <color>...
  (2) Replace the city name '<old city>' with '<new city>' anywhere it appears as text...
  (3) Replace the state name '<old state>' with '<new state>' anywhere it appears as text...
  Make NO other changes — preserve every other pixel.
  ```
- **Inspect the source slide for ALL embedded text tokens** before drafting the prompt — state name, city name, person's name (Ryan→Jason), regional/cultural cues. One token missed = one re-fire.
- **Check for multiple DESIGN VARIANTS per slot.** Florida has `L1 - Title Slide - v1.png` AND `L1 - Title Slide - v2.png` — those aren't two takes, they're two different slide designs (e.g. "FLORIDA AUTO INSURANCE CONFERENCE" + "FLORIDA TECH AUTOMOBILE CONFERENCE"). Both designs need state swaps. **Before scoping a state batch, list every `L<NN> - * - v*.png` in the broad/winner folder and treat each unique design as its own shot.** Common slots with multiple designs: title slides (L1), CTA cards (L41), discount lists. If unsure, ls + diff the file sizes — different designs usually have visibly different sizes.
- **Naming distinction — design variant vs. take.** PFM's broad/winner folder uses `v1`/`v2` suffix for *design variants* (one file each). When firing with `count=2`, each state batch produces *takes* of each design — name accordingly so they don't collide:
  - Design A, take 1 + take 2 → `L1 - Title Slide - <State> - v1.png` + `... - v2.png`
  - Design B, take 1 + take 2 → `L1 - Title Slide - <State> v2 - v1.png` + `... - v2.png`
  - The "v2" before the dash = design variant; the "v1/v2" after the dash = take number
- **Identity preservation language is non-negotiable** for character slides — explicit "keep the person's identity, face, expression, clothing, pose, framing, lighting, background completely identical." NB Pro will subtly re-render the face if not told to lock identity.
- **Output naming convention:** mirror the broad/winner folder's filename pattern with the state appended (e.g. `L1 - Title Slide - Colorado - v1.png` to match `L1 - Title Slide - v1.png`) so the editor can swap them in by exact filename.
- **Output folder:** `Elements/Footage/Reference/Slide Images - <State>/` per editor's convention. Don't put state slides in the same folder as the broad/winner — keeps timelines clean.
- **Resolution:** NB Pro 1k and 2k cost the same (~2 cr). Default to **2k** for full-screen slide work.
