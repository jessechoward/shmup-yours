# 🚨 Emergency Override Procedures

## Overview
Comprehensive guidance for safely bypassing Git hooks during critical situations while maintaining accountability and ensuring proper cleanup.

---

## 🚨 When Emergency Override is Justified

### 📚 Critical Situations Requiring Override
Emergency overrides should be **rare exceptions** used only when:

1. **Production Hotfix**: Critical bug affecting users requires immediate deployment
2. **Security Patch**: Security vulnerability needs urgent fix despite quality gate failures
3. **Infrastructure Failure**: Hook infrastructure broken and blocking all commits
4. **Blocking Dependency**: External service/tool failure prevents hook completion
5. **Time-Critical Deployment**: Release deadline where quality checks can be deferred

**NOT justified for**:
- Convenience or impatience
- Avoiding fixing legitimate quality issues
- Regular development workflow
- "Minor" or "cosmetic" changes

### 🎯 Emergency Override Principles
- **Document Everything**: Full accountability trail required
- **Minimal Scope**: Override only what's absolutely necessary
- **Immediate Cleanup**: Plan restoration within 24-48 hours
- **Quality Debt**: Track and address deferred quality checks
- **Team Notification**: Inform team of override and impact

---

## 🔧 Safe Override Procedures

### 🚨 Production Hotfix Override

#### 1. Document the Emergency
```bash
# Create emergency documentation BEFORE override
cat > EMERGENCY_OVERRIDE_$(date +%Y%m%d_%H%M).md << EOF
# Emergency Git Hook Override

## Emergency Details
**Date**: $(date)
**Time**: $(date +%H:%M:%S)
**Severity**: [Critical/High/Medium]
**Issue**: [Brief description of emergency]
**Ticket/Issue**: [Link to issue tracker]

## Business Impact
**Users Affected**: [Number/description]
**Services Down**: [List affected services]
**Revenue Impact**: [If applicable]
**SLA Breach**: [If applicable]

## Technical Details
**Repository**: $(git remote get-url origin)
**Branch**: $(git branch --show-current)
**Commit**: [Will be updated after override]
**Hooks Bypassed**: [List specific hooks being skipped]

## Quality Debt Created
**Skipped Tests**: [List what tests were bypassed]
**Skipped Linting**: [List what style checks were bypassed]
**Skipped Security**: [List what security checks were bypassed]
**Manual Verification Required**: [List what needs manual checking]

## Cleanup Plan
**Timeline**: [When cleanup will be completed]
**Responsible Party**: [Who will do cleanup]
**Verification Steps**: [How to verify cleanup is complete]

## Approval
**Emergency Authorized By**: [Name/role of person authorizing]
**Notification Sent To**: [Team/stakeholders notified]
EOF

# Commit documentation first
git add EMERGENCY_OVERRIDE_*.md
git commit -m "EMERGENCY: Document override authorization for [issue]"
```

#### 2. Execute Override with Full Traceability
```bash
# Method 1: Skip hooks for specific commit
git commit --no-verify -m "EMERGENCY HOTFIX: [description] - hooks bypassed due to [reason]

Hooks bypassed: pre-commit, pre-push
Emergency doc: EMERGENCY_OVERRIDE_$(date +%Y%m%d_%H%M).md
Quality checks deferred - manual verification required"

# Method 2: Temporary hook disabling (for multiple commits)
chmod -x .husky/pre-commit
chmod -x .husky/pre-push

git commit -m "EMERGENCY: [description] - hooks temporarily disabled"
# ... additional emergency commits ...

# Re-enable hooks immediately after emergency
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

#### 3. Update Emergency Documentation
```bash
# Update documentation with actual commit details
sed -i "s/\*\*Commit\*\*: \[Will be updated after override\]/\*\*Commit\*\*: $(git rev-parse HEAD)/" EMERGENCY_OVERRIDE_*.md

# Add to git
git add EMERGENCY_OVERRIDE_*.md
git commit -m "Update emergency override documentation with commit details"
```

### 🚨 Infrastructure Failure Override

#### When Hook Infrastructure is Broken
```bash
# Document infrastructure failure
cat > HOOK_INFRASTRUCTURE_FAILURE_$(date +%Y%m%d_%H%M).md << EOF
# Hook Infrastructure Failure Override

## Failure Details
**Date**: $(date)
**Hook System**: [Husky/pre-commit/custom]
**Error**: [Paste specific error message]
**Reproduction**: [Steps to reproduce the failure]

