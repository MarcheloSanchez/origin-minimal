> [!SUMMARY]+ Table of Contents
<%*  
// Get input from user - specify maximum header level to be displayed (default = 3)  
let header_limit = await tp.system.prompt("Show Contents Down to Which Header Level (1-6)?", "3");  
// first_level is set on the first heading that passes the limit filter.
// This ensures the first displayed heading always has no indent (treated as H1),
// regardless of its actual level (H2, H3, etc.).
let first_level = null;  
let headers = await tp.file.content  
.split('\n') // split file into lines  
.filter(t => t.match(/^[#]+\s+/gi)) // only get headers  
.map(h => {  
let header_level = h.split(' ')[0].match(/#/g).length;  
// get header text without removing any special characters  
let header_text = h.substring(h.indexOf(' ') + 1);  
// get header text URL as it is in the file (DON'T REMOVE SPECIAL CHARS OR LINK TO HEADER WON'T WORK)  
let header_url = h.substring(h.indexOf(' ') + 1);  
// Non-wikilinks style output:  
let file_title= tp.file.title.replace(/ /g, '%20'); // Replace spaces in file names with '%20'  
header_url = header_url.replace(/ /g, '%20'); // Replace spaces in urls with '%20'  
let header_link = `[${header_text}](${file_title}.md#${header_url})`  
// Output headers up to specified level  
if ( header_level <= header_limit) {  
if (first_level === null) first_level = header_level;  
return `> ${'    '.repeat(Math.max(0, header_level - first_level))}- ${header_link}`;  
}  
})  
.join('\n')  
// If not using all headers, empty lines are inserted where non-displayed headers should be.  
// This removes any blank lines  
while (headers.includes("\n\n")) { headers= headers.replace(/\n\n/g,'\n'); }  
%><% headers %>