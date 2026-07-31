import os
import tempfile
import unittest

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import aios_log


class TestLog(unittest.TestCase):
    def setUp(self):
        self.logs = tempfile.mkdtemp()

    def test_append_log_is_append_only(self):
        aios_log.append_log(self.logs, "t1", "first")
        aios_log.append_log(self.logs, "t1", "second")
        with open(os.path.join(self.logs, "t1", "run.log"), encoding="utf-8") as f:
            content = f.read()
        self.assertIn("first", content)
        self.assertIn("second", content)
        self.assertLess(content.index("first"), content.index("second"))

    def test_review_package_writes_four_files(self):
        d = aios_log.write_review_package(
            self.logs, "t1", "s", "c", "v", "cost"
        )
        for name in ("summary.md", "changes.md", "verification.md", "cost.md"):
            self.assertTrue(os.path.exists(os.path.join(d, name)), name)

    def _write_summary(self, task_id, content):
        d = os.path.join(self.logs, task_id)
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, "summary.md"), "w", encoding="utf-8") as f:
            f.write(content)

    def test_parse_verdict_pass_clean(self):
        self._write_summary("t2", "VERDICT: PASS (all criteria met).\nNo issues.")
        self.assertEqual(aios_log.parse_verdict(self.logs, "t2"), "pass_clean")

    def test_parse_verdict_pass_flagged(self):
        self._write_summary("t3", "VERDICT: PASS.\nFLAG: subfolder not yet created.")
        self.assertEqual(aios_log.parse_verdict(self.logs, "t3"), "pass_flagged")

    def test_parse_verdict_resolved_flag_is_clean(self):
        # "FLAG -> resolved" should NOT count as an open flag
        self._write_summary("t4", "VERDICT: PASS.\nFLAG -> resolved. Single defect fixed.")
        self.assertEqual(aios_log.parse_verdict(self.logs, "t4"), "pass_clean")

    def test_parse_verdict_needs_review_no_pass(self):
        self._write_summary("t5", "VERDICT: FAIL. Multiple criteria not met.")
        self.assertEqual(aios_log.parse_verdict(self.logs, "t5"), "needs_review")

    def test_parse_verdict_missing_summary(self):
        self.assertEqual(aios_log.parse_verdict(self.logs, "nonexistent"), "needs_review")


if __name__ == "__main__":
    unittest.main()
