---
up: "[[🗺️My PKM MOC]]"
title: Template System Guide
type: system
tags: 
  - ⚙️system
  - 📋documentation
  - 📦templates
status: 🔄active
maturity: 🌱seedling
created: "2026-02-15"
modified: "2026-06-17"
related: 
  - "[[🔁My PKM Workflows]]"
  - "[[🔧Scripts Reference]]"
  - "[[🚀Vault Migration Guide]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[🔁My PKM Workflows]] | [[📦Template System Guide]] | [[🔧Scripts Reference]] | [[🚀Vault Migration Guide]]


> [!info]+ **⚡ Template System**
> **Location**: `Templates/`
> **Architecture**: 4-tier modular composition (Meta + Body + Create + Static)
> **Engine**: `Templater_script.js` — composes Meta and Body at note creation time
> **Philosophy**: Separate concerns (metadata vs content), support both dynamic and static workflows

---

## 1. Architecture Overview

The template system uses a **4-tier modular architecture** where each note type's template is split into independent, composable parts.

```
Templates/
├── Meta/           ← YAML frontmatter templates ({type}-meta.yaml.md)
├── Body/           ← Markdown body templates ({type}-body.md)
├── Create/         ← Entry points for new notes (new-{type}.md, new-{type}-auto.md)
├── Static/         ← Complete standalone templates (no Templater needed)
├── Actions/        ← Vault action templates (archive, status change, etc.)
├── Add-Sections/   ← Insertable content blocks
├── Core/           ← Shared base components
├── Queries/        ← Reusable Dataview query snippets
├── Calendar/       ← Daily/weekly/monthly note templates
├── Gamification/   ← XP and streak templates
├── Kanban/         ← Kanban board templates
├── Quick-Inserts/  ← Quick-insert snippets
├── Scripts/        ← Template-embedded scripts
├── Tests/          ← Template test fixtures
├── _Examples/      ← Example notes for reference
└── _Drafts/        ← Work-in-progress templates
```

### Tier Breakdown

#### Meta (`Templates/Meta/`)
YAML frontmatter templates defining the metadata schema for each note type.

**Naming**: `{type}-meta.yaml.md` (e.g., `atomic-meta.yaml.md`)

**Contents**: A complete `---` YAML block with Templater expressions for dynamic values.

**Example** (`atomic-meta.yaml.md`):
```yaml
---
in:
  - "[[Atomics]]"
title:
type: atomic
fileClass: atomic
tags:
  - 💡atomic
status: 🔄active
maturity: 📤seed
processing_priority:
created: <% tp.date.now("YYYY-MM-DD") %>
modified: <% tp.date.now("YYYY-MM-DD") %>
related:
---
```

**Available Meta templates** (10 — one per full type):
`area`, `atomic`, `effort`, `meeting`, `moc`, `person`, `place`, `prompt`, `source`, `tool`

---

#### Body (`Templates/Body/`)
Markdown content templates defining the structure and sections of each note type.

**Naming**: `{type}-body.md` (e.g., `atomic-body.md`)

**Contents**: Heading structure, placeholder text, task lists, and section scaffolding.

**Example** (`atomic-body.md`):
```markdown
## 🧠 One-liner
(the idea in one sentence)

## 🧩 Notes & Sketches
- …

## 🔗 Related
- [[]] · [[]]

## ▶️ Next step
- [ ] Develop into a Dot or add to an Effort
```

**Available Body templates** (10 — one per full type):
`area`, `atomic`, `effort`, `meeting`, `moc`, `person`, `place`, `prompt`, `source`, `tool`

---

#### Create (`Templates/Create/`)
Entry points that Obsidian/QuickAdd invoke to create new notes. Each calls `combine()` to assemble Meta + Body.

**Naming**: `new-{type}.md` (empty mode) and `new-{type}-auto.md` (auto mode)

**Example** (`new-atomic.md`):
```
<%*
tR += await tp.user.Templater_script.combine(tp, "atomic", "empty");
%>
```

**Example** (`new-atomic-auto.md`):
```
<%*
tR += await tp.user.Templater_script.combine(tp, "atomic", "auto");
%>
```

**Modes**:
- **Empty** (`new-{type}.md`) — Status defaults to `📥inbox`. For notes captured quickly that need processing later.
- **Auto** (`new-{type}-auto.md`) — Status set to `🔄active`. For notes you're ready to work on immediately.

