---
title: "📊 Last 7 Days Activity Report"
type: moc
status: 🔄active
created: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - 📊report
  - 🔍activity
  - 📅7days
period_start: <% tp.date.now("YYYY-MM-DD", -7) %>
period_end: <% tp.date.now("YYYY-MM-DD") %>
---

⬆️:: [[🏡Home]]

# 📊 Last 7 Days Activity Report

> **Period**: <% tp.date.now("MMM DD", -7) %> → <% tp.date.now("MMM DD, YYYY") %>
> **Generated**: <% tp.date.now("YYYY-MM-DD HH:mm") %>

---

## 🎯 Quick Summary

**Activity Overview:**
- **Total New Notes**: `$= dv.pages().where(p => p.created >= dv.date("<% tp.date.now("YYYY-MM-DD", -7) %>") && p.created <= dv.date("<% tp.date.now("YYYY-MM-DD") %>")).length`
- **Total Modified**: `$= dv.pages().where(p => p.file.mtime >= dv.date("<% tp.date.now("YYYY-MM-DD", -7) %>") && p.file.mtime <= dv.date("<% tp.date.now("YYYY-MM-DD") %>")).length`
- **Tasks Completed**: `$= dv.pages().file.tasks.where(t => t.completed && t.completion >= dv.date("<% tp.date.now("YYYY-MM-DD", -7) %>")).length`
- **Files Deleted**: (Manual count if tracking)

**Productivity Score:**
- **Notes/Day**: `$= Math.round(dv.pages().where(p => p.created >= dv.date("<% tp.date.now("YYYY-MM-DD", -7) %>")).length / 7 * 10) / 10`
- **Active Days**: `$= [...new Set(dv.pages().where(p => p.created >= dv.date("<% tp.date.now("YYYY-MM-DD", -7) %>")).map(p => p.created?.toFormat("yyyy-MM-dd")))].length` of 7

---

## 📝 ALL New Notes (Created in Last 7 Days)

```dataview
TABLE
  file.folder as "Location",
  type as "Type",
  status as "Status",
  tags as "Tags",
  created as "Created",
  file.size as "Size (bytes)"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND created <= date(<% tp.date.now("YYYY-MM-DD") %>)
SORT created DESC
```

---

## ✏️ ALL Modified Notes (Updated in Last 7 Days)

### Existing Notes Modified (Not Created This Week)

```dataview
TABLE
  file.folder as "Location",
  type as "Type",
  status as "Status",
  created as "Originally Created",
  file.mtime as "Last Modified"
FROM ""
WHERE file.mtime >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND file.mtime <= date(<% tp.date.now("YYYY-MM-DD") %>)
  AND created < date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT file.mtime DESC
```

---

## 📊 Breakdown by Category

### By Folder

```dataview
TABLE
  length(rows) as "New Notes",
  round(length(rows) / 7, 1) as "Per Day"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
GROUP BY file.folder
SORT length(rows) DESC
```

### By Type

```dataview
TABLE
  length(rows) as "Count",
  round((length(rows) / length(list(filter(file.lists, (x) => date(x.created) >= date(<% tp.date.now("YYYY-MM-DD", -7) %>))))) * 100, 1) + "%" as "% of Total"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
GROUP BY type
SORT length(rows) DESC
```

### By Status

```dataview
TABLE
  length(rows) as "Count"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
GROUP BY status
SORT length(rows) DESC
```

### By Day

```dataview
TABLE
  length(rows) as "Notes Created"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND created <= date(<% tp.date.now("YYYY-MM-DD") %>)
GROUP BY created
SORT created DESC
```

---

## 🏷️ Tags Activity

### New Tags Introduced This Week

```dataview
TABLE
  length(rows) as "Usage Count"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
FLATTEN file.tags as tag
GROUP BY tag
SORT length(rows) DESC
LIMIT 20
```

---

## ✅ Tasks Activity

### Tasks Created This Week

```dataview
TASK
FROM ""
WHERE !completed
  AND created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
GROUP BY file.link
SORT created DESC
```

### Tasks Completed This Week

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

## 🔗 Links & Connections

### Most Connected New Notes (By Outgoing Links)

```dataview
TABLE
  length(file.outlinks) as "Links Out",
  length(file.inlinks) as "Links In",
  created as "Created"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT length(file.outlinks) DESC
LIMIT 10
```

