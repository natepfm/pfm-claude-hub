---
name: ag.scenelock
description: "PFM's LOCK-FIRST scene production chain for multi-shot AI-gen creatives with recurring cast (skits, scene-based spots): character masters + Outfit IDs → 360-sheet environment → ONE populated master tableau → every scene frame fired as a re-angle of the tableau. Use on: 'scene lock', 'lock the scene', 'run scenelock', 'set up the locks for this creative', or BEFORE scene-frame gen on any multi-shot scene creative."
---

# ag.scenelock — Lock-First Scene Production

Born 07.27.26 on Skit - Courtroom: ten independently-fired scene frames produced ten slightly different courtrooms — empty jury, flipped geography, flat AI lighting. The cure: **invent the world exactly once, then only re-frame it.** Sam: "I want to be able to recreate this workflow again and again." Validated same day (Sam picked tableau C: "that's a lot better").

## The lock chain — each lock is Gate-0 for the next; NEVER skip ahead

**1. Script locked** — the request's Copy callout, ONE canon, lint PASS.

**2. Cast locked** — `pfm-character-master` for every on-screen character (gpt_image_2, 5-angle, scale anchor). PLUS an **Outfit ID** per character:
- One verbatim wardrobe block per character, named and numbered (`LAWYER-01: navy three-piece suit, light blue tie, silver tie clip, …`), saved to `Elements/Prompts/OUTFIT_IDS.md`.
- 🔴 The block is PASTED verbatim into every prompt the character appears in — never paraphrased, never reworded. Rewording is drift's side door.
- A wardrobe change mid-creative = a NEW ID (`LAWYER-02`), never an edit.

**3. Environment locked** — the 360-sheet method (`feedback_environment_lock_360_sheet_standard`): editor picks a hero plate → ONE NB Pro 2k gen of the 2×2 four-direction sheet anchored on it → crop the quadrants into Front/Back/Left/Right plates. No per-angle one-off env gens.

**4. 🔴 Master TABLEAU locked.** ONE gen (NB Pro, 2k, 16:9) of the scene **mid-action, fully populated, fully lit**:
- Refs: the 360 sheet + every relevant character master.
- Every principal in position + ALL background players (jury, gallery, crowd) — background humans exist from this moment on, never invented per-shot.
- The **continuity paragraph** written into the prompt and saved with it: exact screen-direction geography ("jury box on the LEFT of frame, windows RIGHT, doors behind camera"), who sits/stands where, Outfit IDs verbatim, light source and direction.
- **Commercial lighting language baked in at the source**: one motivated key (window/practical), real shadow falloff, filmic contrast, national-TV-spot grade, subtle grain, digital cinema camera + prime lens. 🔴 BANNED: "flat fluorescent fill"-style prose, over-lit, shadowless — that IS the AI movie-set look.
- Fire 2-3 lighting/grade options; the editor picks; the pick is THE world. Record it in `_HANDOFF.md`.

**4b. 🔴🔴 BLOCKING PLATE locked — added 07.28.26 after the tableau alone proved insufficient.** The tableau locks the room, the cast and the light from ONE camera position. It does NOT lock **where people stand relative to each other**, so every re-angle re-decides the blocking — which on Skit - Courtroom produced a defendant teleported to a podium, an empty jury box, a lawyer on the wrong side of the bar railing, and the jury flipped to the wrong wall. Sam, escalated: *"WE ARE STILL HAVING ISSUES WITH CONTINUITY AND DRIFTING. YOU NEED TO LOCK THE ENVIRONMENT!!!"*

Fire ONE `nano_banana_2` gen, 2k, of a **2×2 continuity blocking sheet** of the POPULATED scene from the four camera positions the creative actually uses — typically: the wide of the space (geography reference), each principal's single, and the insert/tabletop angle. Refs: the tableau + every character master. Because all four panels render in ONE pass, the blocking is locked by construction: the model cannot place a character inside the railing in one panel and outside it in another.

Fire it **9:16 as well as 16:9** when the creative is vertical — a 2×2 of vertical panels is itself 9:16, so its crops are native-aspect clip anchors.

