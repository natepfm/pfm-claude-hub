import Callout from "@/components/Callout";
import CopyBlock from "@/components/CopyBlock";

export const metadata = { title: "Troubleshooting — PFM Claude Hub" };

export default function TroubleshootingPage() {
  return (
    <div>
      <header className="mb-8">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">When something breaks</div>
        <h1 className="text-4xl font-bold mb-3">Troubleshooting</h1>
        <p className="text-muted max-w-2xl">
          The most common stumbles editors hit, with the exact fix. If your problem isn't here, screenshot the error and ping Sam in Slack — don't burn credits guessing.
        </p>
      </header>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-2">🔡 Terminal says <code>dquote&gt;</code> or <code>quote&gt;</code></h2>
        <p className="text-muted mb-3">
          You pasted a command that had smart quotes — PDFs and some chat clients auto-convert <code>"</code> into <code>"</code> <code>"</code>, which Terminal doesn't recognize as quote delimiters. Press <strong>Ctrl+C</strong> to escape, then re-copy the command from this Hub (the copy buttons here use plain ASCII).
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-2">💸 NB Pro is billing 2 credits instead of 0</h2>
        <p className="text-muted mb-3">
          Means you're not on the Power Fox Media enterprise workspace — the Unlimited entitlement is per-workspace. Run <code>higgsfield workspace status</code>. If it doesn't say <strong>Power Fox Media</strong>, fix it:
        </p>
        <CopyBlock code={`higgsfield workspace set e7479d4c-0d59-4be5-9057-abce9fe30f39`} />
        <p className="text-muted text-sm">
          Then <code>higgsfield account status</code> to verify ~1.1M credits.
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-2">📂 Lucid Link folder errors with "no matches found"</h2>
        <p className="text-muted mb-3">
          Lucid Link hasn't fully materialized the folder contents yet — it's a lazy-load filesystem. Fix: open the folder in Finder (Mac) or File Explorer (Windows). That forces Lucid Link to download the contents. Then retry the command.
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-2">🧠 Claude says I'm on the wrong Higgsfield account (but CLI shows the right one)</h2>
        <p className="text-muted mb-3">
          The Higgsfield <strong>MCP connector</strong> in Claude Desktop has its own auth, separate from the CLI. Re-authenticate it:
        </p>
        <ol className="list-decimal ml-6 text-muted space-y-1">
          <li>Claude Desktop → Settings → Connectors → Higgsfield</li>
          <li>Disconnect, then Reconnect with your own email</li>
          <li>Restart Claude Desktop</li>
        </ol>
      </section>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-2">🛑 Claude doesn't see the PFM skills</h2>
        <p className="text-muted mb-3">
          Skills load at session start. After running the update script, restart Claude Desktop fully (⌘Q on Mac, close from system tray on Windows) and open a fresh session.
        </p>
        <p className="text-muted mb-3">
          Also verify the skills are actually on disk. Run:
        </p>
        <CopyBlock code={`ls ~/.claude/skills/`} />
        <p className="text-muted text-sm">
          Should list <code>hvg-flow</code>, <code>hig-flow</code>, etc. If empty or missing, re-run the update script.
        </p>
      </section>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-2">🚦 Permission prompts on every step</h2>
        <p className="text-muted mb-3">
          Means your <code>~/.claude/settings.json</code> didn't get copied. Re-run the update script — it copies both skills AND the allowlist file.
        </p>
        <CopyBlock label="Mac" code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
        <CopyBlock label="Windows" code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
      </section>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-2">⏱ Xcode Command Line Tools install is taking forever</h2>
        <p className="text-muted mb-3">
          Mac only. CLT is ~1-2 GB from Apple's CDN and 10-30 min is normal, longer on slow connections. The progress bar lies — let it run. Run <code>xcode-select -p</code> in another Terminal tab to check if it's done.
        </p>
        <Callout type="warn" title="No progress for 45+ min?">
          Cancel the install dialog, retry. Apple sometimes serves a stalled file from their CDN.
        </Callout>
      </section>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-2">🔐 Higgsfield says "session expired" mid-batch</h2>
        <CopyBlock code={`higgsfield auth login\nhiggsfield workspace set e7479d4c-0d59-4be5-9057-abce9fe30f39`} />
        <p className="text-muted text-sm">Then resume what you were doing — Claude can re-fire any failed jobs.</p>
      </section>

      <section className="my-8">
        <h2 className="text-xl font-semibold mb-2">🆘 Still stuck?</h2>
        <ol className="list-decimal ml-6 text-muted space-y-1">
          <li>Read Claude's response carefully — it tells you what gate it's at and what it needs.</li>
          <li>Check the project folder structure — most "skill failed" errors trace to a folder named wrong or missing.</li>
          <li>Screenshot what Claude said + the project folder name, ping Sam in <strong>Slack #claude-help</strong>.</li>
        </ol>
      </section>
    </div>
  );
}
