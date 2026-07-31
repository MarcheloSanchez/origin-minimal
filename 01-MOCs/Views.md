---
up: "[[01-MOCs]]"
in:
  - "[[Views]]"
title: Overview of all views
type: moc
fileClass: moc
tags:
  - ⚙️system
  - 🗺️MOC
status: 🔄active
maturity: 🌱seedling
created: 2025-09-30
modified: 2026-07-13
related:
  - "[[🔍My PKM Queries]]"
  - "[[🔁My PKM Workflows]]"
  - "[[Maps]]"
quality_reviewed: 2026-07-08
---

> [!orbit] Wayfinder | [[01-MOCs]] | [[Maps]] | [[Library]]


> Master index of every view in the vault — dashboards, bases, MOC lenses, and query templates. For Bases deep-dive see [[MOC - Bases]].

---

## 📊 Dashboards

Hub notes for navigation and status overview.

| Note                             | Description                                                   |
| -------------------------------- | ------------------------------------------------------------- |
| [[👁️Dashboard]]                 | Main PKM dashboard — task status, inbox count, active efforts |
| [[🏡Home]]                       | Vault home — quick nav to all core areas                      |
| [[TODO]]                         | GTD workflow hub — next actions, projects, waiting            |
| [[🎮Gamification Dashboard]]     | XP, streaks, and habit tracking                               |
| [[📊Calendar System Dashboard]] | Calendar system overview — daily/weekly/monthly status        |
| [[Tags - Status Check]]          |                                                               |


---

## 🗄️ Bases

`.base` database views — structured data filtered and sorted by folder.

### System

| File                       | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| [[Active-Types-base.base]] | Browse every note type (atomic, effort, source, etc.) |
| [[_Daily_Data.base]]        | Notes created today + modified today across the vault |

### Per-Folder Data Bases

| File                                  | Folder scope         |
| ------------------------------------- | -------------------- |
| [[_Inbox_Data.base]]                  | +Inbox               |
| [[_MOCs_Data.base]]                   | 01-MOCs              |
| [[02-Knowledge/_Knowledge_Data.base]] | 02-Knowledge         |
| [[_Atomics_Data.base]]                | 02-Knowledge/Atomics |
| [[_People_Data.base]]                 | 02-Knowledge/People  |
| [[_Efforts_Data.base]]                | 03-Efforts           |
| [[_Sources_Data.base]]                | 04-Sources           |
| [[_Meetings_Data.base]]               | 04-Sources/Meetings  |
| [[_Calendar_Data.base]]               | 05-Calendar          |
| [[_Daily_Data.base]]                  | 05-Calendar/Daily    |
| [[_Archive_Data.base]]                | 06-Archive           |
| [[_Prompt_Data.base]]                 | 07-Prompts           |

> Deep reference: [[MOC - Bases]]

---

## 🗺️ MOC Views

MOC notes that function as curated lenses on vault content.

| Note | Description |
|------|-------------|
| [[🌱Incubator]] | Top 10 notes with most connections — ideas ready to develop |
| [[🍓Maturity Garden]] | Notes by maturity stage (seed → fruit) |
| [[🗺️My PKM MOC]] | Master map of the PKM system |
| [[🧹Cleaning Lady]] | Maintenance view — orphans, stubs, incomplete notes |
| [[MOC - Areas]] | Active areas of responsibility |
| [[MOC - Automation Command Center]] | All automation scripts and macros |
| [[MOC - Bases]] | All `.base` files with filter syntax reference |
| [[MOC - Playbooks]] | Step-by-step process guides |
| [[MOC - Prompts]] | Prompt library MOC |
| [[MOC - Visual Identity]] | Design tokens and visual system |

---

## 🔍 Query Library

Reusable Dataview query templates.

| Note | Description |
|------|-------------|
| [[🔍My PKM Queries]] | Named query library — copy-paste Dataview blocks |
| [[Query - Active Projects]] | All efforts with active status |
| [[Query - Health Status]] | Vault health metrics |
| [[Query - Inbox Processing]] | Items in +Inbox awaiting triage |
| [[Query - Maturity Distribution]] | Count of notes per maturity stage |
| [[Query - Newsletter Queue]] | Sources tagged for newsletter |
| [[Query - Orphan Notes]] | Notes with no inlinks |
| [[Query - Weekly Stats]] | Stats for the current week |
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
