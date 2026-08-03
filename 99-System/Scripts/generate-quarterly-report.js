// generate-quarterly-report.js — Automated Quarterly Report Generator
// Purpose: Creates a structured quarterly report by aggregating monthly reports + vault data
// Requires: QuickAdd (UserScript macro)
// Run: Quarterly via QuickAdd command or manually
//
// Usage (QuickAdd): Add as UserScript in macro "Generate Quarterly Report"
// Output: Creates a new note in 05-Calendar/Quarterly/
//
// Data Flow: Aggregates monthly reports from 05-Calendar/Monthly/ for the target quarter.
// Fallback: If <2 monthly reports exist, queries vault directly for basic metrics.
// Always queries: High-priority efforts for major initiatives section.
//
// Past-period support: On launch, prompts for YYYY-Q# (e.g. "2025-Q3").
//   Leave blank or cancel to generate for the current quarter.

/**
 * Quarterly Report Generator
 *
 * Gathers metrics from monthly reports and vault data:
 * - Aggregated monthly metrics (notes, tasks, efforts)
 * - Area health trends (month-over-month comparison)
 * - Major initiative status (high-priority efforts)
 * - Strategic highlights
 *
 * Output Location: 05-Calendar/Quarterly/Quarterly Report YYYY-Q#.md
 * Update Frequency: Quarterly (recommended 1st of quarter)
 */

