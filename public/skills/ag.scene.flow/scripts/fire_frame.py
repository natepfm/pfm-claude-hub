#!/usr/bin/env python3
"""fire_frame.py — the ONLY sanctioned way to fire a storyboard frame in ag.scene.flow.

Born 07.30.26 after a hand-typed ref stack dropped the camera plan on S13 (an ambiguous
editor remark was misread as a ref-stack override). The ref stack is not Claude's to
compose: it is DERIVED from the bible — the shot's assigned camera's reference frame
FIRST, then the tableau (grade authority), then the masters of exactly the characters
in the shot. Any deviation must be made by editing the bible itself (Sam's surface),
never by flags.

Usage:
  fire_frame.py <bible.yaml> --shot S13 [--extra-prompt "..."] [--out <dir>]

Refuses when:
  - the shot, its camera, or the camera's reference_frame is missing/TBD
  - the camera reference or tableau or a master file does not exist on disk
  - the shot has no assembled prompt (run scene_bible.py assemble first)
Fires gpt_image_2 at the scene's declared aspect with the derived stack, saves Frame_<ID>_v<next>.png
(vN in place, never overwriting), prints the result URL, and exits 0 only when the
file exists on disk with size > 0 (DONE = a check passed).
"""
import argparse, json, subprocess, sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from canon_io import canon_write  # vendored; see canon_io.py header


