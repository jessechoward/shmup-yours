---
name: Research Task
about: Investigate technical approaches (10min research + 5min validation + 5min decision)
title: '[Research] [Question to investigate]'
labels: research, planning
assignees: ''

---

## 🔍 Research Objective
Clear question or problem to investigate.

## 📋 Research Scope
**Specific Questions to Answer:**
- Question 1: [Detailed question]
- Question 2: [Detailed question]
- Question 3: [Detailed question]

**Context & Constraints:**
- Technical limitations we must work within
- Performance requirements to meet
- Compatibility needs (browser, mobile, etc.)
- Time/complexity constraints

## 🔧 Research Workflow
**This research will create:**
- [ ] Research Investigation (10min) - Initial investigation and comparison
- [ ] Validation Check (5min) - Challenge assumptions and verify findings  
- [ ] Decision Summary (5min) - Final recommendation with implementation plan

## 📊 Evaluation Criteria
**Priority Rankings:**
- Performance: [High/Medium/Low]
- Ease of implementation: [High/Medium/Low]
- Maintainability: [High/Medium/Low]
- Community support: [High/Medium/Low]
- Learning curve: [High/Medium/Low]

## ✅ Success Criteria
**Setup & Quality Gates (1-2min):**
- [ ] `yarn install` completed to enable Husky hooks
- [ ] All pre-commit hooks working correctly
- [ ] Development environment ready

**Research & Analysis (10-12min):**
- [ ] Clear recommendation with rationale
- [ ] Implementation plan with next steps
- [ ] Risk assessment and mitigation strategies
- [ ] Cost/benefit analysis completed
- [ ] Decision ready for implementation

**Quality Validation (1-2min):**
- [ ] All Husky pre-commit hooks pass successfully
- [ ] Linting passes without errors (if code examples included)
- [ ] No hook bypasses used (unless emergency documented)
- [ ] Commit message follows conventional format

## 🔗 Dependencies
**Depends on:** (Information needed before research)
- #XXX (architecture decisions)
- #XXX (requirements clarification)

**Blocks:** (Issues waiting for this research)
- #XXX (implementation tasks)
- #XXX (related decisions)

---
**Estimated Total Time:** 15-20 minutes (10min research + 5min validation + 5min decision)  
**Scope:** Single focused technical question with clear recommendation
**Iteration Limit:** 3 attempts maximum (escalate if research scope too broad)

**🔧 Husky Hook Troubleshooting**:
- **Hook timeout**: Hooks should complete within 30 seconds
- **Linting failures**: Run `yarn lint:all --fix` to auto-resolve
- **Test failures**: Fix tests before committing (no bypasses)
- **Emergency overrides**: Use `git commit --no-verify` only for critical fixes
