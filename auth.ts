import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Only Power Fox Media Google Workspace accounts may sign in.
export const ALLOWED_DOMAIN = "powerfoxmedia.com";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      // `hd` asks Google to show only Workspace accounts on this domain.
      // It is a UX hint that can be spoofed, so it is NOT the security
      // boundary — the signIn callback below is.
      authorization: {
        params: { hd: ALLOWED_DOMAIN, prompt: "select_account" },
      },
    }),
  ],
  callbacks: {
    // THE gate. Rejects any account whose Google-verified email is not on
    // the PFM domain, regardless of what the client sent.
    async signIn({ profile }) {
      const email = profile?.email?.toLowerCase();
      const verified = (profile as { email_verified?: boolean })?.email_verified;
      if (!email || verified === false) return false;
      return email.endsWith(`@${ALLOWED_DOMAIN}`);
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
