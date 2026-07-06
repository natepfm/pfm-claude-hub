#!/usr/bin/env python3
"""Build a LinkYourFile share link from a Lucid Link path — and feed Fox.io's 🦊 From Claude rail.

LinkYourFile encodes the target path as a STANDARD-base64 string in the `p=` query
param, URL-encoded (so the `=` padding becomes `%3D`). This mirrors exactly how the
real PFM Notion delivery comments are formed — see the two known-good pairs in
`_KNOWN` below, captured from live delivery comments (Minnesota Home VSL + Texas Auto
VSL, 2026-05). The `--selftest` mode decodes each real `p=` and re-encodes it, asserting
byte-for-byte equality, so we KNOW the encoder matches LinkYourFile's scheme.

Fox.io (PFM's macOS media browser) gets its handoffs through the **🦊 From Claude rail**:
`--fox-drop` appends a JSONL entry to the watched inbox file, and Fox.io surfaces it as a
sidebar entry + toast whose click opens the folder in a NEW tab (clicking consumes the
entry; unclicked entries expire after 7 days). The rail exists because chat renderers
cannot reach local apps at all — foxio:// links are swallowed, https links open the
browser, file:// links open Claude's own viewer (all three tested 2026-07-06) — so the
rail IS the click path. `--both` prints the LinkYourFile URL AND queues the 🦊 drop in one
call. `--foxio-raw` emits the raw `foxio://open?p=<base64>` scheme (paste into Fox.io's
Go-to box), byte-identical to the app's "Copy Fox.io Link" (AppModel.foxioLink: standard
base64 with only the `=` padding replaced by `%3D`).

Note on `+` / `/`: these PFM paths (`/Volumes/ads/PFM MEDIA MASTER FOLDER/...`) happen to
produce base64 with no `+` or `/` chars. If a future path ever does, `quote(safe="")`
encodes them as `%2B` / `%2F` (standards-compliant query-value encoding), which servers
decode correctly. That's the documented assumption.

(Compatibility: plain defaults, no 3.10+ type syntax — must run on macOS system python3.)

Usage:
    python3 linkyourfile.py "/Volumes/ads/PFM MEDIA MASTER FOLDER/.../<folder>"
    python3 linkyourfile.py --fox-drop "/Volumes/ads/.../<folder>" ["<label>"]
    python3 linkyourfile.py --both "/Volumes/ads/.../<folder>" ["<label>"]
    python3 linkyourfile.py --foxio-raw "/Volumes/ads/.../<folder>"
    python3 linkyourfile.py --selftest
"""
import base64
import json
import os
import sys
import time
import urllib.parse

BASE = "https://linkyourfile.com/link?p="
FOXIO_BASE = "foxio://open?p="
FOX_INBOX = os.path.expanduser("~/Library/Application Support/FoxView/claude/inbox.jsonl")


def _b64(path):
    return base64.b64encode(path.rstrip("/").encode("utf-8")).decode("ascii")


def make_link(path):
    """Lucid Link path -> LinkYourFile share URL."""
    return BASE + urllib.parse.quote(_b64(path), safe="")


def make_foxio_raw(path):
    """Lucid Link path -> raw foxio://open?p=… deep link (matches AppModel.foxioLink)."""
    return FOXIO_BASE + _b64(path).replace("=", "%3D")


def fox_drop(path, label=None):
    """Append a drop to Fox.io's 🦊 From Claude inbox — the app watches this file and
    surfaces the drop as a sidebar entry + toast (jumps ALWAYS open in a new tab)."""
    path = path.rstrip("/")
    label = label or os.path.basename(path)
    os.makedirs(os.path.dirname(FOX_INBOX), exist_ok=True)
    entry = json.dumps({"ts": time.time(), "path": path, "label": label})
    lines = []
    if os.path.isfile(FOX_INBOX):
        with open(FOX_INBOX, encoding="utf-8") as f:
            lines = [l for l in f.read().split("\n") if l.strip()]
    lines.append(entry)
    lines = lines[-300:]  # bound the file; Fox.io dedupes by path + expires >7d on load
    with open(FOX_INBOX, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    return label


def decode_link(link):
    """LinkYourFile / foxio share URL -> Lucid Link path (inverse of the builders)."""
    p = link.split("p=", 1)[1]
    b64 = urllib.parse.unquote(p)
    return base64.b64decode(b64).decode("utf-8")


# Real `p=` values captured from live PFM Notion delivery comments. Used by --selftest
# to prove the encoder reproduces LinkYourFile's scheme exactly.
_KNOWN = [
    # Minnesota Home VSL (ends in `%3D` -> one `=` pad)
    "L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzQuIFBGTSBQcm9qZWN0IEZpbGVzL0hvbWUgSW5zdXJhbmNlIC0gQ29tcGxldGVkIENyZWF0aXZlcy9Ib21lIEluc3VyYW5jZSAtIDIwMjYvSG9tZSAtIE1heSAyMDI2LzA1LjA3LjI1IC0gVlNMIC0gQXZlcmFnZSBIb21lIFN0YXRlIFBpdGNoIFZhcmlhdGlvbnM%3D",
    # Texas Auto VSL (no padding)
    "L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzQuIFBGTSBQcm9qZWN0IEZpbGVzL0F1dG8gLSBDb21wbGV0ZWQgQ3JlYXRpdmVzL0F1dG8gLSAyMDI2L0F1dG8gLSBNYXkgLSAyMDI2LzA1LjA3LjI2IC0gQXZlcmFnZSBTdGF0ZSBWU0wgLSBWYXJpYXRpb25z",
]


def _selftest():
    for i, p in enumerate(_KNOWN, 1):
        link = BASE + p
        path = decode_link(link)
        reencoded = make_link(path)
        assert reencoded == link, (
            "MISMATCH on known link #%d\n  decoded path: %s\n  re-encoded:   %s\n  expected:     %s"
            % (i, path, reencoded, link)
        )
        raw = make_foxio_raw(path)
        assert raw == FOXIO_BASE + _b64(path).replace("=", "%3D") and decode_link(raw) == path, (
            "FOXIO-RAW MISMATCH on known link #%d\n  built: %s\n  path back: %s" % (i, raw, decode_link(raw))
        )
        print("  #%d OK  ->  %s" % (i, path))
    print("✓ selftest passed — LYF matches real PFM delivery links byte-for-byte; foxio-raw round-trips")


if __name__ == "__main__":
    args = sys.argv[1:]
    if args == ["--selftest"]:
        _selftest()
    elif len(args) in (2, 3) and args[0] == "--fox-drop":
        print("🦊 queued: %s" % fox_drop(*args[1:]))
    elif len(args) in (2, 3) and args[0] == "--both":
        print(make_link(args[1]))
        print("🦊 queued: %s" % fox_drop(*args[1:]))
    elif len(args) == 2 and args[0] in ("--foxio-raw", "--foxio"):  # --foxio = legacy alias
        print(make_foxio_raw(args[1]))
    elif len(args) == 1 and not args[0].startswith("--"):
        print(make_link(args[0]))
    else:
        print(
            "usage: linkyourfile.py <lucid-link-path>                    # LinkYourFile URL\n"
            "       linkyourfile.py --fox-drop <path> [label]            # queue in Fox.io's From Claude rail\n"
            "       linkyourfile.py --both <path> [label]                # LYF URL + queue the 🦊 drop\n"
            "       linkyourfile.py --foxio-raw <path>                   # raw foxio:// scheme (Go-to box)\n"
            "       linkyourfile.py --selftest",
            file=sys.stderr,
        )
        sys.exit(1)
