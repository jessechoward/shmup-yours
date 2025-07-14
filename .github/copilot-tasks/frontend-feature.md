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
**Monorepo Context:** This is a Yarn Workspaces monorepo  
**Frontend Workspace:** `/frontend/` directory

**Package Management:** Use `yarn` commands consistently
```bash
# Install dependencies in frontend workspace:
cd frontend && yarn add [package-name]

# Run frontend scripts:
yarn workspace frontend dev         # Development server  
yarn workspace frontend build      # Build for production
yarn workspace frontend test       # Run tests
yarn workspace frontend lint       # Code quality checks
```

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

**Testing Complete (3-5min):**
- [ ] Test code written for all functionality
- [ ] Tests actually run and pass
- [ ] Edge cases and error states covered
- [ ] No test flakiness or timing issues

**Verification Complete (2-3min):**
- [ ] Manual verification of user experience
- [ ] Responsive design tested (mobile/desktop)
- [ ] Integration with existing components verified
- [ ] No console errors or warnings

**Documentation Complete (3-5min):**
- [ ] Code comments added for complex logic
- [ ] Component usage documented (if reusable)
- [ ] README or docs updated if needed
- [ ] Accessibility considerations documented

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
**Time Box:** 15-20 minutes  
**Target:** 15 minutes (escalate if consistently hitting 20+)  
**Agent Focus:** Complete feature implementation with testing  
**Scope:** Single UI element with full verification  
**Dependencies:** Link to prerequisite GitHub issues  
**Next Tasks:** Integration verification, PM review
