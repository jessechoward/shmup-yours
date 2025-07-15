#!/bin/bash
# Process Management Dashboard
# Focused on actionable decisions for human process manager

echo "🎯 PROCESS MANAGEMENT DASHBOARD - $(date)"
echo "=================================================="

# Function to get PR mergeable status
get_pr_status() {
    local pr_num=$1
    local json=$(gh pr view $pr_num --json number,title,isDraft,mergeable,headRefName,updatedAt,createdAt,state 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "$json"
    else
        echo '{"number": '$pr_num', "error": "PR not found"}'
    fi
}

# Function to calculate elapsed time in minutes
calc_elapsed_minutes() {
    local created_time=$1
    local current_time=$(date +%s)
    local created_timestamp=$(date -d "$created_time" +%s 2>/dev/null || echo "0")
    local elapsed=$(( (current_time - created_timestamp) / 60 ))
    echo $elapsed
}

echo ""
echo "🤖 GITHUB COPILOT ASSIGNMENTS:"
echo "==============================="
printf "%-4s %-50s %-12s %-8s %-15s\n" "ID#" "TITLE" "STATUS" "ELAPSED" "ACTION"
echo "----------------------------------------------------------------------------------------------------"

# Check GitHub Copilot assigned issues
for issue_num in $(gh issue list --state open --json number,assignees --jq '.[] | select(.assignees[] | .login == "Copilot") | .number' 2>/dev/null || echo ""); do
    issue_data=$(gh issue view $issue_num --json number,title,assignees,createdAt,state 2>/dev/null)
    
    if [ $? -ne 0 ]; then
        printf "%-4s %-50s %-12s %-8s %-15s\n" "$issue_num" "NOT FOUND" "N/A" "N/A" "INVESTIGATE"
        continue
    fi
    
    title=$(echo "$issue_data" | jq -r '.title' | cut -c1-47)
    if [ ${#title} -eq 47 ]; then title="${title}..."; fi
    
    created_at=$(echo "$issue_data" | jq -r '.createdAt')
    elapsed=$(calc_elapsed_minutes "$created_at")
    
    # Check if there's already a PR for this issue
    related_pr=$(gh pr list --state open --json number,body --jq ".[] | select(.body | test(\"#${issue_num}\\\\b\")) | .number" 2>/dev/null || echo "")
    
    if [ -n "$related_pr" ]; then
        status="PR_ACTIVE"
        action="🔄 DEVELOPING"
    elif [ $elapsed -gt 15 ]; then
        status="ASSIGNED"
        action="⚠️ PICKUP_DELAY"
    else
        status="ASSIGNED"
        action="⏳ AWAITING_PICKUP"
    fi
    
    printf "%-4s %-50s %-12s %-8s %-15s\n" "$issue_num" "$title" "$status" "${elapsed}m" "$action"
done

echo ""
echo "📊 INFRASTRUCTURE PRs STATUS:"
echo "=============================="
printf "%-4s %-50s %-12s %-12s %-8s %-15s\n" "PR#" "TITLE" "STATUS" "MERGEABLE" "ELAPSED" "ACTION"
echo "----------------------------------------------------------------------------------------------------"

# Check all open infrastructure PRs
for pr_num in $(gh pr list --label infrastructure --state open --json number --jq '.[].number' 2>/dev/null || echo ""); do
    pr_data=$(get_pr_status $pr_num)
    
    if echo "$pr_data" | grep -q '"error"'; then
        printf "%-4s %-50s %-12s %-12s %-8s %-15s\n" "$pr_num" "NOT FOUND" "N/A" "N/A" "N/A" "INVESTIGATE"
        continue
    fi
    
    # Check if PR is closed
    pr_state=$(echo "$pr_data" | jq -r '.state // "UNKNOWN"')
    if [ "$pr_state" = "CLOSED" ] || [ "$pr_state" = "MERGED" ]; then
        title=$(echo "$pr_data" | jq -r '.title' | cut -c1-47)
        if [ ${#title} -eq 47 ]; then title="${title}..."; fi
        printf "%-4s %-50s %-12s %-12s %-8s %-15s\n" "$pr_num" "$title" "$pr_state" "N/A" "N/A" "✅ COMPLETE"
        continue
    fi
    
    title=$(echo "$pr_data" | jq -r '.title' | cut -c1-47)
    if [ ${#title} -eq 47 ]; then title="${title}..."; fi
    
    is_draft=$(echo "$pr_data" | jq -r '.isDraft')
    mergeable=$(echo "$pr_data" | jq -r '.mergeable')
    created_at=$(echo "$pr_data" | jq -r '.createdAt')
    updated_at=$(echo "$pr_data" | jq -r '.updatedAt')
    
    elapsed=$(calc_elapsed_minutes "$created_at")
    
    # Determine status and action
    if [ "$is_draft" = "true" ]; then
        status="WIP"  # Work in Progress
        action="🔄 DEVELOPING"
    else
        status="READY"
        # Determine action for ready PRs
        if [ "$mergeable" = "CONFLICTING" ]; then
            action="🚨 BLOCKED"
        elif [ "$mergeable" = "MERGEABLE" ]; then
            action="✅ REVIEW"
        else
            action="⚠️ CHECK"
        fi
    fi
    
    # Override action for long-running tasks
    if [ $elapsed -gt 45 ]; then
        if [ "$is_draft" = "true" ]; then
            action="⚠️ WIP-LONG"
        else
            action="⚠️ INVESTIGATE"
        fi
    fi
    
    printf "%-4s %-50s %-12s %-12s %-8s %-15s\n" "$pr_num" "$title" "$status" "$mergeable" "${elapsed}m" "$action"
done

echo ""
echo "🔄 PROCESS ACTIONS NEEDED:"
echo "========================="

# Count PRs by action type
blocked_count=0
ready_count=0
investigate_count=0
wip_count=0

# Count Copilot assignments by status
assigned_awaiting_count=0
assigned_delayed_count=0
assigned_developing_count=0

for pr_num in $(gh pr list --label infrastructure --state open --json number --jq '.[].number' 2>/dev/null || echo ""); do
    pr_data=$(get_pr_status $pr_num)
    if echo "$pr_data" | grep -q '"error"'; then continue; fi
    
    # Skip completed PRs
    pr_state=$(echo "$pr_data" | jq -r '.state // "UNKNOWN"')
    if [ "$pr_state" = "CLOSED" ] || [ "$pr_state" = "MERGED" ]; then
        continue
    fi
    
    is_draft=$(echo "$pr_data" | jq -r '.isDraft')
    mergeable=$(echo "$pr_data" | jq -r '.mergeable')
    created_at=$(echo "$pr_data" | jq -r '.createdAt')
    elapsed=$(calc_elapsed_minutes "$created_at")
    
    if [ "$mergeable" = "CONFLICTING" ]; then
        blocked_count=$((blocked_count + 1))
    elif [ "$is_draft" = "false" ] && [ "$mergeable" = "MERGEABLE" ]; then
        ready_count=$((ready_count + 1))
    elif [ "$is_draft" = "true" ]; then
        wip_count=$((wip_count + 1))
    elif [ $elapsed -gt 45 ]; then
        investigate_count=$((investigate_count + 1))
    fi
done

# Count Copilot assignments
for issue_num in $(gh issue list --assignee Copilot --state open --json number --jq '.[].number' 2>/dev/null || echo ""); do
    issue_data=$(gh issue view $issue_num --json number,title,assignees,createdAt,state 2>/dev/null)
    if [ $? -ne 0 ]; then continue; fi
    
    created_at=$(echo "$issue_data" | jq -r '.createdAt')
    elapsed=$(calc_elapsed_minutes "$created_at")
    
    # Check if there's already a PR for this issue
    related_pr=$(gh pr list --state open --json number,body --jq ".[] | select(.body | test(\"#${issue_num}\\\\b\")) | .number" 2>/dev/null || echo "")
    
    if [ -n "$related_pr" ]; then
        assigned_developing_count=$((assigned_developing_count + 1))
    elif [ $elapsed -gt 15 ]; then
        assigned_delayed_count=$((assigned_delayed_count + 1))
    else
        assigned_awaiting_count=$((assigned_awaiting_count + 1))
    fi
done

echo "🤖 GITHUB COPILOT ASSIGNMENTS:"
echo "⏳ AWAITING PICKUP: $assigned_awaiting_count tasks (<15 min)"
echo "⚠️  PICKUP DELAYED: $assigned_delayed_count tasks (>15 min)" 
echo "🔄 DEVELOPING: $assigned_developing_count tasks (PR created)"
echo ""
echo "📊 INFRASTRUCTURE PRs:"
echo "🚨 BLOCKED (merge conflicts): $blocked_count PRs"
echo "✅ READY FOR REVIEW: $ready_count PRs" 
echo "🔄 WORK IN PROGRESS: $wip_count PRs"
echo "⚠️  NEED INVESTIGATION: $investigate_count PRs"

echo ""
echo "🎯 RECOMMENDED ACTIONS:"
echo "======================"

if [ $assigned_delayed_count -gt 0 ]; then
    echo "1. ⚠️  HIGH PRIORITY: $assigned_delayed_count Copilot assignment(s) delayed (>15 min)"
    echo "   Commands: Check agent availability, consider task complexity"
fi

if [ $blocked_count -gt 0 ]; then
    echo "2. 🚨 RESOLVE CONFLICTS: $blocked_count PR(s) with merge conflicts"
    echo "   Commands: Check specific conflicts and resolve infrastructure file issues"
fi

if [ $ready_count -gt 0 ]; then
    echo "3. ✅ REVIEW READY: $ready_count PR(s) waiting for human review"
    echo "   Commands: gh pr list --draft=false --json number,title,mergeable"
fi

if [ $wip_count -gt 0 ]; then
    echo "4. 🔄 WORK IN PROGRESS: $wip_count PR(s) in development"
    echo "   Status: Normal agent development - monitor for completion"
fi

if [ $investigate_count -gt 0 ]; then
    echo "5. ⚠️  INVESTIGATE: $investigate_count PR(s) running longer than expected"
    echo "   Commands: Check agent status, consider SLO violation"
fi

if [ $assigned_awaiting_count -gt 0 ]; then
    echo "6. ⏳ MONITORING: $assigned_awaiting_count Copilot assignment(s) awaiting pickup"
    echo "   Status: Normal - agents typically pick up within 5-15 minutes"
fi

if [ $assigned_developing_count -gt 0 ]; then
    echo "7. 🔄 ACTIVE DEVELOPMENT: $assigned_developing_count task(s) with PRs created"
    echo "   Status: Normal progress - PRs created and agents working"
fi

if [ $blocked_count -eq 0 ] && [ $ready_count -eq 0 ] && [ $investigate_count -eq 0 ] && [ $wip_count -eq 0 ] && [ $assigned_awaiting_count -eq 0 ] && [ $assigned_delayed_count -eq 0 ] && [ $assigned_developing_count -eq 0 ]; then
    echo "✨ ALL SYSTEMS NORMAL: No active infrastructure work"
    echo "   Ready for next development cycle"
fi

echo ""
echo "📋 QUICK COMMANDS:"
echo "=================="
echo "# GitHub Copilot Assignment Monitoring:"
echo "gh issue list --assignee Copilot --state open               # All Copilot assignments"
echo "gh issue view <ISSUE#>                                      # Check assignment details"
echo ""
echo "# Infrastructure PR Monitoring:"  
echo "gh pr list --json number,title,isDraft,mergeable,updatedAt  # Full PR status"
echo "gh pr view <PR#> --json mergeable,headRefName               # Detailed conflict info"
echo "gh issue list --label infrastructure --state open           # Infrastructure backlog"

echo ""
echo "⏱️  NEXT PROCESS CHECK: $(date -d '+20 minutes' '+%H:%M')"
