#!/usr/bin/env node
"use strict";

// SessionStart hook: inject the rolling hot-cache (AIOS/memory/hot.md) into the
// new session as additionalContext, so a fresh AI session starts warm without
// having to crawl the vault. Inspired by the Karpathy claude-obsidian hot cache.
// Silent no-op if the file is missing or empty. Never blocks session start.

const fs = require("node:fs");
const path = require("node:path");

function main() {
  // Drain stdin so the parent doesn't see a broken pipe; content unused.
  try { fs.readFileSync(0, "utf8"); } catch (_) {}

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const hotPath = path.join(projectDir, "AIOS", "memory", "hot.md");

  let body = "";
  try {
    body = fs.readFileSync(hotPath, "utf8").trim();
  } catch (_) {
    process.exit(0); // no hot cache → nothing to inject
  }
  if (!body) process.exit(0);

  const additionalContext =
    "Hot cache (AIOS/memory/hot.md) — recent vault state for a warm start. " +
    "When you finish meaningful work this session, add a dated bullet under " +
    "\"Recent\" and prune anything stale.\n\n" + body;

  try {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext,
      },
    }));
  } catch (_) { /* best-effort; never block session start */ }
  process.exit(0);
}

main();
