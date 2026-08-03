---
up: "[[🏷️My PKM Tags]]"
title: Tag Consolidation Log
type: system
tags: 
  - 🏷️tags
  - 📋documentation
status: 🔄active
maturity: 🌱seedling
created: "2026-03-31"
modified: "2026-06-17"
related: 
  - "[[🏷️My PKM Tags]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🏷️My PKM Tags]] | [[🏛️My PKM Governance]]

# Tag Consolidation Log

Permanent record of tag cleanup operations in this vault. Refer to [[🏷️My PKM Tags]] for the canonical tag taxonomy.

---

## 2026-03-31 — Initial Consolidation

**Scope**: Full vault (1041 .md files scanned)
**Result**: 195 unique tags reduced to 143 (52 eliminated)
**Files changed**: 248
**Tags renamed**: 253 instances
**Tags deleted**: 68 instances

### Principles Applied

1. **Emoji-first is mandatory** — every tag must start with an emoji prefix matching its category
2. **One canonical form per concept** — no duplicates in different cases, emoji, or phrasing
3. **Orphan domain tags removed** — single-use topic tags that add noise without navigational value
4. **Templates must match documentation** — auto-tags in templates align with the canonical taxonomy

### Rename Rules (41 transformations)

| From (old) | To (canonical) | Reason |
|---|---|---|
| `ai` | `🤖AI` | Missing emoji, wrong case |
| `🤖ai` | `🤖AI` | Wrong case |
| `🤖prompt` | `🤖AI/prompt` | Use hierarchical form |
| `documentation` | `📋documentation` | Missing emoji |
| `📖documentation` | `📋documentation` | Wrong emoji |
| `📁documentation` | `📋documentation` | Wrong emoji |
| `metrics` | `📊metrics` | Missing emoji |
| `📈metrics` | `📊metrics` | Wrong emoji |
| `📈analytics` | `📊metrics` | Merge into metrics |
| `📊reports` | `📊report` | Singular form |
| `moc` | `🗺️MOC` | Missing emoji, wrong case |
| `daily` | `📅daily` | Missing emoji |
| `workflow` | `🔄workflow` | Missing emoji |
| `research` | `🔬research` | Missing emoji |
| `learning` | `🎓learning` | Missing emoji |
| `navigation` | `🧭navigation` | Missing emoji |
| `index` | `🧭navigation` | Merge into navigation |
| `dashboard` | `📊dashboard` | Missing emoji |
| `cheatsheet` | `💯cheatsheet` | Missing emoji |
| `quick-reference` | `💯cheatsheet` | Merge into cheatsheet |
| `note/👀cheatsheet` | `💯cheatsheet` | Non-standard prefix |
| `people` | `👤person` | Missing emoji, use singular |
| `colleague` | `👤person` | Merge into person |
| `👥people` | `👤person` | Use singular canonical form |
| `tools` | `🛠️tool` | Missing emoji, use singular |
| `software` | `🛠️tool` | Merge into tool |
| `templates` | `📦templates` | Missing emoji |
| `meta` | `📊metadata` | Missing emoji, too vague |
| `metadata` | `📊metadata` | Missing emoji |
| `maintenance` | `🔧maintenance` | Missing emoji |
| `automation` | `📋automation` | Missing emoji |
| `productivity` | `⚡productivity` | Missing emoji |
| `meetings` | `🤝meeting` | Missing emoji, use singular |
| `🏠system` | `⚙️system` | Wrong emoji (🏠 = area) |
| `📍place` | `🗺️place` | Wrong emoji |
| `quick` | `🧹tidy` | Merged — both mean "needs cleanup" |
| `🎯project` | `🚀effort` | Canonical is effort, not project |
| `💡idea` | `💡atomic` | Atomic is the content type; subfolder = idea |
| `🔍review` | `📋review` | Standardize review emoji |
| `🔄review` | `📋review` | Standardize review emoji |

### Deleted Orphan Tags (48 tags removed)

These single-use domain/topic tags were stripped entirely. Domain context belongs in note content and links, not tags.

`jazz`, `music`, `classic`, `vinyl`, `movies`, `sci-fi`, `philosophy`, `action`, `books`, `articles`, `papers`, `cognitive-science`, `team`, `standup`, `engineering`, `web-development`, `design`, `videos`, `youtube`, `courses`, `online-learning`, `education`, `machine-learning`, `information-processing`, `concepts`, `ideas`, `innovation`, `journal`, `tasks`, `analysis`, `high-priority`, `active`, `stats`, `cache`, `tracker`, `classification`, `meta-skill`, `playbook`, `quickstart`, `content`, `newsletter`, `pkmsystem`, `note/📝concept`, `📝concept`, `achievements`, `audit`, `reference`, `note-taking`, `identity`, `governance`, `architecture`, `public`, `ritual`, `connections`, `title`, `source/book`, `💡dot`

### Common Patterns (Reference)

**When creating a new tag**, follow these rules:

1. Start with an emoji that matches the tag's category (content type, workflow, etc.)
2. Check [[🏷️My PKM Tags]] first — if a canonical tag exists, use it
3. Singular form preferred (`🛠️tool` not `tools`)
4. Hierarchical tags use `/` separator (`🤖AI/prompt`, `domain/systems`)
5. Don't create one-off topic tags — use links and note content for domain specificity
6. If a tag won't be used on 3+ notes, it probably shouldn't exist

**Template auto-tags** (set automatically on note creation):
- Atomic notes: `💡atomic`
- Efforts: `🚀effort`
- Sources: `📚source`
- MOCs: `🗺️MOC`
- Meetings: `🤝meeting`
- People: `👤person`
- Places: `🗺️place`

### Script

Consolidation performed by `~/.local/bin/origin_tag_consolidate.py` (supports `--dry-run` and `--apply`).

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
