---
name: E2E Test Task
about: Test complete user workflows (15-20min focused testing)
title: '[E2E] Test [complete user workflow]'
labels: testing, e2e, task
assignees: ''

---

## 🧪 E2E Testing Objective
Test complete user workflows from browser to backend and back.

## 📋 Dependencies
**Depends on:** (All components must be complete)
- Closes #XXX (backend implementation)
- Closes #XXX (frontend implementation)
- Closes #XXX (integration testing)

**User Flows to Test:**
**Primary Flow:**
```
User opens browser → Enters handle → Joins game → Sees game state → Interacts with game
```

**Test Scenarios:**
1. **Happy Path:** Complete successful user journey
2. **Error Handling:** Network failures, invalid inputs, server errors
3. **Edge Cases:** Simultaneous users, game state changes during interaction

## 🔧 Test Implementation Requirements
**Test Framework:** [Playwright/Cypress/other as per project standards]

**Test Environment Setup:**
- Backend server running on test port
- Frontend served (dev or build)
- Clean database/state for each test
- Test data seeded if needed

**Test Structure:**
```javascript
describe('Game Join Flow', () => {
  beforeEach(async () => {
    // Environment setup steps
  })

  it('should allow user to join game successfully', async () => {
    // Step-by-step user interactions
    // Assertions at each step
  })
})
```

## ✅ Definition of Done
**Setup & Quality Gates (1-2min):**
- [ ] `yarn install` completed to enable Husky hooks
- [ ] All pre-commit hooks working correctly
- [ ] Development environment ready

**Test Implementation (10-15min):**
- [ ] E2E test file created
- [ ] All user scenarios covered
- [ ] Test environment properly configured
- [ ] Test data and mocks set up

**Test Execution (5-8min):**
- [ ] All tests run and pass
- [ ] Tests are reliable (no flakiness)
- [ ] Error scenarios properly validated
- [ ] Performance within acceptable limits

**Verification Complete (3-5min):**
- [ ] Manual verification of test coverage
- [ ] Edge cases properly tested
- [ ] Test output provides clear feedback
- [ ] Tests can run in CI environment

**Quality Validation (1-2min):**
- [ ] All Husky pre-commit hooks pass successfully
- [ ] Linting passes without errors
- [ ] No hook bypasses used (unless emergency documented)
- [ ] Commit message follows conventional format

**Documentation Complete (2-3min):**
- [ ] Test purpose and scope documented
- [ ] Setup instructions clear
- [ ] Known limitations noted
- [ ] Maintenance notes added

## 🔍 Coverage Requirements
**User Interactions to Verify:**
- [ ] Page loads correctly
- [ ] Form inputs accept valid data
- [ ] Form validation shows errors for invalid data
- [ ] Submit actions trigger correct API calls
- [ ] Success responses update UI correctly
- [ ] Error responses show appropriate messages
- [ ] Real-time updates work (WebSocket events)

## 🎯 Success Metrics
- [ ] Time target: 15-20 minutes (single user workflow)
- [ ] Complete user workflows verified
- [ ] All test scenarios pass consistently
- [ ] Ready for deployment confidence
- [ ] All Husky hooks pass successfully

**🔧 Husky Hook Troubleshooting**:
- **Hook timeout**: Hooks should complete within 30 seconds
- **Linting failures**: Run `yarn lint:all --fix` to auto-resolve
- **Test failures**: Fix tests before committing (no bypasses)
- **Emergency overrides**: Use `git commit --no-verify` only for critical fixes

---
**Estimated Time:** 15-20 minutes  
**Scope:** Single complete user workflow with verification  
**Iteration Limit:** 3 attempts maximum  
**Success Criteria:** Full user workflow validation
