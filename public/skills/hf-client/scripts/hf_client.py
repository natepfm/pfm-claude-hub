#!/usr/bin/env python3
# PURPOSE:   Submit ONE generation request to Higgsfield and land the artifact. Nothing else.
# OWNS:      the higgsfield CLI invocation · the pre-spend cost quote · the model-param
#            advisory · FIRE-ONCE-THEN-POLL · pending-job persistence + resume ·
#            the `generate cost` charge as credits_spent (balance delta = tripwire only) ·
#            the download to a caller-named path.
# DOES NOT:  judge creative content · run QC gates · look at pixels · choose output names ·
#            write provenance sidecars · read prompts from disk · know what a "portrait",
#            "wide", "plate", "station" or "vN" is. Those belong to the CALLING skill.
"""hf_client.py — the Higgsfield transport layer, and only that.

Single responsibility: turn a declarative request into a landed file, or a truthful
account of why it did not land. It is the same fire contract proven in
sd2.5-interview-flow-extended-mf/scripts/extend_fire.py, lifted OUT of that skill's
creative logic so every skill can share one implementation instead of forking it.

🔴 THE CONTRACT — FIRE ONCE, THEN POLL.
`higgsfield ... --wait` blocks, and on a slow render returns "timed out waiting for job
<id>" with NO url. The job is ALIVE and BILLING. Re-firing there spawns duplicate paid
jobs; five of six project retros named that the single biggest credit waste. So:
  1. Fire ONCE.
  2. If a url came back — land it.
  3. If NO url but a job id is present — the job EXISTS. Persist it, then POLL that id.
     NEVER re-fire.
  4. Only a true no-submit (no url, no job id, AND the balance did not move) may retry.
     A balance drop with no job id means a job was created that we cannot name — that is
     NOT a no-submit. Refire there is the same double-bill through a side door.
`resume()` adopts any .pending_<job>.json a killed session left behind, and refuses to
land onto a file that now exists (the never-overwrite law holds on every path).

The CLI reports an unknown id as `Error: Job not found` with EXIT CODE 0 (verified
2026-09-01), so poll_job reads the TEXT for a dead job, never the return code.

Vendor flag spelling is DATA, not logic. Higgsfield mixes dashes and underscores
(--image-references, --start-image, --extension_mode, --bitrate_mode) and has rejected
plausible-looking corrections in the past. This layer therefore passes every flag name
through VERBATIM as the caller supplies it and normalises nothing. params/repeated are
ordered dicts, so the caller controls argument order too.

Serves video AND image fires — the transport is identical.

Usage as a library:
    import hf_client
    r = hf_client.fire(hf_client.Request(
            model="seedance_2_5", prompt=text, dest="/path/out_v01.mp4",
            work_dir="/path", params={"duration": 29, "resolution": "720p"},
            repeated={"image-references": [p1, p2]}, flags=["wait"]))
    if r.ok: print(r.dest, r.url)

Exit codes (CLI wrapper): 0 landed · 1 refused (never submitted) · 2 exhausted ·
3 pending (job alive, resume later).
"""
import glob
import json
import os
import re
import subprocess
from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional

POLL_ATTEMPTS = 40
BALANCE_TIMEOUT = 30
MEDIA_EXT = (".mp4", ".mov", ".png", ".jpg", ".jpeg", ".webp", ".wav", ".mp3", ".txt", ".json")

UUID_RE = re.compile(r"\b([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-"
                     r"[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\b")
URL_RE = re.compile(r"https://\S+\.(?:mp4|mov|png|jpe?g|webp|wav|mp3)")
DEAD_JOB_RE = re.compile(r"job not found|not found|invalid job|unknown job|no such job", re.I)


class Refused(Exception):
    """A malformed request. Nothing was submitted and nothing was billed."""


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


@dataclass
class Request:
    model: str
    prompt: str
    dest: str
    work_dir: Optional[str] = None
    params: Dict[str, Any] = field(default_factory=dict)
    repeated: Dict[str, List[str]] = field(default_factory=dict)
    flags: List[str] = field(default_factory=list)
    label: str = ""
    allow_overwrite: bool = False
    no_submit_retries: int = 1
    cost_params: tuple = ("duration", "resolution", "aspect_ratio")


