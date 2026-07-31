---
description: Re-lock private vault folders immediately (reverses /unlock-private for the current session).
---

You are running inside the **Origin** vault. The user wants to re-arm the privacy guard now.

## Task

1. Delete the file `.claude/.privacy-unlock` (relative to the vault root) if it exists, using a Bash command:

   ```bash
   rm -f ".claude/.privacy-unlock"
   ```

2. Then output this banner verbatim to the user:

   > 🔒 **Private folders LOCKED.**
   > Protected folders are no longer readable by Claude this session. Run `/unlock-private` to allow access again.
