---
up: "[[🏛️My PKM Governance]]"
title: "Implementation Plan - Vault Optimization"
type: system
fileClass: source
tags: 
  - ⚙️system
  - 📋documentation
  - 🔧optimization
status: ✅completed
maturity: 🌱seedling
created: "2026-02-05"
modified: "2026-07-13"
related: 
  - "[[🔢My PKM Metadata]]"
  - "[[🔍My PKM Queries]]"
  - "[[👁️Dashboard]]"
  - "[[TODO]]"
quality_reviewed: "2026-06-17"
---

> [!orbit] Wayfinder | [[🏛️My PKM Governance]]

# Implementation Plan - Vault Optimization v2.0

> [!done]- **Verification Gaps (2026-07-12) — RESOLVED**
> - [x] Tags - Health Dashboard: exists as [[Tags - Status Check]]
> - [x] Stale Content Alerts: superseded by 2026-07-11 Review HQ lean rebuild (by design)
> - [x] metrics-core.js: resolved — metrics-core deliberately deleted in 2026-07-10 script automation triage

> [!info]+ **Plan Overview**
> **Based on**: High-level vault analysis (2026-02-05)
> **Scope**: Dataview optimization, metadata standardization, automation enhancement
> **Priority**: Foundation fixes → Query optimization → Automation → Advanced features

---

## Executive Summary

This plan addresses the identified inconsistencies and missed opportunities from the vault analysis. Implementation is organized into 4 priority tiers with clear deliverables.

---

## Priority 1: Foundation Fixes (Week 1-2)

### 1.1 Standardize Field Naming

**Issue**: `due` vs `deadline` used interchangeably across queries and templates.

**Current State**:
- `👁️Dashboard.md` uses: `due`
- `TODO.md` uses: `deadline`
- `🔢My PKM Metadata.md` documents both fields

**Action Items**:
- [ ] **Decision**: Standardize on `due` (shorter, GTD-standard)
- [ ] Update `🔢My PKM Metadata.md` - remove `deadline`, keep `due`
- [ ] Update all templates using `deadline` → `due`
- [ ] Update all Dataview queries referencing `deadline`
- [ ] Bulk update existing notes via MetaEdit

**Files to Update**:
```
Templates/New-Notes/Type/Effort/*.md
Templates/Static/effort.md
03-Efforts/**/*.md (bulk via MetaEdit)
```

**Query Pattern Change**:
```dataview
// OLD
choice(deadline, "📅 " + deadline, "—") as "Deadline"

// NEW
choice(due, "📅 " + due, "—") as "Due"
```

---

### 1.2 Status Field Consistency

**Issue**: Status values inconsistent - some use emoji prefix, some don't.

**Current Patterns Found**:
```yaml
# Pattern A (with emoji)
status: 🔄active

# Pattern B (without emoji)
status: active

# Pattern C (mixed in queries)
WHERE status = "🔄active" OR status = "active"
```

**Action Items**:
- [ ] **Decision**: Use emoji-prefixed values (`🔄active`) as canonical
- [ ] Create status normalization script for YAML Orchestrator
- [ ] Update queries to use single pattern (remove OR fallbacks)
- [ ] Bulk normalize existing notes

**Normalization Script Addition** (for `yaml_orchestrator.js`):
```javascript
// Add to normalize function
const statusMap = {
  'active': '🔄active',
  'inbox': '📥inbox',
  'waiting': '⏳waiting',
  'completed': '✅completed',
  'archived': '📦archived',
  'paused': '⏸️paused',
  'cancelled': '❌cancelled'
};

if (yaml.status && statusMap[yaml.status.toLowerCase()]) {
  yaml.status = statusMap[yaml.status.toLowerCase()];
}
```

---

### 1.3 Add Error Handling to DataviewJS

**Issue**: DataviewJS calculations fail silently when data is missing.

**Current Pattern** (vulnerable):
```javascript
const inboxCount = dv.pages('"+Inbox"').length;
const activeProjects = dv.pages('"03-Efforts"').where(p => p.status === "active").length;
```

