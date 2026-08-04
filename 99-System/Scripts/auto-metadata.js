// auto-metadata.js — Automatic metadata population and enrichment
// Purpose: Fill in missing frontmatter fields with intelligent defaults
// Requires: QuickAdd or Templater
// Run: On new notes or during batch processing
//
// Usage (QuickAdd): Add as UserScript in macro
// Usage (Templater): <%* await tp.user.auto_metadata() %>

/**
 * Auto-Metadata System
 * Automatically populates missing frontmatter fields:
 * - created, modified dates
 * - up (parent link)
 * - related (suggestions based on content)
 * - tags (based on type and content)
 * - status (if applicable)
 * - maturity (for atomics)
 */

module.exports = async (args) => {
  const { app, Notice } = window;

  try {
    // Get current file or process multiple files
    const filesToProcess = args?.files || [app.workspace.getActiveFile()];

    if (!filesToProcess || filesToProcess.length === 0) {
      new Notice("❌ No files to process");
      return;
    }

    let processedCount = 0;
    let updatedCount = 0;
    const singleFileMode = filesToProcess.filter(f => f).length === 1;
    const fieldCounts = {};   // field name → how many files it changed in
    let lastChanges = [];
    let lastBasename = '';

    for (const file of filesToProcess) {
      if (!file) continue;

      const result = await processFile(file);
      processedCount++;

      if (result.updated) {
        updatedCount++;
      }

      lastChanges = result.changes || [];
      lastBasename = file.basename;

      // Tally per-field change counts for the aggregate summary; full per-file
      // detail always goes to the console so a batch run stays inspectable.
      for (const line of lastChanges) {
        const field = line.slice(2).split(':')[0];
        fieldCounts[field] = (fieldCounts[field] || 0) + 1;
      }
      if (lastChanges.length > 0) {
        console.log(`Auto-metadata — ${file.path}\n${lastChanges.join('\n')}`);
      }
    }

    // Single file → show the exact per-field diff.
    // Many files → one aggregate Notice only (no per-file Notice spam).
    if (singleFileMode) {
      if (lastChanges.length > 0) {
        new Notice(`✅ Auto-metadata: ${lastBasename}`);
        new Notice(`📋 Fields updated:\n${lastChanges.join('\n')}`, 6000);
      } else {
        new Notice(`✅ Auto-metadata: ${lastBasename}\n📋 No changes needed`);
      }
    } else {
      new Notice(`✅ Processed ${processedCount} files, updated ${updatedCount}`);

      const summaryLines = Object.entries(fieldCounts)
        .map(([field, count]) => `${field} ×${count}`);

      if (summaryLines.length > 0) {
        new Notice(`📋 Fields updated:\n${summaryLines.join('\n')}\n(per-file detail in console)`, 6000);
      } else {
        new Notice('📋 No changes needed');
      }
    }

    return {
      processed: processedCount,
      updated: updatedCount
    };

  } catch (error) {
    new Notice(`❌ Auto-metadata error: ${error.message}`);
    console.error("Auto-metadata error:", error);
  }
};

/**
 * Process a single file
 */
async function processFile(file) {
  const content = await app.vault.read(file);
  const cache = app.metadataCache.getFileCache(file);
  const frontmatter = cache?.frontmatter || {};

  let updated = false;
  const newMetadata = { ...frontmatter };

  // 1. Created date (if missing)
  if (!newMetadata.created) {
    newMetadata.created = window.moment(file.stat.ctime).format('YYYY-MM-DD');
    updated = true;
  }

  // 2. Modified date (always update to current)
  const currentModified = window.moment().format('YYYY-MM-DD');
  if (newMetadata.modified !== currentModified) {
    newMetadata.modified = currentModified;
    updated = true;
  }

  // 3. Type (if missing) - use folder-based detection
  if (!newMetadata.type || newMetadata.type === 'undefined') {
    newMetadata.type = detectTypeFromPath(file.path);
    updated = true;
  }

  // 4. Status (if missing and type requires it)
  const statusTypes = ['effort', 'source', 'meeting', 'atomic', 'area', 'person', 'place', 'tool', 'moc'];
  if (!newMetadata.status && statusTypes.includes(newMetadata.type)) {
    newMetadata.status = '📥inbox';
    updated = true;
  }

  // 5. Maturity (for atomics if missing)
  if (newMetadata.type === 'atomic' && !newMetadata.maturity) {
    newMetadata.maturity = calculateMaturity(content);
    updated = true;
  }

  // 6. Tags (ensure at least type-based tag)
  if (!newMetadata.tags || newMetadata.tags.length === 0) {
    newMetadata.tags = generateDefaultTags(newMetadata.type, file.path);
    updated = true;
  }

  // 7. Up (parent link) - suggest based on folder, always in wikilink form
  if (!newMetadata.up) {
    newMetadata.up = toWikilink(suggestParentLink(file.path));
    updated = true;
  } else {
    // Heal an existing value that is not in canonical wikilink form
    const normalizedUp = toWikilink(newMetadata.up);
    if (normalizedUp !== newMetadata.up) {
      newMetadata.up = normalizedUp;
      updated = true;
    }
  }

  // 8. Related notes (suggest based on content and backlinks)
  if (!newMetadata.related || newMetadata.related.length === 0) {
    const suggestions = await suggestRelatedNotes(file, content);
    if (suggestions.length > 0) {
      newMetadata.related = suggestions;
      updated = true;
    }
  } else if (typeof newMetadata.related === 'string') {
    // Scalar related: keep it scalar, only normalize the link form
    const normalizedRelated = toWikilink(newMetadata.related);
    if (normalizedRelated !== newMetadata.related) {
      newMetadata.related = normalizedRelated;
      updated = true;
    }
  } else if (Array.isArray(newMetadata.related)) {
    // Existing list: normalize each entry, keep order, keep user-authored values
    const normalizedRelated = toWikilinkList(newMetadata.related);
    if (JSON.stringify(normalizedRelated) !== JSON.stringify(newMetadata.related)) {
      newMetadata.related = normalizedRelated;
      updated = true;
    }
  }

  // 9. Title (use filename if missing)
  if (!newMetadata.title) {
    newMetadata.title = file.basename;
    updated = true;
  }

  // Write back if updated
  let changes = [];
  if (updated) {
    changes = await updateFrontmatter(file, content, newMetadata);
  }

  return { updated, metadata: newMetadata, changes };
}

