#!/usr/bin/env python3
"""veo-life intake — scan a stills folder for Finder-tagged images.

Usage: python3 scan_finder_tags.py <folder> [tag_color]
  tag_color defaults to "blue" (any color name works — "green", "red", ...).

Prints the matching filenames (one per line) and a count summary. This is the
Step 1 blue-tag scan from veo-life/SKILL.md.
"""
import os
import plistlib
import subprocess
import sys


def scan(folder: str, tag_name: str = "blue"):
    tagged = []
    for f in sorted(os.listdir(folder)):
        if not f.lower().endswith((".png", ".jpg", ".jpeg")):
            continue
        r = subprocess.run(
            ["xattr", "-px", "com.apple.metadata:_kMDItemUserTags", os.path.join(folder, f)],
            capture_output=True, text=True,
        )
        if r.returncode != 0:
            continue
        try:
            tags = plistlib.loads(bytes.fromhex("".join(r.stdout.split())))
            if any(str(t).split("\n")[0].lower() == tag_name.lower() for t in tags):
                tagged.append(f)
        except Exception:
            pass
    return tagged


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    folder = sys.argv[1]
    tag = sys.argv[2] if len(sys.argv) > 2 else "blue"
    hits = scan(folder, tag)
    for f in hits:
        print(f)
    print(f"\n{len(hits)} {tag}-tagged still(s) in {folder}")
