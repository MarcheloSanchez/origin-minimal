---
title: "Weekly Report - Week <% tp.date.now("ww", 0) %>, <% tp.date.now("YYYY") %>"
type: moc
status: 🔄active
created: <% tp.date.now("YYYY-MM-DD") %>
week_number: <% tp.date.now("ww", 0) %>
year: <% tp.date.now("YYYY") %>
tags:
  - 📊report
  - 📅weekly
  - 📋review
period_start: <% tp.date.now("YYYY-MM-DD", -7) %>
period_end: <% tp.date.now("YYYY-MM-DD") %>
---

⬆️:: [[05-Calendar]]

# Weekly Report - Week <% tp.date.now("ww", 0) %>, <% tp.date.now("YYYY") %>

> **Period**: <% tp.date.now("YYYY-MM-DD", -7) %> → <% tp.date.now("YYYY-MM-DD") %>
> **Generated**: <% tp.date.now("YYYY-MM-DD HH:mm") %>

---

## 📊 Week Overview

### Key Metrics

```dataview
TABLE
  length(rows) as "Count"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND created <= date(<% tp.date.now("YYYY-MM-DD") %>)
GROUP BY type
SORT length(rows) DESC
```

**Summary:**
- **Total Notes Created**: `= length(list(filter(file.lists.outlinks, (x) => date(x.created) >= date(<% tp.date.now("YYYY-MM-DD", -7) %>))))`
- **Tasks Completed**: `= length(list(filter(file.tasks, (t) => t.completed AND date(t.completion) >= date(<% tp.date.now("YYYY-MM-DD", -7) %>))))`
- **Active Projects**: `= length(list(filter(file.lists, (p) => p.status = "🔄active" AND p.type = "project")))`

---

## 📝 Notes Created This Week

```dataview
TABLE
  type as "Type",
  status as "Status",
  created as "Created"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND created <= date(<% tp.date.now("YYYY-MM-DD") %>)
SORT created DESC
LIMIT 50
```

---

## ✅ Tasks Completed This Week

```dataview
TASK
FROM ""
WHERE completed
  AND completion >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND completion <= date(<% tp.date.now("YYYY-MM-DD") %>)
GROUP BY file.link
SORT completion DESC
```

---

## 🚀 Active Projects Status

```dataview
TABLE
  status as "Status",
  priority as "Priority",
  file.mtime as "Last Modified"
FROM "03-Efforts"
WHERE status = "🔄active" OR status = "🔥on"
SORT priority DESC, file.mtime DESC
```

---

## 💡 New Ideas This Week

```dataview
LIST
FROM "02-Knowledge"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND (contains(tags, "#💡atomic") OR type = "atomic")
SORT created DESC
LIMIT 20
```

---

## 📚 Sources Added This Week

```dataview
TABLE
  source_url as "URL",
  created as "Added"
FROM "04-Sources"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
LIMIT 10
```

---

## 📈 Progress Tracking

### Projects by Status

```dataview
TABLE
  length(rows) as "Count",
  round((length(rows) / length(list(filter(file.lists, (p) => p.type = "project")))) * 100, 1) + "%" as "% of Total"
FROM "03-Efforts"
WHERE type = "project"
GROUP BY status
SORT length(rows) DESC
```

### Notes by Maturity

```dataview
TABLE
  length(rows) as "Count"
FROM ""
WHERE maturity != null
GROUP BY maturity
SORT maturity ASC
```

---

## 🎯 Focus Areas This Week

### Most Active Tags

```dataview
TABLE
  length(rows) as "Usage Count"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
FLATTEN file.tags as tag
GROUP BY tag
SORT length(rows) DESC
LIMIT 10
```

### Most Modified Notes

```dataview
TABLE
  file.mtime as "Last Modified",
  type as "Type"
FROM ""
WHERE file.mtime >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT file.mtime DESC
LIMIT 15
```

---

## 🧹 Maintenance Items

### Notes Missing Metadata

```dataview
TABLE
  created as "Created"
FROM ""
WHERE !type OR !status OR !created
SORT created DESC
LIMIT 10
```

### Stale Active Items (>30 days no update)

```dataview
TABLE
  file.mtime as "Last Modified",
  round((date(now) - file.mtime).days, 0) + " days ago" as "Stale For"
FROM ""
WHERE status = "🔄active"
  AND file.mtime < date(now) - dur(30 days)
SORT file.mtime ASC
LIMIT 10
```

---

## 📝 Weekly Notes

<!-- Add manual observations here -->

### Highlights
-

### Challenges
-

### Learnings
-

### Next Week Focus
-

---

## 🔗 Related

- [[Weekly Report - Week <% tp.date.now("ww", -1) %>, <% tp.date.now("YYYY") %>|Previous Week]]
- [[Monthly Report - <% tp.date.now("YYYY-MM") %>|This Month]]
- [[05-Calendar]]

---

*Report generated using Dataview queries. Data accurate as of <% tp.date.now("YYYY-MM-DD HH:mm") %>.*

#📊report #📅weekly #📋review
