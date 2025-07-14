# GitHub Project Board Configuration

## Board Setup Instructions
This file provides the configuration for setting up GitHub Project Boards for optimal AI agent workflow coordination.

## Project Board: "shmup-yours Development"

### Board Structure
```
📋 Backlog → 🔄 Ready → 👷 In Progress → 🧪 Testing → ✅ Done
```

### Column Definitions

#### 📋 Backlog
**Purpose:** All identified tasks not yet ready for development  
**Automation:** New issues auto-add here  
**Entry Criteria:** Issue created with template  
**Exit Criteria:** Dependencies resolved, context complete

#### 🔄 Ready  
**Purpose:** Tasks with complete context, ready for immediate work  
**Automation:** Manual move when dependencies resolved  
**Entry Criteria:** All blockers closed, context complete, time-boxed appropriately  
**Exit Criteria:** Assigned to developer/agent and work begins

#### 👷 In Progress
**Purpose:** Currently being worked on  
**Automation:** Auto-move when PR linked to issue  
**Limit:** Maximum 3 tasks (WIP limit)  
**Entry Criteria:** Work actively started  
**Exit Criteria:** Implementation complete, ready for testing

#### 🧪 Testing
**Purpose:** Implementation complete, undergoing validation  
**Automation:** Auto-move when PR marked as "ready for review"  
**Entry Criteria:** Code complete, tests written  
**Exit Criteria:** All tests pass, acceptance criteria verified

#### ✅ Done
**Purpose:** Completed and verified tasks  
**Automation:** Auto-move when issue closes  
**Entry Criteria:** All acceptance criteria met, tests passing  
**Archive:** Auto-archive after 30 days

## Issue Labels Configuration

### Priority Labels
```yaml
priority/p0-critical:
  color: "d73a4a"
  description: "Blocking development, must fix immediately"

priority/p1-high:
  color: "f85149"
  description: "Important for current milestone"

priority/p2-medium:
  color: "ff8c00"
  description: "Standard development priority"

priority/p3-low:
  color: "ffa500"
  description: "Nice to have, future consideration"
```

### Size Labels
```yaml
size/small:
  color: "0e8a16"
  description: "15-20 minute implementation task"

size/medium:
  color: "fbca04"
  description: "30-45 minute task, may need breakdown"

size/large:
  color: "d93f0b"
  description: "60+ minutes, requires task breakdown"
```

### Type Labels
```yaml
type/backend:
  color: "1f77b4"
  description: "Backend/server development"

type/frontend:
  color: "ff7f0e"
  description: "Frontend/client development"

type/testing:
  color: "2ca02c"
  description: "Testing and quality assurance"

type/docs:
  color: "9467bd"
  description: "Documentation and knowledge capture"

type/research:
  color: "8c564b"
  description: "Technical investigation and decision"

type/infrastructure:
  color: "e377c2"
  description: "DevOps, deployment, tooling"
```

### Status Labels
```yaml
status/blocked:
  color: "b60205"
  description: "Cannot proceed due to dependencies"

status/waiting-review:
  color: "0052cc"
  description: "Awaiting code review or feedback"

status/needs-context:
  color: "5319e7"
  description: "Requires additional information"

status/in-testing:
  color: "0e8a16"
  description: "Currently undergoing validation"
```

## Automation Rules (GitHub Actions)

### Auto-Assignment Rules
```yaml
# Auto-assign based on issue type
- if: contains(github.event.issue.labels.*.name, 'type/backend')
  assign: '@backend-team'
  
- if: contains(github.event.issue.labels.*.name, 'type/frontend')  
  assign: '@frontend-team'
  
- if: contains(github.event.issue.labels.*.name, 'type/research')
  assign: '@tech-lead'
```