The plate's prompt must declare, as fixed law repeated in every panel:
- **each character's floor position**, room-relative ("in the open well on the TABLE SIDE of the bar railing, ~8 feet in front of the table") plus what they never do ("never standing, never at a podium")
- **background players always present** ("jury box always OCCUPIED by its seven seated jurors") — an empty background is a drift tell
- **props on surfaces** ("a gooseneck microphone on the table"), plus a negative for absence
- **"nobody moves between panels. Only the camera moves."**

🔴 **GEOGRAPHY IS ROOM-RELATIVE, NEVER PERSON-RELATIVE.** Define it once from a single named direction — *"standing in the gallery looking toward the witness table: jury box against the LEFT-hand wall, windows along the RIGHT-hand wall"* — and never restate it as "on his left" or "to the defendant's right." Person-relative directions mirror-flip when the character turns, so a prompt carrying both forms contradicts itself and the set flips. This single phrasing error caused two separate wrong-side-jury renders on 07.27-28.26. Then state each panel's screen directions explicitly, derived from that panel's camera direction.

A character who appears in the creative but NOT in a blocking plate has an unlocked position → add them to a plate before boarding or firing them.


🔴 **NEVER INVENT SET ELEMENTS.** A prop, a piece of furniture, a lectern, a second table — anything an editor has not approved is a NEW CREATIVE DECISION, not a detail. Introducing one inside a prompt makes it appear mid-scene with no continuity behind it (Skit - Courtroom, 07.28.26: a lectern written into the geography unasked, so Gary "suddenly" had a podium). Surface the choice, get the call, THEN write it into the locked geography.

🔴 **ONE LOCKED POSITION PER CHARACTER.** If a character must relate to someone new, they TURN IN PLACE — they do not get a second position. Every additional locked position is another thing that can drift. Write the positions, and the decision log behind them, into a project-level `Elements/Prompts/BLOCKING_LOCK.md` and paste its blocks verbatim into every prompt.

🔴 **STATE BODY ORIENTATION, not just location.** "Seated behind the table" does not say which way a person FACES, so the model picks — and it will pick wrong (Skit - Courtroom: the defendant rendered rotated 90° with the jury box behind his shoulder). Always name the direction the body faces and what is behind their back.

🔴 **A LOCKED OBJECT MUST EXIST IN PIXELS, NOT JUST PROSE.** Any set element a character interacts with (a lectern, a table, a door they enter through) must be VISIBLE in the room blocking plate before any character plate or panel references it. Prose alone gives a zone, and the model re-invents the object's position every panel (Skit - Courtroom 07.28.26: a lectern described only in words rendered in a different spot in every panel — and once with the wrong character behind it). If a needed object is missing from the approved room plate, STOP: re-fire the ROOM plate with the object anchored **between two named fixed elements** ("midway between the railing gate and the witness table, offset toward the window wall"), get it approved, and only then fire the dependent plates. Consistency is structural, never hoped-for.

🔴 **A CHARACTER PLATE CONTAINS ONLY THE CHARACTER BEING LOCKED.** Do not write other principals into a character's blocking panels as "context" — every extra person is a competing candidate for the position being locked (Skit - Courtroom 07.28.26: "the LAWYER stands at the frame edge" written into Gary's lectern panel put the LAWYER at the lectern). Other principals are already locked by their own plates; the room plate is the only sheet that shows everyone together.

