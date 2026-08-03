---
title: Daily Challenge - <% tp.date.now("YYYY-MM-DD") %>
type: challenge
challenge_type: daily
status: 🔄active
tags:
  - gamification
  - challenge
  - 📅daily
created: <% tp.date.now("YYYY-MM-DD") %>
difficulty: easy
xp_reward: 50
---

# 🎯 Daily Challenge - <% tp.date.now("dddd, MMMM DD, YYYY") %>

> **Today's Focus:** <% tp.date.now("dddd") %>

## Challenge Details

<%*
const dayOfWeek = tp.date.now("dddd");
const challenges = {
    "Monday": {
        name: "Fresh Start",
        icon: "🎯",
        description: "Process your inbox to zero",
        tasks: [
            "Review all inbox items",
            "Process each item (do, delegate, defer, delete)",
            "Achieve inbox zero",
            "Add next actions to appropriate lists"
        ],
        tips: "Start the week with a clear mind. Use the 2-minute rule!",
        bonus: "Complete before noon: +25 bonus XP"
    },
    "Tuesday": {
        name: "Connection Day",
        icon: "🔗",
        description: "Create 10 internal links between notes",
        tasks: [
            "Find 10 opportunities to link notes",
            "Use [[wiki-style]] links",
            "Add context around each link",
            "Review backlinks for insights"
        ],
        tips: "Look for natural connections. Each link strengthens your knowledge graph!",
        bonus: "Create 15+ links: +25 bonus XP"
    },
    "Wednesday": {
        name: "Writing Day",
        icon: "📝",
        description: "Create 3 new notes",
        tasks: [
            "Create first new note (any type)",
            "Create second new note",
            "Create third new note",
            "Add at least 1 link to each"
        ],
        tips: "Quality over quantity. Focus on capturing valuable ideas!",
        bonus: "Create 5+ notes: +25 bonus XP"
    },
    "Thursday": {
        name: "Task Day",
        icon: "✅",
        description: "Complete 5 high-priority tasks",
        tasks: [
            "Identify 5 high-priority tasks",
            "Complete task 1/5",
            "Complete task 2/5",
            "Complete task 3/5",
            "Complete task 4/5",
            "Complete task 5/5"
        ],
        tips: "Focus on tasks that move projects forward. Use the Eisenhower Matrix!",
        bonus: "Complete 8+ tasks: +25 bonus XP"
    },
    "Friday": {
        name: "Review Day",
        icon: "🔄",
        description: "Complete your weekly review",
        tasks: [
            "Review past week's accomplishments",
            "Process inbox to zero",
            "Update project statuses",
            "Plan next week's priorities",
            "Celebrate wins!"
        ],
        tips: "The weekly review keeps your system trusted. Don't skip it!",
        bonus: "Complete by Friday evening: +25 bonus XP"
    },
    "Saturday": {
        name: "Growth Day",
        icon: "🌱",
        description: "Promote 3 notes in maturity",
        tasks: [
            "Find 3 notes ready for promotion",
            "Promote note 1 (add content, links)",
            "Promote note 2 (add content, links)",
            "Promote note 3 (add content, links)",
            "Update maturity metadata"
        ],
        tips: "Nurture your knowledge! Add context, examples, and connections.",
        bonus: "Promote 5+ notes: +25 bonus XP"
    },
    "Sunday": {
        name: "Reflection Day",
        icon: "🧘",
        description: "Write daily note with gratitude and reflection",
        tasks: [
            "Create today's daily note",
            "Write 3 things you're grateful for",
            "Reflect on the week's lessons",
            "Set intentions for next week",
            "Review your goals"
        ],
        tips: "Reflection deepens learning. What went well? What will you improve?",
        bonus: "Add mood/energy tracking: +25 bonus XP"
    }
};

const today = challenges[dayOfWeek];
-%>

### <% today.icon %> **<% today.name %>**

**Description:** <% today.description %>

**Base Reward:** 50 XP
**Bonus:** <% today.bonus %>

---

## Tasks

<% today.tasks.forEach((task, i) => { %>
- [ ] <% task %>
<% }) %>

---

## Progress Tracker

**Started:** [ ]
**In Progress:** [ ]
**Completed:** [ ]

**Completion Time:** ________
**Bonus Earned:** [ ] Yes [ ] No

---

## Tips & Strategy

> [!tip] 💡 Pro Tip
> <% today.tips %>

---

## Reflection

**What went well:**


**Challenges faced:**


**Lessons learned:**


---

## XP Earned

**Base XP:** 0/50
**Bonus XP:** 0/25
**Total XP:** 0/75

---

## Related

- [[🎮Gamification Dashboard|Gamification Dashboard]]
- [[05-Calendar/Daily/<% tp.date.now("YYYY-MM-DD") %>|Today's Daily Note]]
- [[99-System/CIS/gamification-activities|Activity Points]]

---

*Challenge Type:* Daily
*Difficulty:* ⚪ Easy
*Created:* <% tp.date.now("YYYY-MM-DD HH:mm") %>
