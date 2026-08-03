# Gamification Levels

```dataview
TABLE level, title, xp_required, perks
FROM "99-System/CIS"
WHERE file.name = "gamification-levels"
```

## Level System

| Level | XP Required | Title | Icon | Perks |
|-------|-------------|-------|------|-------|
| 1 | 0 | Novice Note-Taker | 🌱 | Starting journey |
| 2 | 100 | Curious Capturer | 📝 | Inbox mastery begins |
| 3 | 300 | Diligent Documenter | 📚 | Template access expanded |
| 4 | 600 | Knowledge Seeker | 🔍 | Advanced queries unlocked |
| 5 | 1,000 | Task Terminator | ✅ | GTD power user |
| 6 | 1,500 | Link Architect | 🔗 | Connection master |
| 7 | 2,200 | Review Ritualist | 🔄 | Consistency champion |
| 8 | 3,000 | Maturity Cultivator | 🪴 | Growth gardener |
| 9 | 4,000 | MOC Maestro | 🗺️ | Navigation expert |
| 10 | 5,500 | Evergreen Gardener | 🌲 | Knowledge curator |
| 11 | 7,500 | Insight Harvester | 🍓 | Fruit producer |
| 12 | 10,000 | System Architect | 🏗️ | Workflow optimizer |
| 13 | 13,000 | Productivity Samurai | ⚔️ | Efficiency master |
| 14 | 17,000 | Zettelkasten Zen Master | 🧘 | PKM philosopher |
| 15 | 22,000 | Knowledge Alchemist | ⚗️ | Transform info to gold |
| 16 | 28,000 | Habit Titan | 💪 | Unbreakable routines |
| 17 | 35,000 | Vault Virtuoso | 🎭 | Complete mastery |
| 18 | 43,000 | Second Brain Sovereign | 👑 | Mind palace ruler |
| 19 | 52,000 | Meta-Cognition Master | 🧠 | Thinking about thinking |
| 20 | 65,000 | PKM Legendary | ⭐ | Hall of fame |

## Prestige System

After reaching Level 20, you can "prestige" to reset to Level 1 with:
- Special **✨ Prestige** badge
- 2x XP multiplier for all activities
- Exclusive prestige-only achievements
- Custom vault theme unlock
- Legacy stats preserved

**Prestige Titles:**
- Prestige 1: ✨ PKM Sage
- Prestige 2: ✨✨ Obsidian Overlord
- Prestige 3: ✨✨✨ Eternal Scholar
- Prestige 5: ✨✨✨✨✨ Transcendent Mind

## Level Benefits

### Tier 1 (Levels 1-5): Foundation
- Basic templates
- Standard workflows
- Core features

### Tier 2 (Levels 6-10): Expansion
- Advanced templates unlocked
- Custom queries available
- Automation scripts enabled

### Tier 3 (Levels 11-15): Mastery
- Expert templates
- AI prompt library access
- Custom dashboard creation

### Tier 4 (Levels 16-20): Legend
- All features unlocked
- Community contribution rights
- Custom system creation
- Mentor status

## XP Calculation

```javascript
// Formula for level progression
const xpForLevel = (level) => {
  if (level <= 1) return 0;
  return Math.floor(100 * level * (level - 1) / 2);
};

// Progress to next level
const progressPercent = (currentXP, currentLevel) => {
  const currentLevelXP = xpForLevel(currentLevel);
  const nextLevelXP = xpForLevel(currentLevel + 1);
  return ((currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
};
```
