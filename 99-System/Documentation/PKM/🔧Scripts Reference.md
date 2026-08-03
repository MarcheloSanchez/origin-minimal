---
up: "[[🗺️My PKM MOC]]"
title: Scripts Reference
type: system
tags: 
  - ⚙️system
  - 📋documentation
  - 🔧scripts
status: 🔄active
maturity: 🌱seedling
created: "2026-02-15"
modified: "2026-07-13"
related: 
  - "[[🔁My PKM Workflows]]"
  - "[[📦Template System Guide]]"
  - "[[🚀Vault Migration Guide]]"
  - "[[📊Bases Formulas Reference]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[🔁My PKM Workflows]] | [[📦Template System Guide]] | 🔧Scripts Reference | [[🚀Vault Migration Guide]] | [[📊Bases Formulas Reference]]


> [!info]+ **⚡ Script Ecosystem**
> **Location**: `99-System/Scripts/`
> **Count**: 23 JavaScript · 3 Python · 1 shell (+ tests/, voice_capture/)
> **Triggers**: Templater user scripts, QuickAdd macros, or manual invocation
> **Philosophy**: Automate repetitive vault operations while keeping the user in control

---

## 📇 Script Index

One row per file in `99-System/Scripts/` (27 total), alphabetical.

| Script | Kind | Purpose |
|--------|------|---------|
| `Templater_script.js` | Templater | Template composition engine; combines Meta+Body templates for note creation |
| `archive-note.js` | QuickAdd macro | Archives current note to a chosen `06-Archive` subfolder via dropdown |
| `archive-old-dailies.js` | QuickAdd macro | Archives daily notes older than a configurable threshold; supports dry-run |
| `auto-metadata.js` | dual | Auto-populates missing frontmatter fields (created, up, related, tags, status, maturity) |
| `build-starter-pack.sh` | CLI | Exports a stripped, genericized Origin v2.0 Starter Pack copy for release |
| `generate-monthly-report.js` | QuickAdd macro | Creates a monthly report by aggregating weekly reports and vault data |
| `generate-newsletter.js` | QuickAdd macro | Gathers notes flagged `newsletter: true` and assembles a draft newsletter |
| `generate-orbit.js` | QuickAdd macro | Builds the `[!orbit]` wayfinder callout from a note's up/related frontmatter |
| `generate-quarterly-report.js` | QuickAdd macro | Creates a quarterly report by aggregating monthly reports and vault data |
| `generate-weekly-report.js` | QuickAdd macro | Creates a structured weekly report with metrics, highlights, completed work |
| `generate-yearly-report.js` | QuickAdd macro | Creates a yearly report by aggregating quarterly reports and vault data |
| `insert-callout.js` | QuickAdd macro | Inserts an Obsidian callout block of a chosen type via QuickAdd picker |
| `insert-toc.js` | QuickAdd macro | Inserts a table of contents from the note's headings to a chosen depth |
| `mark-waiting.js` | QuickAdd macro | Marks the note waiting, tags it, triggers Auto Note Mover relocation |
| `maturity-evolve.js` | QuickAdd macro | Manual maturity stage picker for the current note |
| `maturity-promoter.js` | dual | Suggests maturity stage promotions for atomic notes based on link counts |
| `plugin_versions2csv.py` | CLI | Exports installed Obsidian plugin name/ID/version to a CSV file |
| `plugin_versions_exportTABLE.py` | CLI | Exports installed Obsidian plugin name/ID/version to a text table |
| `process-note-safe.js` | QuickAdd macro | One-click combo: runs Autofill Metadata then Normalize YAML on active note |
| `quick-process-atomic.js` | QuickAdd macro | Instantly processes an inbox note as an atomic knowledge note |
| `quick-process-effort.js` | QuickAdd macro | Instantly processes an inbox note as an effort/project |
| `quick-process-source.js` | QuickAdd macro | Instantly processes an inbox note as a source (book, article, video) |
| `status-picker.js` | QuickAdd macro | Visual status selection picker; bypasses linear progression when needed |
| `translator.py` | CLI | Translates a Markdown file's content from English to Czech via Google Translate |
| `update-metrics-cache.js` | QuickAdd macro | Calculates expensive metrics once, writes results to `_Metrics Cache.md` |
| `yaml_orchestrator.js` | dual | YAML normalize/lint/reorder engine for vault-wide metadata hygiene |
| `yaml_validator.js` | dual | Schema validation engine for note frontmatter against type-specific rules |

> [!note] `archive_note.js` (underscore) documented in §5 below is stale — no such file exists on disk and it isn't referenced by any QuickAdd macro. The real, current archive-to-subfolder script is `archive-note.js` (hyphen), documented separately in the same section. Left as-is per this blueprint's scope (existing per-script sections are untouched); flagging for a future cleanup pass.

---

## 📊 Script Categories at a Glance

