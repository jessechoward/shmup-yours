# Escalation Analysis Task Template

## 🔍 Analysis Objective
Analyze escalated issue to determine optimal resolution strategy and capture process improvement insights.

## 📋 Escalation Context
**Escalated Issue:** #[issue-number]
**Original Task Type:** [bug-fix/feature/research/documentation]
**Escalation Trigger:** [3-iteration-limit/technical-blocker/quality-gates/scope-expansion]
**Agent Iterations Completed:** [X]/3
**Total Time Invested:** [X] minutes

## 🔧 Analysis Areas

**Escalation Root Cause Investigation:**
- [ ] Review agent work quality and approach
- [ ] Identify specific technical blockers
- [ ] Assess original requirements clarity
- [ ] Evaluate time estimate accuracy
- [ ] Check for scope creep or expansion

**Technical Assessment:**
- [ ] Code quality review of agent work
- [ ] Architecture decisions evaluation
- [ ] Test coverage and quality analysis
- [ ] Performance and security considerations
- [ ] Integration complexity assessment

**Template Effectiveness Analysis:**
- [ ] Requirements clarity in original template
- [ ] Acceptance criteria completeness
- [ ] Technical guidance adequacy
- [ ] Time estimation methodology
- [ ] Success criteria measurability

## 📊 Analysis Framework

**Root Cause Categories:**
1. **Template Issues** - Requirements unclear, missing acceptance criteria
2. **Technical Complexity** - Solution more complex than anticipated
3. **External Dependencies** - Blocked by unavailable services/APIs
4. **Scope Expansion** - Requirements grew during implementation
5. **Knowledge Gaps** - Domain expertise required beyond agent capability
6. **Tool Limitations** - Current toolset insufficient for requirements

**Impact Assessment:**
- **Timeline Impact:** [Days/hours of delay]
- **Quality Impact:** [Test coverage gaps, technical debt created]
- **Resource Impact:** [Additional human hours required]
- **Process Impact:** [Workflow disruption, dependency blocking]

## ✅ Analysis Deliverables

**Primary Analysis:**
- [ ] **Root Cause Report** - Specific reason for escalation with evidence
- [ ] **Resolution Strategy** - Recommended approach with rationale
- [ ] **Time Estimate** - Effort required for recommended resolution
- [ ] **Risk Assessment** - Potential issues with recommended approach

**Process Improvement:**
- [ ] **Template Feedback** - Specific improvements for task template
- [ ] **Workflow Insights** - Process bottlenecks or inefficiencies identified
- [ ] **Knowledge Gaps** - Documentation or training needs discovered
- [ ] **Tool Requirements** - Additional tools or capabilities needed

## 🔗 Analysis Output Format

**Escalation Analysis Summary:**
```markdown
## Root Cause Analysis: [Primary Category]

### Technical Assessment:
**Agent Work Quality:** [Excellent/Good/Needs Improvement] - [Rationale]
**Approach Taken:** [Description of agent strategy]
**Code Quality:** [Metrics and observations]
**Test Coverage:** [Current percentage and gaps]

### Escalation Trigger Analysis:
**Primary Cause:** [Detailed explanation]
**Contributing Factors:** 
- [Factor 1]: [Impact level]
- [Factor 2]: [Impact level]

**Could This Have Been Prevented?** [Yes/No] - [Explanation]

### Resolution Strategy Recommendation:
**Recommended Approach:** [Strategy choice]
**Rationale:** [Why this approach is optimal]
**Required Resources:** [Human expertise/time needed]
**Success Probability:** [High/Medium/Low] - [Reasoning]
**Timeline:** [Expected completion timeframe]

### Process Improvement Opportunities:
**Template Improvements:**
- [Improvement 1]: [Specific change needed]
- [Improvement 2]: [Specific change needed]

**Workflow Enhancements:**
- [Enhancement 1]: [Process change needed]
- [Enhancement 2]: [Process change needed]

**Knowledge/Tool Gaps:**
- [Gap 1]: [What's missing and impact]
- [Gap 2]: [What's missing and impact]
```

