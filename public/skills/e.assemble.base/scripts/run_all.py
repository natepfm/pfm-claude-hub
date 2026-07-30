#!/usr/bin/env python3
"""e.assemble.base — ONE-SHOT orchestrator: trim fit → timeline build → script match.

Exists for token discipline in Claude-chat runs: Claude fires this ONCE (backgrounded) and
reports from the compact summary it prints. Per-clip logs stream to
<Elements/Prompts>/<cut>_assembly_log.txt on disk — they are never read into chat.
(FoxView's Base Assembly button chains the same three scripts as local jobs — zero tokens.)

    python3 run_all.py --src "<project>/Elements/Footage/Veo/<Cut>" \
        --name "<house creative name>" --aspect 16x9        [--raw]

--raw = e.assemble.raw: skip the trim fit AND the script match (build only, full-length).
Exit: 0 clean · 1 script-match flags (timeline still built) · 2 fit/build failure.
"""
import argparse, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))


def project_root(src):
    d = os.path.abspath(src)
    while d and d != "/":
        if os.path.basename(d) == "Elements":
            return os.path.dirname(d)
        d = os.path.dirname(d)
    return None


def step(tag, cmd, log, keep):
    """Run one script; full output to the log file, matched lines back for the summary."""
    log.write(f"\n### {tag}\n$ {' '.join(cmd)}\n")
    log.flush()
    p = subprocess.run(cmd, stdout=log, stderr=subprocess.STDOUT, text=True)
    log.flush()
    tail = [l for l in open(log.name, encoding="utf-8").read().rsplit(f"### {tag}\n", 1)[-1]
            .splitlines() if any(k in l for k in keep)]
    print(f"== {tag} ==")
    for l in tail[:40]:
        print(l)
    return p.returncode


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--name", required=True)
    ap.add_argument("--aspect", default="16x9")
    ap.add_argument("--raw", action="store_true")
    a = ap.parse_args()

    proj = project_root(a.src)
    prompts = os.path.join(proj, "Elements", "Prompts") if proj \
        else os.path.dirname(os.path.abspath(a.src))
    os.makedirs(prompts, exist_ok=True)
    cut = re.sub(r"\s+", "_", os.path.basename(os.path.normpath(a.src)))
    trims = os.path.join(prompts, f"{cut}_trims.json")
    log = open(os.path.join(prompts, f"{cut}_assembly_log.txt"), "a", encoding="utf-8")
    py = sys.executable

    if not a.raw:
        rc = step("1/3 trim fit", [py, f"{HERE}/fit_trims.py", "--src", a.src, "--out", trims],
                  log, ["fitting", "DONE", "FAILED"])
        if rc != 0:
            print(f"\nSTOPPED: trim fit failed (rc {rc}). Log: {log.name}")
            sys.exit(2)

    build = [py, f"{HERE}/build_timeline.py", "--src", a.src, "--name", a.name,
             "--aspect", a.aspect] + (["--raw"] if a.raw else ["--trims", trims])
    rc = step("2/3 build" if not a.raw else "build (raw)", build, log,
              ["project:", "project bin:", "imported", "appended", "VERIFY", "RESULT",
               "MISMATCHES", "APPEND FAILED"])
    if rc != 0:
        print(f"\nSTOPPED: build failed (rc {rc}). Log: {log.name}")
        sys.exit(2)

    mrc = 0
    if not a.raw:
        mrc = step("3/3 script match",
                   [py, f"{HERE}/script_match.py", "--trims", trims, "--manifest-dir", prompts],
                   log, ["RESULT", "SKIPPED", "UNMATCHED", "FLAG", "expected:", "heard:"])

    print(f"\nLOG {log.name}\nTRIMS {trims}" if not a.raw else f"\nLOG {log.name}")
    sys.exit(1 if mrc else 0)


if __name__ == "__main__":
    main()
