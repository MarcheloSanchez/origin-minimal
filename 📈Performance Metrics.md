---
up: "[[🏡Home]]"
title: 📈 Performance Metrics Dashboard
type: moc
fileClass: moc
tags: 
  - ⚙️system
  - 📊dashboard
  - 📋review
  - 📶performance
  - 🗺️MOC
status: 🔄active
maturity: 🌱seedling
created: "2025-10-02"
modified: "2026-07-13"
related: 
  - "[[👁️Dashboard]]"
  - "[[Relate]]"
  - "[[Communicate]]"
  - "[[🌱Incubator]]"
  - "[[🧹Cleaning Lady]]"
  - "[[➕Add]]"
  - "[[Tags - Status Check]]"
cssclasses: 
  - "wide-page"
obsidianUIMode: preview
quality_reviewed: "2026-06-16"
---

> [!orbit] Wayfinder | [[Tags - Status Check]] | [[📈Vault Analytics]]

# 📈 Performance Metrics Dashboard

*Deep dive into your PKM system performance and evolution*
> [!abstract]- What can be found here
>    - Growth trends and creation timeline
>    - Connection analytics and hub identification  
>    - Content quality and maturity tracking
>    - Project performance and completion rates
>    - Learning metrics and source processing
>    - Weekly performance scoring
>    - AI-powered system health recommendations
---

## 📊 System Overview

```dataviewjs
// Core system metrics
const pages = dv.pages().where(p => !p.file.path.includes("99-System"));
const today = dv.date('today');

// File counts by type
const inbox = dv.pages('"+Inbox"').length;
const atomics = dv.pages('"02-Knowledge/Atomics"').length;
const efforts = dv.pages('"03-Efforts"').length;
const sources = dv.pages('"04-Sources"').length;
const mocs = dv.pages('"01-MOCs"').length;
const dailies = dv.pages('"05-Calendar/Daily"').length;
const archived = dv.pages('"06-Archive"').length;

// Total content notes (excluding system)
const totalContent = atomics + efforts + sources + mocs;
const totalNotes = pages.length;

dv.table(["Metric", "Count", "Percentage", "Trend"], [
  ["📥 Inbox Items", inbox, Math.round((inbox/totalNotes)*100) + "%", inbox <= 20 ? "🟢" : "🔴"],
  ["💡 Atomic Notes", atomics, Math.round((atomics/totalContent)*100) + "%", "📈"],
  ["🚀 Active Efforts", efforts, Math.round((efforts/totalContent)*100) + "%", "📊"],
  ["📚 Sources", sources, Math.round((sources/totalContent)*100) + "%", "📖"],
  ["🗺️ MOCs", mocs, Math.round((mocs/totalContent)*100) + "%", "🧭"],
  ["📝 Daily Notes", dailies, Math.round((dailies/totalNotes)*100) + "%", "📅"],
  ["📦 Archived", archived, Math.round((archived/totalNotes)*100) + "%", "🗄️"],
  ["📄 **Total Notes**", totalNotes, "100%", "📊"]
]);
```

---

## 📈 Growth Trends

### 📅 Creation Timeline (Last 30 Days)

```dataviewjs
// Creation timeline for last 30 days
const today = dv.date('today');
const thirtyDaysAgo = today.minus({days: 30});

const recentNotes = dv.pages()
  .where(p => p.file.ctime >= thirtyDaysAgo && !p.file.path.includes("99-System"))
  .sort(p => p.file.ctime, 'desc');

// Group by date
const dateGroups = {};
for (let note of recentNotes) {
  const date = note.file.ctime.toFormat('yyyy-MM-dd');
  if (!dateGroups[date]) dateGroups[date] = 0;
  dateGroups[date]++;
}

const chartData = Object.entries(dateGroups)
  .sort(([a], [b]) => a.localeCompare(b))
  .slice(-14); // Last 14 days

dv.table(["Date", "Notes Created", "Type Breakdown"], 
  chartData.map(([date, count]) => {
    const dayNotes = recentNotes.where(p => p.file.ctime.toFormat('yyyy-MM-dd') === date);
    const types = {};
    for (let note of dayNotes) {
      const type = note.type || 'other';
      types[type] = (types[type] || 0) + 1;
    }
    const breakdown = Object.entries(types).map(([t, c]) => `${t}:${c}`).join(', ');
    return [date, count, breakdown];
  })
);

// Summary stats
const totalRecent = recentNotes.length;
const avgPerDay = Math.round((totalRecent / 30) * 10) / 10;
const mostProductiveDay = chartData.reduce((max, [date, count]) => count > max.count ? {date, count} : max, {date: '', count: 0});

dv.paragraph(`
**📊 30-Day Summary:**
- **Total Created**: ${totalRecent} notes
- **Average/Day**: ${avgPerDay} notes  
- **Most Productive**: ${mostProductiveDay.date} (${mostProductiveDay.count} notes)
- **Trend**: ${avgPerDay >= 1 ? '📈 Growing' : '📊 Stable'}
`);
```
## 📊 Click for specific notes 

