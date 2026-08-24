import { auth, isAllowedEmail } from "@/auth";
import { redirect } from "next/navigation";
import { mintFoxViewToken } from "./token";
import RedirectClient from "./redirect-client";

export const metadata = { title: "FoxView sign-in — PFM Editors Hub" };
export const dynamic = "force-dynamic";

// The FoxView desktop app opens this page inside an ASWebAuthenticationSession with a fresh
// nonce. The hub's existing NextAuth/Google gate does ALL the authentication and domain
// checking; this page only converts an authenticated hub session into a short-lived signed
// token the app can verify offline. No new access surface: anyone who can load this page
// signed-in could already browse the whole hub.
export default async function FoxViewAuthPage({
  searchParams,
}: {
  searchParams: Promise<{ nonce?: string }>;
}) {
  const { nonce } = await searchParams;

  const session = await auth();
  if (!session?.user?.email) {
    const from = `/foxview-auth?nonce=${encodeURIComponent(nonce ?? "")}`;
    redirect(`/login?from=${encodeURIComponent(from)}`);
  }

  const email = session!.user!.email!;
  // Belt and braces — the signIn callback already enforces this on every session.
  if (!isAllowedEmail(email)) redirect("/login?error=AccessDenied");

  const badNonce = !nonce || !/^[A-Za-z0-9_-]{16,128}$/.test(nonce);
  if (badNonce) {
    return (
      <div className="max-w-md mx-auto pt-10 md:pt-20">
        <div className="bg-surface border border-ink shadow-elev2">
          <div aria-hidden className="h-1.5 bg-accent border-b border-ink" />
          <div className="p-6 md:p-8">
            <h1 className="font-heading font-bold text-2xl text-text leading-tight">
              This page only works from FoxView.
            </h1>
            <p className="text-muted text-sm mt-3 leading-relaxed">
              Open the FoxView app and click <strong className="text-text">Sign in with
              Google</strong> — it will bring you here with a valid request.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const token = mintFoxViewToken({ email, name: session!.user!.name, nonce: nonce! });
  return <RedirectClient url={`foxio://auth?token=${encodeURIComponent(token)}`} email={email} />;
}
