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

// SOPs & guides — Notion SOPs + Loom how-to videos.
const sopGuides = [
  {
    group: "Claude setup",
    items: [
      { label: "Set Up ElevenLabs MCP — voice/TTS in Claude Code", kind: "Lucid", url: "https://linkyourfile.com/link?p=L1ZvbHVtZXMvYWRzL1BGTSBNRURJQSBNQVNURVIgRk9MREVSLzYuIENsYXVkZSBQRk0vU09QIC0gU2V0IFVwIEVsZXZlbkxhYnMgTUNQLm1k" },
    ],
  },
  {
    group: "Core SOPs",
    items: [
      { label: "Master Folder Overview", kind: "Notion", url: "https://www.notion.so/powerfoxmedia/1-SOP-PFM-Media-Master-Folder-Overview-15216771e7808064a83ae4a5a24324b3" },
      { label: "DaVinci Overview — watch first", kind: "Notion", url: "https://www.notion.so/powerfoxmedia/2-SOP-PFM-DaVinci-OverviWATCH-FIRST-15216771e78080cd85e6e48a120d85b7" },
      { label: "Creating + Editing a Project", kind: "Notion", url: "https://www.notion.so/powerfoxmedia/4-SOP-Creating-Editing-a-Project-DaVinci-Workflow-15216771e78080989332df9aa2dfefe8" },
      { label: "Using Notion", kind: "Loom", url: "https://www.loom.com/share/d2ac0381358448a4a2d1c76697d97aab" },
    ],
  },
  {
    group: "Workflow guides",
    items: [
      { label: "16:9 → 9:16 editing workflow", kind: "Loom", url: "https://www.loom.com/share/b12e68d30df2405db3256c31264cb91d" },
      { label: "9:16 → 16:9 timeline conversion", kind: "Loom", url: "https://www.loom.com/share/bfaf1168b3dc4f239afe883461363fd6" },
      { label: "Regenerating clip prompts for correct rates", kind: "Loom", url: "https://www.loom.com/share/451a97c53b4d48999608af1e73297059" },
      { label: "Batch state-swap for repo stories", kind: "Loom", url: "https://www.loom.com/share/db5686d6975541209819fcbd6f20dbd7" },
      { label: "Pixar-style ads — brain-dead guide", kind: "Loom", url: "https://www.loom.com/share/8726778a5fab430da2a3b30cad6b1d62" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div>
      <header className="mb-12">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Editors Hub · Resources</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight drop-shadow-text-depth">
          <span className="text-accent drop-shadow-text-glow-accent">Resources</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl">
          The reference shelf — landers, logins, brand briefs, shared assets, and how-to guides editors reach for during a project. Landers, shared assets, and SOP guides are live below; Tools &amp; logins and Brand &amp; guidelines are still draft frames — tell me what belongs and I&apos;ll fill them in.
        </p>
      </header>

      {/* Landers — by vertical (mirrors the Discount Landers Notion page) */}
      <section id="landers" className="my-12 scroll-mt-8">
        <div className="flex items-baseline gap-4 mb-4 border-b border-border pb-2">
          <h2 className="text-2xl font-bold text-text drop-shadow-text-depth">🛬 Landers</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          The landing pages our ads point to, by vertical. Source of truth:{" "}
          <a href={landersSourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accentHover underline">
            Discount Landers in Notion ↗
          </a>
          .
        </p>

        {/* Vertical → lander map */}
        <div className="rounded-lg bg-glass-light backdrop-blur-xl shadow-elev1 ring-1 ring-white/10 p-5 mb-6 max-w-xl">
          <div className="text-[11px] uppercase tracking-widest text-accent mb-3">Vertical → landing pages</div>
          <svg
            viewBox={`0 0 440 ${landerGroups.length * 56 + 16}`}
            className="w-full h-auto block"
            role="img"
            aria-label={`Each vertical maps to its live landing pages: ${landerGroups.map((g) => `${g.vertical} has ${g.landers.length}`).join(", ")}.`}
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <defs>
              <marker id="rsLander" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" fill="#FF6B35" /></marker>
            </defs>
            {landerGroups.map((g, i) => {
              const y = 12 + i * 56;
              const cy = y + 20;
              return (
                <g key={g.vertical}>
                  <rect x={12} y={y} width={150} height={40} rx={9} fill="#141414" stroke="#2a2a2a" strokeWidth={1.5} />
                  <text x={87} y={cy + 5} fill="#fafafa" fontSize={13} fontWeight={600} textAnchor="middle">{g.vertical}</text>
                  <line x1={164} y1={cy} x2={232} y2={cy} stroke="#FF6B35" strokeWidth={2} markerEnd="url(#rsLander)" />
                  <rect x={234} y={y} width={194} height={40} rx={9} fill="#3a1f15" stroke="#FF6B35" strokeWidth={1.5} />
                  <text x={331} y={cy - 1} fill="#fafafa" fontSize={12} fontWeight={600} textAnchor="middle">{g.landers.length} landing {g.landers.length === 1 ? "page" : "pages"}</text>
                  <text x={331} y={cy + 13} fill="#a1a1a1" fontSize={8.5} textAnchor="middle">{[...new Set(g.landers.map((l) => l.label.split(/[ —(]/)[0]))].join(" · ")}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {landerGroups.map((g) => (
            <div key={g.vertical} className="rounded-lg p-4 bg-surface-gradient shadow-elev1 ring-1 ring-border/50">
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
          <h2 className="text-2xl font-bold text-text drop-shadow-text-depth">🔗 Tools &amp; logins</h2>
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
          <h2 className="text-2xl font-bold text-text drop-shadow-text-depth">🎨 Brand &amp; guidelines</h2>
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
          <h2 className="text-2xl font-bold text-text drop-shadow-text-depth">🗂️ Shared assets</h2>
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
              className="block rounded-lg p-4 bg-surface-gradient shadow-elev1 ring-1 ring-border/50 hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200"
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
          <h2 className="text-2xl font-bold text-text drop-shadow-text-depth">📖 SOPs &amp; guides</h2>
        </div>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          Step-by-step playbooks — the core SOPs plus workflow how-tos.{" "}
          <span className="text-muted/80">(Loom = video, Notion = written SOP.)</span>
        </p>
        {sopGuides.map((g) => (
          <div key={g.group} className="mb-6">
            <h3 className="text-sm uppercase tracking-wide text-accent font-semibold mb-3">{g.group}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {g.items.map((it) => (
                <a
                  key={it.label}
                  href={it.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-lg p-3 bg-surface-gradient shadow-elev1 ring-1 ring-border/50 hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200"
                >
                  <span className="text-sm font-medium text-text">
                    {it.label} <span className="text-accent">↗</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted shrink-0">{it.kind}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
