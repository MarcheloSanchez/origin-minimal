---
up: "[[🏛️My PKM Governance]]"
title: Skills Use Cases — Vault Lifecycle
type: guide
tags: 
  - ⚙️system
  - 📋documentation
status: 🔄active
maturity: 🌱seedling
created: "2026-05-10"
modified: "2026-07-13"
related: 
  - "[[🏛️My PKM Governance]]"
  - "[[🗺️My PKM MOC]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🏛️My PKM Governance]] | [[🗺️My PKM MOC]] | [[🔢My PKM Metadata]]

# Skills Use Cases — Vault Lifecycle

Map Claude Code skills + MCP tools to Origin vault workflows by lifecycle phase.

---

## Tool Inventory (What's Actually Available)

### MCP Servers
- **`origin-minimal`** — vault-native MCP. 14 tools. **Use first for vault tasks.**
  - Read: `read_note`, `search_vault`, `list_inbox`, `recent_activity`
  - Audit: `vault_health`, `vault_status`, `inbox_health`, `frontmatter_audit`, `stale_notes`
  - Write: `create_note`, `update_frontmatter`, `move_note`, `append_section`, `triage_inbox`
- **`context7`** — up-to-date library/API docs
- **`sequential-thinking`** — step-by-step reasoning for design/debug
- **`memory` (knowledge graph)** — entities + relations + observations across conversations
- **`github`** — repo/PR/issue ops
- **`playwright`** — browser automation

### Plugins Active
context7, github, security-guidance, skill-creator, feature-dev, supabase, playground, superpowers, frontend-design, claude-md-management, ui-ux-pro-max

### Process Skills (superpowers)
- **brainstorming** — before new features/architecture
- **debugging** — before bug hunts (scientific method)
- Use **before** sequential-thinking when starting fresh

### Agents
- **Explore** — fast codebase/vault search. Use for orphans, broken links, pattern hunts
- **general-purpose** — fallback for multi-step research
- **feature-dev:code-explorer / code-architect / code-reviewer** — script work

### Auto-Memory (file-based)
- Path: `~/.claude/projects/.../memory/MEMORY.md` + per-topic `.md` files
- Persists across conversations. **Different from MCP knowledge graph.**
- Use for: user prefs, vault rules, recurring patterns, project state

---

## Daily Maintenance & Triage

**Goal**: Process inbox, maintain efforts, capture ideas.

| Task | Primary Tool | Use Case |
|------|--------------|----------|
| Check inbox state | `origin-minimal: list_inbox` + `inbox_health` | Snapshot count, types, age before processing |
| Bulk inbox triage | `origin-minimal: triage_inbox` | Auto-classify + suggest target folder |
| Move processed note | `origin-minimal: move_note` + `update_frontmatter` | Single-note progression: inbox → typed folder |
| Capture pattern research | context7 | Look up PARA refinements, capture templates |
| Tag drift detection | `origin-minimal: frontmatter_audit` | Find non-canonical tag forms |
| Status progression | QuickAdd Capture entries (`➡️Status Progression NEXT` / `⬅️Status Progression PREV`) in vault | In-vault QuickAdd macro |

**Skill triggers**:
- Inbox > 20 items → `triage_inbox` MCP, not manual
- Tag drift suspected → `frontmatter_audit` MCP, not Bash sed
- New capture pattern needed → context7 first

---

## Weekly & Monthly Reviews

**Goal**: Synthesize progress, promote mature notes, archive done work.

| Task | Primary Tool | Use Case |
|------|--------------|----------|
| Weekly report gen | Templater (`generate-weekly-report.js`) in vault | Run inside Obsidian, not Claude |
| Note maturity assessment | sequential-thinking | Walk through criteria: seed → seedling → sapling → evergreen → fruit |
| Area health review | `origin-minimal: vault_health` + Dataview in vault | Surface neglected areas |
| Effort blocker tracking | auto-memory file | Save recurring blocker patterns to `memory/effort_blockers.md` |
| Stale note discovery | `origin-minimal: stale_notes` | Find notes untouched >N days |
| Orphan + broken-link audit | Explore agent | Spawn for unlinked references, dead wiki-links |
| Recent activity scan | `origin-minimal: recent_activity` | Last-N-days changes for review prep |

**Skill triggers**:
- Weekly synthesis incomplete → sequential-thinking for aggregation logic
- Blockers repeating → auto-memory entry
- Orphans suspected → Explore agent (faster than general-purpose)

---

## Quarterly Reorg & Schema Evolution

**Goal**: Audit structure, refactor schema, clean taxonomy.

| Task | Primary Tool | Use Case |
|------|--------------|----------|
| YAML schema audit | `origin-minimal: frontmatter_audit` | Surface field inconsistencies (`deadline` vs `due`) |
| Tag consolidation | auto-memory + `frontmatter_audit` | Document rules in `memory/tag_rules.md`; audit MCP finds violations |
| CIS enum validation | sequential-thinking + `search_vault` | Design validator: parse YAML, report non-canonical values |
| Type system drift check | `vault_health` + auto-memory | Lightweight type usage stats; rules in memory |
| Orphan + folder audit | Explore agent | Floating notes, misplaced folders, dead links |
| Dataview query refresh | sequential-thinking | Walk all `dataview` blocks; identify deprecated syntax |
| Template consolidation | feature-dev:code-explorer agent | Map duplicate templates, design dedup plan |

