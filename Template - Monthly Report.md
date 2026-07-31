---
title: "Monthly Report - <% tp.date.now("MMMM YYYY") %>"
type: moc
status: 🔄active
created: <% tp.date.now("YYYY-MM-DD") %>
month: <% tp.date.now("YYYY-MM") %>
year: <% tp.date.now("YYYY") %>
tags:
  - 📊report
  - 📅monthly
  - 📋review
period_start: <% tp.date.now("YYYY-MM-01") %>
period_end: <% tp.date.now("YYYY-MM-DD") %>
---

⬆️:: [[05-Calendar]]

# Monthly Report - <% tp.date.now("MMMM YYYY") %>

> **Period**: <% tp.date.now("MMMM 1, YYYY", 0, "YYYY-MM-01") %> → <% tp.date.now("MMMM D, YYYY") %>
> **Generated**: <% tp.date.now("YYYY-MM-DD HH:mm") %>

---

## 📊 Executive Summary

### Key Metrics

| Metric | Count | Trend |
|--------|-------|-------|
| **Notes Created** | `$= dv.pages().where(p => p.created >= dv.date("<% tp.date.now("YYYY-MM-01") %>") && p.created <= dv.date("<% tp.date.now("YYYY-MM-DD") %>")).length` | - |
| **Tasks Completed** | `$= dv.pages().file.tasks.where(t => t.completed && t.completion >= dv.date("<% tp.date.now("YYYY-MM-01") %>")).length` | - |
| **Projects Completed** | `$= dv.pages('"03-Efforts"').where(p => p.status == "✅completed" && p.file.mtime >= dv.date("<% tp.date.now("YYYY-MM-01") %>")).length` | - |
| **Active Projects** | `$= dv.pages('"03-Efforts"').where(p => p.status == "🔄active" || p.status == "🔥on").length` | - |

---

## 📝 Content Creation

### Notes by Type

```dataview
TABLE
  length(rows) as "This Month",
  round(length(rows) / <% tp.date.now("D") %>, 1) as "Per Day"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-01") %>)
  AND created <= date(<% tp.date.now("YYYY-MM-DD") %>)
GROUP BY type
SORT length(rows) DESC
```

### Daily Creation Pattern

```dataview
TABLE
  length(rows) as "Notes Created"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-01") %>)
  AND created <= date(<% tp.date.now("YYYY-MM-DD") %>)
GROUP BY created
SORT created DESC
```

### Top 20 Notes Created

```dataview
TABLE
  type as "Type",
  status as "Status",
  created as "Created",
  maturity as "Maturity"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-01") %>)
  AND created <= date(<% tp.date.now("YYYY-MM-DD") %>)
SORT created DESC
LIMIT 20
```

---

## ✅ Task & Project Completion

### Tasks Completed This Month

```dataview
TASK
FROM ""
WHERE completed
  AND completion >= date(<% tp.date.now("YYYY-MM-01") %>)
  AND completion <= date(<% tp.date.now("YYYY-MM-DD") %>)
GROUP BY file.link
SORT completion DESC
```

### Projects Completed

```dataview
TABLE
  priority as "Priority",
  file.mtime as "Completed Date"
FROM "03-Efforts"
WHERE status = "✅completed"
  AND file.mtime >= date(<% tp.date.now("YYYY-MM-01") %>)
SORT file.mtime DESC
```

### Projects Moved to Archive

```dataview
TABLE
  status as "Final Status",
  file.mtime as "Archived Date"
FROM "06-Archive"
WHERE file.mtime >= date(<% tp.date.now("YYYY-MM-01") %>)
SORT file.mtime DESC
LIMIT 10
```

---

## 🚀 Active Work

### In-Progress Projects

```dataview
TABLE
  status as "Status",
  priority as "Priority",
  file.mtime as "Last Updated",
  round((date(now) - file.mtime).days, 0) + "d ago" as "Last Touch"
FROM "03-Efforts"
WHERE status = "🔄active" OR status = "🔥on"
SORT priority DESC, file.mtime DESC
```

### Blocked/Waiting Items

```dataview
TABLE
  type as "Type",
  file.mtime as "Last Modified",
  round((date(now) - file.mtime).days, 0) + " days" as "Waiting Duration"
FROM ""
WHERE status = "⏳waiting"
SORT file.mtime ASC
```

---

## 💡 Knowledge Development

### Ideas Generated

```dataview
TABLE
  maturity as "Maturity",
  created as "Created"
FROM "02-Knowledge"
WHERE created >= date(<% tp.date.now("YYYY-MM-01") %>)
  AND (contains(tags, "#💡atomic") OR type = "atomic")
SORT created DESC
LIMIT 20
```

### Ideas Evolved (Maturity Progress)

```dataview
TABLE
  maturity as "Current Maturity",
  created as "Created",
  file.mtime as "Last Updated"
FROM "02-Knowledge"
WHERE maturity = "🌲evergreen" OR maturity = "🍓fruit"
SORT file.mtime DESC
LIMIT 10
```

---

## 📚 Learning & Sources

### Sources Added

```dataview
TABLE
  source_url as "Source",
  created as "Added",
  status as "Status"
FROM "04-Sources"
WHERE created >= date(<% tp.date.now("YYYY-MM-01") %>)
SORT created DESC
LIMIT 15
```

