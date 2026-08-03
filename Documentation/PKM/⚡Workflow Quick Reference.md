---
up: "[[🔁My PKM Workflows]]"
title: ⚡Workflow Quick Reference
type: guide
tags: 
  - 📋automation
  - 🔄workflow
status: 🔄active
maturity: 🌱seedling
created: "2026-01-16"
modified: "2026-06-17"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🔁My PKM Workflows]] | [[📈Performance Metrics]] | [[🔧Scripts Reference]]

# ⚡ Workflow Quick Reference

> [!tip] Purpose
> Fast lookup guide for all Origin Vault workflows and automation commands.
> **Print this page** or keep it open in a pinned tab for instant reference!

---

## 📥 Inbox Processing Workflows

### 🚀 Quick Process (Type-Specific)

**When to use:** You know the note type, want instant processing

| Command | Time | What it Does |
|---------|------|--------------|
| `Ctrl+P` → **⚡Quick Process - Atomic** | 10-15s | Suggests subfolder → Adds metadata → Moves to 100-Atomics |
| `Ctrl+P` → **⚡Quick Process - Source** | 15-20s | Prompts for URL → Adds template → Moves to 04-Sources |
| `Ctrl+P` → **⚡Quick Process - Effort** | 15-20s | Prompts for deadline → Determines status → Moves to 03-Efforts |

**Steps:**
1. Open note in +Inbox
2. Run appropriate Quick Process command
3. Answer 2-3 prompts (title/URL/deadline)
4. Note is moved, templated, and ready!

---

### 🤖 Smart Classify (AI-Powered)

**When to use:** Unsure where note belongs, want AI suggestions

**Command:** `Ctrl+P` → **🤖Smart Classify Note**

**Time:** 15-20 seconds

**What it does:**
1. Analyzes content + title (bilingual Czech/English)
2. Suggests: Type, Folder, Tags, Maturity
3. Shows confidence score (0-100%)
4. Lets you accept/edit/reject
5. Auto-moves + applies metadata

**Steps:**
1. Open note (can be in +Inbox or anywhere)
2. Run `🤖Smart Classify Note`
3. Review suggestions in dialog
4. Accept → Done! Edit → Adjust → Apply

**Best for:** Complex notes, unclear classification, batch reviews

---

### 📦 Batch Process Inbox

**When to use:** Weekly inbox cleanup, 20+ notes to process

**Command:** `Ctrl+P` → **📦Batch Process Inbox**

**Time:** 2-3 minutes for 20 notes

**What it does:**
1. Analyzes all notes in +Inbox
2. Shows summary table with suggestions
3. Bulk approve high-confidence (>70%)
4. Review individual low-confidence items
5. Moves + metadata all at once

**Steps:**
1. Run `📦Batch Process Inbox`
2. Review summary table
3. Choose: [Approve All High Confidence] or [Review Each]
4. Done!

**Pro Tip:** Run this every Sunday during [[🎯GTD Weekly Review - Template]]

---

### 📝 Auto-Fill Metadata

**When to use:** Note has minimal/incomplete frontmatter

**Command:** `Ctrl+P` → **📝Auto-Fill Metadata**

**Time:** 5 seconds

**What it does:**
- Auto-fills: `created`, `modified`, `type`, `status`, `maturity`, `tags`, `up`, `related`, `title`
- Detects type from folder path
- Calculates maturity from content depth
- Suggests parent links

**Steps:**
1. Open note with incomplete metadata
2. Run `📝Auto-Fill Metadata`
3. Review populated fields
4. Save!

**Best for:** Quick metadata addition without moving note

---

## 🔄 Daily/Weekly Workflows

### Morning Startup (5 min)

```
1. Open [[🏡Home]]
2. Check Agenda (today's calendar + tasks)
3. Review "🔥On" projects (active this week)
4. Run: Ctrl+P → 🔄Update Metrics Cache (if Monday)
5. Process 3-5 quick inbox items
```

---

### Inbox Processing Session (15 min)

**Goal:** Process 10-15 notes

```
1. Open [[+Inbox]]
2. Sort by created date (oldest first)
3. For each note:
   - Quick scan content
   - Run: ⚡Quick Process [type] OR 🤖Smart Classify
   - Answer prompts
   - Next!

4. If 20+ notes:
   - Run: 📦Batch Process Inbox
   - Bulk approve high-confidence
   - Review individual items
```

**Weekly Target:** Clear inbox to <20 items

---

### Weekly Review (30-45 min)

**Command:** Open [[🎯GTD Weekly Review - Template]]

**Steps:**
1. **Reflect:** Review past week's accomplishments
2. **Process:** Run `📦Batch Process Inbox`
3. **Review Projects:** Update status in [[TODO]]
4. **Plan:** Set priorities for next week
5. **Cleanup:** Run `🔄Update Metrics Cache`
6. **Archive:** (Quarterly) Run `📦Archive Old Dailies`

**Best Time:** Sunday evening or Monday morning

---

### Monthly Maintenance (60 min)

