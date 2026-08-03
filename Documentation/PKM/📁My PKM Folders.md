---
up: "[[🗺️My PKM MOC]]"
title: PKM Folder Structure
type: system
tags: 
  - ⚙️system
  - 📋documentation
status: 🔄active
maturity: 🌱seedling
created: "2025-09-30"
modified: "2026-06-17"
related: 
  - "[[🗺️My PKM MOC]]"
  - "[[🔁My PKM Workflows]]"
  - "[[🏷️My PKM Tags]]"
  - "[[ℹ️My PKM Naming Convention]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[🏛️My PKM Governance]] | [[🔢My PKM Metadata]] | [[🔍My PKM Queries]] | 📁My PKM Folders |  [[🏷️My PKM Tags]] |  [[🔁My PKM Workflows]] | [[✅My PKM Tasks]] | [[ℹ️My PKM Naming Convention]]

## 🏗️ Structure

> Every important type has its own - [[MOC - About Notesℹ️]]

**Folder contract:** Every content folder carries three structural elements — an `+About` contract note (folder purpose, what belongs), a hub note named `<folder-name>.md` (reference and navigation), and a `_*_Data.base` Bases file (metadata scaffold). These three ship with every release and anchor the folder's purpose and governance.

| 📂 Folder      | 🎯 Purpose                               | 🏷 Key Tags   | 🔄 Main Workflow Stage |
| -------------- | ---------------------------------------- | ------------- | ---------------------- |
| `+Inbox`       | Capture anything quickly                 | `#📥inbox`    | Capture → Process      |
| `01-MOCs`      | Maps of Content for navigation           | `#🗺️MOC`     | Organize → Navigate    |
| `02-Knowledge` | Atomic knowledge & ideas                 | `#💡atomic`   | Develop → Connect      |
| `03-Efforts`   | Active projects & long-term initiatives  | `#🚀effort`   | Execute → Track        |
| `04-Sources`   | Reference material & research            | `#📚source`   | Reference → Cite       |
| `05-Calendar`  | Daily/weekly/monthly notes & reflections | `#📅daily`    | Reflect → Archive      |
| `06-Archive`   | Completed / inactive items               | `#📦archived` | Store → Protect        |
| `07-Prompts`   | AI prompt library & playbooks            | `#🤖AI/prompt` | Reference → Reuse     |
| `99-System`    | Infrastructure, templates, scripts       | `#⚙️system`   | Maintain → Optimize    |
| `AIOS`         | Claude-Code AI orchestration layer       | `-`           | Maintain → Optimize    |
| `Templates`    | Reusable note templates & snippets       | `-`           | Maintain → Optimize    |

## How to print out list of folders 
#📖guide 
```
in command line in such folder. SEND these commands:

tree /a /f | clip 

/f - files
```

# v2.0 Structure

