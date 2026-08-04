```  

<%*  

  

function generateUUID() {  

  

return 'id-' + Math.random().toString(36).substr(2, 9);  

  

}  

  

const uuid = generateUUID();  

  

return `uuid: "${uuid}"`;  

  

%>  

```
uuid: "id-1vl9qzkek"