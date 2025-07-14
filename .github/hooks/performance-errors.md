# 🚨 Hook Performance Violations

## Overview
Educational error messages for hook performance issues that help agents optimize pre-commit workflows while maintaining development velocity.

---

## 🚨 Pre-commit Hook Timeout

### 📚 Why This Rule Exists
Pre-commit hooks must complete quickly (target: <30 seconds) to maintain developer productivity. Slow hooks create friction that encourages bypassing quality gates, defeating their purpose.

**Performance Standard**: All pre-commit hooks should complete within 30 seconds for typical commits.

### 🔧 Quick Fix (90% of cases)

#### Optimize scope of hook operations:
```bash
# Instead of checking all files
yarn lint:all  # ❌ Slow: checks entire codebase

# Check only staged files
npx lint-staged  # ✅ Fast: checks only changed files

# Configure lint-staged in package.json
npm pkg set lint-staged.*.js="eslint --fix"
npm pkg set lint-staged.*.md="prettier --write"
```

#### Add performance-focused .lintstagedrc.js:
```javascript
// .lintstagedrc.js - Performance optimized
module.exports = {
  // Only lint staged JS files
  '*.js': [
    'eslint --fix --cache',
    'git add'
  ],
  
  // Quick formatting for docs
  '*.md': [
    'prettier --write',
    'git add'
  ],
  
  // Package.json validation (fast)
  'package.json': [
    'yarn check --verify-tree'
  ]
};
```

#### Cache optimization:
```bash
# Enable ESLint caching
echo 'ESLINT_CACHE=true' >> .env

# Use yarn cache for faster installs
yarn config set cache-folder .yarn-cache

# Pre-warm caches in CI
yarn install --frozen-lockfile --cache-folder .yarn-cache
```

### 🔍 Verification Steps
```bash
# Time the hook execution
time .husky/pre-commit

# Should complete in <30 seconds
# Check cache effectiveness
ls -la .eslintcache
ls -la .yarn-cache

# Test with typical commit
git add src/sample-file.js
time git commit -m "test performance"
```

### 🆘 When to Escalate
**Escalate if** (after optimization attempts):
- Hook consistently takes >60 seconds despite optimizations
- Memory usage exceeds system limits during hook execution
- Cache strategies don't improve performance significantly

**Escalation Format**:
```markdown
## 🆘 Hook Performance Escalation
**Hook**: [pre-commit/pre-push/etc.]
**Duration**: [actual time vs 30s target]
**System**: [memory/CPU constraints]
**Optimization Tried**: [list approaches attempted]
**Error**: [paste performance bottleneck details]
```

---

## 🚨 Hook Memory Usage Excessive

### 📚 Why This Rule Exists
Memory-intensive hooks can overwhelm development machines and CI systems, causing failures and poor user experience.

### 🔧 Quick Fix (90% of cases)

#### Optimize memory-heavy operations:
```bash
# Instead of processing all files simultaneously
find . -name "*.js" -exec eslint {} \;  # ❌ High memory

# Process files in batches
find . -name "*.js" -print0 | xargs -0 -n 10 eslint  # ✅ Controlled memory

# Use streaming for large operations
yarn workspaces run --parallel lint  # ❌ All at once
yarn workspaces run lint  # ✅ Sequential
```

#### Configure Node.js memory limits:
```bash
# .husky/pre-commit - Add memory limits
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Limit Node.js memory usage
export NODE_OPTIONS="--max-old-space-size=2048"

# Run hooks with memory constraints
yarn lint-staged
```

#### Reduce scope for memory efficiency:
```javascript
// .lintstagedrc.js - Memory-conscious configuration
module.exports = {
  // Process fewer files per batch
  '*.js': files => [
    `eslint --fix --cache ${files.slice(0, 10).join(' ')}`,
    `eslint --fix --cache ${files.slice(10, 20).join(' ')}`
  ].filter(cmd => cmd.includes('eslint')),
  
  // Skip memory-intensive operations on large commits
  '*.js': files => files.length > 50 
    ? ['echo "Large commit detected - run yarn lint:all manually"']
    : ['eslint --fix --cache']
};
```

