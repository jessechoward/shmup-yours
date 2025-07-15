# 🎯 Educational Hook Error Messages

## Overview
This directory contains educational error message templates that transform Git hooks from blockers into teachers. These messages guide agents toward resolution while maintaining development velocity and enforcing quality standards.

## Design Principles
- **Educational First**: Help agents understand WHY each rule exists
- **Actionable Guidance**: Provide specific, copy-paste fix commands
- **Clear Escalation**: Define when to seek help vs. self-resolve
- **Performance Focused**: Target 90% self-resolution rate
- **Consistent Terminology**: Align with workflow patterns from `.copilot-instructions.md`

## Resolution Playbook System

### 🎯 Primary Entry Point
**[hook-violation-resolution.md]** - Start here for all hook failures. Provides systematic diagnosis with decision trees to route to specific resolution templates.

### 🔧 Specialized Resolution Templates
1. **[package-manager-errors.md]** - Yarn vs npm violations, lockfile conflicts
2. **[eslint-errors.md]** - Code quality issues, linting rule violations
3. **[performance-errors.md]** - Hook timeout, memory, and slow execution issues
4. **[yarn-lock-conflict-resolution.md]** - Dependency conflicts and lockfile problems
5. **[emergency-overrides.md]** - Safe bypass procedures for critical situations

### 🛡️ Prevention and Setup
1. **[pre-commit-setup-validation.md]** - Hook installation, configuration, and troubleshooting
2. **[commit-quality-checklist.md]** - Proactive quality checks to prevent violations

## Message Categories

### 🔧 Primary Focus Areas
1. **Package Manager Violations** (`package-manager-errors.md`)
   - Yarn vs npm usage violations
   - Lockfile conflicts and inconsistencies
   - Workspace-specific package operations

2. **ESLint/Code Quality Failures** (`eslint-errors.md`)
   - Linting rule violations
   - Code style inconsistencies
   - Quality gate failures

3. **Performance Violations** (`performance-errors.md`)
   - Slow hook execution warnings
   - Timeout scenarios
   - Resource usage guidance

4. **Emergency Override Guidance** (`emergency-overrides.md`)
   - When and how to bypass hooks safely
   - Escalation procedures for urgent changes
   - Documentation requirements for overrides

## Usage by Hooks

### In Pre-commit Hooks
```bash
# Source the error message system
source .github/hooks/error-messages.sh

# Display educational error with context
show_package_manager_error "npm" "yarn" "$PWD"
```

### In Error Messages
Each template provides:
- **Context**: Why this rule exists
- **Fix Commands**: Copy-paste resolution steps
- **Validation**: How to verify the fix
- **Escalation**: When to ask for help
- **References**: Links to detailed documentation

## Integration with Workflow Patterns

### Consistent with .copilot-instructions.md
- Uses same terminology and command patterns
- References established development commands
- Maintains time-boxing principles (15-20 minute fixes)
- Follows escalation triggers from workflow

### Agent Communication Standards
- Status update patterns match existing templates
- Error acknowledgment follows established format
- Escalation paths align with project workflow

## Performance Targets

### Success Criteria
- **90% Self-Resolution**: Most violations fixed from error message alone
- **<5 Minute Resolution**: Standard fixes completed quickly
- **Clear Escalation**: Complex issues identified within 2 minutes
- **Educational Value**: Agents learn project standards through errors

### Measurement Approach
- Track resolution time per error type
- Monitor escalation rate by violation category
- Measure repeat violation frequency
- Agent feedback on message clarity

## Template Structure

Each error message template follows this structure:

```markdown
## 🚨 [Error Type] Detected

### 📚 Why This Rule Exists
[Educational context about the rule's purpose]

### 🔧 Quick Fix (90% of cases)
[Copy-paste commands to resolve]

### 🔍 Verification Steps
[How to confirm the fix worked]

### 🆘 When to Escalate
[Scenarios that require human help]

### 📖 Additional Resources
[Links to detailed documentation]
```

## File Organization

```
.github/hooks/
├── README.md                           # This overview file
├── error-messages.sh                  # Shared error message functions
├── hook-violation-resolution.md       # 🎯 PRIMARY: Systematic diagnosis and resolution
├── package-manager-errors.md          # Yarn vs npm violations
├── eslint-errors.md                   # Code quality violations  
├── performance-errors.md              # Hook performance issues
├── emergency-overrides.md             # Override procedures
├── yarn-lock-conflict-resolution.md   # Dependency conflict resolution
├── pre-commit-setup-validation.md     # Hook installation and validation
└── commit-quality-checklist.md        # Prevention strategies and quality gates
```

## Contributing to Error Messages

### Adding New Error Types
1. Create template following established structure
2. Include educational context and fix commands
3. Test with agents to validate clarity
4. Update this README with new category

### Improving Existing Messages
1. Track resolution success rates
2. Gather agent feedback on clarity
3. Iterate based on actual usage patterns
4. Maintain consistency with workflow patterns

---
**Created**: July 2025  
**Integration**: Part of infrastructure priority plan (#42)  
**Dependencies**: Builds on #37 (copilot instructions), integrates with #40 (resolution playbooks)  
**Next Steps**: Hook implementation (#35, #36, #39) will reference these templates