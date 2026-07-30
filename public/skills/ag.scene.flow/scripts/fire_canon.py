#!/usr/bin/env python3
"""
fire_canon.py — the gated fire path for the CANON-BUILDING stages (born 2026-07-30).

WHY THIS EXISTS. ag.scene.flow shipped exactly one gated fire path, fire_frame.py, and it
requires --shot. Shots only exist AFTER all five locks are turned. So every stage that BUILDS
the canon — character masters, environment plates, the 360 sheet, the tableau, the blocking
plate — was hand-fired with hand-typed prompts: the freelance path the whole system exists to
eliminate, still open on the most consequential stage. Three of the four failures in the
Pixar-office session (Kaylee, 07-30) trace straight to that hole:

  - a tableau fired as a FRESH prose gen with refs instead of an edit off approved pixels,
    losing both character identities and re-inventing the desk (the Skit-Courtroom failure,
    repeated) -> --fresh is REFUSED for a tableau once an environment plate is approved;
  - a fire that went out with an EMPTY prompt, because the prompt file lived in a rotated
    scratchpad and `cat` failed silently -> the prompt file is read and must be non-empty;
  - three task IDs reported when only ONE fire went out, two of which never existed
    -> the job id is parsed from the vendor's actual response and the output file is
    verified on disk before anything is reported.

LAWS ENFORCED AS REFUSALS
  1. prompt file must exist and be non-empty (no silent empty fire)
  2. exactly one of --fresh / --edit <approved parent> must be declared
  3. --edit parent must exist on disk
  4. tableau + --fresh is REFUSED when the environment lock is approved (pixel-first law:
     a frame that sees locked pixels is an EDIT of them, never a fresh composition)
  5. every reference must exist on disk
  6. aspect is derived from the bible (scene.aspect), never hardcoded
  7. output is verified on disk before success is reported; a provenance sidecar is written

Usage:
  fire_canon.py <bible.yaml> --stage <master|environment|tableau|blocking>
                --prompt-file <path> (--fresh | --edit <approved parent>)
                [--ref <path>]... [--out <dir>] [--engine gpt_image_2|nano_banana_2]
                [--label NAME] [--dry-run]

Exit codes: 0 = fired and verified (or dry-run OK), 1 = refused/failed.
"""

import argparse
import datetime
import json
import subprocess
import sys
from pathlib import Path

import yaml

STAGES = ("master", "environment", "tableau", "blocking")
ENGINES = {"gpt_image_2": ["gpt_image_2"], "nano_banana_2": ["nano_banana_2"]}


