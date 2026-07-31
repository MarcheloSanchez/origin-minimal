---
description: Review staged AIOS output and accept (move to canon) or reject (discard) — the human gate
---

# /review-proposed

Walk every task at `👁️review`. For each, you are the gate — nothing reaches canon
without an explicit accept here.

## Per item
1. List review tasks:
   `python -c "import sys; sys.path.insert(0,'AIOS/orchestration/lib'); import aios_queue; [print(t.id, t.path) for t in aios_queue.list_tasks('AIOS/orchestration/queue', status='👁️review')]"`
2. Show the human the review package from `AIOS/orchestration/logs/<id>/`
   (summary → verification → changes) and open/quote the proposed file.
3. Ask: **accept, reject, or skip?**
   - If the task `write_target` is `auto`, ask the human for the canon folder first
     (or propose one from routing rules and confirm).
   - **accept:**
     `python -c "import sys; sys.path.insert(0,'AIOS/orchestration/lib'); import aios_task, aios_review; t=aios_task.parse_task('<path>'); print(aios_review.accept(t, '<proposed_file>', '.'))"`
   - **reject:** ask for a one-line reason, then:
     `python -c "import sys; sys.path.insert(0,'AIOS/orchestration/lib'); import aios_task, aios_review, aios_log; t=aios_task.parse_task('<path>'); aios_review.reject(t,'<proposed_file>','<reason>'); aios_log.append_log('AIOS/orchestration/logs', t.id, 'REJECTED: <reason>')"`
     then close the rejection loop (rejection→lesson rule):
     1. Append to `AIOS/memory/lessons.md` under `## Entries`:
        `- **<today>** · <fix-class> · rejection — "<reason>". → candidate rule: <one line or "none">`
     2. Append to `AIOS/orchestration/ledger.md`:
        `| <today> | <tier> | <fix-class> | <target file> | <task id> | rejected (lessons.md <today>) |`
   - **skip:** leave at `👁️review`.
4. After the walk, report: accepted, rejected, skipped counts.

Never move a file to canon except through `aios_review.accept`.
