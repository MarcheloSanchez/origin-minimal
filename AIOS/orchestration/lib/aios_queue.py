"""Queue directory operations for AIOS orchestration."""
import glob
import os

import aios_task


def list_tasks(queue_dir, status=None):
    tasks = []
    for path in glob.glob(os.path.join(queue_dir, "*.md")):
        t = aios_task.parse_task(path)
        if status is None or t.status == status:
            tasks.append(t)
    tasks.sort(key=lambda t: (t.created, os.path.basename(t.path)))
    return tasks


def claim_next(queue_dir):
    queued = list_tasks(queue_dir, status="📥queued")
    if not queued:
        return None
    nxt = queued[0]
    aios_task.set_status(nxt.path, "🔄running")
    return aios_task.parse_task(nxt.path)


def unknown_status_tasks(queue_dir):
    """Queue files whose status is not a recognized STATUS — malformed or
    typo'd tasks (e.g. a hand-written `📋todo`) that claim_next silently skips.
    Returns a list of (basename, status) so the runner can surface them instead
    of reporting a misleading EMPTY. An empty status counts as unknown."""
    flagged = []
    for path in sorted(glob.glob(os.path.join(queue_dir, "*.md"))):
        t = aios_task.parse_task(path)
        if t.status not in aios_task.STATUSES:
            flagged.append((os.path.basename(path), t.status))
    return flagged


def queue_summary(queue_dir):
    """One-liner queue state suitable for hot.md. Example:
    '2 queued · 1 at 👁️review · 3 ✅accepted · 0 ❌rejected'"""
    counts = {s: 0 for s in aios_task.STATUSES}
    for path in glob.glob(os.path.join(queue_dir, "*.md")):
        t = aios_task.parse_task(path)
        if t.status in counts:
            counts[t.status] += 1
    parts = []
    if counts["📥queued"]:
        parts.append("%d queued" % counts["📥queued"])
    if counts["🔄running"]:
        parts.append("%d 🔄running" % counts["🔄running"])
    if counts["👁️review"]:
        parts.append("%d at 👁️review" % counts["👁️review"])
    if counts["✅accepted"]:
        parts.append("%d ✅accepted" % counts["✅accepted"])
    if counts["❌rejected"]:
        parts.append("%d ❌rejected" % counts["❌rejected"])
    if counts["⚠️failed"]:
        parts.append("%d ⚠️failed" % counts["⚠️failed"])
    return " · ".join(parts) if parts else "queue empty"
