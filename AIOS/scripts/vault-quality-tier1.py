#!/usr/bin/env python
"""Tier 1 deterministic fixes for /vault-quality-pass (2026-07-08 run).
Reads file list from stdin (one relative path per line), applies only the
Tier 1 checks defined in the vault-quality-pass skill, writes changes,
and prints a per-file change log plus a Tier2/Tier3 detection report as JSON.
"""
import sys
import re
import json
from datetime import date

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stdin.reconfigure(encoding='utf-8', errors='replace')
TODAY = "2026-07-08"

STATUS_MAP = {
    "active": "🔄active", "completed": "✅completed", "archived": "📦archived",
    "inbox": "📥inbox", "waiting": "⏳waiting", "paused": "⏸️paused",
    "cancelled": "❌cancelled", "blocked": "⚠️blocked",
}

FOOTER_STANDARD = "⬆️ [[🏡Home]]  *| `= this.file.mtime`*"

def split_frontmatter(text):
    if not text.startswith("---\n"):
        return None, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return None, text
    fm = text[4:end]
    body = text[end+5:]
    return fm, body

def process(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    orig = text
    changes = []

    fm, body = split_frontmatter(text)
    if fm is None:
        return None  # no frontmatter, skip Tier1 YAML fixes

    fm_lines = fm.split("\n")
    new_fm_lines = []
    for line in fm_lines:
        m = re.match(r"^deadline:(\s*)(.*)$", line)
        if m:
            new_fm_lines.append(f"due:{m.group(1)}{m.group(2)}")
            changes.append("deadline->due")
            continue
        m = re.match(r"^relatedNotes:(\s*)(.*)$", line)
        if m:
            new_fm_lines.append(f"related:{m.group(1)}{m.group(2)}")
            changes.append("relatedNotes->related")
            continue
        m = re.match(r"^status:\s*(\S+)\s*$", line)
        if m and m.group(1) in STATUS_MAP:
            new_fm_lines.append(f"status: {STATUS_MAP[m.group(1)]}")
            changes.append(f"status:{m.group(1)}->{STATUS_MAP[m.group(1)]}")
            continue
        m = re.match(r"^maturity:\s*🌱seed\s*$", line)
        if m:
            new_fm_lines.append("maturity: 📤seed")
            changes.append("maturity:🌱seed->📤seed")
            continue
        new_fm_lines.append(line)
    fm = "\n".join(new_fm_lines)

    # missing modified
    if not re.search(r"^modified:", fm, re.M):
        fm = fm.rstrip("\n") + f"\nmodified: {TODAY}"
        changes.append("added modified")

    # escaped pipe wikilinks in body
    new_body, n = re.subn(r"\[\[([^\]|]+)\\\|([^\]]+)\]\]", r"[[\1|\2]]", body)
    if n:
        body = new_body
        changes.append(f"unescaped {n} pipe wikilink(s)")

    has_orbit = bool(re.search(r"^\s*>\s*\[!orbit\]", body, re.M))

    # inline up-field cleanup when orbit present
    if has_orbit:
        new_body2, n2 = re.subn(r"^⬆️::\s*\[\[.*?\]\]\s*\n?", "", body, flags=re.M)
        if n2:
            body = new_body2
            changes.append(f"removed {n2} redundant ⬆️:: line(s)")

    # blank line before orbit callout: body starts (after fm) directly with orbit line
    stripped = body.lstrip("\n")
    if stripped.startswith("> [!orbit]") and body != ("\n" + stripped):
        # body currently has no blank line between --- and orbit
        if not body.startswith("\n\n"):
            body = "\n" + stripped
            changes.append("inserted blank line before orbit")

    # footer check
    body_rstripped = body.rstrip("\n")
    lines_nonempty = [l for l in body_rstripped.split("\n")]
    last_line = lines_nonempty[-1] if lines_nonempty else ""
    if last_line.strip() == FOOTER_STANDARD:
        pass
    elif "this.file.mtime" in last_line or ("⬆️" in last_line and "🏡Home" in last_line):
        # stale footer variant -> rewrite
        lines_nonempty[-1] = FOOTER_STANDARD
        body = "\n".join(lines_nonempty) + "\n"
        changes.append("rewrote stale footer")
    elif "🏡Home" in body_rstripped and "this.file.mtime" in body_rstripped:
        pass
    else:
        body = body_rstripped + "\n\n" + FOOTER_STANDARD + "\n"
        changes.append("appended missing footer")

    new_text = "---\n" + fm + "\n---\n" + body
    if new_text != orig:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(new_text)

    # Tier2/3 detection (read-only, on the (possibly updated) content)
    detect = {}
    fm_final = new_text.split("\n---\n", 1)[0][4:] if new_text.startswith("---\n") else ""
    detect["has_up"] = bool(re.search(r"^up:\s*\S", fm_final, re.M))
    up_match = re.search(r'^up:\s*"?\[\[([^\]|]+)', fm_final, re.M)
    detect["up_target"] = up_match.group(1) if up_match else None
    detect["has_orbit"] = bool(re.search(r"^\s*>\s*\[!orbit\]", body, re.M))
    orbit_line = re.search(r"^\s*>\s*\[!orbit\].*$", body, re.M)
    detect["orbit_line"] = orbit_line.group(0) if orbit_line else None
    related_match = re.search(r"^related:\s*(\[\s*\])?\s*$", fm_final, re.M)
    has_related_items = bool(re.search(r"^related:\n(\s*-\s*.+\n?)+", fm_final, re.M)) or bool(re.search(r'^related:\s*\[.+\]', fm_final, re.M))
    detect["related_empty"] = (not has_related_items)
    detect["tags_empty"] = bool(re.search(r"^tags:\s*(\[\s*\])?\s*$", fm_final, re.M)) and not re.search(r"^tags:\n(\s*-\s*.+\n?)+", fm_final, re.M)
    maturity_match = re.search(r"^maturity:\s*(\S+)", fm_final, re.M)
    detect["maturity"] = maturity_match.group(1) if maturity_match else None
    type_match = re.search(r"^type:\s*(\S+)", fm_final, re.M)
    detect["type"] = type_match.group(1) if type_match else None
    status_match = re.search(r"^status:\s*(\S+)", fm_final, re.M)
    detect["status"] = status_match.group(1) if status_match else None
    body_text_only = re.sub(r"^---[\s\S]*?---\n", "", new_text)
    body_text_only = re.sub(r"```[\s\S]*?```", "", body_text_only)
    body_text_only = re.sub(r"[#>\-\|\[\]!*`]", " ", body_text_only)
    words = body_text_only.split()
    detect["word_count"] = len(words)
    detect["heading_count"] = len(re.findall(r"^#{1,6}\s", body, re.M))

    return {"path": path, "changes": changes, "detect": detect}

results = []
for line in sys.stdin:
    p = line.strip()
    if not p:
        continue
    r = process(p)
    if r:
        results.append(r)

print(json.dumps(results, ensure_ascii=False, indent=1))
