# Dependency Management Template

## 🔗 Dependency Objective
Manage execution order and data flow between related 5-minute tasks.

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
**Before Starting Dependent Task:**
- [ ] Prerequisite task marked complete
- [ ] Output format matches expected input
- [ ] Integration points verified
- [ ] Test data available

**If Dependencies Fail:**
- [ ] Block dependent tasks automatically
- [ ] Create dependency resolution task (5min)
- [ ] Update story scope if needed

---
**Time Box:** 2 minutes  
**Agent Focus:** Dependency coordination only  
**Output:** Clear execution order and data contracts