| Category | Scripts | Purpose |
|----------|---------|---------|
| **Core Template & Metadata** | 3 | Template composition, YAML normalization, schema validation |
| **Metrics & Reporting** | 7 | Vault health metrics, weekly/monthly/quarterly/yearly reports, maturity suggestions |
| **Inbox Processing** | 5 | Batch triage, smart classification, type-specific quick processing |
| **Status & Maturity** | 3 | Status progression, visual picker, maturity evolution |
| **Archive & Maintenance** | 2 | Single-note archival, bulk daily note archival |
| **Publishing & Navigation** | 4 | Newsletter generation, changelog, home navigation, prompt normalization |
| **Auto-Metadata** | 1 | Intelligent default metadata population |

---

## 1. Core Template & Metadata

### `Templater_script.js`

> Template composition engine — the backbone of note creation.

| Detail | Value |
|--------|-------|
| **Trigger** | Templater user script (`tp.user.Templater_script`) |
| **Inputs** | `tp` (Templater instance), `type` (note type string), `mode` ("empty" or "auto") |
| **Outputs** | Returns composed template content via `tR +=` or writes directly to active file |
| **Dependencies** | Templater plugin, template files in `Templates/Meta/` and `Templates/Body/` |

**Exported Functions** (6):

| Function | Purpose |
|----------|---------|
| `combine(tp, type, mode)` | Chains Meta + Body templates, returns content for `tR +=`. In "auto" mode, sets status to `🔄active` instead of `📥inbox` |
| `inject_meta_if_missing(tp, type)` | Adds YAML frontmatter to an existing note only if none exists |
| `add_chapters(tp, type)` | Replaces body content while preserving existing YAML frontmatter |
| `reset_body(tp, type)` | Resets body to template default, keeps YAML |
| `reset_meta(tp, type)` | Resets YAML to template default, keeps body |
| `reset_all(tp, type, mode)` | Replaces both YAML and body from templates |

**Template Resolution**: Searches multiple paths in priority order — new modular paths (`Templates/Meta/`, `Templates/Body/`) first, then legacy paths (`Templates/New-Notes/Type/`, `Templates/Type/`, `Templates/`) for backward compatibility.

> [!warning] **Gotcha**: `combine()` returns content via `tR +=`, NOT `writeActive()`. Templates must use `tR += await tp.user.Templater_script.combine(...)`. Direct `writeActive()` races with Templater's own write.

See [[📦Template System Guide]] for full architecture details.

---

### `yaml_orchestrator.js`

> YAML normalize, lint, and reorder engine for vault-wide metadata hygiene.

| Detail | Value |
|--------|-------|
| **Trigger** | Templater user script or QuickAdd macro |
| **Inputs** | JSON args: `{ mode, path?, folder?, dryRun?, backup?, configPath? }` |
| **Outputs** | Modifies YAML frontmatter in-place; generates lint reports |
| **Dependencies** | Config file at `99-System/Config/yaml-meta-config.json` |

**Modes**:

| Mode | Description | Safe? |
|------|-------------|-------|
| `reorder` | Reorders YAML keys to match canonical order; preserves formatting and comments | Yes — no data change |
| `normalize` | Fixes values (arrays, dates, enums), applies rename rules, rewrites YAML | Backup recommended |
| `lint` | Report-only; writes a Markdown report listing issues | Yes — read-only |

**Usage**:
```
<%* await tp.user.yaml_orchestrator({ mode: "reorder" }) %>
<%* await tp.user.yaml_orchestrator({ mode: "normalize", backup: true }) %>
<%* await tp.user.yaml_orchestrator({ mode: "lint", folder: "03-Efforts" }) %>
```

**Features**: Status value normalization (maps bare text to emoji equivalents), field renaming (e.g., `deadline` → `due`), date format correction, array normalization, validation step 5b for schema compliance.

---

### `yaml_validator.js`

> Schema validation engine for note frontmatter.

| Detail | Value |
|--------|-------|
| **Trigger** | Templater user script (`tp.user.yaml_validator()`) or QuickAdd macro `✅ Validate Note YAML` (menu `🔢YAML - Automation ⚡`) |
| **Inputs** | YAML object and type string; or `{ mode: "lint", folder: "path" }` for batch |
| **Outputs** | Returns validation results: missing required fields, invalid enums, format issues |
| **Dependencies** | None (self-contained schema definitions) |

**Built-in Schemas**: `base`, `atomic`, `effort`, `source`, `moc`, `meeting`, `prompt` — each extends `base` with type-specific required fields and enum values.

**Validates**:
- Required fields present (e.g., atomic notes need `title`, `type`, `status`, `created`, `tags`)
- Enum values correct (e.g., `status` must be one of `📥inbox`, `🔄active`, `⏳waiting`, `✅completed`, `📦archived`, `⏸️paused`, `❌cancelled`)
- Date field formats (`YYYY-MM-DD`)
- Array field types (tags, related, aliases)

