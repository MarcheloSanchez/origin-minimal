// status-picker.js — Set note status via picker
// Purpose: Quick status change with visual selection
// Requires: QuickAdd
// Run: From Commander Page Header

module.exports = async (params) => {
  const { app, quickAddApi: QuickAdd } = params;
  const { Notice } = window;

  const statusOptions = [
    { value: "📥inbox", label: "📥 Inbox - Unprocessed" },
    { value: "🔄active", label: "🔄 Active - In progress" },
    { value: "⏳waiting", label: "⏳ Waiting - Blocked/external" },
    { value: "✅completed", label: "✅ Completed - Done" },
    { value: "📦archived", label: "📦 Archived - Filed away" },
    { value: "⏸️paused", label: "⏸️ Paused - On hold" },
    { value: "❌cancelled", label: "❌ Cancelled - Won't be completed" },
    { value: "⚠️blocked", label: "⚠️ Blocked - Stuck on a dependency" }
  ];

  const file = app.workspace.getActiveFile();
  if (!file) {
    new Notice("No active file");
    return;
  }

  // Get current status
  const metadata = app.metadataCache.getFileCache(file)?.frontmatter;
  const currentStatus = metadata?.status || "(none)";

  // Show picker
  const selectedStatus = await QuickAdd.suggester(
    statusOptions.map(s => s.label),
    statusOptions.map(s => s.value)
  );
  if (!selectedStatus) {
    new Notice("Status change cancelled");
    return;
  }

  // Skip if same status
  if (selectedStatus === currentStatus) {
    new Notice("Status unchanged");
    return;
  }

  await app.fileManager.processFrontMatter(file, (fm) => {
    fm.status = selectedStatus;
  });
  new Notice(`Status: ${currentStatus} → ${selectedStatus}`);
};
