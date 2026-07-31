import os
import tempfile
import unittest

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import aios_task
import aios_review


def _make_task(qdir, write_target):
    path = os.path.join(qdir, "t1.md")
    with open(path, "w", encoding="utf-8") as f:
        f.write(
            "---\ntype: aios-task\nid: t1\nstatus: 👁️review\ntitle: \"t\"\n"
            "goal: \"g\"\nworker: auto\nwrite_target: %s\ncost_cap: 100\n"
            "sources_required: false\ncreated: 2026-06-18\n---\n## Task\nx\n## Acceptance\ny\n"
            % write_target
        )
    return aios_task.parse_task(path)


class TestReview(unittest.TestCase):
    def setUp(self):
        self.root = tempfile.mkdtemp()
        self.qdir = tempfile.mkdtemp()
        self.proposed = os.path.join(tempfile.mkdtemp(), "Note.md")
        with open(self.proposed, "w", encoding="utf-8") as f:
            f.write("staged content")

    def test_accept_moves_to_canon_and_marks_accepted(self):
        os.makedirs(os.path.join(self.root, "02-Knowledge"), exist_ok=True)
        t = _make_task(self.qdir, "02-Knowledge")
        dest = aios_review.accept(t, self.proposed, self.root)
        self.assertTrue(os.path.exists(dest))
        self.assertFalse(os.path.exists(self.proposed))
        self.assertFalse(os.path.exists(t.path))

    def test_accept_file_target_writes_that_exact_file(self):
        # write_target naming a file (ends in an extension) must produce that file,
        # NOT a directory named like the file with the proposed name nested inside.
        t = _make_task(self.qdir, "AIOS/runtime/skills/origin-ux-review/SKILL.md")
        dest = aios_review.accept(t, self.proposed, self.root)
        expected = os.path.join(self.root, "AIOS", "runtime", "skills", "origin-ux-review", "SKILL.md")
        self.assertEqual(os.path.normpath(dest), os.path.normpath(expected))
        self.assertTrue(os.path.isfile(dest))          # a file, not a dir
        self.assertFalse(os.path.isdir(dest))
        self.assertFalse(os.path.exists(self.proposed))
        self.assertFalse(os.path.exists(t.path))

    def test_accept_auto_target_raises(self):
        t = _make_task(self.qdir, "auto")
        with self.assertRaises(ValueError):
            aios_review.accept(t, self.proposed, self.root)

    def test_reject_discards_and_marks_rejected(self):
        t = _make_task(self.qdir, "02-Knowledge")
        aios_review.reject(t, self.proposed, "not good enough")
        self.assertFalse(os.path.exists(self.proposed))
        self.assertEqual(aios_task.parse_task(t.path).status, "❌rejected")

    def test_accept_dir_moves_all_files_and_marks_accepted(self):
        proposed_dir = tempfile.mkdtemp()
        # create 3 files in the proposed dir
        for name in ("a.md", "b.md", "c.md"):
            with open(os.path.join(proposed_dir, name), "w", encoding="utf-8") as f:
                f.write("content")
        os.makedirs(os.path.join(self.root, "02-Knowledge"), exist_ok=True)
        t = _make_task(self.qdir, "02-Knowledge")
        moved = aios_review.accept_dir(t, proposed_dir, self.root)
        self.assertEqual(len(moved), 3)
        for dest in moved:
            self.assertTrue(os.path.exists(dest))
        # proposed dir is now empty of files
        remaining = [f for f in os.listdir(proposed_dir) if os.path.isfile(os.path.join(proposed_dir, f))]
        self.assertEqual(remaining, [])
        self.assertFalse(os.path.exists(t.path))

    def test_accept_dir_auto_target_raises(self):
        proposed_dir = tempfile.mkdtemp()
        t = _make_task(self.qdir, "auto")
        with self.assertRaises(ValueError):
            aios_review.accept_dir(t, proposed_dir, self.root)


if __name__ == "__main__":
    unittest.main()
