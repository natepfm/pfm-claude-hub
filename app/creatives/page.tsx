import { redirect } from "next/navigation";

// Hub slimmed to a single page (Sam 2026-07-26) — this route now redirects
// so existing Slack / Notion links don't 404. Content lives in Notion.
export default function LegacyRoute() {
  redirect("/");
}
