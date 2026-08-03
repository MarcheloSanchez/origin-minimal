// process-note-safe.js — One-click safe processing combo
// Purpose: Run Autofill Metadata + Normalize YAML in sequence on current note
// Requires: QuickAdd
// Run: Via QuickAdd macro (Process > Process Note (Safe))
//
// Usage (QuickAdd): Add as UserScript in macro

/**
 * Process Note (Safe)
 * A combo macro that runs two safe operations in sequence:
 * 1/2. Autofill Metadata — auto-metadata.js logic to fill missing YAML fields
 * 2/2. Normalize YAML — yaml_orchestrator.js in normalize mode
 *
 * Note type routing is handled by Auto Note Mover (Templater templates set type on creation).
 * Gives beginners a single "do the right thing" button.
 */

module.exports = async (args) => {
  const { app, Notice } = window;

  try {
    const activeFile = app.workspace.getActiveFile();
    if (!activeFile) {
      new Notice("❌ No active file to process");
      return;
    }

    const fileName = activeFile.basename;
    new Notice(`🔄 Processing "${fileName}"...`);

    // Step 1/2: Autofill Metadata
    new Notice("1/2 — Autofilling metadata...");
    try {
      const autoMeta = await loadScript("99-System/Scripts/auto-metadata.js");
      await autoMeta(args);
    } catch (err) {
      console.error("Process Note (Safe) — Autofill failed:", err);
      new Notice(`⚠️ Autofill skipped: ${err.message}`);
    }

    // Step 2/2: Normalize YAML
    new Notice("2/2 — Normalizing YAML...");
    try {
      const orchestrator = await loadScript("99-System/Scripts/yaml_orchestrator.js");
      await orchestrator({ mode: "normalize", backup: false });
    } catch (err) {
      console.error("Process Note (Safe) — Normalize failed:", err);
      new Notice(`⚠️ Normalize skipped: ${err.message}`);
    }

    new Notice(`✅ "${fileName}" processed successfully`);

  } catch (error) {
    new Notice(`❌ Process Note error: ${error.message}`);
    console.error("process-note-safe error:", error);
  }
};

/**
 * Dynamically load a QuickAdd user script by vault path
 */
async function loadScript(scriptPath) {
  const { app } = window;
  const file = app.vault.getAbstractFileByPath(scriptPath);
  if (!file) {
    throw new Error(`Script not found: ${scriptPath}`);
  }
  const content = await app.vault.read(file);
  // Use Function constructor to evaluate the module.exports pattern
  const fn = new Function("module", "exports", "require", content);
  const mod = { exports: {} };
  fn(mod, mod.exports, () => {});
  return mod.exports;
}
