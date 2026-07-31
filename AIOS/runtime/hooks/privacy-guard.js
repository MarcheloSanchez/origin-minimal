#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const core = require(path.join(__dirname, "lib", "privacy-core.js"));

function main() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(0, "utf8"));
  } catch (_) {
    process.exit(0); // can't parse input => do not block
  }

  const projectDir =
    process.env.CLAUDE_PROJECT_DIR ||
    (payload && payload.cwd) ||
    process.cwd();

  let decision = null;
  try {
    decision = core.decide(payload, projectDir);
  } catch (_) {
    decision = null; // never crash a tool call on guard error
  }

  if (decision && decision.gate) {
    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "ask",
          permissionDecisionReason: decision.reason
        }
      })
    );
  }
  process.exit(0);
}

main();
