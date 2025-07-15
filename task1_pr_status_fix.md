# Task 1: PR Status Rules - Immediate Fix

## Problem Statement

**Issue:** GitHub Copilot agents creating draft/WIP PRs when work is complete, causing confusion in project tracking.

**Goal:** Clear, unambiguous rules that eliminate PR status confusion immediately.

## Research Objectives (Focused)

### Primary Goal
Create clear PR status guidelines that:
1. **Eliminates draft/WIP confusion** - agents know exactly when to use draft vs ready
2. **Provides human visibility** - technical leads can understand PR workflow state
3. **Works with existing tools** - leverages current GitHub/documentation setup

### Specific Research Questions

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

## Expected Deliverables

### 1. **PR Status Decision Tree** ⚠️ **CRITICAL**
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

## Success Criteria

✅ **No more draft confusion** - agents consistently use correct PR status  
✅ **Single authoritative source** - one place with clear rules  
✅ **Human visibility** - technical leads can see workflow state at a glance  
✅ **Quick implementation** - deployed in <1 hour  
✅ **Backward compatible** - existing workflows continue working  

## Time Constraints

- **Research Phase:** 45 minutes maximum
- **Implementation:** 15-20 minutes  
- **Total project time:** <90 minutes end-to-end

## Research Methodology (Streamlined)

1. **Quick Documentation Audit (15 min):** Find all current PR guidance
2. **Problem Analysis (10 min):** Identify specific confusion points
3. **Solution Design (15 min):** Create clear decision tree and rules
4. **Platform Planning (5 min):** Ensure solution can evolve for future needs

### **Research Constraints**
- **Time Box:** 45 minutes total research
- **Practical Focus:** Working solution over perfect solution
- **Immediate Value:** Must solve the draft/WIP problem today

**Agent Decision Framework:**
- Focus on PR status rules first, everything else is secondary
- If research suggests complex architecture, note it but don't implement
- Deliver working solution that can be enhanced later

---

**Assignment:** Immediate tactical fix for GitHub Copilot coding agent  
**Expected Output:** Clear PR status rules + basic workflow visibility  
**Success Metric:** No more draft/WIP confusion deployed in <90 minutes
