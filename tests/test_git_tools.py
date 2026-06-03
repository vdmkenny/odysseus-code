"""Tests for the git + forge tools."""
import os
import asyncio
import subprocess
import pytest

os.environ.setdefault("DATABASE_URL", "sqlite:////tmp/test_git_tools.db")

from src.tool_execution import _direct_fallback


def _run(tool, content, workspace=None):
    return asyncio.run(_direct_fallback(tool, content, workspace=workspace))


@pytest.fixture
def repo(tmp_path):
    d = str(tmp_path)
    subprocess.run(["git", "-C", d, "init", "-q"], check=True)
    (tmp_path / "a.txt").write_text("hello\n")
    return d


# ── git: gating ─────────────────────────────────────────────────────────────

def test_git_requires_workspace():
    r = _run("git", "status", workspace=None)
    assert r["exit_code"] == 1 and "workspace" in r["error"]


def test_git_blocked_subcommand(repo):
    for bad in ("config user.email x@y.z", "clone https://x/y", "daemon"):
        r = _run("git", bad, workspace=repo)
        assert r["exit_code"] == 1 and "not allowed" in r["error"], bad


def test_git_unknown_subcommand(repo):
    r = _run("git", "frobnicate", workspace=repo)
    assert r["exit_code"] == 1 and "not allowed" in r["error"]


def test_git_strips_leading_git(repo):
    r = _run("git", "git status", workspace=repo)  # model included "git "
    assert r["exit_code"] == 0
    assert "a.txt" in r["output"]  # untracked file shows in status


# ── git: read + write ────────────────────────────────────────────────────────

def test_git_status(repo):
    r = _run("git", "status --porcelain", workspace=repo)
    assert r["exit_code"] == 0
    assert "a.txt" in r["output"]


def test_git_add_commit_with_injected_identity(repo):
    # No user.name/email configured in this repo — commit must still work.
    assert _run("git", "add -A", workspace=repo)["exit_code"] == 0
    c = _run("git", 'commit -m "init"', workspace=repo)
    assert c["exit_code"] == 0
    log = _run("git", "log --oneline", workspace=repo)
    assert "init" in log["output"]
    # Identity came from the injected -c flags.
    who = subprocess.run(["git", "-C", repo, "log", "-1", "--format=%an <%ae>"],
                         capture_output=True, text=True)
    assert "Odysseus Agent" in who.stdout and "agent@odysseus.local" in who.stdout


def test_git_branch_create(repo):
    _run("git", "add -A", workspace=repo)
    _run("git", 'commit -m "init"', workspace=repo)
    assert _run("git", "checkout -b feature", workspace=repo)["exit_code"] == 0
    assert "feature" in _run("git", "branch", workspace=repo)["output"]


# ── forge: gating (no network) ───────────────────────────────────────────────

def test_forge_requires_workspace():
    r = _run("forge", "pr list", workspace=None)
    assert r["exit_code"] == 1 and "workspace" in r["error"]


def test_forge_blocked_subcommand(repo):
    # 'auth' is not in the allowlist → rejected before any CLI runs.
    r = _run("forge", "auth status", workspace=repo)
    assert r["exit_code"] == 1 and "not allowed" in r["error"]