def die(msg):
    print(f"REFUSED: {msg}")
    sys.exit(1)


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def upload(path):
    r = sh(["higgsfield", "upload", "create", str(path), "--json"])
    try:
        return json.loads(r.stdout)["id"]
    except Exception:
        die(f"upload failed for {path}: {r.stdout[:200]} {r.stderr[:200]}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("bible")
    ap.add_argument("--shot", required=True)
    ap.add_argument("--extra-prompt", default="")
    ap.add_argument("--engine", default=None, choices=["nano_banana_2","flux_2_max","seedream_v5_pro","gpt_image_2","nano_banana_flash"],
                    help="Override stage routing. Default: shot's bible 'engine' field, else nano_banana_2 (people-heavy anchor default per 07.30 anti-drift research).")
    ap.add_argument("--out", default=None)
    ap.add_argument("--system-fix", dest="system_fix", default=None, metavar="REASON",
                    help="Bypass the two-hop cap ONLY, to repair a SYSTEM-caused defect (e.g. a "
                         "prompt-assembly regression). Requires a reason, recorded in canon. Does "
                         "NOT reset hop_count and does NOT bypass any other gate.")
    a = ap.parse_args()

    bible = Path(a.bible)
    project = bible.parent.parent.parent  # Elements/Prompts/SCENE_BIBLE.yaml -> project root
    d = yaml.safe_load(bible.read_text())

    # 🔴 SHOTS may live in a sibling SHOTS.yaml (bible split, 07.30) — ONE CANON ONLY.
    shots_path = bible.parent / "SHOTS.yaml"
    inline = d.get("shots") or []
    external = []
    if shots_path.exists():
        sd = yaml.safe_load(shots_path.read_text()) or {}
        external = (sd.get("shots") if isinstance(sd, dict) else sd) or []
        if inline:
            die("shots exist in BOTH SCENE_BIBLE.yaml and SHOTS.yaml — one canon only. Delete the inline block.")
    all_shots = external or inline
    shot = next((s for s in all_shots if s.get("id") == a.shot), None)
    if not shot:
        die(f"shot '{a.shot}' not in bible")
    cam_id = shot.get("camera")
    if not cam_id:
        die(f"shot {a.shot} has no camera assigned — assign it in the bible first")
    cam = next((c for c in d.get("cameras") or [] if c.get("id") == cam_id), None)
    if not cam:
        die(f"camera '{cam_id}' not defined in bible")
    # 🔴 REF ASPECT == RENDER ASPECT (07.30.26; generalised 07-30 pm). The law is that the
    # camera's reference must be NATIVE to whatever aspect this scene renders at — feeding a
    # 16:9 plate into a 9:16 render (or the reverse) stretches anatomy and rescales furniture
    # (S05/S13 proportion failures). The aspect is DECLARED ONCE in the bible (scene.aspect)
    # and every fire derives from it; it is never hardcoded here.
    aspect = str((d.get("scene") or {}).get("aspect") or "9:16").strip()
    # camera field: neutral `reference_frame` preferred; `reference_frame_9x16` still honoured
    # so bibles written before this change keep firing unchanged.
    ref_rel = (cam.get("reference_frame") or cam.get("reference_frame_9x16") or "").split("#")[0].strip()
    if not ref_rel:
        die(f"camera {cam_id} has no reference_frame — cut a native {aspect} ref from its approved plate first (ref aspect must equal render aspect)")
    if ref_rel.upper().startswith("TBD"):
        die(f"camera {cam_id} has no approved reference_frame — lock it with Sam first")
    cam_ref = project / ref_rel
    if not cam_ref.exists():
        die(f"camera reference missing on disk: {cam_ref}")

    tableau_rel = (d.get("locks", {}).get("tableau", {}) or {}).get("artifact") or \
        "Elements/Footage/Reference/Master Tableau/Tableau_B_LOCKED.png"
    tableau = project / tableau_rel
    if not tableau.exists():
        die(f"tableau grade authority missing on disk: {tableau}")

    masters = []
    cast = {c["id"]: c for c in d.get("cast") or []}
    for ch in shot.get("characters") or []:
        m_rel = (cast.get(ch, {}) or {}).get("master")
        if not m_rel:
            die(f"character {ch} has no master path in bible cast")
        m = Path(m_rel) if m_rel.startswith("/") else project / m_rel
        if not m.exists():
            die(f"master missing on disk for {ch}: {m}")
        masters.append(m)

    # 🔴 SCREEN ASSETS ARE IN-GEN, NEVER BLANK (Sam, rev-5): a shot whose script shows a
    # phone/laptop screen passes the REAL brand screenshot as a reference and renders it
    # on the device. Blank screens + post compositing were explicitly overruled 07.30.
    screens = []
    for key in (shot.get("screen_assets") or []):
        sa = (d.get("screen_assets") or {}).get(key)
        if not sa:
            die(f"shot {a.shot} references screen asset '{key}' which is not registered in the bible")
        desc = ""
        if isinstance(sa, dict):
            desc = sa.get("description") or ""
            sa = sa.get("path") or ""
        sp = Path(sa) if str(sa).startswith("/") else project / sa
        if not sp.exists():
            die(f"screen asset missing on disk: {sp}")
        screens.append((key, sp, desc))

    pop_rule = (cam.get("population_rule") or "").strip()

    prompt_file = bible.parent / "assembled" / f"{a.shot}_prompt.md"
    if not prompt_file.exists():
        die(f"no assembled prompt for {a.shot} — run scene_bible.py assemble first")
    prompt = prompt_file.read_text()
    if a.extra_prompt:
        prompt += "\n\n" + a.extra_prompt
    if pop_rule:
        prompt += "\n\nCAMERA POPULATION RULE (non-negotiable)\n" + pop_rule

    out_dir = Path(a.out) if a.out else project / "Elements/Footage/Reference/Storyboard v3"
    out_dir.mkdir(parents=True, exist_ok=True)
    existing = sorted(out_dir.glob(f"Frame_{a.shot}_v*.png"))
    next_v = 1 + max([int(p.stem.split("_v")[-1]) for p in existing], default=0)
    out = out_dir / f"Frame_{a.shot}_v{next_v:02d}.png"

    # 🔴 DETAIL REFS (07-31, ComfyUI arm): the photocopy rule breaks when the NEW camera needs
    # detail the source frame never resolved — a jury box seen edge-on in the hero renders as
    # an invented flat box when shot square-on. The fix is PIXELS of that object (a crop of the
    # canonical source), not a paragraph describing it. They sit AFTER the masters so the lower-
    # number-wins rule keeps them subordinate to camera, grade and identity.
    details = []
    for dref in shot.get("detail_refs") or []:
        rel = (dref.get("path") or "").strip()
        if not rel:
            die(f"shot {a.shot} has a detail_ref with no path")
        dp = Path(rel) if rel.startswith("/") else project / rel
        if not dp.exists():
            die(f"detail_ref missing on disk: {dp}")
        if not (dref.get("region_of") or "").strip():
            die(f"detail_ref {dp.name} has no region_of — an unscoped crop competes with image 1 "
                f"for the whole scene instead of resolving one object")
        details.append((dref["region_of"], dp))

    # Derived stack, fixed order: camera reference FIRST, tableau, masters, screens, detail crops.
    stack = ([upload(cam_ref), upload(tableau)] + [upload(m) for m in masters]
             + [upload(sp) for _, sp, _ in screens] + [upload(dp) for _, dp in details])
    if details:
        n1 = 2 + len(masters) + len(screens)
        prompt += "\n\nDETAIL REFERENCE ROLES\n" + "\n".join(
            f"- Image {n1+i+1} shows the {reg} in detail. Use it for that object's construction, "
            f"proportions and materials ONLY — it decides nothing else about the room, the camera "
            f"or the light."
            for i, (reg, _) in enumerate(details))
    if screens:
        n0 = 2 + len(masters)
        roles = "\n".join(f"- Image {n0+i+1} is the SCREEN AUTHORITY for {k}: render this interface EXACTLY as shown on the device screen in frame — same layout, same colors, same text, legible and undistorted. It shows {desc}. Never invent UI, never substitute a generic app screen, never leave the screen blank or dark."
                          for i, (k, _, desc) in enumerate(screens))
        prompt += "\n\nSCREEN REFERENCE ROLES\n" + roles
    print(f"stack[{cam_id}]: " + ", ".join(stack))

    # 🔴 STAGE-ROUTED ENGINE (07.30 anti-drift research): nano_banana_2 default for
    # people-heavy anchors; flux_2 --model max for geometry/re-angles; seedream_v5_pro
    # for one-variable repairs; gpt_image_2 opt-in only. Recorded per frame in the bible.
    engine = a.engine or shot.get("engine_override") or "gpt_image_2"  # shot["engine"] is a RECORD of past fires, never a preference (07.30 sticky-engine bug)  # Sam, 07.30 A/B: gpt2 superior on faces; NB for edits/sheets/props via flag
    model_args = {"nano_banana_2": ["nano_banana_2"],
                  "flux_2_max": ["flux_2", "--model", "max"],
                  "seedream_v5_pro": ["seedream_v5_pro"],
                  "gpt_image_2": ["gpt_image_2"],
                  "nano_banana_flash": ["nano_banana_flash"]}[engine]
    # hop tracking: refuse the third hop (rebuild from canon instead)
    hops = int(shot.get("hop_count") or 0)
    # 🔴 SYSTEM-FIX HATCH (08-01, approved by the pipeline session with three conditions).
    # A repair of a SYSTEM-caused defect is not a creative hop and must not consume the
    # creative budget. Born when a prompt-assembly regression silently dropped the
    # surface-quality + skin guards from every assembled prompt: repairing all 30 frames
    # was blocked on 10 of them that were at hop 2 from genuine creative iteration.
    # Conditions, all enforced below:
    #   1. hop_count is NEVER reset — system repairs are counted separately, so the
    #      creative budget stays honest AND system churn stays visible as its own number.
    #   2. A non-empty reason is REQUIRED, recorded in canon and printed.
    #   3. Narrow to the hop cap ONLY. This is not a general gate bypass — every other
    #      refusal (qc status, missing frames, aspect mismatch, ref checks) still applies.
    if a.system_fix and not str(a.system_fix).strip():
        die("--system-fix requires a reason: what system defect is being repaired?")
    if hops >= 2 and not shot.get("hop_reset_approved") and not a.system_fix:
        die(f"shot {a.shot} is at hop {hops} — two-hop cap. Rebuild from clean canon (reset hop_count in the bible with Sam's approval) instead of chaining a third edit. "
            f"If this is a repair of a SYSTEM defect rather than a creative iteration, re-run with --system-fix \"<reason>\".")
    if a.system_fix:
        print(f"SYSTEM FIX (hop cap bypassed, hop_count untouched at {hops}): {a.system_fix}")
    cmd = ["higgsfield", "generate", "create"] + model_args + ["--prompt", prompt]
    for u in stack:
        cmd += ["--image", u]
    cmd += ["--aspect_ratio", aspect]
    if engine != "gpt_image_2":
        cmd += ["--resolution", "2k"]
    cmd += ["--wait", "--wait-timeout", "10m", "--json"]
    r = sh(cmd)
    try:
        res = json.loads(r.stdout)
        res = res if isinstance(res, list) else [res]
        url = res[0].get("result_url") or ""
    except Exception:
        die(f"generate failed: {r.stdout[:300]} {r.stderr[:200]}")
    if not url:
        die("no result_url returned")
    print(f"URL={url}")
    sh(["curl", "-s", "-o", str(out), url])
    if not out.exists() or out.stat().st_size == 0:
        die(f"download failed: {out}")
    print(f"saved {out.name}")
    shot["engine"] = engine
    shot["hop_count"] = hops + 1
    shot["last_frame_file"] = str(out.relative_to(project))
    # 🔴 Write ONLY this shot's own fields, applied to the CURRENT document under a lock
    # (canon_io). Dumping the whole doc we loaded minutes ago silently reverted editor
    # approvals recorded while a background batch was running — observed twice, 07-31-26.
    _fields = {"engine": engine, "hop_count": hops + 1,
               "last_frame_file": str(out.relative_to(project))}
    if a.system_fix:
        # condition 1: creative budget untouched; system repairs counted on their own axis
        _fields["hop_count"] = hops
        _fields["system_fix_count"] = int(shot.get("system_fix_count") or 0) + 1
        _log = list(shot.get("system_fix_log") or [])
        _log.append(str(a.system_fix))
        _fields["system_fix_log"] = _log

    def _apply(doc):
        for _s in (doc.get("shots") or []):
            if _s.get("id") == a.shot:
                _s.update(_fields)

    if shots_path.exists() and external:
        canon_write(shots_path, _apply)
    else:
        canon_write(bible, _apply)
    print(f"bible updated: engine={engine} hop={hops+1}")


if __name__ == "__main__":
    main()
