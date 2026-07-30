#!/usr/bin/env python3
"""V2 canonical prompt builder — EVERY clip prompt comes from HERE, never hand-written.

WHY (BlockPartySrBroad post-mortem, 07-28, measured): hand-written prompts dropped guards
between clips — hold-guard in one, missing in the next; setting-lock in c01 absent in c03;
generic lip-lock where the person needed naming. Result: ~48 billed fires for 24 keepers.
The guards live in THIS file as code. A prompt that misses a guard cannot be produced.

Move types (the real driver of mid-clip cuts — measured: scale-change pulls splice,
scale-preserving pans don't; PSNR between endpoints does NOT discriminate, tested 07-28):
  hold         no camera travel; background FROZEN language is safe here (and only here)
  ease         scale-PRESERVING lateral pan (people stay the same size). The reliable move.
  reveal_keep  pan that brings new people in at constant scale
  pullback3    the ONLY sanctioned zoom-out: <=3 characters in the end frame, slow glide.
               Full-cast pull-backs are BANNED as a first attempt (5-cut streak, V2 c05) —
               this builder refuses to emit one.

Spec JSON (one per version):
{
  "project": "BlockPartySrBroad", "version": "V2",
  "host_voice": "a disembodied off-camera deep male voice — low baritone, plain American accent, warm and quick",
  "environment": "the same cedar privacy fence, raised wooden deck, pennant flags, black kettle grill, ...",
  "ambience": "a constant low neighborhood block-party ambience — distant chatter, birds, a far-off car passing, a light breeze over the mic",
  "cast": {"OG": "the eldest woman, in the pale yellow cardigan ...", "P2": "..."},
  "props": {"P2": "holding a red plastic cup"},
  "group_noun": "women",
  "clips": [
    {"clipId": "c03", "move": "ease", "direction": "RIGHT",
     "inFrame": ["P3","P4"], "speaker": "P4",
     "hostLine": "And you?",
     "line": "Three bed, full coverage, six hundred twenty a year. ...",
     # 🔴 script = EVERY spoken beat of this clip, verbatim from the request Copy. The build FAILS
     #    if any beat is missing from the generated prompt (no silent script truncation, ever).
     "script": ["And you?", "Three bed, full coverage, ...", "Wait, really?", "Always."],
     # a MID-CLIP host question + reply (multi-beat closers):
     "followUp": {"hostLine": "Wait, you can negotiate?", "line": "Always."},
     "voice": "the warm easy voice of an older white American woman, plain American accent",
     "rateGuard": "six hundred twenty a year",          # optional
     "closing": "a small proud nod, mouth closed"}      # optional
  ]
}

Usage: build_prompts.py spec.json --out "<Elements/Prompts dir>"
Writes <project>_<version>_<clipId>_prompt.txt per clip + a joblist-fragment JSON carrying
clipId/move/inFrame counts so fire_bounded.py's pre-fire gate can enforce the move law.
"""
import argparse, json, os, re, sys


def _norm(s):
    """Loose match: collapse whitespace, straighten quotes, case-fold."""
    s = (s.replace("’", "'").replace("‘", "'")
          .replace("“", '"').replace("”", '"'))
    return re.sub(r"\s+", " ", s).strip().lower()


def verify_beats(c, prompt):
    """🔴 SCRIPT-COMPLETENESS GATE (encoded 07-29 at the editor's instruction).

    A clip's `script` is the ordered list of EVERY spoken beat for that clip, verbatim from the
    request's Copy section. This refuses to emit a prompt that drops one.

    WHY IT EXISTS: the c06 closer shipped missing "Wait, you can negotiate? / Always." because the
    builder had no field for a mid-clip host line and the script was quietly trimmed to fit the
    tool. Script is law; a tooling gap is never a licence to shorten a line. Now it cannot compile."""
    beats = c.get("script")
    if not beats:
        print(f"  ⚠ {c['clipId']}: no 'script' beat list — dialogue completeness is UNVERIFIED. "
              f"Paste this clip's beats from the request Copy into its 'script': [...] to enable "
              f"the check.")
        return
    p = _norm(prompt)
    missing = [b for b in beats if _norm(b) not in p]
    if missing:
        sys.exit(
            "ERROR: clip %s DROPS %d of its %d script beat(s) — refusing to build.\n"
            "  Missing:\n    - %s\n"
            "  The script is LAW. Do NOT shorten the line to fit the builder — carry the beat:\n"
            "    · a mid-clip host question + reply  -> \"followUp\": {\"hostLine\": \"...\", \"line\": \"...\"}\n"
            "    · a frame-one question              -> \"hostLine\"\n"
            "    · the speaker's words               -> \"line\"\n"
            "  If none of those fit, EXTEND THE BUILDER, then rebuild."
            % (c["clipId"], len(missing), len(beats), "\n    - ".join(missing)))

