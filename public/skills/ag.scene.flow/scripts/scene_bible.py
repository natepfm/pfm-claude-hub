#!/usr/bin/env python3
"""
scene_bible.py — the SCENE_BIBLE engine for ag.scene.flow (born 2026-07-28).

ONE canonical machine-readable scene state per creative. Every downstream prompt is
ASSEMBLED from this file's verbatim blocks — never hand-written, never paraphrased.
The laws from ag.scenelock live HERE as refusals (rules ship as code, not prose):

  - Lock order is enforced: script -> cast -> environment -> tableau -> blocking.
  - assemble refuses until all five locks are approved and lint passes.
  - fire-check refuses until the shot's storyboard QC verdict is PASS.
  - Lint refuses person-relative geography ("his left"), unanchored positions,
    >3 negatives per shot, cast without verbatim outfit/position/facing blocks,
    shots referencing unknown characters or axes.

Scope: ONLY projects the editor explicitly runs ag.scene.flow on. Never a global rule.

Usage:
  scene_bible.py init        --project <folder> --scene-id <id> [--aspect 9:16]
  scene_bible.py split-shots <bible.yaml>       # migrate shots -> sibling SHOTS.yaml
  scene_bible.py validate <bible.yaml>
  scene_bible.py lock     <bible.yaml> <script|cast|environment|tableau|blocking> [--by NAME]
  scene_bible.py status   <bible.yaml>
  scene_bible.py assemble <bible.yaml> --shot <ID>
  scene_bible.py qc       <bible.yaml> --shot <ID> --verdict PASS|FAIL [--reason TEXT]
  scene_bible.py fire-check <bible.yaml> --shot <ID>

Exit codes: 0 = ok/allowed, 1 = refused/failed (the refusal reason prints to stdout).
"""

import argparse
import datetime
import re
import sys
from pathlib import Path

import yaml

LOCK_ORDER = ["script", "cast", "environment", "tableau", "blocking"]
MAX_NEGATIVES = 3
SHOT_STATUSES = ["unboarded", "boarded", "qc_fail", "qc_pass", "fired"]

# Optional sibling shot file (added 07-30). A 24-shot creative pushed SCENE_BIBLE.yaml past
# 750 lines, which is an AUTHOR-LEGIBILITY problem (the assembler only ever emits what one
# shot needs, so this was never a token cost). `split-shots` migrates shots out; the engine
# then loads them transparently. Bibles WITHOUT this file keep working unchanged.
SHOTS_NAME = "SHOTS.yaml"


def sha256_of(path):
    import hashlib
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def project_root(bible_path):
    """<project>/Elements/Prompts/SCENE_BIBLE.yaml -> <project>"""
    return Path(bible_path).parent.parent.parent


def resolve_artifact(bible_path, rel):
    """Artifact paths are recorded project-relative; accept absolute too."""
    p = Path(rel)
    return p if p.is_absolute() else project_root(bible_path) / rel


def shots_path(bible_path):
    return Path(bible_path).parent / SHOTS_NAME

# person-relative geography is drift's side door — it mirror-flips when a character turns
PERSON_RELATIVE_RE = re.compile(
    r"\b(?:his|her|their)\s+(?:left|right)\b|"
    r"\b(?:left|right)\s+of\s+(?:the\s+)?[A-Z][A-Za-z]*\b|"
    r"\bto\s+the\s+(?:left|right)\s+of\s+\w+'s\b",
    re.IGNORECASE,
)

# 🔴 CAMERA PHRASING (07-31, from the ComfyUI arm's WF3 result). A camera instruction that
# names only a TARGET ("face the jury box wall straight on") is executed by the model as
# "bring the jury box into the current view" — it moves the OBJECT, not the camera. An
# instruction that states WHERE the camera goes first is executed as a camera move.
TARGET_CAMERA_RE = re.compile(
    r"\b(?:face|facing|point(?:ed|ing)?|aim(?:ed|ing)?|look(?:ing)?)\s+"
    r"(?:straight\s+)?(?:at|toward|towards|on|into)?\s*the\b[^.;]*",
    re.IGNORECASE,
)
POSITIONAL_CAMERA_RE = re.compile(
    r"\b(?:move|moved|moving|place|placed|position(?:ed)?|stand(?:ing)?|set|sits?|"
    r"from\s+(?:the|behind|beside|inside|above|below|within)|behind|beside|between|"
    r"midway|in\s+the\s+\w+\s+(?:well|aisle|corner|row)|over\s+the\s+\w+'s\s+shoulder)\b",
    re.IGNORECASE,
)

