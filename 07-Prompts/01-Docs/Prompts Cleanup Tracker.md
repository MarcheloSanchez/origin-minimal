---
up: "[[07-Prompts]]"
title: Prompts Cleanup Tracker
type: guide
tags: []
status: 🔄active
created: 2026-06-24
modified: 2026-07-12
related: []
---

> [!orbit] Wayfinder | [[07-Prompts]]

# Prompts Cleanup Tracker

Rebuild summary: `prompt_status` collapsed into standard vault `status` field (2026-06-24). 10 seed notes created, `_Prompt_Data.base` rewritten, `+About Promptsℹ️.md` and `prompt-meta.yaml.md` updated. This doc tracks what still needs updating.

---

## Remaining updates

### Active system files — high friction if wrong
| File | What to fix | Done? |
|------|-------------|-------|
| `99-System/FileClass/prompt.md` | Remove `prompt_status` field from FileClass schema | ☑ |
| `99-System/Prompts/Inbox/Prompt -.md` | Delete — empty stub with stale `prompt_status` | ☑ (file no longer exists) |
| `Templates/Create/new-quick-prompt.md` | Remove `prompt_status` line | ☑ |
| `Templates/Static/quick-prompt.md` | Remove `prompt_status` line | ☑ |
| `99-System/Scripts/normalize_prompts.js` | Remove/replace any `prompt_status` normalization logic | ☑ (script deleted 2026-07-09) |
| `99-System/Scripts/yaml_orchestrator.js` | Remove `prompt_status` from known-fields list | ☑ (field-order entry 2026-07-18; live normalizer block 2026-07-24) |
| `AIOS/runtime/skills/origin-yaml/SKILL.md` | Remove `prompt_status` from prompt schema docs | ☑ (2026-07-24) |
| `AIOS/runtime/skills/origin-routing/SKILL.md` | Update any prompt routing logic referencing `prompt_status` | ☑ (2026-07-24) |
| `AIOS/rules/ai-rules.md` | Update prompt schema description | ☑ |

All 9 rows verified by `grep -ci prompt_status` = 0 (or file absent) on 2026-07-24. Also cleaned that day: `Templates/Static/prompt.md` (`status: draft` → `status: 📥inbox`) — a stale `prompt_status` *value* squatting in the canonical field, which this tracker never listed.

### Docs — worth updating but not urgent
| File                                                                               | What to fix                                         | Done? |
| ---------------------------------------------------------------------------------- | --------------------------------------------------- | ----- |
| `99-System/Documentation/PKM/🔁My PKM Workflows.md`                                | Replace old `rating` field references with `status` | ☑ (0 `rating` refs; prompt lifecycle table rewritten to canonical `status` 2026-07-24) |
| `99-System/Documentation/Tutorial/Tutorial - Prompt - Synthesize Reading Notes.md` | Update workflow steps to new status system          | ☐ (no stale tokens found by grep, but prose not reviewed — leave open) |
| `01-MOCs/MOC - Prompts.md`                                                         | Check for old rating/prompt_status references       | ☑ (checked 2026-07-24 — 0 of each) |
|                                                                                    |                                                     |       |
|                                                                                    |                                                     |       |

### Skip (historical — leave as-is)
- `99-System/Documentation/2026-05-30 — Prompts Library Cleanup Log.md`
- `99-System/Documentation/vault-lint-2026-05-29.md`
- `99-System/Documentation/vault-lint-2026-06-15.md`
- `05-Calendar/Sessions/2026-04-12-origin-efficiency-sprint.md`
- `AIOS/docs/plans/2026-05-26-tutorial-polish-plan.md`

---

## Status mapping reference

| Old `prompt_status` | New `status` |
|---------------------|--------------|
| `draft` | `📥inbox` |
| `active` | `🔄active` |
| `winner` | `✅completed` |
| `archived` | `📦archived` |
