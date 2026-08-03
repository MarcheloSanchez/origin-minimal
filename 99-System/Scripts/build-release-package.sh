#!/bin/bash
# build-release-package.sh — build an immutable release package from the manifest.
# Spec: AIOS/docs/specs/2026-07-15-origin-ecosystem-release-management-design.md (§3, §4, R4.2, R4.3)
# Usage: build-release-package.sh --version vX.Y.Z [--source <vault>] [--out <dir>] [--force-leaks]
set -euo pipefail

VERSION=""; SOURCE=""; OUT=""; FORCE_LEAKS=false
while [ $# -gt 0 ]; do case "$1" in
  --version) VERSION="$2"; shift 2;;
  --source)  SOURCE="$2"; shift 2;;
  --out)     OUT="$2"; shift 2;;
  --force-leaks) FORCE_LEAKS=true; shift;;
  *) echo "Unknown arg: $1"; exit 1;;
esac; done

[ -n "$VERSION" ] || { echo "Error: --version vX.Y.Z required (never inferred from CHANGELOG)."; exit 1; }
echo "$VERSION" | grep -Eq '^v[0-9]+\.[0-9]+\.[0-9]+(-[A-Za-z0-9.]+)?$' || { echo "Error: version must look like vX.Y.Z"; exit 1; }

SELF_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="${SOURCE:-$(cd "$SELF_DIR/../.." && pwd)}"
SOURCE="$(cd "$SOURCE" && pwd)"
SOURCE_WIN="$(cd "$SOURCE" && pwd -W 2>/dev/null)" || SOURCE_WIN="$SOURCE"
OUT="${OUT:-$(dirname "$SOURCE")/Origin-Releases}"
MANIFEST="$SOURCE/AIOS/contracts/release-manifest.json"
[ -f "$MANIFEST" ] || { echo "Error: manifest not found: $MANIFEST"; exit 1; }

PKG="$OUT/Origin-Release-$VERSION"
[ -e "$PKG" ] && { echo "Error: $PKG already exists — packages are immutable (R4.2). Bump the version."; exit 1; }
mkdir -p "$PKG/payload" "$PKG/obsidian-release"
PKG_WIN="$(cd "$PKG" && pwd -W 2>/dev/null)" || PKG_WIN="$PKG"

MJS="$SOURCE_WIN/AIOS/contracts/release-manifest.json"
readarray -t TIER1 < <(node -e "require('$MJS').tier1_paths.forEach(p=>console.log(p))")
readarray -t GLOBS < <(node -e "require('$MJS').tier1_globs.forEach(p=>console.log(p))")
readarray -t EXCL  < <(node -e "require('$MJS').exclude.forEach(p=>console.log(p))")
readarray -t TIER2 < <(node -e "require('$MJS').tier2.forEach(p=>console.log(p))")
readarray -t BOOT  < <(node -e "(require('$MJS').bootstrap_paths||[]).forEach(p=>console.log(p))")
LEAKS="$(node -e "console.log(require('$MJS').leak_patterns)")"

echo "→ Copying Tier 1 paths"
for p in "${TIER1[@]}"; do
  src="$SOURCE/${p%/}"
  [ -e "$src" ] || { echo "  ⚠ manifest path missing on disk, skipped: $p"; continue; }
  dst="$PKG/payload/${p%/}"
  if [ -d "$src" ]; then
    mkdir -p "$dst" && cp -r "$src/." "$dst"
  else
    mkdir -p "$(dirname "$dst")" && cp "$src" "$dst"
  fi
done

echo "→ Copying Tier 1 structure skeletons (globs, hub notes, content folders only)"
for top in "+Inbox" "01-MOCs" "02-Knowledge" "03-Efforts" "04-Sources" "05-Calendar" "06-Archive" "07-Prompts"; do
  [ -d "$SOURCE/$top" ] || continue
  for g in "${GLOBS[@]}"; do
    while IFS= read -r -d '' f; do
      rel="${f#"$SOURCE"/}"
      mkdir -p "$PKG/payload/$(dirname "$rel")"
      cp "$f" "$PKG/payload/$rel"
    done < <(find "$SOURCE/$top" -name "$g" -type f -print0)
  done
done

echo "→ Copying hub notes for content directories"
for top in "+Inbox" "01-MOCs" "02-Knowledge" "03-Efforts" "04-Sources" "05-Calendar" "06-Archive" "07-Prompts"; do
  [ -d "$SOURCE/$top" ] || continue
  # Copy hub note for the top directory itself
  hub_src="$SOURCE/$top/$top.md"
  if [ -f "$hub_src" ]; then
    mkdir -p "$PKG/payload/$top"
    cp "$hub_src" "$PKG/payload/$top/$top.md"
  fi
  # Walk subdirs and copy <dirname>.md if present
  while IFS= read -r -d '' d; do
    rel="${d#"$SOURCE"/}"
    dir_basename="$(basename "$d")"
    hub_src="$d/$dir_basename.md"
    if [ -f "$hub_src" ]; then
      mkdir -p "$PKG/payload/$(dirname "$rel")"
      cp "$hub_src" "$PKG/payload/$rel/$dir_basename.md"
    fi
  done < <(find "$SOURCE/$top" -mindepth 1 -type d -print0)
