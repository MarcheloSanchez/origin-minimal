---
name: config-consistency-check
description: Read-only audit of Origin's AI System wiring — junction integrity, settings.json structure, agent frontmatter, agent↔lessons.md wiring, command↔agent cross-references, hook path resolution, skill references in agents, CLAUDE.md-vs-disk drift, and plan/spec frontmatter `status:` field validity. Use when the user says "config consistency check", "audit AI system wiring", "check config drift", or "/config-consistency-check".
user_invocable: true
---

# config-consistency-check

Audits Origin's AI System configuration for wiring gaps — the kind found by hand during the 2026-07-19 `/security-scan` follow-up (missing deny list, agents missing model pins, agents missing lessons.md wiring). Read-only — never modifies files.

## Scan Targets

- `.claude/settings.json`, `.claude/settings.local.json`
- `AIOS/runtime/agents/*.md`
- `AIOS/runtime/commands/*.md`
- `AIOS/runtime/skills/*/SKILL.md`
- `CLAUDE.md` (AI System section)
- `AIOS/docs/Command Reference.md`, `AIOS/docs/Agent Reference.md`
- `AIOS/docs/plans/*.md`, `AIOS/docs/specs/*.md`

## Steps

**1. Gather scan targets:**

```bash
ls .claude/settings.json .claude/settings.local.json 2>&1
find AIOS/runtime/agents -name "*.md" 2>/dev/null
find AIOS/runtime/commands -name "*.md" 2>/dev/null
find AIOS/runtime/skills -maxdepth 1 -type d 2>/dev/null
find AIOS/docs/plans -maxdepth 1 -name "*.md" 2>/dev/null
find AIOS/docs/specs -maxdepth 1 -name "*.md" 2>/dev/null
```

**2. Run checks on each target:**

### Check 1: Junction Integrity (INFO)

The `.claude` → `AIOS/runtime` junction is per-machine and not git-tracked — it may legitimately not exist on a fresh clone or a different machine. Missing junction is expected, not a defect.

```bash
if [ -e ".claude" ]; then
  # .claude may resolve as a Windows junction (plain directory) or, via Git Bash/MSYS,
  # as a symlink (-L true) — either form is valid, so test content resolution, not link type.
  diff <(ls AIOS/runtime/skills 2>/dev/null) <(ls .claude/skills 2>/dev/null) > /dev/null 2>&1 && echo "JUNCTION_OK" || echo "JUNCTION_MISMATCH_OR_MISSING"
else
  echo "JUNCTION_ABSENT"
fi
```

- `JUNCTION_ABSENT` → **INFO**: ".claude junction not present on this machine (expected — per-machine, not git-tracked)"
- `JUNCTION_MISMATCH_OR_MISSING` → **INFO**: ".claude/skills does not mirror AIOS/runtime/skills — junction may be stale or misconfigured" (still INFO per locked severity, not WARNING/CRITICAL — the junction's absence-or-drift is always non-fatal per this vault's documented convention)
- `JUNCTION_OK` → no finding

### Check 2: settings.json / settings.local.json Structure (CRITICAL)

```bash
cat .claude/settings.json 2>/dev/null
cat .claude/settings.local.json 2>/dev/null
```

Read both files (or their absence) and check:

1. **Deny list present** — `.claude/settings.local.json` must have a non-empty `permissions.deny` array. If the file exists but `permissions.deny` is missing or empty → **CRITICAL**: "settings.local.json has no deny list — destructive commands (rm -rf, force-push, reset --hard) are not blocked".
2. **Allow/deny contradiction** — for every string in `permissions.allow`, check it does not also appear verbatim in `permissions.deny` (and vice versa). A pattern in both lists is a contradiction → **CRITICAL**: "permissions.allow and permissions.deny both contain the pattern `<pattern>` — contradictory rule, deny should win but the duplication signals a config mistake".
3. If `.claude/settings.json` is missing entirely → **CRITICAL**: "settings.json not found — hooks (privacy-guard, hot-cache) will not run".

### Check 3: Agent Frontmatter Completeness (WARNING)

```bash
find AIOS/runtime/agents -name "*.md" 2>/dev/null
```

For each agent file:

1. Read the frontmatter block (between the two `---` lines). Confirm `name`, `description`, `tools`, `model` are all present and non-empty. Any missing → **WARNING**: "`<agent>.md` frontmatter missing `<field>`".
2. Extract the `tools:` value (comma-separated list, e.g. `Read, Grep, Glob, Bash`).
3. Read the agent body. Scan prose for tool-use language ("run Bash", "use Grep to", "call Edit", "use Write to") and note which tool names are mentioned as actions the agent takes.
4. If the body describes using a tool not present in the frontmatter `tools:` list → **WARNING**: "`<agent>.md` body describes using `<Tool>` but frontmatter tools list is `<list>` — agent cannot actually invoke it".