**Available Create templates** (21 — pairs for each full type plus `new-quick-prompt.md`):
`atomic`, `effort`, `source`, `moc`, `meeting`, `prompt`, `person`, `place`, `tool`, `area` (× 2 modes each), plus `quick-prompt`

---

#### Static (`Templates/Static/`)
Complete standalone templates that work without Templater. Useful as fallback or for environments where Templater is unavailable.

**Available Static templates** (8):
`atomic`, `effort`, `moc`, `person`, `place`, `prompt`, `quick-prompt`, `tool`

> [!note] Static templates are not automatically kept in sync with Meta + Body. After modifying a Meta or Body template, manually update the corresponding Static template if one exists.

---

## 2. Template Composition Flow

When you create a new note, here's what happens:

```
User triggers "New Atomic Note" (QuickAdd / Templater)
         │
         ▼
Templates/Create/new-atomic.md
         │
         │  tR += await tp.user.Templater_script.combine(tp, "atomic", "empty")
         │
         ▼
Templater_script.js :: combine()
         │
         ├──► resolveTemplatePath("atomic", "meta")
         │    Searches: Templates/Meta/atomic-meta.yaml.md (found!)
         │    Returns: rendered YAML frontmatter
         │
         ├──► resolveTemplatePath("atomic", "body")
         │    Searches: Templates/Body/atomic-body.md (found!)
         │    Returns: rendered body markdown
         │
         └──► Returns: meta + "\n\n" + body
                  │
                  ▼
         Note created with composed content
```

### Path Resolution Priority

For each template kind (meta/body), the engine searches these paths in order:

**Meta templates**:
1. `Templates/Meta/{type}-meta.yaml.md` (new modular path)
2. `Templates/New-Notes/Type/{Type}/{Type}-Meta.yaml.md` (legacy)
3. `Templates/Type/{Type}/{Type}-Meta.yaml.md` (legacy)
4. `Templates/{Type}/Meta.yaml.md` (legacy)

**Body templates**:
1. `Templates/Body/{type}-body.md` (new modular path)
2. `Templates/New-Notes/Type/{Type}/{Type}-Body.md` (legacy)
3. `Templates/Type/{Type}/{Type}-Body.md` (legacy)
4. `Templates/{Type}/Body.md` (legacy)

The first path that resolves to an existing file wins. This allows gradual migration from legacy to new naming without breaking anything.

### Empty vs Auto Mode

| Aspect | Empty Mode | Auto Mode |
|--------|-----------|-----------|
| Status | `📥inbox` | `🔄active` |
| Use case | Quick capture, process later | Ready to work on now |
| Template | `new-{type}.md` | `new-{type}-auto.md` |
| Mechanism | `combine(tp, type, "empty")` | `combine(tp, type, "auto")` — replaces `📥inbox` with `🔄active` in rendered meta |

---

## 3. How to Create a New Note Type

End-to-end walkthrough for adding a full note type (e.g., "recipe").

### Step 1: Create CIS file

Create `99-System/CIS/CIS_RECIPE.md` (or add "recipe" to `CIS_TYPE.md`).

This registers the type in the Content Information Standards so validators and scripts recognize it.

### Step 2: Create FileClass

Create `99-System/FileClass/recipe.md` with the metadata schema:

```yaml
---
name: recipe
extends: base
fields:
  - name: cuisine
    type: Input
  - name: prep_time
    type: Input
  - name: servings
    type: Number
---
```

### Step 3: Create Meta template

Create `Templates/Meta/recipe-meta.yaml.md`:

```yaml
---
in:
  - "[[Recipes MOC]]"
title:
type: recipe
fileClass: recipe
tags:
  - 🍳recipe
status: 📥inbox
cuisine:
prep_time:
servings:
created: <% tp.date.now("YYYY-MM-DD") %>
modified: <% tp.date.now("YYYY-MM-DD") %>
related:
---
```

### Step 4: Create Body template

Create `Templates/Body/recipe-body.md`:

```markdown
## 🍳 Overview
(Brief description of the dish)

## 📝 Ingredients
-

## 👨‍🍳 Instructions
1.

## 💡 Notes
-

## 🔗 Related
- [[]] · [[]]
```

### Step 5: Create Create templates

Create `Templates/Create/new-recipe.md`:
```
<%*
tR += await tp.user.Templater_script.combine(tp, "recipe", "empty");
%>
```

Create `Templates/Create/new-recipe-auto.md`:
```
<%*
tR += await tp.user.Templater_script.combine(tp, "recipe", "auto");
%>
```

