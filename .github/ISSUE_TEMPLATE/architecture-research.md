---
name: Architecture Research Task
about: Research and decide on architectural patterns and technical approaches (15-20min)
title: '[Architecture] [Component/System Name]'
labels: ['type/research', 'priority/high', 'size/s']
assignees: []
---

## 🎯 Architecture Decision Required

Clear, one-sentence description of the architectural decision or research needed.

## 📋 Research Scope

**Problem Statement:**
- Brief description of the architectural challenge
- Key constraints and requirements
- Dependencies on other architectural decisions

**Research Questions:**
- [ ] What are the available approaches/patterns?
- [ ] What are the trade-offs of each option?
- [ ] Which approach best fits our constraints?
- [ ] What are the implementation implications?

## 🔍 Research Areas

**Technical Considerations:**
- Performance requirements
- Integration constraints  
- Scalability needs
- Maintenance complexity

**Dependencies:**
- Prerequisite architectural decisions
- Related systems that must integrate
- External library/framework constraints

## 📊 Decision Criteria

**Must Have:**
- [ ] Meets functional requirements
- [ ] Integrates with existing architecture
- [ ] Supports 15-20min implementation tasks

**Nice to Have:**
- [ ] Optimal performance characteristics
- [ ] Future extensibility
- [ ] Minimal complexity

## 📝 Expected Output

**Architecture Decision Record (ADR):**
```markdown
# ADR: [Decision Title]

## Decision
[Chosen approach and rationale]

## Implementation Guidelines
[Key patterns and constraints for implementation]

## Dependencies
[What must be built first, what this enables]
```

## ✅ Definition of Done

**Setup & Quality Gates (1-2min):**
- [ ] `yarn install` completed to enable Husky hooks
- [ ] All pre-commit hooks working correctly
- [ ] Development environment ready

**Research & Decision (10-12min):**
- [ ] Research completed and documented
- [ ] Decision made with clear rationale
- [ ] Implementation guidelines defined
- [ ] Dependencies and next steps identified

**Documentation (3-5min):**
- [ ] ADR created in `/docs/architecture/`
- [ ] Decision properly documented
- [ ] Implementation guidelines clear
- [ ] Next steps identified

**Quality Validation (1-2min):**
- [ ] All Husky pre-commit hooks pass successfully
- [ ] Linting passes without errors (if code examples included)
- [ ] No hook bypasses used (unless emergency documented)
- [ ] Commit message follows conventional format

---

## ⏱️ Time-Boxing Guidelines

**Target Duration:** 15-20 minutes (7-10min research + 5-7min documentation + 3-5min validation)

**Escalation Triggers:**
- Multiple viable options need deeper analysis
- External dependencies block decision
- Integration complexity exceeds scope

**🔧 Husky Hook Troubleshooting**:
- **Hook timeout**: Hooks should complete within 30 seconds
- **Linting failures**: Run `yarn lint:all --fix` to auto-resolve
- **Test failures**: Fix tests before committing (no bypasses)
- **Emergency overrides**: Use `git commit --no-verify` only for critical fixes

**If consistently >20min:** Break into research + decision tasks
