#!/bin/bash
# Process Management Dashboard
# Focused on actionable decisions for human process manager

echo "🎯 PROCESS MANAGEMENT DASHBOARD - $(date)"
echo "=================================================="

# Function to get PR mergeable status
get_pr_status() {
    local pr_num=$1
    local json=$(gh pr view $pr_num --json number,title,isDraft,mergeable,headRefName,updatedAt,createdAt 2>/dev/null)
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
echo "📊 INFRASTRUCTURE PRs STATUS:"
echo "=============================="
printf "%-4s %-50s %-12s %-12s %-8s %-15s\n" "PR#" "TITLE" "STATUS" "MERGEABLE" "ELAPSED" "ACTION"
echo "----------------------------------------------------------------------------------------------------"

# Check known infrastructure PRs
for pr_num in 44 45; do
    pr_data=$(get_pr_status $pr_num)
    
    if echo "$pr_data" | grep -q '"error"'; then
        printf "%-4s %-50s %-12s %-12s %-8s %-15s\n" "$pr_num" "NOT FOUND" "N/A" "N/A" "N/A" "INVESTIGATE"
        continue
    fi
    
    title=$(echo "$pr_data" | jq -r '.title' | cut -c1-47)
    if [ ${#title} -eq 47 ]; then title="${title}..."; fi
    
    is_draft=$(echo "$pr_data" | jq -r '.isDraft')
    mergeable=$(echo "$pr_data" | jq -r '.mergeable')
    created_at=$(echo "$pr_data" | jq -r '.createdAt')
    updated_at=$(echo "$pr_data" | jq -r '.updatedAt')
    
    elapsed=$(calc_elapsed_minutes "$created_at")
    
    # Determine status
    if [ "$is_draft" = "true" ]; then
        status="DRAFT"
    else
        status="READY"
    fi
    
    # Determine action needed
    action="WAIT"
    if [ "$mergeable" = "CONFLICTING" ]; then
        action="🚨 BLOCKED"
    elif [ "$is_draft" = "false" ] && [ "$mergeable" = "MERGEABLE" ]; then
        action="✅ REVIEW"
    elif [ $elapsed -gt 45 ]; then
        action="⚠️ INVESTIGATE"
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

for pr_num in 44 45; do
    pr_data=$(get_pr_status $pr_num)
    if echo "$pr_data" | grep -q '"error"'; then continue; fi
    
    is_draft=$(echo "$pr_data" | jq -r '.isDraft')
    mergeable=$(echo "$pr_data" | jq -r '.mergeable')
    created_at=$(echo "$pr_data" | jq -r '.createdAt')
    elapsed=$(calc_elapsed_minutes "$created_at")
    
    if [ "$mergeable" = "CONFLICTING" ]; then
        blocked_count=$((blocked_count + 1))
    elif [ "$is_draft" = "false" ] && [ "$mergeable" = "MERGEABLE" ]; then
        ready_count=$((ready_count + 1))
    elif [ $elapsed -gt 45 ]; then
        investigate_count=$((investigate_count + 1))
    fi
done

echo "🚨 BLOCKED (merge conflicts): $blocked_count PRs"
echo "✅ READY FOR REVIEW: $ready_count PRs" 
echo "⚠️  NEED INVESTIGATION: $investigate_count PRs"
echo "⏳ NORMAL PROGRESS: $((2 - blocked_count - ready_count - investigate_count)) PRs"

echo ""
echo "🎯 RECOMMENDED ACTIONS:"
echo "======================"

if [ $blocked_count -gt 0 ]; then
    echo "1. 🚨 HIGH PRIORITY: Resolve merge conflicts to unblock agents"
    echo "   Commands: Check specific conflicts and resolve infrastructure file issues"
fi

if [ $ready_count -gt 0 ]; then
    echo "2. ✅ REVIEW READY: $ready_count PR(s) waiting for human review"
    echo "   Commands: gh pr list --draft=false --json number,title,mergeable"
fi

if [ $investigate_count -gt 0 ]; then
    echo "3. ⚠️  INVESTIGATE: $investigate_count PR(s) running longer than expected"
    echo "   Commands: Check agent status, consider SLO violation"
fi

if [ $blocked_count -eq 0 ] && [ $ready_count -eq 0 ] && [ $investigate_count -eq 0 ]; then
    echo "✨ ALL SYSTEMS NORMAL: Agents working within expected timeframes"
    echo "   Next check recommended in 15-20 minutes"
fi

echo ""
echo "📋 QUICK COMMANDS:"
echo "=================="
echo "gh pr list --json number,title,isDraft,mergeable,updatedAt  # Full PR status"
echo "gh pr view <PR#> --json mergeable,headRefName               # Detailed conflict info"
echo "gh issue list --label infrastructure --state open           # Infrastructure backlog"

echo ""
echo "⏱️  NEXT PROCESS CHECK: $(date -d '+20 minutes' '+%H:%M')"