@dataclass
class Result:
    ok: bool
    status: str
    dest: Optional[str] = None
    url: Optional[str] = None
    job_id: Optional[str] = None
    cost_quote_cr: Optional[float] = None
    balance_before: Optional[float] = None
    balance_after: Optional[float] = None
    balance_delta: Optional[float] = None      # workspace-wide; tripwire + audit ONLY
    credits_spent: Optional[float] = None      # this fire's charge (see credits_source)
    credits_source: Optional[str] = None       # generate_cost | balance_delta_fallback | not_submitted
    billed_but_no_url: bool = False
    fire_attempts: int = 0
    poll_attempts: int = 0
    advisories: List[str] = field(default_factory=list)
    command: List[str] = field(default_factory=list)
    detail: str = ""

    def to_json(self):
        return json.dumps(asdict(self), indent=1)


def find_urls(text):
    return URL_RE.findall(text)


def find_job_id(text):
    """A job id in the output means the job EXISTS server-side. Do not re-fire."""
    m = re.search(r"job\s+([0-9a-f-]{36})", text) or UUID_RE.search(text)
    return m.group(1) if m else None


def pending_path(work_dir, job):
    return os.path.join(work_dir, f".pending_{job}.json")


def balance(runner=sh):
    """Workspace credit balance, or None if unreadable. Never raises."""
    try:
        r = runner(["higgsfield", "account", "status", "--json"])
        return float(json.loads(r.stdout)["credits"])
    except Exception:
        return None


def spent(before, after):
    """Measured WORKSPACE delta, or None when either read failed. None means UNMEASURED, never
    zero. 🔴 Not this fire's cost: the workspace is shared, so another editor's gen billing in
    the fire window lands in this number (measured ~3x over on a 4-clip fire, 2026-09-02).
    It stays for the billed-but-no-url tripwire and the audit row. See record_spend()."""
    if before is None or after is None:
        return None
    return round(before - after, 2)


def record_spend(quote, delta, submitted):
    """(credits_spent, credits_source). The deterministic per-job charge from `generate cost`
    is the source of record — keyed only to this fire's params, it cannot be polluted. The
    delta is the flagged fallback when no quote could be read."""
    if not submitted:
        return 0.0, "not_submitted"
    if quote is not None:
        return float(quote), "generate_cost"
    return delta, "balance_delta_fallback"


def _looks_like_path(v):
    s = str(v)
    return ("/" in s) and s.lower().endswith(MEDIA_EXT) and not s.startswith(("http://", "https://"))


def validate(req: Request):
    """Refusals for things that would waste a fire. Creative judgement is NOT here."""
    if not req.model:
        raise Refused("no --model: nothing to fire")
    if not str(req.prompt).strip():
        raise Refused("empty prompt: refusing to spend on a blank fire")
    if not req.dest:
        raise Refused("no --dest: the caller must name the output file")
    if os.path.exists(req.dest) and not req.allow_overwrite:
        raise Refused(f"dest already exists and would be overwritten: {req.dest}\n"
                      f"  PFM law: a prior take is never overwritten. Name the next vN, "
                      f"or pass allow_overwrite if you truly mean to replace it.")
    missing = []
    for k, v in req.params.items():
        if v is None or str(v).strip() == "":
            raise Refused(f"param --{k} has an empty value")
        if _looks_like_path(v) and not os.path.exists(str(v)):
            missing.append(f"--{k} {v}")
    for k, vals in req.repeated.items():
        if not vals:
            raise Refused(f"repeated --{k} was given no values")
        for v in vals:
            if _looks_like_path(v) and not os.path.exists(str(v)):
                missing.append(f"--{k} {v}")
    if missing:
        raise Refused("input file(s) not on disk — refusing to spend:\n  "
                      + "\n  ".join(missing))


def build_command(req: Request):
    """Flag names pass through VERBATIM. Order: repeated, then params, then bare flags."""
    cmd = ["higgsfield", "generate", "create", req.model, "--prompt", req.prompt]
    for k, vals in req.repeated.items():
        for v in vals:
            cmd += [f"--{k}", str(v)]
    for k, v in req.params.items():
        cmd += [f"--{k}", str(v)]
    for f in req.flags:
        cmd.append(f"--{f}")
    return cmd


def cost_quote(req: Request, runner=sh):
    """Ask the price BEFORE spending. Non-fatal — a missing quote never blocks a fire.
    `--prompt` is REQUIRED by the CLI (verified 2026-09-02; without it every quote was None).
    Only price-keyed params are sent: the CLI refuses unknown ones (`Unknown params: ...`)."""
    args = ["--prompt", req.prompt]
    for k in req.cost_params:
        if k in req.params:
            args += [f"--{k}", str(req.params[k])]
    try:
        q = runner(["higgsfield", "generate", "cost", req.model] + args + ["--json"])
        try:
            return float(json.loads(q.stdout)["credits"])
        except Exception:
            m = re.search(r"(\d[\d,]*(?:\.\d+)?)\s*(?:cr|credit)", (q.stdout + q.stderr), re.I)
            return float(m.group(1).replace(",", "")) if m else None
    except Exception:
        return None