MOVES = ("hold", "ease", "reveal_keep", "pullback3", "pushin1")

FORMAT_LINE = ("Amateur vertical iPhone video, one continuous handheld shot, no cuts. "
               "The person filming is off camera and is NEVER seen.")

FIRST_FRAME = ("The FIRST FRAME is EXACTLY the provided start image and the shot HOLDS on it for a "
               "full beat before any movement begins. Do NOT re-stage, do NOT change the framing at "
               "frame one, and do NOT snap to a different framing at any point. The entire clip is "
               "ONE single unbroken take — the framing changes ONLY by the camera physically moving, "
               "never by cutting.")


def move_block(c):
    d = c.get("direction", "RIGHT").upper()
    m = c["move"]
    if m == "hold":
        return ("The camera HOLDS this framing for the whole clip with constant subtle handheld "
                "sway — it does not travel, does not push in, does not pull back. The framing of "
                "the last frame matches the provided end image.")
    if m == "ease":
        return ("The camera travels continuously from the first frame to the last frame in ONE "
                f"unbroken move, eased at both ends — it holds with gentle sway for a beat, eases "
                f"into the move to the {d}, and settles on the framing of the provided end image. "
                f"The camera physically MOVES to the {d} along the row, so the scene slides "
                f"{'LEFT' if d == 'RIGHT' else 'RIGHT'} across the frame — a real lateral camera "
                "move with real parallax, not a swap of people within a fixed frame. The people "
                "stay the SAME SIZE in frame throughout — the camera does not move closer or "
                "farther, only sideways. It SETTLES exactly on the end framing and HOLDS there "
                "until the clip ends — it never overshoots the end framing and never keeps "
                "traveling after it settles. Constant subtle handheld sway throughout, never "
                "perfectly static.")
    if m == "reveal_keep":
        return ("The camera travels continuously from the first frame to the last frame in ONE "
                f"unbroken move, eased at both ends, panning to the {d} so the next person comes "
                "into frame from the edge at the SAME SIZE as everyone already in frame — the "
                "camera stays the same distance from the people, it only turns/slides, it does NOT "
                "widen and does NOT pull back. It ends EXACTLY on the framing of the provided end "
                "image, SETTLES there and HOLDS until the clip ends — it never overshoots and "
                "never keeps panning after it settles. Constant subtle handheld sway throughout.")
    if m == "pushin1":
        # The closer's reverse of pullback3: come back IN off the group to a SINGLE on the speaker
        # (editor lock 07-29: "focus back on the singular OG character").
        # 🔴 Three corrections locked 07-29 after V4 c06 v04:
        #   (a) frame one must BE the seam and HOLD — the render was starting already-tighter, so the
        #       join read as a wrong seam;
        #   (b) it is a WALK-IN (the person filming steps closer), NOT a lens zoom — a zoom has no
        #       parallax and reads as a graphic effect, not UGC;
        #   (c) natural pacing — unhurried, with real beats, not a rushed glide.
        # 🔴 TIMINGS MEASURED off the approved reference closer (Home BlockPartySrBroad V4 c06 v03,
        # watched via watch-video 07-29): 12s clip · static 0–1s · tighten 1s→7s · STATIC 7s→end ·
        # ends chest-up on the speaker with ONE partial neighbour still at the edge · non-speakers
        # stay planted and are simply narrowed OUT of frame — nobody walks and nobody is passed by.
        return ("🔴 THE FIRST SECOND IS EXACTLY THE START IMAGE — identical framing, identical width, "
                "identical position, only natural handheld sway, NO travel at all. The clip opens on "
                "that framing and holds it while the first line is spoken.\n\n"
                "AFTER that first second the person filming — off camera, never seen — physically "
                "CARRIES THE CAMERA FORWARD toward the speaker, closing real distance on foot in one "
                "slow smooth continuous move that runs about six seconds and then STOPS. Once it stops "
                "(roughly the last third of the clip) the camera holds that final framing completely, "
                "with only handheld sway, until the clip ends — it does NOT keep creeping, does NOT "
                "drift, and does NOT move again.\n\n"
                "🔴 THIS IS A REAL FORWARD MOVE THROUGH SPACE WITH VISIBLE PARALLAX — the camera "
                "genuinely travels toward her, so the perspective shifts: near things slide past "
                "faster than far things, the background houses and trees change relative position "
                "behind her, her face grows larger through true depth rather than magnification, and "
                "the people at the edges are physically PASSED as the camera advances between them. "
                "It is NOT a zoom, NOT a digital zoom, NOT a crop-in, NOT a scale-up of the same "
                "image — the frame must never look like a still being enlarged.\n\n"
                # 🔴 FRAMING LAW locked 07-30: the old text here read "IT SETTLES CHEST-UP ON THE
                # SPEAKER" — naming the TORSO as the subject and bounding only the BOTTOM of frame.
                # A 12s MN c05 push-in duly ended on the speaker's chest and scarf with her head
                # cropped off above the top edge. The face is now the anchor and the ceiling is hard.
                "🔴 FRAMING LAW — THE FACE IS THE ANCHOR AND IS NEVER CROPPED: the speaker's FACE and "
                "EYES are FULLY INSIDE the frame in EVERY frame of the clip, first to last, and there "
                "is always visible AIR above the TOP OF HER HEAD. The frame is composed around her "
                "FACE — never around her torso, chest, neck, shoulders or clothing. If the camera gets "
                "close enough that the top of her head would leave the frame, IT IS ALREADY TOO CLOSE: "
                "stop the move before that point. A frame showing her body with the head cut off is a "
                "FAILED shot.\n\n"
                "🔴 CAMERA HEIGHT IS LOCKED AT EYE LEVEL for the whole clip — held by a standing person "
                "filming a standing person, roughly five and a half feet off the ground, level with the "
                "speaker's EYES. It does NOT sink to chest height, does NOT tilt down onto her body, "
                "and does NOT advance at torso level.\n\n"
                "🔴 HOW CLOSE IT ENDS — A HARD CEILING, NOT A TARGET: the very TIGHTEST the framing is "
                "ever allowed to become is from just ABOVE THE TOP OF HER HEAD down to about her WAIST, "
                "with ONE neighbour still partially in frame at the edge. That is the LIMIT of the move, "
                "not a waypoint to travel through — it is not a close-up and not a tight portrait. If "
                "there is any doubt, STOP EARLIER and end WIDER.\n\n"
                "🔴 IT NEVER WIDENS AND NEVER BACKS OFF — the FIRST FRAME is the WIDEST the clip ever "
                "is. The camera only ever closes distance. It must NOT pull back or start wider than "
                "the start image to make room for the move.\n\n"
                "🔴 NOBODY WALKS — the PEOPLE never move. Every person stays PLANTED exactly where they "
                "stand, feet still, for the whole clip; their only motion is small smiles and nods. "
                "The ones at the edges leave the shot ONLY because the CAMERA advances past them, "
                "never because they step, stride or cross the frame themselves. All the movement in "
                "this clip belongs to the camera.\n\n"
                "🔴 PACING IS NATURAL AND UNHURRIED — a real beat of silence between each spoken line, "
                "nothing rushed, nothing sped up, and the camera never lurches, jumps or arrives "
                "abruptly. The final line lands with a moment of held smile before the clip ends.")
    if m == "pullback3":
        return ("The camera HOLDS for a beat, then PULLS BACK VERY SLOWLY and continuously across "
                "the WHOLE rest of the clip in ONE unbroken move, widening GRADUALLY frame by frame, "
                "ending on the framing of the provided end image. The widening is SLOW and STEADY "
                "and spread over the entire clip — a little more of the scene enters frame every "
                "moment, never a sudden jump. The camera physically retreats step by step; the "
                "extra people come into frame gradually from the edges as the view widens. It does "
                "NOT cut, does NOT snap to a wider shot, and does NOT suddenly reveal everyone at "
                "once — the reveal is a smooth continuous glide.")
    raise SystemExit(f"unknown move: {m}")


