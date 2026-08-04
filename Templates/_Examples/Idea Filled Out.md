---
in:
  - "[[Ideas]]"
title: Vault Weather Report — a weekly auto-generated vault-health digest
type: atomic
fileClass: atomic
tags:
  - 💡atomic
status: 📥inbox
maturity: 📤seed
processing_priority: normal
created: 2026-07-12
modified: 2026-07-12
related:
  - "[[Compound Interest as a Mental Model]]"
  - "[[GtD - Getting Things Done]]"
---

> [!orbit] Wayfinder | [[Atomics]] | [[Ideas]]

## 🧠 One-liner

A weekly automated summary that treats your vault like weather—reporting on its current "climate" (activity levels, orphan notes, link density, tag distribution) to reveal gaps, patterns, and health trends.

## 🧩 Notes & Sketches

Personal knowledge vaults accumulate like weather systems: sometimes productive storms of writing and linking, other times dormant periods where gaps form. Currently, reviewing vault health requires manual inspection of dashboards.

The idea: a script that runs weekly and generates a brief report:
- **Growth metrics**: Notes created, edited, and linked this week vs. baseline
- **Health signals**: Orphan notes (warnings), dead links, notes without recent review
- **Traffic patterns**: Most-visited topics, favorite wikilinks, tagging trends
- **Forecast**: Predictions like "Area X hasn't been touched in 30 days" or "Tag category Y is fragmenting"

It would feel like a weather forecast—readable, slightly visual (emoji-based?), and actionable without requiring deep analysis. Example:

> 📊 Vault Weather Report · Week 2026-W28
> 🌤️ Conditions: Active growth in Knowledge layer, calm in Calendar
> ⚠️ Alerts: 3 orphan notes in Atomics, 2 stale efforts > 60 days
> 📈 Trend: linking density up 12% (more connections between ideas)
> 🎯 This week: 14 notes created, 23 updated

## 🔗 Related

- **[[Compound Interest as a Mental Model]]**: Consistent small reviews of vault health compound into better organization over time
- **[[GtD - Getting Things Done]]**: System reviews ensure the PKM stays aligned with active efforts
- Dataview (tool): Could power the query logic for metrics
- Dashboard pattern (related system): Similar to how GitHub shows repository health

## ▶️ Next step

Brainstorm feasibility: 1) What metrics matter most for vault health? 2) How often is "weekly" realistic? 3) Is a Dataview query + QuickAdd script sufficient, or would this need a custom plugin? 4) What would make this report worth reading vs. just another dashboard?

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
