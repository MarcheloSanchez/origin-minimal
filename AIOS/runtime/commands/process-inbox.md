---
description: Scan +Inbox, propose a routing plan for every item (type/destination/confidence), apply only the items the user approves.
argument-hint: (none)
---

You are running inside the **Origin** v2.0 vault. Load `origin-vault`, `origin-routing`, `origin-templates`, `origin-yaml`, then dispatch the **capture-processor** agent in batch mode.

## Task

Process every item in `+Inbox/` in one pass: classify, route, draft. Present the full plan up-front. Apply only after the user approves (per-item or all-at-once).

## Pre-flight checks

1. List `+Inbox/*.md`. If empty, report and exit.
2. Confirm session policy for source files: move to `06-Archive/` (recommended) or delete after successful destination write. Ask once if not already established.

## Workflow

1. For each inbox item, dispatch `capture-processor` in plan-only mode (classify + draft + propose route, no write).
2. Present a routing plan table:

   ```
   # Routing Plan — <YYYY-MM-DD HH:MM>

   | # | Inbox file | Type | Destination | Confidence |
   |---|---|---|---|---|
   | 1 | foo.md | atomic / Ideas | 02-Knowledge/Atomics/Ideas/💡 ... | high |
   | 2 | bar.md | source / Knowledge | 04-Sources/Knowledge/📚 ... | medium |
   | 3 | baz.md | ??? | (low confidence) | low |
   ```

3. Ask the user:
   - `all` — apply every high+medium-confidence item; surface low-confidence items individually
   - `<numbers>` — apply only listed items (e.g. `1, 3, 5`)
   - `none` — exit without applying
4. For each approved item, dispatch `capture-processor` in apply mode with the pre-computed plan.
5. Process low-confidence items one by one (each gets its own preview + confirm).
6. Track failures; do not let a single failure halt the batch.

## Hard constraints

1. **Plan first.** Never apply before showing the table.
2. **Low-confidence is never bulk-applied.** Always one-by-one.
3. **Source file in `+Inbox` is preserved** until destination write succeeds.
4. **No new top-level folders.** Use existing structure only.
5. **No invented wikilinks.** Glob to verify.
6. **No auto-translate.**
7. **Locked paths are off-limits.**

## After running

Tell the user:

- Total items / applied / skipped / failed
- For each applied item: source path → destination path
- Source-file disposition: moved-to-archive / deleted / left in inbox (per-item if mixed)
- Anomalies: wikilinks with missing targets, type ambiguities deferred, fields requiring user review

Then print a quality follow-up block. Collect the unique **destination folders** of all applied items and list them:

```
Quality follow-up — N notes written:

  Step 1 (Tier 1, free — run in Obsidian):
    QuickAdd → "Process Note" on each new note
    → Autofill Metadata + Normalize YAML (reorder, enum fixes, missing fields)

  Step 2 (Tier 2+3 — only if you want reasoning/decisions):
    /vault-quality-pass <folder-A> <folder-B> ...
    (scoped to destination folders only — no full-vault scan needed)

  Optional, occasional: /capture-pipeline-review — grades this batch run itself
    (manual-correction cost, pipeline efficiency), not the notes' content
```

> Run Step 1 first. It handles all deterministic fixes without Claude Code.
> Step 2 is only needed for orbit generation, link suggestions, maturity proposals,
> and PARA/orphan decisions. Running `/vault-quality-pass` on the whole vault is
> wasteful when you know exactly which folders were just written to.
> `/capture-pipeline-review` is a separate axis — a retrospective on this batch's
> execution, not the notes it produced. Run it occasionally to track whether
> processing is getting cheaper/cleaner over time, not every batch.