## Impact Assessment
**Developers Blocked**: [Number of developers affected]
**Commits Blocked**: [Estimated number of commits waiting]
**Business Impact**: [Impact on delivery timeline]

## Workaround Applied
**Override Method**: [Temporary disable/skip specific hooks]
**Scope**: [All hooks/specific hooks only]
**Duration**: [Expected duration of workaround]

## Resolution Plan
**Root Cause**: [Investigation findings]
**Fix Strategy**: [How the infrastructure will be repaired]
**Testing Plan**: [How to verify fix before re-enabling]
**Rollback Plan**: [How to revert if fix fails]
EOF

# Temporarily disable problematic hooks
mv .husky/pre-commit .husky/pre-commit.disabled
mv .husky/pre-push .husky/pre-push.disabled

echo "#!/usr/bin/env sh
echo 'NOTICE: Hooks temporarily disabled due to infrastructure failure'
echo 'See: HOOK_INFRASTRUCTURE_FAILURE_$(date +%Y%m%d_%H%M).md'
exit 0" > .husky/pre-commit

chmod +x .husky/pre-commit
```

### 🚨 Selective Hook Override

#### Disable Specific Problematic Hooks Only
```bash
# Create selective override script
cat > .husky/pre-commit.emergency << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "⚠️  EMERGENCY MODE: Running essential checks only"

# Run only critical, fast checks
echo "Running package manager validation..."
if command -v yarn >/dev/null 2>&1; then
  yarn check --verify-tree || {
    echo "❌ Package manager check failed"
    exit 1
  }
fi

echo "Running basic syntax check..."
# Only check staged files for basic syntax
for file in $(git diff --cached --name-only --diff-filter=ACMR | grep '\.js$'); do
  if [ -f "$file" ]; then
    node -c "$file" || {
      echo "❌ Syntax error in $file"
      exit 1
    }
  fi
done

echo "✅ Emergency validation complete"
echo "⚠️  DEFERRED: Full linting, testing, security checks"
echo "📋 TODO: Run 'yarn test:all && yarn lint:all' before merge"
EOF

# Replace normal hook with emergency version
cp .husky/pre-commit .husky/pre-commit.full
cp .husky/pre-commit.emergency .husky/pre-commit
chmod +x .husky/pre-commit
```

---

## 🔍 Post-Override Cleanup Procedures

### 📋 Mandatory Cleanup Checklist

#### Within 24 Hours (Critical)
- [ ] **Run Deferred Quality Checks**
  ```bash
  # Run all skipped quality checks
  yarn test:all
  yarn lint:all
  yarn audit
  yarn check --verify-tree
  
  # Fix any issues found
  yarn lint:all --fix
  yarn audit --fix
  ```

- [ ] **Restore Hook Infrastructure**
  ```bash
  # Restore original hooks
  cp .husky/pre-commit.full .husky/pre-commit
  rm .husky/pre-commit.emergency
  
  # Test hook functionality
  echo "console.log('test');" > test-file.js
  git add test-file.js
  git commit -m "Test hook restoration"
  git reset HEAD~1
  rm test-file.js
  ```

- [ ] **Verify Quality Compliance**
  ```bash
  # Ensure emergency commits meet quality standards
  git log --oneline -5 | while read commit; do
    git show $commit --name-only | grep '\.js$' | while read file; do
      if [ -f "$file" ]; then
        eslint "$file" || echo "Quality issue in $commit: $file"
      fi
    done
  done
  ```

#### Within 48 Hours (Important)
- [ ] **Complete Quality Remediation**
  ```bash
  # Fix any quality issues found in emergency commits
  yarn lint:all --fix
  
  # Add missing tests for emergency changes
  yarn test:coverage
  
  # Update documentation affected by emergency changes
  ```

- [ ] **Update Emergency Documentation**
  ```bash
  # Document cleanup completion
  cat >> EMERGENCY_OVERRIDE_*.md << EOF

## Cleanup Completed
**Date**: $(date)
**Quality Checks**: ✅ Completed
**Hook Restoration**: ✅ Completed  
**Issues Found**: [List any issues discovered and how they were fixed]
**Verification**: [How compliance was verified]

## Lessons Learned
**Prevention**: [How to prevent similar emergencies]
**Process Improvement**: [How to improve emergency procedures]
**Infrastructure**: [Infrastructure improvements needed]
EOF
  ```

- [ ] **Team Communication**
  ```bash
  # Notify team of cleanup completion
  echo "Emergency override cleanup completed for [issue]
  
  ✅ All deferred quality checks completed
  ✅ Hook infrastructure restored
  ✅ Emergency commits brought to compliance
  
  See: EMERGENCY_OVERRIDE_*.md for full details" > EMERGENCY_CLEANUP_NOTIFICATION.md
  ```

### 📊 Quality Debt Tracking

#### Create Quality Debt Issue
```markdown
# Quality Debt from Emergency Override