> [!info]- Captured from past Week
> 
> ```dataview
> table file.name as "Note", file.ctime as "Created"
> from ""
> where file.ctime >= date(today) - dur(7 days)
> ```

> [!info]- Captured Today
> 
> ```dataview
> table file.name as "Poznámka", file.ctime as "Vytvořeno"
> from ""
> where file.ctime >= date(today)
> ```

---

## 🔗 Connection Analytics

```dataviewjs
// Connection analysis
const allPages = dv.pages().where(p => !p.file.path.includes("99-System"));
const today = dv.date('today');

// Calculate connection metrics
let totalConnections = 0;
let connectedPages = 0;
let orphanPages = 0;
let hubPages = [];

for (let page of allPages) {
  const connections = (page.related?.length || 0) + (page.file.inlinks?.length || 0);
  totalConnections += connections;
  
  if (connections > 0) {
    connectedPages++;
    if (connections >= 5) {
      hubPages.push({name: page.file.name, connections: connections});
    }
  } else {
    orphanPages++;
  }
}

hubPages = hubPages.sort((a, b) => b.connections - a.connections).slice(0, 10);
const connectionDensity = Math.round((connectedPages / allPages.length) * 100);
const avgConnections = Math.round((totalConnections / allPages.length) * 10) / 10;

dv.paragraph(`
### 🔗 Connection Health
- **Connected Notes**: ${connectedPages} / ${allPages.length} (${connectionDensity}%)
- **Orphan Notes**: ${orphanPages} notes need connections
- **Average Connections**: ${avgConnections} per note
- **Network Health**: ${connectionDensity >= 70 ? '🟢 Well Connected' : connectionDensity >= 40 ? '🟡 Moderate' : '🔴 Fragmented'}
`);

// Hub pages table
if (hubPages.length > 0) {
  dv.header(4, "🌟 Knowledge Hubs (5+ connections)");
  dv.table(["Note", "Connections", "Last Updated"],
    hubPages.map(hub => {
      const page = allPages.where(p => p.file.name === hub.name)[0];
      return [
        `[[${page.file.link}|${hub.name}]]`,
        hub.connections,
        page.file.mtime?.toFormat('yyyy-MM-dd') || 'Unknown'
      ];
    })
  );
}
```

---

## 📝 Content Quality Metrics

### 🎯 Note Maturity Distribution

```dataviewjs
// Maturity analysis for atomic notes
const atomics = dv.pages('"02-Knowledge/Atomics"');
const maturityCounts = {
  '📤seed': 0,
  '🌱seedling': 0, 
  '🪴sapling': 0,
  '🌲evergreen': 0,
  '🍓fruit': 0,
  'undefined': 0
};

for (let note of atomics) {
  const maturity = note.maturity || 'undefined';
  maturityCounts[maturity] = (maturityCounts[maturity] || 0) + 1;
}

dv.table(["Maturity Stage", "Count", "Percentage", "Description"],
  Object.entries(maturityCounts).map(([stage, count]) => [
    stage.charAt(0).toUpperCase() + stage.slice(1),
    count,
    Math.round((count / atomics.length) * 100) + "%",
    {
      '📤seed': "🌱 Basic capture",
      '🌱seedling': "🌿 Some development", 
      '🪴sapling': "🪴 Well-structured",
      '🌲evergreen': "🌲 Stable & mature",
      '🍓fruit': "🍓 Ready to share",
      'undefined': "❓ Needs classification"
    }[stage]
  ])
);

const matureNotes = maturityCounts['🪴sapling'] + maturityCounts['🌲evergreen'] + maturityCounts['🍓fruit'];
const maturityRate = Math.round((matureNotes / atomics.length) * 100);

dv.paragraph(`
**🎯 Content Maturity Health**: ${maturityRate}% of notes are well-developed
${maturityRate >= 60 ? '🟢 High quality content base' : maturityRate >= 30 ? '🟡 Moderate development' : '🔴 Many notes need development'}
`);
```

---

## 🚀 Project Performance

### 📊 Effort Completion Analytics

