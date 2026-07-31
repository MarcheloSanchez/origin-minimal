---
up: "[[+About AIℹ️]]"
title: "Archived .gitignore — public-surface definition (retired 2026-07-16)"
type: system
tags:
  - 🛠️system
created: 2026-07-16
modified: 2026-07-16
---

> [!done]- Status: ✅ DONE (2026-07-16 · archived reference, no longer active)

# Archived .gitignore — public starter-pack surface

**Retired 2026-07-16.** Until this date, DEV's `.gitignore` doubled as the
"public repo surface" definition — personal notes, calendar, sessions, specs,
and most of `.obsidian` were excluded from git so the repo could someday go
public. That job is now owned by `AIOS/contracts/release-manifest.json`
(tier1/tier2/exclude) + the blocking leak gate in `build-release-package.sh`.

**Decision (2026-07-16):** DEV git = private full-backup of the whole vault.
The repo must NEVER be made public — personal content is in its history. A
future public repo starts fresh from a release package.

Use this archive if a public-git-surface ever needs to be reconstructed
(e.g. publishing the starter pack as a repo instead of a package).

## The retired .gitignore (verbatim)

```gitignore
# === Vault Personal Content — track structure, ignore notes ===
# Rule: /folder/* (not /folder/) so ! exceptions can re-include files inside.
# A /folder/ ignore blocks all exceptions inside it — never use that form here.
# NOTE: structural conventions (+About*ℹ️.md, _*.base, .gitkeep) are re-included
# globally by the "Convention re-includes" block at the END of this file —
# do not add per-file exceptions for them here.

# +Inbox — captures are personal; hub is structural
/+Inbox/*
!/+Inbox/+Inbox.md

# 01-MOCs — all navigation hubs, fully structural — no ignore needed

# 02-Knowledge root
/02-Knowledge/*
!/02-Knowledge/02-Knowledge.md
!/02-Knowledge/Areas/
!/02-Knowledge/Atomics/
!/02-Knowledge/People/
!/02-Knowledge/Places/
!/02-Knowledge/Tools/
!/02-Knowledge/X/

# 02-Knowledge/Areas — hub + 5 flat area notes; subfolders created on demand (e.g. Finance/Subscriptions)
/02-Knowledge/Areas/*
!/02-Knowledge/Areas/Areas.md
!/02-Knowledge/Areas/Health.md
!/02-Knowledge/Areas/Finance.md
!/02-Knowledge/Areas/Career.md
!/02-Knowledge/Areas/Relationships.md
!/02-Knowledge/Areas/Personal.md

# 02-Knowledge/Atomics — hub + surfacing system notes; personal atomics ignored
/02-Knowledge/Atomics/*
!/02-Knowledge/Atomics/Atomics.md
!/02-Knowledge/Atomics/Surfacing - Connection Ritual.md
!/02-Knowledge/Atomics/Surfacing - Connections Map.md
!/02-Knowledge/Atomics/Surfacing - Signal Design.md
!/02-Knowledge/Atomics/Surfacing - Surfacing Metrics.md
!/02-Knowledge/Atomics/practical-examples TBD to be Tutorial material.md
!/02-Knowledge/Atomics/Concepts/
!/02-Knowledge/Atomics/Ideas/
!/02-Knowledge/Atomics/Quotes/
!/02-Knowledge/Atomics/Statements/
!/02-Knowledge/Atomics/Things/
/02-Knowledge/Atomics/Concepts/*
/02-Knowledge/Atomics/Ideas/*
/02-Knowledge/Atomics/Quotes/*
/02-Knowledge/Atomics/Statements/*
/02-Knowledge/Atomics/Things/*

# 02-Knowledge/People, Places, Tools, X — hub only
/02-Knowledge/People/*
!/02-Knowledge/People/People.md
/02-Knowledge/Places/*
!/02-Knowledge/Places/Places.md
/02-Knowledge/Tools/*
!/02-Knowledge/Tools/Tools.md
!/02-Knowledge/Tools/Claude Skills for PKM.md
/02-Knowledge/X/*
!/02-Knowledge/X/X.md

# 03-Efforts — hub; effort notes in subfolders are personal
/03-Efforts/*
!/03-Efforts/03-Efforts.md
!/03-Efforts/Active/
!/03-Efforts/Paused/
!/03-Efforts/Waiting/
/03-Efforts/Active/*
/03-Efforts/Paused/*
/03-Efforts/Waiting/*

# 04-Sources root
/04-Sources/*
!/04-Sources/04-Sources.md
!/04-Sources/Knowledge.md
!/04-Sources/Articles/
!/04-Sources/Books/
!/04-Sources/Courses/
!/04-Sources/Guides/
!/04-Sources/Media/
!/04-Sources/Meetings/
!/04-Sources/Research/

# 04-Sources/Articles, Books, Courses, Research — source notes are personal
/04-Sources/Articles/*
/04-Sources/Books/*
/04-Sources/Courses/*
/04-Sources/Research/*

# 04-Sources/Guides — all system guides, track everything (no ignore inside)

# 04-Sources/Media, Meetings — hub only
/04-Sources/Media/*
!/04-Sources/Media/Media.md
/04-Sources/Meetings/*
!/04-Sources/Meetings/Meetings.md

# 05-Calendar — hub only; all time-based notes are personal
/05-Calendar/*
!/05-Calendar/05-Calendar.md
!/05-Calendar/Daily/
!/05-Calendar/Weekly/
!/05-Calendar/Monthly/
!/05-Calendar/Quarterly/
!/05-Calendar/Yearly/
!/05-Calendar/Sessions/
!/05-Calendar/_Logs/
/05-Calendar/Daily/*
/05-Calendar/Weekly/*
/05-Calendar/Monthly/*
/05-Calendar/Quarterly/*
/05-Calendar/Yearly/*
/05-Calendar/Sessions/*
/05-Calendar/_Logs/*

# 06-Archive — hub only; archived notes are personal
/06-Archive/*
!/06-Archive/06-Archive.md
!/06-Archive/Completed/
!/06-Archive/Dormant/
!/06-Archive/Reference/
/06-Archive/Completed/*
/06-Archive/Dormant/*
/06-Archive/Reference/*

# 07-Prompts — docs + playbooks ship; personal prompt library/inbox/archive stay local
/07-Prompts/Library/*
/07-Prompts/Inbox/*
/07-Prompts/Archive/*
# Playbook _examples are personal (health-routine content) — never ship
/07-Prompts/Playbooks/_examples/

# === Non-Template System Folders ===
/99-System/*
!/99-System/Scripts/
!/99-System/Documentation/
!/99-System/CIS/
# FileClass schemas are layer 1 of the type system — must ship with the template
!/99-System/FileClass/

# Privacy guard config must ship with every vault copy (rest of Config stays ignored)
!/99-System/Config/
/99-System/Config/*
!/99-System/Config/privacy-protected-paths.json

# === Obsidian App Config — selective tracking ===
# Ignore all of .obsidian, then carve out stable configs
.obsidian/*
!.obsidian/community-plugins.json
!.obsidian/app.json
!.obsidian/hotkeys.json
!.obsidian/plugins/
.obsidian/plugins/*
!.obsidian/plugins/quickadd/
.obsidian/plugins/quickadd/*
!.obsidian/plugins/quickadd/data.json
!.obsidian/plugins/templater-obsidian/
.obsidian/plugins/templater-obsidian/*
!.obsidian/plugins/templater-obsidian/data.json
!.obsidian/plugins/obsidian-linter/
.obsidian/plugins/obsidian-linter/*
!.obsidian/plugins/obsidian-linter/data.json
!.obsidian/plugins/auto-note-mover/
.obsidian/plugins/auto-note-mover/*
!.obsidian/plugins/auto-note-mover/data.json
!.obsidian/plugins/homepage/
.obsidian/plugins/homepage/*
!.obsidian/plugins/homepage/data.json

# Backup files — never track
*.bak
*.bak.*
.quarto/
.trash/
.vscode/

# === OS/Editor Files ===
.DS_Store
Thumbs.db
*.tmp
*.swp
*.swo
*~
.env
.env.local

# === Build/Cache ===
node_modules/
__pycache__/
*.pyc
.pytest_cache/
dist/
build/

# === Smart Connections (AI embeddings of private notes — never track) ===
.smart-env/

# === Machine-local Claude Code settings (personal paths/permissions — never ship) ===
settings.local.json
.git-worktree-pointer.old

# === Personal identity & dev planning (not for public starter pack) ===
# Case must match the files on disk exactly — core.ignorecase saves us on
# Windows only; a Linux/Mac clone of the template would leak these otherwise.
/Me.md
/Me - Profile.md
/BACKLOG.md
/TASKS.md
/TODO.md
/CHANGELOG.md
# AIOS planning artifacts + scripts — local-only for now (moved from repo-root docs/ + claude-scripts/).
# To start shipping any of these later, delete the matching line and `git add` it.
/AIOS/docs/plans/
/AIOS/docs/specs/
/AIOS/docs/adr/
/AIOS/docs/gpts/
/AIOS/scripts/
# Vault registry is the personal machine map (spec R7.2) — never ships
/AIOS/contracts/vault-registry.json
# Constitution + its rationale research — personal content, keep local (public repo)
/AIOS/docs/🏛️Constitution.md
/AIOS/docs/claude-os-10-years.md

# === AIOS runtime ===
/AIOS/runtime/scheduled_tasks.lock
# Session notes are personal content — origin is a PUBLIC repo, never track
/AIOS/memory/sessions/
# Privacy guard runtime lock-state — never track (must not ship in a copy)
# Real path; .claude/.privacy-unlock resolves here via the junction.
/AIOS/runtime/.privacy-unlock
# .claude is a junction into AIOS/runtime; git would otherwise double-track it
/.claude/

# AIOS orchestration: proposed output is transient, not tracked
AIOS/orchestration/proposed/*

# Scheduled Task Scheduler cron logs — noise, not artifacts
AIOS/orchestration/reports/cron-*.log

# === Convention re-includes: structural files always ship, any folder ===
# These override every /folder/* ignore above (last matching rule wins).
# Works only where the parent DIRECTORY is traversable — personal subfolders
# excluded as whole dirs stay fully private.
!**/+About*ℹ️.md
!**/_*.base
!**/.gitkeep
```

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
