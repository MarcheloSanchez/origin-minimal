---
title: Newsletter Queue
type: system
tags: [📊report, 📰newsletter]
---

# 📰 Newsletter Queue

> Notes flagged for newsletter inclusion (`newsletter: true`)

## Ready for Newsletter

```dataviewjs
/**
 * QUERY: Newsletter-flagged notes
 * PURPOSE: Gather all notes with newsletter: true, grouped by type
 * DEPENDS ON: newsletter frontmatter field
 */
try {
  const pages = dv.pages()
    .where(p => p.newsletter === true)
    .sort(p => p.file.mtime, 'desc');

  if (pages.length === 0) {
    dv.paragraph("*No notes flagged for newsletter. Add `newsletter: true` to a note's frontmatter to include it.*");
  } else {
    dv.table(
      ["Note", "Type", "Maturity", "Modified"],
      pages.map(p => [
        p.file.link,
        p.type || "—",
        p.maturity || "—",
        p.file.mtime ? p.file.mtime.toFormat("yyyy-MM-dd") : "—"
      ])
    );
    dv.paragraph(`**Total**: ${pages.length} notes queued`);
  }
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```