done

echo "→ Folder contract checks (non-blocking)"
for top in "+Inbox" "01-MOCs" "02-Knowledge" "03-Efforts" "04-Sources" "05-Calendar" "06-Archive" "07-Prompts"; do
  [ -d "$SOURCE/$top" ] || continue
  # Check the top directory itself
  has_about=false; has_hub=false; has_base=false
  [ -f "$SOURCE/$top/+About"*.md ] 2>/dev/null && has_about=true
  [ -f "$SOURCE/$top/$top.md" ] && has_hub=true
  [ -f "$SOURCE/$top/_"*.base ] 2>/dev/null && has_base=true
  if ! ($has_about && $has_hub && $has_base); then
    missing=""
    [ "$has_about" = false ] && missing="missing +About"
    [ "$has_hub" = false ] && [ -n "$missing" ] && missing="$missing, hub" || [ "$has_hub" = false ] && missing="missing hub"
    [ "$has_base" = false ] && [ -n "$missing" ] && missing="$missing, _*.base" || [ "$has_base" = false ] && missing="missing _*.base"
    echo "  ⚠ folder contract incomplete: $top ($missing)"
  fi
  # Check subdirectories
  while IFS= read -r -d '' d; do
    rel="${d#"$SOURCE"/}"
    dir_basename="$(basename "$d")"
    has_about=false; has_hub=false; has_base=false
    [ -f "$d/+About"*.md ] 2>/dev/null && has_about=true
    [ -f "$d/$dir_basename.md" ] && has_hub=true
    [ -f "$d/_"*.base ] 2>/dev/null && has_base=true
    if ! ($has_about && $has_hub && $has_base); then
      missing=""
      [ "$has_about" = false ] && missing="missing +About"
      [ "$has_hub" = false ] && [ -n "$missing" ] && missing="$missing, hub" || [ "$has_hub" = false ] && missing="missing hub"
      [ "$has_base" = false ] && [ -n "$missing" ] && missing="$missing, _*.base" || [ "$has_base" = false ] && missing="missing _*.base"
      echo "  ⚠ folder contract incomplete: $rel ($missing)"
    fi
  done < <(find "$SOURCE/$top" -mindepth 1 -type d -print0)
done

echo "→ Applying excludes"
for e in "${EXCL[@]}"; do rm -rf "$PKG/payload/$e" 2>/dev/null || true; done

echo "→ Copying Tier 2 reference configs (never auto-applied — R3.2)"
for t in "${TIER2[@]}"; do
  [ -f "$SOURCE/$t" ] || { echo "  ⚠ tier2 missing, skipped: $t"; continue; }
  cp "$SOURCE/$t" "$PKG/obsidian-release/$(echo "$t" | sed 's|/|__|g')"
done

echo "→ Writing .origin-version"
COMMIT="$(git -C "$SOURCE" rev-parse --short HEAD 2>/dev/null || echo 'no-git')"
mkdir -p "$PKG/payload/99-System/Config"
printf 'version: %s\ncut: %s\ncommit: %s\n' "$VERSION" "$(date +%Y-%m-%d)" "$COMMIT" \
  > "$PKG/payload/99-System/Config/.origin-version"

echo "→ Bundling apply-release.sh"
if [ -f "$SELF_DIR/apply-release.sh" ]; then cp "$SELF_DIR/apply-release.sh" "$PKG/apply-release.sh"
else echo "  ⚠ apply-release.sh not found next to builder — package has no installer"; fi

echo "→ Leak check on Tier 1 (BLOCKING — R4.3; bootstrap tier is scanned warn-only after)"
if grep -rEl "$LEAKS" "$PKG/payload" "$PKG/obsidian-release" 2>/dev/null | head -50 | grep .; then
  if [ "$FORCE_LEAKS" = true ]; then echo "  ⚠ leaks found but --force-leaks given — continuing"
  else echo "  ⛔ Personal-data leak(s) above. Package NOT usable. Fix in DEV and rebuild (or --force-leaks to override)."
       rm -rf "$PKG"; exit 1; fi
else echo "  ✅ no leaks in Tier 1"; fi

echo "→ Copying bootstrap paths (fresh-provisioning tier — applied only where absent)"
( cd "$PKG/payload" && find . -type f | sed 's|^\./||' | sort ) > "$PKG/.filelist-tier1"
for p in "${BOOT[@]}"; do
  src="$SOURCE/${p%/}"
  # Special case: these ship from Templates/_Skeletons/ instead of DEV's live file.
  # CHANGELOG/BACKLOG = empty shells (no DEV history); CLAUDE.md = depersonalized vault
  # contract (no machine paths, no DEV-instance git rules); Me.md = blank protocol.
  case "$p" in
    CHANGELOG.md|BACKLOG.md|CLAUDE.md|Me.md)
      src="$SOURCE/Templates/_Skeletons/$p"
      [ -f "$src" ] || { echo "  ⚠ skeleton $p missing, skipped"; continue; }
      ;;
  esac
  [ -e "$src" ] || { echo "  ⚠ bootstrap path missing on disk, skipped: $p"; continue; }
  dst="$PKG/payload/${p%/}"
  if [ -d "$src" ]; then
    mkdir -p "$dst" && cp -r "$src/." "$dst"
  else
    mkdir -p "$(dirname "$dst")" && cp "$src" "$dst"
  fi
