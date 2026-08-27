# Content Changelog

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
