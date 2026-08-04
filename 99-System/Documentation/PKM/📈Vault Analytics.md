---
up: "[[🗺️My PKM MOC]]"
title: Vault Analytics
type: moc
fileClass: moc
tags: 
  - ⚙️system
  - 📊dashboard
  - 📊metrics
status: 🔄active
maturity: 🌱seedling
created: "2026-02-05"
modified: "2026-06-17"
related: 
  - "[[👁️Dashboard]]"
  - "[[🧭Review HQ]]"
  - "[[🔢My PKM Metadata]]"
cssclasses: 
  - "wide-page"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[👁️Dashboard]] | [[🔢My PKM Metadata]]
# 📈 Vault Analytics Dashboard

> [!info]+ **Overview**
> This dashboard provides long-term analytics and insights about your PKM vault's growth, health, and patterns over time.

---

## 📊 Vault Overview

```dataviewjs
/**
 * QUERY: Vault Summary Statistics
 * PURPOSE: High-level counts across all major categories
 * UPDATED: 2026-02-05
 */
try {
  const cache = dv.page("99-System/_Metrics Cache");
  let metrics;
  if (cache?.cache_date) {
    metrics = {
      total: cache.total_notes ?? 0,
      inbox: cache.inbox_count ?? 0,
      mocs: cache.moc_count ?? 0,
      atomics: cache.atomic_count ?? 0,
      efforts: cache.effort_count ?? 0,
      sources: cache.source_count ?? 0,
      calendar: cache.calendar_count ?? 0,
      archive: cache.archive_count ?? 0
    };
  } else {
    metrics = {
      total: dv.pages().where(p => !p.file.path.includes("Templates")).length ?? 0,
      inbox: dv.pages('"+Inbox"').length ?? 0,
      mocs: dv.pages('"01-MOCs"').length ?? 0,
      atomics: dv.pages('"02-Knowledge"').length ?? 0,
      efforts: dv.pages('"03-Efforts"').length ?? 0,
      sources: dv.pages('"04-Sources"').length ?? 0,
      calendar: dv.pages('"05-Calendar"').length ?? 0,
      archive: dv.pages('"06-Archive"').length ?? 0
    };
  }

  dv.paragraph(`
## 📁 Content Distribution

| Category | Count | Percentage |
|----------|-------|------------|
| 📥 **Inbox** | ${metrics.inbox} | ${Math.round(metrics.inbox / metrics.total * 100)}% |
| 🗺️ **MOCs** | ${metrics.mocs} | ${Math.round(metrics.mocs / metrics.total * 100)}% |
| 💡 **Atomics (Dots)** | ${metrics.atomics} | ${Math.round(metrics.atomics / metrics.total * 100)}% |
| 🚀 **Efforts** | ${metrics.efforts} | ${Math.round(metrics.efforts / metrics.total * 100)}% |
| 📚 **Sources** | ${metrics.sources} | ${Math.round(metrics.sources / metrics.total * 100)}% |
| 📅 **Calendar** | ${metrics.calendar} | ${Math.round(metrics.calendar / metrics.total * 100)}% |
| 📦 **Archive** | ${metrics.archive} | ${Math.round(metrics.archive / metrics.total * 100)}% |
| **Total** | **${metrics.total}** | 100% |
`);
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## 📈 Growth Trends

### Notes Created (Last 12 Months)

```dataviewjs
/**
 * QUERY: Monthly Note Creation Trend
 * PURPOSE: Visualize vault growth over the past year
 * UPDATED: 2026-02-05
 */
