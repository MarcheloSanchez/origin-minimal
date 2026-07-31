---
name: capture-pipeline-review
description: Read-only retrospective grader for one capture-processing run (a /process-capture or /process-inbox pass) — tallies manual-correction cost, flags pipeline steps that could be skipped/merged, and produces a short trend-aware report. Use when the user says "review this migration run", "grade the capture pipeline", "how did that process-inbox run go", or "/capture-pipeline-review".
user_invocable: true
---

# capture-pipeline-review

Grades a single, already-completed capture-processing run (`/process-capture` or `/process-inbox`) — it does not run the pipeline itself. This is a **retrospective** on pipeline execution quality (cost + efficiency), not a vault-content checker. Read-only — never modifies, moves, or deletes any file.

**Not in scope, on purpose** (see `AIOS/docs/plans/2026-07-23-migration-evaluator-skill-design.md` for the full design history):
- Standards/enum conformance (type, tags, YAML) — that's `vault-inspector`'s and `yaml_validator.js`'s job already; this skill never re-derives or restates CIS rules. If something is clearly broken it names the file and points to `99-System/CIS/<field>.md` — one line, no elaboration.
- Cross-run semantic-drift detection (did today's classification choice contradict last month's) — deferred; no decision-history log exists yet to compare against, and building one is out of scope until single-run cost/efficiency tracking proves it's needed.

## Scan Targets

- The raw capture(s) processed this run — either still in `+Inbox/` or their archived copy (`+Inbox/_reformed/` or wherever `capture-processor` staged them)
- The resulting structured note(s) it produced (ask the user which note(s)/session if not obvious from recent file mtimes)
- `AIOS/memory/lessons.md` — filtered to entries dated to this run
- The single most recent prior `AIOS/orchestration/reports/*-capture-pipeline-review-*.md` report, if one exists (for the trend line — no separate log file, just diff against the last report)

## Steps

**1. Identify the run's scope.** Ask the user (if not already clear from conversation context) which capture(s)/session this review covers. Don't guess a broad scope — one run at a time.

**2. Gather inputs:**

```bash
ls +Inbox/ 2>/dev/null
find "+Inbox/_reformed" -type f -newer <reference-file> 2>/dev/null
tail -n 40 "AIOS/memory/lessons.md" 2>/dev/null
find "AIOS/orchestration/reports" -name "*-capture-pipeline-review-*.md" 2>/dev/null | sort | tail -1
```

Read the raw capture(s), the resulting note(s), and (if a prior report exists) its cost line.

**3. Tally cost — manual corrections.**

Count how many `lessons.md` entries dated to this run's timestamp window exist (each is a documented "a human had to fix this by hand" event — reuse the signal `capture-processor` already logs, don't re-derive it). That count, over the number of captures processed this run, is the cost line: `N manual corrections / M captures`.

If a prior report was found, compare its cost line to this run's and note the direction (improving / flat / worse) in one clause — don't build a chart, don't build a persisted trend log; the prior report file itself is the only history needed.

**4. Note efficiency observations.**

Read through what actually happened this run (the capture → note transformation, any lessons.md entries, any visible back-and-forth in the conversation if this review is running in the same session as the processing). Ask, concretely: which step, check, or stage in `capture-processor.md` / `process-inbox.md` / `origin-routing` did nothing this run, or did something a simpler step could have done? Examples of the kind of finding this is looking for (not a checklist to force through every run — only report what's actually observed):
- A confidence-escalation step fired for something that was obviously unambiguous — threshold too conservative.
- Two sequential steps both touched the same field/decision — could plausibly merge.
- A step consistently no-ops across the captures reviewed — maybe skippable for this capture type.

If nothing stands out, say so plainly: "No efficiency findings this run" — don't invent filler to look thorough.

**5. Spot-check for broken output only if something is visibly wrong.** This is not a full correctness sweep (that's `vault-inspector`'s job) — only flag something if it's obviously broken while reading the note (e.g., a type that doesn't look like it matches content). Name the file and point to the relevant `99-System/CIS/<field>.md` in one line — do not restate what the file says.

**6. Write the report** to `AIOS/orchestration/reports/YYYY-MM-DD-capture-pipeline-review-<short-slug>.md`, per Output Format below, and open with the vault's standard status callout (`🟡 DRAFT` — this is a report, mark `✅ DONE` once the user has read/acted on it, matching the vault's artifact status convention).

## Output Format

Narrative blocks, not a multi-column checklist — keep it short and skimmable.

```
> [!done]- Status: 🟡 DRAFT (YYYY-MM-DD · capture-pipeline-review)

## Capture Pipeline Review — <date>, <N> captures

**Ran clean:** <X>/<N> — routed correctly, no manual fixes.

**Needed a manual fix:**
- `<file>` → <what went wrong, one line>
  → likely fix: `<agent/skill file>.md <stage/section>`

(If N > 5 captures, use a compact table here instead of bullets:
| Capture | Outcome | Manual fix? | Note |)

**Cost this run:** <N> manual corrections / <M> captures (prior run: <N'>/<M'> — <trending better/worse/flat>, or "no prior report to compare")

**Efficiency notes:** <1-3 concrete observations from step 4, or "None this run">

**Broken output (if any):** `<file>` — looks like `<field>` is off → see `99-System/CIS/<field>.md`
```

## Edge Cases

- No prior report found → cost line reads "no prior report to compare" instead of a trend claim; never fabricate a baseline.
- `AIOS/memory/lessons.md` empty or has no entries in this run's window → cost is `0 manual corrections / M captures`, not "unknown" — an empty log is a valid (good) signal, not missing data.
- If asked to review a run spanning multiple sessions or an ambiguous date range, ask the user to narrow it rather than guessing scope.
- Never writes/edits/moves vault content or the captures/notes being reviewed — this skill only writes its own report file.
