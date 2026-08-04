---
up: "[[🏡Home]]"
in:
  - "[[Views]]"
created: 2025-10-13
related:
cssclasses:
  - wide-page
obsidianUIMode: preview
---


[[+About Templatesℹ️]]

> [!info] Templates folder is excluded from Obsidian's file index (`userIgnoreFilters`). Bases views won't find files here — Dataview queries below are the right tool for browsing templates.

## Recent edited
```dataview
LIST
FROM "Templates"
WHERE file.mtime >= date(today) - dur(14 days)
SORT file.mtime DESC
LIMIT 10
```

## ALL
```dataview
LIST type
FROM "Templates"
SORT file.name ASC
```
⬆️ [[🏡Home]]  *| `= this.file.mtime`*