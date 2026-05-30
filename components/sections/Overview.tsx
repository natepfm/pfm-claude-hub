import { skills } from "@/content/skills";

export default function Overview() {
  return (
    <section id="overview" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">How to use</div>
        <h2 className="text-3xl font-bold">The PFM Claude system</h2>
        <p className="text-muted mt-2 max-w-3xl">
          A purpose-built pipeline that turns a Notion request into delivered Veo clips and Nano Banana b-roll, with PFM&apos;s locked conventions applied at every step. Start with <strong className="text-text">what to say</strong> for each task; the deeper <span className="italic">how it works</span> sits right below.
        </p>
      </div>

      {/* Panel 0: How to use — task → trigger quick reference */}
      <div className="my-10">
        <h3 className="text-xl font-bold mb-2">Start here — what to say for each job</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          You almost never name a skill. Drop a Notion request link <span className="italic">or</span> just say what you want in plain English — Claude recognizes the task and loads the right skill on its own. Here&apos;s the menu.
        </p>

        {/* Prerequisites callout */}
        <div className="mb-6 p-4 bg-accentMuted border-l-4 border-accent rounded-r text-sm text-text">
          <div className="font-semibold mb-1">Two things to get right first</div>
          <div className="text-muted">
            <span className="text-text font-medium">1. Be in the project folder</span> — open the terminal inside the Lucid Link project folder so Claude can find <code>Elements/</code>. <span className="text-text font-medium">2. Be signed in to Higgsfield</span> — the CLI needs auth to fire anything. Both are checked automatically; if either&apos;s off, Claude stops and tells you before any spend.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            { icon: "🎬", goal: "Generate Veo videos", say: 'Drop the Notion request link (while in the project folder) — or "run the HVG flow" / "fire the gens"', skill: "hvg-flow" },
            { icon: "🖼️", goal: "Generate b-roll images", say: '"fire the b-roll" / "run HIG" — or just describe the shots you need', skill: "hig-flow" },
            { icon: "✍️", goal: "Write or rebalance a Veo script", say: 'Paste a script + "make this Veo-ready" — or "write a Veo script for [concept]"', skill: "veo-script-writing" },
            { icon: "🎙️", goal: "Long-copy ad → podcast script", say: 'Paste the Facebook long-copy + "convert this to a podcast script" / "LC to video"', skill: "lc-to-video-podcast" },
            { icon: "🧱", goal: "Beat out a story", say: '"beat this out" / "write story beats from [reference]"', skill: "story-beats" },
            { icon: "📺", goal: "Wrap it as breaking news", say: '"make this a breaking news segment" / "LATU news version"', skill: "breaking-news-story-ads" },
            { icon: "✅", goal: "QC a finished batch", say: '"run audio QC" / "run visual QC" / "check the clips" — also auto-offered right after a batch downloads', skill: "audio-qc + visual-qc" },
            { icon: "🔁", goal: "One-off image or quick variation", say: '"another one of [character] but [variation]" / "make me a few variations"', skill: "higgsfield-image-generation" },
          ].map((t) => (
            <div key={t.goal} className="border border-border rounded-lg p-4 bg-surface/50 hover:border-accent transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{t.icon}</span>
                <span className="font-semibold text-text">{t.goal}</span>
              </div>
              <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-1">You say</div>
              <div className="text-sm text-muted leading-relaxed">{t.say}</div>
              <div className="mt-2 text-xs font-mono text-muted">↳ {t.skill}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-sm text-muted max-w-3xl">
          Once you trigger a gen flow, Claude runs every setup step silently and stops only at a <strong className="text-text">preflight</strong> — one block showing the model, clip/image count, and exact credit cost. Nothing fires until you type <code>fire</code>. (Full step-by-step under &ldquo;How the flow runs&rdquo; below.)
        </div>
      </div>

      {/* Divider into the architecture deep-dive */}
      <div className="mt-16 mb-8 border-t border-border pt-8">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Under the hood</div>
        <h3 className="text-2xl font-bold">How the system actually works</h3>
        <p className="text-muted text-sm mt-2 max-w-3xl">
          The deeper picture — how Claude learns PFM&apos;s conventions, the two ways it talks to Higgsfield, what happens on a Notion drop, the run itself, and the team folder behind it all.
        </p>
      </div>

      {/* Panel 1: Context layers — how Claude knows PFM */}
      <div className="my-10">
        <h3 className="text-xl font-bold mb-2">1. How Claude is trained up on PFM</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Claude doesn't "know" PFM out of the box. Knowledge is layered in four levels, from general team patterns to per-project specifics. Each layer narrows what the model considers correct.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-16 shrink-0 text-3xl text-center">🧠</div>
            <div className="flex-1 border border-border rounded-lg p-4 bg-surface/50">
              <div className="font-semibold">Memory <span className="text-xs font-mono text-muted ml-2">~30 entries</span></div>
              <div className="text-sm text-muted">Hard-won lessons from real production: brand-clean negatives by vertical, no [STATE LINE] tags, 6-8s line discipline, character master format, Veo audio quirks, etc. Always loaded, persists across sessions.</div>
            </div>
          </div>
          <div className="text-2xl text-accent text-center">▼</div>
          <div className="flex items-center gap-4">
            <div className="w-16 shrink-0 text-3xl text-center">🎯</div>
            <div className="flex-1 border border-border rounded-lg p-4 bg-surface/50">
              <div className="font-semibold">Skills <span className="text-xs font-mono text-muted ml-2">{skills.length} SKILL.md files</span></div>
              <div className="text-sm text-muted">Structured workflows. <code>hvg-flow</code> + <code>hig-flow</code> for production pipelines; <code>veo-script-writing</code>, <code>lc-to-video-podcast</code>, <code>story-beats</code>, <code>breaking-news-story-ads</code>, <code>nano-banana-prompting</code> for writing/prompting. Loads on trigger phrase or context match.</div>
            </div>
          </div>
          <div className="text-2xl text-accent text-center">▼</div>
          <div className="flex items-center gap-4">
            <div className="w-16 shrink-0 text-3xl text-center">📚</div>
            <div className="flex-1 border border-border rounded-lg p-4 bg-surface/50">
              <div className="font-semibold">PFM Context <span className="text-xs font-mono text-muted ml-2">vertical briefs + canonical assets</span></div>
              <div className="text-sm text-muted">Auto / Home Insurance / Concealed Carry vertical context. Brand voice rules, offer types, MB attribution patterns, character masters. Pulled when relevant to the request.</div>
            </div>
          </div>
          <div className="text-2xl text-accent text-center">▼</div>
          <div className="flex items-center gap-4">
            <div className="w-16 shrink-0 text-3xl text-center">📎</div>
            <div className="flex-1 border-2 border-accent rounded-lg p-4 bg-accentMuted">
              <div className="font-semibold">Notion request <span className="text-xs font-mono text-muted ml-2">per-project brief</span></div>
              <div className="text-sm text-muted">The actual spec for this specific run: copy lines, references, state variations, vertical, MB. Trumps everything above when there's a conflict, since it's project-specific.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel 2: MCP vs CLI */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">2. MCP vs CLI — two ways Claude talks to Higgsfield</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Higgsfield exposes itself two ways. The choice matters for speed, cost, and feature access.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* MCP card */}
          <div className="border border-border rounded-lg p-5 bg-surface/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">📡</div>
              <div>
                <div className="text-lg font-bold">MCP</div>
                <div className="text-xs font-mono text-muted">Model Context Protocol</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2"><span className="text-accent">→</span><span className="text-muted">Read-only inspection of workspace state</span></div>
              <div className="flex gap-2"><span className="text-accent">→</span><span className="text-muted">Balance, transactions, models_explore lookups</span></div>
              <div className="flex gap-2"><span className="text-accent">→</span><span className="text-muted">Built-in via Claude Desktop connectors</span></div>
              <div className="flex gap-2"><span className="text-accent">→</span><span className="text-muted"><strong className="text-text">FORBIDDEN for firing</strong> — MCP filters break Veo (audio, frame-to-video) and the CLI is ~10× faster</span></div>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-1">Best for</div>
              <div className="text-sm text-muted">Inspection only — checking credit balance, pulling cost transaction history, discovering model parameters. <strong className="text-text">MCP firing is FORBIDDEN</strong> — every image and video gen goes through the CLI.</div>
            </div>
          </div>

          {/* CLI card */}
          <div className="border-2 border-accent rounded-lg p-5 bg-accentMuted">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">⚡</div>
              <div>
                <div className="text-lg font-bold">CLI</div>
                <div className="text-xs font-mono text-muted">Higgsfield command line</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2"><span className="text-accent">→</span><span className="text-muted">Batch firing in parallel waves</span></div>
              <div className="flex gap-2"><span className="text-accent">→</span><span className="text-muted">60-80 Veo clips in one run</span></div>
              <div className="flex gap-2"><span className="text-accent">→</span><span className="text-muted">Full Veo 3.1 surface — audio, frame-to-video, all models</span></div>
              <div className="flex gap-2"><span className="text-accent">→</span><span className="text-muted">Direct billing — no Claude-token enhancement charges on bare gens</span></div>
            </div>
            <div className="mt-4 pt-3 border-t border-accent/50">
              <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-1">Best for ← what PFM uses</div>
              <div className="text-sm text-muted">The full production pipeline. <code>hvg-flow</code> + <code>hig-flow</code> both fire through the CLI. Faster, cheaper, more capable for batches.</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-muted italic">
          Canonical rule lives in memory at <code>feedback_higgsfield_workflow.md</code>. CLI for every fire; MCP firing FORBIDDEN; MCP use is read-only inspection only (balance, transactions, workspace).
        </div>
      </div>

      {/* Panel 3: Notion drop flow */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">3. What happens when an editor drops a Notion link or project folder</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Auto-detection triggers the HVG protocol immediately. The editor doesn't need to invoke the skill explicitly — Claude recognizes the inputs and enters Gate 1 on its own.
        </p>

        <div className="border border-border rounded-lg p-6 bg-surface/30">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Inputs */}
            <div>
              <div className="text-xs uppercase tracking-widest text-accent mb-3 font-semibold">Editor input</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-surface2 border border-border rounded">
                  <span className="text-lg">🔗</span>
                  <span className="text-sm font-mono text-text">notion.so/...</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-surface2 border border-border rounded">
                  <span className="text-lg">📁</span>
                  <span className="text-sm font-mono text-text">/Volumes/ads/.../...</span>
                </div>
                <div className="text-xs text-muted mt-2 italic">Either one, or both together</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center text-4xl text-accent">▶</div>
            <div className="md:hidden text-center text-2xl text-accent">▼</div>

            {/* Output */}
            <div>
              <div className="text-xs uppercase tracking-widest text-accent mb-3 font-semibold">Claude's response</div>
              <div className="space-y-2 text-sm text-muted">
                <div className="flex gap-2"><span className="text-accent">1.</span>Recognizes the trigger</div>
                <div className="flex gap-2"><span className="text-accent">2.</span>Loads <code>hvg-flow</code> skill</div>
                <div className="flex gap-2"><span className="text-accent">3.</span>Enters Gate 1 immediately</div>
                <div className="flex gap-2"><span className="text-accent">4.</span>Runs setup silently, stops at up to 2 confirmations</div>
              </div>
              <div className="text-xs text-muted mt-3 italic">Most steps run silently — 2 confirmation stops max (reference assignment + preflight).</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted">
          Claude also auto-detects the request <strong className="text-text">shape</strong> from the Notion brief: <strong className="text-text">Format A</strong> (story-ad / podcast — callout-based), <strong className="text-text">Format B</strong> (VSL — page-heading-based with per-line slide directives), or <strong className="text-text">Format C</strong> (live-action / monologue-style brief that needs balancing into Veo clips). Each shape changes how Gates 3-6 behave.
        </div>
      </div>

      {/* Panel 4: How the flow runs */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">4. How the flow runs — silent setup, up to 2 confirmation stops</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Most steps run silently. Claude pauses for the editor at only two points — reference assignment (when it's ambiguous) and a consolidated preflight right before firing. Hard-stops (wrong folder, missing CLI, low credits) interrupt regardless. This keeps the credit-burning safety checks without nine round-trips. <span className="italic">(Updated 2026-05-27 — the 6 friction gates went silent.)</span>
        </p>

        <div className="space-y-2">
          {[
            { num: 1, title: "Session start", what: "[Silent] Capture the Notion URL from the message or session context." },
            { num: 2, title: "Context check", what: "[Silent · hard-stop on fail] Verify cwd is inside Lucid Link, Higgsfield CLI is authenticated, project structure exists. One-line readback, then keep going." },
            { num: 3, title: "Notion request review", what: "[Silent] Fetch the brief via Notion MCP, detect request shape (Format A/B/C) + state variations. Parsed summary rolls into the preflight." },
            { num: 4, title: "Reference assignment", what: "[STOP if ambiguous] Scan Elements/Footage/Reference/, auto-suggest the mode + per-line assignment. Unambiguous → rolls into preflight. Ambiguous (multiple modes, missing refs, rotation strategy) → pause for the editor's pick." },
            { num: 5, title: "Model lock", what: "[Silent] Default Veo 3.1 Lite, count=1. Only asks for a non-default model/count. Always shown in the preflight." },
            { num: 6, title: "Master prompt", what: "[Silent] Draft the master prompt. A representative per-line prompt shows in the preflight for spot-check." },
            { num: 7, title: "Optional L1 test", what: "[Silent] Skipped by default. Only fires if the editor asks or the prompt is novel / high-risk." },
            { num: 8, title: "Excel manifest write", what: "[Silent] Build the per-project styled Excel (Summary + Prompts sheets, color-coded status). Lives in the project folder." },
            { num: 9, title: "Consolidated preflight → FIRE", what: "[STOP] One block: brief summary, reference plan, model + count, clip count, cost, output folder, representative prompt. Editor types 'fire' — last stop before spend." },
          ].map((g) => (
            <div key={g.num} className="flex gap-4 items-start border border-border rounded-lg p-4 bg-surface/50 hover:border-accent transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-full bg-accent text-bg font-bold text-lg flex items-center justify-center">
                {g.num}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-text">{g.title}</div>
                <div className="text-sm text-muted leading-relaxed mt-0.5">{g.what}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-accentMuted border-l-4 border-accent rounded-r text-sm text-text">
          After the preflight, Claude fires the batch in parallel waves under the rate limit, downloads MP4s into <code>Elements/Footage/Veo/</code> with deterministic filenames, and updates the Excel manifest with status as jobs complete.
        </div>
      </div>

      {/* Panel 5: What's in 6. Claude PFM */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">5. The team folder — <code>6. Claude PFM/</code> on Lucid Link</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          One folder, source of truth for the whole team. Every editor's Mac syncs from here. When something changes, one push updates everyone.
        </p>

        <div className="border border-border rounded-lg p-5 bg-surface/30">
          <pre className="text-xs font-mono text-muted overflow-x-auto">
{`6. Claude PFM/
├── skills/                              ← ${skills.length} PFM skills, deployed to every editor
│   ├── hvg-flow/                          The video pipeline (silent setup + 2 stops, parallel waves)
│   ├── hig-flow/                          The image pipeline (b-roll generation)
│   ├── veo-script-writing/                Veo rule enforcement on scripts
│   ├── lc-to-video-podcast/               Long-copy → podcast monologue transform
│   ├── story-beats/                       PFM 6-beat story-ad skeleton
│   ├── breaking-news-story-ads/           LATU news-wrapper framing
│   ├── nano-banana-prompting/             NB Pro prompt patterns
│   ├── higgsfield-image-generation/       CLI-driven one-off image fires (no Notion needed)
│   ├── audio-qc/                          Post-download audio QC — ffmpeg + Whisper + music detect
│   ├── visual-qc/                         Post-download visual QC — 5-frame filmstrips
│   └── suno-songwriter/                   Ad script → Suno v5 song (lyrics + style)
├── context/                             ← Brand briefs per vertical (auto, home, CC)
├── settings.json                        ← Claude permission allowlist (46 entries)
├── CLAUDE.md                            ← Team brief, auto-loaded by Claude Code
├── claude-pfm-setup.sh                  ← One-shot Mac installer
├── claude-pfm-setup-windows.sh          ← One-shot Windows installer
├── claude-pfm-account-switch.sh         ← Higgsfield CLI auth helper
├── claude-pfm-update.sh                 ← Pull latest skills from this folder
└── pfm-writing-skills.plugin            ← Cowork plugin (6 writing skills bundled)`}
          </pre>
        </div>

        <div className="mt-4 text-sm text-muted">
          When Sam ships a skill update, the new version lands here. Editors run <code>claude-pfm-update.sh</code> (or click the Update button at the top of this hub) and their local Claude picks it up on next session start.
        </div>
      </div>
    </section>
  );
}