try {
  const months = [];
  const today = dv.date('today');

  for (let i = 11; i >= 0; i--) {
    const monthStart = today.minus({months: i}).startOf('month');
    const monthEnd = monthStart.endOf('month');
    const count = dv.pages()
      .where(p =>
        !p.file.path.includes("Templates") &&
        p.file.ctime >= monthStart &&
        p.file.ctime <= monthEnd
      ).length ?? 0;

    months.push({
      month: monthStart.toFormat("yyyy-MM"),
      monthShort: monthStart.toFormat("MMM"),
      count: count
    });
  }

  // Create visual bar chart
  const maxCount = Math.max(...months.map(m => m.count), 1);

  dv.paragraph("### Monthly Creation Chart\n");
  months.forEach(m => {
    const barLength = Math.round(m.count / maxCount * 30);
    const bar = '█'.repeat(barLength) + '░'.repeat(30 - barLength);
    dv.paragraph(`**${m.monthShort}**: ${bar} ${m.count}`);
  });

  // Table view
  dv.paragraph("\n### Monthly Data");
  dv.table(
    ["Month", "Notes Created", "vs Previous"],
    months.map((m, i) => {
      const prev = i > 0 ? months[i-1].count : m.count;
      const diff = m.count - prev;
      const trend = diff > 0 ? `📈 +${diff}` : diff < 0 ? `📉 ${diff}` : "➡️ 0";
      return [m.month, m.count, trend];
    })
  );
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## 🔗 Connection Health

```dataviewjs
/**
 * QUERY: Connection Density Analysis
 * PURPOSE: Measure how well-interconnected the vault is
 * UPDATED: 2026-02-05
 */
try {
  const pages = dv.pages().where(p =>
    !p.file.path.includes("99-System") &&
    !p.file.path.includes("Templates")
  );

  const total = pages.length ?? 0;
  const withRelated = pages.where(p => p.related && p.related.length > 0).length ?? 0;
  const withInlinks = pages.where(p => p.file.inlinks && p.file.inlinks.length > 0).length ?? 0;
  const orphans = pages.where(p =>
    (!p.related || p.related.length === 0) &&
    (!p.file.inlinks || p.file.inlinks.length === 0)
  ).length ?? 0;

  // Calculate averages
  let totalOutlinks = 0;
  let totalInlinks = 0;
  pages.forEach(p => {
    totalOutlinks += p.file.outlinks?.length ?? 0;
    totalInlinks += p.file.inlinks?.length ?? 0;
  });

  const avgOutlinks = total > 0 ? (totalOutlinks / total).toFixed(1) : 0;
  const avgInlinks = total > 0 ? (totalInlinks / total).toFixed(1) : 0;

  dv.paragraph(`
### 🔗 Connection Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Total Notes** | ${total} | 📊 |
| **With \`related\` field** | ${withRelated} (${Math.round(withRelated / total * 100)}%) | ${withRelated / total > 0.5 ? '✅' : '⚠️'} |
| **With Backlinks** | ${withInlinks} (${Math.round(withInlinks / total * 100)}%) | ${withInlinks / total > 0.6 ? '✅' : '⚠️'} |
| **Orphan Notes** | ${orphans} (${Math.round(orphans / total * 100)}%) | ${orphans / total < 0.2 ? '✅' : '⚠️'} |
| **Avg Outlinks/Note** | ${avgOutlinks} | ${avgOutlinks >= 3 ? '✅' : '⚠️'} |
| **Avg Inlinks/Note** | ${avgInlinks} | ${avgInlinks >= 2 ? '✅' : '⚠️'} |
`);

  const connectionScore = Math.round(
    (withRelated / total * 30) +
    (withInlinks / total * 30) +
    ((1 - orphans / total) * 40)
  );

  const grade = connectionScore >= 70 ? "🟢 Well Connected" :
               connectionScore >= 40 ? "🟡 Moderate" : "🔴 Needs Work";

  dv.paragraph(`\n**Connection Score: ${connectionScore}/100 - ${grade}**`);
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## 🌱 Knowledge Maturity Pipeline

```dataviewjs
/**
 * QUERY: Maturity Stage Distribution
 * PURPOSE: Track knowledge development across stages
 * UPDATED: 2026-02-05
 */
try {
  const stages = ['📤seed', '🌱seedling', '🪴sapling', '🌲evergreen', '🍓fruit'];
  const pages = dv.pages('"02-Knowledge"').where(p => p.maturity);

  const counts = {};
  stages.forEach(s => {
    counts[s] = pages.where(p => p.maturity === s).length ?? 0;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  dv.paragraph("### 🌱 Maturity Distribution\n");

  // Visual bar chart
  stages.forEach(s => {
    const pct = total > 0 ? Math.round(counts[s] / total * 100) : 0;
    const bar = '█'.repeat(Math.round(pct / 3)) + '░'.repeat(33 - Math.round(pct / 3));
    dv.paragraph(`${s}: ${bar} ${counts[s]} (${pct}%)`);
  });

  // Pipeline health assessment
  const seedRatio = total > 0 ? counts['📤seed'] / total : 0;
  const fruitRatio = total > 0 ? counts['🍓fruit'] / total : 0;

  dv.paragraph(`\n### Pipeline Health`);

  if (seedRatio > 0.5) {
    dv.paragraph(`⚠️ **High seed ratio (${Math.round(seedRatio * 100)}%)** - Focus on developing seeds into seedlings`);
  } else if (fruitRatio < 0.05 && total > 20) {
    dv.paragraph(`💡 **Low fruit ratio (${Math.round(fruitRatio * 100)}%)** - Consider publishing some evergreen content`);
  } else {
    dv.paragraph(`✅ **Healthy pipeline balance**`);
  }
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## 🚀 Effort Analytics

