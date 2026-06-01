import { editorTools } from "@/content/editorTools";

export default function EditorSection() {
  return (
    <section id="editor" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Reference</div>
        <h2 className="text-3xl font-bold">Editor</h2>
        <p className="text-muted mt-2 max-w-3xl">
          Claude&apos;s <span className="text-text font-medium">in-app editing tools</span> — these drive DaVinci Resolve (and the rest of the edit stack) to turn a finished gen batch into an actual edit, distinct from the prompt &amp; gen skills above. This list grows as we build the editing side out.
        </p>
      </div>

      <div className="space-y-3">
        {editorTools.map((t) => (
          <div key={t.name} className="border border-border rounded-lg p-5 bg-surface/50">
            <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
              <div>
                <div className="text-lg font-semibold">
                  {t.title}
                  {t.app && <span className="text-sm font-normal text-muted"> · {t.app}</span>}
                </div>
                <div className="text-xs font-mono text-muted">{t.name}</div>
              </div>
              <div className="flex gap-1.5 flex-wrap items-center">
                {t.status === "live" ? (
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-accent text-bg">Live</span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs font-mono border border-accent text-accent">
                    In dev · Sam&apos;s machine
                  </span>
                )}
                {t.phases?.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded text-xs font-mono border border-border text-muted">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted mt-2 leading-relaxed">{t.description}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted border-t border-border pt-4 mt-6">
        <strong className="text-text">In dev</strong> tools run on Sam&apos;s machine only for now — they need DaVinci Resolve with external scripting enabled. Each lands here as{" "}
        <span className="inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-accent text-bg">Live</span>{" "}
        (and in <em>Update my skills</em>) once it&apos;s rolled out to the team.
      </p>
    </section>
  );
}
