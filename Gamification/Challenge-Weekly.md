---
title: Weekly Challenge - Week <% tp.date.now("WW-YYYY") %>
type: challenge
challenge_type: weekly
status: 🔄active
tags: [gamification, challenge, weekly]
created: <% tp.date.now("YYYY-MM-DD") %>
week: <% tp.date.now("WW") %>
difficulty: medium
xp_reward: 200
---

# 🎯 Weekly Challenge - Week <% tp.date.now("WW") %>, <% tp.date.now("YYYY") %>

> **Weekly Theme:** Rotating Challenge

## Challenge Details

<%*
const weekNum = parseInt(tp.date.now("WW"));
const rotation = weekNum % 4;

const challenges = [
    {
        name: "Evergreen Week",
        icon: "🌲",
        description: "Promote 5 notes to evergreen status",
        goal: "Transform good notes into foundational knowledge",
        tasks: [
            "Identify 5 sapling notes ready for evergreen promotion",
            "Add comprehensive content to each",
            "Create 5+ internal links per note",
            "Ensure each has 2+ backlinks",
            "Update maturity to 🌲 evergreen",
            "Add rich examples and context"
        ],
        strategy: "Focus on notes you reference frequently. Make them comprehensive and well-connected.",
        metrics: [
            "5 notes promoted to evergreen",
            "25+ total links added",
            "High-quality content in each"
        ]
    },
    {
        name: "MOC Week",
        icon: "🗺️",
        description: "Create or update 2 Maps of Content",
        goal: "Build navigation hubs for your knowledge domains",
        tasks: [
            "Choose 2 knowledge domains needing organization",
            "Create/update first MOC",
            "Add 10+ links to relevant notes",
            "Create/update second MOC",
            "Add 10+ links to relevant notes",
            "Ensure proper structure and categories"
        ],
        strategy: "MOCs are your knowledge GPS. Make them comprehensive and well-organized.",
        metrics: [
            "2 MOCs created/updated",
            "20+ total links added",
            "Clear categorization and structure"
        ]
    },
    {
        name: "Learning Week",
        icon: "📚",
        description: "Complete 1 book/course and create notes",
        goal: "Transform learning into actionable knowledge",
        tasks: [
            "Select book/course to complete",
            "Create source note for the material",
            "Create 5+ atomic notes from key concepts",
            "Link concepts to existing knowledge",
            "Write summary and key takeaways",
            "Define next actions based on learning"
        ],
        strategy: "Don't just consume—process! Create atomic notes for each key concept.",
        metrics: [
            "1 book/course completed",
            "5+ atomic notes created",
            "Summary with actionable insights"
        ]
    },
    {
        name: "Streak Week",
        icon: "🔥",
        description: "Maintain 7-day daily note streak",
        goal: "Build consistent daily journaling habit",
        tasks: [
            "Create Monday daily note",
            "Create Tuesday daily note",
            "Create Wednesday daily note",
            "Create Thursday daily note",
            "Create Friday daily note",
            "Create Saturday daily note",
            "Create Sunday daily note"
        ],
        strategy: "Consistency compounds! Even 5 minutes daily builds the habit.",
        metrics: [
            "7/7 daily notes completed",
            "Each with meaningful content",
            "Streak maintained"
        ]
    }
];

const thisWeek = challenges[rotation];
-%>

### <% thisWeek.icon %> **<% thisWeek.name %>**

**Description:** <% thisWeek.description %>

**Goal:** <% thisWeek.goal %>

**Reward:** 200 XP + Weekly Challenge Badge
**Bonus:** Complete all daily challenges this week: +100 XP

---

## Tasks

<% thisWeek.tasks.forEach((task, i) => { %>
- [ ] <% task %>
<% }) %>

---

## Progress Tracker

**Day 1 (Mon):** [ ] Daily Challenge
**Day 2 (Tue):** [ ] Daily Challenge
**Day 3 (Wed):** [ ] Daily Challenge
**Day 4 (Thu):** [ ] Daily Challenge
**Day 5 (Fri):** [ ] Daily Challenge
**Day 6 (Sat):** [ ] Daily Challenge
**Day 7 (Sun):** [ ] Daily Challenge

**Weekly Challenge:** [ ] Completed

---

## Success Metrics

<% thisWeek.metrics.forEach((metric, i) => { %>
- [ ] <% metric %>
<% }) %>

---

## Strategy & Tips

> [!tip] 💡 Strategy
> <% thisWeek.strategy %>

> [!info] Time Management
> - Spread tasks across the week
> - Dedicate 30-60 min daily
> - Use energy wisely (high-energy for hard tasks)
> - Don't procrastinate to weekend!

---

## Daily Log

### Monday


### Tuesday


### Wednesday


### Thursday


### Friday


### Saturday


### Sunday


---

## Weekly Reflection

**What worked well:**


**Obstacles encountered:**


**Key insights:**


**Next week's focus:**


---

## XP Summary

**Weekly Challenge XP:** 0/200
**Daily Challenges (7×50):** 0/350
**Bonus XP:** 0/100
**Total Potential XP:** 0/650

**Actual XP Earned:** ________

---

## Related

- [[🎮Gamification Dashboard|Gamification Dashboard]]
- [[05-Calendar/Weekly/<% tp.date.now("YYYY-[W]WW") %>|This Week's Note]]
- [[99-System/CIS/gamification-activities|Activity Points]]
- [[99-System/CIS/gamification-achievements|Achievements]]

---

*Challenge Type:* Weekly
*Difficulty:* 🟢 Medium
*Week:* <% tp.date.now("WW/YYYY") %>
*Created:* <% tp.date.now("YYYY-MM-DD HH:mm") %>
