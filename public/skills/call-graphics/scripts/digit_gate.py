#!/usr/bin/env python3
"""digit_gate.py — PFM's mechanical digit-verification gate for graphics (G3).

Numbers on graphics (tracking numbers, rates, board values) MUST be verified
character-for-character before delivery — a transposed digit = dead ad spend or a
compliance kill. This gate makes "digit-verify every PNG" impossible to skip:
delivery steps call `--status` and REFUSE while any file is unconfirmed.

Pattern: attestation-per-file (same model as the ref-check hook). Claude must Read
each PNG with its own eyes and confirm THAT file's digits against the expected
values — one file at a time, no blanket confirm.

Flow:
  1. digit_gate.py init <dir> --expected "(206) 555-0142" "$49/mo"   # after download
       → writes <dir>/.digit_verify.json listing every PNG as PENDING, prints the
         checklist, exits 1 (gate now CLOSED for this dir).
  2. For EACH file: Read the PNG, compare digits to the expected values, then:
     digit_gate.py confirm <dir> <file.png>        # digits match, attested
     digit_gate.py fail <dir> <file.png> "reason"  # mismatch → file flagged for refire
  3. digit_gate.py status <dir>
       → exit 0 ONLY when every PNG is confirmed and none failed. Delivery blocks on
         nonzero. Failed files: fix/refire → re-run init (or confirm the new file).

`init` is idempotent-additive: re-running picks up NEW pngs without wiping confirms
(use --reset to start over). Expected values are stored so the checklist always
shows what to compare against.
"""
import json, os, sys, glob

STATE = ".digit_verify.json"


def load(d):
    p = os.path.join(d, STATE)
    return json.load(open(p)) if os.path.exists(p) else {"expected": [], "files": {}}


def save(d, st):
    json.dump(st, open(os.path.join(d, STATE), "w"), indent=1)


def pngs(d):
    out = []
    for ext in ("png", "jpg", "jpeg"):
        out += glob.glob(os.path.join(d, "**", f"*.{ext}"), recursive=True)
    return sorted(os.path.relpath(f, d) for f in out)


def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(2)
    cmd, d = sys.argv[1], sys.argv[2]
    if not os.path.isdir(d):
        print(f"ERROR: not a dir: {d}"); sys.exit(2)
    st = load(d)

    if cmd == "init":
        args = sys.argv[3:]
        if "--reset" in args:
            st = {"expected": [], "files": {}}; args.remove("--reset")
        if args and args[0] == "--expected":
            st["expected"] = args[1:]
        found = pngs(d)
        for f in found:
            st["files"].setdefault(f, {"state": "PENDING"})
        for f in list(st["files"]):
            if f not in found:
                del st["files"][f]
        save(d, st)
        pend = [f for f, v in st["files"].items() if v["state"] == "PENDING"]
        print(f"DIGIT GATE CLOSED — {len(st['files'])} graphic(s), {len(pend)} pending verification.")
        print(f"Expected values: {st['expected'] or '(none set — pass --expected!)'}")
        for f in pend:
            print(f"  PENDING  {f}  → Read it, compare digits char-for-char, then: digit_gate.py confirm '{d}' '{f}'")
        sys.exit(1 if pend or not st["files"] else 0)

    if cmd in ("confirm", "fail"):
        f = sys.argv[3]
        if f not in st["files"]:
            print(f"ERROR: {f} not tracked — run init first."); sys.exit(2)
        if cmd == "confirm":
            st["files"][f] = {"state": "CONFIRMED"}
            print(f"✓ confirmed: {f}")
        else:
            reason = sys.argv[4] if len(sys.argv) > 4 else "digit mismatch"
            st["files"][f] = {"state": "FAILED", "reason": reason}
            print(f"✗ FAILED: {f} — {reason} (fix/refire, then re-init + confirm)")
        save(d, st)
        sys.exit(0)

    if cmd == "status":
        if not st["files"]:
            print("DIGIT GATE: no state — run init after download. Gate CLOSED."); sys.exit(1)
        pend = [f for f, v in st["files"].items() if v["state"] == "PENDING"]
        bad = [(f, v.get("reason", "")) for f, v in st["files"].items() if v["state"] == "FAILED"]
        n = len(st["files"])
        if pend or bad:
            print(f"DIGIT GATE CLOSED — {n - len(pend) - len(bad)}/{n} confirmed."
                  + (f" {len(pend)} pending: {', '.join(pend)}." if pend else "")
                  + (f" {len(bad)} FAILED: {', '.join(f for f, _ in bad)}." if bad else ""))
            sys.exit(1)
        print(f"✓ DIGIT GATE OPEN — VERIFIED {n}/{n} graphics digit-confirmed.")
        sys.exit(0)

    print(f"ERROR: unknown command {cmd}"); sys.exit(2)


if __name__ == "__main__":
    main()
