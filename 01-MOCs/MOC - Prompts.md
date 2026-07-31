---
up: "[[07-Prompts]]"
title: Prompt Dashboard
aliases:
  - Prompt Dasboard
type: moc
tags:
  - 🤖AI/prompt
  - 🗺️MOC
status: 🔄active
created: 2026-07-08
modified: 2026-07-08
quality_reviewed: 2026-07-08
---

> [!orbit] Wayfinder | [[07-Prompts]] | [[Prompt Playbook]] | [[Prompt Reference]]

# 🧭 Prompt Dashboard

Your prompt library at a glance — organized by completion status, category, and type. See [[_Prompt_Data.base]] for the full prompt database view.

---

## 🧹 Fill me out

Prompts missing key metadata (category, type, or when_to_use). Fill these out to complete onboarding.

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_category, prompt_type, when_to_use
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND (!prompt_category OR !prompt_type OR !when_to_use)
SORT file.name ASC
```

---

## 📥 Inbox queue

New, untested prompts waiting for your attention.

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_type, created
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND status = "📥inbox"
SORT created DESC
```

---

## 🗂️ By category

### ✍️ writing

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_type, status, eval_score
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND prompt_category = "writing"
SORT file.name ASC
```

### 🔬 research

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_type, status, eval_score
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND prompt_category = "research"
SORT file.name ASC
```

### 🗃️ pkm

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_type, status, eval_score
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND prompt_category = "pkm"
SORT file.name ASC
```

### 💻 coding

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_type, status, eval_score
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND prompt_category = "coding"
SORT file.name ASC
```

### 📚 learning

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_type, status, eval_score
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND prompt_category = "learning"
SORT file.name ASC
```

### 📊 planning

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_type, status, eval_score
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND prompt_category = "planning"
SORT file.name ASC
```

### 🎨 creativity

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_type, status, eval_score
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND prompt_category = "creativity"
SORT file.name ASC
```

### 🔧 utility

```dataview
TABLE WITHOUT ID file.link AS "Prompt", prompt_type, status, eval_score
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND prompt_category = "utility"
SORT file.name ASC
```

---

## 🏷️ By type

```dataview
TABLE WITHOUT ID rows.file.link AS "Prompts", length(rows) AS "#"
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND prompt_type
GROUP BY prompt_type
SORT prompt_type ASC
```

---

## 🏆 Proven

Top-scoring prompts with test results.

```dataview
TABLE WITHOUT ID file.link AS "Prompt", eval_score, last_run
FROM "07-Prompts/Library" OR "07-Prompts/Inbox"
WHERE type = "prompt" AND eval_score
SORT eval_score DESC
LIMIT 15
```

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
