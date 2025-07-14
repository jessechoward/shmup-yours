# GitHub Copilot Coding Agent Workflow

## Overview
Complete workflow for assigning GitHub issues to Copilot coding agents and managing the full development cycle from issue → branch → PR → merge.

## Copilot Assignment Process

### 1. Issue Assignment
```markdown
# In issue comments, mention the coding agent:
@github-copilot please implement this feature following the task template guidelines.

# Or use the hashtag syntax for automatic assignment:
#github-pull-request_copilot-coding-agent
```

### 2. Agent Activation
The Copilot coding agent will:
1. **Create Feature Branch:** Following naming conventions
2. **Implement Solution:** According to issue requirements
3. **Write Tests:** Unit and integration tests as specified
4. **Open Pull Request:** Using our PR template
5. **Link Issue:** Automatically link PR to issue with "Closes #X"

## Branch Naming Conventions

### Standard Format
```bash
# Pattern: [type]/[issue-number]-[short-description]
# Examples:
feature/15-multiplayer-lobby
bugfix/23-collision-detection
docs/45-api-documentation
refactor/67-websocket-cleanup
test/89-e2e-game-flow
```

### Branch Types
- **`feature/`** - New functionality implementation
- **`bugfix/`** - Bug fixes and corrections
- **`docs/`** - Documentation updates
- **`refactor/`** - Code refactoring without feature changes
- **`test/`** - Test additions or improvements
- **`chore/`** - Maintenance tasks (deps, config, etc.)

### Branch Creation Commands
```bash
# Agent will execute:
git checkout main
git pull origin main
git checkout -b feature/15-multiplayer-lobby
```

## Pull Request Workflow

### 1. Automatic PR Creation
When Copilot completes implementation:
```bash
gh pr create --title "Feature: Multiplayer lobby system" \
  --body-file .github/pull_request_template.md \
  --base main \
  --head feature/15-multiplayer-lobby
```

### 2. PR Requirements
- **Issue Linking:** Must include "Closes #[issue-number]"
- **Template Completion:** All sections of PR template filled
- **Quality Checks:** All automated checks must pass
- **Time-Box Compliance:** Document actual vs estimated time

### 3. Review Process
```bash
# Auto-assign reviewers based on file changes
# Backend changes → backend team
# Frontend changes → frontend team  
# Documentation → tech lead
```

## Quality Gates

### Pre-Merge Requirements
- [ ] **All Tests Pass:** Unit, integration, E2E
- [ ] **Linting:** Code style and quality checks
- [ ] **Documentation:** Updated relevant docs
- [ ] **Time-Box:** Completed within estimated time (+20% tolerance)
- [ ] **Review:** At least one approved review

### Automated Checks (GitHub Actions)
```yaml
# Will be implemented:
- name: Test Suite
  run: yarn test:all
  
- name: Lint Check  
  run: yarn lint:all
  
- name: Build Verification
  run: yarn build:all
  
- name: Security Scan
  run: yarn audit
```

## Agent Handoff Procedures

### Issue Completion Checklist
When Copilot finishes a task:

1. **Implementation Complete:** Code written and tested
2. **PR Created:** Using standard template
3. **Documentation Updated:** Relevant docs reflect changes
4. **Issue Updated:** Comment with implementation summary
5. **Follow-up Issues:** Create if scope expanded during work

### Context Preservation
```markdown
## Implementation Summary
**Objective:** [What was accomplished]
**Key Decisions:** [Important choices made during implementation]
**Testing:** [Tests written and results]
**Edge Cases:** [Any issues discovered or handled]
**Follow-up Work:** [Additional issues created]
**Time Used:** [Actual vs estimated time]
```

## Escalation Procedures

### Automatic Escalation Triggers
When any of these conditions occur, agents must escalate using the escalation workflow:

1. **3-Iteration Limit Reached:** Agent has completed 3 time-boxed attempts without meeting success criteria
2. **Quality Gates Failed:** Unable to achieve 90% function coverage or 80% decision coverage after 3 iterations
3. **Unresolvable Technical Blocker:** External dependencies, API limitations, or architecture constraints
4. **Scope Expansion Beyond Estimates:** Requirements grew >50% during implementation

### Escalation Process (See .github/ESCALATION_WORKFLOW.md)

**Step 1: Agent Preparation (5 minutes)**
1. **Commit Current Work:** Preserve all progress in feature branch
2. **Create Escalation Issue:** Use `.github/ISSUE_TEMPLATE/escalation.md` template
3. **Document Evidence:** Capture logs, test results, quality metrics

**Step 2: Automatic Assignment**
Escalation issues auto-assign based on type:
- Backend issues → @backend-team-lead
- Frontend issues → @frontend-team-lead  
- Infrastructure → @devops-lead
- Cross-cutting → @tech-lead

**Step 3: Human Review (30-60 minutes)**
- Root cause analysis using `.github/copilot-tasks/escalation-analysis.md`
- Resolution strategy selection (revised agent approach/human takeover/decomposition)
- Process improvement opportunity identification

### Legacy Escalation Procedures (For Reference)

