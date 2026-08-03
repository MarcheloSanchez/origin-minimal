---
title: "meeting"
modified: 2026-07-24
version: "2.15"
bookmarksGroups: 
excludes: 
extends: Base
favoriteView: 
fields:
  - name: participants
    type: Input
    options: {}
    path: ""
    id: TFqAM6
  - name: meeting_type
    type: Select
    options:
      sourceType: ValuesListNotePath
      valuesList: {}
      valuesListNotePath: 99-System/CIS/CIS_MEETING_TYPE.md
    path: ""
    id: Cc3mj4
  - name: action_items
    type: Input
    options: {}
    path: ""
    id: sM3IQu
  - name: location
    type: Input
    options: {}
    path: ""
    id: y5RXXw
  - name: recording_link
    type: Input
    options: {}
    path: ""
    id: mRl4kn
  - name: next_meeting
    type: Date
    options:
      dateShiftInterval: 1 day
      dateFormat: YYYY-MM-DD
      defaultInsertAsLink: false
      linkPath: ""
    path: ""
    id: mNm7tg
  - name: duration
    type: Input
    options: {}
    path: ""
    id: mDu2rn
fieldsOrder:
  - y5RXXw
  - sM3IQu
  - Cc3mj4
  - TFqAM6
  - mRl4kn
  - mNm7tg
  - mDu2rn
filesPaths:
  - 04-Sources/Meetings
icon: handshake
limit: 20
mapWithTag: true
savedViews: []
tagNames:
  - 🤝meeting
---
