"""Accept (stage -> canon) and reject (discard) for AIOS orchestration."""
import os
import shutil

import aios_task


def accept(task, proposed_path, vault_root):
    """Move a single proposed file to canon and mark task accepted.

    write_target may name either a destination *folder* (the proposed filename is
    preserved) or a full destination *file* path (ends in an extension — used
    verbatim). Guarding the file case prevents the silent-corruption bug where a
    file-shaped target made os.makedirs create a *directory* named like the file.
    """
    if task.write_target == "auto" or not task.write_target:
        raise ValueError("write_target must be resolved to a canon folder before accept")
    if os.path.splitext(task.write_target)[1]:  # target names a file, not a folder
        dest = os.path.join(vault_root, task.write_target)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
    else:
        dest_dir = os.path.join(vault_root, task.write_target)
        os.makedirs(dest_dir, exist_ok=True)
        dest = os.path.join(dest_dir, os.path.basename(proposed_path))
    shutil.move(proposed_path, dest)
    aios_task.set_status(task.path, "✅accepted")
    os.remove(task.path)
    return dest


def accept_dir(task, proposed_dir, vault_root):
    """Move every file in proposed_dir to canon and mark task accepted.

    Used for batch outputs (e.g. 26 +About notes in a single subfolder).
    Directories inside proposed_dir are ignored — only top-level files move.
    """
    if task.write_target == "auto" or not task.write_target:
        raise ValueError("write_target must be resolved to a canon folder before accept")
    dest_dir = os.path.join(vault_root, task.write_target)
    os.makedirs(dest_dir, exist_ok=True)
    moved = []
    for fname in sorted(os.listdir(proposed_dir)):
        src = os.path.join(proposed_dir, fname)
        if os.path.isfile(src):
            dest = os.path.join(dest_dir, fname)
            shutil.move(src, dest)
            moved.append(dest)
    aios_task.set_status(task.path, "✅accepted")
    os.remove(task.path)
    return moved


def reject(task, proposed_path, reason):
    if os.path.exists(proposed_path):
        os.remove(proposed_path)
    aios_task.set_status(task.path, "❌rejected")