/**
 * Normalize a single value into the vault's canonical frontmatter wikilink form.
 *
 * The YAML value must end up as a quoted wikilink string ("[[Note]]" — see the
 * origin-yaml skill). The quoting itself is done by Obsidian's YAML serializer,
 * which always quotes a scalar starting with "[", so this helper only has to
 * guarantee the value is exactly one [[...]] pair.
 *
 * Idempotent: already-linked values come back unchanged, and accidental
 * double-wrapping ([[[[X]]]]) or baked-in quote characters are collapsed.
 */
function toWikilink(value) {
  // An unquoted wikilink re-parses as a nested flow array ([[X]] -> [['X']]);
  // unwrap that so the corrupted form heals instead of being skipped.
  if (Array.isArray(value) && value.length === 1) return toWikilink(value[0]);
  if (typeof value !== 'string') return value;

  let raw = value.trim();
  if (!raw) return raw;

  raw = raw.replace(/^["']+|["']+$/g, '').trim();   // strip literal quote chars
  const inner = raw.replace(/^\[+|\]+$/g, '').trim(); // strip all bracket layers
  if (!inner) return '';

  return `[[${inner}]]`;
}

/**
 * Normalize a list of values into wikilink form, dropping empties and duplicates
 * while preserving the original order.
 */
function toWikilinkList(values) {
  const list = Array.isArray(values) ? values : [values];
  const seen = new Set();
  const out = [];

  for (const value of list) {
    const link = toWikilink(value);
    if (!link || typeof link !== 'string' || seen.has(link)) continue;
    seen.add(link);
    out.push(link);
  }

  return out;
}

/**
 * Format a frontmatter value for the change-summary Notice
 */
function formatValue(value) {
  if (value === undefined || value === null || value === '') return '(empty)';
  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(v => formatValue(v)).join(', ') : '(empty)';
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/**
 * Compare two frontmatter values for equality (arrays/objects included)
 */
function sameValue(a, b) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/**
 * Detect note type from file path
 */
function detectTypeFromPath(path) {
  if (path.includes('+Inbox')) return 'undefined';
  if (path.includes('01-MOCs')) return 'moc';
  if (path.includes('02-Knowledge/Atomics')) return 'atomic';
  if (path.includes('02-Knowledge/Areas')) return 'area';
  if (path.includes('02-Knowledge/People')) return 'person';
  if (path.includes('02-Knowledge/Places')) return 'place';
  if (path.includes('02-Knowledge/Tools')) return 'tool';
  if (path.includes('02-Knowledge')) return 'atomic';
  if (path.includes('03-Efforts')) return 'effort';
  if (path.includes('04-Sources/Meetings')) return 'meeting';
  if (path.includes('04-Sources')) return 'source';
  if (path.includes('05-Calendar/Daily')) return 'daily';
  if (path.includes('05-Calendar/Weekly')) return 'weekly';
  if (path.includes('05-Calendar/Monthly')) return 'monthly';
  if (path.includes('05-Calendar/Quarterly')) return 'quarterly';
  if (path.includes('05-Calendar/Yearly')) return 'yearly';
  if (path.includes('99-System/Prompts')) return 'prompt';

  return 'undefined';
}

// Canonical maturity emoji values — keep in sync with metrics-core.js MATURITY_STAGES
const MV = {
  SEED:      '📤seed',
  SEEDLING:  '🌱seedling',
  SAPLING:   '🪴sapling',
  EVERGREEN: '🌲evergreen',
  FRUIT:     '🍓fruit'
};

/**
 * Calculate maturity based on content depth (word count + structural signals).
 * Uses a different algorithm than maturity-promoter.js (link counts) — both are
 * intentional: this is used at creation time when link counts are near zero.
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

  // Map score to maturity level (fruit not auto-assigned — requires human judgment)
  if (score >= 7) return MV.EVERGREEN;
  if (score >= 5) return MV.SAPLING;
  if (score >= 3) return MV.SEEDLING;
  return MV.SEED;
}

/**
 * Generate default tags based on type
 */
function generateDefaultTags(type, path) {
  const tags = [];

  // Type-based tags
  const typeTagMap = {
    'atomic': ['💡atomic'],
    'effort': ['🚀effort', '📥inbox'],
    'source': ['📚source', '📥inbox'],
    'meeting': ['🤝meeting', '📥inbox'],
    'moc': ['🗺️MOC'],
    'prompt': ['🤖AI/prompt'],
    'daily': ['📅daily']
  };

  if (typeTagMap[type]) {
    tags.push(...typeTagMap[type]);
  }

  // Folder-based contextual tags
  if (path.includes('+Inbox')) tags.push('📥inbox');
  if (path.includes('03-Efforts')) tags.push('🚀effort');

  return tags.length > 0 ? tags : [];
}

/**
 * Suggest parent link based on folder structure
 */
function suggestParentLink(path) {
  // Default home
  let parent = '[[🏡Home]]';

  // Folder-specific parents
  if (path.includes('01-MOCs')) parent = '[[01-MOCs]]';
  if (path.includes('02-Knowledge/Atomics')) parent = '[[Atomics]]';
  if (path.includes('02-Knowledge/Areas')) parent = '[[Areas]]';
  if (path.includes('02-Knowledge/People')) parent = '[[People]]';
  if (path.includes('02-Knowledge/Places')) parent = '[[Places]]';
  if (path.includes('02-Knowledge/Tools')) parent = '[[Tools]]';
  if (path.includes('02-Knowledge')) parent = '[[02-Knowledge]]';
  if (path.includes('03-Efforts')) parent = '[[03-Efforts]]';
  if (path.includes('04-Sources/Meetings')) parent = '[[Meetings]]';
  if (path.includes('04-Sources')) parent = '[[04-Sources]]';
  if (path.includes('05-Calendar')) parent = '[[05-Calendar]]';
  if (path.includes('99-System/Prompts')) parent = '[[99-System/Prompts]]';

  return parent;
}

/**
 * Suggest related notes based on content and backlinks
 */
async function suggestRelatedNotes(file, content) {
  const suggestions = [];

  // 1. Extract existing wikilinks from content
  const linkMatches = content.matchAll(/\[\[(.*?)\]\]/g);
  const contentLinks = new Set();

  for (const match of linkMatches) {
    const linkText = match[1].split('|')[0]; // Handle aliases
    contentLinks.add(linkText);
  }
  // NOTE: contentLinks holds bare titles here — toWikilinkList() below turns
  // every suggestion (content links and backlinks alike) into [[Title]] form.

  // 2. Get backlinks to this note
  const cache = app.metadataCache.getFileCache(file);
  const backlinks = app.metadataCache.getBacklinksForFile(file);

  // 3. Combine content links and backlinks (limit to 5)
  const allLinks = Array.from(contentLinks);

  if (backlinks && backlinks.data) {
    for (const [path, refs] of Object.entries(backlinks.data)) {
      const linkedFile = app.vault.getAbstractFileByPath(path);
      if (linkedFile && allLinks.length < 5) {
        allLinks.push(`[[${linkedFile.basename}]]`);
      }
    }
  }

  // Return top 5 suggestions, each in canonical wikilink form
  return toWikilinkList(allLinks).slice(0, 5);
}

/**
 * Update file frontmatter using Obsidian's safe processFrontMatter API
 *
 * This replaces the previous hand-rolled YAML parser approach which had bugs:
 * - Array duplication (first item pushed twice)
 * - Quote mangling in nested objects
 *
 * The processFrontMatter API handles YAML parsing/serialization correctly and
 * preserves all unmanaged fields (type-specific fields, custom objects, etc.)
 * without modification.
 *
 * Returns a list of `field: old → new` lines describing what actually changed on
 * disk (snapshot taken inside the callback, before mutation) — used for the
 * change-summary Notice.
 */
async function updateFrontmatter(file, content, metadata) {
  const managedFields = [
    'created', 'modified', 'type', 'status', 'maturity', 'tags', 'up', 'related', 'title'
  ];

  const changes = [];

  // Use Obsidian's official processFrontMatter API to safely update frontmatter
  // The callback receives the parsed frontmatter object and can mutate it directly
  await app.fileManager.processFrontMatter(file, (fm) => {
    // Only set managed fields; leave everything else untouched
    for (const field of managedFields) {
      if (metadata[field] === undefined || metadata[field] === null) continue;

      const before = fm[field];
      const after = metadata[field];

      if (!sameValue(before, after)) {
        const marker = before === undefined ? '+' : '~';
        changes.push(`${marker} ${field}: ${formatValue(before)} → ${formatValue(after)}`);
      }

      fm[field] = after;
    }
  });

  return changes;
}
