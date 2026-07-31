---
up: "[[🏡Home]]"
in:
  - "[[01-MOCs]]"
title: MOC - Bases
type: moc
fileClass: moc
tags:
  - 🗺️MOC
  - ⚙️system
status: 🔄active
maturity: 🌱seedling
completeness: draft
created: 2026-02-18
modified: 2026-02-18
related:
  - "[[Views]]"
  - "[[99-System]]"
quality_reviewed: 2026-07-08
---

> [!orbit] Wayfinder | [[Views]] | [[🔍My PKM Queries]]

# 🗺️ MOC — Bases

> All standalone `.base` files in the vault. Obsidian's native database views — YAML-defined, zero-JavaScript, rendered by the Bases plugin.

---

## Base Files

### 99-System

| File                        | Purpose                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| [[Active-Types-base.base]]  | Browse every note type — atomic, effort, source, prompt, meeting, person, place, tool, area |
| [[_Daily_Data.base]]         | Created Today + Modified Today across the entire vault                                      |
| [[Vault-Dash-Missing.base]] | Notes grouped by type — scan for gaps                                                       |
| [[_System_data.base]]       | System notes missing `status`, `created`, or `type`                                         |

### 01-MOCs

| File                | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| [[_MOCs_Data.base]] | All MOC notes with completeness + coverage metadata |

---

## All Base Files — Live Index

```bases
filters:
  and:
    - 'file.extension == "base"'
properties:
  file.folder:
    displayName: Folder
  file.mtime:
    displayName: Modified
views:
  - type: table
    name: All Bases
    order:
      - file.name
      - file.folder
      - file.mtime
    sort:
      - property: file.folder
        direction: ASC
```

---

## Filter Syntax Reference

| Pattern | Syntax |
|---------|--------|
| Match type | `type == "effort"` |
| Match status | `status == "🔄active"` |
| In folder | `file.inFolder("03-Efforts")` |
| Folder contains string | `'file.folder.contains("99-System")'` |
| Created today | `'file.ctime >= today()'` |
| Modified today | `'file.mtime >= today()'` |
| Modified within 1 week | `'file.mtime > now() - "1 week"'` |
| Field is missing | `'!status'` |
| String contains | `'title.contains("review")'` |
| OR across types | `'type == "atomic" \|\| type == "effort"'` |

---

## Template

- [[Base - Block]] / [[Templates/Static/base|base]] / [[Quick Insert, Bases]] — Scaffold for creating new base files

## Related

- [[Views]] — All notes that contain views, sorted by link count
- [[99-System]] — System folder home
- [[🔍My PKM Queries]] — Dataview query library

---
*Coverage: draft | Last review: 2026-02-18*

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
