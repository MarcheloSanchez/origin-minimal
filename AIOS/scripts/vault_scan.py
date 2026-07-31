#!/usr/bin/env python
"""Deterministic vault scanner — YAML, link graph, body and placement checks.

Produces machine-verified ground truth for /lint-vault so the LLM layer
interprets findings instead of counting them. Every number the vault-inspector
agent reports must come from this file's JSON output.

Design: AIOS/docs/plans/2026-07-28-deterministic-vault-scan-design.md

Canonical sources read at runtime (never hardcoded):
  99-System/CIS/CIS_{STATUS,MATURITY,PRIORITY,TYPE}.md  → locked enums
  99-System/Config/yaml-meta-config.json                → field order, renames
  99-System/Config/privacy-protected-paths.json         → folders never read

Usage:
    python AIOS/scripts/vault_scan.py                       # write dated JSON
    python AIOS/scripts/vault_scan.py --summary             # aggregates only (~3KB, for agents)
    python AIOS/scripts/vault_scan.py --check broken_wikilink   # one check, itemised
    python AIOS/scripts/vault_scan.py --stdout              # full JSON to stdout (~100KB)
    python AIOS/scripts/vault_scan.py --include-infra       # + Templates, 99-System, AIOS
    python AIOS/scripts/vault_scan.py --include-private     # + privacy-protected folders
    python AIOS/scripts/vault_scan.py --root /path/to/vault

Exit 0 = scan completed (findings are data, not failure). Exit 2 = scan error.
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from vault_resolver import resolve_vault_root  # noqa: E402

SCAN_VERSION = 1

# Directories never walked, under any scope. `.remember` is the remember
# plugin's session history — machine-written logs, not vault notes.
SKIP_ALWAYS = {
    ".git", ".obsidian", "node_modules", "_backups", ".claude", "__pycache__",
    ".remember", ".pytest_cache",
}

# Infrastructure — skipped unless --include-infra.
SKIP_INFRA = {"Templates", "99-System", "AIOS"}

# Never scanned at any scope: this scanner's own golden fixture is deliberately
# broken test data and would otherwise show up as real vault findings under
# --include-infra.
SKIP_PATH_PREFIXES = ("AIOS/scripts/tests/",)

# Root-level repo/engineering files. These are real Markdown but they are not
# PKM notes and were never meant to carry the vault's frontmatter schema —
# scanning them produces pure false positives.
SKIP_ROOT_FILES = {
    "CLAUDE.md", "README.md", "BACKLOG.md", "CHANGELOG.md", "RELEASE NOTES.md",
}

# Universal required fields. yaml-meta-config's `ensureRequired` lists only the
# first four; origin-yaml/SKILL.md documents all six as universal. We use the
# skill's six and record which came from where so the discrepancy stays visible.
UNIVERSAL_REQUIRED = ["title", "type", "status", "created", "modified", "tags"]

# Type-specific minimums — source: AIOS/runtime/skills/origin-yaml/SKILL.md
# ("Required fields by type"). Keep in sync per the Schema Change Protocol.
TYPE_REQUIRED = {
    "atomic": ["maturity", "up"],
    "effort": ["priority", "rank"],
    "source": ["source_author", "source_type"],
    "meeting": ["participants", "meeting_type"],
    "moc": ["up"],
    "prompt": ["prompt_category", "prompt_type"],
}

# Types needing at least one of a set, rather than all of it.
TYPE_REQUIRED_ONE_OF = {
    "person": ["role", "org"],
}

# `deadline` → `due` is canonical per CLAUDE.md Critical Issue #4 and
# origin-yaml/SKILL.md, but is MISSING from yaml-meta-config.json's rename map,
# so the orchestrator never auto-renames it. Added here so the scan still
# catches it. See the config-gap note in the design doc.
LEGACY_EXTRA = {"deadline": "due"}

# Enum field → CIS filename.
ENUM_SOURCES = {
    "status": "CIS_STATUS.md",
    "maturity": "CIS_MATURITY.md",
    "priority": "CIS_PRIORITY.md",
    "type": "CIS_TYPE.md",
}

SEVERITY = {
    "missing_frontmatter": "error",
    "missing_universal_field": "error",
    "type_not_in_enum": "error",
    "status_not_in_enum": "error",
    "maturity_not_in_enum": "error",
    "priority_not_in_enum": "error",
    "missing_type_required_field": "warn",
    "legacy_field_name": "warn",
    "unquoted_wikilink_scalar": "warn",
    "field_order_violation": "warn",
    # Phase 2 — link graph
    "broken_wikilink": "error",
    "orphan_note": "warn",
    "maturity_overstated": "warn",
    "maturity_understated": "warn",
    # Phase 3 — body + placement
    "empty_note": "error",
    "wayfinder_missing": "warn",
    "orbit_spacing": "warn",
    "footer_missing": "warn",
    "footer_malformed": "warn",
    "escaped_pipe": "warn",
    "type_folder_mismatch": "error",
    "status_folder_mismatch": "error",
    "source_subfolder_mismatch": "warn",
    "stale_staged_capture": "warn",
}

# --- Phase 3 rule tables ---------------------------------------------------

# Critical Issue #13/#14 — the footer is an exact string, two spaces included.
FOOTER_EXACT = "⬆️ [[🏡Home]]  *| `= this.file.mtime`*"
FOOTER_MARKER = "[[🏡Home]]"

# The footer signals "this note is synthesised into the graph", so it is gated
# on maturity: seed/seedling notes correctly have none and must not be flagged.
FOOTER_REQUIRED_MATURITY = {"🪴sapling", "🌲evergreen", "🍓fruit"}

# Periodic notes navigate via the Calendar templates' own path-form links
# (Critical Issue #12 exception), not via a Wayfinder callout.
PERIODIC_TYPES = {"daily", "weekly", "monthly", "quarterly", "yearly"}

# type → required top-level folder. Source: origin-routing/SKILL.md, EXCEPT
# `prompt`: the skill still says `99-System/Prompts/`, but those files were moved
# to `07-Prompts/` because 99-System is excluded from Obsidian's index
# (Critical Issue #15). Disk wins over the stale skill.
TYPE_FOLDER = {
    "atomic": "02-Knowledge", "person": "02-Knowledge", "place": "02-Knowledge",
    "tool": "02-Knowledge", "area": "02-Knowledge",
    "effort": "03-Efforts",
    "source": "04-Sources", "meeting": "04-Sources",
    "moc": "01-MOCs",
    "prompt": "07-Prompts",
    **{t: "05-Calendar" for t in PERIODIC_TYPES},
}

# Folders where any type is legitimate, so placement is not checked.
PLACEMENT_EXEMPT_ROOTS = {"06-Archive", "+Inbox", "Templates", "99-System", "AIOS"}

# 03-Efforts subfolder → the status an effort there must carry.
EFFORT_FOLDER_STATUS = {"Active": "🔄active", "Paused": "⏸️paused", "Waiting": "⏳waiting"}

# source_type → 04-Sources subfolder. `experience` lives at the root by design.
SOURCE_SUBFOLDER = {
    "article": "Articles", "book": "Books", "course": "Courses",
    "guide": "Guides", "video": "Media", "podcast": "Media",
    "research": "Research",
}

STALE_CAPTURE_DAYS = 7
ESCAPED_PIPE_RE = re.compile(r"\[\[[^\[\]\n]*\\\|")

# Top-level YAML key at zero indentation. Deliberately narrow: nested keys and
# list items are indented and must not match.
KEY_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_-]*)\s*:(.*)$")


class ScanError(RuntimeError):
    """Raised when a canonical source is missing or unreadable."""


# --------------------------------------------------------------------------
# Canonical source loading
# --------------------------------------------------------------------------


def load_cis_enum(cis_dir: Path, filename: str) -> list:
    """Parse a CIS enum file into an ordered list of canonical values.

    CIS enum files are bare value-per-line. Markdown scaffolding (headers,
    bullets, tables, quotes) is ignored so files that later grow prose still
    parse — CIS_TAG.md already has sections, and the others may follow.
    """
    path = cis_dir / filename
    if not path.is_file():
        raise ScanError(f"Canonical enum source missing: {path}")
    values = []
    for line in path.read_text(encoding="utf-8").splitlines():
        v = line.strip()
        if not v or v.startswith(("#", "-", "|", ">", "`")):
            continue
        values.append(v)
    if not values:
        raise ScanError(f"Canonical enum source parsed to zero values: {path}")
    return values


def load_privacy_prefixes(vault_root: Path) -> tuple:
    """Path prefixes the privacy guard protects, read from its own config.

    `.claude/hooks/privacy-guard.js` gates Claude's tools, but a Python script
    invoked via Bash never names these paths and so slips past it. Honouring the
    same config here keeps the scanner from doing through the back door what the
    guard blocks at the front — and matches vault-inspector's hard constraint #4.
    """
    path = vault_root / "99-System" / "Config" / "privacy-protected-paths.json"
    if not path.is_file():
        return ()
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        # Fail closed: an unreadable privacy config must not mean "scan everything".
        raise ScanError(f"Privacy config present but unreadable: {path}")
    return tuple(sorted(p.replace("/**", "").rstrip("/") + "/" for p in data.get("protected", [])))


def load_config(vault_root: Path) -> dict:
    path = vault_root / "99-System" / "Config" / "yaml-meta-config.json"
    if not path.is_file():
        raise ScanError(f"Orchestrator config missing: {path}")
    return json.loads(path.read_text(encoding="utf-8"))


def load_canonical(vault_root: Path) -> dict:
    """Load every canonical source the scan depends on. Fails loud, not silent."""
    cis_dir = vault_root / "99-System" / "CIS"
    config = load_config(vault_root)
    enums = {field: load_cis_enum(cis_dir, fn) for field, fn in ENUM_SOURCES.items()}

    renames = dict(config.get("rules", {}).get("rename", {}))
    renames.update(LEGACY_EXTRA)

    field_order = config.get("order", {}).get("default", [])
    if not field_order:
        raise ScanError("yaml-meta-config.json has no order.default array")

    return {"enums": enums, "field_order": field_order, "renames": renames}


# --------------------------------------------------------------------------
# Frontmatter parsing
# --------------------------------------------------------------------------


def split_frontmatter(text: str):
    """Return (frontmatter_text, body) or (None, text) when absent.

    Hand-rolled because PyYAML is not installed on this machine. We only need
    top-level key presence, order, and scalar values — not full YAML semantics.
    """
    if not text.startswith("---\n") and not text.startswith("---\r\n"):
        return None, text
    end = text.find("\n---", 3)
    while end != -1:
        after = text[end + 4 : end + 6]
        if after in ("\n", "\r\n", "") or after.startswith("\n"):
            return text[4:end], text[end + 4 :]
        end = text.find("\n---", end + 1)
    return None, text


def parse_fields(fm_text: str) -> list:
    """Extract top-level fields as [(key, raw_value, fm_line_index), ...].

    Order is preserved — the field-order check depends on it. Duplicate keys are
    kept as separate entries so nothing is silently collapsed.
    """
    fields = []
    for i, line in enumerate(fm_text.splitlines()):
        if not line or line[0] in " \t#":
            continue
        m = KEY_RE.match(line)
        if m:
            fields.append((m.group(1), m.group(2).strip(), i))
    return fields


def has_value(raw: str, following_lines: list) -> bool:
    """True when a key carries a scalar value or a non-empty block/list beneath."""
    if raw:
        return True
    for line in following_lines:
        if not line.strip():
            continue
        if line[0] in " \t" or line.lstrip().startswith("- "):
            return bool(line.strip().lstrip("- ").strip())
        return False
    return False


# --------------------------------------------------------------------------
# Checks
# --------------------------------------------------------------------------


def finding(check, path, detail, field=None, value=None, line=None):
    return {
        "check": check,
        "severity": SEVERITY[check],
        "path": path,
        "line": line,
        "field": field,
        "value": value,
        "detail": detail,
    }


def check_file(rel_path: str, text: str, canonical: dict) -> list:
    """Run every Phase 1 check against one note. Returns a list of findings."""
    out = []
    fm_text, _body = split_frontmatter(text)

    if fm_text is None:
        return [finding("missing_frontmatter", rel_path, "Note has no YAML frontmatter block")]

    fm_lines = fm_text.splitlines()
    fields = parse_fields(fm_text)
    # +2 converts a frontmatter-relative index to a 1-based file line number
    # (line 1 is the opening `---`).
    present = {}
    for key, raw, idx in fields:
        if key not in present:
            present[key] = (raw, idx)

    def line_of(key):
        return present[key][1] + 2 if key in present else None

    def valued(key):
        if key not in present:
            return False
        raw, idx = present[key]
        return has_value(raw, fm_lines[idx + 1 :])

    # 1. Universal required fields
    for key in UNIVERSAL_REQUIRED:
        if not valued(key):
            state = "empty" if key in present else "absent"
            out.append(
                finding(
                    "missing_universal_field",
                    rel_path,
                    f"Required universal field `{key}` is {state}",
                    field=key,
                    line=line_of(key),
                )
            )

    # 2. Locked enum membership
    for field_name, allowed in canonical["enums"].items():
        if not valued(field_name):
            continue
        value = present[field_name][0].strip().strip("\"'")
        if value and value not in allowed:
            out.append(
                finding(
                    f"{field_name}_not_in_enum",
                    rel_path,
                    f"`{field_name}: {value}` is not in {ENUM_SOURCES[field_name]}",
                    field=field_name,
                    value=value,
                    line=line_of(field_name),
                )
            )

    # 3. Type-specific required fields
    note_type = present.get("type", ("", 0))[0].strip().strip("\"'")
    for key in TYPE_REQUIRED.get(note_type, []):
        if not valued(key):
            out.append(
                finding(
                    "missing_type_required_field",
                    rel_path,
                    f"type `{note_type}` requires `{key}`",
                    field=key,
                    value=note_type,
                )
            )
    for group in [TYPE_REQUIRED_ONE_OF.get(note_type)] if note_type in TYPE_REQUIRED_ONE_OF else []:
        if not any(valued(k) for k in group):
            out.append(
                finding(
                    "missing_type_required_field",
                    rel_path,
                    f"type `{note_type}` requires at least one of: {', '.join(group)}",
                    field="|".join(group),
                    value=note_type,
                )
            )

    # 4. Legacy field names
    for key in present:
        if key in canonical["renames"]:
            out.append(
                finding(
                    "legacy_field_name",
                    rel_path,
                    f"Legacy field `{key}` should be `{canonical['renames'][key]}`",
                    field=key,
                    value=canonical["renames"][key],
                    line=line_of(key),
                )
            )

    # 5. Unquoted wikilink scalars — `up: [[X]]` parses as a nested list in YAML
    for key, raw, idx in fields:
        if raw.startswith("[["):
            out.append(
                finding(
                    "unquoted_wikilink_scalar",
                    rel_path,
                    f"`{key}: {raw}` must be quoted as `{key}: \"{raw}\"`",
                    field=key,
                    value=raw,
                    line=idx + 2,
                )
            )

    # 6. Field order vs the orchestrator's canonical array. Unknown fields are
    # ignored — the orchestrator appends those to the tail regardless.
    order = canonical["field_order"]
    index = {name: i for i, name in enumerate(order)}
    known = [(k, index[k], idx) for k, _raw, idx in fields if k in index]
    for (prev_key, prev_i, _), (key, i, idx) in zip(known, known[1:]):
        if i < prev_i:
            out.append(
                finding(
                    "field_order_violation",
                    rel_path,
                    f"`{key}` appears after `{prev_key}`; canonical order puts it before",
                    field=key,
                    value=prev_key,
                    line=idx + 2,
                )
            )
            break  # one finding per file — the orchestrator reorders wholesale

    return out


# --------------------------------------------------------------------------
# Phase 2 — link graph
# --------------------------------------------------------------------------

# Fenced code blocks and inline code spans. Wikilinks inside them are NOT links:
# the +About note doctrine deliberately backticks example wikilinks so they do
# not create phantom links, and Templater syntax is fenced for the same reason.
# Scanning them would manufacture broken-link findings out of correct notes.
FENCE_RE = re.compile(r"^(?:```|~~~)[^\n]*\n.*?^(?:```|~~~)[ \t]*$", re.MULTILINE | re.DOTALL)
INLINE_CODE_RE = re.compile(r"`[^`\n]*`")

WIKILINK_RE = re.compile(r"!?\[\[([^\[\]\n]+?)\]\]")

# Atomics claiming full maturity should be genuinely connected; the threshold is
# origin-yaml's "<10 links" rule, counted as distinct outlinks + backlinks.
MATURITY_LINK_THRESHOLD = 10
MATURITY_HIGH = {"🌲evergreen", "🍓fruit"}
MATURITY_LOW = {"📤seed"}


def strip_code(text: str) -> str:
    """Blank out code regions, preserving line numbering for accurate reporting."""

    def blank(m):
        return "\n" * m.group(0).count("\n")

    return INLINE_CODE_RE.sub("", FENCE_RE.sub(blank, text))


def extract_links(text: str):
    """Return [(target, line_number), ...] for every real wikilink in the note.

    Frontmatter links (`up:`, `related:`) count — they are true graph edges.
    Heading/block anchors and aliases are stripped; same-file `[[#anchor]]`
    links are dropped since they have no target note.
    """
    out = []
    for m in WIKILINK_RE.finditer(strip_code(text)):
        raw = m.group(1)
        # `[[Note\|alias]]` (escaped pipe) and `[[Note|alias]]` both mean "Note".
        target = raw.split("|")[0].rstrip("\\").strip()
        target = target.split("#")[0].strip().replace("\\", "/")
        if not target:
            continue
        out.append((target, text.count("\n", 0, m.start()) + 1))
    return out


def build_target_index(vault_root: Path):
    """Return (targets, resolve) for the whole vault.

    `targets` is every string Obsidian would resolve to a real file; `resolve`
    maps those strings to the owning note's path so backlinks can be attributed.

    Built from ALL files including `99-System/` and `Templates/` — those are out
    of scan scope but are legitimate link targets, and links into them are
    intentional (see the Home-links-into-ignored-folders rule). Attachments
    count too, so `![[diagram.png]]` is not reported broken.
    """
    targets, resolve = set(), {}
    for path in sorted(vault_root.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(vault_root)
        if any(part in SKIP_ALWAYS for part in rel.parts[:-1]):
            continue
        rel_posix = rel.as_posix()
        if rel_posix.startswith(SKIP_PATH_PREFIXES):
            continue
        keys = [rel_posix.lower(), path.name.lower()]
        if path.suffix.lower() == ".md":
            keys += [rel_posix.lower()[:-3], path.stem.lower()]
        for k in keys:
            targets.add(k)
            # First writer wins on basename collisions — approximates Obsidian's
            # shortest-path preference closely enough for backlink attribution.
            resolve.setdefault(k, rel_posix)
    return targets, resolve


def graph_checks(rel_path, text, canonical, targets, backlinks, outlinks):
    """Checks that need the whole graph, not just this file."""
    out = []

    # A link broken in `up:` breaks navigation; one broken in prose is cosmetic.
    # Attribute frontmatter links to their owning key so the report can split
    # structural from cosmetic without re-reading the note.
    fm_for_links, _ = split_frontmatter(text)
    fm_span = len(fm_for_links.splitlines()) + 2 if fm_for_links is not None else 0
    fm_keys = parse_fields(fm_for_links) if fm_for_links is not None else []

    def owning_field(line):
        if not fm_span or line > fm_span:
            return None
        owner = None
        for key, _raw, idx in fm_keys:
            if idx + 2 <= line:
                owner = key
        return owner

    for target, line in outlinks.get(rel_path, []):
        if target.lower() not in targets:
            out.append(
                finding(
                    "broken_wikilink",
                    rel_path,
                    f"`[[{target}]]` resolves to no file in the vault",
                    field=owning_field(line),
                    value=target,
                    line=line,
                )
            )

    incoming = backlinks.get(rel_path, set())
    if not incoming:
        out.append(finding("orphan_note", rel_path, "No other note links to this one"))

    # Maturity vs actual connectedness — atomics only, per origin-yaml.
    fm_text, _ = split_frontmatter(text)
    if fm_text is None:
        return out
    present = {}
    for key, raw, idx in parse_fields(fm_text):
        present.setdefault(key, raw)
    if present.get("type", "").strip().strip("\"'") != "atomic":
        return out

    maturity = present.get("maturity", "").strip().strip("\"'")
    resolved_out = {t.lower() for t, _ in outlinks.get(rel_path, []) if t.lower() in targets}
    degree = len(resolved_out) + len(incoming)

    if maturity in MATURITY_HIGH and degree < MATURITY_LINK_THRESHOLD:
        out.append(
            finding(
                "maturity_overstated",
                rel_path,
                f"`{maturity}` but only {degree} links (need {MATURITY_LINK_THRESHOLD})",
                field="maturity",
                value=maturity,
            )
        )
    elif maturity in MATURITY_LOW and degree >= MATURITY_LINK_THRESHOLD:
        out.append(
            finding(
                "maturity_understated",
                rel_path,
                f"`{maturity}` but {degree} links — richer than its stage claims",
                field="maturity",
                value=maturity,
            )
        )
    return out


# --------------------------------------------------------------------------
# Phase 3 — body + placement
# --------------------------------------------------------------------------


def body_checks(rel_path: str, text: str, mtime_days: float) -> list:
    """Body shape and folder placement. Needs no graph — only the note itself."""
    out = []
    parts = rel_path.split("/")
    root_folder = parts[0] if len(parts) > 1 else ""

    # Stale staged captures rot silently; age is the whole check.
    if rel_path.startswith("+Inbox/_reformed/") and mtime_days > STALE_CAPTURE_DAYS:
        out.append(
            finding(
                "stale_staged_capture",
                rel_path,
                f"Staged {int(mtime_days)} days ago and never routed",
                value=str(int(mtime_days)),
            )
        )

    fm_text, body = split_frontmatter(text)
    if fm_text is None:
        return out

    present = {}
    for key, raw, _idx in parse_fields(fm_text):
        present.setdefault(key, raw)

    def val(k):
        return present.get(k, "").strip().strip("\"'")

    note_type, maturity, status = val("type"), val("maturity"), val("status")
    body_lines = body.splitlines()
    content = [ln for ln in body_lines if ln.strip()]

    if not content:
        out.append(finding("empty_note", rel_path, "No content beyond frontmatter"))
        return out

    # --- Wayfinder callout -------------------------------------------------
    orbit_idx = next((i for i, ln in enumerate(body_lines) if "[!orbit]" in ln), None)
    wayfinder_exempt = (
        note_type in PERIODIC_TYPES
        or rel_path.startswith("+Inbox/")
        or rel_path.startswith("AIOS/docs/plans/")
        or rel_path.startswith("AIOS/docs/specs/")
    )
    if orbit_idx is None:
        if not wayfinder_exempt:
            out.append(
                finding("wayfinder_missing", rel_path, "No `> [!orbit]` Wayfinder callout")
            )
    elif orbit_idx < 2:
        # body starts with the newline that ended the closing `---`, so a
        # correctly spaced callout sits at index 2: ['', '', '> [!orbit] ...'].
        out.append(
            finding(
                "orbit_spacing",
                rel_path,
                "No blank line between frontmatter and the orbit callout — "
                "renders non-clickable in edit mode",
                line=orbit_idx + len(fm_text.splitlines()) + 3,
            )
        )

    # --- Footer ------------------------------------------------------------
    last = content[-1].rstrip()
    if maturity in FOOTER_REQUIRED_MATURITY:
        if FOOTER_MARKER not in last:
            out.append(
                finding(
                    "footer_missing",
                    rel_path,
                    f"maturity `{maturity}` requires the Home footer as the last line",
                    field="maturity",
                    value=maturity,
                )
            )
        elif last != FOOTER_EXACT:
            out.append(
                finding(
                    "footer_malformed",
                    rel_path,
                    f"Footer must be exactly `{FOOTER_EXACT}`",
                    value=last,
                    line=len(text.splitlines()),
                )
            )
    elif FOOTER_MARKER in last and last != FOOTER_EXACT:
        out.append(
            finding(
                "footer_malformed",
                rel_path,
                f"Footer must be exactly `{FOOTER_EXACT}`",
                value=last,
                line=len(text.splitlines()),
            )
        )

    # --- Escaped pipe in wikilinks ----------------------------------------
    for i, line in enumerate(strip_code(text).splitlines()):
        if ESCAPED_PIPE_RE.search(line):
            out.append(
                finding(
                    "escaped_pipe",
                    rel_path,
                    r"`[[Note\|alias]]` — canonical form has no backslash",
                    line=i + 1,
                )
            )

    # --- Placement ---------------------------------------------------------
    if root_folder in PLACEMENT_EXEMPT_ROOTS or not root_folder:
        return out

    # Folder-index MOCs (`04-Sources/Books/Books.md`, `02-Knowledge/02-Knowledge.md`)
    # are named after the folder they index and correctly live inside it rather
    # than in `01-MOCs/`. Verified against the live vault: every one of the 21
    # notes this rule exempts follows the stem == parent-folder convention.
    is_folder_index = note_type == "moc" and Path(parts[-1]).stem == parts[-2]

    expected = TYPE_FOLDER.get(note_type)
    if expected and expected != root_folder and not is_folder_index:
        out.append(
            finding(
                "type_folder_mismatch",
                rel_path,
                f"type `{note_type}` belongs in `{expected}/`, not `{root_folder}/`",
                field="type",
                value=note_type,
            )
        )
        return out  # subfolder rules are meaningless once the root is wrong

    if note_type == "effort" and len(parts) > 2:
        want = EFFORT_FOLDER_STATUS.get(parts[1])
        if want and status and status != want:
            out.append(
                finding(
                    "status_folder_mismatch",
                    rel_path,
                    f"`{parts[1]}/` requires status `{want}`, found `{status}`",
                    field="status",
                    value=status,
                )
            )

    if note_type == "source":
        want = SOURCE_SUBFOLDER.get(val("source_type"))
        actual = parts[1] if len(parts) > 2 else ""
        if want and want != actual:
            out.append(
                finding(
                    "source_subfolder_mismatch",
                    rel_path,
                    f"source_type `{val('source_type')}` belongs in `04-Sources/{want}/`",
                    field="source_type",
                    value=val("source_type"),
                )
            )

    return out


# --------------------------------------------------------------------------
# Walk + assemble
# --------------------------------------------------------------------------


def iter_notes(vault_root: Path, include_infra: bool, private: tuple = ()):
    skip = set(SKIP_ALWAYS) if include_infra else SKIP_ALWAYS | SKIP_INFRA
    for path in sorted(vault_root.rglob("*.md")):
        rel = path.relative_to(vault_root)
        if any(part in skip for part in rel.parts[:-1]):
            continue
        if len(rel.parts) == 1 and rel.name in SKIP_ROOT_FILES:
            continue
        rel_posix = rel.as_posix()
        if rel_posix.startswith(SKIP_PATH_PREFIXES):
            continue
        yield path, rel_posix


def iter_all_markdown(vault_root: Path, private: tuple = ()):
    """Every Markdown file worth reading for graph edges — infra included.

    Backlinks are computed over the whole vault even though findings are only
    reported for in-scope notes: a note linked solely from a Template is not an
    orphan, and pretending otherwise would be a false positive.
    """
    for path in sorted(vault_root.rglob("*.md")):
        rel = path.relative_to(vault_root)
        if any(part in SKIP_ALWAYS for part in rel.parts[:-1]):
            continue
        rel_posix = rel.as_posix()
        if rel_posix.startswith(SKIP_PATH_PREFIXES) or (private and rel_posix.startswith(private)):
            continue
        yield path, rel_posix


def scan_vault(vault_root: Path, include_infra: bool = False, include_private: bool = False) -> dict:
    canonical = load_canonical(vault_root)
    private = () if include_private else load_privacy_prefixes(vault_root)
    # The target index deliberately still covers protected paths: it is built
    # from filenames only (never content), and excluding them would report every
    # `[[2026-07-16]]` link into a daily note as broken.
    targets, resolve = build_target_index(vault_root)
    unreadable = []

    # Pass 1 — read every note once, build the link graph.
    texts, outlinks, mtimes = {}, {}, {}
    backlinks = {}
    now = datetime.now(timezone.utc).timestamp()
    in_scope = {rel for _p, rel in iter_notes(vault_root, include_infra, private)}

    for path, rel in iter_all_markdown(vault_root, private):
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as exc:
            if rel in in_scope:
                unreadable.append({"path": rel, "error": str(exc)})
            continue
        links = extract_links(text)
        outlinks[rel] = links
        if rel in in_scope:
            texts[rel] = text
            mtimes[rel] = max(0.0, (now - path.stat().st_mtime) / 86400)
        for target, _line in links:
            dest = resolve.get(target.lower())
            if dest and dest != rel:
                backlinks.setdefault(dest, set()).add(rel)

    # Pass 2 — per-file checks, then graph checks, over in-scope notes only.
    findings, scanned, with_fm = [], 0, 0
    for rel in sorted(texts):
        text = texts[rel]
        scanned += 1
        file_findings = check_file(rel, text, canonical)
        if not any(f["check"] == "missing_frontmatter" for f in file_findings):
            with_fm += 1
        file_findings += graph_checks(rel, text, canonical, targets, backlinks, outlinks)
        file_findings += body_checks(rel, text, mtimes.get(rel, 0.0))
        findings.extend(file_findings)

    findings.sort(key=lambda f: (f["path"], f["check"], f["line"] or 0))
    counts = {check: 0 for check in SEVERITY}
    per_file = {}
    for f in findings:
        counts[f["check"]] += 1
        per_file[f["path"]] = per_file.get(f["path"], 0) + 1

    # Findings cluster hard — a handful of legacy files can hold half the total.
    # The agent must prioritise without counting anything itself, so hand it the
    # concentration directly.
    top_offenders = [
        {"path": p, "findings": n}
        for p, n in sorted(per_file.items(), key=lambda kv: (-kv[1], kv[0]))[:10]
    ]

    return {
        "scan_version": SCAN_VERSION,
        "phase": 3,
        "generated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "vault_root": str(vault_root),
        "scope": {
            "include_infra": include_infra,
            "include_private": include_private,
            "privacy_prefixes_skipped": list(private),
            "skipped_dirs": sorted(SKIP_ALWAYS if include_infra else SKIP_ALWAYS | SKIP_INFRA),
        },
        "canonical": {
            "enums": canonical["enums"],
            "renames": canonical["renames"],
            "field_order_length": len(canonical["field_order"]),
        },
        "stats": {
            "files_scanned": scanned,
            "files_with_frontmatter": with_fm,
            "files_unreadable": len(unreadable),
            "findings_total": len(findings),
            # Archive is legacy by definition and dominates raw totals; split it
            # out so the agent prioritises live notes instead of drowning in it.
            "findings_archive": sum(1 for f in findings if f["path"].startswith("06-Archive/")),
            "findings_live": sum(1 for f in findings if not f["path"].startswith("06-Archive/")),
        },
        "counts_by_check": counts,
        "counts_by_severity": {
            sev: sum(n for c, n in counts.items() if SEVERITY[c] == sev)
            for sev in ("error", "warn")
        },
        "top_offenders": top_offenders,
        "unreadable": unreadable,
        "findings": findings,
    }


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--root", help="Vault root (default: ORIGIN_VAULT or .obsidian walk-up)")
    parser.add_argument("--include-infra", action="store_true", help="Also scan Templates/, 99-System/, AIOS/")
    parser.add_argument("--include-private", action="store_true",
                        help="Also scan privacy-protected folders (requires the vault owner's intent)")
    parser.add_argument("--stdout", action="store_true", help="Print JSON instead of writing a dated file")
    parser.add_argument("--summary", action="store_true",
                        help="Print aggregates only (no findings list) — the ~2KB view for an agent")
    parser.add_argument("--check", metavar="NAME",
                        help="Print only findings for one check name, with aggregates")
    parser.add_argument("--out", help="Explicit output path")
    args = parser.parse_args(argv)

    try:
        root = Path(args.root).resolve() if args.root else resolve_vault_root()
        result = scan_vault(root, include_infra=args.include_infra, include_private=args.include_private)
    except (ScanError, RuntimeError) as exc:
        print(f"vault_scan: {exc}", file=sys.stderr)
        return 2

    # The full payload is ~100KB on this vault. An agent should pull the small
    # aggregate view first and itemise one check at a time, never swallow it all.
    if args.summary or args.check:
        view = {k: v for k, v in result.items() if k not in ("findings", "canonical")}
        if args.check:
            if args.check not in SEVERITY:
                print(f"vault_scan: unknown check {args.check!r}. Known: "
                      f"{', '.join(sorted(SEVERITY))}", file=sys.stderr)
                return 2
            view["findings"] = [f for f in result["findings"] if f["check"] == args.check]
            view["filtered_to_check"] = args.check
        print(json.dumps(view, ensure_ascii=False, indent=2))
        return 0

    payload = json.dumps(result, ensure_ascii=False, indent=2)
    if args.stdout:
        print(payload)
        return 0

    if args.out:
        out_path = Path(args.out)
    else:
        stamp = datetime.now().strftime("%Y-%m-%d")
        out_path = root / "AIOS" / "orchestration" / "health" / f"scan-{stamp}.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(payload, encoding="utf-8")

    s = result["stats"]
    print(f"Scanned {s['files_scanned']} notes → {s['findings_total']} findings")
    for check, n in sorted(result["counts_by_check"].items(), key=lambda kv: -kv[1]):
        if n:
            print(f"  {SEVERITY[check]:5} {check:30} {n}")
    print(f"Written: {out_path}")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.exit(main())
