const stages = [
  {
    n: 1,
    icon: "📋",
    title: "Notion request",
    spineSub: "from the VTM",
    heading: "It starts with a Notion request",
    body: "Every creative begins as a request in the Video Task Manager. The request carries the brief, the script / copy, the vertical, and — at the top — the 🤖 Asset Gen grid that the rest of the flow fills in.",
    skills: [],
  },
  {
    n: 2,
    icon: "🗂️",
    title: "Stage",
    spineSub: "/stage request",
    heading: "The request gets staged",
    body: "Say “stage request” and Claude preps it for generation — resolves the source creative's master prompt + reference images, builds the project folder on Lucid Link, writes the verbatim per-line dialogue manifest, and fills the 🤖 grid. Then it routes the request: hand it to the mini, or fire it yourself.",
    skills: ["stage-request"],
  },
  {
    n: 3,
    icon: "⚡",
    title: "Generate",
    spineSub: "AGF · or · HVG/HIG",
    heading: "Assets are generated — two ways to fire",
    body: "Same engine, same conventions; the only difference is who pulls the trigger. AGF (automated) — the always-on office mini claims Ready requests and fires hands-off. HVG / HIG (manual) — you fire in your own session: hvg-flow for Veo video, hig-flow for Nano Banana b-roll. Which skills actually run depends on the project type.",
    skills: ["hvg-flow", "hig-flow", "vsl-state-variations", "pixar-state-music-video", "breaking-news-story-ads", "podcast-guest-veo", "ugc-talking-head", "call-graphics", "bn-lower-thirds", "veo-life", "+ more"],
  },
  {
    n: 4,
    icon: "✅",
    title: "QC + Report",
    spineSub: "auto-QC → delivered",
    heading: "QC'd, delivered, and reported",
    body: "Every batch passes QC — audio-qc (silence / clipping / dialogue / stray music) and visual-qc (per-clip filmstrip defects). Flagged clips refire. Then the assets land in the project folder and get reported: a delivery comment on the request, and a ping in #pfm-asset-gen.",
    skills: ["audio-qc", "visual-qc", "notion-asset-delivery"],
  },
  {
    n: 5,
    icon: "🎬",
    title: "Assemble",
    spineSub: "in DaVinci",
    heading: "The editor assembles the creative",
    body: "With the generated assets in hand, the editor builds the creative in DaVinci. claude-editor imports the batch and lays the script-ordered stringout; the editor takes it home — captions, speed, b-roll, grade — the human craft on top of the generated raw.",
    skills: ["claude-editor"],
  },
  {
    n: 6,
    icon: "📦",
    title: "Deliver",
    spineSub: "final creative",
    heading: "The creative is delivered",
    body: "The finished creative is turned in — delivery comment posted, status moved to Done, the requester tagged for review. From a line on a Notion board to a delivered creative.",
    skills: ["report", "notion-asset-delivery"],
  },
];

