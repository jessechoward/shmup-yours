# Context Management Tools

## 1. .copilot-instructions.md
**✅ Created** - Root-level instructions file with:
- Project overview and architecture constraints
- 15-20 minute time-boxing rules
- Technology stack and patterns
- Escalation triggers and success criteria

## 2. .github/copilot-context/ Directory
**✅ Created** - Focused context files:
- `architecture.md` - Quick architecture reference
- `patterns.md` - Common code patterns and examples
- `context-strategy.md` - How to manage context effectively

## 3. Enhanced Issue Templates
**🔄 In Progress** - Adding context references to templates:
```html
<!-- CONTEXT: Read .copilot-instructions.md and GAME_DESIGN.md before starting -->
<!-- ARCHITECTURE: Single-server design - see .github/copilot-context/architecture.md -->
```

## 4. Additional Context Strategies

### A. Template Context Headers
Add to all task templates:
```markdown
## 📋 Required Context
**Before Starting:**
- [ ] Read `.copilot-instructions.md` (core constraints)
- [ ] Review `GAME_DESIGN.md` (architecture decisions)
- [ ] Check `.github/copilot-context/architecture.md` (quick reference)

**For This Task:**
- [ ] Understand WebSocket patterns from `.github/copilot-context/patterns.md`
- [ ] Review existing similar implementations
```

### B. Context Validation Checklist
```markdown
## ✅ Context Validation
- [ ] Architecture aligns with single-server design
- [ ] Implementation follows existing patterns
- [ ] Time-box is realistic (15-20 minutes)
- [ ] Dependencies are clearly identified
```

### C. Smart File Organization
```
.github/
├── copilot-context/
│   ├── architecture.md      # 1KB - Core design principles
│   ├── patterns.md          # 2KB - Code examples
│   ├── dependencies.md      # 1KB - Tech stack versions
│   └── workflows.md         # 1KB - Development processes
├── copilot-tasks/           # Task templates with context refs
└── ISSUE_TEMPLATE/          # Issue templates with context refs
```

## 5. Context Window Optimization Techniques

### A. Layered Context Strategy
1. **Essential (Always)**: `.copilot-instructions.md` + current task
2. **Architectural (Usually)**: `GAME_DESIGN.md` or quick reference
3. **Implementation (As Needed)**: Specific pattern files
4. **Code (Minimal)**: Only files directly related to task

### B. Context Compression
- Use bullet points instead of paragraphs
- Provide code snippets instead of full files
- Include anti-patterns to avoid common mistakes
- Reference by file/line instead of duplicating content

### C. Progressive Context Loading
```markdown
## Context Priority
1. **CRITICAL**: .copilot-instructions.md (must read)
2. **HIGH**: Current issue requirements
3. **MEDIUM**: Architecture quick reference
4. **LOW**: Full design documents (reference only)
```

## 6. Implementation Recommendations

### For Your Project:
1. **Keep** `.copilot-instructions.md` under 2KB (quick load)
2. **Update** all issue templates with context references
3. **Create** task-specific context files as needed
4. **Monitor** agent performance and adjust context strategy

### Context File Maintenance:
- Review and update monthly
- Keep examples current with actual codebase
- Remove outdated patterns and constraints
- Validate context files work within token limits

This approach should help your Copilot agents maintain consistent context while staying within token limits!
