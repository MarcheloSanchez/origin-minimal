---
up: "[[07-Prompts]]"
title: Prompt Playbook
type: guide
tags:
  - 🤖AI/prompt
  - 📖guide
status: 🔄active
created: "2026-03-07"
modified: "2026-07-08"
summary: "Step-by-step guide: from blank note to a finished, filed prompt using the prompt template."
related: []
---

# Prompt Playbook

How to go from "I need a prompt" to a finished, filed prompt note.

---

## The 6-step loop

### 1. Define the job

What output are you after, and for whom? Start by filling `when_to_use` — if you can't write one sentence answering "When do I run this?", the prompt isn't worth saving yet. This forces clarity: a prompt that has no clear use case is still an idea, not a tool.

### 2. Pick a pattern

Choose from [[Prompt Patterns]]. The major families: Role Prompting and Few-Shot for guiding tone and style; Chain of Thought for reasoning-heavy tasks; Output Format Constraints for structured output; Self-Critique for quality-sensitive work. One pattern per prompt — layers of patterns get noisy.

### 3. Draft the prompt

Create via QuickAdd (choose `new-prompt` for a full prompt with Example section, or `new-quick-prompt` for minimal prompts with one instruction). Write into `## 💡 Prompt` in this order: role (who the model is), context (what it needs to know), instructions (what to do), constraints (limits), output format (exact structure you want).

### 4. Fill the metadata

Pick one `prompt_category` (writing, research, pkm, coding, learning, planning, creativity, utility) and one or more `prompt_type` values (explanation, reflection, simulation, summarization, rewrite, generation, analysis, planning, idea, prompt-design, comparison, compression, creative, utility). Add `when_to_use` — the sentence from Step 1. See [[Prompt Reference]] chapters "Metadata Schema" and "Quality Checklist" for details.

### 5. Test & tune

Run it, record `eval_score` (1–5, or blank if untested) and `last_run` (today's date). If tuning is needed, check model settings and specific quirks in [[Prompt Tuning]]. Log learnings and experiment notes in [[Prompt Lab]] chapter "Learnings" — this builds your private knowledge base.

### 6. File it

Status flow is `📥inbox → 🔄active → 📦archived`. New prompts land in `Inbox/`; once tested and proven, move to `Library/`. Browse your library via [[MOC - Prompts]].

---

## Full vs Quick prompts

**Full prompts** have the complete template with `## 💡 Prompt`, `## 📝 Description`, and `## Example` sections; use these for reusable, high-stakes prompts you'll run many times. **Quick prompts** are minimal — just YAML + a single instruction in `## 💡 Prompt`; use these for one-offs and experiments. When in doubt, start Quick and promote to Full once a prompt earns repeated use.

---

## Related docs

| Doc | Owns |
|---|---|
| [[Prompt Patterns]] | Techniques & reusable structures (CoT, few-shot, mega-prompt, etc.) |
| [[Prompt Reference]] | Metadata & workflow, categories, quality checklist |
| [[Prompt Tuning]] | Model-specific tips, temperature settings, common pitfalls |
| [[Prompt Lab]] | Personal experiment log and learnings |
| [[MOC - Prompts]] | Organized views of your prompt library |
