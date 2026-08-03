import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SkillCatalog from "@/components/SkillCatalog";

// The skill catalog. This is the registry-driven component written during the
// single-page era (2026-07-26) — it supersedes the older /skills page, which
// was the same table with a hand-maintained list. Restored to its own route
// 2026-08-03 when the multi-page hub came back behind the login.
export default async function SkillsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return <SkillCatalog />;
}
