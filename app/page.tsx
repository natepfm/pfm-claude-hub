import fs from "fs";
import path from "path";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CopyBlock from "@/components/CopyBlock";
import { distributedSkillRows, skillRows } from "@/content/skillsRegistry";
import { dicts } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

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

// Second of the two gates. proxy.ts already turns away unauthenticated
// requests; every page re-checks server-side so no internal content can
// render from a middleware misconfiguration alone.
export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const changelog = getChangelogStats();
  const t = dicts[await getLocale()];

  const destinations = [
    { n: "01", href: "/workflow", icon: "⚡", title: t.home_card_workflow_t, desc: t.home_card_workflow_d, tone: "bg-accentMuted" },
    { n: "02", href: "/skills", icon: "🧠", title: t.home_card_skills_t, desc: t.home_card_skills_d, tone: "bg-tintBlue" },
    { n: "03", href: "/creatives", icon: "🎬", title: t.home_card_creatives_t, desc: t.home_card_creatives_d, tone: "bg-successMuted" },
    { n: "04", href: "/resources", icon: "📚", title: t.home_card_resources_t, desc: t.home_card_resources_d, tone: "bg-surface" },
  ];

  return (
    <div>
      <header className="mb-12 pt-2">
        <div className="inline-flex items-center gap-2 border border-ink bg-surface px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text mb-6">
          <span aria-hidden className="inline-block w-2 h-2 bg-accent" />
          {t.home_badge}
        </div>
        <h1 className="font-heading font-bold text-4xl md:text-6xl text-text leading-[1.08]">
          {t.home_h1_a} <em>{t.home_h1_b}</em>
        </h1>
        <p className="text-muted text-lg max-w-2xl mt-5">
          {t.home_sub}
        </p>
      </header>

      <section className="mb-10" aria-label="Announcement">
        <div className="bg-tintBlue border border-ink shadow-elev2 p-5 md:p-6">
          <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep mb-2">{t.home_ann_label}</div>
          <h2 className="font-heading font-bold text-2xl text-text">{t.home_ann_title}</h2>
          <p className="text-sm text-text mt-3 max-w-3xl">
            {t.home_ann_body}
          </p>
          <p className="text-sm text-muted mt-2 max-w-3xl">
            {t.home_ann_slack}
          </p>
        </div>
      </section>

      <section aria-label="System status">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{t.home_stat_skills}</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{distributedSkillRows.length + skillRows.filter((s) => s.tier === "command").length}</div>
            <Link href="/skills" className="text-xs mt-1.5 inline-block text-successHover font-medium hover:text-accentHover underline underline-offset-2">{t.home_stat_skills_link}</Link>
          </div>
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{t.home_stat_stages}</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{WORKFLOW_STAGES}</div>
            <div className="text-xs mt-1.5 text-muted">{t.home_stat_stages_sub}</div>
          </div>
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{t.home_stat_changelog}</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{changelog.count}</div>
            <Link href="/workflow#changelog" className="text-xs mt-1.5 inline-block text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">{t.home_stat_changelog_link}</Link>
          </div>
          <div className="bg-surface border border-ink shadow-elev1 p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{t.home_stat_editors}</div>
            <div className="font-heading font-bold text-4xl mt-2 tabular-nums">{EDITORS_ON_CLAUDE}</div>
            <div className="text-xs mt-1.5 text-muted">{t.home_stat_editors_sub}</div>
          </div>
        </div>
      </section>

      {changelog.headline && (
        <section className="mt-5">
          <div className="bg-accentMuted border border-ink shadow-elev1 px-5 py-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep shrink-0">{t.home_latest} · {changelog.date}</span>
            <span className="text-sm text-text font-medium min-w-0">{changelog.headline}</span>
            <Link href="/workflow#changelog" className="font-mono text-[11px] uppercase tracking-[0.08em] text-accentDeep font-medium hover:text-accentHover underline underline-offset-2 ml-auto shrink-0">{t.home_latest_link}</Link>
          </div>
        </section>
      )}

      <section className="mt-10" aria-labelledby="update-heading">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h2 id="update-heading" className="font-heading font-bold text-[26px] text-text">{t.home_install_h}</h2>
          <Link href="/skills" className="font-mono text-[11px] uppercase tracking-[0.08em] text-accentDeep underline underline-offset-2">{t.home_install_link}</Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep mb-2">{t.home_install_mac}</div>
            <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
          </div>
          <div>
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-accentDeep mb-2">{t.home_install_win}</div>
            <CopyBlock code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
          </div>
        </div>
        <p className="text-xs text-muted mt-3">{t.home_install_note}</p>
      </section>

      <section className="mt-14" aria-labelledby="explore-heading">
        <h2 id="explore-heading" className="font-heading font-bold text-[26px] text-text mb-4">{t.home_explore_h}</h2>
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
          {t.home_newmachine_a} <Link href="/onboarding" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">{t.home_newmachine_b}</Link>.
        </p>
      </section>
    </div>
  );
}
