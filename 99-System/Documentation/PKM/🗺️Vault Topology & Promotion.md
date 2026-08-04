---
up: "[[🏛️My PKM Governance]]"
title: Vault Topology & Promotion
type: guide
tags:
  - ⚙️system
  - 📋documentation
status: 🔄active
maturity: 🌱seedling
created: "2026-07-15"
modified: "2026-07-16"  
related:
  - "[[🚢Release Playbook]]"
  - "[[📦Release Versioning Convention]]"
---

> [!orbit] Wayfinder | [[🏛️My PKM Governance]] | [[🚢Release Playbook]] | [[📦Release Versioning Convention]]

# 🗺️Vault Topology & Promotion

Roles are fixed; the vault list is data. The live map is `AIOS/contracts/vault-registry.json` in DEV (local-only, never ships) — this note owns the rules the map obeys.

## Roles

| Role | Purpose | Lifespan | Sync system | Gets releases via |
|---|---|---|---|---|
| **DEV** | Factory — the only place system files are edited. **Private full-backup git repo (2026-07-16): personal content is in history — never make it public** | permanent | git | — (source) |
| **TEST** | Clean-room validation of the release package + plugin/feature experiments; assumed breakable | disposable — delete & re-provision | none (plain folder) | package + `apply-release.sh`, then `.obsidian` hydrated from DEV |
| **MAIN** | The life vault | permanent | **Obsidian Sync only** | package + `apply-release.sh` |
| **SPEC** | Domain vaults (WORK, …); may skip irrelevant releases | permanent | Obsidian Sync (or none) | package + `apply-release.sh` |

## Rules

1. **One sync system per vault.** Git and Obsidian Sync never share a folder. No exceptions, no inverted-gitignore tricks.
2. **One-way flow** DEV → TEST → MAIN/SPEC. Feedback returns as captures, never as file edits outside DEV.
   TEST receives the **package** (not a git clone) so it validates exactly what MAIN/SPEC will receive; its Obsidian runtime (`.obsidian/`, minus workspace state) is copied from DEV as a bootstrap step — plugins are runtime, not release surface.
3. **Naming**: `Origin_<ROLE>[_<Name>]`, role uppercase — `Origin_DEV`, `Origin_TEST`, `Origin_MAIN_Ideaverse`, `Origin_SPEC_Work`. **No version numbers in folder names** — versions live in tags and `99-System/Config/.origin-version`.
4. **TEST is cattle.** Keepable work graduates to DEV before TEST is destroyed. Only ever one TEST folder.
5. **Registry is authoritative.** Tooling reads `vault-registry.json`; nothing hardcodes vault paths. Folders not matching the naming convention are presumed `RETIRED` until deleted.
6. **Every vault knows its version** via `99-System/Config/.origin-version` (shipped by the package builder). Drift = a system file differing from what its recorded release shipped → surfaced by `apply-release.sh --dry-run`.

## What moves (summary — canonical list is `AIOS/contracts/release-manifest.json`)

- **Tier 1, auto**: Templates, Scripts, FileClass, CIS, Config, Images, AIOS runtime/rules/contracts, PKM docs, README + RELEASE NOTES, `+About` / hub-note structure skeletons, `_*_Data.base` Bases files, folder directory tree (empty skeleton structure only — Tier 3 content never ships). Leak gate blocks here.
- **Bootstrap, ship-once (2026-07-16)**: MOCs, root dashboards (Home/Dashboard/Review HQ/TODO/Automation Menu), Me + profile, CLAUDE.md, LICENSE, 07-Prompts docs, AIOS docs — written only where absent; a consumer vault's living copies are never overwritten or drift-flagged. Leak gate warns only.
- **Tier 2, gated**: `.obsidian` plugin configs — shipped as reference copies, merged by hand from the apply checklist.
- **Tier 3, never**: personal content folders (Calendar, Efforts, personal Atomics/Sources, prompt Library), CHANGELOG, BACKLOG, plans/specs/adr, sessions, caches, orchestration state, backups, registry.

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
