# Content Changelog

## 2026-08-27 (5) — Fixed: 42 pre-1993 mayors invisible on /history by default

Jerry reported the 46 mayors weren't appearing on the live Timeline tab despite Claude Code
confirming clean creation. The hypothesis relayed (entity created without a HistoryEvent row) was
wrong — verified against production output: every mayor got both an entity AND an event, none
skipped. Real cause: `TimelineView.tsx`'s default "min significance" filter is 3, and the 42
pre-1993 mayors were deliberately given `significance: 1` to reflect their thin single-Wikipedia
sourcing — significance was accidentally doing double duty as both narrative-weight and the page's
default visibility gate. Fixed per Jerry's call: raised to 3 (matching the 4 modern mayors), so all
46 now show on the Timeline tab by default. The sourcing caveat is unaffected — it already lived in
`sourceNote`, which is the correct field for it. Mayors still don't appear in the scrolling ticker
(hard-filtered to `>= 4`), which is expected and fine — that's a highlights reel, not the full
timeline. Also fixed `add-mayors-and-ballot-measures.ts` itself so a future re-run produces the
right value from the start.
Script: `scripts/fix-mayor-significance.ts` (targeted `updateMany`, confirmed 42 rows affected).

## 2026-08-27 (4) — Round-2 diff's ~19 missing entries added: 17 events, 6 entities

Closes out the round-2 `docs/lansing-merged-timeline-MASTER.md` diff entirely. Standard
default-include applies (real date + real sourcing → in); nothing here was ambiguous enough to
flag and exclude. 167 → 184 `HistoryEvent` rows.

- **Eastern High School, three generations** (4 events): Jerry's 1984 graduation alongside Grandma
  Brett (1950) and grandson Christopher Norris (2023, different building — the current Eastern
  relocated to Marshall/Saginaw, funded by the 2016 bond); Sparrow's 2015-2016 site acquisition;
  McLaren's 2024 Collins Road campus opening (Greenlawn campus vacated) alongside Sparrow's
  psychiatric-facility planning start; the 2025 demolition + UM Health Plan wind-down. New entity:
  Grandma Brett. Reused existing Christopher Norris (id 19) and Virg Bernero (id 107) entities.
- **UM-Sparrow merger, granular sub-dates** (3 events): the Dec. 2022 affiliation agreement, the
  April 2023 $7B merger completion (with the nurse unionization detail carried over from the
  existing top-level 2023 event), the April 2024 rename. New entities: Sparrow Health System,
  University of Michigan Health.
- **Charter revision, full arc** (3 events): the 2024 Charter Commission election (36 candidates,
  the "200+ appointments" WKAR quote), the Nov. 2025 voter approval (independent auditor, 3-year
  strategic plan, transparency dashboard, 2029 "Super-Election" five-ward expansion), the Jan. 1
  2026 effective date with Schor's third-term swearing-in. New entity: Lansing Charter Commission
  (2024).
- **NOVA/ModPod, earlier phases** (2 events): the Aug. 2025 initiative launch ($640K, DRMM as sole
  applicant), the Nov.-Dec. 2025 site-selection meetings (48 properties narrowed to 5303 S. Cedar
  St). Reused existing Kimberly Coleman (id 79) and Detroit Rescue Mission Ministries (id 86).
