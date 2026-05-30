import {
  creativeTypes,
  variationTypes,
  buildingBlocks,
  statusMeta,
  type CreativeEntry,
  type CreativeStatus,
} from "@/content/creatives";

const BLOCK_GROUPS = ["Scripts & structure", "Images & graphics", "QC"];

function StatusBadge({ status }: { status: CreativeStatus }) {
  const m = statusMeta[status];
  return (
    <span
      className="text-[10px] uppercase tracking-widest font-semibold rounded px-1.5 py-0.5 border shrink-0"
      style={{ color: m.color, borderColor: m.color + "66" }}
    >
      {m.label}
    </span>
  );
}

function EntryCard({ e }: { e: CreativeEntry }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-surface/50">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="font-semibold text-text">
          {e.name}
          {e.aka && <span className="text-xs text-muted font-normal ml-2">{e.aka}</span>}
        </div>
        <StatusBadge status={e.status} />
      </div>
      <div className="text-sm text-muted leading-relaxed">{e.description}</div>
      {e.appliesTo && (
        <div className="text-xs text-muted mt-2">
          Applies to: <span className="text-text">{e.appliesTo}</span>
        </div>
      )}
      <div className="text-xs font-mono text-accent/90 mt-2 border-t border-border pt-2">↳ {e.skill}</div>
    </div>
  );
}

export default function CreativesPage() {
  const roadmap = [...creativeTypes, ...variationTypes, ...buildingBlocks].filter(
    (e) => e.status === "in-progress" || e.status === "planned"
  );

  return (
    <div>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Editors Hub · Creatives</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
          Creative <span className="text-accent">Library</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Every creative type PFM produces and every variation we run — each mapped to the skill that builds it and where it stands. The source of truth lives in the team knowledge base; this page tracks it.
        </p>
      </header>

      {/* Status legend */}
      <div className="flex flex-wrap gap-2 mb-12">
        {(Object.keys(statusMeta) as CreativeStatus[]).map((s) => (
          <StatusBadge key={s} status={s} />
        ))}
      </div>

      {/* Creative types */}
      <section id="types" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-2 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">🎬 Creative types</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">The base ad formats we produce.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {creativeTypes.map((e) => (
            <EntryCard key={e.name} e={e} />
          ))}
        </div>
      </section>

      {/* Variation types */}
      <section id="variations" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-2 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">🔀 Variation types</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Cross-cutting transformations we apply to a base creative.
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {variationTypes.map((e) => (
            <EntryCard key={e.name} e={e} />
          ))}
        </div>
      </section>

      {/* Building blocks */}
      <section id="building-blocks" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-2 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">🧱 Building blocks</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          The scripts, images, and QC each skill produces — the components that feed every creative above.
        </p>
        {BLOCK_GROUPS.map((g) => (
          <div key={g} className="mb-6">
            <h3 className="text-sm uppercase tracking-wide text-accent font-semibold mb-3">{g}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {buildingBlocks
                .filter((b) => b.group === g)
                .map((e) => (
                  <EntryCard key={e.name} e={e} />
                ))}
            </div>
          </div>
        ))}
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-2 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">🛠️ Roadmap</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          What&apos;s being built or queued next — the rest above are live.
        </p>
        {roadmap.length === 0 ? (
          <div className="text-sm text-muted">Nothing in flight right now — every creative in the library is established. In-progress and planned creatives show up here.</div>
        ) : (
          <div className="space-y-3">
            {roadmap.map((e) => (
              <div
                key={e.name}
                className="flex items-start gap-3 border border-border rounded-lg p-4 bg-surface/50"
              >
                <StatusBadge status={e.status} />
                <div className="flex-1">
                  <div className="font-semibold text-text">{e.name}</div>
                  <div className="text-sm text-muted leading-relaxed mt-0.5">{e.description}</div>
                  <div className="text-xs font-mono text-accent/90 mt-2">↳ {e.skill}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
