---
up: "[[07-Prompts]]"
title: Prompt Reference
type: guide
tags:
  - 🤖AI/prompt
  - 📖guide
status: 🔄active
created: "2026-03-06"
modified: "2026-03-06"
summary: "Single reference for the prompt library — metadata schema, categories, and workflow."
related: []
---

# Prompt Reference

Consolidated reference for the 99-System/Prompts library. Covers metadata fields, allowed categories, and basic workflow.

---

## Metadata Schema

### Tier 1 — Always filled (auto or on creation)

| Field | Type | Notes |
|---|---|---|
| `title` | string | User fills. Descriptive, max 60 chars |
| `type` | string | Auto: `"prompt"` |
| `status` | string | Auto: `"draft"` → user updates to `active` / `archived` |
| `created` | date | Auto |
| `modified` | date | Auto |
| `prompt_category` | string | User picks 1 of 7 (see Categories below) |
| `tags` | list | Auto: `[🤖AI/prompt]` |
| `owner` | string | Auto: `"MM"` |

### Tier 2 — Optional, fill when it adds value

| Field | When to use |
|---|---|
| `difficulty` | Teaching prompts: `beginner`, `medium`, `intermediate`, `advanced`, `expert` |
| `prompt_type` | Filter by action: `explanation`, `reflection`, `simulation`, `summarization`, `rewrite`, `generation`, `analysis`, `planning`, `idea`, `prompt-design`, `comparison`, `compression`, `creative`, `utility` |
| `summary` | Complex prompts — one sentence, outcome-focused |
| `version` | Iterated prompts — semver `MAJOR.MINOR.PATCH` |
| `language` | Non-English prompts |
| `related` | Wikilinks to related prompts |

All other fields from the old schema are retired.

---

## Categories

Pick **exactly one** `prompt_category` per prompt.

| Category | Description |
|---|---|
| `writing` | Plan, compose, or refine text for human readers |
| `coding` | Generate, review, or explain code and dev artifacts |
| `business` | Strategy, product, GTM, ops, and reporting |
| `education` | Teaching, learning, and assessment prompts |
| `productivity` | Workflows, PKM systems, and decision support |
| `creative` | Artistic, storytelling, or visual ideation tasks |
| `prompt-engineering` | Meta-prompts and prompt-library operations |

Subcategories are no longer used.

---

## Folder Structure

```
99-System/Prompts/
├── 01-Docs/        → Reference docs & prompt engineering knowledge
├── Workbench/      → Daily-use prompts you actively run
├── Reference/      → Well-crafted prompts worth keeping
├── Fun/            → Roleplay, creative, entertainment
├── Inbox/          → New captures, unsorted
└── Archive/        → Retired, deduped, stubs
```

---

## Workflow

1. **Create** — QuickAdd lands new prompts in `Inbox/`
2. **Fill metadata** — Tier 1 fields are pre-filled by template; add Tier 2 if useful
3. **Write the prompt** — Role, instructions, example usage
4. **Triage** — Move to `Workbench/` (daily use), `Reference/` (worth keeping), or `Fun/`
5. **Iterate** — Bump `version`, update `modified`
6. **Retire** — Set status to `archived`, move to `Archive/`

---

## Quality Checklist

- Instructions are unambiguous
- Produces desired outcome consistently
- Can be adapted for similar use cases
- Has at least one example invocation
- Category assigned, summary written (for complex prompts)

---

## Related Docs

- [[Prompt Patterns]] — Techniques & reusable structures (CoT, few-shot, mega-prompt, etc.)
- [[Prompt Playbook]] — Step-by-step guide to creating and filing prompts
- [[Prompt Tuning]] — Model-specific tips, temperature settings, common pitfalls
- [[Prompt Lab]] — Personal experiment log and learnings
- [[MOC - Prompts]] — Organized views of your prompt library
