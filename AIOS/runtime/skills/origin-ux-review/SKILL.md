---
name: origin-ux-review
description: Use when auditing the visual/UX quality of a single Origin v2.0 vault surface (Dashboard, Home, Review HQ, MOCs, Automation Menu, any note with callouts or embedded queries). Covers reading a note as rendered rather than as markdown, checking it against the vault's own written visual standards, enumerating the real callout palette from nick-milo-callouts.css before proposing types, and applying progressive disclosure / Von Restorff / serial position. Inspection-first — produces a findings list with explicit either/or trade-offs and never edits without approval. Triggers on /origin-ux-review, dashboard or MOC redesign, "this note looks cluttered/loud/hard to scan", and any callout-type or layout change.
---

# Origin UX Review Skill (v2.0)

Single-concern skill: **is this vault surface readable, scannable, and honest about what matters?**

Takes **one note** as argument (e.g. `/origin-ux-review 👁️Dashboard.md`) and produces a findings list with explicit trade-off choices. It codifies the procedure that produced the 2026-07-13 Dashboard redesign — including the mistakes that pass made.

Assumes `origin-vault` is in context for folder structure and locked enums. Loads `origin-templates` only if a body-structure question comes up.

## Non-negotiables

1. **Inspection-first, preview-before-apply.** Present findings, wait for approval, then edit. Never edit a note in the same turn you first read it.
2. **Never resolve a trade-off silently.** Every conflict is surfaced as an explicit either/or with the cost of each side named.
3. **Verify before delete.** See "The hard rule" below. Non-optional.
4. **Never invent a callout type.** Only types that exist in `.obsidian/snippets/nick-milo-callouts.css`.
5. **Do not auto-translate.** Match the note's language (Czech, English, mixed).
6. **Do not modify locked paths** — `99-System/CIS/`, `99-System/Config/`, `.obsidian/`, `Templates/_Examples/`. A CSS change is a separate, explicitly-asked-for task.

## The hard rule — verify before delete (learned 2026-07-13)

> Before deleting any content on the grounds that "it already lives elsewhere," **grep for the claim and paste the evidence.**
> Before writing any wikilink, **verify the target note exists** (Glob by title fragment).

Why this is a rule and not a suggestion: the 2026-07-13 Dashboard pass deleted a hotkey table on the grounds that it "lives in `⚡Automation Menu`" — that note contains **no hotkeys at all**. The same pass found `[[210-Health]]` and `[[Habits Map]]`, two dead links that had gone unnoticed for months, only because someone happened to check.

Concrete protocol for any "this is redundant, cut it" finding:

| Step | Action | Fail condition |
|---|---|---|
| 1 | Name the exact destination note that supposedly holds the content | No named destination → the finding is "delete", not "consolidate". Say so. |
| 2 | Grep the destination for a distinctive string from the content being cut | Zero hits → **finding is retracted**, report the false claim |
| 3 | Quote 1–2 matched lines as evidence in the proposal | Can't quote → didn't verify |
| 4 | Glob every wikilink target you are about to write | Not found → do not write the link; report it as an option, not a fact |

