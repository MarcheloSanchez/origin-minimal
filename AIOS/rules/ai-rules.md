# AI Rules — Origin Vault

Any AI working in this vault MUST follow these. They are distilled from `CLAUDE.md`
(the authoritative source — read it for full detail).

## Hard constraints

- **Locked enums.** `status`, `maturity`, `type`, `priority` accept
  only canonical values. Source of truth: `99-System/CIS/CIS_*.md`. Never invent values.
- **Inspection-first.** Preview every change before applying. Never bulk-edit notes
  without showing a diff and getting approval.
- **Never modify `.obsidian/`** config files directly.
- **Never delete or bulk-rename vault notes** without explicit confirmation + backup.
- **YAML wikilinks must be quoted:** `up: "[[Page]]"` — unquoted breaks re-parsers.
- **Field naming:** `due` not `deadline`.
- **`python` not `python3`** on this system.
- **Git on `migration/v2.0`:** never `git add -A` / `git commit -a` (concurrent
  committer contaminates atomic commits). Run `git reset -q`, then explicit
  `git add <files>`, then commit immediately. Verify with `git log -1 --stat`.
- **Edit runtime at real paths:** stage `AIOS/runtime/...`, never `.claude/...`
  (the latter is a gitignored junction — changes won't be tracked).

## File output

Session artifacts NEVER go in `+Inbox` (human capture only). Place them per `CLAUDE.md`
File Output Rules: audits → `AIOS/orchestration/reports/`, plans/designs → `AIOS/docs/plans/`
(specs → `AIOS/docs/specs/`, ADRs → `AIOS/docs/adr/`), scripts → `99-System/Scripts/` (vault) or
`AIOS/scripts/` (Claude Code maintenance). AI session notes → `AIOS/memory/sessions/` (gitignored — private full-backup repo, never public).

## Where things live

- Runtime (agents/skills/commands): `AIOS/runtime/` (root `.claude/` is a junction to it).
- AI docs: `AIOS/docs/` — start at `+About AIℹ️.md`.
- Recent project state: `AIOS/memory/hot.md`.
- Authoritative project instructions: `CLAUDE.md` at repo root.

## Autonomy Ladder

The AIOS autonomy tiers (T0–T3) describe the promotion path for vault-change automation. Each tier's behavior is defined:

- **T0 (Silent-Deterministic)**: No human input after fire; deterministic, safe, must not corrupt. Today: `vault-desloppify.sh`, `vault-quality-tier1.py`.
- **T1 (Apply+Ledger-Audit)**: Applies changes + records in ledger; human audits the ledger row asynchronously. Requires 20 accepted proposals to earn tier, zero reverts. Today: **none earned yet**.
- **T2 (Propose+Gate)**: Proposes changes; human approves before apply. Today: `AIOS/orchestration/proposed/` + `/review-proposed`.
- **T3 (Human-Only Queue)**: Human writes the task, agent executes per human directions. Today: `AIOS/orchestration/quality-queue.md`.

Demotion: One revert = down one rung.

## Phase-1 rules (2026-07-14)

1. **Fix-class rule.** Every ledgered change names a fix-class. Registered classes
   live in `AIOS/contracts/ladder.yaml` (until that file exists, use the class names
   in the target-architecture proposal §5.9). An unregistered class is T3 by default.
2. **Rejection→lesson rule.** A rejected proposal is not closed until its reason is
   appended to `AIOS/memory/lessons.md` and a `rejected` row is in the ledger.
3. **Provenance rule.** Nothing is written to `AIOS/memory/` without source, date,
   and review-by (or the quarterly-distill default). Speculation is never stored as fact.
4. **Decay rule.** Every AIOS folder has a decay rule or is marked permanent in
   `AIOS/README.md`. A folder without a decay rule may not be created.
5. **Generated-file rule.** Files under `AIOS/contracts/generated/` and generated
   catalogs (e.g. `Command Reference.md` once its generator lands) are never
   hand-edited — fix the source and regenerate.

## Behavior

- Decide and flag the assumption; ask only when the choice is load-bearing, irreversible, and Marcel's. Surface unexpected findings early.
- Atomic changes: one logical change → verify → next.
- Every applied vault change from an AIOS command/agent appends one row to `AIOS/orchestration/ledger.md`.
- Don't auto-commit or push unless asked. Conventional commit messages.
