module.exports = async (params) => {
    const { app, quickAddApi: qa } = params;
    const { Notice } = window;

    const callouts = {
        "bug":       "🟥 🪳 Bug",
        "danger":    "🟥 ⚡ Danger",
        "error":     "🟥 ⚡ Error",
        "fail":      "🟥 ❌ Fail",
        "failure":   "🟥 ❌ Failure",
        "missing":   "🟥 ❌ Missing",
        "attention": "🟧 ⚠️ Attention",
        "caution":   "🟧 ⚠️ Caution",
        "warning":   "🟧 ⚠️ Warning",
        "help":      "🟧 ❓ Help",
        "faq":       "🟧 ❓ FAQ",
        "question":  "🟧 ❓ Question",
        "done":      "🟩 ✅ Done",
        "check":     "🟩 ✅ Check",
        "success":   "🟩 ✅ Success",
        "info":      "🟦 ⓘ Info",
        "note":      "🟦 ✏️ Note",
        "abstract":  "🟦 📋 Abstract",
        "summary":   "🟦 📋 Summary",
        "tldr":      "🟦 📋 TL;DR",
        "example":   "🟦 📑 Example",
        "hint":      "🟦 🔥 Hint",
        "important": "🟦 🔥 Important",
        "tip":       "🟦 🔥 Tip",
        "todo":      "🟦 ✅ Todo",
        "cite":      "⬜ ❝ Cite",
        "quote":     "⬜ ❝ Quote",
    };

    const typeNames = Object.keys(callouts);
    const typeLabels = typeNames.map((key, idx) => `${idx + 1}. ${callouts[key]}`);

    const calloutType = await qa.suggester(typeLabels, typeNames);
    if (!calloutType) return;

    const defaultTitle = callouts[calloutType].split(' ').pop();
    const title = await qa.inputPrompt("Callout Header:", defaultTitle, defaultTitle);
    if (title === null || title === undefined) return;

    const foldState = await qa.suggester(
        ["1. Static", "2. Expanded", "3. Collapsed"],
        ["", "+", "-"]
    );
    if (foldState === null || foldState === undefined) return;

    const editor = app.workspace.activeEditor?.editor;
    const selection = editor ? editor.getSelection() : "";
    const body = selection
        ? selection.split('\n').map(line => `> ${line}`).join('\n')
        : "> ";

    const calloutText = `> [!${calloutType}]${foldState} ${title}\n${body}`;
    if (editor) {
        editor.replaceSelection(calloutText);
    }
};
