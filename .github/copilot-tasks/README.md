# Copilot Task Templates 🤖

## Philosophy 🎯

These templates are designed to keep AI agents "in their lane" while enabling parallel workflows and clear handoffs. Each template focuses on a specific type of work with clear boundaries and complete context.

## Template Categories 📋

### 1. **Discovery & Planning** 🔍
- **research-task.md** - Investigate and document technical approaches
- **requirements-analysis.md** - Break down features into implementable chunks

### 2. **User Stories & Behavior** 📖
- **user-story-task.md** - Define behavior and outcomes, not implementation
- **acceptance-criteria.md** - Clear definitions of done

### 3. **Implementation** ⚙️
- **backend-feature.md** - Server-side functionality
- **frontend-feature.md** - Client-side functionality
- **integration-task.md** - Connect frontend/backend components

### 4. **Testing** 🧪
- **backend-test.md** - Server-side testing (unit, integration)
- **frontend-test.md** - Client-side testing (unit, component)
- **e2e-test.md** - End-to-end testing scenarios

### 5. **Quality & Maintenance** 🔧
- **refactor-task.md** - Code improvement without behavior change
- **documentation-task.md** - Update docs, comments, README
- **bug-fix.md** - Fix broken functionality

## Workflow Patterns 🔄

### Sequential Flow
```
Research → User Story → Backend Feature + Frontend Feature → Backend Test + Frontend Test → E2E Test
```

### Parallel Flow
```
User Story → Requirements Analysis
    ├── Backend Feature (Agent A) + Backend Test (Agent B)
    └── Frontend Feature (Agent C) + Frontend Test (Agent D)
    ↓
Integration Task → E2E Test
```

## Key Principles 🌟

1. **Complete Context**: Each task includes all necessary information to avoid lookups
2. **Small Scope**: Tasks are time-boxed and focused
3. **Clear Handoffs**: Outputs are well-defined for next agent
4. **Parallel-Friendly**: Minimize dependencies where possible
5. **Testable**: Every implementation task has a corresponding test task

## Usage Guidelines 📝

- Always include **all relevant context** in task descriptions
- Use **time-boxing** (30min, 1hr, 2hr max)
- Define **clear success criteria**
- Specify **exact file paths and methods** when possible
- Include **relevant code snippets** and **API contracts**
