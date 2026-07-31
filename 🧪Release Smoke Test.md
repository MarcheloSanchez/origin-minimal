---
title: 🧪Release Smoke Test
type: system
status: 🔄active
tags:
  - ⚙️system
created: 2026-07-26
modified: 2026-07-26
obsidianUIMode: preview
---

> [!orbit] Wayfinder | [[🏡Home]] | [[⚡Automation Menu]] | [[👁️Dashboard]]

Ships as a bootstrap note — written once into a fresh vault, never overwritten by later releases (same rule as `🏡Home`/`👁️Dashboard`). Run this checklist in Obsidian after any `apply-release.sh` run, whether you're validating a release in TEST or verifying a fresh fork. Check boxes as you go; uncheck and re-run before the next release if anything regresses.

## Note Creation
- [ ] Create a new Atomic note via QuickAdd — YAML + body render correctly
- [ ] Create a new Effort note via QuickAdd — due date and priority fields present
- [ ] Create a new Source note via QuickAdd — source-specific fields present
- [ ] Create a new Meeting note — date auto-fills

## YAML System
- [ ] Run the YAML lint macro on `+Inbox` — clean report
- [ ] Run the YAML validator on a test note — no errors

## Metrics & Dashboards
- [ ] Run **Update Metrics Cache** via QuickAdd — `_Metrics Cache.md` fields populate
- [ ] Open `👁️Dashboard` — numbers display, no broken embeds (check the Tools section specifically)
- [ ] Open `📈Performance Metrics` — Dataview tables render

## Scripts
- [ ] Test `➡️Status Progression NEXT` / `⬅️Status Progression PREV` — advance/revert a note's status
- [ ] Test `status-picker.js` via Commander button
- [ ] Test `auto-metadata.js` on an inbox note — frontmatter populates correctly, `related` links are real wikilinks

## Template Composition
- [ ] Create a note via `Templates/Create/new-atomic.md` — `combine()` works
- [ ] Create a note via `Templates/Create/new-atomic-auto.md` — status defaults to `🔄active`

## Archival
- [ ] Test `archive-note.js` on a test note — status → `📦archived`, file moves to `06-Archive/`

## Folder Contracts
- [ ] Every content folder has its structural triple: `+About*ℹ️` contract note, hub note named after the folder, `_*_Data.base`
- [ ] No nested duplicate folders (e.g. `01-MOCs/01-MOCs`)

## This Release
- [ ] Everything called out in `RELEASE NOTES.md`'s latest entry actually behaves as described
- [ ] Anything that fails → note it here, then file it back to DEV as a BACKLOG card or capture

---
⬆️ [[🏡Home]]