# lint() appends non-fatal notes here; cmd_validate prints them.
WARNINGS = []

TEMPLATE = """\
# SCENE_BIBLE — the ONE canonical state for this creative. Every prompt is assembled
# from this file by scene_bible.py; nothing downstream is hand-written or paraphrased.
# Edit blocks here, re-validate, re-assemble. Never edit an assembled prompt directly.

scene:
  id: {scene_id}
  project: {project}
  aspect: "{aspect}"
  script_version: ""

# Gates. scene_bible.py lock flips these — in order, after the editor approves each.
locks:
  script:      {{approved: false, source: ""}}
  cast:        {{approved: false}}
  environment: {{approved: false, sheet: ""}}
  tableau:     {{approved: false, take: ""}}
  blocking:    {{approved: false, plate: ""}}

# 🔴 ROOM-RELATIVE ONLY, defined once from ONE named reference direction.
# Person-relative wording ("his left") is refused by lint.
geography:
  reference_direction: ""
  room_relative: |
    (e.g. "standing in the gallery looking toward the witness table: jury box against
    the LEFT-hand wall, windows along the RIGHT-hand wall, doors behind camera")
  forbidden_on_camera: []      # objects that EXIST in the world but never appear in frame

# Verbatim text layers — pasted into every assembled prompt UNCHANGED.
verbatim:
  environment: |
    (locked environment description — palette, materials, key background elements)
  grade: |
    (commercial lighting language: one motivated key, real shadow falloff, filmic
    contrast, national-TV-spot grade, subtle grain, digital cinema camera + prime lens)
  background_population: |
    (e.g. "jury box always OCCUPIED by its seven seated jurors" — background humans
    exist from the tableau on, never invented per-shot)

cast: []
# - id: GARY
#   master: <path to approved character master>
#   outfit_id: GARY-01
#   outfit: |            # verbatim wardrobe block — a wardrobe change = a NEW ID
#     ...
#   position: |          # anchored between TWO named fixed elements, room-relative
#     ...
#   facing: ""           # which way the body faces AND what is behind their back
#   eyeline: ""

axes: []
# - id: A
#   subjects: [GARY, JUDGE]
#   camera_side: ""      # which side of the action line every camera stays on
#   screen_directions: ""  # e.g. "GARY looks frame-RIGHT, JUDGE looks frame-LEFT"

shots: []
# - id: S01
#   beat: ""
#   framing: ""          # e.g. MCU — qc.storyboard checks the render against this
#   camera_position: ""
#   axis: A
#   characters: [GARY]
#   performance: |       # the ONLY per-shot creative layer (action, expression)
#     ...
#   dialogue: ""
#   negatives: []        # MAX {max_neg} — pixels carry the world; negatives are for
#                        # what pixels can't forbid (e.g. "no podium in frame")
#   duration: 8
#   model: veo_lite
#   start_frame: ""      # filled when the approved storyboard panel is cropped
#   end_frame_required: false
#   status: unboarded    # unboarded -> boarded -> qc_pass/qc_fail -> fired
"""


def die(msg):
    print(f"REFUSED: {msg}")
    sys.exit(1)


def load(path):
    p = Path(path)
    if not p.is_file():
        die(f"no bible at {p}")
    try:
        data = yaml.safe_load(p.read_text())
    except yaml.YAMLError as e:
        die(f"bible is not valid YAML: {e}")
    if not isinstance(data, dict):
        die("bible is not a mapping")

    sp = shots_path(p)
    if sp.is_file():
        try:
            sdata = yaml.safe_load(sp.read_text()) or {}
        except yaml.YAMLError as e:
            die(f"{SHOTS_NAME} is not valid YAML: {e}")
        sib = sdata.get("shots") if isinstance(sdata, dict) else sdata
        sib = sib or []
        # 🔴 ONE CANON. Shots living in BOTH files is the exact fragmented-state failure this
        # whole system exists to prevent (the courtroom podium that both did and did not exist).
        if data.get("shots"):
            die(f"shots exist in BOTH {p.name} and {SHOTS_NAME} — one canon only. "
                f"Delete the inline `shots:` block from {p.name} (the sibling file wins) and re-run.")
        data["shots"] = sib
    return p, data