def headcount_block(spec, c):
    noun = spec.get("group_noun", "people")
    ids = c["inFrame"]
    lines = [f"🔴 EXACTLY {len(ids)} {noun.upper()} EXIST IN THIS VIDEO — no one else, at any "
             "point, in any part of the frame."]
    for i in ids:
        lines.append(f"{i} is {spec['cast'][i].strip()}.")
    lines.append(f"Every person on screen is one of these {noun} from the reference images. "
                 "NO extra person appears. NO unfamiliar face is created. NO one walks into frame, "
                 "and no figure appears in the background, on a lawn, on a porch, in a driveway or "
                 "anywhere else.")
    return " ".join(lines)


def host_block(spec, c):
    on_screen = spec["cast"][c["onScreenDuringHost"]] if c.get("onScreenDuringHost") else \
                spec["cast"][c["speaker"]]
    return (f'At the VERY FIRST FRAME, with no silent lead-in, {spec["host_voice"]} asks: '
            f'"{c["hostLine"]}"\n\n'
            f'🔴 {on_screen.strip().upper()} — the person on screen during that line — does NOT '
            f'say "{c["hostLine"]}", does NOT mouth it, and does NOT move their lips at all during '
            "it. They keep their mouth CLOSED and STILL. No one on screen says it. The voice is a "
            "disembodied off-camera voice belonging to the person filming, who is never seen.")