---

## 2. Metrics & Reporting

### `update-metrics-cache.js`

> Calculates expensive metrics once and writes results to `_Metrics Cache.md` for fast dashboard rendering.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro; recommended daily at 6am or before dashboard review |
| **Inputs** | None (reads vault state directly) |
| **Outputs** | Writes Dataview inline fields (`field:: value`) to `99-System/_Metrics Cache.md` |
| **Dependencies** | Dataview API, `moment.js` |

**Cached Metrics**: Note counts by type, XP/gamification stats, connection density, orphan detection, hub pages, weekly/monthly growth trends.

**Performance Impact**: 60-80% dashboard load improvement — dashboards read `dv.page("99-System/_Metrics Cache").field_name` with live Dataview fallback if cache is stale.

**Usage**:
```
QuickAdd > Macros > 📊 Update Metrics Cache
```

---

### `generate-weekly-report.js`

> Creates a structured weekly report note with metrics, highlights, and completed work.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro; recommended Sunday evening |
| **Inputs** | None (calculates ISO week number from current date) |
| **Outputs** | Creates `05-Calendar/Weekly/Weekly Report YYYY-WNN.md` |
| **Dependencies** | Obsidian Vault API, MetadataCache |

**Report Sections**: Week summary, metrics snapshot, completed tasks, inbox throughput, connection growth, maturity promotions, notes created/modified during the week.

**Date Handling**: Sets week boundaries Monday 00:00 to Sunday 23:59, extracts ISO week number.

---

### `generate-monthly-report.js`

> Creates a structured monthly report by aggregating weekly reports and vault data.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro (🧹 Maintain > 📊 Generate Monthly Report) |
| **Inputs** | Prompts for `YYYY-MM` period; blank defaults to current month |
| **Outputs** | Creates `05-Calendar/Monthly/Monthly Report YYYY-MM.md` |
| **Dependencies** | Obsidian Vault API, MetadataCache, QuickAdd API |

**Report Sections**: Key Metrics, Weekly Summaries (links to weekly reports), Area Health Check (5 life areas via backlinks), Effort Portfolio (grouped by status), Maturity Pipeline, Monthly Highlights, Month Summary, Next Month Focus, 4-Week Trend (DataviewJS).

**Data Flow**: Finds weekly reports in `05-Calendar/Weekly/` whose ISO weeks overlap the target month. Parses metrics tables via regex. **Fallback**: If <2 weekly reports found, queries vault directly using `file.stat.ctime/mtime` date filtering.

**Past-Period Support**: On launch, prompts for `YYYY-MM` (e.g. `2025-06`). Leave blank or accept the default to generate for the current month. Allows generating retroactive reports for any past month.

---

### `generate-quarterly-report.js`

> Creates a structured quarterly report by aggregating monthly reports and vault data.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro (🧹 Maintain > 📊 Generate Quarterly Report) |
| **Inputs** | Prompts for `YYYY-Q#` period; blank defaults to current quarter |
| **Outputs** | Creates `05-Calendar/Quarterly/Quarterly Report YYYY-Q#.md` |
| **Dependencies** | Obsidian Vault API, MetadataCache, QuickAdd API |

**Report Sections**: Key Metrics, Monthly Summaries (links to monthly reports), Area Health Trends (month-over-month comparison), Major Initiatives (high-priority active efforts), Maturity Pipeline, Quarter Summary, Strategic Insights, Next Quarter Focus, 12-Week Trend (DataviewJS).

**Data Flow**: Finds monthly reports in `05-Calendar/Monthly/` for the quarter's 3 months. Parses metrics tables and area health tables via regex for trend tracking. **Fallback**: If <2 monthly reports found, queries vault directly.

**Past-Period Support**: On launch, prompts for `YYYY-Q#` (e.g. `2025-Q3`). Leave blank or accept the default to generate for the current quarter.

---

### `generate-yearly-report.js`

> Creates a structured yearly report by aggregating quarterly reports and vault data.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro (🧹 Maintain > 📊 Generate Yearly Report) |
| **Inputs** | Prompts for `YYYY` period; blank defaults to current year |
| **Outputs** | Creates `05-Calendar/Yearly/Yearly Report YYYY.md` |
| **Dependencies** | Obsidian Vault API, MetadataCache, QuickAdd API |

**Report Sections**: Key Metrics, Quarterly Summaries (links to quarterly reports), Annual Area Overview (backlinks + yearly activity), Knowledge Growth (atomics/sources/MOCs created), Maturity Pipeline, System Maturity (connection density, orphans, review consistency), Year Summary, Annual Reflections, Next Year Vision, 12-Month Trend (DataviewJS).

**Data Flow**: Finds quarterly reports in `05-Calendar/Quarterly/` for the target year. Parses metrics tables via regex. Always queries: knowledge growth counts, connection density, review consistency. **Fallback**: If <2 quarterly reports found, queries vault directly.

