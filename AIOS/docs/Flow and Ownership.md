---
up: "[[+About AIℹ️]]"
title: "Flow and Ownership"
type: guide
tags:
  - 📚guide
  - 🤖AI
status: 🔄active
created: 2026-07-13
modified: 2026-07-26
last_review: 2026-07-22
review_frequency: quarterly
---

> [!orbit] Wayfinder | [[+About AIℹ️]] | [[Agent Reference]] | [[Command Reference]]

# Flow and Ownership

How the AIOS pieces fit together: what each primitive *is*, what updates what,
and which file owns which kind of knowledge. One rule governs everything here:
**every fact has exactly one owner file — duplication is a bug, not redundancy.**

## 1. The five primitives (skills ≠ commands)

| Primitive                                          | What it is                                                                                                                                                  | Who triggers it                           | Can it act?                                                             |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| **Skill** (`runtime/skills/`)                      | Passive **knowledge** — conventions loaded into the model's context when the situation matches its description (YAML order, routing rules, template shapes) | The model, automatically, by relevance    | No. It teaches; it never runs anything                                  |
| **Command** (`runtime/commands/`)                  | A **workflow** — step-by-step procedure the model executes now (`/lint-vault`, `/process-inbox`)                                                            | The human, explicitly (`/name`)           | Yes — it orchestrates: loads skills, spawns agents, gates with previews |
| **Agent** (`runtime/agents/`)                      | A **worker role** — scoped tools + mission for a cold-start subagent (vault-inspector, note-fixer)                                                          | A command (or the main session) spawns it | Yes, within its tool scope                                              |
| **Hook** (`runtime/hooks/`)                        | A **guardrail** — deterministic JS the harness runs around tool calls (privacy-guard, read-before-edit)                                                     | The harness, always, no model involved    | Only block/allow/annotate                                               |
| **Script** (`AIOS/scripts/`, `99-System/Scripts/`) | **Automation** — deterministic code runnable with no AI at all (desloppify, tier1 quality)                                                                  | Human, cron, or a command                 | Yes — this is the T0 rung of the autonomy ladder                        |

Mnemonic: **skills know, commands do, agents work, hooks forbid, scripts repeat.**
If a markdown file gives instructions *for a situation*, it's a skill; *for a
user request*, it's a command. A command may cite skills; a skill never cites
commands.

## 2. What updates what (the flow map)

```
HUMAN CAPTURE            AI PIPELINE                       CANON (vault notes)
+Inbox ──/process-*──▶ orchestration/proposed/ ──/review-proposed──▶ 02-…/04-…
                          │ reject + "why"
                          ▼
                     lessons (memory)

MAINTENANCE
cron scripts (T0) ─────▶ canon (deterministic fixes) ─▶ orchestration/logs/ + ledger
/lint-vault ───▶ orchestration/health/snapshot.md (overwritten) · other audits ───▶ orchestration/reports/ (decays 90d)
                          │ human-decision items
                          ▼
                     orchestration/quality-queue.md (T3)

STATE & LEARNING
session close ─────────▶ memory/hot.md          (decays ~2 weeks)
user corrections ──────▶ harness memory / lessons (candidate rules)
quarterly distill ─────▶ rules/ai-rules.md or CLAUDE.md (promoted, deduped)

SCHEMA
schema change ─────────▶ 99-System/Config/yaml-meta-config.json (machine source)
                          + CIS_*.md / FileClass / templates / skills
                          (today: manual 5-layer propagation per CLAUDE.md
                           Schema Change Protocol; future: generated from the JSON)
```

Reading the map: **canon is only ever written through a gate** (review, preview,
or an earned T0/T1 tier). Everything else is staging, evidence, or memory — and
each of those has a decay rule (see `AIOS/README.md`).

## 3. Knowledge & memory ownership (who owns which fact)

