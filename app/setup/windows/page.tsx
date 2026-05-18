import CopyBlock from "@/components/CopyBlock";
import Callout from "@/components/Callout";
import Section from "@/components/Section";

export const metadata = { title: "Setup · Windows — PFM Claude Hub" };

export default function WindowsSetup() {
  return (
    <div>
      <header className="mb-6">
        <div className="text-xs uppercase tracking-widest text-accent mb-2">Setup · Windows</div>
        <h1 className="text-4xl font-bold mb-3">Claude + Higgsfield setup on Windows</h1>
        <p className="text-muted">
          Time: ~15–50 minutes depending on what you already have installed. Windows has more manual prereqs than Mac because there's no Homebrew equivalent.
        </p>
      </header>

      <Callout type="info" title="Why we use Git Bash on Windows">
        Windows doesn't have a Unix-style terminal by default. <strong>Git for Windows</strong> ships with <strong>Git Bash</strong>, a terminal that runs the same scripts as Mac. Throughout this guide, every terminal command runs in Git Bash — NOT PowerShell or Command Prompt.
      </Callout>

      <Section id="prereqs" number="1" title="Prereqs — manual installs (one-time)">
        <p>Do these in order. Each is a normal installer — defaults are fine unless noted.</p>
        <ol>
          <li>Install <a href="https://claude.ai/download">Claude Desktop for Windows</a>, sign in with <strong>powerfoxlogin@gmail.com</strong>.</li>
          <li>Install <a href="https://www.lucidlink.com/download">Lucid Link for Windows</a> + mount the <strong>PFM MEDIA MASTER FOLDER</strong>. It mounts as a drive letter — usually <code>L:</code> (could be <code>M:</code>, <code>N:</code>, etc. — check File Explorer).</li>
          <li>
            Install <a href="https://git-scm.com/download/win">Git for Windows</a>. Important options during install:
            <ul>
              <li>"Select Components" — leave defaults checked (Git Bash, Git GUI, Add to PATH).</li>
              <li>"Adjusting your PATH environment" — pick the <strong>recommended middle option</strong>: "Git from the command line and also from 3rd-party software".</li>
              <li>Other screens — defaults are fine.</li>
            </ul>
            After install, search <strong>Git Bash</strong> in the Start menu. That's your terminal from here on.
          </li>
          <li>Install <a href="https://nodejs.org">Node.js LTS</a> — default install options.</li>
          <li>
            Install Python 3 — easiest path is the <strong>Microsoft Store</strong> (search "Python 3.12" and click Get). Alternative: <a href="https://www.python.org/downloads/">python.org installer</a> — if you go that route, check <strong>"Add python.exe to PATH"</strong> on the first installer screen.
          </li>
        </ol>
      </Section>

      <Section id="installer" number="2" title="Post-prereqs installer">
        <p>Once all five prereqs above are installed, open <strong>Git Bash</strong> and run:</p>
        <CopyBlock label="If Lucid Link is on L:" code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-setup-windows.sh"`} />
        <Callout type="warn" title="Drive letter mismatch?">
          The path assumes Lucid Link mounted as <code>L:</code>. If yours is different (check File Explorer → "This PC"), replace <code>/l/</code> with <code>/&lt;your-letter-in-lowercase&gt;/</code>. Example: <code>/m/PFM MEDIA MASTER FOLDER/...</code>
        </Callout>
        <p>
          The installer verifies your prereqs, installs the Higgsfield CLI and openpyxl, and copies all PFM skills + settings from Lucid Link. Prints next steps at the end.
        </p>
      </Section>

      <Section id="higgsfield-auth" number="3" title="Higgsfield authentication">
        <p>
          Sam should have sent you an invite email to the <strong>Power Fox Media</strong> Higgsfield workspace. Accept it first.
        </p>
        <p>Then in Git Bash:</p>
        <CopyBlock code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-account-switch.sh"`} />
        <p>
          Opens a browser for you to sign in with <strong>your own email</strong> (NOT a shared account), sets the PowerFox enterprise workspace as your active workspace, and verifies.
        </p>
        <h3>Connect the Higgsfield MCP in Claude Desktop</h3>
        <ol>
          <li>Open <strong>Claude Desktop → Settings → Connectors → Higgsfield</strong></li>
          <li>Click <strong>Connect</strong> (or Disconnect + Reconnect if already connected) with your own email</li>
          <li>Restart Claude Desktop (close from system tray + reopen)</li>
        </ol>
      </Section>

      <Section id="smoke-test" number="4" title="Smoke test">
        <ol>
          <li>Open <strong>Claude Desktop</strong>, click the <strong>Code</strong> tab.</li>
          <li>Click <strong>New session</strong> → navigate to any project folder under <code>L:\PFM MEDIA MASTER FOLDER\4. PFM Project Files\...</code></li>
          <li>In the chat, type: <code>What skills do I have available?</code> — Claude should list all PFM skills.</li>
          <li>Then type: <code>higgsfield account status</code> — should show your email + Power Fox Media + ~1.1M credits, no permission prompt.</li>
        </ol>
        <Callout type="success" title="Both worked? You're done">
          Bookmark this Hub. Come back when you need to update skills or switch accounts.
        </Callout>
      </Section>

      <Section id="path-translations" number="5" title="Path translations — Mac vs Windows">
        <p>The PFM docs sometimes reference Mac paths. Here's how they map on Windows:</p>
        <table className="my-4 w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-accent">Mac path</th>
              <th className="text-left py-2 px-2 text-accent">Windows path (File Explorer)</th>
              <th className="text-left py-2 px-2 text-accent">Windows path (Git Bash)</th>
            </tr>
          </thead>
          <tbody className="text-sm font-mono">
            <tr className="border-b border-border"><td className="py-2 px-2">/Volumes/ads/PFM MEDIA MASTER FOLDER/</td><td className="py-2 px-2">L:\PFM MEDIA MASTER FOLDER\</td><td className="py-2 px-2">/l/PFM MEDIA MASTER FOLDER/</td></tr>
            <tr className="border-b border-border"><td className="py-2 px-2">~/.claude/skills/</td><td className="py-2 px-2">%USERPROFILE%\.claude\skills\</td><td className="py-2 px-2">~/.claude/skills/</td></tr>
            <tr><td className="py-2 px-2">~/.claude/settings.json</td><td className="py-2 px-2">%USERPROFILE%\.claude\settings.json</td><td className="py-2 px-2">~/.claude/settings.json</td></tr>
          </tbody>
        </table>
      </Section>
    </div>
  );
}
