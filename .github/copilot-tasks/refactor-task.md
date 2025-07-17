# Refactor Task Template

## 🔧 Refactoring Objective
Clear description of what code needs to be improved without changing behavior.

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

## ⚠️ Pull Request Creation Timing (CRITICAL)
**PRs must only be created after implementation is complete, all tests pass, and documentation is updated.**

**Do NOT open a PR at the start of work.**

See `.github/COPILOT_WORKFLOW.md` for authoritative rules.

**Common Quality Violations & Quick Fixes:**
```bash
# ESLint violations - Auto-fix most issues:
yarn workspace frontend eslint src/ --fix
yarn workspace backend eslint src/ --fix

# Package manager violations - Use yarn only:
# ❌ Don't use: npm install
# ✅ Use instead: yarn install
```

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- 90% of violations have copy-paste resolution commands
- Escalate after 5 minutes if resolution unclear
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 Refactoring Scope
**Code to Refactor:**
- `path/to/file.js` - Specific functions or classes
- `path/to/another.js` - Code patterns to improve

**Type of Refactoring:**
- [ ] **Extract Function** - Break down large functions
- [ ] **Rename Variables/Functions** - Improve clarity
- [ ] **Remove Duplication** - Consolidate repeated code
- [ ] **Simplify Logic** - Reduce complexity
- [ ] **Improve Performance** - Optimize without behavior change
- [ ] **Update Dependencies** - Upgrade libraries or versions

## 🎯 Improvement Goals
**Code Quality Improvements:**
- Readability and maintainability
- Performance optimizations
- Reduce technical debt
- Better error handling
- Improved testability

**Specific Issues to Address:**
```javascript
// Example of current problematic code
function complexFunction(data) {
  // 50+ lines of mixed concerns
  // Hard to understand and test
}

// Goal: Break into smaller, focused functions
function processData(data) { ... }
function validateInput(data) { ... }
function formatOutput(result) { ... }
```

## 🔧 Refactoring Plan
**Step-by-Step Approach:**
1. **Analyze Current Code** - Understand existing behavior
2. **Write/Update Tests** - Ensure behavior preservation
3. **Apply Refactoring** - Make incremental changes
4. **Verify Tests Pass** - Confirm no behavior changes
5. **Update Documentation** - Reflect any API changes

**Safety Measures:**
- All existing tests must pass
- No breaking changes to public APIs
- Incremental changes with frequent testing
- Rollback plan if issues arise

## 📦 Context & Constraints
**Current Implementation:**
```javascript
// Include current code to be refactored
// Show the full context and complexity
```

**Constraints:**
- No behavior changes allowed
- Maintain backward compatibility
- Follow existing code patterns
- Consider performance implications

**Dependencies:**
- Other code that depends on this module
- External APIs or contracts to maintain
- Test coverage requirements

## ✅ Definition of Done
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (ESLint, tests, etc.)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Refactoring Success:**
- [ ] Code is more readable and maintainable
- [ ] All existing tests pass
- [ ] No breaking changes to public interfaces
- [ ] Performance is maintained or improved
- [ ] Code follows project conventions
- [ ] Complexity reduced (if applicable)
- [ ] Documentation updated (if needed)

**Pre-Commit Verification:**
- [ ] `git commit` completes without quality gate failures
- [ ] Hook execution time is reasonable (<30 seconds)
- [ ] All code follows project conventions automatically enforced
- [ ] No `--no-verify` flags used (unless emergency documented)

## 🧪 Testing Strategy
**Verification Approach:**
- Run full test suite before changes
- Run tests after each incremental change
- Add tests if coverage gaps discovered
- Manual testing of affected functionality

**Regression Prevention:**
- All existing behavior preserved
- API contracts maintained
- Integration points verified

## 🔗 Related Information
**Technical Debt Context:**
- Why this refactoring is needed
- Impact on future development
- Benefits for maintainability

**Related Refactoring:**
- Other areas that might benefit from similar improvements
- Dependencies that might need updating

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 2-4 hours (depending on complexity)  
**Agent Focus:** Code improvement only, no new features  
**Success Metric:** Cleaner code with identical behavior, quality hooks compliant
