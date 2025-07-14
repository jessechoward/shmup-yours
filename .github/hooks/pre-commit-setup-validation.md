# 🔧 Pre-Commit Setup Validation

## Overview
Comprehensive validation procedures to ensure Husky pre-commit hooks are properly installed, configured, and functioning correctly. This template helps agents verify hook setup and diagnose installation issues.

---

## 🚀 Quick Setup Validation (Target: 2 minutes)

### 📋 Essential Setup Checklist
```bash
# Run this checklist to verify pre-commit hooks are working
echo "=== Pre-Commit Hook Validation ==="

# 1. Check Husky installation
echo "1. Husky Installation Check:"
ls -la .husky/ 2>/dev/null && echo "✅ .husky directory exists" || echo "❌ .husky directory missing"

# 2. Check hook files exist and are executable
echo "2. Hook File Validation:"
test -x .husky/pre-commit && echo "✅ pre-commit hook executable" || echo "❌ pre-commit hook missing/not executable"
test -x .husky/pre-push && echo "✅ pre-push hook executable" || echo "❌ pre-push hook missing/not executable"

# 3. Check Git hooks are enabled
echo "3. Git Hook Integration:"
test -f .git/hooks/pre-commit && echo "✅ Git pre-commit hook enabled" || echo "❌ Git pre-commit hook not enabled"

# 4. Verify hook content is valid
echo "4. Hook Content Validation:"
.husky/pre-commit --help >/dev/null 2>&1 && echo "✅ pre-commit hook executes" || echo "❌ pre-commit hook execution fails"
```

### 🔍 Hook Functionality Test
```bash
# Test hooks with dummy commit (safe test)
echo "=== Hook Functionality Test ==="

# Create test file
echo "console.log('test');" > test-hook-validation.js
git add test-hook-validation.js

# Test pre-commit hook
echo "Testing pre-commit hook..."
.husky/pre-commit 2>&1 | tee hook-test-output.log

# Check if hook succeeded
if [ $? -eq 0 ]; then
    echo "✅ Pre-commit hook passed"
else
    echo "❌ Pre-commit hook failed - see hook-test-output.log"
fi

# Clean up test
git reset HEAD test-hook-validation.js
rm -f test-hook-validation.js hook-test-output.log
```

---

## 🔧 Complete Husky Installation

### 📚 Why Proper Setup is Critical
Husky hooks enforce code quality gates that:
- Prevent broken code from entering the repository
- Maintain consistent code style across the team
- Catch dependency and configuration issues early
- Ensure test coverage and documentation standards

**Without proper setup**: Quality gates are bypassed, leading to broken builds and inconsistent code.

### 🚀 Fresh Installation Process

#### Step 1: Install Husky
```bash
# From project root directory
echo "Installing Husky pre-commit hooks..."

# 1. Install Husky as dev dependency
yarn add --dev husky

# 2. Initialize Husky
yarn husky init

# 3. Verify .husky directory created
ls -la .husky/
test -f .husky/pre-commit && echo "✅ Husky initialized" || echo "❌ Husky initialization failed"
```

#### Step 2: Configure Pre-Commit Hook
```bash
# Create comprehensive pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Load educational error message system
if [ -f .github/hooks/error-messages.sh ]; then
    source .github/hooks/error-messages.sh
fi

echo "🔍 Running pre-commit validation..."

# 1. Package Manager Validation
echo "Checking package manager consistency..."
if ls package-lock.json >/dev/null 2>&1; then
    echo "❌ package-lock.json detected - yarn required"
    show_package_manager_error "npm" "yarn" "$PWD" 2>/dev/null || {
        echo "Use: rm package-lock.json && yarn install"
        exit 1
    }
fi

# 2. Workspace Integrity Check
echo "Validating workspace integrity..."
yarn check --verify-tree || {
    echo "❌ Workspace integrity check failed"
    echo "Run: yarn install"
    exit 1
}

# 3. Lint Staged Files (Fast)
echo "Linting staged files..."
if command -v lint-staged >/dev/null 2>&1; then
    npx lint-staged
else
    # Fallback: lint only staged JS files
    git diff --cached --name-only --diff-filter=ACMR | grep '\.js$' | while read file; do
        if [ -f "$file" ]; then
            echo "Linting: $file"
            # Determine workspace from file path
            if [[ "$file" == backend/* ]]; then
                yarn workspace backend eslint "$file" || exit 1
            elif [[ "$file" == frontend/* ]]; then
                yarn workspace frontend eslint "$file" || exit 1
            fi
        fi
    done
fi

# 4. Basic Syntax Check
echo "Checking JavaScript syntax..."
git diff --cached --name-only --diff-filter=ACMR | grep '\.js$' | while read file; do
    if [ -f "$file" ]; then
        node -c "$file" || {
            echo "❌ Syntax error in: $file"
            exit 1
        }
    fi
done

echo "✅ Pre-commit validation passed"
EOF

# Make hook executable
chmod +x .husky/pre-commit
```

