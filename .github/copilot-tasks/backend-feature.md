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
**Implementation Complete (5-7min):**
- [ ] Function/endpoint implemented as specified
- [ ] Follows existing code patterns and conventions
- [ ] Error handling included
- [ ] Logging added (using Winston)
- [ ] Input validation implemented
- [ ] Code passes linting (ESLint)

**Testing Complete (3-5min):**
- [ ] Unit tests written and passing
- [ ] Error case tests included
- [ ] Integration tests if needed
- [ ] Tests run without flakiness

**Verification Complete (2-3min):**
- [ ] Manual API testing (Postman/curl)
- [ ] Performance acceptable
- [ ] No breaking changes to existing APIs
- [ ] Memory/resource usage reasonable

**Documentation Complete (3-5min):**
- [ ] Function documentation added
- [ ] API documentation updated
- [ ] Error codes documented
- [ ] Usage examples provided

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
**Time Box:** 15-20 minutes  
**Target:** 15 minutes (escalate if consistently hitting 20+)  
**Agent Focus:** Complete backend implementation with testing  
**Scope:** Single endpoint, function, or service method with full verification  
**Dependencies:** Link to prerequisite GitHub issues  
**Next Tasks:** Frontend integration, PM review
