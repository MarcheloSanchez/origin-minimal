```base
filters:
  and:
    - file.inFolder("FOLDER_PATH")

formulas:
  last_updated: file.mtime   # uses the file's modified time
  created_at:   file.ctime   # file creation time

properties:
  "formula.last_updated":
    displayName: "Last Updated"
  "formula.created_at":
    displayName: "Created"

views:
  - type: table
    name: "FOLDER_PATH — Timeline"
```
