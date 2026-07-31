---
type: template
status: 🔄active
created: 2026-01-16
tags:
  - 🧭navigation
  - ux
---

# Unified Navigation Template

> [!orbit]- Quick Navigation
> **Core Dashboards:**
> [[🏡Home|🏡 Home]] • [[👁️Dashboard|📊 Dashboard]] • [[TODO|✅ TODO]] • [[🎮Gamification Dashboard|🎮 Game]] • [[📈Performance Metrics|📈 Metrics]]
>
> **Quick Actions:**
> [[+Inbox|📥 Inbox]] • [[🗺️My PKM MOC|🗺️ PKM]] • [[🎯GTD Weekly Review - Template|📅 Review]]
>
> **Processing:**
> `Ctrl+P` → ⚡Quick Process - Atomic/Source/Effort • 🤖Smart Classify • 📦Batch Process

---

## Usage Instructions

### How to Add to Existing Notes

**Method 1: Templater Insert (Recommended)**
1. Open any note
2. `Ctrl/Cmd + P` → "Templater: Open Insert Template Modal"
3. Select "Navigation/Unified-Nav"
4. Template inserts at cursor position

**Method 2: QuickAdd Macro**
1. `Ctrl/Cmd + P` → "QuickAdd: 📍Add Navigation"
2. Automatically inserts at top of current note

**Method 3: Manual Copy-Paste**
Copy the navigation callout below and paste into any note:

```markdown
> [!orbit]- Quick Navigation
> **Core Dashboards:**
> [[🏡Home|🏡 Home]] • [[👁️Dashboard|📊 Dashboard]] • [[TODO|✅ TODO]] • [[🎮Gamification Dashboard|🎮 Game]] • [[Performance Metrics|📈 Metrics]]
>
> **Quick Actions:**
> [[+Inbox|📥 Inbox]] • [[🗺️My PKM MOC|🗺️ PKM]] • [[🎯GTD Weekly Review - Template|📅 Review]]
>
> **Processing:**
> `Ctrl+P` → ⚡Quick Process - Atomic/Source/Effort • 🤖Smart Classify • 📦Batch Process
```

---

## Customization

### For Specific Note Types

**Atomic Notes:**
```markdown
> [!orbit]- Quick Navigation
> [[🏡Home|🏡]] • [[👁️Dashboard|📊]] • [[_Index|💡 Atomics Index]] • [[+Inbox|📥]]
>
> **Quick Actions:** `Ctrl+P` → ⚡Quick Process - Atomic • 🤖Smart Classify
```

**Effort Notes:**
```markdown
> [!orbit]- Quick Navigation
> [[TODO|✅ TODO]] • [[_Index|🚀 Projects]] • [[+Inbox|📥]]
>
> **Quick Actions:** `Ctrl+P` → ⚡Quick Process - Effort • Update Status
```

**Source Notes:**
```markdown
> [!orbit]- Quick Navigation
> [[🏡Home|🏡]] • [[_Index|📚 Sources]] • [[+Inbox|📥]]
>
> **Quick Actions:** `Ctrl+P` → ⚡Quick Process - Source • 🤖Smart Classify
```

---

## Design Notes

**Why Collapsible (`-` after `!orbit`)?**
- Reduces visual clutter on page load
- Navigation available on-demand
- Preserves vertical space for content

**Link Format: `[[Target|Display]]`**
- Cleaner, emoji-based display text
- Shorter horizontal width
- Easier to scan

**Keyboard Shortcuts Included:**
- `Ctrl+P` for Command Palette access
- Reminds users of automation features
- Reduces mouse dependency

---

## Best Practices

1. **Place at top of note** - Users expect navigation first
2. **Keep collapsed by default** - Reduces noise
3. **Customize for note type** - Not all notes need all links
4. **Update quarterly** - As your workflow evolves
5. **Mobile optimization** - Collapsible works great on mobile

---

*Template Version: 1.0*
*Last Updated: 2026-01-16*
