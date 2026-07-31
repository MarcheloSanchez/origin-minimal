---
description: Iterative quality loop over vault notes. Auto-fixes deterministic issues, proposes LLM-reasoned improvements for batch approval, queues human decisions. Marks each note with quality_reviewed date on completion.
argument-hint: [folder, optional — defaults to 02-Knowledge/ + 03-Efforts/ + 04-Sources/ + 01-MOCs/]
---

You are running inside the **Origin** v2.0 vault. Load `origin-vault`, `origin-yaml`, `origin-routing`, `origin-templates`.

## Purpose

Drive the vault toward the quality standard defined in `AIOS/docs/specs/2026-04-16-vault-quality-review-design.md`. Process notes in batches: auto-fix what is deterministic, propose what requires reasoning, flag what requires a human decision. Never modify a note without applying at least Tier 1 checks first.

**Quality dimensions (from the standard):**
1. `[!orbit]` callout present as first content line after frontmatter
2. YAML complete: `type`, `status`, `maturity`, `tags`, `up`, `created` filled with canonical values
3. Body has at least one heading + substantive content (not a stub)
4. At least one `related` link OR backlink from a MOC/effort
5. Maturity honest — not stuck at `📤seed` if note has real content

---

## Scope

Default scope (no argument): `01-MOCs/`, `02-Knowledge/`, `03-Efforts/Active/`, `03-Efforts/Paused/`, `04-Sources/`.

Excluded always: `99-System/CIS/`, `99-System/Config/`, `.obsidian/`, `Templates/`, `_backups/`, `06-Archive/`, `05-Calendar/` (privacy-protected), `+Inbox/` (use `/process-inbox` instead).

If an argument is given, validate it is a real folder inside the vault (not a locked path) and restrict scope to it.

---

## Pre-flight

1. Read `AIOS/orchestration/quality-queue.md` if it exists — this is the running decisions backlog from prior passes. Keep it in context.
2. Resolve scope folder(s).
3. Collect all `.md` files in scope. Exclude notes that already have `quality_reviewed:` set to today's date (they were processed this session).
4. Report: "N notes in scope. M already reviewed today. Starting with remaining K."
5. Work in **batches of 10 notes** per iteration. Ask the user "Continue to next batch?" after each batch completes.

---

## Per-note processing (run in this order for every note in the batch)

### Step 1 — Tier 1: Deterministic auto-fixes

Apply all of the following silently (no preview needed). Track what changed.

| Check | Detection | Fix |
|---|---|---|
| Field rename | `deadline:` key in YAML | rename to `due:` |
| Field rename | `relatedNotes:` key in YAML | rename to `related:` |
| Status bare word | `status:` value has no leading emoji | map: `active`→`🔄active`, `completed`→`✅completed`, `archived`→`📦archived`, `inbox`→`📥inbox`, `waiting`→`⏳waiting`, `paused`→`⏸️paused`, `cancelled`→`❌cancelled`, `blocked`→`⚠️blocked` |
| Maturity wrong seed | `maturity: 🌱seed` | → `maturity: 📤seed` |
| Escaped pipe wikilink | `[[Note\|alias]]` anywhere in body | → `[[Note|alias]]` |
| Inline up-field | `⬆️:: [[...]]` in body AND `[!orbit]` callout already present | sync value to YAML `up:` field if missing or different — **delete the `⬆️::` line** (redundant once orbit is present); if orbit is absent, keep the line and flag for Tier 2 orbit generation |
| Missing `modified` | no `modified:` key in YAML | add `modified: YYYY-MM-DD` (today) |
| Missing footer | last non-empty line is not `⬆️ [[🏡Home]]  *\| \`= this.file.mtime\`*` | append footer as last line of the note: `⬆️ [[🏡Home]]  *\| \`= this.file.mtime\`*` |
| Stale footer | footer exists but uses `= date(now)` or differs from the standard | rewrite to exact standard format: `⬆️ [[🏡Home]]  *\| \`= this.file.mtime\`*` |
| Missing blank line before orbit | line immediately after closing `---` is `> [!orbit]` with no empty line between | insert one blank line between `---` and the orbit callout |

After Tier 1: write the file if anything changed. Log: `[T1] path — N fixes applied`.

### Step 2 — Tier 2: Reasoning proposals

Collect all Tier 2 issues for the note into a single proposal block. Do NOT apply yet.

| Check | Detection | Proposal |
|---|---|---|
| `up:` missing | no `up:` in YAML | Read note content + determine folder context → propose the most specific relevant MOC or parent note that exists in the vault. Verify target exists before proposing. |
| `up:` target broken | `up:` link does not resolve to an existing file | Propose a verified replacement — same logic as missing. |
| `[!orbit]` missing | no `> [!orbit]` line within the first 5 lines after frontmatter `---` | Once `up:` is confirmed set: build the orbit line. Format: `> [!orbit] Wayfinder \| [[up-target]] \| [[related1]] \| [[related2]]`. Use existing `related:` links if present and verified; supplement with 1–2 sibling notes found via Grep in the parent folder. **Never include `[[🏡Home]]` in the orbit — Home belongs in the footer only.** If `up:` is `[[🏡Home]]`, skip it as the orbit target and use 2 sibling notes instead. |
| `[!orbit]` stale | orbit callout links contain one or more broken wikilinks | Rebuild the orbit line using the same method as missing. Remove `[[🏡Home]]` if present. |
| `related` empty | `related: []` or field absent | Grep vault for notes that share the note's primary topic keywords. Propose 2–3 verified wikilinks (confirm each target file exists). Do not invent links. |
| Maturity understated | `maturity: 📤seed` AND body word count > 100 AND at least one heading exists | Propose promotion to `🌱seedling`. State evidence: word count, heading count. |
| Tags empty | `tags: []` or absent | Infer from `type` and top 3 content keywords → propose 1–3 canonical emoji-tags from `99-System/CIS/CIS_TAG.md`. |

