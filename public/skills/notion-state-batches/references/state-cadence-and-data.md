# State Cadence + Per-Vertical Data

The locked reference for building PFM Breaking News state-continuation batches. The **cadence** (which states land in which batch) is fixed across every BN story so they're A/B comparable. The **cities and dollar numbers** depend on the vertical — Auto and Home use different Bankrate averages and sometimes different cities.

## Locked state cadence (mirror Car Chase BN)

| Batch | Count | States (in order) |
|---|---|---|
| Batch 1 | 5 | per-story — set when Batch 1 is built, varies |
| Batch 2 | 10 | Virginia, Utah, Idaho, Kansas, Arizona, Maryland, Michigan, Missouri, Illinois, New Mexico |
| Batch 3 | 10 | Iowa, Georgia, Ohio, Nebraska, Oregon, Minnesota, Alabama, Tennessee, Massachusetts, Wisconsin |
| Batch 4 | 10 | Oklahoma, Indiana, Arkansas, Delaware, Maine, West Virginia, Nevada, Connecticut, Kentucky, North Carolina |
| Batch 5 | 5 | New York, California, New Jersey, South Carolina, Louisiana |
| Batch 6 (Final) | 10 | Mississippi, Rhode Island, South Dakota, Hawaii, Montana, New Hampshire, Alaska, North Dakota, Wyoming, Vermont |

Batch 5 is the held-back high-volume set (NY/CA/NJ historically kept off earlier batches, then cleared). Batch 6 is the lower-volume cleanup that closes all 50.

**Coverage math:** 5 + 10 + 10 + 10 + 5 + 10 = 50. If Batch 1 swapped a non-cadence state in (so a cadence state is uncovered) or used a state the cadence assigns later (a dupe), adjust per the SKILL.md "Dupe handling" section and re-check that the unique total still hits 50.

## Article handling (a/an)

Lines like "a [STATE] homeowner" / "If you're a [STATE] driver" need the right article. Vowel-SOUND states take **"an"**:

> **Alabama, Alaska, Arizona, Arkansas, Idaho, Illinois, Indiana, Iowa, Ohio, Oklahoma, Oregon**

