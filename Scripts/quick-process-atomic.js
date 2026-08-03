// quick-process-atomic.js — One-click atomic note processing
// Purpose: Instantly process inbox note as atomic with intelligent defaults
// Requires: QuickAdd
// Run: When you know a note should be atomic knowledge
//
// Usage (QuickAdd): Add as UserScript in macro

/**
 * Quick Process - Atomic
 * Workflow:
 * 1. Prompt for title refinement (optional)
 * 2. Auto-populate metadata (type: atomic, maturity: calculated)
 * 3. Suggest subfolder based on keywords
 * 4. Move to 02-Knowledge/Atomics/[subfolder]
 * 5. Open for editing
 *
 * Expected processing time: 10-15 seconds vs 2-3 minutes manual
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

    new Notice("🔄 Processing as Atomic note...");

    // 1. Title refinement (optional)
    let finalTitle = activeFile.basename;

    if (QuickAdd) {
      const refineTitle = await QuickAdd.yesNoPrompt(
        "Refine Title?",
        `Current title: "${finalTitle}"\n\nDo you want to refine the title?`
      );

      if (refineTitle) {
        const newTitle = await QuickAdd.inputPrompt(
          "Enter refined title:",
          "New title",
          finalTitle
        );
        if (newTitle && newTitle !== finalTitle) {
          finalTitle = newTitle;
        }
      }
    }

    // 2. Auto-populate metadata
    const metadata = { ...frontmatter };

    metadata.type = "atomic";
    metadata.title = finalTitle;

    // Calculate maturity based on content
    metadata.maturity = calculateMaturity(content);

    // Auto-set dates
    if (!metadata.created) {
      metadata.created = window.moment(activeFile.stat.ctime).format('YYYY-MM-DD');
    }
    metadata.modified = window.moment().format('YYYY-MM-DD');

    // Auto-set tags
    if (!metadata.tags || metadata.tags.length === 0) {
      metadata.tags = ['💡atomic'];
    } else if (!metadata.tags.includes('💡atomic')) {
      metadata.tags.push('💡atomic');
    }

    // Set up link
    if (!metadata.up) {
      metadata.up = '[[02-Knowledge]]';
    }

    // Extract related links from content
    if (!metadata.related || metadata.related.length === 0) {
      metadata.related = extractRelatedLinks(content);
    }

    // 3. Suggest subfolder based on keywords
    const suggestedSubfolder = suggestAtomicSubfolder(content, finalTitle);

    let targetFolder;
    if (QuickAdd && suggestedSubfolder.confidence > 0.7) {
      const useSubfolder = await QuickAdd.yesNoPrompt(
        "Folder Suggestion",
        `Suggested folder: ${suggestedSubfolder.folder}\nConfidence: ${Math.round(suggestedSubfolder.confidence * 100)}%\n\nUse this folder?`
      );

      if (useSubfolder) {
        targetFolder = suggestedSubfolder.folder;
      } else {
        // Manual folder selection
        const folders = [
          "02-Knowledge/Atomics/Ideas",
          "02-Knowledge/Atomics/Concepts",
          "02-Knowledge/Atomics/Frameworks",
          "02-Knowledge/Atomics/Principles",
          "02-Knowledge/Atomics/Patterns",
          "02-Knowledge/Atomics/Mental-Models",
          "02-Knowledge/Atomics" // Root
        ];

        targetFolder = await QuickAdd.suggester(
          folders.map(f => f.replace('02-Knowledge/Atomics/', '').replace('02-Knowledge/Atomics', 'Root')),
          folders,
          false,
          "Select target folder:"
        );
      }
    } else {
      targetFolder = "02-Knowledge/Atomics";
    }

    // 4. Update frontmatter
    await updateFrontmatter(activeFile, content, metadata);

    // 5. Move to target folder
    const newPath = `${targetFolder}/${finalTitle}.md`;

    try {
      await app.fileManager.renameFile(activeFile, newPath);
      new Notice(`✅ Processed as Atomic: ${finalTitle}\n📁 Moved to: ${targetFolder}`);
      const changedFields = buildChangedSummary(frontmatter, metadata);
      if (changedFields.length > 0) {
        new Notice(`📋 Fields updated:\n${changedFields.join('\n')}`, 6000);
      }
    } catch (error) {
      // If file already exists, suggest alternative name
      if (error.message.includes("already exists")) {
        const timestamp = window.moment().format('YYYYMMDDHHmmss');
        const altPath = `${targetFolder}/${finalTitle}-${timestamp}.md`;
        await app.fileManager.renameFile(activeFile, altPath);
        new Notice(`✅ Processed as Atomic: ${finalTitle}\n📁 Moved to: ${targetFolder}\n⚠️ Renamed to avoid conflict`);
      } else {
        throw error;
      }
    }

    return {
      success: true,
      type: "atomic",
      folder: targetFolder,
      maturity: metadata.maturity
    };

  } catch (error) {
    new Notice(`❌ Quick Process error: ${error.message}`);
    console.error("Quick Process - Atomic error:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Calculate maturity based on content depth
 */
