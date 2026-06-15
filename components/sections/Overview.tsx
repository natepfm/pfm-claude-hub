export default function Overview() {
  return (
    <section id="overview" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">How to use</div>
        <h2 className="text-3xl font-bold drop-shadow-text-depth">The PFM Claude system</h2>
        <p className="text-muted mt-2 max-w-3xl">
          A purpose-built pipeline that turns a Notion request into delivered Veo clips and Nano Banana b-roll, with PFM&apos;s locked conventions applied at every step. Here&apos;s what to say for each task.
        </p>
      </div>

      {/* How to use — task → trigger quick reference */}
      <div className="my-10">
        <h3 className="text-xl font-bold mb-2">Start here — what to say for each job</h3>
        <p className="text-muted text-sm mb-5 max-w-3xl">
          You almost never name a skill. Drop a Notion request link <span className="italic">or</span> just say what you want in plain English — Claude recognizes the task and loads the right skill on its own. Here&apos;s the menu.
        </p>

        {/* Prerequisites callout */}
        <div className="mb-6 p-4 bg-accentMuted border-l-4 border-accent rounded-r text-sm text-text">
          <div className="font-semibold mb-1">Two things to get right first</div>
          <div className="text-muted">
            <span className="text-text font-medium">1. Point Claude at the project folder</span> — open the terminal inside the Lucid Link project folder, <span className="italic">or</span> drop a <span className="text-text font-medium">LinkYourFile link</span> to the folder (Claude reads the path straight from the link). Either way it finds <code>Elements/</code>. <span className="text-text font-medium">2. Be signed in to Higgsfield</span> — the CLI needs auth to fire anything. Both are checked automatically; if either&apos;s off, Claude stops and tells you before any spend.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            { icon: "🎬", goal: "Generate Veo videos", say: 'Drop the Notion request link (while in the project folder) — or "run the HVG flow" / "fire the gens"', skill: "hvg-flow" },
            { icon: "🖼️", goal: "Generate b-roll images", say: '"fire the b-roll" / "run HIG" — or just describe the shots you need', skill: "hig-flow" },
            { icon: "✍️", goal: "Write or rebalance a Veo script", say: 'Paste a script + "make this Veo-ready" — or "write a Veo script for [concept]"', skill: "veo-script-writing" },
            { icon: "🎙️", goal: "Long-copy ad → podcast script", say: 'Paste the Facebook long-copy + "convert this to a podcast script" / "LC to video"', skill: "lc-to-video-podcast" },
            { icon: "🧱", goal: "Beat out a story", say: '"beat this out" / "write story beats from [reference]"', skill: "story-beats" },
            { icon: "📺", goal: "Wrap it as breaking news", say: '"make this a breaking news segment" / "LATU news version"', skill: "breaking-news-story-ads" },
            { icon: "✅", goal: "QC a finished batch", say: '"run audio QC" / "run visual QC" / "check the clips" — also auto-offered right after a batch downloads', skill: "audio-qc + visual-qc" },
            { icon: "🔁", goal: "One-off image or quick variation", say: '"another one of [character] but [variation]" / "make me a few variations"', skill: "higgsfield-image-generation" },
          ].map((t) => (
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
    </section>
  );
}