**Improved Pattern** (with error handling):
```javascript
// Wrap in try-catch with fallback
try {
  const inboxCount = dv.pages('"+Inbox"')?.length ?? 0;
  const activeProjects = dv.pages('"03-Efforts"')
    .where(p => p.status === "🔄active" || p.status === "active")
    .length ?? 0;
} catch (e) {
  dv.paragraph(`⚠️ Error loading metrics: ${e.message}`);
}
```

**Files to Update**:
- [ ] `👁️Dashboard.md` - 4 DataviewJS blocks
- [ ] `TODO.md` - 2 DataviewJS blocks
- [ ] `🧭Review HQ.md` - DataviewJS blocks
- [ ] `🎮Gamification Dashboard.md` - All calculation blocks

---

### 1.4 Document Query Purposes

**Issue**: Queries lack inline comments explaining their purpose.

**Action Items**:
- [ ] Add header comments to all DataviewJS blocks
- [ ] Document expected inputs/outputs
- [ ] Note any dependencies on specific metadata fields

**Template for Query Documentation**:
```javascript
/**
 * QUERY: System Health Score
 * PURPOSE: Calculate overall vault health (0-100)
 * DEPENDS ON: status, file.mtime, related fields
 * OUTPUTS: Health score with traffic light indicator
 * UPDATED: 2026-02-05
 */
```

---

## Priority 2: Query Optimization (Week 3-4)

### 2.1 Create Centralized Metrics Module

**Issue**: Same metrics calculated independently in multiple dashboards.

**Solution**: Create a single metrics calculation file that all dashboards reference.

> [!warning] Superseded (2026-07-09)
> `metrics-core.js` was built but never wired into any consumer (zero callers, per `script-automation-audit-2026-07-09.md`) and was deleted. Constants ownership now lives in `99-System/CIS/CIS_MATURITY.md` / `CIS_STATUS.md`, guarded by `AIOS/scripts/check-enum-drift.py`. Code sample below kept for historical record only.

**New File** (deleted 2026-07-09): `99-System/Scripts/metrics-core.js`

```javascript
/**
 * Core Metrics Module for Origin PKM
 * Single source of truth for vault metrics
 */

// Cache settings
const CACHE_FILE = "99-System/_Metrics Cache";
const CACHE_TTL_MINUTES = 5;

// Core metric functions
function getInboxCount(dv) {
  return dv.pages('"+Inbox"')?.length ?? 0;
}

function getActiveProjects(dv) {
  return dv.pages('"03-Efforts"')
    .where(p => p.status === "🔄active")
    .length ?? 0;
}

function getStaleProjects(dv, daysThreshold = 14) {
  const today = dv.date('today');
  return dv.pages('"03-Efforts"')
    .where(p =>
      p.status === "🔄active" &&
      today.diff(p.file.mtime, 'days').days > daysThreshold
    ).length ?? 0;
}

function getOrphanNotes(dv) {
  return dv.pages()
    .where(p =>
      !p.file.path.includes("99-System") &&
      !p.file.path.includes("Templates") &&
      (!p.related || p.related.length === 0) &&
      (!p.file.inlinks || p.file.inlinks.length === 0)
    ).length ?? 0;
}

function calculateHealthScore(metrics) {
  const weights = {
    inbox: { max: 25, thresholds: [[20, 25], [40, 15], [Infinity, 5]] },
    projects: { max: 25, thresholds: [[7, 25], [12, 15], [Infinity, 5]] },
    stale: { max: 25, thresholds: [[0, 25], [2, 20], [Infinity, 10]] },
    orphans: { max: 25, percentage: 0.2 }
  };

  let score = 0;
  // ... scoring logic
  return Math.round(score);
}

// Export for Templater
module.exports = {
  getInboxCount,
  getActiveProjects,
  getStaleProjects,
  getOrphanNotes,
  calculateHealthScore
};
```

**Usage in Dashboards**:
```dataviewjs
// Instead of duplicating logic, reference centralized cache
const cache = dv.page("99-System/_Metrics Cache");
const healthScore = cache?.health_score ?? "Loading...";
const inboxCount = cache?.inbox_count ?? 0;

dv.paragraph(`Health: ${healthScore}/100 | Inbox: ${inboxCount}`);
```

