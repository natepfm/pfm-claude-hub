import CopyBlock from "@/components/CopyBlock";
import Callout from "@/components/Callout";

export default function SetupMac() {
  return (
    <section id="setup-mac" className="my-20 scroll-mt-8">
      <div className="border-l-4 border-accent pl-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-1">Onboarding · macOS</div>
        <h2 className="text-3xl font-bold">Setup on Mac</h2>
        <p className="text-muted mt-2">~10–45 minutes depending on what you already have installed.</p>
      </div>

      <Callout type="info" title="Where to start">
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Brand-new Mac</strong>, no Claude installed → start at step 1.</li>
          <li><strong>Claude installed + signed into powerfoxlogin@gmail.com</strong>, never used Claude Code → start at step 2 (fast-path installer).</li>
          <li><strong>Claude Code already working locally</strong> → start at step 3 (Higgsfield auth + skills).</li>
        </ul>
      </Callout>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">1. Prereqs — install Claude Desktop + Lucid Link</h3>
        <ol className="list-decimal ml-6 space-y-1 text-muted">
          <li>Download <a href="https://claude.ai/download" className="text-accent hover:text-accentHover underline">Claude Desktop</a>, install, sign in with <strong className="text-text">powerfoxlogin@gmail.com</strong>.</li>
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
          Installs Homebrew, Git, Node, Higgsfield CLI, <strong className="text-text">ffmpeg</strong> (so Claude can read video file metadata), <strong className="text-text">OpenAI Whisper</strong> (for the audio-qc full-pass dialogue verification), Python's openpyxl, and copies all PFM skills + settings from Lucid Link in one command.
        </p>
        <p className="text-muted">Open Terminal (⌘ Space → "Terminal") and paste:</p>
        <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-setup.sh"`} />
        <p className="text-sm text-muted">
          Total time: ~10 min of waiting (Homebrew + Xcode CLT downloads), ~2 min of clicking through prompts. Safe to re-run on machines that already have parts installed — it skips what's there.
        </p>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">3. Higgsfield authentication</h3>
        <p className="text-muted mb-2">
          Sam should have sent you an invite email to the <strong className="text-text">Power Fox Media</strong> Higgsfield workspace. Accept it first. No invite? Ping Sam in Slack.
        </p>
        <p className="text-muted">Then in Terminal:</p>
        <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-account-switch.sh"`} />
        <p className="text-sm text-muted">
          Opens a browser for you to sign in with <strong className="text-text">your own email</strong> (the one Sam invited you with), sets the PowerFox enterprise workspace as your active workspace, and verifies.
        </p>

        <h4 className="font-semibold mt-4 mb-2">Connect the Higgsfield MCP in Claude Desktop</h4>
        <p className="text-sm text-muted mb-2">The Higgsfield MCP inside Claude Desktop has its own auth — separate from the CLI.</p>
        <ol className="list-decimal ml-6 space-y-1 text-sm text-muted">
          <li>Open <strong className="text-text">Claude Desktop → Settings → Connectors → Higgsfield</strong></li>
          <li>Click <strong className="text-text">Connect</strong> (or Disconnect + Reconnect if already connected) with your own email</li>
          <li>Restart Claude Desktop (⌘Q + reopen)</li>
        </ol>
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
