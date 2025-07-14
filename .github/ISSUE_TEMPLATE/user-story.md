---
name: User Story
about: Define user behavior and outcomes (15-20min analysis)
title: '[Story] As a [user] I want [goal] so that [benefit]'
labels: story, planning
assignees: ''

---

## 📖 User Story
**As a** [type of user]  
**I want** [goal/need]  
**So that** [benefit/value]

## 🎯 Acceptance Criteria
- [ ] **Given** [context], **When** [action], **Then** [outcome]
- [ ] **Given** [context], **When** [action], **Then** [outcome]
- [ ] **Given** [context], **When** [action], **Then** [outcome]

## 🚫 Out of Scope
- List what this story explicitly does NOT include
- Helps prevent scope creep

## 📋 Implementation Tasks
**This story will create the following implementation issues:**
- [ ] #XXX Backend implementation (15-20min)
- [ ] #XXX Frontend implementation (15-20min)  
- [ ] #XXX Integration testing (15-20min)
- [ ] #XXX Documentation updates (15-20min)

## 📊 Success Metrics
**Setup & Quality Gates (1-2min):**
- [ ] `yarn install` completed to enable Husky hooks
- [ ] All pre-commit hooks working correctly
- [ ] Development environment ready

**Story Analysis (10-12min):**
- [ ] All acceptance criteria met
- [ ] User can complete the workflow without confusion
- [ ] Performance meets requirements (if applicable)
- [ ] Accessibility standards maintained

**Quality Validation (1-2min):**
- [ ] All Husky pre-commit hooks pass successfully
- [ ] Linting passes without errors (if code examples included)
- [ ] No hook bypasses used (unless emergency documented)
- [ ] Commit message follows conventional format

## 🔗 Dependencies
**Depends on:** (Link prerequisite stories/decisions)
- #XXX (prior story that must be complete)

**Blocks:** (Link dependent stories)
- #XXX (future story that depends on this)

---
**Estimated Total Time:** 15-20 minutes (story breakdown only)  
**Scope:** Single user story broken into implementable tasks  
**Iteration Limit:** 3 attempts maximum  
**Output:** 3-8 focused implementation tasks, each 15-20 minutes

**🔧 Husky Hook Troubleshooting**:
- **Hook timeout**: Hooks should complete within 30 seconds
- **Linting failures**: Run `yarn lint:all --fix` to auto-resolve
- **Test failures**: Fix tests before committing (no bypasses)
- **Emergency overrides**: Use `git commit --no-verify` only for critical fixes
