---
up: "[[+About AIℹ️]]"
title: Command Reference
type: guide
tags:
  - 📚guide
  - 🤖AI
status: 🔄active
created: 2026-05-10
modified: 2026-07-22
last_review: 2026-07-22
review_frequency: quarterly
---

> [!orbit] Wayfinder | [[+About AIℹ️]] | [[Flow and Ownership]] | [[Agent Reference]]

# Command Reference

All commands live in `AIOS/runtime/commands/*.md` (root `.claude/commands/` resolves via junction). Invoke as `/<command>` in Claude Code.

<!-- GENERATED:COMMANDS:START -->
## Index (generated — edit runtime/commands frontmatter, then rerun generate-command-catalog.py)

| Command | Description | Arguments |
|---|---|---|
| `/capture-task` | Capture the current discussion as an AIOS queue task — pulls context from the conversation, fills + validates the frontmatter, previews before writing. The richer sibling of /queue-add. | [optional note] |
| `/check-hotkeys` | Read-only hotkey audit. Detects mismatches between documented hotkeys and .obsidian/hotkeys.json. Reports wrong bindings and undocumented hotkeys. | none |
| `/fix-batch` | Inspect a folder, group fix proposals by category, apply per-batch only after the user approves each group. Wraps vault-inspector + note-fixer for many files. | <folder, required> |
| `/fix-note` | Inspect one note for YAML/body/placement issues, preview proposed fixes, apply only after the user approves. Defers YAML reordering to yaml_orchestrator.js. | [note path, optional — defaults to current open file or asks] |
| `/lint-vault` | Read-only vault health scan. Detects YAML drift, missing fields, placement mismatches, broken wikilinks, body gaps, orphans. Auto-fixable findings go into the lint report; human-decision items go into quality-queue.md. No edits to vault content. | [folder, optional — defaults to full vault] |
| `/lock-private` | Re-lock private vault folders immediately (reverses /unlock-private for the current session). | — |
| `/new-note` | Create a new properly-typed, templated, routed vault note. Asks for type and title interactively. Preview before write. | "[type] [title hint — e.g. 'atomic Zettelkasten principle' or just 'atomic']" |
| `/process-capture` | Read one +Inbox capture, classify type, propose destination/template, draft the structured note, write only after the user approves. | <inbox file path or filename> |
| `/process-inbox` | Scan +Inbox, propose a routing plan for every item (type/destination/confidence), apply only the items the user approves. | (none) |
| `/quarterly-review` | Quarterly AIOS ritual — ladder promote/demote from ledger stats, distill lessons.md into ai-rules, decay pass over AIOS folders, contract review, config health audit. Preview-first; nothing applied without approval. | [quarter as YYYY-Qn, defaults to the quarter that just ended] |
| `/queue-add` | Dump a task into the AIOS orchestration queue (fast capture, no classification) | — |
| `/reflect-daily` | Synthesize today's daily note into wins, lessons, blockers, energy patterns, and tomorrow's top 3. Reads from 05-Calendar/Daily, appends a reflection section to the same note. Honest, not performative — flags unproductive days as such. | [date in YYYY-MM-DD, defaults to today] |
| `/reflect-weekly` | Synthesize one ISO week of daily notes into a weekly insight block appended to the weekly note. Themes, wins, lessons, open loops, seedlings, next-week top 3. Honest, not performative. | "[week as YYYY-W##, defaults to last completed week]" |
| `/review-note` | Deep review of one note — combines fix-note inspection with link recommendations and a maturity check. Preview-first; apply only what the user approves. | [note path, optional] |
| `/review-proposed` | Review staged AIOS output and accept (move to canon) or reject (discard) — the human gate | — |
| `/run-queue` | Run the AIOS orchestration loop — process queued tasks into proposed/ with review packages, serially and within cost caps | — |
| `/save` | Turn the current Claude conversation into a properly typed, routed, templated Origin note. Preview before write. | "[optional hint: type or title, e.g. 'concept: prompt caching']" |
| `/unlock-private` | Unlock private vault folders (journal, sessions, archive) for THIS Claude session only. Auto-relocks on next session. | — |
| `/vault-quality-pass` | Iterative quality loop over vault notes. Auto-fixes deterministic issues, proposes LLM-reasoned improvements for batch approval, queues human decisions. Marks each note with quality_reviewed date on completion. | [folder, optional — defaults to 02-Knowledge/ + 03-Efforts/ + 04-Sources/ + 01-MOCs/] |
<!-- GENERATED:COMMANDS:END -->

