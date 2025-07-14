---
name: Backend Feature Task  
about: Implement a single API endpoint or service function (15-20min)
title: '[Backend] Brief description of feature'
labels: backend, task, implementation
assignees: ''

---

## 🎯 Objective
Clear, one-sentence description of what backend functionality needs to be implemented.

## 📋 Dependencies
**Depends on:** (Link prerequisite issues)
- Closes #XXX (architecture decisions)
- Requires #XXX (data structure definitions)

**Blocks:** (Link dependent issues)
- #XXX (frontend integration)
- #XXX (API testing)

## ⚙️ Implementation Requirements
**Code to Create:**
- `backend/src/routes/[endpoint].js`
- `backend/src/services/[service].js`

**API Contract:**
```javascript
// Exact endpoint specification
POST /api/endpoint
Request: { param1: string, param2: number }
Response: { success: boolean, data: object }
Errors: { 400: "Bad request", 409: "Conflict" }
```

**Business Logic:**
- [ ] Validation requirement 1
- [ ] Processing requirement 2
- [ ] Response requirement 3

## 📦 Context & Resources
**Existing Patterns:**
```javascript
// Show similar existing endpoints
// Error handling patterns to follow
// Logging patterns to use
```

**Dependencies:**
- External libraries needed
- Internal modules to import
- Configuration requirements

## ✅ Definition of Done
**Setup & Quality Gates (1-2min):**
- [ ] `yarn install` completed to enable Husky hooks
- [ ] All pre-commit hooks working correctly
- [ ] Development environment ready

**Implementation (5-7min):**
- [ ] Function/endpoint implemented
- [ ] Input validation included
- [ ] Error handling implemented
- [ ] Logging added (Winston)

**Testing (3-5min):**
- [ ] Unit tests written and passing
- [ ] Error case tests included
- [ ] Integration tests if needed
- [ ] Tests run without flakiness

**Verification (2-3min):**
- [ ] Manual API testing (Postman/curl)
- [ ] Performance acceptable
- [ ] No breaking changes to existing APIs
- [ ] Memory/resource usage reasonable

**Quality Validation (1-2min):**
- [ ] All Husky pre-commit hooks pass successfully
- [ ] Linting passes without errors
- [ ] No hook bypasses used (unless emergency documented)
- [ ] Commit message follows conventional format

**Documentation (3-5min):**
- [ ] Function documentation added
- [ ] API documentation updated
- [ ] Error codes documented
- [ ] Usage examples provided

## 🎯 Success Metrics
- [ ] Time target: 15-20 minutes
- [ ] All Definition of Done items checked
- [ ] All Husky hooks pass successfully
- [ ] Ready for frontend integration

**🔧 Husky Hook Troubleshooting**:
- **Hook timeout**: Hooks should complete within 30 seconds
- **Linting failures**: Run `yarn lint:all --fix` to auto-resolve
- **Test failures**: Fix tests before committing (no bypasses)
- **Emergency overrides**: Use `git commit --no-verify` only for critical fixes

---
**Estimated Time:** 15-20 minutes  
**If consistently >20min:** Break down further
