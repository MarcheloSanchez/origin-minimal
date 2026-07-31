---
name: origin-yaml
description: Use when reading, writing, validating, or normalizing YAML frontmatter inside the Origin v2.0 vault. Covers the 11-group canonical field order, locked enum lookup (status, maturity, type, priority), legacy field renames (deadline→due, relatedNotes→related), wikilink quoting rule, and when to defer to yaml_orchestrator.js vs hand-edit. Triggers on any YAML manipulation in vault notes.
---

# Origin YAML Skill (v2.0)

Single-concern skill: YAML frontmatter only. Loaded on demand by commands and agents that touch YAML. Assumes `origin-vault` is also in context — this skill does not redefine folder structure or boundaries.

## Wikilink quoting (mandatory)

Any wikilink emitted into a YAML scalar field **must be quoted**:

```yaml
up: "[[Parent]]"   # correct
up: [[Parent]]     # WRONG — re-parsers turn it into a flow array
```

Applies to: `up`, `in`, and any `related`/source-link scalar. List entries under `related:` are each quoted strings. Reason (paid in production by the user 2026-04-26): unquoted wikilinks get re-serialized into a single-element flow array on the next normalization pass, breaking field type expectations.

## Canonical field order (11 groups)

Defer to `99-System/Scripts/yaml_orchestrator.js` (mode: `reorder`) for bulk normalization. Hand-edit only when the orchestrator is unavailable. Order:

1. **Navigation**: `up`, `in`
2. **Identity**: `title`, `aliases`, `type`, `fileClass`, `cssclass`, `tags`
3. **State**: `status`, `maturity`, `priority`, `rank`, `processing_priority`, `completeness`, `coverage_areas`, `action_required`
4. **Time**: `created`, `modified`, `start`, `due`, `end`, `last_review`, `review_frequency`, `estimated_effort`
5. **Actions/Progress**: `completion_percentage`, `next_actions`, `capture_method`, `linked_notes_count`
6. **Knowledge/Quality**: `confidence_level`, `evidence_quality`, `read_status`, `rating_type`
7. **Source**: `source_author`, `source_date`, `source_type`
8. **Context**: `participants`, `location`, `meeting_type`, `action_items`
9. **Specialized**: `audience`, `difficulty`, `prompt_category`, `prompt_type`
10. **Relations**: `related`, `see_also`, `related_concepts`, `related_ideas`
11. **People**: `role`, `org`, `company`, `email`, `phone`, `website`, `twitter`, `github`, `linkedin`

## Locked enums (do not invent)

| Field | Allowed values |
|---|---|
| `type` (full) | `atomic, effort, source, moc, meeting, prompt, person, place, tool, area` |
| `type` (lightweight) | `system, dashboard, about, guide, tutorial, daily, weekly, monthly, quarterly, yearly, challenge, plan, spec` |
| `status` | `📥inbox, 🔄active, ⏳waiting, ✅completed, 📦archived, ⏸️paused, ❌cancelled, ⚠️blocked` |
| `maturity` | `📤seed, 🌱seedling, 🪴sapling, 🌲evergreen, 🍓fruit` |
| `priority` | `high, medium, low` |

Drift to flag (do not propagate):
- `🌱seed` → canonical `📤seed`
- `🍎fruit` → canonical `🍓fruit`
- `critical` priority → not allowed; map to `high`

CIS source of truth: `99-System/CIS/CIS_TYPE.md`, `CIS_STATUS.md`, `CIS_MATURITY.md`, `CIS_PRIORITY.md`, `CIS_TAG.md`. Bare flat lists, one value per line. **Read-only.**

**Content-type tags mirror `type:` on purpose.** Tags duplicating a note's `type:` value (`💡atomic, 🚀effort, 📚source, 🗺️MOC, 🤝meeting, 👤person, 🗺️place, 🛠️tool, 🏠area`, calendar types) are a deliberate convention — templates auto-tag them so the Obsidian tag pane gives click-to-count filtering alongside the structured `type:` field. **Do not flag these as drift or propose removing them.**

## Legacy field renames

The orchestrator auto-renames these on next pass; do not write the legacy form:

| Legacy | Canonical |
|---|---|
| `deadline` | `due` |
| `relatedNotes` | `related` |

## Required fields by type

Universal (every note):
```yaml
title:
type:
status:
created: YYYY-MM-DD
modified: YYYY-MM-DD
tags:
```

Type-specific minimums:
- **atomic** — `maturity`, `up` (parent MOC), at minimum 2 `related` entries by seedling stage
- **effort** — `priority`, `rank` (1–10, weekly focus order), `due` (if dated), `next_actions`
- **source** — `source_author`, `source_type`, optionally `source_date`, `read_status`; source_type enum: book | article | video | podcast | research | experience | guide | course (bare, no emoji — see CIS_SOURCE_TYPE.md)
- **meeting** — `participants`, `meeting_type`, optionally `action_items`
- **moc** — `up` (parent MOC or root)
- **person** — `role` and/or `org`
- **prompt** — `prompt_category`, `prompt_type`

## Type-specific optional fields (v2, added 2026-07-24)

Propagated through FileClass → Meta template → `yaml_validator.js` per the Schema Change Protocol. All optional — never required.

| Type | Fields |
|---|---|
| **tool** | `version`, `alternatives`, `pros`, `cons`, `key_features`, `use_cases`, `integrations`, `license`, `price_model`, `date_first_used` |
| **meeting** | `recording_link`, `next_meeting`, `duration` |
| **effort** | `objectives`, `deliverables`, `budget`, `spent` |

Notes:
- `alternatives`, `integrations`, `related`-style link lists follow the wikilink quoting rule above.
- `date_first_used`, `next_meeting` are `YYYY-MM-DD` dates.
- `budget`, `spent` are numeric (currency-agnostic — no unit suffix in the value).
- No CIS enum files exist for `license` / `price_model` / `tool_status` — free text for now.
- Equivalent field sets for **Concept, Idea, Course, Book, Article, Research** are **parked**, blocked on the shared-FileClass question → `AIOS/docs/plans/2026-07-23-shared-fileclass-field-conflict-decision.md`.

## When to defer to yaml_orchestrator.js

| Operation | Hand-edit? | Use orchestrator? |
|---|---|---|
| Add a single missing field | yes | optional |
| Reorder fields | no | **yes** (`reorder` mode) |
| Bulk-normalize across many files | no | **yes** (`normalize` mode) |
| Validate against CIS enums | no | **yes** (`lint` mode) |
| Rename legacy field (`deadline`→`due`) | no | **yes** (auto on next pass) |
| Insert wikilink scalar | yes (with quotes) | optional |

If proposing bulk YAML changes, recommend the user run the orchestrator rather than apply field-by-field edits.

## Inspection output protocol

When reporting YAML problems found in a note, structure as:

```
File: <path>
- field `<name>`: <issue>  (e.g. value `🌱seed` outside enum — should be `📤seed`)
- missing: <field list>
- order: <out-of-place fields>
- legacy: <fields needing rename>
- wikilink: <unquoted wikilink scalars>
```

Do not auto-fix in a lint pass — produce the report; let the fix command (or the user) act on it.