def save(path, data):
    sp = shots_path(path)
    if sp.is_file():
        shots = data.pop("shots", [])
        try:
            sp.write_text(yaml.safe_dump({"shots": shots}, sort_keys=False, allow_unicode=True, width=100))
            Path(path).write_text(yaml.safe_dump(data, sort_keys=False, allow_unicode=True, width=100))
        finally:
            data["shots"] = shots  # keep the in-memory view whole for the caller
        return
    Path(path).write_text(yaml.safe_dump(data, sort_keys=False, allow_unicode=True, width=100))


def filled(block):
    """A verbatim block counts as filled once its template placeholder is replaced."""
    if not block or not str(block).strip():
        return False
    return not str(block).strip().startswith("(")


def camera_reference_for(data, shot, bible_path):
    """The frame that shows THIS camera's view of the room, if one exists on disk.

    Its presence is what licenses the lean prompt: a photograph of the room from this
    camera makes every geometry paragraph a competing second opinion. Absent it, prose
    is the only channel and the full verbatim blocks ship.
    """
    cams = {c.get("id"): c for c in (data.get("cameras") or [])}
    cam = cams.get(shot.get("camera")) or {}
    rel = cam.get("reference_frame") or cam.get("reference_frame_9x16") or ""
    if not rel or not bible_path:
        return None
    art = resolve_artifact(bible_path, rel)
    return str(art) if art.is_file() else None


