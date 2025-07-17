# Quick Reference Guide

## Project Structure & Documentation
**Strategic Planning:** `ROADMAP.md`, `VERSION.md`, `DESIGN.md`  
**Development Process:** `CONTRIBUTING.md`, `.github/PROJECT_MANAGEMENT.md`  
**Task Templates:** `.github/copilot-tasks/` directory  
**Issue Templates:** `.github/ISSUE_TEMPLATE/` directory

## Task Template System

### Available Task Templates
```bash
.github/copilot-tasks/
├── user-story.md           # Feature requirements with acceptance criteria
├── research-task.md        # Technical investigation (30min research pattern)
├── implementation-backend.md  # Backend development tasks (15-20min)
├── implementation-frontend.md # Frontend development tasks (15-20min)
├── testing-unit.md         # Unit testing and validation
├── testing-integration.md  # Integration and E2E testing
├── documentation.md        # Technical writing and knowledge capture
├── bug-fix.md             # Issue resolution with reproduction steps
├── performance.md         # Optimization and performance tasks
├── security.md            # Security analysis and implementation
├── infrastructure.md      # DevOps and deployment tasks
└── quality-assurance.md   # Code review and quality tasks
```

### Time-Boxing Guidelines
- **Implementation Tasks:** 15-20 minutes including testing and documentation
- **Research Tasks:** 30-20-10 pattern (research-challenge-decision)
- **Bug Fixes:** 10-15 minutes for isolation and resolution
- **Documentation:** 10 minutes for updates, 20 for new sections
- **Testing:** 15 minutes including setup, execution, and verification

### Usage Pattern
```bash
# 1. Copy template to new issue
cp .github/copilot-tasks/implementation-backend.md new-task.md

# 2. Fill in context, objectives, and success criteria
# 3. Create GitHub issue using appropriate template
# 4. Link dependencies and add to project board
# 5. Execute task with AI agent assistance
```

## GitHub Project Management

### Issue Creation Workflow
1. **Select Template:** Use `.github/ISSUE_TEMPLATE/` for structured context
2. **Add Dependencies:** Link blocking/blocked issues with GitHub syntax
3. **Assign Labels:** Priority, size, type, and status labels
4. **Project Board:** Auto-add to appropriate project board column
5. **Time-Box:** Verify task fits 15-20 minute implementation window

### Dependency Management
```markdown
## Dependencies
- Depends on: #123 (Backend API endpoints must be complete)
- Blocks: #456 (Frontend integration testing)
- Related: #789 (Performance optimization research)
```

### Project Board Structure
```
📋 Backlog → 🔄 Ready → 👷 In Progress → 🧪 Testing → ✅ Done
```

**Ready Criteria:** Complete context, no blocking dependencies  
**In Progress Limit:** Maximum 3 tasks to maintain focus  
**Testing Requirements:** All acceptance criteria verified  
**Done Definition:** Implemented, tested, documented, ready for integration

## Common Workflows

### New Feature Development
```bash
# 1. Create user story issue
# 2. Break into research + implementation tasks
# 3. Create GitHub issues with templates
# 4. Link dependencies between tasks
# 5. Execute in dependency order
# 6. Update VERSION.md with progress
```

### Bug Fix Process
```bash
# 1. Reproduce issue and document steps
# 2. Create bug-fix issue with template
# 3. Time-box investigation to 10 minutes
# 4. Implement fix with tests
# 5. Verify fix resolves original issue
# 6. Update any related documentation
```

### Research & Technical Decisions
```bash
# 1. Use research-task template
# 2. 30 minutes: Investigate options
# 3. 20 minutes: Identify challenges/tradeoffs
# 4. 10 minutes: Make decision and document in DESIGN.md
# 5. Create follow-up implementation issues
```

## Quality Assurance

### Before Starting Any Task
- [ ] All dependencies closed or verified
- [ ] Complete context provided in issue
- [ ] Success criteria clearly defined
- [ ] Time-box appropriate for task scope
- [ ] Testing approach identified

### Before Closing Any Task
- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Documentation updated if needed
- [ ] No new bugs or regressions introduced
- [ ] Follow-up issues created if scope expanded

### Escalation Triggers
- **Time Overrun:** >20 minutes on implementation task
- **Scope Creep:** Requirements expand beyond original issue
- **Quality Issues:** Tests failing or bugs discovered
- **Dependency Problems:** Blocking issues not properly resolved

## Development Environment

### Quick Start
```bash
# Clone and setup
git clone [repo-url]
cd shmup-yours
yarn install

# Development environment
docker-compose up -d
# Backend server (if available) 
cd frontend && yarn dev     # Start frontend dev server
yarn test:all       # Run full test suite (if available)
```

### Useful Commands
```bash
# Task management
yarn tasks:list           # Show available task templates
yarn tasks:create [type]  # Create new task from template

# Development
# yarn workspace @shmup-yours/backend dev      # Backend development server (if available)
yarn workspace @shmup-yours/frontend dev    # Frontend development server
# yarn workspace @shmup-yours/test run        # E2E test execution (if available)

# Quality assurance
yarn lint:all              # Lint all workspaces
yarn test:unit             # Unit tests only
yarn test:integration      # Integration tests only
```

## AI Agent Coordination

### Optimal Task Handoff
```markdown
## Task Results
**Objective:** [What was accomplished]
**Implementation:** [Key decisions and code changes]
**Testing:** [Tests written and results]
**Edge Cases:** [Any issues discovered]
**Next Steps:** [Follow-up tasks needed]
```

### Context Preservation
- **Always include:** Full context in task description
- **Link related:** Previous tasks and decisions
- **Document assumptions:** Any assumptions made during implementation
- **Identify follow-up:** Additional work discovered during task execution

### Error Recovery
```bash
# If task fails or exceeds time-box:
# 1. Document what was attempted
# 2. Identify specific blocking issue
# 3. Create smaller, more focused tasks
# 4. Update dependencies and try again
```

## Project Status Tracking

### Weekly Review Process
1. **Update VERSION.md:** Current state, progress, blockers
2. **Review Project Board:** Move stale tasks, update priorities
3. **Clean GitHub Issues:** Close completed, update stale issues
4. **Assess Roadmap:** Adjust feature pipeline based on progress
5. **Community Update:** Post progress summary if applicable

### Progress Metrics
- **Velocity:** Issues completed per week by type and size
- **Quality:** Bug rate, rework frequency, test coverage
- **Dependencies:** Average resolution time for blocking issues
- **Scope:** Feature creep rate, time-box adherence

---
**Last Updated:** 2025-07-13  
**Next Review:** Weekly during development, monthly for templates  
**Maintenance:** Technical Product Manager  
**Community:** Public project boards and issue templates