```dataviewjs
// Effort completion analysis
const efforts = dv.pages('"03-Efforts"');
const statusCounts = {};
const completionDistribution = {};

for (let effort of efforts) {
  // Count by status
  const status = effort.status || 'undefined';
  statusCounts[status] = (statusCounts[status] || 0) + 1;
  
  // Group by completion percentage
  const completion = effort.completion || 0;
  const bracket = completion >= 90 ? '90-100%' :
                 completion >= 70 ? '70-89%' :
                 completion >= 50 ? '50-69%' :
                 completion >= 25 ? '25-49%' :
                 completion >= 1 ? '1-24%' : '0%';
  completionDistribution[bracket] = (completionDistribution[bracket] || 0) + 1;
}

// Status breakdown
dv.header(4, "📈 Project Status Distribution");
dv.table(["Status", "Count", "Percentage"],
  Object.entries(statusCounts).map(([status, count]) => [
    status.charAt(0).toUpperCase() + status.slice(1),
    count,
    Math.round((count / efforts.length) * 100) + "%"
  ])
);

// Completion distribution
dv.header(4, "🎯 Completion Distribution");
dv.table(["Completion Range", "Projects", "Percentage"],
  Object.entries(completionDistribution)
    .sort(([a], [b]) => {
      const order = ['90-100%', '70-89%', '50-69%', '25-49%', '1-24%', '0%'];
      return order.indexOf(a) - order.indexOf(b);
    })
    .map(([range, count]) => [
      range,
      count,
      Math.round((count / efforts.length) * 100) + "%"
    ])
);

// Calculate productivity metrics
const completedEfforts = efforts.where(p => p.status === '✅completed').length;
const activeEfforts = efforts.where(p => p.status === '🔄active').length;
const completionRate = efforts.length > 0 ? Math.round((completedEfforts / efforts.length) * 100) : 0;

dv.paragraph(`
**🚀 Project Performance Summary:**
- **Completion Rate**: ${completionRate}% of all projects completed
- **Active Projects**: ${activeEfforts} in progress
- **Productivity Health**: ${completionRate >= 40 ? '🟢 High completion rate' : completionRate >= 20 ? '🟡 Moderate' : '🔴 Low completion rate'}
`);
```

---

## 📚 Learning Metrics

### 📖 Source Processing Efficiency

```dataviewjs
// Source processing analysis
const sources = dv.pages('"04-Sources"');
const today = dv.date('today');

// Processing speed (created to first update)
const processedSources = sources.where(s => s.status === '🔄active' && s.file.mtime > s.file.ctime);
const processingTimes = [];

for (let source of processedSources) {
  const processingTime = source.file.mtime.diff(source.file.ctime, 'days').days;
  if (processingTime >= 0) {
    processingTimes.push(processingTime);
  }
}

const avgProcessingTime = processingTimes.length > 0 ? 
  Math.round((processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length) * 10) / 10 : 0;

// Source types
const sourceTypes = {};
for (let source of sources) {
  const type = source['source-type'] || 'undefined';
  sourceTypes[type] = (sourceTypes[type] || 0) + 1;
}

// Ratings distribution
const ratings = {};
for (let source of sources) {
  const rating = source.rating || 'unrated';
  ratings[rating] = (ratings[rating] || 0) + 1;
}

dv.paragraph(`
### 📊 Source Processing Metrics
- **Total Sources**: ${sources.length}
- **Processed Sources**: ${processedSources.length}
- **Average Processing Time**: ${avgProcessingTime} days
- **Processing Efficiency**: ${avgProcessingTime <= 7 ? '🟢 Fast' : avgProcessingTime <= 14 ? '🟡 Moderate' : '🔴 Slow'}
`);

// Source types breakdown
dv.header(4, "📚 Source Types");
dv.table(["Type", "Count", "Percentage"],
  Object.entries(sourceTypes)
    .sort(([,a], [,b]) => b - a)
    .map(([type, count]) => [
      type.charAt(0).toUpperCase() + type.slice(1),
      count,
      Math.round((count / sources.length) * 100) + "%"
    ])
);
```

---

## 🎯 Weekly Performance Summary

