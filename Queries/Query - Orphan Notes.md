---
title: Query Template - Orphan Notes
type: template
tags:
  - 📋template
  - 🔍query
created: 2026-02-05
modified: 2026-02-05
---

# Query Template: Orphan Notes

## Purpose
Identify disconnected notes for connection or cleanup during weekly review.

## Definition
An **orphan note** is one that:
- Has no `related` field entries, AND
- Has no incoming links (backlinks) from other notes

---

## Orphan Notes List

```dataviewjs
/**
 * QUERY: Find Orphan Notes
 * PURPOSE: Surface disconnected notes for review
 * EXCLUDES: 99-System, Templates, 06-Archive
 */
try {
  const orphans = dv.pages()
    .where(p =>
      !p.file.path.includes("99-System") &&
      !p.file.path.includes("Templates") &&
      !p.file.path.includes("06-Archive") &&
      (!p.related || p.related.length === 0) &&
      (!p.file.inlinks || p.file.inlinks.length === 0)
    )
    .sort(p => p.file.mtime, 'asc')
    .limit(20);

  if (orphans.length > 0) {
    dv.header(4, `🏝️ Orphan Notes (${orphans.length} shown)`);
    dv.table(
      ["Note", "Type", "Folder", "Last Modified"],
      orphans.map(p => [
        p.file.link,
        p.type ?? "—",
        p.file.folder,
        p.file.mtime.toFormat("yyyy-MM-dd")
      ])
    );
  } else {
    dv.paragraph("✅ No orphan notes found! Great connection health.");
  }
} catch (e) {
  dv.paragraph(`⚠️ Error finding orphans: ${e.message}`);
}
```

---

## Orphan Count Badge

```dataviewjs
try {
  const total = dv.pages().where(p =>
    !p.file.path.includes("99-System") &&
    !p.file.path.includes("Templates")
  ).length ?? 0;

  const orphans = dv.pages().where(p =>
    !p.file.path.includes("99-System") &&
    !p.file.path.includes("Templates") &&
    !p.file.path.includes("06-Archive") &&
    (!p.related || p.related.length === 0) &&
    (!p.file.inlinks || p.file.inlinks.length === 0)
  ).length ?? 0;

  const pct = total > 0 ? Math.round(orphans / total * 100) : 0;
  const status = pct <= 20 ? "🟢" : pct <= 35 ? "🟡" : "🔴";

  dv.paragraph(`${status} **${orphans}** orphan notes (${pct}% of vault)`);
} catch (e) {
  dv.span("⚠️");
}
```

---

## Orphans by Folder

```dataviewjs
try {
  const orphans = dv.pages().where(p =>
    !p.file.path.includes("99-System") &&
    !p.file.path.includes("Templates") &&
    !p.file.path.includes("06-Archive") &&
    (!p.related || p.related.length === 0) &&
    (!p.file.inlinks || p.file.inlinks.length === 0)
  );

  const byFolder = {};
  orphans.forEach(p => {
    const folder = p.file.folder || "Root";
    byFolder[folder] = (byFolder[folder] || 0) + 1;
  });

  const sorted = Object.entries(byFolder).sort((a, b) => b[1] - a[1]);

  if (sorted.length > 0) {
    dv.table(
      ["Folder", "Orphan Count"],
      sorted.slice(0, 10)
    );
  }
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## Quick Fixes for Orphans

| Action | When to Use |
|--------|-------------|
| **Add `related`** | Link to relevant MOC or topic |
| **Merge** | Combine with similar note |
| **Archive** | No longer relevant |
| **Delete** | Low value, no potential |

---

## Notes
- Target: <20% orphan notes in vault
- Review orphans during weekly review
- MOCs should link to orphans in their domain
