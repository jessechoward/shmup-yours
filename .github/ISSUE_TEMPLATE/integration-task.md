---
name: Integration Task
about: Connect frontend and backend components (15-20min)
title: '[Integration] Connect [frontend] to [backend]'
labels: integration, task
assignees: ''

---

## 🔗 Integration Objective
Clear description of how frontend and backend components need to connect.

## 📋 Dependencies
**Depends on:** (Must be complete before starting)
- Closes #XXX (backend implementation)
- Closes #XXX (frontend implementation)

**Blocks:** (Issues waiting for this)
- #XXX (e2e testing)
- #XXX (next feature)

## 🔧 Integration Requirements
**Components to Connect:**
- Backend API: `POST /api/endpoint`
- Frontend Component: `ComponentName.js`
- Data Flow: User action → API call → UI update

**Verification Points:**
- [ ] API call succeeds with valid data
- [ ] Error responses handled properly
- [ ] UI updates correctly on success
- [ ] Loading states work appropriately
- [ ] WebSocket events (if applicable) function correctly

## 📦 Context & Resources
**API Contract:**
```javascript
// Expected request/response format
const request = { param: value };
const response = { success: true, data: {...} };
const errors = { 400: "Bad request", 409: "Conflict" };
```

**Frontend Integration Points:**
```javascript
// How frontend should call the API
// Error handling patterns
// State management updates
```

## ✅ Definition of Done
**Setup & Quality Gates (1-2min):**
- [ ] `yarn install` completed to enable Husky hooks
- [ ] All pre-commit hooks working correctly
- [ ] Development environment ready

**Integration Complete (8-10min):**
- [ ] Frontend successfully calls backend API
- [ ] Data flows correctly end-to-end
- [ ] Error cases handled appropriately
- [ ] No breaking changes to existing functionality

**Testing Complete (3-5min):**
- [ ] Manual end-to-end testing completed
- [ ] Error scenarios verified
- [ ] Performance acceptable
- [ ] No console errors or network issues

**Verification Complete (2-3min):**
- [ ] User workflow works as expected
- [ ] Edge cases function properly
- [ ] Integration doesn't affect other features
- [ ] Ready for PM review

**Quality Validation (1-2min):**
- [ ] All Husky pre-commit hooks pass successfully
- [ ] Linting passes without errors
- [ ] No hook bypasses used (unless emergency documented)
- [ ] Commit message follows conventional format

**Documentation Complete (2-3min):**
- [ ] Integration points documented
- [ ] Error handling patterns noted
- [ ] Any configuration changes documented

## 🎯 Success Metrics
- [ ] Time target: 15-20 minutes
- [ ] End-to-end user flow works correctly
- [ ] All Definition of Done items checked
- [ ] All Husky hooks pass successfully
- [ ] Ready for e2e testing

**🔧 Husky Hook Troubleshooting**:
- **Hook timeout**: Hooks should complete within 30 seconds
- **Linting failures**: Run `yarn lint:all --fix` to auto-resolve
- **Test failures**: Fix tests before committing (no bypasses)
- **Emergency overrides**: Use `git commit --no-verify` only for critical fixes

---
**Estimated Time:** 15-20 minutes  
**If consistently >20min:** Break down API and UI integration separately
