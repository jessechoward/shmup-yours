# Dependency Management Template

## 🔗 Dependency Objective
Manage execution order and data flow between related 5-minute tasks.

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

## 🛡️ Quality Gate Compliance
**Pre-Coordination Validation:**
- [ ] Quality hooks are active and functional
- [ ] Documentation tools are available
- [ ] Workspace isolation is maintained (yarn workspaces)

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 Task Dependencies
**Primary Task:** #123 [Backend API implementation]  
**Dependent Tasks:** 
- #124 [Frontend component that calls API]
- #125 [Integration test that verifies flow]

## ⚡ Execution Strategy

### **Sequential Dependencies (Must Complete in Order)**
```
Task A (Backend) → Output: API contract + test data
     ↓
Task B (Frontend) → Input: API contract + test data
     ↓  
Task C (Integration) → Input: Both components working
```

### **Parallel Opportunities (Can Run Simultaneously)**
```
Task A (Backend) ← Independent → Task D (Documentation)
Task B (Frontend) ← Independent → Task E (Backend Tests)
```

## 🔧 Handoff Specifications
**From Backend Task to Frontend Task:**
```javascript
// Exact output format expected
const apiResponse = {
  success: true,
  data: { playerId: "123", gameState: {...} },
  errors: []
}
```

**From Implementation to Testing:**
```javascript
// Exact functions/components to test
function joinGame(handle) { ... }
component GameJoinButton { ... }
```

## ✅ Dependency Validation
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (documentation linting, etc.)
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Before Starting Dependent Task:**
- [ ] Prerequisite task marked complete
- [ ] Output format matches expected input
- [ ] Integration points verified
- [ ] Test data available

**If Dependencies Fail:**
- [ ] Block dependent tasks automatically
- [ ] Create dependency resolution task (5min)
- [ ] Update story scope if needed

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 2 minutes  
**Agent Focus:** Dependency coordination only  
**Output:** Clear execution order and data contracts, quality hooks compliant
