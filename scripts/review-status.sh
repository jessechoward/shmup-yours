#!/bin/bash
# Review Status Dashboard
# Quick script to check when PRs will be ready for review

echo "🔍 INFRASTRUCTURE REVIEW STATUS - $(date)"
echo "=================================================="

echo ""
echo "📊 CURRENT PHASE 2 TASKS:"
echo ""

# Check PR #44 (Issue #35)
echo "Issue #35 - Husky Foundation Setup:"
echo "  PR #44: $(gh pr view 44 --json isDraft,updatedAt --jq 'if .isDraft then "🟡 DRAFT" else "✅ READY" end') (Updated: $(gh pr view 44 --json updatedAt --jq '.updatedAt'))"
echo "  Estimated: 15 min | Started: ~19:48 UTC"

echo ""

# Check PR #45 (Issue #42)  
echo "Issue #42 - Educational Hook Error Messages:"
echo "  PR #45: $(gh pr view 45 --json isDraft,updatedAt --jq 'if .isDraft then "🟡 DRAFT" else "✅ READY" end') (Updated: $(gh pr view 45 --json updatedAt --jq '.updatedAt'))"
echo "  Estimated: 10 min | Started: ~19:49 UTC"

echo ""
echo "⏰ REVIEW TIMING:"
echo ""

# Calculate time since creation
current_time=$(date +%s)
pr44_created=$(date -d "2025-07-14T19:48:36Z" +%s)
pr45_created=$(date -d "2025-07-14T19:49:01Z" +%s)

pr44_elapsed=$(( (current_time - pr44_created) / 60 ))
pr45_elapsed=$(( (current_time - pr45_created) / 60 ))

echo "  PR #44: ${pr44_elapsed} minutes elapsed (15 min estimate)"
echo "  PR #45: ${pr45_elapsed} minutes elapsed (10 min estimate)"

echo ""
echo "🎯 RECOMMENDATIONS:"
if [ $pr44_elapsed -gt 18 ] || [ $pr45_elapsed -gt 12 ]; then
    echo "  ⚠️  CHECK NOW: One or more tasks appear overdue"
else
    echo "  ⏳ Wait 5-10 more minutes, then check for review readiness"
fi

echo ""
echo "📋 NEXT STEPS:"
echo "  1. When both PRs ready → Review & merge (15-20 min)"
echo "  2. Assign Issue #41 (Phase 3: Template Updates)"  
echo "  3. Expected Phase 3 review: +20 minutes after start"

echo ""
echo "💡 Quick Commands:"
echo "  gh pr list --draft=false  # Check if ready for review"
echo "  gh pr list --json number,title,isDraft,updatedAt  # Full status"
