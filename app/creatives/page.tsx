import PageHero from "@/components/PageHero";
import {
  instructionBlocks,
  namingRenderings,
  namingRules,
  propertyGroups,
  toolChainExamples,
} from "@/content/creatives";

export default function CreativesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Editors Hub · Creatives"
        title="The creative system"
        subtitle="A creative's identity now lives in structured Notion properties—not a hand-written title. Those properties make the board filterable and generate one consistent name across Notion, Lucid, DaVinci, filenames, and exports."
      />

      <section className="bg-accentMuted border border-ink shadow-elev2 p-5 md:p-6 mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-accentDeep">Locked 07.14.26</div>
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-text mt-2">Properties are the source. Names are renderings.</h2>
        <p className="text-sm md:text-base text-muted mt-3 max-w-3xl leading-relaxed">
          Creative Type, Concept, Variant, Geo, Aspect, Platform, Language, Batch, Runtime, Brand, and Parent Creative are now real fields. The title no longer has to carry the entire production spec.
        </p>
      </section>

      <section id="naming" className="my-12 scroll-mt-28">
        <div className="border-l-4 border-accent pl-4 mb-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-accentDeep">One source · four renderings</div>
          <h2 className="font-heading font-bold text-3xl text-text mt-1">The naming convention</h2>
          <p className="text-sm text-muted mt-2 max-w-3xl">Every surface gets the amount of identity it needs, generated from the same properties.</p>
        </div>

        <div className="bg-surface border border-ink shadow-elev1 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Rendering</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Shape</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Example</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">Where it lives</th>
              </tr>
            </thead>
            <tbody>
              {namingRenderings.map((rendering) => (
                <tr key={rendering.name} className="border-b border-border align-top">
                  <td className="px-4 py-4 font-semibold text-text whitespace-nowrap">{rendering.name}</td>
                  <td className="px-4 py-4 font-mono text-xs text-accentDeep">{rendering.shape}</td>
                  <td className="px-4 py-4 font-mono text-xs text-text">{rendering.example}</td>
                  <td className="px-4 py-4 text-xs text-muted leading-relaxed">{rendering.lives}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 grid md:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-3">
          {toolChainExamples.map((item, index) => (
            <div key={item.label} className="contents">
              <div className={`border border-ink p-4 text-center ${index === 1 ? "bg-accentMuted" : "bg-surface"}`}>
                <div className="font-mono text-[9px] uppercase tracking-[0.08em] text-accentDeep">{item.label}</div>
                <div className="font-mono text-[11px] md:text-xs text-text mt-2 break-words">{item.value}</div>
              </div>
              {index < toolChainExamples.length - 1 && <div className="hidden md:grid place-items-center text-accent text-xl" aria-hidden>→</div>}
            </div>
          ))}
        </div>
        <p className="text-xs italic text-muted mt-3">One identity, every tool—the name stops drifting between Notion, Lucid, and the timeline.</p>
      </section>

      <section id="properties" className="my-16 scroll-mt-28">
        <div className="border-l-4 border-accent pl-4 mb-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-accentDeep">Filterable by design</div>
          <h2 className="font-heading font-bold text-3xl text-text mt-1">How creatives are categorized</h2>
          <p className="text-sm text-muted mt-2 max-w-3xl">The dimensions PFM actually plans, groups, and produces around.</p>
        </div>

        <div className="space-y-8">
          {propertyGroups.map((group, groupIndex) => (
            <div key={group.name}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3 border-b border-ink pb-2">
                <span className="font-mono text-[10px] text-accentDeep">0{groupIndex + 1}</span>
                <h3 className="font-heading font-bold text-2xl text-text">{group.name}</h3>
                <p className="text-xs text-muted">{group.purpose}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {group.properties.map((property) => (
                  <div key={property.name} className="bg-surface border border-ink shadow-elev1 p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-semibold text-text">{property.name}</h4>
                      <span className="font-mono text-[10px] text-accentDeep">{property.example}</span>
                    </div>
                    <p className="text-sm text-muted mt-2 leading-relaxed">{property.description}</p>
                    {property.note && <div className="mt-3 pt-2 border-t border-border font-mono text-[9px] uppercase tracking-[0.05em] text-faint">{property.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="rules" className="my-16 scroll-mt-28">
        <div className="border-l-4 border-accent pl-4 mb-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-accentDeep">Locked behavior</div>
          <h2 className="font-heading font-bold text-3xl text-text mt-1">Naming rules</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {namingRules.map((rule, index) => (
            <div key={rule.title} className="bg-surface border border-ink shadow-elev1 p-4 flex gap-3">
              <span className="grid place-items-center h-7 w-7 bg-accent text-white border border-ink font-mono text-[10px] font-bold shrink-0">{index + 1}</span>
              <div>
                <h3 className="font-semibold text-text">{rule.title}</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">{rule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="instructions" className="my-16 scroll-mt-28">
        <div className="border-l-4 border-accent pl-4 mb-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-accentDeep">Request anatomy</div>
          <h2 className="font-heading font-bold text-3xl text-text mt-1">The stronger Instructions block</h2>
          <p className="text-sm text-muted mt-2 max-w-3xl">The familiar brief stays intact. The spec lives in the board properties; the four callouts and reuse map make the production contract scannable.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {instructionBlocks.map((block, index) => (
            <div key={block.name} className={`border border-ink shadow-elev1 p-5 ${index === 1 ? "bg-surface" : "bg-accentMuted"}`}>
              <div className="font-mono text-[10px] text-accentDeep">0{index + 1}</div>
              <h3 className="font-heading font-bold text-xl text-text mt-2">{block.name}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{block.description}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">The numbered Copy script and Asset Gen staging block are unchanged—this is a consistent identity layer, not a new editing format to learn.</p>
      </section>
    </div>
  );
}
