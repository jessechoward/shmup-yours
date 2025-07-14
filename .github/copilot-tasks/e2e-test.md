# End-to-End Test Task Template

## 🧪 E2E Testing Objective
Test complete user workflows from browser to backend and back.

## 🚀 Development Environment Setup
**Quality Gates Activation:**
```bash
# Enable Husky hooks for quality enforcement
yarn install  # Installs dependencies including hook infrastructure
yarn workspace backend install
yarn workspace frontend install

# Verify quality gates are active
yarn lint:all    # Should run ESLint across all workspaces
yarn test:all    # Should run tests (if configured)
```

**Hook Verification:**
```bash
# Test that quality gates are working
echo "console.log('test')" > temp-test-file.js
git add temp-test-file.js
git commit -m "test quality gates" --dry-run
# Should trigger linting and other quality checks
rm temp-test-file.js
```

## 🛡️ Quality Gate Compliance
**Pre-Implementation Validation:**
- [ ] Quality hooks are active and functional
- [ ] ESLint configuration is working (`yarn lint:all`)
- [ ] Test infrastructure is operational (if applicable)
- [ ] Workspace isolation is maintained (yarn workspaces)

**Common Quality Violations & Quick Fixes:**
```bash
# ESLint violations - Auto-fix most issues:
yarn workspace frontend eslint src/ --fix
yarn workspace backend eslint src/ --fix

# Package manager violations - Use yarn only:
# ❌ Don't use: npm install
# ✅ Use instead: yarn install
# ❌ Don't use: npm install <package>
# ✅ Use instead: yarn workspace test add <package>
```

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- 90% of violations have copy-paste resolution commands
- Escalate after 5 minutes if resolution unclear
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 User Flows to Test
**Primary Flow:**
```
User opens browser → Enters handle → Joins game → Sees game state → Interacts with game
```

**Test Scenarios:**
1. **Happy Path:** Complete successful user journey
2. **Error Handling:** Network failures, invalid inputs, server errors
3. **Edge Cases:** Simultaneous users, game state changes during interaction
4. **Performance:** Response times, multiple concurrent users

## 🔧 Test Implementation
**Test File Location:**
- `test/e2e/[feature-name].e2e.js`

**Test Framework:** (Playwright, Cypress, or similar)

**Test Structure:**
```javascript
describe('Game Join Flow', () => {
  beforeEach(async () => {
    // Start backend server
    // Reset game state
    // Open browser
  })

  it('should allow user to join game successfully', async () => {
    // Step-by-step user interactions
    // Assertions at each step
  })

  it('should handle join errors gracefully', async () => {
    // Test error scenarios
  })
})
```

## 📦 Test Environment
**Prerequisites:**
- Backend server running on test port
- Frontend served (dev or build)
- Clean database/state for each test
- Test data seeded if needed

**Environment Configuration:**
```javascript
// Test environment setup
const TEST_CONFIG = {
  backend_url: 'http://localhost:3001',
  frontend_url: 'http://localhost:3000',
  test_timeout: 30000
}
```

## ✅ Test Coverage
**User Interactions to Verify:**
- [ ] Page loads correctly
- [ ] Form inputs accept valid data
- [ ] Form validation shows errors for invalid data
- [ ] Submit button triggers API call
- [ ] Success response updates UI correctly
- [ ] Error response shows error message
- [ ] Real-time updates work (WebSocket events)

**System Integration Points:**
- [ ] Frontend → Backend API calls
- [ ] Backend → Database operations (if applicable)
- [ ] Backend → WebSocket events
- [ ] WebSocket → Frontend updates

## 🔍 Verification Points
**At Each Step, Verify:**
- UI state matches expectations
- Network requests sent correctly
- Backend processes requests properly
- Database state updated (if applicable)
- Real-time events triggered
- Error states handled gracefully

## 📊 Success Criteria
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (ESLint, tests, etc.)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Test Requirements:**
- [ ] All test scenarios pass
- [ ] Tests are reliable (no flakiness)
- [ ] Tests complete in under 2 minutes
- [ ] Good error messages when tests fail
- [ ] Tests can run in CI environment

**Pre-Commit Verification:**
- [ ] `git commit` completes without quality gate failures
- [ ] Hook execution time is reasonable (<30 seconds)
- [ ] All code follows project conventions automatically enforced
- [ ] No `--no-verify` flags used (unless emergency documented)

## 🔗 Dependencies
**Prerequisites:**
- All feature implementation complete
- Unit and integration tests passing
- Backend and frontend deployable
- Test environment configured

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 15-20 minutes  
**Target:** 20 minutes (escalate if consistently hitting 20+)  
**Agent Focus:** Complete end-to-end testing with verification  
**Success Metric:** Complete user workflows verified, quality hooks compliant
