#!/usr/bin/env python
"""Add/update quality_reviewed: TODAY in frontmatter for each path on stdin."""
import sys
import re

sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stdin.reconfigure(encoding='utf-8', errors='replace')
TODAY = "2026-07-08"

n = 0
for line in sys.stdin:
    path = line.strip()
    if not path:
        continue
    with open(path, encoding="utf-8") as f:
        text = f.read()
    if not text.startswith("---\n"):
        continue
    end = text.find("\n---\n", 4)
    if end == -1:
        continue
    fm = text[4:end]
    rest = text[end:]
    if re.search(r"^quality_reviewed:", fm, re.M):
        new_fm = re.sub(r"^quality_reviewed:.*$", f"quality_reviewed: {TODAY}", fm, flags=re.M)
    else:
        new_fm = fm.rstrip("\n") + f"\nquality_reviewed: {TODAY}"
    new_text = "---\n" + new_fm + rest
    if new_text != text:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(new_text)
        n += 1

print(f"marked {n} files")
