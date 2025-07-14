# Bug Fix Task Template

## 🐛 Bug Description
**Issue:** #123 (link to bug report)  
**Summary:** One-sentence description of the problem

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
- [ ] Bug no longer occurs with original reproduction steps
- [ ] Fix doesn't break existing functionality
- [ ] All existing tests still pass
- [ ] New test added to prevent regression (if appropriate)
- [ ] Code follows existing patterns and conventions
- [ ] Error handling improved (if applicable)

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

---
**Time Box:** 1-3 hours (depending on complexity)  
**Agent Focus:** Bug fix only, no feature additions  
**Priority:** Based on bug severity and impact
