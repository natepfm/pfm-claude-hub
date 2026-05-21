export default function Overview() {
  return (
    <section id="overview" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">How it works</div>
        <h2 className="text-3xl font-bold">The PFM Claude system</h2>
        <p className="text-muted mt-2 max-w-3xl">
          A purpose-built pipeline that turns a Notion request into delivered Veo clips and Nano Banana b-roll, with PFM's locked conventions applied at every step. Four layers of context, one team folder, two execution paths.
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
              <div className="font-semibold">Skills <span className="text-xs font-mono text-muted ml-2">10 SKILL.md files</span></div>
              <div className="text-sm text-muted">Structured workflows. <code>hvg-flow</code> + <code>hig-flow</code> for production pipelines; <code>veo-script-writing</code>, <code>lc-to-video-podcast</code>, <code>story-beats</code>, <code>breaking-news-story-ads</code>, <code>nano-banana-prompting</code>, <code>iphone-cameraroll-prompting</code> for writing/prompting. Loads on trigger phrase or context match.</div>
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
              <div className="flex gap-2"><span className="text-accent">→</span><span className="text-muted">Filters break Veo (audio, frame-to-video) — not usable for firing</span></div>
            </div>
            <div className="mt-4 pt-3 border-t border-border">
              <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-1">Best for</div>
              <div className="text-sm text-muted">Inspection only — checking credit balance, pulling cost transaction history, discovering model parameters. <strong className="text-text">Not used for firing any image or video gen</strong> — that&apos;s all CLI.</div>
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
          PFM fires every image and video gen through the CLI — no exceptions. MCP is for read-only inspection (balance, transactions, workspace) only.
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
                <div className="flex gap-2"><span className="text-accent">4.</span>Walks all 9 gates in order</div>
              </div>
              <div className="text-xs text-muted mt-3 italic">No freelancing between gates — every confirmation is explicit.</div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted">
          Claude also auto-detects the request <strong className="text-text">shape</strong> from the Notion brief: <strong className="text-text">Format A</strong> (story-ad / podcast — callout-based), <strong className="text-text">Format B</strong> (VSL — page-heading-based with per-line slide directives), or <strong className="text-text">Format C</strong> (live-action / monologue-style brief that needs balancing into Veo clips). Each shape changes how Gates 3-6 behave.
        </div>
      </div>

      {/* Panel 4: The 9 gates */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">4. The 9 gates Claude walks with every editor</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Each gate is a confirmation checkpoint. Claude doesn't move forward until the editor confirms. This catches misconfigurations before they burn credits.
        </p>

        <div className="space-y-2">
          {[
            { num: 1, title: "Session start", what: "Capture the Notion URL and confirm the editor opened Claude Code in the right project folder." },
            { num: 2, title: "Context check", what: "Verify cwd is inside Lucid Link, Higgsfield CLI is authenticated, project folder structure exists. Hard-stop on any failure." },
            { num: 3, title: "Notion request review", what: "Fetch the brief via Notion MCP. Detect request shape (Format A/B/C). Surface clip count, state variations, MB attribution." },
            { num: 4, title: "Reference scan + mode", what: "Scan Elements/Footage/Reference/. Ask the editor which reference image(s) and which of 5 reference modes (single shared, per-line, rotating pool, start+end frames, mixed)." },
            { num: 5, title: "Model lock", what: "Confirm Veo 3.1 Fast (default), Quality, or Lite. Show per-clip cost." },
            { num: 6, title: "Master prompt", what: "Ask for the master prompt for this project. Validate it. Show 1-2 sample per-line prompts for spot-check." },
            { num: 7, title: "Optional L1 test fire", what: "Fire just line 1 first (count=2, ~44 cr) as a quality check before committing the full batch. Editor can skip." },
            { num: 8, title: "Excel manifest write", what: "Build a per-project styled Excel — Summary + Prompts sheets with locked PFM colors, color-coded status, fixed-row layout. Lives in the project folder." },
            { num: 9, title: "Final preflight → FIRE", what: "Show total clips, total cost, parallel wave size, estimated time. Editor types 'fire' to launch — last chance to cancel." },
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
          After Gate 9, Claude fires the batch in parallel waves under the rate limit, downloads MP4s into <code>Elements/Footage/Veo/</code> with deterministic filenames, and updates the Excel manifest with status as jobs complete.
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
├── skills/                              ← 10 PFM skills, deployed to every editor
│   ├── hvg-flow/                          The video pipeline (9 gates, parallel waves)
│   ├── hig-flow/                          The image pipeline (b-roll generation)
│   ├── veo-script-writing/                Veo rule enforcement on scripts
│   ├── lc-to-video-podcast/               Long-copy → podcast monologue transform
│   ├── story-beats/                       PFM 6-beat story-ad skeleton
│   ├── breaking-news-story-ads/           LATU news-wrapper framing
│   ├── nano-banana-prompting/             NB Pro prompt patterns
│   ├── iphone-cameraroll-prompting/       Real-phone-snap b-roll aesthetic
│   ├── higgsfield-image-generation/       CLI-driven one-off image driver
│   └── higgsfield-veo-batch/              Legacy HVG.1 manifest runner
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
