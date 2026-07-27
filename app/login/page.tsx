import { signIn, auth, ALLOWED_DOMAIN } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign in — PFM Editors Hub" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error } = await searchParams;

  // Already signed in? Go straight through.
  const session = await auth();
  if (session) redirect(from && from.startsWith("/") ? from : "/");

  const wrongDomain = error === "AccessDenied";

  return (
    <div className="max-w-md mx-auto pt-10 md:pt-20">
      <div className="bg-surface border border-ink shadow-elev2">
        <div aria-hidden className="h-1.5 bg-accent border-b border-ink" />
        <div className="p-6 md:p-8">
          <div className="inline-flex items-center gap-2 border border-ink bg-bg px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-text mb-5">
            <span aria-hidden className="inline-block w-2 h-2 bg-accent" />
            Team access
          </div>

          <h1 className="font-heading font-bold text-3xl text-text leading-tight">
            Sign in to the <em>Editors Hub.</em>
          </h1>
          <p className="text-muted text-sm mt-3 leading-relaxed">
            This hub is for Power Fox Media staff. Sign in with your{" "}
            <strong className="text-text">@{ALLOWED_DOMAIN}</strong> Google account —
            personal accounts and outside addresses are turned away.
          </p>

          {wrongDomain && (
            <div
              role="alert"
              className="mt-5 border border-ink bg-[#FEE2E2] text-[#991B1B] p-3 text-sm"
            >
              <strong className="font-semibold">That account isn&apos;t on the PFM domain.</strong>{" "}
              Pick your @{ALLOWED_DOMAIN} account and try again.
            </div>
          )}

          {error && !wrongDomain && (
            <div
              role="alert"
              className="mt-5 border border-ink bg-[#FEE2E2] text-[#991B1B] p-3 text-sm"
            >
              <strong className="font-semibold">Sign-in didn&apos;t complete.</strong> Try
              again — if it keeps failing, send Sam the error code:{" "}
              <span className="font-mono">{error}</span>
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: from && from.startsWith("/") ? from : "/",
              });
            }}
            className="mt-6"
          >
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 bg-accent text-white font-semibold border border-ink shadow-hard-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
                <path
                  fill="currentColor"
                  d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.64 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.95S8.78 6.28 12 6.28c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 3.72 14.55 2.8 12 2.8 6.98 2.8 2.9 6.88 2.9 11.9S6.98 21 12 21c5.4 0 8.98-3.8 8.98-9.15 0-.62-.07-1.09-.16-1.55z"
                />
              </svg>
              Sign in with Google
            </button>
          </form>

          <p className="font-mono text-[10px] text-faint mt-5 leading-relaxed">
            Access is checked against your Google-verified email on every sign-in.
            Trouble getting in? Message Sam.
          </p>
        </div>
      </div>
    </div>
  );
}
