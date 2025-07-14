# Bug Fix Task Template

## 🐛 Bug Description
**Issue:** #123 (link to bug report)  
**Summary:** One-sentence description of the problem

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

**Current Behavior:**
- What is happening now
- Specific error messages or symptoms
- Steps to reproduce

**Expected Behavior:**
- What should happen instead
- Correct functionality description

## 🔍 Bug Analysis
**Root Cause Investigation:**
- [ ] **Frontend Issue:** UI, state management, user interaction
- [ ] **Backend Issue:** API, business logic, data processing
- [ ] **Integration Issue:** Frontend-backend communication
- [ ] **Configuration Issue:** Environment, dependencies, setup

**Affected Components:**
- Specific files and functions
- User workflows impacted
- Related functionality that might be affected

## 🔧 Fix Specifications
**Files to Modify:**
- `path/to/file1.js` - What needs to change
- `path/to/file2.js` - What needs to change

**Specific Changes:**
```javascript
// Current problematic code
function buggyFunction() {
  // problematic implementation
}

// Proposed fix
function fixedFunction() {
  // corrected implementation
}
```

**Testing Strategy:**
- How to verify the fix works
- Regression testing needed
- Edge cases to check

## 📦 Context & Constraints
**Existing Code Context:**
```javascript
// Include relevant surrounding code
// Show patterns to follow
// Highlight integration points
```

**Constraints:**
- No breaking changes allowed
- Backward compatibility requirements
- Performance considerations
- Security implications

## ✅ Definition of Done
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (ESLint, tests, etc.)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Bug Resolution:**
- [ ] Bug no longer occurs with original reproduction steps
- [ ] Fix doesn't break existing functionality
- [ ] All existing tests still pass
- [ ] New test added to prevent regression (if appropriate)
- [ ] Code follows existing patterns and conventions
- [ ] Error handling improved (if applicable)

**Pre-Commit Verification:**
- [ ] `git commit` completes without quality gate failures
- [ ] Hook execution time is reasonable (<30 seconds)
- [ ] All code follows project conventions automatically enforced
- [ ] No `--no-verify` flags used (unless emergency documented)

## 🧪 Verification Steps
**Manual Testing:**
1. Reproduce original issue (should fail)
2. Apply fix
3. Verify issue is resolved
4. Test related functionality
5. Test edge cases

**Automated Testing:**
- Run existing test suite
- Add regression test if needed
- Verify CI pipeline passes

## 🔗 Related Information
**Similar Issues:**
- Link to related bugs or patterns
- Previous fixes for similar problems

**Documentation Updates:**
- Any docs that need updating
- Code comments to add/modify

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 1-3 hours (depending on complexity)  
**Agent Focus:** Bug fix only, no feature additions  
**Priority:** Based on bug severity and impact
**Quality Gates:** All tests passing, quality hooks compliant
