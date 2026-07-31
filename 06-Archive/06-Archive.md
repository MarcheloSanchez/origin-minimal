---
title: 06-Archive
modified: 2026-07-27
exclude: "true"
created: 2026-05-02
type: undefined
tags: 
  - 📦archived
up: "[[🏡Home]]"
related:
  - "[[+About Archiveℹ️]]"
  - "[[🏡Home]]"
---



[[+About Archiveℹ️]]

> [!info] 06-Archive is excluded from Obsidian's file index (`userIgnoreFilters`), so Bases views return 0 results here. Use Dataview queries below to browse archived content.

## 🗂️ Recent Archive (30 days)
```dataview
TABLE type, status, modified
FROM "06-Archive"
SORT modified DESC
LIMIT 20
```

## 📦 All Archived — by type
```dataview
TABLE type, maturity
FROM "06-Archive"
SORT type ASC, file.name ASC
```

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
