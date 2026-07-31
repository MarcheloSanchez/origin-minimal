---
up: "[[01-MOCs]]"
in:
  - "[[Views]]"
title: MOC - About Notes
type: moc
tags:
  - ⚙️system
  - 🗺️MOC
  - 📋about
status: 🔄active
created: 2025-09-30
modified: 2026-07-10
quality_reviewed: 2026-07-10
---

> [!orbit] Wayfinder | [[01-MOCs]] | [[Views]]

> [!info] What goes here
> **+About Notes** — Per-folder orientation guides: what belongs in each vault section, routing rules, and the "does NOT belong" contrast. *Belongs here if:* it's a hub note for a vault folder, starting with `+About`, describing that folder's purpose. *Does NOT belong:* folder index notes that list content (→ MOCs in 01-MOCs); regular notes that mention a folder in passing.

# All About Notes

```dataview
TABLE
FROM ""
WHERE contains(file.name, "+About") AND  file.name != this.file.name
```

> [!INFO]- Bases view click here
> 
> ```base
> filters:
>   and:
>     - file.name.contains("+About")
> views:
>   - type: table
>     name: Table
> 
> ```
> 

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
