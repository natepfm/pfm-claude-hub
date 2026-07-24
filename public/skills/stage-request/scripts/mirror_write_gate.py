#!/usr/bin/env python3
"""mirror_write_gate.py — PreToolUse Bash hook: the team mirror is write-from-Sam-only.

Blocks any Bash command on an EDITOR machine that writes into the Lucid team mirror
(`6. Claude PFM`). Team distribution happens exclusively through Sam's Skill
Proposals flow + x.sync from the master machine — an editor Claude writing to the
mirror (however well-intentioned) can ship files to every editor's next update,
including silently overwriting a team skill on a name collision (the 2026-07-20
compliance-delivery incident, caught by Gabe M).

Direction-aware, to avoid false blocks:
  ALLOW  reads from the mirror (ls/cat/grep/diff), the updater script, cp FROM mirror
  BLOCK  rm/rmdir/mkdir/touch/sed -i/chmod targeting the mirror, redirects (>/>>)
         into it, tee onto it, and cp/mv/rsync where the mirror is the DESTINATION
         (last argument)

Master exemption: Sam's machine carries the master-only x.sync skill — if
~/.claude/skills/x.sync exists, everything passes.
Exit 0 = allow · exit 2 = block (stderr shown to Claude).
"""
import json, os, re, shlex, sys

MIRROR = "6. Claude PFM"


def mirror_in(tok):
    return MIRROR in tok


def block(reason):
    sys.stderr.write(
        "MIRROR WRITE GATE: blocked — the Lucid team mirror (6. Claude PFM) is "
        "write-from-Sam-only. Team distribution happens through the Skill Proposals "
        "board + Sam's sync, never by writing to the mirror directly (%s). If this "
        "change should reach the team, propose it with /propose-skill; if you need "
        "the latest team files, run claude-pfm-update.sh instead.\n" % reason)
    sys.exit(2)


def check_segment(seg):
    if MIRROR not in seg:
        return
    # Redirects into the mirror
    if re.search(r">{1,2}\s*['\"]?[^;|&<>]*" + re.escape(MIRROR), seg):
        block("shell redirect into the mirror")
    try:
        toks = shlex.split(seg)
    except ValueError:
        toks = seg.split()
    if not toks:
        return
    # strip env-var prefixes and sudo
    while toks and ("=" in toks[0] and not toks[0].startswith(("/", "."))):
        toks = toks[1:]
    if toks and toks[0] == "sudo":
        toks = toks[1:]
    if not toks:
        return
    cmd = os.path.basename(toks[0])
    args = [t for t in toks[1:] if not t.startswith("-")]
    if cmd in ("rm", "rmdir", "mkdir", "touch", "chmod", "chown", "ln", "truncate", "unzip", "tar"):
        if any(mirror_in(a) for a in args):
            block(f"{cmd} targeting the mirror")
    if cmd == "sed" and "-i" in toks and any(mirror_in(a) for a in args):
        block("in-place edit of a mirror file")
    if cmd == "tee":
        if any(mirror_in(a) for a in args):
            block("tee onto the mirror")
    if cmd in ("cp", "mv", "rsync", "ditto"):
        if args and mirror_in(args[-1]):
            block(f"{cmd} with the mirror as destination")
    if cmd in ("python", "python3", "perl", "ruby") and "-c" in toks or cmd in ("python", "python3") and "<<" in seg:
        # inline script mentioning the mirror: can't prove direction — block writes conservatively
        if re.search(r"(open\(|write|shutil|copy|rmtree|makedirs).{0,200}" + re.escape(MIRROR), seg) or \
           re.search(re.escape(MIRROR) + r".{0,200}(\"w\"|'w'|write|shutil|copy|rmtree|makedirs)", seg):
            block("inline script writing to the mirror")


def main():
    # Master machine (has the master-only x.sync skill): everything passes.
    if os.path.isdir(os.path.expanduser("~/.claude/skills/x.sync")):
        sys.exit(0)
    try:
        payload = json.load(sys.stdin)
    except Exception:
        sys.exit(0)
    cmdstr = (payload.get("tool_input") or {}).get("command", "")
    if MIRROR not in cmdstr:
        sys.exit(0)
    for seg in re.split(r"&&|\|\||;|\n", cmdstr):
        check_segment(seg)
    sys.exit(0)


if __name__ == "__main__":
    main()