🔴 **PRE-FIRE LINT — mandatory before EVERY plate/sheet fire, no exceptions.** Check the drafted prompt against `BLOCKING_LOCK.md` and the pixel authority, panel by panel, and print the result in the preflight:
0-TIMELINE. 🔴🔴 **CONTINUITY IS TIMELINE-WIDE, NOT SHEET-WIDE — think like a script supervisor before like a prompt writer.** A set element either exists in EVERY shot whose camera sees its floor spot, across ALL beats of the scene, or it exists in NONE — a continuous scene's furniture cannot appear or vanish between cuts. Before adding ANY element to a lock or plate, ask: "does every already-approved frame and clip that sees this spot show this element?" If no, adding it creates a continuity hole across the finished video even if every sheet is internally consistent (Skit - Courtroom 07.28.26: a lectern added to the room authority for Gary's beats stood in front of the audience in the wide — while every approved frame of the seven earlier beats showed the same floor empty; the room's own history contradicted itself). Mid-scene introduction of an object requires an ON-SCREEN motivation (someone carries it in) or the editor's explicit call — never a between-cuts materialization.
0a. 🔴🔴 **A PANEL THAT SEES A LOCKED OBJECT IS NEVER FRESHLY COMPOSED — check this before anything else.** Any frame whose camera sees a locked set element (the lectern, a specific table, the doors) must be built as a SINGLE-VARIABLE EDIT of an approved frame that already contains that object in pixels ("@img1 is this exact shot — ADD <one thing>, change nothing else"). Passing the room authority as a reference to a freshly-composed sheet does NOT count — every fresh composition re-invents the object's position, design and facing (Skit - Courtroom 07.28.26: Gary sheet v03 fired fresh against the approved room plate; the lectern moved, changed design between panels, grew a mic, and Gary's facing flipped — the same error the add-lectern edit method had JUST fixed on the wide). Character-at-object shots: start from the approved frame containing the object, edit the character IN. Tighter framings derive from that result (crop, or a push-in edit of it), never from scratch.
0b. 🔴🔴 **NEVER RE-ROLL A SHEET THAT CONTAINS APPROVED PANELS.** An approved (or unflagged) panel is IMMUTABLE PIXELS: crop it out and keep it; it is never regenerated for any reason. Only the broken panel(s) refire, ONE AT A TIME, as single native-aspect frames ref'd to the approved sheet/crops ("same room, same people, same light — fix only X"). The corrected sheet is then rebuilt LOCALLY (ImageMagick/PIL composite of approved crops + fixed panel) — no gen touches assembly. Re-rolling a whole 4-panel sheet to fix one panel gives the model four fresh chances to drift and trades one error for a new one every round (Skit - Courtroom 07.28.26: three full-sheet re-rolls, each fixing one thing and breaking another — audience count, lectern position, focus). One panel per fire = one variable per fire.
1. Every object referenced exists in the pixel authority (@img1). Missing → stop, fix the room plate first.
2. Only the character(s) being locked appear in their panels.
3. Every position is anchored between two named fixed elements — a zone ("in the well") fails; an anchor ("midway between the gate and the table, toward the window wall") passes.
4. Body orientation stated for every person: which way they face AND what is behind their back.
5. Geography stated once, room-relative, from the named reference direction; per-panel screen directions derived from that panel's camera.
6. Lock blocks pasted verbatim from `BLOCKING_LOCK.md` / `OUTFIT_IDS.md` — not paraphrased.
A prompt that fails any line does not fire. This gate exists because every law above was added reactively after a burned gen; the lint is what makes them run BEFORE the spend instead of after.

🔴 **LOOK AT EVERY GENERATED SHEET BEFORE DELIVERING IT.** Read the PNG and inspect it. Do not describe what you asked for as though it were what came back. On 07.27-28.26 the editor caught every drift because Claude never opened the images — the moment they were actually read, the errors were obvious in seconds. Report what you SEE, including the flaws you find, before the editor has to.

**5. Scene frames come from the STORYBOARD, and storyboard panels come from SHEETS — see [ag.storyboard](../ag.storyboard/SKILL.md).** Never render scene frames one at a time; four-per-sheet in a single pass is what holds continuity, and approved panels are CROPPED into clip anchors rather than re-rendered. When a one-off frame is genuinely unavoidable it fires with the **blocking plate as the dominant (first) ref** + the character master(s) for tight singles, prompt = "the SAME room, the SAME people, the SAME light as the reference, new camera position: <framing from the shot board>" + the continuity paragraph + the Outfit IDs. Never fire a scene frame into an empty plate again.

**6. Clips** — per `wr.shotboard`'s gen-unit grouping (Seedance multi-shot first, Veo fallback), each clip ref'd to its scene frame (`feedback_veo_ref_scene_frame_not_master`), aspect matched.

## Pairs with
- `wr.shotboard` — writes the coverage plan the re-angles execute. Board first, then locks, then frames.
- `pfm-character-master` / `environment-location-builder` — the lock-2 and lock-3 engines.
- Standard fire discipline rides along: CLI fires, count=1, vN in place, stream results, 📁/🔗/🦊/📲 handoff.

## Not for
NOT for: single-character talking-head creatives (UGC/podcast skills own those), b-roll batches (type skills), real shoots, or firing clips (hvg/Seedance paths). This skill produces LOCKS; the editor triggers each gen stage.
