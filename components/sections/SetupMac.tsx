import CopyBlock from "@/components/CopyBlock";
import Callout from "@/components/Callout";

export default function SetupMac() {
  return (
    <section className="scroll-mt-8">

      <Callout type="info" title="Where to start">
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Brand-new Mac</strong>, no Claude installed → start at step 1.</li>
          <li><strong>Claude installed + signed into your own @powerfoxmedia.com Team seat</strong>, never used Claude Code → start at step 2 (fast-path installer).</li>
          <li><strong>Claude Code already working locally</strong> → start at step 3 (Higgsfield auth + skills).</li>
        </ul>
      </Callout>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">1. Prereqs — install Claude Desktop + Lucid Link</h3>
        <ol className="list-decimal ml-6 space-y-1 text-muted">
          <li>Download <a href="https://claude.ai/download" className="text-accent hover:text-accentHover underline">Claude Desktop</a>, install, sign in with <strong className="text-text">your own @powerfoxmedia.com email</strong> (your Claude Team seat — not a shared login).</li>
          <li>Install <a href="https://www.lucidlink.com/download" className="text-accent hover:text-accentHover underline">Lucid Link</a> and mount the <strong className="text-text">PFM MEDIA MASTER FOLDER</strong> filespace at <code>/Volumes/ads/</code>.</li>
          <li>Make sure Notion is installed and you're signed in.</li>
        </ol>
        <Callout type="warn" title='Expected: "Git is required for local sessions" error'>
          When Claude opens the Code tab the first time, you'll see this error linking to git-scm.com.
          <strong> Ignore the link.</strong> The fast-path installer below installs Git the right way (via Homebrew).
        </Callout>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">2. Fast path — one-shot installer</h3>
        <p className="text-muted mb-3">
          Installs Homebrew, Git, Node, Higgsfield CLI, <strong className="text-text">ffmpeg</strong> (so Claude can read video file metadata for the audio-qc skill), Python's openpyxl, and copies all PFM skills + settings from Lucid Link in one command.
        </p>
        <p className="text-muted">Open Terminal (⌘ Space → "Terminal") and paste:</p>
        <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-setup.sh"`} />
        <p className="text-sm text-muted">
          Total time: ~10 min of waiting (Homebrew + Xcode CLT downloads), ~2 min of clicking through prompts. Safe to re-run on machines that already have parts installed — it skips what's there.
        </p>
        <Callout type="warn" title='If it stops on a red "permission denied / EACCES" error'>
          <p className="mb-2">
            This happens when Node was installed the official way instead of via Homebrew — its global folder is owned by the system, so the installer can&apos;t write to it. The installer <strong className="text-text">now fixes this for you automatically</strong>: it pauses and asks for your Mac password (as you type, nothing shows on screen — that&apos;s normal), then keeps going.
          </p>
          <p className="mb-2">If it still gets stuck, run this once, then paste the installer command above again:</p>
          <CopyBlock code={`sudo chown -R $(whoami) /usr/local/lib/node_modules /usr/local/bin /usr/local/share`} />
        </Callout>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">3. Connect Higgsfield + Canva</h3>

        <h4 className="font-semibold mt-2 mb-2">Higgsfield CLI authentication</h4>
        <p className="text-muted mb-2">
          Sam should have sent you an invite email to the <strong className="text-text">Power Fox Media</strong> Higgsfield workspace. Accept it first. No invite? Ping Sam in Slack.
        </p>
        <p className="text-muted">Then in Terminal:</p>
        <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-account-switch.sh"`} />
        <p className="text-sm text-muted">
          Opens a browser for you to sign in with <strong className="text-text">your own email</strong> (the one Sam invited you with), sets the PowerFox enterprise workspace as your active workspace, and verifies.
        </p>

        <Callout type="warn" title='Video fails with "not_enough_credits" but images still work?'>
          Your CLI has <strong className="text-text">no billing workspace selected</strong>, so fires fall back to your free <strong className="text-text">private</strong> Higgsfield workspace (a few credits) — images and TTS squeak through, video dies. Re-pin the enterprise pool: re-run the <code>claude-pfm-account-switch.sh</code> command above (or <code>higgsfield workspace set e7479d4c-0d59-4be5-9057-abce9fe30f39</code>), then confirm <code>higgsfield workspace status</code> reads <strong className="text-text">Power Fox Media — enterprise</strong> — not your private one, and not the smaller “PowerFox” team workspace.
        </Callout>

        <h4 className="font-semibold mt-4 mb-2">Connect the Higgsfield MCP in Claude Desktop</h4>
        <p className="text-sm text-muted mb-2">The Higgsfield MCP inside Claude Desktop has its own auth — separate from the CLI.</p>
        <ol className="list-decimal ml-6 space-y-1 text-sm text-muted">
          <li>Open <strong className="text-text">Claude Desktop → Settings → Connectors → Higgsfield</strong></li>
          <li>Click <strong className="text-text">Connect</strong> (or Disconnect + Reconnect if already connected) with your own email</li>
          <li>Restart Claude Desktop (⌘Q + reopen)</li>
        </ol>

        <h4 className="font-semibold mt-4 mb-2">Connect Canva (shared PFM account)</h4>
        <p className="text-sm text-muted mb-2">
          Canva is used to generate <strong className="text-text">lower-thirds graphics</strong> for breaking-news creatives (chyrons, person IDs, location tags, the LATU News brand stack). PFM uses a <strong className="text-text">single shared Canva account</strong> — Sam will share the login credentials separately.
        </p>
        <p className="text-sm text-muted mb-2">
          Canva uses an <strong className="text-text">authorization-link flow</strong>, not the Settings → Connectors UI. Connect it from inside a Claude Code session:
        </p>
        <ol className="list-decimal ml-6 space-y-1 text-sm text-muted">
          <li>Open a Claude Code session (any project folder works for the auth step)</li>
          <li>Ask Claude: <code>connect Canva</code> (or <code>authenticate Canva</code>)</li>
          <li>Claude prints an <strong className="text-text">authorization URL</strong> — click it</li>
          <li>Sign in with the <strong className="text-text">shared PFM Canva credentials</strong> Sam sent you (not your own Canva account)</li>
          <li>Approve the access — the browser tab can be closed once you see the &ldquo;connected&rdquo; confirmation</li>
          <li>Back in Claude, tell it you&apos;re done — it&apos;ll complete the handshake and Canva tools become available in this and future sessions</li>
        </ol>
        <p className="text-xs text-muted italic mt-2">
          Once connected, when you&apos;re in a breaking-news project and the script has chyron specs (`BREAKING NEWS`, `JESSICA MARSH / MOTHER OF THREE`, etc.), Claude can generate the actual lower-thirds graphics in Canva and drop the PNGs into the project folder. Ask Claude to &ldquo;build the lower thirds&rdquo; after the script is locked.
        </p>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">4. Smoke test</h3>
        <ol className="list-decimal ml-6 space-y-1 text-muted">
          <li>Open <strong className="text-text">Claude Desktop</strong>, click the <strong className="text-text">Code</strong> tab on the left.</li>
          <li>Click <strong className="text-text">New session</strong> → navigate the folder picker to any project folder under <code>/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/...</code></li>
          <li>In the chat, type: <code>What skills do I have available?</code> — Claude should list all PFM skills.</li>
          <li>Then type: <code>higgsfield account status</code> — should return your email + Power Fox Media credit balance with no permission prompt.</li>
        </ol>
        <Callout type="success" title="If both worked, you're done with setup">
          Bookmark this Hub. You'll come back here when you need to update skills or troubleshoot.
        </Callout>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">5. Your first real project (HVG flow walkthrough)</h3>
        <ol className="list-decimal ml-6 space-y-1 text-muted">
          <li>Open <strong className="text-text">Claude Code</strong> from inside the project folder (Code tab → folder picker → <code>/Volumes/ads/.../&lt;project&gt;</code>)</li>
          <li>In the chat, paste: <code>Notion request: &lt;URL&gt;. Run video generations.</code></li>
          <li>Claude walks 9 confirmation gates. You confirm each one before it moves on.</li>
          <li>After Gate 9 (final preflight), type <code>fire</code> to launch the batch. Claude downloads MP4s into <code>Elements/Footage/Veo/</code> + writes the Excel manifest.</li>
        </ol>

        <h4 className="font-semibold mt-4 mb-2">Common phrases</h4>
        <ul className="list-disc ml-6 space-y-1 text-muted">
          <li><code>Run video generations</code> — fires <strong className="text-text">hvg-flow</strong> (Veo dialogue clips)</li>
          <li><code>Run image generations</code> — fires <strong className="text-text">hig-flow</strong> (Nano Banana b-roll)</li>
          <li><code>Fire the batch</code> — continues an in-progress flow</li>
          <li>Drop a Notion URL — auto-detects which flow to use</li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">Critical rules</h4>
        <Callout type="danger" title="One project = one Claude Code session">
          Don't reuse one session for multiple projects. The session's working directory is locked at start.
        </Callout>
        <Callout type="danger" title="Always work on Lucid Link">
          The skills will hard-stop you if your session opens outside <code>/Volumes/ads/PFM MEDIA MASTER FOLDER/...</code>.
        </Callout>
        <Callout type="danger" title="Confirm large batches with the editor lead">
          Credits are shared. Don't fire jobs over ~500 cr without checking with Sam.
        </Callout>
      </div>
    </section>
  );
}
