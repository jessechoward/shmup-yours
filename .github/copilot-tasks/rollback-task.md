# Rollback Task Template

## 🔄 Rollback Objective
Quickly revert changes that break existing functionality or don't meet quality standards.

## 📋 Rollback Trigger
**Failed Task:** #123  
**Issue Type:**
- [ ] **Breaks existing tests** - New code fails current test suite
- [ ] **Performance regression** - Significant slowdown detected
- [ ] **Integration failure** - Doesn't work with existing components
- [ ] **Quality standards** - Code doesn't meet Definition of Done

## ⚡ Rollback Scope

### **5-Minute Task Rollback (Preferred)**
```
Revert specific files changed in last 5 minutes:
- frontend/src/components/NewComponent.js
- frontend/src/styles/new-component.css
```

### **Story-Level Rollback (If Multiple Tasks Affected)**
```
Revert all changes from current story:
- All implementation tasks
- All test modifications
- Documentation updates
```

## 🔧 Rollback Execution
**Git Commands:**
```bash
# For single task rollback
git checkout HEAD~1 -- frontend/src/components/NewComponent.js

# For story rollback  
git revert <story-start-commit>..<current-commit>
```

**Verification Steps:**
- [ ] All existing tests pass
- [ ] No console errors
- [ ] Performance baseline restored
- [ ] Integration points working

## 📋 Post-Rollback Analysis
**Root Cause (30 seconds):**
- [ ] **Scope too large** - Task was bigger than 5 minutes
- [ ] **Incomplete context** - Missing information in task
- [ ] **Requirements unclear** - Success criteria ambiguous
- [ ] **Technical complexity** - Unexpected implementation challenges

**Next Steps:**
- [ ] **Break down task** - Create smaller, clearer tasks
- [ ] **Add context** - Include missing patterns/examples
- [ ] **Clarify requirements** - Define success criteria better
- [ ] **Research needed** - Technical approach needs validation

## ✅ Rollback Success
- [ ] System restored to working state
- [ ] Root cause identified
- [ ] Improved task created for retry
- [ ] Team learns from failure

---
**Time Box:** 3 minutes  
**Agent Focus:** Quick revert and analysis only  
**Output:** Working system + improved task for retry
