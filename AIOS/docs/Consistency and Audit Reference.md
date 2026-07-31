---
up: "[[+About AIℹ️]]"
title: Consistency and Audit Reference
type: guide
tags:
  - 📚guide
  - 🤖AI
status: 🔄active
created: 2026-07-22
modified: 2026-07-22
last_review: 2026-07-22
review_frequency: quarterly
---

> [!orbit] Wayfinder | [[+About AIℹ️]] | [[Flow and Ownership]] | [[Hook Reference]]

# Consistency and Audit Reference

## Purpose

No single file catalogs every mechanism that checks whether this AI System and vault are internally consistent — each one lives in its own `SKILL.md`/command file with no cross-reference to its siblings. That's fine for running one of them, but it's a gap for two things: (1) knowing "what audits exist" before making a change that could break something outside the current session's context, and (2) running a security-focused pass without re-discovering which mechanisms actually touch security-relevant surface.

This doc indexes — it does not duplicate. Each mechanism's own file stays the canonical source of what it checks; this table is the map, not the territory. When a mechanism's behavior changes, update its own file first; update this row only if scope/severity/invocation changed.

## Catalog

| Mechanism | Location | Scope | What it checks | Severity model | Read-only / Fixer | Invoke |
|---|---|---|---|---|---|---|
| `config-consistency-check` | `AIOS/runtime/skills/` | AI System | Junction integrity, settings.json/deny-list, agent frontmatter, agent↔lessons.md wiring, command↔agent refs, hook path resolution, skill refs in agents, CLAUDE.md-vs-disk drift, AIOS reference-doc review-cadence overdue | CRITICAL/WARNING/INFO | Read-only | "config consistency check" / `/config-consistency-check` |
| `claude-md-drift-detector` | `~/.claude/skills/` | AI System | CLAUDE.md/MEMORY.md staleness, contradictions, dead references, missing skill refs, cross-project drift | CRITICAL/WARNING/INFO | Read-only | invoked by description match |
| `skill-linter` | `~/.claude/skills/` | AI System | Installed-skill frontmatter validity, naming, duplicate names, broken cross-refs, missing supporting files | CRITICAL/WARNING/INFO | Read-only | invoked by description match |
| `memory-pruner` | `~/.claude/skills/` | AI System | MEMORY.md line budget (180/200 thresholds), staleness signals, orphaned memory files, consolidation opportunities | Healthy / Warning / Over-budget | Audit + fixer (confirmed-apply) | invoked by description match |
| `vault-consistency-checker` | `~/.claude/skills/` | Vault content | Broken wikilinks, orphans, frontmatter/CIS drift, tag typos, PARA misplacement, empty/stub notes | CRITICAL/WARNING/INFO | Read-only | invoked by description match |
| `lint-vault` + `vault-inspector` agent | `AIOS/runtime/commands/`, `AIOS/runtime/agents/` | Vault content | Broadest vault scan: YAML drift, enum typos, missing fields, broken wikilinks, placement mismatches, body gaps, orphans, footer format, stale staged captures | Category tables (auto-fixable vs human-decision) | Read-only (feeds `/fix-batch`) | `/lint-vault [folder?]` |
| `dataview-validator` | `~/.claude/skills/` | Vault content | Broken Dataview/DataviewJS field refs, deprecated syntax, dead queries, performance anti-patterns | CRITICAL/WARNING/INFO | Read-only | invoked by description match |
| `audit-templates` | `~/.claude/skills/` | Vault content | Broken template path refs, missing required frontmatter fields per type, duplicate/unused templates, naming inconsistency | CRITICAL/WARNING/INFO | Read-only | "audit templates" |
| `template-linter` | `~/.claude/skills/` | Vault content | Templater/DataviewJS syntax correctness inside templates (unclosed `tp.*` blocks, undefined vars, hardcoded paths) | CRITICAL/WARNING/INFO | Read-only | invoked by description match |
| `check-hotkeys` | `AIOS/runtime/commands/` | Vault content | Documented hotkeys vs `.obsidian/hotkeys.json`, both directions (wrong docs + undocumented bindings) | Mismatch/undocumented counts (no tiers) | Read-only (writes a dated report) | `/check-hotkeys` |
| `tag-audit` | `~/.claude/skills/` (→ `AIOS/scripts/check-tag-drift.py`) | Vault content | Canonical tag whitelist diff vs `CIS_TAG.md`, single-use tags, near-duplicates, deep nesting | Flat findings list (no tiers) | Read-only by default; optional write-on-confirm | "tag audit" |
| `fix-batch` / `fix-note` + `note-fixer` agent | `AIOS/runtime/commands/`, `AIOS/runtime/agents/` | Vault content | **Not an audit** — the write-side counterpart. Applies `lint-vault` findings after per-item/per-batch approval; defers YAML reordering to `yaml_orchestrator.js` | n/a | Fixer (preview-then-approve) | `/fix-note [path?]`, `/fix-batch <folder>` |

