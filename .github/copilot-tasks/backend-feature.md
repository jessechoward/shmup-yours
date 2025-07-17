# Backend Feature Task Template

## 🎯 Objective
Clear, one-sentence description of what needs to be implemented.

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

## ⚠️ Pull Request Creation Timing (CRITICAL)
**PRs must only be created after implementation is complete, all tests pass, and documentation is updated.**

**Do NOT open a PR at the start of work.**

See `.github/COPILOT_WORKFLOW.md` for authoritative rules.

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
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (ESLint, tests, etc.)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

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

**Pre-Commit Verification:**
- [ ] `git commit` completes without quality gate failures
- [ ] Hook execution time is reasonable (<30 seconds)
- [ ] All code follows project conventions automatically enforced
- [ ] No `--no-verify` flags used (unless emergency documented)

## 🔗 Handoff Information
**For Integration Agent:**
- Exact API endpoints and contracts
- Expected request/response formats
- Error conditions and handling

**For PM Review:**
- Core functionality to validate
- Performance characteristics
- Integration readiness

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 15-20 minutes total  
**Breakdown:** 7-10min implementation + 5-7min test implementation + 5-8min test execution + 3-5min documentation  
**Scope:** Single, focused functionality (one endpoint, one service method, one data operation)  
**Iteration Limit:** 3 attempts maximum (escalate if scope too large)  
**Context Requirement:** All necessary patterns, examples, and dependencies provided  
**Quality Gates:** 90% function coverage, 80% decision coverage, all tests passing, quality hooks compliant
