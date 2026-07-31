---
up: "[[07-Prompts]]"
title: Prompt Tuning
type: guide
tags:
  - 🤖AI/prompt
  - 📖guide
status: 🔄active
created: "2026-03-07"
modified: "2026-07-08"
summary: "Model-specific tips, settings, and common pitfalls for tuning existing prompts."
related: []
---

# Prompt Tuning

What works where — model quirks, temperature guide, and common pitfalls.

---

## Model Notes

### Claude (Opus / Sonnet / Haiku)

- **Opus**: Best for complex multi-step reasoning, architecture decisions, long planning. Slower, more expensive.
- **Sonnet**: Sweet spot for code edits, debugging, research, most daily work.
- **Haiku**: Quick lookups, simple fixes, config changes. Fast and cheap.
- Prefers XML tags (`<context>`, `<instructions>`) for structured input
- Follows system prompts faithfully — put constraints there
- Handles long context well but still benefits from "most important info first"
- Markdown output is native and clean

### GPT (4o / o1 / o3)

- **o1/o3**: Built-in chain-of-thought — don't add "think step by step" (it already does)
- **4o**: Good general-purpose, function calling is strong
- Less strict about following system messages than Claude
- JSON mode available via API — use it instead of asking for JSON in prompt

### Local Models

- Simpler prompts work better — less instruction-following capability
- Quantization (Q4/Q5) degrades nuance in complex prompts
- Few-shot examples help more than elaborate instructions
- Keep context short — smaller context windows

---

## Settings & Tuning

### Temperature Guide

| Temperature | Use case |
|---|---|
| **0** | Deterministic tasks: code gen, JSON extraction, classification |
| **0.1-0.3** | Analytical: summaries, debugging, technical writing |
| **0.5-0.7** | Balanced: general writing, brainstorming with constraints |
| **0.8-1.0** | Creative: storytelling, ideation, poetry, roleplay |

**Rule of thumb**: If you want consistency across runs, go low. If you want variety, go high.

### Token Strategy

- **Front-load important context** — models attend more to the beginning
- **Long documents**: Summarize first, then ask questions about the summary
- **"Lost in the middle"**: In very long prompts, key instructions at start AND end
- **Max tokens**: Set explicit limit to prevent rambling (`max_tokens: 500`)

---

## Common Pitfalls

### Lost in the Middle
Models pay most attention to the beginning and end of long prompts. Critical instructions buried in paragraph 5 of 10 get ignored.

**Fix**: Put key constraints at the top. Repeat the most important rule at the end.

### Over-Constraining
Too many rules → robotic, stilted output. The model spends all its capacity following rules instead of producing good content.

**Fix**: 3-5 constraints max. Prioritize the ones that actually matter.

### Ambiguous Instructions
"Make it better" / "Improve this" / "Clean it up" — the model guesses what you mean.

**Fix**: Be specific. "Reduce to 3 paragraphs, use active voice, remove jargon."

### Asking for Too Much at Once
One prompt doing research + analysis + formatting + translation = mediocre at everything.

**Fix**: Chain prompts. One task per prompt, feed output forward.

### Not Showing What You Want
Long descriptions of desired output when a single example would be clearer.

**Fix**: Few-shot beats instruction for format/style. Show, don't tell.
