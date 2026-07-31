---
description: Read-only hotkey audit. Detects mismatches between documented hotkeys and .obsidian/hotkeys.json. Reports wrong bindings and undocumented hotkeys.
argument-hint: none
---

> [!info] Single-output audit
> This command produces one output: **Hotkey audit report** (`hotkey-audit-YYYY-MM-DD.md`) — all documented hotkey strings cross-referenced against the real bindings in `.obsidian/hotkeys.json`. Reports mismatches (documented hotkey is wrong or missing) and undocumented bindings (in hotkeys.json but not mentioned in docs). Read-only, no auto-fix.

Read-only reference audit over `.obsidian/hotkeys.json` and documentation files. No modifications to vault content.

## Task

Parse the ground truth hotkey bindings from `.obsidian/hotkeys.json`, scan documentation for hotkey string references, normalize both sides to a canonical form (sorted modifiers + key, uppercase), and cross-reference. Report every mismatch (documented hotkey X is wrong, actual binding is Y) and every undocumented binding (in hotkeys.json but not found in docs).

## Workflow

1. **Resolve vault root.** Use `git rev-parse --show-toplevel` to find the vault root. Confirm `.obsidian/hotkeys.json` exists; abort with a clear message if not.
2. **Pre-launch confirmation.** Print the following and wait for `y`/`yes` before proceeding:

   ```
   === /check-hotkeys — Ready to audit ===

   Ground truth:   .obsidian/hotkeys.json
   Documentation:  README.md · START HERE.md ·
                   99-System/Documentation/ (recursive) ·
                   AIOS/docs/ (recursive)
   Checks:         documented hotkeys vs actual bindings (both directions)
   Output:         AIOS/orchestration/reports/hotkey-audit-YYYY-MM-DD.md
   No vault content will be modified.

   Proceed? [y/N]
   ```

   If the user answers anything other than `y` or `yes`, abort cleanly.

3. **Run the Python audit script** via `python - << 'PYEOF'` (see script below). The script handles all parsing, normalization, cross-referencing, and report writing.
4. **Print a summary** to the user from the script's stdout.

## Python script

Execute via Bash:

