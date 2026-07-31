# Origin PKM Vault

Obsidian PKM vault (v2.0). PARA-inspired 8-layer architecture.

This file is the **operating contract for AI agents working in this vault**. It is shipped with the release and describes how the vault works — not who owns it. Personal collaboration preferences belong in `Me.md`, not here.

Project status lives in the dashboards (`🧭Review HQ`, `👁️Dashboard`) — not duplicated here.

## Start here

- **Human orientation** → `README.md`, then `🏡Home.md`
- **Agent orientation** → `AGENTS.md` (60-second map + where every fact lives)
- **Collaboration protocol** → `Me.md` (how the vault's owner wants to be worked with)

## AI System

Claude-Code-driven layer for vault maintenance and capture processing. **Inspection-first, preview-before-apply.**

- **Runtime**: `AIOS/runtime/{skills,agents,commands}/`
- **Human docs**: `AIOS/docs/` (start at `+About AIℹ️.md`)
- **Commands** (9 most-used; full index → `AIOS/docs/Command Reference.md`): `/lint-vault`, `/fix-note`, `/fix-batch`, `/review-note`, `/process-capture`, `/process-inbox`, `/reflect-daily`, `/reflect-weekly`, `/vault-quality-pass`
- **Skills**: `origin-vault` (foundation), `origin-yaml`, `origin-templates`, `origin-routing` — trigger conditions per skill → `AIOS/docs/Agent Reference.md`
- **Agents**: `vault-inspector`, `note-fixer`, `capture-processor`, `link-recommender`, `quality-validator` — roles → `AIOS/docs/Agent Reference.md`
- **Consistency/Audit**: catalog of every drift/consistency mechanism → `AIOS/docs/Consistency and Audit Reference.md`

> **Skill loading note**: If the `Skill` tool can't find a project skill, use `Read` on `AIOS/runtime/skills/<skill-name>/SKILL.md` directly and follow its instructions manually — the `.claude/` → `AIOS/runtime/` junction is per-machine, not git-tracked, and may not exist yet on a fresh vault.

## File Output Rules

When an agent creates files during a session, place them here — never in `+Inbox`:

| Output type | Target folder |
|-------------|---------------|
| AI-generated audit/scan reports (lint, hotkeys, orphans) | `AIOS/orchestration/reports/` |
| Architecture / design / sprint / implementation plans | `AIOS/docs/plans/` (specs → `AIOS/docs/specs/`, ADRs → `AIOS/docs/adr/`) |
| Scripts, utilities | `99-System/Scripts/` (vault) or `AIOS/scripts/` (agent maintenance) |

`+Inbox` is for human-captured ideas only. Session artifacts go elsewhere.

**Status marker** — Every AI-generated artifact (spec, plan, audit/scan report) opens with a status callout as its first body line: `> [!done]- Status: 🟡 DRAFT → 🟢 APPROVED → 🔵 IN PROGRESS → ✅ DONE (YYYY-MM-DD · where)`. The agent updates it to the current stage — ending at `✅ DONE` — the moment the artifact is executed or consumed.

**Plan/spec frontmatter** — every new `AIOS/docs/plans/` or `AIOS/docs/specs/` doc requires a `status:` field using the vault's standard `99-System/CIS/CIS_STATUS.md` enum (`📥inbox`/`🔄active`/`✅completed`/`📦archived`), never blank or omitted. This is the machine-readable source of truth (queryable via Dataview/scripts); the body callout stays as human-readable narrative but is not authoritative. Mapping: 🟡 DRAFT/🟢 APPROVED → `📥inbox`, 🔵 IN PROGRESS → `🔄active`, ✅ DONE → `✅completed`. Once a doc is no longer actionable, flip its status to `📦archived` — no file move; freeze/remove any live Dataview query in it first.

## Vault Architecture

**8-layer structure** — Capture → Process → Organize → Connect → Review → Archive. Full folder manual: `📁My PKM Folders`.

`+Inbox` (capture) · `01-MOCs` (nav hubs) · `02-Knowledge` (Areas + Atomics: Concepts/Ideas/Quotes/Statements + People/Places/Tools) · `03-Efforts` (`Active/Paused/Waiting`) · `04-Sources` (Knowledge/Media/Guides/Meetings) · `05-Calendar` (Daily→Yearly) · `06-Archive` (`Completed/Dormant/Reference`) · `99-System` (Scripts/Config/CIS/FileClasses) · `Templates`

Root dashboards: `🏡Home.md`, `👁️Dashboard.md`, `TODO.md`, `🧭Review HQ.md`

**Areas**: flat notes in `02-Knowledge/Areas/` (`type: area`, FileClass `area`). No numbered subfolders; create one only when a sub-theme within an Area clusters to ~8-10 notes, not on a flat Area-wide count. **Area vs Topic/MOC test**: an Area is an ongoing standard you actively maintain (no end state); a Topic/skill that serves multiple Areas without being one itself gets a tag + MOC instead — see `+About Areasℹ️` for the full test and worked examples.

**+About note doctrine**: a `+About` note is a folder contract — what belongs/what doesn't (+ redirect targets), type + template, lifecycle, review cadence, links to real notes. Fictional examples are welcome as `[!example]` callouts with wikilinks backticked so they don't create phantom links. Never: invented statistics, philosophy essays, workflow tutorials (→ `🔁My PKM Workflows`), folder trees duplicating reality.

## Template System (3-Tier Modular)

Meta (YAML) + Body (content) composed at creation. **Full detail → `📦Template System Guide`.**

- **Engine**: `99-System/Scripts/Templater_script.js` — `inject_meta_if_missing()`, `add_chapters()`, `combine()`, `reset_*()`
- ⚠️ `combine()` has a race-condition gotcha — see Critical Issues #1

## Scripts

Full catalog of `99-System/Scripts/` → **`🔧Scripts Reference`**.

**Maintenance scripts** (`AIOS/scripts/`, run from vault root via a POSIX shell; they end with a manual `git diff` + commit prompt, never auto-commit):
- `vault-morning.sh [--dry-run]` — daily inbox triage + metrics cache refresh
- `vault-desloppify.sh [--dry-run|--last-commit]` — post-edit YAML cleanup (maturity, status, deadline→due)

**`99-System/Scripts/voice_capture/` (Python CLI)**:
- Entry point is `python -m voice_capture`, **not** `python -m voice_capture.cli` — `cli.py` has no `__main__` guard; running it directly imports everything but calls nothing
- Requires `numpy` to run. `scipy` is `pytest.importorskip`'d; `sounddevice`/`whisper` are always monkeypatched in tests. Use a throwaway venv rather than installing globally.

## YAML Frontmatter Schema

→ Full field order, locked enums, legacy renames, wikilink quoting: `origin-yaml` skill.
→ Raw enum source of truth: `99-System/CIS/CIS_{FIELD_NAME}.md` (30+ files). Metadata field reference: `🔢My PKM Metadata`.

## QuickAdd Integration

- **Macro UserScript signature**: `module.exports = async (params) => { const { app, quickAddApi: qa } = params; const { Notice } = window; ... }`
- **QuickAdd API via params**: `qa.inputPrompt(header, placeholder, default)`, `qa.suggester(labels, values)`, `qa.yesNoPrompt(header)` (never `window.QuickAddApi` — see Critical Issues #11)
- Macros registered in `.obsidian/plugins/quickadd/data.json` — must add entries there for buttons to work
- **Registration pattern for UserScripts**: wrap in a `Macro` choice (`"type": "Macro"`) with a `commands[]` array containing `{"type": "UserScript", "path": "..."}` — raw UserScript entries inside Multi `choices[]` do NOT work
- **Trailing spaces in data.json names**: QuickAdd entry names sometimes have trailing spaces — always `.strip()` both sides when looking up by name in scripts
- **Bulk edits to data.json**: back up first, validate after with a JSON parse
- **Capture type + Templater WASM**: Capture choices with `<%* tp.* %>` format crash with "Invalid or unexpected token" or "run_file is not a function" even with `useTemplater: false`. Fix: convert to Macro type with UserScript — do not try to fix Capture format strings.
- Button plugin syntax: `type command` + `action QuickAdd: MenuName: ChoiceName`
- Capture "Insert after" + "Insert at end of section" appends at the section's END (below quote lines and prior entries, up to the next heading)
- **Template Choice `fileNameFormat` gotcha**: if `fileNameFormat.enabled: true` but the `format` string lacks `{{VALUE}}`, QuickAdd silently creates the note with that literal name — it never prompts for a title. Always include `{{VALUE}}`, or disable `fileNameFormat` entirely.
- **`metadata-menu` has no conditional/dependent-field support** — a field added to a FileClass shows on every note of that class, even if only relevant to one `type`/`source_type` subvalue.

## Auto Note Mover (plugin quirks)

- Trigger is `"Manual"` — a tag alone moves nothing; scripts must call `app.commands.executeCommandById("auto-note-mover:Move-the-note")`
- `excluded_folder` matching is EXACT path, not prefix — excluding `06-Archive` does NOT protect its subfolders; list each subfolder explicitly
- Never add an ANM rule targeting `06-Archive` (root-dump hazard) — archiving is owned by `99-System/Scripts/archive-note.js` (status flip + subfolder dropdown)

## Two-Tier Type System

→ Full type list + counts (11 full / 11 lightweight), FileClass rules, prompt sub-tiers: `origin-vault` skill.

## Schema Change Protocol

When a canonical field name, enum value, or type identifier changes vault-wide, treat it as a **contract change** — not a field edit. The same propagation surface always applies:

1. **FileClass** (`99-System/FileClass/<type>.md`) — field schema definition
2. **Templates** (Meta, Body, Create, Static for the type) — default values and field presence. Meta templates duplicate the FileClass field list as literal placeholder keys (not a reference) — edit both.
3. **Scripts** (`normalize_*.js`, `yaml_orchestrator.js`, `Templater_script.js`, `yaml_validator.js`) — field references in logic. `yaml_orchestrator.js` is generic (unknown fields pass through unchanged); `yaml_validator.js` has a hardcoded per-type `SCHEMAS` object that silently skips validation on any field not explicitly added there.
4. **Orchestrator config** (`99-System/Config/yaml-meta-config.json`) — the data half of layer 3: `order.default` is the live canonical field-order array `yaml_orchestrator.js` reads (the script itself has zero per-type code). A field missing from this array gets alphabetically appended to the frontmatter tail instead of landing in its canonical position. Also holds `enums`, `rename`, `dateKeys`, `ensureRequired`.
5. **AIOS Skill docs** (`AIOS/runtime/skills/*/SKILL.md`, `AIOS/rules/ai-rules.md`) — schema documentation
6. **Workflow/tutorial docs** (`🔁My PKM Workflows.md`, tutorials, MOC notes) — user-facing references

**Rule**: Trace all six layers *before* making the first edit. Group as **blocking** (layers 1–4: fix in the same session) vs **doc-only** (layers 5–6: defer to a written tracker). Never close the session without either fixing blockers or having the tracker committed.

**Guardrail**: Before adding a fact to this file, check whether a skill (`AIOS/runtime/skills/*/SKILL.md`) or an `AIOS/docs/*.md` reference already owns it. If yes, write `→ see <File>` instead of restating it. CLAUDE.md holds only an index (names, not detail) plus facts that gate immediate tool behavior.

## ⚠️ Critical Issues to Avoid

These are real footguns discovered in this vault, not hypotheticals. Read before touching the matching subsystem.

1. **`combine()` function**: Use `tR += await tp.user.combine(...)` — NOT `writeActive()` (causes race conditions). Reset functions (`reset_*`) correctly use `writeActive()`.

2. **Status values**: Always emoji-prefixed (`🔄active`, not bare `active`). Full canonical list → `origin-yaml` skill.

3. **Maturity values**: `📤seed` (not `🌱seed`) — outbox emoji, not seedling. Full canonical list → `origin-yaml` skill.

4. **Field naming**: `due` (not `deadline`), `related` (not `relatedNotes`). YAML Orchestrator auto-renames. Full rename table → `origin-yaml` skill.

5. **Cache pattern**: `99-System/_Metrics Cache.md` uses inline fields (`field:: value`). Dashboard reads via `dv.page("99-System/_Metrics Cache").field_name` with live fallback. Update via QuickAdd "Update Metrics Cache".

6. **`prompt_status` is retired**: collapsed into `status`. Mapping: `draft`→`📥inbox`, `active`→`🔄active`, `winner`→`✅completed`, `archived`→`📦archived`. Do not re-introduce it.

7. **Windows paths**: The Glob tool may miss files — use a directory listing via shell as fallback.

8. **Review HQ**: Uses a mix of cached metrics + live queries for dynamic data (overdue tasks, waiting items can't be cached).

9. **Bilingual quick-process scripts**: `quick-process-atomic.js`, `quick-process-source.js` intentionally contain non-English keywords for matching non-English notes — do NOT remove.

10. **Tags are emoji-first canonical forms.** See `🏷️Tag Consolidation Log`. Key forms: `🚀effort`, `💡atomic`, `🧹tidy`.

11. **`window.QuickAddApi` is unreliable**: Not available in Macro UserScript context. Always use `const { app, quickAddApi: qa } = params`. Scripts using `window.QuickAddApi` silently fail with "QuickAdd API not found" when run as Macros.

12. **Never write full folder paths in wikilinks**: link notes by **title only** — `[[07-Prompts]]`, not `[[99-System/Prompts]]`. Path-style folder links never resolve in Obsidian and pollute the lint report. Applies to `up:`, `⬆️::`, `related:`, inline links. If the target is a folder, link its index/hub note. **EXCEPTION:** Calendar nav links in `Templates/Calendar/Template {Daily,Weekly,Monthly,Quarterly,Yearly}.md` use path form — `[[05-Calendar/<Subfolder>/<date>|Label]]` — so that when a target note doesn't exist, Obsidian creates it in the correct `05-Calendar/` subfolder with the Templater template applied. Lint must skip wikilinks starting with `05-Calendar/` when inside these five templates.

13. **Footer Dataview expression**: `` `= this.file.mtime` `` (not `= date(now)`). Standard footer last line: `⬆️ [[🏡Home]]  *| `= this.file.mtime`*`

14. **Note navigation model** — each note has exactly two nav elements: (1) `[!orbit]` wayfinder callout, preceded by exactly one blank line after the frontmatter's closing `---` — `> [!orbit] Wayfinder | [[parent-moc]] | [[sibling1]] | [[sibling2]]` — parent MOC + siblings only, never `[[🏡Home]]`; (2) footer as the last block, preceded by a `---` separator. Once both are present, `⬆️:: [[...]]` inline lines are removed. **Known exception**: `generate-orbit.js` writes the callout with no blank line before it — intentionally left as-is. **Scope**: Wayfinder applies to PKM content notes and living `AIOS/docs/` reference docs. The **footer** additionally requires `maturity: 🪴sapling` or higher — seed/seedling notes stay unlinked to Home, since the footer signals "this note is synthesized into the graph," not "this note exists." AIOS reference docs are treated as always-mature and keep the footer. **Not required at all** for `AIOS/docs/plans/` and `AIOS/docs/specs/`.

15. **`99-System/` is excluded from Obsidian's index**: `.obsidian/app.json → userIgnoreFilters` lists `99-System/` (alongside `06-Archive/`, `Templates/`, `08-Localization/`). Files in excluded folders are **completely invisible** to Bases, search, backlinks, and quick switcher — no filter syntax can find them. If a Bases view returns 0 results and the files are in `99-System/`, the fix is to move the files to a non-excluded top-level folder, not to debug filter syntax.

16. **Emoji regex matching**: `⏸️paused`/`⚠️blocked` are two codepoints (base glyph + U+FE0F variation selector) — a char-class regex must include the variation selector or it silently fails to match these two literals while matching every other status/maturity emoji fine.

17. **Emoji-filename spacing**: no space after the emoji prefix (`🧭Review HQ.md`), vault-wide. Glob by fragment before a direct `Read`/`Edit` on an emoji path.

18. **`CIS_TAG.md` "Workflow Status" tags are intentional, not schema drift**: `CIS_TAG.md` has a dedicated section listing `📥inbox`/`🔄active`/`⏳waiting`/etc. as valid **tags**, documented as "mirrors `status:` field — supplementary, not primary." A script pushing a status emoji into the `tags` array (e.g. `mark-waiting.js`) is following this documented pattern — don't "fix" it during an enum audit without checking this section first.

19. **`/lint-vault` is two files, not one**: `AIOS/runtime/commands/lint-vault.md` only orchestrates; the actual per-file scan checklist lives in `AIOS/runtime/agents/vault-inspector.md`. A new detection category added to only the command doc is documented but never runs.

20. **`aios_task.set_status()` silently no-ops on a missing `status:` key**: it only *replaces* an existing `status:` frontmatter line — if a queue task file was created without one, the call returns success but nothing changes, and the task becomes invisible to `aios_queue.list_tasks(status=...)` filtering. Always grep the target file for `^status:` before trusting a `set_status()` call worked.

21. **`app.vault.create()` does not auto-create parent folders**: writing to `99-System/Reports/foo.md` fails if `99-System/Reports/` doesn't exist. Check-and-create first: `if (!(await app.vault.adapter.exists(dir))) await app.vault.adapter.mkdir(dir)`.

22. **There is no `tp.file.writeYaml()`** — Templater has no direct frontmatter-write API, including inside a QuickAdd Capture's `<%* %>` format block. Use `app.fileManager.processFrontMatter(tp.file.find_tfile(tp.file.title), fm => {...})` instead (`app` is globally available inside Templater blocks too).

23. **Obsidian Bases: `link(this.file.name)` never matches a real backlink** — `file.name` includes the `.md` extension, so `link()` builds a target like `[[2026-07-26.md]]` that won't match an actual `[[2026-07-26]]` wikilink. Use `this.file.basename` when building a `link()` for backlink-comparison filters.

24. **`app.vault.create()` also throws if the target file already exists** (sibling of #21) — a script writing to a deterministic or date-based path crashes on a second same-day run unless it checks first: `const existing = app.vault.getAbstractFileByPath(path); if (existing) await app.vault.modify(existing, content); else await app.vault.create(path, content);`

25. **`aios_task` module API**: read a task with `aios_task.parse_task(path)` (not `.load()` — doesn't exist). Change status with `aios_task.set_status(path, status)` — first arg is the **file path string**, not the parsed Task object; passing the object throws `TypeError`. Always grep `^status:` after calling it (per #20).

## 🔒 Privacy Guard

Sensitive folders are **gated from agents by default** via a `PreToolUse` hook (`.claude/hooks/privacy-guard.js`), reading paths from `99-System/Config/privacy-protected-paths.json` (default: `05-Calendar/{Daily,Sessions,Weekly,Monthly,Quarterly,Yearly,_Logs}`, `06-Archive/{Completed,Dormant,Reference}`).

- **The guard asks, it does not deny.** Touching a protected path surfaces a permission prompt to approve or reject per call. Approving once does not unlock anything else; `/unlock-private` opens the whole session (`/lock-private` re-locks). **Do not bypass the guard** via alternate tools — a rejected prompt is a decision, not an obstacle to route around.
- Every new session starts locked. Extend protection by editing the JSON config — no code change. If you edit that JSON, mirror it into `BUILTIN_PROTECTED` in `AIOS/runtime/hooks/lib/privacy-core.js`; a test asserts the two lists match exactly.
- **Not a reads-only model for shell commands**: the guard matches the *path string* in a command, so any shell call naming a protected path is gated regardless of direction — including a `mv` that only writes *into* it.

## Templater / QuickAdd Script Sharing

- **Templater's `user_scripts_folder` and QuickAdd's script folder are the same path** (`99-System/Scripts`) — any `module.exports = async (...) => {}` script there is callable directly from a Templater template via `tp.user["script-name"]()` (bracket notation for hyphenated filenames), with no separate Templater registration needed.
- Templater's `user_scripts_folder` scans recursively — Node.js CLI scripts (`require('fs')`) in subfolders cause an error Notice popup at startup; only `module.exports = async () => {}` scripts belong there.

## Naming Conventions

- **Templates**: file-naming pattern (`{type}-meta.yaml.md`, `{type}-body.md`, etc.) → `origin-templates` skill.
- **Scripts**: kebab-case · **CIS enums**: `CIS_{FIELD_NAME}.md` (SCREAMING_SNAKE_CASE) · **YAML keys**: snake_case · **Tags**: emoji + category (`💡atomic`) · **About files**: `+About {Section}ℹ️.md`
- **Emoji prefix**: no space after the emoji (`🧭Review HQ`, not `🧭 Review HQ`)
- **Series separator**: `Prefix - Title` with a plain hyphen; em-dash `—` never in filenames (fine in note bodies).

## Troubleshooting (common)

Symptom → fix. Proactive footguns live once in **⚠️ Critical Issues** — not repeated here.

- **Dataview undefined / no results**: use `p?.status === "🔄active"` + `?? 0` fallback; check folder-path quotes (`"03-Efforts"`) and canonical status.
- **Templater undefined**: ensure the function has a `return`.
- **Module not found / QuickAdd macro missing**: check the `99-System/Scripts/` path, restart Obsidian.
- **After deleting a script**: grep both the filename and its QuickAdd command name across `99-System/Documentation/` + this file.

## Query Optimization

Dataview query patterns (LIMIT, folder-specific `dv.pages('"03-Efforts"')`, `_Metrics Cache` with live fallback, exclude `99-System`/`Templates`/`_backups`) are owned by the `dataview-help` skill — invoke it when writing or debugging queries.

## Git Workflow

- **Branches**: `main` + feature branches. **Commits**: Conventional (`fix:`, `feat:`, `refactor:`, `chore:`, `docs:`). **No force-push to main.**
- **99-System git tracking**: `.gitignore` uses `/99-System/*` (blanket ignore) — only `Scripts/` and `Documentation/` are tracked. Add a `!` exception for any other subfolder before staging.
- **`.claude/` is a gitignored junction → `AIOS/runtime/`**: stage runtime files at their real `AIOS/runtime/...` paths, NOT `.claude/...`. Hook command strings inside files still use `.claude/` — it resolves via the junction at runtime.

## Forbidden Actions

These require explicit user confirmation — never do them autonomously:

- Never delete vault notes without confirmation
- Never modify `.obsidian/` config files directly
- Never bulk-rename notes without a backup
- Never overwrite template files without reading them first
- Never force-push to main; never amend published commits
- Never commit `.env`, secrets, credentials, or API keys