**Time-Box Overruns (Pre-3-Iteration Process):**
If implementation exceeds 20 minutes in single iteration:
1. **Stop Work:** Comment on issue with current status
2. **Analyze Scope:** Determine if task needs breakdown
3. **Create Sub-Issues:** Split large task into smaller ones
4. **Update Estimates:** Revise time estimates based on learning

**Quality Issues:**
If tests fail or code quality issues during any iteration:
1. **Continue Within Iteration Limit:** Use remaining iterations to resolve
2. **Escalate if Unresolved:** After 3 iterations, follow escalation process
3. **Document Technical Debt:** If accepting reduced quality for delivery

**Scope Creep:**
If requirements expand during implementation:
1. **Complete Core Task:** Finish original scope only
2. **Create Follow-up Issues:** For additional scope
3. **Link Related Work:** Maintain traceability
4. **Escalate if Scope Doubles:** Use escalation process for major expansion

## Integration with Task Templates

### Template → Branch Mapping
```bash
# Issue templates automatically suggest branch names:
backend-feature-task.md → feature/[issue]-[backend-feature]
frontend-feature-task.md → feature/[issue]-[frontend-feature]  
bug-fix-task.md → bugfix/[issue]-[bug-description]
documentation-task.md → docs/[issue]-[doc-update]
```

### Success Criteria Validation
Each PR must demonstrate completion of issue success criteria:
- [ ] All acceptance criteria met
- [ ] Tests cover success criteria  
- [ ] Documentation reflects new functionality
- [ ] No regressions introduced

## Automation Configuration

### GitHub Actions Integration
```yaml
# .github/workflows/copilot-workflow.yml
name: Copilot Workflow Support

on:
  issues:
    types: [labeled]
  pull_request:
    types: [opened, synchronize]

jobs:
  auto-assign-copilot:
    if: contains(github.event.label.name, 'assign-copilot')
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Copilot Assignment
        # Implementation depends on Copilot API availability
```

### Issue Labeling for Assignment
```yaml
# Labels that trigger Copilot assignment:
- "assign-copilot" - Ready for Copilot implementation
- "copilot-in-progress" - Currently being worked on
- "copilot-review" - Implementation complete, needs review
- "copilot-blocked" - Waiting for dependencies

# Escalation workflow labels:
- "type/escalation" - Issue escalated for human intervention
- "status/escalated" - Currently in escalation review process
- "escalation/3-iteration-limit" - Agent reached maximum iteration attempts
- "escalation/technical-blocker" - Unresolvable technical dependency
- "escalation/scope-expansion" - Requirements expanded beyond estimates
- "escalation/quality-gates" - Unable to meet coverage requirements
```

## Monitoring and Metrics

### Velocity Tracking
- **Issues Completed:** Count by type and complexity
- **Time Accuracy:** Estimated vs actual implementation time
- **Quality Metrics:** Test coverage, bug rate, rework frequency
- **Dependency Resolution:** Time to resolve blocking issues
- **Escalation Metrics:** Escalation rate, resolution time, process improvements

### Escalation Dashboard
```markdown
## Weekly Escalation Performance
**Total Issues:** 45
**Escalations:** 8 (17.8% - Target: <20%)
**Escalation Breakdown:**
- 3-iteration limit: 5 (62.5%)
- Technical blockers: 2 (25%)
- Scope expansion: 1 (12.5%)

**Resolution Outcomes:**
- Revised agent approach: 3 (37.5%)
- Human takeover: 3 (37.5%)  
- Issue breakdown: 2 (25%)

**Average Resolution Time:** 45 minutes (Target: <60 min)
**Process Improvement Items:** 12 identified
**Template Updates:** 3 templates enhanced
```

### Dashboard Metrics
```markdown
## Weekly Copilot Performance
**Issues Completed:** 12 (8 feature, 3 bug, 1 docs)
**Average Time:** 18 minutes (target: 15-20)  
**Time Accuracy:** 85% within estimates
**Quality Score:** 92% (tests pass, no regressions)
**Escalations:** 2 (both scope creep, properly handled)
**Escalation Resolution:** Average 45 minutes
```

## Getting Started

### For New Issues
1. **Create Issue:** Use appropriate template
2. **Assign to Copilot:** Add `@github-copilot` mention or hashtag
3. **Monitor Progress:** Check PR creation and status
4. **Review Results:** Validate implementation meets criteria

### For Existing Issues
1. **Update Context:** Ensure issue has complete context
2. **Assign Agent:** Add Copilot mention in comments
3. **Track Progress:** Monitor branch creation and PR status

## Agent Communication Guidelines

### **Required Issue Updates**
When Copilot starts work on an issue:
```markdown
## 🚀 Implementation Started
**Branch Created:** `feature/[issue-number]-[description]`
**Approach:** [Brief description of implementation strategy]
**Estimated Completion:** [Time estimate]
```

### **Progress Updates (Optional but Encouraged)**
If implementation is complex or taking longer than expected:
```markdown
## 📊 Progress Update
**Completed:** [What's been implemented so far]
**Current Focus:** [What's being worked on now]
**Decisions Made:** [Any technical decisions or tradeoffs]
**Questions/Blockers:** [Any issues needing clarification]
**Time Used:** [X] of [Y] minutes estimated
```