def model_params(model, runner=sh):
    """Param names <model> accepts. None means COULD NOT TELL — never 'accepts nothing'."""
    try:
        r = runner(["higgsfield", "model", "get", model])
        if r.returncode != 0:
            return None
        names = {m.group(1) for m in
                 (re.match(r"^([a-z_][a-z0-9_-]*)\s\s+\S", ln) for ln in r.stdout.splitlines())
                 if m}
        return names or None
    except Exception:
        return None


def unaccepted(req: Request, runner=sh):
    """ADVISORY ONLY. Names flags this fire sends that the model does not list."""
    accepts = model_params(req.model, runner=runner)
    if accepts is None:
        return []
    sending = {k.replace("-", "_") for k in list(req.params) + list(req.repeated)}
    known = {a.replace("-", "_") for a in accepts}
    unknown = sorted(sending - known)
    if not unknown:
        return []
    return [f"⚠ {req.model} does not list param(s) {', '.join(unknown)} — the CLI may refuse "
            f"this fire. Check `higgsfield model get {req.model}` before spending."]


def download(url, dest, runner=sh):
    """-f: an HTTP error must FAIL, never be saved as the media file."""
    os.makedirs(os.path.dirname(os.path.abspath(dest)) or ".", exist_ok=True)
    d = runner(["curl", "-fsSL", "-o", dest, url])
    if d.returncode != 0 or not os.path.exists(dest) or os.path.getsize(dest) == 0:
        if os.path.exists(dest) and os.path.getsize(dest) == 0:
            os.remove(dest)
        return False, (d.stderr or "")[-200:]
    return True, ""


def poll_job(job, runner=sh, attempts=POLL_ATTEMPTS):
    """Adopt a live job and block until it lands. NEVER fires anything.

    Returns (urls, attempts_used, dead_reason). dead_reason is a string when Higgsfield says
    the job does not exist or failed — the caller must stop polling it, and must NOT re-fire
    (the money question is unknown, so the safe side is to stop and report)."""
    for i in range(1, attempts + 1):
        w = runner(["higgsfield", "generate", "wait", job, "--json"])
        out = (w.stdout or "") + (w.stderr or "")
        urls = find_urls(out)
        if urls:
            return urls, i, None
        if DEAD_JOB_RE.search(out):
            return [], i, f"Higgsfield does not recognise job {job}: {out.strip()[:120]}"
        if re.search(r"\bfailed\b", out) and not find_job_id(out):
            return [], i, f"job {job} reported failed: {out.strip()[:120]}"
    return [], attempts, None