### Step 6: Register in Templater_script.js

Add to the `TYPE_LOWERCASE` map in `99-System/Scripts/Templater_script.js`:

```javascript
const TYPE_LOWERCASE = {
  // ... existing types ...
  "recipe": "recipe",
};
```

### Step 7: Register QuickAdd macro

In Obsidian Settings > QuickAdd:
1. Add new Macro: "New Recipe"
2. Add step: Template → `Templates/Create/new-recipe.md`
3. Configure: Create new note, set filename pattern
4. (Optional) Add to Command Palette

### Step 8: (Optional) Extras

- **Static template**: Create `Templates/Static/recipe.md` with combined Meta + Body (no Templater syntax)
- **Example**: Create `Templates/_Examples/recipe-example.md`
- **Actions**: Create type-specific actions in `Templates/Actions/`
- **Validator schema**: Add `recipe` schema to `yaml_validator.js`

---

## 4. Templater_script.js Function Reference

All functions are exported from `99-System/Scripts/Templater_script.js` and accessed via `tp.user.Templater_script`.

### `combine(tp, type, mode)`

**Purpose**: Composes a complete note from Meta + Body templates. This is the primary function used by Create templates.

**Parameters**:
- `tp` — Templater instance
- `type` — Note type string (e.g., `"atomic"`, `"effort"`)
- `mode` — `"empty"` (default) or `"auto"`

**Returns**: String containing rendered YAML + body content.

**Usage**:
```
<%* tR += await tp.user.Templater_script.combine(tp, "atomic", "empty"); %>
```

> [!warning] **Critical**: Always use `tR +=` to capture the return value. Never call `combine()` without assigning its output — Templater needs `tR` to write the file content. Using `writeActive()` to write `combine()`'s output will race with Templater's own file write.

**Auto mode behavior**: Replaces `status: "📥inbox"` with `status: "🔄active"` in the rendered meta template.

---

### `inject_meta_if_missing(tp, type)`

**Purpose**: Adds YAML frontmatter to an existing note that has none.

**Parameters**: `tp`, `type`

**Returns**: `"exists"` (frontmatter already present), `"no-meta"` (template not found), `"ok"` (injected)

**When to use**: Applying metadata to imported or legacy notes that lack frontmatter.

**Behavior**: Reads the active file. If frontmatter already exists, skips with a Notice. Otherwise, prepends the rendered Meta template.

---

### `add_chapters(tp, type)`

**Purpose**: Replaces the body content of the active note while preserving existing YAML frontmatter.

**Parameters**: `tp`, `type`

**Returns**: `"no-body"` (template not found), `"ok"` (applied)

**When to use**: Re-applying the body template after manual edits have corrupted the structure.

---

### `reset_body(tp, type)`

**Purpose**: Resets the body to the template default while keeping YAML intact.

**Parameters**: `tp`, `type`

**Returns**: `"no-body"` or `"ok"`

**Identical to `add_chapters`** in current implementation — both replace body, preserve YAML.

---

### `reset_meta(tp, type)`

**Purpose**: Resets YAML frontmatter to the template default while keeping the body intact.

**Parameters**: `tp`, `type`

**Returns**: `"missing"` (template not found), `"ok"` (replaced)

**When to use**: When YAML has been corrupted or needs to be reset to defaults.

> [!note] This will overwrite all custom metadata values with template defaults. Use with caution.

---

### `reset_all(tp, type, mode)`

**Purpose**: Replaces both YAML and body from templates — effectively recreates the note from scratch.

**Parameters**: `tp`, `type`, `mode` (`"empty"` or `"auto"`)

**Returns**: `"missing"` or `"ok"`

**When to use**: Nuclear option — resets everything. Useful for corrupted notes or switching a note's type entirely.

> [!warning] This overwrites the entire file content. All custom content will be lost.

---

## 5. Two-Tier Type System

Origin uses a two-tier type system to balance flexibility with simplicity.

### Full Types (10)

Full types have the complete template stack: CIS definition, FileClass, Meta template, Body template, Create templates, and (optionally) Static templates.

