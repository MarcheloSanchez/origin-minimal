---
up: "[[🏡Home]]"
title: AIOS
type: moc
fileClass: moc
tags:
  - 🗺️MOC
  - 🤖AI
status: 🔄active
maturity: 🌱seedling
created: 2026-07-13
modified: 2026-07-22
related:
  - "[[+About AIℹ️]]"
cssclasses:
  - wide-page
obsidianUIMode: preview
---

> [!orbit] Wayfinder | [[+About AIℹ️]] | [[🏛️My PKM Governance]] | [[Command Reference]] | [[CLAUDE]]

The AI operating system of this vault — Claude-Code-driven maintenance, capture processing, and orchestration. What it is and how it's architected: [[+About AIℹ️]]. This note is the map.

## 🗂️ What lives where

| Folder | Holds |
|--------|-------|
| `AIOS/docs/` | Human-readable references (this section's notes) + `adr/`, `gpts/`, `plans/` |
| `AIOS/runtime/` | Skills, agents, commands, hooks — the machine side (`.claude/` junction) |
| `AIOS/orchestration/` | Task queue, proposed outputs awaiting review, reports |
| `AIOS/rules/` | `ai-rules.md` — the AI's standing orders |
| `AIOS/memory/` | `hot.md` rolling cache + `lessons.md` + `warm/` digests |
| `AIOS/scripts/` | Local-only maintenance scripts (gitignored) |

## 📚 The docs

| Note                                | What it holds                                                                                 |
| ----------------------------------- | --------------------------------------------------------------------------------------------- |
| [[+About AIℹ️]]                     | Folder contract — what the AI system is, 4-layer architecture                                 |
| [[Agent Reference]]                 | Every subagent: purpose, tools, when it fires                                                 |
| [[Command Reference]]               | Every /slash command: what it does, inputs, outputs                                           |
| [[Hook Reference]]                  | Every hook: event, script, behavior                                                           |
| [[+About Privacy Guard🔒]]          | The privacy guard — blocked folders, unlock flow                                              |
| [[Consistency and Audit Reference]] | Each mechanism's own file stays the canonical source of what it checks; this table is the map |

## ⚙️ Runtime inventory (live)

What skills, agents, and commands actually exist on disk — the machine-side counterpart to [[Agent Reference]] and [[Command Reference]].

![[_AIOS_Data.base#⚙️ Runtime inventory]]

## 📄 All AIOS notes (live)

Full browser — switch views for plans & specs, shipped artifacts, session memory, stale files, and frontmatter drift.

![[_AIOS_Data.base]]

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
