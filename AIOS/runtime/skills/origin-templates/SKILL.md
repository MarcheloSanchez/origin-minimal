---
name: origin-templates
description: Use when reading, composing, or proposing edits aligned to the Origin v2.0 3-tier modular template system (Templates/Meta + Body + Static + Create + Core + Queries + Calendar). Covers per-type body section structure, Meta+Body composition rules, Core snippet reuse (_nav-breadcrumb, _nav-wayfinder, _section-related), and the 11 body/meta types that exist on disk. Triggers when shaping a note's body to match a type, drafting a note from a capture, or auditing whether a note matches its declared type's expected structure.
---

# Origin Templates Skill (v2.0)

Single-concern skill: template structure and composition. Loaded by commands and agents that draft new notes or fix body structure. Assumes `origin-vault` and `origin-yaml` are also in context.

## Template tree

```
Templates/
├── Meta/                  ← YAML frontmatter per type ({type}-meta.yaml.md)
├── Body/                  ← Content scaffolds per type ({type}-body.md)
├── Static/                ← Standalone fallbacks per type ({type}.md)
├── Create/                ← Trigger templates for new notes (new-{type}.md, new-{type}-auto.md)
├── Core/                  ← Reusable snippets (_nav-breadcrumb, _nav-wayfinder, _section-related)
├── Queries/               ← Pre-built Dataview blocks (Query - {Topic}.md)
├── Calendar/              ← Periodic note templates (Template {Period}.md)
├── _Examples/             ← Filled-out exemplars per full type
├── _Drafts/               ← Work-in-progress templates (not for production use)
├── Tests/                 ← Template engine tests
├── Add-Sections/          ← Section snippets to add to existing notes
├── Quick-Inserts/         ← Cursor-position inserts
├── Actions/               ← Action-specific templates
├── Gamification/          ← XP/level templates
└── Kanban/                ← Kanban board templates
```

## Body / Meta types on disk (11)

`area, atomic, effort, meeting, moc, person, place, prompt, source, subscription, tool`

The plan/CLAUDE.md mention 10 "full types" — `subscription` is an 11th type with its own Body+Meta pair. Treat it as a full type for template purposes.

## Composition pattern

The template engine (`99-System/Scripts/Templater_script.js`) composes notes from Meta + Body:

- **Meta** = frontmatter (`Templates/Meta/{type}-meta.yaml.md`)
- **Body** = content scaffold (`Templates/Body/{type}-body.md`)
- **Combined** at note creation via `tp.user.combine(...)` — must use `tR += await tp.user.combine(...)`, never `writeActive()` (race condition with Templater's own write).
- **Static** templates are standalone fallbacks for the same type when the modular flow is bypassed.

Reset functions (`reset_body`, `reset_meta`, `reset_all`) correctly use `writeActive()` — that pattern is for resets only.

## Core snippets (always reusable)

| Snippet | Purpose | Insert where |
|---|---|---|
| `Templates/Core/_nav-breadcrumb.md` | Top-of-note breadcrumb | Top of body, after frontmatter |
| `Templates/Core/_nav-wayfinder.md` | Wayfinder callout (`> [!orbit] Wayfinder \| ...`) | Top of body or near top |
| `Templates/Core/_section-related.md` | Related-notes section block | Bottom of body |

When fixing or drafting a body, prefer composing from these snippets over inlining their content — keeps a single source of truth.

## Per-type body sections (high-level)

Read the actual `Templates/Body/{type}-body.md` for the authoritative structure when generating or auditing. Patterns commonly present:

- **atomic** — Wayfinder, Summary/Idea, Context, Connections, Open Questions, Related
- **effort** — Wayfinder, Goal, Status/Next Actions, Milestones, Notes, Related
- **source** — Wayfinder, Citation, Key Ideas, Highlights/Quotes, My Notes, Related
- **meeting** — Wayfinder, Participants, Agenda, Notes, Action Items, Decisions, Related
- **moc** — Wayfinder, Purpose, Children/Index, Surfacing queries, Related
- **person** — Wayfinder, Identity, Context, Interactions, Notes, Related
- **place** — Wayfinder, Identity, Notes, Visits, Related
- **tool** — Wayfinder, Identity, Use Cases, Notes, Related
- **prompt** — Wayfinder, Intent, Prompt Body, Variables, Examples, Related
- **area** — Wayfinder, Definition, Active Efforts (query), Notes, Related
- **subscription** — Wayfinder, Service, Cost/Renewal, Notes, Related

For exact section names and order, **read the body template before drafting**. These section lists drift over time.

## Exemplars

`Templates/_Examples/{Type} Filled Out.md` — Title-case type, space before "Filled". All 10 documented full types have exemplars as of 2026-04-30. Use these as reference shape, not as values to copy.

## Calendar templates

`Templates/Calendar/Template {Period}.md` — Daily, Weekly, Monthly, Quarterly, Yearly. Periodic notes use these via the Periodic Notes plugin; daily-note location is `05-Calendar/Daily/`.

## When proposing body fixes

1. Read the relevant `Templates/Body/{type}-body.md` first.
2. Compare the note's current sections against the body template's section list.
3. Report missing sections, extra unsanctioned sections, and section-order drift.
4. Preserve any Wayfinder callout already in the note — do not regenerate from scratch.
5. Preserve user content under existing sections — only add empty sections that were missing.
6. Never strip user comments, callouts, or images even if they aren't in the template.

## Drafting from a capture

When a capture-processor agent drafts a new note from raw text:

1. Determine type (delegate to `origin-routing` skill).
2. Read `Templates/Meta/{type}-meta.yaml.md` for required frontmatter fields (defer enum/order to `origin-yaml`).
3. Read `Templates/Body/{type}-body.md` for the section scaffold.
4. Map raw capture content into the most-fitting sections; leave others empty (do not invent content).
5. Add `> [!orbit] Wayfinder | ...` where the body template indicates.
6. Quote all wikilink scalars per `origin-yaml` rule.

## Files referenced (read-only)

- `Templates/Body/*-body.md`, `Templates/Meta/*-meta.yaml.md`, `Templates/Core/*.md`, `Templates/_Examples/*.md`
- `99-System/Scripts/Templater_script.js` (engine — never modify)
