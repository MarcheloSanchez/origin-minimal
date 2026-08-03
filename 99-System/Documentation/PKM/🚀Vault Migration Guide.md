---
up: "[[🗺️My PKM MOC]]"
title: Vault Migration Guide
type: system
tags: 
  - ⚙️system
  - 📋documentation
  - 🚀migration
status: 🔄active
maturity: 🌱seedling
created: "2026-02-15"
modified: "2026-07-13"
related: 
  - "[[🔁My PKM Workflows]]"
  - "[[📦Template System Guide]]"
  - "[[🔧Scripts Reference]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[🔁My PKM Workflows]] | [[📦Template System Guide]] | [[🔧Scripts Reference]] | 🚀Vault Migration Guide

> [!note] Updated for v2.0 architecture (2026-05-06).


> [!info]+ **⚡ Migration Guide**
> **Purpose**: Fork the Origin vault, understand every system, and adapt it to your domain
> **Time**: ~2-3 hours for initial setup, then iterative customization
> **Prerequisite knowledge**: Basic Obsidian familiarity (creating notes, installing plugins)

---

## 1. Prerequisites

### Obsidian

- **Obsidian v1.5+** (required for Templater and QuickAdd compatibility)
- Desktop version recommended for initial setup (mobile sync can follow)

### Required Community Plugins

The vault depends on these plugins (listed in `.obsidian/community-plugins.json`):

| Plugin | Purpose | Critical? |
|--------|---------|-----------|
| **Templater** (`templater-obsidian`) | Template composition engine — powers all note creation | Yes |
| **QuickAdd** (`quickadd`) | Macro system — triggers scripts, quick capture | Yes |
| **Periodic Notes** (`periodic-notes`) | Daily/weekly/monthly note automation | Yes |
| **Commander** (`cmdr`) | Custom buttons for status/maturity changes | Recommended |
| **Kanban** (`obsidian-kanban`) | Visual project boards | Optional |
| **Homepage** (`homepage`) | Auto-open Home note on vault launch | Recommended |
| **Folder Notes** (`folder-notes`) | Folder-level index notes | Recommended |
| **Advanced URI** (`obsidian-advanced-uri`) | External automation hooks | Optional |
| **Style Settings** (`obsidian-style-settings`) | Theme customization | Optional |
| **Minimal Settings** (`obsidian-minimal-settings`) | Minimal theme configuration | Optional |
| **Switcher Plus** (`darlal-switcher-plus`) | Enhanced file switcher | Optional |
| **URL into Selection** (`url-into-selection`) | Paste URL as markdown link | Optional |
| **Plugin Update Tracker** (`obsidian-plugin-update-tracker`) | Track plugin updates | Optional |
| **Lazy Plugin Loader** (`lazy-plugins`) | Defer plugin loading for performance | Optional |

> [!note] **Dataview** is used extensively by dashboards and scripts but is not listed in `community-plugins.json` because it's expected to be installed separately. Install it manually.

### Git

- Git installed for version control (recommended)
- GitHub account if forking the public repo

---

## 2. Architecture Overview

### 8-Layer PARA Structure

```
Origin Vault/
├── +Inbox/          ← Capture landing zone (process daily)
├── 01-MOCs/         ← Maps of Content (navigation hubs)
├── 02-Knowledge/    ← Atomic knowledge units
│   ├── Atomics/     ← Ideas, concepts, statements
│   ├── Areas/       ← Areas of responsibility
│   ├── People/      ← People notes
│   ├── Places/      ← Location notes
│   └── Tools/       ← Tool documentation
├── 03-Efforts/      ← Projects and goals
│   ├── Active/      ← In-progress efforts
│   ├── Paused/      ← On hold
│   └── Waiting/     ← Someday/maybe
├── 04-Sources/      ← External references
│   └── Meetings/    ← Meeting notes
├── 05-Calendar/     ← Periodic notes and reports
│   ├── Daily/       ← Daily journal
│   ├── Weekly/      ← Weekly reviews
│   ├── Monthly/     ← Monthly reviews
│   └── Newsletter/  ← Generated newsletters
├── 06-Archive/      ← Completed and inactive content
└── 99-System/       ← Infrastructure
    ├── CIS/         ← Content Information Standards (canonical values)
    ├── Config/      ← YAML config files
    ├── Documentation/PKM/ ← This guide and others
    ├── FileClass/   ← Note type schemas
    ├── Prompts/     ← AI prompt management
    └── Scripts/     ← Automation scripts
```

