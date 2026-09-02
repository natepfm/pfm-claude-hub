#!/usr/bin/env python3
# PURPOSE:  Prove the FIRE-ONCE-THEN-POLL contract holds, offline, for zero credits.
# OWNS:     the assertions. DOES NOT: touch the network or the higgsfield binary.
"""selftest.py — the contract, asserted against a fake Higgsfield.

The expensive bug this layer exists to prevent is unobservable in production without
spending: a --wait timeout re-fired as a fresh job. So it is asserted here instead.
Run it after ANY edit to hf_client.py. Exit 0 = every assertion passed.
"""
import os
import sys
import tempfile
import types

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import hf_client

JOB = "0f9e8d7c-6b5a-4231-9f8e-7d6c5b4a3210"
URL = "https://cdn.example.com/out.mp4"
PASS, FAIL = [], []


def check(name, cond, detail=""):
    (PASS if cond else FAIL).append(name)
    print(f"  {'PASS' if cond else 'FAIL'}  {name}{'' if cond else '  — ' + detail}")


def fake(script, counter):
    """script: fn(cmd) -> (stdout, stderr, rc). counter tallies real `generate create` calls."""
    def runner(cmd):
        if cmd[:3] == ["higgsfield", "generate", "create"]:
            counter["fires"] += 1
        if cmd[0] == "curl":
            if counter.get("curl_rc", 0) != 0:
                return types.SimpleNamespace(stdout="", stderr="curl: (22) HTTP 404",
                                             returncode=counter["curl_rc"])
            open(cmd[3], "w").write("x")
            return types.SimpleNamespace(stdout="", stderr="", returncode=0)
        out, err, rc = script(cmd)
        return types.SimpleNamespace(stdout=out, stderr=err, returncode=rc)
    return runner


def req(tmp, **kw):
    d = dict(model="seedance_2_5", prompt="a prompt", dest=os.path.join(tmp, "o_v01.mp4"),
             work_dir=tmp, params={"duration": "20"}, flags=["wait"], label="t")
    d.update(kw)
    return hf_client.Request(**d)