**Past-Period Support**: On launch, prompts for `YYYY` (e.g. `2025`). Leave blank or accept the default to generate for the current year.

---

### `maturity-promoter.js`

> Analyzes atomic notes and suggests maturity stage promotions based on quantitative criteria.

| Detail | Value |
|--------|-------|
| **Trigger** | Templater user script (`await tp.user.maturity_promoter()`) or QuickAdd macro `🎯 Suggest Maturity Promotions` (menu `📦 Vault Ops`) |
| **Inputs** | Dataview API object (`dv`) |
| **Outputs** | Returns `getSuggestions(dv)` function producing promotion recommendations |
| **Dependencies** | Dataview plugin |

**Promotion Criteria**:

| Transition | Outbound Links | Backlinks | Stability (days) |
|-----------|---------------|-----------|-------------------|
| 📤seed → 🌱seedling | 2+ | 1+ | — |
| 🌱seedling → 🪴sapling | 5+ | 2+ | — |
| 🪴sapling → 🌲evergreen | 10+ | 5+ | 30+ |
| 🌲evergreen → 🍓fruit | 15+ | 10+ | 60+ |

---

## 3. Inbox Processing

### `quick-process-atomic.js`

> Instantly processes an inbox note as an atomic knowledge note.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro |
| **Inputs** | None (operates on active file) |
| **Outputs** | Updates metadata, moves to `02-Knowledge/Atomics/[subfolder]` |
| **Dependencies** | QuickAdd API, MetadataCache |

**Processing Time**: ~10-15 seconds vs 2-3 minutes manual processing. Offers optional title refinement, auto-populates `type: atomic`, calculates maturity from content analysis, suggests subfolder based on keywords.

---

### `quick-process-effort.js`

> Instantly processes an inbox note as an effort/project.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro |
| **Inputs** | None (operates on active file) |
| **Outputs** | Updates metadata, moves to `03-Efforts/[Active|Paused|Waiting]` |
| **Dependencies** | QuickAdd API, MetadataCache |

**Processing Time**: ~15-20 seconds. Prompts for deadline and priority, determines folder (Active/Paused/Waiting) based on deadline proximity, sets status based on urgency.

---

### `quick-process-source.js`

> Instantly processes an inbox note as a source (book, article, video).

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro |
| **Inputs** | None (operates on active file) |
| **Outputs** | Updates metadata, moves to `04-Sources/[subfolder]` |
| **Dependencies** | QuickAdd API, MetadataCache |

**Processing Time**: ~15-20 seconds. Prompts for URL, author, and source type, suggests subfolder based on detected source type, applies structured template for key insights.

---

## 4. Status & Maturity

### `status-picker.js`

> Visual status selection picker — bypasses linear progression when needed.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro `🔀 Change Status` (menu `🔧 Maintain Note`), typically from Commander page header button |
| **Inputs** | None (operates on active file) |
| **Outputs** | Updates status field in frontmatter |
| **Dependencies** | QuickAdd API (with `window.prompt` fallback) |

Presents all status options with descriptions via QuickAdd suggester. Skips update if selected status matches current value.

---

### `maturity-evolve.js`

> Manual maturity stage picker for the current note.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro `🌱 Change Maturity` (menu `🔧 Maintain Note`) |
| **Inputs** | None (operates on active file) |
| **Outputs** | Updates maturity field in frontmatter |
| **Dependencies** | QuickAdd API, MetadataCache |

Displays current maturity in suggester context. Creates frontmatter section if missing, inserts maturity field if absent, uses regex replacement for existing field.

---

## 5. Archive & Maintenance

### `archive_note.js`

> Archives the current note — updates YAML and moves to Archive folder.

| Detail | Value |
|--------|-------|
| **Trigger** | Templater user script, typically bound to hotkey |
| **Inputs** | `tp` (Templater instance) |
| **Outputs** | Sets `status: 📦archived`, adds `archived_date`, adds `#📦archived` tag, moves to `06-Archive/Completed` |
| **Dependencies** | Obsidian Vault API |

Uses custom `splitFM()` frontmatter parser. Smart tag insertion supporting both YAML array and block list tag formats. Upserts status and archived date before moving the file.

---

### `archive-old-dailies.js`

> Archives daily notes older than a configurable threshold to improve vault performance.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro; recommended quarterly or when performance degrades |
| **Inputs** | Optional `{ ageThresholdMonths: 12, dryRun: false }` |
| **Outputs** | Moves old dailies to `06-Archive/Daily-Notes-Archive/YYYY/`, creates archive index, generates report |
| **Dependencies** | QuickAdd API, `moment.js` |

Extracts date from daily note filenames, preserves metadata for streak calculation. Supports dry-run preview mode.

---

### `archive-note.js`

