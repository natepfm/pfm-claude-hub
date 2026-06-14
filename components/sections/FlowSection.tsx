const stages = [
  {
    n: 1,
    icon: "📋",
    accent: "#2DD4BF",
    title: "Notion request",
    tag: "from the VTM",
    body: "Every creative begins as a request in the Video Task Manager — the brief, the script / copy, the vertical, and the 🤖 Asset Gen grid that the rest of the flow fills in.",
    skills: [],
  },
  {
    n: 2,
    icon: "🗂️",
    accent: "#FDE047",
    title: "Stage",
    tag: "/stage request",
    body: "Say “stage request” and Claude preps it — resolves the source creative's master prompt + reference images, builds the project folder on Lucid, writes the verbatim dialogue manifest, fills the 🤖 grid, then routes it: hand to the mini, or fire it yourself.",
    skills: ["stage-request"],
  },
  {
    n: 3,
    icon: "⚡",
    accent: "#F472B6",
    title: "Generate",
    tag: "the hub — two ways to fire",
    body: "Same engine, same conventions; the only difference is who pulls the trigger.",
    skills: ["hvg-flow", "hig-flow", "vsl-state-variations", "pixar-state-music-video", "breaking-news-story-ads", "podcast-guest-veo", "call-graphics", "veo-life", "+ more"],
    hub: true,
  },
  {
    n: 4,
    icon: "✅",
    accent: "#2DD4BF",
    title: "QC + Report",
    tag: "auto-QC → delivered",
    body: "Every batch passes QC — audio-qc (silence / clipping / dialogue / stray music) and visual-qc (per-clip filmstrip defects). Flagged clips refire. Then assets land in the folder and get reported: a delivery comment + a ping in #pfm-asset-gen.",
    skills: ["audio-qc", "visual-qc", "notion-asset-delivery"],
  },
  {
    n: 5,
    icon: "🎬",
    accent: "#FDE047",
    title: "Assemble",
    tag: "in DaVinci",
    body: "With the generated assets in hand, the editor builds the creative in DaVinci. claude-editor imports the batch and lays the script-ordered stringout; the editor takes it home — captions, speed, b-roll, grade.",
    skills: ["claude-editor"],
  },
  {
    n: 6,
    icon: "📦",
    accent: "#34D399",
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
        <div className="text-xs uppercase tracking-widest mb-1 font-extrabold" style={{ color: "#2DD4BF" }}>The whole flow</div>
        <h2 className="text-4xl md:text-5xl font-black drop-shadow-text-depth italic tracking-tight">From a Notion request to a delivered creative</h2>
        <p className="text-muted mt-3 max-w-3xl text-lg">
          This is the whole system, end to end — top to bottom. A request comes in, gets staged, generates (automatically or by hand), passes QC, gets assembled, and ships.
        </p>
      </div>

      {/* ── Vertical Memphis timeline ── */}
      <div
        className="relative my-10 rounded-2xl ring-1 ring-white/10 shadow-elev2 overflow-hidden px-5 py-10 md:px-12 md:py-14"
        style={{ background: "linear-gradient(180deg, #18110a 0%, #110b07 60%, #0a0a0a 100%)" }}
      >
        {/* Memphis confetti */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-90">
          <svg className="absolute top-6 right-8" width="70" height="70"><circle cx="35" cy="35" r="29" fill="none" stroke="#2DD4BF" strokeWidth="6" /></svg>
          <svg className="absolute top-10 right-28 hidden md:block" width="84" height="32"><path d="M3,4 L17,28 L31,4 L45,28 L59,4 L73,28" stroke="#FDE047" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>
          <svg className="absolute bottom-10 right-10" width="86" height="36"><path d="M3,28 Q17,3 31,19 T59,15 T85,19" stroke="#F472B6" strokeWidth="6" fill="none" strokeLinecap="round" /></svg>
          <svg className="absolute bottom-16 left-8 hidden md:block" width="54" height="54"><polygon points="27,4 50,48 4,48" fill="none" stroke="#FF6B35" strokeWidth="5" /></svg>
        </div>

        <ol className="relative">
          {stages.map((s, i) => {
            const isLast = i === stages.length - 1;
            return (
              <li key={s.n} className="relative flex gap-5 md:gap-7 pb-12 last:pb-0">
                {/* bold orange rail to next node */}
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute top-[58px] bottom-0 w-[4px] rounded-full left-[26px] md:left-[27px]"
                    style={{ background: "#FF6B35" }}
                  />
                )}

                {/* chunky Memphis node */}
                <div className="relative z-10 shrink-0">
                  <div
                    className="grid place-items-center rounded-full h-[58px] w-[58px] text-3xl"
                    style={{ background: "#FF6B35", border: "3px solid #0a0a0a", boxShadow: `5px 5px 0 ${s.accent}` }}
                  >
                    <span>{s.icon}</span>
                  </div>
                  <span
                    className="absolute -top-2 -left-2 h-6 w-6 grid place-items-center rounded-full text-[11px] font-black"
                    style={{ background: s.accent, color: "#0a0a0a", border: "2px solid #0a0a0a" }}
                  >
                    {s.n}
                  </span>
                </div>

                {/* content */}
                <div className="min-w-0 pt-1">
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] mb-1" style={{ color: s.accent }}>
                    Step {s.n} · {s.tag}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black italic text-text leading-tight">{s.title}</h3>
                  <p className="text-sm md:text-[15px] text-muted mt-2 max-w-2xl leading-relaxed">{s.body}</p>

                  {/* Generate hub — the fork */}
                  {s.hub && (
                    <div className="mt-4 grid sm:grid-cols-2 gap-3 max-w-2xl">
                      <div className="rounded-xl p-4" style={{ background: "rgba(255,107,53,0.08)", border: "2px solid #FF6B35", boxShadow: "4px 4px 0 #2DD4BF" }}>
                        <div className="text-sm font-black" style={{ color: "#FF8A4D" }}>🤖 AGF · automated</div>
                        <div className="text-xs text-muted mt-0.5">The office mini claims <strong className="text-text">Ready</strong> requests and fires hands-off.</div>
                      </div>
                      <div className="rounded-xl p-4" style={{ background: "rgba(45,212,191,0.06)", border: "2px solid #2DD4BF", boxShadow: "4px 4px 0 #FF6B35" }}>
                        <div className="text-sm font-black" style={{ color: "#5EEAD4" }}>💻 HVG / HIG · manual</div>
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
