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

      {/* Anatomy of a creative */}
      <div className="border border-border rounded-lg bg-bg p-5 mb-12 overflow-x-auto">
        <div className="text-[11px] uppercase tracking-widest text-accent mb-3">Anatomy of a creative</div>
        <svg
          viewBox="0 0 820 232"
          className="w-full h-auto block min-w-[680px]"
          role="img"
          aria-label="How a creative is built, left to right. Building blocks (script & structure, images & graphics, QC pass) combine into a creative type — the base ad format (story ad, VSL, reaction, UGC, live-action, podcast). Variations are applied on top (state spin, breaking-news wrap, language dub, hooks). Every spin ships into a vertical (Auto, Home Insurance, Concealed Carry)."
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <defs>
            <marker id="anatA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
          </defs>
          <rect x={12} y={46} width={174} height={150} rx={12} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <circle cx={36} cy={72} r={12} fill="#FF6B35" />
          <text x={36} y={77} fill="#0a0a0a" fontSize={13} fontWeight="bold" textAnchor="middle">1</text>
          <text x={54} y={77} fill="#fafafa" fontSize={12.5} fontWeight={600}>Building blocks</text>
          <rect x={26} y={96} width={146} height={26} rx={6} fill="#1c1c1c" stroke="#2a2a2a" strokeWidth={1} />
          <circle cx={40} cy={109} r={3.5} fill="#FF6B35" />
          <text x={52} y={113} fill="#cfcfcf" fontSize={10.5}>Script &amp; structure</text>
          <rect x={26} y={128} width={146} height={26} rx={6} fill="#1c1c1c" stroke="#2a2a2a" strokeWidth={1} />
          <circle cx={40} cy={141} r={3.5} fill="#FF6B35" />
          <text x={52} y={145} fill="#cfcfcf" fontSize={10.5}>Images &amp; graphics</text>
          <rect x={26} y={160} width={146} height={26} rx={6} fill="#1c1c1c" stroke="#2a2a2a" strokeWidth={1} />
          <circle cx={40} cy={173} r={3.5} fill="#FF6B35" />
          <text x={52} y={177} fill="#cfcfcf" fontSize={10.5}>QC pass</text>
          <rect x={219} y={46} width={174} height={150} rx={12} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <circle cx={243} cy={72} r={12} fill="#FF6B35" />
          <text x={243} y={77} fill="#0a0a0a" fontSize={13} fontWeight="bold" textAnchor="middle">2</text>
          <text x={261} y={77} fill="#fafafa" fontSize={12.5} fontWeight={600}>Creative type</text>
          <text x={233} y={112} fill="#cfcfcf" fontSize={11}>The base ad format</text>
          <text x={233} y={136} fill="#a1a1a1" fontSize={10.5}>Story ad · VSL</text>
          <text x={233} y={154} fill="#a1a1a1" fontSize={10.5}>Reaction · UGC</text>
          <text x={233} y={172} fill="#a1a1a1" fontSize={10.5}>live-action · podcast</text>
          <rect x={426} y={46} width={174} height={150} rx={12} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <circle cx={450} cy={72} r={12} fill="#FF6B35" />
          <text x={450} y={77} fill="#0a0a0a" fontSize={13} fontWeight="bold" textAnchor="middle">3</text>
          <text x={468} y={77} fill="#fafafa" fontSize={12.5} fontWeight={600}>Variations</text>
          <text x={440} y={112} fill="#cfcfcf" fontSize={11}>Applied on top:</text>
          <text x={440} y={136} fill="#a1a1a1" fontSize={10.5}>State spin</text>
          <text x={440} y={154} fill="#a1a1a1" fontSize={10.5}>Breaking-news wrap</text>
          <text x={440} y={172} fill="#a1a1a1" fontSize={10.5}>Language dub · hooks</text>
          <rect x={633} y={46} width={174} height={150} rx={12} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
          <circle cx={657} cy={72} r={12} fill="#FF6B35" />
          <text x={657} y={77} fill="#0a0a0a" fontSize={13} fontWeight="bold" textAnchor="middle">4</text>
          <text x={675} y={77} fill="#fafafa" fontSize={12.5} fontWeight={600}>Vertical</text>
          <rect x={647} y={96} width={146} height={26} rx={6} fill="#1c1c1c" stroke="#2a2a2a" strokeWidth={1} />
          <circle cx={661} cy={109} r={3.5} fill="#FF6B35" />
          <text x={673} y={113} fill="#cfcfcf" fontSize={10.5}>Auto</text>
          <rect x={647} y={128} width={146} height={26} rx={6} fill="#1c1c1c" stroke="#2a2a2a" strokeWidth={1} />
          <circle cx={661} cy={141} r={3.5} fill="#FF6B35" />
          <text x={673} y={145} fill="#cfcfcf" fontSize={10.5}>Home Insurance</text>
          <rect x={647} y={160} width={146} height={26} rx={6} fill="#1c1c1c" stroke="#2a2a2a" strokeWidth={1} />
          <circle cx={661} cy={173} r={3.5} fill="#FF6B35" />
          <text x={673} y={177} fill="#cfcfcf" fontSize={10.5}>Concealed Carry</text>
          <line x1={188} y1={121} x2={217} y2={121} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#anatA)" />
          <line x1={395} y1={121} x2={424} y2={121} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#anatA)" />
          <line x1={602} y1={121} x2={631} y2={121} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#anatA)" />
          <text x={410} y={222} fill="#a1a1a1" fontSize={10} textAnchor="middle">components combine into a base creative · variations multiply it · every spin ships into a vertical</text>
        </svg>
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
