# Backend Feature Task Template

## 🎯 Objective
Clear, one-sentence description of what needs to be implemented.

## 📋 Scope & Requirements
**User Story Link:** #123  
**Specific Functionality:**
- Exact endpoints, methods, or functions to implement
- Input/output specifications
- Data structures and schemas

## 🔧 Technical Specifications
**Files to Create/Modify:**
- `backend/src/routes/[specific-file].js`
- `backend/src/services/[specific-file].js`
- `backend/src/models/[specific-file].js`

**API Contract:**
```javascript
// Example endpoint specification
POST /api/game/join
Request: { handle: string, sessionId?: string }
Response: { playerId: string, gameState: GameState }
Errors: { 400: "Invalid handle", 409: "Game full" }
```

**Dependencies:**
- External libraries needed
- Internal modules to import
- Database schemas (if applicable)

## 📦 Context & Resources
**Existing Code to Reference:**
```javascript
// Include relevant existing code snippets
// Show patterns to follow
```

**Related Files:**
- List files that provide context or patterns
- Include relevant function signatures

## ✅ Definition of Done
**Implementation (7-10min):**
- [ ] Function/endpoint implemented as specified
- [ ] Follows existing code patterns and conventions
- [ ] Error handling included
- [ ] Logging added (using Winston structured format)
- [ ] Input validation implemented
- [ ] Code passes linting (ESLint)

**Test Implementation (5-7min):**
- [ ] Unit tests written and passing
- [ ] Error case tests included
- [ ] Edge case coverage
- [ ] Mocks/stubs properly configured

**Test Execution (5-8min):**
- [ ] All tests pass consistently
- [ ] Code coverage meets requirements (90% function, 80% decision)
- [ ] Performance testing if applicable
- [ ] No test flakiness

**Documentation (3-5min):**
- [ ] Function/API documentation added
- [ ] Error codes and responses documented
- [ ] Usage examples provided
- [ ] Code comments for complex logic

## 🔗 Handoff Information
**For Integration Agent:**
- Exact API endpoints and contracts
- Expected request/response formats
- Error conditions and handling

**For PM Review:**
- Core functionality to validate
- Performance characteristics
- Integration readiness

---
**Time Box:** 15-20 minutes total  
**Breakdown:** 7-10min implementation + 5-7min test implementation + 5-8min test execution + 3-5min documentation  
**Scope:** Single, focused functionality (one endpoint, one service method, one data operation)  
**Iteration Limit:** 3 attempts maximum (escalate if scope too large)  
**Context Requirement:** All necessary patterns, examples, and dependencies provided  
**Quality Gates:** 90% function coverage, 80% decision coverage, all tests passing
