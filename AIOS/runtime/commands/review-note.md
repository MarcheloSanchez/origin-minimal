---
description: Deep review of one note — combines fix-note inspection with link recommendations and a maturity check. Preview-first; apply only what the user approves.
argument-hint: [note path, optional]
---

You are running inside the **Origin** v2.0 vault. Load `origin-vault`, `origin-yaml`, `origin-templates`, `origin-routing`. Dispatch **note-fixer** then **link-recommender**.

## Task

Go further than `/fix-note`: in addition to YAML/body/placement fixes, surface link suggestions and check whether the note's `maturity` matches its actual link counts.

## Pre-flight checks

1. Resolve target path. If no argument, ask. Reject locked paths.
2. Read the file fully.

## Workflow

1. **Dispatch `note-fixer` in inspection mode** — produce findings without applying.
2. **Dispatch `link-recommender`** — get up to 5 verified candidate links.
3. **Run a maturity sanity check**:
   - Count outbound wikilinks in the body
   - Count backlinks (best-effort Grep for `[[<title>]]` across vault)
   - Compare against the type's exit criteria:

   **atomic**
   - `📤seed` → basic metadata only
   - `🌱seedling` → 2+ links
   - `🪴sapling` → 5+ links, 2+ backlinks
   - `🌲evergreen` → 10+ links, in a MOC
   - `🍓fruit` → publishable, externally-adapted

   **source**
   - `📤seed` → captured, unread or unprocessed
   - `🌱seedling` → has highlights/notes in body
   - `🪴sapling` → highlights extracted, key ideas linked to atomics
   - `🌲evergreen` → fully processed, ideas promoted, integrated into MOC
   - `🍓fruit` → referenced in published work or shared externally

   **effort**
   - `📤seed` → idea/intention, no plan yet
   - `🌱seedling` → has a next action defined
   - `🪴sapling` → active with progress logged
   - `🌲evergreen` → sustained system, not just a one-off project
   - `🍓fruit` → completed and outcomes documented

   **other types** (moc, person, place, tool, area, meeting, prompt): maturity check is lightweight — flag only obvious dishonesty (e.g. `🌲evergreen` with < 50 words of content).

   - Flag overstated or understated maturity with evidence (word count, link count, backlinks).
4. **Present a combined report** with three sections:
   - **Fixes proposed** (from note-fixer)
   - **Suggested new links** (from link-recommender)
   - **Maturity check** (current → suggested, with evidence)
5. **Per-section approval** — `y`/`N`/`partial` for each section independently.
6. **Apply approved sections** via the appropriate agent.

## Hard constraints

1. **Preview before apply** for every section.
2. **Never invent enum values, body content, or wikilinks.**
3. **Never hand-reorder YAML** — defer to `yaml_orchestrator.js`.
4. **Maturity bumps require explicit yes** — do not auto-promote even if criteria are met.
5. **Bilingual care** — match the note's language.

## Edge cases

- **Lightweight type** (daily, guide, etc.): skip body and maturity sections; only YAML and links apply.
- **Note has zero outbound links** and is `🌱seedling`+: flag as understated structure; suggest demotion to `📤seed` or adding links.
- **Backlink count is suspect** (vault has many same-titled notes): degrade confidence and report.

## After running

Tell the user:

- Path of file modified
- Per-section: applied / partial / skipped
- Maturity decision (kept / changed / flagged for user)
- Recommended follow-up
