// generate-weekly-report.js — Automated Weekly Report Generator
// Purpose: Creates a structured weekly report note with metrics, highlights, and goals
// Requires: QuickAdd (UserScript macro)
// Run: Weekly via QuickAdd command or manually
//
// Usage (QuickAdd): Add as UserScript in macro "Generate Weekly Report"
// Output: Creates a new note in 05-Calendar/Weekly/

/**
 * Weekly Report Generator
 *
 * Gathers metrics from the vault and generates a structured weekly report:
 * - Notes created/modified this week
 * - Tasks completed this week
 * - Inbox throughput
 * - Connection growth
 * - Maturity promotions
 * - Top highlights
 *
 * Output Location: 05-Calendar/Weekly/Weekly Report YYYY-WNN.md
 * Update Frequency: Weekly (recommended Sunday evening)
 */

module.exports = async (args) => {
  const { app, Notice } = window;

  try {
    new Notice("📊 Generating weekly report...");

    // ============================================
    // DATE CALCULATIONS
    // ============================================

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday
    weekEnd.setHours(23, 59, 59, 999);

    const formatDate = (d) => d.toISOString().split('T')[0];
    const weekStartStr = formatDate(weekStart);
    const weekEndStr = formatDate(weekEnd);

    // ISO week number
    const getWeekNumber = (d) => {
      const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dayNum = dt.getUTCDay() || 7;
      dt.setUTCDate(dt.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
      return Math.ceil(((dt - yearStart) / 86400000 + 1) / 7);
    };

    const weekNum = String(getWeekNumber(now)).padStart(2, '0');
    const year = now.getFullYear();
    const reportTitle = `Weekly Report ${year}-W${weekNum}`;

    // ============================================
    // GATHER METRICS VIA OBSIDIAN API
    // ============================================

    const allFiles = app.vault.getMarkdownFiles();
    const metadataCache = app.metadataCache;

    // Helper: get frontmatter for a file
    const getFM = (file) => metadataCache.getFileCache(file)?.frontmatter || {};

    // Helper: check if date is in this week
    const isThisWeek = (timestamp) => {
      return timestamp >= weekStart.getTime() && timestamp <= weekEnd.getTime();
    };

    // Notes created this week
    const notesCreated = allFiles.filter(f =>
      isThisWeek(f.stat.ctime) &&
      !f.path.includes("Templates") &&
      !f.path.includes("99-System")
    );

    // Notes modified this week (excluding created this week to avoid double-count)
    const notesModified = allFiles.filter(f =>
      isThisWeek(f.stat.mtime) &&
      !isThisWeek(f.stat.ctime) &&
      !f.path.includes("Templates") &&
      !f.path.includes("99-System")
    );

    // Tasks completed this week (status = completed, modified this week)
    const tasksCompleted = allFiles.filter(f => {
      const fm = getFM(f);
      return fm.status === "✅completed" && isThisWeek(f.stat.mtime);
    });

    // Inbox count (current)
    const inboxItems = allFiles.filter(f => f.path.startsWith("+Inbox/"));

    // Notes by folder this week
    const createdByFolder = {};
    notesCreated.forEach(f => {
      const folder = f.path.split('/')[0];
      createdByFolder[folder] = (createdByFolder[folder] || 0) + 1;
    });

    // Effort status counts
    const efforts = allFiles.filter(f => f.path.startsWith("03-Efforts/"));
    const activeEfforts = efforts.filter(f => getFM(f).status === "🔄active");
    const completedEfforts = efforts.filter(f =>
      getFM(f).status === "✅completed" && isThisWeek(f.stat.mtime)
    );

    // Maturity distribution (02-Knowledge)
    const atomics = allFiles.filter(f => f.path.startsWith("02-Knowledge/"));
    const maturityCounts = { '📤seed': 0, '🌱seedling': 0, '🪴sapling': 0, '🌲evergreen': 0, '🍓fruit': 0 };
    atomics.forEach(f => {
      const m = getFM(f).maturity;
      if (m && maturityCounts[m] !== undefined) maturityCounts[m]++;
    });

    // Read cache for comparison (last week's values)
    const cacheFile = app.vault.getAbstractFileByPath("99-System/_Metrics Cache.md");
    let cacheData = {};
    if (cacheFile) {
      const cacheContent = await app.vault.read(cacheFile);
      const lines = cacheContent.split('\n');
      lines.forEach(line => {
        const match = line.match(/^(\w+)::\s*(.+)$/);
        if (match) cacheData[match[1]] = match[2].trim();
      });
    }

    // ============================================
    // DAILY NOTES CONTENT — highlights, energy, mood
    // ============================================

    const dailyNotesThisWeek = allFiles.filter(f => {
      if (!f.path.startsWith("05-Calendar/Daily/")) return false;
      if (f.path.includes("Template") || f.path.includes("+")) return false;
      const fm = getFM(f);
      if (fm.date) {
        const d = new Date(fm.date);
        return !isNaN(d.getTime()) && d >= weekStart && d <= weekEnd;
      }
      return isThisWeek(f.stat.ctime); // fallback for legacy notes without date field
    });

    const weekHighlights = dailyNotesThisWeek
      .map(f => {
        const fm = getFM(f);
        const val = fm.highlight;
        if (!val || String(val).trim() === '') return null;
        return { date: fm.date || formatDate(new Date(f.stat.ctime)), text: String(val).trim() };
      })
      .filter(h => h !== null)
      .sort((a, b) => a.date.localeCompare(b.date));

    const energyDist = { High: 0, Medium: 0, Low: 0, Unknown: 0 };
    const moodDist   = { Positive: 0, Neutral: 0, Negative: 0, Unknown: 0 };

    dailyNotesThisWeek.forEach(f => {
      const fm = getFM(f);
      const e = fm.energy ? String(fm.energy).toLowerCase() : '';
      if      (e.includes('high') || e.includes('⚡'))            energyDist.High++;
      else if (e.includes('medium') || e.includes('mid') || e.includes('🔋')) energyDist.Medium++;
      else if (e.includes('low')  || e.includes('🪫'))            energyDist.Low++;
      else if (e !== '')                                           energyDist.Medium++;
      else                                                         energyDist.Unknown++;

      const m = fm.mood ? String(fm.mood).toLowerCase() : '';
      if      (m.includes('good') || m.includes('great') || m.includes('😊') || m.includes('🌤')) moodDist.Positive++;
      else if (m.includes('ok')   || m.includes('neutral') || m.includes('😐'))                   moodDist.Neutral++;
      else if (m.includes('bad')  || m.includes('low') || m.includes('😔') || m.includes('😞'))   moodDist.Negative++;
      else if (m !== '')                                                                            moodDist.Neutral++;
      else                                                                                          moodDist.Unknown++;
    });

    const energySummary = [
      energyDist.High   > 0 ? `⚡ High ×${energyDist.High}`   : null,
      energyDist.Medium > 0 ? `🔋 Med ×${energyDist.Medium}`  : null,
      energyDist.Low    > 0 ? `🪫 Low ×${energyDist.Low}`     : null,
      energyDist.Unknown> 0 ? `— ×${energyDist.Unknown}`       : null,
    ].filter(Boolean).join(', ') || '—';

    const moodSummary = [
      moodDist.Positive > 0 ? `😊 ×${moodDist.Positive}` : null,
      moodDist.Neutral  > 0 ? `😐 ×${moodDist.Neutral}`  : null,
      moodDist.Negative > 0 ? `😔 ×${moodDist.Negative}` : null,
      moodDist.Unknown  > 0 ? `— ×${moodDist.Unknown}`    : null,
    ].filter(Boolean).join(', ') || '—';

    const highlightsSection = weekHighlights.length > 0
      ? weekHighlights.map(h => `| ${h.date} | ${h.text} |`).join('\n')
      : '| — | No highlights recorded this week |';

    // ============================================
    // GENERATE REPORT CONTENT
    // ============================================

    const totalNotes = allFiles.filter(f =>
      !f.path.includes("Templates") && !f.path.includes("99-System")
    ).length;

    const folderBreakdown = Object.entries(createdByFolder)
      .sort((a, b) => b[1] - a[1])
      .map(([folder, count]) => `| ${folder} | ${count} |`)
      .join('\n');

    const maturityBreakdown = Object.entries(maturityCounts)
      .map(([stage, count]) => `| ${stage} | ${count} |`)
      .join('\n');

    const reportContent = `---
title: "${reportTitle}"
type: weekly
status: 🔄active
created: ${formatDate(now)}
tags:
  - 📊report
  - 📅weekly
related:
  - "[[👁️Dashboard]]"
  - "[[🧭 Review HQ]]"
---

# 📊 ${reportTitle}

> **Period**: ${weekStartStr} to ${weekEndStr}

---

## 📈 Key Metrics

| Metric | This Week | Total |
|--------|-----------|-------|
| Notes Created | ${notesCreated.length} | ${totalNotes} |
| Notes Modified | ${notesModified.length} | — |
| Tasks Completed | ${tasksCompleted.length} | — |
| Efforts Completed | ${completedEfforts.length} | — |
| Active Efforts | ${activeEfforts.length} | ${efforts.length} |
| Current Inbox | ${inboxItems.length} | — |
| Daily Notes | ${dailyNotesThisWeek.length} | — |
| Energy (days) | ${energySummary} | — |
| Mood (days) | ${moodSummary} | — |

---

## 📁 Creation Breakdown

| Folder | Notes Created |
|--------|--------------|
${folderBreakdown || "| — | 0 |"}

---

## 🌱 Maturity Pipeline

| Stage | Count |
|-------|-------|
${maturityBreakdown}

---

## 📔 Daily Highlights

| Date | Highlight |
|------|-----------|
${highlightsSection}

---

## 🏆 Highlights

> [!success]+ This Week's Wins
> - ${notesCreated.length} new notes created
> - ${tasksCompleted.length} tasks completed
> - ${completedEfforts.length} efforts finished
${notesCreated.length > 10 ? "> - Strong note creation week!" : ""}
${tasksCompleted.length > 5 ? "> - Excellent task throughput!" : ""}

---

## 🎯 Next Week Focus

> [!todo]+ Goals for Next Week
> - [ ] Process inbox (currently ${inboxItems.length} items)
> - [ ] Review ${activeEfforts.length} active efforts
> - [ ] Add connections to reduce orphan notes
> - [ ]

---

## 📊 Trends

\`\`\`dataviewjs
/**
 * QUERY: Weekly Creation Trend (Last 8 Weeks)
 * PURPOSE: Visualize recent productivity patterns
 */
try {
  const today = dv.date('today');
  const weeks = [];

  for (let i = 7; i >= 0; i--) {
    const wStart = today.minus({weeks: i}).startOf('week');
    const wEnd = wStart.plus({days: 6});
    const count = dv.pages()
      .where(p =>
        !p.file.path.includes("Templates") &&
        p.file.ctime >= wStart &&
        p.file.ctime <= wEnd
      ).length ?? 0;

    weeks.push({
      week: wStart.toFormat("MM-dd"),
      count
    });
  }

  const maxCount = Math.max(...weeks.map(w => w.count), 1);
  dv.paragraph("### 8-Week Creation Trend\\n");
  weeks.forEach(w => {
    const bar = '█'.repeat(Math.round(w.count / maxCount * 25));
    const pad = '░'.repeat(25 - bar.length);
    dv.paragraph(\`**W\${w.week}**: \${bar}\${pad} \${w.count}\`);
  });
} catch (e) {
  dv.paragraph(\`⚠️ Error: \${e.message}\`);
}
\`\`\`

---

*Generated: ${formatDate(now)} by Weekly Report Generator*
*Navigate: [[👁️Dashboard]] | [[🧭 Review HQ]] | [[TODO]]*
`;

    // ============================================
    // WRITE REPORT FILE
    // ============================================

    // Ensure folder exists
    const folderPath = "05-Calendar/Weekly";
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

  } catch (e) {
    console.error("generate-weekly-report: Error:", e);
    new Notice(`⚠️ Report generation failed: ${e.message}`);
  }
};
