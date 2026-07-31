# AIOS Orchestration

Async vault-work pipeline. Dump a task → a loop runs the right agent → output
stages in `proposed/` → you accept/reject in Obsidian on your own time.

| Folder | Role |
|--------|------|
| `queue/` | One markdown note per task. Drop via `/queue-add`. |
| `proposed/` | Staged AI output awaiting human review. Never canon. |
| `logs/` | Append-only run logs + per-task review packages. |

**The rule:** AI writes only to `proposed/`. The only path into canon (the PARA
folders) is a human accept via `/review-proposed`.

Commands: `/queue-add`, `/run-queue`, `/review-proposed`.
Logic lives in `AIOS/orchestration/lib/` (tested Python, stdlib only).
