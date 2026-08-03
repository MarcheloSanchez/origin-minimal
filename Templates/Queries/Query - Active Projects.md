---
title: Query Template - Active Projects
type: template
tags:
  - 📋template
  - 🔍query
created: 2026-02-05
modified: 2026-02-05
---

# Query Template: Active Projects

## Purpose
Display active projects with key GTD fields for quick decision-making.

## Parameters
- **Folder**: `"03-Efforts"` (default)
- **Status filter**: `🔄active`
- **Sort**: Priority DESC, Due ASC
- **Limit**: Configurable (default: 10)

---

## Standard Query

```dataview
TABLE WITHOUT ID
  "🚀 " + file.link as "Project",
  status as "Status",
  priority as "Priority",
  choice(completion_percentage, completion_percentage + "%", "0%") as "Progress",
  choice(due, "📅 " + due, "—") as "Due",
  next_actions as "Next Action"
FROM "03-Efforts"
WHERE status = "🔄active"
SORT priority DESC, due ASC
LIMIT 10
```

---

## Compact Variant (5 items)

```dataview
TABLE WITHOUT ID
  file.link as "Project",
  choice(completion_percentage, completion_percentage + "%", "0%") as "Progress",
  choice(due, "📅 " + due, "—") as "Due"
FROM "03-Efforts"
WHERE status = "🔄active"
SORT priority DESC, due ASC
LIMIT 5
```

---

## List Variant

```dataview
LIST
FROM "03-Efforts"
WHERE status = "🔄active"
SORT priority DESC
LIMIT 10
```

---

## Notes
- All status values use emoji-prefixed canonical form (`🔄active`) — enforced by YAML Orchestrator normalize
- The `due` field replaces legacy `deadline` field (auto-renamed by YAML Orchestrator)
