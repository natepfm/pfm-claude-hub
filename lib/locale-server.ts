import { cookies } from "next/headers";
import { LANG_COOKIE, isLocale, type Locale } from "./i18n";

// Server-only locale read (see lib/i18n.ts header comment).
export async function getLocale(): Promise<Locale> {
  const jar = await cookies();
  const v = jar.get(LANG_COOKIE)?.value;
  return isLocale(v) ? v : "en";
}