module.exports = async (args) => {
  const { app, Notice } = window;

  try {
    // ============================================
    // PERIOD SELECTION (current or past quarter)
    // ============================================

    const now = new Date();
    const defaultYear = now.getFullYear();
    const defaultQuarter = Math.floor(now.getMonth() / 3) + 1;
    const defaultStr = `${defaultYear}-Q${defaultQuarter}`;

    let periodInput = "";
    try {
      periodInput = await app.plugins.plugins.quickadd.api.inputPrompt(
        "Generate Quarterly Report",
        `Enter quarter (YYYY-Q#) or leave blank for current (${defaultStr})`,
        defaultStr
      );
    } catch (e) {
      periodInput = "";
    }

    let year, quarter;
    if (periodInput && periodInput.trim() && periodInput.trim() !== defaultStr) {
      const match = periodInput.trim().match(/^(\d{4})-Q([1-4])$/i);
      if (!match) {
        new Notice("⚠️ Invalid format. Use YYYY-Q# (e.g. 2025-Q3)");
        return;
      }
      year = parseInt(match[1]);
      quarter = parseInt(match[2]);
      new Notice(`📊 Generating quarterly report for ${year}-Q${quarter}...`);
    } else {
      year = defaultYear;
      quarter = defaultQuarter;
      new Notice("📊 Generating quarterly report...");
    }

    // ============================================
    // DATE CALCULATIONS
    // ============================================

    const month = now.getMonth(); // 0-indexed (used for other calculations)
    const quarterStartMonth = (quarter - 1) * 3; // 0-indexed

    const quarterStart = new Date(year, quarterStartMonth, 1);
    quarterStart.setHours(0, 0, 0, 0);
    const quarterEnd = new Date(year, quarterStartMonth + 3, 0);
    quarterEnd.setHours(23, 59, 59, 999);

    const formatDate = (d) => d.toISOString().split('T')[0];
    const quarterStartStr = formatDate(quarterStart);
    const quarterEndStr = formatDate(quarterEnd);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const quarterMonths = [
      monthNames[quarterStartMonth],
      monthNames[quarterStartMonth + 1],
      monthNames[quarterStartMonth + 2]
    ];

    const reportTitle = `Quarterly Report ${year}-Q${quarter}`;

    // ============================================
    // FIND & PARSE MONTHLY REPORTS
    // ============================================

    const allFiles = app.vault.getMarkdownFiles();
    const metadataCache = app.metadataCache;
    const getFM = (file) => metadataCache.getFileCache(file)?.frontmatter || {};

    // Find monthly reports for this quarter's months
    const quarterMonthStrs = [
      String(quarterStartMonth + 1).padStart(2, '0'),
      String(quarterStartMonth + 2).padStart(2, '0'),
      String(quarterStartMonth + 3).padStart(2, '0')
    ];

    const monthlyReportFiles = allFiles.filter(f =>
      f.path.startsWith("05-Calendar/Monthly/") &&
      f.name.startsWith("Monthly Report")
    );

    const monthlyReportsInQuarter = [];
    for (const file of monthlyReportFiles) {
      const match = file.name.match(/Monthly Report (\d{4})-(\d{2})/);
      if (!match) continue;

      const reportYear = parseInt(match[1]);
      const reportMonth = match[2];

      if (reportYear === year && quarterMonthStrs.includes(reportMonth)) {
        monthlyReportsInQuarter.push({
          file,
          month: reportMonth,
          monthName: monthNames[parseInt(reportMonth) - 1]
        });
      }
    }

    // Sort by month
    monthlyReportsInQuarter.sort((a, b) => a.month.localeCompare(b.month));

    // ============================================
    // AGGREGATE MONTHLY REPORT DATA
    // ============================================

    let totalNotesCreated = 0;
    let totalNotesModified = 0;
    let totalTasksCompleted = 0;
    let totalEffortsCompleted = 0;
    let latestActiveEfforts = 0;
    let latestInbox = 0;
    const monthlySummaries = [];
    const areaHealthTrend = {};
    let usedFallback = false;

    if (monthlyReportsInQuarter.length >= 2) {
      // Primary path: parse monthly reports
      for (const mr of monthlyReportsInQuarter) {
        const content = await app.vault.read(mr.file);

        // Parse metrics table (pipe-delimited for specificity)
        const notesCreatedMatch = content.match(/\|\s*Notes Created\s*\|\s*(\d+)\s*\|/);
        const notesModifiedMatch = content.match(/\|\s*Notes Modified\s*\|\s*(\d+)\s*\|/);
        const tasksCompletedMatch = content.match(/\|\s*Tasks Completed\s*\|\s*(\d+)\s*\|/);
        const effortsCompletedMatch = content.match(/\|\s*Efforts Completed\s*\|\s*(\d+)\s*\|/);
        const activeEffortsMatch = content.match(/\|\s*Active Efforts\s*\|\s*(\d+)\s*\|/);
        const inboxMatch = content.match(/\|\s*Current Inbox\s*\|\s*(\d+)\s*\|/);

        const monthNotesCreated = parseInt(notesCreatedMatch?.[1] || '0');
        const monthTasksCompleted = parseInt(tasksCompletedMatch?.[1] || '0');

        totalNotesCreated += monthNotesCreated;
        totalNotesModified += parseInt(notesModifiedMatch?.[1] || '0');
        totalTasksCompleted += monthTasksCompleted;
        totalEffortsCompleted += parseInt(effortsCompletedMatch?.[1] || '0');
        latestActiveEfforts = parseInt(activeEffortsMatch?.[1] || '0');
        latestInbox = parseInt(inboxMatch?.[1] || '0');

        monthlySummaries.push({
          month: mr.monthName,
          link: `[[${mr.file.basename}]]`,
          notesCreated: monthNotesCreated,
          tasksCompleted: monthTasksCompleted
        });

        // Parse area health table for trend tracking (permissive name match for multi-word areas)
        const areaRows = content.matchAll(/\|\s*([^|]+?)\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(🟢[^|]*|🟡[^|]*|🔴[^|]*)\s*\|/g);
        for (const row of areaRows) {
          const areaName = row[1];
          if (!areaHealthTrend[areaName]) areaHealthTrend[areaName] = [];
          areaHealthTrend[areaName].push({
            month: mr.monthName,
            activity: parseInt(row[3]),
            status: row[4].trim()
          });
        }
      }
    } else {
      // Fallback: query vault directly
      usedFallback = true;

      const isThisQuarter = (timestamp) => {
        return timestamp >= quarterStart.getTime() && timestamp <= quarterEnd.getTime();
      };

      const notesCreated = allFiles.filter(f =>
        isThisQuarter(f.stat.ctime) &&
        !f.path.includes("Templates") &&
        !f.path.includes("99-System")
      );

      const notesModified = allFiles.filter(f =>
        isThisQuarter(f.stat.mtime) &&
        !isThisQuarter(f.stat.ctime) &&
        !f.path.includes("Templates") &&
        !f.path.includes("99-System")
      );

      const tasksCompleted = allFiles.filter(f => {
        const fm = getFM(f);
        return fm.status === "✅completed" && isThisQuarter(f.stat.mtime);
      });

      const efforts = allFiles.filter(f => f.path.startsWith("03-Efforts/"));
      const completedEfforts = efforts.filter(f =>
        getFM(f).status === "✅completed" && isThisQuarter(f.stat.mtime)
      );

      totalNotesCreated = notesCreated.length;
      totalNotesModified = notesModified.length;
      totalTasksCompleted = tasksCompleted.length;
      totalEffortsCompleted = completedEfforts.length;
      latestActiveEfforts = efforts.filter(f => getFM(f).status === "🔄active").length;
      latestInbox = allFiles.filter(f => f.path.startsWith("+Inbox/")).length;
    }

    // ============================================
    // MAJOR INITIATIVES (always direct query)
    // ============================================

    const effortFiles = allFiles.filter(f =>
      f.path.startsWith("03-Efforts/") &&
      !f.name.startsWith("+About") &&
      !f.name.startsWith("03-Efforts")
    );

    const majorInitiatives = [];
    for (const f of effortFiles) {
      const fm = getFM(f);
      if (fm.status === "🔄active" && fm.priority === "high") {
        majorInitiatives.push({
          name: fm.title || f.basename,
          priority: fm.priority,
          completion: fm.completion_percentage ?? "—",
          due: fm.due || "—",
          nextActions: fm.next_actions || "—"
        });
      }
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

    const monthlySummaryRows = monthlySummaries.length > 0
      ? monthlySummaries
          .map(m => `| ${m.month} | ${m.link} | ${m.notesCreated} | ${m.tasksCompleted} |`)
          .join('\n')
      : "| — | No monthly reports found | — | — |";

    const majorInitiativeRows = majorInitiatives.length > 0
      ? majorInitiatives
          .map(i => `| ${i.name} | ${i.priority} | ${i.completion}% | ${i.due} |`)
          .join('\n')
      : "| — | No high-priority initiatives | — | — |";

    // Area health trend (month-over-month comparison)
    let areaHealthTrendSection = "";
    if (Object.keys(areaHealthTrend).length > 0) {
      const trendHeader = "| Area | " + monthlyReportsInQuarter.map(m => m.monthName).join(" | ") + " |";
      const trendSeparator = "|------|" + monthlyReportsInQuarter.map(() => "------|").join("");
      const trendRows = Object.entries(areaHealthTrend)
        .map(([area, months]) => {
          const cells = monthlyReportsInQuarter.map(mr => {
            const entry = months.find(m => m.month === mr.monthName);
            return entry ? entry.status : "—";
          });
          return `| ${area} | ${cells.join(" | ")} |`;
        })
        .join('\n');
      areaHealthTrendSection = `${trendHeader}\n${trendSeparator}\n${trendRows}`;
    } else {
      areaHealthTrendSection = "> No area health trend data available (requires monthly reports with area health sections).";
    }

    const partialBadge = usedFallback
      ? `\n> [!warning] Partial Report\n> This report was generated with direct vault queries because fewer than 2 monthly reports were found for this quarter. For best results, generate monthly reports regularly.\n`
      : "";

    const reportContent = `---
title: "${reportTitle}"
type: quarterly
status: 🔄active
created: ${formatDate(now)}
tags:
  - 📊report
  - 📅quarterly
related:
  - "[[👁️Dashboard]]"
  - "[[🧭 Review HQ]]"
  - "[[📅 Calendar Review Hub]]"
---

# 📊 ${reportTitle}

> **Period**: ${quarterStartStr} to ${quarterEndStr} (${quarterMonths.join(", ")} ${year})
> **Monthly Reports**: ${monthlyReportsInQuarter.length}/3 found for this quarter
${partialBadge}
---

## 📈 Key Metrics

| Metric | This Quarter | Total |
|--------|-------------|-------|
| Notes Created | ${totalNotesCreated} | ${totalNotes} |
| Notes Modified | ${totalNotesModified} | — |
| Tasks Completed | ${totalTasksCompleted} | — |
| Efforts Completed | ${totalEffortsCompleted} | — |
| Active Efforts | ${latestActiveEfforts} | ${effortFiles.length} |
| Current Inbox | ${latestInbox} | — |

---

## 📅 Monthly Summaries

| Month | Report | Notes Created | Tasks Completed |
|-------|--------|--------------|-----------------|
${monthlySummaryRows}

---

## 🏠 Area Health Trends

${areaHealthTrendSection}

---

## 🎯 Major Initiatives

| Initiative | Priority | Completion | Due |
|-----------|----------|-----------|-----|
${majorInitiativeRows}

${majorInitiatives.length > 0 ? majorInitiatives.map(i => `\n**${i.name}**\n- Next actions: ${i.nextActions}`).join('\n') : ""}

---

## 🌱 Maturity Pipeline

| Stage | Count |
|-------|-------|
${maturityBreakdown}

---

## 🏆 Quarter Summary

> [!success]+ Q${quarter} ${year} Wins
> - ${totalNotesCreated} notes created across the quarter
> - ${totalTasksCompleted} tasks completed
> - ${totalEffortsCompleted} efforts finished
> - ${monthlyReportsInQuarter.length}/3 monthly reviews completed
> - ${majorInitiatives.length} major initiatives tracked
${totalNotesCreated > 100 ? "> - Outstanding creation quarter!" : ""}
${totalTasksCompleted > 50 ? "> - Excellent quarterly throughput!" : ""}

---

## 💡 Strategic Insights

> [!note]+ Patterns & Observations
> *Review area health trends above and reflect:*
> - Which areas got the most attention? Why?
> - Which areas were neglected? What needs to change?
> - Are major initiatives on track for their due dates?
> - What systemic changes would improve next quarter?

---

## 🎯 Next Quarter Focus

> [!todo]+ Goals for Q${quarter < 4 ? quarter + 1 : 1} ${quarter < 4 ? year : year + 1}
> - [ ] Maintain weekly review consistency
> - [ ] Complete monthly reports for all 3 months
> - [ ] Review and update major initiative priorities
> - [ ] Balance area attention across all 5 domains
> - [ ]

---

## 📊 Trends

\`\`\`dataviewjs
/**
 * QUERY: Quarterly Creation Trend (Last 12 Weeks)
 * PURPOSE: Visualize productivity patterns across the quarter
 */
try {
  const today = dv.date('today');
  const weeks = [];

  for (let i = 11; i >= 0; i--) {
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
  dv.paragraph("### 12-Week Creation Trend\\n");
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

*Generated: ${formatDate(now)} by Quarterly Report Generator*
*Navigate: [[📅 Calendar Review Hub]] | [[👁️Dashboard]] | [[🧭 Review HQ]]*
`;

    // ============================================
    // WRITE REPORT FILE
    // ============================================

    const folderPath = "05-Calendar/Quarterly";
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

    new Notice(`📊 Quarterly report complete! (${monthlyReportsInQuarter.length}/3 monthly reports aggregated${usedFallback ? ', used vault fallback' : ''})`);

  } catch (e) {
    console.error("generate-quarterly-report: Error:", e);
    new Notice(`⚠️ Quarterly report generation failed: ${e.message}`);
  }
};