function calculateMaturity(content) {
  // Remove frontmatter
  const body = content.replace(/^---[\s\S]*?---\n/, '');

  const wordCount = body.split(/\s+/).filter(w => w.length > 0).length;
  const hasHeadings = /^#{1,6}\s/m.test(body);
  const hasLinks = /\[\[.*?\]\]/.test(body);
  const hasCodeBlocks = /```/.test(body);
  const hasLists = /^[-*+]\s/m.test(body);

  // Score-based maturity
  let score = 0;

  if (wordCount > 500) score += 3;
  else if (wordCount > 200) score += 2;
  else if (wordCount > 50) score += 1;

  if (hasHeadings) score += 1;
  if (hasLinks) score += 1;
  if (hasCodeBlocks) score += 1;
  if (hasLists) score += 1;

  // Map score to maturity level
  if (score >= 7) return '🌲evergreen';
  if (score >= 5) return '🪴sapling';
  if (score >= 3) return '🌱seedling';
  return '📤seed';
}

/**
 * Suggest atomic subfolder based on content analysis
 */
function suggestAtomicSubfolder(content, title) {
  const body = content.replace(/^---[\s\S]*?---\n/, '');
  const combined = `${title} ${body}`.toLowerCase();

  const folderKeywords = {
    'Ideas': ['idea', 'nápad', 'brainstorm', 'inspiration', 'inspirace', 'thought', 'myšlenka'],
    'Concepts': ['concept', 'koncept', 'theory', 'teorie', 'model', 'definition', 'definice'],
    'Frameworks': ['framework', 'rámec', 'methodology', 'metodika', 'approach', 'přístup', 'system', 'systém'],
    'Principles': ['principle', 'princip', 'law', 'zákon', 'rule', 'pravidlo', 'axiom'],
    'Patterns': ['pattern', 'vzor', 'template', 'šablona', 'anti-pattern', 'recipe', 'recept'],
    'Mental-Models': ['mental model', 'mentální model', 'thinking', 'myšlení', 'cognitive', 'kognitivní', 'bias']
  };

  const scores = {};
  let maxScore = 0;
  let bestFolder = null;

  for (const [folder, keywords] of Object.entries(folderKeywords)) {
    scores[folder] = 0;

    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi');
      const matches = combined.match(regex);
      if (matches) {
        scores[folder] += matches.length;
      }
    }

    if (scores[folder] > maxScore) {
      maxScore = scores[folder];
      bestFolder = folder;
    }
  }

  if (maxScore > 0) {
    return {
      folder: `02-Knowledge/Atomics/${bestFolder}`,
      confidence: Math.min(maxScore / 5, 1) // Normalize
    };
  }

  return {
    folder: '02-Knowledge/Atomics',
    confidence: 0.3
  };
}

/**
 * Extract related links from content
 */
function extractRelatedLinks(content) {
  const linkMatches = content.matchAll(/\[\[(.*?)\]\]/g);
  const links = [];

  for (const match of linkMatches) {
    const linkText = match[1].split('|')[0]; // Handle aliases
    if (!linkText.includes('/')) { // Skip folder references
      links.push(`[[${linkText}]]`);
    }
  }

  return links.slice(0, 5); // Top 5
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
 * Update file frontmatter using Obsidian's safe processFrontMatter API
 *
 * Replaces the previous hand-rolled YAML serializer, which had the same bug
 * class fixed in auto-metadata.js on 2026-07-26: it duplicated array items
 * and mangled quoted values because it rebuilt the frontmatter block as text
 * instead of mutating the parsed object. processFrontMatter handles
 * parsing/serialization correctly and preserves unmanaged fields untouched.
 */
async function updateFrontmatter(file, content, metadata) {
  const managedFields = [
    'up', 'title', 'type', 'tags', 'maturity', 'created', 'modified', 'related'
  ];

  await app.fileManager.processFrontMatter(file, (fm) => {
    for (const field of managedFields) {
      if (metadata[field] === undefined || metadata[field] === null) continue;
      fm[field] = metadata[field];
    }
  });
}
