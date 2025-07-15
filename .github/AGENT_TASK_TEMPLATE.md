# GitHub Copilot Agent Task Assignment Template

## Quick Reference

### Creating and Assigning Issues to GitHub Copilot Agents

```bash
# 1. Create the issue
gh issue create --title "Task Title" --body-file task_file.md

# 2. Assign to @copilot (CRITICAL: Use quotes around '@copilot')
gh issue edit <issue_number> --add-assignee '@copilot'

# 3. Add agent assignment comment with hashtag
gh issue comment <issue_number> --body "@copilot please implement this task.

#github-pull-request_copilot-coding-agent"
```

## Key Learnings

### ✅ CORRECT Assignment Method
- **CLI Assignment:** `gh issue edit 51 --add-assignee '@copilot'`
- **Critical Detail:** Quotes around `'@copilot'` are REQUIRED for CLI
- **Expected Result:** Issue shows "Copilot" as assignee (BOT account)
- **Agent Acknowledgment:** Eyes emoji 👀 appears when agent picks up task

### ❌ COMMON MISTAKES
- `--add-assignee copilot` (missing @ and quotes) - FAILS
- `--add-assignee @copilot` (missing quotes) - FAILS  
- `--add-assignee "copilot"` (missing @) - FAILS
- Manual assignment through web interface also works but CLI is faster

### 🎯 Complete Workflow

#### Step 1: Create Task File
```markdown
# Task: [Clear Title]

## Problem Statement
[Clear issue description]

## Expected Deliverables
[Specific outputs with file paths if needed]

## Success Criteria
[Measurable outcomes]

## Time Constraints
[Research: X minutes, Implementation: Y minutes]
```

#### Step 2: Create and Assign Issue
```bash
# Create issue
ISSUE_NUMBER=$(gh issue create --title "Task: Clear Title" --body-file task.md --json number --jq .number)

# Assign to @copilot (use quotes!)
gh issue edit $ISSUE_NUMBER --add-assignee '@copilot'

# Add assignment comment
gh issue comment $ISSUE_NUMBER --body "@copilot please implement this task.

#github-pull-request_copilot-coding-agent"
```

#### Step 3: Monitor for Agent Pickup
```bash
# Check for agent acknowledgment (eyes emoji should appear)
gh issue view $ISSUE_NUMBER

# Monitor for new PRs from agents
gh pr list --state open --author app/copilot-swe-agent
```

## Agent Response Timeline

### Expected Behavior
- **0-5 minutes:** Eyes emoji 👀 appears on issue  
- **5-15 minutes:** Agent acknowledgment comment
- **15-30 minutes:** Branch creation and initial commits
- **30-90 minutes:** PR creation for implementation tasks
- **1-3 hours:** Research task completion

### ✅ Verified Performance (July 15, 2025)
- **Task #51 (PR Status Fix):** 48 minutes total - EXCELLENT
- **Task #52 (Strategic Research):** 45 minutes total - OUTSTANDING
- **Both agents exceeded expectations** - delivered strategic quality in tactical timeframes

### Troubleshooting
- **No eyes emoji:** Check assignee field shows "Copilot"
- **No agent response:** Verify repository has Copilot access
- **Assignment failed:** Ensure quotes around `'@copilot'` in CLI

## Task Scoping Best Practices

### ✅ Well-Scoped Tasks
- **Single focus:** One clear problem to solve
- **Time-boxed:** Research <2 hours, Implementation <90 minutes  
- **Clear deliverables:** Specific files or outputs expected
- **Success criteria:** Measurable outcomes defined

### ⚠️ Scope Issues to Avoid
- **Multiple problems:** Break into separate tasks
- **Vague requirements:** Add specific examples and constraints
- **No time limits:** Agents work better with clear boundaries
- **Missing context:** Include relevant background and examples

## Example Templates

### Immediate Fix Task
```markdown
# Task: Fix [Specific Issue] - Immediate Resolution

## Problem Statement
**Issue:** [Clear description of current problem]
**Goal:** [Specific outcome needed]

## Expected Deliverables
1. **[Primary Output]** - [Description]
2. **[Secondary Output]** - [Description]  
3. **Implementation Plan** - Step-by-step deployment

## PR Creation Requirements
**CRITICAL:** When work is complete, create PR as **READY FOR REVIEW** (not draft)

### Step-by-Step PR Creation:
1. **Verify work is complete:** All deliverables met, tests passing
2. **Create PR as READY:** `gh pr create --title "..." --body "..."` (NO --draft flag)
3. **Verify PR status:** Confirm `isDraft: false` in GitHub
4. **If accidentally created as draft:** Run `gh pr ready <pr-number>` to convert

### Commands:
```bash
# Create READY PR (default behavior)
gh pr create --title "[Type]: Brief description" --body-file .github/pull_request_template.md

# Verify it's ready (should show isDraft: false)
gh pr view <pr-number> --json isDraft

# Convert draft to ready if needed
gh pr ready <pr-number>
```

**Follow:** `.github/PR_STATUS_RULES.md` decision tree

## Time Constraints
- Research: 30-45 minutes
- Implementation: 15-30 minutes
- Total: <90 minutes
```

### Strategic Research Task
```markdown
# Task: Research [Topic] Strategy

## Research Questions
1. **[Primary Question]** - [Specific focus]
2. **[Secondary Question]** - [Supporting analysis]

## Expected Deliverables
**Workspace:** `research/[topic]/`
1. **Problem Analysis** - `01-problem-analysis.md`
2. **Solution Investigation** - `02-solution-investigation.md`  
3. **Recommendation Summary** - `03-executive-summary.md`

## PR Creation Requirements
**CRITICAL:** Create PR as **READY FOR REVIEW** when research is complete
```bash
# Create READY PR (not draft)
gh pr create --title "Research: [Topic] - [Key Finding]" --body-file .github/pull_request_template.md

# Verify ready status
gh pr view <pr-number> --json isDraft
```

## Time Constraints
- Total research: 2-3 hours maximum
- Document challenges and decision rationale
```

---

**Last Updated:** July 15, 2025  
**Key Fix:** Added proper CLI assignment syntax with quoted '@copilot'
