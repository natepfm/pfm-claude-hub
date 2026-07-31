import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// The allowlist. Adding a domain here is the ONLY place hub access widens.
//   powerfoxmedia.com — PFM staff
//   savemaxauto.com   — Save Max Auto Organic team (Drake's side of the business)
export const ALLOWED_DOMAINS = ["powerfoxmedia.com", "savemaxauto.com"] as const;

/**
 * Exact match on the domain after the final "@" — not a suffix test, so a
 * lookalike like "someone@notpowerfoxmedia.com" can never slip through.
 */
export function isAllowedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const domain = email.toLowerCase().trim().split("@").pop();
  return !!domain && (ALLOWED_DOMAINS as readonly string[]).includes(domain);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      // No `hd` param here on purpose: `hd` pins the account chooser to a
      // SINGLE Workspace domain, and we now accept two. It was never the
      // security boundary anyway (it is client-side and spoofable) — the
      // signIn callback below is.
      authorization: {
        params: { prompt: "select_account" },
      },
    }),
  ],
  callbacks: {
    // THE gate. Rejects any account whose Google-verified email is not on an
    // allowed domain, regardless of what the client sent.
    async signIn({ profile }) {
      const verified = (profile as { email_verified?: boolean })?.email_verified;
      if (verified === false) return false;
      return isAllowedEmail(profile?.email);
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Cookie-based sessions; no database needed.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  trustHost: true,
});
