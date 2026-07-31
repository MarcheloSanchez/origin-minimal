"""Append-only run logs, review-package writer, and verdict parser."""
import os
import re


def _task_dir(logs_dir, task_id):
    d = os.path.join(logs_dir, task_id)
    os.makedirs(d, exist_ok=True)
    return d


def append_log(logs_dir, task_id, line):
    path = os.path.join(_task_dir(logs_dir, task_id), "run.log")
    with open(path, "a", encoding="utf-8") as f:
        f.write(line.rstrip("\n") + "\n")


def write_review_package(logs_dir, task_id, summary, changes, verification, cost):
    d = _task_dir(logs_dir, task_id)
    for name, content in (
        ("summary.md", summary),
        ("changes.md", changes),
        ("verification.md", verification),
        ("cost.md", cost),
    ):
        with open(os.path.join(d, name), "w", encoding="utf-8") as f:
            f.write(content)
    return d


def parse_verdict(logs_dir, task_id):
    """Read summary.md and classify the validator verdict.

    Returns:
      'pass_clean'   — VERDICT: PASS with no open FLAG: lines → safe to auto-accept
      'pass_flagged' — VERDICT: PASS but at least one open FLAG: line → needs human eye
      'needs_review' — no clear PASS verdict, or summary missing → human gate required
    """
    path = os.path.join(logs_dir, task_id, "summary.md")
    if not os.path.exists(path):
        return "needs_review"
    text = open(path, encoding="utf-8").read()
    has_pass = bool(re.search(r"VERDICT\s*:\s*PASS", text, re.IGNORECASE))
    # FLAG: on its own (open flag). FLAG -> or FLAG resolved = already handled, skip.
    has_open_flag = bool(re.search(r"(?m)^FLAG\s*:", text))
    if has_pass and not has_open_flag:
        return "pass_clean"
    if has_pass and has_open_flag:
        return "pass_flagged"
    return "needs_review"
