function Node({
  n,
  title,
  sub,
  highlight,
}: {
  n: string;
  title: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 flex-1 ${
        highlight ? "bg-accentMuted ring-1 ring-accent/60" : "bg-surface/60 ring-1 ring-ink"
      }`}
    >
      <span className="grid place-items-center w-6 h-6 rounded-full bg-accent text-white text-xs font-bold shrink-0">
        {n}
      </span>
      <div className="leading-tight">
        <div className={`text-xs font-bold tracking-wide ${highlight ? "text-accent" : "text-text"}`}>{title}</div>
        <div className="text-[11px] text-muted">{sub}</div>
      </div>
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5 shrink-0 py-0.5 sm:px-0.5 sm:py-0">
      <span className="text-accent text-base leading-none rotate-90 sm:rotate-0">➜</span>
      <span className="text-[9px] uppercase tracking-wider text-muted font-mono">{label}</span>
    </div>
  );
}

export default function SystemDiagram() {
  return (
    <section id="how-it-works" className="my-12 scroll-mt-8">
      <div className="rounded-xl bg-surface shadow-elev1 ring-1 ring-ink p-5 md:p-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4">
          <div className="text-xs font-mono uppercase tracking-[0.08em] text-accentDeep">Reference</div>
          <h2 className="text-xl font-bold">How the system works</h2>
          <p className="text-muted text-sm">One skill system, two Claude accounts, bridged by Lucid Link.</p>
        </div>

        {/* Compact horizontal flywheel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-1">
          <Node n="1" title="MASTER ACCOUNT" sub="builds + maintains skills" />
          <Arrow label="skills out" />
          <Node n="2" title="LUCID LINK" sub="the shared bridge" highlight />
          <Arrow label="update.sh" />
          <Node n="3" title="EDITOR ACCOUNTS" sub="run flows · deliver" />
        </div>

        <p className="text-xs text-muted mt-4">
          <span className="text-accent">↺</span>{" "}
          <strong className="text-text">Flywheel:</strong> editors propose workflows with{" "}
          <code className="font-mono text-accent">propose-skill</code> → built on master → shipped back to everyone,
          credited to the editor. Quick-start phrases + full list in{" "}
          <a href="#skills" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">
            Skills
          </a>{" "}
          below.
        </p>
      </div>
    </section>
  );
}