### 🔍 Verification Steps
```bash
# Monitor memory usage during hook
memory_before=$(free -m | awk 'NR==2{print $3}')
.husky/pre-commit
memory_after=$(free -m | awk 'NR==2{print $3}')
echo "Memory used: $((memory_after - memory_before))MB"

# Test with large commit
git add src/
time git commit -m "test memory usage"

# Check Node.js memory settings
node -pe "process.memoryUsage()"
```

### 🆘 When to Escalate
- Memory usage consistently exceeds 4GB
- System becomes unresponsive during hook execution
- Memory optimization breaks hook functionality

---

## 🚨 Slow Test Execution in Hooks

### 📚 Why This Rule Exists
Running full test suites in pre-commit hooks creates unacceptable delays. Strategic test selection maintains quality while preserving velocity.

### 🔧 Quick Fix (90% of cases)

#### Implement fast test strategy:
```bash
# Instead of full test suite
yarn test:all  # ❌ Slow: runs everything

# Run only fast, relevant tests
yarn test:unit --changed  # ✅ Fast: only affected tests
yarn test:lint  # ✅ Fast: style checks only
```

#### Configure test selection in package.json:
```json
{
  "scripts": {
    "test:pre-commit": "jest --findRelatedTests --passWithNoTests",
    "test:quick": "jest --testPathPattern=unit --maxWorkers=2",
    "test:changed": "jest --onlyChanged --passWithNoTests"
  }
}
```

#### Smart test selection:
```javascript
// .lintstagedrc.js - Test optimization
module.exports = {
  '*.js': [
    'eslint --fix',
    // Only run tests related to changed files
    'jest --findRelatedTests --passWithNoTests'
  ],
  
  // Skip tests for documentation changes
  '*.md': [
    'prettier --write'
    // No tests needed for docs
  ],
  
  // Full tests only for critical files
  'src/game-engine/*.js': [
    'eslint --fix',
    'jest --testPathPattern=game-engine'
  ]
};
```

#### Parallel execution optimization:
```bash
# .husky/pre-commit - Parallel optimization
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run quick checks in parallel
(yarn lint-staged) &
(yarn test:changed) &

# Wait for both to complete
wait
```

### 🔍 Verification Steps
```bash
# Time test execution strategies
time yarn test:all
time yarn test:changed
time yarn test:quick

# Verify test selection works
git add src/specific-file.js
yarn test:changed --verbose

# Check parallel execution
time .husky/pre-commit
```

### 🆘 When to Escalate
- Even quick tests take >15 seconds
- Test selection misses critical regressions
- Parallel execution causes test conflicts

---

## 🚨 Network-Dependent Hook Failures

### 📚 Why This Rule Exists
Hooks should work reliably in offline environments. Network dependencies create unpredictable failures that block commits.

### 🔧 Quick Fix (90% of cases)

#### Remove network dependencies:
```bash
# Instead of online checks
curl -f https://api.service.com/validate  # ❌ Network dependent

# Use local validation
yarn check --verify-tree  # ✅ Offline capable
eslint src/  # ✅ Local tool
```

#### Cache network resources:
```bash
# Pre-download dependencies
yarn install --frozen-lockfile --offline

# Cache validation data locally
curl -f https://api.service.com/schema > .cache/api-schema.json
# Then use: jq validate .cache/api-schema.json < data.json
```

#### Graceful network degradation:
```bash
# .husky/pre-commit - Network-resilient hooks
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Check network availability
if ping -c 1 google.com >/dev/null 2>&1; then
  echo "Online: Running full validation"
  yarn validate:online
else
  echo "Offline: Running local validation only"
  yarn validate:offline
fi

# Always run local checks
yarn lint-staged
```

### 🔍 Verification Steps
```bash
# Test offline functionality
# Disconnect network or use airplane mode
yarn lint-staged

# Test network failure handling
timeout 1s curl https://httpstat.us/500 || echo "Graceful failure ✅"

# Verify cached resources
ls -la .cache/
```

### 🆘 When to Escalate
- Business requirements mandate online validation
- Local alternatives don't provide equivalent quality
- Network timeouts cause unpredictable hook behavior

---

## 🚨 Hook Dependency Installation Slow

