import CopyBlock from "@/components/CopyBlock";
import Callout from "@/components/Callout";
import Section from "@/components/Section";

export const metadata = { title: "Setup · Mac — PFM Claude Hub" };

export default function MacSetup() {
  return (
    <div>
      <header className="mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Setup · macOS</div>
        <h1 className="text-4xl font-bold mb-3">Claude + Higgsfield setup on Mac</h1>
        <p className="text-muted">
          Time: ~10–45 minutes depending on what you already have installed. Pick your starting section below.
        </p>
      </header>

      <Callout type="info" title="Where to start">
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Brand-new Mac</strong>, no Claude installed → start at Section 1.</li>
          <li><strong>Claude installed + signed into powerfoxlogin@gmail.com</strong>, never used Claude Code → start at Section 3 (Fast path installer).</li>
          <li><strong>Claude Code already working locally</strong> → start at Section 4 (Higgsfield account + skills).</li>
        </ul>
      </Callout>

      <Section id="prereqs" number="1" title="Prereqs — install Claude Desktop + Lucid Link">
        <ol>
          <li>Download <a href="https://claude.ai/download">Claude Desktop</a>, install, sign in with <strong>powerfoxlogin@gmail.com</strong>.</li>
          <li>Install <a href="https://www.lucidlink.com/download">Lucid Link</a> and mount the <strong>PFM MEDIA MASTER FOLDER</strong> filespace at <code>/Volumes/ads/</code>.</li>
          <li>Make sure Notion is installed and you're signed in.</li>
        </ol>
        <Callout type="warn" title='Expected: "Git is required for local sessions" error'>
          When Claude opens the Code tab the first time, you'll see this error linking to git-scm.com.
          <strong> Ignore the link.</strong> The fast-path installer in Section 3 installs Git the right way (via Homebrew).
        </Callout>
      </Section>

      <Section id="fast-path" number="2" title="Fast path — one-shot installer">
        <p>
          This installer does everything: Homebrew, Git, Node, Higgsfield CLI, Python's openpyxl, and copies all PFM skills + settings from Lucid Link.
        </p>
        <p>Open Terminal (⌘ Space → "Terminal") and paste:</p>
        <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-setup.sh"`} />
        <p>
          Total time: ~10 min of waiting (Homebrew + Xcode CLT downloads), ~2 min of clicking through prompts. The installer prints what it's doing and tells you the manual steps left at the end.
        </p>
        <Callout type="info" title="Already have parts installed?">
          The installer is idempotent — it skips anything already on the machine. Safe to re-run.
        </Callout>
      </Section>

      <Section id="higgsfield-auth" number="3" title="Higgsfield authentication">
        <p>
          Sam should have sent you an invite email to the <strong>Power Fox Media</strong> Higgsfield workspace. Accept it first. No invite? Ping Sam in Slack.
        </p>
        <p>Then in Terminal:</p>
        <CopyBlock code={`bash "/Volumes/ads/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-account-switch.sh"`} />
        <p>
          The script opens a browser for you to sign in with <strong>your own email</strong> (the one Sam invited you with), sets the PowerFox enterprise workspace as your active workspace, and verifies. Expected final output: your email + Power Fox Media + ~1.1M credits.
        </p>
        <h3>Connect the Higgsfield MCP in Claude Desktop</h3>
        <p>
          The Higgsfield MCP inside Claude Desktop has its own auth — separate from the CLI.
        </p>
        <ol>
          <li>Open <strong>Claude Desktop → Settings → Connectors → Higgsfield</strong></li>
          <li>Click <strong>Connect</strong> (or Disconnect + Reconnect if already connected) with your own email</li>
          <li>Restart Claude Desktop (⌘Q + reopen)</li>
        </ol>
      </Section>

      <Section id="smoke-test" number="4" title="Smoke test — verify the stack works">
        <ol>
          <li>Open <strong>Claude Desktop</strong>, click the <strong>Code</strong> tab on the left.</li>
          <li>Click <strong>New session</strong> → navigate the folder picker to any project folder under <code>/Volumes/ads/PFM MEDIA MASTER FOLDER/4. PFM Project Files/...</code></li>
          <li>In the chat, type: <code>What skills do I have available?</code> — Claude should list all PFM skills.</li>
          <li>Then type: <code>higgsfield account status</code> — should return your email + Power Fox Media credit balance with no permission prompt.</li>
        </ol>
        <Callout type="success" title="If both worked, you're done with setup">
          Bookmark this Hub. You'll come back here when you need to update skills or switch accounts.
        </Callout>
      </Section>

      <Section id="first-project" number="5" title="Your first real project — HVG flow walkthrough">
        <ol>
          <li>Open <strong>Claude Code</strong> from inside the project folder (Code tab → folder picker → <code>/Volumes/ads/.../&lt;project&gt;</code>)</li>
          <li>In the chat, paste: <code>Notion request: &lt;URL&gt;. Run video generations.</code></li>
          <li>Claude walks 9 confirmation gates — Session start, Context check, Notion fetch, References, Model, Master prompt, Optional L1 test, Excel manifest, Final preflight. You confirm each gate before it moves on.</li>
          <li>After Gate 9 (final preflight), type <code>fire</code> to launch the batch. Claude downloads MP4s into <code>Elements/Footage/Veo/</code> + writes the Excel manifest with status.</li>
        </ol>

        <h3>Common phrases</h3>
        <ul>
          <li><code>Run video generations</code> — fires <strong>hvg-flow</strong> (Veo dialogue clips)</li>
          <li><code>Run image generations</code> — fires <strong>hig-flow</strong> (Nano Banana b-roll)</li>
          <li><code>Fire the batch</code> — continues an in-progress flow</li>
          <li>Drop a Notion URL — auto-detects which flow to use</li>
        </ul>

        <h3>Critical rules</h3>
        <Callout type="danger" title="One project = one Claude Code session">
          Don't reuse one session for multiple projects. The session's working directory is locked at start. If you opened the wrong folder, close + reopen.
        </Callout>
        <Callout type="danger" title="Always work on Lucid Link">
          The skills will hard-stop you if your session opens outside <code>/Volumes/ads/PFM MEDIA MASTER FOLDER/...</code>.
        </Callout>
        <Callout type="danger" title="Confirm large batches with the editor lead">
          Credits are shared across the team. Don't fire jobs over ~500 cr without checking with Sam.
        </Callout>
      </Section>
    </div>
  );
}
