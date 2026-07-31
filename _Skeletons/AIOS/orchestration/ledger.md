# AIOS Change Ledger

Append-only. One row per applied vault change made by an AIOS command/agent/blueprint. Never edit past rows — corrections get a new row with outcome `reverted`. Valid outcomes: applied, reverted, rejected (rejected rows cite the dated lessons.md entry holding the reason).

| date | tier | fix-class | target | source | outcome |
|---|---|---|---|---|---|