def lint(data, bible_path=None):
    """Return a list of violations. Empty list = PASS."""
    errs = []
    geo = data.get("geography") or {}
    if not str(geo.get("reference_direction") or "").strip():
        errs.append("geography.reference_direction is empty — geography must be defined once from ONE named direction")
    if not filled(geo.get("room_relative")):
        errs.append("geography.room_relative is not filled in")

    # person-relative geography scan — geography + every cast position/facing
    scan_fields = [("geography.room_relative", geo.get("room_relative") or "")]
    cast = data.get("cast") or []
    cast_ids = set()
    for c in cast:
        cid = c.get("id") or "?"
        cast_ids.add(cid)
        scan_fields.append((f"cast[{cid}].position", c.get("position") or ""))
        scan_fields.append((f"cast[{cid}].facing", c.get("facing") or ""))
        if not filled(c.get("outfit")):
            errs.append(f"cast[{cid}]: no verbatim outfit block (Outfit ID law)")
        if not str(c.get("outfit_id") or "").strip():
            errs.append(f"cast[{cid}]: no outfit_id")
        if not filled(c.get("position")):
            errs.append(f"cast[{cid}]: no position block")
        elif not re.search(r"\bbetween\b|\bmidway\b|\bin front of\b|\bbehind\b|\bat the\b|\bbeside\b", str(c.get("position")), re.I):
            errs.append(f"cast[{cid}]: position is a zone, not an anchor — anchor it between named fixed elements")
        if not str(c.get("facing") or "").strip():
            errs.append(f"cast[{cid}]: facing not stated (body orientation law — which way they face AND what is behind their back)")
    for label, text in scan_fields:
        m = PERSON_RELATIVE_RE.search(str(text))
        if m:
            errs.append(f"{label}: person-relative geography ('{m.group(0)}') — room-relative only; this mirror-flips when the character turns")

    # 🔴 ENVIRONMENT FRAME REGISTRY (07-30). Registered frames are pinned by hash. A frame
    # that changed on disk since registration means the set dressing may now contradict its
    # siblings — the exact failure that put a succulent on both ends of one desk.
    for f in ((data.get("environment") or {}).get("frames") or []):
        role = f.get("role") or "?"
        rel = f.get("path") or ""
        if not rel:
            errs.append(f"environment frame '{role}': no path recorded")
            continue
        art = resolve_artifact(bible_path, rel)
        if not art.is_file():
            errs.append(f"environment frame '{role}': file missing on disk ({rel})")
            continue
        rec = f.get("sha256") or ""
        if rec and sha256_of(art) != rec:
            errs.append(
                f"environment frame '{role}' CHANGED since it was registered ({rel}) — "
                f"reconcile the other frames to match its set dressing, then re-register each "
                f"with `env-register`. Two 'locked' frames that disagree is the drift this catches.")

    axis_ids = {a.get("id") for a in (data.get("axes") or [])}
    for s in data.get("shots") or []:
        sid = s.get("id") or "?"
        negs = s.get("negatives") or []
        if len(negs) > MAX_NEGATIVES:
            errs.append(f"shot {sid}: {len(negs)} negatives — max {MAX_NEGATIVES}; long negative lists degrade output, pixels carry the world")
        for ch in s.get("characters") or []:
            if ch not in cast_ids:
                errs.append(f"shot {sid}: character '{ch}' not in cast — a character without a lock has an unlocked position")
        ax = s.get("axis")
        if ax and ax not in axis_ids:
            errs.append(f"shot {sid}: axis '{ax}' not defined in axes")
        if s.get("status", "unboarded") not in SHOT_STATUSES:
            errs.append(f"shot {sid}: unknown status '{s.get('status')}'")
        if not filled(s.get("performance")):
            errs.append(f"shot {sid}: performance block empty")
        if not str(s.get("framing") or "").strip():
            errs.append(f"shot {sid}: framing not stated — qc.storyboard cannot check shot-size compliance without it")

        # 🔴 POSITIONAL, NOT TARGET-BASED camera phrasing (07-31, ComfyUI arm).
        # "Face the jury box wall straight on" makes the model MOVE THE JURY BOX into the
        # existing view instead of moving the camera. The form that works is
        # POSITION -> DIRECTION -> OBJECT: "move the camera into the open well, turn left,
        # looking at the jury box." New shots are refused; already-boarded shots warn only,
        # because re-phrasing an approved frame's canon would invalidate a passed QC.
        camtext = " ".join(str(s.get(k) or "") for k in ("camera_position", "camera_move"))
        if camtext.strip():
            tgt = TARGET_CAMERA_RE.search(camtext)
            if tgt and not POSITIONAL_CAMERA_RE.search(camtext):
                msg = (f"shot {sid}: camera_position is TARGET-based ('{tgt.group(0).strip()}') with no "
                       f"position stated — the model relocates the object instead of the camera. "
                       f"Write POSITION then DIRECTION then OBJECT: 'move the camera into <named "
                       f"place>, turn <direction>, looking at <object>'.")
                if s.get("status", "unboarded") == "unboarded":
                    errs.append(msg)
                else:
                    WARNINGS.append(msg + "  [warn only — this shot is already boarded]")

        # 🔴 DETAIL REFS (07-31): pixels, not prose, for occluded detail. Each must exist.
        for dref in s.get("detail_refs") or []:
            rel = dref.get("path") or ""
            if not rel:
                errs.append(f"shot {sid}: detail_ref with no path")
                continue
            if not str(dref.get("region_of") or "").strip():
                errs.append(f"shot {sid}: detail_ref '{rel}' has no region_of — name the object it resolves, "
                            f"or the model treats it as a competing whole-scene reference")
            if bible_path and not resolve_artifact(bible_path, rel).is_file():
                errs.append(f"shot {sid}: detail_ref missing on disk ({rel})")
    return errs


def cmd_init(args):
    proj = Path(args.project)
    if not proj.is_dir():
        die(f"project folder does not exist: {proj}")
    dest = proj / "Elements" / "Prompts" / "SCENE_BIBLE.yaml"
    if dest.exists():
        die(f"{dest} already exists — never overwritten; edit it or move it deliberately")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(TEMPLATE.format(scene_id=args.scene_id, project=str(proj), aspect=args.aspect, max_neg=MAX_NEGATIVES))
    print(f"OK: bible created at {dest}")


