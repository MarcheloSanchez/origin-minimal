---
description: Synthesize one ISO week of daily notes into a weekly insight block appended to the weekly note. Themes, wins, lessons, open loops, seedlings, next-week top 3. Honest, not performative.
argument-hint: "[week as YYYY-W##, defaults to last completed week]"
---

You are running inside the **Origin** vault. Load the `origin-vault` skill before continuing — it defines the locked enums, YAML schema, boundaries, and bilingual conventions you must respect.

## Task

Synthesize one ISO week of daily notes into a structured insight block appended to the weekly note's `## 💡 Key Insights` section. Treat the user's raw daily entries as evidence — do not summarize what is already a summary. An honest assessment of an unproductive week is more valuable than flattery.

## Pre-flight checks

Before writing anything:

1. **Privacy unlock required.** Check if `.claude/.privacy-unlock` exists in the repo root. If absent, print `Run /unlock-private first` and abort — calendar reads are blocked by the privacy guard.

2. **Resolve target week.** Parse the argument (format `YYYY-W##`, ISO week standard, Monday-start). If no argument given, calculate the last fully completed ISO week: Monday through Sunday, ending before today. Example: if today is Wednesday 2026-07-08, last completed week is 2026-W27 (Mon 2026-06-29 → Sun 2026-07-05).

3. **Locate daily notes.** Glob `05-Calendar/Daily/` for files containing all 7 dates of the target week (in any order; filename formats may vary). Proceed if ≥2 daily notes found. If fewer than 2 exist, report "not enough material for synthesis" and abort.

4. **Locate weekly note.** Search `05-Calendar/Weekly/` for a file matching the week identifier (e.g., `2026-W27.md`). If the weekly note does not exist, ask the user:
   - Create from `Templates/Calendar/Template Weekly.md` (resolving all Templater tokens manually) and proceed, or
   - Abort?

5. **Check for existing block.** Read the weekly note fully. If a `### 🔁 AI Weekly Insights` block already exists (with any timestamp), ask the user:
   - Replace with a new synthesis?
   - Append a new block with a fresh timestamp?
   - Abort?

## Synthesis approach

Read the target week's daily notes and answer these questions internally before writing:

- **Themes**: What threads recur across ≥2 days? (concrete: "focus shifted from X to Y", not "had mixed energy")
- **Wins**: What tangible output occurred? (things that moved, not effort or feelings)
- **Lessons**: What did this week teach that changes next week's approach?
- **Projects**: For each `03-Efforts` note with `status: 🔄active`, did it move this week (file modified during the week, or mentioned in the dailies) or stall? One line per project: what moved, or how long idle. Read effort notes' `modified` dates and `next_actions` as evidence.
- **Open loops**: What captures, tasks, or ideas survived the whole week untouched? What's the actual next step?
- **Seedlings**: Which raw captures in the dailies look worth promoting to an atomic note or effort? Suggest the type.
- **Next week top 3**: Based on momentum, blockers, and promises, what are the three priorities?

Read existing `## 🔁 AI Reflection` sections in the dailies as evidence but synthesize across days — never concatenate them. If the week was unproductive or showed no movement, say so plainly. The user's preferences forbid flattery and softening. Detect language (Czech, English, mixed) and match in output.

## Output structure

Append this exact block to the weekly note, directly under the `## 💡 Key Insights` section heading. Use the language of the dailies (Czech, English, or matching mix):

```markdown
### 🔁 AI Weekly Insights — generated <YYYY-MM-DD HH:MM>

> [!info]+ **Synthesis**
> One honest sentence for the week's shape.

#### 🧵 Themes
- 2–4 recurring threads, each citing the days it appeared ([[daily-note]] links)

#### 🏆 Wins
- 2–5 concrete outcomes

#### 🚀 Projects
- One line per active effort: `[[Effort]] — moved: <what>` or `[[Effort]] — stalled, idle <N> days → <next_actions>`

#### 📚 Lessons
- 1–3 items that change next week's approach

#### 🚧 Open loops
- Items that survived the whole week untouched, each with `→ next step`

#### 🌱 Seedlings
- Captures worth promoting to atomic/effort, each with proposed type

#### 🎯 Next week top 3
1. …
2. …
3. …
```

## Hard constraints

1. **Do NOT modify YAML frontmatter** of any note. Append only below body content.
2. **Do NOT move, create, or edit daily notes.** Read-only on dailies. The weekly note is the only write target.
3. **Do NOT create new atomic or effort notes.** "Seedlings" only proposes — the user decides whether to promote.
4. **Do NOT translate.** Match the language of the daily notes. Czech, English, or mixed is all acceptable.
5. **Do NOT invent wikilinks.** For "Themes" section, cite only daily notes whose filenames you actually found. Use Glob/Grep to verify.
6. **Do NOT use enum values outside the locked set.** Status, type, maturity values come from the `origin-vault` skill — never invent.
7. **Preview before writing.** Show the user the proposed block in full and ask for confirmation before appending to the weekly note.

## Area insight routing (post-synthesis)

After appending the weekly insights block to the weekly note:

1. **Classify insights against areas**: For each insight in the synthesis (Themes, Wins, Lessons, Open Loops, Seedlings, Next Week Top 3), assess whether it relates to one of the five areas: Health, Finance, Career, Relationships, Personal. One insight may map to 0–2 areas (e.g. "started exercise routine" → Health; "negotiated salary" → Career + Finance).

2. **Propose area appends**: For each area match, draft a single-line append to that area note's `## 🔄 Review Notes` section, using the format: `- 2026-W##: <one-line insight> (from [[2026-W##]])`. Example: `- 2026-W27: Restarted morning workout routine, 4x this week (from [[2026-W27]])`.

3. **Preview then apply**: Show the user all proposed area appends (grouped by area), ask for confirmation (same approval gate as the weekly block), then append each to its respective area note's `## 🔄 Review Notes` section. Preserve the section structure; append as new list items before the footer.

4. **Silent skip**: If no insights map to any area, skip this step silently — do not report "no area matches found."

5. **Do NOT modify YAML** of area notes. Append only below the `## 🔄 Review Notes` heading.

## After writing

Tell the user:

1. **Weekly note path modified** (vault-relative: `05-Calendar/Weekly/YYYY-W##.md`)
2. **Area notes updated** (list paths, e.g., `02-Knowledge/Areas/Health.md, 02-Knowledge/Areas/Career.md`)
3. **Brief summary** of the synthesis (one sentence on the week's shape)
4. **Any anomalies**, if flagged:
   - Daily notes with malformed YAML
   - Missing or incomplete daily note for certain days
   - Language inconsistencies
   - Status or type values in dailies outside the locked enum set

## Weekly council (AIOS) — runs even if synthesis was aborted

These steps need no privacy unlock (they read only AIOS files). Run them after the
synthesis — or standalone, if the privacy gate aborted the calendar part.

1. **T3 queue batch-review.** Open `AIOS/orchestration/quality-queue.md`, list all
   unchecked `## Pending` items grouped by flag type. Walk them with the user
   (resolve / defer / drop). Check off resolved items and move them to `## Resolved`.
2. **Ledger spot-check.** Pick 3 random rows from `AIOS/orchestration/ledger.md`
   dated within the last week (if fewer exist, take all). For each, open the target
   and verify the change is present and sane. Report: `3/3 verified` or name what's
   off — a bad row is a candidate `reverted` entry and a lesson in
   `AIOS/memory/lessons.md`.
3. **Open-loop feed.** Any unresolved council item worth automating → offer to add it
   to `AIOS/orchestration/queue/` via `/queue-add`.
