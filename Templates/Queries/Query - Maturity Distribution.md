---
title: Query Template - Maturity Distribution
type: template
tags:
  - 📋template
  - 🔍query
created: 2026-02-05
modified: 2026-02-05
---

# Query Template: Maturity Distribution

## Purpose
Track knowledge development across maturity stages (Seed → Fruit pipeline).

## Maturity Stages

| Stage | Icon | Description | Exit Criteria |
|-------|------|-------------|---------------|
| Seed | 📤 | Raw capture | Metadata + folder |
| Seedling | 🌱 | Early development | 2+ links, structured |
| Sapling | 🪴 | Growing | 5+ links, 2+ backlinks |
| Evergreen | 🌲 | Stable | Frequently referenced |
| Fruit | 🍓 | Original insight | Published externally |

---

## Maturity Distribution Table

```dataview
TABLE WITHOUT ID
  maturity as "Stage",
  length(rows) as "Count"
FROM "02-Knowledge"
WHERE type = "atomic" AND maturity != null
GROUP BY maturity
SORT maturity ASC
```

---

## DataviewJS Distribution (Visual)

```dataviewjs
/**
 * QUERY: Maturity Stage Distribution
 * PURPOSE: Visualize knowledge development pipeline
 * DEPENDS ON: 02-Knowledge, maturity field
 */
try {
  const stages = ['📤seed', '🌱seedling', '🪴sapling', '🌲evergreen', '🍓fruit'];
  const counts = {};

  stages.forEach(s => {
    counts[s] = dv.pages('"02-Knowledge"').where(p => p.maturity === s).length ?? 0;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  dv.paragraph("**📊 Knowledge Maturity Pipeline**\n");
  stages.forEach(s => {
    const pct = total > 0 ? Math.round(counts[s] / total * 100) : 0;
    const bar = '█'.repeat(Math.round(pct / 5)) + '░'.repeat(20 - Math.round(pct / 5));
    dv.paragraph(`${s}: ${bar} ${counts[s]} (${pct}%)`);
  });
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## Ready for Promotion (Seedlings → Sapling)

```dataviewjs
/**
 * Notes ready for promotion based on link count
 */
try {
  const candidates = dv.pages('"02-Knowledge"')
    .where(p =>
      p.maturity === '🌱seedling' &&
      (p.file.outlinks?.length ?? 0) >= 5 &&
      (p.file.inlinks?.length ?? 0) >= 2
    )
    .limit(5);

  if (candidates.length > 0) {
    dv.header(4, "🎯 Ready for Promotion to 🪴Sapling");
    dv.list(candidates.map(p => p.file.link));
  } else {
    dv.paragraph("✅ No seedlings ready for promotion yet");
  }
} catch (e) {
  dv.paragraph(`⚠️ Error: ${e.message}`);
}
```

---

## Seeds Needing Attention

```dataview
LIST
FROM "02-Knowledge"
WHERE maturity = "📤seed" AND file.mtime < date(today) - dur(30 days)
SORT file.mtime ASC
LIMIT 10
```

---

## Notes
- Promotion should be based on link density and stability
- Seeds older than 30 days need review (process or delete)
- Fruit stage indicates external publication/sharing
