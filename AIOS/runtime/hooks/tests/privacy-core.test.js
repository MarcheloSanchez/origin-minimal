const { test } = require("node:test");
const assert = require("node:assert/strict");
const core = require("../lib/privacy-core.js");

test("globToRegExp: ** matches across slashes", () => {
  const re = core.globToRegExp("05-Calendar/Daily/**");
  assert.equal(re.test("05-Calendar/Daily/2026-05-15.md"), true);
  assert.equal(re.test("05-Calendar/Daily/sub/x.md"), true);
});

test("globToRegExp: prefix does not match siblings", () => {
  const re = core.globToRegExp("05-Calendar/Daily/**");
  assert.equal(re.test("05-Calendar/DailyDigest.md"), false);
  assert.equal(re.test("05-Calendar/Weekly/x.md"), false);
});

test("isProtected: true for a protected path", () => {
  const globs = ["05-Calendar/Daily/**", "06-Archive/Completed/**"];
  assert.equal(core.isProtected("05-Calendar/Daily/2026-05-15.md", globs), true);
  assert.equal(core.isProtected("06-Archive/Completed/old.md", globs), true);
});

test("isProtected: false for non-protected calendar infra", () => {
  const globs = ["05-Calendar/Daily/**"];
  assert.equal(core.isProtected("05-Calendar/CalendarReviewHub.md", globs), false);
  assert.equal(core.isProtected("05-Calendar/_Calendar_Data.base", globs), false);
});

test("normalizeToVaultRel: strips project dir prefix, backslashes", () => {
  const proj = "C:/Users/me/Origin";
  assert.equal(
    core.normalizeToVaultRel("C:\\Users\\me\\Origin\\05-Calendar\\Daily\\x.md", proj),
    "05-Calendar/Daily/x.md"
  );
  assert.equal(core.normalizeToVaultRel("05-Calendar/Daily/x.md", proj), "05-Calendar/Daily/x.md");
});

test("extractCandidatePaths: Read uses file_path", () => {
  const r = core.extractCandidatePaths("Read", { file_path: "05-Calendar/Daily/x.md" });
  assert.deepEqual(r, ["05-Calendar/Daily/x.md"]);
});

test("extractCandidatePaths: Grep/Glob use path and pattern", () => {
  assert.deepEqual(core.extractCandidatePaths("Grep", { path: "05-Calendar/Daily" }), ["05-Calendar/Daily"]);
  assert.deepEqual(
    core.extractCandidatePaths("Glob", { pattern: "05-Calendar/Daily/**", path: "06-Archive/Completed" }).sort(),
    ["05-Calendar/Daily/**", "06-Archive/Completed"].sort()
  );
});

test("extractCandidatePaths: Bash finds a protected path token", () => {
  const g = ["05-Calendar/Daily/**"];
  const r = core.extractCandidatePaths("Bash", { command: 'cat "05-Calendar/Daily/2026-05-15.md"' }, g);
  assert.ok(r.includes('05-Calendar/Daily/2026-05-15.md'));
});

test("extractCandidatePaths: Bash ignores incidental word Daily", () => {
  const g = ["05-Calendar/Daily/**"];
  const r = core.extractCandidatePaths("Bash", { command: 'git log --oneline | grep Daily' }, g);
  assert.equal(r.some((p) => p.startsWith("05-Calendar/")), false);
});

test("extractCandidatePaths: MCP origin-minimal args", () => {
  const r = core.extractCandidatePaths("mcp__origin-minimal__read_note", { path: "06-Archive/Completed/old.md" });
  assert.ok(r.includes("06-Archive/Completed/old.md"));
  const q = core.extractCandidatePaths("mcp__origin-minimal__search_vault", { query: "anything", folder: "05-Calendar/Daily" });
  assert.ok(q.includes("05-Calendar/Daily"));
});

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

function mkFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pg-"));
  fs.mkdirSync(path.join(dir, "99-System/Config"), { recursive: true });
  fs.mkdirSync(path.join(dir, ".claude"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "99-System/Config/privacy-protected-paths.json"),
    JSON.stringify({ version: 1, protected: ["05-Calendar/Daily/**"] })
  );
  return dir;
}

test("loadConfig: reads protected list", () => {
  const dir = mkFixture();
  assert.deepEqual(core.loadConfig(dir).protected, ["05-Calendar/Daily/**"]);
});

test("loadConfig: missing/corrupt falls back to built-in (fail-closed)", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pg-"));
  const cfg = core.loadConfig(dir);
  assert.ok(cfg.protected.includes("05-Calendar/Daily/**"));
  assert.ok(cfg.protected.length >= 5);
});

test("isUnlocked: true only when marker exists", () => {
  const dir = mkFixture();
  assert.equal(core.isUnlocked(dir), false);
  fs.writeFileSync(path.join(dir, ".claude/.privacy-unlock"), "unlocked");
  assert.equal(core.isUnlocked(dir), true);
});

test("decide: gates protected Read when locked", () => {
  const dir = mkFixture();
  const d = core.decide({ tool_name: "Read", tool_input: { file_path: "05-Calendar/Daily/x.md" } }, dir);
  assert.equal(d.gate, true);
  assert.equal(d.deny, undefined); // never a hard deny — see decide() rationale
  assert.match(d.reason, /Privacy guard/);
  assert.match(d.reason, /Approve to allow this one call/);
});

test("decide: allows protected Read when unlocked", () => {
  const dir = mkFixture();
  fs.writeFileSync(path.join(dir, ".claude/.privacy-unlock"), "unlocked");
  const d = core.decide({ tool_name: "Read", tool_input: { file_path: "05-Calendar/Daily/x.md" } }, dir);
  assert.equal(d, null);
});

test("decide: allows non-protected Read when locked", () => {
  const dir = mkFixture();
  const d = core.decide({ tool_name: "Read", tool_input: { file_path: "05-Calendar/CalendarReviewHub.md" } }, dir);
  assert.equal(d, null);
});

test("decide: reads-only — Write to protected is allowed when locked", () => {
  const dir = mkFixture();
  const d = core.decide({ tool_name: "Write", tool_input: { file_path: "05-Calendar/Daily/x.md" } }, dir);
  assert.equal(d, null);
});

test("decide: missing config still gates protected (fail-closed)", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pg-"));
  fs.mkdirSync(path.join(dir, ".claude"), { recursive: true });
  const d = core.decide({ tool_name: "Read", tool_input: { file_path: "05-Calendar/Daily/x.md" } }, dir);
  assert.equal(d.gate, true);
});

// Regression: the fail-closed fallback drifted from the live config and left
// the real archive folders unprotected. Keep the two lists in lockstep.
test("fallback list covers the live archive folders", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pg-"));
  fs.mkdirSync(path.join(dir, ".claude"), { recursive: true });
  for (const p of ["06-Archive/Dormant/x.md", "06-Archive/Reference/x.md", "06-Archive/Completed/x.md"]) {
    const d = core.decide({ tool_name: "Read", tool_input: { file_path: p } }, dir);
    assert.equal(d && d.gate, true, "expected fallback to protect " + p);
  }
});

test("fallback list matches the shipped JSON config exactly", () => {
  const live = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../../../99-System/Config/privacy-protected-paths.json"), "utf8")
  ).protected;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pg-"));
  const fallback = core.loadConfig(dir).protected; // no config present => builtin
  assert.deepEqual([...fallback].sort(), [...live].sort());
});