### Check 4: Agent↔lessons.md Wiring (WARNING)

Live scan — do not hardcode an agent list; any agent found in `AIOS/runtime/agents/` is checked, so a new agent added later is covered automatically without updating this skill.

```bash
find AIOS/runtime/agents -name "*.md" 2>/dev/null
grep -c "AIOS/memory/lessons.md" AIOS/runtime/agents/*.md 2>/dev/null
```

For each agent file, confirm it contains **both**:
1. A **read step** — text instructing the agent to read `AIOS/memory/lessons.md` at the start of its run.
2. A **write step** — text instructing the agent to append to `AIOS/memory/lessons.md` under some condition (e.g. false positive found, correction from user).

If either is missing → **WARNING**: "`<agent>.md` missing lessons.md `<read|write>` step — agent won't learn from past runs / won't record new lessons".

### Check 5: Command↔Agent Cross-References (WARNING)

```bash
find AIOS/runtime/commands -name "*.md" 2>/dev/null
find AIOS/runtime/agents -name "*.md" -exec basename {} .md \; 2>/dev/null
```

For each command file, scan its body for agent names referenced (e.g. "spawn the `vault-inspector` agent", "invoke `note-fixer`" — look for agent-name-shaped strings that match the `find`-derived agent basenames, or are clearly invoked as an agent per surrounding text). For each referenced agent name, confirm a file with that basename exists in `AIOS/runtime/agents/`.

If a command references an agent name with no matching file → **WARNING**: "`<command>.md` references agent `<name>` — no `AIOS/runtime/agents/<name>.md` found (could be a doc typo, not necessarily runtime-breaking)".

### Check 6: Hook Path Resolution (CRITICAL)

```bash
cat .claude/settings.json 2>/dev/null
```

Extract every `"command"` value under `hooks.*[].hooks[]` in `.claude/settings.json`. Each command string embeds a script path, typically `node "$CLAUDE_PROJECT_DIR/.claude/hooks/<script>.js"` — extract the `.claude/hooks/<script>.js` portion and resolve `$CLAUDE_PROJECT_DIR` to the repo root.

```bash
# For each extracted path, e.g. .claude/hooks/privacy-guard.js:
ls ".claude/hooks/privacy-guard.js" 2>&1
```

If the resolved path does not exist on disk → **CRITICAL**: "settings.json hook references `<path>` — file not found, hook silently no-ops or errors at runtime".

### Check 7: Skill References Inside Agents (WARNING)

```bash
grep -n "Skills to load\|## Skills" AIOS/runtime/agents/*.md 2>/dev/null
find AIOS/runtime/skills -maxdepth 1 -type d 2>/dev/null
find ~/.claude/skills -maxdepth 1 -type d 2>/dev/null
```

For each agent file, find its "Skills to load" (or equivalent) list. For each skill name listed, confirm a matching directory exists in `AIOS/runtime/skills/` **or** `~/.claude/skills/`.

If a listed skill has no matching directory in either location → **WARNING**: "`<agent>.md` lists skill `<name>` under Skills to load — no matching directory in AIOS/runtime/skills/ or ~/.claude/skills/".

### Check 8: CLAUDE.md AI System Table vs. Disk (WARNING, both directions)

```bash
grep -n "Commands\|Skills\|Agents" CLAUDE.md | head -10
find AIOS/runtime/commands -name "*.md" -exec basename {} .md \; 2>/dev/null
find AIOS/runtime/agents -name "*.md" -exec basename {} .md \; 2>/dev/null
find AIOS/runtime/skills -maxdepth 1 -type d -exec basename {} \; 2>/dev/null
cat "AIOS/docs/Command Reference.md" 2>/dev/null
cat "AIOS/docs/Agent Reference.md" 2>/dev/null
```

CLAUDE.md's AI System section lists only its "most-used" subset and defers the full index to `AIOS/docs/Command Reference.md` / `AIOS/docs/Agent Reference.md` — so cross-check against the **full reference docs**, not CLAUDE.md's short list, for completeness; cross-check CLAUDE.md's short list only for internal consistency (i.e. every name it does list must exist on disk).