> Archives the current note to a user-selected `06-Archive/` subfolder and updates YAML status.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro `📦 Archive this note` (menu `🔧 This Note`) |
| **Inputs** | None (operates on active file; user selects destination via dropdown) |
| **Outputs** | Sets `status: 📦archived`, updates `modified` date, moves file to `06-Archive/Completed`, `Dormant`, or `Reference` |
| **Dependencies** | QuickAdd API, Obsidian Vault API |

**Workflow**: User invokes command → dropdown selector shows three archive subfolders with descriptions → user picks one → script updates YAML frontmatter and moves file. Guards against archiving files already in `06-Archive/`. Validates destination folder exists before moving.

---

### `mark-waiting.js`

> Marks the current note as waiting, adds the `⏳waiting` tag, and triggers Auto Note Mover to relocate to `03-Efforts/Waiting/`.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro `⏳ Mark Waiting` (menu `🔧 This Note`) |
| **Inputs** | None (operates on active file) |
| **Outputs** | Sets `status: ⏳waiting`, adds `#⏳waiting` to tags array, updates `modified` date, executes ANM command |
| **Dependencies** | QuickAdd API, Obsidian Vault API, Auto Note Mover plugin |

**Workflow**: User invokes command → script updates YAML frontmatter with new status and tag → triggers `auto-note-mover:Move-the-note` command to relocate note. Handles tag array creation/deduplication. Integrates with Auto Note Mover's existing rule for `#⏳waiting → 03-Efforts/Waiting`.

---

## 6. Publishing & Navigation

### `generate-newsletter.js`

> Gathers notes flagged `newsletter: true` and assembles a draft newsletter.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro `📰 Generate Newsletter` (menu `📦 Vault Ops`) |
| **Inputs** | None (reads `newsletter: true` from frontmatter) |
| **Outputs** | Creates `05-Calendar/Newsletter/Newsletter YYYY-MM-DD.md`; clears `newsletter: true` flag from included notes |
| **Dependencies** | Obsidian Vault API, MetadataCache |

**Newsletter Sections** (grouped by maturity):
- **Highlights**: evergreen/fruit notes
- **New Ideas**: seed/seedling notes
- **Deep Dives**: sapling notes
- **Sources**: source-type notes

After successful draft creation, the `newsletter: true` flag is cleared from all included notes to prevent duplication.

---

## 7. Auto-Metadata

### `auto-metadata.js`

> Automatically populates missing frontmatter fields with intelligent defaults.

| Detail | Value |
|--------|-------|
| **Trigger** | QuickAdd macro or Templater (`await tp.user.auto_metadata()`) |
| **Inputs** | Optional `{ files: [TFile, ...] }` for batch processing (defaults to active file) |
| **Outputs** | Updates frontmatter with populated fields; returns processed/updated counts |
| **Dependencies** | Obsidian Vault API, MetadataCache |

**Auto-populated Fields**:
- `created` / `modified` — from file stats if missing
- `up` — parent note based on folder structure
- `related` — suggested from content similarity
- `tags` — type-appropriate defaults
- `status` — defaults to `📥inbox` if missing
- `maturity` — calculated for atomic notes based on content analysis

---

## 📋 Quick Lookup Table

| Script | Category | Trigger | Primary Action |
|--------|----------|---------|----------------|
| `Templater_script.js` | Core | Templater | Template composition |
| `yaml_orchestrator.js` | Core | Templater/QuickAdd | YAML normalize/lint/reorder |
| `yaml_validator.js` | Core | Templater/QuickAdd | Schema validation |
| `update-metrics-cache.js` | Metrics | QuickAdd | Cache refresh |
| `generate-weekly-report.js` | Metrics | QuickAdd | Weekly report creation |
| `generate-monthly-report.js` | Metrics | QuickAdd | Monthly report creation |
| `generate-quarterly-report.js` | Metrics | QuickAdd | Quarterly report creation |
| `generate-yearly-report.js` | Metrics | QuickAdd | Yearly report creation |
| `maturity-promoter.js` | Metrics | Templater/QuickAdd | Promotion suggestions |
| `quick-process-atomic.js` | Inbox | QuickAdd | Quick atomic processing |
| `quick-process-effort.js` | Inbox | QuickAdd | Quick effort processing |
| `quick-process-source.js` | Inbox | QuickAdd | Quick source processing |
| `status-picker.js` | Status | QuickAdd | Visual status picker |
| `maturity-evolve.js` | Maturity | QuickAdd | Manual maturity picker |
| `archive_note.js` | Archive | Templater | Single-note archival |
| `archive-note.js` | Archive | QuickAdd | Archive to subfolder with dropdown |
| `archive-old-dailies.js` | Archive | QuickAdd | Bulk daily archival |
| `mark-waiting.js` | Archive | QuickAdd | Mark waiting + ANM trigger |
| `generate-newsletter.js` | Publishing | QuickAdd | Newsletter draft |
| `auto-metadata.js` | Auto-Metadata | QuickAdd/Templater | Metadata enrichment |
| `check-enum-drift.py` | Guard (AIOS/scripts) | Manual/Task Scheduler | Maturity/status literal drift check |

