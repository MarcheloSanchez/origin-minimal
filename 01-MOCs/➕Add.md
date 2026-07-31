---
up: "[[01-MOCs]]"
in:
  - "[[Views]]"
title: ➕Add
type: system
tags: ["⚙️system"]
status: 🔄active
maturity: 📤seed
created: 2022-01-01
modified: 2026-03-03
related:
  - "[[Relate]]"
  - "[[Communicate]]"
cssclasses:
  - wide-page
obsidianUIMode: preview
quality_reviewed: 2026-07-08
---

> [!orbit] Wayfinder | [[01-MOCs]] | [[Relate]] | [[🌱Incubator]]

This **Add** note isn't just an inbox. It's a cooling pad 🧊.
Thoughts come in hot. But after a few days, they cool down.
When cooler thoughts prevail, you can better prioritize. Cool?

# TOP 10 
![[_Inbox_Data.base]]

> [!activity]- ## Added Stuff - dataview archive
> This view looks at the 10 newest notes in your **+** folder. As you process each note: add a link, add details, move them to the best folder, and delete everything that no longer sparks ✨.
>
> ```dataview
> TABLE WITHOUT ID
>  file.link as "",
>  (date(today) - file.cday).day as "Days alive"
>
> FROM "+Inbox" 
>
> SORT file.cday desc
>
> LIMIT 10
> ```

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
