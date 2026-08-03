<%*
const d = moment(tp.file.title, "YYYY-MM", true);
const ds = d.isValid() ? d : moment();
const monthStr     = ds.format("YYYY-MM");
const prevMonthStr = ds.clone().subtract(1, 'month').format("YYYY-MM");
const nextMonthStr = ds.clone().add(1, 'month').format("YYYY-MM");
const yearStr      = ds.format("YYYY");
const monthYear    = ds.format("MMMM YYYY");
const todayStr     = moment().format("YYYY-MM-DD");
-%>
---
title: "<% monthStr %>"
type: monthly
tags:
  - 📅monthly
created: "<% todayStr %>"
modified: "<% todayStr %>"
---

⬆️:: [[05-Calendar]]
[[05-Calendar/Monthly/<% prevMonthStr %>|⏪ Previous month]] · [[05-Calendar/Yearly/<% yearStr %>|📅 This year]] · [[05-Calendar/Monthly/<% nextMonthStr %>|Next month ⏩]]

# <% monthYear %>

## 🎯 Monthly Goals
*3-5 key outcomes planned*
- [ ]
- [ ]
- [ ]

## 🚀 Project Overview
*Project status and decisions*

### Active portfolio
```dataview
TABLE
priority as "Priority",
completion_percentage + "%" as "Progress",
(date(today) - file.mtime).days as "Days Idle",
next_actions as "Next Action"
FROM "03-Efforts"
WHERE status = "🔄active"
SORT priority DESC, file.mtime ASC
```

### Closed this month
```dataview
TABLE
status,
completion_percentage + "%" as "Progress",
outcome as "Outcome"
FROM "03-Efforts"
WHERE (status = "✅completed" OR status = "📦archived" OR status = "❌cancelled") AND contains(string(modified), "<% monthStr %>")
SORT modified DESC
```

## 🏠 Area Health Check
*Monthly overview of all life domains*

```dataview
TABLE
priority as "Priority",
last_review as "Last Review",
review_frequency as "Frequency"
FROM "02-Knowledge/Areas"
WHERE type = "area"
SORT priority DESC
```


### Notes from Area Review
*Findings from monthly area review*

## 📊 Monthly Metrics
**Completed projects**:
**New knowledge captured**:
**Areas advanced**:
**Overall energy**: ⭐⭐⭐⭐⭐

## 🎉 Wins and Achievements
*What went exceptionally well*

## 🔧 Identified Improvements
*What to adjust or change*

## 💳 Subscription Review
*Renewing this month or needing evaluation*

```dataview
TABLE WITHOUT ID
  file.link AS "Subscription",
  vendor AS "Vendor",
  cost + " " + currency AS "Cost",
  renewal_date AS "Renewal",
  roi_rating AS "ROI ⭐"
FROM "02-Knowledge/Areas/Finance/Subscriptions"
WHERE type = "subscription" AND status = "🔄active"
  AND renewal_date >= date("<% monthStr %>-01")
  AND renewal_date <= date("<% nextMonthStr %>-01")
SORT renewal_date ASC
```

**Subscriptions cancelled this month**:
**Net monthly change**:

## ⚡ Next Month Setup
*Preparation for the upcoming month*
- [ ] Review areas needing attention
- [ ] Plan new projects or adjust existing ones
- [ ] Update priorities based on this month
- [ ] Check [[_Subscriptions Hub]] for upcoming renewals

---
*<% monthYear %> | Status: 🔄active | Next review: <% nextMonthStr %>*