#### Step 3: Configure Pre-Push Hook
```bash
# Create pre-push hook for comprehensive checks
cat > .husky/pre-push << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push validation..."

# 1. Run Full Test Suite
echo "Running tests..."
yarn test:all || {
    echo "❌ Tests failed - fix before pushing"
    exit 1
}

# 2. Full Lint Check
echo "Running full lint check..."
yarn lint:all || {
    echo "❌ Linting failed - fix before pushing"
    exit 1
}

# 3. Build Verification
echo "Verifying builds..."
yarn workspace backend build --dry-run || echo "⚠️ Backend build check failed"
yarn workspace frontend build --dry-run || echo "⚠️ Frontend build check failed"

echo "✅ Pre-push validation passed"
EOF

# Make hook executable
chmod +x .husky/pre-push
```

#### Step 4: Install Supporting Tools
```bash
# Install lint-staged for performance
yarn add --dev lint-staged

# Configure lint-staged in package.json
cat > lint-staged.config.js << 'EOF'
module.exports = {
  '**/*.js': [
    'eslint --fix',
    'git add'
  ],
  'package.json': [
    'yarn check --verify-tree'
  ]
};
EOF
```

### 🔍 Verification Steps
```bash
# 1. Test hook installation
echo "=== Testing Hook Installation ==="
.husky/pre-commit --help >/dev/null 2>&1 && echo "✅ pre-commit hook works" || echo "❌ pre-commit hook failed"
.husky/pre-push --help >/dev/null 2>&1 && echo "✅ pre-push hook works" || echo "❌ pre-push hook failed"

# 2. Test with dummy commit
echo "=== Testing Hook Execution ==="
echo "test" > test-validation.js
git add test-validation.js
git commit -m "Test hook validation" --dry-run || echo "Commit would be blocked by hooks"
git reset HEAD test-validation.js
rm test-validation.js

# 3. Verify Git integration
echo "=== Testing Git Integration ==="
ls -la .git/hooks/pre-commit
cat .git/hooks/pre-commit | grep -q "husky" && echo "✅ Git hooks properly integrated" || echo "❌ Git hooks not integrated"
```

---

## 🔍 Hook Troubleshooting

### 🚨 Common Setup Issues

#### Issue: "Command not found" Errors
```bash
# Diagnose PATH and command availability
echo "=== Command Availability Check ==="

# Check essential commands
command -v node && echo "✅ Node.js available" || echo "❌ Node.js not found"
command -v yarn && echo "✅ Yarn available" || echo "❌ Yarn not found"
command -v git && echo "✅ Git available" || echo "❌ Git not found"

# Check workspace commands
yarn workspace backend --version && echo "✅ Backend workspace accessible" || echo "❌ Backend workspace not accessible"
yarn workspace frontend --version && echo "✅ Frontend workspace accessible" || echo "❌ Frontend workspace not accessible"

# Fix: Add proper PATH to hook environment
cat > .husky/.env << 'EOF'
# Ensure proper PATH for hooks
export PATH="$PATH:/usr/local/bin:/usr/bin:/bin"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
EOF
```

#### Issue: "Permission denied" Errors
```bash
# Check and fix file permissions
echo "=== Permission Check and Fix ==="

# Check current permissions
ls -la .husky/
ls -la .git/hooks/

# Fix hook permissions
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/_/husky.sh

# Verify fix
test -x .husky/pre-commit && echo "✅ pre-commit executable" || echo "❌ pre-commit not executable"
```

