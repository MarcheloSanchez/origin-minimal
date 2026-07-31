---
up: "[[07-Prompts]]"
title: Prompt Patterns
type: guide
tags:
  - 🤖AI/prompt
  - 📖guide
status: 🔄active
created: "2026-03-07"
modified: "2026-03-07"
summary: "Prompt engineering techniques and reusable structures. Context doc for AI tools."
related: []
---

# Prompt Patterns

Reusable prompt engineering techniques. Each pattern: what it is, when to use it, minimal example.

---

## Foundational Patterns

### Role Prompting

Assign the AI a specific persona or expertise to shape tone and depth.

**When to use**: When you need domain-specific language or a consistent voice.

```
You are a senior QA engineer with 10 years of experience in test automation.
Review this code for edge cases and potential failures.
```

**Pitfalls**: Overly specific roles can narrow the output too much. "Act as a PhD physicist" for a simple explanation is overkill.

---

### Few-Shot (Examples)

Provide 2-5 input→output examples before the actual task. The model pattern-matches.

**When to use**: When the desired output format or style is hard to describe but easy to show.

```
Convert these notes to action items:

Note: "Discussed migration timeline with team, agreed on Q2"
Action: Schedule Q2 migration kickoff meeting

Note: "Bug in login flow reported by 3 users"
Action: Create P1 bug ticket for login flow regression

Note: "New design system ready for review"
Action: [your task here]
```

**Pitfalls**: Too many examples waste tokens. Bad examples teach bad patterns.

---

### Chain of Thought (CoT)

Ask the model to reason step-by-step before answering.

**When to use**: Complex reasoning, math, multi-step analysis, debugging.

```
Think through this step by step before giving your answer.
```

**Pitfalls**: Adds tokens. For simple factual questions, CoT is unnecessary overhead.

---

### System + User Message Split

Separate persistent instructions (system) from the specific task (user message).

**When to use**: Always in API contexts. In chat: put role/constraints first, task second.

```
System: You are a concise technical writer. Output markdown. Max 200 words.
User: Explain how Git rebase works.
```

**Pitfalls**: Some models weight system messages differently. Test if instructions in system vs user change output quality.

---

## Advanced Patterns

### Tree of Thought

Explore multiple reasoning paths, evaluate each, select the best.

**When to use**: Complex decisions with multiple valid approaches.

```
Consider 3 different approaches to solve this problem.
For each: outline the approach, list pros and cons.
Then select the best one and implement it.
```

---

### Self-Critique / Reflection

Ask the model to review and improve its own output.

**When to use**: When first-draft quality isn't good enough. Writing, code review, analysis.

```
After generating your answer, review it for:
1. Factual accuracy
2. Missing edge cases
3. Clarity

Then output an improved version.
```

---

### Step-Back Prompting

Ask the model to consider the broader context before diving into specifics.

**When to use**: When the task is too narrow and misses the bigger picture.

```
Before answering, step back and consider: what is the underlying goal here?
Then address the specific question with that context in mind.
```

---

### Chain of Verification

Ask the model to verify its claims against known facts or constraints.

**When to use**: Fact-heavy tasks, reducing hallucination.

```
After your response, list each factual claim you made.
For each, state your confidence level (high/medium/low).
Flag any claim below "high" for user verification.
```

---

## Structural Patterns

### Template Variables ({placeholders})

Use `{variable}` placeholders to create reusable prompt templates.

**When to use**: Any prompt you'll run more than once with different inputs.

```
Summarize the following {document_type} in {length} bullet points,
focusing on {focus_area}.
```

---

### Output Format Constraints

Specify exact output structure: JSON, markdown, table, numbered list.

**When to use**: When output feeds into another tool or needs consistent parsing.

```
Respond in this exact JSON format:
{
  "summary": "one sentence",
  "key_points": ["point1", "point2"],
  "confidence": 0.0-1.0
}
```

**Pitfalls**: Over-constraining kills creativity. Use for structured tasks, not creative ones.

---

### Guardrail Injection

Add explicit constraints to prevent unwanted output.

**When to use**: When the model tends to go off-track, add disclaimers, or be too verbose.

```
Rules:
- Do not add disclaimers or caveats
- Do not explain what you're doing, just do it
- If unsure, say "uncertain" rather than guessing
- Max 3 paragraphs
```

---

## Meta Patterns

### Mega-Prompt

Combine role + context + task + format + constraints in a single structured prompt.

**When to use**: Complex, high-stakes tasks where every dimension matters.

```
# Role
Senior data analyst

# Context
Q4 sales data, 3 product lines, 12 regions

# Task
Identify the top 3 underperforming regions and explain why

# Format
Markdown report with tables

# Constraints
- Data-driven, cite specific numbers
- Max 500 words
- No speculation without flagging it
```

---

### Prompt Chaining

Output of prompt A becomes input of prompt B. Break complex tasks into stages.

**When to use**: Tasks too complex for a single prompt. Research → Analysis → Synthesis.

```
Step 1: Extract all technical requirements from this document
Step 2: [feed output] Prioritize by implementation complexity
Step 3: [feed output] Create a sprint plan for the top 5
```

---

### Self-Improving Prompts

Ask the model to suggest how the prompt itself could be better.

**When to use**: When iterating on a prompt that's not quite working.

```
I'll give you a prompt I've been using. Analyze it and suggest
3 specific improvements to get better results. Explain why each
change helps.
```