- **Deep Green / Flock, complete thread** (5 events): the 2025 proposal + camera deployment, the
  Feb. 10 2026 hearing (200+ opposed, the Chamber-affiliated astroturf detail), the April 2026
  withdrawal, the July 13 moratorium (7-1, Garza's dissent), the Aug. 24 Flock-termination
  resolution (7-1, Spadafore's dissent). New entities: Flock Safety. Reused existing Deep Green
  (id 98), Jeremy Garza (id 97), Ryan Kost (id 39), Peter Spadafore (id 108).
- Script: `scripts/add-round2-missing-entries.ts`, idempotent (confirmed via a clean second run —
  all 17 events skipped as already existing, no duplicates).
- With this batch, the entire round-2 diff — 5 conflicts, 2 scope questions, ~19 missing entries —
  is fully closed. No open items remain from either diff round.

## 2026-08-27 (3) — Round-2 diff fully closed: Ottawa St, Dubai, LHC dates corrected

- **Ottawa Street Station**: confirmed the DB's 1908 build date was correct all along — my own
  "~1919-1922" guess (made splitting the old combined Accident Fund entry) was the error,
  conflating "when the city acquired it" (1919) with "when it was built" (1908). Added the
  E. Bement & Sons property detail and the city's Board of Water Works and Electric Lighting
  purchase context, both from the corrected reference doc.
- **Ottawa St Art Deco building** (id 85): corrected from a single "1939-1940" range to its real
  two-phase construction, 1937-1946 — south half complete 1939, north half 1946 (delayed by WWII
  material shortages). Added the Burns and Roe engineering credit.
- **Dubai commute** (id 34): tightened `datePrecision` from "approximate" to "month" per Jerry's
  direct confirmation of Spring 2002 (the sandbox doc's own "~2000" was the less precise value).
  **Flagged, not removed**: the 98/180 trip-count and 600/year→5 death-reduction figures on this
  event already carry a citation — sourceTier S, sourceNote "Radiical Systems case study April
  2024" — that predates this reconciliation project and isn't in the sandbox doc. Reported back to
  Jerry to confirm the citation rather than assuming it's right or stripping it as unsourced.
- **LHC dispositions** (id 49): retitled and redated from "833 to 66 units" / 2018-2026 to
  "833 to 66 units (2020-2026)" / 2020-2026, matching the sandbox doc's Case 7 retitle — RAD
  conversions beginning ~2020 (South Washington Park, Mount Vernon Park) through the SK Investment
  Group sale (Oct.-Dec. 2021 proposals, 2022 HUD approval/closing) and ongoing through 2026. 2018
  had no documented basis on either side.
- Reference docs renamed to match the sandbox chat's actual filenames going forward:
  `docs/source-timeline.md` → `docs/lansing-merged-timeline-MASTER.md`; added
  `docs/lansing-full-accounting-MASTER.md` and refreshed `docs/CHANGELOG.md` (both dropped in by
  Jerry with a stray trailing space in the filename before `.md` — corrected mechanically, not a
  content decision).
- Script: `scripts/fix-round2-remaining-conflicts.ts`, idempotent (checks current field values
  before writing, safe to re-run — confirmed via a second local run producing no-op "already
  correct" on 2 of 4 items after the first run applied them).
- With this, every item from the round-2 diff (2 conflicts + 2 scope questions from the prior
  batch, plus these 4) is closed. Next: the ~19 still-missing entries, grouped by thread.

## 2026-08-27 (2) — Round-2 diff resolutions: Riddle date fix, ballot measures, 46 mayors

Closing out the two remaining conflicts + two scope questions from the round-2
`docs/source-timeline.md` diff, per Jerry's "Round 2 Diff — Resolutions and Scope Decisions"
message, before moving to the ~19 still-missing entries.

- **Fixed**: "Jerry expelled from Riddle" (id 25) — `eventDate` corrected 1977 → 1978, confirmed
  by Jerry as his own lived history (previously applied to local dev only via manual SQL during
  the round-2 review; now scripted and idempotent).
- **Added** the two Nov. 3, 2026 statewide ballot measures (Michiganders for Money Out of
  Politics; the constitutional convention question) as `HistoryEvent` rows dated 2026-11-03, with
  explicit "SCHEDULED, outcome not yet known" language in the description — no schema flag exists
  for scheduled-vs-occurred, so this is a text-note approach per Jerry's fallback instruction.
- **Added all 46 Lansing mayors** (1859–present) as Entity + HistoryEvent pairs. Reused the
  existing David Hollister (id 29) and Virg Bernero (id 107) entities rather than duplicating;
  created new entities for Tony Benavides and Andy Schor. The 42 pre-1993 mayors carry the sandbox
  doc's own single-source caveat (Wikipedia, not independently cross-checked) forward verbatim in
  `sourceNote`; the 4 post-1993 mayors (Hollister/Benavides/Bernero/Schor) don't, since they're
  independently multi-source verified elsewhere in this project. Non-consecutive-term mayors
  (Robson, Tooker, Buck, Barnes, Turner, Ferle) got one entity/event each, dated to their first
  term's start year, with full term history in the description rather than duplicate rows.
- **Still open, not touched this pass**: the Dubai commute date (2000 vs. 2002) and the LHC
  dispositions date-range scope question — both still waiting on Jerry's call. The Ottawa Street
  Station build-date conflict — reported back to Jerry as needing genuine primary-source research,
  since the DB's 1908 has no better standing than his own "~1919-1922" guess.
- Script: `scripts/add-mayors-and-ballot-measures.ts`, idempotent (checks for existing entity by
  name / event by title before creating, safe to re-run).

Case, pattern, and entity content in this project lives in the production Postgres database on
the Pi, not in this repo — it's edited via `/admin/*` UI or one-off scripts under `scripts/`, so
it carries none of git's normal audit trail. This file is that trail: one entry per session where
a seed script or admin-UI change meaningfully added, corrected, or removed case/pattern/entity/
action content. Code changes are still covered by normal git history; this file is for the data.

---

## 2026-08-27 — Full `docs/source-timeline.md` reconciliation: 56 events added

Following the three-way diff (28 matches, 5 conflicts, ~55 missing) and Jerry's default-include
decision on the two scope questions. 63 → 119 `HistoryEvent` rows.

- **Environmental Governors + Line 5 + property tax** (11 events): Milliken/Engler/Snyder/Whitmer
  governor transitions and their signature environmental actions, the Line 5 easement
  revocation/defiance, the July 15 2026 EGLE tunnel-permit/data-center-pledge same-day pair
  (cross-referenced in each other's description text), and the 1994 Proposal A vote — the
  load-bearing date underneath the Case 13 property tax findings. 4 new entities: Milliken,
  Engler, Snyder, Whitmer, Enbridge.
- **Deep Roots + early 20th century civic** (10 events): DeWeese family arrival (~1690), William
  Dewees Jr. born, the Arnold family settling Beaver Island (dated correctly this time — see the
  2026-08-26 entry above), REO Motor Car Co., the first Ottawa Street station, Lansing's first
  boundary expansion, the Bath School massacre, the Depression on the factory floor, Boji Tower,
  the Kerns Hotel fire, and the Art Deco Ottawa Street Power Station.
- **Norris family life events** (21 events): Keith and Thelma's births, Monty delivering groceries
  with Gregory Eaton, the Armstrong/Julia Street moves, Monty's 1972 instruction to 6-year-old
  Jerry, Kendon Elementary, the Lansing busing fight (*NAACP v. Lansing Board of Education*,
  *Milliken v. Bradley*), Atwood/Gardner, the Eastern transfer via Joel Ferguson's Sadie Court
  apartment, Jerry's Michigan graduation and ISO 9000 auditor years, Ottawa Street's
  decommissioning, Jackson Field, the Hollister Blue Ribbon Committee, Raven and Rain's births,
  Kevin Jones's 1999 death, and Yoor Mom Skateboards.
- **Remaining civic/legal/corporate** (13 events): the 1958 I-496 route decision, North District
  annexation, I-496's 1970 completion, the "framework clicks" polycentric-governance moment
  (2009, marked approximate — the source itself says the exact date is Jerry's to place),
  Right to Work's actual 2012 passage, Rotary Park/City Market's 2019 turnover, the 2021 Detroit
  Rising lease with its purchase option, UM-Sparrow's 2023 nurse unionization, the 2025 I-496
  cap-study grant, the 2026 AF Group sale, Capital City Wrecking Company (1928–2000, exact LARA
  dates both ends), and *Bolt v. City of Lansing* (1998).
- **Intentionally not added, flagged instead of guessed:** the 1982 "Right to Work seeds planted"
  scene-setting (too vague — the real 2012 passage is covered); the Pleasant Lake/Grandma Brett
  family story (no date anywhere in the source beyond "as a child").
- The reference-only sections (water systems geography, granular property-tax stats beyond
  Proposal A, the one-paragraph governors overview, the 2026 governor's race candidate list)
  were deliberately left as reference material, not forced into dated events, per Jerry's own
  scoping note that these read as analysis built on top of the events, not events themselves.
- Scripts: `scripts/add-governors-line5-property-tax-events.ts`,
  `scripts/add-deep-roots-early-civic-events.ts`, `scripts/add-norris-family-life-events.ts`,
  `scripts/add-remaining-civic-legal-events.ts`.

---

## 2026-08-26 (cont'd, 5) — Treaty of Saginaw / Morrill Act added to `/history`

- Added two `HistoryEvent` rows: the 1819 Treaty of Saginaw and the 1855–1862 Michigan
  Agricultural College/Morrill Act land-grant story — the same civic material Case 0 already
  covers in `BoardCaseStudy` benefit/cost form, now also in the Timeline/Map's narrative form.
  Content adapted from Case 0's own already-sourced text, not written fresh.
  Confirmed chronological order: Dewees/Valley Forge (1777) → **Treaty of Saginaw (1819)** →
  Biddle City (1835, already existed) → statehood (1847) → Michigan Agricultural College (1855).
- Linked to the existing Case 0 entities (Anishinaabeg, Saginaw Band of Chippewa, MSU/Michigan
  Agricultural College, Bingham, Morrill) via `EntityEvent`.
- **Confirmed `/history`'s actual scope while doing this** — it was an open question whether the
  Timeline should include Jerry's personal family genealogy alongside civic content at all.
  Checked directly: 37 of 114 entities and 38 of 61 events (now 63) were already tagged
  `familyStory: true` before this change, including the very first chronological entry (Dewees,
  1777). The site is a deliberately blended family + civic timeline by design, not civic-only —
  this isn't an open scope question, it's already-built architecture.
- Script: `scripts/add-saginaw-morrill-history-events.ts`.

---

## 2026-08-26 (cont'd, 4) — Case 13 added: The Assessor and Board of Review

- Added Case 13 ("The Assessor and Board of Review — A Self-Review Loop") as the 13th
  `BoardCaseStudy` — full text supplied by Jerry from the sandbox session. Structural finding
  about the mayoral dual-appointment of the Assessor and the Board of Review; deliberately names
  no individual as having acted improperly. **Preserve that framing in any future edit** — don't
  let it get sharpened into an accusation against the current Assessor, Mayor, or Board of Review.
- Cross-referenced from Pattern 18 (Binding Seat at the Table) and Pattern 22 (The Watch List)
  via `Pattern.caseRefs`.
- With this, the four-case sandbox reconciliation plus Case 13 are all merged. Still outstanding:
  Andrew Muylle/Faye Norris context (Case 10), Polycentricity.docx publication, the Deep Green
  43-vs-6 citation.
- Script: `scripts/add-case13-assessor-board-of-review.ts`.

---

## 2026-08-26 (cont'd, 3) — 428 W. Lenawee cluster + full entity geocoding pass

- **428 W. Lenawee**: confirmed via WLNS reporting that this is the Law Office of Reid Felsing,
  PLC — a campaign-finance law firm serving as registered filing address for multiple PACs.
  Added as its own entity, plus Lansing's Future PAC, Michigan Vindicated, and a third committee
  found independently while researching (Vote Yes Lansing 2025 Ballot Committee), all at that
  address. **Confirmed LRC-PAC itself is NOT registered there** — its own address (500 E.
  Michigan Ave) is unchanged; the only link is a $5,000 LRC-PAC donation to Lansing's Future PAC
  (April 19, 2024), a financial relationship, not a shared-address one.
- **Geocoding**: every `Entity` row with an address but no coordinates now has them (7 total,
  confirmed against production first) — Jerry's birthplace and childhood family home, Norris
  Grocery, Everett High School, Comfort Street Landfill, Haag Road, Sadie Court. Jerry confirmed
  historical family addresses are fine to geocode/publish (none are current addresses). House-
  number matches marked `geocoded`; street-only matches (no house number ever recorded) marked
  `approximate`.
- Checked `/history` for the Treaty of Saginaw / Morrill Act narrative material the sandbox
  Timeline document added — confirmed missing from `HistoryEvent` on production. Case 0 already
  covers this in benefit/cost form via `BoardCaseStudy`; the Timeline-style narrative version is
  still queued, waiting on the sandbox text.
- Scripts: `scripts/add-428-lenawee-entities.ts`, `scripts/geocode-remaining-entities.ts`.

---

## 2026-08-26 (cont'd) — Three gap-fill merges from the sandbox diff

- **Case 10**: merged the Lansing Eastern High School material into the "physical evidence is
  being erased" bullet (2016 $2.475M sale, 2025 demolition for the UM-Sparrow psychiatric
  hospital, the 2013 Bernero "done deal" timing finding, the Coalition to Preserve Eastern/Linda
  Peckham preservation fight, an open unconfirmed-union research thread separate from Case 12's
  confirmed Local 333). Added Rawley Van Fossen and Ryan Kost to Case 10's players (both already
  existed as entities from other cases). Created 5 new entities: Linda Peckham, Virg Bernero,
  Peter Spadafore, Margaret Dimond, Ann Marie Creed.
- **Case 12**: added the Garza April 20 (absent for the referral vote) / May 18 (present and
  chairing, moratorium not on the agenda) attendance detail to the existing conflict-of-interest
  finding.
- **Case 0**: added the explicit CPI methodology citation (×33 multiplier, in2013dollars.com +
  BLS CPI-U from 1913 forward) for the $300K→$9.9M Morrill Act figure.
- **Deliberately not added**: Andrew Muylle and Faye Norris, named in the sandbox's "new entities
  this introduces" list but with no role or context given anywhere in the actual provided text —
  flagged back rather than fabricated, per the no-fabrication rule. Waiting on Jerry.
- Script: `scripts/merge-eastern-garza-cpi-gaps.ts`, idempotent (checks for the new text before
  appending, safe to re-run).

## 2026-08-26 — Diff request against the sandbox version

- Exported full content for Case 0, 10, 11, 12 (`scripts/export-cases-for-diff.ts`) for a
  field-by-field comparison against a parallel version maintained in a separate Claude.ai
  session's sandbox.
- Findings: Case 0's Morrill Act figures match exactly; Case 11's DRMM/cost-history/Coleman
  content all present and correct. Three real gaps found — Case 0 is missing an explicit
  CPI-methodology citation for the $300K→$9.9M conversion; Case 10 has no Eastern High School
  sale/demolition material at all; Case 12 is missing the Garza April 20 (absent) / May 18
  (present, moratorium not on agenda) attendance detail. None merged yet — waiting on the
  sandbox-side content for those three specific gaps before touching the DB.

## 2026-08-23/24 — Case 0, Case 12, isPublic, ActionItem

- Added **Case 0** ("The Land Before the Cases" — 1819 Treaty of Saginaw, 1836 Treaty of
  Washington, Michigan Agricultural College / Morrill Act, Biddle City) and **Case 12** (Deep
  Green / data center moratorium / I-HVY loophole) as published `BoardCaseStudy` rows, plus the
  13 entities and 1 place they reference. Source: `lansing-full-accounting-MASTER.md` pasted in
  by Jerry that session.
- Merged 4 duplicate `BoardCaseStudy` pairs (BWL, Ingham County Land Bank, Chamber/PAC, Lansing
  Housing Commission) that existed as separate governance-investigation vs. Full-Accounting-
  narrative entries covering the same institutions — content from both sides preserved, old
  slugs redirect.
- Added `isPublic` to `Entity`/`HistoryEvent`/`DollarFlow`, filtered server-side on `/history`,
  admin-only "Show hidden" toggle to review private entries in context.
- Added `ActionItem` — consolidates case recommendations, roadmap milestones, and future tasks
  into one filterable, manageable list (`/governance/actions`), migrated from the free-text
  `recommendations` field previously sitting unmanaged on each case.

*(Earlier content changes this project — the original Cases 1–9/11 build, the four-pair
duplicate discovery, geocoding passes, entity/place updates — happened before this file existed
and aren't retroactively logged here. Starting from this date forward.)*