```
1. Run: 📦Archive Old Dailies (if >12 months old dailies exist)
2. Review [[Performance Metrics]]
   - Check orphan notes (aim <10%)
   - Identify hub notes (5+ connections)
   - Review maturity distribution
3. Cleanup X/ folder (reclassify experimental notes)
4. Update [[🗺️My PKM MOC]] with new patterns
5. Review and refine [[📍Note Classification Guide]]
```

---

## 🎯 Task Management Workflows

### Capture Task (3 sec)

```
1. Ctrl+P → QuickAdd: Capture
2. Type task
3. Enter → Added to inbox
```

---

### GTD Processing (10 min daily)

**Command:** Open [[TODO]]

**Steps:**
1. Review **System Status** (inbox, active efforts)
2. Process inbox tasks (do/delegate/defer/delete)
3. Update **On** projects (due ≤7 days)
4. Check **Ongoing** projects (due ≤30 days)
5. Move completed efforts to Archive

**Decision Matrix:**
- ≤2 min? → Do it now
- Delegatable? → Create note in 300-People
- Requires multiple steps? → Create Effort note
- Future someday? → Move to Simmering

---

### Project Setup (5 min)

```
1. Ctrl+P → ⚡Quick Process - Effort
2. Enter:
   - Title: "Project Name"
   - Deadline: YYYY-MM-DD
3. Auto-moved to:
   - On (≤7 days)
   - Ongoing (≤30 days)
   - Simmering (>30 days)
4. Add tasks in note body:
   - [ ] Task 1
   - [ ] Task 2
5. Link related notes in frontmatter
```

---

## 📚 Source Processing Workflows

### Book Notes (10 min)

```
1. Ctrl+P → ⚡Quick Process - Source
2. Select: Book
3. Enter URL (Goodreads/Amazon)
4. Template appears with:
   - Summary section
   - Key Insights
   - Key Takeaways
   - Connections
5. Fill in as you read
6. Link to related atomics
```

---

### Article/Video Capture (5 min)

```
1. Copy URL
2. Ctrl+P → ⚡Quick Process - Source
3. Select: Article or Video
4. Paste URL
5. Template appears
6. Add key insights
7. Extract atomic ideas → Create separate atomic notes
```

**Pro Tip:** For videos, use timestamp format in template:
```
## Timestamps
- 00:00 - Introduction
- 05:30 - Key concept 1
- 12:45 - Key concept 2
```

---

## 💡 Atomic Note Creation

### From Scratch (2 min)

```
1. Ctrl+P → ⚡Quick Process - Atomic
2. Enter title: "The Two-Minute Rule"
3. AI suggests subfolder:
   - Ideas / Concepts / Frameworks / Principles / Patterns
4. Accept suggestion
5. Template appears:
   - Core Concept
   - Context
   - Connections
   - Applications
6. Write 1-3 paragraphs
7. Link to 3+ related notes
```

**Maturity Progression:**
- 📤seed: <50 words, just captured
- 🌱seedling: 50-200 words, basic outline
- 🪴sapling: 200-500 words, developed idea
- 🌲evergreen: 500+ words, polished, 5+ connections
- 🍓fruit: Published or shared externally

---

### From Source Extraction (3 min)

```
1. Reading source note
2. Find key insight
3. Ctrl+P → ⚡Quick Process - Atomic
4. Extract insight as atomic title
5. Reference source in "Context" section:
   - "From [[Source Note Name]]"
6. Link back to source in frontmatter
7. Connect to related atomics
```

**Best Practice:** 1 source = 3-5 atomic notes

---

## 🔗 Linking & Connection Workflows

### Quick Link with Metadata Menu (5 sec)

```
1. Click note Properties panel
2. Find "related" field
3. Click + icon
4. Search for note
5. Select → Link added to frontmatter
```

**Target:** 3+ connections per note

---

### Hub Identification (Weekly)

**Command:** Open [[📈Performance Metrics]]

**View:**
- **Knowledge Hubs** section shows notes with 5+ connections
- Review hubs for:
  - Missing connections
  - Potential MOC creation
  - Content expansion opportunities

**Action:** If hub >10 connections → Consider creating MOC

---

## 🧹 Cleanup & Maintenance

### Find Orphan Notes (Monthly)

**Command:** Open [[📈Performance Metrics]]

**View:** **Recommendations** → **Orphaned Notes** section

**Action:**
1. Review orphaned notes (0 connections)
2. Add 2-3 connections to related notes
3. Or: Archive if truly standalone
4. Or: Delete if no longer relevant

**Target:** <10% orphan rate

---

### Archive Old Dailies (Quarterly)

**Command:** `Ctrl+P` → **📦Archive Old Dailies**

**What it does:**
1. Finds daily notes >12 months old
2. Shows confirmation dialog
3. Moves to `06-Archive/Daily-Notes-Archive/YYYY/`
4. Creates archive index
5. Preserves for streak calculation

**Impact:** 70% faster gamification dashboard

**Schedule:** Run every 3 months (Jan/Apr/Jul/Oct)

