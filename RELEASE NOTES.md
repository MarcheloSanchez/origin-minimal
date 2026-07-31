---
title: "RELEASE NOTES"
Created: 2025-06-30
modified: 2026-07-26
---
# Release Notes Summary

---
**Last Updated:** 2026-07-26
**Version Range:** v1.0.0 - v2.0.5
**Period:** January 2025 - July 2026
**Versioning convention:** see [[📦Release Versioning Convention]]

---

## [v2.0.5] – 2026-07-26

> **Patch release**: Closes the fix-wave's last known data-destructive bug and two release-blocking
> dashboard/doc drift issues caught by the v2.0.5 pre-release audit.
> **Status:** 🔵 Cutting.

### Fixed
- **`quick-process-atomic.js` frontmatter writer** — same hand-rolled-YAML bug class already fixed in `auto-metadata.js` (2026-07-26): rebuilding the frontmatter block as text duplicated array items and mangled quoted values. Refactored to `app.fileManager.processFrontMatter()`, matching the established pattern.
- **`👁️Dashboard.md` broken embed** — `![[_Tools_Data.base]]` referenced a file that never existed (Tools' real base lives at `02-Knowledge/Tools/Toolbox/Tool Inventory.base`, outside the `_*.base` folder-contract convention). Embed corrected to point at the real file.
- **Daily base filename/location** — resolved prior to this cut (owner).

### Deferred to BACKLOG (non-blocking)
- Restore the "Quick Idea" QuickAdd choice that `⚡Automation Menu.md` documents but `data.json` no longer has — a feature to re-add (tied to an `_Examples` Idea note), not a doc correction.
- `🎯GTD Weekly Review - Template.md` — `type: template` outside the locked enum.
- `Templates/Templates.md` — missing `title:` field.
- This RELEASE NOTES gap itself — the v2.0.4 entry below was cut retroactively; a future release should audit for other silently-skipped entries.

### Sign-off
- Pre-release audit: 3 scopes (dashboards + Automation Menu / vault sweep / doc staleness) — 2 blockers found and fixed, 4 items deferred to BACKLOG, no open blockers at cut time.
- Tests: pending (release-pipeline test suite runs at Build stage)
- TEST validation: pending
- Package: pending build

## [v2.0.4] – 2026-07-20 *(retroactively logged 2026-07-26 — was built, applied, and verified without ever getting a RELEASE NOTES entry; the Cut checklist's "notes first" rule was missed at the time)*

> **Patch release**: Fix wave — closed a data-destructive metadata bug, fixed QuickAdd routing/title bugs,
> restored calendar nav links, added Yearly month drill-down.
> **Status:** ✅ Cut 2026-07-20, applied to `Origin_TEST` same day (commit `4b46b36`); owner verification pass 2026-07-26 — gate closed.

### Fixed
- **Auto-Fill Metadata data-destructive bug** — hand-rolled YAML parser duplicated the first item of every array field and mangled quotes in nested objects; refactored to `app.fileManager.processFrontMatter()`.
- **QuickAdd title-prompt bug** — 11 `🤖`/`🔗` choices had `fileNameFormat` enabled with a format string missing `{{VALUE}}`, silently creating untitled notes.
- **Calendar nav links** — full `05-Calendar/…` paths restored in all 5 calendar templates, with a CLAUDE.md rule-#12 lint exception for this specific case.
- **Weekly hotkey** — `hotkeys.json` modifier `"Ctrl"` → `"Mod"` (matches working daily/monthly bindings). Binding is now correct but the key still doesn't fire in-app — ❌ non-blocking, tracked in BACKLOG for a future centralized-hotkey review.

### Added
- **QuickAdd direct-routing** — 5 `🤖` choices (Effort/Source/MOC/Prompt/Area) land directly in their real folders instead of `+Inbox`.
- **Missing `🤖Place`/`🤖Tool` QuickAdd entries** — templates existed on disk but were never registered.
- **Yearly template month drill-down** — 12-month links section, matching Monthly's year link.
- **CHANGELOG/BACKLOG empty-shell skeletons** — release builder ships true empty shells to fresh vaults instead of DEV's live private content.

### Sign-off
- TEST validation: applied to `Origin_TEST` 2026-07-20; owner verification pass 2026-07-26 — #1 Auto-Fill Metadata / #2a calendar nav / #3 QuickAdd direct-routing / #4 skeletons ✅ pass; #2b weekly hotkey ❌ fail (non-blocking by owner decision). Full results: `AIOS/orchestration/reports/2026-07-17-v2.0.4-fix-wave-verification.md`.
- Applied to: `Origin_TEST` only — MAIN fresh-start migration was pending this v2.0.5 cut.

## [v2.0.3] – 2026-07-16

> **Patch release**: Package completeness — payload review of v2.0.2 found structural gaps;
> packages now ship every folder's structural triple, the full empty-folder skeleton, and correctly scoped AIOS.
> **Status:** ✅ Cut 2026-07-16.

### Fixed
- **Bootstrap nesting bug** — `cp -r` into an existing payload dir produced `01-MOCs/01-MOCs/`; builder now copies directory *contents* (`cp -r src/. dst`).

### Added
- **Folder contract ships** — every content folder's structural triple now ships: `+About*ℹ️` contract note, hub note named after the folder, `_*_Data.base` (new `_*.base` glob + hub-note phase). Builder prints non-blocking warnings for folders whose triple is incomplete in DEV.
- **Empty-folder skeleton** — `structure_dirs_from` (manifest) → `dirs` array in package-manifest; `apply-release.sh` creates every directory, so QuickAdd/ANM/archive targets (03-Efforts/Active, 06-Archive/*, 05-Calendar/*, Atomics/Quotes…) exist in fresh vaults.
- **AIOS scoping** — `AIOS/scripts/` → Tier 1; `AIOS/memory/` (hot, lessons) + `AIOS/orchestration/` (ledger, queue, health, lib) → bootstrap; `sessions/`, `logs/`, `proposed/`, `reports/` excluded.

### Sign-off
- Tests: 39/39 (nesting regression, .base glob, hub notes, dirs skeleton covered)
- TEST validation: pending — package applied to fresh `Origin_TEST`, in-Obsidian smoke checklist to run
- Package: `Origin-Releases/Origin-Release-v2.0.3/`

## [v2.0.2] – 2026-07-16

> **Patch release**: Bootstrap tier — packages now provision a *complete usable vault*
> (MOCs, dashboards, Home/TODO/Me, prompts, AIOS docs, system images), not just the system skeleton.
> Living notes ship once and are never overwritten by later releases.
> **Status:** ⚠️ Superseded same-day by v2.0.3 (payload review findings — package too thin).

### Added
- **Bootstrap tier** (`bootstrap_paths` in `release-manifest.json`, manifest_version 2) — 01-MOCs, 07-Prompts (docs/playbooks; Library/Inbox/Archive/_examples stay local), AIOS docs + AIOS.md + README, Me.md, Me - Profile.md, TODO.md, CLAUDE.md, LICENSE, 🏡Home, 👁️Dashboard, 🧭Review HQ, ⚡Automation Menu, 🎯GTD template. `apply-release.sh` writes these **only when absent** in the target — no overwrite, no drift flag (v2.0.1 TEST finding: fresh vault was unusably thin).
- **`99-System/Images/`** added to Tier 1 (image embeds no longer break in consumer vaults).
- **Hub-note globs** extended: `+Inbox.md`, `X.md`, `Media.md`, `Meetings.md`, `Knowledge.md`.

### Changed
- **Leak gate scoped to Tier 1** (still blocking there). Bootstrap files legitimately carry personal names in a private ecosystem — reported as a warning count, never a block. The public starter pack remains a separate future artifact (surface archived at `AIOS/docs/reference/gitignore-public-surface-2026-07-16.md`).
- **DEV repo model**: private full-backup git (all content tracked); TEST is provisioned from the release **package** (clean room), never a git clone. See [[🗺️Vault Topology & Promotion]].

### Sign-off
- Tests: 31/31 (bootstrap ship/skip/no-drift + tier1 leak block covered)
- TEST validation: pending — package applied to fresh `Origin_TEST`, in-Obsidian smoke checklist to run
- Package: pending build

## [v2.0.1] – 2026-07-15

> **Patch release**: Release pipeline shipped — the vault can now cut, package, and distribute releases
> to consumer vaults (TEST via git, MAIN/SPEC via plain-file packages) under the new ecosystem rules.
> **Status:** ✅ Cut 2026-07-15.

### Added

**Release Pipeline (DEV → TEST → MAIN/SPEC)**
- **Release manifest** (`AIOS/contracts/release-manifest.json`) — single source of truth for the 3-tier release surface (Tier 1 auto-propagates, Tier 2 `.obsidian` configs gated, Tier 3 never ships).
- **`build-release-package.sh`** — builds immutable versioned packages into `Origin-Releases/`; **blocking** personal-data leak check (exit 1, `--force-leaks` override); version from `--version` arg only, never CHANGELOG; writes `.origin-version` + `package-manifest.json`.
- **`apply-release.sh`** — consumer-side installer for Obsidian-Sync vaults: dry-run diff, drift flagging (R1.2), backup to `_release-backups/` before every overwrite, plain-file writes only, refuses git-repo targets (R1.4).
- **Vault registry** (`AIOS/contracts/vault-registry.json`, local-only) — machine-readable vault map (role, path, sync, version).
- **Governing docs**: [[🚢Release Playbook]] (7-step lifecycle, hotfix/rollback) + [[🗺️Vault Topology & Promotion]] (DEV/TEST/MAIN/SPEC roles, one-sync-system-per-vault rule, naming convention); registered as Governance rule #12.

### Changed
- **`build-starter-pack.sh` deprecated** — superseded by the manifest-driven builder; kept for reference with a deprecation banner.

### Sign-off
- Pre-release audit: `AIOS/orchestration/reports/2026-07-15-documentation-release-audit.md` (this release implements its Critical items)
- Tests: 27/27 (fixture-based end-to-end, builder + installer)
- TEST validation: `Origin_TEST` re-cloned fresh from tag (c8274d6) 2026-07-15 — structure + pipeline files verified; in-Obsidian smoke checklist (QuickAdd note-per-type, dashboards, archival) pending manual pass
- Leak gate: first build BLOCKED on 6 real findings (caches, deprecated script, 3 files with personal names) — fixed in DEV, rebuild clean. Gate works.
- Package: `Origin-Releases/Origin-Release-v2.0.1/` (373 files, no leaks)
- Applied to: no Sync vaults yet (MAIN fresh-start migration pending)

---

## [v2.0.0] – 2026-07-11

> **Major release shipped**: Full vault re-architecture from v1.x — 8-layer PARA structure, modular templates,
> two-tier type system (10 full + 11 lightweight types), vault-wide tag canonicalization, Claude-Code-driven AI maintenance
> layer (AIOS), local voice capture, and read-blocking privacy guard.
> **Status:** ✅ Cut today (2026-07-11). Data migration from v1.x begins post-release.

---

### Added

**Voice Capture & Privacy**
- **Voice-to-Note capture package** (`99-System/Scripts/voice_capture/`) — offline Whisper voice-to-note → raw `+Inbox`. Hands off to `/process-capture` for tagging/routing.
- **iPhone shortcut path** — zero-code Apple Shortcut for walking capture, same raw format into synced inbox.
- **Read-blocking privacy guard** (`AIOS/runtime/hooks/`) — blocks Claude reads (Read/Grep/Glob/Bash/MCP) into protected folders unless `/unlock-private` ran this session. Config-driven via `99-System/Config/privacy-protected-paths.json`. Slash commands: `/unlock-private`, `/lock-private`.

**AIOS Maintenance Layer**
- **Claude-Code-driven AI infrastructure** — inspection-first, preview-before-apply protocol. Locked paths (CIS, Config, `.obsidian`, Templates internals) never written; YAML reordering defers to `yaml_orchestrator.js`.
- **4 Core sub-skills**: `origin-vault`, `origin-yaml`, `origin-templates`, `origin-routing`.
- **4 Agents**: `vault-inspector` (health scan), `note-fixer` (per-note fixer), `capture-processor` (classify `+Inbox` captures), `link-recommender` (verified wikilink suggestions).
- **6 Slash commands**: `/lint-vault`, `/fix-note`, `/fix-batch`, `/review-note`, `/process-capture`, `/process-inbox`.
- **Human documentation**: `[[+About AIℹ️]]` system landing page, `[[Command Reference]]`, `[[Agent Reference]]` in `99-System/Documentation/AI/`.

**Templates & Examples**
- **All 10 full-type exemplars** (`Templates/_Examples/`) — populated examples for Atomic, Effort, Source, MOC, Meeting, Area, Person, Place, Tool, Prompt. Reference for note-takers and capture agent.
- **Template Audit document** — comprehensive pre-launch review; 133 templates, 3 critical + 3 warning + 4 info issues identified.

**Documentation & Governance**
- **Tag Consolidation Log** — permanent record of 248 files modified, 253 tag renames, 68 deletions. Canonicalization principles: emoji-first mandatory, singular form, hierarchical `/` separator, 3+ notes rule.
- **CHANGELOG authoring rules** — callout block covering order, structure, wikilink convention.
- **Linter Setup documentation** — enabled Obsidian Linter rules, when-to-run table, interaction map with YAML Orchestrator.
- **Calendar Review Hub Guide** — step-by-step setup for period-architecture generators (weekly/monthly/quarterly/yearly).

**Progress Tracking**
- **Effort progress tracking** + `rank` field in Dashboard query; `energy_required` → `energy` field rename.

### Changed

**Vault Architecture**
- **Knowledge Hub renames** — numeric prefixes dropped (e.g. `300-People.md` → `People.md`, `400-Places.md` → `Places.md`, `500-Tools.md` → `Tools.md`).
- **Status/Maturity enums** — emoji-prefixed canonical set locked (`🔄active`, `📤seed`, etc.); two-tier type system formalized (10 full types with FileClass + templates; 11 lightweight types with CIS enum only).
- **Link repair strategy** — Bases for frontmatter field search-replace; search-replace scripts for body wikilinks.

**QuickAdd & Automation**
- **QuickAdd menu reorder** — `Quick Idea` and `Quick Inbox` promoted to top; `MENU: 🤖Auto (Templater dialog)` renamed.
- **`⚡Automation Menu` full reality sync** — mirrors 6 QuickAdd root menus, 47 entries; scheduled tasks + Claude Code commands documented.

**Dashboard & Review**
- **`🧭 Review HQ` rebuilt lean-core** — 1,245→654 lines, 8 sections, all broken links repointed.
- **Dashboard ISO-week format fix** — corrected lowercase `gggg`/`ww` (locale week) to uppercase `GGGG`/`WW` (ISO week) in `Template Daily.md`/`Template Weekly.md`.

**Documentation Updates**
- **[[CLAUDE]]** — added `## AI System` section and AI System row in Current Projects table.
- **[[ME]]** — 803 lines → ~480 lines (15 sections from 20); merged North Star + Summary Statement, Core Principles + Decision Rules; added `[[+About AIℹ️]]` link.
- **`.claude/commands/reflect-daily.md`** — fixed stale v1.x path targets (`02-Knowledge/Atomics/` → `Atomics/Ideas/`; `03-Efforts/Simmering/` → `Paused/`).
- **[[🏡Home]], [[👁️Dashboard]], [[Views]]** — minor refresh (2026-05-14).
- **Template auto-tags aligned** to canonical taxonomy across all 10 full-type templates.

**Simplification**
- **`process-note-safe.js`** — simplified to 2-step macro (Autofill Metadata → Normalize YAML) after Classify step removed.

### Fixed

**Voice & Language Detection**
- **Voice capture ffmpeg discovery** — auto-locates ffmpeg from WinGet/Chocolatey/Scoop paths regardless of shell. Fixes `WinError 2` on versioned WinGet paths not in PATH.
- **Whisper language detection** — constrained to Czech or English (ties → Czech); model bumped `base` → `small` for reliable cs/en discrimination.

**YAML & Metadata**
- **Removed dead `prompt_status` field** from prompt templates and AI schema docs; collapsed into standard `status` field (2026-06-24).
- **Purged `relatedNotes` references** throughout vault and AI schema.
- **Empty YAML dates** — filled missing `created`/`modified` in affected notes.
- **Templater folder paths** — corrected 6 stale `02-Dots/*` references in `.obsidian/plugins/templater-obsidian/data.json` to v2.0 `02-Knowledge/*` folders.
- **Meeting folder path** — corrected `04-Sources/440-Meetings` → `04-Sources/Meetings`.
- **Enum corrections** — `❌cancelled` → `❌cancel` fix; missing `tutorial` and `challenge` types added.
- **[[ME]] code blocks** — fixed broken single-line code blocks in audit structure and AI workflow templates.

**Content Cleanup**
- **`+About Knowledgeℹ️` stale learning-system content** — cut legacy documentation.

**Tag Cleanup**
- **Vault-wide tag taxonomy** — 1,041 files scanned, 195 unique tags reduced to 143; 248 files modified. Canonical renames: `🎯project` → `🚀effort`, `💡idea` → `💡atomic`, `quick` → `🧹tidy`, `people`/`colleague`/`👥people` → `👤person`, `tools`/`software` → `🛠️tool`, `🏠system` → `⚙️system`; numerous "missing emoji" fixes.
- **48 orphan domain tags** — stripped single-use topic tags (`jazz`, `philosophy`, `web-development`, `cognitive-science`, etc.). Domain context belongs in note content and links, not tags.

### Removed

**Deprecated Scripts & Commands**
- **`smart-classifier.js`** and **`batch-process-inbox.js`** (~600 lines, 2 QuickAdd macros) — architecturally redundant once Templater + Auto Note Mover handled classification. Both removed after documentation cleanup across 7 files.

**Tag Orphans**
- **48 single-use domain tags** — pruned per canonicalization principles.

### Release Readiness

- **3 Agents audit** — `vault-inspector`, `note-fixer`, `capture-processor` release-readiness validated. Reports in `AIOS/orchestration/reports/` (2026-07-11).

---

> [!note]- Milestone log (chronological, as shipped)
>

#### 🗓️ 2026-05-16 — Voice Capture + Privacy Guard

**Added:**
- **`voice_capture/` package** (`99-System/Scripts/voice_capture/`) — local Whisper voice-to-note → raw `+Inbox` capture. Offline, no cloud, no API key. Hands off to `/process-capture` for tagging and routing.
- **iPhone path** — zero-code Apple Shortcut writing the same raw format into the synced `+Inbox`. The actual walking-capture flow.
- **Press-Enter-to-stop recording** — default behavior; `--duration N` kept as fixed-length override.
- **Read-blocking hook system** (`AIOS/runtime/hooks/`) — blocks Claude reads (Read/Grep/Glob/Bash/`mcp__origin-minimal__*`) into protected folders unless `/unlock-private` ran this session. Fail-closed `decide()`. Writes not blocked (reads-only model).
- **Config-driven protected paths** — `99-System/Config/privacy-protected-paths.json` defaults to `05-Calendar/{Daily,Sessions,Weekly,Monthly,Quarterly,Yearly,_Logs}` + `06-Archive/{Completed,Inactive,Prompts-Docs}`. User-editable, no code change required to extend.
- **Slash commands** — `/unlock-private`, `/lock-private`. Every new session starts locked (SessionStart hook deletes the unlock marker).
- **Documentation** — `99-System/Documentation/AI/+About Privacy Guard🔒.md` + `🔒 Privacy Guard` section in `[[CLAUDE]]`.

**Fixed:**
- **Voice capture ffmpeg discovery** — auto-locates ffmpeg from WinGet/Chocolatey/Scoop paths regardless of shell. Fixes `WinError 2` when ffmpeg lives on a versioned WinGet path not in PATH.
- **Whisper language detection** — constrained to Czech or English (ties → Czech). Short Czech clips were being misclassified as Polish. Default Whisper model bumped `base` → `small` for reliable cs/en discrimination.

---

#### 🗓️ 2026-05-10 — Jarvis Vault AI System (AIOS) shipped

**Added:**
- **AIOS Layer** — Claude-Code-driven AI infrastructure for vault maintenance and capture processing. Inspection-first, preview-before-apply protocol: no silent edits, no auto-route on low confidence, locked paths (CIS, Config, `.obsidian`, Templates internals) never written, YAML reordering always defers to `yaml_orchestrator.js`.
- **4 Sub-skills**: `origin-vault`, `origin-yaml`, `origin-templates`, `origin-routing`.
- **4 Agents**: `vault-inspector`, `note-fixer`, `capture-processor`, `link-recommender`.
- **6 Slash commands** — `/lint-vault`, `/fix-note`, `/fix-batch`, `/review-note`, `/process-capture`, `/process-inbox`
- **Human documentation** — `[[+About AIℹ️]]` system landing page, `[[Command Reference]]`, `[[Agent Reference]]` in `99-System/Documentation/AI/`

**Changed:**
- **`[[CLAUDE]]`** — added `## AI System` section and AI System row in Current Projects table
- **`[[ME]]`** — added `[[+About AIℹ️]]` link in Core Navigation; consolidated 803 → ~480 lines (15 sections from 20)
- **`.claude/commands/reflect-daily.md`** — fixed stale v1.x path targets
- Minor refresh of `[[🏡Home]]`, `[[👁️Dashboard]]`, `[[Views]]` (2026-05-14)

**Fixed:**
- **`[[ME]]`** — broken single-line code blocks in audit structure and AI workflow templates; `❌cancelled` → `❌cancel` enum correction; missing `tutorial` and `challenge` types added; empty `created`/`modified` YAML dates filled

---

#### 🗓️ 2026-05-06 — Post-migration Smoke Test Fixes

**Added:**
- **Quick-process change summaries** — `quick-process-atomic.js`, `quick-process-effort.js`, `quick-process-source.js` now show a secondary Notice listing which frontmatter fields were added (`+`) or changed (`~`) after each run
- **Linter Setup documentation** — `99-System/Documentation/Obsidian/Linter Setup.md` documents all 4 enabled Obsidian Linter rules, when-to-run table, and interaction map with YAML Orchestrator
- **CHANGELOG authoring rules** — callout block in `CHANGELOG.md` covering oldest-at-top order, entry structure, wikilink convention, and what does vs doesn't belong

**Changed:**
- **Knowledge Hub renames** — `300-People.md` → `People.md`, `400-Places.md` → `Places.md`, `500-Tools.md` → `Tools.md` (numeric prefixes dropped)
- **QuickAdd menu reorder** — `Quick Idea` and `Quick Inbox` promoted to top; `MENU: 🤖Auto (Templater dialog)` renamed.
- **`process-note-safe.js`** — simplified to 2-step macro (Autofill Metadata → Normalize YAML) after Classify step removed

**Removed:**
- **`smart-classifier.js`** and **`batch-process-inbox.js`** — ~600 lines and 2 QuickAdd macros removed. Architecturally redundant once Templater + Auto Note Mover handled classification. Documentation cleaned across 7 files.

---

#### 🗓️ 2026-05-03 — Pre-launch Template Audit

**Added:**
- **Template Audit document** — `99-System/Documentation/2026-05-03-template-audit.md`. Comprehensive pre-launch review of all 133 templates.

**Fixed:**
- **Templater folder paths** — corrected 6 stale `02-Dots/*` references in `.obsidian/plugins/templater-obsidian/data.json` to point at v2.0 `02-Knowledge/*` folders.
- **Meeting folder path** — corrected `04-Sources/440-Meetings` → `04-Sources/Meetings` so `new-meeting-auto.md` fires correctly.

---

#### 🗓️ 2026-04-30 — Template Exemplars Complete

**Added:**
- **All 10 full-type exemplars finalized** in `Templates/_Examples/`: Atomic, Effort, Source, MOC, Meeting, Area, Person, Place, Tool, Prompt. Each shows fully populated note with realistic frontmatter values, expected body sections, related-link wiring.

---

#### 🗓️ 2026-03-31 — Tag Consolidation

**Changed:**
- **Vault-wide tag taxonomy unification** — 1,041 files scanned, 195 unique tags → 143; 248 files modified; 253 tag renames + 68 tag deletions. Canonical renames: `🎯project` → `🚀effort`, `💡idea` → `💡atomic`, `quick` → `🧹tidy`, `👤person`/`👤colleague` → `👤person`, `🛠️tool`/`software` → `🛠️tool`, `⚙️system` → `⚙️system`; numerous "missing emoji" fixes.
- **Template auto-tags aligned** to canonical taxonomy across all 10 full-type templates.

**Added:**
- **Tag Consolidation Log** — `99-System/Documentation/PKM/🏷️Tag Consolidation Log.md`. Permanent record of cleanup operations and canonicalization principles.

**Removed:**
- **48 orphan domain tags** stripped vault-wide — single-use topic tags. Domain context belongs in note content and links, not tags.

---

#### 🗓️ 2026-03-03 — Calendar Review Hub Guide

**Added:**
- **Calendar Review Hub Guide** — `99-System/Documentation/PKM/📅Calendar Review Hub Guide.md`. Step-by-step setup and usage documentation for period-architecture generators.

**Changed:**
- **Calendar Review Hub** marked ✅ Complete in `[[CLAUDE]]` Current Projects table.

---

#### 🗓️ 2026-02-07 — Migration cut-over

**Philosophy:** Minimal change, maximum clarity. Numbers preserved where already stable; opaque names replaced with plain English. No rebuild — surgical renames only.

**Folder Rename Map (v1.9.1 → v2.0):**
- `02-Dots/` → `02-Knowledge/`; `02-Dots/100-Atomics/` → `02-Knowledge/Atomics/`; `02-Dots/200-Areas/` → `02-Knowledge/Areas/`; `02-Dots/300-People/` → `02-Knowledge/People/`; `02-Dots/400-Places/` → `02-Knowledge/Places/`; `02-Dots/500-Tools/` → `02-Knowledge/Tools/`
- `00-Meta/` → `99-System/Documentation/`; `07-Prompts/` → `99-System/Prompts/`
- `03-Efforts/On/` → `Active/`; `03-Efforts/Simmering/` → `Paused/`; `03-Efforts/Sleeping/` → `Waiting/`
- `04-Sources/410-*/` → `04-Sources/Books/`, `Articles/`, etc.; `04-Sources/440-Meetings/` → `04-Sources/Meetings/`
- `06-Archive/` → `06-Archive/Completed/` + `06-Archive/Inactive/`

**Architectural changes:**
- **Two-tier type system** formalized: 10 full types (atomic, effort, source, moc, meeting, prompt, person, place, tool, area) with FileClass + templates + schema; 11 lightweight types (system, dashboard, daily, weekly, etc.) with CIS enum only.
- **Status values** emoji-prefixed (`🔄active`, not bare `active`) — canonical set locked in `99-System/CIS/CIS_STATUS.md`.
- **Maturity values** revised: `📤seed` → `🌱seedling` → `🪴sapling` → `🌲evergreen` → `🍓fruit`.
- **Link repair strategy**: Bases for frontmatter field search-replace; search-replace scripts for body text wikilinks.

---

## [v1.9.1] – 2026-01-24
### Added
- **Claude AI Skills Level 3** - Advanced prompt engineering with structured outputs
- **17 Copilot Custom Prompts** for PKM workflows:
  - Assess note maturity, Build mental model, Challenge this idea
  - Create MOC structure, Decision analysis, Deep research
  - Explain concept, Extract atomic notes, Extract tasks
  - Find connections, Format as atomic, Generate questions
  - Suggest metadata, Summarize meeting, Synthesize knowledge
  - Emojify, Simplify, Weekly review helper
- **Progressive disclosure patterns** in AI prompts

### Changed
- Upgraded Claude skills from Level 2 to Level 3
- Enhanced prompt templates with context-aware outputs

---

## [v1.9.0] – 2026-01-21
### Added
- **Static Fallback Templates** (`Templates/Static/`) - No Templater required
  - atomic.md, effort.md, source.md, moc.md
  - person.md, place.md, tool.md, area.md, prompt.md
- **Modular Template Architecture** - Separate Meta, Body, and Create templates
- **Core Navigation Snippets** - `_nav-breadcrumb.md`, `_nav-wayfinder.md`, `_section-related.md`

### Changed
- **Template Refactoring Complete** - Reduced from 95+ to ~40 template files
- Consolidated action templates into generic `Actions/` folder
- Updated QuickAdd macros to use new template paths
- Removed legacy `Type/` folder structure

### Removed
- Deprecated `*-Full-Template.md` files (redundant with Meta + Body)
- Legacy Dot, Concept, Idea templates (merged into Atomic)
- Calendar CZ TODO stubs
- v1 variants of Callout, ToC, Kanban templates

---

## [v1.8.0] – 2026-01-31
### Added
- **Meta-Skills Architecture**: 6 chainable AI meta-skills with handoff protocol
    - Note Evolver - Mature notes to evergreen status
    - Learning Path Designer - Optimal learning sequences
    - Content Pipeline - Content workflow optimization
    - Decision Navigator - Structured decision analysis
    - Research Orchestrator - Investigation coordination
    - Idea Validator - Concept validation
- **Claude AI Skills**: Level 3 advanced prompt engineering for PKM workflows
- **Modular Template Architecture**: Complete template refactoring (Phases 1-6)
    - Phase 1-2: Core modular template system
    - Phase 3-4: QuickAdd macro integration
    - Phase 5-6: Validation and deprecated template cleanup
- **Static Fallback Templates**: Templates that work without Templater dependency
- **Vault Report**: Comprehensive documentation of vault structure and features
- **Home Maintenance System** (`🏠 Home Maintenance System`) - Room tracking in 400-Places
- **Review HQ** (`🧭 Review HQ`) - Convergence point for all review workflows
- **Gamification System** - Dashboard, Quick Reference, PKM Gamification
- **GTD Contexts Guide** - Context-based task management
- **Note Classification Guide** (`📍Note Classification Guide`)
- **Calendar Period Architecture** - Connective tissue for temporal system

### Changed
- **Template System Overhaul**: Migrated to modular, component-based architecture
- **Copilot Prompts**: Standardized all 6 meta-skills to consistent template format
- **Legacy Cleanup**: Removed deprecated Type/ folders (Option B cleanup)
- Renamed CHANGELOG, RELEASE NOTES, BACKLOG to capitals
- Plugin settings fixes (Auto-note Mover tags)

### Fixed
- Template compatibility issues with QuickAdd macros
- Deprecated template references updated

---

## [v1.7.0] – 2026-01-15
### Added
- **Comprehensive Gamification System**: XP tracking, challenges, achievement dashboard
- **GTD System Enhancement**: Full Getting Things Done implementation
- **Home Maintenance System**: Room-based organization with quick-start guide
    - Each room tracked in [[Places]]
    - Maintenance scheduling and project tracking
- **Review HQ**: Comprehensive convergence point for all review workflows
    - Contextual action callouts throughout
- **Calendar Period Architecture**: Connective tissue linking temporal notes
- **Vault Analysis & Health Report**: System health monitoring
- **GitHub Actions**:
    - Labeler workflow for automated PR labeling
    - Enhanced first issue and PR messages
- **MIT License**: Open source licensing added

### Changed
- **Security Hardening**: Replaced hardcoded credentials with environment variables
- **Workspace Configuration**: Updated workspace.json settings
- **Template Organization**: Reorganization with missing templates added

### Fixed
- **Security Vulnerability**: Removed secrets from vault
- **Auto-Note Mover**: Fixed missing "#" in tag configuration

---

## [v1.6.0] – 2025-10-13
## Added
- JavaScript modules for progression tracking
- New markdown files for knowledge/media/guides/meetings/Meta
- [[🧹Cleaning Lady]], [[🌱Incubator]], universal templates, new hotkeys, and cheatsheets
- Custom Callout System, Kanban settings, practical examples, YAML orchestrator scripts, quarterly templates, playbooks, standards, more +About sections
- Efforts management schema (YAML)
- - New hotkeys:
    - Quick Tag: `ALT+T`
    - Split Right: `CTRL+SHIFT+ALT+➝`
    - Split Down: `CTRL+SHIFT+ALT+↓`
    - Toggle Right Sidebar: `CTRL+ALT+SHIFT+L`
    - Toggle Left Sidebar: `CTRL+ALT+SHIFT+P`
    - Add Property: `CTRL+;`
## Changed
- CSS and layout streamlined, “Dots” system clarified as category/folder
- Major file, folder, metadata, and template renaming/consolidation
- Calendar/dashboard attributes and icons refactored
- Governance, naming convention, and folder standards strengthened
- Large clean-up and restructuring of notes, organization, and workflow guides
## Fixed
- Maintenance script improvement, template fallback process clarified
- Metadata duplication issues solved
- Quarterly/calendar templates compatibility ensured
- Status/maturity tracking scripts partially fixed (Templater/QuickAdd pending)

## [v1.5.0] – 2025-08-23 
## Added
- **Atomic template system** - Streamlined template approach replacing complex Inbox templates
- **Commander/QuickAdd integration** - Prepared Add functionality with templates and metadata
- **Question system** for Templates - Added #❔question tagging for template queries
- **Atomic Filled Out** - Complete atomic note template implementation
## Changed
- **Template optimization** - Reviewed and updated all template commands
- **Release preparation** - v1.5.0 staging and testing
- **Inbox template** - Removed as unnecessary with Atomic template approach
---
## [v1.4.1] – 2025-08-20
## Added
- **Data foundation system** - Six core data base files:
    - `_Templates_Data.base`
    - `_Knowledge_Data.base`
    - `_Inbox_Data.base`
    - `_Sources_Data.base`
    - `_Calendar_Data.base`
    - `_Effortless_Data.base`
## Changed
- **Template organization** - Moved Templates/Templater structure for better organization
- **Template reconfiguration** - Planned systematic template restructuring
- **Sidebar system** - Deleted `🙃 Sidebar` as `🏡Home` provides all needed functionality with better linking
---
## [v1.4.0] – 2025-08-16
## Added
- **Technical documentation suite**:
    - Templater User Guide Technical Document
    - Git User Guide Technical Document
    - Overview of Metadata with query awareness
- **Automation enhancements**:
    - `⚡ Automation Menu` - Fully functional
    - CIS (Context Information System) components: MOOD, WEATHER
- **Organizational tools**:
    - Choosing system methodology
    - Cleanup Checklist for maintenance
## Changed
- **Query system** - Attempted updates to Sidebar queries
---
## [v1.3.5] – 2025-08-14
## Added
- **Dashboard expansion** - Vault Home Dashboard as supplement to existing Home/Sidebar systems
- **Metadata improvements** - Critical Missing Metadata Query for data integrity
- **Calendar organization** - Reviews subfolder for better structure
## Changed
- **Home navigation** - Updated home-note with enhanced functionality
---
## [v1.3.4] – 2025-08-13
## Added
- **User experience** - House Tour (`🏡House Tour`) for new user onboarding
- **Template infrastructure** - Future template structure: Add, Capture, Meta categories
## Changed
- **Quality assurance** - Peer review process implemented (by a peer reviewer)
## Fixed
- **Templater scripts** - Resolved multiple script failures and functionality issues
---
## [v1.3.3] – 2025-08-11
## Added
- **PKM overview** - Comprehensive Personal Knowledge Management system overview
- **Prompt engineering system**:
    - Prompt_Type classification
    - Prompt_attributes_explained documentation
    - Copilot-custom-prompts integration
- **AI integration** - Copilot setup (pending Face ID verification)
- **Technical documentation** - Obsidian Technical Document with showcase integration
## Changed
- **Tag system** - Reverted to YAML-based status tags (removed from tag names)
- **File properties** - Updated Hidden property and Changelog panel placement
---
## [v1.3.2] – 2025-08-08 (Major Release)
## Added
- **Enhanced tagging system**:
    - Effort tags: `#🔥on`
## Changed
- **Folder structure** - Updated to `[00-Folder]` namespace with corresponding query updates
- **Calendar system** - Completed comprehensive review of Calendar notes
- **GPT integration** - Organized GPT folder dump for next release
## Fixed
- **Release management** - v1.4.0 officially released
---
## [v1.3.1] – 2025-08-06
## Added
- **Task management**:
    - Tasks plugin integration
    - TODO note for centralized task overview
- **Visual enhancements** - Typography showcase for CSS implementations
## Changed
- **Template optimization** - Cleaned up daily journal templates
- **Weekly workflow** - Updated Templater Week Review functionality
- **Metadata completion** - Enhanced Calendar Metadata (previously empty)
## Fixed
- **Plugin conflicts** - Calendar plugin template compatibility with Periodic Notes
- **Plugin management** - Identified Lazy Plugin Loader auto-enabling disabled plugins
---
## [v1.3.0] – 2025-08-04
## Added
- **Workflow templates** - FLOW_CREATION_TEMPLATE for process documentation
- **Enhanced callouts** - Task callouts added to Nick Milo's Custom Callouts
- **Experimental features** - Beta home-note-cs-meh-inspiration with query integration
## Changed
- **Query system** - Updated home-note queries for better functionality
- **Task management** - Cleaned and reorganized My PKM Tasks (some remain under review)
- **Folder naming** - Planned rename: Templater → TemplateR-Auto, Templates → TemplateS-Manual
---
## [v1.2.3] – 2025-07-28
## Added
- **Metadata system** - Metadata Menu plugin for enhanced data management
- **File organization** - FileClasses system for contained metadata management
- **Context Information System (CIS)** - Files and Prompt class implementation
---
## [v1.2.4] – 2025-07-23
## Added
- **Automation infrastructure**:
    - Advanced URI plugin for future automations
    - Format Converter core plugin (evaluation needed)
    - Lazy Plugin Loader for performance optimization
## Changed
- **Core plugins** - Disabled Workspaces and other unused core features
---
## [v1.2.5] – 2025-07-17
## Added
- **System architecture** - `99-System` folder for system-level organization
- **Plugin management** - Python script for plugin version tracking (CSV/TXT output)
- **Template examples** - Concrete examples for each attribute type in Inbox
## Changed
- **Documentation consolidation** - Merged Tags Complete Guide into PKM Tags
- **Template review** - Comprehensive template and metadata file updates
- **Query system** - Enhanced folder notes with modification date overviews
## Fixed
- **Script visibility** - Python scripts properly organized in Script folder
---
## [v1.2.6] – 2025-07-12
## Added
- **Kanban workflow system**:
    - Kanban Handbook
    - PKM Kanban Templates
    - Template Cards for Kanban (General, Content, Learning)
- **Comprehensive handbooks**:
    - Templater Handbook 2025
    - Obsidian Troubleshooting Handbook
    - Enhanced Debug Guide
- **Experimental tools** - NOT TESTED Batch-Tag-Updater
- **Guidelines** - Systematic guidelines documentation
---
## Summary Statistics
**Development Period:** 13 months (January 2025 - January 2026)  
**Total Changes:** 100+ individual updates  
**Major Releases:** 8 (v1.0.0 through v1.8.0)  
**Update Sessions:** 20+ development cycles
**Change Distribution:**
- **Added:** 75+ new features and components (70%)
- **Changed:** 25+ modifications and improvements (25%)
- **Fixed:** 10+ bug fixes and resolutions (5%)
**Focus Areas (v1.7.0-v1.8.0):**
- AI & Meta-Skills Integration (30%)
- Template System Overhaul (25%)
- Review & GTD Systems (20%)
- Security & Infrastructure (15%)
- Gamification & Tracking (10%)
---
## [v1.2.2] – 2025-07-09
### Added
- **+About** query system for notes starting with "+About..."
- **Git Handbook** for version control guidance
- **Plugins evaluation** list in Backlog
- **Calendar Logs** folder for better organization
- **Guidelines** section (under development)

### Changed
- **Release workflow** refinement and testing
- **Git backup** process improvements

### Fixed
- Release test workflow implementation

---

## [v1.2.1] – 2025-06-30
### Added
- **Backlog** system for tracking future improvements
- **Enhanced Auto Note Mover** with individual tag efforts (#🔥on, etc.)
- **Ideas and Concepts** dots for better knowledge linking

### Changed
- **Templater scripts** updated for better functionality
- **Hotkey system** - Quick tag hotkey changed to CTRL+ALT+T
- **Tag management** - cleared out redundant tags

### Fixed
- Release date scheduling issues

---

## [v1.2.0] – 2025-06-25
### Added
- **Weekly Review** system for regular maintenance
- **Templater automation scripts**: Weekly Maintenance, Daily note, Archive
- **QuickAdd Handbook** for quick capture workflows
- **Git workflow** documentation
- **Origin Vault processes** and procedures
- **Origin MAINFRAME** central hub
- **Implementation checklist** for systematic setup
- **Weekly Git backup** shell script
- **Origin Vault Workflow Guide** comprehensive documentation

### Changed
- **Template system** upgraded from "Template, Properties, Effort (Kit)" to "Templa"
- **Sidebar** enhancements and updates
- **Metadata integration** into Changelog

### Fixed
- Removed outdated README v2

---

## [v1.1.0] – 2025-06-17
### Added
- **Feedback system** for BETA versions
- **Version tracking** capabilities

### Changed
- Version progression from 1.0 to 1.1

---

## [v1.0.1] – 2025-06-16
### Added
- **Vault metadata** system
- **Plugin version tracking** in dedicated note
- **Git backup** implementation
- **User feedback** collection system

### Changed
- Major version release from 1.0 to 1.1

---

## [v1.0.0] – 2025-06-12
### Added
- **Timestamp and Date utilities**: InsertTimestamp, InsertDateTag, ConvertText
- **Template Index** for better template management
- **PKM Tasks** system
- **Script collection**: CMD, JS, AHK for future automation
- **Dataview Query Handbook** for advanced queries
- **Evergreen notes** system
- **BOAT notes** methodology
- **README** documentation

### Changed
- **Templater structure** - separated Templates and Templater
- **Note organization** - combined Dataview components

---

## [v0.9.0] – 2025-06-10
### Added
- **START HERE** quick start guide
- **Automated tagging** script based on context
- **Automated note moving** script based on tags

### Changed
- **Journal system** verification and improvements

---

## [v0.8.0] – 2025-06-08
### Added
- **Hotkeys & Automation** comprehensive system
  - Daily, Weekly, Monthly automation
  - Total hotkeys integration
  - Templater functionality
- **Hotkeys Quick Reference** for Obsidian, Windows, PowerToys, FastKeys
- **Visual hotkeys** multiple showcase methods
- **Icon pack** for better visual organization
- **Template collection**: Inbox Capture, Archive note, Home Navigation, Quick Tagging
- **PKM Tags** system with complete guide
- **PKM Metadata** structure for individual notes

### Changed
- **Template organization** - structured into folders
- **Syntax improvements** - fixed folder naming issues

### Fixed
- **Folder naming** - resolved "05-Archive" syntax error with dash and numbering

---

## [v0.7.0] – 2025-06-06
### Added
- **AI Copilot** integration for assistance
- **Sidebar** with Dataview of captured notes and performance metrics
- **Performance Metrics** tracking system
- **Knowledge organization**: Library, Maps, Add, Language MOC, Relate, Thinking Map, Communicate
- **Debug Guide** for troubleshooting
- **PKM MOC** (Map of Contents)
- **Plugin comparison** research (Vyhledávání plugin porovnání)

### Changed
- **Dashboard templates** - marked for future enhancement

---

## [v0.6.0] – 2025-06-05
### Added
- **Home sidebar** integration
- **Template folders** organization
- **YAML templater** basics
- **Documentation** improvements
- **Hotkeys & Automation** evolution
- **Bilingual vault** solution (EN + CZ)

### Changed
- **Tag system** improvements with suggestions
- **Plugin visualization** updates

### Fixed
- **Sidebar CSS** - missing cssclass = sidebar

---

## [v0.5.0] – 2025-06-04
### Added
- **PKM foundation systems**:
  - PKM Metadata
  - PKM Queries
  - PKM Folders
  - PKM Tags
  - PKM Workflows - Global Guidelines
- **README** documentation
- **AI brainstorming** for Meta Vault

### Changed
- **Version 1.1** saved
- **Vault restructuring** major reorganization
- **Query system** - prevented self-referencing

---

## [v0.1.0] – 2025-05-30
### Added
- **Foundation elements**:
  - Changelog system
  - Home hub
- **Version 1.0** project initiation

---

## [v0.0.1] – 2025-01-01
### Added
- **Initial template** system

---

*This release notes summary consolidates all changes from the project changelog, organized chronologically from most recent to oldest.*