---

### 2.2 Optimize Metrics Cache Structure

**Current**: `00-Meta/_Metrics Cache.md` exists but underutilized.

**Enhanced Structure**:
```yaml
---
title: Metrics Cache
type: system
updated: 2026-02-05T10:30:00
cache_ttl_minutes: 5
---

# Core Metrics
inbox_count:: 5
active_projects:: 3
stale_projects:: 0
orphan_notes:: 12
total_notes:: 405

# Health Scores
health_score:: 85
inbox_health:: 🟢
projects_health:: 🟢
connection_health:: 🟡

# Gamification
xp_total:: 590
level:: 5
streak_days:: 7

# Weekly Stats
notes_this_week:: 12
tasks_completed_week:: 28
processing_rate:: 78
```

**Auto-Update Script** (run daily via Templater):
```javascript
// 99-System/Scripts/update-metrics-cache.js
async function updateMetricsCache(tp) {
  const cache = {};

  // Calculate all metrics
  cache.inbox_count = dv.pages('"+Inbox"').length;
  cache.active_projects = dv.pages('"03-Efforts"')
    .where(p => p.status === "🔄active").length;
  // ... more calculations

  cache.updated = tp.date.now("YYYY-MM-DDTHH:mm:ss");

  // Update cache file
  await tp.file.include("[[_Metrics Cache]]");
  // Write YAML
}
```

---

### 2.3 Create Query Templates Library

**New Folder**: `Templates/Queries/`

**Template Files**:
- `Query - Active Projects.md`
- `Query - Inbox Processing.md`
- `Query - Health Status.md`
- `Query - Maturity Distribution.md`
- `Query - Orphan Notes.md`
- `Query - Weekly Stats.md`

**Example Template** (`Query - Active Projects.md`):
```markdown
---
title: Query Template - Active Projects
type: template
tags: [📋template, 🔍query]
---

## Active Projects Query

**Parameters**: Folder, Status filter, Sort, Limit

```dataview
TABLE WITHOUT ID
  "🚀 " + file.link as "Project",
  status as "Status",
  priority as "Priority",
  choice(completion_percentage, completion_percentage + "%", "0%") as "Progress",
  choice(due, "📅 " + due, "—") as "Due",
  next_actions as "Next Action"
FROM "03-Efforts"
WHERE status = "🔄active"
SORT priority DESC, due ASC
LIMIT 10
```

**Customization Notes**:
- Change `LIMIT` for different contexts
- Add `WHERE` clauses for filtering by energy/context
- Modify columns for different dashboard needs


---

### 2.4 Reduce Query Duplication

**Identified Duplications**:

| Query Logic | Found In | Count |
|-------------|----------|-------|
| Inbox count | Dashboard, GTD, Review HQ | 3 |
| Active projects | Dashboard, GTD, Review HQ | 3 |
| Overdue tasks | GTD, Review HQ | 2 |
| Stale content | Dashboard, Review HQ | 2 |

**Action**: Replace duplicates with cache references or Templater includes.

---

## Priority 3: Automation Enhancement (Week 5-6)

### 3.1 Implement Automated Maturity Promotion

**Current**: Manual maturity updates.

**Automated Logic**:
```javascript
// 99-System/Scripts/maturity-promoter.js

function calculateMaturity(page) {
  const outlinks = page.file.outlinks?.length ?? 0;
  const inlinks = page.file.inlinks?.length ?? 0;
  const daysSinceModified = dv.date('today').diff(page.file.mtime, 'days').days;

  // Promotion criteria
  if (outlinks >= 10 && inlinks >= 5 && daysSinceModified > 90) {
    return '🌲evergreen';
  }
  if (outlinks >= 5 && inlinks >= 2 && daysSinceModified > 30) {
    return '🪴sapling';
  }
  if (outlinks >= 2 && inlinks >= 1) {
    return '🌿seedling';
  }
  return '🌱seed';
}