---

## 🔧 How to Extend

### Adding a New Script

1. Create `.js` file in `99-System/Scripts/`
2. Export a function: `module.exports = async (args) => { ... }` for QuickAdd, or `module.exports = function() { ... }` for Templater user scripts
3. For **QuickAdd**: Register as User Script macro in QuickAdd settings
4. For **Templater**: Ensure `99-System/Scripts/` is set as Templater user script folder; access via `tp.user.scriptName()`
5. Use `new Notice("message")` for user feedback
6. Access vault via `app.vault`, metadata via `app.metadataCache`, workspace via `app.workspace`

### Script Conventions

- **Naming**: `kebab-case.js` for all scripts except `Templater_script.js` (legacy)
- **Error handling**: Display `Notice` on failure; never throw uncaught exceptions
- **Backup**: Scripts that modify YAML should support `backup: true` option
- **Dry-run**: Batch-processing scripts should support `dryRun: true` for preview
- **Dependencies**: Minimize cross-script dependencies; prefer self-contained logic

---

## 8. Scheduled Maintenance (`AIOS/scripts/`)

> These live outside `99-System/Scripts/` — they're Git Bash / Python, not Obsidian QuickAdd/Templater scripts. Each runs manually with full interactivity, or unattended via Windows Task Scheduler in `--dry-run` (report-only) mode. See **Automation stance** below for the schedule.

### `vault-morning.sh`

> Daily inbox triage + metrics cache refresh.

| Detail | Value |
|--------|-------|
| **Trigger** | Manual (`bash AIOS/scripts/vault-morning.sh`) or Task Scheduler `Origin\vault-morning-dryrun` (daily 07:30, `--dry-run`) |
| **Inputs** | `--dry-run` flag (optional) |
| **Outputs** | Live mode moves/classifies stale `+Inbox` files and rewrites `_Metrics Cache.md` inline fields; dry-run only reports what it would do |
| **Dependencies** | Git (auto-stashes staged changes before running), Bash |

**Steps**: (1) Inbox triage — lists `+Inbox/*.md` excluding `+Inbox.md`, `+About*`, and today's daily/weekly note, and classifies/reports on the rest. (2) Metrics cache refresh — updates `99-System/_Metrics Cache.md`. Never auto-commits — ends with a reminder to review `git diff` and commit manually.

---

### `vault-desloppify.sh`

> Post-edit YAML cleanup pass — catches enum/field drift introduced by hand-editing.

| Detail | Value |
|--------|-------|
| **Trigger** | Manual (`bash AIOS/scripts/vault-desloppify.sh [--last-commit]`) or Task Scheduler `Origin\vault-desloppify-dryrun` (weekly Sun 08:00, `--dry-run`) |
| **Inputs** | `--dry-run` (report only) / `--last-commit` (scope to files touched by the last commit, default is working-tree changes) |
| **Outputs** | Live mode rewrites frontmatter in-place via `sed`; snapshots a commit first if the working tree is dirty |
| **Dependencies** | Git, `awk`/`sed`/`grep` (Git Bash) |

**Fixes**: `maturity: 🌱seed` → `📤seed`; bare (unprefixed) `status:` words → canonical emoji form; `deadline:` field → renamed to `due:`.

> [!bug]- Fixed 2026-07-09: the script's `STATUS_MAP` used to map bare `cancel`/`cancelled` → `❌cancel` (missing "led"), not the canonical `❌cancelled` (`99-System/CIS/CIS_STATUS.md`). Corrected to map both to `❌cancelled`.

---

### `check-enum-drift.py`

> Guards the maturity/status emoji constants that `metrics-core.js` failed to centralize (see [[🔢My PKM Metadata]] § Enum drift guard).

| Detail | Value |
|--------|-------|
| **Trigger** | Manual (`python AIOS/scripts/check-enum-drift.py`) or Task Scheduler `Origin\enum-drift-check` (weekly Sun 08:10) |
| **Inputs** | None — reads `99-System/CIS/CIS_MATURITY.md` / `CIS_STATUS.md` as canonical source, and regex-scans `auto-metadata.js`, `maturity-evolve.js`, `maturity-promoter.js`, `yaml_orchestrator.js`, `status-picker.js` for local emoji literals |
| **Outputs** | Prints a report; exit 0 = clean, exit 1 = drift found (non-canonical literal, or a file that declares a full local stage/status list but is missing some canonical values) |
| **Dependencies** | Python stdlib only |

---

## ⚙️ Automation stance

Two-tier automation. QuickAdd JS scripts are manual-trigger (need Obsidian runtime). Shell/Python scripts are dual-mode: run manually with full interactivity, or on Windows Task Scheduler in report-only mode (`--dry-run`, output → `AIOS/orchestration/reports/cron-*.log`). Scheduled runs never commit and never prompt — a human reviews the report and commits. Scheduled: vault-morning (daily 07:30), vault-desloppify + check-enum-drift (Sun 08:00/08:10).

