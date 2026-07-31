---
up: "[[02-Knowledge]]"
title: "Areas-About"
type: about
tags:
  - 🏠area
  - 📋about
status: 🔄active
maturity: 🌲evergreen
created: 2025-09-30
modified: 2026-07-17
related:
  - "[[+About Knowledgeℹ️]]"
  - "[[+About Effortsℹ️]]"
  - "[[Area Filled Out]]"
quality_reviewed: 2026-07-17
---

> [!orbit] Wayfinder | [[02-Knowledge]] | [[+About Knowledgeℹ️]] | [[+About Effortsℹ️]]

# 📋 Areas Folder Contract

**What**: Six ongoing life domains (Health, Finance, Career, Relationships, Personal, Learning — Learning added 2026-07-17). `type: area` notes hold Purpose, Metrics, Active Efforts, Key Knowledge, Next Focus Areas, and Review Notes for each domain.

**When**: Weekly attention (touch via `## 🏠 Area Attention` table in weekly notes), monthly review (update `last_review`), quarterly/yearly strategy planning. Daily if it's a focus area.

**Where**: `02-Knowledge/Areas/` — one flat `.md` file per area, no numbered subfolders.

**Lifecycle**: Create via QuickAdd `Area` choice (→ `Templates/Static/area.md`, folder `02-Knowledge/Areas`). Archive by setting `status: 📦archived`, then move to `06-Archive/` when a life domain ends.

---

## ✅ What Belongs Here

- **Your 6 life domains**: [[Health]], [[Finance]], [[Career]], [[Relationships]], [[Personal]], [[Learning]]
- **Domain-specific collections** (child folders created on demand): e.g., `Finance/Subscriptions/` when subscription tracking grows

## ❌ What Doesn't Belong Here

- **Projects/goals** → [[03-Efforts|Efforts]] (time-bounded, has an end)
- **Knowledge (concepts, ideas, quotes)** → [[Atomics|Atomics]] (timeless, single-idea focus)
- **External material (articles, books, sources)** → [[04-Sources|Sources]] (external origin)
- **MOCs/hubs** → [[01-MOCs|MOCs]] (navigation-only, not a life domain)
- **Topics/skills that serve multiple Areas rather than standing alone** — see the Area-vs-Topic test below

---

## 🧭 Is It an Area, or a Topic/MOC?

**Test: an Area is a standard you actively maintain, on a recurring cadence, with no end state.** A Topic (indexed via a MOC + tag, not an Area) is a body of knowledge or a skill you're *drawing on* to serve one or more Areas — it has no independent "standard" of its own.

- **Fails the test → not an Area**: "Personal Identity/Codex" — retrospective self-knowledge aggregation, nothing to actively maintain → belongs in `01-MOCs` as a pure index.
- **Fails the test → not an Area**: "Communication" (body language, small talk, facial cues) — it serves Relationships (connecting with people), Career (networking), and Learning (deliberately studying the skill), but isn't itself an ongoing responsibility separate from those → tag it (e.g. `💬communication`), file the actual notes by content-type (`02-Knowledge/Atomics`, `04-Sources`), and let a `Communication MOC` in `01-MOCs` aggregate everything via a Dataview query on the tag.
- **Passes the test → is an Area**: Learning — "keep growing skills/knowledge" is an ongoing standard exactly like Health/Finance/Career, not knowledge in service of something else.

If a topic ever demands its own recurring review cadence independent of the Areas it currently serves, that's the signal it might graduate to Area status.

## 🔗 How Notes Reference Their Area

- **`up:`** — the note's single primary home. Can point at an Area (e.g. `up: "[[Health]]"`) when that Area genuinely is the note's main context, same as it would point at a MOC.
- **Emoji tag** (e.g. `🧬health`) — applied alongside `up:` for cross-cutting Dataview aggregation. A note can carry only one `up:` but multiple Area tags if it's relevant to more than one domain; the Area hub's `_Areas_Data.base`/Dataview query surfaces everything tagged, regardless of which one is `up:`.
- **`related:`** — reserved for topically-similar/adjacent notes (peers), never used to express Area membership or hierarchy.

## 📂 When an Area Earns a Subfolder

Not a flat note-count on the whole Area — the trigger is a **sub-theme within the Area clustering to ~8-10 notes** that clearly belong together. Example: `Finance.md` stays flat while it has a handful of notes each about budgeting, taxes, investments. But once "subscriptions" specifically (Netflix, Spotify, gym membership, etc.) reaches ~8-10 notes, that sub-theme is muddying the Area's Dataview query with too many similar entries — promote it to `Finance/Subscriptions/` with its own scoped index, and have `Finance.md` link out to it instead of listing every subscription individually.

---

## 📅 Review Cadence

| Frequency | What | Where | Owner |
|-----------|------|-------|-------|
| Weekly | Touch each area's status in the table | `Templates/Calendar/Template Weekly.md` `## 🏠 Area Attention` | User + manual |
| Monthly | Review each area; update `last_review` | Monthly note `## 🏠 Area Health Check` query | User (manual review) |
| Ongoing | Append insights from weekly reflection | Area note `## 🔄 Review Notes` section | `/reflect-weekly` command (auto-append) |

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
