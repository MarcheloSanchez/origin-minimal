---
name: origin-vault
description: Use this skill when working inside the Origin Obsidian vault (v2.0). Origin is a structured PARA-inspired PKM system with locked enums, an 8-layer folder hierarchy, fileClass conventions, an ordered YAML schema enforced by yaml_orchestrator.js, a two-tier type system (11 full + 11 lightweight), and Czech/English bilingual content. Triggers on paths like +Inbox, 01-MOCs, 02-Knowledge, 03-Efforts, 04-Sources, 05-Calendar, 06-Archive, 99-System, Templates; YAML frontmatter containing emoji status/maturity values; or when the user mentions Origin, Knowledge, Atomics, Efforts, MOCs, CIS, or fileClass. Read this before any vault operation — generic Obsidian conventions will produce output that breaks Origin's automation.
---

# Origin Vault Skill (v2.0)

You are operating inside the Origin Obsidian vault, version 2.0. Read this entire file before performing any action on vault files. Generic Obsidian conventions are not sufficient — Origin has locked enums, an enforced YAML order, and a tiered access model the user has built deliberately.

## Architecture: 8-Layer Structure

| Folder | Purpose | Type expected |
|--------|---------|---------------|
| `+Inbox` | Capture zone — quick capture entry point | mixed |
| `01-MOCs` | Maps of Content (navigation hubs) | moc |
| `02-Knowledge` | Atomic knowledge + entity reference notes | atomic, person, place, tool, area |
| `03-Efforts` | Projects | effort |
| `04-Sources` | External references | source, meeting |
| `05-Calendar` | Periodic notes (Daily/Weekly/Monthly/Quarterly/Yearly) | daily, weekly, monthly, quarterly, yearly |
| `06-Archive` | Completed/inactive content | (any type, archived) |
| `99-System` | Templates infra, scripts, CIS, FileClasses, AI prompts — DO NOT MODIFY without explicit ask | infrastructure |
| `Templates` | 3-tier modular template system (Meta+Body, Static, Create, Queries, Calendar) | infrastructure |

Root dashboards live at vault root: `🏡Home.md`, `👁️Dashboard.md`, `TODO.md`, `🧭 Review HQ.md`, `ME.md`.

### `02-Knowledge` substructure
- `Atomics/` → `Concepts/`, `Ideas/`, `Quotes/`, `Statements/`, `Things/`
- `Areas/` → life domains (Health, Finance, Career, Relationships, Personal)
- `People/` → contacts (`type: person`)
- `Places/` → locations (`type: place`)
- `Tools/` → software/equipment (`type: tool`)
- `X/` → unclassified holding (avoid leaving things here)

### `03-Efforts` substructure
- `Active/` → currently working
- `Paused/` → on hold
- `Waiting/` → blocked on someone/something

## LOCKED Enums — never invent new values

### `type` — Two-tier system

**Full types (11)** — have FileClass + full templates + metadata schemas:
`atomic | effort | source | moc | meeting | prompt | person | place | tool | area | subscription`

**Lightweight types (11)** — CIS_TYPE + Templater_script only, no FileClass/templates:
`system | dashboard | about | guide | tutorial | daily | weekly | monthly | quarterly | yearly | challenge`

There is **no** `archive` type — archival is a status/folder concern, not a type.

### `status`
`📥inbox | 🔄active | ⏳waiting | ✅completed | 📦archived | ⏸️paused | ❌cancelled | ⚠️blocked`

### `maturity` (atomics primarily)
`📤seed | 🌱seedling | 🪴sapling | 🌲evergreen | 🍓fruit`

Note: canonical seed is `📤seed` (outbox/paper-tray emoji), and canonical fruit is `🍓fruit` (strawberry). Older notes may still carry `🌱seed`/`🍎fruit` — flag as drift, do not propagate.

### `priority`
`high | medium | low` — plain text, no `critical`.

If you encounter a value outside these enums, flag it as a violation in your output. Do not "fix" it by guessing — the user's CIS files in `99-System/CIS/` are the source of truth and you are not permitted to modify them.

## YAML Frontmatter

### Universal fields (every note)
```yaml
up: "[[Parent]]"
title:
type:
status:
created: YYYY-MM-DD
modified: YYYY-MM-DD
tags:
related: []
fileClass:
```

### Wikilink quoting (mandatory)

Any wikilink emitted into a YAML scalar field **must be quoted**:

```yaml
up: "[[Parent]]"   # correct
up: [[Parent]]     # WRONG — re-parsers turn it into a flow array
```

This applies to `up`, `in`, and any related/source link written as a scalar. Lists of wikilinks under `related:` should each be a quoted string.

### Field order (enforced by yaml_orchestrator.js)

When writing or editing YAML, follow this canonical order:

