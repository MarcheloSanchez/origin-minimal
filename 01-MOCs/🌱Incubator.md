---
up: "[[01-MOCs]]"
in:
  - "[[Views]]"
title: 🌱Incubator
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
cssclasses:
  - wide-page
obsidianUIMode: preview
quality_reviewed: 2026-07-08
---

> [!orbit] Wayfinder | [[01-MOCs]] | [[🍓Maturity Garden]] | [[🧹Cleaning Lady]]

# TOP 10 
```base
filters:
  and:
    - file.hasTag("🌱develop")
    - '!file.name.contains("My PKM")'
views:
  - type: table
    name: 🌱Incubator
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
> Limit 15

# RELATED
[[🧹Cleaning Lady]]
[[Relate]]
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
