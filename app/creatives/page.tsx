import {
  creativeTypes,
  variationTypes,
  buildingBlocks,
  verticals,
  type CreativeEntry,
} from "@/content/creatives";
import PageHero from "@/components/PageHero";

const BLOCK_GROUPS = ["Scripts & structure", "Images & graphics", "QC"];

function EntryCard({ e }: { e: CreativeEntry }) {
  return (
    <div className="rounded-lg p-4 bg-surface-gradient shadow-elev1 ring-1 ring-border/50">
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
      <PageHero
        eyebrow="Editors Hub · Creatives"
        title="Creative Library"
        subtitle="Every creative type PFM produces and every variation we run — each mapped to the skill that builds it. The source of truth lives in the team knowledge base; this page mirrors it."
      />

      {/* Anatomy of a creative */}
      <div className="rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 mb-12 overflow-x-auto">
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
          <h2 className="text-2xl font-bold text-text drop-shadow-text-depth">🎬 Creative types</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">The base ad formats we produce.</p>
        <div className="grid md:grid-cols-2 gap-3">
          {creativeTypes.map((e) => (
            <EntryCard key={e.name} e={e} />
          ))}
        </div>

        {/* Reskin mini-flow — how a trend-copy gets built */}
        <div className="mt-6 rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 overflow-x-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] uppercase tracking-widest text-bg bg-accent rounded px-1.5 py-0.5 font-semibold">New</span>
            <div className="text-[11px] uppercase tracking-widest text-accent">Reskin flow — copy a trend with your character</div>
          </div>
          <svg
            viewBox="0 0 820 88"
            className="w-full h-auto block min-w-[680px]"
            role="img"
            aria-label="The reskin flow, left to right: inspect the reference clip, pick the engine (Seedance for concept, Kling for literal motion), write the 11-block prompt via ugc-cinematic-prompt, then optionally fire it through the Higgsfield CLI."
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <defs>
              <marker id="crReskin" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
            </defs>
            {[
              { label: "Inspect ref", sub: "ffmpeg contact sheet" },
              { label: "Engine pick", sub: "Seedance / Kling" },
              { label: "11-block prompt", sub: "ugc-cinematic-prompt" },
              { label: "Fire (optional)", sub: "Higgsfield CLI · count 1", goal: true },
            ].map((n, i) => {
              const x = 12 + i * 202;
              const cx = x + 88;
              return (
                <g key={n.label}>
                  {i > 0 && (
                    <line x1={x - 26} y1={40} x2={x - 2} y2={40} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#crReskin)" />
                  )}
                  <rect x={x} y={16} width={176} height={48} rx={10} fill={n.goal ? "#3a1f15" : "#141414"} stroke={n.goal ? "#FF6B35" : "#2a2a2a"} strokeWidth={n.goal ? 2 : 1.5} />
                  <text x={cx} y={37} fill="#fafafa" fontSize={12.5} fontWeight={600} textAnchor="middle">{n.label}</text>
                  <text x={cx} y={53} fill={n.goal ? "#FF6B35" : "#a1a1a1"} fontSize={9.5} textAnchor="middle">{n.sub}</text>
                </g>
              );
            })}
            <text x={410} y={82} fill="#a1a1a1" fontSize={10} textAnchor="middle">keeps the trend&apos;s structure + pacing · swaps the subject for a PFM character · brand-safe by default</text>
          </svg>
        </div>
      </section>

      {/* Variation types */}
      <section id="variations" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-2 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text drop-shadow-text-depth">🔀 Variation types</h2>
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
          <h2 className="text-2xl font-bold text-text drop-shadow-text-depth">🎯 Verticals</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          The markets we run creatives for — every type + variation above maps onto one of these.
        </p>
        {verticals.map((g) => (
          <div key={g.group} className="mb-6">
            <h3 className="text-sm uppercase tracking-wide text-accent font-semibold mb-3">{g.group}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {g.items.map((v) => (
                <div key={v.name} className="rounded-lg px-3 py-2 bg-surface-gradient shadow-elev1 ring-1 ring-border/50">
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
          <h2 className="text-2xl font-bold text-text drop-shadow-text-depth">🧱 Building blocks</h2>
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