### Most Referenced Sources

```dataview
TABLE
  length(file.inlinks) as "References",
  created as "Added"
FROM "04-Sources"
SORT length(file.inlinks) DESC
LIMIT 10
```

---

## 🏷️ Tag Analytics

### Most Used Tags This Month

```dataview
TABLE
  length(rows) as "Usage Count",
  round((length(rows) / <% tp.date.now("D") %>) * 100, 1) + "%" as "Daily Rate"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-01") %>)
FLATTEN file.tags as tag
GROUP BY tag
SORT length(rows) DESC
LIMIT 15
```

### Emerging Tags (New This Month)

```dataview
TABLE
  length(rows) as "Usage"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-01") %>)
FLATTEN file.tags as tag
GROUP BY tag
SORT length(rows) DESC
```

---

## 📈 Growth & Trends

### Vault Growth

```dataview
TABLE
  length(rows) as "Notes",
  round(sum(rows.file.size) / 1024, 1) + " KB" as "Total Size"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-01") %>)
GROUP BY dateformat(created, "yyyy-MM-dd")
SORT created DESC
```

### Status Distribution (All Notes)

```dataview
TABLE
  length(rows) as "Count",
  round((length(rows) / length(list(filter(file.lists, (x) => true)))) * 100, 1) + "%" as "% of Vault"
FROM ""
WHERE status != null
GROUP BY status
SORT length(rows) DESC
```

### Maturity Distribution

```dataview
TABLE
  length(rows) as "Count",
  round((length(rows) / length(list(filter(file.lists, (x) => x.maturity != null)))) * 100, 1) + "%" as "% of Total"
FROM ""
WHERE maturity != null
GROUP BY maturity
SORT maturity ASC
```

---

## 🧹 Vault Health

### Inbox Items (Needs Processing)

```dataview
TABLE
  created as "Created",
  round((date(now) - created).days, 0) + " days old" as "Age"
FROM "+Inbox"
WHERE status = "📥inbox"
SORT created ASC
LIMIT 20
```

### Stale Active Items (>60 days no update)

```dataview
TABLE
  type as "Type",
  file.mtime as "Last Modified",
  round((date(now) - file.mtime).days, 0) + " days ago" as "Stale Duration"
FROM ""
WHERE status = "🔄active"
  AND file.mtime < date(now) - dur(60 days)
SORT file.mtime ASC
LIMIT 15
```

### Missing Critical Metadata

```dataview
TABLE
  created as "Created",
  file.folder as "Location"
FROM ""
WHERE !type OR !status OR !created
SORT created DESC
LIMIT 20
```

---

## 🔗 Connection Analysis

### Most Connected Notes (Hub Notes)

```dataview
TABLE
  length(file.outlinks) as "Outgoing Links",
  length(file.inlinks) as "Incoming Links",
  length(file.outlinks) + length(file.inlinks) as "Total Connections"
FROM ""
SORT (length(file.outlinks) + length(file.inlinks)) DESC
LIMIT 15
```

### Orphan Notes (No Connections)

```dataview
TABLE
  created as "Created",
  type as "Type"
FROM ""
WHERE length(file.outlinks) = 0
  AND length(file.inlinks) = 0
SORT created DESC
LIMIT 10
```

---

## 📅 Weekly Breakdown

### Week-by-Week Activity

```dataview
TABLE
  length(rows) as "Notes Created"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-01") %>)
  AND created <= date(<% tp.date.now("YYYY-MM-DD") %>)
GROUP BY dateformat(created, "yyyy-'W'WW")
SORT created DESC
```

### Links to Weekly Reports

- [[Weekly Report - Week <% tp.date.now("ww", -21) %>, <% tp.date.now("YYYY") %>|Week 1]]
- [[Weekly Report - Week <% tp.date.now("ww", -14) %>, <% tp.date.now("YYYY") %>|Week 2]]
- [[Weekly Report - Week <% tp.date.now("ww", -7) %>, <% tp.date.now("YYYY") %>|Week 3]]
- [[Weekly Report - Week <% tp.date.now("ww", 0) %>, <% tp.date.now("YYYY") %>|Week 4]]

---

## 📝 Monthly Reflection

### Achievements This Month
<!-- Manual entry -->
-

### Challenges Faced
<!-- Manual entry -->
-

### Key Learnings
<!-- Manual entry -->
-

### Patterns Noticed
<!-- Manual entry -->
-

### Next Month Goals
<!-- Manual entry -->
-

---

## 🎯 Action Items for Next Month

### High Priority
- [ ] Process Inbox items (currently: `$= dv.pages('+Inbox').where(p => p.status == "📥inbox").length` items)
- [ ] Review stale active projects
- [ ] Update missing metadata

### Maintenance
- [ ] Archive completed projects
- [ ] Clean up orphan notes
- [ ] Review and refine tags

---

## 🔗 Navigation

- [[Monthly Report - <% tp.date.now("YYYY-MM", -1, "YYYY-MM-01", -1) %>|Previous Month]]
- [[Yearly Report - <% tp.date.now("YYYY") %>|This Year]]
- [[05-Calendar]]

---

*Monthly report generated <% tp.date.now("YYYY-MM-DD HH:mm") %>. All metrics calculated using Dataview queries.*

#📊report #📅monthly #📋review
