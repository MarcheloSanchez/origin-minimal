import os
import tempfile
import unittest

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import aios_queue


def _task_note(qdir, name, status="📥queued", created="2026-06-18"):
    path = os.path.join(qdir, name + ".md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(
            "---\ntype: aios-task\nid: %s\nstatus: %s\ntitle: \"%s\"\n"
            "goal: \"g\"\nworker: auto\nwrite_target: auto\ncost_cap: 100\n"
            "sources_required: false\ncreated: %s\n---\n## Task\nx\n## Acceptance\ny\n"
            % (name, status, name, created)
        )
    return path


class TestQueue(unittest.TestCase):
    def setUp(self):
        self.qdir = tempfile.mkdtemp()

    def test_list_filters_by_status(self):
        _task_note(self.qdir, "a", status="📥queued")
        _task_note(self.qdir, "b", status="✅accepted")
        queued = aios_queue.list_tasks(self.qdir, status="📥queued")
        self.assertEqual([t.id for t in queued], ["a"])

    def test_list_sorts_by_created(self):
        _task_note(self.qdir, "late", created="2026-06-18")
        _task_note(self.qdir, "early", created="2026-06-01")
        ids = [t.id for t in aios_queue.list_tasks(self.qdir)]
        self.assertEqual(ids, ["early", "late"])

    def test_claim_next_flips_status(self):
        _task_note(self.qdir, "early", created="2026-06-01")
        _task_note(self.qdir, "late", created="2026-06-18")
        claimed = aios_queue.claim_next(self.qdir)
        self.assertEqual(claimed.id, "early")
        self.assertEqual(claimed.status, "🔄running")
        # second claim gets the next one, not the running one
        self.assertEqual(aios_queue.claim_next(self.qdir).id, "late")

    def test_claim_next_empty_returns_none(self):
        self.assertIsNone(aios_queue.claim_next(self.qdir))

    def test_unknown_status_tasks_flags_noncanonical(self):
        _task_note(self.qdir, "good", status="📥queued")
        _task_note(self.qdir, "accepted", status="✅accepted")
        _task_note(self.qdir, "typoed", status="📋todo")
        flagged = aios_queue.unknown_status_tasks(self.qdir)
        # only the typo'd status is flagged; canonical statuses are not
        self.assertEqual(flagged, [("typoed.md", "📋todo")])

    def test_unknown_status_task_is_invisible_to_claim(self):
        # reproduces the silent-skip footgun: a non-canonical status never claims
        _task_note(self.qdir, "typoed", status="📋todo")
        self.assertIsNone(aios_queue.claim_next(self.qdir))
        self.assertEqual(
            aios_queue.unknown_status_tasks(self.qdir), [("typoed.md", "📋todo")]
        )

    def test_queue_summary_counts_by_status(self):
        _task_note(self.qdir, "q1", status="📥queued")
        _task_note(self.qdir, "q2", status="📥queued")
        _task_note(self.qdir, "r1", status="👁️review")
        _task_note(self.qdir, "a1", status="✅accepted")
        summary = aios_queue.queue_summary(self.qdir)
        self.assertIn("2 queued", summary)
        self.assertIn("1 at 👁️review", summary)
        self.assertIn("1 ✅accepted", summary)

    def test_queue_summary_empty(self):
        self.assertEqual(aios_queue.queue_summary(self.qdir), "queue empty")


if __name__ == "__main__":
    unittest.main()
