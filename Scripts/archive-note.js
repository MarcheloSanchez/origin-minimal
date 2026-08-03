// archive-note.js — Archive active note to 06-Archive subfolder
// Purpose: Flip status to archived, move to user-selected subfolder
// Requires: QuickAdd
// Trigger: Manual (QuickAdd Macro)

module.exports = async (params) => {
  const { app, quickAddApi: qa } = params;
  const { Notice } = window;

  const file = app.workspace.getActiveFile();
  if (!file) {
    new Notice("No active note");
    return;
  }

  // Check if already in 06-Archive
  if (file.parent.path.startsWith("06-Archive")) {
    new Notice("Note is already archived");
    return;
  }

  // Show destination picker
  const destFolders = [
    "06-Archive/Completed",
    "06-Archive/Dormant",
    "06-Archive/Reference"
  ];
  const destLabels = [
    "📦 Completed — finished work",
    "😴 Dormant — inactive, may return",
    "📚 Reference — keep for lookup"
  ];

  const dest = await qa.suggester(destLabels, destFolders);
  if (!dest) return;

  // Verify destination folder exists
  const destFolder = app.vault.getAbstractFileByPath(dest);
  if (!destFolder) {
    new Notice(`Archive folder not found: ${dest}`);
    return;
  }

  // Update frontmatter and move file
  try {
    await app.fileManager.processFrontMatter(file, (fm) => {
      fm.status = "📦archived";
      fm.modified = window.moment().format("YYYY-MM-DD");
    });

    const newPath = `${dest}/${file.name}`;
    await app.fileManager.renameFile(file, newPath);
    new Notice(`Archived → ${dest}`);
  } catch (error) {
    new Notice(`Error: ${error.message}`);
  }
};
