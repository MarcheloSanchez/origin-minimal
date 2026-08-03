---
up: "[[🗺️My PKM MOC]]"
title: My PKM Naming Convention
type: guide
tags: 
  - ⚙️system
  - 📋documentation
status: 🔄active
maturity: 🌱seedling
created: "2025-09-30"
modified: "2026-06-17"
related: 
  - "[[🏛️My PKM Governance]]"
  - "[[🏷️My PKM Tags]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[🏛️My PKM Governance]] | [[🔢My PKM Metadata]] | [[🔍My PKM Queries]] |  [[📁My PKM Folders]] |  [[🏷️My PKM Tags]] |  [[🔁My PKM Workflows]] | [[✅My PKM Tasks]] | ℹ️My PKM Naming Convention

## **1️⃣ Temporal Notes** _(Calendar poznámky)_

> Keep dates in `YYYY-MM-DD` for perfect chronological sorting.

```
📅 YYYY-MM-DD - Daily Note
📅 YYYY-MM-DD Weekly Review
📅 YYYY-MM Monthly Review
📅 YYYY-QQ Quarterly Planning
```

---

## **2️⃣ Projects & Efforts** _(Projekty a aktivity)_

> Status and phase in the title = instant context.

```
🚀 Project - [Name] - [Status]
🛠️ Effort - [Topic] - [Phase]
🤝 Meeting - YYYY-MM-DD - [Topic]
```

---

## **3️⃣ Knowledge Notes (Dots)** _(Atomické znalosti)_

> Short, sharp titles for quick linking.

```
💡 [Topic] - [Concept] - [Type]
💭 Idea - [Brief Description]
📚 Concept - [Term or Topic]
🗨️ Quote - [Source] - [Theme]
🔧 Tool - [Tool Name] - [Category]
```

---

## **4️⃣ Reference & Sources** _(Reference a zdroje)_

> Use clear attribution so you can find it later.

```
📚 Source - [Author] - [Title]
📖 Book - [Title] - [Author]
📰 Article - [Title] - [Publication]
🔬 Research - [Topic] - [Date]
```

---

## **5️⃣ System & Templates** _(Systémové soubory a šablony)_

> Functional and future-proof.

```
📄 Template - [Type] - [Purpose]
💻 Script - [Function] - [Description]
🗺️ MOC - [Topic Area]
📊 Dashboard - [Scope]
🔍 Query - [Metric/Focus] (in Templates/Queries/)
```

### Template Folder Structure
```
Templates/
  Meta/       {type}-meta.yaml.md      — YAML frontmatter blocks
  Body/       {type}-body.md           — Content structure
  Static/     {type}.md                — Standalone fallbacks
  Create/     new-{type}.md            — Creation templates
  Core/       _nav-*.md, _section-*.md — Shared snippets
  Queries/    Query - [Topic].md       — Reusable Dataview queries
  Calendar/   Template Daily/Weekly/Monthly/Quarterly/Yearly
  Kanban/     Template_Kanban*.md      — Board templates
  _Examples/  [Type] Filled Out.md     — Reference examples
```

---

## **6️⃣ Status Prefixes** _(Stavové prefixy)_

> Instantly see what's in draft, final, or review.

```
✏️ Draft - [Title]
✅ Final - [Title]
📦 Archived - [Original Title]
🔍 Review - [Title]
```

---

## 🔗 Related System Notes

- [[MOC - Visual Identity]] – Visual standards hub (emoji prefixes documented here)
- [[🗺️My PKM MOC]] – Parent PKM system
- [[🏛️My PKM Governance]] – System rules and standards
- [[🏷️My PKM Tags]] – Tag conventions with emoji-first format
- [[Learn Symbols & Abbreviations]]  

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
