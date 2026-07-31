---
description: Quarterly AIOS ritual — ladder promote/demote from ledger stats, distill lessons.md into ai-rules, decay pass over AIOS folders, contract review, config health audit. Preview-first; nothing applied without approval.
argument-hint: [quarter as YYYY-Qn, defaults to the quarter that just ended]
---

You are running inside the **Origin** v2.0 vault. Load `origin-vault`. This is the
quarterly ritual from the AIOS target architecture (proposal §3). Everything below is
**preview → approve → apply** — batch the proposals, show them, act only on approval.

## 1. Ladder pass

1. Read `AIOS/contracts/ladder.yaml` and `AIOS/orchestration/ledger.md`.
2. Per fix-class, count ledger rows for the quarter: `applied`, `reverted`, `rejected`.
3. Propose tier moves using the contract's own rules (T2→T1 needs accepted ≥ 20 AND
   reverts == 0; 1 revert = down one rung; 2 reverts in the quarter = down two).
4. Propose counter updates (`accepted`, `reverts`) to bring ladder.yaml in sync with
   the ledger. Show the full diff; apply on approval.

## 2. Lessons distill

1. Read `AIOS/memory/lessons.md` entries since the last review.
2. Propose per entry: **promote** (add/amend a rule in `AIOS/rules/ai-rules.md`),
   **keep** (not yet a pattern), or **drop** (superseded/one-off).
3. Check proposed rules against existing rules for contradictions — flag, never
   silently duplicate (one owner per fact).
4. On approval: apply rule edits, move distilled entries to a `## Distilled — YYYY-Qn`
   section at the bottom of lessons.md.

## 3. Decay pass

Walk the decay table in `AIOS/README.md` and report per folder: item count, oldest
item, what the rule says to do. Propose the moves/deletions (sessions → quarter
archive, reports > 90d → `reports/archive/`, blueprints consumed →
`blueprints/DONE/`, hot.md entries > 2 weeks → prune). Apply on approval. Generate the quarterly digest:
propose a ≤20-line summary of the quarter (from ledger + hot.md + CHANGELOG) into
`AIOS/memory/warm/YYYY-Qn.md`.

## 4. Contract review

1. Diff `AIOS/contracts/schema.yaml` against its runtime source
   (`99-System/Config/yaml-meta-config.json`) and the four CIS enum files — report
   any drift field by field.
2. Any schema change this quarter → verify it has a migration note in
   `AIOS/contracts/migrations/`; if not, flag it as a contract violation.

## 5. Config health

Audit for contradictions, stale facts, and expired time-boxed overrides across:
global `~/.claude/CLAUDE.md`, repo `CLAUDE.md`, `AIOS/rules/ai-rules.md`, and
Claude's auto-memory MEMORY.md if readable. Report findings — this section only
reports; fixes are proposed like everything else, never auto-applied.

## Output

One consolidated report to the user (counts per section, proposals accepted/declined)
+ one ledger row per applied change group with its fix-class. If everything was
declined, say so plainly — an honest "nothing changed" beats performative motion.
