const { test } = require("node:test");
const assert = require("node:assert/strict");
const cp = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const HOOK = path.join(__dirname, "..", "privacy-guard.js");

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pgi-"));
  fs.mkdirSync(path.join(dir, "99-System/Config"), { recursive: true });
  fs.mkdirSync(path.join(dir, ".claude"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "99-System/Config/privacy-protected-paths.json"),
    JSON.stringify({ version: 1, protected: ["05-Calendar/Daily/**"] })
  );
  return dir;
}

function runHook(payload, projectDir) {
  // execFileSync (not exec): no shell, no injection surface.
  const out = cp.execFileSync(process.execPath, [HOOK], {
    input: JSON.stringify(payload),
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir },
    encoding: "utf8"
  });
  return out.trim() ? JSON.parse(out) : null;
}

test("integration: asks on protected Read when locked", () => {
  const dir = fixture();
  const res = runHook(
    { tool_name: "Read", tool_input: { file_path: "05-Calendar/Daily/2026-05-15.md" } },
    dir
  );
  assert.equal(res.hookSpecificOutput.hookEventName, "PreToolUse");
  assert.equal(res.hookSpecificOutput.permissionDecision, "ask");
  assert.match(res.hookSpecificOutput.permissionDecisionReason, /Privacy guard/);
});

// The case that motivated the change: a Bash command that only WRITES into a
// protected folder still matches the path, and must be approvable rather than
// blocked outright.
test("integration: Bash writing into a protected folder asks, never denies", () => {
  const dir = fixture();
  const res = runHook(
    { tool_name: "Bash", tool_input: { command: 'git mv "Note.md" 05-Calendar/Daily/' } },
    dir
  );
  assert.equal(res.hookSpecificOutput.permissionDecision, "ask");
});

test("integration: silent allow for non-protected Read", () => {
  const dir = fixture();
  const res = runHook(
    { tool_name: "Read", tool_input: { file_path: "Home.md" } },
    dir
  );
  assert.equal(res, null);
});

test("integration: allow when unlock marker present", () => {
  const dir = fixture();
  fs.writeFileSync(path.join(dir, ".claude/.privacy-unlock"), "unlocked");
  const res = runHook(
    { tool_name: "Read", tool_input: { file_path: "05-Calendar/Daily/x.md" } },
    dir
  );
  assert.equal(res, null);
});
