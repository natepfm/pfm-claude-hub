import Callout from "@/components/Callout";
import CopyBlock from "@/components/CopyBlock";

export default function Troubleshooting() {
  return (
    <section id="troubleshooting" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">When something breaks</div>
        <h2 className="text-3xl font-bold">Troubleshooting</h2>
        <p className="text-muted mt-2 max-w-3xl">
          The most common stumbles editors hit, with the exact fix. If your problem isn't here, screenshot the error and ping Sam in Slack — don't burn credits guessing.
        </p>
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">🔡 Terminal says <code>dquote&gt;</code> or <code>quote&gt;</code></h3>
        <p className="text-muted text-sm">
          You pasted a command that had smart quotes — some chat clients auto-convert <code>"</code> into <code>"</code> <code>"</code>, which Terminal doesn't recognize as quote delimiters. Press <strong className="text-text">Ctrl+C</strong> to escape, then re-copy the command from this Hub (the copy buttons here use plain ASCII).
        </p>
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">💸 NB Pro is billing 2 credits instead of 0</h3>
        <p className="text-muted text-sm mb-2">
          Means you're not on the Power Fox Media enterprise workspace — the Unlimited entitlement is per-workspace. Run <code>higgsfield workspace status</code>. If it doesn't say <strong className="text-text">Power Fox Media</strong>, fix it:
        </p>
        <CopyBlock code={`higgsfield workspace set e7479d4c-0d59-4be5-9057-abce9fe30f39`} />
        <p className="text-muted text-xs">Then <code>higgsfield account status</code> to verify ~1.1M credits.</p>
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">📂 Lucid Link folder errors with "no matches found"</h3>
        <p className="text-muted text-sm">
          Lucid Link hasn't fully materialized the folder contents yet — it's a lazy-load filesystem. Fix: open the folder in Finder (Mac) or File Explorer (Windows). That forces Lucid Link to download the contents. Then retry the command.
        </p>
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">🧠 Claude says I'm on the wrong Higgsfield account (but CLI shows the right one)</h3>
        <p className="text-muted text-sm mb-2">
          The Higgsfield <strong className="text-text">MCP connector</strong> in Claude Desktop has its own auth, separate from the CLI. Re-authenticate it:
        </p>
        <ol className="list-decimal ml-6 text-sm text-muted space-y-1">
          <li>Claude Desktop → Settings → Connectors → Higgsfield</li>
          <li>Disconnect, then Reconnect with your own email</li>
          <li>Restart Claude Desktop</li>
        </ol>
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">🛑 Claude doesn't see the PFM skills</h3>
        <p className="text-muted text-sm mb-2">
          Skills load at session start. After running the update script, restart Claude Desktop fully (⌘Q on Mac, close from system tray on Windows) and open a fresh session.
        </p>
        <p className="text-muted text-sm mb-2">Also verify the skills are actually on disk:</p>
        <CopyBlock code={`ls ~/.claude/skills/`} />
        <p className="text-muted text-xs">
          Should list <code>hvg-flow</code>, <code>hig-flow</code>, etc. If empty or missing, re-run the update command.
        </p>
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">🚦 Permission prompts on every step</h3>
        <p className="text-muted text-sm mb-2">
          Means your <code>~/.claude/settings.json</code> didn't get copied. Re-run the update script — it copies both skills AND the allowlist file.
        </p>
        <CopyBlock label="Mac" code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
        <CopyBlock label="Windows" code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-update.sh"`} />
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">⏱ Xcode Command Line Tools install is taking forever</h3>
        <p className="text-muted text-sm mb-2">
          Mac only. CLT is ~1-2 GB from Apple's CDN and 10-30 min is normal, longer on slow connections. The progress bar lies — let it run. Run <code>xcode-select -p</code> in another Terminal tab to check if it's done.
        </p>
        <Callout type="warn" title="No progress for 45+ min?">
          Cancel the install dialog, retry. Apple sometimes serves a stalled file from their CDN.
        </Callout>
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">🔐 Higgsfield says "session expired" mid-batch</h3>
        <CopyBlock code={`higgsfield auth login\nhiggsfield workspace set e7479d4c-0d59-4be5-9057-abce9fe30f39`} />
        <p className="text-muted text-xs">Then resume — Claude can re-fire any failed jobs.</p>
      </div>

      <div className="my-6">
        <h3 className="text-lg font-semibold mb-2">🆘 Still stuck?</h3>
        <ol className="list-decimal ml-6 text-sm text-muted space-y-1">
          <li>Read Claude's response carefully — it tells you what gate it's at and what it needs.</li>
          <li>Check the project folder structure — most "skill failed" errors trace to a folder named wrong or missing.</li>
          <li>Screenshot what Claude said + the project folder name, ping Sam in <strong className="text-text">Slack #claude-help</strong>.</li>
        </ol>
      </div>
    </section>
  );
}
