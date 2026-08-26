# Content Changelog

Case, pattern, and entity content in this project lives in the production Postgres database on
the Pi, not in this repo — it's edited via `/admin/*` UI or one-off scripts under `scripts/`, so
it carries none of git's normal audit trail. This file is that trail: one entry per session where
a seed script or admin-UI change meaningfully added, corrected, or removed case/pattern/entity/
action content. Code changes are still covered by normal git history; this file is for the data.

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
