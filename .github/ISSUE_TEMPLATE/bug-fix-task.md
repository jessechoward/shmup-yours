---
name: Bug Fix Task
about: Fix broken functionality (15-20min focused bug fix)
title: '[Bug] Brief description of the issue'
labels: bug, task
assignees: ''

---

<!-- CONTEXT: Read .copilot-instructions.md and GAME_DESIGN.md before starting -->
<!-- ARCHITECTURE: Single-server design - see .github/copilot-context/architecture.md -->

## 🐛 Bug Description
**Issue:** #XXX (link to bug report if separate)  
**Summary:** One-sentence description of the problem

**Current Behavior:**
- What is happening now
- Specific error messages or symptoms
- Steps to reproduce the issue

**Expected Behavior:**
- What should happen instead
- Correct functionality description

## 🔍 Bug Analysis
**Root Cause Investigation:**
- [ ] **Frontend Issue:** UI, state management, user interaction
- [ ] **Backend Issue:** API, business logic, data processing
- [ ] **Integration Issue:** Frontend-backend communication
- [ ] **Configuration Issue:** Environment, dependencies, setup

**Affected Components:**
- Specific files and functions that need changes
- User workflows that are impacted
- Related functionality that might be affected

## 🔧 Fix Requirements
**Files to Modify:**
- `path/to/file1.js` - What needs to change
- `path/to/file2.js` - What needs to change

**Specific Changes:**
```javascript
// Current problematic code (if known)
function buggyFunction() {
  // problematic implementation
}

// Proposed fix approach
function fixedFunction() {
  // corrected implementation approach
}
```

## ✅ Definition of Done
**Setup & Quality Gates (1-2min):**
- [ ] `yarn install` completed to enable Husky hooks
- [ ] All pre-commit hooks working correctly
- [ ] Development environment ready

**Fix Implementation (8-12min):**
- [ ] Bug no longer occurs with original reproduction steps
- [ ] Fix doesn't break existing functionality
- [ ] Code follows existing patterns and conventions
- [ ] Error handling improved (if applicable)

**Testing Complete (3-5min):**
- [ ] All existing tests still pass
- [ ] Regression test added to prevent future occurrence
- [ ] Manual verification of fix
- [ ] Edge cases tested

**Verification Complete (2-3min):**
- [ ] Original issue completely resolved
- [ ] No new issues introduced
- [ ] Performance not negatively affected
- [ ] User experience improved

**Quality Validation (1-2min):**
- [ ] All Husky pre-commit hooks pass successfully
- [ ] Linting passes without errors
- [ ] No hook bypasses used (unless emergency documented)
- [ ] Commit message follows conventional format

**Documentation Complete (2-5min):**
- [ ] Code comments updated if needed
- [ ] Bug fix approach documented
- [ ] Any configuration changes noted

## 🎯 Success Metrics
- [ ] Time target: 15-20 minutes (single focused bug fix)
- [ ] Bug completely resolved
- [ ] No regression in existing functionality
- [ ] Prevention measures in place
- [ ] All Husky hooks pass successfully

**🔧 Husky Hook Troubleshooting**:
- **Hook timeout**: Hooks should complete within 30 seconds
- **Linting failures**: Run `yarn lint:all --fix` to auto-resolve
- **Test failures**: Fix tests before committing (no bypasses)
- **Emergency overrides**: Use `git commit --no-verify` only for critical fixes

---
**Estimated Time:** 15-20 minutes  
**Scope:** Single focused bug fix with verification  
**Iteration Limit:** 3 attempts maximum  
**Priority:** [High/Medium/Low based on impact]
