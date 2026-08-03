# Gamification Achievements

```dataview
TABLE category, difficulty, xp_reward
FROM "99-System/CIS"
WHERE file.name = "gamification-achievements"
```

## Achievement Categories

### 🏆 Creation Achievements

| Achievement | Description | Difficulty | XP Reward |
|-------------|-------------|------------|-----------|
| **First Steps** | Create your first note | Common | 10 |
| **Century Club** | Create 100 notes | Uncommon | 100 |
| **Knowledge Factory** | Create 500 notes | Rare | 500 |
| **Prolific Producer** | Create 1,000 notes | Epic | 1,500 |
| **Atomic Adept** | Create 50 atomic notes | Uncommon | 150 |
| **Source Scholar** | Add 100 sources | Rare | 300 |
| **Template Master** | Create 10 custom templates | Rare | 400 |
| **MOC Architect** | Create 20 MOCs | Epic | 600 |

### ✅ Productivity Achievements

| Achievement | Description | Difficulty | XP Reward |
|-------------|-------------|------------|-----------|
| **Task Slayer** | Complete 10 tasks | Common | 20 |
| **Productivity Beast** | Complete 100 tasks | Uncommon | 200 |
| **Task Terminator** | Complete 500 tasks | Rare | 800 |
| **Inbox Zero Hero** | Achieve inbox zero | Common | 50 |
| **Zero Tolerance** | Inbox zero 10 times | Uncommon | 200 |
| **Inbox Ninja** | Inbox zero 50 times | Epic | 800 |
| **GTD Guru** | Complete 10 weekly reviews | Rare | 400 |
| **Review Ritualist** | Complete 52 weekly reviews | Legendary | 2,000 |
| **High Priority Hunter** | Complete 50 high priority tasks | Uncommon | 300 |
| **Project Finisher** | Complete 10 projects | Rare | 500 |

### 🌱 Growth Achievements

| Achievement | Description | Difficulty | XP Reward |
|-------------|-------------|------------|-----------|
| **Seed Sower** | Have 10 seed notes | Common | 15 |
| **Green Thumb** | Promote 10 notes to seedling | Common | 50 |
| **Gardener** | Promote 10 notes to sapling | Uncommon | 150 |
| **Forest Keeper** | Have 50 evergreen notes | Rare | 600 |
| **Fruit Harvester** | Create 10 fruit notes | Epic | 1,000 |
| **Master Gardener** | Have 100 evergreen notes | Legendary | 3,000 |
| **Orchard Owner** | Have 50 fruit notes | Legendary | 5,000 |

### 🔗 Connection Achievements

| Achievement | Description | Difficulty | XP Reward |
|-------------|-------------|------------|-----------|
| **Link Builder** | Create 50 internal links | Common | 30 |
| **Web Weaver** | Create 500 internal links | Uncommon | 250 |
| **Network Architect** | Create 2,000 internal links | Rare | 1,000 |
| **Backlink Champion** | Have note with 20+ backlinks | Uncommon | 200 |
| **Hub Creator** | Have note with 50+ backlinks | Epic | 800 |
| **Knowledge Nexus** | Have note with 100+ backlinks | Legendary | 2,500 |

### 🔥 Streak Achievements

| Achievement | Description | Difficulty | XP Reward |
|-------------|-------------|------------|-----------|
| **Week Warrior** | 7-day daily note streak | Common | 75 |
| **Month Master** | 30-day daily note streak | Rare | 500 |
| **Quarter Champion** | 90-day daily note streak | Epic | 2,000 |
| **Year Legend** | 365-day daily note streak | Legendary | 10,000 |
| **Weekly Reviewer** | 4-week review streak | Uncommon | 200 |
| **Review Champion** | 12-week review streak | Rare | 800 |
| **Inbox Discipline** | 7-day inbox zero streak | Uncommon | 150 |
| **Zero Master** | 30-day inbox zero streak | Epic | 1,200 |

### 🎯 Special Achievements

| Achievement | Description | Difficulty | XP Reward |
|-------------|-------------|------------|-----------|
| **Night Owl** | Create note after midnight | Common | 20 |
| **Early Bird** | Create note before 6am | Common | 20 |
| **Weekend Warrior** | 10 weekend sessions | Uncommon | 100 |
| **Vault Analyst** | Run vault health report | Common | 50 |
| **Perfect Day** | Daily note + inbox zero + 3 tasks | Uncommon | 150 |
| **Perfect Week** | 7 perfect days in a row | Epic | 1,500 |
| **Metadata Master** | 100 notes with complete metadata | Rare | 400 |
| **Tag Wizard** | Use 50+ unique tags | Uncommon | 200 |
| **Context King** | Use all GTD contexts | Uncommon | 150 |
| **Energy Expert** | Track energy for 30 days | Rare | 300 |

### 📚 Learning Achievements

| Achievement | Description | Difficulty | XP Reward |
|-------------|-------------|------------|-----------|
| **Book Worm** | Complete 10 books | Uncommon | 200 |
| **Avid Reader** | Complete 50 books | Rare | 800 |
| **Course Completer** | Finish 5 courses | Uncommon | 300 |
| **Lifelong Learner** | Finish 20 courses | Epic | 1,200 |
| **Meeting Master** | 50 meeting notes | Uncommon | 250 |
| **Knowledge Sharer** | Share 10 notes externally | Rare | 500 |

### 🏅 Mastery Achievements

| Achievement | Description | Difficulty | XP Reward |
|-------------|-------------|------------|-----------|
| **Vault Veteran** | 100 days of vault usage | Uncommon | 300 |
| **PKM Professional** | 365 days of vault usage | Rare | 1,500 |
| **System Designer** | Create custom workflow | Epic | 1,000 |
| **Automation Ace** | Create 10 custom scripts | Epic | 1,500 |
| **Dashboard Designer** | Create custom dashboard | Rare | 600 |
| **Template Titan** | Create 25 custom templates | Epic | 2,000 |

### 💎 Hidden Achievements

| Achievement | Description | Difficulty | XP Reward |
|-------------|-------------|------------|-----------|
| **Easter Egg Hunter** | Find hidden note | Rare | 777 |
| **Completionist** | Unlock all other achievements | Legendary | 10,000 |
| **Speed Demon** | Create 50 notes in one day | Epic | 1,000 |
| **Link Explosion** | Add 100 links in one day | Epic | 800 |
| **Marathon Runner** | 8+ hour vault session | Rare | 500 |
| **Comeback Kid** | Return after 30-day absence | Uncommon | 200 |

## Difficulty Tiers

- **Common** (⚪): Easy to achieve, basic milestones
- **Uncommon** (🟢): Requires consistent effort
- **Rare** (🔵): Significant achievement
- **Epic** (🟣): Major accomplishment
- **Legendary** (🟠): Ultimate mastery

## Achievement Progress Tracking

Achievements are tracked automatically via Dataview queries based on:
- Note counts by type and maturity
- Task completion counts
- Streak calculations from calendar notes
- Link and backlink counts
- Metadata completeness
- Time-based activities
