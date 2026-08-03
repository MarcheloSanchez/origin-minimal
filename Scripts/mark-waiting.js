// mark-waiting.js — Mark note as waiting, add tag, trigger Auto Note Mover
// Purpose: Set status to waiting, add tag, move to 03-Efforts/Waiting/
// Requires: QuickAdd, Auto Note Mover
// Trigger: Manual (QuickAdd Macro)

module.exports = async (params) => {
  const { app, quickAddApi: qa } = params;
  const { Notice } = window;

  const file = app.workspace.getActiveFile();
  if (!file) {
    new Notice("No active note");
    return;
  }

  try {
    // Update frontmatter: set status and add tag
    await app.fileManager.processFrontMatter(file, (fm) => {
      fm.status = "⏳waiting";
      fm.modified = window.moment().format("YYYY-MM-DD");

      // Add tag if not present
      if (!fm.tags) {
        fm.tags = [];
      }
      if (!fm.tags.includes("⏳waiting")) {
        fm.tags.push("⏳waiting");
      }
    });

    // Trigger Auto Note Mover to relocate the note
    await app.commands.executeCommandById("auto-note-mover:Move-the-note");

    new Notice("Marked as waiting and moved");
  } catch (error) {
    new Notice(`Error: ${error.message}`);
  }
};