def speaker_block(spec, c):
    sp = spec["cast"][c["speaker"]].strip()
    first = c["line"].split()[0].strip('".,')
    # With no frame-one host line the clip OPENS on the speaker mid-answer, so "Then ... answers"
    # would imply a question that was never asked.
    lead = f'Then {sp} answers' if c.get("hostLine") else \
           f'From the VERY FIRST FRAME, with no silent lead-in and no question asked, {sp} speaks'
    out = (f'{lead}, on camera, lips synced, word for word: "{c["line"]}"\n\n'
           f'🔴 THE SPEAKER SPEAKS ONLY THE WRITTEN WORDS. Their very first sound is the word '
           f'"{first}". They do NOT say "yeah", "oh", "well", "um", "so" or "okay", do NOT '
           "acknowledge the question first, and add NO filler, greeting or ad-lib before, during "
           "or after the line.\n\n"
           "EYELINE: while delivering the line they look DIRECTLY INTO THE CAMERA LENS, eyes "
           "locked on the lens. They do NOT look past the camera, off to the side, or into the "
           "distance.\n\n"
           + ("🔴 THE SPEAKER HOLDS COMPLETELY STILL, standing in place like a person frozen for a "
              "photograph — feet planted, body not moving at all — no walking, no stepping, no "
              "drifting, no turning away, no weight shift, no swaying, no hand or arm gestures, no "
              "head bobbing. Natural lip and jaw motion of speaking, easy breathing and small honest "
              "expression — but they do NOT move from their spot. (This applies to the PERSON only; "
              "the CAMERA is not locked off — it keeps its natural handheld UGC shake.)\n\n"
              if spec.get("stillness")
              else "🔴 THE SPEAKER STAYS PLANTED where they stand for the whole line — feet still, "
              "holding their position — they do NOT walk, step forward or back, drift, turn away, "
              "or change position; the only motion is natural small hand gestures and weight "
              "settling in place.\n\n")
           + f'They speak UP, loud and clearly audible, in {c["voice"]}. Every word is crisply and '
           "separately articulated and fully finished — no clipped or swallowed words, no dropped "
           "syllables, and the final sentence is spoken COMPLETELY to its last word.")
    if c.get("rateGuard"):
        out += (f' The rate is spoken exactly as written — "{c["rateGuard"]}" — with no extra '
                'words, no "and", and no "dollars".')
    if c.get("action"):
        # Optional staged physical action (e.g. the closer's phone-from-pocket reveal). Added
        # 07-29 per SKILL checklist #1 — extend the builder, never hand-write the prompt.
        out += "\n\n" + c["action"].strip()
    if c.get("sayGuard"):
        # Optional per-clip pronunciation guard for words the TTS mangles (e.g. "crossover" ->
        # "crossrover"). Added 07-29 per SKILL checklist #1 ("extend the builder, then fire").
        out += " " + c["sayGuard"].strip()
    if c.get("followUp"):
        # A MID-CLIP host interjection + the speaker's reply (the closer's
        # "Wait, you can negotiate?" / "Always." button). host_block only covers the frame-one
        # question, so multi-beat exchanges live here. Added 07-29 — extend the builder, never
        # hand-write the prompt.
        fu = c["followUp"]
        # 🔴 CROSS-SPEAKER followUp (added 07-30, editor instruction: "clip 02 should have P2 speak,
        # host bridge, then P3"). Previously the reply was hard-wired to the SAME speaker, which
        # only fits the closer's "Wait, you can negotiate? / Always." A bridge that hands off to a
        # DIFFERENT cast member is a distinct shape, and hand-writing it would be checklist #1.
        replier = spec["cast"][fu["speaker"]].strip() if fu.get("speaker") else sp
        handoff = fu.get("speaker") and fu["speaker"] != c["speaker"]
        out += (f'\n\n🔴 THEN THE EXCHANGE CONTINUES, still in this same unbroken take. After a short '
                f'natural beat the SAME disembodied off-camera voice asks: "{fu["hostLine"]}" — nobody '
                f'on screen says it, and every person on screen keeps their mouth CLOSED and STILL '
                f'during it, and no new person appears.\n\n'
                f'Immediately after, {replier} answers on camera, lips synced, exactly: '
                f'"{fu["line"]}" — spoken clearly and completely, nothing added. The clip does NOT '
                f'end before this final answer is fully spoken; every spoken beat happens in ONE '
                f'continuous take with no cut.')
        if handoff:
            out += (f'\n\n🔴 TWO DIFFERENT PEOPLE SPEAK IN THIS CLIP, IN THIS ORDER AND NO OTHER: '
                    f'FIRST {sp} delivers their line, and while they speak {replier} listens with '
                    f'their mouth CLOSED. THEN, after the off-camera question, {replier} delivers '
                    f'their line, and while they speak {sp} listens with their mouth CLOSED. '
                    f'They never speak at the same time, never overlap, never trade lines, and '
                    f'neither one says the other\'s words. Nobody else on screen speaks at all.')
            if fu.get("voice"):
                out += (f' {replier} speaks UP, loud and clearly audible, in {fu["voice"]}, with '
                        "every word crisply and separately articulated and fully finished.")
            if fu.get("rateGuard"):
                out += (f' Their rate is spoken exactly as written — "{fu["rateGuard"]}" — with no '
                        'extra words, no "and", and no "dollars".')
            if fu.get("sayGuard"):
                out += " " + fu["sayGuard"].strip()
    fu_sp = (c.get("followUp") or {}).get("speaker")
    if not (fu_sp and fu_sp != c["speaker"]):
        # Only assert single-speaker exclusivity when there is genuinely one speaker. On a
        # cross-speaker handoff this line would contradict the two-speaker order stated above.
        out += (f"\n\n{sp} is the ONLY person who speaks. The others do NOT say any of these words.")
    return out


