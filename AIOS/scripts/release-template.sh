#!/bin/bash
# release-template.sh — Template Release Scrub (Stages 1–4)
#
# Prepares an Origin vault folder copy for distribution as a clean template.
# Implements the "Template Release Scrub" from Vault Bootstrap Protocol.
#
# Usage:
#   bash AIOS/scripts/release-template.sh <VAULT_PATH>           # preview then confirm
#   bash AIOS/scripts/release-template.sh <VAULT_PATH> --dry-run # preview only, no changes
#
# ⛔ NEVER run this inside the dev/migration repo.
#    Always point it at an external vault path (e.g. C:/Users/.../Origin-v2.0).
#
# Stages:
#   1 — Personal content (delete)
#   2 — AI / session exhaust (delete)
#   3 — Caches & junk (delete)
#   4 — Reset to fresh identity (blank / rename)

set -euo pipefail

# ── Args ──────────────────────────────────────────────────────────────────────
VAULT="${1:-}"
DRY_RUN="${2:-}"

if [ -z "$VAULT" ]; then
  echo "Error: vault path required."
  echo "Usage: $0 <VAULT_PATH> [--dry-run]"
  exit 1
fi

if [ ! -d "$VAULT" ]; then
  echo "Error: '$VAULT' is not a directory."
  exit 1
fi

# Guard: refuse to run inside this script's own repo
SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT_ABS="$(cd "$VAULT" && pwd)"
if [ "$VAULT_ABS" = "$(cd "$SELF_DIR/../.." && pwd)" ]; then
  echo "Error: refusing to run on the dev/migration repo itself."
  echo "Point VAULT_PATH at a copy/target vault, not this source repo."
  exit 1
fi

VAULT_NAME="$(basename "$VAULT_ABS" | tr '-' ' ' | tr '_' ' ')"
TODAY=$(date +%Y-%m-%d)
APPLY=false   # set to true during the apply pass

# ── Action collector ──────────────────────────────────────────────────────────
ACTIONS=()    # (type, description, key) tuples encoded as "TYPE|DESC|KEY"
              # KEY is used by the apply pass to know what to do

record() {    # record <type> <desc> [<key>]
  ACTIONS+=("$1|$2|${3:-}")
}

# ── Per-stage work ─────────────────────────────────────────────────────────────
# Called twice: once with APPLY=false (collect), once with APPLY=true (execute).
# Every destructive operation is guarded by $APPLY.