```
Origin Vault/
├── +Inbox/              ← Capture landing zone (process daily)
├── 01-MOCs/             ← Maps of Content (navigation hubs)
├── 02-Knowledge/        ← Atomic knowledge units
│   ├── Areas/           ← Areas of responsibility (ongoing life domains)
│   │   ├── Health.md
│   │   ├── Finance.md
│   │   ├── Career.md
│   │   ├── Relationships.md
│   │   └── Personal.md
│   ├── Atomics/         ← Single-idea knowledge notes
│   │   ├── Concepts/    ← Concepts (how something works)
│   │   ├── Ideas/       ← Ideas (💡 generative)
│   │   ├── Quotes/      ← Captured quotes
│   │   ├── Statements/  ← Claims / assertions
│   │   └── Things/      ← Objects, entities, artifacts
│   ├── People/          ← Person notes
│   │   └── 320-PROFESSIONAL/
│   ├── Places/          ← Location notes
│   ├── Tools/           ← Tool documentation
│   └── X/               ← Miscellaneous atomics (overflow bucket, not a primary target)
├── 03-Efforts/          ← Projects and goals
│   ├── Active/          ← In-progress efforts
│   ├── Paused/          ← On hold
│   └── Waiting/         ← Someday / maybe / blocked
├── 04-Sources/          ← External references
│   ├── Articles/        ← Web articles
│   ├── Books/           ← Book notes
│   ├── Courses/         ← Course material
│   ├── Guides/          ← How-to / reference guides
│   ├── Media/           ← Video / audio / podcast
│   ├── Meetings/        ← Meeting notes
│   └── Research/        ← Research reports
├── 05-Calendar/         ← Periodic notes and reflections
│   ├── Daily/           ← Daily journal 🔒
│   ├── Weekly/          ← Weekly reviews 🔒
│   ├── Monthly/         ← Monthly reviews 🔒
│   ├── Quarterly/       ← Quarterly reviews 🔒
│   ├── Yearly/          ← Yearly reviews 🔒
│   ├── Sessions/        ← Work / focus session logs 🔒
│   └── _Logs/           ← Automated activity logs 🔒
├── 06-Archive/          ← Completed and inactive content
│   ├── Completed/       ← Finished efforts / notes 🔒
│   ├── Dormant/         ← Inactive / retired content
│   └── Reference/       ← Archived reference material
├── 07-Prompts/          ← AI prompt management (top-level in v2.0)
│   ├── 01-Docs/         ← Prompt-system documentation
│   ├── Library/         ← Curated / reusable prompts
│   ├── Playbooks/       ← Transformation-recipe notes
│   │   └── _examples/
│   ├── Inbox/           ← Unprocessed prompt captures
│   └── Archive/         ← Retired prompts
├── 99-System/           ← Infrastructure (excluded from Obsidian index)
│   ├── CIS/             ← Content Information Standards (canonical enum values)
│   ├── Config/          ← YAML orchestrator / privacy config
│   ├── Documentation/   ← System & PKM documentation
│   │   ├── Checklists/
│   │   ├── Dataview/
│   │   ├── Gamification/
│   │   ├── Kanban/
│   │   ├── Obsidian/
│   │   ├── PKM/         ← This guide and other PKM manuals
│   │   ├── Playbooks/
│   │   ├── Search/
│   │   └── Tutorial/
│   ├── FileClass/       ← Note-type metadata schemas
│   ├── Images/          ← Embedded images
│   ├── PDFs/            ← Embedded PDFs
│   ├── Scripts/         ← Automation scripts (Templater / QuickAdd)
│   └── _backups/        ← Script-generated backups
├── AIOS/                ← Claude-Code AI orchestration layer (not an Obsidian folder)
│   ├── context/         ← Hot cache / warm-start briefs
│   ├── docs/            ← AI human docs (adr, gpts, plans, specs)
│   ├── orchestration/   ← Task queue, proposed outputs, reports, logs
│   ├── rules/           ← ai-rules.md
│   ├── runtime/         ← skills / agents / commands / hooks (.claude junction target)
│   ├── scripts/         ← Maintenance scripts (vault-morning, desloppify, release)
│   └── workspace/       ← handoff / scratch / sessions
└── Templates/           ← Reusable note templates & snippets
    ├── Actions/         ← Action / button templates
    ├── Add-Sections/    ← Insertable body sections
    │   ├── Blocks/
    │   ├── Headers/
    │   └── Navigation/
    ├── Body/            ← Per-type body templates ({type}-body.md)
    ├── Calendar/        ← Periodic-note templates
    ├── Core/            ← Shared snippets (_nav-breadcrumb, _nav-wayfinder, …)
    ├── Create/          ← Composed creation templates (new-{type}.md)
    ├── Gamification/
    ├── Kanban/
    ├── Meta/            ← Per-type YAML templates ({type}-meta.yaml.md)
    ├── Queries/         ← Reusable Dataview query blocks
    ├── Quick-Inserts/
    ├── Scripts/         ← Template helper scripts
    │   └── YAML/
    │       └── setup/
    ├── Static/          ← Static hub-note templates
    ├── Tests/
    ├── _Drafts/
    └── _Examples/
```

> [!note] **🔒 = privacy-protected** by default — blocked from Claude Code reads via the `PreToolUse` privacy-guard hook. Unlock for a session with `/unlock-private`.

> [!note] **Not shown**: `.obsidian/` (plugin/config), `.git/`, and pytest cache. `99-System/` and `06-Archive/` are in Obsidian's `userIgnoreFilters` — invisible to Bases, search, and backlinks.


---
## Vault-Specific Customizations

*Přizpůsobení pro tento konkrétní vault:*

- [ ] Doplnit specifické podsložky
- [ ] Upravit naming conventions  
- [ ] Definovat výjimky nebo rozšíření

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
