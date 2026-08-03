# Gamification Activities

```dataview
TABLE activity, points, category, description
FROM "99-System/CIS"
WHERE file.name = "gamification-activities"
```

## Activity Points Reference

| Activity | Points | Category | Description |
|----------|--------|----------|-------------|
| **Note Creation** ||||
| Create Seed note | 5 | creation | New note in inbox/seed stage |
| Create Seedling note | 10 | creation | Note promoted to seedling |
| Create Sapling note | 20 | creation | Note promoted to sapling |
| Create Evergreen note | 50 | creation | Note promoted to evergreen |
| Create Fruit note | 100 | creation | Note promoted to fruit (published insight) |
| Create Daily note | 5 | routine | Daily journal entry |
| Create Weekly note | 15 | routine | Weekly review completed |
| Create Monthly note | 30 | routine | Monthly review completed |
| Create Quarterly note | 75 | routine | Quarterly planning session |
| **Task Management** ||||
| Complete task (low priority) | 3 | productivity | Low priority task done |
| Complete task (medium priority) | 5 | productivity | Medium priority task done |
| Complete task (high priority) | 10 | productivity | High priority task done |
| Process inbox item | 2 | productivity | GTD inbox processing |
| Empty inbox completely | 25 | productivity | Clear entire inbox to zero |
| Complete project | 50 | productivity | Full project completion |
| **Knowledge Development** ||||
| Add internal link | 1 | knowledge | Link between notes |
| Create MOC | 30 | knowledge | Map of Content creation |
| Add 10+ links to note | 15 | knowledge | Rich interconnection |
| Add backlink (automatic) | 2 | knowledge | Note referenced by others |
| Add source/reference | 5 | knowledge | Cite external material |
| **GTD Activities** ||||
| GTD Weekly Review | 25 | routine | Complete weekly review |
| Define Next Action | 3 | productivity | Clear next action defined |
| Capture 10+ items in day | 10 | productivity | Active capture habit |
| Process Waiting For item | 5 | productivity | Follow up on delegated item |
| **Learning & Growth** ||||
| Complete course/book | 40 | learning | Finish learning material |
| Take meeting notes | 8 | learning | Document meeting with actions |
| Create learning note | 10 | learning | Document new learning |
| Apply learning (fruit) | 50 | learning | Turn learning into action/output |
| **Streak Bonuses** ||||
| Daily note 7-day streak | 35 | streak | Week of daily journaling |
| Daily note 30-day streak | 200 | streak | Month of daily journaling |
| Weekly review 4-week streak | 100 | streak | Month of weekly reviews |
| Inbox zero 7-day streak | 50 | streak | Week of inbox discipline |
| **Special Activities** ||||
| Vault health report | 20 | maintenance | Run vault analysis |
| Template creation | 25 | system | Create new template |
| Workflow documentation | 30 | system | Document new workflow |
| Help others (share note) | 15 | social | Share knowledge externally |

## Multipliers

- **Morning completion** (before 12pm): 1.2x
- **Weekend warrior** (Sat/Sun activity): 1.5x
- **Night owl** (after 10pm): 1.1x
- **Combo bonus** (5+ activities in hour): 1.3x
- **Perfect day** (daily note + inbox zero + 3 tasks): 2x all points for day

## Negative Points (Anti-Patterns)

- Note older than 30 days still in seed: -5
- Inbox item older than 7 days: -2 per item
- Broken link: -1
- Duplicate note: -10
- Week without daily note: -15
- Month without weekly review: -25
