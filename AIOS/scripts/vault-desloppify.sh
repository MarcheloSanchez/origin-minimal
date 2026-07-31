#!/bin/bash
# vault-desloppify.sh — YAML cleanup pass after any edit session
#
# Usage:
#   bash AIOS/scripts/vault-desloppify.sh            # fix working tree changes
#   bash AIOS/scripts/vault-desloppify.sh --last-commit  # fix files from last commit
#   bash AIOS/scripts/vault-desloppify.sh --dry-run  # report violations only, no writes
#
# Fixes:
#   - maturity: 🌱seed  → 📤seed
#   - status without emoji prefix (e.g. active → 🔄active)
#   - tags without emoji prefix
#   - field named 'deadline' → renamed to 'due'

set -e

# Derive vault root from this script's location (AIOS/scripts/ → two levels up)
# so the script always targets the vault it lives in, not a hardcoded path.
VAULT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MODE="${1:-}"
TODAY=$(date +%Y-%m-%d)

# Validate mode argument
if [ -n "$MODE" ] && [ "$MODE" != "--dry-run" ] && [ "$MODE" != "--last-commit" ]; then
  echo "Error: unknown mode '$MODE'"
  echo "Usage: $0 [--dry-run|--last-commit]"
  exit 1
fi

# Status emoji map
declare -A STATUS_MAP=(
  ["inbox"]="📥inbox"
  ["active"]="🔄active"
  ["waiting"]="⏳waiting"
  ["completed"]="✅completed"
  ["archived"]="📦archived"
  ["cancel"]="❌cancelled"
  ["cancelled"]="❌cancelled"
  ["blocked"]="⚠️blocked"
  ["paused"]="⏸️paused"
)

echo ""
echo "================================================"
echo " Origin Vault De-Sloppify — $TODAY"
echo " Mode: ${MODE:-live (working tree)}"
echo "================================================"
echo ""

cd "$VAULT"

# ── SAFEGUARD: snapshot commit before any bulk YAML edits ─────────────────────
if [ "$MODE" != "--dry-run" ]; then
  DIRTY=$(git status --porcelain -- '*.md' | grep -v '^??' || true)
  if [ -n "$DIRTY" ]; then
    echo "📸 Creating snapshot commit before YAML cleanup..."
    git add -A -- '*.md'
    git commit -m "vault: pre-desloppify snapshot $TODAY" --quiet
    echo "   Snapshot created. 'git reset --soft HEAD~1' to undo if needed."
    echo ""
  fi
fi

# ── Get list of files to check ────────────────────────────────────────────────
if [ "$MODE" = "--last-commit" ]; then
  FILES=$(git diff-tree --no-commit-id -r --name-only HEAD | grep '\.md$' | grep -v 'Templates/' | grep -v '99-System/' || true)
  echo "Checking files from last commit..."
else
  # Working tree: tracked modified files + staged files
  FILES=$(git diff --name-only HEAD -- '*.md' | grep -v 'Templates/' | grep -v '99-System/' || true)
  if [ -z "$FILES" ]; then
    # Fall back to all tracked .md files if nothing modified
    FILES=$(git ls-files '*.md' | grep -v 'Templates/' | grep -v '99-System/' || true)
    echo "No modified files detected — scanning all tracked .md files..."
  fi
fi

if [ -z "$FILES" ]; then
  echo "✅ No .md files to check."
  exit 0
fi

FILE_COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
echo "Checking $FILE_COUNT files..."
echo ""

# ── Violation tracking ────────────────────────────────────────────────────────
VIOLATIONS=0
FIXED=0

fix_or_report() {
  local file="$1"
  local description="$2"
  local old_pattern="$3"
  local new_pattern="$4"

  if grep -qE "$old_pattern" "$file" 2>/dev/null; then
    VIOLATIONS=$((VIOLATIONS + 1))
    if [ "$MODE" = "--dry-run" ]; then
      echo "  ⚠️  $file — $description"
    else
      sed -i -E "s/$old_pattern/$new_pattern/" "$file"
      echo "  ✅ Fixed: $file — $description"
      FIXED=$((FIXED + 1))
    fi
  fi
}

# ── Check each file ───────────────────────────────────────────────────────────
while IFS= read -r file; do
  [ -f "$file" ] || continue

  # Only check YAML frontmatter (between first two --- lines)
  # Extract frontmatter to check
  FRONTMATTER=$(awk '/^---/{p++} p==1{print} p==2{exit}' "$file" 2>/dev/null || true)
  [ -z "$FRONTMATTER" ] && continue

  # 1. Wrong maturity: 🌱seed → 📤seed
  if echo "$FRONTMATTER" | grep -q "maturity:.*🌱seed"; then
    VIOLATIONS=$((VIOLATIONS + 1))
    if [ "$MODE" != "--dry-run" ]; then
      sed -i 's/^maturity: 🌱seed$/maturity: 📤seed/' "$file"
      echo "  ✅ Fixed maturity: $file"
      FIXED=$((FIXED + 1))
    else
      echo "  ⚠️  $file — maturity: 🌱seed should be 📤seed"
    fi
  fi

  # 2. Field named 'deadline' → rename to 'due'
  if echo "$FRONTMATTER" | grep -qE "^deadline:"; then
    VIOLATIONS=$((VIOLATIONS + 1))
    if [ "$MODE" != "--dry-run" ]; then
      sed -i 's/^deadline:/due:/' "$file"
      echo "  ✅ Fixed deadline→due: $file"
      FIXED=$((FIXED + 1))
    else
      echo "  ⚠️  $file — 'deadline' field should be 'due'"
    fi
  fi

  # 3. Status without emoji prefix (bare word status values)
  for bare in "inbox" "active" "waiting" "completed" "archived" "cancel" "cancelled" "blocked" "paused"; do
    emoji="${STATUS_MAP[$bare]}"
    if echo "$FRONTMATTER" | grep -qE "^status: ${bare}$"; then
      VIOLATIONS=$((VIOLATIONS + 1))
      if [ "$MODE" != "--dry-run" ]; then
        sed -i "s/^status: ${bare}$/status: ${emoji}/" "$file"
        echo "  ✅ Fixed status: $file (${bare} → ${emoji})"
        FIXED=$((FIXED + 1))
      else
        echo "  ⚠️  $file — status: ${bare} should be ${emoji}"
      fi
    fi
  done

done <<< "$FILES"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "================================================"
echo " $FILE_COUNT files checked | $VIOLATIONS violations found | $FIXED fixed"
echo ""
if [ "$MODE" = "--dry-run" ]; then
  echo " DRY RUN — no files modified."
  echo " Run without --dry-run to apply fixes."
else
  if [ "$FIXED" -gt 0 ]; then
    echo " Review changes:"
    echo "   git diff"
    echo "   git add -A && git commit -m 'fix: yaml desloppify $TODAY'"
  else
    echo " ✅ No violations found — vault is clean."
  fi
fi
echo "================================================"
echo ""
