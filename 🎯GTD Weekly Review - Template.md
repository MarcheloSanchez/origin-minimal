---
title: GTD Weekly Review
type: template
status: 🔄active
tags:
  - 📋review
  - 🎯gtd
  - 📅weekly
created: 2026-01-01
related:
  - "[[🏡Home]]"
modified: 2026-03-03
---

# 🔄 GTD Weekly Review

> *"The Weekly Review is the critical success factor for your GTD system."* — David Allen

**Datum review:** `= date(now)`
**Čas potřebný:** 30-60 minut
**Nejlepší čas:** Pátek odpoledne nebo Neděle večer

---

## Checklist

### 1️⃣ GET CLEAR (Vyprázdni hlavu)

#### 📥 Process Inbox
- [ ] Zpracuj všechny položky v [[+Inbox]]
- [ ] Zkontroluj email inbox (zero inbox)
- [ ] Projdi fyzický inbox (papíry, poznámky)
- [ ] Zkontroluj messaging apps (Slack, Teams, WhatsApp)
- [ ] Projdi notes v telefonu
- [ ] Zkontroluj voice memos

```dataview
TABLE WITHOUT ID
  file.link as "Item",
  file.ctime as "Přidáno"
FROM "+Inbox"
SORT file.ctime ASC
```

#### 🧠 Mind Sweep
> Zapiš vše, co ti přijde na mysl:
- [ ] Závazky vůči ostatním
- [ ] Závazky ostatních vůči mně
- [ ] Nedokončené projekty
- [ ] Věci, které by měly být hotové
- [ ] Nápady na projekty
- [ ] Co mě trápí/stresuje

**Notes z mind sweep:**
```
-
-
-
```

---

### 2️⃣ GET CURRENT (Aktualizuj systém)

#### 📅 Review Calendar
- [ ] Projdi minulý týden - něco nedokončeného?
- [ ] Projdi příští 2 týdny - něco k přípravě?
- [ ] Zkontroluj recurring events

**Důležité události příští týden:**
```
-
-
```

#### ✅ Review Action Lists
- [ ] Zkontroluj @waiting - follow up potřeba?
- [ ] Projdi všechny @context listy
- [ ] Škrtni dokončené, přidej nové
- [ ] Ověř, že každá akce je konkrétní a proveditelná

```tasks
not done
description includes @waiting
```

#### 🚀 Review Projects
- [ ] Projdi každý aktivní projekt
- [ ] Má každý projekt definovanou next action?
- [ ] Je nějaký projekt stuck/blocked?
- [ ] Jsou priority stále správné?

```dataview
TABLE WITHOUT ID
  file.link as "Projekt",
  status as "Status",
  next_actions as "Next Action",
  choice(next_actions, "✅", "❌ CHYBÍ!") as "Has NA?"
FROM "03-Efforts"
WHERE status = "🔄active"
SORT priority DESC
```

**Projekty bez Next Action:**
```dataview
LIST
FROM "03-Efforts"
WHERE status = "🔄active" AND !next_actions
```

#### 📦 Review Someday/Maybe
- [ ] Projdi someday/maybe list
- [ ] Něco k aktivaci?
- [ ] Něco k odstranění?

---

### 3️⃣ GET CREATIVE (Naplánuj)

#### 🎯 Priorities for Next Week
> Vyber 3-5 hlavních priorit

1. **Priority #1:**
2. **Priority #2:**
3. **Priority #3:**
4. **Priority #4:**
5. **Priority #5:**

#### 🔥 Big Rocks
> Co MUSÍ být příští týden hotové?

- [ ]
- [ ]
- [ ]

#### ⚡ Quick Wins
> Co mohu rychle dokončit pro momentum?

- [ ]
- [ ]

---

## 📊 Week in Review

### ✅ Accomplishments
> Co se tento týden povedlo?

-
-
-

### 📈 Metrics

```dataviewjs
const today = dv.date('today');
const weekAgo = today.minus({days: 7});

const completed = dv.pages().file.tasks
  .where(t => t.completed)
  .length;

const inbox = dv.pages('"+Inbox"').length;

dv.paragraph(`
| Metrika | Hodnota |
|---------|---------|
| ✅ Úkolů dokončeno | ${completed} |
| 📥 Inbox items | ${inbox} |
`);
```

### 🎓 Lessons Learned
> Co jsem se tento týden naučil?

-
-

### 🚧 Blockers & Challenges
> Co mi bránilo v postupu?

-
-

### 💡 Ideas & Insights
> Nápady, které přišly během týdne

-
-

---

## 🔄 System Maintenance

- [ ] Archivuj dokončené projekty
- [ ] Vyčisti tagy
- [ ] Aktualizuj MOCs pokud potřeba
- [ ] Backup vault

---

## 🧪 Experiment: Surfacing Pilot (2 weeks)

Purpose: Validate that title rewrites + a 2-link connection ritual increase discoverability and reuse.

- [ ] Baseline: record `inlink_count` distribution & `processing_rate` on `👁️Dashboard` (today)
- [ ] Rewrite titles for 20 high-potential captures (split over this week)
- [ ] Process 10 inbox items with the linking ritual (2 links each) — start with Automations via FastKey
- [ ] Tag reused notes with `used:: YYYY-MM-DD` when they are employed in writing or projects
- [ ] After 14 days: compare median `inlink_count`, total `used::` events, and `processing_rate`

Notes:
- Start with `+Inbox` items; prioritize items older than 7 days for title rewrites.
- Link each processed note to one MOC and one related atomic.


---

## ✨ Closing

### Gratitude (3 věci)
1.
2.
3.

### Intention for Next Week
> Jednou větou - jaký chci mít příští týden?



---

**Review dokončen:** `= date(now)`
**Délka review:** ___ minut
**Mood po review:** 😊 / 😐 / 😔

---

⬆️:: [[TODO]] | [[🏡Home]]
