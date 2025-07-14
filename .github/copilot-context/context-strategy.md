# Context Management Strategy

## Purpose
Provide Copilot agents with essential context within token limits while maintaining consistency across tasks.

## Context Files Hierarchy

### 1. Essential Context (Always Read First)
- **`.copilot-instructions.md`** - Root-level agent instructions
- **`GAME_DESIGN.md`** - Complete architecture specification
- **`.github/copilot-context/architecture.md`** - Quick architecture reference

### 2. Task-Specific Context
- **`.github/copilot-context/patterns.md`** - Common code patterns
- **`.github/PROJECT_MANAGEMENT.md`** - Process and workflow rules
- **`.github/COPILOT_WORKFLOW.md`** - Agent-specific guidelines

### 3. Implementation Context
- **Existing code files** - Read only what's needed for current task
- **Test files** - Reference existing test patterns
- **Related issue/PR comments** - Task-specific context

## Context Window Management

### Prioritization (Most Important First)
1. **Current task requirements** - Issue description and acceptance criteria
2. **Core architecture** - Single-server design from GAME_DESIGN.md
3. **Time constraints** - 15-20 minute time-boxing rules
4. **Code patterns** - Existing implementation patterns
5. **Dependencies** - What must exist before this task

### Context Compression Techniques
- **Quick reference files** instead of full documentation
- **Pattern examples** rather than complete implementations
- **Key constraints** highlighted in instructions
- **Anti-patterns** explicitly listed to avoid mistakes

## Agent Workflow
```
1. Read .copilot-instructions.md (core context)
2. Read current issue/task requirements
3. Check architecture.md for design constraints
4. Review patterns.md for implementation guidance
5. Read only necessary existing code files
6. Implement within 15-20 minute time-box
7. Test and document within same time-box
```

## Context Validation Rules
- **Before coding**: Verify understanding of single-server architecture
- **During implementation**: Reference patterns for consistency
- **Before completion**: Check against time-boxing constraints
- **On errors**: Re-read core context before attempting fixes

## Escalation Triggers
- Context conflicts (architecture vs implementation)
- Missing dependencies from previous tasks
- Time-box exceeded (>20 minutes)
- Scope creep beyond single focused change

## Context Updates
- Update `.copilot-instructions.md` when core constraints change
- Update `architecture.md` when design decisions evolve
- Update `patterns.md` when new patterns emerge
- Keep context files under 2KB each for quick loading
