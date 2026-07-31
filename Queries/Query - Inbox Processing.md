---
title: Query Template - Inbox Processing
type: template
tags:
  - 📋template
  - 🔍query
created: 2026-02-05
modified: 2026-02-05
---

# Query Template: Inbox Processing

## Purpose
Track and manage inbox items with age indicators for GTD processing workflow.

## GTD Processing Rules
- **2-min rule**: If < 2 min, do immediately
- **48h rule**: All items should be processed within 48 hours
- Sort oldest first to process FIFO

---

## Standard Inbox Table (with Age)

```dataview
TABLE WITHOUT ID
  file.link as "Item",
  file.ctime as "Captured",
  dateformat(date(now) - file.ctime, "d") + " days" as "Age"
FROM "+Inbox"
SORT file.ctime ASC
LIMIT 20
```

---

## Urgent Items (> 48 hours)

```dataview
TABLE WITHOUT ID
  "⚠️ " + file.link as "Urgent Item",
  dateformat(date(now) - file.ctime, "d") + " days old" as "Age"
FROM "+Inbox"
WHERE (date(now) - file.ctime) > dur(2 days)
SORT file.ctime ASC
LIMIT 10
```

---

## Inbox Count Badge

```dataviewjs
try {
  const count = dv.pages('"+Inbox"')?.length ?? 0;
  const status = count <= 10 ? "🟢" : count <= 25 ? "🟡" : "🔴";
  dv.span(`${status} **${count}** items in inbox`);
} catch (e) {
  dv.span("⚠️ Error loading inbox count");
}
```

---

## Processing Priority View

```dataview
TABLE WITHOUT ID
  file.link as "Item",
  processing_priority as "Priority",
  estimated_effort as "Effort",
  file.ctime as "Captured"
FROM "+Inbox"
SORT processing_priority DESC, file.ctime ASC
LIMIT 15
```

---

## Quick Actions Reference

| Action | When to Use |
|--------|-------------|
| **Do** | Takes < 2 minutes |
| **Delegate** | Add `@waiting` + person |
| **Defer** | Move to project or Someday |
| **Delete** | Not relevant anymore |

---

## Notes
- Inbox zero is the goal, but ≤10 items is "healthy"
- Use `processing_priority` field to mark urgent items
- Use `estimated_effort` to batch similar tasks