### Key Systems

| System | Location | Documentation |
|--------|----------|---------------|
| **CIS** (Content Information Standards) | `99-System/CIS/` | Canonical values for status, maturity, type, tags |
| **FileClass** | `99-System/FileClass/` | Note type metadata schemas |
| **Templates** | `Templates/` | 4-tier modular template architecture |
| **Scripts** | `99-System/Scripts/` | 22 automation scripts |
| **Config** | `99-System/Config/` | YAML orchestrator configuration |

For deep dives: [[📦Template System Guide]], [[🔧Scripts Reference]], [[🔁My PKM Workflows]]

---

## 3. Fork & Initial Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-fork/origin-vault.git
cd origin-vault
```

Or download as ZIP and extract to your preferred vault location.

### Step 2: Open as Obsidian Vault

1. Open Obsidian
2. **Open folder as vault** → select the cloned/extracted folder
3. When prompted about community plugins, click **Trust author and enable plugins**

### Step 3: Install Community Plugins

1. Go to **Settings > Community Plugins > Browse**
2. Install each plugin from the Required list above
3. **Critical**: Install **Dataview** separately (not in the bundled config)
4. Enable all installed plugins

### Step 4: Configure Templater

1. **Settings > Templater > Template folder location**: `Templates`
2. **Settings > Templater > User script functions folder**: `99-System/Scripts`
3. **Trigger Templater on new file creation**: Enable
4. **Folder Templates**: These ship in `.obsidian/plugins/templater-obsidian/data.json` — verify they load rather than re-entering them. They cover the typed destination folders only (`02-Knowledge/*`, `03-Efforts`, `04-Sources`, `01-MOCs`, `05-Calendar/*`).
   - **`+Inbox` intentionally has NO folder template.** A note created directly in `+Inbox` must stay bare — no frontmatter, no sections. Structured capture is QuickAdd's job (**Quick Inbox** choice), not the folder's. See [[+About Inboxℹ️]] for the contract. Do not add a `+Inbox` entry back.

### Step 5: Configure QuickAdd

QuickAdd macros should load from the vault's `.obsidian/plugins/quickadd/` config. Verify:

1. **Settings > QuickAdd**
2. Check that macros exist for: New Atomic, New Effort, New Source, New Meeting, New Prompt, etc.
3. Check that user scripts point to `99-System/Scripts/`

### Step 6: Verify Home Note

1. Open `🏡Home.md`
2. Verify navigation links resolve (no broken `[[wikilinks]]`)
3. Check that dashboard callouts render correctly

> [!success] If the Home note loads with working navigation, your base setup is complete.

---

## 4. Configuration Checklist

Work through these in order of priority. Each item builds on the previous.

### Priority 1: Personal Identity

- [ ] **Update `🏡Home.md`** — Replace placeholder text with your name/context
- [ ] **Set timezone** in Periodic Notes plugin settings

### Priority 2: Content Standards (CIS)

Review and adapt canonical values in `99-System/CIS/`:

- [ ] **`CIS_TYPE.md`** — Add domain-specific types if needed (see [[📦Template System Guide#5. Two-Tier Type System]])
- [ ] **`CIS_STATUS.md`** — Review status values: `📥inbox`, `🔄active`, `⏳waiting`, `✅completed`, `📦archived`, `⏸️paused`, `❌cancelled`
- [ ] **`CIS_MATURITY.md`** — Review maturity stages: `📤seed`, `🌱seedling`, `🪴sapling`, `🌲evergreen`, `🍓fruit`
- [ ] **`CIS_TAGS.md`** — Add domain-specific tags

### Priority 3: Templates

- [ ] **Review Meta templates** (`Templates/Meta/`) — Adapt YAML fields for your domain
- [ ] **Review Body templates** (`Templates/Body/`) — Customize section headings and structure
- [ ] **Test note creation** — Create one note of each type via QuickAdd to verify templates work
- [ ] See [[📦Template System Guide]] for full customization guide

### Priority 4: FileClass Schemas

- [ ] **Review `99-System/FileClass/`** — Adapt field definitions for your needs
- [ ] **Add missing FileClasses** — `person`, `place`, `tool`, `area` currently use `base.md`
- [ ] See [[📦Template System Guide#FileClass Gap]] for details

### Priority 5: Scripts & Macros

- [ ] **Test `update-metrics-cache.js`** — Run via QuickAdd to verify metrics work
- [ ] **Test `yaml_orchestrator.js`** — Run lint mode on a test folder
- [ ] **Configure QuickAdd macros** — Register any custom scripts
- [ ] See [[🔧Scripts Reference]] for all 22 scripts

### Priority 6: Dashboards

- [ ] **Review `👁️Dashboard`** — Customize queries for your content areas
- [ ] **Review `Performance Metrics`** — Verify Dataview queries return results
- [ ] **Run metrics cache update** to populate dashboard data

### Priority 7: Calendar & Periodic Notes

- [ ] **Configure daily note template** in Periodic Notes settings
- [ ] **Set weekly/monthly templates** — Point to `Templates/Calendar/`
- [ ] **Test daily note creation** — `Ctrl+D` should create today's note

---

## 5. Domain Adaptation Examples

### Personal PKM (Minimal Changes)

**What to customize**:
- Update `🏡Home.md` with personal navigation
- Add personal tags to `CIS_TAGS.md`
- Adjust effort subfolders (`Active/Paused/Waiting`) to match your project style
- Keep all 10 note types as-is

**What to keep as-is**: Template structure, scripts, maturity system, review workflows.

---

### Work / Team Knowledge Base

**What to customize**:
- Add note types: `client`, `department`, `process` (lightweight types)
- Add effort subtypes: `sprint`, `okr`, `initiative`
- Customize meeting template with agenda/action-item sections
- Add work-specific tags: `#team/engineering`, `#project/alpha`
- Configure shared folders for team content

**Template changes**:
- `meeting-body.md` — Add attendees list, action items, follow-up section
- `effort-meta.yaml.md` — Add `team`, `quarter`, `okr_link` fields

---

### Academic Research

**What to customize**:
- Add source subtypes: `paper`, `thesis`, `dataset`, `experiment`
- Enhance `source-meta.yaml.md` with: `doi`, `authors`, `journal`, `year`, `citations`
- Add `literature-review` body template
- Create citation workflow: source → atomic (key findings) → effort (paper)
- Add tags: `#field/neuroscience`, `#method/fMRI`

**New types to create** (follow [[📦Template System Guide#3. How to Create a New Note Type]]):
- `paper` (full type) — For your own publications
- `experiment` (full type) — Lab experiments with protocol/results structure
- `dataset` (lightweight) — Reference entries for datasets

---

### Content Creation

**What to customize**:
- Add pipeline stages to status or use effort subtypes: `idea`, `draft`, `review`, `published`
- Add `content-meta.yaml.md` with: `platform`, `format`, `target_audience`, `publish_date`
- Leverage newsletter workflow for content calendars
- Add tags: `#platform/youtube`, `#format/blog`, `#audience/developers`

**Workflow addition**: Content Pipeline
```
📥inbox → draft (03-Efforts/Active) → review → published → 📦archived
```

Configure `generate-newsletter.js` to pull from your content pipeline for distribution.

---

## 6. Verification Checklist

After completing setup, verify each system works:

### Note Creation
- [ ] Create a new Atomic note via QuickAdd — verify YAML + body render correctly
- [ ] Create a new Effort note via QuickAdd — verify due date and priority fields
- [ ] Create a new Source note via QuickAdd — verify source-specific fields
- [ ] Create a new Meeting note — verify date auto-fills

### YAML System
- [ ] Run `yaml_orchestrator.js` in lint mode on `+Inbox` — should return clean report
- [ ] Run `yaml_validator.js` on a test note — should validate without errors

### Metrics & Dashboards
- [ ] Run `update-metrics-cache.js` via QuickAdd — check `_Metrics Cache.md` for populated fields
- [ ] Open `👁️Dashboard` — verify numbers display (not errors)
- [ ] Open `Performance Metrics` — verify Dataview tables render

### Scripts
- [ ] Test QuickAdd Capture entries `➡️Status Progression NEXT` / `⬅️Status Progression PREV` — advance/revert a note's status
- [ ] Test `status-picker.js` — pick a status via Commander button
- [ ] Test `auto-metadata.js` on an inbox note — verify frontmatter is populated

### Template Composition
- [ ] Verify `combine()` works: create note via `Templates/Create/new-atomic.md`
- [ ] Verify auto mode: create note via `Templates/Create/new-atomic-auto.md` — status should be `🔄active`

### Archival
- [ ] Test `archive_note.js` on a test note — verify status changes to `📦archived` and file moves to `06-Archive/`

---

## 7. Troubleshooting

### Common Issues After Fork

| Issue | Likely Cause | Fix |
|-------|-------------|-----|
| Templates return empty notes | Templater user script folder not set | Settings > Templater > User script folder → `99-System/Scripts` |
| QuickAdd macros missing | Plugin config didn't transfer | Re-create macros pointing to `Templates/Create/` |
| Dataview queries show errors | Dataview plugin not installed | Install Dataview from Community Plugins |
| `combine()` returns blank | Template paths changed | Verify `Templates/Meta/` and `Templates/Body/` contain `{type}-meta.yaml.md` and `{type}-body.md` |
| YAML orchestrator fails | Config file missing | Verify `99-System/Config/yaml-meta-config.json` exists |
| Dashboard shows NaN/undefined | Metrics cache empty | Run `update-metrics-cache.js` via QuickAdd |
| Status/maturity scripts don't work | QuickAdd not configured | Register scripts as QuickAdd user script macros |
| Home note has broken links | Vault structure modified | Run lint: `yaml_orchestrator.js` with `{ mode: "lint" }` |

### Plugin Conflicts

- **Templater + QuickAdd**: Both can trigger on new file creation. Set Templater as the primary template engine; QuickAdd should call Templater templates via macros.
- **Multiple file renaming plugins**: Disable any plugin that auto-renames files — the vault expects stable filenames for wikilinks.

### Performance Issues

- **Slow dashboard loading**: Run `update-metrics-cache.js` to cache expensive queries
- **Slow vault startup**: Enable `lazy-plugins` to defer non-critical plugin loading
- **Large vault (5000+ notes)**: Archive old daily notes with `archive-old-dailies.js` (quarterly)

### Getting Help

- Review [[🔁My PKM Workflows]] for workflow questions
- Review [[📦Template System Guide]] for template issues
- Review [[🔧Scripts Reference]] for script usage and parameters

---

## 🔗 Related

- [[🔁My PKM Workflows]] — Daily/weekly/monthly workflow guide
- [[📦Template System Guide]] — Template architecture and customization
- [[🔧Scripts Reference]] — All 22 scripts documented
- [[🏡Home]] — Vault entry point

---

*Last Updated: 2026-05-06 | Status: 🔄active*

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*