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
        <h2 className="text-4xl md:text-5xl font-bold drop-shadow-text-depth">From a Notion request to a delivered creative</h2>
        <p className="text-muted mt-3 max-w-3xl text-lg">
          This is the whole system, end to end — a request comes in, gets staged, generates (automatically or by hand), passes QC, gets assembled, and ships. Here it is at a glance; every step is broken down below.
        </p>
      </div>

      {/* ── The hero diagram (big, lit panel) ── */}
      <div
        className="relative my-10 rounded-2xl ring-1 ring-white/10 shadow-elev2 overflow-x-auto px-5 py-8 md:px-8 md:py-12"
        style={{ background: "linear-gradient(180deg, #150a24 0%, #0c0713 58%, #0a0a0a 100%)" }}
      >
        {/* faint grid wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,107,53,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            WebkitMaskImage: "radial-gradient(ellipse at center, #000 35%, transparent 82%)",
            maskImage: "radial-gradient(ellipse at center, #000 35%, transparent 82%)",
          }}
        />

        <svg
          viewBox="0 0 1040 305"
          className="relative w-full h-auto block min-w-[880px]"
          role="img"
          aria-label="The full PFM creative pipeline, six stages left to right connected by a gradient rail: 1 Notion request from the VTM, 2 Stage via /stage request, 3 Generate — the hub — which forks into AGF (automated, the office mini fires it) or HVG/HIG (manual, you fire it), with the specific skills varying by project, 4 QC and Report with auto-QC then delivered, 5 Assemble in DaVinci, 6 Deliver the final creative."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="flowA" markerWidth="8" markerHeight="8" refX="5.5" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
            <linearGradient id="hubGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#41241a" />
              <stop offset="1" stopColor="#180f0c" />
            </linearGradient>
            <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#18181c" />
              <stop offset="1" stopColor="#0e0e11" />
            </linearGradient>
            <linearGradient id="railGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#FF6B35" />
              <stop offset="0.45" stopColor="#FF2E7E" />
              <stop offset="0.72" stopColor="#B14DFF" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>
            <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="20" /></filter>
          </defs>

          {/* gradient journey rail behind the nodes */}
          <line x1="28" y1="102" x2="1012" y2="102" stroke="url(#railGrad)" strokeWidth="3" opacity="0.5" strokeLinecap="round" />

          {/* glow behind the Generate hub */}
          <ellipse cx="436" cy="102" rx="120" ry="74" fill="#FF6B35" opacity="0.15" filter="url(#soft)" />

          {/* directional arrows in the gaps */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={166 + i * 174} y1={102} x2={184 + i * 174} y2={102} stroke="#FF6B35" strokeWidth={2.5} markerEnd="url(#flowA)" />
          ))}

          {/* spine nodes */}
          {stages.map((s, i) => {
            const nx = 12 + i * 174;
            const cx = nx + 76;
            const isHub = s.n === 3;
            const isDeliver = s.n === 6;
            return (
              <g key={s.n}>
                <rect
                  x={nx} y={44} width={152} height={116} rx={14}
                  fill={isHub ? "url(#hubGrad)" : "url(#cardGrad)"}
                  stroke={isHub ? "#FF6B35" : isDeliver ? "#34D399" : "#2a2a2a"}
                  strokeWidth={isHub ? 2.5 : isDeliver ? 2 : 1.5}
                />
                <circle cx={nx + 26} cy={70} r={16} fill={isDeliver ? "#34D399" : "#FF6B35"} />
                <text x={nx + 26} y={75} fill="#0a0a0a" fontSize={15} fontWeight="bold" textAnchor="middle">{s.n}</text>
                <text x={cx} y={107} fontSize={34} textAnchor="middle">{s.icon}</text>
                <text x={cx} y={136} fill={isDeliver ? "#34D399" : "#fafafa"} fontSize={16} fontWeight={700} textAnchor="middle">{s.title}</text>
                <text x={cx} y={153} fill="#a1a1a1" fontSize={10.5} textAnchor="middle">{s.spineSub}</text>
              </g>
            );
          })}

          {/* Generate fork (under hub, cx=436) */}
          <line x1={436} y1={160} x2={436} y2={186} stroke="#FF6B35" strokeWidth={2.5} />
          <line x1={436} y1={186} x2={328} y2={202} stroke="#FF6B35" strokeWidth={2.5} markerEnd="url(#flowA)" />
          <line x1={436} y1={186} x2={534} y2={202} stroke="#FF6B35" strokeWidth={2.5} markerEnd="url(#flowA)" />

          <rect x={238} y={204} width={180} height={60} rx={12} fill="url(#cardGrad)" stroke="#FF6B35" strokeWidth={1.5} />
          <text x={328} y={230} fill="#FF6B35" fontSize={13.5} fontWeight="bold" textAnchor="middle">AGF · automated</text>
          <text x={328} y={249} fill="#a1a1a1" fontSize={10} textAnchor="middle">the office mini fires it</text>

          <rect x={434} y={204} width={204} height={60} rx={12} fill="url(#cardGrad)" stroke="#2a2a2a" strokeWidth={1.5} />
          <text x={536} y={230} fill="#fafafa" fontSize={13.5} fontWeight="bold" textAnchor="middle">HVG / HIG · manual</text>
          <text x={536} y={249} fill="#a1a1a1" fontSize={10} textAnchor="middle">you fire it in your session</text>

          <text x={520} y={291} fill="#8a8a8a" fontSize={11} textAnchor="middle">Which gen skills run depends on the project — story ad · VSL · Pixar · breaking news · podcast · UGC · call graphics</text>
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
