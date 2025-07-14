# Backend Test Task Template

## 🧪 Testing Objective
Clear description of what backend functionality needs to be tested.

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
# ✅ Use instead: yarn workspace backend add <package>
```

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- 90% of violations have copy-paste resolution commands
- Escalate after 5 minutes if resolution unclear
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 Code Under Test
**Implementation Reference:** (Link to backend feature task)  
**Files to Test:**
- `backend/src/routes/[specific-file].js`
- `backend/src/services/[specific-file].js`
- `backend/src/models/[specific-file].js`

**Functions/Methods:**
```javascript
// List exact functions to test with signatures
function joinGame(handle, sessionId) { ... }
POST /api/game/join
```

## 🔧 Test Specifications
**Test File Location:**
- `backend/test/[module-name].test.js`

**Test Categories:**
- [ ] **Unit Tests** - Individual functions in isolation
- [ ] **Integration Tests** - API endpoints with real dependencies
- [ ] **Error Handling** - Invalid inputs and edge cases

**Specific Test Cases:**
```javascript
describe('joinGame', () => {
  it('should create new player with valid handle')
  it('should reject invalid handles')
  it('should handle duplicate joins')
  it('should enforce game capacity limits')
})
```

## 📦 Test Context & Setup
**Dependencies to Mock:**
- Database calls
- External API calls
- WebSocket connections

**Test Data:**
```javascript
// Provide exact test data to use
const mockGameState = {
  id: 'game-123',
  players: [],
  status: 'waiting'
}
```

**Setup Requirements:**
- Database seeds (if applicable)
- Mock configurations
- Environment variables

## ✅ Test Coverage Requirements
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (ESLint, tests, etc.)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Coverage Requirements:**
- [ ] All happy path scenarios
- [ ] All error conditions
- [ ] Input validation
- [ ] Edge cases (empty inputs, large inputs, etc.)
- [ ] Authentication/authorization (if applicable)
- [ ] Logging verification
- [ ] Performance considerations (if applicable)

## 📊 Success Criteria
- [ ] All tests pass
- [ ] Code coverage > 80% for tested modules
- [ ] Tests run in under 30 seconds
- [ ] No test flakiness
- [ ] Clear test descriptions
- [ ] Follows existing test patterns

**Pre-Commit Verification:**
- [ ] `git commit` completes without quality gate failures
- [ ] Hook execution time is reasonable (<30 seconds)
- [ ] All code follows project conventions automatically enforced
- [ ] No `--no-verify` flags used (unless emergency documented)

## 🔗 Context Information
**Existing Test Patterns:**
```javascript
// Include examples of how tests are structured in this project
```

**Jest Configuration:**
- Any specific jest setup to be aware of
- Custom matchers or utilities

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 15-20 minutes  
**Target:** 15 minutes (escalate if consistently hitting 20+)  
**Agent Focus:** Complete backend testing with verification  
**Scope:** Comprehensive test suite for specific function/endpoint  
**Framework:** Jest  
**Prerequisites:** Backend feature implementation complete, quality hooks compliant
