#!/bin/bash
# apply-release.sh — install a release package into a consumer vault (MAIN/SPEC).
# Plain file operations ONLY (spec R1.4): to Obsidian Sync this is a normal editing session.
# Usage: apply-release.sh <package-dir> <vault-dir> [--dry-run]
set -euo pipefail

PKG="${1:-}"; VAULT="${2:-}"; MODE="${3:-}"
[ -d "$PKG" ] && [ -d "$VAULT" ] || { echo "Usage: $0 <package-dir> <vault-dir> [--dry-run]"; exit 1; }
PKG="$(cd "$PKG" && pwd)"; VAULT="$(cd "$VAULT" && pwd)"
PM="$PKG/package-manifest.json"
[ -f "$PM" ] && [ -d "$PKG/payload" ] || { echo "Error: not a release package (payload/ or package-manifest.json missing)."; exit 1; }
if [ -d "$VAULT/.git" ]; then
  echo "⛔ Target is a git repo. Git vaults (DEV/TEST) update via git, never via packages (R1.4)."; exit 1
fi

PKG_WIN="$(cd "$PKG" && pwd -W 2>/dev/null)" || PKG_WIN="$PKG"
MJS_PM="$PKG_WIN/package-manifest.json"
NEWVER="$(node -e "console.log(require('$MJS_PM').version)")"
PREVVER="none"
[ -f "$VAULT/99-System/Config/.origin-version" ] && PREVVER="$(grep '^version:' "$VAULT/99-System/Config/.origin-version" | awk '{print $2}')"
echo "Package: $NEWVER   Vault: $VAULT (currently: $PREVVER)"

# same-version re-apply: the vault is already at this version, so there is no
# meaningful "prior baseline" to diff against — resolving PREVPKG would just
# point at the incoming package itself and flag every changed file as false drift.
SAMEVER=0
[ "$PREVVER" != "none" ] && [ "$PREVVER" = "$NEWVER" ] && SAMEVER=1

# previous package (for drift detection) — expected as sibling of the new one
PREVPKG=""
if [ "$SAMEVER" -eq 1 ]; then
  echo "ℹ Same-version re-apply — no prior baseline, drift detection skipped for this run."
else
  [ "$PREVVER" != "none" ] && [ -d "$(dirname "$PKG")/Origin-Release-$PREVVER" ] && PREVPKG="$(dirname "$PKG")/Origin-Release-$PREVVER"
  [ -z "$PREVPKG" ] && echo "ℹ No previous package found for $PREVVER — drift detection falls back to 'differs from incoming'."
fi

# bootstrap files (fresh-provisioning tier): written only when absent — a living
# note in the target vault (Home, MOCs, TODO, Me…) is NEVER overwritten or drift-flagged.
declare -A BOOTSET=()
while IFS= read -r rel; do [ -n "$rel" ] && BOOTSET["$rel"]=1; done \
  < <(node -e "(require(process.argv[1]).bootstrap||[]).forEach(f=>console.log(f))" "$MJS_PM")

NEW=(); CHANGED=(); DRIFT=(); SAME=0; BOOTKEPT=0; DIRS_TO_CREATE=()
while IFS= read -r rel; do
  src="$PKG/payload/$rel"; dst="$VAULT/$rel"
  if [ ! -e "$dst" ]; then NEW+=("$rel")
  elif [ -n "${BOOTSET[$rel]:-}" ]; then BOOTKEPT=$((BOOTKEPT+1))
  elif cmp -s "$src" "$dst"; then SAME=$((SAME+1))
  else
    CHANGED+=("$rel")
    if [ "$SAMEVER" -eq 1 ]; then :
    elif [ -n "$PREVPKG" ] && [ -f "$PREVPKG/payload/$rel" ] && ! cmp -s "$PREVPKG/payload/$rel" "$dst"; then DRIFT+=("$rel")
    elif [ -z "$PREVPKG" ]; then DRIFT+=("$rel"); fi
  fi
done < <(node -e "require(process.argv[1]).files.forEach(f=>console.log(f))" "$MJS_PM")

while IFS= read -r d; do
  [ -n "$d" ] && [ ! -d "$VAULT/$d" ] && DIRS_TO_CREATE+=("$d")
done < <(node -e "(require(process.argv[1]).dirs||[]).forEach(d=>console.log(d))" "$MJS_PM")

echo; echo "── Plan ──"
echo "  new: ${#NEW[@]}   changed: ${#CHANGED[@]}   unchanged: $SAME   bootstrap kept as-is: $BOOTKEPT   dirs to create: ${#DIRS_TO_CREATE[@]}"
for f in "${NEW[@]}";     do echo "  + $f"; done
for f in "${CHANGED[@]}"; do echo "  ~ $f"; done
if [ "${#DRIFT[@]}" -gt 0 ]; then
  echo; echo "⚠️  DRIFT (R1.2 violation — vault file differs from what the last release shipped):"
  for f in "${DRIFT[@]}"; do echo "  ⚠ $f"; done
  echo "  Resolve by porting the local change to DEV (capture it!) or letting this apply overwrite it."
fi
if [ -d "$PKG/obsidian-release" ] && ls "$PKG/obsidian-release" | grep -q .; then
  echo; echo "── Tier 2 checklist (NEVER auto-applied — R3.2). Compare & merge manually: ──"
  for t in "$PKG/obsidian-release"/*; do
    rel="$(basename "$t" | sed 's|__|/|g')"
    if [ -f "$VAULT/$rel" ] && cmp -s "$t" "$VAULT/$rel"; then echo "  = $rel (identical)"; else echo "  □ $rel  → reference: $t"; fi
  done
fi

if [ "$MODE" = "--dry-run" ]; then echo; echo "Dry-run only — nothing written."; exit 0; fi
[ "$((${#NEW[@]} + ${#CHANGED[@]}))" -eq 0 ] && { echo "Nothing to apply."; exit 0; }

BK="$VAULT/_release-backups/$PREVVER-$(date +%Y-%m-%d-%H%M)"
echo; echo "→ Backing up ${#CHANGED[@]} file(s) to $BK"
for f in "${CHANGED[@]}"; do mkdir -p "$BK/$(dirname "$f")"; cp "$VAULT/$f" "$BK/$f"; done

echo "→ Applying $NEWVER"
for f in "${NEW[@]}" "${CHANGED[@]}"; do
  mkdir -p "$VAULT/$(dirname "$f")"
  cp "$PKG/payload/$f" "$VAULT/$f"
done

echo "→ Creating missing directories (${#DIRS_TO_CREATE[@]} dirs)"
DIRS_CREATED=0
for d in "${DIRS_TO_CREATE[@]}"; do
  mkdir -p "$VAULT/$d"
  DIRS_CREATED=$((DIRS_CREATED+1))
done

echo "✅ Applied $NEWVER to $VAULT (backup: $BK; $DIRS_CREATED directories created)"
echo "Reminder: work through the Tier 2 checklist above, update vault-registry.json in DEV (R7.3),"
echo "and let Obsidian Sync distribute before editing system files on mobile."
