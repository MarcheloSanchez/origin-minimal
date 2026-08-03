---
up: "[[AIOS]]"
title: MINIMAL to DEV Transfer Log
type: guide
tags:
  - 📚guide
  - 🤖AI
status: 🔄active
created: 2026-08-03
modified: 2026-08-03
---

> [!done]- Status: 🔵 IN PROGRESS — living log, appended per change made in the MINIMAL vault

# MINIMAL → DEV Transfer Log

Purpose: MINIMAL is a stripped derivation of Origin. Every finding and every change made
here is recorded below with a **Transfer?** recommendation, so the vault owner can decide
what travels back to DEV instead of reverse-engineering a diff later.

Two kinds of rows:

- **Finding** — something observed in MINIMAL that is (or is not) also true in DEV. No file changed.
- **Change** — an edit actually made in MINIMAL. Lists the touched paths.

`Scope` values: `MINIMAL-only` (an artifact of the stripping) · `Shared` (the same defect
almost certainly exists in DEV) · `Unverified` (needs a DEV check before deciding).

## Summary table

| # | Kind | Subject | Scope | Transfer to DEV? |
|---|---|---|---|---|
| 1 | Finding | Docs describe folders that MINIMAL does not contain (`99-System/`, `Templates/`, `+Inbox/`, `.obsidian/`) | MINIMAL-only | **No** — fix in MINIMAL only |
| 2 | Finding | `hot-cache.test.js` writes `AIOS/context/hot.md`, hook reads `AIOS/memory/hot.md` | Shared | **Yes** — real stale test |
| 3 | Finding | `privacy-core.test.js` "fallback list matches shipped JSON" fails: no `99-System/Config/privacy-protected-paths.json` | MINIMAL-only (symptom), Shared (design) | **Partly** — see detail |
| 4 | Finding | No `.gitignore`; `AIOS/scripts/__pycache__/*.pyc` is committed | Unverified | **Yes** if DEV also tracks it |
| 5 | Finding | No CI and no documented test command, although 25 pytest + 29 node tests exist | Shared | **Yes** — decide where CI belongs |

## 1 — Docs reference folders MINIMAL does not have

`README.md`, `CLAUDE.md` and `AGENTS.md` are inherited unchanged from Origin, so they
describe `99-System/`, `Templates/`, `+Inbox/`, `08-Localization/` and `.obsidian/`.
None exist in MINIMAL; templates sit flat in `Meta/`, `Body/`, `Core/` instead of under
`Templates/`. 61 markdown files mention `99-System`, 53 mention `Templates/`.

Consequence: an agent following `AGENTS.md` → *Who owns which fact* resolves most owner
paths to nothing, and `CLAUDE.md` Critical Issues #15 / #21 / the Schema Change Protocol
describe layers that are absent here.

Recommended fix (MINIMAL): reconcile the three root docs to the actual layout, and state
explicitly at the top of `README.md` which Origin layers MINIMAL intentionally omits.

**Transfer: No.** DEV has those folders; this is stripping drift, not an Origin defect.
The one thing worth carrying back is the *idea* of a "what MINIMAL omits" section, so the
derivation is documented on both ends.

## 2 — `hot-cache` test/hook path drift

- Hook: `AIOS/runtime/hooks/hot-cache.js` reads `AIOS/memory/hot.md`.
- Test: `AIOS/runtime/hooks/tests/hot-cache.test.js` `makeVault()` writes `AIOS/context/hot.md`.

Result: the "injects hot.md" test fails (`Unexpected end of JSON input`, the hook correctly
no-ops), and its two sibling no-op tests pass **vacuously** — they would pass even if the
hook were broken, because the fixture never places a cache file where the hook looks.
`AIOS/docs/Hook Reference.md` already documents the `memory/` path, so the rename was
propagated to docs and hook but not to the test.

Recommended fix: change the fixture path to `AIOS/memory/hot.md`.

**Transfer: Yes.** A `context/` → `memory/` rename that missed the test layer is almost
certainly present in DEV too, and it is silently weakening three tests there.

## 3 — `privacy-core` config-parity test has no config to read

`AIOS/runtime/hooks/tests/privacy-core.test.js` asserts that `BUILTIN_PROTECTED` in
`AIOS/runtime/hooks/lib/privacy-core.js` matches `99-System/Config/privacy-protected-paths.json`
exactly (the parity rule stated in `CLAUDE.md` → *Privacy Guard*). MINIMAL ships neither
`99-System/` nor that JSON, so the test fails with `ENOENT` and the parity guarantee is
unverified here — while the privacy guard itself is still shipped and active.

Options for MINIMAL: (a) ship a minimal `privacy-protected-paths.json`, (b) skip the test
when the config is absent, or (c) drop the privacy layer from MINIMAL entirely and say so.
(b) is the least honest — it converts a contract test into a no-op.

**Transfer: Partly.** The failure is MINIMAL-only. What is worth raising in DEV is that a
contract test silently depends on a file living in a *gitignored* tree (`/99-System/*` is
blanket-ignored per `CLAUDE.md` → *Git Workflow*), so anyone deriving a vault loses the
guard's test coverage without warning.

## 4 — No `.gitignore`, compiled Python committed

MINIMAL has no `.gitignore` at all, and `AIOS/scripts/__pycache__/vault_resolver.cpython-314.pyc`
is tracked (1 of 384 tracked files). Origin's `.gitignore` was presumably left behind during
stripping along with `99-System/`.

Recommended fix: add a `.gitignore` covering `__pycache__/`, `*.pyc`, `.pytest_cache/`,
`node_modules/`, `.env`; `git rm --cached` the tracked `.pyc`.

**Transfer: Yes, if DEV also tracks a `.pyc`** — worth a one-line check there. Otherwise
MINIMAL-only.

## 5 — Tests exist, nothing runs them

Verified locally:

- `python3 -m pytest AIOS` → **25 passed** (`AIOS/orchestration/lib/tests/`)
- `node --test AIOS/runtime/hooks/tests` → **27 passed, 2 failed** (items 2 and 3 above)

There is no `.github/`, no `package.json`, no `pyproject.toml`, and no documented test
command in `README.md` / `CLAUDE.md` / `AGENTS.md`. `pytest` is not declared anywhere
either, so the Python suite's dependency is implicit.

Recommended fix: document both commands in `CLAUDE.md`, and add a CI workflow running them
on push/PR.

**Transfer: Yes.** This is an Origin-level gap, not a stripping artifact. Open question for
the owner: whether CI belongs on the DEV repo (which also carries private notes) or only on
the template-source surface — that choice decides where the workflow file lands.

## Changes made in MINIMAL

| Date | Change | Paths | Transfer? |
|---|---|---|---|
| 2026-08-03 | Added this transfer log | `AIOS/orchestration/reports/MINIMAL to DEV Transfer Log.md` | No — MINIMAL-specific bookkeeping |

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
