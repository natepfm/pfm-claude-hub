import "server-only";
import { createPrivateKey, randomUUID, sign } from "crypto";

// Mints the short-lived credential FoxView exchanges a hub Google sign-in for.
// Format: base64url(JSON payload) + "." + base64url(ed25519 signature over the payload bytes).
// The private key lives ONLY in the FOXVIEW_AUTH_PRIVATE_KEY env var (PKCS8 PEM, "\n"-escaped
// newlines allowed); FoxView embeds the matching raw public key and verifies offline. Rotate the
// pair together. 120s expiry: the token exists only to cross the ASWebAuthenticationSession
// redirect back into the app.
/// Accept every shape a dashboard paste produces: a real multi-line PEM, a "\n"-escaped
/// one-liner, a PEM whose newlines got FLATTENED by a single-line input field, or just the
/// bare base64 body. Railway's variable editor flattened Sam's first paste (2026-08-24) and
/// the strict loader 500'd the whole sign-in flow.
function normalizePrivateKeyPem(raw: string): string {
  let v = raw.trim().replace(/^["']|["']$/g, "");
  if (v.includes("\\n")) v = v.replaceAll("\\n", "\n");
  if (v.includes("\n")) return v;
  const body = v
    .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const wrapped = body.replace(/(.{64})/g, "$1\n").trim();
  return `-----BEGIN PRIVATE KEY-----\n${wrapped}\n-----END PRIVATE KEY-----\n`;
}

export function mintFoxViewToken(input: {
  email: string;
  name: string | null | undefined;
  nonce: string;
}): string {
  const pem = process.env.FOXVIEW_AUTH_PRIVATE_KEY;
  if (!pem) throw new Error("FOXVIEW_AUTH_PRIVATE_KEY is not set");
  const key = createPrivateKey(normalizePrivateKeyPem(pem));
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