```dataviewjs
// Weekly summary
const today = dv.date('today');
const weekStart = today.minus({days: today.weekday});

const weeklyStats = {
  captured: dv.pages('"+Inbox"').where(p => p.file.ctime >= weekStart).length,
  processed: dv.pages().where(p => 
    p.status === "🔄active" && 
    p.file.mtime >= weekStart && 
    !p.file.path.includes("+Inbox") &&
    !p.file.path.includes("99-System")
  ).length,
  connected: dv.pages().where(p => 
    p.file.mtime >= weekStart && 
    p.related && 
    p.related.length > 0
  ).length,
  completed: dv.pages('"03-Efforts"').where(p => 
    p.status === "✅completed" && 
    p.file.mtime >= weekStart
  ).length
};

const weeklyScore = (
  (weeklyStats.captured > 5 ? 25 : weeklyStats.captured * 5) +
  (weeklyStats.processed > 3 ? 25 : weeklyStats.processed * 8) +
  (weeklyStats.connected > 2 ? 25 : weeklyStats.connected * 12) +
  (weeklyStats.completed > 0 ? 25 : 0)
) / 4;

dv.paragraph(`
## 🏆 This Week's Performance Score: ${Math.round(weeklyScore)}/100

| Metric | This Week | Target | Score |
|--------|-----------|---------|-------|
| 📥 **Captured** | ${weeklyStats.captured} | 5+ | ${weeklyStats.captured >= 5 ? '🟢' : '🟡'} |
| 🔄 **Processed** | ${weeklyStats.processed} | 3+ | ${weeklyStats.processed >= 3 ? '🟢' : '🟡'} |
| 🔗 **Connected** | ${weeklyStats.connected} | 2+ | ${weeklyStats.connected >= 2 ? '🟢' : '🟡'} |
| ✅ **Completed** | ${weeklyStats.completed} | 1+ | ${weeklyStats.completed >= 1 ? '🟢' : '🟡'} |

**Performance Grade**: ${weeklyScore >= 80 ? '🏆 Excellent' : weeklyScore >= 60 ? '🥈 Good' : weeklyScore >= 40 ? '🥉 Fair' : '📈 Needs Improvement'}
`);
```

---

## 🔧 System Health Recommendations

```dataviewjs
// Generate recommendations based on metrics
const recommendations = [];
const pages = dv.pages().where(p => !p.file.path.includes("99-System"));
const inbox = dv.pages('"+Inbox"').length;
const orphans = pages.where(p => !p.related || p.related.length === 0).length;
const staleEfforts = dv.pages('"03-Efforts"').where(p => 
  p.status === "🔄active" && 
  dv.date('today').diff(p.file.mtime, 'days').days > 14
).length;

if (inbox > 20) {
  recommendations.push("🚨 **Inbox Overflow**: " + inbox + " items need processing. Schedule a dedicated processing session.");
}

if (orphans > pages.length * 0.3) {
  recommendations.push("🔗 **Low Connection Density**: " + orphans + " orphan notes. Add 2-3 connections per note during weekly review.");
}

if (staleEfforts > 0) {
  recommendations.push("⏰ **Stale Projects**: " + staleEfforts + " active projects haven't been updated in 14+ days. Review and update status.");
}

const atomics = dv.pages('"02-Knowledge/Atomics"');
const immatureAtomics = atomics.where(a => !a.maturity || a.maturity === '📤seed').length;
if (immatureAtomics > atomics.length * 0.5) {
  recommendations.push("🌱 **Content Development**: " + immatureAtomics + " atomic notes are still in 'seed' stage. Develop key insights further.");
}

const recentSources = dv.pages('"04-Sources"').where(s => 
  dv.date('today').diff(s.file.ctime, 'days').days <= 7
).length;
if (recentSources === 0) {
  recommendations.push("📚 **Learning Stagnation**: No new sources this week. Consider adding new learning materials.");
}

if (recommendations.length === 0) {
  recommendations.push("🎉 **System Healthy**: All metrics look good! Keep up the excellent work.");
}

dv.list(recommendations);
```

```dataviewjs
// Find orphaned notes (no connections)
const pages = dv.pages().where(p => !p.file.path.includes("99-System"));
const orphans = pages.where(p => 
  (!p.related || p.related.length === 0) && 
  (!p.file.inlinks || p.file.inlinks.length === 0) &&
  (!p.file.outlinks || p.file.outlinks.length === 0)
).slice(0, 10);

if (orphans.length > 0) {
  dv.header(4, "🏝️ Orphaned Notes (Need Connections)");
  dv.table(["Note", "Type", "Created"], 
    orphans.map(p => [
      p.file.link,
      p.type || "undefined",
      p.file.ctime?.toFormat('yyyy-MM-dd') || "unknown"
    ])
  );
}
```
---

*Historical: the Performance Optimization Changelog (Jan 2026) was moved to `06-Archive/Reference/Performance Optimization Changelog 2026-01.md` (plain path — Archive is not indexed).*

⬆️ [[🏡Home]]  *| `= this.file.mtime`*