---
description: Turn the current Claude conversation into a properly typed, routed, templated Origin note. Preview before write.
argument-hint: "[optional hint: type or title, e.g. 'concept: prompt caching']"
---

You are running inside the **Origin** v2.0 vault. Load `origin-vault`, `origin-routing`, `origin-templates`, `origin-yaml`.

## Task

Synthesize what *this conversation* produced into a single, well-formed vault note. This is the conversation-to-note path (Karpathy `save` pattern) — there is **no `+Inbox` file**; you draft directly from the chat context. Preview before write.

## Workflow

1. **Decide what's worth saving.** Identify the durable knowledge in the conversation — a concept explained, an idea worth keeping, a decision reached, a how-to figured out, or a summary of an external source discussed. If nothing durable emerged, say so and stop.
2. **Classify + route.** Use `origin-routing` to pick type and destination:
   - explanation of a thing/idea/principle → `atomic` (Concept / Idea / Statement subfolder)
   - reusable procedure / setup / workflow → `guide` (`99-System/Documentation/` or relevant area)
   - summary of an external article/video/repo discussed → `source` (`04-Sources/…`)
   - a decision with rationale → `atomic` Statement, or append to the relevant effort
   Score confidence (high / medium / low). If `$ARGUMENTS` gives a type or title hint, honor it.
3. **Draft.** Compose with `origin-templates` (Meta + Body for the type) and `origin-yaml` (canonical field order, quoted wikilinks). Include an orbit wayfinder and footer. Add a `[!key-insight]` for the core takeaway where it fits. Fill body sections from the conversation only — no invented content; leave empty sections empty.
4. **Preview.** Show: proposed destination path, filename, type + confidence, full YAML, body.
5. **Pause** for `y` / `N` / `edit`.
   - `edit`: ask what to change (type? destination? title? sections?), redraft, re-preview.
   - `y`: write the file. Report the path.
   - `N`: report and exit; write nothing.

## Hard constraints

1. **Preview before write.** Always.
2. **No auto-write on low confidence** about type/destination — surface 2 candidates, wait.
3. **No invented wikilinks.** Glob to verify a target exists before linking it.
4. **No invented content.** Capture only what the conversation actually established.
5. **No auto-translate.** Match the language the knowledge was discussed in.
6. **No write to locked paths** (CIS, Config, `.obsidian/`, Templates internals).
7. **Filename** ≤ 60 chars, emoji-prefixed per type convention, no path-special characters.
8. **Not `+Inbox`.** This produces a finished note, not a raw capture — route it to its real home.

## After running

Tell the user: destination path created, type + subfolder + confidence, any wikilinks skipped because their targets don't exist, and any required fields left as placeholders to review.
