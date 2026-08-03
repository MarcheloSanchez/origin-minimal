// generate-monthly-report.js — Automated Monthly Report Generator
// Purpose: Creates a structured monthly report by aggregating weekly reports + vault data
// Requires: QuickAdd (UserScript macro)
// Run: Monthly via QuickAdd command or manually
//
// Usage (QuickAdd): Add as UserScript in macro "Generate Monthly Report"
// Output: Creates a new note in 05-Calendar/Monthly/
//
// Data Flow: Aggregates weekly reports from 05-Calendar/Weekly/ for the target month.
// Fallback: If <2 weekly reports exist, queries vault directly for basic metrics.
// Always queries: Area health (02-Knowledge/Areas/) and effort portfolio (03-Efforts/).
//
// Past-period support: On launch, prompts for YYYY-MM (e.g. "2025-06").
//   Leave blank or cancel to generate for the current month.

/**
 * Monthly Report Generator
 *
 * Gathers metrics from weekly reports and vault data:
 * - Aggregated weekly metrics (notes, tasks, efforts)
 * - Area health check (5 life areas)
 * - Effort portfolio status
 * - Maturity pipeline evolution
 * - Monthly highlights
 *
 * Output Location: 05-Calendar/Monthly/Monthly Report YYYY-MM.md
 * Update Frequency: Monthly (recommended 1st of month)
 */

