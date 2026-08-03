// quick-process-effort.js — One-click effort/project processing
// Purpose: Instantly process inbox note as effort with intelligent defaults
// Requires: QuickAdd
// Run: When capturing projects, tasks, or actionable work
//
// Usage (QuickAdd): Add as UserScript in macro

/**
 * Quick Process - Effort
 * Workflow:
 * 1. Prompt for deadline (optional)
 * 2. Auto-populate metadata (type: effort, status: based on deadline)
 * 3. Determine On/Ongoing/Simmering based on deadline proximity
 * 4. Move to 03-Efforts/[status]
 * 5. Apply project template
 *
 * Expected processing time: 15-20 seconds vs 2-3 minutes manual
 */

module.exports = async (args) => {
  const { app, Notice } = window;
  const QuickAdd = window.QuickAddApi;

  try {
    // Get current file
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
      new Notice("❌ No active file to process");
      return;
    }

    // Read content
    const content = await app.vault.read(activeFile);
    const cache = app.metadataCache.getFileCache(activeFile);
    const frontmatter = cache?.frontmatter || {};

    new Notice("🔄 Processing as Effort note...");

    // 1. Prompt for deadline and priority
    let dueDate = frontmatter.due || '';
    let priority = frontmatter.priority || '';

    if (QuickAdd) {
      // Deadline
      const deadlineInput = await QuickAdd.inputPrompt(
        "Deadline (optional):",
        "YYYY-MM-DD",
        dueDate
      );
      if (deadlineInput) dueDate = deadlineInput;

      // Priority
      const priorities = [
        "🔴 High Priority",
        "🟡 Medium Priority",
        "🟢 Low Priority",
        "⚪ Not Set"
      ];

      const selectedPriority = await QuickAdd.suggester(
        priorities,
        priorities,
        false,
        "Select priority:"
      );

      if (selectedPriority && !selectedPriority.includes("Not Set")) {
        // Extract emoji
        priority = selectedPriority.split(' ')[0];
      }
    }

    // 2. Auto-populate metadata
    const metadata = { ...frontmatter };

    metadata.type = "effort";

    if (dueDate) metadata.due = dueDate;
    if (priority) metadata.priority = priority;

    // Auto-set dates
    if (!metadata.created) {
      metadata.created = window.moment(activeFile.stat.ctime).format('YYYY-MM-DD');
    }
    metadata.modified = window.moment().format('YYYY-MM-DD');

    // Auto-set tags
    if (!metadata.tags || metadata.tags.length === 0) {
      metadata.tags = ['🚀effort', '📥inbox'];
    } else {
      if (!metadata.tags.includes('🚀effort')) metadata.tags.push('🚀effort');
      if (!metadata.tags.includes('📥inbox')) metadata.tags.push('📥inbox');
    }

    // Set up link
    if (!metadata.up) {
      metadata.up = '[[03-Efforts]]';
    }

    // Initialize completion
    if (!metadata.completion) {
      metadata.completion = 0;
    }

    // 3. Determine status folder based on deadline
    const statusDecision = determineEffortStatus(dueDate);

    let targetFolder;
    if (QuickAdd) {
      const folderOptions = [
        `🔄 Active (${statusDecision.folder === 'Active' ? 'Suggested' : 'Active work'})`,
        `⏸️ Paused (${statusDecision.folder === 'Paused' ? 'Suggested' : 'Future/low priority'})`,
        `📥 Inbox (Keep in inbox for now)`
      ];

      const selectedFolder = await QuickAdd.suggester(
        folderOptions,
        ['Active', 'Paused', 'Inbox'],
        false,
        `Select status folder:\n\n${statusDecision.reason}`
      );

      if (selectedFolder === 'Inbox') {
        targetFolder = '03-Efforts';
      } else {
        targetFolder = `03-Efforts/${selectedFolder}`;
      }

      // Update status metadata (canonical CIS values)
      if (selectedFolder === 'Active') metadata.status = '🔄active';
      else if (selectedFolder === 'Paused') metadata.status = '⏸️paused';
      else metadata.status = '📥inbox';

    } else {
      targetFolder = `03-Efforts/${statusDecision.folder}`;
      metadata.status = statusDecision.status;
    }

    // 4. Apply project template if content is minimal
    const bodyContent = content.replace(/^---[\s\S]*?---\n/, '');
    const needsTemplate = bodyContent.trim().split(/\s+/).length < 20;

    let finalContent = content;

    if (needsTemplate) {
      const template = generateEffortTemplate();
      finalContent = content + '\n\n' + template;
    }

    // 5. Update frontmatter
    await updateFrontmatter(activeFile, finalContent, metadata);

    // 6. Move to target folder
    const fileName = activeFile.basename;
    const newPath = `${targetFolder}/${fileName}.md`;

    try {
      await app.fileManager.renameFile(activeFile, newPath);
      new Notice(`✅ Processed as Effort: ${fileName}\n📁 Moved to: ${targetFolder}\n📊 Status: ${metadata.status}`);
      const changedFields = buildChangedSummary(frontmatter, metadata);
      if (changedFields.length > 0) {
        new Notice(`📋 Fields updated:\n${changedFields.join('\n')}`, 6000);
      }
    } catch (error) {
      // If file already exists, suggest alternative name
      if (error.message.includes("already exists")) {
        const timestamp = window.moment().format('YYYYMMDDHHmmss');
        const altPath = `${targetFolder}/${fileName}-${timestamp}.md`;
        await app.fileManager.renameFile(activeFile, altPath);
        new Notice(`✅ Processed as Effort: ${fileName}\n📁 Moved to: ${targetFolder}\n⚠️ Renamed to avoid conflict`);
      } else {
        throw error;
      }
    }

    return {
      success: true,
      type: "effort",
      folder: targetFolder,
      status: metadata.status
    };

  } catch (error) {
    new Notice(`❌ Quick Process error: ${error.message}`);
    console.error("Quick Process - Effort error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Determine effort status based on deadline
 */
function determineEffortStatus(dueDate) {
  if (!dueDate || dueDate === '') {
    return {
      folder: 'Active',
      status: '🔄active',
      reason: 'No deadline set → Suggests Active (ongoing work)'
    };
  }

  const today = window.moment();
  const deadline = window.moment(dueDate);

  if (!deadline.isValid()) {
    return {
      folder: 'Active',
      status: '🔄active',
      reason: 'Invalid deadline format → Suggests Active'
    };
  }

  const daysUntil = deadline.diff(today, 'days');

  if (daysUntil < 0) {
    return {
      folder: 'Active',
      status: '🔄active',
      reason: `Deadline has passed (${Math.abs(daysUntil)} days ago) → Suggests Active (urgent action needed)`
    };
  }

  if (daysUntil <= 7) {
    return {
      folder: 'Active',
      status: '🔄active',
      reason: `Deadline in ${daysUntil} days → Suggests Active (immediate focus)`
    };
  }

  if (daysUntil <= 30) {
    return {
      folder: 'Active',
      status: '🔄active',
      reason: `Deadline in ${daysUntil} days → Suggests Active (active but not urgent)`
    };
  }

  return {
    folder: 'Paused',
    status: '⏸️paused',
    reason: `Deadline in ${daysUntil} days → Suggests Paused (future planning)`
  };
}

/**
 * Generate effort/project template
 */
function generateEffortTemplate() {
  return `
## 🎯 Goal

[What is the desired outcome?]

## 📋 Tasks

- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## 🧩 Subtasks

### Task 1
- [ ] Subtask 1.1
- [ ] Subtask 1.2

## 📝 Notes & Progress

[Document progress, blockers, and decisions here]

### ${window.moment().format('YYYY-MM-DD')}

[Initial notes]

## 🔗 Related

- Related project: [[]]
- Builds on: [[]]
- Dependencies: [[]]

## 📊 Milestones

- [ ] Milestone 1 - Due: YYYY-MM-DD
- [ ] Milestone 2 - Due: YYYY-MM-DD

## ✅ Success Criteria

1. [How will you know this is complete?]
2. [What does success look like?]

## 🚧 Blockers & Risks

- [Any blockers or risks?]

## 📚 Resources

- [[Resource 1]]
- [[Resource 2]]
`;
}

/**
 * Build a human-readable summary of which fields changed vs were kept
 */
function buildChangedSummary(original, updated) {
  const internal = ['position', 'frontmatterLinks', 'headings'];
  const changed = [];
  for (const [key, val] of Object.entries(updated)) {
    if (internal.includes(key)) continue;
    const origVal = original[key];
    if (JSON.stringify(val) !== JSON.stringify(origVal)) {
      const fmtVal = Array.isArray(val) ? val.join(', ') : val;
      if (origVal === undefined) {
        changed.push(`+ ${key}: ${fmtVal}`);
      } else {
        const fmtOrig = Array.isArray(origVal) ? origVal.join(', ') : origVal;
        changed.push(`~ ${key}: ${fmtOrig} → ${fmtVal}`);
      }
    }
  }
  return changed;
}

/**
 * Update file frontmatter
 */
async function updateFrontmatter(file, content, metadata) {
  // Parse existing frontmatter
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  let body = content;

  if (fmMatch) {
    body = content.slice(fmMatch[0].length);
  }

  // Serialize new frontmatter in proper order
  const orderedKeys = [
    'up', 'title', 'type', 'tags',
    'status', 'priority', 'completion',
    'created', 'modified', 'due',
    'related'
  ];

  const lines = ['---'];

  // Add fields in order
  for (const key of orderedKeys) {
    if (metadata[key] !== undefined && metadata[key] !== null && metadata[key] !== '') {
      const value = metadata[key];

      if (Array.isArray(value)) {
        if (value.length > 0) {
          lines.push(`${key}:`);
          for (const item of value) {
            lines.push(`  - ${item}`);
          }
        }
      } else {
        const v = typeof value === 'string' && value.startsWith('[[') ? `"${value}"` : value;
        lines.push(`${key}: ${v}`);
      }
    }
  }

  // Add any remaining fields not in ordered list
  for (const [key, value] of Object.entries(metadata)) {
    if (!orderedKeys.includes(key) && value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          lines.push(`${key}:`);
          for (const item of value) {
            lines.push(`  - ${item}`);
          }
        }
      } else if (typeof value !== 'object') {
        const v = typeof value === 'string' && value.startsWith('[[') ? `"${value}"` : value;
        lines.push(`${key}: ${v}`);
      }
    }
  }

  lines.push('---');

  // Build new content
  const newContent = lines.join('\n') + body;

  // Write back to file
  await app.vault.modify(file, newContent);
}
