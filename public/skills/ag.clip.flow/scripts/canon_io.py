#!/usr/bin/env python3
"""
canon_io.py — safe read-modify-write for shared YAML canon (born 2026-08-01).

WHY THIS EXISTS
---------------
Every tool that mutates shot state used to do: read whole file -> change one field
in memory -> write whole file. That is safe when read and write are milliseconds
apart. It is NOT safe when they are minutes apart, which is exactly what a
backgrounded fire loop does:

    19:44  background fire job starts   -> reads SHOTS.yaml (S22/S23 = unboarded)
    19:47  qc S22 --verdict PASS        -> read, set, write   OK on disk
    19:49  qc S23 --verdict PASS        -> read, set, write   OK on disk
    19:52  background job finishes      -> writes ITS 19:44 copy -> both passes GONE

Neither process is wrong. The background writer just serialises a document it read
before the other writes existed. Last writer wins and the loser is SILENT: no error,
the file stays valid YAML and passes validate. Observed twice on Test 3, 07-31-26,
the second time while the defect was being written up. It reverts any field the stale
copy holds -- qc verdicts, start_frame pins, hop_count, detail_refs, and the note:
fields that record WHY a locked rule reads the way it does.

THE FIX IS TWO PARTS AND BOTH ARE LOAD-BEARING
----------------------------------------------
1. flock  -- stops two writers interleaving mid-write.
2. re-read and merge at write time -- the writer applies its mutation to the CURRENT
   document, never to the stale one it loaded minutes ago.

(1) alone does not save the data: a process holding its copy across a whole Seedance
batch still clobbers everything written in the meantime. (2) is what actually saves it.

VENDORED, NOT IMPORTED (pipeline session's call, 08-01)
-------------------------------------------------------
Identical copies live in ag.scene.flow/scripts/ and ag.clip.flow/scripts/. x.sync's
lint fails when they diverge. A cross-skill import would break the way ag.storyboard
broke when it hard-depended on ag.scene.flow's fire_frame.py -- and a canon-WRITING
helper failing to import is worse than the race it fixes. Precedent: Palmier's trim
recipe is vendored into e.assemble.base as asm_lib.py.

USAGE
-----
    from canon_io import canon_write

    def _pass(doc):
        for s in doc["shots"]:
            if s["id"] == "S22":
                s["status"] = "qc_pass"

    canon_write(path, _pass)          # locks, RE-READS, mutates, writes

The mutate function receives the freshly-read document and edits it in place.
Anything it does not touch is preserved exactly as another writer left it.
"""

import os
import tempfile
from pathlib import Path

import yaml

try:
    import fcntl
    _HAVE_FLOCK = True
except ImportError:                                    # non-POSIX; merge still applies
    _HAVE_FLOCK = False

LOCK_SUFFIX = ".lock"
LOCK_TIMEOUT_S = 60


class CanonLockTimeout(RuntimeError):
    pass


def _lock_path(path):
    p = Path(path)
    return p.parent / (p.name + LOCK_SUFFIX)


def _acquire(path):
    """Exclusive lock on a sidecar file. Returns the open handle, or None."""
    if not _HAVE_FLOCK:
        return None
    import time
    lp = _lock_path(path)
    fh = open(lp, "w")
    deadline = time.monotonic() + LOCK_TIMEOUT_S
    while True:
        try:
            fcntl.flock(fh.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
            return fh
        except BlockingIOError:
            if time.monotonic() > deadline:
                fh.close()
                raise CanonLockTimeout(
                    f"could not lock {lp} within {LOCK_TIMEOUT_S}s — another writer is "
                    f"holding it. Nothing was written; re-run once the other job finishes.")
            time.sleep(0.15)


def _release(fh):
    if fh is None:
        return
    try:
        if _HAVE_FLOCK:
            fcntl.flock(fh.fileno(), fcntl.LOCK_UN)
    finally:
        fh.close()


def _atomic_dump(path, doc):
    """Write via a temp file + os.replace so a reader never sees a half-written doc."""
    p = Path(path)
    fd, tmp = tempfile.mkstemp(dir=str(p.parent), prefix=p.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w") as f:
            yaml.safe_dump(doc, f, sort_keys=False, allow_unicode=True, width=100,
                           default_flow_style=False)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, str(p))
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def canon_write(path, mutate):
    """Lock -> RE-READ from disk -> mutate the fresh doc in place -> atomic write.

    `mutate(doc)` edits the document in place. Its return value is ignored, so a
    caller cannot accidentally hand back a stale document. Returns the written doc.
    """
    if not callable(mutate):
        raise TypeError("canon_write(path, mutate): mutate must be callable — pass a "
                        "function that edits the document in place, never a pre-built "
                        "document (that is the stale-copy bug this exists to prevent)")
    fh = _acquire(path)
    try:
        p = Path(path)
        doc = yaml.safe_load(p.read_text()) if p.is_file() else None
        if doc is None:
            doc = {}
        mutate(doc)                                     # applied to the CURRENT doc
        _atomic_dump(p, doc)
        return doc
    finally:
        _release(fh)


def canon_read(path):
    """Read under the same lock, so a read never lands mid-write."""
    fh = _acquire(path)
    try:
        p = Path(path)
        return yaml.safe_load(p.read_text()) if p.is_file() else None
    finally:
        _release(fh)
