---
up: "[[🏡Home]]"
title: "02-Knowledge"
type: moc
fileClass: moc
tags: 
  - 🗺️MOC
status: 🔄active
maturity: 🌱seedling
created: "2025-09-10"
modified: "2026-07-27"
related: 
  - "[[+About Knowledgeℹ️]]"
  - "[[Areas]]"
  - "[[04-Sources]]"
cssclasses: 
  - "wide-page"
obsidianUIMode: preview
quality_reviewed: "2026-07-08"
---

> [!orbit] Wayfinder | [[+About Knowledgeℹ️]] | [[Maps]] | [[Areas]] | [[Atomics]] | [[People]] | [[Places]] | [[Tools]] | [[X]]

[[Templates/Static/atomic|👉Click here for template👈]]

## Button Menu
```button
name New Area
type command
action QuickAdd: Area
```
```button
name New Atomic
type command
action QuickAdd: Atomic 
```
```button
name New Person
type command
action QuickAdd: Person
```
```button
name New Place
type command
action QuickAdd: Place
```
```button
name New Tool
type command
action QuickAdd: Tool
```

![[_Knowledge_Data.base]]

## 🆕 Recent Dots (30 days)
```dataview
TABLE created, maturity
FROM "02-Knowledge"
WHERE created >= date(today) - dur(30 days)
SORT created DESC
```

## 🌱 Maturity distribution
```dataview
TABLE length(rows) AS count
FROM "02-Knowledge"
WHERE type = "atomic"
GROUP BY maturity
SORT count DESC
```

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
