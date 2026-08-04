// generate-yearly-report.js — Automated Yearly Report Generator
// Purpose: Creates a structured yearly report by aggregating quarterly reports + vault data
// Requires: QuickAdd (UserScript macro)
// Run: Yearly via QuickAdd command or manually
//
// Usage (QuickAdd): Add as UserScript in macro "Generate Yearly Report"
// Output: Creates a new note in 05-Calendar/Yearly/
//
// Data Flow: Aggregates quarterly reports from 05-Calendar/Quarterly/ for the target year.
// Fallback: If <2 quarterly reports exist, queries vault directly for basic metrics.
// Always queries: Knowledge growth (atomics/sources created), system maturity.
//
// Past-period support: On launch, prompts for YYYY (e.g. "2025").
//   Leave blank or cancel to generate for the current year.

/**
 * Yearly Report Generator
 *
 * Gathers metrics from quarterly reports and vault data:
 * - Aggregated quarterly metrics (notes, tasks, efforts)
 * - Area evolution (Q1 → Q4 comparison)
 * - Major achievements
 * - Knowledge growth (atomics, sources)
 * - System maturity metrics
 *
 * Output Location: 05-Calendar/Yearly/Yearly Report YYYY.md
 * Update Frequency: Yearly (recommended January 1st or December 31st)
 */

