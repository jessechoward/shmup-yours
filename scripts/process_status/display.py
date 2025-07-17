"""
Display utilities for process status dashboard.
"""

# ANSI color codes
RED = '\033[31m'
GREEN = '\033[32m'
YELLOW = '\033[33m'
CYAN = '\033[36m'
BLUE = '\033[34m'
MAGENTA = '\033[35m'
RESET = '\033[0m'
BOLD = '\033[1m'
DIM = '\033[2m'

# Status icons
STATUS_ICONS = {
    "ready_for_review": "✅",
    "draft": "📝",
    "planning": "🧠",
    "in_progress": "🚧",
    "blocked": "⛔",
    "error": "❌",
    "no_pr": "🔍",
    "yarn_lock_only": "📦"
}

PRIORITY_ICONS = {
    "high": f"{RED}🔴{RESET}",
    "medium": f"{YELLOW}🟡{RESET}",
    "normal": f"{GREEN}🟢{RESET}",
    "low": f"{BLUE}🔵{RESET}"
}

ACTION_ICONS = {
    "resolve_conflicts": f"{RED}⚡{RESET}",
    "review_ready": f"{GREEN}👀{RESET}",
    "investigate": f"{YELLOW}🔍{RESET}",
    "wait": f"{CYAN}⏳{RESET}",
    "check_branch_activity": f"{BLUE}🌿{RESET}",
    "convert_to_ready": f"{GREEN}🚀{RESET}"
}

def color_status(status):
    """Apply color coding to status text."""
    if status == "ready_for_review":
        return f"{GREEN}{status}{RESET}"
    elif status in ["draft", "planning"]:
        return f"{YELLOW}{status}{RESET}"
    elif status == "in_progress":
        return f"{CYAN}{status}{RESET}"
    elif status == "blocked":
        return f"{RED}{status}{RESET}"
    elif status in ["error", "yarn_lock_only"]:
        return f"{RED}{status}{RESET}"
    elif status == "no_pr":
        return f"{BLUE}{status}{RESET}"
    return status

def color_action(action):
    """Apply color coding to action text."""
    if action == "resolve_conflicts":
        return f"{RED}{action}{RESET}"
    elif action in ["review_ready", "convert_to_ready"]:
        return f"{GREEN}{action}{RESET}"
    elif action == "investigate":
        return f"{YELLOW}{action}{RESET}"
    elif action in ["wait", "check_branch_activity"]:
        return f"{CYAN}{action}{RESET}"
    return action

def format_elapsed_time(minutes):
    """Format elapsed time in a human-readable way."""
    if minutes < 60:
        return f"{minutes}min"
    elif minutes < 1440:  # less than 24 hours
        hours = minutes // 60
        remaining_mins = minutes % 60
        return f"{hours}h{remaining_mins}m"
    else:
        days = minutes // 1440
        remaining_hours = (minutes % 1440) // 60
        return f"{days}d{remaining_hours}h"

def print_dashboard_header(data):
    """Print the dashboard header with summary information."""
    print(f"\n{BOLD}==== PROCESS DASHBOARD ===={RESET}")
    print(f"{CYAN}Timestamp:{RESET} {data['timestamp']}")
    
    if 'git_status' in data:
        git_status = data['git_status']
        print(f"{CYAN}Git Status:{RESET} {git_status.get('current_branch', 'unknown')} | Updated: {git_status.get('last_updated', 'unknown')}")
    
    summary = data.get('summary', {})
    print(f"{BOLD}Total PRs:{RESET} {summary.get('total_prs', 0)}")
    print(f"{RED}Blocked:{RESET} {summary.get('blocked_count', 0)} | "
          f"{GREEN}Ready:{RESET} {summary.get('ready_for_review_count', 0)} | "
          f"{YELLOW}Investigation:{RESET} {summary.get('needs_investigation_count', 0)} | "
          f"{CYAN}Normal:{RESET} {summary.get('normal_progress_count', 0)}")

def print_prs_table(prs):
    """Print the PRs in a formatted table with enhanced analysis."""
    if not prs:
        print(f"\n{DIM}No open PRs found.{RESET}")
        return
    
    print(f"\n{BOLD}Pull Requests:{RESET}")
    header = f"{'#':<5} {'Title':<35} {'Status':<18} {'Action':<20} {'Priority':<10} {'Elapsed':<10} {'Analysis':<15}"
    print(header)
    print('-' * len(header))
    
    for pr in prs:
        pr_num = pr.get('pr_number', '')
        title = pr.get('title', pr.get('error', ''))
        status = pr.get('pr_status', pr.get('error', 'error'))
        action = pr.get('action_needed', '')
        priority = pr.get('priority', '')
        elapsed = pr.get('elapsed_minutes', 0)
        
        # Enhanced analysis info
        readiness = pr.get('readiness_analysis')
        if readiness:
            confidence = readiness.get('confidence', 'unknown')
            files_changed = readiness.get('file_analysis', {}).get('files_changed', 0)
            has_implementation = readiness.get('file_analysis', {}).get('has_real_implementation', False)
            analysis_summary = f"{confidence}/{files_changed}f"
            if has_implementation:
                analysis_summary += "/impl"
        else:
            analysis_summary = "basic"
        
        status_icon = STATUS_ICONS.get(status, '')
        priority_icon = PRIORITY_ICONS.get(priority, '')
        action_icon = ACTION_ICONS.get(action, '')
        
        status_colored = color_status(status)
        action_colored = color_action(action)
        elapsed_formatted = format_elapsed_time(elapsed)
        
        print(f"{str(pr_num):<5} {title[:33]:<35} {status_icon} {status_colored:<15} "
              f"{action_icon} {action_colored:<17} {priority_icon} {priority:<7} "
              f"{elapsed_formatted:<10} {analysis_summary:<15}")

