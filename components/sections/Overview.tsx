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
            <span className="text-text font-medium">1. Point Claude at the project folder</span> — open the terminal inside the Lucid Link project folder, <span className="italic">or</span> drop a <span className="text-text font-medium">LinkYourFile link</span> to the folder (Claude reads the path straight from the link). Either way it finds <code>Elements/</code>. <span className="text-text font-medium">2. Be signed in to Higgsfield</span> — the CLI needs auth to fire anything. Both are checked automatically; if either&apos;s off, Claude stops and tells you before any spend.
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

        <div className="border border-border rounded-lg bg-bg p-5 max-w-xl">
          <svg
            viewBox="0 0 400 300"
            className="w-full h-auto block"
            role="img"
            aria-label="Four knowledge layers, broad at the top down to project-specific at the bottom: Memory, Skills, PFM Context, and the Notion request — which overrides the others on any conflict."
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <defs>
              <marker id="ovStack" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" />
              </marker>
            </defs>
            <line x1={24} y1={30} x2={24} y2={258} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#ovStack)" />
            <text x={24} y={20} fill="#a1a1a1" fontSize={8.5} textAnchor="middle">broad</text>
            {[
              { name: "Memory", tag: "~30 entries", desc: "Hard-won production lessons, always loaded" },
              { name: "Skills", tag: `${skills.length} skills`, desc: "Gen flows + writing / prompting workflows" },
              { name: "PFM Context", tag: "vertical briefs", desc: "Vertical rules, brand voice, masters" },
              { name: "Notion request", tag: "per project", desc: "This run's exact spec — wins on conflict", acc: true },
            ].map((r, i) => {
              const y = 18 + 66 * i;
              return (
                <g key={r.name}>
                  <rect x={46} y={y} width={318} height={56} rx={10} fill={r.acc ? "#3a1f15" : "#141414"} stroke={r.acc ? "#FF6B35" : "#2a2a2a"} strokeWidth={r.acc ? 2 : 1.5} />
                  <text x={62} y={y + 24} fill="#fafafa" fontSize={13} fontWeight={600}>{r.name}</text>
                  <text x={348} y={y + 24} fill={r.acc ? "#FF6B35" : "#a1a1a1"} fontSize={9.5} textAnchor="end" fontFamily="monospace">{r.tag}</text>
                  <text x={62} y={y + 43} fill="#a1a1a1" fontSize={10.5}>{r.desc}</text>
                </g>
              );
            })}
            <text x={24} y={284} fill="#FF6B35" fontSize={8.5} textAnchor="middle">specific</text>
            <text x={205} y={296} fill="#a1a1a1" fontSize={10} textAnchor="middle">each layer narrows what counts as correct · the Notion request wins</text>
          </svg>
        </div>
      </div>

      {/* Panel 2: MCP vs CLI */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">2. MCP vs CLI — two ways Claude talks to Higgsfield</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Higgsfield exposes itself two ways. The choice matters for speed, cost, and feature access.
        </p>

        <div className="border border-border rounded-lg bg-bg p-5 max-w-xl">
          <svg
            viewBox="0 0 460 344"
            className="w-full h-auto block"
            role="img"
            aria-label="Claude talks to Higgsfield two ways. MCP is read-only inspection (balance, transactions, model lookups) and is never used to fire. The CLI fires every image and video gen — batch parallel waves, the full Veo 3.1 surface, direct billing. All generation goes through the CLI."
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <defs>
              <marker id="ovBrA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
              <marker id="ovBrM" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#a1a1a1" /></marker>
            </defs>
            <rect x={185} y={14} width={90} height={40} rx={8} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <text x={230} y={39} fill="#fafafa" fontSize={14} fontWeight="bold" textAnchor="middle">Claude</text>
            <line x1={222} y1={54} x2={120} y2={100} stroke="#a1a1a1" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#ovBrM)" />
            <text x={150} y={78} fill="#a1a1a1" fontSize={10} textAnchor="middle">inspect</text>
            <line x1={238} y1={54} x2={340} y2={100} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#ovBrA)" />
            <text x={312} y={78} fill="#FF6B35" fontSize={10} fontWeight="bold" textAnchor="middle">fire</text>
            <rect x={16} y={104} width={200} height={212} rx={12} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <text x={34} y={132} fill="#fafafa" fontSize={15} fontWeight="bold">MCP</text>
            <text x={34} y={150} fill="#a1a1a1" fontSize={10.5}>read-only inspection</text>
            <line x1={34} y1={162} x2={198} y2={162} stroke="#2a2a2a" strokeWidth={1} />
            <text x={34} y={186} fill="#a1a1a1" fontSize={11}>balance · transactions</text>
            <text x={34} y={206} fill="#a1a1a1" fontSize={11}>models_explore lookups</text>
            <text x={34} y={226} fill="#a1a1a1" fontSize={11}>built-in connectors</text>
            <text x={34} y={292} fill="#fafafa" fontSize={11.5} fontWeight="bold">✗ never used to fire</text>
            <rect x={244} y={104} width={200} height={212} rx={12} fill="#3a1f15" stroke="#FF6B35" strokeWidth={2} />
            <text x={262} y={132} fill="#fafafa" fontSize={15} fontWeight="bold">CLI</text>
            <text x={262} y={150} fill="#FF6B35" fontSize={10.5}>fires every gen</text>
            <line x1={262} y1={162} x2={426} y2={162} stroke="#FF6B35" strokeWidth={1} opacity={0.4} />
            <text x={262} y={186} fill="#cfcfcf" fontSize={11}>batch in parallel waves</text>
            <text x={262} y={206} fill="#cfcfcf" fontSize={11}>60–80 clips per run</text>
            <text x={262} y={226} fill="#cfcfcf" fontSize={11}>full Veo 3.1 surface</text>
            <text x={262} y={246} fill="#cfcfcf" fontSize={11}>direct billing</text>
            <text x={262} y={292} fill="#FF6B35" fontSize={11.5} fontWeight="bold">✓ every image + video gen</text>
            <text x={230} y={334} fill="#a1a1a1" fontSize={10} textAnchor="middle">all generation fires through the CLI · MCP is read-only, never used to fire</text>
          </svg>
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
          Most gates run silently. Claude only stops for you at the two <span className="text-accent font-semibold">accent gates</span> — reference assignment (when it&apos;s ambiguous) and the preflight right before firing. Hard-stops (wrong folder, missing CLI, low credits) interrupt regardless.
        </p>

        <div className="border border-border rounded-lg bg-bg p-5 max-w-xl">
          <svg
            viewBox="0 0 400 582"
            className="w-full h-auto block"
            role="img"
            aria-label="The gen flow's nine gates run top to bottom. Gates 4 (reference assignment) and 9 (preflight, fire) are editor confirmation stops shown in accent; the rest run silently. After gate 9 it fires in waves, downloads clips, and updates the manifest."
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <defs>
              <marker id="ovGate" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" />
              </marker>
            </defs>
            {[
              { n: 1, title: "Session start", tag: "silent" },
              { n: 2, title: "Context check", tag: "hard-stop" },
              { n: 3, title: "Notion request review", tag: "silent" },
              { n: 4, title: "Reference assignment", tag: "STOP", stop: true },
              { n: 5, title: "Model lock", tag: "silent" },
              { n: 6, title: "Master prompt", tag: "silent" },
              { n: 7, title: "Optional L1 test", tag: "silent" },
              { n: 8, title: "Excel manifest write", tag: "silent" },
              { n: 9, title: "Preflight → FIRE", tag: "STOP", stop: true },
            ].map((g, i) => {
              const y = 14 + 58 * i;
              const cy = y + 21;
              return (
                <g key={g.n}>
                  {i < 8 && (
                    <line x1={200} y1={y + 42} x2={200} y2={y + 58} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#ovGate)" />
                  )}
                  <rect x={30} y={y} width={340} height={42} rx={8} fill={g.stop ? "#3a1f15" : "#141414"} stroke={g.stop ? "#FF6B35" : "#2a2a2a"} strokeWidth={g.stop ? 2 : 1.5} />
                  <rect x={42} y={cy - 13} width={26} height={26} rx={6} fill={g.stop ? "#FF6B35" : "#2a2a2a"} />
                  <text x={55} y={cy + 5} fill={g.stop ? "#0a0a0a" : "#fafafa"} fontSize={13} fontWeight="bold" textAnchor="middle">{g.n}</text>
                  <text x={82} y={cy + 5} fill="#fafafa" fontSize={13} fontWeight={600}>{g.title}</text>
                  <text x={358} y={cy + 4} fill={g.stop ? "#FF6B35" : "#a1a1a1"} fontSize={9.5} textAnchor="end" fontFamily="monospace">{g.tag}</text>
                </g>
              );
            })}
            <line x1={200} y1={520} x2={200} y2={536} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#ovGate)" />
            <rect x={56} y={536} width={288} height={30} rx={15} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <text x={200} y={555} fill="#a1a1a1" fontSize={11} textAnchor="middle" fontFamily="monospace">fires in waves → downloads → manifest</text>
          </svg>
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