1. **Navigation**: `up`, `in`
2. **Identity**: `title`, `aliases`, `type`, `fileClass`, `cssclass`, `tags`
3. **State**: `status`, `maturity`, `priority`, `processing_priority`, `completeness`, `coverage_areas`, `action_required`
4. **Time**: `created`, `modified`, `start`, `due`, `end`, `last_review`, `review_frequency`, `estimated_effort`
5. **Actions/Progress**: `completion_percentage`, `next_actions`, `capture_method`, `linked_notes_count`
6. **Knowledge/Quality**: `confidence_level`, `evidence_quality`, `read_status`, `rating_type`
7. **Source**: `source_author`, `source_date`, `source_type`
8. **Context**: `participants`, `location`, `meeting_type`, `action_items`
9. **Specialized**: `audience`, `difficulty`, `prompt_category`, `prompt_type`
10. **Relations**: `related`, `see_also`, `related_concepts`, `related_ideas`
11. **People**: `role`, `org`, `company`, `email`, `phone`, `website`, `twitter`, `github`, `linkedin`

Use `due` (not `deadline`) and `related` (not `relatedNotes`). The orchestrator auto-renames the legacy variants on its next pass — do not write the legacy names.

`prompt_status` is **retired** — collapsed into the vault-wide `status` (code/template cleanup completed 2026-07-24). Prompts carry only `status`. Legacy mapping: `draft`→`📥inbox`, `active`→`🔄active`, `winner`→`✅completed`, `archived`→`📦archived`. Do not re-introduce the field.

If you are unsure about ordering, defer to `99-System/Scripts/yaml_orchestrator.js` and recommend the user run it in `reorder` mode rather than reordering by hand.

### Maturity → exit criteria

| Stage | Icon | Criteria | Exit Condition |
|-------|------|----------|----------------|
| Seed | 📤 | Raw capture | Basic metadata + moved from Inbox |
| Seedling | 🌱 | Some development | 2+ links, structured content |
| Sapling | 🪴 | Well-connected | 5+ links, 2+ backlinks |
| Evergreen | 🌲 | Stable, mature | 10+ links, referenced in MOC |
| Fruit | 🍓 | Publishable | Adapted for external audience |

When suggesting maturity upgrades, verify the criteria are actually met (count links/backlinks). Don't propose upgrades on vibes.

## Boundaries

### 🔴 LOCKED — never modify

- `99-System/CIS/*` (controlled vocabularies)
- `.obsidian/*` (plugin configs, hotkeys, core settings) — except where explicitly tracked changes are requested
- `99-System/Config/*` (system configuration)
- Top-level folder structure (`+Inbox`, `01-MOCs`, `02-Knowledge`, `03-Efforts`, `04-Sources`, `05-Calendar`, `06-Archive`, `99-System`, `Templates`)
- Folder numbering scheme (`01-06`, `99` prefixes)
- Status emoji set, maturity emoji set, type enum

If a request requires touching any of these, **propose the change for the user to make**. Do not execute.

### 🟠 PROTECTED — only on explicit request

- `99-System/Scripts/*` — see canonical inventory below
- `Templates/*` — Meta, Body, Static, Create, Core, Queries, Calendar subfolders
- `My PKM *.md` files in `99-System/Documentation/PKM/` (content edits OK; structural changes need explicit approval)
- Root-level dashboards (`🏡Home.md`, `👁️Dashboard.md`, `🧭 Review HQ.md`, `TODO.md`) — query updates OK on request; layout changes need approval

For any of these: propose changes with clear before/after, ask before applying, and offer rollback instructions.

### 🟡 GUIDED — confirm approach first

- New MOCs in `01-MOCs`
- New Efforts in `03-Efforts`
- Bulk operations affecting >5 files
- Tag refactoring
- Maturity upgrades
- Moving notes between folders

Briefly state the approach, get a yes, then execute.

### 🟢 OPEN — proceed

- Creating notes in `+Inbox`, `02-Knowledge`, `03-Efforts`, `04-Sources`, `05-Calendar`, `06-Archive`
- Adding wikilinks
- Filling YAML metadata for new notes
- Running queries or generating reports
- Suggesting links, classifications, or improvements

## Existing Automation — augment, don't duplicate

Canonical script inventory in `99-System/Scripts/` (verify before referencing):

**Core engine & YAML**
- `Templater_script.js` — core template composition engine; provides `inject_meta_if_missing()`, `add_chapters()`, `combine()`, `reset_body()`, `reset_meta()`, `reset_all()`. `combine()` usage gotcha → `origin-templates` skill / CLAUDE.md Critical Issues #1.
- `yaml_orchestrator.js` — modes: `reorder`, `normalize`, `lint`. Status/maturity normalization, field rename (`deadline`→`due`), required-field insertion, validation step 5b.
- `yaml_validator.js` — schema validation for note frontmatter.
- `auto-metadata.js` — auto-fill metadata.
- `process-note-safe.js` — combo: Autofill Metadata + Normalize YAML.

**Quick processing**
- `quick-process-atomic.js`, `quick-process-effort.js`, `quick-process-source.js` — one-click type processing. Bilingual (Czech keywords intentional — do not strip).

**Status / maturity / archival**
- `status-picker.js`, `status-progression.js`
- `maturity-promoter.js` (suggestions), `maturity-evolve.js` (QuickAdd picker)
- `archive_note.js`, `archive-old-dailies.js`, `archive-subscription.js`

