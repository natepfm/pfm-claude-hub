import "server-only";
import { createPrivateKey, randomUUID, sign } from "crypto";

// Mints the short-lived credential FoxView exchanges a hub Google sign-in for.
// Format: base64url(JSON payload) + "." + base64url(ed25519 signature over the payload bytes).
// The private key lives ONLY in the FOXVIEW_AUTH_PRIVATE_KEY env var (PKCS8 PEM, "\n"-escaped
// newlines allowed); FoxView embeds the matching raw public key and verifies offline. Rotate the
// pair together. 120s expiry: the token exists only to cross the ASWebAuthenticationSession
// redirect back into the app.
export function mintFoxViewToken(input: {
  email: string;
  name: string | null | undefined;
  nonce: string;
}): string {
  const pem = process.env.FOXVIEW_AUTH_PRIVATE_KEY;
  if (!pem) throw new Error("FOXVIEW_AUTH_PRIVATE_KEY is not set");
  const key = createPrivateKey(pem.includes("\\n") ? pem.replaceAll("\\n", "\n") : pem);
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({
      email: input.email.toLowerCase().trim(),
      name: input.name ?? "",
      nonce: input.nonce,
      iat: now,
      exp: now + 120,
      jti: randomUUID(),
    })
  );
  const sig = sign(null, payload, key);
  return `${payload.toString("base64url")}.${sig.toString("base64url")}`;
}
