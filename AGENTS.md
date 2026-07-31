# AGENTS.md — Origin Vault

Entry point for any AI agent operating in this vault. This file is a **map, not a manual** — it tells you what exists and which file owns each fact. Read the owner file before acting on its subject.

## Read this first

1. **`CLAUDE.md`** (vault root) — the operating contract: architecture, schema protocol, footguns, forbidden actions. Non-negotiable rules live there.
2. **`Me.md`** (vault root) — how the vault's owner wants to be worked with (tone, output shape, anti-patterns).
3. **`AIOS/docs/🏛️Constitution.md`** — precedence layers and operating principles that outrank everything else.

If you read nothing else, read `CLAUDE.md`.

## What this vault is

An Obsidian personal-knowledge vault (v2.0) on a PARA-inspired 8-layer architecture, with a locked YAML schema, a two-tier note-type system, and a Claude-Code-driven maintenance layer (`AIOS/`). It is a **structured system, not a notes folder** — generic Obsidian conventions will produce output that breaks its automation.

## 60-second map

| Path | Holds |
|------|-------|
| `+Inbox/` | Raw captures, human-authored only. Agents never write session artifacts here. |
| `01-MOCs/` | Maps of Content — navigation hubs |
| `02-Knowledge/` | Areas (ongoing life standards) + Atomics (Concepts/Ideas/Quotes/Statements) + People/Places/Tools |
| `03-Efforts/` | Projects, split `Active/` `Paused/` `Waiting/` |
| `04-Sources/` | Books, articles, media, meetings, guides, research |
| `05-Calendar/` | Daily → Weekly → Monthly → Quarterly → Yearly notes. **Privacy-gated.** |
| `06-Archive/` | `Completed/` `Dormant/` `Reference/`. **Privacy-gated.** |
| `07-Prompts/` | Prompt library and playbooks |
| `99-System/` | Scripts, Config, CIS enums, FileClass definitions, documentation. **Invisible to Obsidian's index** — see `CLAUDE.md` Critical Issue #15. |
| `Templates/` | 3-tier modular template system (Meta + Body composed at creation) |
| `AIOS/` | The agent layer: runtime, contracts, docs, orchestration |

## Who owns which fact

Never restate these — read the owner and link to it.

| Subject | Owner file |
|---------|-----------|
| Operating rules, footguns, forbidden actions | `CLAUDE.md` |
| Principles and precedence | `AIOS/docs/🏛️Constitution.md` |
| YAML field order, enums, renames, quoting | `AIOS/runtime/skills/origin-yaml/SKILL.md` |
| Folder/type architecture, two-tier type system | `AIOS/runtime/skills/origin-vault/SKILL.md` |
| Which folder a note belongs in | `AIOS/runtime/skills/origin-routing/SKILL.md` |
| Template structure per type | `AIOS/runtime/skills/origin-templates/SKILL.md` |
| Raw enum values (status, maturity, type, …) | `99-System/CIS/CIS_{FIELD}.md` |
| Per-type field schemas | `99-System/FileClass/<type>.md` |
| Live YAML normalization config | `99-System/Config/yaml-meta-config.json` |
| Available commands | `AIOS/docs/Command Reference.md` |
| Available agents and skills, and their triggers | `AIOS/docs/Agent Reference.md` |
| Hooks | `AIOS/docs/Hook Reference.md` |
| Every drift/consistency mechanism | `AIOS/docs/Consistency and Audit Reference.md` |
| Human orientation | `README.md` |

## Non-negotiables

- **Inspection first, preview before apply.** Propose a diff; write only after approval. This is the vault's default posture, not a per-task preference.
- **Reversibility.** Back up before bulk or destructive operations. Destructive actions are confirmed or reversible.
- **One canonical home per fact.** If something is duplicated between two files, that is a bug to fix at the source — not a precedence to resolve.
- **Privacy gate.** `05-Calendar/` and `06-Archive/` subfolders are gated by a `PreToolUse` hook. A rejected prompt is a decision — do not route around it with a different tool.
- **Schema changes are contract changes.** A field rename touches six layers. Read `CLAUDE.md` → *Schema Change Protocol* before the first edit.
- **Never write full folder paths in wikilinks.** Link by title only. One documented exception (calendar nav) — see `CLAUDE.md` Critical Issue #12.
- **Session artifacts have assigned homes.** Reports → `AIOS/orchestration/reports/`. Plans → `AIOS/docs/plans/`. Never `+Inbox`.

## If you are not Claude Code

The `AIOS/runtime/{skills,agents,commands}/` files are Markdown with YAML frontmatter — readable and followable by any agent, even without the slash-command harness. A command file describes a procedure; a skill file describes a domain contract. Read them directly.

The `.claude/` directory is a per-machine junction to `AIOS/runtime/` and may not exist. Always resolve to the real `AIOS/runtime/...` path.

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