def fire(req: Request, runner=sh, log=print) -> Result:
    """Fire ONCE, then poll. The whole responsibility of this module."""
    try:
        validate(req)
    except Refused as r:
        return Result(ok=False, status="refused", detail=str(r))

    work = req.work_dir or os.path.dirname(os.path.abspath(req.dest))
    os.makedirs(work, exist_ok=True)

    res = Result(ok=False, status="exhausted")
    res.command = build_command(req)
    res.advisories = unaccepted(req, runner=runner)
    for a in res.advisories:
        log(f"  {a}")
    res.cost_quote_cr = cost_quote(req, runner=runner)
    if res.cost_quote_cr is not None:
        log(f"  COST quote: {res.cost_quote_cr} cr")

    no_submit_tries = 0
    while True:
        log(f"  FIRE {req.label or req.model} (attempt {res.fire_attempts + 1})")
        bal_before = balance(runner=runner)
        r = runner(res.command)
        bal_after = balance(runner=runner)
        res.fire_attempts += 1
        res.balance_before, res.balance_after = bal_before, bal_after
        _delta = spent(bal_before, bal_after)
        res.balance_delta = _delta

        out_text = (r.stdout or "") + (r.stderr or "")
        urls = find_urls(out_text)
        job = find_job_id(out_text)
        res.job_id = job or res.job_id
        money_moved = (_delta or 0) > 0          # tripwire reads the DELTA, unchanged
        dead = None
        res.credits_spent, res.credits_source = record_spend(
            res.cost_quote_cr, _delta, submitted=bool(urls or job or money_moved))

        if not urls and job:
            # 🔴 The job EXISTS and is billing. Persist, then poll. NEVER re-fire.
            pp = pending_path(work, job)
            rec = {"job": job, "label": req.label, "dest": req.dest,
                   "model": req.model, "params": req.params, "repeated": req.repeated,
                   "flags": req.flags, "cost_quote_cr": res.cost_quote_cr}
            with open(pp, "w") as fh:
                json.dump(rec, fh, indent=1)
            log(f"  SUBMITTED job {job} — --wait timed out; POLLING by id, NOT re-firing")
            urls, res.poll_attempts, dead = poll_job(job, runner=runner)
            if dead and os.path.exists(pp):
                os.remove(pp)   # nothing to resume — the id is not a live job

        # The flag is the TRUTH after polling, not before: a poll that lands is not a loss.
        res.billed_but_no_url = bool(not urls and money_moved)

        if not urls:
            if not job and not money_moved and no_submit_tries < req.no_submit_retries:
                no_submit_tries += 1
                log(f"  no job created, balance unchanged (dropped request) — safe to retry "
                    f"({no_submit_tries}/{req.no_submit_retries})")
                continue
            if dead:
                res.status = "exhausted"
                res.detail = (f"{dead} — NOT re-firing (a job may still have billed); "
                              f"check `higgsfield generate list` before firing again")
            elif job:
                res.status = "pending"
                res.detail = (f"job {job} submitted but not landable yet — left "
                              f"{os.path.basename(pending_path(work, job))} in place; resume it")
            elif money_moved:
                res.status = "exhausted"
                res.detail = (f"balance dropped {res.balance_delta} cr but no url and no job id "
                              f"came back — a job WAS created; NOT re-firing. Find it with "
                              f"`higgsfield generate list` and resume/download it by id")
            else:
                res.detail = f"no clean landing (job={job or 'none'})"
            log(f"  {res.status.upper()} — {res.detail}")
            return res

        res.url = urls[-1]
        ok, err = download(res.url, req.dest, runner=runner)
        if not ok:
            res.status = "exhausted"
            res.detail = f"download failed: {err}"
            log(f"  {res.detail}")
            return res

        pp = pending_path(work, job) if job else None
        if pp and os.path.exists(pp):
            os.remove(pp)
        res.ok, res.status, res.dest = True, "landed", req.dest
        log(f"  LANDED {req.dest}  {res.url}")
        return res


def resume(work_dir, dest=None, runner=sh, log=print, allow_overwrite=False) -> List[Result]:
    """Adopt every .pending_<job>.json in work_dir and poll it. Fires NOTHING.

    Refuses to land onto a file that exists (the editor may have re-fired by hand while this
    job was pending) — the sidecar stays so the take can be landed under another --dest."""
    out = []
    for pf in sorted(glob.glob(os.path.join(work_dir, ".pending_*.json"))):
        rec = json.load(open(pf))
        job = rec["job"]
        target = dest or rec.get("dest")
        res = Result(ok=False, status="pending", job_id=job,
                     cost_quote_cr=rec.get("cost_quote_cr"))
        if target and os.path.exists(target) and not allow_overwrite:
            res.status = "refused"
            res.detail = (f"dest already exists and would be overwritten: {target} — "
                          f"{os.path.basename(pf)} left in place; resume with --dest <next vN> "
                          f"(PFM law: a prior take is never overwritten)")
            log(f"  REFUSED — {res.detail}")
            out.append(res)
            continue
        log(f"  RESUME polling job {job}")
        urls, res.poll_attempts, dead = poll_job(job, runner=runner)
        if dead:
            os.remove(pf)
            res.status, res.detail = "exhausted", f"{dead} — sidecar removed, nothing to resume"
            log(f"  {res.detail}")
            out.append(res)
            continue
        if not urls:
            res.detail = f"job {job} not landable yet — {os.path.basename(pf)} left in place"
            log(f"  {res.detail}")
            out.append(res)
            continue
        res.url = urls[-1]
        ok, err = download(res.url, target, runner=runner)
        if ok:
            res.ok, res.status, res.dest = True, "landed", target
            res.credits_spent, res.credits_source = record_spend(res.cost_quote_cr, None, True)
            os.remove(pf)
            log(f"  LANDED {target}  {res.url}")
        else:
            res.status, res.detail = "exhausted", f"download failed: {err}"
            log(f"  {res.detail}")
        out.append(res)
    if not out:
        log(f"  no pending job in {work_dir} — nothing to resume")
    return out
