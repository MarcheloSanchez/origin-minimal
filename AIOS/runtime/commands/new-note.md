---
description: Create a new properly-typed, templated, routed vault note. Asks for type and title interactively. Preview before write.
argument-hint: "[type] [title hint — e.g. 'atomic Zettelkasten principle' or just 'atomic']"
---

You are running inside the **Origin** v2.0 vault. Load `origin-vault`, `origin-routing`, `origin-templates`, `origin-yaml`.

## Task

Create one new, well-formed vault note from scratch using the 3-tier template system. Route it correctly. Preview before write.

## Step 1 — Resolve type

If `$ARGUMENTS` contains a recognised type word as the first token, use it. Otherwise ask:

Present the 10 full types as choices:
- `atomic` — idea, concept, quote, statement, or thing
- `effort` — project or ongoing initiative
- `source` — article, book, video, podcast, guide, or meeting notes
- `moc` — map of content / navigation hub
- `meeting` — meeting notes (shorthand for source → Meetings)
- `person` — person bio/profile
- `place` — location or place note
- `tool` — software, service, or physical tool
- `area` — life domain (health, finance, career, etc.)
- `prompt` — reusable AI prompt

If the user picks `atomic`, immediately ask for subtype: `Concept`, `Idea`, `Quote`, `Statement`, `Thing`.

Lightweight types (`guide`, `dashboard`, `system`, `tutorial`, `challenge`) are also valid — accept them if typed, but don't offer them in the picker (they're system notes, not knowledge notes).

## Step 2 — Resolve title

If `$ARGUMENTS` contains a title hint after the type word, use it as a draft title. Otherwise ask: "What's the title for this note?"

For `atomic`, use the naming convention for the subtype:
- Concept/Idea/Statement: sentence-case, ≤ 60 chars
- Quote: `"First few words…" — Author`
- Thing: proper name

## Step 3 — Resolve destination

Use `origin-routing` to determine the exact destination folder based on type + subtype. For `effort`, ask for status (`🔄active` / `⏸️paused` / `⏳waiting`) to pick the subfolder. For `source`, ask for `source_type` (article/book/video/podcast/guide/meeting).

State the destination path and confidence before drafting.

## Step 4 — Draft

Compose the note using `origin-templates` (Meta + Body for the type) and `origin-yaml` (canonical field order, quoted wikilinks):

- **YAML**: fill `title`, `type`, `status` (default `📥inbox`), `maturity` (default `📤seed`), `created` (today), `modified` (today), `up` (propose the most relevant MOC or parent — verify it exists via Glob before adding), `tags` (1–2 canonical tags from type), `related: []`
- **Body**: `[!orbit]` wayfinder as first line (once `up:` is confirmed), then all body sections from the template — leave them empty/with placeholders rather than inventing content
- **Footer**: `⬆️ [[🏡Home]]  *| \`= this.file.mtime\`*` as last line

## Step 5 — Preview

Show:
```
Destination: <full vault-relative path>/<filename>.md
Type: <type> / <subtype if atomic>
Confidence: high | medium | low

--- YAML ---
<full frontmatter>

--- BODY ---
<full body>
```

Pause for `y` / `N` / `edit`.
- `edit`: ask what to change (type? title? destination? a specific field?), redraft, re-preview.
- `y`: write the file. Report the path.
- `N`: exit without writing.

## Hard constraints

1. **Preview before write.** Always.
2. **No invented wikilinks.** Glob to verify a target exists before including it.
3. **No invented body content.** Leave sections as empty placeholders.
4. **No write to locked paths** (`99-System/CIS/`, `99-System/Config/`, `.obsidian/`, `Templates/`).
5. **Filename** ≤ 60 chars, emoji-prefixed per type convention (`💡` atomic, `🚀` effort, `📚` source, `🗺️` moc, `👤` person, `📍` place, `🔧` tool, `🌍` area, `🤖` prompt), no path-special characters.
6. **Never write to `+Inbox`.** This produces a finished note — route it to its real home.
7. **Low-confidence route**: show 2 candidates, let user pick.

## After running

Tell the user:
- Destination path created
- Type + subtype + confidence
- Any wikilinks skipped (target didn't exist)
- Required fields left as placeholders to review
- Suggested next step: open in Obsidian or run `/review-note` to enrich it
