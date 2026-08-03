---
up: "[[🗺️My PKM MOC]]"
title: PKM Tasks System
type: system
tags: 
  - ⚙️system
  - ✅tasks
  - 📋documentation
status: 🔄active
maturity: 🌱seedling
created: "2025-10-01"
modified: "2026-07-28"
related: 
  - "[[🔁My PKM Workflows]]"
  - "[[🔢My PKM Metadata]]"
  - "[[👁️Dashboard]]"
quality_reviewed: "2026-07-28"
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[🏛️My PKM Governance]] | [[🔢My PKM Metadata]] | [[🔍My PKM Queries]] |  [[📁My PKM Folders]] |  [[🏷️My PKM Tags]] |  [[🔁My PKM Workflows]] | ✅My PKM Tasks | [[ℹ️My PKM Naming Convention]]

# ✅ PKM Tasks System

> This note is the **center point** for how work is tracked in Origin. It explains
> the model, then routes you to the live surface for each kind of task. It holds no
> task lists of its own — those live where the work lives.

---

## The one rule: grain decides the grammar

There are two ways to say "this needs doing," and they are **not** competing — they
operate at different **grain**. Pick by asking what the *unit of work* is.

| Grain | Grammar | Means | Lives in |
|-------|---------|-------|----------|
| **The whole note** | a **tag** in frontmatter (`#🧹tidy`, `#🌱develop`) | "this entire note needs *treatment X*" — a disposition | the note's YAML `tags:` |
| **A step inside a note** | a **checkbox** (`- [ ] … 📅 @computer`) | "this one concrete action remains" | inline in the note body |

> [!tip] The one-line test
> **If the unit of work is the note itself, tag it. If it's a step you'd tick off, checkbox it.**
> Can't name what "done" looks like in a single action? It's a disposition → **tag**.
> A concrete action you'd check off? → **checkbox**.

**Where the tag goes is half the rule.** It removes the last ambiguity:

- **Disposition tag → frontmatter** (`tags:`). It describes the *whole note*, and that's
  what the Bases lenses read. One disposition per note.
- **Step attribute → inline on the checkbox** (`@computer`, `📅 2026-07-15`).
  Context and dates are attributes *of that one step*, so they ride on the
  checkbox where the Tasks plugin reads them.

*Frontmatter tag = the whole note · inline tag = one step.*

---

## Three universes, three homes

Every task in the vault belongs to exactly one of these. Open the matching note.

### 1. Finishing a note — *execution* → [[TODO]]
Concrete steps living **inside** knowledge/effort/source notes as checkboxes. `TODO`
(the "✅ Task Hub") aggregates them live — by `@context`, by due/scheduled
date. This is your day-to-day action queue.

### 2. Finishing a note — *disposition* → the lenses
When the whole note needs a kind of treatment, tag it in frontmatter and it appears in
its lens:

| Disposition tag | Lens | Meaning |
|-----------------|------|---------|
| `#🧹tidy` | [[🧹Cleaning Lady]] | note needs cleanup / normalising |
| `#🌱develop` | [[🌱Incubator]] | note needs expanding / developing |
| `maturity: 📤seed → 🍓fruit` | [[🍓Maturity Garden]] | note's growth stage |

### 3. Improving the vault itself → [[BACKLOG]]
Scripts, features, UX fixes, refactors — work *on Origin*, not on its content. Lives on
the `BACKLOG` kanban (Inbox → To Do → Active → Review → Done). Cards link to the note or
effort they touch; individual sub-tasks stay in those notes, not on the board.

---

## Checkbox syntax reference

Tasks-plugin emoji fields, used inline on any `- [ ]` step:

| Symbol | Name | Purpose | Example |
|--------|------|---------|---------|
| `📅` | Due | Hard deadline | `📅 2026-07-15` |
| `⏰` | Scheduled | When to work on it | `⏰ 2026-07-10` |
| `🛫` | Start | Earliest start | `🛫 2026-07-01` |
| `🔁` | Recurrence | Repeating task | `🔁 every week` |
| `✅` | Done | Completion date (auto) | `✅ 2026-07-08` |
| `⏫ / 🔼 / 🔽` | Priority | High / medium / low | `⏫` |

Inline context tags feed [[TODO]]'s "Next Actions by Context" section:
`@computer @home @work @phone @errands @people @waiting`

Query patterns that read these fields are owned by [[🔍My PKM Queries]] — don't duplicate
them here.

---

## Do / Don't

**Do**
- Capture the moment it occurs — a checkbox in the daily note or the note in hand.
- Reserve `📅` for real deadlines; use `⏰` for "when I plan to touch it."
- Tag the note (frontmatter) for disposition, checkbox the step for action — never both for the same thing.

**Don't**
- Don't invent a fourth place to track tasks. The three universes above are it.
- Don't put a fake due date on everything — it manufactures overdue noise.
- Don't leave a step rotting for weeks. Reschedule it, delete it, or promote it to knowledge.

---

> [!quote] Task philosophy
> *A task system should reduce cognitive load, not add to it. If a task sits undone for
> weeks, delete it or transform it into knowledge work.*

---

## Related

- [[🔁My PKM Workflows]] — how tasks move through the daily/weekly review flow
- [[🔍My PKM Queries]] — the Dataview/Tasks query catalogue
- [[🏷️My PKM Tags]] — the disposition-tag and context-tag vocabulary
- [[👁️Dashboard]] · [[🧭Review HQ]] — where the rollups surface

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*