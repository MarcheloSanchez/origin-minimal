"use strict";

const fs = require("node:fs");
const path = require("node:path");

// Fail-closed fallback — used if the JSON config is missing or unparseable.
// MUST mirror 99-System/Config/privacy-protected-paths.json. Drifted once
// (2026-07-26): held stale 06-Archive/{Inactive,Prompts-Docs} while leaving the
// real 06-Archive/{Dormant,Reference} unprotected — i.e. the fallback failed
// open on the archive in exactly the scenario it exists for.
const BUILTIN_PROTECTED = [
  "05-Calendar/Daily/**",
  "05-Calendar/Sessions/**",
  "05-Calendar/Weekly/**",
  "05-Calendar/Monthly/**",
  "05-Calendar/Quarterly/**",
  "05-Calendar/Yearly/**",
  "05-Calendar/_Logs/**",
  "06-Archive/Completed/**",
  "06-Archive/Dormant/**",
  "06-Archive/Reference/**"
];

// Tools that count as a "read" for privacy purposes. Write/Edit excluded
// (reads-only model — see design spec section 8). To switch to reads+writes,
// add "Write" and "Edit" here AND to the matcher in .claude/settings.json.
//
// NOTE on Bash: paths are matched as literal substrings of the command text,
// so the guard cannot tell a read from a write from an incidental mention.
// `git mv X 06-Archive/Reference/` is a pure write and still matches. Since
// 2026-07-26 the decision is "ask" rather than "deny", so such a command
// surfaces a prompt the owner approves instead of failing outright.
const READ_TOOLS = new Set(["Read", "Grep", "Glob", "Bash"]);
function isGuardedTool(name) {
  return READ_TOOLS.has(name) || name.startsWith("mcp__origin-minimal__");
}

// Translate a restricted glob (supports ** and *) into an anchored RegExp.
// ** => any chars incl. slashes; * => any chars except slash.
function globToRegExp(glob) {
  let out = "^";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*") {
      if (glob[i + 1] === "*") { out += ".*"; i++; }
      else { out += "[^/]*"; }
    } else if ("\\^$.|?+()[]{}".includes(c)) {
      out += "\\" + c;
    } else {
      out += c;
    }
  }
  out += "$";
  return new RegExp(out);
}

function isProtected(relPath, globs) {
  const p = String(relPath).replace(/\\/g, "/").replace(/^\.?\//, "");
  return globs.some((g) => globToRegExp(g).test(p));
}

function normalizeToVaultRel(p, projectDir) {
  let s = String(p).replace(/\\/g, "/");
  const proj = String(projectDir || "").replace(/\\/g, "/").replace(/\/$/, "");
  if (proj && s.toLowerCase().startsWith(proj.toLowerCase() + "/")) {
    s = s.slice(proj.length + 1);
  }
  return s.replace(/^\.?\//, "");
}

// Pull the literal, pre-wildcard prefixes from the protected globs so Bash
// commands can be scanned for real path tokens (not incidental words).
function protectedPrefixes(globs) {
  return globs.map((g) => {
    const i = g.search(/[*?]/);
    return (i === -1 ? g : g.slice(0, i)).replace(/\/+$/, "");
  }).filter(Boolean);
}

function extractCandidatePaths(toolName, toolInput, globs) {
  const ti = toolInput || {};
  const out = [];
  if (toolName === "Read" || toolName === "Edit" || toolName === "Write") {
    if (ti.file_path) out.push(ti.file_path);
  } else if (toolName === "Grep") {
    if (ti.path) out.push(ti.path);
  } else if (toolName === "Glob") {
    if (ti.path) out.push(ti.path);
    if (ti.pattern) out.push(ti.pattern);
  } else if (toolName === "Bash") {
    const cmd = String(ti.command || "");
    for (const pre of protectedPrefixes(globs || [])) {
      const esc = pre.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp("(^|[\\s\"'=:(/])" + esc + "(/[^\\s\"'`)]*)?", "g");
      for (const m of cmd.matchAll(re)) {
        out.push((pre + (m[2] || "")).replace(/^\W+/, ""));
      }
    }
  } else if (toolName.startsWith("mcp__origin-minimal__")) {
    for (const k of ["path", "folder", "note", "file"]) {
      if (ti[k]) out.push(ti[k]);
    }
  }
  return out;
}

function loadConfig(projectDir) {
  try {
    const f = path.join(projectDir, "99-System/Config/privacy-protected-paths.json");
    const j = JSON.parse(fs.readFileSync(f, "utf8"));
    if (Array.isArray(j.protected) && j.protected.length) {
      return { protected: j.protected };
    }
  } catch (_) { /* fall through to fail-closed default */ }
  return { protected: BUILTIN_PROTECTED.slice() };
}

function isUnlocked(projectDir) {
  try {
    return fs.existsSync(path.join(projectDir, ".claude", ".privacy-unlock"));
  } catch (_) {
    return false; // error => treat as locked
  }
}

// Returns null to ALLOW silently, or { gate: true, reason } to require the
// owner's explicit approval for this one call. The caller (privacy-guard.js)
// turns a gate into permissionDecision "ask" — never "deny". Rationale: a hard
// deny cannot distinguish "this note is private" from "this command merely
// names a protected folder", and it makes auditing those folders impossible,
// which was one of the guard's stated purposes. Changed 2026-07-26.
function decide(payload, projectDir) {
  const toolName = payload && payload.tool_name;
  if (!toolName || !isGuardedTool(toolName)) return null;
  if (isUnlocked(projectDir)) return null;

  const { protected: globs } = loadConfig(projectDir);
  const raw = extractCandidatePaths(toolName, payload.tool_input, globs);
  for (const c of raw) {
    const rel = normalizeToVaultRel(c, projectDir);
    if (isProtected(rel, globs)) {
      return {
        gate: true,
        reason:
          "🔒 Privacy guard: '" + rel +
          "' is in a protected folder. Approve to allow this one call, or run " +
          "/unlock-private to allow the whole session."
      };
    }
  }
  return null;
}

module.exports = { globToRegExp, isProtected, normalizeToVaultRel, extractCandidatePaths, loadConfig, isUnlocked, decide };