module.exports = async (args) => {
  const { app, Notice } = window;

  try {
    // ============================================
    // PERIOD SELECTION (current or past month)
    // ============================================

    const now = new Date();
    const defaultYear = now.getFullYear();
    const defaultMonth = now.getMonth(); // 0-indexed
    const defaultStr = `${defaultYear}-${String(defaultMonth + 1).padStart(2, '0')}`;

    let periodInput = "";
    try {
      periodInput = await app.plugins.plugins.quickadd.api.inputPrompt(
        "Generate Monthly Report",
        `Enter month (YYYY-MM) or leave blank for current (${defaultStr})`,
        defaultStr
      );
    } catch (e) {
      // User cancelled — use default
      periodInput = "";
    }

    let year, month;
    if (periodInput && periodInput.trim() && periodInput.trim() !== defaultStr) {
      const match = periodInput.trim().match(/^(\d{4})-(\d{2})$/);
      if (!match) {
        new Notice("⚠️ Invalid format. Use YYYY-MM (e.g. 2025-06)");
        return;
      }
      year = parseInt(match[1]);
      month = parseInt(match[2]) - 1; // convert to 0-indexed
      if (month < 0 || month > 11) {
        new Notice("⚠️ Invalid month. Must be 01-12.");
        return;
      }
      new Notice(`📊 Generating monthly report for ${periodInput.trim()}...`);
    } else {
      year = defaultYear;
      month = defaultMonth;
      new Notice("📊 Generating monthly report...");
    }

    // ============================================
    // DATE CALCULATIONS
    // ============================================

    const monthStart = new Date(year, month, 1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(year, month + 1, 0); // last day of month
    monthEnd.setHours(23, 59, 59, 999);

    const formatDate = (d) => d.toISOString().split('T')[0];
    const monthStartStr = formatDate(monthStart);
    const monthEndStr = formatDate(monthEnd);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthStr = String(month + 1).padStart(2, '0');
    const reportTitle = `Monthly Report ${year}-${monthStr}`;

    // ISO week number helper
    const getWeekNumber = (d) => {
      const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dayNum = dt.getUTCDay() || 7;
      dt.setUTCDate(dt.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
      return Math.ceil(((dt - yearStart) / 86400000 + 1) / 7);
    };

    // ============================================
    // FIND & PARSE WEEKLY REPORTS
    // ============================================

    const allFiles = app.vault.getMarkdownFiles();
    const metadataCache = app.metadataCache;
    const getFM = (file) => metadataCache.getFileCache(file)?.frontmatter || {};

    // Find weekly reports that overlap with this month
    const weeklyReportFiles = allFiles.filter(f =>
      f.path.startsWith("05-Calendar/Weekly/") &&
      f.name.startsWith("Weekly Report")
    );

    // Parse week number from filename: "Weekly Report YYYY-WNN.md"
    const weeklyReportsInMonth = [];
    for (const file of weeklyReportFiles) {
      const match = file.name.match(/Weekly Report (\d{4})-W(\d{2})/);
      if (!match) continue;

      const reportYear = parseInt(match[1]);
      const reportWeek = parseInt(match[2]);

      // Check if this week overlaps with the current month
      // Get Monday of that ISO week
      const jan4 = new Date(reportYear, 0, 4);
      const dayOfWeek = jan4.getDay() || 7;
      const weekMonday = new Date(jan4);
      weekMonday.setDate(jan4.getDate() - dayOfWeek + 1 + (reportWeek - 1) * 7);
      const weekSunday = new Date(weekMonday);
      weekSunday.setDate(weekMonday.getDate() + 6);

      // Check overlap: week overlaps month if weekStart <= monthEnd AND weekEnd >= monthStart
      if (weekMonday <= monthEnd && weekSunday >= monthStart) {
        weeklyReportsInMonth.push({ file, weekMonday, weekSunday, reportWeek, reportYear });
      }
    }

    // Sort by week number
    weeklyReportsInMonth.sort((a, b) => a.reportWeek - b.reportWeek);

    // ============================================
    // AGGREGATE WEEKLY REPORT DATA
    // ============================================

    let totalNotesCreated = 0;
    let totalNotesModified = 0;
    let totalTasksCompleted = 0;
    let totalEffortsCompleted = 0;
    let latestActiveEfforts = 0;
    let latestInbox = 0;
    const weeklyHighlights = [];
    const weeklySummaries = [];
    let usedFallback = false;

    if (weeklyReportsInMonth.length >= 2) {
      // Primary path: parse weekly reports
      for (const wr of weeklyReportsInMonth) {
        const content = await app.vault.read(wr.file);

        // Parse metrics table (pipe-delimited for specificity)
        const notesCreatedMatch = content.match(/\|\s*Notes Created\s*\|\s*(\d+)\s*\|/);
        const notesModifiedMatch = content.match(/\|\s*Notes Modified\s*\|\s*(\d+)\s*\|/);
        const tasksCompletedMatch = content.match(/\|\s*Tasks Completed\s*\|\s*(\d+)\s*\|/);
        const effortsCompletedMatch = content.match(/\|\s*Efforts Completed\s*\|\s*(\d+)\s*\|/);
        const activeEffortsMatch = content.match(/\|\s*Active Efforts\s*\|\s*(\d+)\s*\|/);
        const inboxMatch = content.match(/\|\s*Current Inbox\s*\|\s*(\d+)\s*\|/);

        totalNotesCreated += parseInt(notesCreatedMatch?.[1] || '0');
        totalNotesModified += parseInt(notesModifiedMatch?.[1] || '0');
        totalTasksCompleted += parseInt(tasksCompletedMatch?.[1] || '0');
        totalEffortsCompleted += parseInt(effortsCompletedMatch?.[1] || '0');
        latestActiveEfforts = parseInt(activeEffortsMatch?.[1] || '0');
        latestInbox = parseInt(inboxMatch?.[1] || '0');

        // Extract highlights (robust: match until next --- or end of file)
        const highlightsMatch = content.match(/## 🏆 Highlights\n\n([\s\S]*?)(?:\n\n---|$)/);
        if (highlightsMatch) {
          weeklyHighlights.push({
            week: `W${String(wr.reportWeek).padStart(2, '0')}`,
            content: highlightsMatch[1].trim()
          });
        }

        weeklySummaries.push({
          week: `W${String(wr.reportWeek).padStart(2, '0')}`,
          link: `[[${wr.file.basename}]]`,
          notesCreated: parseInt(notesCreatedMatch?.[1] || '0'),
          tasksCompleted: parseInt(tasksCompletedMatch?.[1] || '0')
        });
      }
    } else {
      // Fallback: query vault directly (same pattern as generate-weekly-report.js)
      usedFallback = true;

      const isThisMonth = (timestamp) => {
        return timestamp >= monthStart.getTime() && timestamp <= monthEnd.getTime();
      };

      const notesCreated = allFiles.filter(f =>
        isThisMonth(f.stat.ctime) &&
        !f.path.includes("Templates") &&
        !f.path.includes("99-System")
      );

      const notesModified = allFiles.filter(f =>
        isThisMonth(f.stat.mtime) &&
        !isThisMonth(f.stat.ctime) &&
        !f.path.includes("Templates") &&
        !f.path.includes("99-System")
      );

      const tasksCompleted = allFiles.filter(f => {
        const fm = getFM(f);
        return fm.status === "✅completed" && isThisMonth(f.stat.mtime);
      });

      const efforts = allFiles.filter(f => f.path.startsWith("03-Efforts/"));
      const completedEfforts = efforts.filter(f =>
        getFM(f).status === "✅completed" && isThisMonth(f.stat.mtime)
      );

      totalNotesCreated = notesCreated.length;
      totalNotesModified = notesModified.length;
      totalTasksCompleted = tasksCompleted.length;
      totalEffortsCompleted = completedEfforts.length;
      latestActiveEfforts = efforts.filter(f => getFM(f).status === "🔄active").length;
      latestInbox = allFiles.filter(f => f.path.startsWith("+Inbox/")).length;
    }

    // ============================================
    // AREA HEALTH CHECK (always direct query)
    // ============================================

    const areaDefinitions = [
      { name: "Health", path: "02-Knowledge/Areas/Health.md", folder: "Health" },
      { name: "Finance", path: "02-Knowledge/Areas/Finance.md", folder: "Finance" },
      { name: "Career", path: "02-Knowledge/Areas/Career.md", folder: "Career" },
      { name: "Relationships", path: "02-Knowledge/Areas/Relationships.md", folder: "Relationships" },
      { name: "Personal", path: "02-Knowledge/Areas/Personal.md", folder: "Personal" }
    ];

    const areaHealth = [];
    for (const area of areaDefinitions) {
      // Count notes related to this area (notes that link to the area hub)
      const areaFile = app.vault.getAbstractFileByPath(area.path);
      let relatedCount = 0;
      let recentActivity = 0;

      if (areaFile) {
        const backlinks = app.metadataCache.getBacklinksForFile(areaFile);
        relatedCount = backlinks ? Object.keys(backlinks.data).length : 0;

        // Count notes modified this month that link to this area
        for (const [linkPath] of Object.entries(backlinks?.data || {})) {
          const linkedFile = app.vault.getAbstractFileByPath(linkPath);
          if (linkedFile && linkedFile.stat.mtime >= monthStart.getTime() && linkedFile.stat.mtime <= monthEnd.getTime()) {
            recentActivity++;
          }
        }
      }

      areaHealth.push({
        name: area.name,
        relatedNotes: relatedCount,
        recentActivity: recentActivity,
        status: recentActivity > 3 ? "🟢 Active" : recentActivity > 0 ? "🟡 Some" : "🔴 Neglected"
      });
    }

    // ============================================
    // EFFORT PORTFOLIO (always direct query)
    // ============================================

    const effortFiles = allFiles.filter(f =>
      f.path.startsWith("03-Efforts/") &&
      !f.name.startsWith("+About") &&
      !f.name.startsWith("03-Efforts")
    );

    const effortsByStatus = {
      active: [],
      waiting: [],
      completed: [],
      other: []
    };

    for (const f of effortFiles) {
      const fm = getFM(f);
      const effortInfo = {
        name: fm.title || f.basename,
        status: fm.status || "unknown",
        priority: fm.priority || "—",
        completion: fm.completion_percentage ?? "—",
        due: fm.due || "—"
      };

      if (fm.status === "🔄active") effortsByStatus.active.push(effortInfo);
      else if (fm.status === "⏳waiting") effortsByStatus.waiting.push(effortInfo);
      else if (fm.status === "✅completed") effortsByStatus.completed.push(effortInfo);
      else effortsByStatus.other.push(effortInfo);
    }

    // ============================================
    // MATURITY PIPELINE (current snapshot)
    // ============================================

    const atomics = allFiles.filter(f => f.path.startsWith("02-Knowledge/"));
    const maturityCounts = { '📤seed': 0, '🌱seedling': 0, '🪴sapling': 0, '🌲evergreen': 0, '🍓fruit': 0 };
    atomics.forEach(f => {
      const m = getFM(f).maturity;
      if (m && maturityCounts[m] !== undefined) maturityCounts[m]++;
    });

    // ============================================
    // TOTAL NOTES COUNT
    // ============================================

    const totalNotes = allFiles.filter(f =>
      !f.path.includes("Templates") && !f.path.includes("99-System")
    ).length;

    // ============================================
    // GENERATE REPORT CONTENT
    // ============================================

    const maturityBreakdown = Object.entries(maturityCounts)
      .map(([stage, count]) => `| ${stage} | ${count} |`)
      .join('\n');

    const areaHealthRows = areaHealth
      .map(a => `| ${a.name} | ${a.relatedNotes} | ${a.recentActivity} | ${a.status} |`)
      .join('\n');

    const activeEffortsRows = effortsByStatus.active
      .map(e => `| ${e.name} | ${e.priority} | ${e.completion}% | ${e.due} |`)
      .join('\n');

    const weeklySummaryRows = weeklySummaries.length > 0
      ? weeklySummaries
          .map(w => `| ${w.week} | ${w.link} | ${w.notesCreated} | ${w.tasksCompleted} |`)
          .join('\n')
      : "| — | No weekly reports found | — | — |";

    const highlightsList = weeklyHighlights.length > 0
      ? weeklyHighlights.map(h => `### ${h.week}\n${h.content}`).join('\n\n')
      : "> No weekly highlights available for this month.";

    const partialBadge = usedFallback
      ? `\n> [!warning] Partial Report\n> This report was generated with direct vault queries because fewer than 2 weekly reports were found for this month. For best results, generate weekly reports regularly.\n`
      : "";

    const reportContent = `---
title: "${reportTitle}"
type: monthly
status: 🔄active
created: ${formatDate(now)}
tags:
  - 📊report
  - 📅monthly
related:
  - "[[👁️Dashboard]]"
  - "[[🧭 Review HQ]]"
  - "[[📅 Calendar Review Hub]]"
---

# 📊 ${reportTitle}

> **Period**: ${monthStartStr} to ${monthEndStr} (${monthNames[month]} ${year})
> **Weekly Reports**: ${weeklyReportsInMonth.length} found for this month
${partialBadge}
---

## 📈 Key Metrics

| Metric | This Month | Total |
|--------|-----------|-------|
| Notes Created | ${totalNotesCreated} | ${totalNotes} |
| Notes Modified | ${totalNotesModified} | — |
| Tasks Completed | ${totalTasksCompleted} | — |
| Efforts Completed | ${totalEffortsCompleted} | — |
| Active Efforts | ${latestActiveEfforts} | ${effortFiles.length} |
| Current Inbox | ${latestInbox} | — |

---

## 📅 Weekly Summaries

| Week | Report | Notes Created | Tasks Completed |
|------|--------|--------------|-----------------|
${weeklySummaryRows}

---

## 🏠 Area Health Check

| Area | Related Notes | Activity This Month | Status |
|------|--------------|-------------------|--------|
${areaHealthRows}

---

## 🚀 Effort Portfolio

### Active Efforts (${effortsByStatus.active.length})

| Effort | Priority | Completion | Due |
|--------|----------|-----------|-----|
${activeEffortsRows || "| — | — | — | — |"}

${effortsByStatus.waiting.length > 0 ? `### Waiting (${effortsByStatus.waiting.length})\n${effortsByStatus.waiting.map(e => `- ${e.name} (${e.status})`).join('\n')}` : ""}

${effortsByStatus.completed.length > 0 ? `### Completed This Period (${effortsByStatus.completed.length})\n${effortsByStatus.completed.map(e => `- ✅ ${e.name}`).join('\n')}` : ""}

---

## 🌱 Maturity Pipeline

| Stage | Count |
|-------|-------|
${maturityBreakdown}

---

## 🏆 Monthly Highlights

${highlightsList}

---

## 🏆 Month Summary

> [!success]+ ${monthNames[month]} ${year} Wins
> - ${totalNotesCreated} notes created across the month
> - ${totalTasksCompleted} tasks completed
> - ${totalEffortsCompleted} efforts finished
> - ${weeklyReportsInMonth.length} weekly reviews completed
${totalNotesCreated > 30 ? "> - Strong creation month!" : ""}
${totalTasksCompleted > 15 ? "> - Excellent task throughput!" : ""}

---

## 🎯 Next Month Focus

> [!todo]+ Goals for ${monthNames[(month + 1) % 12]}
> - [ ] Process inbox consistently (target: <10 items)
> - [ ] Complete weekly reviews every week
> - [ ] Review ${effortsByStatus.active.length} active efforts
> - [ ] Improve area attention for neglected areas
> - [ ]

---

## 📊 Trends

\`\`\`dataviewjs
/**
 * QUERY: Monthly Creation Trend (Last 4 Weeks)
 * PURPOSE: Visualize weekly productivity within this month
 */
try {
  const today = dv.date('today');
  const weeks = [];

  for (let i = 3; i >= 0; i--) {
    const wStart = today.minus({weeks: i}).startOf('week');
    const wEnd = wStart.plus({days: 6});
    const count = dv.pages()
      .where(p =>
        !p.file.path.includes("Templates") &&
        !p.file.path.includes("99-System") &&
        p.file.ctime >= wStart &&
        p.file.ctime <= wEnd
      ).length ?? 0;

    weeks.push({
      week: wStart.toFormat("MM-dd"),
      count
    });
  }

  const maxCount = Math.max(...weeks.map(w => w.count), 1);
  dv.paragraph("### 4-Week Creation Trend\\n");
  weeks.forEach(w => {
    const bar = '\u2588'.repeat(Math.round(w.count / maxCount * 25));
    const pad = '\u2591'.repeat(25 - bar.length);
    dv.paragraph(\`**W\${w.week}**: \${bar}\${pad} \${w.count}\`);
  });
} catch (e) {
  dv.paragraph(\`\u26a0\ufe0f Error: \${e.message}\`);
}
\`\`\`

---

*Generated: ${formatDate(now)} by Monthly Report Generator*
*Navigate: [[📅 Calendar Review Hub]] | [[👁️Dashboard]] | [[🧭 Review HQ]]*
`;

    // ============================================
    // WRITE REPORT FILE
    // ============================================

    const folderPath = "05-Calendar/Monthly";
    const folder = app.vault.getAbstractFileByPath(folderPath);
    if (!folder) {
      await app.vault.createFolder(folderPath);
    }

    const filePath = `${folderPath}/${reportTitle}.md`;
    const existingFile = app.vault.getAbstractFileByPath(filePath);

    if (existingFile) {
      await app.vault.modify(existingFile, reportContent);
      new Notice(`📊 Updated: ${reportTitle}`);
    } else {
      await app.vault.create(filePath, reportContent);
      new Notice(`📊 Created: ${reportTitle}`);
    }

    // Open the report
    const reportFile = app.vault.getAbstractFileByPath(filePath);
    if (reportFile) {
      await app.workspace.getLeaf().openFile(reportFile);
    }

    new Notice(`📊 Monthly report complete! (${weeklyReportsInMonth.length} weekly reports aggregated${usedFallback ? ', used vault fallback' : ''})`);

  } catch (e) {
    console.error("generate-monthly-report: Error:", e);
    new Notice(`⚠️ Monthly report generation failed: ${e.message}`);
  }
};
