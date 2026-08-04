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
status: 🔄active
maturity: 🌲evergreen
priority: high
created: 2025-08-01
modified: 2026-04-10
last_review: 2026-04-10
review_frequency: quarterly
version: 1.7.7
related:
  - "[[Area – Learning & Growth]]"
  - "[[Templater Plugin]]"
  - "[[Dataview Plugin]]"
  - "[[QuickAdd Plugin]]"
alternatives:
  - "[[Notion]]"
  - "[[Roam Research]]"
  - "[[Logseq]]"
license: proprietary (free for personal use)
price_model: freemium
date_first_used: 2025-08-01
category: knowledge-and-organization
config_backup: .obsidian/ folder tracked in git, secrets excluded
installation: installer
platform:
  - Windows
privacy: local
replacement:
sensitive_data: conditional
tier: foundation
tool_state: adopted
---

# 🧰 Obsidian

## 📘 Overview
**Tier:** foundation · **Category:** knowledge-and-organization
**Status:** 🔄active · **Tool state:** adopted · **Priority:** high
**Review frequency:** quarterly

> **Purpose:** Primary long-term knowledge vault — writing, linking, processing, and surfacing ideas across all life areas.
> **Context:** Used daily as the core tool in the Origin PKM system. Runs locally with a git-backed vault; all scripts in `99-System/Scripts/` are written specifically for this setup.
> **Default for:** Personal knowledge management across all life areas — the vault of record, not a candidate under evaluation.

---

## ⚙️ Installation
Download from [obsidian.md](https://obsidian.md) (no package manager needed — standalone app).

Core plugins enabled: Templates, Daily Notes, Tags, Backlinks, Search, Graph view
Community plugins: Templater, Dataview, QuickAdd, Style Settings, Various Complements, Button

Vault location: `C:/Users/.../Origin-v1.9.1-Starter-Pack`
Settings backup: `.obsidian/` folder tracked in git (with secrets excluded)

---

## 🔒 Privacy & Recovery
**Privacy:** local · **Sensitive data:** conditional (vault content may include private/work-restricted notes) · **Platform:** Windows

- Vault restores from git history; `.obsidian/` config is tracked with secrets excluded.
- No replacement candidate identified — this is the foundation tool for the whole PKM system.

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

## ⚖️ Pros & Cons
**Pros**
- Highly customizable
- Local-first file storage
- Strong plugin ecosystem

**Cons**
- Steep learning curve for beginners
- Plugin quality/maintenance varies

---

## 🔗 References
- [Official Docs – help.obsidian.md](https://help.obsidian.md)
- [Community Forum – forum.obsidian.md](https://forum.obsidian.md)
- [Obsidian Roundup Newsletter – obsidianroundup.org](https://obsidianroundup.org)

---