### 📚 Why This Rule Exists
Installing hook dependencies should be fast and cached. Slow installation creates friction for new contributors and CI systems.

### 🔧 Quick Fix (90% of cases)

#### Optimize dependency installation:
```bash
# Use frozen lockfile for speed
yarn install --frozen-lockfile

# Enable aggressive caching
yarn config set cache-folder .yarn-cache
echo ".yarn-cache/" >> .gitignore

# Pre-install hook dependencies
yarn add --dev husky lint-staged prettier eslint
```

#### Reduce hook dependencies:
```json
// package.json - Minimal hook dependencies
{
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0",
    // Remove unnecessary heavy dependencies
    // "webpack": "^5.0.0",  // ❌ Not needed in hooks
    // "babel": "^7.0.0"     // ❌ Not needed in hooks
  }
}
```

#### Conditional dependency loading:
```bash
# .husky/pre-commit - Lazy loading
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Only install if dependencies missing
if [ ! -d "node_modules/lint-staged" ]; then
  echo "Installing hook dependencies..."
  yarn install --frozen-lockfile
fi

yarn lint-staged
```

### 🔍 Verification Steps
```bash
# Time clean installation
rm -rf node_modules
time yarn install

# Test cached installation
rm -rf node_modules
time yarn install  # Should be much faster

# Verify hook still works after clean install
.husky/pre-commit
```

### 🆘 When to Escalate
- Installation consistently takes >5 minutes
- Cache strategies don't improve installation time
- Hook dependencies have unavoidable large transitive dependencies

---

## 🚨 Emergency Performance Override

### 📚 When Override is Appropriate
- Critical hotfix requires immediate commit
- Performance issue blocks urgent deployment
- Hook optimization requires more time than available

### 🔧 Safe Override Procedure

#### Document the override:
```bash
# Create performance override documentation
cat > HOOK_PERFORMANCE_OVERRIDE.md << EOF
# Hook Performance Override

**Date**: $(date)
**Issue**: [Performance problem description]
**Impact**: [How long hooks are taking]
**Reason**: [Why override is necessary]
**Scope**: [Which hooks are affected]
**Cleanup Plan**: [Optimization strategy]
**Timeline**: [When optimization will be completed]
EOF

# Commit override documentation
git add HOOK_PERFORMANCE_OVERRIDE.md
git commit -m "EMERGENCY: Hook performance override - [reason]"
```

#### Temporary performance bypass:
```bash
# Skip hooks for urgent commit
git commit --no-verify -m "EMERGENCY: [reason] - hooks skipped due to performance"

# Or use faster hook configuration
cp .husky/pre-commit .husky/pre-commit.backup
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
# EMERGENCY: Minimal hooks only
echo "Emergency mode: Running minimal validation only"
yarn lint-staged --no-verify
EOF
```

#### Performance monitoring during override:
```bash
# Track what we're missing
cat > OVERRIDE_IMPACT.md << EOF
# Skipped Quality Checks

**Full Test Suite**: Skipped (run manually: yarn test:all)
**Complete Linting**: Skipped (run manually: yarn lint:all)
**Security Scan**: Skipped (run manually: yarn audit)

**Manual Verification Required Before Merge**
EOF
```

### 🔍 Post-Override Cleanup (Required)
```bash
# 1. Restore original hooks
cp .husky/pre-commit.backup .husky/pre-commit
rm .husky/pre-commit.backup

# 2. Run skipped quality checks
yarn test:all
yarn lint:all
yarn audit

# 3. Implement performance optimizations
# [Apply specific optimizations from error messages above]

# 4. Clean up override documentation
git rm HOOK_PERFORMANCE_OVERRIDE.md OVERRIDE_IMPACT.md
git commit -m "Restore hook performance and complete deferred quality checks"
```

### 🆘 Escalation for Performance Overrides
**Always escalate** if:
- Performance problems affect multiple developers
- Cannot restore acceptable performance within 48 hours
- Override reveals architectural performance issues

---

**Integration**: Aligns with `.copilot-instructions.md` time-boxing principles  
**Performance Target**: <30 seconds pre-commit, <5 minutes for resolution  
**Escalation SLA**: Comment within 5 minutes if optimization fails