def cmd_split_shots(args):
    """Migrate an inline `shots:` block out to the sibling SHOTS.yaml. Idempotent-by-refusal."""
    p = Path(args.bible)
    if not p.is_file():
        die(f"no bible at {p}")
    sp = shots_path(p)
    if sp.is_file():
        die(f"{sp} already exists — shots are already split; nothing to migrate")
    data = yaml.safe_load(p.read_text())
    if not isinstance(data, dict):
        die("bible is not a mapping")
    shots = data.get("shots") or []
    if not shots:
        die(f"{p.name} has no inline shots to migrate")

    before = len(p.read_text().splitlines())
    sp.write_text(
        "# SHOTS — the shot list for this creative, loaded automatically alongside\n"
        "# SCENE_BIBLE.yaml by scene_bible.py. Locks, cameras, registries and verbatim\n"
        "# canon stay in the bible. Never keep a `shots:` block in both files.\n\n"
        + yaml.safe_dump({"shots": shots}, sort_keys=False, allow_unicode=True, width=100)
    )
    data.pop("shots", None)
    p.write_text(yaml.safe_dump(data, sort_keys=False, allow_unicode=True, width=100))
    after = len(p.read_text().splitlines())
    print(f"OK: {len(shots)} shot(s) -> {sp.name}")
    print(f"    {p.name}: {before} -> {after} lines")
    print(f"    re-run `validate` to confirm the split bible still lints clean")


def cmd_env_register(args):
    """Pin an environment frame (hero / reverse / sheet / any angle) into the registry.

    🔴 WHY (07-30, Pixar-office session): two environment frames were both 'locked' while
    contradicting each other — a succulent sat on OPPOSITE ends of the desk in the hero and
    the reverse angle. Nothing in the system knew those frames were supposed to agree, so a
    human eye was the only check. Registered frames are hashed; if one is re-fired, its hash
    stops matching and `validate` REFUSES until the siblings are reconciled and re-registered.
    """
    path, data = load(args.bible)
    art = resolve_artifact(path, args.path)
    if not art.is_file():
        die(f"environment frame does not exist on disk: {art}")
    env = data.setdefault("environment", {})
    frames = env.setdefault("frames", [])
    entry = next((f for f in frames if f.get("role") == args.role), None)
    fresh = {
        "role": args.role,
        "path": args.path,
        "sha256": sha256_of(art),
        "dressing": args.dressing or (entry or {}).get("dressing") or "",
        "registered": datetime.date.today().isoformat(),
    }
    if entry:
        frames[frames.index(entry)] = fresh
        verb = "re-registered"
    else:
        frames.append(fresh)
        verb = "registered"
    save(path, data)
    print(f"OK: {verb} '{args.role}' -> {args.path}")
    print(f"    sha256: {fresh['sha256'][:16]}...")
    if not fresh["dressing"]:
        print("    ⚠ no --dressing recorded. One line describing set dressing (where the props sit)")
        print("      is what makes a contradiction between frames legible to the next reader.")
    others = [f["role"] for f in frames if f["role"] != args.role]
    if others:
        print(f"    ↳ frames that must AGREE with this one: {', '.join(others)}")
        print("      If this frame's dressing changed, reconcile them and re-register each.")


def cmd_validate(args):
    path, data = load(args.bible)
    del WARNINGS[:]
    errs = lint(data, path)
    for w in WARNINGS:
        print(f"  ! {w}")
    if errs:
        print(f"LINT FAIL — {len(errs)} violation(s):")
        for e in errs:
            print(f"  ✗ {e}")
        sys.exit(1)
    print(f"LINT PASS{f' ({len(WARNINGS)} warning(s))' if WARNINGS else ''}")


