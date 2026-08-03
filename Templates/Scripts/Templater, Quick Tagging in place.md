<%*  
// Quick Tag Script for Alt+T  
const predefinedTags = [  
"#📥inbox", "#🔄active", "#⏳waiting", "#🎯priority-high", "#✅completed",  
"#📦archived", "#💡atomic", "#⚗️experiment", "#💼work", "#🏠home", "#🗺️MOC", "#🔥on", "#♻️ongoing", "#🌊simmering", "#💤sleeping", "#🚀effort", "#📚source",
"#👤person", "#🤝meeting", "#🧹tidy", "#🚤boat", "#🌱develop", "#❔question", "#⚙️system"  
];  
const selectedTag = await tp.system.suggester(  
predefinedTags.map(tag => tag.replace("#", "")),  
predefinedTags  
);  
if (selectedTag) {  
// Insert tag at cursor position  
return selectedTag + " ";  
}  
%> 