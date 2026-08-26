# Content Changelog

Case, pattern, and entity content in this project lives in the production Postgres database on
the Pi, not in this repo — it's edited via `/admin/*` UI or one-off scripts under `scripts/`, so
it carries none of git's normal audit trail. This file is that trail: one entry per session where
a seed script or admin-UI change meaningfully added, corrected, or removed case/pattern/entity/
action content. Code changes are still covered by normal git history; this file is for the data.

---

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
