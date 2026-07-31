---
description: Inspect a folder, group fix proposals by category, apply per-batch only after the user approves each group. Wraps vault-inspector + note-fixer for many files.
argument-hint: <folder, required>
---

You are running inside the **Origin** v2.0 vault. Load `origin-vault`, `origin-yaml`, `origin-templates`, `origin-routing`, then dispatch **vault-inspector** then **note-fixer** for the approved batches.

## Task

Run inspection across `$ARGUMENTS`, group findings by fix category, present each group as a single approval gate, and apply only the categories the user approves.

## Pre-flight checks

1. `$ARGUMENTS` must be supplied. If empty, ask for a folder.
2. Verify the folder exists and is not a locked path. Reject `99-System/CIS/`, `99-System/Config/`, `.obsidian/`, `Templates/_Examples/`, `Templates/Tests/`.
3. Warn if the folder contains >100 notes; offer to narrow scope.

## Workflow

1. **Inspect** — dispatch `vault-inspector` for the folder; receive grouped findings.
2. **Group fixes by category** in this order (low-risk → higher-risk):
   - YAML drift (enum normalization: `❌cancelled`→`❌cancel`, `🌱seed`→`📤seed`, `🍎fruit`→`🍓fruit`)
   - Legacy field rename (`deadline`→`due`, `relatedNotes`→`related`)
   - Wikilink quoting (`up: [[X]]` → `up: "[[X]]"`)
   - Missing universal fields (insert with sensible defaults)
   - Body section gaps (insert empty sections per template)
   - Placement moves (folder mismatches)
3. **Per category, present a digest**:
   ```
   Category: <name>
   Affected files: <count>
   Sample: <3–5 paths with the proposed delta>
   Apply to all? [y/N/list]
   ```
4. **On `y`**: dispatch `note-fixer` per file in the batch with the pre-computed finding (skips re-inspection). Apply.
5. **On `list`**: print all affected files; let the user toggle individual ones; then apply.
6. **On `N`**: skip the category, move to the next.
7. **Stop after each category** to confirm before proceeding to the next.

## Hard constraints

1. **Always inspect first.** Never apply fixes without showing the per-category digest.
2. **One category at a time.** Never bundle different fix types into a single approval gate.
3. **Defer YAML reordering** to `99-System/Scripts/yaml_orchestrator.js`. Recommend running it after the batch run completes.
4. **Placement moves require the strictest gate** — show full source→destination paths for every move before applying.
5. **Locked paths are off-limits** as both source and destination.
6. **Skip lightweight-type body checks** — they have no body template.
7. **Bilingual care** — Czech section names that exist on disk are valid; do not "normalize" them.

## Edge cases

- **Inspector returns zero findings**: report and exit cleanly.
- **A file is in `+Inbox`**: surface separately and recommend `/process-inbox` instead of fix-batch.
- **Apply fails for some files in a batch**: continue with the rest; collect failures; report at the end with reasons.

## After running

Tell the user:

- Folder scanned
- Per-category counts: proposed / approved / applied / skipped / failed
- List of files moved (if any) with old → new paths
- Recommended follow-ups (e.g. "run yaml_orchestrator reorder pass on the affected files")
