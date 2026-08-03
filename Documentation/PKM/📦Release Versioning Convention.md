---
up: "[[🏛️My PKM Governance]]"
title: Release Versioning Convention
type: guide
tags: 
  - ⚙️system
  - 📋documentation
  - 📦templates
status: 🔄active
maturity: 🌱seedling
created: "2026-05-25"
modified: "2026-06-17"
related: 
  - "[[CHANGELOG]]"
  - "[[RELEASE NOTES]]"
  - "[[BACKLOG]]"
  - "[[🏛️My PKM Governance]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🏛️My PKM Governance]] | [[CHANGELOG]] | [[RELEASE NOTES]]

# 📦Release Versioning Convention

Authoritative reference for how versions are assigned in Origin. The historical log up to v1.9.x predates this convention — it was assigned ad-hoc and won't be retroactively normalized. Everything from v2.0 onward follows what's below.

## Mental Model

A version is not a calendar marker. A version exists because future-me will benefit from a stable reference point — a name to point at when asking "what did the vault look like *then*, and what changed since?" Cut a release when a body of work has reached a natural stopping point and a one-sentence headline can describe it. Don't cut on a schedule.

This means versions in Origin are sparse and meaningful, not frequent and noisy. A month with five small fixes is one patch, not five.

## The Three Levels

Origin uses the standard semver triplet `MAJOR.MINOR.PATCH`, but with PKM-flavored definitions:

**MAJOR (`X.0.0`) — paradigm shift.** Something that forces re-learning muscle memory or updating workflows. Folder restructure, schema migration, ontology change, deprecation of a core concept. v1 → v2 was the `02-Dots` → `02-Knowledge` reorganization, the `00-Meta` merge into `99-System`, and the type-system formalization. A hypothetical v3 would be e.g. moving off Obsidian, or a fundamental rethink of PARA. Major releases are rare and disruptive by design — they exist because something old genuinely had to break.

**MINOR (`X.Y.0`) — new capability layer.** A system that didn't exist before, where existing notes and workflows continue to work. AIOS as a stand-alone addition *would* normally be a minor bump. Voice capture *would* normally be a minor bump. The qualifier matters: when something ships during an in-flight major (like v2.0 stabilization), it folds into that major instead of getting its own minor — because it can't exist independently of the architectural foundation around it.

**PATCH (`X.Y.Z`) — polish or fix.** Bug fixes, documentation additions, taxonomy cleanups, file renames that don't break workflows, stabilization work between feature releases. The Tag Consolidation in March 2026 is a patch-shaped change in scope — even though it touched 248 files, it didn't add a new capability or break a workflow.

The rule of thumb: ask "if I had to explain this version to future-me in one sentence, what's the headline?"
- "I reorganized the whole vault" → MAJOR
- "I added AI-driven vault maintenance" → MINOR
- "I cleaned up the tag taxonomy" → PATCH

## Pre-Release Tags

When a major release is in flight but not yet cut, the work-to-date gets a pre-release tag appended:

- `-alpha.N` — early experimentation, breaking changes expected within the major itself
- `-beta.N` — feature-complete for the major's stated goal, stabilizing
- `-rc.N` — release candidate, no new work expected, just verification

For Origin, pre-release tags are optional. The current preferred approach for in-flight majors is a single `## [vX.0.0] – TBD (in flight)` entry in RELEASE NOTES.md with chronological subsections per milestone, rather than serial `-rc.N` tags. This keeps the milestone narrative cohesive and matches how macOS / iOS handle multi-month major-version stabilization (one named release with patches underneath, not five separate minors).

## CHANGELOG vs RELEASE NOTES

Two separate artifacts, two separate purposes:

`CHANGELOG.md` is the **daily worklog**. Every meaningful change goes here as a dated entry (DD/MM/YY), regardless of whether a version has been cut. This is the source of truth for "what happened on what day". It's verbose, it includes commit hashes and file paths, and it's intended for future-me debugging history. Author rules live in the file's own info callout.

`RELEASE NOTES.md` is the **version manifest**. Entries appear only when a version is cut — when I've said "this is done, point future-me here as a stable reference". It's curated, user-facing (where "user" is also future-me), and translates technical changes into capability-level language. One version, one entry. Newest at top.

Pre-release in-flight entries can appear in RELEASE NOTES.md when there's value in marking named submilestones along the journey — but the version itself remains uncut until the major is genuinely finished.

## When to Cut a Release

Three conditions, all required:

1. The body of work has reached a natural stopping point — not "I'm tired" but "this thing is done".
2. A one-sentence headline can describe what changed since the prior version.
3. Future-me would benefit from being able to refer back to *this exact state* as a fixed checkpoint.

If any of those is missing, don't cut yet. Keep adding to CHANGELOG and let the in-flight version accumulate.

## Examples From Origin's Future Workflow

A new dataview-driven dashboard system ships → MINOR (`v2.1.0`), assuming v2.0 has been cut by then. A bug in `yaml_orchestrator.js` that was silently mis-ordering arrays gets fixed → PATCH (`v2.0.1` or `v2.1.1` depending on what's current). The decision to move all calendar notes into a parallel git repository for privacy → MAJOR (`v3.0.0`), because that breaks the assumption that the vault is one tree.

A new template type (e.g. `book-club-entry`) added without breaking existing templates → MINOR. A typo fix in `+About AIℹ️.md` → not a release at all; it's a CHANGELOG entry, not a RELEASE NOTES bump.

## Historical Inconsistencies

The versioning between v0.0.1 and v1.9.1 doesn't follow these rules cleanly. Some early "minor" bumps (v1.7.0, v1.8.0) had huge scope; v1.9.1 had a small one. This convention applies going forward only. Don't rewrite the past; the historical entries are valid as a record of when work landed, even if the numbering wasn't principled.

## Quick Reference Table

| Change scope | Level | Headline test |
|---|---|---|
| Folder restructure, ontology shift, schema break | MAJOR | "I reorganized the whole vault" |
| New script subsystem, new template type, new capability layer | MINOR | "I added X system that didn't exist before" |
| Bug fix, doc addition, taxonomy cleanup, rename without break | PATCH | "I cleaned up / fixed Y" |
| In-flight toward a MAJOR | `-beta.N` / `-rc.N` or chronological subsections under `vX.0.0 – TBD` | "Still finalizing the next big release" |

## See Also

- [[CHANGELOG]] — daily worklog, authoring rules in info callout at top
- [[RELEASE NOTES]] — version manifest, newest-first
- [[BACKLOG]] — what's pending for next cuts
- [[🏛️My PKM Governance]] — broader governance reference

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
