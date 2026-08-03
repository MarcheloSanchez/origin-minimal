---
up: "[[Templates]]"
title: Templates-About
type: about
status: 🔄active
tags:
  - 📝template
  - 📋about
created: 2025-09-30
modified: 2026-07-10
quality_reviewed: 2026-07-10
related:
  - "[[+About Systemℹ️]]"
maturity: 🌲evergreen
---

> [!orbit] Wayfinder | [[Templates]] | [[+About Static Templatesℹ️]] | [[+About Systemℹ️]]

# 📋 Templates Folder Contract

**What**: Scaffold templates for creating new notes—YAML meta, body, create, static templates consumed by Templater engine.

**Where**: `Templates/` — template components, not filled-out notes.

---

## ✅ What Belongs Here

- YAML meta templates
- Body templates
- Create and static templates  
- Templater scripts and components

## ❌ What Doesn't Belong Here

- **Filled-out notes** → Destination folders (Knowledge, Efforts, etc.)
- **Template documentation** → [[99-System]] or [[Guides]]

---

## 📋 Template Ecosystem Overview

The template system provides **structured note creation** with YAML + body modules.

The template system provides **structured note creation** that integrates seamlessly with your PKM workflow. Each template is designed for **speed, consistency, and automated processing** while maintaining the flexibility needed for different contexts.

## 📋 Template Ecosystem Overview

### **Content Templates** (What you create)
| Template    | Purpose          | Location             | Integration              |
| ----------- | ---------------- | -------------------- | ------------------------ |
| **Atomic**  | Ideas & insights | `02-Knowledge/`           | MOCs, daily reflection   |
| **Source**  | External content | `04-Sources/`        | Knowledge extraction     |
| **Effort**  | Projects & goals | `03-Efforts/`        | Areas, progress tracking |
| **Area**    | Life domains     | `02-Knowledge/Areas/` | Monthly reviews, balance |
| **MOC**     | Knowledge maps   | `01-MOCs/`           | Navigation, overview     |
| **Meeting** | Discussions      | `03-Efforts/`        | Action items, follow-up  |

### **Temporal Templates** (When you create)
| Template | Purpose | Frequency | Navigation |
|----------|---------|-----------|-----------|
| **Daily** | Focus & reflection | Every day | Calendar plugin, hotkeys |
| **Weekly** | Progress review | Every week | Periodic notes automation |
| **Monthly** | Strategic assessment | Every month | Areas review cycle |
| **Quarterly** | Major initiatives | Every quarter | OKR planning |
| **Yearly** | Vision & themes | Every year | Annual review |

### **Context Templates** (How you create)
| Template | Purpose | Context | Trigger |
|----------|---------|---------|---------|
| **Mobile-Atomic** | iPhone capture | On-the-go ideas | Siri shortcuts |
| **Mobile-Daily** | Phone check-ins | Commute, breaks | Quick access |
| **Voice-Note** | Audio capture | Walking, driving | Voice memos |
| **Quick-Effort** | Rapid project setup | Meeting outcomes | Mobile creation |

## 🔗 Integration Network
- [[+About Systemℹ️]] → Templates as foundation of consistent system operation
- [[🏛️My PKM Governance]] → Template standards and metadata schema enforcement
- [[🔁My PKM Workflows]] → Templates integrated into daily capture and review processes
- [[👁️Dashboard]] → Template-created notes designed to work with system queries
- [Link for templater documentation](https://silentvoid13.github.io/Templater/introduction.html)
- [[👤Templater Guide]]
- [[Templater Handbook 2025]]
- [[Learn Symbols & Abbreviations|Use naming like these]]

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*