```python
import json
import re
import subprocess
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Derive vault root
result = subprocess.run(
    ['git', 'rev-parse', '--show-toplevel'],
    capture_output=True, text=True, check=True
)
vault_root = Path(result.stdout.strip().replace('\\', '/'))

hotkeys_path = vault_root / '.obsidian' / 'hotkeys.json'
if not hotkeys_path.exists():
    print(f"ERROR: {hotkeys_path} not found")
    sys.exit(1)

# --- Normalization helpers ---

ARROW_MAP = {'←': 'ArrowLeft', '→': 'ArrowRight', '↑': 'ArrowUp', '↓': 'ArrowDown'}

def normalize_key(key):
    if key in ARROW_MAP:
        return ARROW_MAP[key]
    return key.upper() if len(key) <= 2 else key

def normalize_mod(mod):
    if mod.lower() in ('mod', 'ctrl'):
        return 'Ctrl'
    if mod.lower() == 'alt':
        return 'Alt'
    if mod.lower() == 'shift':
        return 'Shift'
    if mod.lower() in ('meta', 'cmd'):
        return 'Meta'
    return mod

def normalize_binding(modifiers, key):
    """Convert JSON binding fields to canonical form."""
    mods = sorted(normalize_mod(m) for m in modifiers)
    return '+'.join(mods + [normalize_key(key)])

def normalize_hotkey_string(hotkey_str):
    """Parse and normalize a documented hotkey string like 'Ctrl+Shift+I'."""
    parts = hotkey_str.split('+')
    mod_tokens = {'ctrl', 'mod', 'alt', 'shift', 'meta', 'cmd'}
    mods = []
    key = None
    for part in parts:
        if part.lower() in mod_tokens:
            mods.append(normalize_mod(part))
        else:
            key = normalize_key(part)
    if key is None:
        return hotkey_str  # malformed — return as-is
    mods.sort()
    return '+'.join(mods + [key])

# --- Parse hotkeys.json ---

with open(hotkeys_path, 'r', encoding='utf-8') as f:
    hotkeys_raw = json.load(f)

canonical_bindings = defaultdict(list)
for cmd_id, binding_list in hotkeys_raw.items():
    for binding in binding_list:
        norm = normalize_binding(binding.get('modifiers', []), binding.get('key', ''))
        canonical_bindings[norm].append(cmd_id)

# --- Scan documentation ---

HOTKEY_RE = re.compile(
    r'\b(?:Ctrl|Mod|Alt|Shift|Cmd|Meta)(?:\+(?:Ctrl|Alt|Shift|Meta|Cmd|'
    r'[A-Za-z0-9]|←|→|↑|↓|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|'
    r'Backspace|Enter|Delete|Tab|Escape|F\d+))+\b',
    re.IGNORECASE
)

doc_targets = [
    vault_root / 'README.md',
    vault_root / 'START HERE.md',
    vault_root / '99-System' / 'Documentation',
    vault_root / 'AIOS' / 'docs',
]

documented = defaultdict(list)  # {normalized: [(file, original_str)]}

def scan_file(path):
    try:
        content = path.read_text(encoding='utf-8', errors='ignore')
        for match in HOTKEY_RE.finditer(content):
            raw = match.group(0)
            norm = normalize_hotkey_string(raw)
            documented[norm].append((str(path.relative_to(vault_root)), raw))
    except Exception:
        pass

for target in doc_targets:
    if target.is_file():
        scan_file(target)
    elif target.is_dir():
        for md in target.rglob('*.md'):
            scan_file(md)

# --- Cross-reference ---

mismatches = []
for norm, occurrences in documented.items():
    if norm not in canonical_bindings:
        for file_rel, original in occurrences:
            mismatches.append({'documented': original, 'canonical': norm, 'file': file_rel})

undocumented = []
for norm, cmds in canonical_bindings.items():
    if norm not in documented:
        undocumented.append({'binding': norm, 'commands': cmds})

# --- Write report ---

today = datetime.now().strftime('%Y-%m-%d')
report_path = vault_root / 'AIOS' / 'orchestration' / 'reports' / f'hotkey-audit-{today}.md'
report_path.parent.mkdir(parents=True, exist_ok=True)

lines = []
lines.append(f'---')
lines.append(f'title: Hotkey Audit {today}')
lines.append(f'type: system')
lines.append(f'created: {today}')
lines.append(f'modified: {today}')
lines.append(f'---')
lines.append(f'')
lines.append(f'# Hotkey Audit — {today}')
lines.append(f'')
lines.append(f'Ground truth: `.obsidian/hotkeys.json`  ')
lines.append(f'Docs scanned: README.md · START HERE.md · 99-System/Documentation/ · AIOS/docs/')
lines.append(f'')
lines.append(f'| | Count |')
lines.append(f'|---|---|')
lines.append(f'| Bindings in hotkeys.json | {len(canonical_bindings)} |')
lines.append(f'| Unique hotkey strings found in docs | {len(documented)} |')
lines.append(f'| Mismatches (wrong/missing in docs) | {len(mismatches)} |')
lines.append(f'| Undocumented bindings | {len(undocumented)} |')
lines.append(f'')

if mismatches:
    lines.append(f'## Mismatches — documented hotkeys not found in hotkeys.json')
    lines.append(f'')
    seen = set()
    for m in mismatches:
        key = (m['canonical'], m['file'])
        if key in seen:
            continue
        seen.add(key)
        lines.append(f'- **`{m["documented"]}`** → not in hotkeys.json')
        lines.append(f'  - File: `{m["file"]}`')
    lines.append(f'')
else:
    lines.append(f'## Mismatches')
    lines.append(f'')
    lines.append(f'✓ No mismatches found.')
    lines.append(f'')

if undocumented:
    lines.append(f'## Undocumented — bindings in hotkeys.json not mentioned in docs')
    lines.append(f'')
    for u in sorted(undocumented, key=lambda x: x['binding']):
        cmds = ', '.join(u['commands'])
        lines.append(f'- **`{u["binding"]}`** — `{cmds}`')
    lines.append(f'')
else:
    lines.append(f'## Undocumented')
    lines.append(f'')
    lines.append(f'✓ All bindings in hotkeys.json are documented.')
    lines.append(f'')

report_path.write_text('\n'.join(lines), encoding='utf-8')

print(f"✓ Report written: AIOS/orchestration/reports/hotkey-audit-{today}.md")
print(f"  Mismatches (wrong/missing): {len(mismatches)}")
print(f"  Undocumented bindings:      {len(undocumented)}")
```

## Hard constraints

1. **Do NOT modify any vault content.** Only the hotkey audit report is written.
2. **Do NOT read `.obsidian/` beyond `hotkeys.json`.** No plugin configs or workspace files.
3. **Normalize both sides consistently** — same canonical form (sorted modifiers + key, uppercase) for JSON bindings and doc strings before comparing.
4. **Handle arrow key aliases** — Unicode arrows (`←`) and literal names (`ArrowLeft`) normalize identically.
5. **`Mod` normalizes to `Ctrl`** on Windows — both in JSON and docs.
6. **Case-insensitive input** — `ctrl+shift+i` and `Ctrl+Shift+I` normalize the same.
7. **Report both directions** — mismatches (wrong docs) AND undocumented bindings (missing from docs).
8. **Dedup occurrences** — the same wrong hotkey in the same file counts once per file, not per match.

## After writing

Tell the user:

- Report path
- Mismatch count: documented hotkeys not found in hotkeys.json (need doc fixes)
- Undocumented count: bindings in hotkeys.json with no doc mention (informational)
- Top recommendations: e.g. "Update docs for N hotkeys · `/fix-note README.md` for the incorrect strings"
