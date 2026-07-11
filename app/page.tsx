import fs from "fs";
import path from "path";
import Link from "next/link";
import CopyBlock from "@/components/CopyBlock";
import { skills } from "@/content/skills";

// ── Dashboard data — everything derives from the repo, nothing invented ──

// Bump when the team grows; source of truth is the Claude Team seat count.
const EDITORS_ON_CLAUDE = 13;

const SECTION_LABEL: Record<string, string> = {
  "gen-auto": "Asset Gen · Auto",
  "gen-manual": "Asset Gen · Pipeline",
  writing: "Writing",
  image: "Image",
  video: "Video",
  utility: "Utility",
};

function getChangelogStats() {
  try {
    const md = fs.readFileSync(path.join(process.cwd(), "content", "CHANGELOG.md"), "utf8");
    const entries = md.match(/^## \d{4}-\d{2}-\d{2}/gm) ?? [];
    const latest = md.match(/##\s+(\d{4}-\d{2}-\d{2})\s*\n([\s\S]*?)(?=\n## |\n*$)/);
    const headline = latest?.[2].split("\n").find((l) => l.startsWith("### "))?.replace("### ", "");
    return { count: entries.length, date: latest?.[1] ?? null, headline: headline ?? null };
  } catch {
    return { count: 0, date: null, headline: null };
  }
}

export default function DashboardPage() {
  const live = skills.filter((s) => !s.status);
  const cowork = live.filter((s) => s.worksIn.includes("cowork"));
  const changelog = getChangelogStats();

  const sections = Object.entries(
    live.reduce<Record<string, number>>((acc, s) => {
      acc[s.category] = (acc[s.category] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

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
          What&apos;s live, what shipped, and the one command that keeps your install current. Numbers come straight from the skills registry and the changelog.
        </p>
      </header>

      {/* ── Stats ── */}
      <section id="stats" className="scroll-mt-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Skills live</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{live.length}</div>
            <div className="text-xs mt-1.5 text-successHover">▲ latest drop {changelog.date ?? "—"}</div>
          </div>
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Cowork-ready</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{cowork.length}</div>
            <div className="text-xs mt-1.5 text-muted">run in pure chat, no repo</div>
          </div>
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Updates shipped</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{changelog.count}</div>
            <div className="text-xs mt-1.5 text-muted">
              <Link href="/claude#changelog" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">changelog →</Link>
            </div>
          </div>
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Editors on Claude</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{EDITORS_ON_CLAUDE}</div>
            <div className="text-xs mt-1.5 text-muted">— full team</div>
          </div>
        </div>
      </section>

      {/* ── Latest update strip ── */}
      {changelog.headline && (
        <section className="mt-5">
          <div className="bg-accentMuted border border-ink shadow-elev1 px-5 py-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep shrink-0">
              Latest · {changelog.date}
            </span>
            <span className="text-sm text-text font-medium min-w-0">{changelog.headline}</span>
            <Link href="/claude#changelog" className="font-mono text-[11px] uppercase tracking-[0.08em] text-accentDeep font-medium hover:text-accentHover underline underline-offset-2 ml-auto shrink-0">
              read it →
            </Link>
          </div>
        </section>
      )}

      {/* ── Sections breakdown + update terminal ── */}
      <section className="mt-10 grid md:grid-cols-2 gap-5 items-start">
        <div className="bg-surface border border-ink shadow-elev1 p-2">
          <div className="px-3 pt-3 pb-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">By section</div>
          {sections.map(([cat, n]) => (
            <div key={cat} className="flex items-center gap-3 px-3 py-2.5 hover:bg-bg transition-colors">
              <span className="w-2 h-2 bg-accent border border-ink shrink-0" aria-hidden />
              <span className="flex-1 text-sm text-text">{SECTION_LABEL[cat]}</span>
              <span className="font-mono text-sm tabular-nums text-muted">{n}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 px-3 py-2.5 border-t border-border mt-1">
            <span className="w-2 h-2 bg-warning border border-ink shrink-0" aria-hidden />
            <span className="flex-1 text-sm text-muted">Frozen / retired</span>
            <span className="font-mono text-sm tabular-nums text-muted">{skills.length - live.length}</span>
          </div>
        </div>

        <div>
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep mb-2">
            🔄 Update my skills — Mac · Terminal
          </div>
          <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
          <p className="text-xs text-muted mt-2">
            Windows editors: same script via Git Bash at <code className="font-mono">/l/PFM MEDIA MASTER FOLDER/…</code> — full walkthrough on the <Link href="/claude" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">Claude page</Link>. Restart Claude Desktop after.
          </p>
        </div>
      </section>

      {/* ── Skills table ── */}
      <section id="skills" className="mt-12 scroll-mt-8">
        <h2 className="font-heading font-bold text-[26px] text-text mb-4">Skills registry</h2>
        <div className="bg-surface border border-ink shadow-elev2 overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[640px]">
            <thead>
              <tr>
                <th className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted text-left px-4 py-3 border-b border-ink">Skill</th>
                <th className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted text-left px-4 py-3 border-b border-ink">Section</th>
                <th className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted text-left px-4 py-3 border-b border-ink">Runs in</th>
                <th className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted text-left px-4 py-3 border-b border-ink">Status</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.name} className={`transition-colors hover:bg-bg ${s.status ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 border-b border-border">
                    <div className="font-mono text-[13px] text-text">{s.name}</div>
                    <div className="text-xs text-muted mt-0.5 max-w-md truncate">{s.title}</div>
                  </td>
                  <td className="px-4 py-3 border-b border-border text-muted whitespace-nowrap">{SECTION_LABEL[s.category]}</td>
                  <td className="px-4 py-3 border-b border-border">
                    <div className="flex gap-1.5">
                      {s.worksIn.includes("code") && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 bg-surface2 border border-borderInput text-muted">Code</span>
                      )}
                      {s.worksIn.includes("cowork") && (
                        <span className="font-mono text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 bg-tintBlue border border-borderInput text-text">Cowork</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-border whitespace-nowrap">
                    {s.status === "frozen" && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 bg-amber-100/70 border border-warning text-text">Frozen</span>
                    )}
                    {s.status === "retired" && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.06em] px-1.5 py-0.5 bg-surface2 border border-borderInput text-muted">Retired</span>
                    )}
                    {!s.status && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-text">
                        <span className="w-2 h-2 rounded-full bg-success" aria-hidden /> Live
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted mt-3">
          Source of truth: <code className="font-mono">content/skills.ts</code> — the same registry that renders the <Link href="/claude#skills" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">Skills section</Link>.
        </p>
      </section>

      {/* ── Go deeper ── */}
      <section className="mt-14">
        <div className="grid md:grid-cols-3 gap-5">
          <Link href="/claude" className="block border border-ink bg-accentMuted shadow-elev2 hover:shadow-elev3 hover:-translate-y-0.5 transition-all duration-200">
            <div className="px-4 py-2 border-b border-ink font-mono text-[11px] font-medium text-text">01</div>
            <div className="p-4">
              <div className="font-heading font-bold text-xl text-text mb-1">🤖 Claude</div>
              <div className="text-xs text-muted">Pipeline, setup, skills, changelog</div>
            </div>
          </Link>
          <Link href="/creatives" className="block border border-ink bg-tintBlue shadow-elev2 hover:shadow-elev3 hover:-translate-y-0.5 transition-all duration-200">
            <div className="px-4 py-2 border-b border-ink font-mono text-[11px] font-medium text-text">02</div>
            <div className="p-4">
              <div className="font-heading font-bold text-xl text-text mb-1">🎬 Creatives</div>
              <div className="text-xs text-muted">Every type + variation we run</div>
            </div>
          </Link>
          <Link href="/resources" className="block border border-ink bg-successMuted shadow-elev2 hover:shadow-elev3 hover:-translate-y-0.5 transition-all duration-200">
            <div className="px-4 py-2 border-b border-ink font-mono text-[11px] font-medium text-text">03</div>
            <div className="p-4">
              <div className="font-heading font-bold text-xl text-text mb-1">📚 Resources</div>
              <div className="text-xs text-muted">Landers, tools, shared assets</div>
            </div>
          </Link>
        </div>
        <p className="text-sm text-muted mt-5">
          New machine to set up? The first-day walkthrough still lives at{" "}
          <Link href="/onboarding" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">Onboarding</Link> — Sam preps laptops before day one, so most editors never need it.
        </p>
      </section>
    </div>
  );
}
