import PlaceholderCard from "@/components/PlaceholderCard";
import { landerGroups, landersSourceUrl } from "@/content/landers";

// PFM Media Assets library folders — open in LinkYourFile (needs Lucid Link access).
const sharedAssets = [
  {
    label: "New Editor Assets",
    desc: "DaVinci assets to install during first-time setup.",
    url: "https://linkyourfile.com/link?p=L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzEuIFBGTSBNZWRpYSBBc3NldHMvRGF2aW5jaSBBc3NldHMgLSBQRk0vTmV3IEVkaXRvciBBc3NldHMgRm9sZGVy",
  },
  {
    label: "DaVinci Plug-Ins",
    desc: "Snap Captions, Magic Zoom, transitions, timer bars.",
    url: "https://linkyourfile.com/link?p=L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzEuIFBGTSBNZWRpYSBBc3NldHMvRGF2aW5jaSBBc3NldHMgLSBQRk0vUGx1Zy1JbnMgLSBEYXZpY2kgQXNzZXRz",
  },
  {
    label: "Fonts",
    desc: "The PFM font library.",
    url: "https://linkyourfile.com/link?p=L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzEuIFBGTSBNZWRpYSBBc3NldHMvRm9udHMgLSBQRk0%3D",
  },
  {
    label: "Music",
    desc: "Music beds — commercial, TikTok, meme tracks.",
    url: "https://linkyourfile.com/link?p=L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzEuIFBGTSBNZWRpYSBBc3NldHMvTXVzaWMgLSBQRk0%3D",
  },
  {
    label: "Sound Effects",
    desc: "Cinematic hits, impacts, phone sounds, and more.",
    url: "https://linkyourfile.com/link?p=L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzEuIFBGTSBNZWRpYSBBc3NldHMvU291bmQgRWZmZWN0cyAtIFBGTQ%3D%3D",
  },
  {
    label: "Stock B-Roll",
    desc: "Stock footage library.",
    url: "https://linkyourfile.com/link?p=L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzEuIFBGTSBNZWRpYSBBc3NldHMvU3RvY2sgQi1Sb2xsIC0gUEZN",
  },
  {
    label: "UGC B-Roll",
    desc: "UGC-style B-roll library.",
    url: "https://linkyourfile.com/link?p=L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzEuIFBGTSBNZWRpYSBBc3NldHMvVUNHIEItUm9sbCAtIFBGTQ%3D%3D",
  },
];

export default function ResourcesPage() {
  return (
    <div>
      <header className="mb-12">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Editors Hub · Resources</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
          <span className="text-accent">Resources</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          The reference shelf — landers, logins, brand briefs, shared assets, and how-to guides editors reach for during a project. Landers and shared assets are live below; the rest is a draft frame — tell me what belongs and I&apos;ll fill it in.
        </p>
      </header>

      {/* Landers — by vertical (mirrors the Discount Landers Notion page) */}
      <section id="landers" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text">🛬 Landers</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          The landing pages our ads point to, by vertical. Source of truth:{" "}
          <a href={landersSourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accentHover underline">
            Discount Landers in Notion ↗
          </a>
          .
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {landerGroups.map((g) => (
            <div key={g.vertical} className="border border-border rounded-lg p-4 bg-surface/50">
              <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-3">{g.vertical}</div>
              <div className="space-y-3">
                {g.landers.map((l) => (
                  <div key={l.label}>
                    <div className="text-sm font-medium text-text">{l.label}</div>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-accent hover:text-accentHover underline break-all"
                    >
                      {l.url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

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
        <p className="text-muted text-sm mb-5 max-w-3xl">
          The PFM Media Assets library — open each folder in LinkYourFile (needs Lucid Link access).
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {sharedAssets.map((a) => (
            <a
              key={a.label}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-border rounded-lg p-4 bg-surface/50 hover:border-accent transition-colors"
            >
              <div className="font-semibold text-text">
                {a.label} <span className="text-accent">↗</span>
              </div>
              <div className="text-sm text-muted leading-relaxed mt-0.5">{a.desc}</div>
            </a>
          ))}
        </div>
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