```dataviewjs
/**
 * QUERY: Project/Effort Statistics
 * PURPOSE: Analyze project health and completion patterns
 * UPDATED: 2026-02-05
 */
try {
  const efforts = dv.pages('"03-Efforts"');

  const statusCounts = {
    active: efforts.where(p => p.status === "🔄active").length ?? 0,
    completed: efforts.where(p => p.status === "✅completed").length ?? 0,
    archived: efforts.where(p => p.status === "📦archived").length ?? 0,
    waiting: efforts.where(p => p.status === "⏳waiting").length ?? 0,
    other: 0
  };
  statusCounts.other = efforts.length - statusCounts.active - statusCounts.completed - statusCounts.archived - statusCounts.waiting;

  // Folder distribution
  const activeCount = dv.pages('"03-Efforts/Active"').length ?? 0;
  const pausedCount = dv.pages('"03-Efforts/Paused"').length ?? 0;
  const waitingCount = dv.pages('"03-Efforts/Waiting"').length ?? 0;

  dv.paragraph(`
### 🚀 Effort Status Overview

| Status | Count |
|--------|-------|
| 🔄 Active | ${statusCounts.active} |
| ✅ Completed | ${statusCounts.completed} |
| 📦 Archived | ${statusCounts.archived} |
| ⏳ Waiting | ${statusCounts.waiting} |
| **Total** | **${efforts.length}** |

### 📁 Effort Pipeline

| Pipeline Stage | Count | Purpose |
|---------------|-------|---------|
| 🔄 Active | ${activeCount} | Immediate focus |
| ⏸️ Paused | ${pausedCount} | On hold |
| ⏳ Waiting | ${waitingCount} | Backburner |
`);

  // Calculate completion rate
  const completionRate = (statusCounts.completed + statusCounts.archived) / efforts.length * 100 || 0;
  dv.paragraph(`\n**Completion Rate:** ${Math.round(completionRate)}% of all efforts`);
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## 📅 Activity Patterns

```dataviewjs
/**
 * QUERY: Weekly Activity Pattern
 * PURPOSE: Understand when you're most productive
 * UPDATED: 2026-02-05
 */
