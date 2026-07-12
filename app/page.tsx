import fs from "fs";
import path from "path";
import Link from "next/link";
import CopyBlock from "@/components/CopyBlock";

const EDITORS_ON_CLAUDE = 13;
const WORKFLOW_STAGES = 6;

function getChangelogStats() {
  try {
    const md = fs.readFileSync(path.join(process.cwd(), "content", "CHANGELOG.md"), "utf8");
    const entries = md.match(/^## \d{4}-\d{2}-\d{2}/gm) ?? [];
    const latest = md.match(/##\s+(\d{4}-\d{2}-\d{2})\s*\n([\s\S]*?)(?=\n## |\n*$)/);
    const headline = latest?.[2].split("\n").find((line) => line.startsWith("### "))?.replace("### ", "");
    return { count: entries.length, date: latest?.[1] ?? null, headline: headline ?? null };
  } catch {
    return { count: 0, date: null, headline: null };
  }
}

const destinations = [
  { n: "01", href: "/workflow", icon: "⚡", title: "Workflow", desc: "How Claude moves a request from Notion to delivery", tone: "bg-accentMuted" },
  { n: "02", href: "/skills", icon: "🧠", title: "Skills", desc: "The complete operating system: update, search, inspect, download", tone: "bg-tintBlue" },
  { n: "03", href: "/creatives", icon: "🎬", title: "Creatives", desc: "The Notion taxonomy, properties, and naming convention", tone: "bg-successMuted" },
  { n: "04", href: "/resources", icon: "📚", title: "Resources", desc: "Landers, shared assets, tools, and SOPs", tone: "bg-surface" },
];

export default function DashboardPage() {
  const changelog = getChangelogStats();

  return (
    <div>
      <header className="mb-12 pt-2">
        <div className="inline-flex items-center gap-2 border border-ink bg-surface px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text mb-6">
          <span aria-hidden className="inline-block w-2 h-2 bg-accent" />
          Editors Hub · Dashboard
        </div>
        <h1 className="font-heading font-bold text-4xl md:text-6xl text-text leading-[1.08]">
          The state of <em>the system.</em>
        </h1>
        <p className="text-muted text-lg max-w-2xl mt-5">
          The operating snapshot: how the system runs, what shipped, and the commands that keep every editor current.
        </p>
      </header>

      <section aria-label="System status">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Workflow stages</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{WORKFLOW_STAGES}</div>
            <div className="text-xs mt-1.5 text-muted">request → delivered creative</div>
          </div>
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Updates shipped</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{changelog.count}</div>
            <Link href="/workflow#changelog" className="text-xs mt-1.5 inline-block text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">changelog →</Link>
          </div>
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Editors on Claude</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{EDITORS_ON_CLAUDE}</div>
            <div className="text-xs mt-1.5 text-muted">full team</div>
          </div>
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Latest system change</div>
            <div className="font-heading font-bold text-2xl mt-3 tabular-nums">{changelog.date ?? "—"}</div>
            <div className="text-xs mt-2 text-successHover">▲ live on the hub</div>
          </div>
        </div>
      </section>

      {changelog.headline && (
        <section className="mt-5">
          <div className="bg-accentMuted border border-ink shadow-elev1 px-5 py-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep shrink-0">Latest · {changelog.date}</span>
            <span className="text-sm text-text font-medium min-w-0">{changelog.headline}</span>
            <Link href="/workflow#changelog" className="font-mono text-[11px] uppercase tracking-[0.08em] text-accentDeep font-medium hover:text-accentHover underline underline-offset-2 ml-auto shrink-0">read it →</Link>
          </div>
        </section>
      )}

      <section className="mt-10" aria-labelledby="update-heading">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h2 id="update-heading" className="font-heading font-bold text-[26px] text-text">Update my skills</h2>
          <Link href="/skills" className="font-mono text-[11px] uppercase tracking-[0.08em] text-accentDeep underline underline-offset-2">open Skills →</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep mb-2">🍎 Mac · Terminal</div>
            <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
          </div>
          <div>
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep mb-2">🪟 Windows · Git Bash</div>
            <CopyBlock code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
          </div>
        </div>
        <p className="text-xs text-muted mt-3">Restart Claude Desktop after the updater finishes.</p>
      </section>

      <section className="mt-14" aria-labelledby="explore-heading">
        <h2 id="explore-heading" className="font-heading font-bold text-[26px] text-text mb-4">Explore the system</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {destinations.map((item) => (
            <Link key={item.href} href={item.href} className={`block border border-ink ${item.tone} shadow-elev2 hover:shadow-elev3 hover:-translate-y-0.5 transition-all duration-200`}>
              <div className="px-4 py-2 border-b border-ink font-mono text-[11px] font-medium text-text">{item.n}</div>
              <div className="p-4">
                <div className="font-heading font-bold text-xl text-text mb-1">{item.icon} {item.title}</div>
                <div className="text-xs text-muted">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-sm text-muted mt-5">
          New machine? Start with <Link href="/onboarding" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">Onboarding</Link>.
        </p>
      </section>
    </div>
  );
}
