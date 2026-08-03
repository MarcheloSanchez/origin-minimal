---
up: "[[🗺️My PKM MOC]]"
title: Mobile Setup Guide
type: guide
tags: 
  - 📋documentation
  - 📱mobile
status: 🔄active
maturity: 🌱seedling
created: "2026-03-15"
modified: "2026-06-17"
related: 
  - "[[🔁My PKM Workflows]]"
  - "[[📅Calendar Review Hub Guide]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | [[🔁My PKM Workflows]] | [[📅Calendar Review Hub Guide]]
# Mobile Setup Guide

This guide configures Obsidian on iPhone for a lean, zero-nag experience with quick capture via iOS Shortcut.

**Goal:** Fast reader/reviewer on mobile. Capture lives in iOS, not in plugins.

---

## 1. Obsidian Sync — Separate Plugin Config

Before changing any plugins on mobile, prevent desktop from overwriting your mobile config.

### Steps
1. Open Obsidian on iPhone
2. Go to **Settings → Sync** (core plugin)
3. Under **Vault configuration sync**, disable **"Installed community plugins"**
   - May appear as "Active community plugins" in some versions
4. Keep other sync toggles (appearance, hotkeys, etc.) as you prefer

> [!warning] Do this FIRST
> If you skip this step, the next Sync cycle will re-enable all the plugins you disable below.

---

## 2. Plugins to Disable on Mobile

Open **Settings → Community plugins** on iPhone and toggle OFF:

| Plugin | Why disable |
|--------|-------------|
| **Metadata Menu** | Shows "Install and enable Dataview" popup on every launch |
| **Smart Environment** | Startup popup / notification |
| **Templater** | Not needed — capture uses iOS Shortcut, templates applied on desktop |
| **QuickAdd** | Not needed — capture uses iOS Shortcut |
| Any other heavy/desktop-only plugins | Reduces startup noise and load time |

## 3. Plugins to Keep on Mobile

| Plugin | Why keep |
|--------|----------|
| **Obsidian Sync** | Device sync |
| **Dataview** | Read-only queries in dashboards and daily notes |
| **Calendar** | Quick navigation to daily notes |
| **Style Settings** | Theme consistency with desktop |

---

## 4. iOS Shortcut — Quick Capture to Daily Note

This shortcut captures text from anywhere on iPhone and appends it as a bullet to today's daily note.

### Entry Points
- **Home screen widget** — tap to type a quick thought
- **Share sheet** — select text in any app → Share → run shortcut

### Build Instructions (Shortcuts App)

Open the **Shortcuts** app on iPhone and create a new shortcut.

#### Action 1: Receive Input
- Add action: **"Receive What's On Screen"** (or use **"Ask for Input"**)
- For share sheet support: in shortcut settings, enable **"Show in Share Sheet"** and set accepted types to **Text**
- For widget/manual use: add **"Ask for Input"** with prompt `"Capture idea"`
- Tip: You can use an **"If"** block — if Shortcut Input has value, use it (share sheet); otherwise, Ask for Input (widget/manual)

#### Action 2: Get Current Date
- Add action: **"Date"** → set to **Current Date**
- Add action: **"Format Date"** → format: **Custom** → `yyyy-MM-dd`
- This gives you today's date as e.g. `2026-03-15`

#### Action 3: URL-Encode the Text
- Add action: **"URL Encode"**
- Input: the captured text from Action 1
- This handles special characters (spaces, newlines, etc.)

#### Action 4: Build the Obsidian URI
- Add action: **"Text"**
- Content:
  ```
  obsidian://new?vault=db1ef0919c94d121&file=05-Calendar/Daily/[Formatted Date]&append=true&content=%0A-%20[URL Encoded Text]
  ```
- Replace `[Formatted Date]` with the Format Date variable
- Replace `[URL Encoded Text]` with the URL Encode variable
- `%0A` = newline before the bullet, `%20` = space after dash

#### Action 5: Open the URI
- Add action: **"Open URLs"**
- Input: the Text from Action 4