def print_detailed_pr_analysis(prs):
    """Print detailed analysis for PRs that need attention."""
    attention_prs = [pr for pr in prs if pr.get('priority') in ['high', 'medium'] and pr.get('readiness_analysis')]
    
    if not attention_prs:
        return
    
    print(f"\n{BOLD}Detailed PR Analysis:{RESET}")
    
    for pr in attention_prs:
        pr_num = pr.get('pr_number', '')
        title = pr.get('title', '')
        readiness = pr.get('readiness_analysis', {})
        
        print(f"\n{CYAN}PR #{pr_num}: {title[:50]}...{RESET}")
        
        # Recommendation
        recommendation = readiness.get('recommendation', 'unknown')
        confidence = readiness.get('confidence', 'unknown')
        print(f"  {BOLD}Recommendation:{RESET} {color_action(recommendation)} ({confidence} confidence)")
        
        # Reasons
        reasons = readiness.get('reasons', [])
        if reasons:
            print(f"  {BOLD}Reasons:{RESET}")
            for reason in reasons:
                print(f"    • {reason}")
        
        # File analysis
        file_analysis = readiness.get('file_analysis', {})
        files_changed = file_analysis.get('files_changed', 0)
        has_impl = file_analysis.get('has_real_implementation', False)
        yarn_only = file_analysis.get('yarn_lock_only', False)
        
        print(f"  {BOLD}Files:{RESET} {files_changed} changed")
        if yarn_only:
            print(f"    {YELLOW}⚠️  Only yarn.lock changes detected{RESET}")
        elif has_impl:
            print(f"    {GREEN}✅ Real implementation detected{RESET}")
        
        # Latest commits
        commit_analysis = readiness.get('commit_analysis', {})
        latest_messages = commit_analysis.get('latest_messages', [])
        if latest_messages:
            print(f"  {BOLD}Recent commits:{RESET}")
            for msg in latest_messages[-2:]:  # Show last 2 commits
                print(f"    • {msg[:60]}...")
        
        # Action needed
        if recommendation == "convert_to_ready":
            print(f"  {GREEN}💡 Suggested command:{RESET} gh pr ready {pr_num}")
        elif recommendation == "review_ready":
            print(f"  {GREEN}👀 Ready for review!{RESET}")
        elif recommendation == "resolve_conflicts":
            print(f"  {RED}⚡ Conflicts need resolution{RESET}")

def print_copilot_issues(issues):
    """Print GitHub Copilot assigned issues."""
    if not issues:
        return
    
    print(f"\n{BOLD}GitHub Copilot Issues:{RESET}")
    header = f"{'#':<5} {'Title':<40} {'Status':<20} {'Progress':<15} {'Action':<20}"
    print(header)
    print('-' * len(header))
    
    for issue in issues:
        issue_num = issue.get('issue_number', '')
        title = issue.get('title', '')
        status = issue.get('status', 'unknown')
        progress = issue.get('progress', {})
        action = issue.get('action', '')
        
        status_icon = STATUS_ICONS.get(status, '')
        action_icon = ACTION_ICONS.get(action, '')
        
        status_colored = color_status(status)
        action_colored = color_action(action)
        
        commits = progress.get('commit_count', 0)
        elapsed = progress.get('elapsed_minutes', 0)
        progress_str = f"{commits}c/{format_elapsed_time(elapsed)}"
        
        print(f"{str(issue_num):<5} {title[:38]:<40} {status_icon} {status_colored:<17} "
              f"{progress_str:<15} {action_icon} {action_colored:<17}")

def print_recommended_actions(actions):
    """Print recommended actions with priorities."""
    if not actions:
        return
    
    print(f"\n{BOLD}Recommended Actions:{RESET}")
    for rec in actions:
        action = rec.get('action', '')
        priority = rec.get('priority', '')
        count = rec.get('count', '')
        next_check = rec.get('next_check_minutes', None)
        message = rec.get('message', '')
        
        priority_icon = PRIORITY_ICONS.get(priority, '')
        action_icon = ACTION_ICONS.get(action, '')
        
        if next_check:
            print(f"- {priority_icon} [{priority}] {action_icon} {action} (Next check in {next_check} min)")
        elif count != '':
            print(f"- {priority_icon} [{priority}] {action_icon} {action} ({count} items)")
        else:
            print(f"- {priority_icon} [{priority}] {action_icon} {action}")
        
        if message:
            print(f"  {DIM}{message}{RESET}")

def print_dashboard_footer():
    """Print the dashboard footer."""
    print(f"{BOLD}==========================={RESET}\n")
