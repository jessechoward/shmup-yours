"""
Core data collection and analysis for process status tracking.
"""
import datetime
import concurrent.futures
import threading
import sys
from .github_utils import (
    get_open_prs, get_pr_data, get_copilot_assigned_issues, 
    find_related_pr, get_issue_data, get_pr_changes, get_pr_commits,
    get_pr_review_readiness_analysis
)
from .git_utils import get_branch_progress, run
from .analysis import get_elapsed_minutes, pr_status, action_needed, priority_for_action, analyze_copilot_progress

def collect_git_status():
    """Collect current git repository status."""
    current_branch = run("git branch --show-current", check=False)
    last_commit = run("git log -1 --format='%h %s'", check=False)
    
    return {
        "current_branch": current_branch or "unknown",
        "last_commit": last_commit or "unknown",
        "last_updated": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

def collect_pr_data():
    """Collect and analyze all open PR data with parallel execution."""
    pr_numbers = get_open_prs()
    if not pr_numbers:
        return []
    
    prs = []
    
    # Use ThreadPoolExecutor for parallel data collection
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        # Submit all PR data collection tasks
        future_to_pr = {
            executor.submit(get_pr_data, pr_num): pr_num 
            for pr_num in pr_numbers
        }
        
        # Submit readiness analysis tasks
        readiness_futures = {
            executor.submit(get_pr_review_readiness_analysis, pr_num): pr_num
            for pr_num in pr_numbers
        }
        
        # Collect results
        pr_data_results = {}
        readiness_results = {}
        
        # Get PR data
        for future in concurrent.futures.as_completed(future_to_pr):
            pr_num = future_to_pr[future]
            try:
                pr_data_results[pr_num] = future.result()
            except Exception as e:
                print(f"Error collecting data for PR {pr_num}: {e}", file=sys.stderr)
                pr_data_results[pr_num] = None
        
        # Get readiness analysis
        for future in concurrent.futures.as_completed(readiness_futures):
            pr_num = readiness_futures[future]
            try:
                readiness_results[pr_num] = future.result()
            except Exception as e:
                print(f"Error analyzing readiness for PR {pr_num}: {e}", file=sys.stderr)
                readiness_results[pr_num] = None
    
    # Process results
    for pr_num in pr_numbers:
        pr_data = pr_data_results.get(pr_num)
        readiness_analysis = readiness_results.get(pr_num)
        
        if pr_data:
            title = pr_data.get("title", "")
            is_draft = pr_data.get("isDraft", False)
            mergeable = pr_data.get("mergeable", "UNKNOWN")
            created_at = pr_data.get("createdAt", None)
            branch = pr_data.get("headRefName", "")
            additions = pr_data.get("additions", 0)
            deletions = pr_data.get("deletions", 0)
            
            elapsed = get_elapsed_minutes(created_at) if created_at else 0
            branch_progress = get_branch_progress(branch)
            commit_msg = branch_progress.get("latest_commit", "")
            
            # Use readiness analysis if available, otherwise fall back to basic analysis
            if readiness_analysis and not readiness_analysis.get("error"):
                status = "ready_for_review" if readiness_analysis["ready_for_review"] else "draft" if is_draft else "in_progress"
                action = readiness_analysis["recommendation"]
                priority = "high" if action in ["resolve_conflicts", "convert_to_ready"] else "medium" if action == "review_ready" else "normal"
                
                # Enhanced PR data with readiness analysis
                pr_entry = {
                    "pr_number": pr_num,
                    "title": title,
                    "is_draft": is_draft,
                    "mergeable": mergeable,
                    "branch": branch,
                    "elapsed_minutes": elapsed,
                    "latest_commit_msg": commit_msg,
                    "pr_status": status,
                    "action_needed": action,
                    "priority": priority,
                    "additions": additions,
                    "deletions": deletions,
                    "commit_count": len(get_pr_commits(pr_num)),
                    "branch_progress": branch_progress,
                    "readiness_analysis": {
                        "ready": readiness_analysis["ready_for_review"],
                        "confidence": readiness_analysis["confidence"],
                        "reasons": readiness_analysis["reasons"],
                        "recommendation": readiness_analysis["recommendation"],
                        "file_analysis": {
                            "files_changed": readiness_analysis["stats"]["files_changed"],
                            "has_real_implementation": readiness_analysis["analysis"]["has_real_implementation"],
                            "yarn_lock_only": readiness_analysis["analysis"]["yarn_lock_only"]
                        },
                        "commit_analysis": {
                            "has_completion_indicators": readiness_analysis["analysis"]["has_completion_indicators"],
                            "latest_messages": readiness_analysis["analysis"]["latest_commit_messages"]
                        }
                    }
                }
            else:
                # Fallback to basic analysis
                status = pr_status(commit_msg, is_draft, additions, deletions)
                action = action_needed(mergeable, status, elapsed)
                priority = priority_for_action(action)
                
                pr_entry = {
                    "pr_number": pr_num,
                    "title": title,
                    "is_draft": is_draft,
                    "mergeable": mergeable,
                    "branch": branch,
                    "elapsed_minutes": elapsed,
                    "latest_commit_msg": commit_msg,
                    "pr_status": status,
                    "action_needed": action,
                    "priority": priority,
                    "additions": additions,
                    "deletions": deletions,
                    "commit_count": len(get_pr_commits(pr_num)),
                    "branch_progress": branch_progress,
                    "readiness_analysis": None
                }
            
            prs.append(pr_entry)
        else:
            prs.append({
                "pr_number": pr_num,
                "error": "PR not found",
                "action_needed": "investigate",
                "priority": "high"
            })
    
    return prs

def collect_copilot_issues():
    """Collect and analyze GitHub Copilot assigned issues."""
    issues = []
    copilot_issue_nums = get_copilot_assigned_issues()
    
    for issue_num in copilot_issue_nums:
        issue_data = get_issue_data(issue_num)
        if not issue_data:
            continue
        
        title = issue_data.get("title", "")
        created_at = issue_data.get("createdAt", None)
        
        # Find related PR
        related_pr_num = find_related_pr(issue_num)
        pr_data = get_pr_data(related_pr_num) if related_pr_num else None
        
        # Get branch progress if PR exists
        branch = pr_data.get("headRefName", "") if pr_data else ""
        branch_progress = get_branch_progress(branch) if branch else {}
        
        # Analyze progress
        progress_analysis = analyze_copilot_progress(issue_num, pr_data, branch_progress)
        
        issues.append({
            "issue_number": issue_num,
            "title": title,
            "related_pr": related_pr_num,
            "status": progress_analysis.get("status"),
            "action": progress_analysis.get("action"),
            "priority": progress_analysis.get("priority"),
            "progress": {
                "elapsed_minutes": progress_analysis.get("elapsed_minutes", 0),
                "commit_count": progress_analysis.get("commit_count", 0),
                "latest_commit": progress_analysis.get("latest_commit", "")
            },
            "message": progress_analysis.get("message", "")
        })
    
    return issues

def generate_summary(prs, issues):
    """Generate summary statistics."""
    # PR summary
    blocked_count = sum(1 for pr in prs if pr.get("mergeable") == "CONFLICTING")
    ready_count = sum(1 for pr in prs if pr.get("pr_status") == "ready_for_review" and pr.get("mergeable") == "MERGEABLE")
    investigate_count = sum(1 for pr in prs if pr.get("elapsed_minutes", 0) > 45)
    normal_count = len(prs) - blocked_count - ready_count - investigate_count
    
    # Issue summary
    copilot_active = len([i for i in issues if i.get("status") in ["in_progress", "draft"]])
    copilot_blocked = len([i for i in issues if i.get("action") == "investigate"])
    
    return {
        "blocked_count": blocked_count,
        "ready_for_review_count": ready_count,
        "needs_investigation_count": investigate_count,
        "normal_progress_count": normal_count,
        "total_prs": len(prs),
        "copilot_active_issues": copilot_active,
        "copilot_blocked_issues": copilot_blocked,
        "total_copilot_issues": len(issues)
    }

def generate_recommendations(prs, issues, summary):
    """Generate recommended actions based on current state."""
    recommended = []
    
    # High priority actions
    if summary["blocked_count"] > 0:
        recommended.append({
            "priority": "high", 
            "action": "resolve_merge_conflicts", 
            "count": summary["blocked_count"],
            "message": "Merge conflicts are blocking progress"
        })
    
    if summary["copilot_blocked_issues"] > 0:
        recommended.append({
            "priority": "high",
            "action": "investigate",
            "count": summary["copilot_blocked_issues"],
            "message": "GitHub Copilot issues need attention"
        })
    
    # Medium priority actions
    if summary["ready_for_review_count"] > 0:
        recommended.append({
            "priority": "medium", 
            "action": "review_ready", 
            "count": summary["ready_for_review_count"],
            "message": "PRs are ready for review"
        })
    
    if summary["needs_investigation_count"] > 0:
        recommended.append({
            "priority": "medium", 
            "action": "investigate", 
            "count": summary["needs_investigation_count"],
            "message": "Long-running PRs may need attention"
        })
    
    # Normal monitoring
    if summary["total_prs"] > 0 or summary["total_copilot_issues"] > 0:
        recommended.append({
            "priority": "low", 
            "action": "monitor_progress", 
            "next_check_minutes": 20,
            "message": "Continue monitoring active work"
        })
    
    return recommended

def collect_all_data():
    """Collect all process status data."""
    # Core data collection
    git_status = collect_git_status()
    prs = collect_pr_data()
    issues = collect_copilot_issues()
    
    # Analysis
    summary = generate_summary(prs, issues)
    recommendations = generate_recommendations(prs, issues, summary)
    
    return {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "dashboard_type": "process_management",
        "git_status": git_status,
        "prs": prs,
        "copilot_issues": issues,
        "summary": summary,
        "recommended_actions": recommendations
    }
