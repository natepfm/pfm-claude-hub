const stages = [
  {
    n: 1,
    icon: "📋",
    color: "#FF6B35",
    title: "Notion request",
    tag: "from the VTM",
    body: "Every creative begins as a request in the Video Task Manager — the brief, the script / copy, the vertical, and the 🤖 Asset Gen grid that the rest of the flow fills in.",
    skills: [],
  },
  {
    n: 2,
    icon: "🗂️",
    color: "#FF8A3D",
    title: "Stage",
    tag: "/stage request",
    body: "Say “stage request” and Claude preps it — resolves the source creative's master prompt + reference images, builds the project folder on Lucid, writes the verbatim dialogue manifest, fills the 🤖 grid, then routes it: hand to the mini, or fire it yourself.",
    skills: ["stage-request"],
  },
  {
    n: 3,
    icon: "⚡",
    color: "#FF2E7E",
    title: "Generate",
    tag: "the hub — two ways to fire",
    body: "Same engine, same conventions; the only difference is who pulls the trigger.",
    skills: ["hvg-flow", "hig-flow", "vsl-state-variations", "pixar-state-music-video", "breaking-news-story-ads", "podcast-guest-veo", "call-graphics", "veo-life", "+ more"],
    hub: true,
  },
  {
    n: 4,
    icon: "✅",
    color: "#C24DF0",
    title: "QC + Report",
    tag: "auto-QC → delivered",
    body: "Every batch passes QC — audio-qc (silence / clipping / dialogue / stray music) and visual-qc (per-clip filmstrip defects). Flagged clips refire. Then assets land in the folder and get reported: a delivery comment + a ping in #pfm-asset-gen.",
    skills: ["audio-qc", "visual-qc", "notion-asset-delivery"],
  },
  {
    n: 5,
    icon: "🎬",
    color: "#9B6BFF",
    title: "Assemble",
    tag: "in DaVinci",
    body: "With the generated assets in hand, the editor builds the creative in DaVinci. claude-editor imports the batch and lays the script-ordered stringout; the editor takes it home — captions, speed, b-roll, grade.",
    skills: ["claude-editor"],
  },
  {
    n: 6,
    icon: "📦",
    color: "#34D399",
    title: "Deliver",
    tag: "final creative",
    body: "The finished creative is turned in — delivery comment posted, status moved to Done, the requester tagged for review. From a line on a Notion board to a delivered creative.",
    skills: ["report", "notion-asset-delivery"],
  },
];

export default function FlowSection() {
  return (
    <section id="flow" className="my-16 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest mb-1 font-semibold" style={{ color: "#3FE6F0", textShadow: "0 0 12px rgba(63,230,240,0.6)" }}>The whole flow</div>
        <h2 className="text-4xl md:text-5xl font-bold drop-shadow-text-depth">From a Notion request to a delivered creative</h2>
        <p className="text-muted mt-3 max-w-3xl text-lg">
          This is the whole system, end to end — top to bottom. A request comes in, gets staged, generates (automatically or by hand), passes QC, gets assembled, and ships.
        </p>
      </div>

      {/* ── Vertical synthwave timeline ── */}
      <div
        className="relative my-10 rounded-2xl ring-1 ring-white/10 shadow-elev2 overflow-hidden px-5 py-10 md:px-12 md:py-14"
        style={{ background: "linear-gradient(180deg, #160a26 0%, #0c0713 60%, #0a0a0a 100%)" }}
      >
        {/* grid wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,107,53,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            WebkitMaskImage: "radial-gradient(ellipse at 30% 50%, #000 30%, transparent 80%)",
            maskImage: "radial-gradient(ellipse at 30% 50%, #000 30%, transparent 80%)",
          }}
        />

        <ol className="relative">
          {stages.map((s, i) => {
            const isLast = i === stages.length - 1;
            return (
              <li key={s.n} className="relative flex gap-5 md:gap-7 pb-12 last:pb-0">
                {/* rail segment to next node */}
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute top-[58px] bottom-0 w-[3px] rounded-full left-[27px] md:left-[28px]"
                    style={{
                      background: `linear-gradient(180deg, ${s.color}, ${stages[i + 1].color})`,
                      boxShadow: `0 0 14px ${s.color}77`,
                    }}
                  />
                )}

                {/* glowing node */}
                <div className="relative z-10 shrink-0">
                  <div
                    className="grid place-items-center rounded-full h-[58px] w-[58px] text-3xl"
                    style={{
                      background: "#0e0b13",
                      border: `2px solid ${s.color}`,
                      boxShadow: `0 0 22px ${s.color}66, inset 0 0 14px ${s.color}22`,
                    }}
                  >
                    <span>{s.icon}</span>
                  </div>
                  <span
                    className="absolute -top-1.5 -left-1.5 h-6 w-6 grid place-items-center rounded-full text-[11px] font-extrabold"
                    style={{ background: s.color, color: "#0a0a0a", boxShadow: `0 0 10px ${s.color}88` }}
                  >
                    {s.n}
                  </span>
                </div>

                {/* content */}
                <div className="min-w-0 pt-1">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: s.color }}>
                    Step {s.n} · {s.tag}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-text leading-tight">{s.title}</h3>
                  <p className="text-sm md:text-[15px] text-muted mt-2 max-w-2xl leading-relaxed">{s.body}</p>

                  {/* Generate hub — the fork */}
                  {s.hub && (
                    <div className="mt-4 grid sm:grid-cols-2 gap-3 max-w-2xl">
                      <div className="rounded-xl p-4 ring-1" style={{ borderColor: "#FF2E7E", background: "rgba(255,46,126,0.07)", boxShadow: "0 0 22px rgba(255,46,126,0.18)" }}>
                        <div className="text-sm font-bold" style={{ color: "#FF6B9E" }}>🤖 AGF · automated</div>
                        <div className="text-xs text-muted mt-0.5">The office mini claims <strong className="text-text">Ready</strong> requests and fires hands-off.</div>
                      </div>
                      <div className="rounded-xl p-4 ring-1 ring-border/60 bg-surface/40">
                        <div className="text-sm font-bold text-text">💻 HVG / HIG · manual</div>
                        <div className="text-xs text-muted mt-0.5">You fire in your own session — <span className="font-mono text-accent">hvg-flow</span> (video) / <span className="font-mono text-accent">hig-flow</span> (images).</div>
                      </div>
                    </div>
                  )}

                  {/* skills */}
                  {s.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 max-w-2xl">
                      <span className="text-[10px] uppercase tracking-wide text-muted/70 mr-1">{s.hub ? "gen skills vary by project" : "skills"}</span>
                      {s.skills.map((sk) => (
                        <span
                          key={sk}
                          className={`text-xs font-mono px-2 py-0.5 rounded ${sk === "+ more" ? "text-muted" : "bg-surface text-text/80 ring-1 ring-border/50"}`}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {s.hub && (
                    <p className="text-xs text-muted mt-3">
                      Full breakdown of the two lanes + the Asset Gen statuses is in <a href="#asset-gen" className="text-accent hover:text-accentHover underline">Asset Generation</a> below.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
