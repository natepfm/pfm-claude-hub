const stages = [
  {
    n: "01",
    icon: "📋",
    strip: "bg-accent",
    node: "bg-accentMuted",
    title: "Notion request",
    tag: "From the VTM",
    body: "Every creative begins as a request in the Video Task Manager — the brief, the script / copy, the vertical, and the 🤖 Asset Gen grid that the rest of the flow fills in.",
    skills: [],
  },
  {
    n: "02",
    icon: "🗂️",
    strip: "bg-tintBlue",
    node: "bg-tintBlue",
    title: "Stage",
    tag: "/stage request",
    body: "Say “stage request” and Claude preps it — resolves the source creative's master prompt + reference images, builds the project folder on Lucid, writes the verbatim dialogue manifest, fills the 🤖 grid, then routes it: hand to the mini, or fire it yourself.",
    skills: ["stage-request"],
  },
  {
    n: "03",
    icon: "⚡",
    strip: "bg-successMuted",
    node: "bg-successMuted",
    title: "Generate",
    tag: "The hub — two ways to fire",
    body: "Same engine, same conventions; the only difference is who pulls the trigger.",
    skills: ["hvg-flow", "hig-flow", "vsl-state-variations", "pixar-state-music-video", "breaking-news-story-ads", "podcast-guest-veo", "call-graphics", "veo-life", "+ more"],
    hub: true,
  },
  {
    n: "04",
    icon: "✅",
    strip: "bg-accent",
    node: "bg-accentMuted",
    title: "QC + Report",
    tag: "Auto-QC → delivered",
    body: "Every batch passes QC — audio-qc (silence / clipping / dialogue / stray music) and visual-qc (per-clip filmstrip defects). Flagged clips refire. Then assets land in the folder and get reported: a delivery comment + a ping in #pfm-asset-gen.",
    skills: ["audio-qc", "visual-qc", "notion-asset-delivery"],
  },
  {
    n: "05",
    icon: "🎬",
    strip: "bg-tintBlue",
    node: "bg-tintBlue",
    title: "Assemble",
    tag: "In DaVinci",
    body: "With the generated assets in hand, the editor builds the creative in DaVinci. claude-editor imports the batch and lays the script-ordered stringout; the editor takes it home — captions, speed, b-roll, grade.",
    skills: ["claude-editor"],
  },
  {
    n: "06",
    icon: "📦",
    strip: "bg-successMuted",
    node: "bg-successMuted",
    title: "Deliver",
    tag: "Final creative",
    body: "The finished creative is turned in — delivery comment posted, status moved to Done, the requester tagged for review. From a line on a Notion board to a delivered creative.",
    skills: ["report", "notion-asset-delivery"],
  },
];

export default function FlowSection() {
  return (
    <section id="flow" className="my-16 scroll-mt-8">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 border border-ink bg-surface px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text mb-5">
          <span aria-hidden className="inline-block w-2 h-2 bg-accent" />
          The whole flow
        </div>
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-text leading-[1.1]">
          From a Notion request to a <em>delivered creative.</em>
        </h2>
        <p className="text-muted mt-4 max-w-3xl text-lg">
          This is the whole system, end to end — top to bottom. A request comes in, gets staged, generates (automatically or by hand), passes QC, gets assembled, and ships.
        </p>
      </div>

      {/* ── Timeline — accent rail, square nodes, hard-shadow cards ── */}
      <ol className="relative ml-1 md:ml-2 border-l-2 border-accent">
        {stages.map((s) => (
          <li key={s.n} className="relative pl-8 md:pl-10 pb-10 last:pb-0">
            {/* square node on the rail */}
            <span
              aria-hidden
              className={`absolute -left-[7px] top-7 h-3 w-3 border border-ink ${s.node}`}
            />

            <div className="max-w-2xl bg-surface border border-ink shadow-elev2">
              {/* colored top strip */}
              <div aria-hidden className={`h-1.5 border-b border-ink ${s.strip}`} />

              <div className="p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center h-8 w-8 border border-ink bg-surface font-mono text-[11px] font-medium text-text">
                    {s.n}
                  </span>
                  <h3 className="font-heading font-bold text-2xl text-text leading-tight">
                    {s.icon} {s.title}
                  </h3>
                </div>

                <p className="text-sm md:text-[15px] text-muted leading-relaxed">{s.body}</p>

                {/* Generate hub — the fork */}
                {s.hub && (
                  <div className="mt-4 grid sm:grid-cols-2 gap-3">
                    <div className="p-4 bg-accentMuted border border-ink">
                      <div className="text-sm font-semibold text-text">🤖 AGF · automated</div>
                      <div className="text-xs text-muted mt-0.5">The office mini claims <strong className="text-text">Ready</strong> requests and fires hands-off.</div>
                    </div>
                    <div className="p-4 bg-tintBlue border border-ink">
                      <div className="text-sm font-semibold text-text">💻 HVG / HIG · manual</div>
                      <div className="text-xs text-muted mt-0.5">You fire in your own session — <span className="font-mono text-accentDeep">hvg-flow</span> (video) / <span className="font-mono text-accentDeep">hig-flow</span> (images).</div>
                    </div>
                  </div>
                )}

                {/* skills */}
                {s.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted/70 mr-1">{s.hub ? "gen skills vary by project" : "skills"}</span>
                    {s.skills.map((sk) => (
                      <span
                        key={sk}
                        className={`text-xs font-mono px-2 py-0.5 ${sk === "+ more" ? "text-muted" : "bg-surface2 text-muted border border-borderInput"}`}
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}

                {/* mono accent tagline — the reference card footer */}
                <div className="mt-4 pt-3 border-t border-border font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep">
                  {s.tag}
                </div>

                {s.hub && (
                  <p className="text-xs text-muted mt-3">
                    Full breakdown of the two lanes + the Asset Gen statuses is in <a href="#asset-gen" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">Asset Generation</a> below.
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
