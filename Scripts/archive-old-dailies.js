// archive-old-dailies.js — Auto-archive old daily notes
// Purpose: Archive daily notes older than 12 months to improve performance
// Requires: QuickAdd
// Run: Quarterly or manually when performance degrades
//
// Usage (QuickAdd): Add as UserScript in macro

/**
 * Auto-Archive Old Dailies
 *
 * Archives daily notes older than specified threshold (default: 12 months)
 * to improve Gamification Dashboard performance and reduce vault size.
 *
 * Features:
 * - Configurable age threshold
 * - Preserves metadata for streak calculation
 * - Creates archive index for reference
 * - Dry-run mode for preview
 * - Detailed completion report
 *
 * Archive Location: 06-Archive/Daily-Notes-Archive/YYYY/
 */

module.exports = async (args) => {
  const { app, Notice } = window;
  const QuickAdd = window.QuickAddApi;

  try {
    // Configuration
    const config = {
      ageThresholdMonths: args?.ageThresholdMonths || 12,
      dryRun: args?.dryRun || false,
      sourceFolder: '05-Calendar/Daily',
      archiveFolder: '06-Archive/Daily-Notes-Archive'
    };

    new Notice("🔍 Scanning daily notes...");

    // Get all daily notes
    const dailyNotes = app.vault.getMarkdownFiles()
      .filter(f => f.path.startsWith(config.sourceFolder));

    if (dailyNotes.length === 0) {
      new Notice("✅ No daily notes found");
      return { success: true, archived: 0 };
    }

    // Calculate cutoff date
    const cutoffDate = window.moment().subtract(config.ageThresholdMonths, 'months');

    // Find notes to archive
    const notesToArchive = dailyNotes.filter(f => {
      const noteDate = extractDateFromDaily(f.basename);
      return noteDate && noteDate.isBefore(cutoffDate);
    });

    if (notesToArchive.length === 0) {
      new Notice(`✅ No daily notes older than ${config.ageThresholdMonths} months`);
      return { success: true, archived: 0 };
    }

    // Confirm with user
    const confirmMessage = `Found ${notesToArchive.length} daily notes older than ${config.ageThresholdMonths} months.\n\nArchive these notes?\n\nThis will:\n- Move notes to ${config.archiveFolder}\n- Organize by year\n- Create archive index\n- Preserve metadata`;

    let proceed;
    if (QuickAdd) {
      proceed = await QuickAdd.yesNoPrompt(
        "Archive Old Daily Notes",
        confirmMessage
      );
    } else {
      proceed = window.confirm(confirmMessage);
    }

    if (!proceed) {
      new Notice("❌ Archive cancelled");
      return { success: false, cancelled: true };
    }

    // Execute archive
    const results = {
      archived: 0,
      errors: [],
      byYear: {}
    };

    new Notice(`🔄 Archiving ${notesToArchive.length} notes${config.dryRun ? ' (DRY RUN)' : ''}...`);

    for (const note of notesToArchive) {
      try {
        const noteDate = extractDateFromDaily(note.basename);
        const year = noteDate.format('YYYY');

        // Track by year
        if (!results.byYear[year]) {
          results.byYear[year] = 0;
        }
        results.byYear[year]++;

        if (!config.dryRun) {
          // Create year folder if needed
          const yearFolder = `${config.archiveFolder}/${year}`;
          await ensureFolderExists(yearFolder);

          // Move note
          const newPath = `${yearFolder}/${note.name}`;
          await app.fileManager.renameFile(note, newPath);
        }

        results.archived++;

        // Progress update every 50 notes
        if (results.archived % 50 === 0) {
          new Notice(`📊 Progress: ${results.archived}/${notesToArchive.length} archived`);
        }

      } catch (error) {
        results.errors.push({
          note: note.basename,
          error: error.message
        });
        console.error(`Error archiving ${note.basename}:`, error);
      }
    }

    // Create archive index
    if (!config.dryRun && results.archived > 0) {
      await createArchiveIndex(config.archiveFolder, results);
    }

    // Show completion report
    showCompletionReport(results, config);

    return {
      success: true,
      ...results
    };

  } catch (error) {
    new Notice(`❌ Archive error: ${error.message}`);
    console.error("Archive error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Extract date from daily note filename
 */
function extractDateFromDaily(filename) {
  // Try various date formats
  const formats = [
    'YYYY-MM-DD',
    'YYYY_MM_DD',
    'YYYYMMDD',
    'DD-MM-YYYY',
    'DD_MM_YYYY'
  ];

  for (const format of formats) {
    const parsed = window.moment(filename, format, true);
    if (parsed.isValid()) {
      return parsed;
    }
  }

  return null;
}

/**
 * Ensure folder exists, create if needed
 */
async function ensureFolderExists(folderPath) {
  const folder = app.vault.getAbstractFileByPath(folderPath);

  if (!folder) {
    // Create folder hierarchy
    const parts = folderPath.split('/');
    let currentPath = '';

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const existing = app.vault.getAbstractFileByPath(currentPath);

      if (!existing) {
        await app.vault.createFolder(currentPath);
      }
    }
  }
}

/**
 * Create archive index file
 */
async function createArchiveIndex(archiveFolder, results) {
  const indexPath = `${archiveFolder}/Archive Index.md`;

  const yearBreakdown = Object.entries(results.byYear)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, count]) => `- **${year}**: ${count} notes → [[${archiveFolder}/${year}]]`)
    .join('\n');

  const content = `---
type: index
status: 🔄active
created: ${window.moment().format('YYYY-MM-DD')}
modified: ${window.moment().format('YYYY-MM-DD')}
---

# 📦 Daily Notes Archive Index

> [!info] Archive Information
> This folder contains archived daily notes older than 12 months.
> **Last Archive Run**: ${window.moment().format('YYYY-MM-DD HH:mm:ss')}
> **Total Archived Notes**: ${results.archived}

## 📅 Notes by Year

${yearBreakdown}

## 🔍 Searching Archived Notes

To search archived daily notes:
1. Use global search (Ctrl/Cmd + Shift + F)
2. Or use Dataview query:

\`\`\`dataview
LIST
FROM "${archiveFolder}"
WHERE contains(file.path, "2023")
SORT file.name DESC
\`\`\`

## ⚙️ Archive Configuration

- **Age Threshold**: 12 months
- **Source Folder**: 05-Calendar/Daily
- **Archive Folder**: ${archiveFolder}
- **Run Frequency**: Quarterly (recommended)

## 📊 Archive Statistics

- **Total Archived**: ${results.archived} notes
- **Years Covered**: ${Object.keys(results.byYear).length}
- **Oldest Note**: ${Math.min(...Object.keys(results.byYear).map(Number))}
- **Most Recent**: ${Math.max(...Object.keys(results.byYear).map(Number))}

---

*Index generated: ${window.moment().format('YYYY-MM-DD HH:mm:ss')}*
*Next archive run: Quarterly or when performance degrades*
`;

  const existingIndex = app.vault.getAbstractFileByPath(indexPath);

  if (existingIndex) {
    await app.vault.modify(existingIndex, content);
  } else {
    await app.vault.create(indexPath, content);
  }
}

/**
 * Show completion report
 */
function showCompletionReport(results, config) {
  const yearBreakdown = Object.entries(results.byYear)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, count]) => `  ${year}: ${count}`)
    .join('\n');

  const report = `
📦 Archive ${config.dryRun ? 'Preview' : 'Complete'}!

✅ Archived: ${results.archived} daily notes
📁 Organized by year: ${Object.keys(results.byYear).length} years
${results.errors.length > 0 ? `⚠️ Errors: ${results.errors.length}` : ''}

Year Breakdown:
${yearBreakdown || '  (none)'}

${config.dryRun ? '\n⚠️ DRY RUN - No files were actually moved' : ''}
  `.trim();

  new Notice(report, 10000);

  // Log detailed results
  console.log('Archive Results:', results);

  if (results.errors.length > 0) {
    console.error('Archive Errors:', results.errors);
  }
}