---

## 🔗 Related

- [[📦Template System Guide]] — How templates use `Templater_script.js`
- [[🔁My PKM Workflows]] — Where scripts fit in daily/weekly/monthly workflows
- [[🚀Vault Migration Guide]] — Configuring scripts after forking
- [[📅Calendar Review Hub]] — Action center for all report generation scripts

---

## 🧰 QuickAdd Menu Map

Extracted from `.obsidian/plugins/quickadd/data.json` on 2026-07-13 (`python -c "..."` tree walk, top-level `choices[]`).

```
⚡ Create [Multi]
  Quick Inbox [Template]
  🤖 New Typed Note [Multi]
    🤖Atomic [Template]
    🤖Effort [Template]
    🤖Meeting [Template]
    🤖Source [Template]
    🤖MOC [Template]
    🤖Prompt [Template]
    🤖Person [Template]
    🤖Area [Template]
  🔗 Link to current line [Multi]
    🔗Atomic [Template]
    🔗Effort [Template]
    🔗Meeting [Template]
    🔗Source [Template]
    🔗MOC [Template]
    🔗Prompt [Template]
    🔗Person [Template]
  📝 Log to today [Capture]
🔧 This Note [Multi]
  ⚡Process Note [Macro]
  ✅ Validate Note YAML [Macro]
  🧭 Generate Orbit Callout [Macro]
  MATURITY-EVOLVE [Macro]
  🏷️Quick Tag [Capture]
  ➕Turn selected text into New Note [Macro]
  🔀 Change Status [Macro]
  🌱 Change Maturity [Macro]
  "lint"! [Capture]
  🔁reorder [Capture]
  🏛️normalize [Capture]
  📦 Archive this note [Macro]
  ⏳ Mark Waiting [Macro]
📦 Vault Ops [Multi]
  📝Auto-Fill Metadata [Macro]
  ⚡Quick Process - Atomic [Macro]
  ⚡Quick Process - Source [Macro]
  ⚡Quick Process - Effort [Macro]
  🔄Update Metrics Cache [Macro]
  📦Archive Old Dailies [Macro]
  Add to Changelog [Macro]
  🎯 Suggest Maturity Promotions [Macro]
  📰 Generate Newsletter [Macro]
  🔢 YAML Bulk [Multi]
    "lint"!- ask Folders - no memory [Capture]
    🔁reorder - ask Folders - no memory [Capture]
    🏛️normalize - ask Folders - no memory - backup [Capture]
    BE AWARE - Orchestrator full bundle [Macro]
    normalize - Setup - Dots&Efforts - w backup [Capture]
📅 Periodic [Multi]
  Report WEEKLY [Macro]
  Report MONTHLY [Macro]
  Report QUARTERLY [Macro]
  Report YEARLY [Macro]
  ➡️Status Progression NEXT [Capture]
  ⬅️Status Progression PREV [Capture]
MENU: 🔗 Insert [Multi]
  💭Insert Callout [Macro]
  ➕Insert Table of content [Macro]
⬅️Focus-sidebar➡️ [Macro]
```

