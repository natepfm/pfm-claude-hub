import PlaceholderCard from "@/components/PlaceholderCard";

export default function ResourcesPage() {
  return (
    <div>
      <header className="mb-12">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Editors Hub · Resources</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
          <span className="text-accent">Resources</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          The reference shelf — logins, brand briefs, shared assets, and how-to guides editors reach for during a project. (Draft frame — tell me what belongs here and I&apos;ll fill it in.)
        </p>
      </header>

      {/* Tools & logins */}
      <section id="tools" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">🔗 Tools &amp; logins</h2>
        </div>
        <p className="text-muted text-sm mb-4 max-w-3xl">
          Quick links to the tools editors open every day, with the right URL for each.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <PlaceholderCard title="Notion · Video Task Manager">Direct link to the board + how requests flow.</PlaceholderCard>
          <PlaceholderCard title="Higgsfield">Workspace link + plan / credit notes.</PlaceholderCard>
          <PlaceholderCard title="Suno">For music + song-ad work.</PlaceholderCard>
          <PlaceholderCard title="Anything else">Frame.io, Slack, Lucid Link web, etc.</PlaceholderCard>
        </div>
      </section>

      {/* Brand & guidelines */}
      <section id="brand" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">🎨 Brand &amp; guidelines</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <PlaceholderCard title="Vertical briefs">
            Auto, Home Insurance, Concealed Carry — voice, offer types, brand-clean rules. (These already
            live in PFM Context; we can surface or link them here.)
          </PlaceholderCard>
          <PlaceholderCard title="Story-ad conventions">
            6-8s line discipline, breaking-news framing, the do/don&apos;t list — the rules a creative has to pass.
          </PlaceholderCard>
        </div>
      </section>

      {/* Shared assets */}
      <section id="assets" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">🗂️ Shared assets</h2>
        </div>
        <PlaceholderCard title="Where the reusable stuff lives">
          Character masters, reference creatives, templates (DaVinci, Canva decks), b-roll libraries —
          the paths or links editors pull from. Tell me what to list and where it lives.
        </PlaceholderCard>
      </section>

      {/* SOPs & guides */}
      <section id="sops" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">📖 SOPs &amp; guides</h2>
        </div>
        <PlaceholderCard title="Step-by-step playbooks">
          Repeatable processes that aren&apos;t Claude-specific — delivery / export settings, naming
          conventions, QC checklists, how to hand off a finished project. Point me at the existing docs
          (or describe them) and I&apos;ll write them up here.
        </PlaceholderCard>
      </section>
    </div>
  );
}
