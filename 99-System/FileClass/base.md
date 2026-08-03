---
title: "base"
modified: 2026-03-03
version: "2.61"
bookmarksGroups: 
excludes: 
extends: 
favoriteView: 
fields:
  - name: created
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    command:
      id: insert__Base__created
      icon: list-plus
      label: Insert created field
    path: ""
    id: qCKBfQ
  - name: modified
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    command:
      id: insert__tO93cy
      icon: list-plus
      label: Insert  field
    path: ""
    id: YQaNwU
  - name: related
    type: Input
    options: {}
    path: ""
    id: Whj3xE
  - name: tags
    type: Input
    options: {}
    style:
      italic: true
    path: ""
    id: ivJyPD
  - name: type
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: 99-System/CIS/CIS_TYPE.md
    path: ""
    id: lK0LtU
  - name: title
    type: Input
    options: {}
    path: ""
    id: id3arN
  - name: status
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: 99-System/CIS/CIS_STATUS.md
    path: ""
    id: LGW6ap
fieldsOrder:
  - id3arN
  - LGW6ap
  - ivJyPD
  - lK0LtU
  - qCKBfQ
  - YQaNwU
  - Whj3xE
filesPaths: 
icon: package
limit: 20
mapWithTag: false
savedViews: []
tagNames: 
---