function getSuggestedPromotions(dv) {
  return dv.pages('"02-Knowledge"')
    .where(p => {
      const suggested = calculateMaturity(p);
      const current = p.maturity ?? '🌱seed';
      return getMaturityRank(suggested) > getMaturityRank(current);
    })
    .map(p => ({
      file: p.file.link,
      current: p.maturity,
      suggested: calculateMaturity(p),
      reason: getPromotionReason(p)
    }));
}
```

**Dashboard Widget**:
```dataviewjs
// Add to Review HQ
const promotions = getSuggestedPromotions(dv);
if (promotions.length > 0) {
  dv.header(3, "🌱 Suggested Maturity Promotions");
  dv.table(
    ["Note", "Current", "Suggested", "Reason"],
    promotions.slice(0, 5).map(p => [p.file, p.current, p.suggested, p.reason])
  );
}
```

---

### 3.2 Add Schema Validation via Templater

**New Script**: `99-System/Scripts/yaml_validator.js`

```javascript
// Schema definitions per type
const schemas = {
  atomic: {
    required: ['title', 'type', 'status', 'created', 'tags'],
    optional: ['maturity', 'domain', 'confidence_level', 'related'],
    enums: {
      status: ['📥inbox', '🔄active', '⏳waiting', '✅completed', '📦archived'],
      maturity: ['🌱seed', '🌿seedling', '🪴sapling', '🌲evergreen', '🍓fruit']
    }
  },
  effort: {
    required: ['title', 'type', 'status', 'created', 'tags', 'priority'],
    optional: ['due', 'completion_percentage', 'next_actions', 'energy', 'context'],
    enums: {
      priority: ['high', 'medium', 'low'],
      energy: ['high', 'medium', 'low']
    }
  }
  // ... more schemas
};

function validateNote(yaml, type) {
  const schema = schemas[type];
  const errors = [];
  const warnings = [];

  // Check required fields
  schema.required.forEach(field => {
    if (!yaml[field]) errors.push(`Missing required field: ${field}`);
  });

  // Validate enums
  Object.entries(schema.enums || {}).forEach(([field, values]) => {
    if (yaml[field] && !values.includes(yaml[field])) {
      warnings.push(`Invalid value for ${field}: ${yaml[field]}. Expected: ${values.join(', ')}`);
    }
  });

  return { valid: errors.length === 0, errors, warnings };
}
```

**Integration with YAML Orchestrator**:
```javascript
// Add to yaml_orchestrator normalize function
const validation = validateNote(yaml, yaml.type);
if (!validation.valid) {
  console.warn("Validation errors:", validation.errors);
  // Optionally add #🧹tidy tag for review
  yaml.tags = [...(yaml.tags || []), '#🧹tidy'];
}
```

---

### 3.3 Create Stale Content Alert System

**New Dashboard Section** (add to Review HQ):

```dataviewjs
/**
 * QUERY: Stale Content Alerts
 * PURPOSE: Surface content that needs attention
 * TRIGGERS: >30 days inactive for active items
 */

const today = dv.date('today');
const staleThreshold = 30;

const staleActive = dv.pages()
  .where(p =>
    p.status === "🔄active" &&
    !p.file.path.includes("99-System") &&
    !p.file.path.includes("Templates") &&
    today.diff(p.file.mtime, 'days').days > staleThreshold
  )
  .sort(p => p.file.mtime, 'asc')
  .limit(10);

if (staleActive.length > 0) {
  dv.header(3, "⚠️ Stale Active Items (>" + staleThreshold + " days)");
  dv.table(
    ["Note", "Type", "Last Modified", "Days Stale"],
    staleActive.map(p => [
      p.file.link,
      p.type ?? "—",
      p.file.mtime.toFormat("yyyy-MM-dd"),
      Math.round(today.diff(p.file.mtime, 'days').days)
    ])
  );
  dv.paragraph("💡 *Consider: Update, complete, pause, or archive these items.*");
} else {
  dv.paragraph("✅ No stale active items found.");
}
```

---

### 3.4 Tag Health Monitoring Dashboard

**New File**: `00-Meta/Documentation/Tags - Health Dashboard.md`

```dataviewjs
/**
 * Tag Health Analysis
 * Shows orphan tags, over-tagged notes, and tag consistency
 */

