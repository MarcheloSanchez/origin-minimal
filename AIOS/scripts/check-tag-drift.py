"""Guard against tag drift from the canonical CIS_TAG.md whitelist.

Parses 99-System/CIS/CIS_TAG.md (## section headers + one tag per line,
some entries ending in "/*" meaning "any tag with this prefix is allowed"),
then scans every vault note's YAML `tags:` array for values that are neither
an exact canonical match nor covered by a wildcard prefix.

Read-only / detection-only — never edits files, never adds tags to CIS_TAG.md.
That decision (promote to canon, or fix as drift) is a human call.

Usage: python AIOS/scripts/check-tag-drift.py
Exit 0 = clean, exit 1 = unknown tags found.
"""
import os
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.path.insert(0, str(Path(__file__).resolve().parent))
from vault_resolver import resolve_vault_root  # noqa: E402

SKIP_DIRS = {".obsidian", ".trash", "node_modules"}


def load_canonical_tags(cis_tag_path):
    """Parse CIS_TAG.md into (exact_tags: set, wildcard_prefixes: list)."""
    exact = set()
    wildcards = []
    for line in cis_tag_path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("##"):
            continue
        if stripped.endswith("/*"):
            wildcards.append(stripped[:-1])  # keep trailing "/"
        else:
            exact.add(stripped)
    return exact, wildcards


def is_canonical(tag, exact, wildcards):
    if tag in exact:
        return True
    return any(tag.startswith(prefix) for prefix in wildcards)


def extract_tags(fm_text):
    """Parse tags from YAML frontmatter text (array or inline-list form)."""
    tags = []
    in_tags = False
    for line in fm_text.split("\n"):
        stripped = line.strip()
        if stripped.startswith("tags:"):
            rest = stripped[5:].strip()
            if rest.startswith("["):
                inner = rest.strip("[]")
                tags.extend(
                    t.strip().strip('"').strip("'")
                    for t in inner.split(",")
                    if t.strip()
                )
                in_tags = False
                continue
            elif rest and rest != "[]":
                tags.append(rest.strip('"').strip("'"))
            in_tags = True
            continue
        if in_tags:
            if stripped.startswith("- "):
                tag = stripped[2:].strip().strip('"').strip("'")
                if tag:
                    tags.append(tag)
            elif stripped == "" or stripped.startswith("-"):
                continue
            else:
                in_tags = False
    return tags


def parse_frontmatter(text):
    if not text.startswith("---"):
        return None
    end = text.find("\n---", 3)
    if end == -1:
        return None
    return text[3:end]


def main():
    try:
        vault = resolve_vault_root()
    except RuntimeError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    cis_tag_path = vault / "99-System" / "CIS" / "CIS_TAG.md"
    if not cis_tag_path.exists():
        print(f"ERROR: canonical tag file not found: {cis_tag_path}", file=sys.stderr)
        return 1

    exact, wildcards = load_canonical_tags(cis_tag_path)

    unknowns = []  # (rel_path, tag)
    total_files = 0

    for root, dirs, files in os.walk(vault):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fname in sorted(files):
            if not fname.endswith(".md"):
                continue
            filepath = Path(root) / fname
            try:
                content = filepath.read_text(encoding="utf-8")
            except (UnicodeDecodeError, PermissionError):
                continue

            fm_text = parse_frontmatter(content)
            if fm_text is None:
                continue

            total_files += 1
            for tag in extract_tags(fm_text):
                if not is_canonical(tag, exact, wildcards):
                    unknowns.append((filepath.relative_to(vault), tag))

    print(f"check-tag-drift: vault={vault}")
    print(f"check-tag-drift: {len(exact)} canonical tags, {len(wildcards)} wildcard prefixes, {total_files} notes scanned\n")

    if not unknowns:
        print("check-tag-drift: clean — no unknown tags found.")
        return 0

    print(f"check-tag-drift: {len(unknowns)} unknown tag uses found")
    for rel_path, tag in unknowns:
        print(f"  [{rel_path}] unknown tag: {tag!r}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
