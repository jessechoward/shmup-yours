# Research Task Template

## 🔍 Research Objective
Clear question or problem to investigate.

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
**Pre-Research Validation:**
- [ ] Quality hooks are active and functional
- [ ] ESLint configuration is working (`yarn lint:all`)
- [ ] Documentation tools are available
- [ ] Workspace isolation is maintained (yarn workspaces)

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- 90% of violations have copy-paste resolution commands
- Escalate after 5 minutes if resolution unclear
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 Research Scope
**Specific Questions to Answer:**
- Question 1: [Detailed question]
- Question 2: [Detailed question]
- Question 3: [Detailed question]

**Context & Constraints:**
- Technical limitations
- Performance requirements
- Compatibility needs
- Budget/time constraints

## 🔧 Research Areas
**Technical Investigation:**
- [ ] Library/framework comparison
- [ ] Performance benchmarking
- [ ] Security considerations
- [ ] Integration complexity

**Options to Evaluate:**
1. **Option A:** [Name/Description]
   - Pros: 
   - Cons:
   - Use cases:

2. **Option B:** [Name/Description]
   - Pros:
   - Cons:
   - Use cases:

## 📊 Evaluation Criteria
**Priority Rankings:**
- Performance: [High/Medium/Low]
- Ease of implementation: [High/Medium/Low]
- Maintainability: [High/Medium/Low]
- Community support: [High/Medium/Low]
- Learning curve: [High/Medium/Low]

## ✅ Deliverables
**Quality Compliance (Required for all tasks):**
- [ ] All documentation passes quality gates (if applicable)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Research Outputs:**
- [ ] **Summary Document** - Key findings and recommendations
- [ ] **Comparison Matrix** - Options vs. criteria
- [ ] **Implementation Notes** - How to proceed with chosen solution
- [ ] **Risk Assessment** - Potential issues and mitigation strategies

**Pre-Commit Verification:**
- [ ] `git commit` completes without quality gate failures
- [ ] Hook execution time is reasonable (<30 seconds)
- [ ] All documentation follows project conventions
- [ ] No `--no-verify` flags used (unless emergency documented)

## 🔗 Output Format
**Research Summary:**
```markdown
## Recommendation: [Chosen Option]

### Rationale:
- Why this option best fits our needs
- Key advantages for our use case

### Implementation Plan:
- High-level steps to implement
- Dependencies and prerequisites
- Estimated effort

### Risks & Mitigation:
- Potential issues
- How to address them
```

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 15-20 minutes  
**Agent Focus:** Research and analysis only  
**Scope:** Single technical question or comparison  
**Next Steps:** Research challenge/validation (20min) → Decision (10min)
**Quality Gates:** Documentation quality compliant
