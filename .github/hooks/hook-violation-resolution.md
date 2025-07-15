# 🚨 Hook Violation Resolution Playbook

## Overview
Systematic diagnosis and resolution procedures for Git hook violations. This template helps agents diagnose hook failure types and apply appropriate fixes to maintain development velocity through quality gates.

---

## 🔍 Step 1: Rapid Diagnosis (Target: 30 seconds)

### Quick Failure Type Detection
```bash
# Check what hook failed
git log --oneline -1
# Look for error patterns in terminal output

# Common failure patterns:
echo "Analyzing last commit attempt..."
```

### 🧭 Decision Tree
**Use this flowchart to identify the failure type:**

```
Hook Failed?
├── Package Manager Error? → [package-manager-errors.md]
│   ├── "npm detected" → Package manager violation
│   ├── "package-lock.json" → Lockfile conflict  
│   └── "workspace" → Workspace command error
├── ESLint/Linting Error? → [eslint-errors.md]
│   ├── "eslint" or "lint" → Code quality violation
│   ├── "no-unused-vars" → Specific rule violation
│   └── "parsing error" → Configuration issue
├── Performance/Timeout? → [performance-errors.md]
│   ├── "timeout" → Hook took too long
│   ├── "memory" → Resource exhaustion
│   └── "slow" → Performance degradation
├── Hook Infrastructure? → [emergency-overrides.md]
│   ├── "husky" or "hook not found" → Setup issue
│   ├── "permission denied" → File permissions
│   └── "command not found" → Missing dependencies
└── Dependency/Lock Issues? → [yarn-lock-conflict-resolution.md]
    ├── "yarn.lock" conflict → Merge conflict in lockfile
    ├── "integrity check" → Corrupted dependencies
    └── "version conflict" → Dependency resolution issue
```

---

## 🔧 Step 2: Apply Standard Resolution (Target: 5 minutes)

### 🎯 Quick Resolution by Type

#### Package Manager Violations
```bash
# Source the error message system for detailed guidance
source .github/hooks/error-messages.sh

# Display specific package manager guidance
show_package_manager_error "npm" "yarn" "$PWD"

# Quick fix for most cases:
rm -f package-lock.json
yarn install
```

#### ESLint/Code Quality Issues  
```bash
# Auto-fix most linting issues
yarn workspace backend eslint src/ --fix
yarn workspace frontend eslint src/ --fix

# Check what remains
yarn lint:all
```

#### Performance/Timeout Issues
```bash
# Use lint-staged for faster pre-commit checks
npx lint-staged

# Enable caching for repeat runs
export ESLINT_CACHE=true
yarn lint:all
```

#### Dependency/Lock Conflicts
```bash
# See yarn-lock-conflict-resolution.md for detailed steps
git checkout yarn.lock
yarn install
```

### 🔄 Universal Retry Pattern
```bash
# After applying any fix, always test:
echo "Testing hook functionality..."

# Method 1: Test with dummy commit
echo "test" > test-hook-fix.tmp
git add test-hook-fix.tmp
git commit -m "Test hook fix" || echo "Still failing - escalate"
git reset HEAD~1
rm test-hook-fix.tmp

# Method 2: Direct hook execution
./.husky/pre-commit || echo "Pre-commit still failing"
```

---

## 🔍 Step 3: Advanced Diagnosis (If standard fixes fail)

### 🕵️ Deep Inspection Commands
```bash
# Check hook configuration
echo "=== Hook Configuration ==="
ls -la .husky/
cat .husky/pre-commit
cat .husky/pre-push

# Check environment
echo "=== Environment Check ==="
node --version
yarn --version
which yarn
which eslint

# Check workspace setup
echo "=== Workspace Validation ==="
yarn workspaces info
yarn check --verify-tree

# Check file permissions
echo "=== Permission Check ==="
ls -la .husky/
find .husky -name "*.sh" -exec ls -la {} \;
```

### 🐛 Error Pattern Analysis
```bash
# Capture full error output for analysis
git commit -m "Test commit to capture error" 2>&1 | tee hook-error.log

# Look for specific patterns
grep -i "error\|fail\|abort\|timeout" hook-error.log
grep -i "eslint\|yarn\|npm\|husky" hook-error.log

# Check system resources
echo "=== System Resources ==="
df -h .
free -h
ps aux | grep -E "(node|yarn|eslint)"
```

