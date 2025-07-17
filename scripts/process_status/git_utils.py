"""
Git utilities for process status tracking.
"""
import subprocess
import sys

def run(cmd, check=True):
    """Run a shell command and return stdout or None on error."""
    try:
        result = subprocess.run(cmd, shell=True, check=check, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return None

def update_git_state():
    """Update git state with fetch --all and pull."""
    print("🔄 Updating git state...", file=sys.stderr)
    
    # Fetch all remotes and branches
    fetch_result = run("git fetch --all", check=False)
    if fetch_result is None:
        print("⚠️  Warning: git fetch --all failed", file=sys.stderr)
    
    # Pull current branch if possible
    current_branch = run("git branch --show-current", check=False)
    if current_branch:
        pull_result = run(f"git pull origin {current_branch}", check=False)
        if pull_result is None:
            print(f"⚠️  Warning: git pull origin {current_branch} failed (may be on remote-only branch)", file=sys.stderr)
    
    print("✅ Git state updated", file=sys.stderr)

def get_branch_progress(branch_name):
    """Get progress info for a feature branch."""
    if not branch_name:
        return {"commits": 0, "latest_commit": "", "last_activity": ""}
    
    # Ensure we have the latest branch info
    run(f"git fetch origin {branch_name}", check=False)
    
    # Get commit count
    commit_count = run(f"git rev-list --count origin/{branch_name} 2>/dev/null", check=False)
    if commit_count:
        try:
            commit_count = int(commit_count)
        except ValueError:
            commit_count = 0
    else:
        commit_count = 0
    
    # Get latest commit message
    latest_commit = run(f"git log origin/{branch_name} --oneline -1 2>/dev/null", check=False)
    if latest_commit:
        # Extract just the commit message (remove hash)
        parts = latest_commit.split(' ', 1)
        latest_commit = parts[1] if len(parts) > 1 else latest_commit
    else:
        latest_commit = ""
    
    # Get last activity time
    last_activity = run(f"git log origin/{branch_name} --format=%ai -1 2>/dev/null", check=False)
    
    return {
        "commits": commit_count,
        "latest_commit": latest_commit,
        "last_activity": last_activity
    }
