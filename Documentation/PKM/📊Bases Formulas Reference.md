---
up: "[[🗺️My PKM MOC]]"
title: Bases Formulas Reference
type: guide
tags: 
  - ⚙️system
  - 📊bases
  - 📋documentation
status: 🔄active
maturity: 🌱seedling
created: "2026-02-23"
modified: "2026-06-17"
related: 
  - "[[🔧Scripts Reference]]"
  - "[[📅Calendar Review Hub Guide]]"
  - "[[🔁My PKM Workflows]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[🔁My PKM Workflows]] | [[🔧Scripts Reference]]

# 📊 Bases Formulas Reference

All computed formula fields used across Origin's `.base` files. Formulas are written in the Obsidian Bases expression language — a functional, JS-like syntax supporting `map`, `filter`, `reduce`, `if`, and file property traversal.

---

## Dynamic Embedding — the `this` Keyword

When a `.base` file is **embedded** in a note (`![[MyBase.base]]`), `this` refers to the **embedding note** — not the base file itself. This is the core mechanism for context-aware views.

| Context | `this` resolves to |
|---|---|
| Base opened directly | The base file itself |
| Base embedded in a note | The note containing the embed |
| Base in sidebar | The active note in main content area |

### `this` Properties

```
this.file.name          — full filename with extension (e.g. "2026-06-16.md")
this.file.basename      — filename without extension (e.g. "2026-06-16")
this.file.path          — full vault path
this.file.folder        — parent folder path
this.file.links         — outgoing links from the embedding note
this.file.mtime         — last modified time of embedding note
this.file.ctime         — created time of embedding note
this["property-name"]   — any frontmatter property (use bracket syntax for hyphens)
this.property           — any frontmatter property (dot syntax for simple names)
```

### Common Patterns

**Show notes modified on the same day as the embedding note (daily note use case):**
```yaml
filters:
  - 'file.mtime >= date(this.file.basename)'
```
When embedded in `2026-06-16.md`, `this.file.basename` = `"2026-06-16"` — filters automatically scope to that date.

**Show notes created on the same day:**
```yaml
filters:
  - 'file.ctime >= date(this.file.basename)'
```

**Show notes that link TO the embedding note (backlinks pane replication in sidebar):**
```yaml
filters:
  - 'file.hasLink(this.file)'
```

**Show notes that the embedding note links TO (forward links — people, projects mentioned):**
```yaml
# Performance-heavy but direct:
filters:
  - 'file.backlinks.contains(link(this.file.name))'
```

**Filter by a property on the embedding note:**
```yaml
filters:
  - 'list(participants).contains(this)'   # e.g. Meetings embedded in a Person note
  - 'week == this.week'                   # match a property on the host note
```

**Conditional: only apply filter if property is set:**
```yaml
filters:
  and:
    - or:
        - 'this["search-term"].isEmpty()'
        - 'file.name.contains(this["search-term"])'
```

> ⚠️ `file.backlinks` is flagged as performance-heavy in official docs — prefer reversing the lookup with `file.hasLink(this.file)` when possible.

---

## Formula Syntax Primer

```
file.links                          — outgoing links from this note
file.backlinks                      — incoming links to this note
file.links.length                   — count of outgoing links
value.asFile().properties.type      — resolve a link to its file and read a property
.filter(condition)                  — keep only items matching condition
.map(expression)                    — transform each item
.reduce(value + acc, 0)             — accumulate to single result
if(condition, valueIfTrue, valueIfFalse)
(today() - file.mtime).days.round() — days since last edit
```

**Key distinction:**
- `file.links` — links *from* this note (outgoing)
- `file.backlinks` — links *to* this note (incoming, from other notes)

---

## People — `02-Knowledge/People/_People_Data.base`

### `Meetings`
```
file.backlinks
  .filter(value.asFile().properties.type == "meeting")
  .length
```
Counts meeting notes that link to this person via their `participants` field.

