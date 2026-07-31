---
up: "[[+About AIℹ️]]"
title: Agent Reference
type: guide
tags:
  - 📚guide
  - 🤖AI
status: 🔄active
created: 2026-05-10
modified: 2026-07-22
last_review: 2026-07-22
review_frequency: quarterly
---

> [!orbit] Wayfinder | [[+About AIℹ️]] | [[Command Reference]] | [[Flow and Ownership]]

# Agent Reference

Agents are role-scoped Claude workers dispatched by commands. They live in `.claude/agents/*.md`. Each is inspection-first and respects Origin's locked/protected/guided/open boundary tiers.

| Agent | Role | Read-only? | Used by |
|---|---|---|---|
| `vault-inspector` | Health scan: YAML drift, missing fields, placement mismatch, broken links, body gaps, orphans, maturity inconsistency | yes | `/lint-vault`, `/fix-batch` |
| `note-fixer` | Inspects one note, proposes fixes, applies after approval. Defers YAML reorder to orchestrator | no (gated by approval) | `/fix-note`, `/fix-batch`, `/review-note` |
| `capture-processor` | Classifies inbox capture, drafts structured note, writes on approval | no (gated) | `/process-capture`, `/process-inbox` |
| `link-recommender` | Surfaces 3–5 verified wikilink candidates for a note | yes | `/review-note`, called by `note-fixer` |
| `quality-validator` | Read-only gate for the orchestration loop: judges a `proposed/` output against the task's `## Acceptance` + vault lint/quality rules, emits a `pass`/`flag`/`fail` verdict + review package | yes | `/run-queue` |

## Shared rules

- **Preview before apply** — every mutating action shows the diff and waits for `y`.
- **Verify wikilink targets** before suggesting (Glob check).
- **Never write to locked paths** — `99-System/CIS/`, `99-System/Config/`, `.obsidian/`, `Templates/_Examples/`, `Templates/Tests/`.
- **Defer YAML reordering** to `99-System/Scripts/yaml_orchestrator.js` (mode: `reorder`).
- **No auto-translate**. Match the note's language.
- **No invented enum values.** Status / type / maturity / priority all from the locked sets.

## Skill loading

Each agent loads the skills it needs:

- `origin-vault` — always (foundation)
- `origin-yaml` — when reading or writing frontmatter
- `origin-templates` — when shaping bodies / drafting from a capture
- `origin-routing` — when deciding folder placement

## Standalone skills (not agent-loaded)

Invoked directly via `/<skill-name>`, not dispatched by any agent above:

- `origin-note-quality-check` — single-note quality tier + defect report against Origin's schema (read-only). Origin-schema sibling of the global Ideaverse-only `note-quality-check` skill — do not use that one against this vault.
- `config-consistency-check` — audits AI System wiring (settings.json, agent frontmatter, hook paths, doc drift). Read-only. Full detail → [[Consistency and Audit Reference]]
- `capture-pipeline-review` — cost+efficiency review of the capture pipeline (single-run, no standards re-derivation). Read-only.
- `origin-ux-review` — visual/UX audit of a vault surface (Dashboard, Home, Review HQ, MOCs) against the vault's own written visual standards. Read-only, inspection-first.

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
