# Frontend Feature Task Template

## 🎯 Objective
Clear, one-sentence description of what UI/UX needs to be implemented.

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

---
**Time Box:** 15-20 minutes total  
**Breakdown:** 7-10min implementation + 5-7min test implementation + 5-8min test execution + 3-5min documentation  
**Scope:** Single UI component or feature (one form, one display component, one interaction)  
**Iteration Limit:** 3 attempts maximum (escalate if scope too large)  
**Context Requirement:** Design specs, UI patterns, API contracts, and existing component examples provided  
**Quality Gates:** All tests passing, responsive design verified, no console errors
