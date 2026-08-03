---
title: Query Template - Health Status
type: template
tags:
  - 📋template
  - 🔍query
created: 2026-02-05
modified: 2026-02-05
---

# Query Template: System Health Status

## Purpose
Calculate and display vault health metrics with weighted scoring.

## Metrics Tracked
1. **Inbox Items** (25 pts) - Target: ≤20
2. **Active Projects** (25 pts) - Target: 1-7
3. **Stale Projects** (25 pts) - Target: 0
4. **Orphan Notes** (25 pts) - Target: <20% of total

---

## DataviewJS Health Score

```dataviewjs
/**
 * QUERY: System Health Score
 * PURPOSE: Calculate overall vault health (0-100)
 * DEPENDS ON: +Inbox, 03-Efforts (status, file.mtime), related, file.inlinks
 */
try {
  const today = dv.date('today');
  const pages = dv.pages().where(p => !p.file.path.includes("99-System"));

  // Helper: Check if status is active
  const isActive = (status) => status === "🔄active";

  // Metrics
  const metrics = {
    inbox: dv.pages('"+Inbox"')?.length ?? 0,
    activeProjects: dv.pages('"03-Efforts"').where(p => isActive(p.status)).length ?? 0,
    staleProjects: dv.pages('"03-Efforts"').where(p => {
      if (!isActive(p.status)) return false;
      const daysDiff = today.diff(p.file.mtime, 'days');
      return daysDiff && daysDiff.days > 14;
    }).length ?? 0,
    orphanNotes: pages.where(p =>
      (!p.related || p.related.length === 0) &&
      (!p.file.inlinks || p.file.inlinks.length === 0)
    ).length ?? 0,
    totalNotes: pages?.length ?? 0
  };

  // Scoring
  const score = (
    (metrics.inbox <= 20 ? 25 : metrics.inbox <= 40 ? 15 : 5) +
    (metrics.activeProjects >= 1 && metrics.activeProjects <= 7 ? 25 : 15) +
    (metrics.staleProjects === 0 ? 25 : metrics.staleProjects <= 2 ? 20 : 10) +
    (metrics.totalNotes > 0 && metrics.orphanNotes <= metrics.totalNotes * 0.2 ? 25 : 15)
  );

  const grade = score >= 80 ? "🟢 Excellent" : score >= 60 ? "🟡 Good" : "🔴 Needs Attention";

  dv.paragraph(`**📊 Health: ${score}/100 - ${grade}**`);
  dv.paragraph(`📥 Inbox: ${metrics.inbox} | 🚀 Projects: ${metrics.activeProjects} | ⏰ Stale: ${metrics.staleProjects} | 🏝️ Orphans: ${metrics.orphanNotes}`);
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## Compact Health Badge

```dataviewjs
try {
  const inbox = dv.pages('"+Inbox"')?.length ?? 0;
  const status = inbox <= 20 ? "🟢" : inbox <= 40 ? "🟡" : "🔴";
  dv.span(`${status} Inbox: ${inbox}`);
} catch (e) {
  dv.span("⚠️");
}
```

---

## Full Health Table

```dataviewjs
try {
  const today = dv.date('today');
  const isActive = (s) => s === "🔄active" || s === "active";

  const m = {
    inbox: dv.pages('"+Inbox"')?.length ?? 0,
    projects: dv.pages('"03-Efforts"').where(p => isActive(p.status)).length ?? 0,
    stale: dv.pages('"03-Efforts"').where(p => isActive(p.status) && today.diff(p.file.mtime, 'days')?.days > 14).length ?? 0
  };

  dv.table(
    ["Metric", "Value", "Status", "Target"],
    [
      ["📥 Inbox", m.inbox, m.inbox <= 20 ? "✅" : "⚠️", "≤20"],
      ["🚀 Active", m.projects, m.projects >= 1 && m.projects <= 7 ? "✅" : "⚠️", "1-7"],
      ["⏰ Stale", m.stale, m.stale === 0 ? "✅" : "⚠️", "0"]
    ]
  );
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## Notes
- Health score uses weighted components (4 × 25 = 100 max)
- Stale threshold: 14 days without modification
- Orphan threshold: 20% of total notes
- Always wrap in try-catch for graceful error handling