### Board Movement Rules
```yaml
# Move to In Progress when PR linked
- if: pull_request.linked_issues
  move_to: "In Progress"
  
# Move to Testing when PR ready for review
- if: pull_request.ready_for_review
  move_to: "Testing"
  
# Move to Done when issue closed
- if: issues.action == 'closed'
  move_to: "Done"
```

### Time-Box Monitoring
```yaml
# Alert if issue in progress > 24 hours
- if: issue.state == 'open' && issue.in_progress_time > 24h
  add_comment: "⚠️ This task has been in progress for over 24 hours. Consider breaking it down or escalating."
  add_label: "status/needs-review"
```

## Milestone Configuration

### Current Development Milestones
```yaml
milestones:
  foundation:
    title: "Foundation Phase"
    description: "Task templates, documentation, development environment"
    due_date: "2025-07-20"
    
  core-gameplay:
    title: "Core Gameplay"
    description: "Multiplayer lobby, basic game mechanics"
    due_date: "2025-08-10"
    
  multi-device:
    title: "Multi-Device Support"
    description: "Mobile responsive, touch controls, PWA"
    due_date: "2025-09-07"
    
  polish:
    title: "Polish & Experience"
    description: "Sound, effects, performance optimization"
    due_date: "2025-10-05"
```

### Milestone Progress Tracking
```markdown
## Foundation Phase Progress
- [x] Monorepo structure (Issues: #1, #2, #3)
- [x] Task template system (Issues: #4, #5, #6)
- [x] Docker environment (Issues: #7, #8)
- [ ] CI/CD pipeline (Issues: #9, #10)
- [ ] Testing framework (Issues: #11, #12)

**Progress:** 60% complete (6/10 issues)
**Blocked:** None
**At Risk:** CI/CD pipeline complexity
```

## View Configurations

### Developer Dashboard View
```yaml
filters:
  - assignee: "@me"
  - state: "open"
  - label: "-status/blocked"
sort: "priority-desc, updated-desc"
columns: ["Backlog", "Ready", "In Progress", "Testing"]
```

### Sprint Planning View  
```yaml
filters:
  - milestone: "current-sprint"
  - state: "open"
sort: "priority-desc, size-asc"
columns: ["Ready", "In Progress", "Testing", "Done"]
group_by: "type"
```

### Blocked Items View
```yaml
filters:
  - label: "status/blocked"
  - state: "open"
sort: "created-asc"
columns: ["Issue", "Blocking Reason", "Dependencies", "Age"]
```

## Maintenance Procedures

### Weekly Board Cleanup
```bash
# 1. Archive completed items > 30 days old
# 2. Review stale items in "In Progress" 
# 3. Update milestone progress tracking
# 4. Reassign orphaned issues
# 5. Clean up outdated labels and dependencies
```

### Monthly Board Review
```bash
# 1. Analyze velocity and completion rates
# 2. Adjust milestone timelines if needed
# 3. Update label descriptions and automation rules
# 4. Review and improve issue templates
# 5. Community feedback on board structure
```

## Integration with AI Agents

### Agent-Friendly Features
- **Clear Context:** All templates provide complete task context
- **Dependency Tracking:** Automated dependency resolution checking
- **Time-Boxing:** Built-in escalation for tasks exceeding limits
- **Quality Gates:** Automated testing and validation requirements
- **Handoff Documentation:** Structured results and next-steps tracking

### Agent Workflow Support
```markdown
## Agent Task Execution
1. **Pick Ready Task:** From "Ready" column, all dependencies resolved
2. **Move to In Progress:** Automatic when work begins
3. **Implementation:** Follow template guidelines and time-boxing
4. **Testing:** Move to "Testing" when implementation complete
5. **Documentation:** Update results and create follow-up issues
6. **Completion:** Auto-move to "Done" when issue closes
```

---
**Configuration Owner:** Technical Product Manager  
**Automation Maintenance:** GitHub Actions, reviewed monthly  
**Board Access:** Public for community contributors  
**Agent Integration:** Optimized for AI workflow coordination