### `Last Contact`
```
file.backlinks
  .filter(value.asFile().properties.type == "meeting")
  .map(value.asFile().properties.meeting_date)
  .filter(value)
  .reduce(if(value > acc, value, acc), "")
```
Finds the most recent `meeting_date` across all meeting backlinks. Uses `reduce` with `>` comparison — ISO date strings (`YYYY-MM-DD`) sort correctly as strings.

### `Since Contact`
```
(today() - file.backlinks
  .filter(value.asFile().properties.type == "meeting")
  .map(value.asFile().properties.meeting_date)
  .filter(value)
  .reduce(if(value > acc, value, acc), "")).days.round()+" days"
```
Days elapsed since the last meeting. The `All People` view sorts by this ascending — longest-neglected contacts appear first.

---

## Meetings — `04-Sources/Meetings/_Meetings_Data.base`

### `Days Ago`
```
(today()-note["meeting_date"]).days.round()+" days ago"
```
How long ago the meeting happened. Uses `note["meeting_date"]` (the note's own field) rather than `file.mtime`.

**Embedded view — `Meetings`:**
The view filter `list(participants).contains(this)` makes it person-specific when embedded in a Person note as `![[_Meetings_Data.base#Meetings]]`. `this` resolves to the host note at render time.

---

## Efforts — `03-Efforts/_Efforts_Data.base`

### `Days Stale`
```
(today() - file.mtime).days.round() + " days ago"
```
Days since the effort note was last edited. Used in the `Needs Attention` view sorted ascending — most neglected efforts surface first.

### `Due In`
```
(note["due"] - today()).days.round() + " days"
```
Days until the deadline. **Negative = overdue.** Notes without a `due` field show blank.

### `Linked Atoms`
```
file.links.filter(value.asFile().properties.type == "atomic").length
```
Counts outgoing links to notes with `type: atomic`. Measures how much knowledge has been connected to this effort.

### `Linked Sources`
```
file.links.filter(value.asFile().properties.type == "source").length
```
Counts outgoing links to notes with `type: source`. Measures research depth.

---

## Atomics — `02-Knowledge/Atomics/_Atomics_Data.base`

### `Outlinks`
```
file.links.length
```
Total outgoing links from this note.

### `Backlinks`
```
file.backlinks.length
```
Total incoming links to this note.

### `Days Stable`
```
(today() - file.mtime).days.round()
```
Days since last edit. Used as a stability signal — editing a note resets this to 0.

### `Promote?`
```
if(maturity == "📤seed",
  if(file.links.length >= 2 && file.backlinks.length >= 1, "✅ → seedling", "❌"),
  if(maturity == "🌱seedling",
    if(file.links.length >= 5 && file.backlinks.length >= 2, "✅ → sapling", "❌"),
    if(maturity == "🪴sapling",
      if(file.links.length >= 10 && file.backlinks.length >= 5 && (today() - file.mtime).days.round() >= 30, "✅ → evergreen", "❌"),
      if(maturity == "🌲evergreen",
        if(file.links.length >= 15 && file.backlinks.length >= 10 && (today() - file.mtime).days.round() >= 60, "✅ → fruit", "❌"),
        "🍓"
      )
    )
  )
)
```

Checks current `maturity` against promotion thresholds. Returns `✅ → <next stage>` if all conditions are met, `❌` if not, `🍓` if already at max.

**Thresholds:**

| Transition | Outlinks | Backlinks | Days Stable |
|-----------|----------|-----------|-------------|
| 📤seed → 🌱seedling | 2+ | 1+ | — |
| 🌱seedling → 🪴sapling | 5+ | 2+ | — |
| 🪴sapling → 🌲evergreen | 10+ | 5+ | 30+ |
| 🌲evergreen → 🍓fruit | 15+ | 10+ | 60+ |

**Usage:** Open `Maturity Pipeline` view, sort `Promote?` column — all `✅` rows bubble to the top. Then promote manually via `maturity-evolve.js` (QuickAdd macro).

**Note on Days Stable:** The threshold means the note must *not* have been edited for that many days. Editing a note signals it's still being developed, not yet stable enough to promote.

---

## Daily — `05-Calendar/Daily/_Daily_Data.base`

### `Week`
```
date.format("gggg-[W]ww")
```
ISO week identifier for the day (e.g. `2026-W09`). Uses `gggg` (ISO week year) to match the Periodic Notes plugin convention. Primary grouping key in the `By Week` view.

### `Day of Week`
```
date.format("dddd")
```
Full day name — Monday, Tuesday, etc. Uses the note's `date` field, not `file.mtime`.

### `Month`
```
date.format("YYYY-MM")
```
Month identifier (e.g. `2026-02`). Used for grouping in the `By Month` view.

### `Quarter`
```
date.format("YYYY-[Q]Q")
```
Quarter identifier (e.g. `2026-Q1`). Uses Moment.js `Q` token. Fallback if unsupported: nested `if()` mapping months 1–3/4–6/7–9/10–12 to Q1–Q4.

### `Links Made`
```
file.links.length
```
Count of outgoing links from the daily note — a proxy for how generative the day was. High count = active capture day.

---

## Sources — `04-Sources/_Sources_Data.base`

### `Notes Extracted`
```
file.links.filter(value.asFile().properties.type == "atomic").length
```
Counts outgoing links to atomic notes — ideas pulled out while reading. A completed source with `0` here is a signal to go back and process it.

### `Days Since Started`
```
(today() - file.ctime).days.round() + " days"
```
Days since the source was added to the vault (creation time, not modification time).

### `Days Stale`
```
(today() - file.mtime).days.round() + " days ago"
```
Days since the source note was last touched. Useful for spotting books you started and abandoned.

---

## Views Quick Reference

| Base File             | View              | Purpose                                              |
| --------------------- | ----------------- | ---------------------------------------------------- |
| `_People_Data.base`   | All People        | Everyone sorted by longest neglected                 |
| `_People_Data.base`   | Active Contacts   | Active contacts only                                 |
| `_Meetings_Data.base` | All Meetings      | All meetings sorted by date                          |
| `_Meetings_Data.base` | Meetings          | Embedded in Person notes — shows their meetings only |
| `_Efforts_Data.base`  | Needs Attention   | Active efforts sorted by most neglected              |
| `_Efforts_Data.base`  | Active Projects   | On/ folder with formula columns                      |
| `_Atomics_Data.base`  | Maturity Pipeline | All atoms with promotion readiness                   |
| `_Atomics_Data.base`  | Ready to Promote  | Same — sort `Promote?` to find `✅` rows              |
| `_Sources_Data.base`  | Reading Now       | In-progress sources with staleness signal            |
| `_Sources_Data.base`  | To Read           | Backlog sorted by date added                         |
| `_Sources_Data.base`  | Completed         | Finished reads with harvest metrics                  |
| `_Daily_Data.base`    | Daily Log         | All days newest first — mood, energy, links made     |
| `_Daily_Data.base`    | By Week           | Days grouped by ISO week — live pattern view         |
| `_Daily_Data.base`    | By Month          | Days grouped by month                                |
| `_Daily_Data.base`    | Highlights Stream | Days with a highlight field — newest first           |
| `_Daily_Data.base`    | High Energy Days  | Days with High/⚡ energy — newest first              |

---

## Caveats

- **`file.links.filter(value.asFile().properties.X)`** — requires the linked file to exist and have the property set. Broken links or missing `type` fields return `null`, which `.filter()` silently drops.
- **`Last Contact` / `Since Contact`** — if a person has no meeting backlinks, the reduce returns `""` and the days calculation may error. Use `Meetings` count as a sanity check first.
- **`Due In`** — negative values mean overdue. Bases renders them as plain numbers, not color-coded.
- **`Promote?` with `&&`** — if Bases doesn't support `&&`, split into separate `Outlinks OK` / `Backlinks OK` / `Stable OK` boolean formulas and read them as a row.

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