BYSTANDERS = ("Everyone else is relaxed and alive — easy agreeing nods, warm little smiles, small "
              "glances between the speaker and the camera. They are NOT stiff, frozen, robotic or "
              "statue-like; they simply do not SPEAK the line, and their mouths stay CLOSED. "
              "🔴 Every non-speaker stays PLANTED exactly where they stand for the whole clip — "
              "feet still, holding their spot — they do NOT walk, step, stride, drift, wander, "
              "pace, cross the frame, or change position; the only motion is small nods, weight "
              "settling in place, and glances. Anyone standing in the background also stays put "
              "and still — no one in the background walks or moves across the scene.")

# 🔴 STILLNESS MODE (editor lock 07-29: "we don't want ANY characters to be moving"). When a spec
# sets "stillness": true, every BODY is frozen like a photograph — the ONLY motion in frame is the
# camera move itself plus the speaker's lips; faces stay alive via breath/blink so they aren't
# corpses. Non-speakers gesturing / shifting weight was reading as "characters moving".
BYSTANDERS_STILL = ("🔴 Every non-speaker holds their BODY completely still, staying planted exactly "
                    "where they stand — no stepping, no walking, no shifting or settling their weight, "
                    "no leaning, no turning, no bobbing, and NO hand or arm gestures whatsoever. The "
                    "ONLY life on them is slow natural breathing and an occasional blink; their "
                    "mouths stay CLOSED and their feet do not move from their spot in any way. They "
                    "are calm and natural, not tense. 🔴 This stillness is about the PEOPLE only — the "
                    "CAMERA is NOT locked off: it keeps its natural handheld UGC shake and gentle sway "
                    "the whole time, as if filmed on a phone.")


def bystanders_block(spec):
    return BYSTANDERS_STILL if spec.get("stillness") else BYSTANDERS


