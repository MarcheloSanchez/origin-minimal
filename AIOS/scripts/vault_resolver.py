"""Shared vault-root resolution for AIOS scripts.

No vault name or absolute path is ever hardcoded. Resolution order:
    1. ORIGIN_VAULT environment variable
    2. Walk up from a starting point looking for a ".obsidian" folder
       (the marker every Obsidian vault has at its root, regardless of name)

Works whether or not the vault is a git repository.
"""

import os
from pathlib import Path


def resolve_vault_root(start=None, env_var="ORIGIN_VAULT"):
    """Resolve the vault root. Raises RuntimeError if nothing resolves."""
    env = os.environ.get(env_var)
    if env:
        return Path(env).resolve()

    current = Path(start or Path.cwd()).resolve()
    for _ in range(50):
        if (current / ".obsidian").is_dir():
            return current
        if current.parent == current:
            break
        current = current.parent

    raise RuntimeError(
        f"Could not resolve vault root: no .obsidian marker found walking up "
        f"from {start or Path.cwd()}. Set {env_var} or run from inside a vault."
    )
