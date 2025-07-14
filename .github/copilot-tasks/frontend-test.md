# Frontend Test Task Template

## 🧪 Testing Objective
Clear description of what frontend functionality needs to be tested.

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

---
**Time Box:** 15-20 minutes  
**Target:** 15 minutes (escalate if consistently hitting 20+)  
**Agent Focus:** Complete frontend testing with verification  
**Scope:** Comprehensive test suite for specific component or function  
**Framework:** Vitest + Testing Library  
**Prerequisites:** Frontend feature implementation complete
