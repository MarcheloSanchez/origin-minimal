---
description: Read one +Inbox capture, classify type, propose destination/template, draft the structured note, write only after the user approves.
argument-hint: <inbox file path or filename>
---

You are running inside the **Origin** v2.0 vault. Load `origin-vault`, `origin-routing`, `origin-templates`, `origin-yaml`, then dispatch the **capture-processor** agent.

## Task

Turn one raw `+Inbox` capture into a properly typed, foldered, templated note. Preview before write. Never auto-route low-confidence captures.

## Pre-flight checks

1. Resolve `$ARGUMENTS`:
   - If absolute path or `+Inbox/<file>`, use directly.
   - If just a filename, look in `+Inbox/`.
   - If empty, list inbox candidates and ask.
2. Verify the file is in `+Inbox/`. If elsewhere, abort and report (this command is for inbox processing only).

## Workflow

1. Dispatch `capture-processor` with the resolved path.
2. The agent classifies, drafts, and outputs a preview.
3. Pause for `y` / `N` / `edit` response.
4. On `edit`: ask the user what to change (type? destination? body section content?), redraft, re-preview.
5. On `y`: agent writes the destination file, then handles the source (move to `06-Archive/` or delete — ask once if not yet established this session).
6. On `N`: report and exit; leave inbox file untouched.

## Hard constraints

1. **Preview before write.** Always.
2. **No auto-write on low confidence.** Surface candidates, wait.
3. **No auto-translate.** Match capture's language.
4. **No invented wikilinks.** Glob to verify before including.
5. **No write to locked paths.**
6. **Source file in `+Inbox` is preserved** until destination write succeeds.
7. **No new top-level folders.** Use existing structure only.

## After running

Tell the user:

- Source path handled (moved/deleted/left)
- Destination path created
- Type, subfolder, confidence
- Wikilinks suggested whose targets don't exist (skipped)
- Required fields filled with placeholders the user should review

Then print a quality follow-up block:

```
Quality follow-up for <destination-path>:
  1. Obsidian: QuickAdd → "Process Note"
     → Autofill Metadata + Normalize YAML (reorder + enum fixes + missing fields)
  2. If deeper review needed: /vault-quality-pass <destination-folder>
     or: /review-note <destination-path>
  3. Optional, occasional: /capture-pipeline-review — grades this run itself
     (manual-correction cost, pipeline efficiency), not the note's content
```

> The QuickAdd "Process Note" macro (`process-note-safe.js`) handles all Tier 1 fixes —
> YAML reordering, field population, enum fixes — without Claude Code and for free.
> Only reach for `/vault-quality-pass` or `/review-note` when you want Tier 2 reasoning
> (orbit, links, maturity promotion) or Tier 3 decisions (PARA, orphans).
> `/capture-pipeline-review` is a separate axis entirely — it's not about this note,
> it's a retrospective on the pipeline run that produced it. Run it occasionally to
> track whether captures are getting cheaper/cleaner to process over time, not every time.