def run():
    # 1 — happy path: url on the first fire, exactly one fire
    with tempfile.TemporaryDirectory() as t:
        c = {"fires": 0}
        r = hf_client.fire(req(t), runner=fake(lambda cmd: (URL, "", 0), c), log=lambda *_: None)
        check("happy path lands", r.ok and r.status == "landed", r.detail)
        check("happy path fires exactly once", c["fires"] == 1, f"fired {c['fires']}x")
        check("dest written", os.path.exists(r.dest or ""), "no file")

    # 2 — 🔴 THE CONTRACT: --wait timeout with a job id must POLL, never re-fire
    with tempfile.TemporaryDirectory() as t:
        c = {"fires": 0}

        def script(cmd):
            if cmd[:3] == ["higgsfield", "generate", "create"]:
                return "", f"timed out waiting for job {JOB}", 1
            if cmd[:3] == ["higgsfield", "generate", "wait"]:
                return URL, "", 0
            return "", "", 0
        r = hf_client.fire(req(t), runner=fake(script, c), log=lambda *_: None)
        check("timeout still lands via poll", r.ok and r.status == "landed", r.detail)
        check("🔴 timeout FIRED ONLY ONCE (no duplicate paid job)", c["fires"] == 1,
              f"fired {c['fires']}x — the 261-credit bug is back")
        check("job id captured", r.job_id == JOB, str(r.job_id))
        check("pending sidecar cleaned on landing",
              not os.path.exists(hf_client.pending_path(t, JOB)), "sidecar left behind")

    # 3 — a job that never lands stays PENDING and leaves its sidecar for --resume
    with tempfile.TemporaryDirectory() as t:
        c = {"fires": 0}

        def script(cmd):
            if cmd[:3] == ["higgsfield", "generate", "create"]:
                return "", f"timed out waiting for job {JOB}", 1
            return "", "still rendering", 0
        r = hf_client.fire(req(t), runner=fake(script, c), log=lambda *_: None)
        check("un-landable job reports pending", r.status == "pending", r.status)
        check("pending job fired only once", c["fires"] == 1, f"fired {c['fires']}x")
        check("sidecar left for resume", os.path.exists(hf_client.pending_path(t, JOB)))
        # and resume adopts it without firing
        c2 = {"fires": 0}
        rs = hf_client.resume(t, runner=fake(lambda cmd: (URL, "", 0), c2), log=lambda *_: None)
        check("resume lands the adopted job", rs and rs[0].ok, "resume failed")
        check("🔴 resume fires NOTHING", c2["fires"] == 0, f"fired {c2['fires']}x")

    # 4 — true no-submit (no url, no job) is the ONLY retryable case
    with tempfile.TemporaryDirectory() as t:
        c = {"fires": 0}
        r = hf_client.fire(req(t), runner=fake(lambda cmd: ("", "connection reset", 1), c),
                           log=lambda *_: None)
        check("no-submit exhausts", r.status == "exhausted", r.status)
        check("no-submit retried exactly once (1 + 1 retry)", c["fires"] == 2,
              f"fired {c['fires']}x")

    # 5 — billed-but-no-url is detected from the balance delta
    with tempfile.TemporaryDirectory() as t:
        c, bal = {"fires": 0}, {"n": 1000.0}

        def script(cmd):
            if cmd[:3] == ["higgsfield", "account", "status"]:
                return '{"credits": %s}' % bal["n"], "", 0
            if cmd[:3] == ["higgsfield", "generate", "create"]:
                bal["n"] -= 52.0
                return "", "something went wrong", 1
            return "", "", 0
        r = hf_client.fire(req(t, no_submit_retries=0), runner=fake(script, c),
                           log=lambda *_: None)
        check("billed_but_no_url flagged", r.billed_but_no_url, "silent credit loss")
        check("credits_spent measured (fallback, flagged)",
              r.credits_spent == 52.0 and r.credits_source == "balance_delta_fallback",
              f"{r.credits_spent} {r.credits_source}")

    # 6 — refusals happen BEFORE any fire
    with tempfile.TemporaryDirectory() as t:
        c = {"fires": 0}
        runner = fake(lambda cmd: (URL, "", 0), c)
        r = hf_client.fire(req(t, prompt="  "), runner=runner, log=lambda *_: None)
        check("empty prompt refused", r.status == "refused", r.status)
        r = hf_client.fire(req(t, repeated={"image-references": ["/nope/missing.png"]}),
                           runner=runner, log=lambda *_: None)
        check("missing input file refused", r.status == "refused", r.status)
        dest = os.path.join(t, "exists_v01.mp4")
        open(dest, "w").write("old take")
        r = hf_client.fire(req(t, dest=dest), runner=runner, log=lambda *_: None)
        check("overwrite of a prior take refused", r.status == "refused", r.status)
        check("🔴 no refusal ever fired", c["fires"] == 0, f"fired {c['fires']}x")
        check("prior take untouched", open(dest).read() == "old take", "clobbered")

    # 7 — flag spelling passes through verbatim, order preserved
    rq = hf_client.Request(model="m", prompt="p", dest="/tmp/x.mp4",
                           repeated={"image-references": ["a.png", "b.png"]},
                           params={"extension_mode": "forward", "bitrate_mode": "high"},
                           flags=["wait"])
    cmd = hf_client.build_command(rq)
    check("repeatable flag repeats", cmd.count("--image-references") == 2, " ".join(cmd))
    check("underscore spelling preserved", "--extension_mode" in cmd, " ".join(cmd))
    check("dash spelling preserved", "--image-references" in cmd, " ".join(cmd))
    check("bare flag emitted", cmd[-1] == "--wait", " ".join(cmd))
    check("param order preserved",
          cmd.index("--extension_mode") < cmd.index("--bitrate_mode"), " ".join(cmd))

    # 8 — 🔴 balance moved but NO job id came back: a job exists we cannot name. NEVER retry.
    #     (Sam's 2026-09-01 review: the old loop retried here — the 261 bug through a side door.)
    with tempfile.TemporaryDirectory() as t:
        c, bal = {"fires": 0}, {"n": 1000.0}

        def script(cmd):
            if cmd[:3] == ["higgsfield", "account", "status"]:
                return '{"credits": %s}' % bal["n"], "", 0
            if cmd[:3] == ["higgsfield", "generate", "create"]:
                bal["n"] -= 52.0
                return "", "something went wrong", 1
            return "", "", 0
        r = hf_client.fire(req(t), runner=fake(script, c), log=lambda *_: None)   # default retries=1
        check("🔴 billed-but-no-id FIRED ONLY ONCE (no retry after money moved)",
              c["fires"] == 1, f"fired {c['fires']}x")
        check("billed-but-no-id reports exhausted + flagged",
              r.status == "exhausted" and r.billed_but_no_url, f"{r.status} {r.billed_but_no_url}")

    # 9 — 🔴 resume must not land onto a file that now exists
    with tempfile.TemporaryDirectory() as t:
        dest = os.path.join(t, "o_v01.mp4")
        import json
        json.dump({"job": JOB, "dest": dest}, open(hf_client.pending_path(t, JOB), "w"))
        open(dest, "w").write("old take")
        c = {"fires": 0}
        rs = hf_client.resume(t, runner=fake(lambda cmd: (URL, "", 0), c), log=lambda *_: None)
        check("🔴 resume refuses an existing dest", rs and rs[0].status == "refused", str(rs and rs[0].status))
        check("resume left the prior take untouched", open(dest).read() == "old take", "clobbered")
        check("resume left the sidecar for a re-targeted resume",
              os.path.exists(hf_client.pending_path(t, JOB)), "sidecar removed")
        check("resume fired nothing while refusing", c["fires"] == 0, f"fired {c['fires']}x")
        rs = hf_client.resume(t, dest=os.path.join(t, "o_v02.mp4"),
                              runner=fake(lambda cmd: (URL, "", 0), c), log=lambda *_: None)
        check("resume lands under the next vN", rs and rs[0].ok and rs[0].dest.endswith("o_v02.mp4"),
              str(rs and rs[0].detail))

    # 10 — a timeout that polls to a landing is NOT a credit loss
    with tempfile.TemporaryDirectory() as t:
        bal = {"n": 1000.0}

        def script(cmd):
            if cmd[:3] == ["higgsfield", "account", "status"]:
                return '{"credits": %s}' % bal["n"], "", 0
            if cmd[:3] == ["higgsfield", "generate", "create"]:
                bal["n"] -= 52.0
                return "", f"timed out waiting for job {JOB}", 1
            if cmd[:3] == ["higgsfield", "generate", "wait"]:
                return URL, "", 0
            return "", "", 0
        r = hf_client.fire(req(t), runner=fake(script, {"fires": 0}), log=lambda *_: None)
        check("poll-landed clip is not flagged billed_but_no_url",
              r.ok and not r.billed_but_no_url, f"ok={r.ok} flag={r.billed_but_no_url}")
        check("poll-landed clip measured its spend", r.credits_spent == 52.0, str(r.credits_spent))

    # 11 — a UUID in an error message is not a job: stop after ONE poll, no sidecar, no re-fire
    #      (real CLI wording, verified 2026-09-01: `Error: Job not found`, exit code 0)
    with tempfile.TemporaryDirectory() as t:
        c, polls = {"fires": 0}, {"n": 0}
        WS = "e7479d4c-0d59-4be5-9057-abce9fe30f39"

        def script(cmd):
            if cmd[:3] == ["higgsfield", "generate", "create"]:
                return "", f"workspace_selection_required {WS}", 1
            if cmd[:3] == ["higgsfield", "generate", "wait"]:
                polls["n"] += 1
                return "Error: Job not found", "", 0
            return "", "", 0
        r = hf_client.fire(req(t), runner=fake(script, c), log=lambda *_: None)
        check("bogus job id stops after one poll", polls["n"] == 1, f"polled {polls['n']}x")
        check("bogus job id never re-fires", c["fires"] == 1, f"fired {c['fires']}x")
        check("bogus job id leaves no sidecar", not os.path.exists(hf_client.pending_path(t, WS)))
        check("bogus job id reports exhausted", r.status == "exhausted", r.status)

    # 12 — an HTTP error on download is a failure, not a landed file
    with tempfile.TemporaryDirectory() as t:
        c = {"fires": 0, "curl_rc": 22}
        r = hf_client.fire(req(t), runner=fake(lambda cmd: (URL, "", 0), c), log=lambda *_: None)
        check("download HTTP error reports exhausted", r.status == "exhausted", r.status)
        check("download HTTP error leaves no dest file",
              not os.path.exists(os.path.join(t, "o_v01.mp4")), "error page saved as media")

    # 13 — 🔴 credits_spent is the `generate cost` charge, NOT the workspace balance delta
    #      (2026-09-02: another editor's 1130-cr gen billing in the fire window must not land
    #      in this fire's number — the delta measured ~3x over on the shared workspace)
    with tempfile.TemporaryDirectory() as t:
        bal, seen = {"n": 5000.0}, {"cost_cmd": None}

        def script(cmd):
            if cmd[:3] == ["higgsfield", "account", "status"]:
                return '{"credits": %s}' % bal["n"], "", 0
            if cmd[:3] == ["higgsfield", "generate", "cost"]:
                seen["cost_cmd"] = cmd
                return '{\n  "credits": 156\n}\n', "", 0
            if cmd[:3] == ["higgsfield", "generate", "create"]:
                bal["n"] -= 156.0 + 1130.0        # my clip + someone else's gen
                return URL, "", 0
            return "", "", 0
        r = hf_client.fire(req(t, params={"duration": "24", "resolution": "720p",
                                          "aspect_ratio": "9:16", "bitrate_mode": "high"}),
                           runner=fake(script, {"fires": 0}), log=lambda *_: None)
        check("🔴 credits_spent == generate-cost charge (156), not the polluted delta",
              r.credits_spent == 156.0, str(r.credits_spent))
        check("credits_source == generate_cost", r.credits_source == "generate_cost",
              str(r.credits_source))
        check("balance_delta kept for audit (1286.0)", r.balance_delta == 1286.0,
              str(r.balance_delta))
        cc = seen["cost_cmd"] or []
        check("cost quote sent --prompt (CLI requires it) and --json",
              "--prompt" in cc and "--json" in cc, " ".join(cc))
        check("cost quote sent only price-keyed params (no bitrate_mode)",
              "--duration" in cc and "--resolution" in cc and "--aspect_ratio" in cc
              and "--bitrate_mode" not in cc, " ".join(cc))
        check("cost_quote_cr is 156.0", r.cost_quote_cr == 156.0, str(r.cost_quote_cr))

    # 14 — no quote readable → delta is the FLAGGED fallback, never silent
    with tempfile.TemporaryDirectory() as t:
        bal = {"n": 1000.0}

        def script(cmd):
            if cmd[:3] == ["higgsfield", "account", "status"]:
                return '{"credits": %s}' % bal["n"], "", 0
            if cmd[:3] == ["higgsfield", "generate", "cost"]:
                return "", "Error: Missing required params: prompt", 1
            if cmd[:3] == ["higgsfield", "generate", "create"]:
                bal["n"] -= 52.0
                return URL, "", 0
            return "", "", 0
        r = hf_client.fire(req(t), runner=fake(script, {"fires": 0}), log=lambda *_: None)
        check("no quote → credits_spent falls back to the delta", r.credits_spent == 52.0,
              str(r.credits_spent))
        check("no quote → credits_source flags the fallback",
              r.credits_source == "balance_delta_fallback", str(r.credits_source))

    # 15 — a resumed landing records the sidecar's quote as its spend (no delta exists)
    with tempfile.TemporaryDirectory() as t:
        import json
        json.dump({"job": JOB, "dest": os.path.join(t, "r_v01.mp4"), "cost_quote_cr": 156},
                  open(hf_client.pending_path(t, JOB), "w"))
        rs = hf_client.resume(t, runner=fake(lambda cmd: (URL, "", 0), {"fires": 0}),
                              log=lambda *_: None)
        check("resume records sidecar quote as credits_spent",
              rs and rs[0].ok and rs[0].credits_spent == 156.0 and rs[0].credits_source == "generate_cost",
              str(rs and (rs[0].credits_spent, rs[0].credits_source)))

    # 16 — a true no-submit charges nothing
    with tempfile.TemporaryDirectory() as t:
        r = hf_client.fire(req(t, no_submit_retries=0),
                           runner=fake(lambda cmd: ("", "something went wrong", 1), {"fires": 0}),
                           log=lambda *_: None)
        check("no-submit → credits_spent 0.0 / not_submitted",
              r.credits_spent == 0.0 and r.credits_source == "not_submitted",
              str((r.credits_spent, r.credits_source)))


run()
print(f"\n{len(PASS)} passed, {len(FAIL)} failed")
if FAIL:
    print("FAILED: " + ", ".join(FAIL))
sys.exit(1 if FAIL else 0)
