# Frontend Feature Task Template

## 🎯 Objective
Clear, one-sentence description of what UI/UX needs to be implemented.

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
**Pre-Implementation Validation:**
- [ ] Quality hooks are active and functional
- [ ] ESLint configuration is working (`yarn lint:all`)
- [ ] Test infrastructure is operational (if applicable)
- [ ] Workspace isolation is maintained (yarn workspaces)

**Common Quality Violations & Quick Fixes:**
```bash
# ESLint violations - Auto-fix most issues:
yarn workspace frontend eslint src/ --fix
yarn workspace backend eslint src/ --fix

# Package manager violations - Use yarn only:
# ❌ Don't use: npm install
# ✅ Use instead: yarn install
# ❌ Don't use: npm install <package>
# ✅ Use instead: yarn workspace frontend add <package>
```

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- 90% of violations have copy-paste resolution commands
- Escalate after 5 minutes if resolution unclear
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 Scope & Requirements
**User Story Link:** #123  
**Product Requirements (from PM):**
- Core user experience goals
- Key user interactions required
- Visual/aesthetic direction
- Success metrics (user engagement, ease of use)

**Technical Functionality:**
- UI components to create/modify
- User interaction workflows
- Performance requirements

## 🎨 Design Specifications
**Components to Implement:**
- `frontend/src/components/[ComponentName].js`
- `frontend/src/styles/[component-name].css`

**UI Mockup/Description:**
```
Detailed description of the interface:
- Layout and positioning
- Interactive elements (buttons, inputs, etc.)
- Visual feedback and states
- Responsive behavior
```

**User Interactions:**
- Click handlers and event listeners
- Form submissions and validation
- Keyboard shortcuts
- Animation/transition requirements

## 🔧 Technical Specifications
**Canvas Integration:** (if applicable)
- Rendering requirements
- Game loop integration
- Performance considerations

**Bootstrap Components:**
- Specific Bootstrap classes to use
- Custom styling requirements

**State Management:**
- What data needs to be tracked
- How state flows between components

## 📦 Context & Resources
**Backend API Integration:**
```javascript
// Exact API calls this component will make
fetch('/api/game/join', {
  method: 'POST',
  body: JSON.stringify({ handle: userHandle })
})
```

**Existing Code Patterns:**
```javascript
// Include relevant existing code snippets
// Show component patterns to follow
```

**Styling Context:**
- Bootstrap theme and customizations
- Existing CSS classes to reuse

## ✅ Definition of Done
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (ESLint, tests, etc.)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Implementation Complete (5-7min):**
- [ ] Component/element created and renders correctly
- [ ] All specified user interactions implemented
- [ ] Follows existing code patterns and conventions
- [ ] Code passes linting (ESLint)

**Implementation (7-10min):**
- [ ] Component/feature implemented as specified
- [ ] Follows existing UI patterns and conventions
- [ ] State management properly implemented
- [ ] Error handling and loading states included
- [ ] Accessibility basics included (ARIA labels, keyboard nav)
- [ ] Code passes linting (ESLint)

**Test Implementation (5-7min):**
- [ ] Test code written for all functionality
- [ ] User interaction tests included
- [ ] Edge cases and error states covered
- [ ] Mock data/API responses configured

**Test Execution (5-8min):**
- [ ] All tests run and pass consistently
- [ ] Manual verification of user experience
- [ ] Responsive design tested (mobile/desktop)
- [ ] No console errors or warnings

**Documentation (3-5min):**
- [ ] Code comments added for complex logic
- [ ] Component usage documented (if reusable)
- [ ] Props/API interface documented
- [ ] Accessibility considerations noted

**Pre-Commit Verification:**
- [ ] `git commit` completes without quality gate failures
- [ ] Hook execution time is reasonable (<30 seconds)
- [ ] All code follows project conventions automatically enforced
- [ ] No `--no-verify` flags used (unless emergency documented)

## 🔗 Handoff Information
**For Testing Agent:**
- Components to test
- User flows to verify
- Edge cases and error states

**For Product Review (PM):**
- Key user experience elements to validate
- Visual/interaction feedback needed
- Success criteria to verify

**Backend Dependencies:**
- API endpoints this component uses
- Data structures expected

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 15-20 minutes total  
**Breakdown:** 7-10min implementation + 5-7min test implementation + 5-8min test execution + 3-5min documentation  
**Scope:** Single UI component or feature (one form, one display component, one interaction)  
**Iteration Limit:** 3 attempts maximum (escalate if scope too large)  
**Context Requirement:** Design specs, UI patterns, API contracts, and existing component examples provided  
**Quality Gates:** All tests passing, responsive design verified, no console errors, quality hooks compliant
