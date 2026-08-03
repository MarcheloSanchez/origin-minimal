// quick-process-source.js — One-click source note processing
// Purpose: Instantly process inbox note as source with intelligent defaults
// Requires: QuickAdd
// Run: When capturing external content (books, articles, videos, etc.)
//
// Usage (QuickAdd): Add as UserScript in macro

/**
 * Quick Process - Source
 * Workflow:
 * 1. Prompt for source URL (optional)
 * 2. Auto-populate metadata (type: source, status: 📥inbox)
 * 3. Suggest subfolder based on source type
 * 4. Move to 04-Sources/[subfolder]
 * 5. Apply template body for key insights
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

    new Notice("🔄 Processing as Source note...");

    // 1. Prompt for source URL and author
    let sourceUrl = frontmatter.url || '';
    let sourceAuthor = frontmatter.author || '';
    let sourceType = frontmatter['source-type'] || '';

    if (QuickAdd) {
      // URL
      const urlInput = await QuickAdd.inputPrompt(
        "Source URL (optional):",
        "https://...",
        sourceUrl
      );
      if (urlInput) sourceUrl = urlInput;

      // Author
      const authorInput = await QuickAdd.inputPrompt(
        "Author (optional):",
        "Author name",
        sourceAuthor
      );
      if (authorInput) sourceAuthor = authorInput;

      // Source type
      const sourceTypes = [
        "📚 Book",
        "📰 Article",
        "🎥 Video",
        "🎙️ Podcast",
        "📝 Guide/Tutorial",
        "📄 Documentation",
        "🎓 Course",
        "💬 Quote",
        "Other"
      ];

      const selectedType = await QuickAdd.suggester(
        sourceTypes,
        sourceTypes,
        false,
        "Select source type:"
      );

      if (selectedType) {
        // Extract emoji and name
        sourceType = selectedType.replace(/^[^\s]+\s/, ''); // Remove emoji
      }
    }

    // 2. Auto-populate metadata
    const metadata = { ...frontmatter };

    metadata.type = "source";
    metadata.status = "📥inbox";
    metadata['source-type'] = sourceType || "Unknown";

    if (sourceUrl) metadata.url = sourceUrl;
    if (sourceAuthor) metadata.author = sourceAuthor;

    // Auto-set dates
    if (!metadata.created) {
      metadata.created = window.moment(activeFile.stat.ctime).format('YYYY-MM-DD');
    }
    metadata.modified = window.moment().format('YYYY-MM-DD');

    // Auto-set tags
    if (!metadata.tags || metadata.tags.length === 0) {
      metadata.tags = ['📚source', '📥inbox'];
    } else {
      if (!metadata.tags.includes('📚source')) metadata.tags.push('📚source');
      if (!metadata.tags.includes('📥inbox')) metadata.tags.push('📥inbox');
    }

    // Set up link
    if (!metadata.up) {
      metadata.up = '[[04-Sources]]';
    }

    // Initialize rating (for later review)
    if (!metadata.rating) {
      metadata.rating = "";
    }

    // 3. Suggest subfolder based on source type
    const suggestedFolder = suggestSourceSubfolder(sourceType, content);

    let targetFolder;
    if (QuickAdd) {
      const useSubfolder = await QuickAdd.yesNoPrompt(
        "Folder Suggestion",
        `Suggested folder: ${suggestedFolder}\n\nUse this folder?`
      );

      if (useSubfolder) {
        targetFolder = suggestedFolder;
      } else {
        // Manual folder selection
        const folders = [
          "04-Sources/Books",
          "04-Sources/Articles",
          "04-Sources/Media",
          "04-Sources/Media",
          "04-Sources/Guides",
          "04-Sources/Meetings",
          "04-Sources/Articles",
          "04-Sources" // Root
        ];

        targetFolder = await QuickAdd.suggester(
          folders.map(f => f.replace('04-Sources/', '').replace('04-Sources', 'Root')),
          folders,
          false,
          "Select target folder:"
        );
      }
    } else {
      targetFolder = suggestedFolder;
    }

    // 4. Apply template body if content is minimal
    const bodyContent = content.replace(/^---[\s\S]*?---\n/, '');
    const needsTemplate = bodyContent.trim().split(/\s+/).length < 20;

    let finalContent = content;

    if (needsTemplate) {
      const template = generateSourceTemplate(sourceType);
      finalContent = content + '\n\n' + template;
    }

    // 5. Update frontmatter
    await updateFrontmatter(activeFile, finalContent, metadata);

    // 6. Move to target folder
    const fileName = activeFile.basename;
    const newPath = `${targetFolder}/${fileName}.md`;

    try {
      await app.fileManager.renameFile(activeFile, newPath);
      new Notice(`✅ Processed as Source: ${fileName}\n📁 Moved to: ${targetFolder}\n📚 Type: ${sourceType}`);
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
        new Notice(`✅ Processed as Source: ${fileName}\n📁 Moved to: ${targetFolder}\n⚠️ Renamed to avoid conflict`);
      } else {
        throw error;
      }
    }

    return {
      success: true,
      type: "source",
      folder: targetFolder,
      sourceType: sourceType
    };

  } catch (error) {
    new Notice(`❌ Quick Process error: ${error.message}`);
    console.error("Quick Process - Source error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Suggest source subfolder based on type
 */
