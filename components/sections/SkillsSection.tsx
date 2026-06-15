import { skills } from "@/content/skills";

const categoryLabels: Record<string, string> = {
  "gen-manual": "Asset generation — manual (you fire it)",
  "gen-auto": "Asset generation — automated (AGF · the mini)",
  writing: "Writing / script craft",
  image: "Image prompting + generation",
  video: "Video generation",
  utility: "Utility",
};

// Display order for the expanded catalog (generation first, utility last).
const categoryOrder = ["gen-manual", "gen-auto", "writing", "image", "video", "utility"];

// What to say to trigger each job — the practical phrasebook.
const tasks = [
  { icon: "🎬", goal: "Generate Veo videos", say: 'Drop the Notion request link (while in the project folder) — or "run the HVG flow" / "fire the gens"', skill: "hvg-flow" },
  { icon: "🖼️", goal: "Generate b-roll images", say: '"fire the b-roll" / "run HIG" — or just describe the shots you need', skill: "hig-flow" },
  { icon: "✍️", goal: "Write or rebalance a Veo script", say: 'Paste a script + "make this Veo-ready" — or "write a Veo script for [concept]"', skill: "veo-script-writing" },
  { icon: "🎙️", goal: "Long-copy ad → podcast script", say: 'Paste the Facebook long-copy + "convert this to a podcast script" / "LC to video"', skill: "lc-to-video-podcast" },
  { icon: "🧱", goal: "Beat out a story", say: '"beat this out" / "write story beats from [reference]"', skill: "story-beats" },
  { icon: "📺", goal: "Wrap it as breaking news", say: '"make this a breaking news segment" / "LATU news version"', skill: "breaking-news-story-ads" },
  { icon: "✅", goal: "QC a finished batch", say: '"run audio QC" / "run visual QC" / "check the clips" — also auto-offered right after a batch downloads', skill: "audio-qc + visual-qc" },
  { icon: "🔁", goal: "One-off image or quick variation", say: '"another one of [character] but [variation]" / "make me a few variations"', skill: "higgsfield-image-generation" },
];

