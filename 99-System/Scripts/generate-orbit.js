module.exports = async (args) => {
  const { app, Notice } = window;
  try {
    const file = app.workspace.getActiveFile();
    if (!file) return new Notice("❌ No active file");

    if (file.path.startsWith("06-Archive/")) {
      return new Notice("⚠️ Archived note — orbit generation skipped");
    }

    const cache = app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter ?? {};
    const type = fm.type;
    const upRaw = fm.up;
    const relatedRaw = fm.related ?? [];

    const TEMPORAL = new Set(["daily","weekly","monthly","quarterly","yearly"]);
    if (TEMPORAL.has(type)) {
      return new Notice(`⏭️ ${type} note — template handles navigation`);
    }

    if (!upRaw) return new Notice("❌ No `up:` field — cannot build orbit");
    const parentName = String(upRaw).replace(/^\[\[|\]\]$/g, "").replace(/\|.*$/, "").trim();
    const parentFile = app.metadataCache.getFirstLinkpathDest(parentName, file.path);
    if (!parentFile) return new Notice(`❌ Parent "${parentName}" not found`);

    const RULES = {
      atomic:    { sib: 2, rel: 2 },
      source:    { sib: 2, rel: 2 },
      effort:    { sib: 2, rel: 0 },
      moc:       { sib: 4, rel: 0 },
      system:    { sib: 3, rel: 0 },
      meeting:   { sib: 2, rel: 2 },
      person:    { sib: 2, rel: 2 },
      place:     { sib: 2, rel: 2 },
      tool:      { sib: 2, rel: 2 },
      prompt:    { sib: 2, rel: 2 },
      area:      { sib: 2, rel: 2 },
      about:     { sib: 2, rel: 0 },
      guide:     { sib: 2, rel: 0 },
      tutorial:  { sib: 2, rel: 0 },
      dashboard: { sib: 2, rel: 0 },
      challenge: { sib: 2, rel: 0 },
    };
    const rule = RULES[type] ?? { sib: 2, rel: 2 };

    const parentCache = app.metadataCache.getFileCache(parentFile);
    const outgoing = (parentCache?.links ?? []).map(l => l.link);
    const seen = new Set([file.basename]);
    const trueChildren = [];
    const fallback = [];
    for (const linkpath of outgoing) {
      const dest = app.metadataCache.getFirstLinkpathDest(linkpath, parentFile.path);
      if (!dest || dest.path === file.path) continue;
      if (seen.has(dest.basename)) continue;
      seen.add(dest.basename);
      const destUp = app.metadataCache.getFileCache(dest)?.frontmatter?.up;
      const destUpName = destUp ? String(destUp).replace(/^\[\[|\]\]$/g,"").replace(/\|.*$/,"").trim() : null;
      if (destUpName && destUpName === parentFile.basename) {
        trueChildren.push(dest.basename);
      } else {
        fallback.push(dest.basename);
      }
    }
    const siblings = [...trueChildren, ...fallback].slice(0, rule.sib);

    const related = [];
    if (rule.rel > 0 && Array.isArray(relatedRaw)) {
      for (const r of relatedRaw) {
        const name = String(r).replace(/^\[\[|\]\]$/g,"").replace(/\|.*$/,"").trim();
        if (!name || seen.has(name)) continue;
        seen.add(name);
        related.push(name);
        if (related.length >= rule.rel) break;
      }
    }

    const parts = [
      `[[${parentFile.basename}]]`,
      ...siblings.map(n => `[[${n}]]`),
      ...related.map(n => `[[${n}]]`),
    ];
    const callout = `> [!orbit] Wayfinder | ${parts.join(" | ")}`;

    const content = await app.vault.read(file);
    const fmMatch = content.match(/^---\s*\n[\s\S]*?\n---\n?/);
    const fmBlock = fmMatch ? fmMatch[0] : "";
    let body = fmMatch ? content.slice(fmMatch[0].length) : content;

    const lines = body.split("\n");
    while (lines.length && lines[0].trim() === "") lines.shift();
    if (lines.length && /^>\s*\[!orbit\]/i.test(lines[0])) lines.shift();
    while (lines.length && lines[0].trim() === "") lines.shift();
    body = lines.join("\n");

    const newContent = fmBlock + callout + "\n\n" + body;
    await app.vault.modify(file, newContent);
    new Notice(`✅ Orbit generated for "${file.basename}"`);
  } catch (err) {
    console.error("generate-orbit:", err);
    new Notice(`❌ Error: ${err.message}`);
  }
};
