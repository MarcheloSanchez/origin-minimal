import os
import tempfile
import unittest

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import aios_task


SAMPLE = """---
type: aios-task
id: fix-stubs
status: 📥queued
title: "Fix stub bodies"
goal: "Resolve stub-body items"
worker: note-fixer
write_target: auto
cost_cap: 60000
sources_required: false
created: 2026-06-18
---
## Task
Do the thing.

## Acceptance
Each note has >= 3 sentences.
"""


class TestParseTask(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8")
        self.tmp.write(SAMPLE)
        self.tmp.close()

    def tearDown(self):
        os.unlink(self.tmp.name)

    def test_parses_fields(self):
        t = aios_task.parse_task(self.tmp.name)
        self.assertEqual(t.id, "fix-stubs")
        self.assertEqual(t.status, "📥queued")
        self.assertEqual(t.title, "Fix stub bodies")
        self.assertEqual(t.worker, "note-fixer")
        self.assertEqual(t.cost_cap, 60000)
        self.assertFalse(t.sources_required)

    def test_parses_body_sections(self):
        t = aios_task.parse_task(self.tmp.name)
        self.assertIn("Do the thing.", t.task_body)
        self.assertIn("3 sentences", t.acceptance_body)

    def test_set_status_rewrites_only_status(self):
        aios_task.set_status(self.tmp.name, "🔄running")
        t = aios_task.parse_task(self.tmp.name)
        self.assertEqual(t.status, "🔄running")
        self.assertEqual(t.title, "Fix stub bodies")  # untouched

    def test_set_status_rejects_unknown(self):
        with self.assertRaises(ValueError):
            aios_task.set_status(self.tmp.name, "bogus")


if __name__ == "__main__":
    unittest.main()