def hands_block(spec, c):
    # A clip may override the spec's props (e.g. the closer where OG holds a phone, while every
    # earlier clip keeps hands empty). Clip-level wins; otherwise the spec default applies.
    props = c.get("props", spec.get("props", {}))
    holders = [f"{spec['cast'][k].strip()}, {v}" for k, v in props.items()
               if k in c["inFrame"]]
    base = "Every person's hands are EMPTY and relaxed, resting down at their sides"
    if holders:
        base += " — the ONLY person holding anything is " + "; and ".join(holders)
    base += (". Nobody holds a hand out as though gripping something, cups or curls an empty "
             "palm, reaches toward another person, or appears to hold an object that is not "
             "visibly there.")
    return base


def accent_lock_block(spec, c):
    """🔴 ACCENT LOCK covering EVERY speaking person in the clip (added 07-30).

    On a multi-speaker clip the per-speaker `voice` fields are too diffuse — Seedance honoured the
    accent on the first speaker (P2) and rendered the second (P3) with a flat American accent. The
    fix is one prominent block, stated up front, that names each speaker and asserts the SAME accent
    is mandatory on all of them, so it cannot be lost on the second voice. Spec-level `accentLock`
    is the accent phrase; the block lists every person who speaks in THIS clip."""
    phrase = spec.get("accentLock")
    if not phrase:
        return None
    speakers = [c["speaker"]]
    fu = c.get("followUp") or {}
    if fu.get("speaker") and fu["speaker"] not in speakers:
        speakers.append(fu["speaker"])
    named = "; and ".join(spec["cast"][s].split(",")[0].strip() for s in speakers)
    return (f"🔴 ACCENT LOCK — EVERY PERSON WHO SPEAKS IN THIS CLIP CARRIES THE SAME ACCENT, WITH NO "
            f"EXCEPTION: {phrase.strip()} This applies equally and fully to {named}. If two people "
            "speak in this clip, BOTH speak with this exact same accent — the second speaker's "
            "accent is just as thick and just as consistent as the first's. No speaker reverts to a "
            "flat, neutral, plain or standard American accent at any point. The accent never fades, "
            "never softens between speakers, and never disappears on the later lines.")


def ref_roles_block(spec, c):
    """🔴 EXPLICIT REFERENCE ROLES (Seedance research 07-30, P0).

    A reference with no stated job forces the model to VOTE among images — which image owns the
    camera, which owns the faces, which owns the background. Order alone is not enough. When a clip
    carries extra references beyond its start frame, every one of them gets a named authority and
    the start frame is stated as the boundary that wins on framing."""
    roles = c.get("refRoles") or []
    if not roles:
        return None
    lines = ["🔴 REFERENCE ROLES — each image has ONE job and no other:",
             "· The START IMAGE is the absolute authority on the opening framing, the camera "
             "position and everyone's placement. The clip BEGINS on it exactly."]
    for i, r in enumerate(roles, 1):
        lines.append(f"· Image {i} is the authority on {r.strip()} It does NOT control the opening "
                     "framing, the camera position or where anybody stands — the start image wins "
                     "on all of those.")
    return "\n".join(lines)


def background_block(spec, c):
    env = spec["environment"].strip()
    if c["move"] == "hold":
        return (f"The LOCATION does not change: {env} — the same objects in the same places for "
                "the entire clip. Nothing shimmers, flickers, redraws itself, morphs, warps or "
                "changes detail between frames. No new buildings, no different scenery, no "
                "changed light or weather.")
    # Moving camera: NEVER pair a move with frozen/pixel-for-pixel language — that contradiction
    # is what pasted people into frozen backgrounds (V4 c03, 3 burns).
    return (f"🔴 BACKGROUND CONSISTENCY THROUGH THE MOVE: the scenery that comes into view as the "
            f"camera travels is a STABLE, SOLID, UNCHANGING real place — {env}. Every board, "
            "rail, post, edge and object holds its shape, size, colour and position from the "
            "moment it enters frame until the end of the clip. Nothing shimmers, flickers, "
            "wobbles, redraws itself, morphs, warps or changes detail between frames. It behaves "
            "exactly like real scenery filmed by a moving camera. No new buildings, no different "
            "scenery, no changed light or weather.")


def closing_block(spec, c):
    end = c.get("closing", "a slow confident nod, mouth closed")
    return (f"The clip ends within a moment of the last word, on {end}.\n\n"
            f"Air perfectly CLEAR, image SHARP. Under the voices {spec['ambience'].strip()} — "
            "never going silent. No music.")