#### Issue: Hooks Not Running
```bash
# Diagnose why hooks aren't executing
echo "=== Hook Execution Diagnosis ==="

# Check Git hook configuration
git config --list | grep -i hook
git config core.hooksPath || echo "hooksPath not set (normal for default)"

# Check if hooks are enabled
git config --bool core.hooksPath && echo "Custom hooks path set" || echo "Using default hooks"

# Re-enable hooks if disabled
git config --unset core.hooksPath 2>/dev/null || true
git config --bool advice.ignoredHook false

# Reinstall hook integration
yarn husky init
```

### 🔧 Performance Optimization

#### Hook Performance Issues
```bash
# Optimize hooks for faster execution
echo "=== Hook Performance Optimization ==="

# 1. Enable caching
export ESLINT_CACHE=true

# 2. Limit scope to staged files only
cat > .husky/pre-commit.optimized << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Fast pre-commit: staged files only
echo "🚀 Fast pre-commit (staged files only)..."

# Only lint staged JS files
git diff --cached --name-only --diff-filter=ACMR | grep '\.js$' | head -20 | while read file; do
    if [ -f "$file" ]; then
        # Quick syntax check
        node -c "$file" || exit 1
        
        # Quick lint with cache
        if [[ "$file" == backend/* ]]; then
            yarn workspace backend eslint --cache "$file" || exit 1
        elif [[ "$file" == frontend/* ]]; then
            yarn workspace frontend eslint --cache "$file" || exit 1
        fi
    fi
done

echo "✅ Fast validation complete"
EOF

# Use optimized version if needed
# cp .husky/pre-commit.optimized .husky/pre-commit
```

#### Memory and Timeout Issues
```bash
# Address resource constraints
echo "=== Resource Optimization ==="

# 1. Set memory limits
export NODE_OPTIONS="--max-old-space-size=2048"

# 2. Add timeout protection
cat > .husky/pre-commit.timeout-safe << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Pre-commit with timeout protection
echo "🕐 Running time-bounded pre-commit..."

# Run with timeout (30 seconds max)
timeout 30s bash -c '
    echo "Quick package manager check..."
    test ! -f package-lock.json || { echo "❌ Remove package-lock.json"; exit 1; }
    
    echo "Quick syntax check..."
    git diff --cached --name-only --diff-filter=ACMR | grep "\.js$" | head -10 | while read file; do
        test -f "$file" && node -c "$file" || exit 1
    done
    
    echo "Essential workspace check..."
    yarn check --verify-tree > /dev/null || exit 1
' || {
    echo "⚠️ Hook timeout - using emergency mode"
    echo "✅ Emergency validation passed (full validation required before merge)"
}
EOF
```

---

## 🚨 Emergency Hook Bypass

### 📚 When Bypass is Appropriate
- Hook infrastructure completely broken
- Critical production hotfix needed immediately
- External tool dependencies unavailable
- Development environment setup issues

### 🔧 Safe Bypass Procedures

#### Temporary Hook Disabling:
```bash
# Document the bypass
cat > HOOK_BYPASS_$(date +%Y%m%d_%H%M).md << EOF
# Hook Bypass Documentation

**Date**: $(date)
**Reason**: [Specific reason for bypass]
**Duration**: [Expected duration]
**Risk**: [Assessment of bypass risk]

## Bypass Actions
- [ ] Hooks disabled temporarily
- [ ] Quality checks deferred
- [ ] Manual verification planned

## Restoration Plan
- [ ] Fix hook infrastructure
- [ ] Re-enable hooks
- [ ] Run deferred quality checks
- [ ] Verify no quality regressions
EOF

# Disable hooks temporarily
mv .husky/pre-commit .husky/pre-commit.disabled
mv .husky/pre-push .husky/pre-push.disabled

echo "⚠️ Hooks temporarily disabled - see HOOK_BYPASS_*.md"
```

