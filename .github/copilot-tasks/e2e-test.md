# End-to-End Test Task Template

## 🧪 E2E Testing Objective
Test complete user workflows from browser to backend and back.

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
- [ ] All test scenarios pass
- [ ] Tests are reliable (no flakiness)
- [ ] Tests complete in under 2 minutes
- [ ] Good error messages when tests fail
- [ ] Tests can run in CI environment

## 🔗 Dependencies
**Prerequisites:**
- All feature implementation complete
- Unit and integration tests passing
- Backend and frontend deployable
- Test environment configured

---
**Time Box:** 20-30 minutes  
**Target:** 25 minutes (escalate if consistently hitting 30+)  
**Agent Focus:** Complete end-to-end testing with verification  
**Success Metric:** Complete user workflows verified