## Creation cluster

### `/new-note [type] [title hint?]`
Create a new intentional note from scratch — type picker, title, routing, 3-tier template draft, preview before write. Use this when you know what you want to create.

```
/new-note
/new-note atomic
/new-note atomic Zettelkasten principle
```

> **`/new-note` vs `/process-capture`**: `/new-note` is for deliberate creation (you have an idea or topic in mind). `/process-capture` is for converting an existing raw file already sitting in `+Inbox` — voice transcriptions, quick jots, copied text. If there's no file in `+Inbox` yet, use `/new-note`.

## Capture cluster

### `/process-capture <inbox-file>`
One inbox item: classify, route, draft, preview, write on approval. Source moved to `06-Archive/` (or per session policy).

```
/process-capture meeting-notes-raw.md
```

### `/process-inbox`
Plans every `+Inbox/*.md` in one pass, presents a routing table, applies approved items. Low-confidence items are processed individually.

After processing, outputs a scoped quality follow-up: run QuickAdd "Process Note" in Obsidian first (Tier 1 — free), then `/vault-quality-pass <destination-folders>` for Tier 2+3 reasoning if needed.

```
/process-inbox
```

### `/save [hint?]`
Turn the **current conversation** into a finished, typed, routed note (concept/idea/guide/source). No `+Inbox` step — drafts from chat context, previews, writes on approval to the note's real home. Optional hint sets type or title.

```
/save
/save concept: prompt caching
```

## Quality cluster

### `/vault-quality-pass [folder?]`
Iterative quality loop over vault notes. Processes in batches of 10. Three tiers: auto-fix deterministic issues (Tier 1), propose reasoned improvements for batch approval (Tier 2), queue human decisions to `quality-queue.md` (Tier 3). Default scope: `01-MOCs/`, `02-Knowledge/`, `03-Efforts/Active+Paused/`, `04-Sources/`.

```
/vault-quality-pass
/vault-quality-pass 02-Knowledge/Atomics/Ideas
```

> Run scoped (with a folder argument) after `/process-inbox` to quality-check only the notes just written — no full-vault scan needed.

### `/lint-vault [folder?]`
Read-only vault health scan. Writes the health snapshot to AIOS/orchestration/health/snapshot.md (overwritten each run) and appends decision items to quality-queue.md.

```
/lint-vault
/lint-vault 02-Knowledge/Atomics/Things
```

Output sections: YAML drift, missing required fields, placement mismatch, broken wikilinks, body gaps, orphans, maturity inconsistency.

### `/check-hotkeys`
Read-only hotkey audit. Detects mismatches between documented hotkeys and `.obsidian/hotkeys.json`. Reports wrong bindings and undocumented hotkeys.

```
/check-hotkeys
```

Scans documentation files and hotkey bindings to find both directions of mismatch: documented hotkeys that don't exist in bindings, and bindings that aren't documented. Writes `AIOS/orchestration/reports/hotkey-audit-YYYY-MM-DD.md`.

### `/fix-note [path?]`
Inspect one note, preview proposed changes, apply on `y`/`partial`. Defers YAML reordering to `yaml_orchestrator.js`.

```
/fix-note
/fix-note 03-Efforts/Active/🚀 Origin v2.0 migration.md
```

