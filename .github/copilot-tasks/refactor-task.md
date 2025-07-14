# Refactor Task Template

## 🔧 Refactoring Objective
Clear description of what code needs to be improved without changing behavior.

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
- [ ] Code is more readable and maintainable
- [ ] All existing tests pass
- [ ] No breaking changes to public interfaces
- [ ] Performance is maintained or improved
- [ ] Code follows project conventions
- [ ] Complexity reduced (if applicable)
- [ ] Documentation updated (if needed)

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

---
**Time Box:** 2-4 hours (depending on complexity)  
**Agent Focus:** Code improvement only, no new features  
**Success Metric:** Cleaner code with identical behavior
