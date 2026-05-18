import { skills } from "@/content/skills";

const categoryLabels: Record<string, string> = {
  pipeline: "Production pipelines",
  writing: "Writing / script craft",
  image: "Image prompting + generation",
  video: "Video generation",
  utility: "Utility",
};

export default function SkillsSection() {
  const byCategory = skills.reduce((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <section id="skills" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Reference</div>
        <h2 className="text-3xl font-bold">Skills</h2>
        <p className="text-muted mt-2 max-w-3xl">
          PFM's installed Claude skills. The <span className="inline-block px-2 py-0.5 rounded text-xs font-mono bg-accent text-bg ml-1">Code</span> badge means the skill needs Claude Code locally (Higgsfield CLI, Lucid Link, Python helpers). The <span className="inline-block px-2 py-0.5 rounded text-xs font-mono border border-accent text-accent ml-1">Cowork</span> badge means it works in pure chat mode and is included in the Cowork plugin.
        </p>
      </div>

      <div className="my-8 border border-accent rounded-lg p-6 bg-accentMuted">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <div className="text-xs uppercase tracking-widest text-accent mb-2">For Cowork</div>
            <h3 className="text-xl font-bold mb-2">Download the Cowork plugin</h3>
            <p className="text-sm text-muted leading-relaxed">
              Bundles all six writing &amp; prompting skills (the ones marked{" "}
              <span className="inline-block px-1.5 py-0.5 rounded text-xs font-mono border border-accent text-accent">Cowork</span>
              ) into a single <code className="font-mono text-accent">.plugin</code> file. Upload once to your Cowork org and every team member sees the skills under <strong>Customize skills</strong>.
            </p>
          </div>
          <a
            href="/pfm-writing-skills.plugin"
            download
            className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-bg font-semibold rounded hover:bg-accentHover transition-colors whitespace-nowrap"
          >
            ⬇ Download .plugin
          </a>
        </div>
      </div>

      {Object.entries(byCategory).map(([cat, group]) => (
        <div key={cat} className="my-10">
          <h3 className="text-xl font-bold mb-3 text-accent">{categoryLabels[cat] ?? cat}</h3>
          <div className="space-y-3">
            {group.map((s) => (
              <div key={s.name} className="border border-border rounded-lg p-5 bg-surface/50">
                <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
                  <div>
                    <div className="text-lg font-semibold">{s.title}</div>
                    <div className="text-xs font-mono text-muted">{s.name}</div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap items-center">
                    {s.worksIn.includes("code") && (
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-accent text-bg">Code</span>
                    )}
                    {s.worksIn.includes("cowork") && (
                      <span className="px-2 py-0.5 rounded text-xs font-mono border border-accent text-accent">Cowork</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted mt-2 leading-relaxed">{s.description}</p>
                <div className="mt-3">
                  <a
                    href={`/skills/${s.name}/SKILL.md`}
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-accent transition-colors"
                  >
                    ⬇ Download SKILL.md
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className="text-sm text-muted border-t border-border pt-4 mt-6">
        <strong className="text-text">Updating from a downloaded file:</strong> if you uploaded an individual SKILL.md to Cowork manually (instead of using the .plugin bundle), re-download from here whenever a skill ships an update on the changelog below — Cowork only holds your last-uploaded copy.
      </p>
    </section>
  );
}
