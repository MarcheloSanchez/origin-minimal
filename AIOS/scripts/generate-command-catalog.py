"""Regenerate the command index table in AIOS/docs/Command Reference.md.

Reads every AIOS/runtime/commands/*.md frontmatter (description, argument-hint)
and rewrites the block between the GENERATED:COMMANDS markers. Hand-written
prose outside the markers is never touched. Also prints drift: commands on disk
missing from the doc body, and documented /commands with no file on disk.
Idempotent: running twice yields no diff. Run from repo root: python AIOS/scripts/generate-command-catalog.py
"""
import re, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
ROOT = Path(__file__).resolve().parents[2]
CMD_DIR = ROOT / "AIOS/runtime/commands"
DOC = ROOT / "AIOS/docs/Command Reference.md"
START, END = "<!-- GENERATED:COMMANDS:START -->", "<!-- GENERATED:COMMANDS:END -->"

rows, names = [], []
for f in sorted(CMD_DIR.glob("*.md")):
    text = f.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    fm = m.group(1) if m else ""
    desc = re.search(r"^description:\s*(.+)$", fm, re.M)
    hint = re.search(r"^argument-hint:\s*(.+)$", fm, re.M)
    name = f.stem
    names.append(name)
    rows.append("| `/%s` | %s | %s |" % (
        name,
        (desc.group(1).strip() if desc else "—").replace("|", "\\|"),
        (hint.group(1).strip() if hint else "—").replace("|", "\\|"),
    ))

table = "\n".join([
    START,
    "## Index (generated — edit runtime/commands frontmatter, then rerun generate-command-catalog.py)",
    "",
    "| Command | Description | Arguments |",
    "|---|---|---|",
    *rows,
    END,
])

doc = DOC.read_text(encoding="utf-8")
if START in doc and END in doc:
    new = re.sub(re.escape(START) + r".*?" + re.escape(END), lambda _: table, doc, flags=re.S)
else:
    print("ERROR: markers not found in Command Reference.md — insert them first.")
    sys.exit(1)
if new != doc:
    DOC.write_text(new, encoding="utf-8", newline="\n")
    print("Index regenerated: %d commands." % len(rows))
else:
    print("No changes: %d commands." % len(rows))

body = re.sub(re.escape(START) + r".*?" + re.escape(END), "", new, flags=re.S)
on_disk = set(names)
documented = set(re.findall(r"^### `/([\w-]+)", body, re.M))
for n in sorted(on_disk - documented):
    print("DRIFT: /%s exists on disk but has no ### section in the doc." % n)
for n in sorted(documented - on_disk):
    print("DRIFT: /%s documented but no file in runtime/commands/." % n)