Guardrails (`privacy-guard.js`, `privacy-relock.js`, `hot-cache.js`) are deterministic gates, not consistency checks — see [[Hook Reference]] rather than this table.

## Overlap map

- **`config-consistency-check` Check 8** (CLAUDE.md-vs-disk drift) vs **`claude-md-drift-detector`**: not duplicates. Check 8 is narrowly scoped to the AI System reference tables (Command/Agent Reference vs `AIOS/runtime/*`); the drift detector covers CLAUDE.md prose broadly, MEMORY.md, and cross-project drift. Run both for a full CLAUDE.md audit.
- **`vault-consistency-checker`** vs **`lint-vault`/`vault-inspector`**: significant overlap (YAML drift, broken links, orphans, placement). `lint-vault` is the official orchestrated pipeline — its output feeds `/fix-batch` and the quality queue. Treat `vault-consistency-checker` as the standalone/ad-hoc version; when both are available, trust `lint-vault`'s report.
- **`audit-templates`** vs **`template-linter`**: same target files (`Templates/`), different axis. `audit-templates` checks field *presence* (does the frontmatter have what it needs); `template-linter` checks Templater *syntax correctness* (will the `tp.*` calls actually run). Neither supersedes the other — run both when auditing templates.

## Security-audit subset

For a security-focused pass, run the AI-System-scoped mechanisms — these touch what the AI can execute or is instructed to do, not just vault content quality:

1. `config-consistency-check` — settings.json deny-list gaps, unresolvable hook paths, agent tool/frontmatter mismatches
2. `claude-md-drift-detector` — stale or contradictory instructions the AI is currently operating under
3. `skill-linter` — broken or malformed skill definitions that could silently fail to load
4. `memory-pruner` — stale memory that could feed outdated assumptions into a session
5. [[Hook Reference]] — manually confirm the 3 active hooks still match `AIOS/runtime/settings.json` registration (this doc doesn't audit hooks; it documents them)

Everything else in the catalog (`vault-consistency-checker`, `lint-vault`, `dataview-validator`, `audit-templates`, `template-linter`, `check-hotkeys`, `tag-audit`) is vault **content** quality — relevant to a content audit, not a security audit.

## Schema Change Protocol

When a canonical field name, enum value, or type identifier changes vault-wide, several mechanisms above need a targeted re-run (agent frontmatter, `audit-templates`, `vault-consistency-checker`). The propagation rule itself — 5 layers, blocking vs doc-only — is owned by `CLAUDE.md` → **Schema Change Protocol**. See that section rather than this doc for the procedure.

## Cadence guidance

- **Ad hoc / before or after any config change**: `config-consistency-check`, `claude-md-drift-detector` — cheap, fast, catch wiring breaks immediately.
- **Quarterly** (anchored to `/quarterly-review`): `tag-audit`, `audit-templates`, `template-linter`, `memory-pruner` — slower-drifting surfaces, batched review is enough.
- **As-needed / triggered by a specific symptom**: `dataview-validator` (query looks broken), `check-hotkeys` (hotkey doc feels stale), `vault-consistency-checker`/`lint-vault` (general vault health check — `lint-vault` is the default choice).

## Maintenance

This table is hand-maintained. When a new consistency/audit mechanism is added anywhere in this system, add a row here in the same session — the same discipline this doc asks everything else to follow.

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
