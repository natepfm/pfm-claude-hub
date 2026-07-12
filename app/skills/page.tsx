"use client";

import { useMemo, useState } from "react";
import {
  SKILLS_AUDIT_DATE,
  coworkSkillFolders,
  coworkSkillFolderSet,
  skillFolder,
  skillRows,
  type SkillRow,
  type SkillTier,
} from "@/content/skillsRegistry";
import PageHero from "@/components/PageHero";
import CopyBlock from "@/components/CopyBlock";

const SECTIONS = ["All", "WR", "AG", "QC", "E", "R", "X"];
const SECTION_LABEL: Record<string, string> = {
  WR: "Writing", AG: "Asset Gen", QC: "QC", E: "Editing", R: "Report", X: "Utility",
};
const SECTION_ORDER: Record<string, number> = { WR: 0, AG: 1, QC: 2, E: 3, R: 4, X: 5 };

const TIERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "hold", label: "Hold" },
  { key: "vendor", label: "Vendor" },
  { key: "restricted", label: "Restricted" },
  { key: "frozen", label: "Frozen" },
  { key: "retired", label: "Retired" },
  { key: "command", label: "Command" },
];

const tierStyle: Record<SkillTier, string> = {
  live: "bg-successMuted text-success",
  hold: "bg-accentMuted text-accentDeep",
  vendor: "bg-tintBlue text-[#1A3A5C]",
  restricted: "bg-surface2 text-muted",
  frozen: "bg-[#FEE2E2] text-[#991B1B]",
  retired: "bg-surface2 text-faint",
  command: "bg-[#EDE9FE] text-[#5B21B6]",
  other: "bg-surface2 text-muted",
};

function Stat({ n, label }: { n: number | string; label: string }) {
  return (
    <div className="flex-1 min-w-[92px] bg-surface shadow-elev1 ring-1 ring-ink p-3 text-center">
      <div className="font-heading font-extrabold text-2xl text-accent leading-none">{n}</div>
      <div className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted mt-1.5">{label}</div>
    </div>
  );
}

