```base
views:
  - type: table
    name: "Daily Notes"
    filters:
      and:
        - file.inFolder("05-Calendar/Daily")

  - type: table
    name: "Projects (Efforts)"
    filters:
      and:
        - file.inFolder("03 Efforts")

  - type: table
    name: "Zettelkasten (+)"
    filters:
      and:
        - file.inFolder("+")

  - type: table
    name: "META (Governance)"
    filters:
      and:
        - file.inFolder("META")

  - type: table
    name: "Templates"
    filters:
      and:
        - file.inFolder("Templates")

  - type: table
    name: "Sources"
    filters:
      and:
        - file.inFolder("Sources")
```