done
for e in "${EXCL[@]}"; do rm -rf "$PKG/payload/$e" 2>/dev/null || true; done

# Live-state reset: some bootstrap paths hold DEV's running state (session cache, queue
# tasks, scan output, ledger rows) rather than shippable content. Empty those dirs and
# swap those files for skeletons so a fresh vault provisions clean but structurally valid.
echo "→ Resetting bootstrap live-state to skeletons"
readarray -t EMPTY_DIRS < <(node -e "(require('$MJS').bootstrap_empty_dirs||[]).forEach(p=>console.log(p))")
for d in "${EMPTY_DIRS[@]}"; do
  if [ -d "$PKG/payload/$d" ]; then
    find "$PKG/payload/$d" -mindepth 1 -delete
    touch "$PKG/payload/$d/.gitkeep"
    echo "  emptied $d"
  else
    mkdir -p "$PKG/payload/$d"
    touch "$PKG/payload/$d/.gitkeep"
    echo "  created $d"
  fi
done
while IFS=$'\t' read -r dst skel; do
  [ -n "$dst" ] || continue
  if [ ! -f "$SOURCE/$skel" ]; then echo "  ⚠ skeleton missing, left as-is: $skel"; continue; fi
  mkdir -p "$(dirname "$PKG/payload/$dst")"
  cp "$SOURCE/$skel" "$PKG/payload/$dst"
  echo "  reset $dst"
done < <(node -e "
const m=(require('$MJS').bootstrap_reset)||{};
for (const [k,v] of Object.entries(m)) { if (k!=='comment') console.log(k+'\t'+v); }
")

# the exclude list also names 99-System/Config/.origin-version (keeps DEV's own copy
# out of tier1) — re-stamp the package's version file after the pass
printf 'version: %s\ncut: %s\ncommit: %s\n' "$VERSION" "$(date +%Y-%m-%d)" "$COMMIT" \
  > "$PKG/payload/99-System/Config/.origin-version"
( cd "$PKG/payload" && find . -type f | sed 's|^\./||' | sort ) > "$PKG/.filelist"
comm -13 "$PKG/.filelist-tier1" "$PKG/.filelist" > "$PKG/.filelist-boot"
BOOTLEAKS=0
while IFS= read -r rel; do
  [ -n "$rel" ] || continue
  grep -qE "$LEAKS" "$PKG/payload/$rel" 2>/dev/null && BOOTLEAKS=$((BOOTLEAKS+1)) || true
done < "$PKG/.filelist-boot"
[ "$BOOTLEAKS" -gt 0 ] && echo "  ℹ $BOOTLEAKS bootstrap file(s) contain personal-name patterns — expected in a private ecosystem, not blocking."

echo "→ Collecting directory structure"
readarray -t STRUCT_DIRS < <(node -e "(require('$MJS').structure_dirs_from||[]).forEach(p=>console.log(p))")
for top in "${STRUCT_DIRS[@]}"; do
  [ -d "$SOURCE/$top" ] || continue
  while IFS= read -r -d '' d; do
    rel="${d#"$SOURCE"/}"
    # skip any path that starts with an exclude entry
    skip=false
    for e in "${EXCL[@]}"; do
      [[ "$rel" == "$e"* ]] && skip=true && break
    done
    [ "$skip" = true ] && continue
    echo "$rel"
  done < <(find "$SOURCE/$top" -type d -print0)
done | sort > "$PKG/.dirlist"

echo "→ Writing package-manifest.json"
node -e "
const fs=require('fs');
const files=fs.readFileSync('$PKG_WIN/.filelist','utf8').trim().split('\n');
const bootRaw=fs.readFileSync('$PKG_WIN/.filelist-boot','utf8').trim();
const bootstrap=bootRaw?bootRaw.split('\n'):[];
const dirRaw=fs.readFileSync('$PKG_WIN/.dirlist','utf8').trim();
const dirs=dirRaw?dirRaw.split('\n'):[];
fs.writeFileSync('$PKG_WIN/package-manifest.json',
  JSON.stringify({version:'$VERSION',built:new Date().toISOString().slice(0,10),commit:'$COMMIT',files,bootstrap,dirs},null,2));
"
rm -f "$PKG/.filelist" "$PKG/.filelist-tier1" "$PKG/.filelist-boot" "$PKG/.dirlist"
echo "✅ Package built: $PKG ($(node -e "console.log(require('$PKG_WIN/package-manifest.json').files.length)") files)"
echo "Next: validate in TEST, then apply-release.sh <package> <vault> --dry-run (see 🚢Release Playbook)."
