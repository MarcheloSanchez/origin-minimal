---
description: Read-only vault health scan. Detects YAML drift, missing fields, placement mismatches, broken wikilinks, body gaps, orphans. Auto-fixable findings go into the lint report; human-decision items go into quality-queue.md. No edits to vault content.
argument-hint: [folder, optional — defaults to full vault]
---

> [!info] Two-output design
> This command produces two outputs that serve different purposes:
> - **Health snapshot** (`AIOS/orchestration/health/snapshot.md`, overwritten each run) — everything that *can be fixed automatically*: YAML drift, enum typos, missing fields, wrong footer format, broken wikilinks. Feed this to `/fix-batch` to resolve.
> - **Quality queue** (`quality-queue.md`) — everything that *needs a human decision*: PARA mismatches, orphan candidates, stub bodies, dishonest maturity, structural broken links. Feed this to `/quality-queue-resolve` to work through.
>
> Decision items are **not** repeated in the lint report body. The report just counts how many were sent to the queue.

You are running inside the **Origin** v2.0 vault. Load `origin-vault` and dispatch the **vault-inspector** agent.

## Task

Run a read-only health scan over `$ARGUMENTS` (or the full vault if no argument). Produce a lint report and feed decision items to the quality queue.

## Workflow

1. **Resolve scope.** If argument given, validate it's a real folder under the vault. If not, ask. If no argument, scope = full vault minus locked paths.
2. **Pre-launch confirmation.** Before scanning, print this summary and wait for the user to confirm:

   ```
   === /lint-vault — Ready to scan ===

   Scope:      <full vault | folder path>
   Excluded:   99-System/CIS/, 99-System/Config/, .obsidian/, Templates/_Examples/,
               Templates/Tests/, _backups/, 05-Calendar/ (privacy-locked)
   Checks:     YAML drift · missing fields · enum typos · broken wikilinks ·
               placement mismatches · body gaps · orphan notes · footer format ·
               stale staged captures
   Outputs:
     • Health snapshot → AIOS/orchestration/health/snapshot.md (overwritten)
     • Decisions    → AIOS/orchestration/quality-queue.md (appended)
   No vault content will be modified.

   Proceed? [y/N]
   ```

   If the user answers anything other than `y` or `yes`, abort cleanly. Suggest running with a folder argument to narrow scope.

3. **Dispatch `vault-inspector`** with the scope. It runs `AIOS/scripts/vault_scan.py`,
   reads the resulting JSON, and returns an interpreted report. Detection is
   deterministic — every count in the report comes from the scanner, not the
   agent. If the scanner fails, the run aborts; there is no hand-scan fallback.
4. **Split findings** into two buckets:
   - **Auto-fixable** → lint report
   - **Human-decision** → quality queue (see tables below)
5. **Write the health snapshot** to `AIOS/orchestration/health/snapshot.md`, OVERWRITING the previous run (git history is the archive). Structure: H1 + run header (date, scope, notes scanned), `## Auto-fixable findings` grouped by category with /fix-batch recommendations, `## Ladder stats` (one row per fix-class in `AIOS/contracts/ladder.yaml`: tier, ledger row count since last quarterly review, accepted/reverts counters), and final line `→ N decision items sent to quality-queue.md`.
6. **Append decision items** to `quality-queue.md` under `## Pending — YYYY-MM-DD`. Create the file with correct YAML if it doesn't exist. Never overwrite or duplicate existing entries — skip any item whose note title already appears in an unchecked queue entry.
7. **Print a summary** to the user.

## Auto-fixable findings (lint report only)

Bucketing is now driven by the scanner's `check` names — the authoritative
mapping table lives in `AIOS/runtime/agents/vault-inspector.md` ("Bucket every
finding"). The list below is the human-readable summary of what lands here and
is resolved via `/fix-batch`:

| Finding | Category label |
|---|---|
| `deadline:` key in YAML | `field rename` |
| `relatedNotes:` key in YAML | `field rename` |
| Status value missing emoji prefix | `enum fix` |
| `maturity: 🌱seed` instead of `📤seed` | `enum fix` |
| `[[Note\|alias]]` escaped pipe in body | `syntax fix` |
| Missing `modified:` field | `missing field` |
| Missing or malformed footer | `footer fix` |
| Footer uses `= date(now)` instead of `= this.file.mtime` | `footer fix` |
| No blank line between closing `---` and `> [!orbit]` callout | `orbit spacing` |
| `up:` wikilink not quoted | `yaml fix` |
| Missing universal fields (`type`, `status`, `maturity`, `created`) | `missing field` |
| Cosmetic broken wikilinks in body (non-structural) | `broken link` |

## Human-decision findings (quality queue only)

These go into `quality-queue.md` and are resolved via `/quality-queue-resolve`
(same single-owner mapping table as above):

| Finding | Queue flag |
|---|---|
| Note in wrong PARA folder for its type | `PARA mismatch` |
| `status: 📦archived` but note lives in an active folder | `status/folder mismatch` |
| Zero backlinks AND `related: []` AND non-system type | `orphan candidate` |
| `type: atomic/source/effort` with fewer than 3 sentences of body content | `stub body` |
| `maturity: 🌲evergreen` or `🍓fruit` with < 200 words | `maturity dishonest high` |
| Broken wikilink in `up:` or orbit callout (structural navigation broken) | `broken structural link` |
| File under `+Inbox/_reformed/` with mtime older than 7 days | `stale staged capture` |

Queue entry format:
```
- [ ] [[Note Title]] — `<flag type>` — <one-line reason>  (found: YYYY-MM-DD, lint run)
```

## Hard constraints

1. **Do NOT modify any vault content.** Only the lint report and quality-queue.md are written.
2. **Do NOT enter locked paths** (`99-System/CIS/`, `99-System/Config/`, `.obsidian/`, `Templates/_Examples/`, `Templates/Tests/`, `_backups/`, and the privacy-protected folders under `05-Calendar/` and `06-Archive/` — see `99-System/Config/privacy-protected-paths.json`; these need `/unlock-private` to scan).
3. **Do NOT propose fixes inline.** The report's recommendation section suggests commands; it never invokes them.
4. **If the inspector reports zero issues**, write the report anyway with "No issues found" — proof of clean state is valuable.
5. **No duplicate queue entries.** Check existing unchecked items before appending.

## After writing

Tell the user:

- Report path and counts: scanned / auto-fixable issues / per-category
- Queue: N new items added (by flag type)
- Top recommendations: e.g. "Run `/fix-batch 02-Knowledge/` for 12 auto-fixable issues · `/quality-queue-resolve` for 4 new decision items"