def cmd_lock(args):
    path, data = load(args.bible)
    locks = data.get("locks") or {}
    name = args.lock
    if name not in LOCK_ORDER:
        die(f"unknown lock '{name}' — locks are {LOCK_ORDER}")
    idx = LOCK_ORDER.index(name)
    for prior in LOCK_ORDER[:idx]:
        if not (locks.get(prior) or {}).get("approved"):
            die(f"lock order violated — '{prior}' is not approved yet; each lock is Gate-0 for the next, never skip ahead")
    if (locks.get(name) or {}).get("approved"):
        print(f"OK: '{name}' already locked ({locks[name]['approved']})")
        return
    # 🔴 A LOCK IS A CHECK THAT PASSED, NOT A CLAIM (07-30, after the Pixar-office
    # session: "environment ✓" meant someone typed the command, not that an approved
    # file existed and was pinned). Every lock records the artifact it approved, its
    # SHA-256, and refuses when that file is not on disk. `script` is the one stage
    # whose artifact is the request Copy rather than a file, so it stays optional.
    entry = locks.setdefault(name, {})
    if name != "script":
        if not args.artifact:
            die(f"'{name}' needs --artifact <path to the approved file> — a lock is a check that "
                f"passed, not a claim. Point it at the exact file you approved.")
    if args.artifact:
        art = resolve_artifact(path, args.artifact)
        if not art.is_file():
            die(f"artifact does not exist on disk: {art}")
        entry["artifact"] = args.artifact
        entry["sha256"] = sha256_of(art)
        entry["bytes"] = art.stat().st_size
    entry["approved"] = f"{datetime.date.today().isoformat()} by {args.by}"
    data["locks"] = locks
    save(path, data)
    print(f"OK: '{name}' locked ({entry['approved']})")
    if entry.get("artifact"):
        print(f"    artifact: {entry['artifact']}")
        print(f"    sha256:   {entry['sha256'][:16]}...  ({entry['bytes']:,} bytes)")


def cmd_status(args):
    path, data = load(args.bible)
    locks = data.get("locks") or {}
    print(f"SCENE_BIBLE status — scene '{(data.get('scene') or {}).get('id', '?')}'")
    for name in LOCK_ORDER:
        ap = (locks.get(name) or {}).get("approved")
        print(f"  [{'✓' if ap else ' '}] {name}" + (f"  ({ap})" if ap else ""))
    shots = data.get("shots") or []
    if shots:
        print(f"  shots ({len(shots)}):")
        for s in shots:
            print(f"    {s.get('id','?'):>5}  {s.get('status','unboarded'):<10} {s.get('framing','')}")
    errs = lint(data, path)
    print(f"  lint: {'PASS' if not errs else f'FAIL ({len(errs)})'}")


def all_locked(data):
    locks = data.get("locks") or {}
    return [n for n in LOCK_ORDER if not (locks.get(n) or {}).get("approved")]


def get_shot(data, sid):
    for s in data.get("shots") or []:
        if s.get("id") == sid:
            return s
    die(f"shot '{sid}' not in bible")


