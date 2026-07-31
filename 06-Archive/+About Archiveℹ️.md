---
up: "[[06-Archive]]"
title: +About Archive
type: about
tags:
  - 📋about
status: 🔄active
maturity: 🌱seedling
created: 2025-09-30
modified: 2026-06-25
related:
  - "[[👁️Dashboard]]"
---

> [!orbit] Wayfinder | [[06-Archive]] | [[+About Effortsℹ️]] | [[+About Areasℹ️]]

> [!info] What goes here
> **06-Archive** — Retired notes: completed efforts, paused projects, superseded guides. Out of daily workflow but preserved for reference. *Belongs here if:* it has finished its active life and should be preserved, not deleted. *Does NOT belong:* active notes that are just temporarily paused — use status ⏸️paused in their home folder; notes you still reference regularly.

# About Archive

> [!abstract]+ **Your Knowledge Preservation System**
> Archive transforms your vault from a growing pile into a sustainable knowledge system. It's where completed Efforts, outdated Sources, superseded Guides, and historical context live — organized, searchable, but out of your daily workflow.
>
> **Not Deletion** — Archive preserves knowledge while decluttering active workspace  
> **Not Backup** — Archive is organized, indexed, and strategically accessible

---

## ⚠️ Archive is Invisible to Obsidian Search

`06-Archive/` is **excluded from Obsidian's file index** (`userIgnoreFilters`). This means:

- ❌ Quick switcher won't find archived notes
- ❌ Search won't find archived notes
- ❌ Backlinks to archived notes won't appear

**How to find an archived note:**
- Open `[[06-Archive]]` → use the Dataview queries there to browse by recency or type
- Use File Explorer in Obsidian — folder browsing still works
- Write a Dataview query anywhere: `FROM "06-Archive" WHERE file.name = "note-name"`

---

## 📁 Folder Structure & Routing

Three subfolders — routing is simple:

| Folder | What goes there | Mental model |
|--------|----------------|--------------|
| `Completed/` | Efforts and challenges that reached **✅ completed** | "I finished this" |
| `Dormant/` | Anything that was **paused / waiting / abandoned** — may restart later | "Not dead, just sleeping" |
| `Reference/` | Prompts, guides, tools, sources, documentation — **reference material** regardless of status | "I used this, now I don't" |

**When in doubt → `Dormant/`.** You can reclassify later.

### Routing Decision Table

| Note type | Prior status | → Folder |
|-----------|-------------|----------|
| effort | ✅ completed | `Completed/` |
| effort | ⏸️ paused, ⏳ waiting, no signal | `Dormant/` |
| challenge | ✅ completed | `Completed/` |
| challenge | ⏸️ paused | `Dormant/` |
| area | any | `Dormant/` |
| person | any | `Dormant/` |
| place | any | `Dormant/` |
| prompt | any | `Reference/` |
| guide | any | `Reference/` |
| source | any | `Reference/` |
| tool | any | `Reference/` |
| documentation | any | `Reference/` |
| atomic | (rare) | `Dormant/` |

---

## 📥 Intake Signal — When to Archive

Two triggers:

**1. Explicit completion** — Effort or challenge reaches `✅ completed` → archive it. Low friction, obvious call.

**2. Decay** — Note has `⏸️ paused` or `⏳ waiting` status and hasn't been modified in 90+ days → candidate for `Dormant/`. Surfaced during quarterly review via the `[[06-Archive]]` Dataview queries.

**Process:**
1. Set `status: 📦archived` on the note in the live vault
2. The intake queue in `[[06-Archive]]` surfaces it automatically
3. Use the routing table above to pick the subfolder
4. Move the file manually (or via a future QuickAdd macro)

---

## 📖 What Gets Archived & When

### **🚀 Completed Efforts**
**Archive When:**
- Project finished and outcomes documented
- 3+ months since completion with no follow-up activities
- All learnings extracted to Atomics and Areas updated

**Archive Format:**
- Original note preserved with completion summary
- Key outcomes and lessons learned highlighted
- Links to generated Atomics and influenced Areas maintained

### **📚 Outdated Sources**
**Archive When:**
- Information becomes superseded or irrelevant
- Source no longer influences current thinking
- Content replaced by newer, better resources

**Archive Process:**
- Extract any remaining valuable insights to Atomics
- Note why source became outdated in archive summary
- Preserve original processing for historical context

### **🗺️ Superseded Places & People**
**Archive When:**
- Location no longer accessible or relevant
- Relationship ended or became inactive
- Information value primarily historical

**Preservation Focus:**
- Cultural insights and personal growth moments
- Relationship learnings and collaboration patterns
- Location-specific knowledge for future reference

### **🛠️ Deprecated Tools & Guides**
**Archive When:**
- Tool no longer used or available
- Process superseded by better methods
- Guide replaced by updated version

**Value Retention:**
- Methodology insights that transcend specific tools
- Problem-solving approaches still relevant
- Historical context for decision-making

---
## 🎯 Archive Philosophy

> [!quote]+ **Core Principles**
> **"Preserve the valuable, release the rest. Your past should inform your future, not constrain it."**
>
> - **Value Preservation** — Archive knowledge, not just content
> - **Context Documentation** — Future-you needs to understand why and when
> - **Strategic Accessibility** — Archive for reference, not burial
> - **Evolution Awareness** — Archive reflects growth and learning over time

---

## 🔗 Integration

- [[06-Archive]] → Hub with Dataview queries for browsing and intake queue
- [[👁️Dashboard]] → Archive processing reminders
- [[+About Atomicsℹ️]] → Insights extracted from archived content before preservation
- [[+About Areasℹ️]] → Historical context for life domain development
- [[+About MOCsℹ️]] → Archive references in knowledge maps

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
