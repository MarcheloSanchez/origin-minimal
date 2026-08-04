- [ ] <% tp.system.prompt("Task") %> @<% tp.system.suggester(["computer", "home", "work", "phone", "errands", "people", "waiting", "anywhere"], ["computer", "home", "work", "phone", "errands", "people", "waiting", "anywhere"]) %> <%*
const priority = await tp.system.suggester(["High ⚡", "Medium 🔋", "Low 🪫"], ["⚡", "🔋", "🪫"]);
const hasDue = await tp.system.suggester(["No due date", "Today", "Tomorrow", "This week", "Custom"], ["none", "today", "tomorrow", "week", "custom"]);
let dueStr = "";
if (hasDue === "today") dueStr = " 📅 " + tp.date.now("YYYY-MM-DD");
if (hasDue === "tomorrow") dueStr = " 📅 " + tp.date.now("YYYY-MM-DD", 1);
if (hasDue === "week") dueStr = " 📅 " + tp.date.now("YYYY-MM-DD", 7);
if (hasDue === "custom") dueStr = " 📅 " + await tp.system.prompt("Due date (YYYY-MM-DD)");
tR += priority + dueStr;
%>
