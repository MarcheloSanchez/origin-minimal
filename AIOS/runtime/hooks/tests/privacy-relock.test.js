const { test } = require("node:test");
const assert = require("node:assert/strict");
const cp = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const HOOK = path.join(__dirname, "..", "privacy-relock.js");

function run(projectDir) {
  cp.execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify({ hook_event_name: "SessionStart" }),
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
    encoding: "utf8"
  });
}

test("relock: deletes an existing unlock marker", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pgr-"));
  fs.mkdirSync(path.join(dir, ".claude"), { recursive: true });
  const marker = path.join(dir, ".claude/.privacy-unlock");
  fs.writeFileSync(marker, "unlocked");
  run(dir);
  assert.equal(fs.existsSync(marker), false);
});

test("relock: no error when marker absent", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pgr-"));
  fs.mkdirSync(path.join(dir, ".claude"), { recursive: true });
  assert.doesNotThrow(() => run(dir));
});