### `/fix-batch <folder>`
Inspect a folder, group findings by category, gate each category behind a separate approval prompt. Apply only what you approve.

```
/fix-batch 02-Knowledge/Atomics/Things
```

Categories (low-risk → higher): YAML drift → legacy field rename → wikilink quoting → missing fields → body gaps → placement moves.

### `/review-note [path?]`
`/fix-note` plus link recommendations and a maturity-vs-link-count check. Per-section approval.

```
/review-note 02-Knowledge/Atomics/Ideas/💡 some idea.md
```

## Reflection

### `/reflect-daily [date?]`
Synthesizes today's daily note (or specified date) into wins/lessons/blockers/top 3. Appends a `## 🔁 AI Reflection` section to the note.

```
/reflect-daily
/reflect-daily 2026-05-09
```

### `/reflect-weekly [week as YYYY-W##?]`
Synthesizes one ISO week of daily notes into a weekly insight block appended to the weekly note. Themes, wins, lessons, open loops, seedlings, next-week top 3. Honest assessment, not performative.

```
/reflect-weekly
/reflect-weekly 2026-W27
```

## Orchestration cluster

Async vault-work pipeline. Dump a task → a loop runs the right agent → output stages in `AIOS/orchestration/proposed/` → you accept/reject on your own time. **The rule:** AI writes only to `proposed/`; the only path into canon is a human accept. Logic lives in tested Python (`AIOS/orchestration/lib/`, stdlib only). See `AIOS/orchestration/README.md`.

### `/queue-add [title/goal]`
One-button dump. Creates a task note in `AIOS/orchestration/queue/` with status `📥queued` from a single line of input. No classification, no interrogation — capture now, route later.

```
/queue-add Resolve quality-queue stub bodies
```

### `/run-queue`
Drives the queue serially (via `/loop`). Claims each `📥queued` task, routes it to the right worker agent (`note-fixer`, `capture-processor`, `link-recommender`, `vault-inspector`), stages output to `proposed/`, runs the `quality-validator` gate, writes a review package to `logs/<id>/`, and leaves the task at `👁️review`. Honors each task's `cost_cap` (aborts to `⚠️failed`). Never touches canon.

```
/run-queue
```

### `/review-proposed`
The human gate. Walks every task at `👁️review`, shows its review package + staged file, and asks accept / reject / skip. Accept moves the file into its canon `write_target`; reject discards it. Nothing reaches canon except through an explicit accept here.

```
/review-proposed
```

> Task status enum: `📥queued 🔄running 👁️review ✅accepted ❌rejected ⚠️failed`.

### `/quarterly-review [YYYY-Qn]`
The quarterly AIOS ritual: ladder promote/demote from ledger stats, lessons.md → ai-rules distill, decay pass over every AIOS folder (+ warm digest), schema/contract drift review, config-health audit. Preview-first — batches all proposals for approval before touching anything.

```
/quarterly-review
/quarterly-review 2026-Q3
```

## Privacy cluster

Sensitive folders (`05-Calendar/{Daily,Sessions,Weekly,Monthly,Quarterly,Yearly,_Logs}`, `06-Archive/{Completed,Dormant,Reference}`) are read-blocked by default via the `privacy-guard.js` PreToolUse hook. Protected paths are configured in `99-System/Config/privacy-protected-paths.json`.

### `/unlock-private`
Writes a session-scoped unlock marker (`AIOS/runtime/.privacy-unlock`, gitignored) so reads on protected folders succeed for the rest of this session. Auto-cleared at the start of every new session by the `privacy-relock.js` SessionStart hook.

```
/unlock-private
```

### `/lock-private`
Re-locks immediately by deleting the unlock marker. Use when you're done with sensitive work mid-session.

```
/lock-private
```

> Writes are NOT blocked (reads-only model), so `/session-close`, `/daily-note`, etc. keep working without unlocking. Do not try to bypass the guard via alternate tools — if a read is denied, run `/unlock-private`.

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
