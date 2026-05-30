import {
  creativeTypes,
  variationTypes,
  buildingBlocks,
  verticals,
  type CreativeEntry,
} from "@/content/creatives";

const BLOCK_GROUPS = ["Scripts & structure", "Images & graphics", "QC"];

function EntryCard({ e }: { e: CreativeEntry }) {
  return (
    <div className="border border-border rounded-lg p-4 bg-surface/50">
      <div className="font-semibold text-text mb-1">
        {e.name}
        {e.aka && <span className="text-xs text-muted font-normal ml-2">{e.aka}</span>}
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
  return (
    <div>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Editors Hub · Creatives</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
          Creative <span className="text-accent">Library</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          Every creative type PFM produces and every variation we run — each mapped to the skill that builds it. The source of truth lives in the team knowledge base; this page mirrors it.
        </p>
      </header>

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

      {/* Verticals */}
      <section id="verticals" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-2 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">🎯 Verticals</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          The markets we run creatives for — every type + variation above maps onto one of these.
        </p>
        {verticals.map((g) => (
          <div key={g.group} className="mb-6">
            <h3 className="text-sm uppercase tracking-wide text-accent font-semibold mb-3">{g.group}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {g.items.map((v) => (
                <div key={v.name} className="border border-border rounded-lg px-3 py-2 bg-surface/50">
                  <div className="text-sm font-medium text-text">{v.name}</div>
                  {v.aka && <div className="text-[11px] text-muted">{v.aka}</div>}
                  {v.offers && <div className="text-[11px] text-accent/80 mt-0.5">{v.offers}</div>}
                </div>
              ))}
            </div>
          </div>
        ))}
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
    </div>
  );
}
