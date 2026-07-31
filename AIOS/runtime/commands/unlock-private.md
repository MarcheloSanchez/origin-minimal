---
description: Unlock private vault folders (journal, sessions, archive) for THIS Claude session only. Auto-relocks on next session.
---

You are running inside the **Origin** vault. The user wants to lift the privacy guard for this session.

## Task

1. Create the file `.claude/.privacy-unlock` (relative to the vault root) using the Write tool, with this exact content:

   ```
   unlocked <current ISO-8601 timestamp>
   reason: user ran /unlock-private
   ```

2. Then output this banner verbatim to the user:

   > 🔓 **Private folders UNLOCKED for this session.**
   > Protected folders (journal, sessions, periodic reviews, archive) are now readable by Claude until this session ends or you run `/lock-private`.
   > A new session will automatically re-lock them.

Do not read any protected file unless the user explicitly asks. Unlocking grants permission; it is not an instruction to go browse private notes.