export default function FlowSection() {
  return (
    <section id="flow" className="my-16 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">The whole flow</div>
        <h2 className="text-3xl md:text-4xl font-bold drop-shadow-text-depth">From a Notion request to a delivered creative</h2>
        <p className="text-muted mt-2 max-w-3xl">
          One pipeline, end to end. A request comes in, gets staged, generates (automatically or by hand), passes QC, gets assembled, and ships. Here&apos;s the whole thing at a glance — each step is broken down below.
        </p>
      </div>

      {/* ── The hero diagram ── */}
      <div className="my-8 rounded-2xl bg-glass-light backdrop-blur-xl shadow-elev2 ring-1 ring-white/10 px-5 py-6 overflow-x-auto">
        <svg
          viewBox="0 0 900 214"
          className="w-full h-auto block min-w-[780px]"
          role="img"
          aria-label="The full PFM creative pipeline, six stages left to right: 1 Notion request from the VTM, 2 Stage via /stage request, 3 Generate — which forks into AGF (automated, the office mini fires it) or HVG/HIG (manual, you fire it), with the specific skills varying by project, 4 QC and Report with auto-QC then delivered, 5 Assemble in DaVinci, 6 Deliver the final creative."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="flowA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
            <linearGradient id="hubGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a1f15" />
              <stop offset="1" stopColor="#1a1210" />
            </linearGradient>
          </defs>

          {/* spine arrows */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={140 + i * 148} y1={57} x2={160 + i * 148} y2={57} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#flowA)" />
          ))}

          {/* spine nodes */}
          {stages.map((s, i) => {
            const nx = 12 + i * 148;
            const cx = nx + 64;
            const isHub = s.n === 3;
            const isDeliver = s.n === 6;
            return (
              <g key={s.n}>
                <rect x={nx} y={18} width={128} height={78} rx={12} fill={isHub ? "url(#hubGrad)" : "#141414"} stroke={isHub ? "#FF6B35" : isDeliver ? "#34D399" : "#2a2a2a"} strokeWidth={isHub || isDeliver ? 2 : 1.5} />
                <circle cx={nx + 16} cy={34} r={11} fill="#FF6B35" />
                <text x={nx + 16} y={38} fill="#0a0a0a" fontSize={11} fontWeight="bold" textAnchor="middle">{s.n}</text>
                <text x={cx} y={42} fontSize={16} textAnchor="middle">{s.icon}</text>
                <text x={cx} y={64} fill={isDeliver ? "#34D399" : "#fafafa"} fontSize={12} fontWeight={700} textAnchor="middle">{s.title}</text>
                <text x={cx} y={79} fill="#a1a1a1" fontSize={8.5} textAnchor="middle">{s.spineSub}</text>
              </g>
            );
          })}

          {/* generate fork (under stage 3, cx=372) */}
          <line x1={372} y1={96} x2={372} y2={116} stroke="#FF6B35" strokeWidth={2} />
          <line x1={372} y1={116} x2={281} y2={128} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#flowA)" />
          <line x1={372} y1={116} x2={457} y2={128} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#flowA)" />

          <rect x={206} y={130} width={150} height={50} rx={10} fill="#141414" stroke="#FF6B35" strokeWidth={1.5} />
          <text x={281} y={152} fill="#FF6B35" fontSize={11.5} fontWeight="bold" textAnchor="middle">AGF · automated</text>
          <text x={281} y={167} fill="#a1a1a1" fontSize={8.5} textAnchor="middle">the office mini fires it</text>

          <rect x={372} y={130} width={170} height={50} rx={10} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={457} y={152} fill="#fafafa" fontSize={11.5} fontWeight="bold" textAnchor="middle">HVG / HIG · manual</text>
          <text x={457} y={167} fill="#a1a1a1" fontSize={8.5} textAnchor="middle">you fire it in your session</text>

          <text x={374} y={202} fill="#a1a1a1" fontSize={9} textAnchor="middle">Which gen skills run depends on the project — story ad · VSL · Pixar · breaking news · podcast · UGC · call graphics</text>
        </svg>
      </div>

      {/* ── Stage-by-stage breakdown ── */}
      <div className="space-y-3">
        {stages.map((s) => {
          const isHub = s.n === 3;
          const isDeliver = s.n === 6;
          return (
            <div
              key={s.n}
              className="flex gap-4 rounded-xl bg-surface-gradient shadow-elev1 ring-1 ring-border/50 p-5"
            >
              {/* number rail */}
              <div className="shrink-0 flex flex-col items-center">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm ${isDeliver ? "bg-[#34D399] text-bg" : "bg-accent text-bg"}`}>
                  {s.n}
                </div>
              </div>
              {/* content */}
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-text mb-1">
                  <span className="mr-2">{s.icon}</span>{s.heading}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{s.body}</p>
                {s.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wide text-muted/70 mr-1">skills</span>
                    {s.skills.map((sk) => (
                      <span
                        key={sk}
                        className={`text-xs font-mono px-2 py-0.5 rounded ${sk === "+ more" ? "text-muted" : isHub ? "bg-accentMuted text-accent" : "bg-surface text-text/80 ring-1 ring-border/50"}`}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
                {isHub && (
                  <p className="text-xs text-muted mt-3">
                    Full breakdown of the two firing lanes + the Asset Gen statuses is in <a href="#asset-gen" className="text-accent hover:text-accentHover underline">Asset Generation</a> below.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
