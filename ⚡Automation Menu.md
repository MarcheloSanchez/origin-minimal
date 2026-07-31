---
up: "[[03-Efforts]]"
title: ⚡ Automation Menu
type: system
tags:
  - ⚙️system
status: 📥inbox
created: 2025-08-20
modified: 2026-07-13
related:
  - "[[Guide - YAML Orchestrator]]"
---

> [!orbit] Wayfinder | [[👁️Dashboard]] | [[🧭Review HQ]] | [[MOC - Automation Command Center]]

# ⚡ Create

Quick capture and note creation.

| Choice | What it does |
|--------|-------------|
| **Quick Idea** | Capture template for ideas into +Inbox |
| **Quick Inbox** | General inbox capture form |
| **🤖 New Typed Note** | Submenu: Atomic, Effort, Meeting, Source, MOC, Prompt, Area (auto-filled, appends link) |
| **👤 Person** | Create contact note (people, both professional and personal) |
| **🔗 Link to current line** | Submenu: Create new note (Idea, Atomic, Effort, Meeting, Source, MOC, Prompt) with link back to current file |
| **📝 Log to today** | Capture to today’s daily note under “📥Captures” section (HH:mm format) |

```button
name ⚡ Create Menu
type command
action QuickAdd: ⚡ Create
```

# 🔧 This Note

Edit, process, validate, and manage the current note.

| Choice | What it does |
|--------|-------------|
| **⚡Process Note** | Run process-note-safe.js — internal workflow processor |
| **✅ Validate Note YAML** | Lint frontmatter; check required fields and enum validity |
| **🧭 Generate Orbit Callout** | Insert/regenerate wayfinder navigation callout |
| **MATURITY-EVOLVE** | Cycle through maturity stages (seed → seedling → sapling → evergreen → fruit) |
| **🏷️Quick Tag** | Insert predefined emoji tags at cursor |
| **➕Turn selected text into New Note** | Extract selected text to new note with template |
| **🔀 Change Status** | Interactive status picker (📥inbox → 🔄active → ⏳waiting → ✅completed → 📦archived) |
| **🌱 Change Maturity** | Pick new maturity level |
| **”lint”!** | Run yaml_orchestrator in lint mode on current note |
| **🔁reorder** | Run yaml_orchestrator to reorder YAML fields |
| **🏛️normalize** | Run yaml_orchestrator to normalize field values |
| **📦 Archive this note** | Move to archive with status + metadata |
| **⏳ Mark Waiting** | Set status to ⏳waiting with optional date |

```button
name 🔧 This Note Menu
type command
action QuickAdd: 🔧 This Note
```

# 📦 Vault Ops

Vault maintenance, processing, and metrics.

| Choice | What it does |
|--------|-------------|
| **📝Auto-Fill Metadata** | Populate created/modified/author fields |
| **⚡Quick Process - Atomic** | Fast workflow for atomic notes; shows Smart Connections |
| **⚡Quick Process - Source** | Fast workflow for source notes |
| **⚡Quick Process - Effort** | Fast workflow for effort/project notes |
| **🔄Update Metrics Cache** | Refresh cache file (99-System/_Metrics Cache.md) with latest counts |
| **📦Archive Old Dailies** | Move completed daily notes to archive |
| **Add to Changelog** | Open CHANGELOG.md and add entry under date section |
| **🎯 Suggest Maturity Promotions** | Scan notes and suggest evolution candidates |
| **📰 Generate Newsletter** | Create weekly/monthly newsletter from active notes |
| **🔢 YAML Bulk** | Submenu: bulk lint/reorder/normalize with folder selection |

```button
name 📦 Vault Ops Menu
type command
action QuickAdd: 📦 Vault Ops
```

# 📅 Periodic

Scheduled reports and status workflows.

| Choice | What it does |
|--------|-------------|
| **Report WEEKLY** | Generate weekly summary report |
| **Report MONTHLY** | Generate monthly summary report |
| **Report QUARTERLY** | Generate quarterly summary report |
| **Report YEARLY** | Generate yearly summary report |
| **➡️Status Progression NEXT** | Cycle note status forward (inbox → active → waiting → completed → archived) |
| **⬅️Status Progression PREV** | Cycle note status backward |

```button
name 📅 Periodic Menu
type command
action QuickAdd: 📅 Periodic
```

# MENU: 🔗 Insert

Insert blocks and elements into notes.

| Choice | What it does |
|--------|-------------|
| **💭Insert Callout** | Insert callout block (choose type: info, warning, example, etc.) |
| **➕Insert Table of content** | Generate TOC from headings |

```button
name 🔗 Insert Menu
type command
action QuickAdd: MENU: 🔗 Insert
```

# ⬅️Focus-sidebar➡️

Quick toggle for left and right sidebars (focus mode).

```button
name ⬅️Focus-sidebar➡️
type command
action QuickAdd: ⬅️Focus-sidebar➡️
```

# Scheduled Tasks (Cron)

Three automated Windows scheduled tasks refresh vault state and health metrics:

| Task | Schedule | Log | Purpose |
|------|----------|-----|---------|
| **vault-morning-dryrun** | Daily 07:30 | `AIOS/orchestration/reports/cron-vault-morning.log` | Inbox triage + metrics cache refresh |
| **vault-desloppify-dryrun** | Sunday 08:00 | `AIOS/orchestration/reports/cron-vault-desloppify.log` | YAML post-edit cleanup (maturity/status/deadline→due normalization) |
| **enum-drift-check** | Sunday 08:10 | `AIOS/orchestration/reports/cron-enum-drift-check.log` | CIS enum validity scan |

> Use [[🧭Review HQ]] “Scheduled Task Health” panel to monitor freshness. Logs rotate in `AIOS/orchestration/reports/`.

# Claude Code Commands

Slash commands in `.claude/` (via AIOS/runtime/commands/):

| Command | Purpose |
|---------|---------|
| **/lint-vault** | Scan vault for missing YAML, broken links, type mismatches, orphan notes |
| **/fix-note** | Inspection-first fixer for current note (read-before-apply) |
| **/fix-batch** | Bulk fix multiple notes with vault inspector |
| **/review-note** | Quality review + wikilink recommendations for current note |
| **/process-capture** | Move and structure raw +Inbox capture into proper note |
| **/process-inbox** | Batch triage +Inbox with type classification |
| **/reflect-daily** | Generate or refresh today’s daily note with prompts |
| **/reflect-weekly** | Generate or refresh weekly review note |
| **/queue-add** | Add current note to processing queue |
| **/run-queue** | Execute queued batch operations |
| **/review-proposed** | Review proposed structural changes before applying |
| **/vault-quality-pass** | Full vault health audit (YAML, links, metadata) |
| **/check-hotkeys** | Verify QuickAdd hotkey bindings match data.json |
| **/unlock-private** | Temporarily unlock privacy-protected folders for this session |
| **/lock-private** | Re-lock privacy-protected folders |
| **/new-note** | Create note with type selection |
| **/save** | Quick save + commit |

# Internal Scripts & Utilities

The following scripts are engine-level or internal helpers (called by templates or other scripts, not meant for direct QuickAdd button access). Full reference:

> See [[🔧Scripts Reference]] for the complete catalog of all 20+ maintenance scripts, their signatures, and use cases.

- **Templater_script.js** — YAML orchestrator engine (inject_meta_if_missing, add_chapters, combine, reset_*)
- **yaml_orchestrator.js** — Bulk YAML lint/reorder/normalize engine (called by Capture choices)
- Templater templates call these internally; not in QuickAdd menus

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*