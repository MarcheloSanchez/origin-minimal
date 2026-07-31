---
title: Review HQ
aliases:
  - Review Hub
  - Review Dashboard
type: moc
fileClass: MOC
tags:
  - 📊dashboard
  - ⚙️system
  - 🎯gtd
  - ⚡productivity
  - 🧭navigation
status: 🔄active
maturity: 🌲evergreen
priority: high
processing_priority: high
created: 2026-01-15
modified: 2026-07-11
version: 3
cssclasses:
  - wide-page
  - review-hq
related:
  - "[[🎯GTD Weekly Review - Template]]"
  - "[[🧹Cleaning Lady]]"
  - "[[🌱Incubator]]"
---

> [!orbit] Wayfinder | [[👁️Dashboard]] | [[TODO]] | [[🎯GTD Weekly Review - Template]]

# 🧭 Review HQ

> [!quote] One Place Where Remaining Work Meets
> This is your single convergence point for all work that needs attention. When in doubt, start here.

---

## 📖 Table of Contents

1. [[#🚦 System Health Dashboard]] — Am I okay? (30 sec glance)
2. [[#🕐 Scheduled Task Health]] — Are the automation cron jobs actually running?
3. [[#🔥 Top 3 Focus Suggestions]] — What should I do right now?
4. [[#⚠️ Urgent Attention]] — Overdue + due soon
5. [[#📥 Inbox Triage]] — What's piling up?
6. [[#⏳ Waiting & Blocked]] — What's stuck?
7. [[#🔄 Review Flows]] — Daily / Weekly / Monthly checklists
8. [[#🔗 Quick Navigation]] — Jump to subsystems

---

## 🚦 System Health Dashboard

> [!tip] Glance here first. Green = calm. Yellow = attention needed. Red = action required.
>
> **Quick Actions by Status:**
> 
> | If Red... | Go To | Action |
> |-----------|-------|--------|
> | 📥 Inbox | [[+Inbox]] | Triage oldest 5 items |
> | ⚠️ Overdue | [[#⚠️ Urgent Attention]] | Reschedule or complete |
> | 🚀 Efforts | [[03-Efforts]] | Archive or pause 2 |
> | ⏳ Waiting | [[#⏳ Waiting & Blocked]] | Follow up or close |
> | 🧹 Maintenance | [[🧹Cleaning Lady]] | Quick 5-min fix |

```dataviewjs
/**
 * QUERY: System Health Indicators (Cache-Optimized)
 * PURPOSE: Comprehensive GTD health dashboard with 6 metrics
 * DEPENDS ON: 99-System/_Metrics Cache (primary), live queries (fallback)
 * UPDATED: 2026-02-07
 */
try {
const cache = dv.page("99-System/_Metrics Cache");
const today = dv.date("today");
const oneWeekAgo = dv.date("today").minus({days: 7});

// --- Inbox Health (cache for count, live for age) ---
const inboxItems = dv.pages('"+Inbox"').where(p => p.file.name !== "+Inbox" && !p.file.name.includes("About"));
const inboxCount = cache?.cache_date ? (cache.inbox_count ?? inboxItems.length) : inboxItems.length;
const oldInboxItems = inboxItems.filter(p => p.file.ctime < oneWeekAgo).length;
const inboxStatus = inboxCount <= 5 ? "🟢" : inboxCount <= 15 ? "🟡" : "🔴";
const inboxAge = oldInboxItems === 0 ? "🟢" : oldInboxItems <= 3 ? "🟡" : "🔴";

// --- Overdue Tasks (live — time-sensitive) ---
const allTasks = dv.pages().file.tasks.where(t => !t.completed);
const overdueTasks = allTasks.filter(t => t.due && dv.date(t.due) < today).length;
const overdueStatus = overdueTasks === 0 ? "🟢" : overdueTasks <= 3 ? "🟡" : "🔴";

// --- Active Efforts (cache or live) ---
const activeEfforts = cache?.cache_date
  ? (cache.effort_count ?? 0)
  : dv.pages('"03-Efforts"').where(p => p.status === "🔄active").length;
const effortStatus = activeEfforts <= 5 ? "🟢" : activeEfforts <= 10 ? "🟡" : "🔴";

// --- Waiting For (live — needs task scanning) ---
const waitingItems = dv.pages().where(p =>
  p.status === "⏳waiting" || p.waiting_for
).length;
const waitingTasks = allTasks.filter(t =>
  t.text.toLowerCase().includes("@waiting") || t.text.includes("⏳")
).length;
const totalWaiting = waitingItems + waitingTasks;
const waitingStatus = totalWaiting <= 3 ? "🟢" : totalWaiting <= 7 ? "🟡" : "🔴";

// --- Maintenance Debt (live — needs tag scanning) ---
const tidyNotes = dv.pages().where(p => p.file.tags && p.file.tags.some(t => t.includes("tidy") || t.includes("🧹"))).length;
const developNotes = dv.pages().where(p => p.file.tags && p.file.tags.some(t => t.includes("develop") || t.includes("🌱develop"))).length;
const maintenanceTotal = tidyNotes + developNotes;
const maintenanceStatus = maintenanceTotal <= 5 ? "🟢" : maintenanceTotal <= 15 ? "🟡" : "🔴";

// --- Render Dashboard ---
dv.paragraph(`
| Metric | Count | Status | Target |
|--------|-------|--------|--------|
| 📥 **Inbox Items** | ${inboxCount} | ${inboxStatus} | ≤ 5 |
| 📥 **Inbox Age (>7d)** | ${oldInboxItems} | ${inboxAge} | 0 |
| ⚠️ **Overdue Tasks** | ${overdueTasks} | ${overdueStatus} | 0 |
| 🚀 **Active Efforts** | ${activeEfforts} | ${effortStatus} | ≤ 5 |
| ⏳ **Waiting/Blocked** | ${totalWaiting} | ${waitingStatus} | ≤ 3 |
| 🧹 **Maintenance Debt** | ${maintenanceTotal} | ${maintenanceStatus} | ≤ 5 |
`);

// Overall health score
const scores = [
  inboxCount <= 5 ? 2 : inboxCount <= 15 ? 1 : 0,
  oldInboxItems === 0 ? 2 : oldInboxItems <= 3 ? 1 : 0,
  overdueTasks === 0 ? 2 : overdueTasks <= 3 ? 1 : 0,
  activeEfforts <= 5 ? 2 : activeEfforts <= 10 ? 1 : 0,
  totalWaiting <= 3 ? 2 : totalWaiting <= 7 ? 1 : 0,
  maintenanceTotal <= 5 ? 2 : maintenanceTotal <= 15 ? 1 : 0
];
const totalScore = scores.reduce((a, b) => a + b, 0);
const maxScore = 12;
const healthEmoji = totalScore >= 10 ? "🟢" : totalScore >= 6 ? "🟡" : "🔴";
const healthLabel = totalScore >= 10 ? "Healthy" : totalScore >= 6 ? "Needs Attention" : "Critical";

dv.paragraph(`**Overall System Health:** ${healthEmoji} ${healthLabel} (${totalScore}/${maxScore})`);
} catch (e) {
  dv.paragraph(`⚠️ Error loading system health: ${e.message}`);
}
```

---

## 🕐 Scheduled Task Health

> [!tip] Surfaces the 3 Task Scheduler cron jobs (`vault-morning-dryrun`, `vault-desloppify-dryrun`, `enum-drift-check`) — all report-only, all write to gitignored logs nobody sees by default. This is that visible surface (Blueprint 10, Decision 2).

```dataviewjs
try {
  const logs = [
    { name: "vault-morning-dryrun", cadence: "Daily 07:30", path: "AIOS/orchestration/reports/cron-morning.log" },
    { name: "vault-desloppify-dryrun", cadence: "Weekly Sun 08:00", path: "AIOS/orchestration/reports/cron-desloppify.log" },
    { name: "enum-drift-check", cadence: "Weekly Sun 08:10", path: "AIOS/orchestration/reports/cron-enum-drift.log" }
  ];

  const now = window.moment();

  for (const log of logs) {
    const exists = await app.vault.adapter.exists(log.path);
    if (!exists) {
      dv.paragraph(`**${log.name}** (${log.cadence}) — ⚪ no log yet`);
      continue;
    }
    const stat = await app.vault.adapter.stat(log.path);
    const mtime = window.moment(stat.mtime);
    const ageHours = now.diff(mtime, "hours");
    const staleLimit = log.cadence.startsWith("Daily") ? 30 : 24 * 8; // daily: 30h grace; weekly: 8d grace
    const freshness = ageHours <= staleLimit ? "🟢" : "🔴 STALE";
    const content = await app.vault.adapter.read(log.path);
    const isError = /is not recognized|Traceback|command not found/i.test(content);
    const tail = content.trim().split("\n").slice(-6).join("\n");

    dv.paragraph(`**${log.name}** (${log.cadence}) — ${freshness} last run ${mtime.fromNow()} ${isError ? "⚠️ ERROR OUTPUT" : ""}`);
    dv.paragraph("```\n" + tail + "\n```");
  }
} catch (e) {
  dv.paragraph(`⚠️ Error reading scheduled task logs: ${e.message}`);
}
```

---

## 🔥 Top 3 Focus Suggestions

> [!info] Auto-generated based on: Due soon + Recently modified + Not blocked
> These are your highest-leverage actions right now.

```dataviewjs
/**
 * QUERY: Top 3 Focus Items (Weighted Scoring)
 * PURPOSE: Surface highest-leverage actions based on due date, priority, momentum
 * DEPENDS ON: status, due, priority, file.mtime, energy, completion_percentage
 * UPDATED: 2026-02-07
 */
try {
const today = dv.date("today");
const threeDays = dv.date("today").plus({days: 3});

// Get all relevant pages
let candidates = dv.pages()
  .where(p =>
    p.status === "🔄active" &&
    !p.waiting_for &&
    !p.blocked_by &&
    p.file.folder !== "06-Archive" &&
    p.file.folder !== "Templates" &&
    !p.file.path.includes("Archive")
  )
  .map(p => {
    let score = 0;

    // Due date scoring (higher = more urgent)
    if (p.due) {
      const dueDate = dv.date(p.due);
      if (dueDate) {
        const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
        if (daysUntilDue < 0) score += 50; // Overdue
        else if (daysUntilDue <= 1) score += 40; // Due today/tomorrow
        else if (daysUntilDue <= 3) score += 30; // Due soon
        else if (daysUntilDue <= 7) score += 15; // This week
      }
    }

    // Priority scoring
    if (p.priority === "high") score += 25;
    else if (p.priority === "medium") score += 10;

    // Recently modified = momentum
    if (p.file.mtime) {
      const daysSinceModified = Math.floor((today - p.file.mtime) / (1000 * 60 * 60 * 24));
      if (daysSinceModified <= 1) score += 15;
      else if (daysSinceModified <= 3) score += 10;
      else if (daysSinceModified <= 7) score += 5;
    }

    // Energy boost for high-energy when it's morning (approximate)
    if (p.energy === "high") score += 5;

    // Completion percentage (prefer nearly done)
    if (p.completion_percentage && p.completion_percentage >= 70) score += 10;

    return { page: p, score: score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 3);

if (candidates.length > 0) {
  dv.table(
    ["#", "Focus Item", "Why", "Next Action"],
    candidates.map((item, i) => [
      `**${i + 1}**`,
      item.page.file.link,
      item.page.due
        ? `📅 Due: ${item.page.due}`
        : item.page.priority === "high"
          ? "⚡ High priority"
          : "🔄 Active momentum",
      item.page.next_actions || "—"
    ])
  );
} else {
  dv.paragraph("*No urgent focus items detected. Check your [[TODO]] for next actions by context.*");
}
} catch (e) {
  dv.paragraph(`⚠️ Error loading focus items: ${e.message}`);
}
```

> [!tip] Can't decide? Pick #1 and work for 25 minutes. Then reassess.

---

## ⚠️ Urgent Attention

> [!danger]- 🚨 **Action Hub: Urgent Items**
> **Overdue tasks:**
> - Click the task link → complete it NOW or reschedule with a new `due::` date
> - Can't do it? → Change to `@waiting` and note who/what you're waiting for
>
> **Approaching dues:**
> - Open the effort → update `next_actions` field with immediate step
> - Need to delegate? → Add `waiting_for::` and `waiting_since::` fields
> - Need to postpone? → Update `due` and add reason in note body
>
> **Where to manage:** [[TODO#📅 Calendar View]]

### 🔴 Overdue Tasks

```dataview
TASK
WHERE !completed
  AND due
  AND due < date(today)
SORT due ASC
LIMIT 10
```

### 🟡 Due Within 3 Days

```dataview
TASK
WHERE !completed
  AND due
  AND due >= date(today)
  AND due <= date(today) + dur(3 days)
SORT due ASC
LIMIT 10
```

### 📅 Efforts with Approaching Deadlines

```dataview
TABLE WITHOUT ID
  file.link as "Effort",
  due as "📅 Deadline",
  priority as "Priority",
  choice(completion_percentage, completion_percentage + "%", "?") as "Progress"
FROM "03-Efforts"
WHERE status = "🔄active"
  AND due
  AND due <= date(today) + dur(7 days)
SORT due ASC
LIMIT 7
```

---

## 📥 Inbox Triage

> [!warning] Target: Process within 48 hours. Items older than 7 days need immediate attention.

> [!example]- 📬 **Action Hub: Inbox Processing**
> **Go to:** [[+Inbox]] to process items directly
>
> **2-Minute Triage Decision Tree:**
> ```
> Is it actionable?
> ├─ NO → Is it reference material?
> │       ├─ YES → Move to [[04-Sources]] or [[02-Knowledge]]
> │       └─ NO → 🗑️ Delete it
> └─ YES → Can I do it in <2 min?
>         ├─ YES → Do it now, then delete/archive
>         └─ NO → Is it a project?
>                 ├─ YES → Create in [[03-Efforts]]
>                 └─ NO → Add task to relevant note
> ```
>
> **Quick destination guide:**
> | Content Type | Move To | Create Via |
> |--------------|---------|----------|
> | Idea/thought | [[02-Knowledge]] | ⚡ Create → Atomic |
> | Task/project | [[03-Efforts]] | ⚡ Create → Effort |
> | Reference | [[04-Sources]] | ⚡ Create → Source |
> | Meeting note | [[04-Sources]] | ⚡ Create → Meeting |
> | Unsure | Keep + add #🚤floating | — |

### Inbox Overview

### 🚨 Stale Inbox Items (>7 days)

```dataview
TABLE WITHOUT ID
  file.link as "📄 Item",
  round((date(today) - file.ctime) / dur(1 day)) + " days" as "⏰ Age"
FROM "+Inbox"
WHERE file.name != "+Inbox"
  AND !contains(file.name, "About")
  AND file.ctime < date(today) - dur(7 days)
SORT file.ctime ASC
LIMIT 10
```

---

## ⏳ Waiting & Blocked

> [!info] Things you can't act on until someone/something else moves.

> [!question]- ⏳ **Action Hub: Unblock Your Work**
> **For each waiting item, decide:**
>
> | Situation | Action | How |
> |-----------|--------|-----|
> | No response >3 days | Send follow-up | Note the follow-up in the task |
> | Stale >2 weeks | Escalate or find alternative | Update `waiting_for` or remove |
> | Resolved | Unblock it | Remove `waiting_for`, set `status: 🔄active` |
> | No longer needed | Close it | Set `status: ❌cancelled` or delete |
>
> **Quick follow-up template:**
> ```
> Hey [name], following up on [topic] from [date].
> Let me know if you need anything from me to move forward.
> ```
>
> **Where to manage waiting contexts:** [[TODO#⏳ Waiting For]]

### Notes in Waiting Status

```dataview
TABLE WITHOUT ID
  file.link as "Item",
  waiting_for as "⏳ Waiting For",
  waiting_since as "📅 Since",
  choice(round((date(today) - waiting_since) / dur(1 day)), round((date(today) - waiting_since) / dur(1 day)) + " days", "?") as "Duration"
FROM ""
WHERE status = "⏳waiting" OR waiting_for
SORT waiting_since ASC
LIMIT 10
```

### Tasks Tagged @waiting

```tasks
not done
(description includes @waiting) OR (description includes ⏳)
sort by created
limit 10
```

### Blocked Efforts

```dataview
TABLE WITHOUT ID
  file.link as "Effort",
  blocked_by as "🚫 Blocked By",
  priority as "Priority"
FROM "03-Efforts"
WHERE blocked_by OR status = "⚠️blocked"
SORT priority DESC
LIMIT 7
```

> [!tip] **Weekly Waiting Review**
> For each waiting item:
> 1. Is follow-up needed? → Send reminder
> 2. Is it stale (>2 weeks)? → Escalate or find alternative
> 3. Is it no longer relevant? → Close it

---

## 🔄 Review Flows

> [!multi-column]
>
> > [!note]+ ☀️ Daily (10 min)
> > **When:** Morning + Evening
> > **Focus:** Clarity & closure
> > **Skip to:** [[#☀️ Daily Review (10 min)]]
>
> > [!note]+ 📅 Weekly (30-45 min)
> > **When:** End of week
> > **Focus:** Get current
> > **Skip to:** [[#📅 Weekly Review (30-45 min)]]
> > **Full version:** [[🎯GTD Weekly Review - Template]]
>
> > [!note]+ 📆 Monthly (60-90 min)
> > **When:** First weekend
> > **Focus:** Zoom out & realign
> > **Skip to:** [[#📆 Monthly Review (60-90 min)]]

### ☀️ Daily Review (10 min)

> [!info] Purpose: Start the day with clarity. End the day with closure.

**Morning Start (5 min)**
- [ ] Glance at [[#🚦 System Health Dashboard]] — any red indicators?
- [ ] Check [[#🔥 Top 3 Focus Suggestions]] — what's my #1 priority?
- [ ] Scan [[#⚠️ Urgent Attention]] — any overdue items?
- [ ] If inbox > 10: quick-triage 3 oldest items (2 min each)

**Evening Close (5 min)**
- [ ] Log what I accomplished in today's daily note
- [ ] Any new tasks captured? Quick inbox sweep
- [ ] Set tomorrow's intention (write in TODO or daily note)

**Output:** Clear head, closed loops, tomorrow's focus set.

> [!done]- ✅ **After Daily Review: What's Next?**
> **Morning path:**
> - Open your #1 focus item from [[#🔥 Top 3 Focus Suggestions]]
> - Or go to [[TODO#📋 Next Actions by Context]] for context-based work
>
> **Evening path:**
> - Or log today's wins in [[🏡Home]]

---

### 📅 Weekly Review (30-45 min)

> [!info] Purpose: Get current. Get clear. Get creative. ([Full checklist →](🎯GTD%20Weekly%20Review%20-%20Template.md))

#### Phase 1: GET CLEAR (10 min)
- [ ] Empty inbox to ≤5 items ([[+Inbox]])
- [ ] Process all new captures from the week
- [ ] Clear email/messaging inboxes (external)
- [ ] Mind sweep: any floating commitments? Capture them.

#### Phase 2: GET CURRENT (15 min)
- [ ] Review [[#⏳ Waiting & Blocked]] — follow up needed?
- [ ] Review [[#⚠️ Urgent Attention]] — reschedule if needed
- [ ] Check active efforts in [[03-Efforts]] — any stalled?
- [ ] Review calendar: past week (anything missed?) + next 2 weeks (prep needed?)
- [ ] Update any stale `completion_percentage` values
- [ ] Re-rank active efforts (`rank` 1–10): 7–10 = this week, 4–6 = steady, 1–3 = backlog

#### Phase 3: GET CREATIVE (10 min)
- [ ] Review [[🌱Incubator]] — any ideas ready to activate?
- [ ] Any new efforts to start? Create note in [[03-Efforts]]
- [ ] Connect dots: any notes that should be linked?

#### Phase 4: COMMIT (5 min)
- [ ] Set 3 priorities for next week (write below or in weekly note)
- [ ] Schedule any calendar blocks needed

**This Week's Priorities:**
1.
2.
3.

> [!done]- ✅ **After Weekly Review: What's Next?**
> **Wrap-up actions:**
> - [ ] Block time in your calendar for priority #1
> - [ ] Send any follow-ups identified in Waiting review
>
> **Quick links for next week:**
> - Start Monday with [[#☀️ Daily Review (10 min)]]
> - Deep work? → [[TODO#🔥 Focus Now]]
> - Process captures? → [[+Inbox]]

---

### 📆 Monthly Review (60-90 min)

> [!info] Purpose: Zoom out. Archive completed work. Realign with goals.

#### Part A: Archive & Clean (20 min)
- [ ] Move ✅completed efforts to [[06-Archive]]
- [ ] Archive completed sources you won't reference again
- [ ] Clear all red indicators from [[#🚦 System Health Dashboard]]
- [ ] Run `/lint-vault` to check data integrity

#### Part B: Review Areas (20 min)
- [ ] Open [[Areas]] and review each life area
- [ ] Any area neglected? Add to next month's focus
- [ ] Update `last_review` date on Area notes
- [ ] Check: Are efforts aligned with areas that matter?

#### Part C: Effort Pipeline (20 min)
- [ ] Review [[03-Efforts]] — still the right active projects?
- [ ] Any maintenance work overdue?
- [ ] Kill or archive stalled efforts (>60 days no progress)

#### Part D: System Health (20 min)
- [ ] Review [[🧹Cleaning Lady]] — any systemic issues?
- [ ] Check [[99-System]] docs — anything outdated?
- [ ] Template check: Are templates still serving you?
- [ ] Identify 1 system improvement for next month

#### Part E: Look Ahead (10 min)
- [ ] What's the theme for next month?
- [ ] What 3 efforts would make next month successful?
- [ ] Any upcoming dues to prepare for?

**This Month's Theme:**


**Top 3 Efforts for This Month:**
1.
2.
3.

> [!done]- ✅ **After Monthly Review: What's Next?**
> **Celebrate & capture:**
> - [ ] Archive this month's completed efforts → [[06-Archive]]
> - [ ] Share a win with someone (optional but rewarding)
>
> **Set up for success:**
> - [ ] Review [[Areas]] — ensure efforts align with what matters
> - [ ] Clear any remaining 🔴 indicators in [[#🚦 System Health Dashboard]]
> - [ ] Schedule next month's review in your calendar
>
> **System health:** [[🧹Cleaning Lady]] | [[99-System]]

---

## 🔗 Quick Navigation

> [!tip]- 🧭 **When to Use Each Hub**
> | I want to... | Go to |
> |--------------|-------|
> | See system health at a glance | **You're here!** [[#🚦 System Health Dashboard]] |
> | Work on tasks by context (@computer, @home) | [[TODO]] |
> | Do a full weekly review checklist | [[🎯GTD Weekly Review - Template]] |
> | Process new captures | [[+Inbox]] |
> | Work on active projects | [[03-Efforts]] |
> | Fix and maintain notes | [[🧹Cleaning Lady]] |
> | Develop incomplete ideas | [[🌱Incubator]] |
> | See today's focus | [[🏡Home]] |

### Core Hubs
- [[TODO]] — Task management & contexts
- [[🎯GTD Weekly Review - Template]] — Full weekly review checklist
- [[🏡Home]] — Daily dashboard
- [[👁️Dashboard]] — System overview

### Work Locations
- [[+Inbox]] — Capture dropzone
- [[03-Efforts]] — Active projects

### Knowledge Locations
- [[01-MOCs]] — Maps of Content
- [[02-Knowledge]] — Atomic knowledge
- [[04-Sources]] — References & sources
- [[Areas]] — Life areas

### Time Locations
- [[📅Calendar Review Hub]] — Calendar hub

### System Locations
- [[99-System]] — System documentation
- [[🧹Cleaning Lady]] — Maintenance queue
- [[🌱Incubator]] — Developing ideas
- [[Templates]] — Note templates

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
