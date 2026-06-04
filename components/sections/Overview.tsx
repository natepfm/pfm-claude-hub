import { skills } from "@/content/skills";

export default function Overview() {
  return (
    <section id="overview" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">How to use</div>
        <h2 className="text-3xl font-bold drop-shadow-text-depth">The PFM Claude system</h2>
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
            <div key={t.goal} className="rounded-lg p-4 bg-surface-gradient shadow-elev1 ring-1 ring-border/50 hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200">
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
        <h3 className="text-2xl font-bold drop-shadow-text-depth">How the system actually works</h3>
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

        <div className="rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 max-w-xl">
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

        <div className="rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 max-w-xl">
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

        <div className="rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 max-w-xl">
          <svg
            viewBox="0 0 480 378"
            className="w-full h-auto block"
            role="img"
            aria-label="A Notion link or project folder — either one or both — triggers Claude to auto-detect the request shape. It forks into Format A (story-ad / podcast, callout-based), Format B (VSL, page-headings to per-line slides), or Format C (live-action / monologue balanced into clips). All three converge into Gate 1, where the flow begins."
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <defs>
              <marker id="p3Fork" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
            </defs>
            <rect x={66} y={14} width={160} height={46} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <text x={146} y={35} fill="#fafafa" fontSize={13} fontWeight={600} textAnchor="middle">Notion link</text>
            <text x={146} y={51} fill="#a1a1a1" fontSize={10} textAnchor="middle" fontFamily="monospace">notion.so/…</text>
            <rect x={254} y={14} width={160} height={46} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <text x={334} y={35} fill="#fafafa" fontSize={13} fontWeight={600} textAnchor="middle">Project folder</text>
            <text x={334} y={51} fill="#a1a1a1" fontSize={10} textAnchor="middle" fontFamily="monospace">/Volumes/ads/…</text>
            <text x={240} y={78} fill="#a1a1a1" fontSize={10} textAnchor="middle">either one, or both</text>
            <line x1={240} y1={82} x2={240} y2={96} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#p3Fork)" />
            <rect x={70} y={98} width={340} height={46} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <text x={240} y={120} fill="#fafafa" fontSize={13} fontWeight={600} textAnchor="middle">Claude auto-detects</text>
            <text x={240} y={136} fill="#a1a1a1" fontSize={10.5} textAnchor="middle">the trigger + the request shape</text>
            <line x1={240} y1={144} x2={90} y2={172} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#p3Fork)" />
            <line x1={240} y1={144} x2={240} y2={172} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#p3Fork)" />
            <line x1={240} y1={144} x2={390} y2={172} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#p3Fork)" />
            <rect x={12} y={176} width={148} height={104} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <rect x={24} y={190} width={22} height={22} rx={6} fill="#FF6B35" />
            <text x={35} y={206} fill="#0a0a0a" fontSize={12} fontWeight="bold" textAnchor="middle">A</text>
            <text x={54} y={206} fill="#fafafa" fontSize={12.5} fontWeight={600}>Format A</text>
            <text x={24} y={238} fill="#cfcfcf" fontSize={10.5}>Story-ad / podcast</text>
            <text x={24} y={262} fill="#a1a1a1" fontSize={10}>callout-based brief</text>
            <rect x={166} y={176} width={148} height={104} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <rect x={178} y={190} width={22} height={22} rx={6} fill="#FF6B35" />
            <text x={189} y={206} fill="#0a0a0a" fontSize={12} fontWeight="bold" textAnchor="middle">B</text>
            <text x={208} y={206} fill="#fafafa" fontSize={12.5} fontWeight={600}>Format B</text>
            <text x={178} y={238} fill="#cfcfcf" fontSize={10.5}>VSL</text>
            <text x={178} y={258} fill="#a1a1a1" fontSize={10}>page-headings →</text>
            <text x={178} y={272} fill="#a1a1a1" fontSize={10}>per-line slides</text>
            <rect x={320} y={176} width={148} height={104} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <rect x={332} y={190} width={22} height={22} rx={6} fill="#FF6B35" />
            <text x={343} y={206} fill="#0a0a0a" fontSize={12} fontWeight="bold" textAnchor="middle">C</text>
            <text x={362} y={206} fill="#fafafa" fontSize={12.5} fontWeight={600}>Format C</text>
            <text x={332} y={238} fill="#cfcfcf" fontSize={10.5}>Live-action /</text>
            <text x={332} y={253} fill="#cfcfcf" fontSize={10.5}>monologue</text>
            <text x={332} y={272} fill="#a1a1a1" fontSize={10}>balanced into clips</text>
            <line x1={86} y1={280} x2={234} y2={304} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#p3Fork)" />
            <line x1={240} y1={280} x2={240} y2={304} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#p3Fork)" />
            <line x1={394} y1={280} x2={246} y2={304} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#p3Fork)" />
            <rect x={120} y={306} width={240} height={40} rx={10} fill="#3a1f15" stroke="#FF6B35" strokeWidth={2} />
            <text x={240} y={331} fill="#fafafa" fontSize={13} fontWeight="bold" textAnchor="middle">Gate 1 — enter the flow</text>
            <text x={240} y={368} fill="#a1a1a1" fontSize={10} textAnchor="middle">one detection, three shapes — each changes how Gates 3–6 behave</text>
          </svg>
        </div>

        <div className="mt-4 text-sm text-muted max-w-3xl">
          The editor never invokes the skill — Claude recognizes the inputs, picks the shape, and enters Gate 1 on its own.
        </div>
      </div>

      {/* Panel 4: How the flow runs */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">4. How the flow runs — silent setup, up to 2 confirmation stops</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Most gates run silently. Claude only stops for you at the two <span className="text-accent font-semibold">accent gates</span> — reference assignment (when it&apos;s ambiguous) and the preflight right before firing. Hard-stops (wrong folder, missing CLI, low credits) interrupt regardless.
        </p>

        <div className="rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 max-w-xl">
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

      {/* Panel 5: QC loop */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">5. Quality control — every clip is checked before it ships</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          The moment a batch finishes downloading, Claude offers to QC it. Audio and visual passes run together, and every clip lands a verdict. Flagged clips refire automatically — capped at two retries — before anything escalates. Only clean clips reach the delivery comment.
        </p>

        <div className="rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 max-w-xl">
          <svg
            viewBox="0 0 470 322"
            className="w-full h-auto block"
            role="img"
            aria-label="After a batch downloads, audio QC and visual QC run together, producing a per-clip verdict of pass, fail, or verify. Passing clips flow to the delivery comment; failed clips loop back to refire (v02), capped at two retries before escalation. Every clip is checked before it ships."
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <defs>
              <marker id="qcA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
              <marker id="qcF" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#c25b50" /></marker>
            </defs>
            <rect x={135} y={14} width={200} height={38} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <text x={235} y={38} fill="#fafafa" fontSize={12.5} fontWeight={600} textAnchor="middle">Batch downloads</text>
            <line x1={235} y1={52} x2={235} y2={72} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#qcA)" />
            <rect x={110} y={74} width={250} height={54} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <text x={235} y={97} fill="#fafafa" fontSize={12.5} fontWeight={600} textAnchor="middle">Audio QC + Visual QC</text>
            <text x={235} y={115} fill="#a1a1a1" fontSize={9} textAnchor="middle">ffmpeg · Whisper · 5-frame filmstrips</text>
            <line x1={235} y1={128} x2={235} y2={150} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#qcA)" />
            <rect x={110} y={152} width={250} height={58} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
            <text x={235} y={172} fill="#fafafa" fontSize={12} fontWeight={600} textAnchor="middle">Per-clip verdict</text>
            <circle cx={152} cy={192} r={5} fill="#5a9e74" />
            <text x={163} y={196} fill="#cfcfcf" fontSize={10}>pass</text>
            <circle cx={214} cy={192} r={5} fill="#c25b50" />
            <text x={225} y={196} fill="#cfcfcf" fontSize={10}>fail</text>
            <circle cx={272} cy={192} r={5} fill="#FF6B35" />
            <text x={283} y={196} fill="#cfcfcf" fontSize={10}>verify</text>
            <line x1={235} y1={210} x2={235} y2={236} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#qcA)" />
            <text x={246} y={227} fill="#5a9e74" fontSize={9}>pass</text>
            <rect x={135} y={238} width={200} height={38} rx={9} fill="#3a1f15" stroke="#FF6B35" strokeWidth={2} />
            <text x={235} y={262} fill="#fafafa" fontSize={12.5} fontWeight={600} textAnchor="middle">Delivery comment</text>
            <path d="M110,181 H46 V101 H110" fill="none" stroke="#c25b50" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#qcF)" />
            <text x={52} y={136} fill="#c25b50" fontSize={9.5}>refire v02</text>
            <text x={52} y={150} fill="#a1a1a1" fontSize={9}>2-retry cap</text>
            <text x={235} y={306} fill="#a1a1a1" fontSize={10} textAnchor="middle">every clip is checked before it ships — flagged ones refire, then escalate</text>
          </svg>
        </div>
      </div>

      {/* Panel 6: Veo cost ladder */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">6. Veo cost per clip — picking the right rung</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Every gen burns Higgsfield credits, and the model tier sets the price. PFM defaults to the cheapest rung — Veo Lite, one clip per prompt — and only climbs to Fast or Preview when a brief actually needs the extra quality.
        </p>

        <div className="rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 max-w-xl">
          <svg
            viewBox="0 0 470 278"
            className="w-full h-auto block"
            role="img"
            aria-label="Veo cost per clip in credits, default fires Lite at count one. Lite silent is 8 credits, Lite audio 12, Fast 27, Preview 58, and Preview Ultra 87. The two Lite rungs are the default; Fast and Preview are reserved for briefs that need the quality."
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <text x={20} y={30} fill="#fafafa" fontSize={13} fontWeight={600}>Veo cost per clip — credits</text>
            <text x={20} y={48} fill="#a1a1a1" fontSize={10}>PFM default fires Lite, count = 1</text>
            <text x={18} y={90} fill="#cfcfcf" fontSize={11}>Lite · silent</text>
            <rect x={150} y={74} width={24} height={24} rx={4} fill="#FF6B35" />
            <text x={182} y={91} fill="#fafafa" fontSize={11} fontWeight={600}>8 cr</text>
            <text x={18} y={128} fill="#cfcfcf" fontSize={11}>Lite · audio</text>
            <rect x={150} y={112} width={36} height={24} rx={4} fill="#FF6B35" />
            <text x={194} y={129} fill="#fafafa" fontSize={11} fontWeight={600}>12 cr</text>
            <text x={18} y={166} fill="#cfcfcf" fontSize={11}>Fast</text>
            <rect x={150} y={150} width={81} height={24} rx={4} fill="#2f2f2f" stroke="#3a3a3a" strokeWidth={1} />
            <text x={239} y={167} fill="#fafafa" fontSize={11} fontWeight={600}>27 cr</text>
            <text x={18} y={204} fill="#cfcfcf" fontSize={11}>Preview</text>
            <rect x={150} y={188} width={173} height={24} rx={4} fill="#2f2f2f" stroke="#3a3a3a" strokeWidth={1} />
            <text x={331} y={205} fill="#fafafa" fontSize={11} fontWeight={600}>58 cr</text>
            <text x={18} y={242} fill="#cfcfcf" fontSize={11}>Preview · Ultra</text>
            <rect x={150} y={226} width={260} height={24} rx={4} fill="#2f2f2f" stroke="#3a3a3a" strokeWidth={1} />
            <text x={418} y={243} fill="#fafafa" fontSize={11} fontWeight={600}>87 cr</text>
            <text x={20} y={266} fill="#a1a1a1" fontSize={9.5}>cheaper rung = default · Fast / Preview only when the brief needs the quality</text>
          </svg>
        </div>
      </div>

      {/* Panel 7: What's in 6. Claude PFM */}
      <div className="my-12">
        <h3 className="text-xl font-bold mb-2">7. The team folder — <code>6. Claude PFM/</code> on Lucid Link</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          One folder, source of truth for the whole team. Every editor's Mac syncs from here. When something changes, one push updates everyone.
        </p>

        <div className="rounded-lg p-5 bg-surface-gradient shadow-elev1 ring-1 ring-border/50">
          <pre className="text-xs font-mono text-muted overflow-x-auto">
{`6. Claude PFM/
├── skills/                              ← ${skills.length} PFM skills, deployed to every editor
│   ├── hvg-flow/                          The video pipeline (silent setup + 2 stops, parallel waves)
│   ├── hig-flow/                          The image pipeline (b-roll generation)
│   ├── vsl-state-variations/              Per-state VSL slides + Veo clips
│   ├── veo-script-writing/                Veo rule enforcement on scripts
│   ├── lc-to-video-podcast/               Long-copy → podcast monologue transform
│   ├── story-beats/                       PFM 6-beat story-ad skeleton
│   ├── breaking-news-story-ads/           LATU news-wrapper framing
│   ├── nano-banana-prompting/             NB Pro prompt patterns
│   ├── higgsfield-image-generation/       CLI-driven one-off image fires (no Notion needed)
│   ├── ugc-cinematic-prompt/              Seedance 2.0 11-block video prompt
│   ├── reskin-trending-video/             Reskin a trend → brand-safe gen prompt
│   ├── audio-qc/                          Post-download audio QC — ffmpeg + Whisper + music detect
│   ├── visual-qc/                         Post-download visual QC — 5-frame filmstrips
│   ├── notion-asset-delivery/             Posts the house-format delivery comment
│   ├── propose-skill/                     Editor-facing — capture a workflow as a proposal
│   └── suno-songwriter/                   Ad script → Suno v5 song (lyrics + style)
├── context/                             ← Brand briefs per vertical (auto, home, CC)
├── settings.json                        ← Claude permission allowlist (51 entries)
├── CLAUDE.md                            ← Team brief, auto-loaded by Claude Code
├── claude-pfm-setup.sh                  ← One-shot Mac installer
├── claude-pfm-setup-windows.sh          ← One-shot Windows installer
├── claude-pfm-account-switch.sh         ← Higgsfield CLI auth helper
├── claude-pfm-update.sh                 ← Pull latest skills from this folder
└── pfm-cowork-skills.plugin             ← Cowork plugin (6 writing skills bundled)`}
          </pre>
        </div>

        <div className="mt-4 text-sm text-muted">
          When Sam ships a skill update, the new version lands here. Editors run <code>claude-pfm-update.sh</code> (or click the Update button at the top of this hub) and their local Claude picks it up on next session start.
        </div>
      </div>
    </section>
  );
}
