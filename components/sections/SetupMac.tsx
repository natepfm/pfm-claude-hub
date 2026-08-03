import CopyBlock from "@/components/CopyBlock";
import Callout from "@/components/Callout";

export default function SetupMac() {
  return (
    <section className="scroll-mt-8">

      <Callout type="info" title="Where to start">
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Brand-new Mac</strong>, no Claude installed → start at step 1.</li>
          <li><strong>Claude installed + signed into your own @powerfoxmedia.com Team seat</strong>, never used Claude Code → start at step 2 (fast-path installer).</li>
          <li>
            <strong>Already using Claude Code with your own setup</strong> (your own skills, your own CLAUDE.md, maybe
            Lucid and the Higgsfield CLI already connected to a personal account) → <strong className="text-text">you
            still run step 2</strong>. That is what installs the PFM skills and brief; nothing of yours is overwritten
            (see the note in that step). Then do step 3 to move Higgsfield from your personal workspace onto PowerFox.
          </li>
        </ul>
      </Callout>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">1. Prereqs — install Claude Desktop + Lucid Link</h3>
        <ol className="list-decimal ml-6 space-y-1 text-muted">
          <li>Download <a href="https://claude.ai/download" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">Claude Desktop</a>, install, sign in with <strong className="text-text">your own @powerfoxmedia.com email</strong> (your Claude Team seat — not a shared login).</li>
          <li>Install <a href="https://www.lucidlink.com/download" className="text-accentDeep font-medium hover:text-accentHover underline underline-offset-2">Lucid Link</a> and mount the <strong className="text-text">PFM MEDIA MASTER FOLDER</strong> filespace at <code>/Volumes/ads/</code>.</li>
          <li>Make sure Notion is installed and you're signed in.</li>
          <li>
            <strong className="text-text">Update Claude to the latest version before running the installer.</strong> The
            PFM brief loads from <code>~/.claude/rules/</code>, which needs Claude Code <code>2.1.198</code> or newer.
            On an older build the files would install and then silently never load — you&apos;d look fully set up while
            running with none of the PFM rules. The installer checks your version and stops rather than let that
            happen. Check yours with <code>claude --version</code>.
          </li>
        </ol>
        <Callout type="warn" title='Expected: "Git is required for local sessions" error'>
          When Claude opens the Code tab the first time, you'll see this error linking to git-scm.com.
          <strong> Ignore the link.</strong> The fast-path installer below installs Git the right way (via Homebrew).
        </Callout>
      </div>

      <div className="my-8">
        <h3 className="text-xl font-semibold mb-2">2. Fast path — one-shot installer</h3>
        <p className="text-muted mb-3">
          Installs Homebrew, Git, Node, Higgsfield CLI, <strong className="text-text">ffmpeg + ffprobe</strong> (so Claude can read video file metadata for the QC skills), Whisper, Python&apos;s openpyxl and google-genai, and copies all PFM skills, hooks and the PFM brief from Lucid Link in one command.
        </p>
        <Callout type="info" title="Already have your own Claude setup? Nothing of yours is overwritten">
          <ul className="list-disc ml-6 space-y-1">
            <li>It <strong className="text-text">snapshots your whole <code>~/.claude</code></strong> to a dated folder in your home directory before writing anything.</li>
            <li>Your <code>settings.json</code> is <strong className="text-text">merged, not replaced</strong> — theme, model, effort level, plugins and your own permission rules all survive.</li>
            <li>Your personal <code>~/.claude/CLAUDE.md</code> is <strong className="text-text">never touched</strong>. The PFM brief installs to <code>~/.claude/rules/</code> instead, so that file stays yours.</li>
            <li>A personal skill sharing a name with a team skill is <strong className="text-text">backed up and named in the output</strong>, not silently replaced. If that happens, rename yours with your initials on the end and send it to Sam.</li>
          </ul>
        </Callout>
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
        <h3 className="text-xl font-semibold mb-2">3. Connect Higgsfield</h3>

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
          <li>Open <strong className="text-text">Claude Desktop → Customize → Connectors</strong> — Higgsfield is added org-wide, so it&apos;s already in your list (don&apos;t search the directory; it won&apos;t show there)</li>
          <li>Click <strong className="text-text">Connect</strong> (or Disconnect + Connect if already connected) and sign in with your own email</li>
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
          <li><code>/ag.stage</code> — the gen front door; stages the request, then routes to the mini or fires locally</li>
          <li><code>Run the b-roll</code> — routes to the <strong className="text-text">ag.broll.*</strong> type skill for that shot type</li>
          <li><code>Fire the batch</code> — continues an in-progress flow</li>
          <li>Drop a Notion URL — auto-detects which flow to use</li>
        </ul>

        <h4 className="font-semibold mt-4 mb-2">Critical rules</h4>
        <Callout type="danger" title="One project per session — and /clear between tasks">
          Don&apos;t reuse one session for multiple projects: the working directory is locked at start.
          But don&apos;t keep one session alive for the length of a project either — run <code>/clear</code> when
          you finish a task and start a different one, and again at the start of each day. Every turn re-reads
          the whole session, so a session left open all week bills its entire history on every single turn.
          In the 08.03 audit, ten multi-day sessions were <strong className="text-text">71% of one editor&apos;s bill</strong> —
          a normal session cost $7, the worst cost $327.
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