**Metrics & reports**
- `metrics-core.js` — centralized Dataview metric functions (Templater user script).
- `update-metrics-cache.js` — writes inline Dataview fields to `99-System/_Metrics Cache.md`.
- `generate-weekly-report.js`, `generate-monthly-report.js`, `generate-quarterly-report.js`, `generate-yearly-report.js`, `generate-newsletter.js`, `update-changelog.js`, `generate-orbit.js`.

**Editor helpers**
- `insert-callout.js`, `insert-toc.js`, `open-home.js`.

**Python utilities**
- `plugin_versions*.py`, `translator.py`.

Before proposing new automation, check whether the gap is actually a gap. The Claude Code layer (commands/agents) handles **synthesis, reflection, inspection-and-fix** — what the existing scripts don't do. It complements the classification/metadata layer; it does not replace it.

## Conventions

### Filename patterns
- Atomics: `💡 [Title]` for ideas, `📃 [Title]` for statements/quotes (varies by subfolder)
- Sources: `📚 Source - [Author] - [Title]`
- Efforts: `🚀 [Project Name]`
- People: `👤 [Name]`
- Tools: `🔧 [Tool Name]`
- MOCs: `🗺️ [Topic] MOC`
- About files: `+About {Section}ℹ️.md`
- Filenames must be under 60 characters
- No special path characters (mobile compatibility)

### Dates
- ISO `YYYY-MM-DD`, always
- No locale-dependent formats

### Wayfinder navigation and footer
Every PKM vault note (and living `AIOS/docs/` reference doc) carries exactly two nav elements:
1. **Wayfinder callout**, preceded by one blank line after the frontmatter's closing `---`:
```

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[🏛️My PKM Governance]] | ...
```
   Known exception: `generate-orbit.js` writes it with no blank line before it — that's intentional, don't "fix" the script to match.
2. **Footer**, as the last block, preceded by a `---` separator — requires `maturity: 🪴sapling` or higher (sapling/evergreen/fruit). Seed/seedling notes stay unlinked to Home — the footer signals "synthesized into the graph," not "exists." AIOS reference docs are always-mature and always carry it:
```
---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
```
Preserve both when editing — they are deliberate navigation infrastructure. **Not required** for `AIOS/docs/plans/` and `AIOS/docs/specs/` (engineering/planning artifacts, not PKM notes). Full rule: CLAUDE.md Critical Issue #14.

### Wikilinks
- Aim for 3+ meaningful links per note
- Bidirectional matters — important connections work both ways
- **Verify a link target exists before suggesting it** (use Glob/Grep) — don't invent

### Cache pattern
- `99-System/_Metrics Cache.md` uses Dataview inline fields (`field:: value`).
- Dashboards read via `dv.page("99-System/_Metrics Cache").field_name` with live fallback.
- Cache updated via QuickAdd "Update Metrics Cache" — do not recompute in queries when the cached value will do.

### Language
Origin is **bilingual**. Czech is the user's native language; English is used for technical terms and structure. Mixed-language content within a single note is normal and intended.

- **Do not auto-translate** Czech to English or vice versa
- **Match the user's voice** in the section you're editing
- If a daily note is mostly Czech, write your synthesis in Czech (or matching mixed style)
- Flag content that appears machine-translated rather than written by the user

## Operating Principles

1. **Audit before building.** Search existing notes/scripts/My PKM docs before proposing new ones. Generic conventions will not fit Origin.
2. **Inspection before mutation.** For any fix-batch or capture-routing operation, produce a preview the user approves before files are written.
3. **Complete content over templates.** When asked to produce a deliverable, produce the deliverable, not a placeholder structure.
4. **Drafts to react to, not outputs to accept.** AI synthesis is a starting point for the user's reaction. Never substitute for their thinking.
5. **Respect locked structure.** If a request would touch `99-System/CIS` or top-level folder layout, propose changes for the user to make rather than executing.
6. **Bilingual care.** Preserve language as written. Do not auto-translate. Flag machine-translated-looking sections.
7. **No filler.** If a section has nothing real to say, say "(none)" or "(žádné)" instead of padding.
8. **Honest synthesis.** If a day was unproductive, say so. Echoing mood without truth is worthless.

## Reference Documents (in vault)

For deeper context, read these directly when relevant:

- `99-System/Documentation/PKM/🏛️My PKM Governance.md` — official rules
- `99-System/Documentation/PKM/🔁My PKM Workflows.md` — daily/weekly/monthly/quarterly review structures
- `99-System/Documentation/PKM/🔢My PKM Metadata.md` — full YAML schema details
- `99-System/Documentation/PKM/🏷️My PKM Tags.md` — tag taxonomy
- `99-System/Documentation/PKM/🗃️My PKM Glossary.md` — Czech/English term definitions
- `04-Sources/Guides/Guide - YAML Orchestrator.md` — orchestrator usage and modes
- `CLAUDE.md` (project root) — project-level operating rules; takes precedence over this skill on conflicts

When in doubt, read the source. This skill is a summary; the linked docs are authoritative.
