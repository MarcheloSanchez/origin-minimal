## Content Type (auto-tagged by template; mirrors `type:` field — intentional)
💡atomic
🚀effort
📚source
🗺️MOC
🗺️place
🤝meeting
👤person
🛠️tool
🏠area
📅daily
📅weekly
📅monthly
📅quarterly
📅yearly

## Workflow Status (mirrors `status:` field — supplementary, not primary)
📥inbox
🔄active
⏳waiting
✅completed
📦archived
⏸️paused
❌cancelled
⚠️blocked

## Development Lifecycle (distinct dimension — NOT the same as `maturity:` field)
📤seed
🌱develop
❔question
🧹tidy
⚗️experiment
🚤floating

## Maturity (mirrors `maturity:` field — for reference; usually redundant with YAML)
📤seed
🌱seedling
🪴sapling
🌲evergreen
🍓fruit

## Priority & Urgency
urgent
important
quick-win

## Topic & Domain (hierarchical, open vocabulary — use sparingly per consolidation "3+ notes" rule)

**Namespace format**: `namespace/<emoji><word>` — combines an open, nestable namespace prefix with an emoji-forward value, so tags both nest/collapse in Obsidian's tag pane *and* stay visually scannable (resolved 2026-07-27, `AIOS/docs/plans/2026-07-27-main-vault-migration-map-design.md` §4).

**Pass condition** — a namespace gets this nested `namespace/<emoji><word>` treatment when its vocabulary is **open/growing** (unbounded, new values expected over time) **AND** it is genuinely **cross-cutting across multiple note types** (not already anchored by a single hub note's wikilink). Passing examples: `domain/*`, `people/*`.

**NO-GO condition** — a **closed, small-cardinality set** (roughly ≤5 fixed values) does **not** get this treatment. Use flat tag values or a locked YAML enum field (`99-System/CIS/CIS_{FIELD}.md`) instead. This is an applied precedent, not a hypothetical: `energy/*`, `context/*`, `priority/*` were retired 2026-07-27 for exactly this reason — see "Namespaces retired" below. `priority` itself already has a locked YAML field (`CIS_PRIORITY.md`); the flat tags `urgent`/`important`/`quick-win` above cover the rest without a namespace.

Check any future tag-namespace proposal against both conditions before adding it here — no need to re-open the design conversation that produced this rule.

### `domain/*` — planned values (MAIN migration, not yet applied to any note)
> None of these exist on any live note yet — this is the intended vocabulary for the MAIN vault migration (`AIOS/docs/plans/2026-07-27-main-vault-migration-map-design.md`), listed here to reserve the values, not to assert current usage.

domain/💭emotions
domain/🧪testing
domain/💻it
domain/🌱selfdevelopment
domain/💬communication
domain/☢️3dprint
domain/🕹️gaming
domain/🧬health
domain/💰finance
domain/💼career
domain/💞relationships
domain/🧘personal

> Closes a pre-existing gap: `+About Areasℹ️` illustrated `🧬health` as an Area tag, but no such tag actually existed here — only the generic `🏠area` content-type tag did. The health/finance/career/relationships/personal values above are the first reserved values for that slot.

### `people/*` — pattern only (no values reserved)
`people/<emoji><relation>` — e.g. `people/👨‍👩‍👧family`, `people/🎨cultural`. Ties to the Relationships Area + the `People` knowledge type.

### Parked — not added, kept for later consideration
These patterns were proposed alongside `domain/*`/`people/*` but have no real multi-note need yet. Not live, not registered — parked here so the idea isn't lost. Un-comment (turn into a real `### namespace` section above) only once an actual cross-cutting need shows up.

<!--
`place/<emoji><location>` — e.g. `place/🏠home`, `place/✈️travel`. Ties to the `Places` knowledge type.
`season/<emoji><life-chapter>` — e.g. `season/🎓university`, `season/💼job-x`. Temporal grouping ("everything from this life chapter") that folders/Areas don't capture.
skill/*
project/*
-->

### Namespaces retired (2026-07-27)
`energy/*`, `context/*`, `priority/*` — removed, not rescoped. Reason: closed, small GTD sets whose natural unit is a single task/Effort, not a whole note, and no active daily/weekly workflow filtered by them. First applied case of the NO-GO condition above. Do not re-add without re-passing the pass condition.

## Source & Reference
source/book
source/article
source/video
source/podcast
source/course
source/paper
source/web
status/unread
status/reading
status/completed
status/reference

## Special Context
lang/en
lang/cs
public
private
favorite
template
review/daily
review/weekly
review/monthly

## System / Meta (general-purpose, not tied to a field)
🤖AI
🤖AI/prompt
⚙️system
🏷️tags
📋documentation
📋about
📖guide
📋review
📋automation
📊metrics
📊report
📊dashboard
📊metadata
🔄workflow
🔬research
🎓learning
🧭navigation
💯cheatsheet
📦templates
🔧maintenance
⚡productivity

## Legacy / Unreconciled (pre-existing in this file — kept, not vetted against this taxonomy)
🎯gtd
🧠psychology
🧠knowledge
