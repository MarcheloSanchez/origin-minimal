---
description: Dump a task into the AIOS orchestration queue (fast capture, no classification)
---

# /queue-add

Create one task note in `AIOS/orchestration/queue/` from minimal input. Optimized
for speed — do not interrogate the user.

## Steps

1. Ask for (or accept from `$ARGUMENTS`): a one-line **title/goal**. That is the
   only required input.
2. Derive `id` = kebab-case slug of the title + `-` + today's date (YYYYMMDD).
3. Read `AIOS/orchestration/_task-template.md`. Fill:
   - `id`, `title`, `goal` → from input
   - `created` → today
   - `worker` → leave `auto` unless the user named one
   - `write_target` → leave `auto`
   - `## Task` → the user's instruction (or the title if none given)
   - `## Acceptance` → if the user gave none, write: "Reviewer judges the output
     meets the stated goal and passes vault lint/quality rules."
4. Write to `AIOS/orchestration/queue/<id>.md`.
5. Confirm with the path. Do NOT run the task — that is `/run-queue`.

Keep it to one prompt. This is a capture tool; classification happens later.
