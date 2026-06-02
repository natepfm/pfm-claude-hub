import type { ReactNode } from "react";

function StepBadge({ n }: { n: number }) {
  return (
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-bg text-xs font-bold shrink-0">
      {n}
    </span>
  );
}

function DownArrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2 text-accent">
      <span className="text-xl leading-none">↓</span>
      <span className="text-[11px] text-muted">{label}</span>
    </div>
  );
}

function CmdGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-muted mb-1.5">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CmdRow({ phrase, note }: { phrase: string; note: string }) {
  return (
    <div className="leading-snug">
      <code className="font-mono text-xs text-accent">&quot;{phrase}&quot;</code>
      <span className="text-[10px] text-muted"> — {note}</span>
    </div>
  );
}

export default function SystemDiagram() {
  return (
    <section id="how-it-works" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Reference</div>
        <h2 className="text-3xl font-bold">How the system works</h2>
        <p className="text-muted mt-2 max-w-3xl">
          One shared skill system across two Claude accounts, bridged by Lucid Link. Skills flow{" "}
          <em className="text-text not-italic">out</em> to the team; the repeatable workflows editors
          discover flow <em className="text-text not-italic">back in</em> — a flywheel that gets better
          the more everyone uses it.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
        {/* LEFT — the flow */}
        <div className="border border-border rounded-lg bg-surface/40 p-6">
          <div className="flex flex-col max-w-sm mx-auto">
            {/* Master */}
            <div className="border border-border rounded-lg p-4 bg-surface">
              <div className="flex items-center gap-2 mb-1">
                <StepBadge n={1} />
                <span className="text-xs uppercase tracking-widest text-accent">Master Account</span>
              </div>
              <div className="text-sm text-muted mt-1">
                Where every skill is <strong className="text-text">built &amp; maintained</strong> — the source of truth.
              </div>
            </div>

            <DownArrow label="ship · 3-mirror" />

            {/* Lucid */}
            <div className="border-2 border-accent rounded-lg p-4 bg-accentMuted">
              <div className="flex items-center gap-2 mb-1">
                <StepBadge n={2} />
                <span className="text-xs uppercase tracking-widest text-accent">Lucid Link · shared</span>
              </div>
              <div className="font-mono text-sm text-text">6. Claude PFM/</div>
              <div className="text-sm text-muted mt-1">
                <code className="font-mono text-accent">skills/</code> out ·{" "}
                <code className="font-mono text-accent">Skill Proposals/</code> in —{" "}
                <strong className="text-text">the bridge.</strong>
              </div>
            </div>

            <DownArrow label="pull · update.sh" />

            {/* Editors */}
            <div className="border border-border rounded-lg p-4 bg-surface">
              <div className="flex items-center gap-2 mb-1">
                <StepBadge n={3} />
                <span className="text-xs uppercase tracking-widest text-accent">Editor Account</span>
              </div>
              <div className="text-sm text-muted mt-1">
                Shared team account — editors <strong className="text-text">run the flows</strong> &amp; deliver assets.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — command cheat-sheet */}
        <aside className="mt-6 lg:mt-0 border border-border rounded-lg bg-surface p-5">
          <div className="text-xs uppercase tracking-widest text-accent mb-1">Quick start</div>
          <h3 className="text-lg font-bold mb-3">Say this to start a skill</h3>
          <div className="space-y-4">
            <CmdGroup title="Generate">
              <CmdRow phrase="run the HVG flow" note="Veo video batch" />
              <CmdRow phrase="run the HIG flow" note="b-roll images" />
              <CmdRow phrase="run the VSL for [state]" note="VSL slides + clips" />
              <CmdRow phrase="do the [state] pixar music video" note="Pixar assets" />
            </CmdGroup>
            <CmdGroup title="Write">
              <CmdRow phrase="write a Veo script" note="story-ad script" />
              <CmdRow phrase="convert this LC to a podcast" note="LC → podcast" />
              <CmdRow phrase="beat this out" note="story beats" />
            </CmdGroup>
            <CmdGroup title="Check">
              <CmdRow phrase="QC the clips" note="audio QC" />
              <CmdRow phrase="run visual QC" note="frame QC" />
            </CmdGroup>
            <CmdGroup title="Deliver">
              <CmdRow phrase="post the assets" note="delivery comment" />
              <CmdRow phrase="report this, mark done" note="turn-in → Done" />
            </CmdGroup>
            <CmdGroup title="Contribute">
              <CmdRow phrase="this should be a skill" note="propose-skill" />
            </CmdGroup>
          </div>
          <p className="text-[11px] text-muted mt-4">
            Full list + descriptions in{" "}
            <a href="#skills" className="text-accent hover:text-accentHover underline">Skills</a> below.
          </p>
        </aside>
      </div>

      {/* The flywheel — full width under both columns */}
      <div className="mt-6 border border-accent/40 rounded-lg p-4 bg-surface/60">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none text-accent shrink-0">↺</span>
          <div className="text-sm text-muted leading-relaxed">
            <strong className="text-text">The flywheel.</strong> An editor hits a repeatable workflow and
            says <span className="text-text">&quot;this should be a skill&quot;</span> →{" "}
            <code className="font-mono text-accent">propose-skill</code> drops a proposal in{" "}
            <code className="font-mono text-accent">Skill Proposals/</code> → gets triaged + built on the
            master account → it ships back to everyone on the next update,{" "}
            <strong className="text-text">credited to the editor</strong>. The system compounds from what
            the team discovers.
          </div>
        </div>
      </div>

      <p className="text-xs text-muted mt-4 text-center">
        📖 It&apos;s all documented here on <strong className="text-text">the Hub</strong> — reference,
        changelog &amp; downloads.
      </p>
    </section>
  );
}
