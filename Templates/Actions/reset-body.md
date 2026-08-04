<%*
const types = ["atomic", "effort", "source", "moc", "meeting", "prompt", "person", "place", "tool", "area"];
const type = await tp.system.suggester(
  types.map(t => t.charAt(0).toUpperCase() + t.slice(1)),
  types,
  false,
  "Select note type to reset body:"
);
if (type) {
  await tp.user.Templater_script.reset_body(tp, type);
}
%>