**`99-System/` can never be the "it lives elsewhere" target.** It is listed in `.obsidian/app.json → userIgnoreFilters`, so its files are invisible to search, Bases, backlinks, and quick switcher (CLAUDE.md #15). Moving content there is deletion with extra steps. If a proposal's destination path starts with `99-System/`, reject the proposal and offer a visible destination instead.

Also audit existing links while you are in the note: every wikilink in the surface gets a Glob check, not just the ones you touch. Dead links are reported, **never auto-removed** — offer the closest existing target and let the user decide.

## Procedure

### Step 1 — Read the note as rendered, not as markdown

Reconstruct what the eye actually hits, in order. For each block record:

- **Position** — how far down the page (top slot / above the fold / below)
- **Disclosure state** — `[!type]` always-open · `[!type]-` collapsed by default · `[!type]+` open-but-foldable
- **Loudness** — its `--callout-color` group (Step 3), plus emoji density and whether it's a table/query/plain text
- **Cost to read** — is the collapsed *title* self-sufficient, or must the user expand to learn whether they need to?

Then answer three questions in writing:

1. What is the **first** thing the eye lands on? Is that thing the note's purpose?
2. Is any **urgent or actionable** content behind a fold while **static or decorative** content is pre-disclosed? → this is the **collapsed-alarm regression**. Flag it every time. An alarm you have to click is not an alarm.
3. If the user opened this note with 5 seconds to spare, what would they leave with?

### Step 2 — Check the note against the vault's written visual standards

These standards exist and are routinely violated. Read them, don't recall them:

- `99-System/Documentation/🙂Icon Reference & Color System.md` — semantic color roles: **Capture = red/urgency · Navigation = blue · Content = green · Management = orange · System = purple**.
  ⚠️ Read its `[!warning] Proposed, not implemented` callout first: **none of the hex codes in that note are wired into any CSS** (verified 2026-07-09). Treat it as the *semantic intent* to aim at, never as a description of current rendering. Never cite its hex values as "the vault's colors".
- `01-MOCs/MOC - Visual Identity.md` — central visual hub.
- `99-System/Documentation/PKM/🏷️My PKM Tags.md` — tag taxonomy the emoji layer feeds.

Report each deviation as *note vs. standard*, with the standard quoted. A deviation is a finding, not automatically a defect — the standard itself may be the thing that's wrong. Say which you think it is.

### Step 3 — Read the implementation constraints before proposing anything

The real component library is `.obsidian/snippets/nick-milo-callouts.css` — **61 callout types across 10 color groups** (as of 2026-07-24).

> **⚠️ Color and icon are coupled.** Each callout hard-codes a single `--callout-color`. You cannot pair a semantic icon with a semantic color of your choosing — picking `[!book]` picks orange, full stop. Any proposal written before enumerating the palette will be un-implementable.

**Always enumerate first.** Regenerate the grouping rather than trusting the table below — the snippet changes:

```bash
node -e "
const fs=require('fs');
const s=fs.readFileSync('.obsidian/snippets/nick-milo-callouts.css','utf8');
const re=/\.callout\[data-callout=\"([^\"]+)\"\]\s*\{\s*--callout-color:\s*([0-9, ]+);/g;
let m,map={};
while((m=re.exec(s))){(map[m[2].trim()]=map[m[2].trim()]||[]).push(m[1]);}
for(const [c,v] of Object.entries(map)) console.log(c+' ('+v.length+'): '+v.join(', '));
"
```

Snapshot 2026-07-24 — use to reason, re-run to commit:

| `--callout-color` (RGB) | Reads as | Callout types |
|---|---|---|
| `250, 82, 82` | red — urgency | `award, cone, fingerprint, watch` |
| `255, 146, 43` | orange — management | `book, boxes, compass, keaton, shell, tram-front` |
| `199, 196, 0` | yellow — synthesis | `combine, connect, puzzle, sparkles, sun` |
| `64, 192, 87` | green — growth/content | `anchor, bike, leaf, locate, parking, sailboat, ship, shipwheel, snowflake, sprout, train, training, trees` |
| `18, 184, 134` | teal — doing/capture | `cable-car, camera, castle, castleo, combo, play, recycle` |
| `34, 184, 207` | cyan — signal | `radar, rocket` |
| `77, 171, 247` | blue — navigation | `blocks, map, planet, user` |
| `151, 117, 250` | purple — system | `calendar, globe, industry, network, orbit, venetian, video` |
| `233, 124, 238` | magenta — activity/people | `activity, contact, joystick, milestone, rainbow, tower` |
| `134, 142, 150` | grey — neutral/plumbing | `box, command, cross, hexagon, link, notes, script` |

Consequences to state out loud in any proposal:

- The **red group has only 4 types**. Red is the scarcest resource on the page — spend it on the one alarm (Von Restorff), not on a second "also important" block.
- If the semantically-right icon lives in the wrong color group, that is a **trade-off, not a bug**: present it as either/or (`[!book]` = right icon, orange · `[!leaf]` = right color, weaker icon) and let the user pick.
- Colour is the only signal that survives collapse. Two adjacent collapsed callouts in the same colour group read as one block — check for accidental colour collisions between neighbours.

### Step 4 — Apply the three principles that actually fit a note surface

- **Progressive disclosure** — the collapsed title must carry the *summary* (counts, status, "0 overdue"), the fold carries the *detail*. A title of just "Health" fails: the user must expand to learn there is nothing to do. Inline `$=` counts in the title are the vault's established way to do this.
- **Von Restorff (isolation effect)** — **exactly one loud element per surface.** If everything is coloured, nothing is. Count the distinct colour groups in view; more than ~4 means the loudest element no longer wins, and the one alarm must be de-conflicted.
- **Serial position** — the top slot is the only slot with guaranteed attention. Spend it on signal, not on a nav link farm. A wayfinder row with 8+ links consumes the primacy slot for chrome; propose moving the alarm above it, or thinning the row — as an either/or.

Recency applies too: the last block before the footer is the second-most-read. Don't park dead weight there.

### Step 5 — Force every trade-off into an explicit either/or

Never resolve a conflict silently. Format:

```
TRADE-OFF <n>: <one-line conflict>
  A) <option> — gains: <…> · costs: <…>
  B) <option> — gains: <…> · costs: <…>
  Recommendation: <A or B> because <one line>. Your call.
```

Recommendations are allowed and encouraged; **silent picks are not**. If a finding has only one sane fix, say so and skip the either/or — don't manufacture a fake choice.

## Vault footguns to check every run

| Footgun | Check | Source |
|---|---|---|
| **`[!orbit]` wayfinder is chrome** | The wayfinder callout is `[!orbit]` vault-wide. It is **exempt from the domain colour palette** — do not recolour it on a single note, and do not count its purple against the Von Restorff budget. Recolouring it breaks vault-wide consistency to solve a one-note problem. | CLAUDE.md #14 |
| **`99-System/` is index-excluded** | Never cite it as an "it lives elsewhere" destination; content moved there is invisible to search/Bases/quick switcher. | CLAUDE.md #15 |
| **Footer + wayfinder shape** | Footer last line is `⬆️ [[🏡Home]]  *\| \`= this.file.mtime\`*` (not `date(now)`), preceded by `---`. Wayfinder is preceded by exactly one blank line after frontmatter and never links `[[🏡Home]]`. | CLAUDE.md #13, #14 |
| **Emoji variation selectors** | `⏸️paused` / `⚠️blocked` carry U+FE0F — a regex char-class scanning emoji enums must include it or it silently misses exactly those two. | CLAUDE.md #16 (2nd) |
| **Path-style wikilinks** | Links are by title only (`[[07-Prompts]]`, never `[[99-System/Prompts]]`). Exception: calendar nav links inside `Templates/Calendar/Template {Daily,Weekly,Monthly,Quarterly,Yearly}.md`. | CLAUDE.md #12 |

## Self-check before presenting

Run this against your own draft. If any line fails, fix the proposal — do not present a known-wrong finding.

- [ ] Every proposed callout type appears in the palette enumeration I ran **this session**.
- [ ] Every "it lives elsewhere" claim has a pasted grep hit; none point at `99-System/`.
- [ ] Every wikilink I propose writing was Glob-verified this session.
- [ ] `[!orbit]` untouched.
- [ ] Exactly one element is proposed as the loud one; I can name it.
- [ ] No user content (comments, tables, images, queries, Czech text) silently dropped between before and after.
- [ ] Every trade-off is an explicit either/or; I made zero silent picks.

## Output format

```
Surface: <path>

Rendered read (top → bottom):
| # | Block | Disclosure | Colour group | Carries |
|---|---|---|---|---|

Findings:
- disclosure: <collapsed-alarm regressions, title-carries-no-summary>
- attention: <Von Restorff / serial position>
- standards: <deviations from Icon Reference / MOC - Visual Identity>
- integrity: <dead wikilinks, unverified "lives elsewhere" claims, path-style links>
- palette: <proposals that are un-implementable given colour/icon coupling>

Verified claims:
- <claim> → grep hit: <file>:<line> "<quote>"
- <link> → Glob: found | NOT FOUND

Trade-offs:
TRADE-OFF 1: …
  A) … B) … Recommendation: …

Proposed changes (in priority order):
1. <change> — <one-line reason>

Diff preview:
<before/after per change>

Apply? [y/N/partial]
```

Wait for the answer. **Never auto-apply.**

## After applying

Report: path modified · changes actually applied · anything skipped and why · follow-ups (e.g. "dead link `[[Habits Map]]` left in place, your call").

If the user answered `partial` or hand-edited the diff, append one line to `AIOS/memory/lessons.md` under `## Entries`:

`- **<today>** · ux-review · correction — "<what changed and why>". → candidate rule: <one line or "none">`

## Files referenced (read-only)

- `.obsidian/snippets/nick-milo-callouts.css` — the real component library (never modify from this skill)
- `99-System/Documentation/🙂Icon Reference & Color System.md`
- `01-MOCs/MOC - Visual Identity.md`, `99-System/Documentation/PKM/🏷️My PKM Tags.md`
- `.obsidian/app.json` — `userIgnoreFilters`, to confirm what is index-excluded
