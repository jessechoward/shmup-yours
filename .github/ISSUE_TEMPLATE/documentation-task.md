---
name: Documentation Task  
about: Create or update documentation (15-20min)
title: '[Docs] Update [specific documentation]'
labels: documentation, task
assignees: ''

---

## 📝 Documentation Objective
Clear description of what documentation needs to be created or updated.

## 📋 Documentation Scope
**Type of Documentation:**
- [ ] **API Documentation** - Endpoint specifications and examples
- [ ] **Code Comments** - Inline documentation for complex functions
- [ ] **README Updates** - Project setup, usage instructions
- [ ] **Architecture Documentation** - System design and component relationships
- [ ] **User Guide** - End-user instructions and tutorials

**Specific Files/Sections:**
- `README.md` - Section X needs updating
- `docs/api.md` - New endpoints to document
- `src/component.js` - Function documentation needed

## 📦 Context & Information
**Source Material:**
- Recent code changes to document: #XXX, #XXX
- User feedback or questions that prompted this
- Implementation details that need explanation

**Related Code:**
```javascript
// Include relevant code snippets that need documentation
// Show complex functions or APIs to document
// Reference existing patterns to maintain consistency
```

## ✅ Definition of Done
**Setup & Quality Gates (1-2min):**
- [ ] `yarn install` completed to enable Husky hooks
- [ ] All pre-commit hooks working correctly
- [ ] Development environment ready

**Content Creation (8-12min):**
- [ ] Clear and concise explanations written
- [ ] Code examples work correctly
- [ ] Follows project documentation style
- [ ] Proper grammar and spelling
- [ ] Links work correctly

**Accuracy Verification (3-5min):**
- [ ] Information is up-to-date and accurate
- [ ] Code examples tested and functional
- [ ] Cross-references are correct
- [ ] No broken links or references

**Integration Complete (2-3min):**
- [ ] Documentation fits with existing docs
- [ ] Navigation updated if needed
- [ ] Consistent tone and structure maintained
- [ ] Ready for review

**Quality Validation (1-2min):**
- [ ] All Husky pre-commit hooks pass successfully
- [ ] Linting passes without errors (if documentation includes code)
- [ ] No hook bypasses used (unless emergency documented)
- [ ] Commit message follows conventional format

**Quality Check (2-3min):**
- [ ] "What" is explained clearly
- [ ] "Why" provides context and rationale
- [ ] "How" includes step-by-step instructions
- [ ] Examples are realistic and helpful

## 🎯 Success Metrics
- [ ] Time target: 15-20 minutes
- [ ] Documentation is clear and helpful
- [ ] Reduces future questions/confusion
- [ ] Maintains consistency with existing docs
- [ ] All Husky hooks pass successfully

**🔧 Husky Hook Troubleshooting**:
- **Hook timeout**: Hooks should complete within 30 seconds
- **Linting failures**: Run `yarn lint:all --fix` to auto-resolve
- **Test failures**: Fix tests before committing (no bypasses)
- **Emergency overrides**: Use `git commit --no-verify` only for critical fixes

---
**Estimated Time:** 15-20 minutes  
**Focus:** Documentation quality and clarity