NEG_BASE = ("jump cut, hard cut, splice, edit, snapping to a new framing, re-staged first frame, "
            "framing change at the start, mid-clip cut, shot change, second shot, camera teleport, "
            "discontinuous motion, new person, invented person, unfamiliar face, stranger, "
            "replaced face, extra person, background figure, distant figure on a lawn or porch or "
            "driveway, crowd, passerby, anyone walking into frame, anyone crossing in front of the "
            "camera, person pasted into the frame, people swapping places within a fixed frame, "
            "a person walking across the scene, a background person stepping drifting or pacing, "
            "someone changing their standing position, a bystander wandering, "
            "second speaker, other mouths moving, group speaking in unison, chorus of voices, "
            "on-screen person mouthing the off-camera line, ad-libbed words, improvised dialogue, "
            "filler words, \"yeah\", \"oh\", \"well\", \"um\", acknowledging the question before "
            "answering, extra words before the first written word, unfinished sentence, cut-off "
            "final line, clipped words, swallowed words, rushed delivery, stuttering, stammering, "
            "tripping over words, doubled words, half-words, invented words, extra words in the "
            "rate, saying \"dollars\", slurred or run-together phrases, mispronunciation, "
            "gibberish, mumbling, repeated lines, empty hand held out as if holding something, "
            "invisible object in a hand, cupped or gripping empty palm, upturned open palm "
            "gesture, phantom held object, looking past the camera, eyes focused into the "
            "distance, gaze off to the side while speaking, flickering background, shimmering "
            "background, background redrawing itself, morphing scenery, warping structures, "
            "background detail changing between frames, unstable scenery, moved objects, changed "
            "light, changed weather, haze, fog, bloom, glow, soft focus, slow motion, text "
            "overlay, subtitles, captions, watermark, music, phone in frame")

NEG_MOVING = (", unshifted background, frozen background during a camera move, static camera, "
              "locked-off shot, overshooting the end framing, continuing to pan after settling, "
              "panning past the last person, drifting after the move ends")
NEG_HOLD = ", camera travel, panning, zooming, pulling back, widening shot"


NEG_STILL = (", a character walking, a character stepping, shifting weight, leaning, swaying, "
             "bobbing, turning the body, gesturing with hands or arms, waving, raising a hand, "
             "any person moving from their spot, a body in motion, fidgeting, pacing")


def negatives(spec, c):
    neg = "Negative: " + NEG_BASE + (NEG_HOLD if c["move"] == "hold" else NEG_MOVING)
    if spec.get("stillness"):
        neg += NEG_STILL
    neg += "."
    absent = [k for k in spec["cast"] if k not in c["inFrame"]]
    if absent:
        noun = spec.get("group_noun", "people")
        n = len(c["inFrame"])
        ordinals = {1: "second", 2: "third", 3: "fourth", 4: "fifth", 5: "sixth", 6: "seventh"}
        extra = [f"{ordinals.get(n, str(n+1)+'th')} {noun[:-1] if noun.endswith('s') else noun}"]
        extra += [spec["cast"][k].split(",")[0].strip() for k in absent]
        extra.append(f"whole group of {len(spec['cast'])}")
        neg += "\n\nNegative (headcount): " + ", ".join(extra) + "."
    return neg


def build_one(spec, c):
    # 🔴 hostLine is OPTIONAL (07-30, editor instruction). A request's Copy may ask the interview
    # question ONCE at the top and then run several answers back to back — those clips have no
    # frame-one host line. Requiring one forced a choice between INVENTING words (adding to the
    # Copy, as bad as cutting from it) and hand-writing the prompt (checklist #1). Neither is
    # acceptable, so the builder now simply opens on the speaker when there is no host line.
    for k in ("clipId", "move", "inFrame", "speaker", "line", "voice"):
        if k not in c:
            sys.exit(f"ERROR: clip {c.get('clipId','?')} missing required key: {k}")
    if c["move"] not in MOVES:
        sys.exit(f"ERROR: clip {c['clipId']}: move '{c['move']}' not in {MOVES}")
    if c["move"] == "pullback3" and len(c["inFrame"]) > 3:
        sys.exit(f"ERROR: clip {c['clipId']}: pullback with {len(c['inFrame'])} characters is "
                 "BANNED (5-cut streak, BlockPartySrBroad V2 c05). Use <=3 in the end frame "
                 "(pullback3) or a scale-preserving reveal_keep instead.")
    unknown = [i for i in c["inFrame"] if i not in spec["cast"]]
    if unknown:
        sys.exit(f"ERROR: clip {c['clipId']}: inFrame ids not in cast: {unknown}")
    parts = [FORMAT_LINE, FIRST_FRAME, move_block(c), headcount_block(spec, c)]
    rr = ref_roles_block(spec, c)
    if rr:
        parts.insert(2, rr)          # roles come before the move, so authority is set up front
    al = accent_lock_block(spec, c)
    if al:
        parts.append(al)             # accent lock rides near the dialogue guards
    if c.get("hostLine"):
        parts.append(host_block(spec, c))
    parts += [speaker_block(spec, c), bystanders_block(spec), hands_block(spec, c),
              background_block(spec, c), closing_block(spec, c), negatives(spec, c)]
    prompt = "\n\n".join(parts)
    if c.get("seamOnly"):
        prompt = seam_only(prompt, c)
    verify_beats(c, prompt)   # 🔴 refuses to emit a prompt that drops a script beat
    return prompt


