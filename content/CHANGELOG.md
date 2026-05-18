# Changelog

Recent changes to PFM Claude skills, scripts, and tooling. Newest first.

When something here changes that affects what editors run on their machines, run the **Update my skills** command from the [Home page](/) to sync.

---

## 2026-05-18

### veo-script-writing — Gate 0, [STATE LINE] strip, no 3-4s beats
Three hardenings landed today after an editor's LC-to-Video output shipped with `[STATE LINE]` trailing annotations and choppy 3-4s "punchy beats":

- **Gate 0 — LC handoff.** When `/veo-script-writing` is invoked on a Notion request titled "LC to Video —" or on a multi-paragraph long-copy Facebook ad, the skill now surfaces a handoff proposal to `lc-to-video-podcast` and waits for explicit editor confirmation before rebalancing.
- **Strip `[STATE LINE]` trailing tags.** Real bracketed placeholders inside a line (`[STATE]`, `[ROAD]`, `[STATE_RATE_YEAR]`) stay; trailing meta-annotations come out. Scan-and-strip pass runs before delivery.
- **No 3-4s "punchy" beats.** Lines like `"Impact. Bumper gone."` are always merge candidates. Every Veo clip lands in the 15-24 word window, leans long. Closing line is the only short-line exception (12-15 words).

### lc-to-video-podcast — same hardenings
Mirror updates to the floor-15 + no-3-4s-beats rule. Word floor moved from 12 → 15 to enforce 6-8s leaning long.

---

## 2026-05-14

### Higgsfield enterprise migration → PowerFox workspace
Editors moved off the shared `powerfoxlogin@gmail.com` Higgsfield account onto a **PowerFox enterprise workspace** with 1.1M+ shared credits. NB Pro images now bill **0 credits** via the Unlimited entitlement on this workspace (must be explicitly selected — workspace UUID `e7479d4c-0d59-4be5-9057-abce9fe30f39`).

- New script: `claude-pfm-account-switch.sh` — handles logout, login with personal email, workspace set, and verification in one shot.
- Higgsfield MCP in Claude Desktop has separate auth — must be reconnected per-editor (Settings → Connectors → Higgsfield → Disconnect/Reconnect).

---

## 2026-05-13

### hvg-flow — permission prompt refactor + AskUserQuestion killed
- `hvg-flow` Gate 8 heredoc Python and Step 10 parallel mp4 download refactored into checked-in helper (`download_parallel.sh`). Allowlisted as `Bash(bash *hvg-flow/download_parallel.sh *)` — no more "Allow once" prompts mid-run.
- Both `hvg-flow` and `hig-flow` now explicitly tell Claude to NEVER use the `AskUserQuestion` tool for gate confirmations. Multi-choice questions render as plain markdown chat instead.
- Gate 4 (reference mode + assignment) rewritten — asks reference image AND reference mode together, always shows all 5 modes (A-E) with plain-English "when to use" descriptions.

### Editor onboarding scripts
Three Lucid Link scripts shipped:
- `claude-pfm-setup.sh` — one-shot Mac installer (Homebrew → Node → Git → Higgsfield CLI → skills + settings).
- `claude-pfm-setup-windows.sh` — Windows post-prereqs installer (after manual Git/Node/Python installs).
- `claude-pfm-update.sh` — pull latest skills + settings from Lucid Link.

---

## 2026-05-12

### veo-script-writing — no em/en dashes, no ALL CAPS in lines
Strip every em/en dash and ALL CAPS word from balanced Veo lines even when the brief contains them. `[BRACKETED_TOKEN]` placeholders keep their caps as the exception. Scan-and-strip pass runs before delivery.
