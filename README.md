# Origin 🧠 — Personal Knowledge Vault

> A PARA-inspired "second brain" for Obsidian. Capture anything, grow it from a rough note into refined knowledge, and always know where things live.

> [!tip] New here? Start with the tour.
> **→ Take the [[00-Tutorial-Guide|7-day guided tour]].** It walks you through every part of the vault in ~15 minutes a day, following a real storyline. No reading a manual — you learn by doing.

---

## What is Origin?

Origin is a knowledge system, not just a notes folder. Everything flows one way — **Capture → Process → Organize → Connect → Review → Archive** — so nothing gets lost and nothing rots in an inbox forever. Notes have a *maturity* (from rough seed to finished fruit) and a *home* (one of eight layers below), and the vault's dashboards always show you what needs attention next.

It's also a **template**: one Origin vault is the source that derived vaults (work, study, projects) copy their structure and automation from. See *Template source & updates* at the bottom if that's you.

---

## How it's organized

Eight numbered layers, capture at the top, archive at the bottom:

| Layer | Holds | Flow |
|-------|-------|------|
| `+Inbox` | Raw, unprocessed captures | Capture → Process |
| `01-MOCs` | Maps of Content — navigation hubs | Organize → Navigate |
| `02-Knowledge` | Atomic notes + life **Areas** (Health, Finance, Career…) | Develop → Connect |
| `03-Efforts` | Projects & initiatives (`Active` / `Paused` / `Waiting`) | Execute → Track |
| `04-Sources` | Books, articles, media, meetings | Reference → Cite |
| `05-Calendar` | Daily → Weekly → Monthly → Yearly notes | Reflect → Review |
| `06-Archive` | Finished, dormant, or preserved material | Store → Protect |
| `99-System` | Scripts, templates, docs, vault rules | Maintain |

Plus `Templates/` (the note templates) and `AIOS/` (the Claude-Code automation layer). Ten note types exist — atomic, effort, source, moc, meeting, area, person, place, tool, prompt — each with its own template.

---

## Your first 15 minutes

1. **Take the tour** → [[00-Tutorial-Guide]] — the guided 7-day path.
2. **Capture a thought** → press `Ctrl+P` → *Quick Process*, or drop a note straight into [[+Inbox]].
3. **Get oriented** → open [[🏡Home]] and click through the layers.

---

## Learn more

**Strategic North Star**: [[Builders Ledger]] — your personal vision and strategic priorities.

When you want to go deeper, these are the reference notes:

- [[🗺️My PKM MOC]] — the complete map of the system
- [[🔁My PKM Workflows]] — how notes move through capture → archive
- [[📁My PKM Folders]] — what belongs in each folder
- [[✅My PKM Tasks]] — how tasks are tracked (tag vs. checkbox)
- [[🏷️My PKM Tags]] — the tag vocabulary

---

> [!gear]- ⚙️ Setting up from scratch
> Only needed if you're standing up a fresh Origin vault (not opening one that's already synced).
>
> **1. Get the vault** — clone or download your Origin repository, then in Obsidian choose *Open folder as vault* and select it.
>
> **2. Enable the essential plugins** — `Ctrl+,` → Community Plugins → Browse, then install and enable:
> - **Templater** — templates & automation
> - **Dataview** — dynamic queries and dashboards
> - **QuickAdd** — fast capture and macros
> - **Tasks** — GTD-style task tracking
>
> **3. Create your first note** — `Ctrl+P` → Quick Process → it lands in `+Inbox`. You're running.
>
> **Troubleshooting**
> - *Templater does nothing* → Settings → Templater → set *Template folder* to `Templates/` and enable *Trigger Templater on new file creation*.
> - *Dataview tables don't render* → Settings → Dataview → enable *JavaScript Queries*, then reload (`Ctrl+R`).
> - *Hotkeys missing* → Settings → Hotkeys, or copy the bindings from [[MOC - Hotkeys]].

---

## Template source & updates

This vault is the **template source** for derived vaults. Git tracks only the shared structure — `Templates/`, `99-System/Scripts/`, `99-System/FileClass/`, `07-Prompts/`, and `AIOS/` (runtime/docs/rules). Everything else (your notes, inbox, calendar) syncs via **Obsidian Sync**, not git. How changes travel between vaults (DEV → TEST → MAIN) is governed by the [[🚢Release Playbook]] and [[🗺️Vault Topology & Promotion]]. See [[📱Mobile Setup Guide]] and [[🚀Vault Migration Guide]] for full detail.

---

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
