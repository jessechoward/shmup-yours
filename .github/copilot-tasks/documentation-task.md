# Documentation Task Template

## 📝 Documentation Objective
Clear description of what documentation needs to be created or updated.

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
**PRs must only be created after documentation is complete, all tests pass, and quality gates are met.**

**Do NOT open a PR at the start of work.**

See `.github/COPILOT_WORKFLOW.md` for authoritative rules.

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- 90% of violations have copy-paste resolution commands
- Escalate after 5 minutes if resolution unclear
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 Documentation Scope
**Type of Documentation:**
- [ ] **Code Comments** - Inline documentation for complex functions
- [ ] **API Documentation** - Endpoint specifications and examples
- [ ] **README Updates** - Project setup, usage instructions
- [ ] **Architecture Documentation** - System design and component relationships
- [ ] **User Guide** - End-user instructions and tutorials

**Specific Files/Sections:**
- `README.md` - Section X needs updating
- `docs/api.md` - New endpoints to document
- `src/component.js` - Function documentation

## 🔧 Documentation Requirements
**Content to Include:**
- Clear explanations of "what" and "why"
- Code examples and usage patterns
- Setup and configuration instructions
- Troubleshooting common issues

**Format and Style:**
- Follow existing documentation patterns
- Use clear, concise language
- Include relevant emojis for visual breaks
- Maintain consistent tone and structure

## 📦 Context & Information
**Source Material:**
- Recent code changes to document
- User feedback or questions
- Implementation details to explain

**Existing Documentation:**
```markdown
// Reference existing docs to maintain consistency
// Show current patterns and style
```

**Code to Document:**
```javascript
// Include relevant code snippets that need documentation
// Show complex functions or APIs
```

## ✅ Documentation Standards
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (documentation linting, etc.)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Quality Checklist:**
- [ ] Clear and concise explanations
- [ ] Accurate and up-to-date information
- [ ] Code examples work correctly
- [ ] Follows project documentation style
- [ ] Proper grammar and spelling
- [ ] Links work correctly
- [ ] Images/diagrams clear (if applicable)

**Content Requirements:**
- [ ] "What" is explained clearly
- [ ] "Why" provides context and rationale
- [ ] "How" includes step-by-step instructions
- [ ] Examples are realistic and helpful
- [ ] Prerequisites are clearly stated

**Pre-Commit Verification:**
- [ ] `git commit` completes without quality gate failures
- [ ] Hook execution time is reasonable (<30 seconds)
- [ ] All documentation follows project conventions
- [ ] No `--no-verify` flags used (unless emergency documented)

## 🔗 Integration Points
**Related Documentation:**
- Links to other relevant docs
- Cross-references to maintain
- Navigation updates needed

**Code References:**
- Functions and components mentioned
- File paths and examples
- API endpoints and contracts

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 1-2 hours  
**Agent Focus:** Documentation only, no code changes  
**Success Metric:** Clear, accurate, and helpful documentation, quality hooks compliant
