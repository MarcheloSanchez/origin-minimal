"""Task-note model for AIOS orchestration. Stdlib only — minimal frontmatter
parser for our controlled, flat task-note format (no nested YAML)."""
from dataclasses import dataclass

STATUSES = ["📥queued", "🔄running", "👁️review", "✅accepted", "❌rejected", "⚠️failed"]


@dataclass
class Task:
    id: str
    status: str
    title: str
    goal: str
    worker: str
    write_target: str
    cost_cap: int
    sources_required: bool
    created: str
    fix_class: str
    task_body: str
    acceptance_body: str
    path: str


def _split_frontmatter(text):
    """Return (dict_of_fields, body_text). Assumes leading --- fence."""
    if not text.startswith("---"):
        raise ValueError("missing frontmatter fence")
    end = text.index("\n---", 3)
    fm_block = text[3:end].strip("\n")
    body = text[end + 4:]
    fields = {}
    for line in fm_block.splitlines():
        if not line.strip() or ":" not in line:
            continue
        key, _, val = line.partition(":")
        fields[key.strip()] = val.strip().strip('"')
    return fields, body


def _section(body, heading):
    """Extract text under a `## heading` until the next `## `."""
    marker = "## " + heading
    if marker not in body:
        return ""
    start = body.index(marker) + len(marker)
    rest = body[start:]
    nxt = rest.find("\n## ")
    return (rest if nxt == -1 else rest[:nxt]).strip()


def parse_task(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    fields, body = _split_frontmatter(text)
    return Task(
        id=fields.get("id", ""),
        status=fields.get("status", ""),
        title=fields.get("title", ""),
        goal=fields.get("goal", ""),
        worker=fields.get("worker", "auto"),
        write_target=fields.get("write_target", "auto"),
        cost_cap=int(fields.get("cost_cap", "0") or "0"),
        sources_required=fields.get("sources_required", "false").lower() == "true",
        created=fields.get("created", ""),
        fix_class=fields.get("fix_class", ""),
        task_body=_section(body, "Task"),
        acceptance_body=_section(body, "Acceptance"),
        path=path,
    )


def set_status(path, status):
    if status not in STATUSES:
        raise ValueError("unknown status: %s" % status)
    with open(path, encoding="utf-8") as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        if line.startswith("status:"):
            lines[i] = "status: %s\n" % status
            break
    with open(path, "w", encoding="utf-8") as f:
        f.writelines(lines)
