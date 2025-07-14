# Frontend Test Task Template

## 🧪 Testing Objective
Clear description of what frontend functionality needs to be tested.

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
# ✅ Use instead: yarn workspace frontend add <package>
```

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- 90% of violations have copy-paste resolution commands
- Escalate after 5 minutes if resolution unclear
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 Components Under Test
**Implementation Reference:** (Link to frontend feature task)  
**Components to Test:**
- `frontend/src/components/[ComponentName].js`
- `frontend/src/utils/[UtilityName].js`

**User Interactions:**
```javascript
// List specific user flows to test
// - Button clicks
// - Form submissions  
// - Keyboard interactions
// - Canvas interactions (if applicable)
```

## 🔧 Test Specifications
**Test File Location:**
- `frontend/test/components/[ComponentName].test.js`

**Test Categories:**
- [ ] **Component Rendering** - DOM structure and content
- [ ] **User Interactions** - Click handlers, form submissions
- [ ] **State Management** - Component state changes
- [ ] **API Integration** - Mocked backend calls

**Specific Test Cases:**
```javascript
describe('GameJoinComponent', () => {
  it('should render join form correctly')
  it('should validate handle input')
  it('should call join API on submit')
  it('should show error message on API failure')
  it('should disable submit while loading')
})
```

## 📦 Test Context & Setup
**API Mocks:**
```javascript
// Provide exact mock responses
const mockJoinResponse = {
  playerId: 'player-123',
  gameState: { ... }
}
```

**DOM Setup:**
- Required HTML structure
- CSS classes needed for testing
- Canvas context (if applicable)

**Test Utilities:**
- Custom render functions
- Event simulation helpers
- Mock implementations

## ✅ Test Coverage Requirements
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (ESLint, tests, etc.)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Test Coverage:**
- [ ] All component states rendered correctly
- [ ] All user interactions trigger expected behavior
- [ ] Error states display properly
- [ ] Loading states work correctly
- [ ] Responsive behavior (if applicable)
- [ ] Accessibility attributes present
- [ ] API calls made with correct parameters

## 📊 Success Criteria
- [ ] All tests pass
- [ ] Components render without warnings
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
// Include examples of how component tests are structured
```

**Vitest Configuration:**
- Any specific Vitest setup
- Custom matchers or utilities
- jsdom configuration

**Testing Library Usage:**
- Preferred queries (@testing-library/dom)
- Event simulation patterns
- Best practices for this project

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 15-20 minutes  
**Target:** 15 minutes (escalate if consistently hitting 20+)  
**Agent Focus:** Complete frontend testing with verification  
**Scope:** Comprehensive test suite for specific component or function  
**Framework:** Vitest + Testing Library  
**Prerequisites:** Frontend feature implementation complete, quality hooks compliant