try {
  const today = dv.date('today');
  const lastMonth = today.minus({days: 30});

  // Get notes modified in last 30 days
  const recentNotes = dv.pages().where(p =>
    p.file.mtime >= lastMonth &&
    !p.file.path.includes("Templates")
  );

  // Count by day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];

  recentNotes.forEach(p => {
    const day = new Date(p.file.mtime.ts).getDay();
    dayCounts[day]++;
  });

  const maxDay = Math.max(...dayCounts);

  dv.paragraph("### 📆 Activity by Day of Week (Last 30 Days)\n");

  dayNames.forEach((name, i) => {
    const bar = '█'.repeat(Math.round(dayCounts[i] / maxDay * 20)) || '░';
    const padding = '░'.repeat(20 - bar.length);
    dv.paragraph(`**${name.slice(0, 3)}**: ${bar}${padding} ${dayCounts[i]}`);
  });

  const mostActiveDay = dayNames[dayCounts.indexOf(maxDay)];
  dv.paragraph(`\n💡 **Most active day:** ${mostActiveDay}`);
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## 🏆 Content Quality Metrics

```dataviewjs
/**
 * QUERY: Content Quality Analysis
 * PURPOSE: Identify high-value and low-value content
 * UPDATED: 2026-02-05
 */
try {
  const pages = dv.pages().where(p =>
    !p.file.path.includes("99-System") &&
    !p.file.path.includes("Templates")
  );

  // Top connected notes (most inlinks)
  const topConnected = pages
    .sort(p => p.file.inlinks?.length ?? 0, 'desc')
    .slice(0, 5);

  dv.header(4, "🌟 Most Referenced Notes (Top 5)");
  dv.table(
    ["Note", "Inlinks", "Type"],
    topConnected.map(p => [
      p.file.link,
      p.file.inlinks?.length ?? 0,
      p.type ?? "—"
    ])
  );

  // Recently neglected notes (active but old)
  const today = dv.date('today');
  const neglected = pages
    .where(p =>
      p.status === "🔄active" &&
      today.diff(p.file.mtime, 'days')?.days > 60
    )
    .sort(p => p.file.mtime, 'asc')
    .slice(0, 5);

  if (neglected.length > 0) {
    dv.header(4, "⚠️ Neglected Active Notes (>60 days)");
    dv.table(
      ["Note", "Last Modified", "Days Stale"],
      neglected.map(p => [
        p.file.link,
        p.file.mtime.toFormat("yyyy-MM-dd"),
        Math.round(today.diff(p.file.mtime, 'days')?.days ?? 0)
      ])
    );
  }
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## 🎯 Recommendations

```dataviewjs
/**
 * QUERY: Automated Recommendations
 * PURPOSE: Suggest specific actions based on vault state
 * UPDATED: 2026-02-05
 */
try {
  const recommendations = [];

  // Check inbox
  const inboxCount = dv.pages('"+Inbox"').length ?? 0;
  if (inboxCount > 20) {
    recommendations.push({
      priority: "🔴",
      area: "Inbox",
      action: `Process inbox (${inboxCount} items). Target: <20`
    });
  } else if (inboxCount > 10) {
    recommendations.push({
      priority: "🟡",
      area: "Inbox",
      action: `Inbox has ${inboxCount} items. Quick triage recommended.`
    });
  }

  // Check orphans
  const pages = dv.pages().where(p => !p.file.path.includes("99-System") && !p.file.path.includes("Templates"));
  const orphanRatio = pages.where(p =>
    (!p.related || p.related.length === 0) &&
    (!p.file.inlinks || p.file.inlinks.length === 0)
  ).length / pages.length;

  if (orphanRatio > 0.3) {
    recommendations.push({
      priority: "🟡",
      area: "Connections",
      action: `${Math.round(orphanRatio * 100)}% orphan notes. Add links via MOCs.`
    });
  }

  // Check seeds ratio
  const atomics = dv.pages('"02-Knowledge"').where(p => p.maturity);
  const seedRatio = atomics.where(p => p.maturity === '📤seed').length / atomics.length;
  if (seedRatio > 0.5) {
    recommendations.push({
      priority: "🟡",
      area: "Maturity",
      action: `${Math.round(seedRatio * 100)}% notes are seeds. Develop them!`
    });
  }

  // Check stale actives
  const today = dv.date('today');
  const staleActives = dv.pages().where(p =>
    p.status === "🔄active" &&
    today.diff(p.file.mtime, 'days')?.days > 30
  ).length;

  if (staleActives > 5) {
    recommendations.push({
      priority: "🟡",
      area: "Staleness",
      action: `${staleActives} active notes untouched >30 days. Review & update.`
    });
  }

  // Render recommendations
  if (recommendations.length > 0) {
    dv.header(3, "📋 Action Items");
    dv.table(
      ["Priority", "Area", "Recommended Action"],
      recommendations.map(r => [r.priority, r.area, r.action])
    );
  } else {
    dv.paragraph("✅ **Vault is in great shape!** No critical actions needed.");
  }
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## 📊 Quick Reference

| Metric | Healthy Range | Check Frequency |
|--------|--------------|-----------------|
| Inbox Items | ≤20 | Daily |
| Orphan Notes | <20% | Weekly |
| Active Projects | 1-7 | Weekly |
| Seed Notes | <50% of atomics | Monthly |
| Avg Links/Note | >3 | Monthly |

---

*Last updated: `= this.modified`*

*Navigate: [[👁️Dashboard]] | [[🧭Review HQ]] | [[TODO]]*

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