export default function SkillsPage() {
  const [q, setQ] = useState("");
  const [sec, setSec] = useState("All");
  const [tier, setTier] = useState("all");
  const [sort, setSort] = useState<{ col: "num" | "id" | "status"; dir: 1 | -1 }>({ col: "num", dir: 1 });
  const [open, setOpen] = useState<string | null>(null);

  const counts = useMemo(() => ({
    total: skillRows.length,
    live: skillRows.filter((s) => s.tier === "live").length,
    hold: skillRows.filter((s) => s.tier === "hold").length,
    flow: skillRows.filter((s) => s.flow).length,
    cowork: coworkSkillFolders.length,
  }), []);

  const rows = useMemo(() => {
    const list = skillRows.filter((s) => {
      if (sec !== "All" && s.section !== sec) return false;
      if (tier !== "all" && s.tier !== tier) return false;
      if (q) {
        const hay = `${s.id} ${s.folder} ${s.forr}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      if (sort.col === "num") {
        cmp = (SECTION_ORDER[a.section] - SECTION_ORDER[b.section]) ||
          (parseInt(a.num.replace(/\D/g, "") || "0") - parseInt(b.num.replace(/\D/g, "") || "0"));
      } else {
        cmp = (a[sort.col] || "").localeCompare(b[sort.col] || "");
      }
      return cmp * sort.dir;
    });
    return sorted;
  }, [q, sec, tier, sort]);

  const toggleSort = (col: "num" | "id" | "status") =>
    setSort((s) => (s.col === col ? { col, dir: (s.dir === 1 ? -1 : 1) as 1 | -1 } : { col, dir: 1 }));

  return (
    <div>
      <PageHero
        eyebrow="Editors Hub · Skills"
        title="Skills"
        subtitle="The core of the PFM editing system—how to update it, what to say, every live workflow and command, and the files that ship to the team."
      />

      <section className="grid md:grid-cols-3 gap-3 mb-8" aria-label="How skills work">
        {[
          ["01", "Say the job", "Use plain English—drop the request, describe the output, or name a command."],
          ["02", "Claude routes it", "The matching skill loads its rules, references, and locked PFM workflow."],
          ["03", "You keep control", "Generation skills stop at preflight before spend; delivery follows the skill's named checks."],
        ].map(([n, title, body]) => (
          <div key={n} className="bg-surface border border-ink shadow-elev1 p-4">
            <div className="font-mono text-[10px] text-accentDeep mb-2">{n}</div>
            <div className="font-heading font-bold text-lg text-text">{title}</div>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">{body}</p>
          </div>
        ))}
      </section>

      <section id="update" className="bg-accentMuted border border-ink shadow-elev2 p-5 md:p-6 mb-8 scroll-mt-28" aria-labelledby="skills-update-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-accentDeep">Keep your install current</div>
            <h2 id="skills-update-heading" className="font-heading font-bold text-2xl text-text mt-1">Update my skills</h2>
          </div>
          <p className="text-xs text-muted">Run after a changelog release, then restart Claude Desktop.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-accentDeep mb-2">🍎 Mac · Terminal</div>
            <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
          </div>
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-accentDeep mb-2">🪟 Windows · Git Bash</div>
            <CopyBlock code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
          </div>
        </div>
      </section>

      {/* stat tiles */}
      <div className="flex flex-wrap gap-2.5 mb-6">
        <Stat n={counts.total} label="Skills" />
        <Stat n={counts.live} label="Live to team" />
        <Stat n={counts.flow} label="Workflows" />
        <Stat n={counts.hold} label="On hold" />
        <Stat n={counts.cowork} label="Cowork" />
      </div>

      {/* controls */}
      <div className="bg-surface shadow-elev1 ring-1 ring-ink p-3 mb-5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search skills — name, folder, or what it does…"
          className="w-full bg-bg ring-1 ring-borderInput px-3 py-2 text-sm text-text placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent mb-3"
        />
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSec(s)}
              className={`font-mono text-[10px] uppercase tracking-[0.05em] px-2.5 py-1 ring-1 ring-ink transition-colors ${
                sec === s ? "bg-accent text-white" : "bg-surface text-muted hover:bg-bg"
              }`}
            >
              {s === "All" ? "All" : `${s} · ${SECTION_LABEL[s]}`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTier(t.key)}
              className={`font-mono text-[10px] uppercase tracking-[0.05em] px-2.5 py-1 ring-1 ring-ink transition-colors ${
                tier === t.key ? "bg-ink text-bg" : "bg-surface text-muted hover:bg-bg"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-mono text-muted mb-2">
        {rows.length} of {skillRows.length} skills
      </div>

      {/* table */}
      <div className="bg-surface shadow-elev1 ring-1 ring-ink overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b-2 border-ink">
              {([["num", "#"], ["id", "Skill"], ["status", "Status"]] as const).map(([col, label]) => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted px-3 py-2.5 cursor-pointer select-none hover:text-text"
                >
                  {label}{sort.col === col ? (sort.dir === 1 ? " ▲" : " ▼") : ""}
                </th>
              ))}
              <th className="font-mono text-[9px] uppercase tracking-[0.06em] text-muted px-3 py-2.5">What it&apos;s for</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <SkillRowView key={s.num + s.id} s={s} open={open === s.num + s.id} onToggle={() => setOpen(open === s.num + s.id ? null : s.num + s.id)} />
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-muted text-sm">No skills match those filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="font-mono text-[10px] text-faint mt-4">
        Canonical registry · audited {SKILLS_AUDIT_DATE} · statuses: Live = synced to the team · Hold / Vendor / Restricted / Command as tagged.
      </p>

      <section className="mt-10 bg-tintBlue border border-ink shadow-elev1 p-5 flex flex-wrap items-center justify-between gap-5">
        <div className="max-w-2xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-accentDeep">Cowork</div>
          <h2 className="font-heading font-bold text-xl text-text mt-1">{coworkSkillFolders.length} chat-mode skills, one plugin</h2>
          <p className="text-sm text-muted mt-1.5">For strategists and non-editor teammates working without a local repo. The bundle matches every registry row marked Cowork.</p>
        </div>
        <a href="/pfm-cowork-skills.plugin" download className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-white font-semibold border border-ink shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all whitespace-nowrap">⬇ Download .plugin</a>
      </section>
    </div>
  );
}

function SkillRowView({ s, open, onToggle }: { s: SkillRow; open: boolean; onToggle: () => void }) {
  return (
    <>
      <tr onClick={onToggle} className="border-b border-border cursor-pointer hover:bg-bg align-top">
        <td className="px-3 py-2.5 font-mono text-[11px] text-muted whitespace-nowrap">{s.num}</td>
        <td className="px-3 py-2.5 whitespace-nowrap">
          <span className="font-mono text-[12px] font-semibold text-text">{s.id}</span>
          {s.flow && <span className="ml-1.5 font-mono text-[8px] font-bold text-accent align-middle">⚡FLOW</span>}
          {coworkSkillFolderSet.has(skillFolder(s)) && <span className="ml-1.5 font-mono text-[8px] font-bold text-[#1A3A5C] align-middle">COWORK</span>}
          <div className="font-mono text-[9px] text-faint">{s.folder}</div>
        </td>
        <td className="px-3 py-2.5 whitespace-nowrap">
          <span className={`inline-block font-mono text-[9px] font-bold uppercase tracking-[0.04em] px-2 py-0.5 ring-1 ring-ink ${tierStyle[s.tier]}`}>
            {s.status}
          </span>
        </td>
        <td className="px-3 py-2.5 text-[12px] text-muted leading-snug">
          {s.forr}
          <span className="text-accent ml-1">{open ? "▾" : "▸"}</span>
        </td>
      </tr>
      {open && (
        <tr className="border-b border-border bg-bg">
          <td colSpan={4} className="px-3 py-3">
            <div className="grid md:grid-cols-3 gap-3 text-[12px]">
              <Detail k="When to reach for it" v={s.when} />
              <Detail k="How it runs" v={s.how} />
              <Detail k="What you get" v={s.get} />
            </div>
            {s.tier === "live" && (
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a href={`/skills/${skillFolder(s)}/SKILL.md`} download className="font-mono text-[10px] uppercase tracking-[0.06em] text-accentDeep font-semibold underline underline-offset-2">⬇ Download SKILL.md</a>
                <span className="text-[10px] text-faint">Folder: {skillFolder(s)}</span>
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-surface ring-1 ring-ink p-2.5">
      <div className="font-mono text-[8px] uppercase tracking-[0.06em] text-accentDeep mb-1">{k}</div>
      <div className="text-text leading-snug">{v || "—"}</div>
    </div>
  );
}
