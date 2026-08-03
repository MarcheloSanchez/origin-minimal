---
title: Query Template - Weekly Stats
type: template
tags:
  - 📋template
  - 🔍query
created: 2026-02-07
modified: 2026-02-07
---

# Query Template: Weekly Stats

## Purpose
Track weekly activity metrics: note creation velocity, task completion rate, and processing throughput.

## Metrics Tracked
1. **Notes Created** - New notes this week
2. **Tasks Completed** - Tasks marked done this week
3. **Tasks Created** - New tasks added this week
4. **Processing Rate** - Completion % (completed / created)

---

## DataviewJS Weekly Stats

```dataviewjs
/**
 * QUERY: Weekly Activity Statistics
 * PURPOSE: Track task completion rate and note creation velocity
 * DEPENDS ON: tasks (completed, completion date, created date), file.ctime
 */
try {
  const today = dv.date('today');
  const weekAgo = today.minus({days: 7});

  const tasksCompleted = dv.pages().file.tasks
    .where(t => {
      if (!t.completed || !t.completion) return false;
      const completionDate = dv.date(t.completion);
      return completionDate && completionDate >= weekAgo;
    })
    .length ?? 0;

  const tasksCreated = dv.pages().file.tasks
    .where(t => {
      if (!t.created) return false;
      const createdDate = dv.date(t.created);
      return createdDate && createdDate >= weekAgo;
    })
    .length ?? 0;

  const notesCreated = dv.pages()
    .where(p => p.file.ctime >= weekAgo)
    .length ?? 0;

  const rate = tasksCreated > 0 ? Math.round(tasksCompleted / tasksCreated * 100) : 0;

  dv.paragraph(`
### This Week
- ✅ **Tasks Completed:** ${tasksCompleted}
- ➕ **Tasks Created:** ${tasksCreated}
- 📝 **Notes Created:** ${notesCreated}
- 📈 **Completion Rate:** ${rate}%
`);
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## Compact Variant (One-liner)

```dataviewjs
try {
  const today = dv.date('today');
  const weekAgo = today.minus({days: 7});
  const notes = dv.pages().where(p => p.file.ctime >= weekAgo).length ?? 0;
  const done = dv.pages().file.tasks.where(t => t.completed && t.completion && dv.date(t.completion) >= weekAgo).length ?? 0;
  dv.span(`📝 ${notes} notes | ✅ ${done} tasks this week`);
} catch (e) {
  dv.span("⚠️");
}
```

---

## Cache-Based Variant

```dataviewjs
/**
 * Read from metrics cache for faster rendering
 * Requires: update-metrics-cache.js to run periodically
 */
try {
  const cache = dv.page("99-System/_Metrics Cache");
  if (cache && cache.cache_date) {
    dv.paragraph(`
### Cached Weekly Stats (as of ${cache.cache_date})
- 📝 **Notes Created:** ${cache.growth_weekly ?? 0}
- 📈 **Processing Rate:** ${cache.processing_rate ?? 0}%
- 📊 **Growth Rate:** ${cache.growth_rate ?? 0}%
`);
  } else {
    dv.paragraph("*Cache not available — run 🔄Update Metrics Cache*");
  }
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## Recent Notes This Week

```dataview
TABLE WITHOUT ID
  file.link as "Recent Notes",
  type as "Type",
  maturity as "Maturity",
  dateformat(file.ctime, "yyyy-MM-dd HH:mm") as "Created"
FROM ""
WHERE file.ctime >= date(today) - dur(7 days)
  AND file.folder != "Templates"
  AND file.folder != "99-System"
SORT file.ctime DESC
LIMIT 10
```

---

## Notes
- Weekly stats are most useful during the Weekly Review
- Use the cache-based variant for dashboard performance
- Completion rate above 80% indicates good throughput
- Processing rate counts notes moved out of inbox vs. captured
