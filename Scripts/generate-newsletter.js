// generate-newsletter.js — Newsletter Draft Generator
// Purpose: Gathers notes flagged with newsletter: true and assembles a draft
// Requires: QuickAdd (UserScript macro)
// Run: On demand via QuickAdd command
//
// Usage (QuickAdd): Add as UserScript in macro "📰 Generate Newsletter"
// Output: Creates a new note in 05-Calendar/Newsletter/

/**
 * Newsletter Generator
 *
 * Queries all notes where frontmatter newsletter: true, groups them by
 * maturity tier (Highlights = evergreen/fruit, New Ideas = seed/seedling,
 * Deep Dives = sapling+, Sources), renders a newsletter draft, then
 * clears the newsletter flag from included notes.
 *
 * Output Location: 05-Calendar/Newsletter/Newsletter YYYY-MM-DD.md
 */

module.exports = async (args) => {
  const { app, Notice } = window;

  try {
    new Notice("📰 Generating newsletter draft...");

    const now = new Date();
    const formatDate = (d) => d.toISOString().split('T')[0];
    const today = formatDate(now);

    // ============================================
    // GATHER FLAGGED NOTES
    // ============================================

    const allFiles = app.vault.getMarkdownFiles();
    const metadataCache = app.metadataCache;

    const getFM = (file) => metadataCache.getFileCache(file)?.frontmatter || {};

    // Find all notes with newsletter: true
    const flaggedFiles = allFiles.filter(f => {
      const fm = getFM(f);
      return fm.newsletter === true;
    });

    if (flaggedFiles.length === 0) {
      new Notice("📰 No notes flagged for newsletter. Add `newsletter: true` to notes you want to include.");
      return;
    }

    // ============================================
    // GROUP BY MATURITY TIER
    // ============================================

    const highlights = [];  // 🌲evergreen, 🍓fruit
    const newIdeas = [];    // 📤seed, 🌱seedling
    const deepDives = [];   // 🪴sapling
    const sources = [];     // type: source
    const other = [];       // everything else

    for (const file of flaggedFiles) {
      const fm = getFM(file);
      const entry = {
        link: `[[${file.basename}]]`,
        title: fm.title || file.basename,
        type: fm.type || "unknown",
        maturity: fm.maturity || "—",
        tags: Array.isArray(fm.tags) ? fm.tags : [],
        path: file.path
      };

      // Extract first paragraph as summary
      try {
        const content = await app.vault.read(file);
        const bodyStart = content.indexOf('---', content.indexOf('---') + 3);
        if (bodyStart !== -1) {
          const body = content.substring(bodyStart + 3).trim();
          const lines = body.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('>') && !l.startsWith('```'));
          entry.summary = lines[0] ? lines[0].substring(0, 200) : "";
        }
      } catch (e) {
        entry.summary = "";
      }

      if (fm.type === "source") {
        sources.push(entry);
      } else if (fm.maturity === "🌲evergreen" || fm.maturity === "🍓fruit") {
        highlights.push(entry);
      } else if (fm.maturity === "📤seed" || fm.maturity === "🌱seedling") {
        newIdeas.push(entry);
      } else if (fm.maturity === "🪴sapling") {
        deepDives.push(entry);
      } else {
        other.push(entry);
      }
    }

    // ============================================
    // RENDER NEWSLETTER DRAFT
    // ============================================

    const renderSection = (items) => {
      if (items.length === 0) return "*No items in this section.*\n";
      return items.map(item => {
        let line = `- **${item.link}**`;
        if (item.maturity !== "—") line += ` (${item.maturity})`;
        if (item.summary) line += `\n  > ${item.summary}`;
        return line;
      }).join('\n\n') + '\n';
    };

    const newsletterContent = `---
title: "Newsletter ${today}"
type: newsletter
status: 🔄active
created: ${today}
tags:
  - 📰newsletter
  - 📊report
related:
  - "[[👁️Dashboard]]"
  - "[[🧭 Review HQ]]"
---

# 📰 Newsletter — ${today}

> **Notes included**: ${flaggedFiles.length} | **Generated**: ${today}

---

## 🏆 Highlights

> Mature knowledge worth sharing — evergreen and fruit-stage notes.

${renderSection(highlights)}

---

## 💡 New Ideas

> Fresh captures and early-stage thinking — seeds and seedlings.

${renderSection(newIdeas)}

---

## 🔬 Deep Dives

> Developing knowledge gaining depth — sapling-stage notes.

${renderSection(deepDives)}

---

## 📚 Sources

> Referenced materials and external knowledge.

${renderSection(sources)}

${other.length > 0 ? `---

## 📝 Other

> Additional flagged notes.

${renderSection(other)}
` : ""}
---

## ✏️ Editor Notes

> [!todo]+ Before Publishing
> - [ ] Review and edit each section
> - [ ] Add personal commentary or transitions
> - [ ] Remove any items that aren't ready
> - [ ] Add a compelling intro paragraph
> - [ ] Check all links resolve correctly

---

*Generated by \`generate-newsletter.js\` — edit freely before publishing.*
*Navigate: [[👁️Dashboard]] | [[🧭 Review HQ]] | [[Query - Newsletter Queue]]*
`;

    // ============================================
    // WRITE NEWSLETTER FILE
    // ============================================

    const folderPath = "05-Calendar/Newsletter";
    const folder = app.vault.getAbstractFileByPath(folderPath);
    if (!folder) {
      await app.vault.createFolder(folderPath);
    }

    const filePath = `${folderPath}/Newsletter ${today}.md`;
    const existingFile = app.vault.getAbstractFileByPath(filePath);

    if (existingFile) {
      await app.vault.modify(existingFile, newsletterContent);
      new Notice(`📰 Updated: Newsletter ${today}`);
    } else {
      await app.vault.create(filePath, newsletterContent);
      new Notice(`📰 Created: Newsletter ${today}`);
    }

    // ============================================
    // CLEAR NEWSLETTER FLAGS
    // ============================================

    let cleared = 0;
    for (const file of flaggedFiles) {
      try {
        const content = await app.vault.read(file);
        // Replace newsletter: true with newsletter: false in frontmatter
        const updated = content.replace(/^(newsletter:\s*)true\s*$/m, "$1false");
        if (updated !== content) {
          await app.vault.modify(file, updated);
          cleared++;
        }
      } catch (e) {
        console.warn(`generate-newsletter: Failed to clear flag on ${file.path}:`, e);
      }
    }

    new Notice(`📰 Newsletter generated with ${flaggedFiles.length} notes. Cleared ${cleared} flags.`);

    // Open the newsletter
    const reportFile = app.vault.getAbstractFileByPath(filePath);
    if (reportFile) {
      await app.workspace.getLeaf().openFile(reportFile);
    }

  } catch (e) {
    console.error("generate-newsletter: Error:", e);
    new Notice(`⚠️ Newsletter generation failed: ${e.message}`);
  }
};
