---
description: Synthesize today's daily note into wins, lessons, blockers, energy patterns, and tomorrow's top 3. Reads from 05-Calendar/Daily, appends a reflection section to the same note. Honest, not performative — flags unproductive days as such.
argument-hint: [date in YYYY-MM-DD, defaults to today]
---

You are running inside the **Origin** vault. Load the `origin-vault` skill before continuing — it defines the locked enums, YAML schema, boundaries, and bilingual conventions you must respect.

## Task

Synthesize the daily note for the specified date (or today if no argument given) into a structured reflection appended to the same file. Treat the user's raw entries as evidence — do not summarize what is already a summary.

## Pre-flight checks

Before writing anything:

1. **Locate the daily note.** Search `05-Calendar/Daily/` for a file containing the target date (formats may vary: `2026-05-08.md`, `📅 2026-05-08.md`, or with weekday). If multiple matches, ask the user which one.
2. **Read the file fully.** Including YAML frontmatter, Wayfinder callout, body, and any existing sections.
3. **Check for existing reflection.** If a `## 🔁 AI Reflection` section already exists for this date, ASK the user:
   - Replace existing reflection?
   - Append a new one with timestamp?
   - Abort?
4. **Verify file location.** If the file is in `+Inbox`, abort and report — daily notes belong in `05-Calendar/Daily/`.
5. **Detect language.** Note whether the daily content is Czech, English, or mixed. Match that in your output.

## Synthesis approach

Read the day's content and answer these questions internally before writing:

- What actually moved? (concrete output, not effort or feelings about effort)
- What did the user learn that changes their next move?
- What's stuck or waiting? Why?
- What pattern shows up in their energy/focus?
- What raw captures look like seedlings for atomics or efforts?
- What existing notes in the vault would connect meaningfully to today's content?

If the day was unproductive, say so. The user's preferences explicitly forbid flattery and softening. A reflection that papers over a bad day is worse than no reflection.

## Output structure

Append this exact section to the daily note, BELOW any existing content but ABOVE any final wayfinder/footer. Use the user's language (Czech, English, or matching mix):

```markdown

---

## 🔁 AI Reflection — generated <YYYY-MM-DD HH:MM>

> [!info]+ **Synthesis**
> One sentence capturing the shape of the day. Honest. Not performative.

### 🏆 Wins
- 2–4 concrete items. Things that actually moved. Not feelings.

### 📚 Lessons
- 1–3 items. What happened that changes how to approach tomorrow. Specific.

### 🚧 Blockers / Open loops
- Items stuck, waiting, or needing decisions
- Each marked with `→ next step` in user's GTD context format if visible

### 🔋 Energy & focus
One or two sentences on energy/focus distribution. Reference time blocks if logged. If energy was low all day, name it.

### 🎯 Top 3 for tomorrow
1. 
2. 
3. 

### 🌱 Captures worth promoting
For each idea/insight in the daily note that looks like a candidate for promotion:
- **[short title]** → suggested target: `02-Knowledge/Atomics/Ideas/` or `03-Efforts/Paused/`
  - one-line rationale

If none qualify, write `_(žádné / none)_`.

### 🔗 Possible new links
2–3 wikilink candidates pointing to notes that already exist in the vault and connect to today's content. Verify each exists before suggesting.

If none found, write `_(žádné / none)_`.

```

## Hard constraints

1. **Do NOT modify YAML frontmatter.** Append only below body content.
2. **Do NOT move or create files.** "Captures worth promoting" only suggests — the user processes Inbox manually per their workflow.
3. **Do NOT translate.** Match the user's language. Mixed Czech/English is fine.
4. **Do NOT pad.** If a section has nothing real to say, write `_(žádné / none)_`.
5. **Do NOT invent wikilinks.** Use Glob/Grep to verify a target file exists before suggesting `[[Link]]`.
6. **Do NOT use enum values outside the locked set.** Status, type, maturity values come from the `origin-vault` skill — never invent new ones.
7. **Do NOT touch Wayfinder callouts** at the top of the note.

## After writing

Tell the user:

1. **Path of the file modified** (full vault-relative path)
2. **Two-line summary** of what you wrote
3. **Anomalies flagged**, if any:
   - Missing or malformed YAML
   - Language inconsistencies that look machine-translated
   - Suggested wikilinks where the target file doesn't exist (and was therefore skipped)
   - Status or type values outside the locked enum set found in the daily note
   - Daily note in wrong location

## Edge cases

- **Empty or near-empty daily note**: write `_(prázdný den — nothing to synthesize)_` for each section instead of inventing content. This is honest. The user can decide whether the empty day was a problem or a deliberate rest.
- **Daily note in language you don't recognize**: do your best, flag uncertainty in the "Anomalies" report.
- **Daily note has tasks but no narrative**: synthesize from the tasks. Wins = completed. Blockers = uncompleted. Energy = inferred from task density.
- **User mentions the same blocker for 3+ days running**: explicitly call this out in the Synthesis line. Stuck-loop detection is high-value.