**Skill triggers**:
- Quarterly audit start → sequential-thinking to design phases
- Bulk YAML fix needed → `update_frontmatter` MCP per-note OR Bash for regex sweep
- Schema rules unclear → write to auto-memory file with canonical forms

---

## Major Architectural Changes

**Goal**: Redesign folders, add new types, migrate content.

| Task | Primary Tool | Use Case |
|------|--------------|----------|
| New type design | superpowers brainstorming → sequential-thinking | Brainstorm first, then design schema + FileClass + templates |
| Folder reorg plan | sequential-thinking + Explore agent | Design migration; agent maps affected wiki-links |
| Automation expansion | context7 + sequential-thinking | Research patterns, then design implementation |
| Metrics system redesign | sequential-thinking + auto-memory | Design hybrid cache/live; save trade-offs to memory |
| Plugin upgrade risk | auto-memory + context7 | Doc compat assumptions; check current plugin docs |
| Bulk content migration | sequential-thinking + `origin-minimal` MCP batch | Design phases; use `move_note` + `update_frontmatter` per note |
| CLAUDE.md updates after change | claude-md-management plugin | Use plugin for safe edits |

**Skill triggers**:
- Any structural change → brainstorming → sequential-thinking → Explore for affected files
- Want new vault skill itself → skill-creator plugin
- Migration > 50 notes → script it, don't loop manually

---

## Continuous Improvement & Tooling

**Goal**: Optimize scripts, add automation, fix bugs.

| Task | Primary Tool | Use Case |
|------|--------------|----------|
| Script bug hunt | superpowers debugging → sequential-thinking | Scientific method first, then trace |
| Performance optimization | sequential-thinking | Profile slowest queries; design phased fixes |
| New automation design | context7 + sequential-thinking | Research patterns, design heuristics |
| Script refactor | feature-dev:code-architect agent | Extract shared utils, separate UI from logic |
| Doc gaps in template system | auto-memory file | Save gotchas (combine() races, reset funcs) |
| Error handling improvements | feature-dev:code-reviewer agent | Review error paths, suggest fallbacks |
| Build new skill | skill-creator plugin | Wraps creation correctly |

**Skill triggers**:
- Bug report → debugging skill first, ALWAYS
- Recurring questions → auto-memory
- New feature → brainstorming first, then design

---

## Decision Framework

### Use **`origin-minimal` MCP tools** when:
- Any read/write/audit on vault notes
- **First choice** before Bash, agent, or manual file ops
- Specific tool exists for task (audit, triage, search, move)

### Use **context7** when:
- Researching libraries, plugins, APIs
- Need up-to-date docs (training data stale)
- Validating against industry patterns

### Use **sequential-thinking** when:
- Designing workflows, schemas, automation
- Complex bug trace
- Multi-phase planning
- **NOT for**: simple lookups, single-file edits

### Use **superpowers brainstorming** when:
- New feature
- Architecture decision
- **Before** any sequential-thinking design work

### Use **superpowers debugging** when:
- Bug report
- Unexpected script output
- **Before** any fix attempt

### Use **MCP memory (knowledge graph)** when:
- Need entity relations across conversations
- Tracking who/what links to what
- Building structured knowledge of vault domain

### Use **auto-memory (file-based)** when:
- User preferences, vault rules, gotchas
- Project state across sessions
- Recurring patterns worth remembering
- **Default choice** for "remember this"

### Use **Explore agent** when:
- Vault-wide search (orphans, broken links, patterns)
- Faster than general-purpose for known-scope hunts
- Bulk file discovery

### Use **general-purpose agent** when:
- Multi-step research with unknown scope
- Explore agent insufficient

### Use **feature-dev agents** when:
- Script architecture (code-architect)
- Code exploration (code-explorer)
- Code review (code-reviewer)

### Use **skill-creator plugin** when:
- Building new reusable skill
- Don't write skill files manually

### Use **claude-md-management plugin** when:
- Editing CLAUDE.md files safely

### Use **Bash** when:
- MCP doesn't have the tool
- Batch sed/regex on many files
- Pre-flight YAML validation

---

## Lifecycle Roadmap

```
Daily      → list_inbox, triage_inbox, status progression (in vault)
   ↓
Weekly     → generate-weekly-report (vault), stale_notes, vault_health
   ↓
Monthly    → recurring blockers (auto-memory), tag audit (frontmatter_audit)
   ↓
Quarterly  → schema audit (frontmatter_audit + sequential-thinking), Explore agent
   ↓
Yearly     → major redesigns (brainstorming → sequential-thinking), skill-creator
```

---

## Quick Trigger Checklist

Before any vault task:

- [ ] Vault read/write/audit? → **`origin-minimal` MCP first**
- [ ] New feature/architecture? → **brainstorming** first
- [ ] Bug? → **debugging** first
- [ ] Researching library/API? → **context7**
- [ ] Designing workflow? → **sequential-thinking**
- [ ] Save user pref or rule? → **auto-memory file**
- [ ] Find pattern across vault? → **Explore agent**
- [ ] Script work? → **feature-dev agent**
- [ ] Build new skill? → **skill-creator plugin**
- [ ] Edit CLAUDE.md? → **claude-md-management plugin**
- [ ] Touches 3+ files? → invoke skill before proceeding

**Golden rule**: `origin-minimal` MCP > Bash > agent. Use most specific tool first.

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*