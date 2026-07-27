import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SkillCatalog from "@/components/SkillCatalog";

// Server-side auth gate. Middleware already blocks unauthenticated requests,
// but this is the second, independent check — the catalog is never rendered
// or sent to the browser without a valid PFM session.
export default async function HubPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return <SkillCatalog />;
}
