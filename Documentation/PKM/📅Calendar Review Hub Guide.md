---
up: "[[🔁My PKM Workflows]]"
title: Calendar Review Hub Guide
type: guide
tags: 
  - 📅calendar
  - 📋documentation
  - 🔄workflow
status: 🔄active
maturity: 🌱seedling
created: "2026-02-23"
modified: "2026-06-17"
related: 
  - "[[📅Calendar Review Hub]]"
  - "[[📅Calendar Period Architecture Setup]]"
  - "[[🔧Scripts Reference]]"
  - "[[🔁My PKM Workflows]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🔁My PKM Workflows]] | [[📅Calendar Review Hub]] | [[🔧Scripts Reference]]

# 📅Calendar Review Hub - Step-by-Step Guide

This guide explains how to set up and use the automated report generators in the Calendar Review Hub. After reading it, you'll know how to generate weekly, monthly, quarterly, and yearly reports with one click.

---

## 🗺️ How the System Works

The Calendar Review Hub is built on four QuickAdd scripts that auto-generate structured reports:

```
Daily Notes (manual, each day)
  ↓ generate-weekly-report.js  →  Weekly Report YYYY-WNN.md
  ↓ generate-monthly-report.js →  Monthly Report YYYY-MM.md
  ↓ generate-quarterly-report.js → Quarterly Report YYYY-QN.md
  ↓ generate-yearly-report.js  →  Yearly Report YYYY.md
```

Each level aggregates from the level below. If lower-level reports are missing, the scripts fall back to querying vault data directly (with a "Partial Report" note).

**Scripts live in**: `99-System/Scripts/`
**Reports are saved to**: `05-Calendar/Weekly|Monthly|Quarterly|Yearly/`
**Hub for running them**: `05-Calendar/📅Calendar Review Hub.md`

---

## ⚙️ First-Time Setup — Registering QuickAdd Macros

> [!info] Skip this section if the buttons in the Calendar Review Hub already work.

The report buttons in `📅Calendar Review Hub.md` call QuickAdd macros. You need to register each script once.

### Step 1 — Open QuickAdd Settings

1. Open Obsidian Settings (`Ctrl+,`)
2. Scroll to **Community Plugins** → find **QuickAdd** → click the gear icon ⚙️

### Step 2 — Create the Weekly Report Macro

1. Click **Add Choice** at the bottom
2. Choose type: **Macro**
3. Name it exactly: `📊 Generate Weekly Report`
4. Click **Configure** (the gear next to it)
5. Under **User Scripts**, click **Add script**
6. Browse to `99-System/Scripts/generate-weekly-report.js`
7. Click **Add**
8. Toggle **Run on startup**: OFF

Repeat for the other three:

| Macro Name | Script File |
|-----------|-------------|
| `📊 Generate Weekly Report` | `generate-weekly-report.js` |
| `📊 Generate Monthly Report` | `generate-monthly-report.js` |
| `📊 Generate Quarterly Report` | `generate-quarterly-report.js` |
| `📊 Generate Yearly Report` | `generate-yearly-report.js` |

### Step 3 — Add to the Maintain Menu

Each macro should appear in the **🧹 Maintain** QuickAdd menu so you can run them from the command palette:

1. In QuickAdd Settings, find or create a Choice of type **Multi** named `🧹 Maintain`
2. Inside it, add each of the four macros above

### Step 4 — Verify Setup

1. Open Command Palette (`Ctrl+P`)
2. Type "QuickAdd"
3. You should see: `QuickAdd: 📊 Generate Weekly Report` (and the other three)
4. If not: restart Obsidian, then check again

---

## 📊 Running Reports — Step by Step

### Weekly Report

**When**: Every Friday evening or Sunday evening
**Time**: ~10 seconds (fully automated)

**How to run**:

**Option A — From the Hub (Buttons plugin required)**:
1. Open `05-Calendar/📅Calendar Review Hub.md`
2. Click **📊 Generate Weekly Report**

**Option B — From Command Palette**:
1. `Ctrl+P` → type "Generate Weekly"
2. Select `QuickAdd: 📊 Generate Weekly Report`
3. Press Enter

**What happens**:
- Script calculates the current ISO week (Mon–Sun)
- Gathers metrics: notes created/modified, tasks completed, active efforts, inbox count, maturity pipeline
- Creates (or updates) `05-Calendar/Weekly/Weekly Report YYYY-WNN.md`
- Opens the report automatically

**Output file name example**: `Weekly Report 2026-W09.md`

---

### Monthly Report

**When**: 1st of each month
**Time**: ~15 seconds

**How to run**:
1. `Ctrl+P` → `QuickAdd: 📊 Generate Monthly Report`
2. A prompt appears: **Enter month (YYYY-MM) or leave blank for current**
   - Press Enter to generate for the current month
   - Type e.g. `2026-01` to generate a past month's report

**What happens**:
- Finds all Weekly Reports from that month in `05-Calendar/Weekly/`
- Aggregates their metrics (notes, tasks, efforts)
- If fewer than 2 weekly reports exist → falls back to querying vault directly (shows "Partial Report" note)
- Creates `05-Calendar/Monthly/Monthly Report YYYY-MM.md`

**Output file name example**: `Monthly Report 2026-02.md`

> [!tip] Best results when you've generated all weekly reports for the month first.

