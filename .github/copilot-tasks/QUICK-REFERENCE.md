# Task Creation Quick Reference 🚀

## Template Selection Guide

| Task Type | Template | When to Use | Time Box |
|-----------|----------|-------------|----------|
| 📖 User Story | `user-story-task.md` | Define behavior and outcomes | 30-60min |
| 🔍 Research | `research-task.md` | Investigate technical approaches | 30min |
| 🔍 Research Challenge | `research-validation.md` | Challenge research findings | 20min |
| 🎯 Research Decision | `research-decision.md` | Make final technical decision | 10min |
| 📋 Requirements | `requirements-analysis.md` | Break down stories into tasks | 30min |
| ⚙️ Backend Feature | `backend-feature.md` | Server-side implementation | 15-20min |
| 🎨 Frontend Feature | `frontend-feature.md` | UI/UX implementation | 15-20min |
| 🧪 Backend Test | `backend-test.md` | Server-side testing | 15-20min |
| 🧪 Frontend Test | `frontend-test.md` | Client-side testing | 15-20min |
| 🔗 Integration | `integration-task.md` | Connect frontend/backend | 15-20min |
| 🌐 E2E Test | `e2e-test.md` | Full user workflow testing | 20-30min |
| 🐛 Bug Fix | `bug-fix.md` | Fix broken functionality | 15-30min |
| 📝 Documentation | `documentation-task.md` | Create/update docs | 15-20min |
| 🔧 Refactor | `refactor-task.md` | Code improvement | 30min |

## Workflow Patterns

### ⚡ Research Flow (30-20-10 Pattern)
```
Research (30min) → Challenge (20min) → Decision (10min)
Total: 60 minutes wall clock
Cost: ~25,000 tokens  
Quality: High confidence, multiple perspectives
```

### 🔄 Implementation Flow (15-20min Tasks)
```
Story Analysis → Backend (15-20min) + Frontend (15-20min) → Integration (15-20min) → E2E (20-30min)
                        ↓                    ↓
                   Backend Tests      Frontend Tests
                   (15-20min)         (15-20min)
```

### ⚡ Parallel Flow (Complex Features)
```
User Story → Requirements Analysis
    ├── Research (if needed): 30+20+10min
    ├── Backend Feature (Agent A): 15-20min
    ├── Frontend Feature (Agent B): 15-20min  
    ├── Backend Tests (Agent C): 15-20min
    ├── Frontend Tests (Agent D): 15-20min
    └── Documentation (Agent E): 15-20min
    ↓
Integration (15-20min) → E2E Test (20-30min)
```

## GitHub Issues Integration 🔗

### **Automatic Dependency Management**
- Use GitHub's "depends on #XXX" and "closes #XXX" syntax
- Link user stories to implementation tasks
- Automatic blocking when dependencies aren't met
- Visual project board showing ready vs blocked tasks

### **Issue Templates Available**
- `.github/ISSUE_TEMPLATE/user-story.md`
- `.github/ISSUE_TEMPLATE/backend-feature-task.md`
- `.github/ISSUE_TEMPLATE/frontend-feature-task.md`
- `.github/ISSUE_TEMPLATE/integration-task.md`
- `.github/ISSUE_TEMPLATE/research-task.md`
- `.github/ISSUE_TEMPLATE/bug-fix-task.md`
- `.github/ISSUE_TEMPLATE/documentation-task.md`
- `.github/ISSUE_TEMPLATE/e2e-test-task.md`

### ⚡ Parallel Flow (Complex Features)
```
User Story → Requirements Analysis
    ├── Research (if needed)
    ├── Backend Feature (Agent A) + Backend Test (Agent B)
    ├── Frontend Feature (Agent C) + Frontend Test (Agent D)
    └── Documentation (Agent E)
    ↓
Integration → E2E Test
```

## Key Principles ✨

### 🎯 Complete Context
- Include ALL necessary information
- Avoid requiring lookups or research
- Provide code snippets and examples
- Specify exact file paths and functions

### 📏 Small Scope
- Max 2-hour time box for implementation
- Single responsibility per task
- Clear boundaries and handoffs
- Testable units of work

### 🔗 Clear Dependencies
- Specify what must be done first
- Define handoff information
- Include integration points
- Map data flows

### 🧪 Testable Outputs
- Every feature task has corresponding test task
- Clear success criteria
- Verifiable outcomes
- Rollback plans for failures

## Common Mistakes to Avoid ❌

- **Vague Requirements:** "Make the UI better" → Specify exact components and behaviors
- **Missing Context:** Don't make agents hunt for information
- **Too Large Scope:** Break down anything > 2 hours
- **Unclear Success:** Define specific, measurable outcomes
- **Missing Handoffs:** Specify what the next agent needs

## Template Customization 🛠️

Each template is a starting point. Customize based on:
- Project-specific patterns
- Team preferences
- Tool-specific requirements
- Domain knowledge needs

Remember: The goal is to keep AI agents focused and productive! 🤖✨