def cmd_assemble(args):
    path, data = load(args.bible)
    missing = all_locked(data)
    if missing:
        die(f"locks not approved: {', '.join(missing)} — no prompt assembly before every lock is turned")
    errs = lint(data, path)
    if errs:
        die(f"lint FAIL ({len(errs)}) — run validate and fix before assembling:\n  " + "\n  ".join(errs))
    shot = get_shot(data, args.shot)
    geo = data.get("geography") or {}
    vb = data.get("verbatim") or {}
    cast = {c["id"]: c for c in data.get("cast") or []}
    axes = {a.get("id"): a for a in data.get("axes") or []}
    ax = axes.get(shot.get("axis")) or {}

    # 🔴 PROSE NEVER RE-DESCRIBES WHAT A REFERENCE ALREADY SHOWS (07-31, ComfyUI arm).
    # Measured there: a 3,557-char structured prompt + an approved hero image produced a room
    # built from the TEXT, using the image only for wood tone. The same room held perfectly on
    # 72 chars + the same image. Prose and pixels COMPETE; the model resolves the conflict by
    # believing the prose. So when this shot has a camera reference frame — a real photograph
    # of this room from this camera — the geometry/environment/population paragraphs are
    # SUPPRESSED and replaced by one short deixis line. They still ship in full when there is
    # no such frame (the first plate of a room, where prose is the only channel there is).
    # Identity blocks are NEVER suppressed: a wide plate does not carry a face.
    cam_ref = camera_reference_for(data, shot, path)
    lean = bool(cam_ref) and not args.verbose
    lines = []
    lines.append(f"# {args.shot} — assembled from SCENE_BIBLE (never hand-edit; edit the bible and re-assemble)")
    lines.append("")
    if lean:
        lines.append("## THE ROOM")
        lines.append("This is the room. Same room as image 1, same walls, same furniture in the same places, "
                     "same people in the same seats, same light. Nothing about the room changes.")
        lines.append("")
    else:
        lines.append("## CONTINUITY (verbatim-locked)")
        lines.append("The SAME room, the SAME people, the SAME light as the reference. Only the camera is new.")
        lines.append(f"Geography, room-relative, defined {geo.get('reference_direction','')}:")
        lines.append(str(geo.get("room_relative", "")).strip())
        lines.append(str(vb.get("environment", "")).strip())
        lines.append(str(vb.get("background_population", "")).strip())
        if ax:
            lines.append(f"Axis {ax.get('id')}: camera stays on the {ax.get('camera_side','')}; {ax.get('screen_directions','')}")
        lines.append("")
    # 🔴 REFERENCE ROLES (07.30 anti-drift research): every reference has ONE named
    # job so the model never votes between images. Order matches fire_frame.py's stack.
    lines.append("## REFERENCE ROLES")
    lines.append("- Image 1 is the CAMERA AND SPATIAL AUTHORITY: preserve its camera position, lens feel, composition, room geometry, furniture and character floor positions exactly.")
    lines.append("- Image 2 is the GRADE AUTHORITY ONLY: take its light direction, exposure, contrast, color palette and material feel — and NOTHING else. It was shot from a DIFFERENT camera position, so it is NOT a source of room layout, wall positions, door placement, furniture arrangement or where people sit. Image 1 alone decides geometry and who is where.")
    n = 3
    for ch in shot.get("characters") or []:
        lines.append(f"- Image {n} controls {ch}'s identity, face, hair and body proportions exactly, wearing their locked outfit below.")
        n += 1
    # 🔴 DETAIL REFS: when the new camera needs an object the source frame never resolved
    # (a jury box seen edge-on in the hero, square-on in this shot), the fix is PIXELS of that
    # object, not a paragraph describing it. Scoped hard to the named region so it cannot
    # act as a competing whole-scene reference.
    for dref in shot.get("detail_refs") or []:
        lines.append(f"- Image {n} shows the {dref.get('region_of')} in detail. Use it for that object's "
                     f"construction, proportions and materials ONLY. It decides nothing else — not the "
                     f"camera, not the room, not the light.")
        n += 1
    lines.append("Where sources conflict, the LOWER image number wins. Do not redesign, restyle, add, remove, relocate, mirror or recolor anything not named in THIS SHOT ONLY.")
    lines.append("")
    lines.append("## CAST IN THIS SHOT (identity verbatim-locked)")
    for ch in shot.get("characters") or []:
        c = cast[ch]
        lines.append(f"{ch} — Outfit {c.get('outfit_id','')}:")
        lines.append(str(c.get("outfit", "")).strip())
        lines.append(f"Position: {str(c.get('position','')).strip()}")
        lines.append(f"Facing: {c.get('facing','')}. Eyeline: {c.get('eyeline','')}")
        lines.append("")
    if lean:
        # image 2 IS the grade; re-stating it in prose is the same competition as the room
        lines.append("## GRADE")
        lines.append("Match image 2's light and colour exactly. Clean photographic rendering, real skin texture, "
                     "no grain, no mottling, no splotches.")
        lines.append("")
    else:
        lines.append("## GRADE (verbatim-locked)")
        lines.append(str(vb.get("grade", "")).strip())
        lines.append("")
    lines.append("## THIS SHOT ONLY (the one variable layer)")
    lines.append(f"Framing: {shot.get('framing','')}. Camera: {shot.get('camera_position','')}.")
    lines.append(str(shot.get("performance", "")).strip())
    if shot.get("dialogue"):
        # 🔴 Frame prompts NEVER carry quoted dialogue — gpt2 renders quotes as burned-in
        # captions (S15, 07.30.26). Dialogue reaches CLIP prompts only; for the still frame
        # it becomes mouth-state context with an explicit no-text guard.
        wc = len(str(shot["dialogue"]).split())
        lines.append(f"He/she is mid-sentence (a spoken line of about {wc} words — context only, "
                     f"NEVER render any words, captions, subtitles or text in the image).")
    negs = list(shot.get("negatives") or [])
    for f_obj in geo.get("forbidden_on_camera") or []:
        neg = f"no {f_obj} in frame"
        if neg not in negs and len(negs) < MAX_NEGATIVES:
            negs.append(neg)
    if negs:
        lines.append("Negatives: " + "; ".join(negs[:MAX_NEGATIVES]))

    out_dir = Path(path).parent / "assembled"
    out_dir.mkdir(exist_ok=True)
    out = out_dir / f"{args.shot}_prompt.md"
    body = "\n".join(lines) + "\n"
    out.write_text(body)
    if lean:
        mode = "LEAN (refs carry the room)"
    elif cam_ref:
        mode = "FULL (--verbose forced; a camera reference exists and prose will compete with it)"
    else:
        mode = "FULL (no camera reference — prose is the only channel)"
    print(f"OK: assembled -> {out}")
    print(f"    mode: {mode} · {len(body)} chars")
    if lean:
        print("    suppressed: geography, environment, background_population, grade verbatim "
              "— image 1 shows them")
    print("\n".join(lines))


