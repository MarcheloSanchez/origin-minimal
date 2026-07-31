---
up: "[[MOC - Playbooks]]"
title: Playbook - Inbox Processing Workflow
type: guide
tags:
  - 🔄workflow
status: 🔄active
maturity: 🌱seedling
created: 2026-07-07
modified: 2026-07-11
related:
  - "[[MOC - Playbooks]]"
---

> [!orbit] Wayfinder | [[MOC - Playbooks]]

# 📥 Playbook - Inbox Processing Workflow

> [!abstract] The move
> A full `+Inbox` of raw drops → typed, MOC-wired notes in their final folders — spending the **fewest Claude tokens possible.**

A Playbook is a reusable recipe. This one turns a messy inbox into filed knowledge without re-deciding the process each time. Read it top-to-bottom once; after that you only need **§3** (the stages) and **§5** (routing).

---

## 1 · Input — what you feed it

The "messy in": a `+Inbox` full of unsorted captures — web clips, voice-to-text, half-thoughts, screenshots. You have a batch when you've **stopped capturing** and are ready to process. Don't process mid-capture; let it pile, then clear it in one pass.

---

## 2 · The core principle — free automation first, Claude last

The stage order is a **cost gradient.** Every deterministic job (fill/rename YAML, order keys, lint, generate wayfinders, rename tags) runs **inside Obsidian via QuickAdd — zero Claude tokens.** Only judgment (reshaping prose, deciding a note's type, routing calls) reaches Claude, which costs tokens.

> [!warning] The rule
> If an automation can do it, run the automation. Never spend Claude tokens on work Stage 2 does for free. Claude cannot click QuickAdd buttons — Stage 2 is always yours to run.

---

## 3 · The 5 stages

| Stage | Move | Tooling | Cost |
|-------|------|---------|------|
| **1 · Capture** | Everything lands in `+Inbox`, unsorted | `MENU:⚡Create New Note → Quick Inbox` (or `Quick Idea`) | free |
| **2 · Auto-normalize** | Fill/rename/order YAML + add wayfinders | `🔢YAML - Automation ⚡ → BE AWARE - Orchastrator full bundle` on `+Inbox` (**with backup**), then `📦 Vault Ops → 📝Auto-Fill Metadata` and `🔧 Maintain Note → 🧭 Generate Orbit Callout` | **free** |
| **3 · Claude triage** | Reshape content, decide routing | `/process-inbox` → `/reform-note` → `/review-note`, then `/lint-vault` to catch stragglers | tokens — judgment only |
| **4 · Flag fleeting info** | Tag loose fragments with typed callouts | `MENU: 🔗 Insert → 💭Insert Callout` + the convention in §4 | free |
| **5 · Route** | Move each note to its final folder | manual move + the table in §5 | free |

> [!tip] Stage 2 fallback
> No orchestrator bundle handy? Run the trio individually via `1️⃣Apply to Curr note`: **`🏛️normalize` → `🔁reorder` → `"lint"!`**. For a whole-folder sweep with a safety net, use the `🏛️normalize - Setup - +Inbox - with backup` variant.

---

## 4 · Flag fleeting information — the 6-callout convention

When a raw note mixes several kinds of content, **split each fragment into its typed callout** so nothing loose is lost. Six types cover it:

```
> [!todo] Task            — an action this note implies
> [!info] Information      — a fact worth keeping
> [!tip] Idea             — a spark worth developing
> [!goal] Future mission   — a direction to pursue later
> [!question] Open question — something unresolved
> [!quote] Source          — a reference to cite
```

Five are native Obsidian callouts and render with built-in icons. `[!goal]` is not native — add this once to a CSS snippet for a 🎯 icon:

> [!example]- CSS snippet for `[!goal]` (optional)
> ```css
> .callout[data-callout="goal"] {
>   --callout-color: 200, 120, 255;
>   --callout-icon: lucide-target;
> }
> ```
> **No-CSS fallback:** use `[!example]` for "Future mission" instead — native, list icon, works everywhere.

---

## 5 · Route to folders — the routing table

First match wins:

| Signal | Destination | Parent MOC |
|--------|-------------|-----------|
| `type: moc` / filename has "MOC" | `01-MOCs/` | `[[🗺️My PKM MOC]]` |
| Communication / social / interview / language | `04-Sources/Knowledge/` | `[[MOC - Communication]]` |
| IT / testing / dev / tooling / QA | `04-Sources/Knowledge/` | `[[MOC - IT]]` · `[[MOC - ISTQB]]` · `[[MOC - Git]]` · … |
| Atomic idea / concept / statement | `02-Knowledge/Atomics/` | topical MOC |
| Genuinely ambiguous | **stays in `+Inbox`**, set `status: 📥inbox` | — |

> [!important] Naming + link rules
> - MOCs are named **`MOC - <topic>`** (prefix form) — never `<topic> MOC`. (Master hub `🗺️My PKM MOC` is a grandfathered exception.)
> - Link MOCs and notes **by title only** — `[[MOC - IT]]`, never a folder path.
> - `Guides/` is for **system guides only**. Personal reference and communication how-tos are Sources → `Knowledge/`, never `Guides/`.

---

## 6 · Worked example — the 2026-07 migration

**Messy in:** 108 legacy inbox notes + 16 Communication notes; mixed or absent YAML, no MOC wiring.

**What went wrong (and why the pitfalls below exist):** batch agents produced 24 *double-frontmatter* notes — a new YAML stub stacked on top of the old block, leaving `created`/`tags`/`related` stranded in the body and invisible to Obsidian. A bad routing rule also dumped 16 Communication notes into `Guides/`.

**Finished out:** single clean frontmatter on all 100 Knowledge notes, `up:` + wayfinder on each, every note wired to a `MOC - <topic>` hub, Communication notes re-homed under `MOC - Communication`. Backups taken before every bulk op; zero content lost.

---

## 7 · Pitfalls & guardrails

- **Double-frontmatter from batch agents.** Never stack YAML blocks — always merge. Detect with a "second `---` at body start" scan before trusting a batch.
- **`Guides/` ≠ system guides.** Personal reference material is a Source; it belongs in `Knowledge/`.
- **`+Inbox` and `04-Sources/Knowledge/` are gitignored.** No git undo. Back up to `AIOS/orchestration/_backups/<name>-<timestamp>/` before any bulk op and run a conservation check (backup basenames vs live, 0 missing) after.
- **Never delete unlisted YAML fields.** Preserve provenance (`URL`, `source-type`, `aliases`, …). Data loss = failed batch.
- **Don't burn tokens on Stage-2 work.** The whole design is free-automation-first for a reason.

---

## Related

- [[MOC - Playbooks]] — the Playbook index
- [[Playbook - How to Create a Guide]] — sibling recipe (raw idea → finished guide)

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