const pages = dv.pages().where(p => !p.file.path.includes("99-System"));

// Collect all tags
const tagCounts = {};
pages.forEach(p => {
  (p.file.tags || []).forEach(tag => {
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
});

// Orphan tags (used < 3 times)
const orphanTags = Object.entries(tagCounts)
  .filter(([tag, count]) => count < 3)
  .sort((a, b) => a[1] - b[1]);

dv.header(3, "🔴 Orphan Tags (< 3 uses)");
if (orphanTags.length > 0) {
  dv.table(
    ["Tag", "Usage Count", "Action"],
    orphanTags.slice(0, 15).map(([tag, count]) => [
      tag, count, "Consider removal or consolidation"
    ])
  );
} else {
  dv.paragraph("✅ No orphan tags found.");
}

// Over-tagged notes (> 10 tags)
const overTagged = pages
  .where(p => (p.file.tags?.length ?? 0) > 10)
  .sort(p => p.file.tags.length, 'desc');

dv.header(3, "🟡 Over-Tagged Notes (> 10 tags)");
if (overTagged.length > 0) {
  dv.table(
    ["Note", "Tag Count"],
    overTagged.limit(10).map(p => [p.file.link, p.file.tags.length])
  );
} else {
  dv.paragraph("✅ No over-tagged notes found.");
}
```

---

## Priority 4: Advanced Features (Week 7-8)

### 4.1 AI-Powered Connection Suggestions

**Concept**: Use note content similarity to suggest links.

**Implementation Approach**:
1. Use Smart Connections plugin (already installed)
2. Create dashboard widget showing top suggestions
3. Surface in Review HQ for weekly processing

**Dashboard Integration**:
```markdown
## 🔗 Connection Suggestions

> [!tip]+ AI-Suggested Links
> Use Smart Connections sidebar to find related notes.
> **Shortcut**: `Ctrl+Shift+S`
>
> **Weekly Goal**: Add 5+ meaningful connections

### Recently Connected
```dataview
LIST
FROM "02-Knowledge"
WHERE file.mtime >= date(today) - dur(7 days)
AND length(file.outlinks) > 5
SORT file.mtime DESC
LIMIT 5
```
```

---

### 4.2 Automated Report Generation

**Weekly Report Template Enhancement**:

```javascript
// 99-System/Scripts/generate-weekly-report.js

async function generateWeeklyReport(tp) {
  const today = tp.date.now("YYYY-MM-DD");
  const weekStart = moment().startOf('week').format("YYYY-MM-DD");
  const weekEnd = moment().endOf('week').format("YYYY-MM-DD");

  // Gather metrics
  const metrics = {
    notesCreated: dv.pages().where(p => p.file.ctime >= dv.date(weekStart)).length,
    tasksCompleted: /* task query */,
    inboxProcessed: /* inbox delta */,
    connectionsAdded: /* link count */
  };

  // Generate report content
  const report = `
## Weekly Report: ${weekStart} to ${weekEnd}

### 📊 Key Metrics
- Notes Created: ${metrics.notesCreated}
- Tasks Completed: ${metrics.tasksCompleted}
- Inbox Processed: ${metrics.inboxProcessed}
- Connections Added: ${metrics.connectionsAdded}

### 🎯 Highlights
<!-- Auto-populated from notes with #highlight tag -->

### 🔄 Next Week Focus
<!-- Manual input section -->
`;

  return report;
}
```

---

### 4.3 Cross-Vault Analytics Dashboard

**New File**: `00-Meta/Documentation/PKM/📈Vault Analytics.md`

```markdown
---
title: Vault Analytics
type: moc
status: 🔄active
cssclasses: [wide-page]
---

# 📈 Vault Analytics

## Growth Over Time

```dataviewjs
// Monthly note creation trend
const months = [];
for (let i = 11; i >= 0; i--) {
  const monthStart = dv.date('today').minus({months: i}).startOf('month');
  const monthEnd = monthStart.endOf('month');
  const count = dv.pages()
    .where(p => p.file.ctime >= monthStart && p.file.ctime <= monthEnd)
    .length;
  months.push({
    month: monthStart.toFormat("yyyy-MM"),
    count: count
  });
}

dv.table(
  ["Month", "Notes Created", "Trend"],
  months.map((m, i) => {
    const prev = i > 0 ? months[i-1].count : m.count;
    const trend = m.count > prev ? "📈" : m.count < prev ? "📉" : "➡️";
    return [m.month, m.count, trend];
  })
);
```

## Content Distribution

```dataviewjs
// Notes by type
const types = dv.pages()
  .where(p => p.type)
  .groupBy(p => p.type);

dv.table(
  ["Type", "Count", "Percentage"],
  types.map(g => {
    const total = dv.pages().length;
    const pct = Math.round(g.rows.length / total * 100);
    return [g.key, g.rows.length, pct + "%"];
  }).sort((a, b) => b[1] - a[1])
);
```
```

---

## Implementation Checklist

### Week 1-2: Foundation
- [x] Standardize `due`/`deadline` field naming ✅ 2026-02-07
- [x] Normalize status values (add to YAML Orchestrator) ✅ 2026-02-07
- [x] Add error handling to DataviewJS blocks ✅ 2026-02-07
- [x] Document all query purposes with inline comments ✅ 2026-02-07

### Week 3-4: Query Optimization
- [x] Create centralized metrics module ✅ 2026-02-07
- [x] Enhance metrics cache structure ✅ 2026-02-07
- [x] Create query templates library ✅ 2026-02-07
- [x] Remove duplicate queries across dashboards ✅ 2026-02-07

### Week 5-6: Automation
- [x] Implement automated maturity promotion suggestions ✅ 2026-02-07
- [x] Add schema validation to YAML Orchestrator ✅ 2026-02-07
- [x] Create stale content alert system ✅ 2026-02-07
- [x] Build tag health monitoring dashboard ✅ 2026-02-07

### Week 7-8: Advanced Features
- [x] Integrate AI connection suggestions ✅ 2026-02-07
- [x] Automate weekly report generation ✅ 2026-02-07
- [x] Build cross-vault analytics dashboard ✅ 2026-02-07
- [x] Document all new features ✅ 2026-02-07

---

## Success Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Duplicate queries | ~15 | 0 | Manual audit |
| Field inconsistencies | ~20 notes | 0 | Validation script |
| Query errors | Unknown | 0 | Error logs |
| Cache hit rate | N/A | >80% | Metric tracking |
| Maturity promotions/week | Manual | 5+ auto | Dashboard widget |
| Orphan tags | Unknown | <10 | Tag health query |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking existing queries | Test in dev branch first |
| Data loss during bulk updates | Full vault backup before migration |
| Performance degradation | Monitor cache, add LIMIT clauses |
| User confusion | Update documentation simultaneously |

---

## Priority 5: QuickAdd Menu Optimization

**Status**: ✅ Tier 0 & 1 Complete (Feb 21, 2026)

### Findings
- ✅ ~~**Broken Reference**: "Process Note (Safe)" command references non-existent script~~ — Removed
- ✅ ~~**Hidden Commands**: 3 Quick Process tools buried in Backroom (Experimental)~~ — Moved to Process menu
- ✅ **All Templates**: 10 Create templates + all Report types working perfectly
- ✅ **Calendar Handling**: Periodic Notes plugin handles calendar note creation

### Implementation Plan
See: QuickAdd Audit Results (doc removed 2026-07) for detailed analysis

**Quick Summary**:
- **Tier 0** (30 min): ✅ Fixed broken command + moved Quick Process commands to main menu
- **Tier 1** (30 min): ✅ Added dashboard quick-access links to 🏡Home.md
- **Tier 2** (optional): Lightweight type creators — future

---

*Plan Created: 2026-02-05 | Status: ✅ COMPLETE — All 4 priorities implemented 2026-02-07*
*Updated: 2026-02-21 | Priority 5 Tier 0 & 1 implemented*

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
