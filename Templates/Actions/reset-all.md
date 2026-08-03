<%*
const types = ["atomic", "effort", "source", "moc", "meeting", "prompt", "person", "place", "tool", "area"];
const type = await tp.system.suggester(
  types.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
  types,
  false,
  "Select note type:"
);
if (type) {
  const modes = ["empty", "auto"];
  const mode = await tp.system.suggester(
    ["Empty (manual fill)", "Auto (pre-filled)"],
    modes,
    false,
    "Select mode:"
  );
  if (mode) {
    await tp.user.Templater_script.reset_all(tp, type, mode);
  }
}
%>
