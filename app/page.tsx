import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SkillCatalog from "@/components/SkillCatalog";

// Single-page hub: the updater + the skill catalog.
//
// Second of the two gates. proxy.ts already turns away unauthenticated
// requests, but this re-checks server-side so the catalog can never render
// from a middleware misconfiguration alone.
export default async function HubPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return <SkillCatalog />;
}
