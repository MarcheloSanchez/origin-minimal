<%*
const defValue = await new Date().toISOString().split('T')[0]; // Get current date as str to default value for prompt 
const promtDate = await tp.system.prompt('Write date of the upcoming event "YYYY-MM-DD" fotrmat', defValue, true);
const elixirConfDate = await new Date(promtDate);
const now = await new Date();
const diff = await elixirConfDate - now;
const days = await Math.floor(diff / (1000 * 3600 * 24));
%><% days %> days until my event!