**Resolution Strategy Options:**

**Option A: Revised Agent Approach**
```markdown
**Strategy:** Continue with agent using revised approach
**Conditions:** [When this option is viable]
**New Guidance:** [Specific instructions for agent]
**Success Criteria:** [Updated/clarified requirements]
**Time Box:** [New time estimate with reasoning]
**Risk Level:** [Low/Medium/High] - [Risk factors]
```

**Option B: Human Developer Takeover**
```markdown
**Strategy:** Assign to experienced developer
**Conditions:** [When human expertise is required]
**Required Expertise:** [Specific skills/knowledge needed]
**Estimated Effort:** [Human hours required]
**Complexity Factors:** [What makes this complex for agents]
**Knowledge Transfer:** [How to prevent similar escalations]
```

**Option C: Issue Decomposition**
```markdown
**Strategy:** Break into smaller, manageable tasks
**Conditions:** [When scope is too large]
**Proposed Breakdown:**
- Issue A: [Agent-suitable component] - [Time estimate]
- Issue B: [Complex component requiring human] - [Time estimate]  
- Issue C: [Integration work] - [Time estimate]
**Dependencies:** [How sub-issues relate]
**Integration Strategy:** [How pieces come together]
```

**Option D: Requirements Clarification**
```markdown
**Strategy:** Return to product owner for clarification
**Conditions:** [When requirements are ambiguous]
**Specific Questions:** [What needs clarification]
**Stakeholders Needed:** [Who should provide answers]
**Blocking Impact:** [How this affects timeline]
**Clarification Timeline:** [Expected time to get answers]
```

## 🎯 Analysis Success Criteria

**Quality Gates:**
- [ ] Root cause clearly identified with supporting evidence
- [ ] Resolution strategy selected with clear rationale
- [ ] Time estimates based on complexity assessment
- [ ] Process improvement opportunities documented
- [ ] Stakeholder communication plan defined

**Measurable Outcomes:**
- [ ] Resolution strategy reduces re-escalation probability to <5%
- [ ] Process improvements address root cause category
- [ ] Time estimates accurate within 20% margin
- [ ] Template feedback specific and actionable

## 🔄 Follow-up Actions

**Immediate Actions:**
1. [ ] Communicate analysis results to escalation issue
2. [ ] Assign appropriate resource based on strategy
3. [ ] Update project timeline and dependencies
4. [ ] Create follow-up issues if decomposition chosen

**Process Improvement Actions:**
1. [ ] Create template improvement issue if needed
2. [ ] Update workflow documentation if process gaps found
3. [ ] Schedule knowledge sharing session if expertise gaps identified
4. [ ] Add to escalation metrics for trend analysis

**Quality Assurance:**
1. [ ] Review analysis with senior developer
2. [ ] Validate resolution strategy with affected teams
3. [ ] Confirm resource availability for chosen approach
4. [ ] Document decision rationale for future reference

## 📝 Analysis Documentation

**Evidence Collection:**
- **Agent Work:** [Link to branch, commits, test results]
- **Error Logs:** [Relevant error messages and stack traces]
- **Communication:** [Key discussions or decisions during agent work]
- **Quality Metrics:** [Coverage reports, linting results, performance data]

**Decision Audit Trail:**
- **Analysis Methodology:** [How root cause was determined]
- **Strategy Selection:** [Why chosen approach over alternatives]
- **Risk Assessment:** [Factors considered in decision]
- **Stakeholder Input:** [Who was consulted and their feedback]

---

**Time Box:** 20 minutes for analysis + 10 minutes for documentation  
**Agent Focus:** Analysis and recommendation only (no implementation)  
**Scope:** Single escalated issue analysis  
**Output:** Structured analysis report with clear resolution strategy recommendation

**Next Steps:** Analysis results inform resolution assignment and process improvements