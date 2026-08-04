---
up: "[[🏛️My PKM Governance]]"
title: Release Playbook
type: guide
tags:
  - ⚙️system
  - 📋documentation
status: 🔄active
maturity: 🌱seedling
created: "2026-07-15"
modified: "2026-07-16"
related:
  - "[[📦Release Versioning Convention]]"
  - "[[🗺️Vault Topology & Promotion]]"
  - "[[RELEASE NOTES]]"
---

> [!orbit] Wayfinder | [[🏛️My PKM Governance]] | [[📦Release Versioning Convention]] | [[🗺️Vault Topology & Promotion]]

# 🚢Release Playbook

The procedural owner of "how a release happens". Policy (WHEN to cut, what MAJOR/MINOR/PATCH mean) lives in [[📦Release Versioning Convention]]; topology (WHERE releases go) lives in [[🗺️Vault Topology & Promotion]]. This note owns the HOW — the ordered checklist. Design rationale: `AIOS/docs/specs/2026-07-15-origin-ecosystem-release-management-design.md` (local-only).

## The pipeline at a glance

DEV (git, factory) → release branch + tag → package (`Origin-Releases/`) → TEST validates (fresh folder + package apply) → MAIN/SPEC apply (plain files; Obsidian Sync distributes).

**Iron rules**
1. One-way flow: system files are edited only in DEV. A change wanted elsewhere = capture into DEV `+Inbox`/BACKLOG.
2. One vault, one sync system: DEV (git) never receives packages; package vaults (TEST/MAIN/SPEC) never become git repos.
3. Packages are immutable; a broken package means a new PATCH, never an edit.
4. Rollback is never a history rewrite: previous tag (DEV) or previous package / `_release-backups/` (TEST/MAIN/SPEC).
5. DEV git is a PRIVATE full-backup repo (2026-07-16) — personal content is in history; the repo must never go public. The release surface is owned by `release-manifest.json` + the leak gate, not by `.gitignore` (old surface-gitignore archived at `AIOS/docs/reference/gitignore-public-surface-2026-07-16.md`).

## Release checklist

### 1 · Freeze
- [ ] Declare in BACKLOG + `AIOS/memory/hot.md`: "frozen for vX.Y.Z". Only release fixes land on `main` until cut.

### 2 · Pre-release audit
- [ ] Run the three audit scopes (precedent: `AIOS/orchestration/reports/2026-07-11-release-audit-*`): **A** dashboards + Automation Menu, **B** vault sweep (enums, templates, wikilinks), **C** doc staleness.
- [ ] Orchestrator spot-checks every agent's "verified" claims before trusting them.
- [ ] Triage: 🔴 blockers fixed now · 🟡 deferred → BACKLOG cards. Never cut with open blockers.

### 3 · Cut (order is mandatory)
- [ ] `RELEASE NOTES.md`: new `## [vX.Y.Z] – YYYY-MM-DD` entry (headline test) — first.
- [ ] Merge/update the `release` branch to the cut state (Tier 1 surface).
- [ ] `git tag vX.Y.Z` on the release branch — after the notes, never before.

### 4 · Build
- [ ] `bash 99-System/Scripts/build-release-package.sh --version vX.Y.Z` (from the tagged state).
- [ ] Leak check must pass on its own — `--force-leaks` requires writing the reason into the RELEASE NOTES sign-off.

### 5 · Validate in TEST
- [ ] Delete (or set aside) the old TEST → fresh folder → `bash <package>/apply-release.sh <package> Origin_TEST`. TEST validates the **package** (clean-room: exactly what MAIN/SPEC receive), never a git clone.
- [ ] Bootstrap the Obsidian runtime: copy DEV's `.obsidian/` into TEST, minus `workspace.json`/`workspaces.json` (plugins are runtime, not release surface — they don't ship in the package).
- [ ] Smoke checklist: open `🧪Release Smoke Test` **inside the applied vault itself** (it ships as a bootstrap note, so it's already sitting there — no need to flip back to this DEV doc or [[🚀Vault Migration Guide]] §6, which it mirrors). Work through it and check boxes as you go.

### 6 · Promote
- [ ] MAIN, desktop, devices idle: `bash <package>/apply-release.sh <package> <vault> --dry-run` → read the diff and every drift line → run without `--dry-run` → work the Tier 2 checklist by hand.
- [ ] SPEC vaults: same, when the release is relevant; record a skip otherwise.

### 7 · Post-release
- [ ] Sign-off block appended to the RELEASE NOTES entry: audit report link · TEST result · drift findings · applied-to/skipped list · package path.
- [ ] Update `AIOS/contracts/vault-registry.json` rows (version, last_applied / skipped).
- [ ] Archive `CHANGELOG.md` entries older than this release's cut date → new chunk in `06-Archive/Reference/Changelogs/`, named `CHANGELOG-v<from>-to-v<to>-archived-YYYY-MM-DD.md` (design: `AIOS/docs/specs/2026-07-19-changelog-archival-workflow-design.md`). Update the `## Archived history` index at the top of `CHANGELOG.md`.
- [ ] Deferred items → BACKLOG. Unfreeze.

## Hotfix / emergency
- Patch-forward on the release branch → `vX.Y.(Z+1)` → build → apply. TEST may be skipped **only** for doc-only patches; an emergency fix scopes step 2 to the affected subsystem instead of skipping it.

## Rollback
- **DEV**: `git checkout vPREV`. **TEST**: re-provision from the older package.
- **MAIN/SPEC**: re-apply the previous package from `Origin-Releases/`, or restore from the vault's `_release-backups/<ver>-<date>/`. Then file the failure as a capture in DEV.

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
