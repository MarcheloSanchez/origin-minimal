---
in: "[[Tools]]"
title: Obsidian
aliases:
  - md vault
  - obsidian.md
type: tool
fileClass: Tool
tags:
  - 🛠️tool
tool_status: active
maturity: 🌲evergreen
priority: high
created: 2025-08-01
modified: 2026-04-10
last_review: 2026-04-10
review_frequency: quarterly
related:
  - "[[Area – Learning & Growth]]"
  - "[[Templater Plugin]]"
  - "[[Dataview Plugin]]"
---

# 🧰 Obsidian

## 📘 Overview
**Type:** Personal knowledge management (PKM) / note-taking
**Status:** active
**Priority:** high
**Review frequency:** quarterly

> **Purpose:** Primary long-term knowledge vault — writing, linking, processing, and surfacing ideas across all life areas.
> **Context:** Used daily as the core tool in the Origin PKM system. Runs locally with a git-backed vault; all scripts in `99-System/Scripts/` are written specifically for this setup.

---

## ⚙️ Installation
Download from [obsidian.md](https://obsidian.md) (no package manager needed — standalone app).

Core plugins enabled: Templates, Daily Notes, Tags, Backlinks, Search, Graph view
Community plugins: Templater, Dataview, QuickAdd, Style Settings, Various Complements, Button

Vault location: `C:/Users/.../Origin-v1.9.1-Starter-Pack`
Settings backup: `.obsidian/` folder tracked in git (with secrets excluded)

---

## ✨ Key Features
- Local-first Markdown storage — no vendor lock-in, full git history
- Bidirectional links and graph view for knowledge mapping
- Community plugin ecosystem — Dataview turns the vault into a queryable database
- Templater for dynamic template composition (Meta + Body modular system)
- Canvas for spatial thinking boards

---

## 🧾 Syntax / Command Cheatsheet
| Action | Command / Syntax | Notes |
|--------|------------------|-------|
| Wikilink | `[[Note Name]]` | Case-sensitive on some systems |
| Embed note | `![[Note Name]]` | Full embed |
| Embed section | `![[Note Name#Section]]` | Header anchor |
| Dataview query | ` ```dataview TABLE ... ``` ` | Requires Dataview plugin |
| Templater run | `Ctrl+P → Templater: Insert template` | Or via QuickAdd |
| Command palette | `Ctrl+P` | All commands accessible here |

---

## 💡 Use Cases
| Scenario | Example | Integration |
|-----------|----------|-------------|
| Daily capture | Quick note → `+Inbox/` → processed via QuickAdd | QuickAdd + Templater |
| Source processing | Book notes → Source note with progressive summary | Templater Source template |
| Project tracking | Effort notes with status/maturity fields | Dataview dashboards |
| Knowledge retrieval | Graph view + backlinks + search | Dataview + Smart Notes |

---

## 🔗 References
- [Official Docs – help.obsidian.md](https://help.obsidian.md)
- [Community Forum – forum.obsidian.md](https://forum.obsidian.md)
- [Obsidian Roundup Newsletter – obsidianroundup.org](https://obsidianroundup.org)

---

*Tool maturity: 🌲evergreen • Status: active • Priority: high • Next review: quarterly*