#### Shortcut Settings
- **Name:** `Capture to Origin` (or whatever you prefer)
- **Icon:** Pick something recognizable (brain, lightbulb, etc.)
- **Show in Share Sheet:** ON, accept **Text**
- **Add to Home Screen:** YES (for widget access)

### What Happens When You Run It
1. You type or share text
2. Shortcut builds the Obsidian URI
3. Obsidian opens briefly (iOS limitation — no silent background append)
4. Text appears as `- your idea here` at the end of today's daily note
5. If the daily note doesn't exist yet, Obsidian creates a bare file and appends

---

## 5. Templater Interaction — What You Need to Know

### The Scenario
Templater has a folder template for `05-Calendar/Daily/` that applies `Template Daily.md` on file creation. This template writes the full daily note structure (frontmatter, sections, quests).

### Why It's Safe
- **Templater is disabled on mobile** (per Section 2 above)
- When iOS Shortcut creates a bare daily note via URI, Templater is not running → no template fires
- When you later open that note on desktop, the file already exists → Templater's `trigger_on_file_creation` does NOT re-trigger on existing files
- Your captured content survives intact

### Two Daily Note Scenarios

**Scenario A: Desktop creates daily note first (normal day)**
1. You open today's daily note on desktop → Templater applies full template
2. Later, you capture on iPhone → text appends to end of the templated note
3. Result: full template structure + captured ideas at the bottom under existing sections

**Scenario B: iPhone capture creates the daily note first**
1. You capture before opening desktop → bare file created with just `- your idea`
2. Later, you open on desktop → file exists, Templater does NOT overwrite
3. Result: bare note with captured bullets, no template structure
4. **To get the template:** manually run Templater (Alt+E or Templater ribbon icon), or just work with the bare note — your captures are safe

> [!tip] Best practice
> Open today's daily note on desktop first thing in the morning. This ensures the template is applied, and all mobile captures throughout the day append cleanly to the templated structure.

---

## 6. Verification Checklist

After setup, verify:

- [ ] **Sync config:** "Installed community plugins" is OFF in Sync settings on mobile
- [ ] **Plugins:** Metadata Menu, Smart Environment, Templater, QuickAdd are OFF on mobile
- [ ] **Cold start:** Force-quit Obsidian → reopen → zero popups, zero nags
- [ ] **Widget capture:** Tap shortcut widget → type idea → appears in today's daily note
- [ ] **Share sheet:** Select text in Safari/Notes → Share → Capture to Origin → appears in daily note
- [ ] **Daily note exists:** If daily note was already created on desktop, captures append at the end
- [ ] **Daily note doesn't exist:** If no daily note yet, capture creates bare file with your bullet

---

## 7. Troubleshooting

### Obsidian doesn't open when running the shortcut
- Check that Obsidian is installed and signed in
- Verify the vault ID is correct: `db1ef0919c94d121`
- Try opening a test URI manually in Safari: `obsidian://new?vault=db1ef0919c94d121&file=test-capture&content=hello`

### Capture doesn't appear in the daily note
- Check the file path: daily notes must be in `05-Calendar/Daily/YYYY-MM-DD`
- Verify the date format in the shortcut is `yyyy-MM-dd` (lowercase, with dashes)
- Check that `append=true` is in the URI (without it, Obsidian may overwrite)

### Obsidian shows "file already exists" error
- This shouldn't happen with `append=true` — it appends silently
- If it does, ensure you're using `obsidian://new` (not `obsidian://create`)

### Plugins re-enabled after sync
- You forgot Section 1 — go back and disable "Installed community plugins" in Sync settings

### Daily note has no template structure
- This means iPhone created the note first (Scenario B above)
- On desktop, manually apply Templater: Alt+E → select "Template Daily"
- Or just use the bare note — your captures are preserved either way

### Metadata Menu popup still appears
- Double-check it's toggled OFF in Community Plugins on the mobile device
- Force-quit Obsidian and reopen to clear cached plugin state

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
