---
up: "[[01-MOCs]]"
in:
  - "[[Views]]"
title: 🍓Maturity Garden
type: system
tags: ["⚙️system"]
status: 🔄active
maturity: 📤seed
created: 2026-03-03
modified: 2026-03-03
related:
  - "[[Relate]]"
  - "[[Communicate]]"
  - "[[🧹Cleaning Lady]]"
  - "[[🌱Incubator]]"
cssclasses:
  - wide-page
obsidianUIMode: preview
quality_reviewed: 2026-07-08
---

> [!orbit] Wayfinder | [[01-MOCs]] | [[🌱Incubator]] | [[🧹Cleaning Lady]]


*Choose maturity stage* 📤 → 🌱 → 🪴 → 🌲 →  🍓

```base
filters:
  and:
    - "!maturity.isEmpty()"
views:
  - type: table
    name: All Maturity
    order:
      - file.name
      - file.folder
      - tags
    sort:
      - property: tags
        direction: ASC
    limit: 10
    columnSize:
      file.name: 327
      note.tags: 436
  - type: table
    name: 📤Seed Maturity
    filters:
      and:
        - maturity == "📤seed"
    order:
      - file.name
      - file.folder
      - tags
      - file.ctime
      - file.mtime
    sort:
      - property: tags
        direction: ASC
    limit: 10
    columnSize:
      file.name: 193
      note.tags: 436
      file.ctime: 153
  - type: table
    name: 🌱Seedling
    filters:
      and:
        - maturity == "🌱seedling"
    order:
      - file.name
      - file.folder
      - tags
      - file.ctime
      - file.mtime
    sort:
      - property: tags
        direction: ASC
    limit: 10
    columnSize:
      file.name: 193
      note.tags: 436
      file.ctime: 153
  - type: table
    name: 🪴Sapling
    filters:
      and:
        - maturity == "🪴sapling"
    order:
      - file.name
      - file.folder
      - tags
      - file.ctime
      - file.mtime
    sort:
      - property: tags
        direction: ASC
    limit: 10
    columnSize:
      file.name: 193
      note.tags: 436
      file.ctime: 153
  - type: table
    name: 🌲Evergreen
    filters:
      and:
        - maturity == "🌲evergreen"
    order:
      - file.name
      - file.folder
      - tags
      - file.ctime
      - file.mtime
    sort:
      - property: tags
        direction: ASC
    limit: 10
    columnSize:
      file.name: 193
      note.tags: 436
      file.ctime: 153
  - type: table
    name: 🍓Fruit
    filters:
      and:
        - maturity == "🍓fruit"
    order:
      - file.name
      - file.folder
      - tags
      - file.ctime
      - file.mtime
    sort:
      - property: tags
        direction: ASC
    limit: 10
    columnSize:
      file.name: 193
      note.tags: 436
      file.ctime: 153

```

# RELATED
[[🧹Cleaning Lady]]
[[Relate]]

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