### **Completion Summary (Required)**
When creating PR and closing issue:
```markdown
## ✅ Implementation Complete
**PR Created:** #[pr-number]
**Key Decisions:** [Important choices made during implementation]
**Testing:** [Tests written and results]
**Follow-up Issues:** [Any additional work identified]
**Time Used:** [Actual vs estimated time]
```

## Issue Status Management

### **Status Labels (Automated)**
GitHub issues track status through labels:

```yaml
Status Progression:
status/backlog → status/in-progress → status/code-complete → status/testing → CLOSED
                      ↓
                 status/blocked (if issues arise)
```

### **Status Transitions**
**When Copilot starts work:**
- Remove `status/backlog` 
- Add `status/in-progress`
- Comment with implementation start notice

**When PR is created:**
- Remove `status/in-progress`
- Add `status/code-complete` 
- Link PR to issue with "Closes #X"

**When testing begins:**
- Remove `status/code-complete`
- Add `status/testing`
- Validate acceptance criteria

**When issue is complete:**
- Remove all status labels
- Close issue (automatic when PR merges)

### **Blocked Issues**
If Copilot encounters blockers:
- Add `status/blocked` label
- Comment explaining the blocker
- Reference blocking dependencies

## Real-Time Agent Communication

### **Communication Gap Challenge**
GitHub Copilot agents may not monitor issue comments or label changes after starting work. We need explicit mechanisms for real-time communication.

### **Emergency Stop Mechanism**
To pause or stop an active agent:

```markdown
## 🛑 URGENT: Agent Please Stop
@github-copilot please pause work on this issue immediately.

**Reason:** [Priority change/blocking dependency/scope change/etc.]
**Next Steps:** [What agent should do - await instructions/create WIP PR/etc.]
**Estimated Impact:** [How this affects timeline]

Please acknowledge this message before continuing.
```

### **Priority/Scope Change Communication**
To communicate changes to active work:

```markdown
## 📢 UPDATED REQUIREMENTS
@github-copilot please note the following changes:

**Scope Change:** [What has changed in requirements]
**Priority Update:** [New priority level or timeline]
**Technical Change:** [New architectural decisions or constraints]

**Action Required:**
- [ ] Acknowledge receipt of changes
- [ ] Assess impact on current work
- [ ] Provide updated timeline estimate
- [ ] Proceed with updated requirements
```

### **Status Check Request**
To request immediate status from active agent:

```markdown
## 📊 STATUS CHECK REQUESTED
@github-copilot please provide immediate status update:

**Current Progress:** [What percentage complete?]
**Current Focus:** [What are you working on right now?]
**Blockers:** [Any issues encountered?]
**ETA:** [When do you expect to complete?]

Please respond within next comment cycle.
```

### **Dependency Resolution Notification**
When blocking dependencies are resolved:

```markdown
## ✅ DEPENDENCY RESOLVED
@github-copilot the following blocker has been resolved:

**Previously Blocked On:** [Description of dependency]
**Resolution:** [What was completed or changed]
**Impact on Your Work:** [How this affects current implementation]

**Action Required:**
- [ ] Remove status/blocked label if applicable
- [ ] Update implementation approach if needed
- [ ] Provide revised timeline estimate
```

### **Communication Response Expectations**
Agents should acknowledge communications within:
- **Emergency Stop:** Immediate acknowledgment required
- **Scope Changes:** Response within 1 comment cycle  
- **Status Requests:** Response within 1 comment cycle
- **Dependency Updates:** Acknowledgment and impact assessment

---

**Workflow Owner:** Technical Product Manager  
**Agent Coordination:** Automated via GitHub integration  
**Quality Assurance:** Automated testing + human review  
**Continuous Improvement:** Weekly workflow retrospectives

## Monorepo Context & Commands

### **Project Structure**
This is a Yarn Workspaces monorepo with the following structure:
```
shmup-yours/
├── package.json              # Root workspace configuration
├── backend/                   # Backend workspace
│   ├── package.json
│   └── src/
├── frontend/                  # Frontend workspace  
│   ├── package.json
│   └── src/
└── test/                      # Testing workspace
    ├── package.json
    └── e2e/
```

### **Yarn Commands Reference**
**Always use `yarn` (never `npm`) for consistency**

```bash
# Root level commands:
yarn install                   # Install all workspace dependencies
yarn dev                      # Start all workspaces in development
yarn build                    # Build all workspaces
yarn test                     # Run all tests

# Workspace-specific commands:
yarn workspace backend dev    # Backend development server
yarn workspace frontend dev   # Frontend development server
yarn workspace test run       # E2E test execution

# Add dependencies to specific workspace:
cd backend && yarn add ws      # Add WebSocket library to backend
cd frontend && yarn add axios  # Add HTTP client to frontend
```

### **Common Mistakes to Avoid**
- ❌ Don't use `npm install` - use `yarn install`
- ❌ Don't install packages at root level unless needed by all workspaces
- ❌ Don't run scripts from wrong directory - use `yarn workspace [name] [script]`
- ❌ Don't mix package managers - yarn only for consistency