Two drift directions, same severity:
1. **File exists but undocumented**: a file in `AIOS/runtime/{commands,agents,skills}` has no corresponding entry in `AIOS/docs/Command Reference.md` / `AIOS/docs/Agent Reference.md` → **WARNING**: "`<file>` exists on disk — not listed in `<reference doc>`".
2. **Documented but missing**: a reference doc (or CLAUDE.md's own short list) names a command/agent/skill with no matching file on disk → **WARNING**: "`<reference doc or CLAUDE.md>` lists `<name>` — no matching file in `AIOS/runtime/<type>/`".

### Check 10: AIOS Reference Doc Review Cadence (WARNING)

```bash
grep -l "^review_frequency:" AIOS/docs/*.md 2>/dev/null
```

Scope: top-level `AIOS/docs/*.md` reference docs only (Command Reference, Agent Reference, Hook Reference, Flow and Ownership, Consistency and Audit Reference, +About AI, etc.) — these are "living" docs expected to stay accurate indefinitely. **Not in scope**: `AIOS/docs/plans/` and `AIOS/docs/specs/` — point-in-time artifacts with their own DRAFT→DONE status badge instead of a review cadence.

For each file with `review_frequency` set, read its `last_review` and `review_frequency` values:

1. **Never reviewed**: `review_frequency` is set but `last_review` is empty → **WARNING**: "`<doc>` has review_frequency set but was never reviewed (last_review empty)".
2. **Overdue**: both set — compute days elapsed since `last_review` against today's date, compare to the threshold for `review_frequency` (`weekly` → 7 days, `monthly` → 30 days, `quarterly` → 90 days). If elapsed exceeds the threshold → **WARNING**: "`<doc>` is overdue for review — last reviewed `<last_review>`, frequency `<review_frequency>`, `<N>` days overdue".
3. Within cadence → no finding.

### Check 11: Plan/Spec Frontmatter `status:` Field (WARNING)

Per `AIOS/docs/plans/2026-07-25-plan-spec-frontmatter-and-lifecycle-design.md` — every `AIOS/docs/plans/` and `AIOS/docs/specs/` file requires a `status:` field using the vault's canonical enum (`99-System/CIS/CIS_STATUS.md`: `📥inbox`, `🔄active`, `✅completed`, `📦archived`). Applies to files created since 2026-07-25; older files without the field are still reported (not exempted) — the design doc deferred a retroactive migration, not the visibility of the gap.

```bash
find AIOS/docs/plans -maxdepth 1 -name "*.md" 2>/dev/null
find AIOS/docs/specs -maxdepth 1 -name "*.md" 2>/dev/null
```

For each file, read the YAML frontmatter block (between the two `---` lines at the top — if there is no opening `---` on line 1, treat as no frontmatter at all):

1. **No frontmatter block** → **WARNING**: "`<file>` has no YAML frontmatter — missing `status:` (and everything else)".
2. **Frontmatter present, `status:` key absent** → **WARNING**: "`<file>` frontmatter missing `status:` field".
3. **`status:` present but its value is not one of `📥inbox`/`🔄active`/`✅completed`/`📦archived`** → **WARNING**: "`<file>` has `status: <value>` — not a valid CIS_STATUS enum value".
4. Valid value present → no finding.

Do not flag files under `AIOS/docs/plans/blueprints/` differently — same rule, same folder tree (`find -maxdepth 1` already excludes it; if scanning recursively instead, apply the same check).

## Output Format

```
Config Consistency Report
====================================

Targets scanned:
  - .claude/settings.json (found/not found)
  - .claude/settings.local.json (found/not found)
  - AIOS/runtime/agents/ (N files)
  - AIOS/runtime/commands/ (N files)
  - AIOS/runtime/skills/ (N dirs)
  - CLAUDE.md, AIOS/docs/Command Reference.md, AIOS/docs/Agent Reference.md
  - AIOS/docs/plans/ (N files), AIOS/docs/specs/ (N files)

CRITICAL
  1. [Check 2] .claude/settings.local.json — permissions.deny is empty or missing
  ...

WARNING
  1. [Check 3] AIOS/runtime/agents/note-fixer.md — frontmatter missing `model`
  2. [Check 4] AIOS/runtime/agents/link-recommender.md — missing lessons.md write step
  3. [Check 11] AIOS/docs/plans/2026-07-24-fileclass-tag-classification-cleanup-plan.md — frontmatter missing `status:` field
  ...

INFO
  1. [Check 1] .claude junction not present on this machine (expected — per-machine, not git-tracked)
  ...

====================================
N critical / N warning / N info issues found
```

## Edge Cases

- If `AIOS/runtime/agents/`, `AIOS/runtime/commands/`, or `AIOS/runtime/skills/` doesn't exist or is empty, report that target as "0 files — skipped" rather than failing the whole scan.
- Windows path separators (`\` vs `/`) — normalize before comparing paths across checks.
- This skill never writes, moves, or deletes any file — if a fix seems obvious while scanning, still only report it; fixing is a separate, human-approved step (matches `fix-note`/`fix-batch` convention elsewhere in this vault).
- If `.claude/settings.local.json` doesn't exist at all, Check 2's "deny list present" rule still applies — no file means no deny list, report **CRITICAL**.
