---
title: "source"
modified: 2026-03-03
version: "2.16"
bookmarksGroups: 
excludes: 
extends: 
favoriteView: 
fields:
  - name: source_type
    type: Cycle
    options:
      sourceType: ValuesList
      valuesList:
        "1": book
        "2": article
        "3": video
        "4": podcast
        "5": research
        "6": experience
        "7": guide
        "8": course
      allowNull: true
    path: ""
    id: LwsxmV
  - name: source_date
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: bT8OcS
  - name: source_author
    type: Input
    options: {}
    path: ""
    id: HZ6kjx
  - name: read_status
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: 99-System/CIS/CIS_READ_STATUS.md
    path: ""
    id: UYpchI
  - name: rating_type
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: 99-System/CIS/CIS_RATING_TYPE.md
    path: ""
    id: N4jB6T
  - name: key_insights_count
    type: Number
    options: {}
    path: ""
    id: 251inT
fieldsOrder:
  - N4jB6T
  - UYpchI
  - HZ6kjx
  - bT8OcS
  - LwsxmV
  - 251inT
filesPaths:
  - 04-Sources
icon: book-text
limit: 20
mapWithTag: true
savedViews: 
tagNames:
  - 📚source
---
