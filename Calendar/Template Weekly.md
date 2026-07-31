<%*
const d = moment(tp.file.title, "GGGG-[W]WW", true);
const ds = d.isValid() ? d : moment();
const mon = ds.clone().startOf('isoWeek');
const tue = mon.clone().add(1, 'day');
const wed = mon.clone().add(2, 'day');
const thu = mon.clone().add(3, 'day');
const fri = mon.clone().add(4, 'day');
const sat = mon.clone().add(5, 'day');
const sun = mon.clone().add(6, 'day');
const weekStr     = ds.format("GGGG-[W]WW");
const prevWeekStr = ds.clone().subtract(1, 'week').format("GGGG-[W]WW");
const nextWeekStr = ds.clone().add(1, 'week').format("GGGG-[W]WW");
const monthStr    = mon.format("YYYY-MM");
const weekNum     = ds.format("WW");
const monthYear   = ds.format("MMMM YYYY");
const todayStr    = moment().format("YYYY-MM-DD");
-%>
---
title: "<% weekStr %>"
type: weekly
tags:
  - 📅weekly
created: "<% todayStr %>"
modified: "<% todayStr %>"
---

⬆️:: [[05-Calendar]]
[[05-Calendar/Weekly/<% prevWeekStr %>|⏪ Previous week]] · [[05-Calendar/Monthly/<% monthStr %>|📅 This month]] · [[05-Calendar/Weekly/<% nextWeekStr %>|Next week ⏩]]

# Week <% weekNum %> · <% monthYear %>
*<% mon.format("MMMM DD") %> – <% sun.format("MMMM DD") %>*

## 🎯 Weekly Goals
*3-5 key outcomes for this week*
- [ ]
- [ ]
- [ ]

## 🚀 Project Progress
*Movement signal — stalled projects float to top*

```dataview
TABLE
next_actions as "Next Action",
(date(today) - file.mtime).days as "Days Idle",
completion_percentage + "%" as "Progress"
FROM "03-Efforts"
WHERE status = "🔄active"
SORT file.mtime ASC
```
## 🏠 Area Attention
*Attention distribution across life domains*

| Area | Planned Focus | Actual Outcome |
|------|--------------|----------------|
| [[Health]] | | |
| [[Finance]] | | |
| [[Career]] | | |
| [[Relationships]] | | |
| [[Personal]] | | |

## 📅 Day Links
- [[05-Calendar/Daily/<% mon.format("YYYY-MM-DD") %>|<% mon.format("dddd") %>]]
- [[05-Calendar/Daily/<% tue.format("YYYY-MM-DD") %>|<% tue.format("dddd") %>]]
- [[05-Calendar/Daily/<% wed.format("YYYY-MM-DD") %>|<% wed.format("dddd") %>]]
- [[05-Calendar/Daily/<% thu.format("YYYY-MM-DD") %>|<% thu.format("dddd") %>]]
- [[05-Calendar/Daily/<% fri.format("YYYY-MM-DD") %>|<% fri.format("dddd") %>]]
- [[05-Calendar/Daily/<% sat.format("YYYY-MM-DD") %>|<% sat.format("dddd") %>]]
- [[05-Calendar/Daily/<% sun.format("YYYY-MM-DD") %>|<% sun.format("dddd") %>]]

## 💡 Key Insights
*What worked, what didn't, what to adjust*

## ⚡ Next Week Prep
*Setup for the upcoming week*
- [ ] Review and update active projects
- [ ] Check calendar for conflicts
- [ ] Identify areas needing attention

---
*Week <% weekNum %>, <% ds.format("YYYY") %> | Energy: ⭐⭐⭐⭐⭐ | Focus: ⭐⭐⭐⭐⭐*