Everyone else takes **"a"** — including **Utah** ("a Utah", it's a Y consonant sound). The rate line ("The average [STATE] homeowner now pays...") has no article and is never affected.

Per cadence batch, the "an" states are:
- **Batch 2:** Idaho, Arizona, Illinois
- **Batch 3:** Iowa, Ohio, Oregon, Alabama
- **Batch 4:** Oklahoma, Indiana, Arkansas
- **Batch 5:** (none — all take "a")
- **Batch 6:** Alaska

## AUTO vertical — full reference table

Locked across Car Chase BN, Car Repo BN, Auto Karen HOA BN. VO uses the rounded values; the on-screen graphic uses the exact Bankrate average.

| State | City | Graphic (exact) | VO annual | VO monthly |
|---|---|---|---|---|
| Virginia | Richmond | $1,776/yr · $148/mo | over $1,700 | over $145 |
| Utah | Salt Lake City | $2,002/yr · $167/mo | over $2,000 | over $165 |
| Idaho | Boise | $1,339/yr · $112/mo | over $1,300 | over $110 |
| Kansas | Wichita | $2,171/yr · $181/mo | over $2,100 | over $180 |
| Arizona | Phoenix | $2,257/yr · $188/mo | over $2,200 | over $185 |
| Maryland | Baltimore | $2,290/yr · $191/mo | over $2,200 | over $190 |
| Michigan | Detroit | $2,859/yr · $238/mo | over $2,800 | over $235 |
| Missouri | St. Louis | $2,326/yr · $194/mo | over $2,300 | over $190 |
| Illinois | Chicago | $2,004/yr · $167/mo | over $2,000 | over $165 |
| New Mexico | Albuquerque | $1,921/yr · $160/mo | over $1,900 | over $155 |
| Iowa | Des Moines | $1,683/yr · $140/mo | over $1,600 | over $135 |
| Georgia | Atlanta | $2,410/yr · $201/mo | over $2,400 | over $200 |
| Ohio | Columbus | $1,422/yr · $119/mo | over $1,400 | over $115 |
| Nebraska | Omaha | $1,839/yr · $153/mo | over $1,800 | over $150 |
| Oregon | Portland | $1,857/yr · $155/mo | over $1,800 | over $150 |
| Minnesota | Minneapolis | $2,021/yr · $168/mo | over $2,000 | over $165 |
| Alabama | Birmingham | $1,836/yr · $153/mo | over $1,800 | over $150 |
| Tennessee | Nashville | $1,787/yr · $149/mo | over $1,700 | over $145 |
| Massachusetts | Boston | $1,777/yr · $148/mo | over $1,700 | over $145 |
| Wisconsin | Milwaukee | $1,750/yr · $146/mo | over $1,700 | over $140 |
| Oklahoma | Tulsa | $2,576/yr · $215/mo | over $2,500 | over $210 |
| Indiana | Indianapolis | $1,668/yr · $139/mo | over $1,600 | over $135 |
| Arkansas | Little Rock | $2,321/yr · $193/mo | over $2,300 | over $190 |
| Delaware | Wilmington | $2,500/yr · $208/mo | over $2,400 | over $205 |
| Maine | Bangor | $1,408/yr · $117/mo | over $1,400 | over $115 |
| West Virginia | Charleston | $2,135/yr · $178/mo | over $2,100 | over $175 |
| Nevada | Reno | $2,535/yr · $211/mo | over $2,500 | over $210 |
| Connecticut | Hartford | $2,310/yr · $193/mo | over $2,300 | over $190 |
| Kentucky | Louisville | $2,807/yr · $234/mo | over $2,800 | over $230 |
| North Carolina | Charlotte | $1,412/yr · $118/mo | over $1,400 | over $115 |
| New York | New York City | $2,898/yr · $242/mo | over $2,800 | over $240 |
| California | Los Angeles | $2,848/yr · $237/mo | over $2,800 | over $235 |
| New Jersey | Newark | $2,687/yr · $224/mo | over $2,600 | over $220 |
| South Carolina | Charleston | $2,407/yr · $201/mo | over $2,400 | over $200 |
| Louisiana | New Orleans | $3,718/yr · $310/mo | over $3,700 | over $305 |
| Mississippi | Jackson | $2,008/yr · $167/mo | over $2,000 | over $165 |
| Rhode Island | Providence | $2,414/yr · $201/mo | over $2,400 | over $200 |
| South Dakota | Sioux Falls | $2,150/yr · $179/mo | over $2,100 | over $175 |
| Hawaii | Honolulu | $1,655/yr · $138/mo | over $1,600 | over $135 |
| Montana | Billings | $2,048/yr · $171/mo | over $2,000 | over $170 |
| New Hampshire | Manchester | $1,480/yr · $123/mo | over $1,400 | over $120 |
| Alaska | Anchorage | $2,217/yr · $185/mo | over $2,200 | over $180 |
| North Dakota | Fargo | $1,825/yr · $152/mo | over $1,800 | over $150 |
| Wyoming | Cheyenne | $1,720/yr · $143/mo | over $1,700 | over $140 |
| Vermont | Burlington | $1,237/yr · $103/mo | over $1,200 | over $100 |
| Washington | Tacoma | $1,602/yr · $134/mo | over $1,600 | over $130 |

Batch 1 Auto states from the Car Chase / Car Repo runs (for reference): Florida (Tampa, $2,737/yr · $228/mo, "over $2,700 / over $225"), Washington (above), Colorado (Denver, $2,545/yr · $212/mo, "over $2,500 / over $200"), Pennsylvania (Pittsburgh, $2,993/yr · $249/mo, "over $2,900 / over $240"), Texas (Austin, $2,790/yr · $233/mo, "over $2,700 / over $225").

## HOME vertical — partial reference table

Home insurance averages are much higher than Auto and the city choices sometimes differ (e.g., Texas → Houston for Home, Austin for Auto). Only the Home Karen HOA Batch 1 states are locked so far:

| State | City | Graphic (exact) | VO annual | VO monthly |
|---|---|---|---|---|
| Nebraska | Omaha | $6,587/yr · $549/mo | over $6,500 | over $545 |
| Texas | Houston | $3,899/yr · $325/mo | over $3,800 | over $320 |
| Oklahoma | Tulsa | $4,695/yr · $391/mo | over $4,600 | over $390 |
| Colorado | Denver | $3,412/yr · $284/mo | over $3,400 | over $280 |
| Washington | Tacoma | $1,539/yr · $128/mo | over $1,500 | over $125 |

**For any Home state not in this table**, pull the current average from the Bankrate home source ([bankrate.com/insurance/homeowners-insurance/states](https://www.bankrate.com/insurance/homeowners-insurance/states/)), then round the VO values: annual down to the nearest hundred ("over $X,X00"), monthly down to a clean figure ("over $XXX"). Keep the exact figure for the on-screen graphic. When a Home BN gets scaled to Batches 2-6, fill this table out and flag to the editor that the new Home numbers came from a fresh Bankrate lookup so they can sanity-check.

## Notes on sourcing

- **Cities** = the largest / highest-pain metro for the state. The Auto table cities are the established set; reuse them for Auto. For Home, default to the same metro unless Batch 1 chose differently.
- **The numbers drift.** Bankrate updates its averages. If a story's Batch 1 shows a different number for a state than this table, trust Batch 1 (it's the most recent vetted figure for that run) and note the discrepancy.
- **Broad version** (not a state) uses the conservative national framing: Auto "over $2,000/yr · over $170/mo"; Home "over $2,200/yr · over $180/mo". The broad lives in Batch 1 — Batches 2-6 are state-only and never re-do the broad.
