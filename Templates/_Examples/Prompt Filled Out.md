---
up: "[[07-Prompts]]"
title: Build Mental Model
type: prompt
fileClass: prompt
tags:
  - 🤖AI/prompt
status: 🔄active
created: 2026-06-26
modified: 2026-06-26
prompt_category: thinking
prompt_type: instruction
eval_score: 8
last_run: 2026-06-26
related:
  - "[[Challenge this idea]]"
when_to_use: When you want to understand a new concept by building a transferable mental model.
---

> [!orbit] Wayfinder | [[07-Prompts]] | [[Challenge this idea]]

## 💡 Prompt

**Role**: You are a clarity architect specializing in breaking down complex concepts into transferable mental models.

**Task**: I will give you a concept or system. Your job is to:

1. **Identify the core mechanic** — what is the essential principle that makes this concept work? (1 sentence)
2. **Find the foundational metaphor** — what simpler, everyday system does this resemble? (1 comparison)
3. **Map the structure** — what are the key components and how do they interact? (sketch a causal chain or loop)
4. **Test it on an edge case** — does your model predict behavior in an unusual scenario? (1 worked example)
5. **Extract the transferable insight** — where else does this pattern show up? (2–3 domains)

**Constraints**:
- Use everyday language; avoid jargon unless you define it in one sentence first.
- Metaphors must be more intuitive than the original concept.
- Show your reasoning; don't just state the model.
- Flag any assumptions you're making.

**Output format**:
```
## Core Mechanic
[One sentence core principle]

## Foundational Metaphor
[Analogy to everyday system]

## Structure
[Components and causal relationships, as bullets or mini-diagram]

## Edge Case Test
[Unusual scenario where we apply the model]
[What the model predicts]
[Why this works or breaks]

## Transferable Pattern
- Domain 1: [How this pattern shows up elsewhere]
- Domain 2: [How this pattern shows up elsewhere]
- Domain 3: [How this pattern shows up elsewhere]
```

---

## 📝 Description

A structured prompt for turning abstract or complex ideas into intuitive mental models. Useful for learning, explaining concepts to others, and discovering hidden connections across domains.

## Example

**Input:**

Build a mental model for: "Feedback loops in systems"

**Output:**

```
## Core Mechanic
A feedback loop is a process where the output of a system influences its own input, creating either amplification (reinforcing) or dampening (balancing) of behavior.

## Foundational Metaphor
Thermostat in a house. When temperature drops below the set point, the heater turns on. As the house warms, the heater detects this and turns off. The output (warmth) feeds back to control the input (heating), keeping the system stable.

## Structure
- Reinforcing loop: output increases input → output increases more → exponential growth (e.g., social media engagement, compound interest)
- Balancing loop: output moves toward a target → feedback reduces the gap → system stabilizes around the target (e.g., body temperature, market supply/demand)

## Edge Case Test
What if we remove the feedback?
- A heater with no thermostat runs forever → the house gets dangerously hot.
- Stock market with no circuit breaker (feedback to pause trading) → crashes accelerate uncontrolled.
The model predicts: systems without feedback loops become unstable.

## Transferable Pattern
- **Organizations**: team communication creates reinforcing loops (good teams get more done, attract talent, improve faster) and balancing loops (workload limits prevent burnout)
- **Biology**: immune response uses feedback (antibodies suppress infection → antibodies reduce as threat clears)
- **Learning**: motivation feedback loop (early success → confidence → more effort → more success) vs. struggle loop (repeated failure → shame → less engagement → more failure)
```

⬆️ [[🏡Home]]  *| `= this.file.mtime`*
