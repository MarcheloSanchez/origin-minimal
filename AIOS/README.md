# AIOS — AI Operating Space

The home for any AI working on this vault. Single tree: runtime, docs, rules,
context, and session handoff.

## Layout

| Path | What |
|------|------|
| `runtime/` | **Canonical** Claude Code runtime: agents, skills, commands, settings. |
| `docs/` | Human-readable AI system docs. Start at `+About AIℹ️.md`. |
| `rules/ai-rules.md` | Guardrails every AI must follow (distilled from `CLAUDE.md`). |
| `memory/hot.md` | Rolling recent-state cache. Read first for a fast start. |
| `memory/sessions/` | Session notes (gitignored — personal content, public repo). |

## Decay rules

AIOS folders accumulate state over time. Decay rules define when to archive or delete old entries:

| Folder | Rule |
|--------|------|
| `memory/hot.md` | Prune entries older than ~2 weeks (existing rule) |
| `memory/sessions/` | Archive to a quarterly subfolder each quarter; quarterly digest → `memory/warm/` |
| `orchestration/health/` | Single overwritten snapshot — no accumulation, no decay needed |
| `orchestration/reports/` | Reports >90 days old move to `reports/archive/` subfolder (create when first needed) |
| `orchestration/logs/` | Task-log folders >90 days deletable at quarterly review (report, never auto-delete) |
| `docs/plans/` | Stays in place — ✅ DONE is a status badge only, not a move trigger |
| `docs/plans/blueprints/` | Anything reaching ✅ DONE moves to its `DONE/` sibling in the same session that finishes it |

## The junction (read this on a fresh clone)

Claude Code only auto-loads from a top-level `.claude/`. Here, `.claude/` is a
**Windows directory junction** pointing at `AIOS/runtime/`. The junction is
machine-local — it is NOT stored in git. After cloning on a new machine, recreate
it once from the repo root:

```
cmd /c mklink /J .claude AIOS\runtime
```

Then `.gitignore` already excludes `/.claude/`, so git keeps tracking only
`AIOS/runtime/`. Edit runtime files under `AIOS/runtime/`; never under `.claude/`.

## Authoritative instructions

`CLAUDE.md` at the repo root is the source of truth. This folder operationalizes it.
