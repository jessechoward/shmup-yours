---
name: Frontend Feature Task
about: Implement a single UI element or interaction (15-20min)
title: '[Frontend] Brief description of feature'
labels: frontend, task, implementation
assignees: ''

---

## 🎯 Objective
Clear, one-sentence description of what UI/UX needs to be implemented.

## 📋 Dependencies
**Depends on:** (Link prerequisite issues)
- Closes #XXX (backend API)
- Requires #XXX (design decisions)

**Blocks:** (Link dependent issues)  
- #XXX (integration testing)
- #XXX (e2e testing)

## 🎨 Implementation Requirements
**Component to Create:**
- `frontend/src/components/[ComponentName].js`

**User Interaction:**
- [ ] Specific interaction 1
- [ ] Specific interaction 2

**Visual Requirements:**
- Bootstrap classes: `btn-primary`, `form-control`, etc.
- Responsive behavior: mobile/desktop specific needs
- Visual states: loading, error, success

## 📦 Context & Resources
**API Integration:**
```javascript
// Exact API call expected
fetch('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify({ data })
})
```

**Existing Patterns:**
```javascript
// Reference existing similar components
// Show patterns to follow
```

## ✅ Definition of Done
**Setup & Quality Gates (1-2min):**
- [ ] `yarn install` completed to enable Husky hooks
- [ ] All pre-commit hooks working correctly
- [ ] Development environment ready

**Implementation (5-7min):**
- [ ] Component created and renders
- [ ] User interactions implemented
- [ ] Code passes linting

**Testing (3-5min):**
- [ ] Tests written and passing
- [ ] Edge cases covered
- [ ] No test flakiness

**Verification (2-3min):**
- [ ] Manual UX verification
- [ ] Responsive design tested
- [ ] Integration verified

**Quality Validation (1-2min):**
- [ ] All Husky pre-commit hooks pass successfully
- [ ] Linting passes without errors
- [ ] No hook bypasses used (unless emergency documented)
- [ ] Commit message follows conventional format

**Documentation (3-5min):**
- [ ] Code comments added
- [ ] Usage documented
- [ ] Accessibility noted

## 🎯 Success Metrics
- [ ] Time target: 15-20 minutes
- [ ] All Definition of Done items checked
- [ ] All Husky hooks pass successfully
- [ ] Ready for PM review

**🔧 Husky Hook Troubleshooting**:
- **Hook timeout**: Hooks should complete within 30 seconds
- **Linting failures**: Run `yarn lint:all --fix` to auto-resolve
- **Test failures**: Fix tests before committing (no bypasses)
- **Emergency overrides**: Use `git commit --no-verify` only for critical fixes

---
**Estimated Time:** 15-20 minutes  
**If consistently >20min:** Break down further
