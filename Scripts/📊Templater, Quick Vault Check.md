```  
<%*  

const files = app.vault.getMarkdownFiles();  

%>  

# Test Template  

**Total files:** <% files.length %>  

**Current time:** <% tp.date.now("YYYY-MM-DD HH:mm") %>  
```