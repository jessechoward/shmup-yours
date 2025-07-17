#!/usr/bin/env python3
"""
Process Status JSON Output (Python version)
Structured data for programmatic analysis and dashboard reporting.
No external dependencies required.
"""
import subprocess
import json
import datetime
import sys
import os

def run(cmd):
    try:
        result = subprocess.run(cmd, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError:
        return None

def get_open_prs():
    prs_json = run("gh pr list --state open --json number")
    if not prs_json:
        return []
    try:
        return [pr['number'] for pr in json.loads(prs_json)]
    except Exception:
        return []

def get_pr_data(pr_num):
    pr_data_json = run(f"gh pr view {pr_num} --json number,title,isDraft,mergeable,headRefName,updatedAt,createdAt")
    if not pr_data_json:
        return None
    try:
        return json.loads(pr_data_json)
    except Exception:
        return None

def get_latest_commit(branch):
    run(f"git fetch origin {branch}")
    commit_line = run(f"git log origin/{branch} --oneline -1")
    if not commit_line:
        return ""
    parts = commit_line.split(' ', 1)
    return parts[1] if len(parts) > 1 else ""

def get_elapsed_minutes(created_at):
    try:
        created_dt = datetime.datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        now = datetime.datetime.now(datetime.timezone.utc)
        elapsed = (now - created_dt).total_seconds() / 60
        return int(elapsed)
    except Exception:
        return 0

def pr_status(commit_msg, is_draft):
    if any(x in commit_msg for x in ["Complete", "Ready for review", "Implementation complete"]) and not is_draft:
        return "ready_for_review"
    elif is_draft:
        return "draft"
    elif any(x in commit_msg for x in ["Initial plan", "WIP"]):
        return "planning"
    return "in_progress"

def action_needed(mergeable, status, elapsed):
    if mergeable == "CONFLICTING":
        return "resolve_conflicts"
    elif status == "ready_for_review" and mergeable == "MERGEABLE":
        return "review_ready"
    elif elapsed > 45:
        return "investigate"
    return "wait"

def priority_for_action(action):
    if action == "resolve_conflicts":
        return "high"
    elif action == "review_ready":
        return "medium"
    return "normal"

def main():

    # Parse args for dashboard flag
    dashboard_mode = False
    for arg in sys.argv[1:]:
        if arg in ("--dashboard", "-d"):
            dashboard_mode = True

    output = {}
    output["timestamp"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    output["dashboard_type"] = "process_management"
    prs = []
    pr_numbers = get_open_prs()
    for pr_num in pr_numbers:
        pr_data = get_pr_data(pr_num)
        if pr_data:
            title = pr_data.get("title", "")
            is_draft = pr_data.get("isDraft", False)
            mergeable = pr_data.get("mergeable", "UNKNOWN")
            created_at = pr_data.get("createdAt", None)
            branch = pr_data.get("headRefName", "")
            elapsed = get_elapsed_minutes(created_at) if created_at else 0
            commit_msg = get_latest_commit(branch)
            status = pr_status(commit_msg, is_draft)
            action = action_needed(mergeable, status, elapsed)
            priority = priority_for_action(action)
            prs.append({
                "pr_number": pr_num,
                "title": title,
                "is_draft": is_draft,
                "mergeable": mergeable,
                "branch": branch,
                "elapsed_minutes": elapsed,
                "latest_commit_msg": commit_msg,
                "pr_status": status,
                "action_needed": action,
                "priority": priority
            })
        else:
            prs.append({
                "pr_number": pr_num,
                "error": "PR not found",
                "action_needed": "investigate",
                "priority": "high"
            })
    output["prs"] = prs
    # Summary counts
    blocked_count = sum(1 for pr in prs if pr.get("mergeable") == "CONFLICTING")
    ready_count = sum(1 for pr in prs if pr.get("pr_status") == "ready_for_review" and pr.get("mergeable") == "MERGEABLE")
    investigate_count = sum(1 for pr in prs if pr.get("elapsed_minutes", 0) > 45)
    normal_count = len(prs) - blocked_count - ready_count - investigate_count
    output["summary"] = {
        "blocked_count": blocked_count,
        "ready_for_review_count": ready_count,
        "needs_investigation_count": investigate_count,
        "normal_progress_count": normal_count,
        "total_prs": len(prs)
    }
    # Recommended actions
    recommended = []
    if blocked_count > 0:
        recommended.append({"priority": "high", "action": "resolve_merge_conflicts", "count": blocked_count})
    if ready_count > 0:
        recommended.append({"priority": "medium", "action": "review_prs", "count": ready_count})
    if investigate_count > 0:
        recommended.append({"priority": "medium", "action": "investigate_delayed_prs", "count": investigate_count})
    recommended.append({"priority": "low", "action": "monitor_progress", "next_check_minutes": 20})
    output["recommended_actions"] = recommended

    if dashboard_mode:
        # ANSI color codes
        RED = '\033[31m'
        GREEN = '\033[32m'
        YELLOW = '\033[33m'
        CYAN = '\033[36m'
        RESET = '\033[0m'
        BOLD = '\033[1m'

        # Status icons
        STATUS_ICONS = {
            "ready_for_review": "✅",
            "draft": "📝",
            "planning": "🧠",
            "in_progress": "🚧",
            "blocked": "⛔",
            "error": "❌"
        }
        PRIORITY_ICONS = {
            "high": f"{RED}🔴{RESET}",
            "medium": f"{YELLOW}🟡{RESET}",
            "normal": f"{GREEN}🟢{RESET}"
        }
        ACTION_ICONS = {
            "resolve_conflicts": f"{RED}⚡{RESET}",
            "review_ready": f"{GREEN}👀{RESET}",
            "investigate": f"{YELLOW}🔍{RESET}",
            "wait": f"{CYAN}⏳{RESET}"
        }

        def color_status(status):
            if status == "ready_for_review":
                return f"{GREEN}{status}{RESET}"
            elif status == "draft" or status == "planning":
                return f"{YELLOW}{status}{RESET}"
            elif status == "in_progress":
                return f"{CYAN}{status}{RESET}"
            elif status == "blocked":
                return f"{RED}{status}{RESET}"
            elif status == "error":
                return f"{RED}{status}{RESET}"
            return status

        def color_action(action):
            if action == "resolve_conflicts":
                return f"{RED}{action}{RESET}"
            elif action == "review_ready":
                return f"{GREEN}{action}{RESET}"
            elif action == "investigate":
                return f"{YELLOW}{action}{RESET}"
            elif action == "wait":
                return f"{CYAN}{action}{RESET}"
            return action

        print(f"\n{BOLD}==== PROCESS DASHBOARD ===={RESET}")
        print(f"{CYAN}Timestamp:{RESET} {output['timestamp']}")
        print(f"{BOLD}Total PRs:{RESET} {output['summary']['total_prs']}")
        print(f"{RED}Blocked:{RESET} {output['summary']['blocked_count']} | {GREEN}Ready for Review:{RESET} {output['summary']['ready_for_review_count']} | {YELLOW}Needs Investigation:{RESET} {output['summary']['needs_investigation_count']} | {CYAN}Normal:{RESET} {output['summary']['normal_progress_count']}")

        # Tabular PRs
        print(f"\n{BOLD}PRs:{RESET}")
        header = f"{'#':<5} {'Title':<40} {'Status':<18} {'Action':<18} {'Priority':<10} {'Elapsed':<8}"
        print(header)
        print('-' * len(header))
        for pr in prs:
            pr_num = pr.get('pr_number', '')
            title = pr.get('title', pr.get('error', ''))
            status = pr.get('pr_status', pr.get('error', 'error'))
            action = pr.get('action_needed', '')
            priority = pr.get('priority', '')
            elapsed = pr.get('elapsed_minutes', 0)
            status_icon = STATUS_ICONS.get(status, '')
            priority_icon = PRIORITY_ICONS.get(priority, '')
            action_icon = ACTION_ICONS.get(action, '')
            status_colored = color_status(status)
            action_colored = color_action(action)
            print(f"{str(pr_num):<5} {title[:38]:<40} {status_icon} {status_colored:<15} {action_icon} {action_colored:<15} {priority_icon} {priority:<7} {elapsed:<8}min")

        print(f"\n{BOLD}Recommended Actions:{RESET}")
        for rec in output['recommended_actions']:
            action = rec.get('action')
            priority = rec.get('priority')
            count = rec.get('count', '')
            next_check = rec.get('next_check_minutes', None)
            priority_icon = PRIORITY_ICONS.get(priority, '')
            action_icon = ACTION_ICONS.get(action, '')
            if next_check:
                print(f"- {priority_icon} [{priority}] {action_icon} {action} (Next check in {next_check} min)")
            elif count != '':
                print(f"- {priority_icon} [{priority}] {action_icon} {action} ({count} PRs)")
            else:
                print(f"- {priority_icon} [{priority}] {action_icon} {action}")
        print(f"{BOLD}==========================={RESET}\n")
    else:
        print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()