| Layer | Path | Owns | Written when |
|---|---|---|---|
| **Global CLAUDE.md** | `~/.claude/CLAUDE.md` | Cross-project mechanics: tool quirks, git conventions, user identity/preferences. Nothing vault-specific | Manual / `/revise-claude-md`, after a fact proves cross-project |
| **Project CLAUDE.md** | repo root | The **vault contract**: schema rules, critical issues, folder doctrine. Authoritative for this repo | Promotion after a lesson repeats or a contract changes |
| **`rules/ai-rules.md`** | `AIOS/rules/` | Portable **distillate** of CLAUDE.md for any AI (incl. non-Claude, cold subagents). Never the origin of a fact | Regenerated from CLAUDE.md; adding an original fact here is a bug |
| **`hot.md`** | `AIOS/memory/` | Recent project **state** (≤2 weeks): what just happened, what's mid-flight | Session close; pruned continuously |
| **Harness memory** | `~/.claude/projects/<repo>/memory/` | Claude-Code-**private** observations: user feedback, session-spanning task state. Machine-local, invisible to other AIs | Claude, automatically |
| **Lessons** (future `AIOS/memory/lessons.md`) | AIOS | Corrections with *why* — candidate rules awaiting quarterly distill | On any user correction |
| **Health snapshot** | `orchestration/health/` | **Regenerated snapshot** (lint + ladder stats) | Overwritten each run — never accumulates |

**The routing question for any new fact:** *who needs it?*
- Another project too → global CLAUDE.md.
- Any AI touching this vault, durably → project CLAUDE.md (then ai-rules inherits by distillation).
- Only Claude Code, or only for now → harness memory or hot.md (it will decay or be promoted).
- It's a correction → lessons first; promotion happens at the quarterly review, **not** in the moment. Promotion moves a fact, never copies it.

This is why the AIOS memory folder matters: the vault-portable knowledge lives
**in the repo** (survives model/tool changes, git-tracked), while harness memory
stays a private scratch layer. If another AI tool would need the fact, it does
not belong in harness memory.

## 4. Document homes (plans vs specs vs blueprints vs reports)

| Home | Contains | Lifecycle |
|---|---|---|
| `docs/plans/` | Point-in-time **designs and execution plans** — the thinking | 🟡→✅ status badge only, file stays in place (no `DONE/` move) |
| `docs/specs/` | **Frozen contracts** of a shipped feature — the what, kept accurate | Living while feature exists |
| `docs/plans/blueprints/` | **Builder-executable work units** — the only valid home for build-ready blueprints | Executed once → `blueprints/DONE/` |
| `orchestration/reports/` | **Generated evidence** (audits, scans) | Decays: >90 days → archive |
| `orchestration/ledger.md` | **Outcome log** — one row per applied change | Append-only, never decays |

A file named `*-blueprint.md` sitting in `plans/` root is misfiled — it
belongs in `blueprints/` (or `blueprints/DONE/` if actually finished).

No skill or command creates blueprints — confirmed via grep, zero references
to "blueprint" anywhere in `AIOS/runtime/`. It's a pure hand-authored
pattern: copy `AIOS/docs/plans/blueprints/_TEMPLATE.md` and fill it in.

## 5. Schema ownership (today → contracts)

Today the schema contract is split five ways (see CLAUDE.md → Schema Change
Protocol). The **machine seed already exists**: `99-System/Config/yaml-meta-config.json`
owns field order, the `status` enum, rename rules, and required fields — it is
what `yaml_orchestrator.js` actually enforces. The CIS docs, FileClasses,
templates, and skill schema sections are hand-synced copies of it plus the
enums it doesn't yet carry (`maturity`, `type`, `priority`).

The future `contracts/` layer (AIOS 2036 design §2) is therefore **not a new
invention**: it is yaml-meta-config.json extended to carry all enums and
per-type field schemas, with the CIS docs and skill schema sections *generated*
from it. One source, four generated layers, zero drift by construction.

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
