---
up: "[[01-MOCs]]"
in: "[[Views]]"
title: Map for PKM
type: moc
fileClass: moc
tags:
  - ⚙️system
  - 📋documentation
  - 🗺️MOC
status: 🔄active
maturity: 🌱seedling
created: 2025-09-30
modified: 2026-07-13
related:
  - "[[🏛️My PKM Governance]]"
  - "[[🔁My PKM Workflows]]"
  - "[[🔢My PKM Metadata]]"
  - "[[🔍My PKM Queries]]"
  - "[[📁My PKM Folders]]"
  - "[[🏷️My PKM Tags]]"
  - "[[✅My PKM Tasks]]"
  - "[[ℹ️My PKM Naming Convention]]"
  - "[[MOC - Visual Identity]]"
quality_reviewed: 2026-07-08
---

> [!orbit] Wayfinder | [[01-MOCs]] | 🗺️My PKM MOC | [[🏛️My PKM Governance]] | [[🔢My PKM Metadata]] | [[🔍My PKM Queries]] |  [[📁My PKM Folders]] |  [[🏷️My PKM Tags]] |  [[🔁My PKM Workflows]] | [[✅My PKM Tasks]] | [[ℹ️My PKM Naming Convention]]

## 🧭 The PKM Docs

| Note                           | What it holds                                                  |
| ------------------------------ | -------------------------------------------------------------- |
| [[🏛️My PKM Governance]]       | Every rule that governs this vault — compliance, DoD, Do/Don't |
| [[🔢My PKM Metadata]]          | YAML schema per note type; universal + type-specific fields    |
| [[🔍My PKM Queries]]           | Reusable Dataview and Bases query patterns                     |
| [[📁My PKM Folders]]           | Folder structure manual — what lives where and why             |
| [[🏷️My PKM Tags]]             | Tag taxonomy and canonical emoji-first tag forms               |
| [[🔁My PKM Workflows]]         | Capture→Archive pipelines and review cadences                  |
| [[✅My PKM Tasks]]              | Task conventions (#TASK) and task views                        |
| [[ℹ️My PKM Naming Convention]] | File naming rules — emoji prefixes, separators                 |
| [[MOC - Visual Identity]]      | Icons, colors, CSS classes, callout styles                     |
| [[00-Tutorial-Guide]]          | The 7-day guided tour for new users                            |

## 📄 All PKM documentation (live)

```dataview
TABLE WITHOUT ID file.link AS "Note", maturity AS "Maturity", modified AS "Modified"
FROM "99-System/Documentation/PKM"
SORT file.name ASC
```

## 🗺️ How the vault flows

#🌱develop 
```mermaid
graph TD

%% ===== NODES =====
A[📥 00 Inbox<br/>#📥inbox<br/>Quick Capture]:::folder
B[🗺️ 01 MOCs<br/>#🗺️moc<br/>Navigation Index]:::folder
C[💡 02 Knowledge<br/>#💡atomic<br/>Atomic Knowledge]:::folder
D[🚀 03 Efforts<br/>#🚀effort<br/>Projects & Initiatives]:::folder
E[📚 04 Sources<br/>#📚source<br/>References]:::folder
F[📅 05 Calendar<br/>#📅daily<br/>Journals & Reflections]:::folder
G[📦 06 Archive<br/>#📦archived<br/>Inactive Items]:::folder
H[⚙️ 99 System<br/>#⚙️system<br/>Templates, Scripts]:::folder

%% ===== WORKFLOW EDGES =====
A -->|🔍 Process<br/>Templater ⚡ MetaEdit| B
A -->|🔍 Process<br/>Templater ⚡ MetaEdit| C
A -->|🔍 Process<br/>Templater ⚡ MetaEdit| D
A -->|🔍 Process<br/>Templater ⚡ MetaEdit| E
A -->|🔍 Process<br/>Templater ⚡ MetaEdit| F

B -->|🏗 Organize<br/>Linking ⚡ Dataview| C
B -->|🏗 Organize<br/>Linking ⚡ Dataview| D
B -->|🏗 Organize<br/>Linking ⚡ Dataview| E

C -->|📊 Review<br/>Weekly Dots Review| D
D -->|📊 Review<br/>Kanban ⚡ Tasks| F
E -->|📊 Review<br/>Source Processing| C

F -->|📊 Reflect & Plan| D

%% ARCHIVE
D -->|✅ Completed<br/>MetaEdit ⚡ Auto-Date| G
C -->|✅ Completed<br/>MetaEdit ⚡ Auto-Date| G
E -->|✅ Completed<br/>MetaEdit ⚡ Auto-Date| G
F -->|✅ Completed<br/>MetaEdit ⚡ Auto-Date| G

%% SYSTEM LINKS
H -->|⚡ Automations<br/>QuickAdd, Scripts| A
H -->|⚡ Dashboard<br/>Dataview Queries| B
H -->|⚡ Task Views| D

%% ===== STYLES =====
classDef folder fill:#2c3e50,stroke:#3498db,stroke-width:2px,color:#ecf0f1;

```

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