module.exports = async (args) => {
  const { app, Notice } = window;

  try {
    // ============================================
    // PERIOD SELECTION (current or past year)
    // ============================================

    const now = new Date();
    const defaultYear = now.getFullYear();
    const defaultStr = `${defaultYear}`;

    let periodInput = "";
    try {
      periodInput = await app.plugins.plugins.quickadd.api.inputPrompt(
        "Generate Yearly Report",
        `Enter year (YYYY) or leave blank for current (${defaultStr})`,
        defaultStr
      );
    } catch (e) {
      periodInput = "";
    }

    let year;
    if (periodInput && periodInput.trim() && periodInput.trim() !== defaultStr) {
      const match = periodInput.trim().match(/^(\d{4})$/);
      if (!match) {
        new Notice("⚠️ Invalid format. Use YYYY (e.g. 2025)");
        return;
      }
      year = parseInt(match[1]);
      new Notice(`📊 Generating yearly report for ${year}...`);
    } else {
      year = defaultYear;
      new Notice("📊 Generating yearly report...");
    }

    // ============================================
    // DATE CALCULATIONS
    // ============================================

    const yearStart = new Date(year, 0, 1);
    yearStart.setHours(0, 0, 0, 0);
    const yearEnd = new Date(year, 11, 31);
    yearEnd.setHours(23, 59, 59, 999);

    const formatDate = (d) => d.toISOString().split('T')[0];
    const yearStartStr = formatDate(yearStart);
    const yearEndStr = formatDate(yearEnd);

    const reportTitle = `Yearly Report ${year}`;

    // ============================================
    // FIND & PARSE QUARTERLY REPORTS
    // ============================================

    const allFiles = app.vault.getMarkdownFiles();
    const metadataCache = app.metadataCache;
    const getFM = (file) => metadataCache.getFileCache(file)?.frontmatter || {};

    const quarterlyReportFiles = allFiles.filter(f =>
      f.path.startsWith("05-Calendar/Quarterly/") &&
      f.name.startsWith("Quarterly Report")
    );

    const quarterlyReportsThisYear = [];
    for (const file of quarterlyReportFiles) {
      const match = file.name.match(/Quarterly Report (\d{4})-Q(\d)/);
      if (!match) continue;

      const reportYear = parseInt(match[1]);
      const reportQuarter = parseInt(match[2]);

      if (reportYear === year) {
        quarterlyReportsThisYear.push({ file, quarter: reportQuarter });
      }
    }

    // Sort by quarter
    quarterlyReportsThisYear.sort((a, b) => a.quarter - b.quarter);

    // ============================================
    // AGGREGATE QUARTERLY REPORT DATA
    // ============================================

    let totalNotesCreated = 0;
    let totalNotesModified = 0;
    let totalTasksCompleted = 0;
    let totalEffortsCompleted = 0;
    let latestActiveEfforts = 0;
    const quarterlySummaries = [];
    let usedFallback = false;

    if (quarterlyReportsThisYear.length >= 2) {
      // Primary path: parse quarterly reports
      for (const qr of quarterlyReportsThisYear) {
        const content = await app.vault.read(qr.file);

        // Parse metrics table (pipe-delimited for specificity)
        const notesCreatedMatch = content.match(/\|\s*Notes Created\s*\|\s*(\d+)\s*\|/);
        const notesModifiedMatch = content.match(/\|\s*Notes Modified\s*\|\s*(\d+)\s*\|/);
        const tasksCompletedMatch = content.match(/\|\s*Tasks Completed\s*\|\s*(\d+)\s*\|/);
        const effortsCompletedMatch = content.match(/\|\s*Efforts Completed\s*\|\s*(\d+)\s*\|/);
        const activeEffortsMatch = content.match(/\|\s*Active Efforts\s*\|\s*(\d+)\s*\|/);

        const qNotesCreated = parseInt(notesCreatedMatch?.[1] || '0');
        const qTasksCompleted = parseInt(tasksCompletedMatch?.[1] || '0');

        totalNotesCreated += qNotesCreated;
        totalNotesModified += parseInt(notesModifiedMatch?.[1] || '0');
        totalTasksCompleted += qTasksCompleted;
        totalEffortsCompleted += parseInt(effortsCompletedMatch?.[1] || '0');
        latestActiveEfforts = parseInt(activeEffortsMatch?.[1] || '0');

        quarterlySummaries.push({
          quarter: `Q${qr.quarter}`,
          link: `[[${qr.file.basename}]]`,
          notesCreated: qNotesCreated,
          tasksCompleted: qTasksCompleted
        });
      }
    } else {
      // Fallback: query vault directly
      usedFallback = true;

      const isThisYear = (timestamp) => {
        return timestamp >= yearStart.getTime() && timestamp <= yearEnd.getTime();
      };

      const notesCreated = allFiles.filter(f =>
        isThisYear(f.stat.ctime) &&
        !f.path.includes("Templates") &&
        !f.path.includes("99-System")
      );

      const notesModified = allFiles.filter(f =>
        isThisYear(f.stat.mtime) &&
        !isThisYear(f.stat.ctime) &&
        !f.path.includes("Templates") &&
        !f.path.includes("99-System")
      );

      const tasksCompleted = allFiles.filter(f => {
        const fm = getFM(f);
        return fm.status === "✅completed" && isThisYear(f.stat.mtime);
      });

      const efforts = allFiles.filter(f => f.path.startsWith("03-Efforts/"));
      const completedEfforts = efforts.filter(f =>
        getFM(f).status === "✅completed" && isThisYear(f.stat.mtime)
      );

      totalNotesCreated = notesCreated.length;
      totalNotesModified = notesModified.length;
      totalTasksCompleted = tasksCompleted.length;
      totalEffortsCompleted = completedEfforts.length;
      latestActiveEfforts = efforts.filter(f => getFM(f).status === "🔄active").length;
    }

    // ============================================
    // KNOWLEDGE GROWTH (always direct query)
    // ============================================

    const isThisYear = (timestamp) => {
      return timestamp >= yearStart.getTime() && timestamp <= yearEnd.getTime();
    };

    const atomicsCreated = allFiles.filter(f =>
      f.path.startsWith("02-Knowledge/") &&
      !f.name.startsWith("+About") &&
      !f.name.match(/^\d{3}-/) && // exclude legacy numbered folder hub files like 200-Areas.md
      isThisYear(f.stat.ctime)
    ).length;

    const sourcesCreated = allFiles.filter(f =>
      f.path.startsWith("04-Sources/") &&
      !f.name.startsWith("+About") &&
      isThisYear(f.stat.ctime)
    ).length;

    const mocsCreated = allFiles.filter(f =>
      f.path.startsWith("01-MOCs/") &&
      !f.name.startsWith("+About") &&
      isThisYear(f.stat.ctime)
    ).length;

    // ============================================
    // SYSTEM MATURITY METRICS
    // ============================================

    // Maturity pipeline
    const atomics = allFiles.filter(f => f.path.startsWith("02-Knowledge/"));
    const maturityCounts = { '📤seed': 0, '🌱seedling': 0, '🪴sapling': 0, '🌲evergreen': 0, '🍓fruit': 0 };
    atomics.forEach(f => {
      const m = getFM(f).maturity;
      if (m && maturityCounts[m] !== undefined) maturityCounts[m]++;
    });

    // Connection density
    const contentFiles = allFiles.filter(f =>
      !f.path.includes("Templates") && !f.path.includes("99-System")
    );
    const totalNotes = contentFiles.length;

    let totalConnections = 0;
    let orphanCount = 0;
    for (const f of contentFiles) {
      const cache = metadataCache.getFileCache(f);
      const outlinks = cache?.links?.length || 0;
      const backlinks = metadataCache.getBacklinksForFile(f);
      const inlinks = backlinks ? Object.keys(backlinks.data).length : 0;
      const connections = outlinks + inlinks;
      totalConnections += connections;
      if (connections === 0) orphanCount++;
    }
    const avgConnections = totalNotes > 0 ? (totalConnections / totalNotes).toFixed(1) : 0;

    // Inbox health
    const inboxCount = allFiles.filter(f => f.path.startsWith("+Inbox/")).length;

    // Weekly report consistency (count weekly reports this year)
    const weeklyReportsThisYear = allFiles.filter(f =>
      f.path.startsWith("05-Calendar/Weekly/") &&
      f.name.includes(`${year}`)
    ).length;

    // Monthly report count
    const monthlyReportsThisYear = allFiles.filter(f =>
      f.path.startsWith("05-Calendar/Monthly/") &&
      f.name.includes(`${year}`)
    ).length;

    // ============================================
    // AREA OVERVIEW (always direct query)
    // ============================================

    const areaDefinitions = [
      { name: "Health", path: "02-Knowledge/Areas/Health.md" },
      { name: "Finance", path: "02-Knowledge/Areas/Finance.md" },
      { name: "Career", path: "02-Knowledge/Areas/Career.md" },
      { name: "Relationships", path: "02-Knowledge/Areas/Relationships.md" },
      { name: "Personal", path: "02-Knowledge/Areas/Personal.md" }
    ];

    const areaOverview = [];
    for (const area of areaDefinitions) {
      const areaFile = app.vault.getAbstractFileByPath(area.path);
      let relatedCount = 0;
      let yearActivity = 0;

      if (areaFile) {
        const backlinks = app.metadataCache.getBacklinksForFile(areaFile);
        relatedCount = backlinks ? Object.keys(backlinks.data).length : 0;

        for (const [linkPath] of Object.entries(backlinks?.data || {})) {
          const linkedFile = app.vault.getAbstractFileByPath(linkPath);
          if (linkedFile && isThisYear(linkedFile.stat.mtime)) {
            yearActivity++;
          }
        }
      }

      areaOverview.push({
        name: area.name,
        relatedNotes: relatedCount,
        yearActivity: yearActivity,
        status: yearActivity > 10 ? "🟢 Strong" : yearActivity > 3 ? "🟡 Moderate" : "🔴 Weak"
      });
    }

    // ============================================
    // GENERATE REPORT CONTENT
    // ============================================

    const maturityBreakdown = Object.entries(maturityCounts)
      .map(([stage, count]) => `| ${stage} | ${count} |`)
      .join('\n');

    const quarterlySummaryRows = quarterlySummaries.length > 0
      ? quarterlySummaries
          .map(q => `| ${q.quarter} | ${q.link} | ${q.notesCreated} | ${q.tasksCompleted} |`)
          .join('\n')
      : "| — | No quarterly reports found | — | — |";

    const areaOverviewRows = areaOverview
      .map(a => `| ${a.name} | ${a.relatedNotes} | ${a.yearActivity} | ${a.status} |`)
      .join('\n');

    const partialBadge = usedFallback
      ? `\n> [!warning] Partial Report\n> This report was generated with direct vault queries because fewer than 2 quarterly reports were found. For best results, generate quarterly reports regularly.\n`
      : "";

    const effortFiles = allFiles.filter(f =>
      f.path.startsWith("03-Efforts/") &&
      !f.name.startsWith("+About") &&
      !f.name.startsWith("03-Efforts")
    );

    const reportContent = `---
title: "${reportTitle}"
type: yearly
status: 🔄active
created: ${formatDate(now)}
tags:
  - 📊report
  - 📅yearly
related:
  - "[[👁️Dashboard]]"
  - "[[🧭 Review HQ]]"
  - "[[📅 Calendar Review Hub]]"
---

# 📊 ${reportTitle}

> **Period**: ${yearStartStr} to ${yearEndStr}
> **Quarterly Reports**: ${quarterlyReportsThisYear.length}/4 found for this year
${partialBadge}
---

## 📈 Key Metrics

| Metric | This Year | Total |
|--------|----------|-------|
| Notes Created | ${totalNotesCreated} | ${totalNotes} |
| Notes Modified | ${totalNotesModified} | — |
| Tasks Completed | ${totalTasksCompleted} | — |
| Efforts Completed | ${totalEffortsCompleted} | — |
| Active Efforts | ${latestActiveEfforts} | ${effortFiles.length} |

---

## 📅 Quarterly Summaries

| Quarter | Report | Notes Created | Tasks Completed |
|---------|--------|--------------|-----------------|
${quarterlySummaryRows}

---

## 🏠 Annual Area Overview

| Area | Total Notes | Activity This Year | Status |
|------|-----------|-------------------|--------|
${areaOverviewRows}

---

## 📚 Knowledge Growth

| Metric | Count |
|--------|-------|
| Atomic Notes Created | ${atomicsCreated} |
| Sources Captured | ${sourcesCreated} |
| MOCs Created | ${mocsCreated} |
| Total Knowledge Base | ${atomics.length} atomics |

---

## 🌱 Maturity Pipeline

| Stage | Count |
|-------|-------|
${maturityBreakdown}

---

## 🔧 System Maturity

| Metric | Value |
|--------|-------|
| Total Notes | ${totalNotes} |
| Connection Density | ${avgConnections} avg links/note |
| Orphan Notes | ${orphanCount} |
| Current Inbox | ${inboxCount} |
| Weekly Reviews | ${weeklyReportsThisYear} reports |
| Monthly Reviews | ${monthlyReportsThisYear} reports |
| Quarterly Reviews | ${quarterlyReportsThisYear.length} reports |

---

## 🏆 Year Summary

> [!success]+ ${year} Achievements
> - ${totalNotesCreated} notes created across the year
> - ${totalTasksCompleted} tasks completed
> - ${totalEffortsCompleted} efforts finished
> - ${atomicsCreated} atomic knowledge notes added
> - ${sourcesCreated} sources captured
> - ${weeklyReportsThisYear} weekly reviews completed
> - ${monthlyReportsThisYear} monthly reviews completed
${totalNotesCreated > 300 ? "> - Outstanding knowledge building year!" : ""}

---

## 💡 Annual Reflections

> [!note]+ Year in Review
> *Reflect on the past year:*
> - What was the biggest achievement?
> - What area grew the most? Which was neglected?
> - What habits were established? Which ones need work?
> - What would you do differently next year?
> - What are you most grateful for?

---

## 🔮 Next Year Vision

> [!todo]+ Goals for ${year + 1}
> - [ ] Establish consistent daily note habit (target: 70%+ days)
> - [ ] Complete all 52 weekly reviews
> - [ ] Complete all 12 monthly reviews
> - [ ] Complete all 4 quarterly reviews
> - [ ] Grow knowledge base by ___%
> - [ ] Focus areas:
> - [ ]

---

## 📊 Trends

\`\`\`dataviewjs
/**
 * QUERY: Yearly Creation Trend (Last 52 Weeks)
 * PURPOSE: Visualize productivity patterns across the entire year
 */
try {
  const today = dv.date('today');
  const months = [];

  for (let i = 11; i >= 0; i--) {
    const mStart = today.minus({months: i}).startOf('month');
    const mEnd = mStart.endOf('month');
    const count = dv.pages()
      .where(p =>
        !p.file.path.includes("Templates") &&
        !p.file.path.includes("99-System") &&
        p.file.ctime >= mStart &&
        p.file.ctime <= mEnd
      ).length ?? 0;

    months.push({
      month: mStart.toFormat("MMM"),
      count
    });
  }

  const maxCount = Math.max(...months.map(m => m.count), 1);
  dv.paragraph("### 12-Month Creation Trend\\n");
  months.forEach(m => {
    const bar = '\u2588'.repeat(Math.round(m.count / maxCount * 25));
    const pad = '\u2591'.repeat(25 - bar.length);
    dv.paragraph(\`**\${m.month}**: \${bar}\${pad} \${m.count}\`);
  });
} catch (e) {
  dv.paragraph(\`\u26a0\ufe0f Error: \${e.message}\`);
}
\`\`\`

---

*Generated: ${formatDate(now)} by Yearly Report Generator*
*Navigate: [[📅 Calendar Review Hub]] | [[👁️Dashboard]] | [[🧭 Review HQ]]*
`;

    // ============================================
    // WRITE REPORT FILE
    // ============================================

    const folderPath = "05-Calendar/Yearly";
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

    new Notice(`📊 Yearly report complete! (${quarterlyReportsThisYear.length}/4 quarterly reports aggregated${usedFallback ? ', used vault fallback' : ''})`);

  } catch (e) {
    console.error("generate-yearly-report: Error:", e);
    new Notice(`⚠️ Yearly report generation failed: ${e.message}`);
  }
};