---

### Update Metrics Cache (Weekly)

**Command:** `Ctrl+P` → **🔄Update Metrics Cache**

**What it does:**
1. Calculates expensive metrics:
   - Total note counts
   - XP and gamification stats
   - Connection density
   - Orphan detection
   - Hub identification
   - Growth trends
2. Writes to `99-System/_Metrics Cache.md`
3. Dashboards read from cache (60-80% faster!)

**Schedule:** Run every Monday morning OR before opening dashboards

**Impact:** Dashboard load time 2-3 sec → <1 sec

---

## 🎮 Gamification Workflows

### Track Daily XP (1 min)

**Open:** [[🎮Gamification Dashboard]]

**Earn XP:**
- Create atomic note: +10 XP
- Complete effort: +50 XP
- Process source: +5 XP
- Create MOC: +20 XP
- Achieve evergreen maturity: +15 XP
- Create hub (5+ connections): +10 XP

**Leveling:**
- Level = Total XP ÷ 100
- Example: 1,250 XP = Level 12

**Achievements:**
- First Atomic: Create 1 atomic note
- Note Connector: Link 10 notes
- Processing Pro: Clear inbox <10 items
- Evergreen Forest: 10 evergreen notes
- Hub Master: Create note with 10+ connections

---

## 🔍 Search & Discovery

### Find Similar Notes

```
1. Open any note
2. Check "Backlinks" panel (right sidebar)
3. Or: Search for keywords in:
   - Ctrl+Shift+F (global search)
   - [[🗺️My PKM MOC]] (browse by category)
   - Dataview queries in dashboards
```

---

### Browse by Topic

**Use folder indexes:**
- [[01-MOCs]] - Maps of Content
- [[Atomics]] - Atomic ideas
- [[03-Efforts]] - Projects & tasks
- [[04-Sources]] - External content

**Or use dashboards:**
- [[👁️Dashboard]] - Daily agenda view
- [[TODO]] - Task-focused
- [[📈Performance Metrics]] - Analytics

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut       | Action              |
| -------------- | ------------------- |
| `Ctrl+P`       | Command Palette     |
| `Ctrl+Shift+F` | Global search       |
| `Ctrl+D`       | Create daily note   |
| `Ctrl+Shift+D` | Create weekly note  |
| `Ctrl+N`       | New note            |
| `Ctrl+O`       | Quick switcher      |
| `Ctrl+E`       | Toggle edit/preview |
| `Ctrl+,`       | Settings            |
more here [[Obsidian Hotkeys - Compact Cheatsheet]]

---

## 🆘 Troubleshooting

### "I don't know where this note belongs"

**Solution:**
1. `Ctrl+P` → 🤖Smart Classify Note
2. Or: Move to `02-Knowledge/X/` → Review during weekly review
3. Or: Check [[📍Note Classification Guide]]

---

### "My inbox is overwhelming (50+ notes)"

**Solution:**
1. `Ctrl+P` → 📦Batch Process Inbox
2. Bulk approve high-confidence items
3. For remainder: Quick scan → Delete outdated → Process rest

**Pro Tip:** Set weekly inbox limit: 20 items max

---

### "Dashboard loading slowly"

**Solution:**
1. `Ctrl+P` → 🔄Update Metrics Cache
2. (Quarterly) `Ctrl+P` → 📦Archive Old Dailies
3. Check vault size: If >3000 notes, consider splitting

---

### "Can't find old daily note"

**Solution:**
1. Check `06-Archive/Daily-Notes-Archive/YYYY/`
2. Or: `Ctrl+Shift+F` → Search by date
3. Or: Review `Archive Index.md` in archive folder

---

## 📊 Workflow Metrics

### Target Processing Times

| Workflow | Target Time | Current Avg |
|----------|-------------|-------------|
| Single note (Quick Process) | 10-20s | 15s |
| Single note (Smart Classify) | 15-20s | 18s |
| Batch process (20 notes) | 2-3 min | 2.5 min |
| Weekly review | 30-45 min | 35 min |
| Daily inbox session | 15 min | 12 min |

### Health Indicators

| Metric             | Target | Status                           |
| ------------------ | ------ | -------------------------------- |
| Inbox count        | <20    | [[+Inbox]]                       |
| Connection density | >70%   | [[Performance Metrics|Metrics]] |
| Orphan notes       | <10%   | [[Performance Metrics|Metrics]] |
| Processing rate    | >80%   | [[TODO\|GTD]]                    |
| Weekly captures    | 20-40  | [[Performance Metrics|Metrics]] |

---

## 🔗 Related Guides

- [[📍Note Classification Guide]] - Where does this note belong?
- [[🏡Home]] - System overview
- [[🗺️My PKM MOC]] - Complete map of vault
- [[🧭Review HQ|Review Hub]] - Weekly processing routine
- [[Templates/Add-Sections/Navigation/Unified-Nav]] - Add navigation to notes

---

*Quick Reference Version: 1.0*
*Last Updated: 2026-04-16*
*Print this page for offline reference!*

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