export default function SkillsSection() {
  const byCategory = skills.reduce((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <section id="skills" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Reference</div>
        <h2 className="text-3xl font-bold drop-shadow-text-depth">Skills</h2>
        <p className="text-muted mt-2 max-w-3xl">
          PFM&apos;s installed Claude skills. You almost never name one — drop a Notion request link <span className="italic">or</span> just say what you want in plain English, and Claude recognizes the task and loads the right skill on its own. The <span className="inline-block px-2 py-0.5 rounded text-xs font-mono bg-accent text-bg ml-1">Code</span> badge means the skill needs Claude Code locally (Higgsfield CLI, Lucid Link, Python helpers); the <span className="inline-block px-2 py-0.5 rounded text-xs font-mono border border-accent text-accent ml-1">Cowork</span> badge means it works in pure chat mode and is in the Cowork plugin.
        </p>
      </div>

      {/* Quick start — what to say for each job */}
      <div className="my-8">
        <h3 className="text-xl font-bold mb-2">Start here — what to say for each job</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          The task, what you say to trigger it, and the skill it loads.
        </p>

        {/* Prerequisites callout */}
        <div className="mb-6 p-4 bg-accentMuted border-l-4 border-accent rounded-r text-sm text-text">
          <div className="font-semibold mb-1">Two things to get right first</div>
          <div className="text-muted">
            <span className="text-text font-medium">1. Point Claude at the project folder</span> — open the terminal inside the Lucid Link project folder, <span className="italic">or</span> drop a <span className="text-text font-medium">LinkYourFile link</span> to the folder (Claude reads the path straight from the link). Either way it finds <code>Elements/</code>. <span className="text-text font-medium">2. Be signed in to Higgsfield</span> — the CLI needs auth to fire anything. Both are checked automatically; if either&apos;s off, Claude stops and tells you before any spend.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {tasks.map((t) => (
            <div key={t.goal} className="rounded-lg p-4 bg-surface-gradient shadow-elev1 ring-1 ring-border/50 hover:shadow-elev2 hover:-translate-y-0.5 hover:ring-accent/50 transition-all duration-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{t.icon}</span>
                <span className="font-semibold text-text">{t.goal}</span>
              </div>
              <div className="text-xs uppercase tracking-wide text-accent font-semibold mb-1">You say</div>
              <div className="text-sm text-muted leading-relaxed">{t.say}</div>
              <div className="mt-2 text-xs font-mono text-muted">↳ {t.skill}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-sm text-muted max-w-3xl">
          Once you trigger a gen flow, Claude runs every setup step silently and stops only at a <strong className="text-text">preflight</strong> — one block showing the model, clip/image count, and exact credit cost. Nothing fires until you type <code>fire</code>.
        </div>
      </div>

      {/* The full catalog */}
      <div className="mt-14 mb-8">
        <h3 className="text-xl font-bold mb-6 pb-2 border-b border-white/[0.08]">Every skill, by category</h3>
        <div className="space-y-10">
          {categoryOrder
            .filter((cat) => byCategory[cat]?.length)
            .map((cat) => {
              const group = byCategory[cat];
              return (
                <div key={cat}>
                  <div className="flex items-baseline gap-3 flex-wrap mb-4 pb-2 border-b border-white/[0.08]">
                    <h4 className="text-lg font-bold text-accent drop-shadow-text-depth">{categoryLabels[cat] ?? cat}</h4>
                    <span className="text-xs font-mono text-muted">{group.length} {group.length === 1 ? "skill" : "skills"}</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {group.map((s) => (
                      <div key={s.name} className="rounded-lg p-5 bg-surface-gradient shadow-elev1 ring-1 ring-border/50 hover:shadow-elev2 hover:ring-border transition-all duration-200 flex flex-col">
                        <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
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
                        <p className="text-sm text-muted mt-2 leading-relaxed flex-1">{s.description}</p>
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
              );
            })}
        </div>
      </div>

      <div className="my-8 rounded-lg p-6 bg-glass-accent backdrop-blur-xl shadow-glow-accent ring-1 ring-accent/40">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[280px]">
            <div className="text-xs uppercase tracking-widest text-accent mb-2">For Cowork</div>
            <h3 className="text-xl font-bold mb-2">Download the Cowork plugin</h3>
            <p className="text-sm text-muted leading-relaxed">
              Bundles all six chat-mode skills (everything marked{" "}
              <span className="inline-block px-1.5 py-0.5 rounded text-xs font-mono border border-accent text-accent">Cowork</span>
              ) into a single <code className="font-mono text-accent">.plugin</code> file. Upload once to your Cowork org and every team member sees the skills under <strong>Customize skills</strong>.
            </p>
          </div>
          <a
            href="/pfm-cowork-skills.plugin"
            download
            className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-bg font-semibold rounded hover:bg-accentHover transition-colors whitespace-nowrap"
          >
            ⬇ Download .plugin
          </a>
        </div>
      </div>

      <div className="my-8 rounded-lg p-6 bg-glass-accent backdrop-blur-xl shadow-glow-accent ring-1 ring-accent/40">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Contribute</div>
        <h3 className="text-xl font-bold mb-2">Found a workflow worth a skill? Propose it.</h3>
        <p className="text-sm text-muted leading-relaxed">
          If you keep doing the same repeatable process in your projects, it should probably be a skill — no code required on your end. In your Claude Code session, just say{" "}
          <strong className="text-text">&quot;this should be a skill&quot;</strong> (or &quot;make this a skill&quot; / &quot;propose a skill&quot;), and Claude reconstructs the workflow from what you just did, asks a couple quick questions, and drops a proposal in the shared <code className="font-mono text-accent">Skill Proposals</code> folder on Lucid Link. Sam reviews it and builds the keepers into real skills for the whole team, <strong className="text-text">credited to you</strong>. That is the <code className="font-mono text-accent">propose-skill</code> skill.
        </p>
      </div>

      <p className="text-sm text-muted border-t border-border pt-4 mt-6">
        <strong className="text-text">Updating from a downloaded file:</strong> if you uploaded an individual SKILL.md to Cowork manually (instead of using the .plugin bundle), re-download from here whenever a skill ships an update on the changelog below — Cowork only holds your last-uploaded copy.
      </p>
    </section>
  );
}
