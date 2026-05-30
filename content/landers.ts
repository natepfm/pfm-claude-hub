// PFM ad landers by vertical. Source of truth: the "Discount Landers" Notion page.
// These are public-facing landing pages — the destinations our ads point to.

export interface Lander {
  label: string;
  url: string;
}

export interface LanderGroup {
  vertical: string;
  landers: Lander[];
}

export const landersSourceUrl =
  "https://www.notion.so/powerfoxmedia/Discount-Landers-31e16771e78080d29c13d491e0e354d3";

export const landerGroups: LanderGroup[] = [
  {
    vertical: "Auto",
    landers: [
      { label: "Forms — One Car ($57)", url: "https://best.autodrivenow.com/" },
      { label: "Forms — Discount Lander ($57)", url: "https://ai-drive-quest.lovable.app/" },
      { label: "Forms — Discount Lander 2 ($57)", url: "https://rate-quest-ai.lovable.app/" },
      { label: "Forms — Multi-Car ($88)", url: "https://auto-rate-finder.lovable.app/" },
      {
        label: "Calls",
        url: "https://m.civilcarcoverage.com/callPhone/v2-50mon?t=CivilCarCoverage&n=18338070235&c=23533&click_id={clickId}&source={sub4}&h2&sub2={sub2}",
      },
    ],
  },
  {
    vertical: "Home",
    landers: [{ label: "Forms", url: "https://snap-quote-search.lovable.app/" }],
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