### Notes Referenced Most This Week (By Incoming Links)

```dataview
TABLE
  length(file.inlinks) as "Referenced By",
  created as "Created",
  type as "Type"
FROM ""
SORT length(file.inlinks) DESC
LIMIT 15
```

---

## 📂 Folder-by-Folder Breakdown

### +Inbox Activity

```dataview
TABLE
  type as "Type",
  status as "Status",
  created as "Created"
FROM "+Inbox"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
```

### 99-System/Documentation Activity

```dataview
TABLE
  type as "Type",
  status as "Status",
  created as "Created"
FROM "99-System/Documentation"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
```

### 01-MOCs Activity

```dataview
TABLE
  type as "Type",
  status as "Status",
  created as "Created"
FROM "01-MOCs"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
```

### 02-Knowledge Activity

```dataview
TABLE
  type as "Type",
  maturity as "Maturity",
  status as "Status",
  created as "Created"
FROM "02-Knowledge"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
```

### 03-Efforts Activity

```dataview
TABLE
  type as "Type",
  status as "Status",
  priority as "Priority",
  created as "Created"
FROM "03-Efforts"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
```

### 04-Sources Activity

```dataview
TABLE
  source_url as "URL",
  type as "Type",
  status as "Status",
  created as "Added"
FROM "04-Sources"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
```

### 05-Calendar Activity

```dataview
TABLE
  type as "Type",
  created as "Created"
FROM "05-Calendar"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
```

### 06-Archive Activity

```dataview
TABLE
  type as "Type",
  status as "Status",
  created as "Created"
FROM "06-Archive"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
```

### 99-System Activity

```dataview
TABLE
  type as "Type",
  created as "Created"
FROM "99-System"
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT created DESC
```

---

## 📸 Attachments Added

### Images

```dataview
TABLE
  file.size as "Size",
  file.ctime as "Added"
FROM ""
WHERE contains(file.path, ".png")
   OR contains(file.path, ".jpg")
   OR contains(file.path, ".jpeg")
   OR contains(file.path, ".gif")
   OR contains(file.path, ".svg")
WHERE file.ctime >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT file.ctime DESC
LIMIT 20
```

### PDFs

```dataview
TABLE
  file.size as "Size",
  file.ctime as "Added"
FROM ""
WHERE contains(file.path, ".pdf")
WHERE file.ctime >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT file.ctime DESC
LIMIT 10
```

### Other Attachments

```dataview
TABLE
  file.ext as "Type",
  file.size as "Size",
  file.ctime as "Added"
FROM ""
WHERE file.ext != "md"
  AND file.ctime >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
SORT file.ctime DESC
LIMIT 20
```

---

## 🎨 Metadata Changes

### Notes with Metadata Added/Updated

```dataview
TABLE
  type as "Type",
  status as "Status",
  priority as "Priority",
  maturity as "Maturity",
  file.mtime as "Modified"
FROM ""
WHERE file.mtime >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND (type OR status OR priority OR maturity)
SORT file.mtime DESC
LIMIT 30
```

---

## 🔍 Search Queries

### Notes Mentioning Specific Keywords

**Search for "project":**
```dataview
LIST
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND contains(file.name, "project")
SORT created DESC
```

**Search for "idea":**
```dataview
LIST
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND contains(file.name, "idea")
SORT created DESC
```

*(Customize these search terms for your needs)*

---

## 📈 Growth Metrics

### Vault Size Changes

**Total vault size growth this week:**
```dataview
TABLE
  sum(rows.file.size) as "Total Bytes",
  round(sum(rows.file.size) / 1024, 1) + " KB" as "Total KB",
  round(sum(rows.file.size) / 1048576, 2) + " MB" as "Total MB"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
```

### Note Count by Day

```dataview
TABLE
  length(rows) as "Notes"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
GROUP BY dateformat(created, "yyyy-MM-dd (ccc)")
SORT created DESC
```

---

## 🧹 Data Quality Issues

### New Notes Missing Metadata

```dataview
TABLE
  file.folder as "Location",
  created as "Created"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND (!type OR !status OR !created)
SORT created DESC
```

### New Orphan Notes (No Links In or Out)

