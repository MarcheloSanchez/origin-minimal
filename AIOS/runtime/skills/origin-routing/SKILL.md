---
name: origin-routing
description: Use when deciding which folder a note belongs in based on its type and content (Origin v2.0). Covers the type→folder decision tree, edge cases (Areas vs Atomics, Active vs Paused vs Waiting Efforts, Source subtypes, Knowledge subtypes), capture-routing from +Inbox, and confidence-scoring of placements before files are moved or written. Triggers on capture-processing, fix-batch folder placement, and any note-routing decision.
---

# Origin Routing Skill (v2.0)

Single-concern skill: where does a note belong? Loaded by capture-processor and note-fixer agents. Assumes `origin-vault` is in context for folder structure and locked enums.

## Decision tree (type → folder)

| Type | Primary folder | Subfolder |
|---|---|---|
| `atomic` | `02-Knowledge/Atomics/` | `Concepts/`, `Ideas/`, `Quotes/`, `Statements/`, `Things/` |
| `area` | `02-Knowledge/Areas/` | one of Health, Finance, Career, Relationships, Personal |
| `person` | `02-Knowledge/People/` | — |
| `place` | `02-Knowledge/Places/` | — |
| `tool` | `02-Knowledge/Tools/` | — |
| `effort` | `03-Efforts/` | `Active/`, `Paused/`, `Waiting/` (by status) |
| `source` | `04-Sources/` | `Articles/, Books/, Courses/, Guides/, Media/, Meetings/, Research/ (by source_type)` |
| `meeting` | `04-Sources/Meetings/` | — |
| `moc` | `01-MOCs/` | — |
| `prompt` | `07-Prompts/` | `Library/`, `Playbooks/`, `Inbox/`, `Archive/`, `01-Docs/` (by `status` / category) |
| `subscription` | `02-Knowledge/Tools/` or domain folder | — (treat as recurring service) |
| `daily/weekly/monthly/quarterly/yearly` | `05-Calendar/{Period}/` | — |
| `system/dashboard/about/guide/tutorial/challenge` | varies | typically `99-System/Documentation/` or root |

Anything still in `+Inbox` is unrouted by definition.

## Atomic subtype heuristics

Read the capture content; look for these signals:

- **Concepts** — definition-shaped: "X is …", named idea/framework/theory, abstract noun
- **Ideas** — proposal-shaped: "what if …", "we could …", a possibility or hypothesis
- **Quotes** — verbatim text with attribution; presence of `>` blockquote + author
- **Statements** — claim/opinion/principle: declarative, often first-person ("I believe …")
- **Things** — concrete entity that isn't a person/place/tool: object, artifact, dataset, song

If two subtypes are plausible (e.g. concept vs idea), pick the more concrete and report the alternative.

## Effort status → subfolder

Driven by `status` value, not the user's tone:

- `🔄active` → `03-Efforts/Active/`
- `⏸️paused` → `03-Efforts/Paused/`
- `⏳waiting` → `03-Efforts/Waiting/`
- `✅completed` or `📦archived` → `06-Archive/` (move on completion)
- `❌cancelled` → `06-Archive/` with note in body explaining cancellation

## Source subtype → folder

Driven by `source_type` (canonical enum: [[CIS_SOURCE_TYPE]] — `book`, `article`, `video`, `podcast`, `research`, `experience`, `guide`, `course`):

- `article` → `04-Sources/Articles/`
- `book` → `04-Sources/Books/`
- `course` → `04-Sources/Courses/`
- `guide` → `04-Sources/Guides/`
- `video` / `podcast` → `04-Sources/Media/`
- `research` → `04-Sources/Research/`
- `experience` → `04-Sources/` root (no dedicated subfolder)
- Meeting notes → `04-Sources/Meetings/` (or use `type: meeting`)

## Edge cases

| Situation | Decision |
|---|---|
| Note is about a life domain (e.g. "Finance overview") | `area` → `02-Knowledge/Areas/{Domain}/` (not `atomic`) |
| Note is a person bio with claims/quotes | `person` (the page is *about* the person, not their statement) |
| Quote *from* a person | `atomic` → `Atomics/Quotes/`, link the person |
| Project hub that lists sub-projects | `moc` (it's a navigation hub), not `effort` |
| Tool review with personal opinions | `tool` (the page is *about* the tool); split opinions into atomics if substantive |
| Source you're still reading | `source` with `read_status: in-progress` — do not route to Archive |
| Capture mentions multiple unrelated things | Propose splitting; do not force-fit one type |
| Czech-language note | Same routing rules; language is orthogonal to type |

## Confidence scoring

When proposing a route, attach a confidence:

- **High** — type is unambiguous and one subtype dominates
- **Medium** — type is clear but subtype/subfolder is debatable; offer top 2
- **Low** — type itself is ambiguous; propose 2 candidates and ask the user

Never auto-write a low-confidence route. Always preview before move.

## Capture routing protocol

For a `+Inbox/*.md` item:

1. Read the full content (not just the filename).
2. Check existing YAML — if `type` is set and valid, trust it.
3. If unset or invalid, classify via type heuristics.
4. Determine subfolder per the tables above.
5. Output: `<inbox path> → <destination> (confidence: high|medium|low) | reason: <one line>`.
6. Wait for user approval before moving the file.

## Forbidden routes

- Never route to `99-System/CIS/` or `99-System/Config/` (locked).
- Never route to `Templates/` (templates folder, not content).
- Never auto-create new top-level folders or new subfolders without explicit ask.
- Never move from `+Inbox` to `06-Archive` directly — process first, archive after.