def cmd_qc(args):
    path, data = load(args.bible)
    shot = get_shot(data, args.shot)
    if args.verdict == "FAIL" and not (args.reason or "").strip():
        die("a FAIL verdict requires --reason (what failed, so the repair is single-variable)")
    shot["status"] = "qc_pass" if args.verdict == "PASS" else "qc_fail"
    entry = {"shot": args.shot, "date": datetime.date.today().isoformat(),
             "verdict": args.verdict, "reason": args.reason or ""}
    data.setdefault("qc_log", []).append(entry)
    save(path, data)
    print(f"OK: {args.shot} -> {shot['status']}" + (f" ({args.reason})" if args.reason else ""))


def cmd_fire_check(args):
    _, data = load(args.bible)
    shot = get_shot(data, args.shot)
    if shot.get("status") != "qc_pass":
        die(f"shot {args.shot} status is '{shot.get('status','unboarded')}' — clip fire requires a storyboard QC PASS (qc.storyboard), no exceptions")
    if not str(shot.get("start_frame") or "").strip():
        die(f"shot {args.shot} has no start_frame — crop the approved storyboard panel first; clips never fire into an empty plate")
    print(f"OK: {args.shot} cleared to fire (qc_pass, start_frame set)")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("init"); p.add_argument("--project", required=True); p.add_argument("--scene-id", required=True); p.add_argument("--aspect", default="9:16"); p.set_defaults(fn=cmd_init)
    p = sub.add_parser("validate"); p.add_argument("bible"); p.set_defaults(fn=cmd_validate)
    p = sub.add_parser("split-shots"); p.add_argument("bible"); p.set_defaults(fn=cmd_split_shots)
    p = sub.add_parser("env-register"); p.add_argument("bible"); p.add_argument("--role", required=True)
    p.add_argument("--path", required=True); p.add_argument("--dressing", default=None); p.set_defaults(fn=cmd_env_register)
    p = sub.add_parser("lock"); p.add_argument("bible"); p.add_argument("lock"); p.add_argument("--by", default="editor"); p.add_argument("--artifact", default=None, help="path to the approved file (required for every lock except script)"); p.set_defaults(fn=cmd_lock)
    p = sub.add_parser("status"); p.add_argument("bible"); p.set_defaults(fn=cmd_status)
    p = sub.add_parser("assemble"); p.add_argument("bible"); p.add_argument("--shot", required=True)
    p.add_argument("--verbose", action="store_true", help="ship the full verbatim geography/environment/grade blocks even when a camera reference exists (default is LEAN — the refs carry the room)")
    p.set_defaults(fn=cmd_assemble)
    p = sub.add_parser("qc"); p.add_argument("bible"); p.add_argument("--shot", required=True); p.add_argument("--verdict", required=True, choices=["PASS", "FAIL"]); p.add_argument("--reason", default=""); p.set_defaults(fn=cmd_qc)
    p = sub.add_parser("fire-check"); p.add_argument("bible"); p.add_argument("--shot", required=True); p.set_defaults(fn=cmd_fire_check)

    args = ap.parse_args()
    args.fn(args)


if __name__ == "__main__":
    main()
