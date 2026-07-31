---
up: "[[+About AIℹ️]]"
title: Hook Reference
type: guide
tags:
  - 📚guide
  - 🤖AI
status: 🔄active
created: 2026-05-26
modified: 2026-07-11
last_review: 2026-07-22
review_frequency: quarterly
---

# Hook Reference

Claude Code hooks for the Origin vault live in `AIOS/runtime/hooks/*.js` and are
registered in `AIOS/runtime/settings.json`. Hooks fire on lifecycle events
(`PreToolUse`, `SessionStart`, etc.) and can gate, transform, or react to tool
calls.

## Active hooks

| Hook | Event | Purpose |
|---|---|---|
| `privacy-guard.js` | `PreToolUse` | Denies `Read`/`Grep`/`Glob`/`Bash` and `mcp__origin-minimal__*` on protected folders unless the session is unlocked. |
| `privacy-relock.js` | `SessionStart` | Deletes the unlock marker so every new session starts locked. |
| `hot-cache.js` | `SessionStart` | Injects `AIOS/memory/hot.md` as `additionalContext` so a fresh session starts warm. Silent no-op if the cache is missing/empty. |

Shared logic for the privacy hooks lives in `AIOS/runtime/hooks/lib/`. Tests
under `AIOS/runtime/hooks/tests/`.

## Authoring conventions

These are the load-bearing patterns. Violating them produces silent failures.

### Input

- **Hook scripts read JSON from stdin.** Always:
  ```js
  const input = JSON.parse(fs.readFileSync(0, "utf8"));
  ```
- **Normalize Windows paths** before string matching — backslashes break `startsWith`:
  ```js
  const path = (input.tool_input?.file_path ?? "").replace(/\\/g, "/");
  ```

### PreToolUse permission gate

To deny (or ask) a tool call, write a `hookSpecificOutput` JSON to stdout:

```js
process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "deny",        // "allow" | "ask" | "deny"
    permissionDecisionReason: "🔒 Privacy guard: '<path>' is protected. Run /unlock-private.",
  },
}));
```

To pass through silently, exit with no output and code 0.

### SessionStart context injection

To add context to a starting session (e.g. `hot-cache.js`), write a
`hookSpecificOutput` with `additionalContext`:

```js
process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: "…text injected into the new session…",
  },
}));
```

Multiple `SessionStart` hooks all fire and each may inject context — they
compose, they don't override.

### Tool-input path extraction

Different tools place the path in different fields. Extract from these in order:

| Tool | Field |
|---|---|
| `Read` / `Edit` / `Write` / `NotebookEdit` | `tool_input.file_path` |
| `Grep` | `tool_input.path` |
| `Glob` | `tool_input.path` |
| `Bash` | `tool_input.command` (regex paths out) |
| `mcp__origin-minimal__*` | varies — check `path`, `note_path`, `query`, etc. |

`privacy-core.js` has the canonical extraction logic — reuse it.

### Multiple hooks on the same event

Multiple entries with the same matcher on the same event **all fire**. There is
no override. If you add a second `PreToolUse:Read` hook, both run. Plan for
composition, not replacement.

### Settings registration

Hooks must be registered in `AIOS/runtime/settings.json`. Matcher syntax:

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Read|Grep|Glob|Bash",
        "hooks": [{ "type": "command",
                    "command": ".claude/hooks/privacy-guard.js" }] }
    ]
  }
}
```

Command paths use `.claude/...` (resolves via the junction at runtime). The
matcher is a regex against tool names.

## System constraints

- **`jq` is NOT installed** on this machine — use `node -e` for JSON parsing
  in shell hooks if you must shell out.
- **`python` not `python3`** for any Python hooks (Windows Store prompt otherwise).
- **Read-before-Edit is strict** — the harness blocks `Edit` on files not
  `Read` in the current session. Account for this if writing a hook that
  inspects edits.

## Where to put new hooks

1. Implementation: `AIOS/runtime/hooks/<name>.js`
2. Shared lib code: `AIOS/runtime/hooks/lib/`
3. Tests: `AIOS/runtime/hooks/tests/<name>.test.js` (run via `node --test AIOS/runtime/hooks/tests/*.test.js` — note the glob, the directory form fails on Node v24/Windows)
4. Register in `AIOS/runtime/settings.json`
5. Document the new hook in the table at the top of this file

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*
