# CUTS playbook — location masters + demographic cast cards (Mode B)

> Zach Hustead's v2 method (proposed 07-14, shipped 07-15). Proven at full scale on **Home Depot Crew** (4 masters · 32 cards · 32 clips) and **Home Cleaners Crew** (5 masters · 40 cards · 40 clips), both 8-way. Use this mode when a fake one-take doesn't fit the location; the no-cuts chain method lives in `no-cuts-playbook.md`.

## When cuts beats no-cuts
The no-cuts chain works in OPEN settings (block party, car meet, jobsite yard) where the camera can plausibly travel. It **breaks in multi-room or aisle-heavy locations** — keeping a house or store proportionally accurate across a chained take doesn't hold. Cuts keeps everything else (script skeleton, 8-way matrix, verbatim rates) and swaps the spine: **each interview beat is its own independent clip off its own start-frame card.**

## The three waves

### Wave 1 — location masters (NB Pro, 9:16 1k)
One master per interview **station** (e.g. kitchen / living room / dining window / entryway / porch-selfie plate), all reading as ONE coherent **brandless** location. Look = raw-UGC-but-de-grained "modern iPhone."
- 🔴 **Text-only NB fires trip a fake "Not authenticated" error when parallel — fire masters SERIAL with a gap.** (`--image` fires are immune and go full-parallel.)
- Editor stamps each master; UI-overlay strips + de-grain edit passes as needed (edit passes are `--image` → parallel-safe).

### Wave 2 — cast cards (NB Pro, `--image` = the station master)
Per demographic version: one card per worker + the host.
- 🔴 **EVERY worker gets a DISTINCT written identity** (build / hair / facial hair / glasses) — one demo string for a whole crew renders triplets. Mandatory per person.
- Everyone gets the **"pleasant approachable, ordinary-attractive, NOT model-glamorous"** dial.
- **Uniforms COMPLETELY BLANK** + anti-branding negatives.
- **Host card = a phone-free selfie plate** — the camera IS the arm; the selfie arm never holds anything but the camera.
- ≥20 cards → preflight + Fire? card (Rule 3). After landing: **agent audit for uniform branding / warps** → surgical 2-credit wipe passes on flags ONLY.

### Wave 3 — clips (Seedance 2.0, 720p, `--start-image` = the card)
One clip per station. **Duration = the spoken load** (12s / 10s tiers).
- 🔴 **Seedance duration hard cap = 15s.** An 18s ask fails input validation — zero credits burned but the batch **silently drops** those clips. Editor stamps durations ≤15.
- **CTA clip:** attach the lander PNG as a `--medias` reference (auto-picked-up from `Elements/Graphics/`, pre-uploaded); the host pulls a phone **MID-CLIP** with the free hand (from a pocket).
- ≥20 clips → preflight + Fire? card. Auto-retry Higgsfield 502s (transient) up to 3× with backoff.

## The locked prompt-stack (hard-won — apply ALL of it)
- **Anti-radio audio block:** NEVER write "phone-distance" for the off-camera interviewer — Seedance reads it as a telephone filter. Say **"standing a few feet away off-camera"** + explicit no-radio / walkie-talkie / PA / bandpass negatives.
- **Chant guard:** "Each line ONCE only… after the last scripted word NOBODY speaks again — the rest of the clip is wordless." (Kills the looping "no no no" tail.)
- **Screen-orientation lock (CTA phone):** "THE PHONE'S SCREEN FACES THE CAMERA LENS DIRECTLY… NOT mirrored, NOT flipped" + mirrored-screen negatives. Backwards screens are systematic (~3-in-8 even WITH the lock on the first pass) — **check every CTA clip**; if a roll still lands backwards, add a deliberate ROTATE-to-camera action beat.
- **Hand rules:** selfie arm = camera only; only the FREE hand pulls the phone.
- **Word-flub respell:** comma-beat-of-air + syllable spell-outs for flub-prone words ("ZIP, as in zipper without the -er").
- **Blocking:** body planted, head-turn only; per-station physical closer (swatch tap, range pat, pen click, nod).
- **Numbers:** spoken-form in gen dialogue; captions keep numerals.

## The pipeline around the waves
1. **Fetch + format the Notion request.** The Copy block is usually a rough competitor rip — rebuild speaker attribution, add host bridge questions, flag missing rates for the editor to stamp. Editor rubber-stamps the locked script + the 8-way name/pronoun swap matrix (demographic adaptations OK — spoken names, spouse gender, age-bound lines like "52 years" → "25 years" on middle-age versions, gendered payoffs like nail tech → electrician's license). Script-is-LAW rules from Mode A apply verbatim.
2. **Scaffold the project folder** (full canonical template) + save the locked script to `Elements/Prompts/`.
3. Waves 1→2→3 as above, editor-stamped between waves.
4. **QC** — ffmpeg physics + **high-pass radio probe** (band-limited voice = HF drop >30dB) + Whisper-small verbatim vs expected per-version dialogue. 🔴 Whisper renders spoken numbers as DIGITS → `dialogue_mismatch` false positives — **always read the flagged transcripts before refiring.**
5. **Deliver + import** — per-version Veo folders on Lucid, one take per slot after culls; import current-best into the editor's Resolve bin convention (Project bin > Elements > V1–V8).

## Naming (locked in practice)
- Masters: `Elements/Footage/Reference/Masters - <Location> Areas/<Slug>_master_<area>_vXX.png`
- Cards: `Elements/Footage/Reference/V<N> - <Demo>/<Slug>_V<N>_{W1..Wn,HOST}_vXX.png`
- Clips: `Elements/Footage/Veo/V<N> - <Demo>/<Slug>_V<N>_clip0X_vXX.mp4`
- One file per slot after stamped culls.

## Environment gotchas
- macOS ships bash 3.2 — no `${var^}` in fire scripts.
- Higgsfield 502s = transient; auto-retry ≤3× with backoff.

## Worked examples (real)
- **Home Depot Crew** (`07.13.26 - UGC Interview - Home Depot Crew`): 4 masters, 32 cards, 32 clips (C1 15s / C2 10s / C3 12s / C4 12s), SaveMaxHomes $550 lander held in the C4 selfie card.
- **Home Cleaners Crew** (`07.13.26 - UGC Interview - Home Cleaners Crew`): 5 masters, 40 cards, 40 clips (5-beat script), SaveMaxHomes $1,100 lander pulled MID-CLIP via `--medias`.