#### Restoration After Bypass:
```bash
# Restore hooks and run missed validations
echo "=== Restoring Hooks After Bypass ==="

# 1. Re-enable hooks
mv .husky/pre-commit.disabled .husky/pre-commit
mv .husky/pre-push.disabled .husky/pre-push

# 2. Run all deferred quality checks
yarn test:all
yarn lint:all --fix
yarn check --verify-tree

# 3. Verify hook functionality
.husky/pre-commit
echo $? # Should be 0

# 4. Clean up bypass documentation
git add HOOK_BYPASS_*.md
git commit -m "Document hook bypass and restoration"
```

---

## 📋 Setup Best Practices

### 🔧 Recommended Hook Configuration

#### Comprehensive .husky/pre-commit:
```bash
# Production-ready pre-commit hook
cat > .husky/pre-commit.production << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Load error message system
[ -f .github/hooks/error-messages.sh ] && source .github/hooks/error-messages.sh

echo "🔍 Pre-commit validation..."

# 1. Package Manager Validation
if ls package-lock.json >/dev/null 2>&1; then
    echo "❌ package-lock.json detected"
    show_package_manager_error "npm" "yarn" "$PWD" 2>/dev/null || {
        echo "Fix: rm package-lock.json && yarn install"
        exit 1
    }
fi

# 2. Workspace Check
echo "Checking workspace integrity..."
yarn check --verify-tree || exit 1

# 3. Lint Staged Files
echo "Linting staged files..."
if command -v lint-staged >/dev/null 2>&1; then
    npx lint-staged || exit 1
else
    # Manual staged file linting
    git diff --cached --name-only --diff-filter=ACMR | grep '\.js$' | while read file; do
        [ -f "$file" ] && {
            node -c "$file" || exit 1
            if [[ "$file" == backend/* ]]; then
                yarn workspace backend eslint "$file" || exit 1
            elif [[ "$file" == frontend/* ]]; then
                yarn workspace frontend eslint "$file" || exit 1
            fi
        }
    done
fi

# 4. Quick Tests (if applicable)
if [ "$(git diff --cached --name-only | grep -E '\.(test|spec)\.js$' | wc -l)" -gt 0 ]; then
    echo "Running affected tests..."
    yarn test:quick || exit 1
fi

echo "✅ Pre-commit validation passed"
EOF
```

### 📊 Hook Monitoring

#### Performance Monitoring:
```bash
# Add performance monitoring to hooks
cat > .husky/_/monitor.sh << 'EOF'
#!/usr/bin/env sh
# Hook performance monitoring

hook_start=$(date +%s)
hook_name="$1"

# Function to log hook completion
log_hook_completion() {
    hook_end=$(date +%s)
    duration=$((hook_end - hook_start))
    echo "📊 Hook '$hook_name' completed in ${duration}s"
    
    # Warn if hook takes too long
    if [ $duration -gt 30 ]; then
        echo "⚠️ Hook performance warning: ${duration}s > 30s target"
        echo "Consider optimizing hook configuration"
    fi
}

# Trap to ensure monitoring on exit
trap log_hook_completion EXIT
EOF

# Source monitoring in hooks
echo '. "$(dirname -- "$0")/../_/monitor.sh" "pre-commit"' >> .husky/pre-commit
```

---

## 📖 Integration References

### 🔗 Related Templates
- **[hook-violation-resolution.md]**: Primary diagnosis when setup fails
- **[package-manager-errors.md]**: Yarn vs npm setup issues
- **[performance-errors.md]**: Hook timeout and resource issues
- **[emergency-overrides.md]**: When to safely bypass hooks

### 🛠️ Error Message Integration
```bash
# Reference existing error message system
source .github/hooks/error-messages.sh

# Use educational messages in hooks
show_package_manager_error "npm" "yarn" "$PWD"
show_performance_error "timeout" "45s" "30s"
```

### 📊 Success Metrics
- **Setup Time**: New contributors have working hooks within 5 minutes
- **Reliability**: Hooks work consistently across development environments
- **Performance**: Hooks complete within 30 seconds for typical commits
- **Maintainability**: Hook configuration is version-controlled and documented

---

**Created**: July 2025  
**Integration**: Part of resolution playbook system (#40)  
**Dependencies**: Integrates with error message system (#42), supports workflow patterns (#37)  
**Usage**: Setup and validation guide for Husky pre-commit infrastructure**