---

## 🆘 Step 4: Escalation Criteria and Procedures

### ⚠️ Escalate After 5 Minutes If:
- Standard fixes don't resolve the violation
- Multiple violation types occur simultaneously  
- Hook infrastructure appears corrupted
- Dependency conflicts require architectural decisions
- Performance issues persist despite optimization

### 📝 Escalation Format
```markdown
## 🆘 Hook Violation Escalation

**Failure Type**: [Package Manager/ESLint/Performance/Infrastructure/Dependency]
**Time Spent**: [Minutes attempting resolution]
**Standard Fixes Attempted**: 
- [ ] [Specific fix from appropriate template]
- [ ] [Another fix attempted]
- [ ] [Third fix attempted]

**Current Error**: 
```
[Paste exact error message from hook failure]
```

**System State**:
- Node version: [output of `node --version`]
- Yarn version: [output of `yarn --version`]  
- Workspace status: [output of `yarn workspaces info`]
- Hook permissions: [output of `ls -la .husky/`]

**Files Changed**: [List files in current commit attempt]
**Workspace**: [backend/frontend/test/root]
```

### 🔄 Escalation Actions
1. **Immediate**: Comment on current issue with escalation format above
2. **Document**: Save hook-error.log file for investigation  
3. **Notify**: Tag technical lead in escalation comment
4. **Preserve**: Don't force-push or reset - maintain error state for investigation

---

## 🛡️ Step 5: Prevention Strategies

### 📋 Pre-Commit Quality Checklist
Reference: [commit-quality-checklist.md] for comprehensive prevention

**Quick Prevention Check** (run before any commit):
```bash
# 1. Verify package manager consistency
ls package-lock.json 2>/dev/null && echo "❌ Remove package-lock.json" || echo "✅ No npm lockfile"

# 2. Quick lint check on changed files
git diff --cached --name-only --diff-filter=ACMR | grep '\.js$' | xargs yarn workspace backend eslint 2>/dev/null || true

# 3. Verify workspace integrity
yarn check --verify-tree

# 4. Test hook setup
./.husky/pre-commit --help >/dev/null 2>&1 || echo "⚠️ Hook setup issue"
```

### 🔧 Hook Performance Monitoring
```bash
# Monitor hook performance to prevent timeouts
echo "=== Hook Performance Check ==="
time ./.husky/pre-commit

# Target: Should complete in <30 seconds
# If >30s, see performance-errors.md for optimization
```

---

## 📖 Reference Documentation

### 🔗 Related Templates (Quick Links)
- **[package-manager-errors.md]**: Yarn vs npm violations, lockfile conflicts
- **[eslint-errors.md]**: Code quality issues, rule violations, configuration
- **[performance-errors.md]**: Timeout, memory, slow hook diagnosis  
- **[emergency-overrides.md]**: When and how to bypass hooks safely
- **[yarn-lock-conflict-resolution.md]**: Dependency conflict resolution
- **[pre-commit-setup-validation.md]**: Hook installation and validation
- **[commit-quality-checklist.md]**: Prevention strategies

### 🛠️ Integration with Error Message System
```bash
# Load all error message functions
source .github/hooks/error-messages.sh

# Available functions for detailed guidance:
show_package_manager_error "<detected>" "<required>" "<context>"
show_eslint_error "<type>" "<specific_error>" "<files>"
show_performance_error "<type>" "<duration>" "<target>"
show_emergency_override_info "<situation>"
```

### 📊 Success Metrics
- **Target Resolution Time**: 90% of violations resolved within 5 minutes
- **Escalation Rate**: <10% of violations require escalation
- **Self-Resolution**: Agents resolve issues using templates without human intervention
- **Prevention**: Violations decrease over time through improved prevention

---

**Created**: July 2025  
**Integration**: Part of infrastructure priority plan (#40)  
**Dependencies**: Builds on error message system (#42), integrates with workflow patterns (#37)  
**Usage**: Primary diagnosis template - start here for all hook violations**