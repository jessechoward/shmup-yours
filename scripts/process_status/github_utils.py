"""
GitHub API utilities for process status tracking.
"""
import json
import re
from .git_utils import run

def get_open_prs():
    """Get list of open PR numbers."""
    prs_json = run("gh pr list --state open --json number")
    if not prs_json:
        return []
    try:
        return [pr['number'] for pr in json.loads(prs_json)]
    except Exception:
        return []

def get_pr_data(pr_num):
    """Get comprehensive PR data."""
    pr_data_json = run(f"gh pr view {pr_num} --json number,title,isDraft,mergeable,headRefName,updatedAt,createdAt,state,assignees,body,additions,deletions")
    if not pr_data_json:
        return None
    try:
        return json.loads(pr_data_json)
    except Exception:
        return None

def get_issue_data(issue_num):
    """Get comprehensive issue data."""
    issue_data_json = run(f"gh issue view {issue_num} --json number,title,assignees,createdAt,state,body")
    if not issue_data_json:
        return None
    try:
        return json.loads(issue_data_json)
    except Exception:
        return None

def get_copilot_assigned_issues():
    """Get issues assigned to GitHub Copilot."""
    issues_json = run("gh issue list --state open --json number,assignees")
    if not issues_json:
        return []
    try:
        issues = json.loads(issues_json)
        copilot_issues = []
        for issue in issues:
            for assignee in issue.get('assignees', []):
                if assignee.get('login') == 'Copilot':
                    copilot_issues.append(issue['number'])
                    break
        return copilot_issues
    except Exception:
        return []

def find_related_pr(issue_num):
    """Find PR related to an issue by checking PR bodies for issue references."""
    prs_json = run("gh pr list --state open --json number,body")
    if not prs_json:
        return None
    try:
        prs = json.loads(prs_json)
        for pr in prs:
            body = pr.get('body', '')
            # Look for #issue_num references
            if re.search(rf'#\s*{issue_num}\b', body) or re.search(rf'Fixes\s+#{issue_num}\b', body, re.IGNORECASE):
                return pr['number']
        return None
    except Exception:
        return None

def get_pr_commits(pr_num):
    """Get commits for a PR."""
    commits_json = run(f"gh pr view {pr_num} --json commits")
    if not commits_json:
        return []
    try:
        data = json.loads(commits_json)
        return data.get('commits', [])
    except Exception:
        return []

def get_pr_changes(pr_num):
    """Get file changes for a PR."""
    changes_json = run(f"gh pr diff {pr_num} --name-only")
    if not changes_json:
        return []
    return changes_json.split('\n') if changes_json else []

def get_pr_detailed_changes(pr_num):
    """Get detailed change statistics for a PR."""
    # Get file-by-file changes
    changes_output = run(f"gh pr diff {pr_num} --stat", check=False)
    
    # Parse the output to extract file changes
    files_changed = []
    if changes_output:
        lines = changes_output.split('\n')
        for line in lines:
            if '|' in line and ('+' in line or '-' in line):
                parts = line.split('|')
                if len(parts) >= 2:
                    filename = parts[0].strip()
                    stats = parts[1].strip()
                    files_changed.append({
                        "file": filename,
                        "changes": stats
                    })
    
    return files_changed

def check_pr_readiness(pr_num):
    """Check if a PR is actually ready for review by analyzing commits and changes."""
    # Get the latest commits to see completion indicators
    commits = get_pr_commits(pr_num)
    latest_commits = commits[-3:] if len(commits) >= 3 else commits
    
    completion_indicators = [
        "Complete", "Ready for review", "Implementation complete", 
        "Final", "Done", "Finished", "All requirements met",
        "Feature complete", "Implementation done"
    ]
    
    planning_indicators = [
        "Initial plan", "WIP", "Work in progress", "Planning",
        "Analysis", "Setup", "Preparation", "Initial"
    ]
    
    # Check recent commit messages
    has_completion = False
    has_planning = False
    
    for commit in latest_commits:
        msg = commit.get('messageHeadline', '').lower()
        if any(indicator.lower() in msg for indicator in completion_indicators):
            has_completion = True
        if any(indicator.lower() in msg for indicator in planning_indicators):
            has_planning = True
    
    # Get file changes to assess implementation depth
    changes = get_pr_changes(pr_num)
    detailed_changes = get_pr_detailed_changes(pr_num)
    
    # Analyze change patterns
    has_real_implementation = False
    yarn_lock_only = False
    
    if len(changes) == 1 and 'yarn.lock' in changes[0]:
        yarn_lock_only = True
    elif len(changes) > 1:
        non_lock_files = [f for f in changes if 'yarn.lock' not in f and 'package-lock.json' not in f]
        if non_lock_files:
            has_real_implementation = True
    
    return {
        "has_completion_indicators": has_completion,
        "has_planning_indicators": has_planning,
        "yarn_lock_only": yarn_lock_only,
        "has_real_implementation": has_real_implementation,
        "file_count": len(changes),
        "latest_commit_messages": [c.get('messageHeadline', '') for c in latest_commits],
        "changed_files": changes,
        "detailed_changes": detailed_changes
    }

def get_pr_review_readiness_analysis(pr_num):
    """Comprehensive analysis of whether a PR is ready for review."""
    pr_data = get_pr_data(pr_num)
    if not pr_data:
        return {"error": "PR not found", "ready": False}
    
    readiness_check = check_pr_readiness(pr_num)
    
    # Decision logic
    is_draft = pr_data.get('isDraft', False)
    mergeable = pr_data.get('mergeable', 'UNKNOWN')
    additions = pr_data.get('additions', 0)
    deletions = pr_data.get('deletions', 0)
    
    # Readiness determination
    ready_for_review = False
    recommendation = "wait"
    confidence = "low"
    reasons = []
    
    if mergeable == "CONFLICTING":
        recommendation = "resolve_conflicts"
        reasons.append("Has merge conflicts")
    elif readiness_check["yarn_lock_only"]:
        recommendation = "wait"
        reasons.append("Only yarn.lock changes - likely setup phase")
    elif readiness_check["has_completion_indicators"] and not is_draft:
        ready_for_review = True
        recommendation = "review_ready"
        confidence = "high"
        reasons.append("Has completion indicators in commits")
    elif readiness_check["has_real_implementation"] and not is_draft:
        ready_for_review = True
        recommendation = "review_ready"
        confidence = "medium"
        reasons.append("Has substantial implementation")
    elif is_draft and readiness_check["has_completion_indicators"]:
        recommendation = "convert_to_ready"
        confidence = "high"
        reasons.append("Claims completion but still marked as draft")
    elif readiness_check["has_planning_indicators"]:
        recommendation = "wait"
        reasons.append("Still in planning/setup phase")
    else:
        recommendation = "investigate"
        reasons.append("Unclear status - needs manual review")
    
    return {
        "pr_number": pr_num,
        "ready_for_review": ready_for_review,
        "recommendation": recommendation,
        "confidence": confidence,
        "reasons": reasons,
        "is_draft": is_draft,
        "mergeable": mergeable,
        "stats": {
            "additions": additions,
            "deletions": deletions,
            "files_changed": readiness_check["file_count"]
        },
        "analysis": readiness_check
    }
