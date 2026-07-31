#!/bin/bash
# vault-morning.sh — daily Origin vault maintenance pipeline
#
# Usage:
#   bash AIOS/scripts/vault-morning.sh            # live mode
#   bash AIOS/scripts/vault-morning.sh --dry-run  # report only, no writes
#
# Steps:
#   1. Inbox triage — classify and move non-captures
#   2. Metrics cache refresh — update _Metrics Cache.md inline fields
#
# Commit is always MANUAL — review git diff before committing.

set -e

# Derive vault root from this script's location (AIOS/scripts/ → two levels up)
# so the script always targets the vault it lives in, not a hardcoded path.
VAULT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DRY_RUN="${1:-}"
TODAY=$(date +%Y-%m-%d)

# Validate argument
if [ -n "$DRY_RUN" ] && [ "$DRY_RUN" != "--dry-run" ]; then
  echo "Error: unknown argument '$DRY_RUN'"
  echo "Usage: $0 [--dry-run]"
  exit 1
fi

echo ""
echo "================================================"
echo " Origin Vault Morning Maintenance — $TODAY"
echo " Mode: $([ "$DRY_RUN" = "--dry-run" ] && echo "DRY RUN" || echo "LIVE")"
echo "================================================"
echo ""

cd "$VAULT"

# ── SAFEGUARD: stash uncommitted changes ─────────────────────────────────────
# Only stash if there are staged (indexed) changes — working tree modifications
# from normal vault use are fine to leave in place.
STAGED=$(git diff --cached --name-only)
if [ -n "$STAGED" ]; then
  echo "⚠️  Staged changes detected. Stashing before proceeding..."
  git stash push -m "vault-morning auto-stash $TODAY"
  echo "   Stash created. Run 'git stash pop' after reviewing to restore."
  echo ""
fi

# ── STEP 1: Inbox triage ─────────────────────────────────────────────────────
echo "── Step 1: Inbox triage ──"
echo ""

INBOX_FILES=$(find "+Inbox" -maxdepth 1 -name "*.md" \
  ! -name "+Inbox.md" \
  ! -name "+About*" \
  ! -name "$(date +%Y-%m-%d).md" \
  ! -name "$(date +%Y)-W*.md" \
  2>/dev/null)

if [ -z "$INBOX_FILES" ]; then
  echo "✅ Inbox is clean — no files to triage."
else
  echo "Files found in +Inbox:"
  echo "$INBOX_FILES" | while read -r f; do echo "   $f"; done
  echo ""

  if [ "$DRY_RUN" = "--dry-run" ]; then
    claude -p "Classify each of these +Inbox files in the Origin vault at '$VAULT'.
For each file, read its content and frontmatter, then classify as:
  CAPTURE — a genuine user-written idea, note, or thought
  ARTIFACT — a session output: audit report, architecture doc, design plan, orphan list, tag audit, Claude-generated analysis

Files to classify:
$INBOX_FILES

Output a table: filename | classification | reason (one line).
Do NOT move or modify any files. Report only."
  else
    claude -p "Triage the +Inbox files in the Origin vault at '$VAULT'.

Rules:
- CAPTURE (leave in place): genuine user-written idea, note, or thought
- ARTIFACT — move to correct location:
    Audit reports, orphan lists, tag audits → 99-System/Documentation/
    Architecture plans, design docs, sprint plans → AIOS/docs/plans/

Files to triage:
$INBOX_FILES

For each file:
1. Read its content to determine type
2. If ARTIFACT: move it using 'mv' (bash command)
3. Print: moved [filename] → [destination] OR kept [filename] (capture)

After all moves, print a summary line: 'Triage complete: N moved, N kept'"
  fi
fi

echo ""

# ── STEP 2: Metrics cache refresh ────────────────────────────────────────────
echo "── Step 2: Metrics cache refresh ──"
echo ""

