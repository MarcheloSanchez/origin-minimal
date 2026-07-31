"""Guard against emoji maturity/status literal drift across hand-duplicated scripts.

Parses the canonical enum values from 99-System/CIS/CIS_MATURITY.md and
CIS_STATUS.md, then regex-extracts every emoji maturity/status literal found
in the scripts that keep local copies of those stages. Reports any literal
that doesn't match a canonical value, and any canonical value missing from a
file that appears to declare a full stage list of its own.

Usage: python AIOS/scripts/check-enum-drift.py
Exit 0 = clean, exit 1 = drift found.
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[2]
CIS_DIR = ROOT / "99-System" / "CIS"
SCRIPTS_DIR = ROOT / "99-System" / "Scripts"

TARGET_FILES = [
    "auto-metadata.js",
    "maturity-evolve.js",
    "maturity-promoter.js",
    "yaml_orchestrator.js",
    "status_progression.js",
    "status-picker.js",
]

MATURITY_SUFFIXES = {"seed", "seedling", "sapling", "evergreen", "fruit"}
STATUS_SUFFIXES = {"inbox", "active", "waiting", "completed", "archived", "paused", "cancelled", "blocked"}

# Emoji ranges covering both symbol blocks (arrows/dingbats/misc) and the
# main emoji plane, plus U+FE0F (variation selector-16, e.g. the "️" in
# "⏸️paused"/"⚠️blocked") which trails many two-codepoint emoji, followed by
# the plain-ASCII stage/status word.
LITERAL_RE = re.compile(r'["\']([←-⯿\U0001F300-\U0001FAFF️]+)([a-zA-Z]+)["\']')


def load_canonical(filename):
    lines = (CIS_DIR / filename).read_text(encoding="utf-8").splitlines()
    return {line.strip() for line in lines if line.strip()}


def suffix_of(value):
    m = re.search(r"[a-zA-Z]+$", value)
    return m.group(0).lower() if m else ""


def main():
    maturity_canonical = load_canonical("CIS_MATURITY.md")
    status_canonical = load_canonical("CIS_STATUS.md")

    drift = []
    missing_reports = []

    for fname in TARGET_FILES:
        fpath = SCRIPTS_DIR / fname
        if not fpath.exists():
            continue
        text = fpath.read_text(encoding="utf-8")
        matches = LITERAL_RE.findall(text)
        literals = [emoji + word for emoji, word in matches]

        seen_maturity = set()
        seen_status = set()

        for lit in literals:
            suf = suffix_of(lit)
            if suf in MATURITY_SUFFIXES:
                if lit in maturity_canonical:
                    seen_maturity.add(lit)
                else:
                    drift.append((fname, lit, "maturity", suf))
            elif suf in STATUS_SUFFIXES:
                if lit in status_canonical:
                    seen_status.add(lit)
                else:
                    drift.append((fname, lit, "status", suf))

        # A file that names 3+ correctly-classified stages of one category
        # is treated as declaring a full local list — check for gaps.
        if len(seen_maturity) >= 3:
            missing = maturity_canonical - seen_maturity
            if missing:
                missing_reports.append((fname, "maturity", missing))
        if len(seen_status) >= 3:
            missing = status_canonical - seen_status
            if missing:
                missing_reports.append((fname, "status", missing))

    if not drift and not missing_reports:
        print("check-enum-drift: clean — no drift found.")
        return 0

    print("check-enum-drift: DRIFT FOUND")
    for fname, lit, category, suf in drift:
        print(f"  [{fname}] non-canonical {category} literal: {lit!r} (suffix {suf!r})")
    for fname, category, missing in missing_reports:
        print(f"  [{fname}] declares a {category} list but is missing: {sorted(missing)}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