function suggestSourceSubfolder(sourceType, content) {
  const typeMap = {
    'Book': '04-Sources/Books',
    'Article': '04-Sources/Articles',
    'Video': '04-Sources/Media',
    'Podcast': '04-Sources/Media',
    'Guide/Tutorial': '04-Sources/Guides',
    'Documentation': '04-Sources/Guides',
    'Course': '04-Sources/Articles',
    'Quote': '04-Sources/Articles',
    'Meeting': '04-Sources/Meetings'
  };

  // Try direct match
  if (typeMap[sourceType]) {
    return typeMap[sourceType];
  }

  // Fallback to content analysis
  const body = content.toLowerCase();

  if (body.includes('meeting') || body.includes('schůzka') || body.includes('participants')) {
    return '04-Sources/Meetings';
  }

  if (body.includes('video') || body.includes('watch') || body.includes('youtube')) {
    return '04-Sources/Media';
  }

  if (body.includes('podcast') || body.includes('listen') || body.includes('episode')) {
    return '04-Sources/Media';
  }

  if (body.includes('book') || body.includes('kniha') || body.includes('chapter')) {
    return '04-Sources/Books';
  }

  if (body.includes('article') || body.includes('článek') || body.includes('blog')) {
    return '04-Sources/Articles';
  }

  if (body.includes('guide') || body.includes('tutorial') || body.includes('how to')) {
    return '04-Sources/Guides';
  }

  // Default
  return '04-Sources';
}

/**
 * Generate template body for source notes
 */
function generateSourceTemplate(sourceType) {
  const templates = {
    'Book': `
## 📖 Summary

[Brief summary of the book's main thesis]

## 🎯 Key Insights

- **Insight 1**: [Description]
- **Insight 2**: [Description]
- **Insight 3**: [Description]

## 💡 Key Takeaways

- [ ] Actionable takeaway 1
- [ ] Actionable takeaway 2
- [ ] Actionable takeaway 3

## 🔗 Connections

- Related to: [[]]
- Builds on: [[]]
- Contrasts with: [[]]

## 📝 Notes by Chapter

### Chapter 1: [Title]

[Your notes]

## ⭐ Rating & Review

**Rating**: [1-5 stars]

**Would recommend to**: [Who would benefit from this]

**Best for**: [Context or situation]
`,
    'Article': `
## 📄 Summary

[1-2 sentence summary of the article]

## 🎯 Key Points

- Point 1
- Point 2
- Point 3

## 💡 Insights & Applications

[What did you learn? How can you apply this?]

## 🔗 Related

- [[]]
`,
    'Video': `
## 🎥 Summary

[Brief description of video content]

## ⏱️ Timestamps & Key Moments

- 00:00 - [Topic]
- 00:00 - [Topic]

## 💡 Key Takeaways

- Takeaway 1
- Takeaway 2
- Takeaway 3

## 🔗 Related

- [[]]
`,
    'Podcast': `
## 🎙️ Episode Summary

[Brief description]

## 👥 Participants

- Host: [Name]
- Guest: [Name]

## 🎯 Key Topics

- Topic 1
- Topic 2
- Topic 3

## 💡 Key Insights

- Insight 1
- Insight 2

## 🔗 Related

- [[]]
`,
    'Guide/Tutorial': `
## 🎯 Goal

[What does this guide teach?]

## 📝 Step-by-Step Notes

1. [Step 1]
2. [Step 2]
3. [Step 3]

## 💡 Key Learnings

- Learning 1
- Learning 2

## 🔗 Related

- [[]]
`,
    'Quote': `
## 💬 Quote

> [The quote]

## 🧠 Context

[Where is this from? What's the context?]

## 💡 Why This Matters

[Your interpretation and why it resonates]

## 🔗 Related

- [[]]
`,
    'Meeting': `
## 🤝 Meeting Details

**Date**: ${window.moment().format('YYYY-MM-DD')}
**Type**: [Type]

## 👥 Participants

- [Name 1]
- [Name 2]

## 📋 Agenda

- [ ] Topic 1
- [ ] Topic 2

## 📝 Notes

[Discussion notes]

## ✅ Action Items

- [ ] [Action 1] - @person - Due: YYYY-MM-DD
- [ ] [Action 2] - @person - Due: YYYY-MM-DD

## 🔗 Related

- [[]]
`
  };

  return templates[sourceType] || `
## 📝 Summary

[Brief summary]

## 💡 Key Points

- Point 1
- Point 2

## 🔗 Related

- [[]]
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
    'status', 'source-type', 'author', 'url', 'rating',
    'created', 'modified', 'related'
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
