<%*  

// Aktualizace modified pole na aktuální datum  

const currentFile = tp.file.find_tfile(tp.file.path(true))  

await app.fileManager.processFrontMatter(currentFile, (fm) => {  

fm.modified = tp.date.now("YYYY-MM-DD")  

})  

%>