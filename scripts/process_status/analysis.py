"""
Progress analysis utilities for process status tracking.
"""
import datetime

def get_elapsed_minutes(created_at):
    """Calculate elapsed minutes from ISO timestamp."""
    try:
        created_dt = datetime.datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        now = datetime.datetime.now(datetime.timezone.utc)
        elapsed = (now - created_dt).total_seconds() / 60
        return int(elapsed)
    except Exception:
        return 0

def pr_status(commit_msg, is_draft, additions=0, deletions=0):
    """Determine PR status based on commit message, draft status, and changes."""
    # Check for substantial implementation (more than just yarn.lock changes)
    has_implementation = (additions + deletions) > 1000 and not (additions == 3510 and deletions == 5146)
    
    if any(x in commit_msg for x in ["Complete", "Ready for review", "Implementation complete"]) and not is_draft:
        return "ready_for_review"
    elif is_draft and not has_implementation:
        return "planning"
    elif is_draft and has_implementation:
        return "draft"
    elif any(x in commit_msg for x in ["Initial plan", "WIP"]):
        return "planning"
    elif has_implementation:
        return "in_progress"
    else:
        return "planning"

def action_needed(mergeable, status, elapsed):
    """Determine what action is needed for a PR."""
    if mergeable == "CONFLICTING":
        return "resolve_conflicts"
    elif status == "ready_for_review" and mergeable == "MERGEABLE":
        return "review_ready"
    elif status == "planning" and elapsed > 30:
        return "investigate"
    elif elapsed > 60:
        return "investigate"
    return "wait"

def priority_for_action(action):
    """Determine priority level for an action."""
    if action == "resolve_conflicts":
        return "high"
    elif action == "review_ready":
        return "medium"
    elif action == "investigate":
        return "medium"
    return "normal"

def analyze_copilot_progress(issue_num, pr_data, branch_progress):
    """Analyze progress of a GitHub Copilot assigned issue."""
    if not pr_data:
        return {
            "status": "no_pr",
            "action": "check_branch_activity",
            "priority": "medium",
            "message": "No PR found, check if agent is working on feature branch"
        }
    
    elapsed = get_elapsed_minutes(pr_data.get('createdAt', ''))
    additions = pr_data.get('additions', 0)
    deletions = pr_data.get('deletions', 0)
    latest_commit = branch_progress.get('latest_commit', '')
    
    # Detect yarn.lock-only PRs (common Copilot pattern)
    if additions == 3510 and deletions == 5146 and elapsed > 20:
        return {
            "status": "yarn_lock_only",
            "action": "investigate",
            "priority": "medium",
            "message": "PR contains only yarn.lock changes - may indicate setup phase or blocked work"
        }
    
    status = pr_status(latest_commit, pr_data.get('isDraft', False), additions, deletions)
    action = action_needed(pr_data.get('mergeable', 'UNKNOWN'), status, elapsed)
    priority = priority_for_action(action)
    
    return {
        "status": status,
        "action": action,
        "priority": priority,
        "elapsed_minutes": elapsed,
        "commit_count": branch_progress.get('commits', 0),
        "latest_commit": latest_commit
    }
