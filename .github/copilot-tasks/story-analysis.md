# Story Analysis Task Template

## 📖 Analysis Objective
Break down user story into 15-20 minute implementation tasks with clear scope boundaries.

## 🛡️ Quality Gate Compliance
**Pre-Task Validation:**
- [ ] Quality hooks are active and functional
- [ ] Documentation tools are available

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

## 📋 Source Story
**User Story:** #123  
**Story Text:**
```
As a [user type]
I want [goal] 
So that [benefit]
```

**Acceptance Criteria:**
- [ ] Criteria 1
- [ ] Criteria 2  
- [ ] Criteria 3

## 🔍 Complexity Assessment
**Story Scope Check:**
- [ ] **Single UI Component** - One form, button, or display element
- [ ] **Single API Endpoint** - One route with one purpose
- [ ] **Single User Flow** - One complete interaction sequence
- [ ] **Clear Success Metric** - Obvious pass/fail criteria

**Complexity Flags (Break down if ANY are true):**
- [ ] Multiple components need creation/modification
- [ ] Multiple API endpoints involved
- [ ] Complex state management across components
- [ ] Integration with multiple systems
- [ ] Unclear or ambiguous requirements

## ⚡ Task Identification
**Implementation Tasks (15-20min each):**
1. **Backend Task:** [Specific function/endpoint to implement]
2. **Frontend Task:** [Specific component/interaction to build]
3. **Integration Task:** [Specific connection to establish]

**Quality Tasks (5min each):**
4. **Backend Test:** [Specific test suite to create]
5. **Frontend Test:** [Specific component tests to write]
6. **Documentation:** [Specific docs/comments to update]

## ✅ Validation Criteria
**Story is Ready if:**
- [ ] All tasks are 5-minute scope
- [ ] Each task has single responsibility
- [ ] Success criteria are clear and measurable
- [ ] Dependencies between tasks are minimal
- [ ] All acceptance criteria covered by tasks

**Story Needs Breakdown if:**
- [ ] Any task feels >15-20 minutes
- [ ] Tasks have unclear boundaries
- [ ] Success criteria are ambiguous
- [ ] Multiple user types or workflows involved

---
**Time Box:** 15-20 minutes total  
**Agent Focus:** Analysis and task breakdown only  
**Output:** List of ready-to-execute 15-20 minute implementation tasks  
**Scope:** Single user story broken into 3-8 focused tasks  
**Quality Gate:** Each task must be implementable within time-box limits