| Menu path | Choice | Type | Script it calls |
|-----------|--------|------|------------------|
| ⚡ Create | Quick Inbox | Template | `Templates/Quick Capture - Inbox.md` |
| ⚡ Create > 🤖 New Typed Note | 🤖Atomic | Template | `Templates/Create/new-atomic-auto.md` |
| ⚡ Create > 🤖 New Typed Note | 🤖Effort | Template | `Templates/Create/new-effort-auto.md` |
| ⚡ Create > 🤖 New Typed Note | 🤖Meeting | Template | `Templates/Create/new-meeting-auto.md` |
| ⚡ Create > 🤖 New Typed Note | 🤖Source | Template | `Templates/Create/new-source-auto.md` |
| ⚡ Create > 🤖 New Typed Note | 🤖MOC | Template | `Templates/Create/new-moc-auto.md` |
| ⚡ Create > 🤖 New Typed Note | 🤖Prompt | Template | `Templates/Create/new-prompt-auto.md` |
| ⚡ Create > 🤖 New Typed Note | 🤖Person | Template | `Templates/Create/new-person.md` |
| ⚡ Create > 🤖 New Typed Note | 🤖Area | Template | `Templates/Create/new-area-auto.md` |
| ⚡ Create > 🔗 Link to current line | 🔗Atomic | Template | `Templates/Create/new-atomic.md` |
| ⚡ Create > 🔗 Link to current line | 🔗Effort | Template | `Templates/Create/new-effort.md` |
| ⚡ Create > 🔗 Link to current line | 🔗Meeting | Template | `Templates/Create/new-meeting.md` |
| ⚡ Create > 🔗 Link to current line | 🔗Source | Template | `Templates/Create/new-source.md` |
| ⚡ Create > 🔗 Link to current line | 🔗MOC | Template | `Templates/Create/new-moc.md` |
| ⚡ Create > 🔗 Link to current line | 🔗Prompt | Template | `Templates/Create/new-prompt.md` |
| ⚡ Create > 🔗 Link to current line | 🔗Person | Template | `Templates/Create/new-person.md` |
| ⚡ Create | 📝 Log to today | Capture | capture |
| 🔧 This Note | ⚡Process Note | Macro | `99-System/Scripts/process-note-safe.js` |
| 🔧 This Note | ✅ Validate Note YAML | Macro | `99-System/Scripts/yaml_validator.js` |
| 🔧 This Note | 🧭 Generate Orbit Callout | Macro | `99-System/Scripts/generate-orbit.js` |
| 🔧 This Note | MATURITY-EVOLVE | Macro | no UserScript — NestedChoice |
| 🔧 This Note | 🏷️Quick Tag | Capture | capture |
| 🔧 This Note | ➕Turn selected text into New Note | Macro | no UserScript — EditorCommand, NestedChoice, EditorCommand, Conditional |
| 🔧 This Note | 🔀 Change Status | Macro | `99-System/Scripts/status-picker.js` |
| 🔧 This Note | 🌱 Change Maturity | Macro | `99-System/Scripts/maturity-evolve.js` |
| 🔧 This Note | "lint"! | Capture | capture |
| 🔧 This Note | 🔁reorder | Capture | capture |
| 🔧 This Note | 🏛️normalize | Capture | capture |
| 🔧 This Note | 📦 Archive this note | Macro | `99-System/Scripts/archive-note.js` |
| 🔧 This Note | ⏳ Mark Waiting | Macro | `99-System/Scripts/mark-waiting.js` |
| 📦 Vault Ops | 📝Auto-Fill Metadata | Macro | `99-System/Scripts/auto-metadata.js` |
| 📦 Vault Ops | ⚡Quick Process - Atomic | Macro | `99-System/Scripts/quick-process-atomic.js` |
| 📦 Vault Ops | ⚡Quick Process - Source | Macro | `99-System/Scripts/quick-process-source.js` |
| 📦 Vault Ops | ⚡Quick Process - Effort | Macro | `99-System/Scripts/quick-process-effort.js` |
| 📦 Vault Ops | 🔄Update Metrics Cache | Macro | `99-System/Scripts/update-metrics-cache.js` |
| 📦 Vault Ops | 📦Archive Old Dailies | Macro | `99-System/Scripts/archive-old-dailies.js` |
| 📦 Vault Ops | Add to Changelog | Macro | no UserScript — OpenFile, NestedChoice |
| 📦 Vault Ops | 🎯 Suggest Maturity Promotions | Macro | `99-System/Scripts/maturity-promoter.js` |
| 📦 Vault Ops | 📰 Generate Newsletter | Macro | `99-System/Scripts/generate-newsletter.js` |
| 📦 Vault Ops > 🔢 YAML Bulk | "lint"!- ask Folders - no memory | Capture | capture |
| 📦 Vault Ops > 🔢 YAML Bulk | 🔁reorder - ask Folders - no memory | Capture | capture |
| 📦 Vault Ops > 🔢 YAML Bulk | 🏛️normalize - ask Folders - no memory - backup | Capture | capture |
| 📦 Vault Ops > 🔢 YAML Bulk | BE AWARE - Orchestrator full bundle | Macro | `99-System/Scripts/yaml_orchestrator.js` |
| 📦 Vault Ops > 🔢 YAML Bulk | normalize - Setup - Dots&Efforts - w backup | Capture | capture |
| 📅 Periodic | Report WEEKLY | Macro | `99-System/Scripts/generate-weekly-report.js` |
| 📅 Periodic | Report MONTHLY | Macro | `99-System/Scripts/generate-monthly-report.js` |
| 📅 Periodic | Report QUARTERLY | Macro | `99-System/Scripts/generate-quarterly-report.js` |
| 📅 Periodic | Report YEARLY | Macro | `99-System/Scripts/generate-yearly-report.js` |
| 📅 Periodic | ➡️Status Progression NEXT | Capture | capture |
| 📅 Periodic | ⬅️Status Progression PREV | Capture | capture |
| MENU: 🔗 Insert | 💭Insert Callout | Macro | `99-System/Scripts/insert-callout.js` |
| MENU: 🔗 Insert | ➕Insert Table of content | Macro | `99-System/Scripts/insert-toc.js` |
| (top-level) | ⬅️Focus-sidebar➡️ | Macro | no UserScript — Obsidian, Obsidian |

Every UserScript path above resolves to a real file in `99-System/Scripts/` — no `⚠️ missing` entries found.

---

*Last Updated: 2026-07-13 | Status: 🔄active*

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