def die(msg):
    print(f"REFUSED: {msg}")
    sys.exit(1)


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def resolve(project, rel):
    p = Path(rel)
    return p if p.is_absolute() else project / rel


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("bible")
    ap.add_argument("--stage", required=True, choices=STAGES)
    ap.add_argument("--prompt-file", required=True)
    ap.add_argument("--fresh", action="store_true")
    ap.add_argument("--edit", default=None, metavar="PARENT")
    ap.add_argument("--ref", action="append", default=[])
    ap.add_argument("--out", default=None)
    ap.add_argument("--engine", default="nano_banana_2", choices=list(ENGINES))
    ap.add_argument("--label", default=None)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    bible = Path(a.bible)
    if not bible.is_file():
        die(f"no bible at {bible}")
    project = bible.parent.parent.parent
    d = yaml.safe_load(bible.read_text()) or {}
    aspect = str((d.get("scene") or {}).get("aspect") or "9:16").strip()
    locks = d.get("locks") or {}

    # ---- LAW 1: a prompt file that is missing or empty never spends ----
    pf = Path(a.prompt_file)
    if not pf.is_file():
        die(f"prompt file does not exist: {pf} — a fire never goes out on a prompt nobody can read")
    prompt = pf.read_text().strip()
    if not prompt:
        die(f"prompt file is EMPTY: {pf} — this is the silent-`cat`-failure that burned a fire on "
            f"2026-07-30. Write the prompt, re-check the file, then fire.")
    if len(prompt) < 40:
        die(f"prompt is {len(prompt)} chars — too short to be a real canon prompt. Refusing rather "
            f"than spending on a truncated file.")

    # ---- LAW 2/3: exactly one mode, and an edit parent must be real ----
    if a.fresh and a.edit:
        die("declare ONE mode: --fresh (new composition) or --edit <parent> (single-variable edit)")
    if not a.fresh and not a.edit:
        die("no mode declared. --edit <approved parent> is the default for anything that sees "
            "locked pixels; --fresh only when nothing approved exists yet.")
    parent = None
    if a.edit:
        parent = resolve(project, a.edit)
        if not parent.is_file():
            die(f"--edit parent does not exist on disk: {parent}")

    # ---- LAW 4: the pixel-first law, as a refusal ----
    env_locked = bool((locks.get("environment") or {}).get("approved"))
    if a.stage == "tableau" and a.fresh and env_locked:
        die("tableau --fresh is REFUSED: the environment lock is approved, so the tableau is an "
            "EDIT of those pixels (add the cast onto the approved plate), never a fresh prose gen. "
            "Firing fresh here is what lost both character identities and re-invented the desk on "
            "2026-07-30, and re-invented the courtroom before that. Use --edit <approved env plate>.")
    if a.stage == "blocking" and a.fresh and bool((locks.get("tableau") or {}).get("approved")):
        die("blocking --fresh is REFUSED: the tableau is approved, so the blocking plate derives "
            "from its pixels. Use --edit <approved tableau>.")

    # ---- LAW 5: every reference must exist ----
    refs = []
    for r in ([str(parent)] if parent else []) + list(a.ref):
        rp = resolve(project, r)
        if not rp.is_file():
            die(f"reference missing on disk: {rp}")
        refs.append(rp)

    out_dir = Path(a.out) if a.out else (project / "Elements" / "Footage" / "Reference")
    out_dir.mkdir(parents=True, exist_ok=True)
    label = a.label or a.stage
    existing = sorted(out_dir.glob(f"{label}_v*.png"))
    vnext = len(existing) + 1
    out_path = out_dir / f"{label}_v{vnext:02d}.png"
    if out_path.exists():
        die(f"output already exists: {out_path} — vN never overwrites a prior take")

    print(f"stage      : {a.stage}")
    print(f"mode       : {'EDIT of ' + str(parent.name) if parent else 'FRESH'}")
    print(f"aspect     : {aspect}   (from the bible, not hardcoded)")
    print(f"engine     : {a.engine}")
    print(f"prompt     : {len(prompt)} chars from {pf.name}")
    print(f"references : {len(refs)}")
    for r in refs:
        print(f"             {r.name}")
    print(f"output     : {out_path}")

    if a.dry_run:
        print("\nDRY RUN — every refusal passed, nothing fired, nothing spent.")
        sys.exit(0)

    # ---- fire ----
    up = lambda p: json.loads(sh(["higgsfield", "upload", "create", str(p), "--json"]).stdout)["id"]
    cmd = ["higgsfield", "generate", "create"] + ENGINES[a.engine] + ["--prompt", prompt]
    for r in refs:
        cmd += ["--image", up(r)]
    cmd += ["--aspect_ratio", aspect, "--wait", "--wait-timeout", "10m", "--json"]
    r = sh(cmd)

    # ---- LAW 7: the job id comes from the RESPONSE, and the file is verified on disk ----
    job_id, url = None, None
    try:
        res = json.loads(r.stdout)
        res = res if isinstance(res, list) else [res]
        job_id = res[0].get("id") or res[0].get("job_id")
        url = res[0].get("result_url")
    except Exception:
        pass
    if not url:
        die(f"no result_url in the vendor response — NOTHING is reported as fired. stderr: {r.stderr[:300]}")

    dl = sh(["curl", "-sSL", "-o", str(out_path), url])
    if dl.returncode != 0 or not out_path.is_file() or out_path.stat().st_size < 1024:
        die(f"download failed or produced an empty file: {out_path}")

    sidecar = out_path.with_suffix(".run.json")
    sidecar.write_text(json.dumps({
        "stage": a.stage, "mode": "edit" if parent else "fresh",
        "parent": str(parent.relative_to(project)) if parent else None,
        "refs": [str(x.relative_to(project)) for x in refs],
        "aspect": aspect, "engine": a.engine,
        "prompt_file": str(pf), "prompt_chars": len(prompt),
        "job_id": job_id, "result_url": url,
        "output": str(out_path.relative_to(project)),
        "bytes": out_path.stat().st_size,
        "fired": datetime.datetime.now().isoformat(timespec="seconds"),
    }, indent=2))

    print(f"\nVERIFIED on disk: {out_path.name}  ({out_path.stat().st_size:,} bytes)")
    print(f"job id (from the vendor response): {job_id}")
    print(f"provenance: {sidecar.name}")
    print(f"\n📁 Path: {out_dir}")


if __name__ == "__main__":
    main()