---

### Quarterly Report

**When**: 1st day of each quarter (Jan 1, Apr 1, Jul 1, Oct 1)
**Time**: ~15 seconds

**How to run**:
1. `Ctrl+P` → `QuickAdd: 📊 Generate Quarterly Report`
2. Prompt: enter `YYYY-QN` (e.g. `2026-Q1`) or leave blank for current quarter

**What happens**:
- Finds Monthly Reports for the 3 months in the quarter
- Aggregates metrics and highlights across them
- Fallback to vault queries if monthly reports are missing
- Creates `05-Calendar/Quarterly/Quarterly Report YYYY-QN.md`

**Output file name example**: `Quarterly Report 2026-Q1.md`

> [!tip] Best results when all 3 monthly reports for the quarter exist first.

---

### Yearly Report

**When**: December 31 or January 1
**Time**: ~20 seconds

**How to run**:
1. `Ctrl+P` → `QuickAdd: 📊 Generate Yearly Report`
2. Prompt: enter `YYYY` (e.g. `2025`) or leave blank for current year

**What happens**:
- Finds all 4 Quarterly Reports for the year
- Aggregates across the full year
- Creates `05-Calendar/Yearly/Yearly Report YYYY.md`

**Output file name example**: `Yearly Report 2026.md`

---

## 📋 Reading a Report

All generated reports share the same structure:

| Section | What It Shows |
|---------|--------------|
| **Key Metrics** | Notes created/modified, tasks completed, active efforts, inbox count |
| **Creation Breakdown** | Which folders got new notes (weekly only) |
| **Maturity Pipeline** | Count of 02-Knowledge notes at each stage (seed → fruit) |
| **Highlights** | Auto-generated wins based on metric thresholds |
| **Next Period Focus** | Pre-filled checklist with live counts; you fill in the last item |
| **Trends** | 8-week creation bar chart (weekly only, live DataviewJS) |

**The last item in Next Week Focus is always blank** — that's intentional. Fill it with your top priority for next period.

---

## 📅 Recommended Cadence

| Report | When to Run | Takes |
|--------|-------------|-------|
| Weekly | Every Friday 4–4:30 PM | 10 sec generate + 10 min review |
| Monthly | 1st of month | 15 sec generate + 30 min review |
| Quarterly | 1st of quarter | 15 sec generate + 60 min review |
| Yearly | Dec 31 or Jan 1 | 20 sec generate + 90 min review |

**Best order**: generate the report first, then review and fill in the blank focus item.

---

## 🔍 Monitoring with the Review Hub

The `📅Calendar Review Hub.md` gives you three live views:

1. **Review Status table** — when each report level was last generated, color-coded (🟢 on track, 🟡 getting stale, 🔴 overdue)
2. **Completion Rates** — how many weekly/monthly reports you've generated this year vs. how many periods have passed
3. **Current Period Snapshot** — live metrics (notes this week/month, active efforts, inbox, XP level) without generating a full report

Check the hub anytime to see if you're behind on reviews.

---

## 🔄 Manual vs. Auto-Generated Notes

Two types of notes coexist in `05-Calendar/`:

| Type | Created by | File name format | Example |
|------|-----------|-----------------|---------|
| **Periodic Notes** (manual) | Periodic Notes plugin or hotkey | `YYYY-WNN`, `YYYY-MM`, `YYYY-QN`, `YYYY` | `2026-W09.md` |
| **Generated Reports** (automated) | QuickAdd scripts | `Weekly Report YYYY-WNN`, etc. | `Weekly Report 2026-W09.md` |

They are separate files. Periodic Notes are for your personal journaling/reflections. Generated Reports are structured metric snapshots. Both can coexist.

---

## 🚨 Troubleshooting

### Buttons in the Hub don't work
- Requires the **Buttons** community plugin (not just QuickAdd)
- Use Command Palette as the fallback: `Ctrl+P` → type the macro name
- Restart Obsidian if plugin was just installed

### "QuickAdd: macro not found" in command palette
- Restart Obsidian — QuickAdd refreshes its command list on startup
- Verify macro name matches exactly (including emoji): `📊 Generate Weekly Report`

### Report shows 0 notes created this week
- The script filters by `ctime` (file creation time), not modified time
- Notes you edited but didn't create this week won't count in "Created" — they'll show in "Modified"
- This is expected behaviour

### Monthly/Quarterly report says "Partial Report"
- Fewer than 2 weekly reports (or 2 monthly reports) exist for that period
- Generate the underlying reports first, then regenerate the higher-level one
- Or accept the partial report — it falls back to vault-direct queries

### Report not opening after generation
- Check `05-Calendar/Weekly/` (or Monthly/Quarterly/Yearly) for the file
- Script creates the file even if the auto-open fails
- Open manually via File Explorer panel

### Metrics cache stale on hub
- Run **QuickAdd: Update Metrics Cache** before checking the hub
- Or open the hub — the Current Period Snapshot uses live queries (no cache needed)

---

## 📎 Related Docs

- [[📅Calendar Period Architecture Setup]] — folder structure and Periodic Notes plugin setup
- [[📅Calendar Review Hub]] — the actual hub with buttons and live status
- [[🔧Scripts Reference]] — all script descriptions and locations
- [[🔁My PKM Workflows]] — weekly review workflow in full context

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*