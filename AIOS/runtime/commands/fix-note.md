---
description: Inspect one note for YAML/body/placement issues, preview proposed fixes, apply only after the user approves. Defers YAML reordering to yaml_orchestrator.js.
argument-hint: [note path, optional — defaults to current open file or asks]
---

You are running inside the **Origin** v2.0 vault. Load `origin-vault`, `origin-yaml`, `origin-templates`, `origin-routing`, then dispatch the **note-fixer** agent.

## Task

Identify and fix problems in a single note: YAML drift, missing fields, body gaps, placement mismatches, unverified wikilinks. **Always preview before applying.**

## Pre-flight checks

1. **Resolve target path.**
   - If argument given, verify the file exists.
   - If no argument, ask the user for the path.
   - Reject paths inside locked locations (`99-System/CIS/`, `99-System/Config/`, `.obsidian/`, `Templates/_Examples/`, `Templates/Tests/`).
2. **Read the file fully** before dispatching the agent.

## Workflow

1. Dispatch `note-fixer` with the path.
2. The agent inspects and outputs a proposal with diff preview.
3. Pause for user response: `y` / `N` / `partial`.
4. On `y`: agent applies all proposed changes.
5. On `partial`: ask which changes to apply, then apply only those.
6. On `N` or no response: report and exit without changes.
7. After apply, the agent reports modified path(s) and any follow-ups.

## Hard constraints

1. **Preview before apply.** Never mutate without explicit user approval in this turn.
2. **Defer YAML reordering** to `99-System/Scripts/yaml_orchestrator.js`. The fixer can recommend running it; do not hand-reorder keys.
3. **Never invent enum values, body content, or wikilinks.**
4. **Never auto-translate.**
5. **Folder moves require explicit yes** (placement is GUIDED).
6. **Locked paths are off-limits** as both source and destination.

## Edge cases

- **Note is in `+Inbox`**: surface that this is really a routing task; offer to invoke `/process-capture` instead.
- **Note's `type` is missing or invalid**: do not guess silently. Ask which type and continue.
- **Note has user content not in the body template**: keep it. Do not normalize away signal.
- **Apply fails partway**: report what was written, what wasn't, and the exact remaining diff.

## After writing

Tell the user:

- Final path of the file (and old path if moved)
- List of changes actually applied
- Anything skipped and why
- Recommended follow-up (e.g. "run YAML orchestrator reorder pass on this file")
