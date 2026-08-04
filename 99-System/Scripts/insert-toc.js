module.exports = async (params) => {
    const { app, quickAddApi: qa } = params;
    const { Notice } = window;

    const input = await qa.inputPrompt("Show Contents Down to Which Header Level (1-6)?", "3", "3");
    if (input === null || input === undefined) return;
    const header_limit = parseInt(input) || 3;

    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) { new Notice("❌ No active file"); return; }

    const content = await app.vault.read(activeFile);
    const file_title = activeFile.basename.replace(/ /g, '%20');

    // first_level is set on the first heading that passes the limit filter.
    // This ensures the first displayed heading always has no indent (treated as H1),
    // regardless of its actual level (H2, H3, etc.).
    let first_level = null;

    let headers = content
        .split('\n')
        .filter(t => t.match(/^[#]+\s+/gi))
        .map(h => {
            const header_level = h.split(' ')[0].match(/#/g).length;
            const header_text = h.substring(h.indexOf(' ') + 1);
            let header_url = header_text.replace(/ /g, '%20');
            const header_link = `[${header_text}](${file_title}.md#${header_url})`;
            if (header_level <= header_limit) {
                if (first_level === null) first_level = header_level;
                return `> ${'    '.repeat(Math.max(0, header_level - first_level))}- ${header_link}`;
            }
        })
        .filter(Boolean)
        .join('\n');

    while (headers.includes('\n\n')) { headers = headers.replace(/\n\n/g, '\n'); }

    const tocText = `> [!SUMMARY]+ Table of Contents\n${headers}`;

    const editor = app.workspace.activeEditor?.editor;
    if (editor) {
        editor.replaceSelection(tocText);
    }
};