def seam_only(prompt, c):
    """METHOD B (editor lock 07-29): fire with the SEAM as the only keyframe — NO end image.

    A generated end frame repaints the scene slightly differently than the seam, so the video
    morphs between two backgrounds ('background drift', the recurring V4/V1 c04 issue). With no
    end image there is nothing to morph toward — the camera moves within the ONE real place shown
    in the first frame. The destination becomes prose instead of an end-image reference."""
    dest = c.get("destination", "the speaker centered in the frame and turned to face the camera")
    if not c.get("destination"):
        print(f"  ⚠ {c['clipId']}: seamOnly with NO 'destination' — falling back to a generic one. "
              f"On a seam-only fire the destination is the ONLY thing telling the render where the "
              f"camera ends up; name the row order explicitly (see B4).")
    # 🔴 The substitution below only lands for moves whose text REFERENCES an end image
    # (hold/ease/reveal_keep/pullback3). `pushin1` describes its ending in prose and never says
    # "the provided end image", so there was nothing to replace and the spec's `destination` —
    # POSITION LOCK included — was SILENTLY DISCARDED. Measured 07-30 on BlockPartyAsianEN V3 c01:
    # zero occurrences of the destination text in the built prompt, and the render swapped P1/P2
    # because the only ending instruction left was the generic "ONE neighbour at the edge", which
    # names neither which neighbour nor which side. Never let a declared destination vanish.
    had_target = "the provided end image" in prompt
    prompt = prompt.replace("the framing of the provided end image", dest)
    prompt = prompt.replace("the provided end image", dest)
    if not had_target:
        prompt += ("\n\n🔴 THE ENDING FRAMING OF THIS CLIP IS EXACTLY THIS, AND NOTHING ELSE: "
                   + dest.strip())
    prompt += ("\n\n🔴 SEAM-ONLY, REAL BACKGROUND: there is NO separate destination image. The camera "
               "moves within the SAME real place shown in the first frame; as it moves it reveals only "
               "a little more of that same scene. It does NOT invent, repaint, swap, morph or change "
               "any scenery — every building, car, chair, tree and object already visible stays exactly "
               "as it is, in the same place, for the whole clip.")
    return prompt


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("spec")
    ap.add_argument("--out", required=True, help="prompt output dir (Elements/Prompts)")
    a = ap.parse_args()
    spec = json.load(open(a.spec, encoding="utf-8"))
    for k in ("project", "version", "host_voice", "environment", "ambience", "cast", "clips"):
        if k not in spec:
            sys.exit(f"ERROR: spec missing required key: {k}")
    os.makedirs(a.out, exist_ok=True)
    frag = []
    for c in spec["clips"]:
        prompt = build_one(spec, c)
        fn = os.path.join(a.out, f"{spec['project']}_{spec['version']}_{c['clipId']}_prompt.txt")
        with open(fn, "w", encoding="utf-8") as f:
            f.write(prompt)
        frag.append({"clipId": c["clipId"], "move": c["move"],
                     "endFrameCount": len(c["inFrame"]), "promptFile": fn})
        print(f"  built {os.path.basename(fn)}  [{c['move']}, {len(c['inFrame'])} in frame, "
              f"{len(prompt)} chars]")
    fragfn = os.path.join(a.out, f"{spec['project']}_{spec['version']}_clipmeta.json")
    json.dump(frag, open(fragfn, "w"), indent=1)
    print(f"\nDONE {len(frag)} prompt(s) -> {a.out}")
    print(f"clip meta (paste move/endFrameCount into the joblist): {fragfn}")


if __name__ == "__main__":
    main()
