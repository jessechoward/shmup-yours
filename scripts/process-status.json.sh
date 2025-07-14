#!/bin/bash
# Process Status JSON Output
# Structured data for programmatic analysis

echo "{"
echo '  "timestamp": "'$(date -Iseconds)'",'
echo '  "dashboard_type": "process_management",'
echo '  "infrastructure_prs": ['

first=true
for pr_num in 44 45; do
    if [ "$first" = false ]; then echo ","; fi
    first=false
    
    pr_data=$(gh pr view $pr_num --json number,title,isDraft,mergeable,headRefName,updatedAt,createdAt 2>/dev/null)
    if [ $? -eq 0 ]; then
        title=$(echo "$pr_data" | jq -r '.title')
        is_draft=$(echo "$pr_data" | jq -r '.isDraft')
        mergeable=$(echo "$pr_data" | jq -r '.mergeable')
        created_at=$(echo "$pr_data" | jq -r '.createdAt')
        branch=$(echo "$pr_data" | jq -r '.headRefName')
        
        # Calculate elapsed minutes
        current_time=$(date +%s)
        created_timestamp=$(date -d "$created_at" +%s 2>/dev/null || echo "0")
        elapsed=$(( (current_time - created_timestamp) / 60 ))
        
        # Determine action
        action="wait"
        if [ "$mergeable" = "CONFLICTING" ]; then
            action="resolve_conflicts"
        elif [ "$is_draft" = "false" ] && [ "$mergeable" = "MERGEABLE" ]; then
            action="review_ready"
        elif [ $elapsed -gt 45 ]; then
            action="investigate"
        fi
        
        # Determine priority
        priority="normal"
        if [ "$action" = "resolve_conflicts" ]; then
            priority="high"
        elif [ "$action" = "review_ready" ]; then
            priority="medium"
        fi
        
        echo "    {"
        echo '      "pr_number": '$pr_num','
        echo '      "title": "'$title'",'
        echo '      "is_draft": '$is_draft','
        echo '      "mergeable": "'$mergeable'",'
        echo '      "branch": "'$branch'",'
        echo '      "elapsed_minutes": '$elapsed','
        echo '      "action_needed": "'$action'",'
        echo '      "priority": "'$priority'"'
        echo -n "    }"
    else
        echo "    {"
        echo '      "pr_number": '$pr_num','
        echo '      "error": "PR not found",'
        echo '      "action_needed": "investigate",'
        echo '      "priority": "high"'
        echo -n "    }"
    fi
done

echo ""
echo "  ],"

# Summary counts
blocked_count=0
ready_count=0
investigate_count=0
normal_count=0

for pr_num in 44 45; do
    pr_data=$(gh pr view $pr_num --json number,title,isDraft,mergeable,createdAt 2>/dev/null)
    if [ $? -eq 0 ]; then
        is_draft=$(echo "$pr_data" | jq -r '.isDraft')
        mergeable=$(echo "$pr_data" | jq -r '.mergeable')
        created_at=$(echo "$pr_data" | jq -r '.createdAt')
        
        current_time=$(date +%s)
        created_timestamp=$(date -d "$created_at" +%s 2>/dev/null || echo "0")
        elapsed=$(( (current_time - created_timestamp) / 60 ))
        
        if [ "$mergeable" = "CONFLICTING" ]; then
            blocked_count=$((blocked_count + 1))
        elif [ "$is_draft" = "false" ] && [ "$mergeable" = "MERGEABLE" ]; then
            ready_count=$((ready_count + 1))
        elif [ $elapsed -gt 45 ]; then
            investigate_count=$((investigate_count + 1))
        else
            normal_count=$((normal_count + 1))
        fi
    fi
done

echo '  "summary": {'
echo '    "blocked_count": '$blocked_count','
echo '    "ready_for_review_count": '$ready_count','
echo '    "needs_investigation_count": '$investigate_count','
echo '    "normal_progress_count": '$normal_count','
echo '    "total_prs": '$((blocked_count + ready_count + investigate_count + normal_count))
echo '  },'

echo '  "recommended_actions": ['
if [ $blocked_count -gt 0 ]; then
    echo '    {"priority": "high", "action": "resolve_merge_conflicts", "count": '$blocked_count'},'
fi
if [ $ready_count -gt 0 ]; then
    echo '    {"priority": "medium", "action": "review_prs", "count": '$ready_count'},'
fi
if [ $investigate_count -gt 0 ]; then
    echo '    {"priority": "medium", "action": "investigate_delayed_prs", "count": '$investigate_count'},'
fi
echo '    {"priority": "low", "action": "monitor_progress", "next_check_minutes": 20}'
echo '  ]'

echo "}"
