---
description: Capture the current discussion as an AIOS queue task — pulls context from the conversation, fills + validates the frontmatter, previews before writing. The richer sibling of /queue-add.
---

# /capture-task

Turn "capture this as a task" (said mid-conversation) into one well-formed task note
in `AIOS/orchestration/queue/`. Unlike `/queue-add` (a blind one-line dump), this reads
the surrounding discussion, fills the frontmatter intelligently, **validates it so it
can't create a broken task**, and previews before writing.

Trigger phrases (all mean the same thing — the user forgets exact wording on purpose):
"capture this as a task", "make a task from this", "queue this", "add this to the queue",
"turn this into a task", or `/capture-task <optional note>`.

## Steps

1. **Gather context from the conversation, not just the argument.** Look back over the
   recent discussion and extract:
   - the **goal** (what outcome the task should produce)
   - any **constraints** already stated (files to touch/avoid, decisions already made)
   - any **named output** the user mentioned (a specific file or folder)
   If `$ARGUMENTS` is present, treat it as the headline; the transcript fills the rest.
   If the discussion is too thin to state a goal, ask ONE short question — otherwise don't.

2. **Draft the frontmatter and validate each field before writing:**
   - `type: aios-task` and `status: 📥queued` → **always include both, first two keys after
     `id`.** This is load-bearing, not decorative: `aios_queue.claim_next()` only sees tasks
     with a recognized `status:` value — a task written without one is silently invisible to
     `/run-queue` and to `list_tasks(status=...)` filtering, even though the file looks
     complete. Confirmed by grepping `^status:` in the written file before reporting success.
   - `id` → kebab-case slug of the title + `-` + today's date (`YYYYMMDD`). No literal
     placeholder may survive (`REPLACE_*`, `YYYY-MM-DD`) — if one would, stop and fix it.
   - `title`, `goal` → from the gathered context.
   - `created` → today (real date, not a placeholder).
   - `worker` → infer from the work, else `auto`: design/writing/note-fix → `note-fixer`;
     inbox capture → `capture-processor`; link suggestions → `link-recommender`;
     scan/audit → `vault-inspector`.
   - `write_target` → **MUST be a folder, never a file path.** This is the load-bearing
     guard: `aios_review.accept()` treats `write_target` as a directory, so a file path
     here silently creates a *folder* named like the file. Rule:
       - If context implies a specific output **file**, put its **parent folder** in
         `write_target` and name the intended filename in the `## Task` body instead.
       - If the folder is obvious (reports → `AIOS/orchestration/reports/`, design/plan →
         `AIOS/docs/plans/`, a real vault folder), set it.
       - Otherwise leave `auto` — the reviewer resolves the destination at accept time.
       - If the inferred value ends in a file extension, strip it to the parent folder and
         say so in the preview.
   - `cost_cap` → default `60000`. **Estimate up when the work implies bulk reading.** If
     acceptance/task says "read every/all files", "audit across", or names a folder to
     sweep, roughly size it (count the files if cheap) and raise the cap to fit, stating
     the estimate. A task that can't finish inside its cap fails at claim time — set it
     right here, not there.
   - `sources_required` → `true` only if the task needs source notes as input, else `false`.

3. **Draft `## Task` and `## Acceptance` from the discussion** — capture the detail while
   it's fresh, don't flatten to a one-liner. If the user gave no acceptance, write:
   "Reviewer judges the output meets the stated goal and passes vault lint/quality rules."

   **Cold-start test** — the worker that later claims this task has none of this
   conversation's memory; the task note is its *entire* briefing. Before preview, check:
   - **Explicit scope boundaries**: state what's deliberately *out* of scope, not just
     what's in — a design conversation accumulates unstated exclusions (e.g. "don't touch
     MAIN notes yet", "don't create the MOCs this implies, that's a separate task") that
     feel obvious mid-conversation and are invisible to a cold reader.
   - **Unknowns stay unknowns**: if the task depends on a file/setting you haven't actually
     located (e.g. "whichever FileClass defines X"), say so and instruct the worker to
     locate it first — don't guess a path to sound complete.
   - **Point at authoritative sources**: link the design doc/report this task executes
     against, so the worker (and the reviewer) can resolve any ambiguity against that
     source instead of this note's paraphrase of it.
   - If the user asks you to revise the preview more than once, re-derive the whole task
     from the conversation again each time — don't patch the previous draft in place.
     Multi-round capture is a sign the task is carrying real weight; treat the next preview
     as a fresh full pass, not an incremental diff.

4. **Preview before writing.** Show the filled task note (frontmatter + both sections) and
   a one-line note of anything you inferred or corrected (e.g. "write_target set to the
   folder, filename noted in the body" or "cost_cap raised to 120000 — task reads ~30 files").
   Wait for a yes.

5. **On approval, write** to `AIOS/orchestration/queue/<id>.md`. Confirm with the path.
   Do NOT run the task — that is `/run-queue`. Do NOT touch canon.

## Relationship to the other queue tools

- `/queue-add` — the 5-second blind dump (no context, no validation). Still there for speed.
- `/capture-task` (this) — the context-aware capture with a validation gate. Use mid-discussion.
- `/run-queue` — the processor that actually does queued work. Separate step, on demand.
- `/origin-status` — shows how many tasks are waiting in the queue (the "what's on my list" view).
