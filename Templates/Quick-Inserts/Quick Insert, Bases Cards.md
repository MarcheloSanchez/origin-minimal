```base
filters:
  and:
    - file.inFolder("FOLDER_PATH")

views:
  - type: table
    name: "FOLDER_PATH — Table"
  - type: cards
    name: "FOLDER_PATH — Cards"
    imageProperty: cover      # change to the property you use for images (e.g., banner, thumbnail)
    titleProperty: title      # change if your title is in frontmatter; otherwise file name is used
```