If a note has zero Tier 2 issues, skip Step 2 for that note.

### Step 3 — Tier 3: Decisions queue

Check the following. For any match, append an entry to `AIOS/orchestration/quality-queue.md` under `## Pending — YYYY-MM-DD`. Do NOT touch the note.

| Flag | Detection |
|---|---|
| PARA mismatch | `type: source` in `02-Knowledge/`, `type: atomic` in `04-Sources/`, `type: effort` in `02-Knowledge/`, etc. |
| Orphan candidate | Zero backlinks (grep for `[[<note-title>]]` across vault returns nothing) AND `related: []` AND `type` is not `system/guide/dashboard/about` |
| Stub body | `type` is `atomic`, `source`, or `effort` AND body has fewer than 3 sentences of non-YAML, non-heading content |
| Maturity dishonest high | `maturity: 🌲evergreen` or `🍓fruit` AND body word count < 200 |
| Status/folder mismatch | `status: 🔄active` but note is inside `06-Archive/` |

Entry format in `quality-queue.md`:
```
- [ ] [[Note Title]] — `<flag type>` — <one-line reason>  (found: YYYY-MM-DD)
```

### Step 4 — Mark as reviewed

After Tier 1 + Tier 2 proposals collected (even if no changes made), add to the note's YAML:
```yaml
quality_reviewed: YYYY-MM-DD
```

This marks it done for today's pass and excludes it from re-processing in the same session.

---

## Tier 2 batch presentation

After processing all 10 notes in a batch, present Tier 2 proposals as a **single consolidated block**:

```
=== TIER 2 PROPOSALS — Batch N ===

[1] Note: [[Note Title A]]
    up: (missing) → [[Parent MOC]]
    orbit: (missing) → > [!orbit] Wayfinder | [[Parent MOC]] | [[Sibling 1]]
    related: (empty) → ["[[Related 1]]", "[[Related 2]]"]

[2] Note: [[Note Title B]]
    maturity: 📤seed → 🌱seedling (312 words, 3 headings)

[3] Note: [[Note Title C]]
    tags: (empty) → ["💡atomic", "🧠psychology"]

Apply all? [y] / Skip all? [n] / Review individually? [i]
```

On `y`: apply all proposals.
On `n`: skip all, move to next batch.
On `i`: step through each proposal one at a time with `y`/`n` per item.

---

## Quality queue file format

`AIOS/orchestration/quality-queue.md` — created on first run if absent.

```markdown
---
title: Vault Quality — Decisions Queue
type: system
status: 🔄active
created: YYYY-MM-DD
modified: YYYY-MM-DD
---

# Vault Quality — Decisions Queue

Human-review items flagged during `/vault-quality-pass`. Check off each when resolved.

## Pending — YYYY-MM-DD

- [ ] [[Note A]] — `PARA mismatch` — type: source but in 02-Knowledge/Atomics/
- [ ] [[Note B]] — `orphan candidate` — zero backlinks, empty related
- [ ] [[Note C]] — `stub body` — effort note with 1 sentence of content

## Resolved

<!-- Move checked items here -->
```

---

## Hard constraints

1. **Tier 1 only modifies YAML fields and body escape syntax.** Never rewrite body content.
2. **Never invent wikilinks.** Every proposed link must be verified to exist in the vault before proposing.
3. **Never propose moving notes.** PARA reclassification goes to the decisions queue (Tier 3).
4. **Never touch locked paths** (`99-System/CIS/`, `99-System/Config/`, `.obsidian/`, `Templates/_Examples/`, `Templates/Tests/`, `_backups/`).
5. **Never auto-apply Tier 2.** Always wait for the batch approval response.
6. **Never delete content.** Even stubs — flag them, don't clear them.
7. **Bilingual care.** Notes in Czech stay in Czech. Never translate or auto-translate.
8. **`up:` must exist before orbit generation.** If `up:` is missing, include it in the Tier 2 proposal AND make orbit generation contingent on it being approved first.
9. **Do not reorder YAML keys.** Defer to `yaml_orchestrator.js`. Only add/rename specific keys.

---

## After each batch

Report:
- Notes processed: N
- Tier 1 fixes applied: N (list field types changed)
- Tier 2 proposals: N approved / N skipped
- Tier 3 flags added to queue: N
- Notes marked `quality_reviewed`: N
- Append one ledger row per batch with changes: fix-class quality-tier1-deterministic (T0) for Tier 1 fixes; one row per approved Tier 2 group using note-fix-yaml or note-fix-body (T2).

Then ask: **"Continue to next batch of 10? [y/n]"**

---

## After full pass (or when user stops)

Print final summary:
```
=== VAULT QUALITY PASS COMPLETE ===
Scope: 01-MOCs/, 02-Knowledge/, 03-Efforts/, 04-Sources/
Notes processed: N
  Tier 1 fixes: N notes, N total changes
  Tier 2 approved: N / N proposed
  Tier 3 queue: N new items (see AIOS/orchestration/quality-queue.md)
  Already reviewed today: N (skipped)
Next: run /vault-quality-pass 02-Knowledge/Atomics/ to process remaining notes
```
