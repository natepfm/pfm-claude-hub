import CopyBlock from "@/components/CopyBlock";
import Callout from "@/components/Callout";

export default function SetupWindows() {
  return (
    <section className="scroll-mt-8">

      <Callout type="info" title="Why we use Git Bash on Windows">
        Windows doesn't have a Unix-style terminal by default. <strong>Git for Windows</strong> ships with <strong>Git Bash</strong>, a terminal that runs the same scripts as Mac. Throughout this guide, every terminal command runs in Git Bash — NOT PowerShell or Command Prompt.
      </Callout>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">1. Prereqs — manual installs (one-time)</h3>
        <ol className="list-decimal ml-6 space-y-2 text-muted">
          <li>Install <a href="https://claude.ai/download" className="text-accent hover:text-accentHover underline">Claude Desktop for Windows</a>, sign in with <strong className="text-text">powerfoxlogin@gmail.com</strong>.</li>
          <li>Install <a href="https://www.lucidlink.com/download" className="text-accent hover:text-accentHover underline">Lucid Link for Windows</a> + mount the <strong className="text-text">PFM MEDIA MASTER FOLDER</strong>. It mounts as a drive letter — usually <code>L:</code> (could be <code>M:</code>, <code>N:</code> — check File Explorer).</li>
          <li>
            Install <a href="https://git-scm.com/download/win" className="text-accent hover:text-accentHover underline">Git for Windows</a>. Important options during install:
            <ul className="list-disc ml-6 mt-1 space-y-0.5">
              <li>"Select Components" — leave defaults checked (Git Bash, Git GUI, Add to PATH).</li>
              <li>"Adjusting your PATH environment" — pick the <strong className="text-text">recommended middle option</strong>: "Git from the command line and also from 3rd-party software".</li>
              <li>Other screens — defaults are fine.</li>
            </ul>
            After install, search <strong className="text-text">Git Bash</strong> in the Start menu. That's your terminal from here on.
          </li>
          <li>Install <a href="https://nodejs.org" className="text-accent hover:text-accentHover underline">Node.js LTS</a> — default install options.</li>
          <li>
            Install Python 3 — easiest path is the <strong className="text-text">Microsoft Store</strong> (search "Python 3.12" and click Get). Alternative: <a href="https://www.python.org/downloads/" className="text-accent hover:text-accentHover underline">python.org installer</a> — if you go that route, check <strong className="text-text">"Add python.exe to PATH"</strong> on the first installer screen.
          </li>
        </ol>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">2. Post-prereqs installer</h3>
        <p className="text-muted mb-2">Once all five prereqs are installed, open <strong className="text-text">Git Bash</strong> and run:</p>
        <CopyBlock label="If Lucid Link is on L:" code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-setup-windows.sh"`} />
        <Callout type="warn" title="Drive letter mismatch?">
          The path assumes Lucid Link mounted as <code>L:</code>. If yours is different (check File Explorer → "This PC"), replace <code>/l/</code> with <code>/&lt;your-letter-in-lowercase&gt;/</code>. Example: <code>/m/PFM MEDIA MASTER FOLDER/...</code>
        </Callout>
        <p className="text-sm text-muted mt-2">
          The installer verifies your prereqs, installs the Higgsfield CLI and openpyxl, and copies all PFM skills + settings from Lucid Link.
        </p>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">3. Higgsfield authentication</h3>
        <p className="text-muted mb-2">
          Sam should have sent you an invite email to the <strong className="text-text">Power Fox Media</strong> Higgsfield workspace. Accept it first.
        </p>
        <p className="text-muted">Then in Git Bash:</p>
        <CopyBlock code={`bash "/l/PFM MEDIA MASTER FOLDER/6. Claude PFM/claude-pfm-account-switch.sh"`} />
        <p className="text-sm text-muted">
          Opens a browser for you to sign in with <strong className="text-text">your own email</strong> (NOT a shared account), sets the PowerFox enterprise workspace as your active workspace, and verifies.
        </p>

        <h4 className="font-semibold mt-4 mb-2">Connect the Higgsfield MCP in Claude Desktop</h4>
        <ol className="list-decimal ml-6 space-y-1 text-sm text-muted">
          <li>Open <strong className="text-text">Claude Desktop → Settings → Connectors → Higgsfield</strong></li>
          <li>Click <strong className="text-text">Connect</strong> (or Disconnect + Reconnect if already connected) with your own email</li>
          <li>Restart Claude Desktop (close from system tray + reopen)</li>
        </ol>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">4. Smoke test</h3>
        <ol className="list-decimal ml-6 space-y-1 text-muted">
          <li>Open <strong className="text-text">Claude Desktop</strong>, click the <strong className="text-text">Code</strong> tab.</li>
          <li>Click <strong className="text-text">New session</strong> → navigate to any project folder under <code>L:\PFM MEDIA MASTER FOLDER\4. PFM Project Files\...</code></li>
          <li>In the chat, type: <code>What skills do I have available?</code> — Claude should list all PFM skills.</li>
          <li>Then type: <code>higgsfield account status</code> — should show your email + Power Fox Media + ~1.1M credits.</li>
        </ol>
        <Callout type="success" title="Both worked? You're done">
          Bookmark this Hub. Come back when you need to update skills or troubleshoot.
        </Callout>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">5. Path translations — Mac vs Windows</h3>
        <p className="text-muted text-sm mb-3">The PFM docs sometimes reference Mac paths. Here's how they map on Windows:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 text-accent">Mac path</th>
                <th className="text-left py-2 px-2 text-accent">Windows (File Explorer)</th>
                <th className="text-left py-2 px-2 text-accent">Windows (Git Bash)</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-muted">
              <tr className="border-b border-border"><td className="py-2 px-2">/Volumes/ads/PFM MEDIA MASTER FOLDER/</td><td className="py-2 px-2">L:\PFM MEDIA MASTER FOLDER\</td><td className="py-2 px-2">/l/PFM MEDIA MASTER FOLDER/</td></tr>
              <tr className="border-b border-border"><td className="py-2 px-2">~/.claude/skills/</td><td className="py-2 px-2">%USERPROFILE%\.claude\skills\</td><td className="py-2 px-2">~/.claude/skills/</td></tr>
              <tr><td className="py-2 px-2">~/.claude/settings.json</td><td className="py-2 px-2">%USERPROFILE%\.claude\settings.json</td><td className="py-2 px-2">~/.claude/settings.json</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
