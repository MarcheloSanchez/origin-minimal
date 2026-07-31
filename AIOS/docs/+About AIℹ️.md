---
up: "[[AIOS]]"
title: About AI
type: about
tags:
  - 📋about
  - 🤖AI
status: 🔄active
created: 2026-05-10
modified: 2026-07-22
last_review: 2026-07-22
review_frequency: quarterly
---

> [!orbit] Wayfinder | [[AIOS]] | [[🏛️My PKM Governance]] | [[🔁My PKM Workflows]] | [[Command Reference]]

# +About AIℹ️

The AI System is a Claude-Code-driven layer for the Origin v2.0 vault. Skills, agents, slash commands, and hooks live under `AIOS/runtime/` (root `.claude/` is a directory junction to it — Claude Code reads either path transparently). This folder holds the human-readable reference docs.

## Architecture (4 layers)

```
CLAUDE.md            ← vault rules + AI operating mode
   ↓
Commands             ← /slash workflows you trigger
   ↓
Agents               ← inspection-first vault workers
   ↓
Skills               ← reusable knowledge modules
```

## Where things live

| Concern | Path |
|---|---|
| Foundation skill (always loaded) | `AIOS/runtime/skills/origin-vault/SKILL.md` |
| YAML / templates / routing skills | `AIOS/runtime/skills/{origin-yaml,origin-templates,origin-routing}/SKILL.md` |
| Agents (vault-inspector, note-fixer, capture-processor, link-recommender) | `AIOS/runtime/agents/*.md` |
| Slash commands | `AIOS/runtime/commands/*.md` |
| Privacy hooks (PreToolUse / SessionStart) | `AIOS/runtime/hooks/*.js` |
| Human reference docs (this folder) | `AIOS/docs/` |
| Rolling project state | `AIOS/memory/hot.md` |

## Available commands

**Rework cluster** — for the existing-notes backlog:

- `/lint-vault [folder?]` — read-only health scan; report at `99-System/Documentation/vault-lint-YYYY-MM-DD.md`
- `/fix-note [path?]` — preview-and-apply fixer for one note
- `/fix-batch <folder>` — per-category batched fixes across a folder
- `/review-note [path?]` — fix + link suggestions + maturity check

**Capture cluster** — for `+Inbox` triage:

- `/process-capture <inbox-file>` — classify, route, draft one capture
- `/process-inbox` — full inbox routing plan, applied per approval
- `/save [hint?]` — turn the current conversation into a finished, routed note

**Reflection** — already shipped:

- `/reflect-daily [date?]` — synthesis appended to the daily note

**Privacy** — gates Claude's access to sensitive folders:

- `/unlock-private` — unlock protected folders for this session only
- `/lock-private` — re-lock early

Backed by `privacy-guard.js` (PreToolUse — denies reads on protected paths) and `privacy-relock.js` (SessionStart — wipes the unlock marker every session).

## Reading order

1. [[Flow and Ownership]] — how the primitives differ (skills vs commands vs agents), what updates what, which file owns which fact
2. [[Agent Reference]] — what each agent does, when commands invoke it
3. [[Command Reference]] — slash command usage examples
4. [[Hook Reference]] — active hooks + authoring conventions
5. [[Consistency and Audit Reference]] — catalog of every audit/drift mechanism, overlap map, security-audit subset
6. [[ai-rules]] (`AIOS/rules/`) — distilled hard constraints
7. `CLAUDE.md` (repo root) — authoritative source of truth

## Inspection-first principle

Every command that mutates files previews the change first. The user approves per item or per category. No silent edits. No auto-routes for low-confidence captures. Locked paths (CIS, Config, .obsidian, Templates internals) are never written.

⬆️ [[🏡Home]]  *| `= this.file.mtime`*