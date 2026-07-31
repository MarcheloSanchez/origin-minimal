---
name: origin-note-quality-check
description: Use when the user asks to quality-check a single Origin DEV note, evaluate a note against vault schema standards, or wants a defect report before fixing YAML/body issues. Reports tier (Stub/Draft/Complete) and a concrete defect list against Origin DEV's schema — read-only by default, offers fixes only after explicit confirmation. This is the Origin-schema sibling of the Ideaverse-only global skill `~/.claude/skills/note-quality-check/SKILL.md`; do not use that skill against this vault.
---

# origin-note-quality-check

Evaluate an existing Origin DEV vault note against Origin's quality standard. Returns the note's tier and a concrete defect list — does NOT edit the source file.

## Scope

Single-note only. For bulk YAML reordering/normalization across many files, defer to `99-System/Scripts/yaml_orchestrator.js` (via the `origin-yaml` skill). For a batch quality loop over the whole vault, defer to the `vault-quality-pass` skill. This skill inspects and reports on one note at a time.

## Invocation

```
/origin-note-quality-check <vault-relative-path>
```

Example: `/origin-note-quality-check 02-Knowledge/Atomics/Deliberate Practice.md`

If no path is given, ask the user for one before proceeding.

## Vault Root

This is the **Origin DEV counterpart** of the Ideaverse-only global skill `~/.claude/skills/note-quality-check/SKILL.md` — the rules below match Origin DEV's schema (`99-System/`, `📥inbox`, lowercase `fileClass` equal to `type`), not Ideaverse's (`00-Meta/`, `📥queued`, mixed-case `FileClass`). Do not point this skill at the Ideaverse vault.

Resolve dynamically rather than hardcoding, so a future rename/move doesn't silently break this:
```bash
VAULT_ROOT="${ORIGIN_VAULT:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
```

Build the absolute path as: `<VAULT_ROOT>/<vault-relative-path>`

## Execution

### Step 1 — Read the file

Use the Read tool on the absolute path. If the file does not exist, report:
```
❌ File not found: <path>
```
and stop.

### Step 2 — Detect tier

Classify the note as one of three tiers based on what it actually contains:

| Tier | Signal |
|------|--------|
| **Stub** | Missing most YAML fields OR body is 0–2 meaningful lines OR maturity is `📤seed` |
| **Draft** | Has YAML for its type but some fields missing or wrong · body has structure but gaps · maturity `🌱seedling` or `🪴sapling` |
| **Complete** | All required YAML present and valid · body is well-developed · strong connections · maturity `🌲evergreen` or `🍓fruit` |

A Stub is not a defect — a Stub pretending to be Complete is.

### Step 3 — Run defect checks

Check every item in the list below. For each defect found, record it with a specific description (include the current value and what it should be).

#### YAML defects

| Check | Defect condition |
|-------|-----------------|
| `fileClass` case | Value has any uppercase letter |
| `fileClass` match | Value is not equal to the note's `type` value (Origin notes carry both, and they must match) |
| `status` value | Not one of: `📥inbox`, `🔄active`, `⏳waiting`, `✅completed`, `📦archived`, `⏸️paused`, `❌cancelled`, `⚠️blocked` — compare as exact strings, not char-class regex (`⏸️`/`⚠️` are two codepoints, base glyph + U+FE0F variation selector) |
| `maturity` value | Not one of: `📤seed`, `🌱seedling`, `🪴sapling`, `🌲evergreen`, `🍓fruit` |
| `maturity` emoji | Contains `🌿` instead of `🪴` for sapling |
| Legacy field: `deadline:` | Field present — should be `due:` |
| Legacy field: `relatedNotes:` | Field present — should be `related` |
| Legacy field: `prompt_status:` | Field present — collapsed into `status` 2026-06-24; must not exist |
| Legacy field: `read_status: read` | Value should be canonical `completed` (bare, no emoji) |
| Legacy field: `rating_type:` | Field present — should be `rating: <integer>` |
| Empty arrays | `related: []`, `tags: []`, or any `field: []` — omit if empty |
| Missing required fields | Core set (per `origin-yaml` skill — trust that doc over this line if it differs): `up`, `title`, `type`, `status`, `maturity`, `tags`, `created`, `modified` — flag any absent |
| Wikilink quoting | Any wikilink emitted into a YAML scalar (`up:`, `in:`, `related:` entries) not wrapped in quotes — `up: "[[Parent]]"` correct, `up: [[Parent]]` is a defect |
| Path-style wikilink | Any `[[folder/...]]` path-style wikilink in YAML — report-only defect; exception: targets under `99-System/`, `Templates/`, `06-Archive/`, `08-Localization/` are intentional (those folders are index-excluded, so title-only links there don't resolve) |

#### Body defects

| Check | Defect condition |
|-------|-----------------|
| Missing wayfinder | First body line is not a `> [!orbit] Wayfinder \| ...` callout |
| Missing/malformed footer | Last line is not exactly `⬆️ [[🏡Home]]  *\| \`= this.file.mtime\`*` — a missing footer IS a defect here (unlike the Ideaverse skill, where a trailing footer is the defect — do not copy that rule) |
| Footer Dataview form | Footer's inline field is `= date(now)` instead of `= this.file.mtime` |
| Inline nav line | Any `⬆️::` inline line present when both wayfinder and footer are already present (redundant once both nav elements exist) |
| Path-style wikilink | Any `[[folder/...]]` path-style wikilink in the body — same 4-folder exception as above |
| Separator overuse | Three or more `---` separators appear in the body (excluding frontmatter close) |
| Missing body | Body is empty or contains only a heading — flag for tier mismatch if YAML suggests Draft/Complete |

### Step 4 — Output

Print this exact format:

```
Note Quality Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File:  <vault-relative-path>
Type:  <type value from YAML, or "unknown">
Tier:  <Stub | Draft | Complete>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Defects (<N> found):

  [YAML] fileClass: "Atomic" → must be lowercase "atomic" and match type "atomic"
  [YAML] maturity: 🌿sapling → correct emoji is 🪴sapling
  [YAML] legacy field: prompt_status — remove (collapsed into status 2026-06-24)
  [YAML] empty array: related: [] — omit if no links yet
  [BODY] missing footer: last line is not `⬆️ [[🏡Home]]  *| \`= this.file.mtime\`*`
  [BODY] path-style wikilink: [[01-MOCs/Library]] → should be [[Library]]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If no defects found:
```
  ✅ No defects found — note meets quality standard for its tier.
```

### Step 5 — Offer to fix

After the report, ask:

```
Fix all defects automatically? (y / n / list)
  y    — apply all fixes now
  n    — report only, no changes
  list — show me the fixes as a diff first
```

If the user says `y` or `list`: apply or preview fixes using Edit tool calls. Never edit without this confirmation.

If `list`: show each proposed change as a before/after pair, then ask "Apply these fixes? (y/n)" before editing.

## Reference

- Rule owner for YAML schema, field order, wikilink quoting, and legacy renames: `origin-yaml` skill (`AIOS/runtime/skills/origin-yaml/SKILL.md`).
- Locked enums (source of truth, one value per line, read-only): `99-System/CIS/CIS_STATUS.md`, `CIS_MATURITY.md`, `CIS_TYPE.md`, `CIS_SOURCE_TYPE.md`.
- Bulk YAML operations: `yaml_orchestrator.js` (`reorder` / `normalize` / `lint` modes).
- Vault-wide quality loop: `vault-quality-pass` skill.
