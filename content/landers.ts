// PFM ad landers by vertical. Source of truth: the "Discount Landers" Notion page.
// Auto + Home Forms now use the self-hosted Field Lander (/lander) — the on-camera
// shooting prop with tap-through funnel, editable rates (compliance floors baked in),
// and answer-driven discounts. Calls, Loans, and HVAC keep their own external landers.

export interface Lander {
  label: string;
  url: string;
}

export interface LanderGroup {
  vertical: string;
  landers: Lander[];
}

export const landersSourceUrl =
  "https://app.notion.com/p/3a516771e78081708d4cee784710bb40";

export const landerGroups: LanderGroup[] = [
  {
    vertical: "Auto",
    landers: [
      {
        label: "Forms — Field Lander (SaveMaxAuto, editable rate)",
        url: "https://pfmhub.up.railway.app/lander",
      },
      {
        label: "Calls",
        url: "https://m.civilcarcoverage.com/callPhone/v2-50mon?t=CivilCarCoverage&n=18338070235&c=23533&click_id={clickId}&source={sub4}&h2&sub2={sub2}",
      },
    ],
  },
  {
    vertical: "Home",
    landers: [
      {
        label: "Forms — Field Lander (SaveMaxHomes, editable rate)",
        url: "https://pfmhub.up.railway.app/lander",
      },
    ],
  },
  {
    vertical: "Loans",
    landers: [
      { label: "Forms #1 (with monthly)", url: "https://rate-rover-49.lovable.app/" },
      { label: "Forms #1 (no monthly)", url: "https://discountlander.lovable.app/" },
    ],
  },
  {
    vertical: "HVAC",
    landers: [
      { label: "Home Quiz Lander", url: "https://hearth-hvac-hub.lovable.app/" },
      { label: "Savings Quote", url: "https://warm-quote-finder.lovable.app/" },
    ],
  },
];
