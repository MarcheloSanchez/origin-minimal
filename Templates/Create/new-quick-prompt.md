<%*
const name = await tp.system.prompt("Quick prompt name:");
if (!name) return;
const instruction = await tp.system.prompt("Prompt instruction text:");
const today = tp.date.now("YYYY-MM-DD");
const fileName = name.replace(/[\\/:*?"<>|]/g, "-");

const content = `---
up: "[[07-Prompts]]"
title: "${name}"
type: prompt
status: 🔄active
tags:
  - 🤖AI/prompt
prompt_category:
prompt_type:
when_to_use:
created: 2026-07-11
modified: 2026-07-11
---

# 💡 ${name}

\`\`\`
${instruction || "(The prompt text goes here)"}
\`\`\`
`;

const folder = "99-System/Prompts/Inbox";
const filePath = `${folder}/${fileName}.md`;
await app.vault.create(filePath, content);
await app.workspace.openLinkText(filePath, "", true);
%>
