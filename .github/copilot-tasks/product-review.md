# Product Review Task Template

## 🎯 Review Objective
Evaluate implemented feature from user experience and product perspective.

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
**Pre-Review Validation:**
- [ ] Quality hooks are active and functional
- [ ] Review environment is operational
- [ ] Documentation tools are available
- [ ] Workspace isolation is maintained (yarn workspaces)

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- 90% of violations have copy-paste resolution commands
- Escalate after 5 minutes if resolution unclear
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 Implementation to Review
**Feature Task:** #123 (link to completed implementation)  
**Component:** `frontend/src/components/[ComponentName].js`  
**User Story:** As a [user] I want [goal] so that [benefit]

## 🎨 Product Evaluation Criteria

### **User Experience Assessment**
- [ ] **Intuitive Flow** - Can users accomplish the goal without confusion?
- [ ] **Visual Clarity** - Is the purpose and state of UI elements clear?
- [ ] **Responsive Feel** - Does it work well on mobile and desktop?
- [ ] **Error Handling** - Are error states helpful and recoverable?
- [ ] **Performance** - Does it feel fast and responsive?

### **Brand/Aesthetic Alignment**
- [ ] **Retro Arcade Feel** - Does it match the game's personality?
- [ ] **Visual Hierarchy** - Are important elements emphasized?
- [ ] **Consistency** - Does it fit with existing UI patterns?
- [ ] **Accessibility** - Can all users interact with it effectively?

## 🔧 Technical Product Concerns
- [ ] **Scope Creep** - Did implementation stay focused on core requirements?
- [ ] **Future Flexibility** - Will this support planned features?
- [ ] **Maintenance** - Is this sustainable for the team?
- [ ] **Performance Impact** - Does this affect game performance?

## ✅ Review Outcomes

### **✅ Approved - Ready for Integration**
- Meets all user experience goals
- Technical implementation is sound
- Ready for next phase

### **🔄 Revision Needed**
**Specific Changes Required:**
1. **Change 1:** [Specific UI/UX adjustment needed]
2. **Change 2:** [Specific behavior modification]
3. **Change 3:** [Specific visual update]

**Priority:** [High/Medium/Low]  
**Estimated Effort:** [15min/30min/1hr]

### **❌ Rejected - Needs Rework**
**Core Issues:**
- Fundamental UX problems
- Doesn't meet user story requirements
- Technical concerns that affect other features

## 🔗 Next Steps
**If Approved:**
- Move to integration testing
- Schedule user feedback session
- Plan next feature iteration

**If Revision Needed:**
- Create specific revision tasks
- Assign to appropriate agents
- Set timeline for re-review

**If Rejected:**
- Return to requirements analysis
- Consider alternative approaches
- May need user story refinement

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 15-30 minutes  
**Role:** Technical Product Manager  
**Focus:** User experience and product value  
**Output:** Clear direction for next steps, quality hooks compliant