run_all_stages() {

# ─── Stage 1 — Personal content ──────────────────────────────────────────────

  # 05-Calendar subfolders
  for subdir in "05-Calendar/Daily" "05-Calendar/Sessions" "05-Calendar/Weekly" \
                "05-Calendar/Monthly" "05-Calendar/Quarterly" "05-Calendar/Yearly" "05-Calendar/_Logs"; do
    if [ -d "$VAULT/$subdir" ]; then
      count=$(find "$VAULT/$subdir" -mindepth 1 | wc -l)
      if [ "$count" -gt 0 ]; then
        record DEL "$subdir/* ($count items)"
        if $APPLY; then
          rm -rf "$VAULT/$subdir"
          mkdir -p "$VAULT/$subdir"
        fi
      fi
    fi
  done

  # 06-Archive subfolders — check on-disk names
  if [ -d "$VAULT/06-Archive" ]; then
    while IFS= read -r -d '' entry; do
      fname="$(basename "$entry")"
      [[ "$fname" == +About* ]] && continue
      [[ "$fname" == "06-Archive.md" ]] && continue
      if [ -d "$entry" ]; then
        count=$(find "$entry" -mindepth 1 | wc -l)
        if [ "$count" -gt 0 ]; then
          record DEL "06-Archive/$fname/* ($count items)"
          if $APPLY; then
            find "$entry" -mindepth 1 -exec rm -rf {} + 2>/dev/null || true
          fi
        fi
      fi
    done < <(find "$VAULT/06-Archive" -maxdepth 1 -mindepth 1 -print0)
  fi

  # +Inbox — keep +About*, +Inbox.md, _Inbox_Data.base, .gitkeep
  if [ -d "$VAULT/+Inbox" ]; then
    while IFS= read -r -d '' entry; do
      fname="$(basename "$entry")"
      [[ "$fname" == +About* ]] && continue
      [[ "$fname" == "+Inbox.md" ]] && continue
      [[ "$fname" == "_Inbox_Data.base" ]] && continue
      [[ "$fname" == ".gitkeep" ]] && continue
      record DEL "+Inbox/$fname"
      if $APPLY; then rm -rf "$entry"; fi
    done < <(find "$VAULT/+Inbox" -maxdepth 1 -mindepth 1 -print0)
  fi

  # Root identity/planning files
  for f in "Me.md" "Me — Profile.md" "TODO.md" "TASKS.md" "FINDINGS.md"; do
    if [ -f "$VAULT/$f" ]; then
      record DEL "$f"
      if $APPLY; then rm -f "$VAULT/$f"; fi
    fi
  done

  # BACKLOG.md — keep file, empty the body content
  if [ -f "$VAULT/BACKLOG.md" ]; then
    record MOD "BACKLOG.md  ← empty content, keep file"
    if $APPLY; then
      echo "" > "$VAULT/BACKLOG.md"
    fi
  fi

  # .smart-env — whole delete
  if [ -d "$VAULT/.smart-env" ]; then
    count=$(find "$VAULT/.smart-env" -mindepth 1 | wc -l)
    record DEL ".smart-env/ ($count files) — regenerates on open"
    if $APPLY; then rm -rf "$VAULT/.smart-env"; fi
  fi

# ─── Stage 2 — AI / session exhaust ──────────────────────────────────────────

  # AIOS orchestration queue + proposed → keep only .gitkeep
  for dir in "AIOS/orchestration/queue" "AIOS/orchestration/proposed"; do
    if [ -d "$VAULT/$dir" ]; then
      count=$(find "$VAULT/$dir" -mindepth 1 ! -name ".gitkeep" | wc -l)
      if [ "$count" -gt 0 ]; then
        record DEL "$dir/* ($count items, keep .gitkeep)"
        if $APPLY; then
          find "$VAULT/$dir" -mindepth 1 ! -name ".gitkeep" -exec rm -rf {} + 2>/dev/null || true
          touch "$VAULT/$dir/.gitkeep"
        fi
      fi
    fi
  done

  # AIOS orchestration logs
  if [ -d "$VAULT/AIOS/orchestration/logs" ]; then
    count=$(find "$VAULT/AIOS/orchestration/logs" -mindepth 1 | wc -l)
    if [ "$count" -gt 0 ]; then
      record DEL "AIOS/orchestration/logs/** ($count items)"
      if $APPLY; then
        find "$VAULT/AIOS/orchestration/logs" -mindepth 1 -exec rm -rf {} + 2>/dev/null || true
      fi
    fi
  fi

  # AIOS session notes → strip (personal content)
  for dir in "AIOS/memory/sessions"; do
    if [ -d "$VAULT/$dir" ]; then
      count=$(find "$VAULT/$dir" -mindepth 1 ! -name ".gitkeep" | wc -l)
      if [ "$count" -gt 0 ]; then
        record DEL "$dir/* ($count items)"
        if $APPLY; then
          find "$VAULT/$dir" -mindepth 1 ! -name ".gitkeep" -exec rm -rf {} + 2>/dev/null || true
          touch "$VAULT/$dir/.gitkeep"
        fi
      fi
    fi
  done

  # AIOS runtime local config
  for f in "AIOS/runtime/settings.local.json" "AIOS/runtime/.privacy-unlock"; do
    if [ -f "$VAULT/$f" ]; then
      record DEL "$f"
      if $APPLY; then rm -f "$VAULT/$f"; fi
    fi
  done

  # AIOS docs design artifacts
  for dir in "AIOS/docs/plans" "AIOS/docs/specs" "AIOS/docs/adr" "AIOS/docs/gpts"; do
    if [ -d "$VAULT/$dir" ]; then
      count=$(find "$VAULT/$dir" -mindepth 1 | wc -l)
      if [ "$count" -gt 0 ]; then
        record DEL "$dir/** ($count items)"
        if $APPLY; then
          find "$VAULT/$dir" -mindepth 1 -exec rm -rf {} + 2>/dev/null || true
        fi
      fi
    fi
  done

  # Dated audit/report files in 99-System/Documentation/
  DOC_DIR="$VAULT/99-System/Documentation"
  if [ -d "$DOC_DIR" ]; then
    while IFS= read -r -d '' f; do
      fname="$(basename "$f")"
      if echo "$fname" | grep -qE \
        '^vault-lint-[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$|^Vault Simulation Report|^subscription-tracking-summary-|^archive-process-open-questions-|.*-template-audit\.md$'; then
        record DEL "99-System/Documentation/$fname"
        if $APPLY; then rm -f "$f"; fi
      fi
    done < <(find "$DOC_DIR" -maxdepth 2 -name "*.md" -print0)
  fi

# ─── Stage 3 — Caches & junk ─────────────────────────────────────────────────

  for junk in ".pytest_cache" "__pycache__" ".trash"; do
    if [ -d "$VAULT/$junk" ]; then
      record DEL "$junk/"
      if $APPLY; then rm -rf "$VAULT/$junk"; fi
    fi
  done

  bak_count=$(find "$VAULT" \( -name "*.bak" -o -name "*.bak.*" \) 2>/dev/null | wc -l)
  if [ "$bak_count" -gt 0 ]; then
    record DEL "**/*.bak / *.bak.* ($bak_count files)"
    if $APPLY; then
      find "$VAULT" \( -name "*.bak" -o -name "*.bak.*" \) -exec rm -f {} + 2>/dev/null || true
    fi
  fi

  # .claude/ junction shell — only if it is truly empty (the dangling junction after a folder copy)
  if [ -d "$VAULT/.claude" ]; then
    claude_count=$(find "$VAULT/.claude" -mindepth 1 2>/dev/null | wc -l)
    if [ "$claude_count" -eq 0 ]; then
      record DEL ".claude/ (empty junction shell)"
      if $APPLY; then rmdir "$VAULT/.claude" 2>/dev/null || true; fi
    else
      record SKIP ".claude/ not empty ($claude_count items) — inspect manually"
    fi
  fi

# ─── Stage 4 — Reset identity ────────────────────────────────────────────────

  # RELEASE NOTES.md — consolidate CHANGELOG entries then finalize
  # Runs BEFORE CHANGELOG is cleared so we can read its content.
  if [ -f "$VAULT/RELEASE NOTES.md" ]; then
    record MOD "RELEASE NOTES.md  ← consolidate CHANGELOG entries, finalize v2.0.0"
    if $APPLY; then
      python - << PYEOF
import re, sys, os
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

cl_path = r"$VAULT/CHANGELOG.md"
rn_path = r"$VAULT/RELEASE NOTES.md"
vault_name = r"$VAULT_NAME"
today = r"$TODAY"

# ── Extract CHANGELOG entries (everything below the [!info] callout) ──
cl_entries = ''
if os.path.exists(cl_path):
    with open(cl_path, encoding='utf-8') as f:
        cl_lines = f.read().split('\n')
    callout_end = 0
    in_callout = False
    for i, line in enumerate(cl_lines):
        if line.strip().startswith('> [!info]'):
            in_callout = True
        if in_callout:
            if line.startswith('>') or not line.strip():
                callout_end = i
            elif line.strip():
                break
    entry_lines = cl_lines[callout_end + 1:]
    while entry_lines and not entry_lines[0].strip():
        entry_lines.pop(0)
    cl_entries = '\n'.join(entry_lines).strip()

# ── Read & update RELEASE NOTES ──────────────────────────────────────
with open(rn_path, encoding='utf-8') as f:
    rn = f.read()

# Frontmatter
rn = re.sub(r'^title:.*$', f'title: "{vault_name} Release Notes"', rn, flags=re.MULTILINE)
rn = re.sub(r'^modified:.*$', f'modified: {today}', rn, flags=re.MULTILINE)

# Header metadata block
rn = re.sub(r'\*\*Last Updated:\*\*.*', f'**Last Updated:** {today}', rn)

# Finalize v2.0.0 header (remove "in flight")
rn = re.sub(r'## \[v2\.0\.0\] – TBD \(in flight\)\n', f'## [v2.0.0] – {today}\n', rn)
rn = re.sub(r'\n> \*\*Status:\*\*[^\n]+\n', '\n', rn)

# Insert CHANGELOG entries into the v2.0.0 section
if cl_entries:
    block = f'\n---\n\n### Changelog entries\n\n{cl_entries}\n\n'
    # Inject before the first dated subsection (### 🗓️ ...) inside v2.0.0
    m = re.search(r'\n---\n\n### 🗓️', rn)
    if m:
        rn = rn[:m.start()] + block + '### 🗓️' + rn[m.end():]
    else:
        # Fallback: before the v1.x section
        m2 = re.search(r'\n## \[v1\.', rn)
        if m2:
            rn = rn[:m2.start()] + '\n' + block + rn[m2.start():]
        else:
            rn += '\n' + block

with open(rn_path, 'w', encoding='utf-8') as f:
    f.write(rn)
PYEOF
    fi
  fi

  # CHANGELOG.md — clear entries after consolidation into RELEASE NOTES
  if [ -f "$VAULT/CHANGELOG.md" ]; then
    record MOD "CHANGELOG.md  ← title='$VAULT_NAME', Version=1.0.0, truncate entries"
    if $APPLY; then
      python - << PYEOF
import re, sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
path = r"$VAULT/CHANGELOG.md"
vault_name = r"$VAULT_NAME"
with open(path, encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'^title:.*$', f'title: "{vault_name} Changelog"', content, flags=re.MULTILINE)
content = re.sub(r'^Version:.*$', 'Version: 1.0.0', content, flags=re.MULTILINE)
lines = content.split('\n')
in_callout = False
cut_at = None
for i, line in enumerate(lines):
    if '> [!info]' in line:
        in_callout = True
    if in_callout and line.startswith('>'):
        cut_at = i
    elif in_callout and not line.startswith('>') and line.strip():
        break
if cut_at is not None:
    lines = lines[:cut_at + 1]
    lines += ['', '<!-- entries go below, oldest at top -->', '']
with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
PYEOF
    fi
  fi

  # _Metrics Cache.md — zero all inline field counts
  METRICS="$VAULT/99-System/_Metrics Cache.md"
  if [ -f "$METRICS" ]; then
    record MOD "99-System/_Metrics Cache.md  ← zero all inline counts"
    if $APPLY; then
      sed -i -E 's/^([a-z_]+::) [0-9]+$/\1 0/' "$METRICS"
    fi
  fi

  # AIOS/memory/hot.md
  HOT="$VAULT/AIOS/memory/hot.md"
  if [ -f "$HOT" ]; then
    record MOD "AIOS/memory/hot.md  ← reset to fresh vault brief"
    if $APPLY; then
      python - << PYEOF
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
path = r"$HOT"
vault_name = r"$VAULT_NAME"
today = r"$TODAY"
with open(path, encoding='utf-8') as f:
    content = f.read()
fm = ''
if content.startswith('---'):
    end = content.index('---', 3) + 3
    fm = content[:end]
new_body = f"""
# Hot Context — {vault_name}

> Rolling cache of recent project state. Newest entry on top.

## Recent

- **{today}** — Fresh vault. Initialized from Origin v2.0 template.
"""
with open(path, 'w', encoding='utf-8') as f:
    f.write(fm + new_body if fm else new_body)
PYEOF
    fi
  fi

  # README.md — update H1, strip sandbox banners
  if [ -f "$VAULT/README.md" ]; then
    record MOD "README.md  ← H1 → '$VAULT_NAME', strip sandbox banners"
    if $APPLY; then
      sed -i "0,/^# .*/{s/^# .*/# $VAULT_NAME/}" "$VAULT/README.md"
      sed -i '/^> ⚠️/d; /^# ⚠️ SANDBOX/d' "$VAULT/README.md"
      sed -i '/throwaway test vault/Id; /DEV is source of truth/Id' "$VAULT/README.md"
    fi
  fi

  # CLAUDE.md — strip sandbox banners
  if [ -f "$VAULT/CLAUDE.md" ]; then
    record MOD "CLAUDE.md  ← strip sandbox banners"
    if $APPLY; then
      sed -i '/^# ⚠️ SANDBOX/d; /^> ⚠️/d' "$VAULT/CLAUDE.md"
      sed -i '/throwaway test vault/Id; /DEV is source of truth/Id' "$VAULT/CLAUDE.md"
    fi
  fi

  # .obsidian layout files — personal pane state
  for f in ".obsidian/workspace.json" ".obsidian/bookmarks.json"; do
    if [ -f "$VAULT/$f" ]; then
      record DEL "$f  (personal pane layout)"
      if $APPLY; then rm -f "$VAULT/$f"; fi
    fi
  done

  # Git remote — remove inherited remote
  if [ -d "$VAULT/.git" ]; then
    remote=$(cd "$VAULT" && git remote 2>/dev/null | head -1 || true)
    if [ -n "$remote" ]; then
      remote_url=$(cd "$VAULT" && git remote get-url "$remote" 2>/dev/null || echo "unknown")
      record GIT "remove remote '$remote' → $remote_url"
      if $APPLY; then (cd "$VAULT" && git remote remove "$remote"); fi
    fi
  fi

} # end run_all_stages

