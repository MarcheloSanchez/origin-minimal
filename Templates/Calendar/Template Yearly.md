<%*
const d = moment(tp.file.title, "YYYY", true);
const ds = d.isValid() ? d : moment();
const yearStr     = ds.format("YYYY");
const prevYearStr = ds.clone().subtract(1, 'year').format("YYYY");
const nextYearStr = ds.clone().add(1, 'year').format("YYYY");
const todayStr    = moment().format("YYYY-MM-DD");
-%>
---
title: "<% yearStr %>"
type: yearly
tags:
  - 📅yearly
created: "<% todayStr %>"
modified: "<% todayStr %>"
---

⬆️:: [[05-Calendar]]
[[05-Calendar/Yearly/<% prevYearStr %>|⏪ <% prevYearStr %>]] · [[05-Calendar/Yearly/<% nextYearStr %>|<% nextYearStr %> ⏩]]

# Year <% yearStr %>

## 📅 Months
<%*
for (let m = 1; m <= 12; m++) {
  const monthStr = ds.clone().month(m - 1).format("YYYY-MM");
  const label = ds.clone().month(m - 1).format("MMMM");
  tR += `[[05-Calendar/Monthly/${monthStr}|${label}]]`;
  tR += m < 12 ? " · " : "\n";
}
-%>

## 🎯 Annual Vision
*Main theme and direction for this year*

## 📊 Annual Area Overview
*Complete assessment of all life domains*

```dataview
TABLE
priority as "Priority",
maturity as "Maturity",
review_frequency as "Frequency"
FROM "02-Knowledge/Areas"
WHERE type = "area"
SORT priority DESC
```


## 🏆 Major Achievements
*Biggest wins and milestones*

## 📚 Lessons Learned
*Key insights and growth*

## 🔮 Plans for Next Year
*Direction and priorities for <% nextYearStr %>*

---
*Year <% yearStr %> | Overall rating: ⭐⭐⭐⭐⭐*
