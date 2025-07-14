# Backend Test Task Template

## 🧪 Testing Objective
Clear description of what backend functionality needs to be tested.

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

## 🔗 Context Information
**Existing Test Patterns:**
```javascript
// Include examples of how tests are structured in this project
```

**Jest Configuration:**
- Any specific jest setup to be aware of
- Custom matchers or utilities

---
**Time Box:** 15-20 minutes  
**Target:** 15 minutes (escalate if consistently hitting 20+)  
**Agent Focus:** Complete backend testing with verification  
**Scope:** Comprehensive test suite for specific function/endpoint  
**Framework:** Jest  
**Prerequisites:** Backend feature implementation complete