```dataview
TABLE
  file.folder as "Location",
  type as "Type",
  created as "Created"
FROM ""
WHERE created >= date(<% tp.date.now("YYYY-MM-DD", -7) %>)
  AND length(file.outlinks) = 0
  AND length(file.inlinks) = 0
SORT created DESC
LIMIT 10
```

---

## 🔥 Activity Heatmap (Text)

### Daily Activity Summary

| Day | Date | Notes Created | Notes Modified | Tasks Done |
|-----|------|---------------|----------------|------------|
| <% tp.date.now("ddd", -6) %> | <% tp.date.now("MMM DD", -6) %> | `$= dv.pages().where(p => p.created?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -6) %>").length` | `$= dv.pages().where(p => p.file.mtime?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -6) %>").length` | `$= dv.pages().file.tasks.where(t => t.completed && t.completion?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -6) %>").length` |
| <% tp.date.now("ddd", -5) %> | <% tp.date.now("MMM DD", -5) %> | `$= dv.pages().where(p => p.created?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -5) %>").length` | `$= dv.pages().where(p => p.file.mtime?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -5) %>").length` | `$= dv.pages().file.tasks.where(t => t.completed && t.completion?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -5) %>").length` |
| <% tp.date.now("ddd", -4) %> | <% tp.date.now("MMM DD", -4) %> | `$= dv.pages().where(p => p.created?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -4) %>").length` | `$= dv.pages().where(p => p.file.mtime?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -4) %>").length` | `$= dv.pages().file.tasks.where(t => t.completed && t.completion?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -4) %>").length` |
| <% tp.date.now("ddd", -3) %> | <% tp.date.now("MMM DD", -3) %> | `$= dv.pages().where(p => p.created?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -3) %>").length` | `$= dv.pages().where(p => p.file.mtime?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -3) %>").length` | `$= dv.pages().file.tasks.where(t => t.completed && t.completion?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -3) %>").length` |
| <% tp.date.now("ddd", -2) %> | <% tp.date.now("MMM DD", -2) %> | `$= dv.pages().where(p => p.created?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -2) %>").length` | `$= dv.pages().where(p => p.file.mtime?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -2) %>").length` | `$= dv.pages().file.tasks.where(t => t.completed && t.completion?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -2) %>").length` |
| <% tp.date.now("ddd", -1) %> | <% tp.date.now("MMM DD", -1) %> | `$= dv.pages().where(p => p.created?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -1) %>").length` | `$= dv.pages().where(p => p.file.mtime?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -1) %>").length` | `$= dv.pages().file.tasks.where(t => t.completed && t.completion?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", -1) %>").length` |
| <% tp.date.now("ddd", 0) %> | <% tp.date.now("MMM DD", 0) %> | `$= dv.pages().where(p => p.created?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", 0) %>").length` | `$= dv.pages().where(p => p.file.mtime?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", 0) %>").length` | `$= dv.pages().file.tasks.where(t => t.completed && t.completion?.toFormat("yyyy-MM-dd") == "<% tp.date.now("YYYY-MM-DD", 0) %>").length` |

---

## 📝 Manual Observations

### What stood out this week?
<!-- Add your observations -->
-

### Any patterns noticed?
<!-- E.g., "Created lots of meeting notes on Tuesday/Thursday" -->
-

### What surprised you?
<!-- E.g., "Didn't realize I was so focused on X topic" -->
-

---

## 🎯 Actions Based on This Data

### To Process
- [ ] Review Inbox items (if many created)
- [ ] Add missing metadata to new notes
- [ ] Connect orphan notes

### To Archive
- [ ] Move completed items to Archive
- [ ] Clean up stale active projects

### To Improve
- [ ] If low activity days → schedule more capture time
- [ ] If many orphan notes → improve linking habit
- [ ] If many missing metadata → use templates more

---

## 🔗 Quick Navigation

- [[🏡Home]]
- [[👁️Dashboard]]
- [[05-Calendar]]
- [[BACKLOG]]

---

*Report generated: <% tp.date.now("YYYY-MM-DD HH:mm") %>*
*Covers: <% tp.date.now("MMM DD", -7) %> - <% tp.date.now("MMM DD, YYYY") %> (7 days)*

#📊report #🔍activity #📅7days
