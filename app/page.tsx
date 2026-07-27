import SkillCatalog from "@/components/SkillCatalog";

// Single-page hub: the updater + the skill catalog.
// NOTE: sign-in is intentionally not wired yet (Sam 2026-07-26 — Google
// OAuth setup pending). The full gate lives in commit e7de887: auth.ts,
// proxy.ts, app/login, app/api/auth. Restore it with:
//   git checkout e7de887 -- auth.ts proxy.ts app/login app/api/auth
export default function HubPage() {
  return <SkillCatalog />;
}