# ── Pass 1: collect preview ───────────────────────────────────────────────────
echo ""
echo "================================================"
echo " Origin Template Release Scrub — $TODAY"
echo " Target vault : $VAULT_ABS"
echo " Vault name   : $VAULT_NAME"
echo " Mode         : ${DRY_RUN:-interactive}"
echo "================================================"
echo ""
echo "Scanning vault..."

APPLY=false
run_all_stages

echo ""
echo "════════════════════════════════════════════════"
printf " Preview — %d actions\n" "${#ACTIONS[@]}"
echo "════════════════════════════════════════════════"
for action in "${ACTIONS[@]}"; do
  type="${action%%|*}"
  rest="${action#*|}"
  desc="${rest%%|*}"
  printf "  %-4s  %s\n" "$type" "$desc"
done
echo ""

if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "✅ DRY RUN complete. No files were changed."
  echo "   Run without --dry-run to apply."
  exit 0
fi

# ── Confirm ───────────────────────────────────────────────────────────────────
echo "⚠️  This will permanently DELETE and MODIFY files in:"
echo "   $VAULT_ABS"
echo ""
printf "   Type 'yes' to proceed: "
read -r answer
if [ "$answer" != "yes" ]; then
  echo "Aborted."
  exit 0
fi

# ── Pass 2: apply ─────────────────────────────────────────────────────────────
echo ""
echo "Applying..."
APPLY=true
run_all_stages

echo ""
echo "================================================"
echo " Done. ${#ACTIONS[@]} actions applied."
echo " Vault name set to: $VAULT_NAME"
echo ""
echo " Remaining manual steps (not automated):"
echo "   Phase 1  — recreate .claude/ junction (per-machine)"
echo "   Phase 5  — enable Obsidian plugins"
echo "   Phase 6  — verify dashboards + create a test note"
echo "   Stage 6  — review 02-Knowledge/ real notes (human judgment)"
echo "   Stage 7  — search for personal name/email before shipping"
echo "================================================"
