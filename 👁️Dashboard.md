---
up: "[[🏡Home]]"
title: 📊 Dashboard
type: system
status: 🔄active
tags:
  - 📊dashboard
  - 📋review
  - ⚙️system
created: 2025-09-29
modified: 2026-07-24
related:
  - "[[🏡Home]]"
  - "[[🔁My PKM Workflows]]"
  - "[[✅My PKM Tasks]]"
  - "[[🔍My PKM Queries]]"
  - "[[🌱Incubator]]"
  - "[[🍓Maturity Garden]]"
  - "[[MOC - Hotkeys]]"
  - "[[📅Calendar Review Hub]]"
  - "[[Views]]"
obsidianUIMode: preview
cssclasses:
  - wide-page
---

> [!orbit] Wayfinder | [[+Inbox|📥]] | [[🧭Review HQ|🧭Review]] | [[TODO|✅ TODO]] | [[BACKLOG]] | [[CHANGELOG]] | [[⚡Automation Menu|⚡Menu]] | [[📈Performance Metrics|📈 Metrics]] | [[🔍My PKM Queries|🔍 Queries]] | [[Me|Me]]

> `$= "📅 " + moment().format("dddd D. MMMM YYYY")` · [Dnes →](obsidian://advanced-uri?commandid=periodic-notes%3Aopen-daily-note) · [Week →](obsidian://advanced-uri?commandid=periodic-notes%3Aopen-weekly-note) `$= "(" + moment().format("GGGG-[W]ww") + ")"`

> [!cone]-  Needs You
> **[Open Daily Note →](obsidian://advanced-uri?commandid=periodic-notes%3Aopen-daily-note)** 
>
> **Overdue**
>
> ```dataviewjs
> const overdue = dv.pages('"03-Efforts/Active"')
>   .where(p => p.due && dv.date(p.due) < dv.date("today"))
>   .sort(p => p.due, "asc");
>
> if (!overdue.length) {
>   dv.paragraph("✅ Nothing overdue");
> } else {
>   dv.table(["Effort", "Due", "Late"], overdue.map(p => [
>     p.file.link,
>     p.due,
>     Math.floor(dv.date("today").diff(dv.date(p.due), "days").days) + "d"
>   ]));
> }
> ```
>
> **Due today**
>
> ```tasks
> not done
> due today
> short mode
> ```

> [!ship]- Career & Productivity · `$= dv.pages('"03-Efforts/Active"').length` active · `$= dv.pages('"03-Efforts/Active"').where(p => p.due && dv.date(p.due) < dv.date("today")).length` overdue
>
> ```dataview
> TABLE WITHOUT ID file.link AS "Effort", rank AS "↑", choice(completion_percentage, completion_percentage + "%", "0%") AS "Done", due AS "Due", next_actions AS "Next"
> FROM "03-Efforts/Active"
> SORT rank DESC
> ```
>
> **All efforts →** ![[_Efforts_Data.base]]
>
>
> **Hub:** [[03-Efforts]] · [[Career]]

> [!activity]- Health · `$= dv.pages('"05-Calendar/Daily"').where(p => p.file.mtime >= dv.date("today") - dv.duration("7 days") && p.energy).length` energy logs/wk · `$= dv.pages('"05-Calendar/Daily"').where(p => p.file.mtime >= dv.date("today") - dv.duration("7 days") && p.mood).length` mood logs/wk
>
> ```dataview
> TABLE WITHOUT ID file.link AS "Day", energy AS "⚡ Energy", mood AS "😐 Mood", highlight AS "★ Highlight"
> FROM "05-Calendar/Daily"
> WHERE file.day >= date(today) - dur(7 days)
> SORT file.name DESC
> LIMIT 7
> ```
>
> **Hub:** [[Health]]

> [!book]- Learning · `$= dv.pages('"04-Sources"').where(p => p.status === "🔄active").length` reading · `$= dv.pages('"04-Sources"').where(p => p.status === "📥inbox").length` queued · `$= dv.pages('"02-Knowledge"').where(p => p.maturity === "🌱seedling").length` seedlings
>
> ![[_Sources_Data.base]]
>
> **Recent ideas →** ![[_Ideas_Data.base]]
>
> **Hub:** [[04-Sources]] · [[Library]]

> [!command]- Tools & System · `$= dv.page("99-System/_Metrics Cache").inbox_count` inbox · `$= dv.pages().where(p => p.file.mtime >= dv.date("today")).length` modified today · `$= dv.pages('"02-Knowledge"').where(p => p.maturity === "🌱seedling").length` seedlings
>
> | Metric | |
> |---|---|
> | 📥 Inbox | `$= dv.page("99-System/_Metrics Cache").inbox_count` |
> | 📝 Modified today | `$= dv.pages().where(p => p.file.mtime >= dv.date("today")).length` |
> | 🌱 Seedlings | `$= dv.pages('"02-Knowledge"').where(p => p.maturity === "🌱seedling").length` |
> | 📚 Total notes | `$= dv.page("99-System/_Metrics Cache").total_notes` |
> | 🗂️ Sources | `$= dv.page("99-System/_Metrics Cache").source_count` |
>
> **Tools →** ![[Tool Inventory.base]]
>
> **Hub:** [[Tools]] · [[⚡Automation Menu]] · [[📈Performance Metrics]]

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*