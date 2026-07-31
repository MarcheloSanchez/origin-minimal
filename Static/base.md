---
title: Base - Template
type: system
tags:
  - ⚙️system
  - 📐template
status: 🔄active
created: 2026-02-18
modified: 2026-02-18
related:
  - "[[MOC - Bases]]"
---

# Base File Template

Scaffold for new standalone `.base` files. Copy the YAML block below into a new `.base` file in `99-System/` or the relevant folder.

> **Usage:** Duplicate this scaffold, keep only the properties and views you need, and delete the rest.

---

## Full Scaffold

```yaml
properties:
  title:
    displayName: Title
  type:
    displayName: Type
  status:
    displayName: Status
  file.folder:
    displayName: Folder
  file.ctime:
    displayName: Created
  file.mtime:
    displayName: Modified

views:
  - type: table
    name: View Name
    filters:
      and:
        - type == "effort"
    order:
      - title
      - type
      - status
      - file.folder
      - file.mtime
    sort:
      - property: file.mtime
        direction: DESC
```

---

## Filter Patterns

**By type**
```yaml
filters:
  and:
    - type == "atomic"
```

**By status**
```yaml
filters:
  and:
    - status == "🔄active"
```

**By folder**
```yaml
filters:
  and:
    - file.inFolder("03-Efforts")
```

**Created today**
```yaml
filters:
  and:
    - 'file.ctime >= today()'
```

**Modified within a week**
```yaml
filters:
  and:
    - 'file.mtime > now() - "1 week"'
```

**Missing a field**
```yaml
filters:
  or:
    - '!status'
    - '!type'
```

**Multiple conditions**
```yaml
filters:
  and:
    - type == "effort"
    - status == "🔄active"
```

**OR across values**
```yaml
filters:
  or:
    - type == "atomic"
    - type == "effort"
```

**Folder scope + missing field (root-level filter + view filter)**
```yaml
filters:
  and:
    - file.inFolder("03-Efforts")

views:
  - type: table
    name: Missing Status
    filters:
      or:
        - '!status'
        - '!type'
```

---

## Notes

- `sort: []` means no sort (Bases plugin default when you clear sort)
- `order:` controls **column order**, not row sort — use `sort:` for row ordering
- Complex expressions must be **quoted strings**: `'file.mtime > now() - "1 week"'`
- Simple equality filters can be **unquoted**: `type == "effort"`
- `today()` returns start of today (midnight); `now()` returns current datetime

## Related

- [[MOC - Bases]] — All base files in the vault
- [[Active-Types-base.base]] — Reference: multi-view type browser
- [[_Daily_Data.base]] — Reference: date filter pattern
- [[_System_data.base]] — Reference: missing field filter pattern
