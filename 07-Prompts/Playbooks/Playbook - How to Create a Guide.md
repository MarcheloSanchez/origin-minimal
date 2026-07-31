---
up: "[[MOC - Playbooks]]"
title: Playbook - How to Create a Guide
type: guide
tags:
  - 🔄workflow
status: 🔄active
maturity: 🌱seedling
created: 2026-06-25
modified: 2026-06-25
related:
  - "[[MOC - Playbooks]]"
---

> [!orbit] Wayfinder | [[MOC - Playbooks]]

# 📋 Playbook - How to Create a Guide

> [!abstract] The move
> Raw idea (a rough "I should write up how to…") → **production-ready guide** a reader can act on without you in the room.

A Playbook is a reusable recipe. This one captures *how you turn a loose idea into a finished guide* so you never re-solve it from scratch. Read it top-to-bottom the first time; after that you (or Claude) only need sections **2** and **3**.

---

## 1 · Input — what you feed it

The "messy in." A raw guide-idea usually looks like a one-liner with no shape yet:

> *"I keep re-explaining how I process the inbox — I should write a guide for it."*
> *"How to apply routines inside the vault to fit an AuDHD person."*

You have it when: there's a **repeatable thing you know how to do** and a **reader who'd benefit from doing it too** — but it's all in your head, unordered.

If the idea is actually a single fact or opinion (not a *how-to*), stop — that's an atomic note, not a guide.

---

## 2 · Output — definition of done

A guide is **production-ready when every box is tickable.** This is the contract: it tells Claude exactly what's missing, and it tells *you* when to stop polishing.

- [ ] **Goal** stated in one sentence — what the reader can *do* after reading
- [ ] **When to use / prerequisites** — who this is for, what they need first
- [ ] **Numbered steps** — each step is one concrete action, in order
- [ ] **Pitfalls** — what commonly goes wrong, what *not* to do
- [ ] **Self-check** — a short checklist the reader verifies their result against
- [ ] **≥ 3 links** to related vault notes / sources (this is what makes it *yours*, not generic advice)
- [ ] **YAML correct** — `type`, `up`, `status`, `maturity` set per schema
- [ ] **Navigation** — `[!orbit]` wayfinder as first body line, standard footer last

If a box can't be ticked, the guide isn't done — it's a draft.

---

## 3 · Steps — the process

1. **Name the goal in one sentence.** Force it: *"After this, the reader can ___."* If you can't, the idea isn't ready — sharpen it first.
2. **Sketch the reader.** Who picks this up, and what do they already know? This sets the depth and what you can skip.
3. **Dump the steps unordered**, then sequence them. One action per step. Cut anything that isn't a step the reader takes.
4. **Surface the pitfalls.** For each step, ask *"where do people (or I) screw this up?"* Those become the Pitfalls section.
5. **Add the proof.** Link ≥3 real vault notes/sources. A guide with no links is an opinion; a guide that's wired into your vault is an asset.
6. **Write the self-check** — turn the goal + key steps into boxes the reader ticks.
7. **Run it against §2.** Tick every box. Unticked = keep working. Then stop — don't gold-plate.
8. **Pick the format** — single rich doc, or modular hub-plus-linked-notes (see Pitfalls for which to prefer).

---

## 4 · Worked example — raw → finished

**Raw idea (the "messy in"):**

> *"How to apply routines inside the vault to fit an AuDHD person — finite daily decision budget, capturing overwhelms me, I want the system to serve me, not me serving it. Make routines that reduce decisions and don't pile up guilt."*

**Finished guide (run through this Playbook):** → [[AuDHD Routines Guide]]

What the transformation did: a one-line frustration became a production guide with a one-sentence goal, a measured "decision budget" core insight, 7 numbered routines wired to real vault machinery (`/session-start`, the three-gate tree, a `_unclear` deferral bin, the Friday skim), a pitfalls section, an 8-box self-check, and 4 verified vault links — every §2 box ticked.

> [!example] Format test
> The same idea was produced two ways — one rich single doc and a modular hub + 5 step-notes ([[AuDHD Routines Guide - Variant B (hub)]]) — and compared. See the verdict in §5.

---

## 5 · Pitfalls & guardrails

- **Wall of prose.** A guide is *steps*, not an essay. If a paragraph isn't telling the reader to *do* something, cut or demote it.
- **Over-polishing.** §2 is the stop sign. Once every box ticks, ship it — a 🌱seedling guide in the vault beats a perfect one in your head.
- **No links = generic advice.** The ≥3-link rule is non-negotiable; it's what separates *your* guide from something a search engine returns.
- **Skipping the worked example.** A guide nobody has run is a hypothesis. One real before→after is the proof it works.
- **Format choice — verdict: prefer the single rich doc** for guides. Tested both on the AuDHD guide above. The single doc wins because it adds **one** note instead of six, has nothing to hunt for, and is less to maintain — and for a vault that already feels like it piles up, fewer notes *is* the feature. Reach for the modular hub form only when individual steps genuinely need to be linked/reused on their own.

---

## Related

- [[MOC - Playbooks]] — the Playbook index
- *(meta)* `Playbook - How to Write a Playbook` — the recipe for building these (planned)

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
