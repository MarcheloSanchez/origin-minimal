```
<%*  
// 99-System/Scripts/Weekly-Maintenance.js  
const oneWeekAgo = moment().subtract(7, 'days');  
const stats = {  
newNotes: 0,  
processedNotes: 0,  
archivedNotes: 0,  
orphanNotes: 0  
};  
// Sběr statistik  
const allFiles = app.vault.getMarkdownFiles();  
for (const file of allFiles) {  
const cache = app.metadataCache.getFileCache(file);  
const frontmatter = cache?.frontmatter;  
if (frontmatter?.created && moment(frontmatter.created).isAfter(oneWeekAgo)) {  
stats.newNotes++;  
}  
if (frontmatter?.status === "📦archived") {  
stats.archivedNotes++;  
}  
// Detekce orphan poznámek  
const links = app.metadataCache.getBacklinksForFile(file);  
if (Object.keys(links.data).length === 0 && !file.path.includes("99 System")) {  
stats.orphanNotes++;  
}  
}  
tR += `# Týdenní maintenance report  
*${tp.date.now("DD.MM.YYYY")}*  
## 📊 Statistiky za týden  
- 📝 Nové poznámky: ${stats.newNotes}  
- ✅ Zpracované: ${stats.processedNotes}  
- 📦 Archivované: ${stats.archivedNotes}  
- 🔗 Orphan poznámky: ${stats.orphanNotes}  
## 🧹 Doporučené akce  
${stats.orphanNotes > 0 ? `- [ ] Zkontrolovat ${stats.orphanNotes} orphan poznámek` : ''}
```
# Týdenní maintenance report
*09.08.2025*

## 📊 Statistiky za týden
- 📝 Nové poznámky: 5
- ✅ Zpracované: 0
- 📦 Archivované: 0
- 🔗 Orphan poznámky: 165

## 🧹 Doporučené akce
- [ ] Zkontrolovat 165 orphan poznámek
- [ ] Vyčistit +Inbox (cíl: <5 položek)
- [ ] Aktualizovat project statusy
- [ ] Backup do cloudu

## 🎯 Cíle na příští týden
- [ ] Udržet processing time <24h
- [ ] Zvýšit link density na >2.5
- [ ] Dokončit 3 aktivní projekty


