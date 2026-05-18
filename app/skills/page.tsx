import { skills } from "@/content/skills";

export const metadata = { title: "Skills — PFM Claude Hub" };

const categoryLabels: Record<string, string> = {
  pipeline: "Production pipelines",
  writing: "Writing / script craft",
  image: "Image prompting + generation",
  video: "Video generation",
  utility: "Utility",
};

export default function SkillsPage() {
  const byCategory = skills.reduce((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div>
      <header className="mb-8">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Reference</div>
        <h1 className="text-4xl font-bold mb-3">Skills</h1>
        <p className="text-muted max-w-2xl">
          PFM's installed Claude skills. The <span className="inline-block px-2 py-0.5 rounded text-xs font-mono bg-accent text-bg ml-1">Code</span> badge means the skill needs Claude Code locally (Higgsfield CLI, Lucid Link filesystem, Python helpers). The <span className="inline-block px-2 py-0.5 rounded text-xs font-mono border border-accent text-accent ml-1">Cowork</span> badge means it works in pure chat mode and is included in the <code>pfm-writing-skills.plugin</code> for Cowork.
        </p>
      </header>

      {Object.entries(byCategory).map(([cat, group]) => (
        <section key={cat} className="my-10">
          <h2 className="text-2xl font-bold mb-4 text-accent">{categoryLabels[cat] ?? cat}</h2>
          <div className="space-y-3">
            {group.map((s) => (
              <div key={s.name} className="border border-border rounded-lg p-5 bg-surface/50">
                <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
                  <div>
                    <div className="text-lg font-semibold">{s.title}</div>
                    <div className="text-xs font-mono text-muted">{s.name}</div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {s.worksIn.includes("code") && (
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-accent text-bg">
                        Code
                      </span>
                    )}
                    {s.worksIn.includes("cowork") && (
                      <span className="px-2 py-0.5 rounded text-xs font-mono border border-accent text-accent">
                        Cowork
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted mt-2 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
