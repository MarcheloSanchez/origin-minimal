---
in:
  - "[[04-Sources]]"
title: Obsidian Bases Setup Guide
type: source
fileClass: source
tags:
  - 📚source
status: 🔄active
maturity: 🪴sapling
processing_priority: normal
created: 2026-07-12
modified: 2026-07-12
read_status: completed
rating_type: 4
source_author: Obsidian community
source_date: 2025
source_type: guide
related:
  - "[[+About Sourcesℹ️]]"
---

> [!orbit] Wayfinder | [[04-Sources]] | [[+About Sourcesℹ️]]

## 📝 TL;DR — 5 bullets

- Obsidian Bases are relational databases built into Obsidian using inline fields and frontmatter metadata
- Configuration requires defining record types, fields, and templates; filters organize views by status/tag/folder
- Prerequisites: knowledge of YAML, inline fields (`key:: value`), and Obsidian file structure
- Common pitfalls: folder exclusions hide records, circular field references break queries, trailing spaces in field names cause lookup failures
- Troubleshooting: use dataview preview to test filter logic, verify fields exist in all records, check for hidden folders in .obsidian/app.json

## 💡 Key Insights

1. **Schema-First Design**: Before creating bases, define your data model (what fields each record type needs, which are required). This prevents refactoring later when you realize a field is missing in half your records.

2. **Folder Exclusion is Final**: Notes in excluded folders (99-System, Templates, 06-Archive) are completely invisible to Bases queries. This is intentional for privacy but critical to understand — you cannot filter your way out of an excluded folder.

3. **Inline Fields vs Frontmatter**: Frontmatter fields index faster and support typed queries; inline fields are more visible during writing. Hybrid approach works best: structured data in frontmatter, descriptive inline fields in body.

## ✍️ Quotes

> "The key to Bases is thinking of your vault as a database—each note is a record, each field is a column." (Obsidian documentation)

> "Filtering on a folder that's excluded is guaranteed to return zero results." (community troubleshooting tip)

## 🔗 Links / Related Dots

**Related to**:
- Dataview queries (similar filtering syntax, different rendering)
- Obsidian plugin architecture (Bases uses inline fields like other plugins)

**Supports**:
- Dashboard creation (Bases can feed into dashboard displays)
- Metadata organization (enforce consistent field presence across note types)

**Contradicts**:
- Manual browsing-based organization (Bases requires structured frontmatter discipline)

## ✅ Actions to try

- [ ] Define a data model for one note type (e.g., books: title, author, read_date, rating)
- [ ] Create 3-5 test records with the defined schema
- [ ] Build a Bases view to display records, sorted by date; verify all fields appear
- [ ] Test a filter condition (e.g., rating > 4) and confirm results match expectations
- [ ] Audit your .obsidian/app.json `userIgnoreFilters` — if records aren't showing, check if their folder is excluded

## Follow-up

Consider reading Obsidian's official Bases documentation or exploring community examples in the Obsidian forums. Bases works best when paired with Dataview for complex reporting and dashboard displays.

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
