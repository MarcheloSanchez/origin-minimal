---
up: "[[🗺️My PKM MOC]]"
title: PKM Standards AKA Governance
type: system
fileClass: moc
tags:
  - ⚙️system
  - 📊metadata
  - 📋documentation
status: 🔄active
maturity: 🪴sapling
created: 2025-09-30
modified: 2026-07-28
related:
  - "[[🔁My PKM Workflows]]"
  - "[[+About Templatesℹ️]]"
quality_reviewed: 2026-06-17
---

> [!orbit] Wayfinder | [[🗺️My PKM MOC]] | 🏛️My PKM Governance | [[🔢My PKM Metadata]] | [[🔍My PKM Queries]] |  [[📁My PKM Folders]] |  [[🏷️My PKM Tags]] |  [[🔁My PKM Workflows]] | [[✅My PKM Tasks]] | [[ℹ️My PKM Naming Convention]]

## 📜 Rule Registry

Every rule domain in this PKM and the note that owns it. Rules live with their owner; this table is the index.

| # | Rule domain | Owner | Rules in this note? |
|---|-------------|-------|---------------------|
| 1 | Folders & purpose | [[📁My PKM Folders]] | embedded below |
| 2 | Workflow pipeline & review cadence | [[🔁My PKM Workflows]] | linked below |
| 3 | Tag taxonomy | [[🏷️My PKM Tags]] · [[CIS_TAG]] | summarized below |
| 4 | Metadata / YAML schema | [[🔢My PKM Metadata]] | embedded below |
| 5 | Status & maturity enums | [[CIS_STATUS]] · [[CIS_MATURITY]] | linked |
| 6 | Templates & compliance | [[📦Template System Guide]] | rules below |
| 7 | Naming convention | [[ℹ️My PKM Naming Convention]] | embedded below |
| 8 | Typed links | 🏛️My PKM Governance (this note) | §8 |
| 9 | Definition of Done per type | 🏛️My PKM Governance (this note) | §9 |
| 10 | Do / Don't | 🏛️My PKM Governance (this note) | final section |
| 11 | Effort→MOC promotion | 🏛️My PKM Governance (this note) | tip in §8 |
| 12 | Versioning, releases & vault topology | [[📦Release Versioning Convention]] · [[🚢Release Playbook]] · [[🗺️Vault Topology & Promotion]] | linked |

## **Related Links Policy**
**Dual Storage Required** - maintain both locations:
1. **YAML metadata**: `related: ["[[Link 1]]", "[[Link 2]]"]` (for queries)
2. **Content section**: `## 🔗 Related` (for readability)
## **Template Compliance Rules**
1. All templates must use emoji status format (`🔄active` not `active`)
2. Type field must match folder location and note purpose
3. FileClass field must align with primary type
4. Processing_priority field standardized across all templates
5. Related links maintained in both YAML and content sections
6. Custom metadata documented and governed (47 fields tracked)

### **1️⃣ Folders & Purpose**

![[📁My PKM Folders#🏗️ Structure]]

[[📁My PKM Folders|Read more...]] 

---
### **2️⃣ Workflow Pipeline**

Capture → Process → Organize → Review → Archive. Status transitions, maturity lifecycle, and daily/weekly/monthly/quarterly review cadences → [[🔁My PKM Workflows]]

---
### **3️⃣ Tags Taxonomy**

> Canonical source: [[CIS_TAG]] · [[CIS_STATUS]] · [[CIS_MATURITY]]
- `#TASK` — actionable checklist items in the **body** (never in YAML).
- Project/initiative tags: `#proj/<slug>` (avoid bare project names).
- Temporary focus tags allowed but expire during monthly review.
- **Content type:** `#💡atomic` / `#🚀effort` / `#📚source` / `#🗺️moc`
- **Note development:** `#🌱develop`, `#❔question`, `#🧹tidy`, `#⚗️experiment`
- **Priority:** use the `priority:` YAML field (`CIS_PRIORITY.md`: high/medium/low), not a tag
- **Context:** use the Tasks plugin's inline `@computer`/`@home`/`@work`/etc. syntax, not a tag
[[🏷️My PKM Tags|Read more...]]
---
### **4️⃣ Metadata Integration**

![[🔢My PKM Metadata#📊 Universal Metadata Schema]]

> Each **type** has a FileClass defining **required** YAML + optional keys. See in link below.

[[🔢My PKM Metadata#00- atomic Metadata|Read more...]]

----
### **5️⃣ Plugins & Automation Touchpoints**

Plugin roles by stage (QuickAdd, Templater, Tasks, Dataview, Kanban, Bases, n8n) → [[🔁My PKM Workflows|Tools & Automation]] · [[MOC - Automation Command Center|Automation MOC]]

---
### **6️⃣ Contextual Dashboards** 
**[[👁️Dashboard]]**
- 📥 **New inbox items** (last 7 days)
- ⏳ **Active Efforts with deadlines**
- 💡 **Recently updated Dots**
- 📚 **Sources to process**
- ✅ **Tasks due today**

**[[🏡Home]]** 
Human-curated quick links + “one-glance” counters. 
- **Dashboards:** Focused, filterable views (Bases) by type/lifecycle:
    - **Prompt Dashboard:** Favorites | Active | Draft | Archive
    - **Efforts Dashboard:** Active projects by priority/due
    - **Review Dashboard:** Items in `review` across types
_(Implement with Bases; store filter criteria in YAML for reproducibility.)_
---
### 7️⃣ Naming Convention
![[ℹ️My PKM Naming Convention]]

### 8️⃣ Typed Links (sensemaking) 
Use these to annotate links (inline comments or dedicated field): #🧹tidy link to examples
- `supports`, `contradicts`, `depends_on`, `informs`, `instance_of`.

> [!tip] > **Promotion rule (Effort → MOC):** 
> When a topic’s Effort grows to ≥7 curated atomic notes, ≥1 stable outline, and ≥1 dashboard/bases view, **promote** to a MOC (move to `01-MOCS`, set `type: moc`, record promotion date in YAML).

### 9️⃣ Definition of Done (DoD) — per type (short)
- **Atomic:** `summary` present; 1+ link to Sources or Evidence; placed in correct folder; status not `draft`.
- **Project:** `owner`, `due`, `next_action`; at least one milestone or backlog; review note when closing.
- **Source:** `origin`, `author` or publisher; `reliability` set; citation usable.
- **MOC:** curated `includes`, short scope paragraph, one diagram/table or query.
- **Meeting:** `when`, participants; `decisions` & `actions` captured (actions mirrored as #TASK).
- **Prompt:** `goal`, `audience`, `tone`, `patterns`, `inputs`; one example I/O.
- **Archive:** reason recorded; all internal links remain valid.

---
# ✅Do/❌Don’t rules
- **Do** keep top-level folders fixed (+Inbox, 01–06, 99); **don’t** add new top-levels ad-hoc.
- **Do** assign **one** `type` per note; **don’t** mix multiple types.
- **Do** keep `status` to the enum above; (use tags if you want visuals).
- **Do** store raw content only in 02/03/04/05; **don’t** park raw notes in **01-MOCs** (indexes only).
- **Do** move finished items to **06-Archive** and set `status: archived`; **don’t** leave completed work in active folders.

---
⬆️ [[🏡Home]]  *| `= this.file.mtime`*