| Type | Folder | FileClass | Description |
|------|--------|-----------|-------------|
| `atomic` | `02-Knowledge/Atomics` | `atomic.md` | Knowledge units, ideas, concepts |
| `effort` | `03-Efforts` | `effort.md` | Projects, tasks, goals |
| `source` | `04-Sources` | `source.md` | Books, articles, videos, references |
| `moc` | `01-MOCs` | `moc.md` | Maps of Content, navigation hubs |
| `meeting` | `04-Sources/Meetings` | `meeting.md` | Meeting notes, agendas |
| `prompt` | `99-System/Prompts` | `prompt.md` | AI prompt templates |
| `person` | `02-Knowledge/People` | `base.md`* | People, contacts |
| `place` | `02-Knowledge/Places` | `base.md`* | Locations |
| `tool` | `02-Knowledge/Tools` | `base.md`* | Tools, software, methods |
| `area` | `02-Knowledge/Areas` | `base.md`* | Areas of responsibility |

*\* `person`, `place`, `tool`, and `area` use the `base.md` FileClass — they have Meta/Body/Create templates but no dedicated FileClass schema.*

### Lightweight Types (11)

Lightweight types have only a CIS entry and type resolution in `Templater_script.js`. No FileClass, no dedicated templates — they use inline or calendar templates instead.

| Type | Purpose |
|------|---------|
| `system` | System configuration notes |
| `dashboard` | Dashboard views |
| `about` | About/info pages |
| `guide` | How-to guides |
| `tutorial` | Step-by-step tutorials |
| `daily` | Daily journal notes |
| `weekly` | Weekly review notes |
| `monthly` | Monthly review notes |
| `quarterly` | Quarterly review notes |
| `yearly` | Annual review notes |
| `challenge` | Challenge/gamification notes |

### Decision Guide: Full vs Lightweight

**Create a full type when**:
- Notes of this type need a distinct metadata schema (unique YAML fields)
- You'll create many notes of this type (10+ expected)
- Notes need structured body sections specific to the type
- You want QuickAdd "New {Type}" creation workflow

**Keep it lightweight when**:
- The type is primarily for classification, not structure
- Few notes expected (< 10)
- Calendar-driven (daily/weekly/monthly — handled by Periodic Notes plugin)
- System/infrastructure notes that don't need templates

---

## 6. Gotchas & Common Mistakes

### `combine()` Must Use `tR +=`

**Wrong**:
```
<%* await tp.user.Templater_script.combine(tp, "atomic", "empty"); %>
```
This runs `combine()` but discards the return value. The note will be empty.

**Wrong**:
```
<%*
const content = await tp.user.Templater_script.combine(tp, "atomic", "empty");
await app.vault.modify(app.workspace.getActiveFile(), content);
%>
```
This races with Templater's own file write. The result is unpredictable.

**Correct**:
```
<%*
tR += await tp.user.Templater_script.combine(tp, "atomic", "empty");
%>
```

### `writeActive()` vs `tR +=`

- **`tR +=`**: Used by `combine()` — returns content for Templater to write
- **`writeActive()`**: Used by `reset_body()`, `reset_meta()`, `reset_all()`, `inject_meta_if_missing()`, `add_chapters()` — writes directly to active file (safe because these are called on already-existing notes, not during Templater's creation flow)

### Template Path Resolution

New templates use lowercase naming (`atomic-meta.yaml.md`). Legacy templates use mixed case (`Atomic-Meta.yaml.md`). The resolution engine tries new paths first, then falls back to legacy. If you're creating new templates, always use lowercase.

### FileClass Gap

Only 8 FileClasses exist for 10 full types:

| Has FileClass | Uses `base.md` |
|---------------|----------------|
| `atomic`, `effort`, `source`, `moc`, `meeting`, `prompt`, `archive` | `person`, `place`, `tool`, `area` |

This means `person`, `place`, `tool`, and `area` notes won't have type-specific field suggestions in the FileClass sidebar. To fix, create dedicated FileClass files extending `base.md`.

### Maturity Value in Templates

The `atomic-meta.yaml.md` template currently uses `maturity: 📤seed`. The canonical CIS value for the first maturity stage is `📤seed`. This inconsistency is known — the orchestrator normalizes it, but be aware when reading raw template output.

### Static Templates Drift

Static templates in `Templates/Static/` are manually maintained copies. After modifying Meta or Body templates, remember to update the corresponding Static template — there's no automatic sync.

---

## 🔗 Related

- [[🔧Scripts Reference]] — Full documentation of all 22 scripts including `Templater_script.js`
- [[🔁My PKM Workflows]] — How templates integrate into daily capture and processing
- [[🚀Vault Migration Guide]] — Template customization during vault setup

---

*Last Updated: 2026-02-15 | Status: 🔄active*

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
