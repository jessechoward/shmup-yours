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

- [ ] Research completed and documented
- [ ] Decision made with clear rationale
- [ ] Implementation guidelines defined
- [ ] Dependencies and next steps identified
- [ ] ADR created in `/docs/architecture/`

---

## ⏱️ Time-Boxing Guidelines

**Target Duration:** 15-20 minutes (7-10min research + 5-7min documentation + 3-5min validation)

**Escalation Triggers:**
- Multiple viable options need deeper analysis
- External dependencies block decision
- Integration complexity exceeds scope

**If consistently >20min:** Break into research + decision tasks
