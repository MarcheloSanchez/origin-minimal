const { test } = require("node:test");
const assert = require("node:assert/strict");
const cp = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const HOOK = path.join(__dirname, "..", "hot-cache.js");

function run(projectDir) {
  return cp.execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify({ hook_event_name: "SessionStart" }),
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
    encoding: "utf8"
  });
}

function makeVault(hotContent) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hot-"));
  if (hotContent !== undefined) {
    const ctx = path.join(dir, "AIOS", "context");
    fs.mkdirSync(ctx, { recursive: true });
    fs.writeFileSync(path.join(ctx, "hot.md"), hotContent);
  }
  return dir;
}

test("hot-cache: injects hot.md as SessionStart additionalContext", () => {
  const dir = makeVault("# Hot Context\n\n- 2026-06-16 — did a thing");
  const out = JSON.parse(run(dir));
  assert.equal(out.hookSpecificOutput.hookEventName, "SessionStart");
  assert.match(out.hookSpecificOutput.additionalContext, /did a thing/);
});

test("hot-cache: silent no-op when hot.md is missing", () => {
  const dir = makeVault(undefined);
  assert.equal(run(dir).trim(), "");
});

test("hot-cache: silent no-op when hot.md is empty", () => {
  const dir = makeVault("   \n  ");
  assert.equal(run(dir).trim(), "");
});
