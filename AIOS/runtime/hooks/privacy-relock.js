#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

function main() {
  // Drain stdin so the parent doesn't see a broken pipe; content unused.
  try { fs.readFileSync(0, "utf8"); } catch (_) {}

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const marker = path.join(projectDir, ".claude", ".privacy-unlock");
  try {
    if (fs.existsSync(marker)) fs.unlinkSync(marker);
  } catch (_) { /* best-effort; never block session start */ }
  process.exit(0);
}

main();
