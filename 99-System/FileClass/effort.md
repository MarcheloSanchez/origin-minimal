---
title: effort
modified: 2026-07-24
version: "2.35"
bookmarksGroups:
excludes:
extends:
favoriteView:
fields:
  - name: completion_percentage
    type: Input
    options: {}
    style:
      bold: true
    path: ""
    id: Izpf8K
  - name: due
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: TpXyNR
  - name: next_actions
    type: Input
    options: {}
    path: ""
    id: eNq8x1
  - name: recurrence
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: 99-System/CIS/CIS_RECURRENCE.md
    path: ""
    id: fmMUJa
  - name: action_required
    type: Boolean
    options: {}
    style:
      code: true
    path: ""
    id: 51OxHv
  - name: priority
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: 99-System/CIS/CIS_PRIORITY.md
    path: ""
    id: 22EUPb
  - name: rank
    type: Input
    options: {}
    path: ""
    id: Rnk1Xz
  - name: time_required
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: 99-System/CIS/CIS_TIME_REQUIRED.md
    path: ""
    id: Ds2mfd
  - name: objectives
    type: Input
    options: {}
    path: ""
    id: eOb5jc
  - name: deliverables
    type: Input
    options: {}
    path: ""
    id: eDe9lv
  - name: budget
    type: Number
    options: {}
    path: ""
    id: eBu3dg
  - name: spent
    type: Number
    options: {}
    path: ""
    id: eSp6nt
fieldsOrder:
  - 51OxHv
  - eNq8x1
  - Ds2mfd
  - fmMUJa
  - TpXyNR
  - 22EUPb
  - Rnk1Xz
  - Izpf8K
  - eOb5jc
  - eDe9lv
  - eBu3dg
  - eSp6nt
filesPaths:
  - 03-Efforts
icon: rocket
limit: 20
mapWithTag: true
savedViews: []
tagNames:
  - 🚀effort
---
