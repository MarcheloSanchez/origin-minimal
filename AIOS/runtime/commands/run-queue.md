---
description: Run the AIOS orchestration loop — process queued tasks into proposed/ with review packages, serially and within cost caps
---

# /run-queue

Drive the queue with the `/loop` skill (self-paced). **Serial only** — one task at a
time. Writes only to `proposed/`. Never touches canon.

## Per-iteration

1. Claim the next task:
   `python -c "import sys; sys.path.insert(0,'AIOS/orchestration/lib'); import aios_queue; t=aios_queue.claim_next('AIOS/orchestration/queue'); print(t.path if t else 'EMPTY')"`
   - If `EMPTY` → before stopping, check for tasks stuck on a non-canonical
     status (a typo'd / hand-written status like `📋todo` makes a task invisible
     to `claim_next`):
     `python -c "import sys; sys.path.insert(0,'AIOS/orchestration/lib'); import aios_queue; print(aios_queue.unknown_status_tasks('AIOS/orchestration/queue'))"`
     - If it lists any, **surface them** (name + bad status) and tell the user to
       fix the status to `📥queued` (or the right canonical value) — do not
       silently treat them as done.
   - Then stop the loop. Report what was processed (and any stuck tasks).
2. Read the claimed task. Enforce its `cost_cap`: if you cannot complete within it,
   set status `⚠️failed`, log why, and **stop the loop** (fail-fast, surface early).
3. Route to the worker:
   - explicit `worker:` → that agent.
   - `auto` → infer from the task: structural fix → `note-fixer`; inbox capture →
     `capture-processor`; link suggestions → `link-recommender`; scan/audit →
     `vault-inspector`.
4. Dispatch the worker with a hard instruction: **write output only to
   `AIOS/orchestration/proposed/`**, never to canon. Give it only the task note +
   explicitly named files as context (cost discipline — no whole-vault reads).
5. Dispatch `quality-validator` on the proposed output + the task's `## Acceptance`.
6. Persist the review package:
   `python -c "import sys; sys.path.insert(0,'AIOS/orchestration/lib'); import aios_log; aios_log.write_review_package('AIOS/orchestration/logs','<id>', summary, changes, verification, cost)"`
   (pass the validator's four blocks).
7. Read the verdict tier:
   `python -c "import sys; sys.path.insert(0,'AIOS/orchestration/lib'); import aios_log; print(aios_log.parse_verdict('AIOS/orchestration/logs','<id>'))"`
   Then route:
   - **`pass_clean` AND `write_target != "auto"`** → auto-accept to canon immediately.
     - Single proposed file: `aios_review.accept(t, '<proposed_path>', '.')`
     - Proposed subfolder (batch output): `aios_review.accept_dir(t, '<proposed_dir>', '.')`
     - Log `AUTO-ACCEPTED` via `aios_log.append_log`. Task status → `✅accepted`. No human step.
     - Append a ledger row to AIOS/orchestration/ledger.md: | <today> | <tier from AIOS/contracts/ladder.yaml for the fix-class> | <fix-class: task frontmatter fix_class, else infer from worker per AIOS/contracts/ladder.yaml> | <target> | task <id> | applied |
   - **`pass_clean` AND `write_target == "auto"`** → cannot auto-accept (destination unknown).
     Set task to `👁️review`. Surface to user with a note that destination needs to be specified.
   - **`pass_flagged`** → set task to `👁️review`. Surface the open FLAG: lines in your report
     so the user can make an informed call.
   - **`needs_review`** → set task to `👁️review`. Surface the verdict for human judgement.
8. Continue to the next iteration.

## Stop conditions
- Queue empty, OR a task hit `⚠️failed`, OR cumulative cost budget reached.

## After all iterations complete
Update the queue state in `AIOS/memory/hot.md`:
```
python -c "
import sys, os, re
sys.path.insert(0, 'AIOS/orchestration/lib')
import aios_queue
from datetime import date
summary = aios_queue.queue_summary('AIOS/orchestration/queue')
line = 'Last run: %s — %s' % (date.today(), summary)
hot = 'AIOS/memory/hot.md'
text = open(hot, encoding='utf-8').read()
section = '\n## Queue Status\n' + line + '\n'
if '## Queue Status' in text:
    text = re.sub(r'## Queue Status\n[^\n]*', '## Queue Status\n' + line, text)
else:
    text = text.rstrip() + '\n' + section
open(hot, 'w', encoding='utf-8').write(text)
print(line)
"
```

Report: processed count, auto-accepted count, tasks left at `👁️review` (with their FLAG summaries), any failures.