# Count notes per folder using bash (faster, no claude needed for counting)
INBOX_COUNT=$(find "+Inbox" -maxdepth 1 -name "*.md" ! -name "+Inbox.md" ! -name "+About*" | wc -l | tr -d ' ')
ATOMIC_COUNT=$(find "02-Knowledge" -name "*.md" ! -name "*.canvas" 2>/dev/null | wc -l | tr -d ' ')
EFFORT_COUNT=$(find "03-Efforts" -name "*.md" 2>/dev/null | grep -v "About\|ℹ️" | wc -l | tr -d ' ')
SOURCE_COUNT=$(find "04-Sources" -name "*.md" 2>/dev/null | grep -v "About\|ℹ️" | wc -l | tr -d ' ')
ARCHIVE_COUNT=$(find "06-Archive" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
PROMPT_COUNT=$(find "07-Prompts" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
TOTAL=$(find . -name "*.md" \
  ! -path "./.git/*" \
  ! -path "./Templates/*" \
  ! -path "./99-System/*" \
  ! -path "./AIOS/*" \
  2>/dev/null | wc -l | tr -d ' ')

echo "Counts:"
echo "   +Inbox:       $INBOX_COUNT"
echo "   02-Knowledge: $ATOMIC_COUNT"
echo "   03-Efforts:   $EFFORT_COUNT"
echo "   04-Sources:   $SOURCE_COUNT"
echo "   06-Archive:   $ARCHIVE_COUNT"
echo "   07-Prompts:   $PROMPT_COUNT"
echo "   Total:        $TOTAL"
echo ""

if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "[DRY RUN] Would update _Metrics Cache.md with above counts."
else
  CACHE="99-System/_Metrics Cache.md"
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

  # Update inline fields using sed — anchored to start of line to avoid body matches
  sed -i \
    -e "s/^total_notes:: .*/total_notes:: $TOTAL/" \
    -e "s/^inbox_count:: .*/inbox_count:: $INBOX_COUNT/" \
    -e "s/^atomic_count:: .*/atomic_count:: $ATOMIC_COUNT/" \
    -e "s/^effort_count:: .*/effort_count:: $EFFORT_COUNT/" \
    -e "s/^source_count:: .*/source_count:: $SOURCE_COUNT/" \
    -e "s/^archived_count:: .*/archived_count:: $ARCHIVE_COUNT/" \
    -e "s/^prompt_total:: .*/prompt_total:: $PROMPT_COUNT/" \
    -e "s/^cache_timestamp:: .*/cache_timestamp:: $TIMESTAMP/" \
    -e "s/^cache_date:: .*/cache_date:: $TODAY/" \
    "$CACHE"

  # Also update the human-readable Last Updated line in the callout
  sed -i "s/\*\*Last Updated\*\*: .*/\*\*Last Updated\*\*: $TIMESTAMP/" "$CACHE"

  echo "✅ Metrics cache updated."
fi

# ── STEP 3: Morning brief → hot.md ───────────────────────────────────────────
echo "── Step 3: Morning brief ──"
echo ""

HOT="AIOS/memory/hot.md"
STAGED_PROPOSALS=$(find "AIOS/orchestration/proposed" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
QUEUE_OPEN=$(grep -l "status: 📥queued\|status: 👁️review" AIOS/orchestration/queue/*.md 2>/dev/null | wc -l | tr -d ' ')

BRIEF="## Morning Brief
- **$TODAY** · Inbox: $INBOX_COUNT captures waiting · Proposals staged: $STAGED_PROPOSALS · Queue open/review: $QUEUE_OPEN · Total notes: $TOTAL
- Next: /review-proposed if staged > 0; /process-inbox if inbox > 0."

if [ "$DRY_RUN" = "--dry-run" ]; then
  echo "[DRY RUN] Would write to $HOT:"
  echo "$BRIEF"
else
  python - << PYEOF
import re, sys
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
path = "$HOT"
brief = """$BRIEF"""
text = open(path, encoding="utf-8").read()
block = brief.rstrip() + "\n\n"
if "## Morning Brief" in text:
    text = re.sub(r"## Morning Brief.*?(?=^## )", block, text, flags=re.S | re.M)
else:
    text = re.sub(r"(?=^## Recent)", block, text, count=1, flags=re.M)
open(path, "w", encoding="utf-8", newline="\n").write(text)
print("✅ Morning brief written to hot.md")
PYEOF
fi
echo ""

# ── DONE ─────────────────────────────────────────────────────────────────────
echo ""
echo "================================================"
echo " Done. Review changes before committing:"
echo ""
echo "   git diff"
echo "   git add -A && git commit -m 'vault: morning maintenance $TODAY'"
echo "================================================"
echo ""