## Override Details
**Date**: [Override date]
**Emergency**: [Link to emergency documentation]
**Commits Affected**: [List commit SHAs]

## Quality Debt Items
- [ ] **Testing Debt**: Missing tests for emergency changes
- [ ] **Documentation Debt**: Missing or outdated documentation
- [ ] **Code Quality Debt**: Linting violations in emergency commits
- [ ] **Security Debt**: Unverified security implications

## Remediation Plan
**Timeline**: Within 1 week
**Assigned To**: [Developer responsible]
**Verification**: [How to verify completion]

## Success Criteria
- [ ] All tests pass with adequate coverage
- [ ] All linting violations resolved
- [ ] Documentation updated
- [ ] Security review completed
```

---

## 🆘 Escalation Procedures

### 🚨 When to Escalate Override Decisions

#### Immediate Escalation Required
- Emergency affects multiple repositories
- Override duration will exceed 48 hours
- Quality debt impacts core system functionality
- Security implications of override are unclear

#### Escalation Format
```markdown
## 🆘 Emergency Override Escalation

**Override Type**: [Production hotfix/Infrastructure failure/etc.]
**Scope**: [Single repo/Multiple repos/System-wide]
**Duration**: [How long override has been active]
**Quality Impact**: [What quality checks have been bypassed]

**Current Status**:
- Emergency resolved: [Yes/No]
- Hooks restored: [Yes/No]  
- Quality debt identified: [Yes/No]
- Cleanup timeline: [Specific date]

**Escalation Reason**:
[Why immediate help is needed]

**Requested Action**:
[Specific help needed - architectural review/resource allocation/process change]
```

### 📞 Emergency Contact Procedures

#### Notification Channels
1. **Immediate**: Team chat/Slack with @here/@channel
2. **Formal**: Email to technical leads and product owner
3. **Documentation**: Update in issue tracker with high priority
4. **Follow-up**: Post-emergency retrospective scheduling

#### Communication Template
```
🚨 EMERGENCY OVERRIDE NOTIFICATION 🚨

Emergency: [Brief description]
Repository: [Repository name]
Duration: [Expected duration] 
Impact: [Business/technical impact]

Quality checks bypassed:
- [ ] Testing
- [ ] Linting  
- [ ] Security scanning
- [ ] Performance validation

Cleanup plan: [Brief timeline]
Documentation: [Link to emergency documentation]

Questions/concerns: Reply to this thread
```

---

## 📋 Override Prevention Strategies

### 🔧 Reducing Need for Overrides

#### Infrastructure Resilience
```bash
# Graceful degradation in hooks
#!/usr/bin/env sh
# .husky/pre-commit with fallback

# Try full validation first
if timeout 30s yarn lint:all && timeout 60s yarn test:quick; then
  echo "✅ Full validation passed"
  exit 0
fi

# Fallback to essential checks only
echo "⚠️ Full validation failed, running essential checks..."
if yarn check --verify-tree && eslint --quiet $(git diff --cached --name-only --diff-filter=ACMR | grep '\.js$'); then
  echo "⚠️ Essential checks passed - manual review required"
  exit 0
else
  echo "❌ Essential checks failed - commit blocked"
  exit 1
fi
```

#### Emergency Mode Configuration
```javascript
// package.json - Emergency mode scripts
{
  "scripts": {
    "emergency:validate": "eslint --quiet src/ && node -c src/index.js",
    "emergency:test": "jest --testPathPattern=critical",
    "emergency:deploy": "echo 'Emergency deployment - skip non-critical validations'"
  }
}
```

#### Monitoring and Alerts
```bash
# Hook performance monitoring
#!/usr/bin/env sh
# .husky/pre-commit with monitoring

start_time=$(date +%s)
yarn lint-staged
end_time=$(date +%s)
duration=$((end_time - start_time))

if [ $duration -gt 30 ]; then
  echo "⚠️ Hook performance warning: ${duration}s (target: <30s)"
  echo "Consider optimizing hook configuration"
fi
```

---

**Emergency Authorization**: Technical Lead or Product Owner required for production overrides  
**Maximum Override Duration**: 48 hours before mandatory escalation  
**Quality Debt SLA**: Full remediation within 1 week  
**Process Review**: Monthly review of override patterns for prevention opportunities