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
**Monorepo Context:** Use Yarn Workspaces commands consistently
```bash
# Work in frontend workspace:
cd frontend && yarn install      # Install dependencies
yarn workspace frontend dev     # Run development server
yarn workspace frontend build   # Build for production  
yarn workspace frontend test    # Run tests
```

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

**Documentation (3-5min):**
- [ ] Code comments added
- [ ] Usage documented
- [ ] Accessibility noted

## 🎯 Success Metrics
- [ ] Time target: 15-20 minutes
- [ ] All Definition of Done items checked
- [ ] Ready for PM review

---
**Estimated Time:** 15-20 minutes  
**If consistently >20min:** Break down further
