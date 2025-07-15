# Research Task: PR Status Workflow Clarity (Phase 1)

## Problem Statement

**Immediate Issue:** GitHub Copilot agents creating draft/WIP PRs when work is complete, causing confusion in project tracking and human orchestration.

**80% Solution Goal:** Clear, unambiguous rules that eliminate PR status confusion while providing basic workflow visibility for human technical leads.

## Research Objectives

### Primary Goal (80% Value)
Create clear PR status guidelines that:
1. **Eliminates draft/WIP confusion** - agents know exactly when to use draft vs ready
2. **Provides human visibility** - technical leads can quickly understand PR workflow state
3. **Works with existing tools** - leverages current GitHub/documentation setup

### Secondary Goals (Future Phases)
- Complete workflow state machine design
- Advanced synchronization automation
- Comprehensive human orchestration interface

### Specific Research Questions (Phase 1 Focus)

#### 1. **PR Status Rules** ⚠️ **PRIMARY FOCUS**
- What are the exact conditions for draft vs ready-for-review?
- How should agents handle edge cases (conflicts, incomplete work, etc.)?
- What simple decision tree can eliminate confusion?

#### 2. **Documentation Consolidation** 
- Where should the authoritative PR rules live?
- How do we update scattered guidance to point to single source?
- What's the minimal sync approach to keep docs aligned?

#### 3. **Human Visibility (Basic)**
- What simple visual indicator shows workflow state?
- How can technical leads quickly assess PR pipeline health?
- What minimal Mermaid diagram covers 80% of orchestration needs?

## Expected Deliverables (80% Solution)

### 1. **PR Status Decision Tree** ⚠️ **CRITICAL DELIVERABLE**
- Clear flowchart: When to use draft vs ready
- Edge case handling guide
- Simple rules agents can follow without ambiguity

### 2. **Single Source Document** 
- Consolidated PR workflow rules in one authoritative location
- Update plan for existing scattered documentation
- Backward compatibility with current agent instructions

### 3. **Basic Human Workflow Diagram**
- Simple Mermaid diagram showing PR states and transitions
- Technical lead "at-a-glance" view of workflow health
- Embedded in main documentation for easy reference

### 4. **Implementation Plan (Minimal)**
- Step 1: Deploy PR rules (immediate fix)
- Step 2: Update documentation references 
- Step 3: Add basic workflow diagram
- **Total time:** <1 hour implementation

## Success Criteria (80% Solution)

✅ **No more draft confusion** - agents consistently use correct PR status  
✅ **Single authoritative source** - one place with clear rules  
✅ **Human visibility** - technical leads can see workflow state at a glance  
✅ **Quick implementation** - deployed in <1 hour  
✅ **Backward compatible** - existing workflows continue working  
✅ **Platform for iteration** - foundation for future enhancements

## Time Constraints (Focused Scope)

- **Research Phase:** 45 minutes maximum
- **Implementation:** 15-20 minutes  
- **Total project time:** <90 minutes end-to-end

### Quality Requirements
- **Documentation:** Clear, maintainable, version-controlled
- **Automation:** Reliable, fast execution (<2s for any checks)
- **User Experience:** Intuitive for both humans and AI agents

## Additional Context

**Technical Program Management Perspective:**
> "We are leveraging agentic developers but the technical program (humans/us) are trying to orchestrate. If the train conductors don't know the schedule, we are going to have some bad accidents."

**Current Pain Points:**
- PRs always showing draft/WIP when work is complete
- Multiple workflow documents with inconsistent guidance
- No comprehensive visual representation for human oversight
- Agents making conservative (draft) choices due to unclear rules

## Research Methodology

1. **Document Analysis:** Audit all existing workflow documentation
2. **Pattern Recognition:** Identify common decision points and edge cases
3. **System Design:** Propose unified architecture with examples
4. **Validation:** Test proposed solution against current pain points
5. **Implementation Planning:** Create actionable roadmap

## Research Methodology (Streamlined)

1. **Quick Documentation Audit (15 min):** Find all current PR guidance
2. **Problem Analysis (10 min):** Identify specific confusion points
3. **Solution Design (15 min):** Create clear decision tree and rules
4. **Platform Planning (5 min):** Ensure solution can evolve for future needs

### **Research Constraints (80% Focus)**
- **Time Box:** 45 minutes total research
- **Practical Focus:** Working solution over perfect solution
- **Platform Approach:** Build foundation for future iteration
- **Immediate Value:** Must solve the draft/WIP problem today

**Agent Decision Framework:**
- Focus on PR status rules first, everything else is secondary
- If research suggests complex architecture, recommend it for Phase 2
- Deliver working solution that can be enhanced later

---

**Assignment:** Focused research task for GitHub Copilot coding agent  
**Expected Output:** Clear PR status rules + basic workflow visibility  
**Success Metric:** No more draft/WIP confusion, foundation for future enhancement  

## Future Phases (After 80% Solution)
- **Phase 2:** Complete workflow state machine design
- **Phase 3:** Advanced synchronization automation  
- **Phase 4:** Comprehensive human orchestration interface
