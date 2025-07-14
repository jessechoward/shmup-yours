# Hook Integration Examples

## Overview
This document shows how the educational error messages integrate with actual Git hooks and scripts.

## Example 1: Package Manager Validation Hook

```bash
#!/usr/bin/env sh
# .husky/pre-commit - Example with educational error messages
. "$(dirname -- "$0")/_/husky.sh"

# Source the educational error message system
source .github/hooks/error-messages.sh

# Check for npm usage violations
if [ -f "package-lock.json" ]; then
    show_package_manager_error "npm" "yarn" "$(pwd)"
    exit 1
fi

# Check if npm commands were used in commit message
if git log -1 --pretty=%B | grep -q "npm install\|npm run\|npm add"; then
    echo "🔍 Detected npm command in commit message"
    show_package_manager_error "npm" "yarn" "commit message"
    exit 1
fi

# Continue with normal pre-commit checks
yarn lint-staged
```

## Example 2: ESLint Integration

```bash
#!/usr/bin/env sh
# Example script that runs ESLint with educational error handling

source .github/hooks/error-messages.sh

# Run ESLint and capture output
eslint_output=$(yarn lint:all 2>&1)
eslint_exit_code=$?

if [ $eslint_exit_code -ne 0 ]; then
    # Analyze the type of ESLint error
    if echo "$eslint_output" | grep -q "Configuration.*not found"; then
        show_eslint_error "configuration" "$eslint_output" ""
    elif echo "$eslint_output" | grep -q "no-unused-vars\|prefer-const\|no-var"; then
        specific_error=$(echo "$eslint_output" | grep -o "no-unused-vars\|prefer-const\|no-var" | head -1)
        show_eslint_error "violations" "$specific_error" "$(echo "$eslint_output" | grep -o "src/[^:]*" | head -1)"
    else
        show_eslint_error "violations" "Multiple rule violations" ""
    fi
    exit 1
fi

echo "✅ ESLint checks passed"
```

## Example 3: Performance Monitoring

```bash
#!/usr/bin/env sh
# Example hook with performance monitoring and educational errors

source .github/hooks/error-messages.sh

start_time=$(date +%s)

# Run the actual hook operations
yarn lint-staged
hook_exit_code=$?

end_time=$(date +%s)
duration=$((end_time - start_time))

# Check performance
if [ $duration -gt 30 ]; then
    show_performance_error "timeout" "${duration}s" "30s"
    echo ""
    echo "🔧 Consider optimizing your hook configuration:"
    echo "• Use lint-staged instead of full linting"
    echo "• Enable ESLint caching"
    echo "• Run only tests related to changed files"
    exit 1
fi

if [ $hook_exit_code -ne 0 ]; then
    echo "❌ Hook failed for reasons other than performance"
    exit $hook_exit_code
fi

echo "✅ Pre-commit checks completed in ${duration}s"
```

## Example 4: Package.json Script Integration

```json
{
  "scripts": {
    "pre-commit": "source .github/hooks/error-messages.sh && yarn lint-staged",
    "validate:package-manager": "source .github/hooks/error-messages.sh && test ! -f package-lock.json || (show_package_manager_error 'npm' 'yarn' '$PWD' && exit 1)",
    "validate:lint": "source .github/hooks/error-messages.sh && yarn lint:all || (show_eslint_error 'violations' 'Multiple violations' '' && exit 1)",
    "emergency:override": "source .github/hooks/error-messages.sh && show_emergency_override_info 'infrastructure-failure'"
  }
}
```

## Example 5: CI/CD Integration

```yaml
# .github/workflows/quality-check.yml
name: Quality Check with Educational Errors

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Check package manager compliance
        run: |
          source .github/hooks/error-messages.sh
          if [ -f "package-lock.json" ]; then
            show_package_manager_error "npm" "yarn" "CI environment"
            exit 1
          fi
      
      - name: Run ESLint with educational errors
        run: |
          source .github/hooks/error-messages.sh
          if ! yarn lint:all; then
            show_eslint_error "violations" "CI validation failed" "multiple files"
            exit 1
          fi
      
      - name: Monitor performance
        run: |
          source .github/hooks/error-messages.sh
          start_time=$(date +%s)
          yarn test:all
          end_time=$(date +%s)
          duration=$((end_time - start_time))
          
          if [ $duration -gt 300 ]; then  # 5 minutes
            show_performance_error "slow-tests" "${duration}s" "300s"
            echo "::warning::Test suite is slower than expected"
          fi
```

## Example 6: Developer Helper Script

```bash
#!/bin/bash
# scripts/fix-common-issues.sh - Helper script using educational error messages

source .github/hooks/error-messages.sh

echo "🔧 Common Issue Fixer for shmup-yours"
echo ""

# Check for package manager issues
if [ -f "package-lock.json" ]; then
    echo "🚨 Found package manager issue:"
    show_package_manager_error "npm" "yarn" "$(pwd)"
    
    echo ""
    read -p "🤔 Auto-fix this issue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -f package-lock.json
        yarn install
        echo "✅ Fixed: Removed package-lock.json and reinstalled with yarn"
    fi
fi

# Check for ESLint issues
echo ""
echo "🔍 Checking for ESLint issues..."
if ! yarn lint:all --quiet; then
    echo ""
    echo "🚨 Found ESLint issues:"
    show_eslint_error "violations" "Multiple violations detected" "various files"
    
    echo ""
    read -p "🤔 Auto-fix ESLint issues? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        yarn lint:all --fix
        echo "✅ Auto-fixed ESLint issues where possible"
        
        if ! yarn lint:all --quiet; then
            echo "⚠️  Some issues require manual fixing. Run: yarn lint:all"
        fi
    fi
fi

echo ""
echo "🎯 Run this script anytime with: ./scripts/fix-common-issues.sh"
```

## Example 7: Git Hook Template

```bash
#!/usr/bin/env sh
# Template for any Git hook using educational error messages

# Exit on any error
set -e

# Source educational error message functions
if [ -f ".github/hooks/error-messages.sh" ]; then
    source .github/hooks/error-messages.sh
else
    echo "⚠️  Educational error messages not available"
    echo "📖 See .github/hooks/README.md for setup"
fi

# Hook-specific logic here
echo "🔍 Running [hook-name] checks..."

# Example: Package manager check
if [ -f "package-lock.json" ]; then
    if command -v show_package_manager_error >/dev/null 2>&1; then
        show_package_manager_error "npm" "yarn" "$(pwd)"
    else
        echo "❌ Package manager violation: Found package-lock.json"
        echo "🔧 Fix: rm package-lock.json && yarn install"
    fi
    exit 1
fi

# Example: Performance monitoring
start_time=$(date +%s)

# Your hook operations here
yarn lint-staged

end_time=$(date +%s)
duration=$((end_time - start_time))

if [ $duration -gt 30 ]; then
    if command -v show_performance_error >/dev/null 2>&1; then
        show_performance_error "timeout" "${duration}s" "30s"
    else
        echo "⚠️  Hook took ${duration}s (target: <30s)"
        echo "🔧 Consider optimizing hook configuration"
    fi
fi

echo "✅ [hook-name] completed successfully"
```

## Testing the Integration

```bash
# Test the error message functions
source .github/hooks/error-messages.sh

# Test package manager error
show_package_manager_error "npm" "yarn" "/path/to/project"

# Test ESLint error
show_eslint_error "violations" "no-unused-vars" "src/index.js"

# Test performance error
show_performance_error "timeout" "45s" "30s"

# Test emergency override guidance
show_emergency_override_info "production-hotfix"

# Show all available functions
show_available_errors
```

## Best Practices for Integration

1. **Always source the error messages**: `source .github/hooks/error-messages.sh`
2. **Check if functions are available**: Use `command -v function_name` before calling
3. **Provide fallback messages**: Have simple error messages if educational ones fail
4. **Exit with appropriate codes**: Use `exit 1` for failures, `exit 0` for success
5. **Monitor performance**: Time your hooks and use performance error messages
6. **Document custom usage**: Add examples specific to your hook needs

---

**Usage**: Copy these examples as starting points for implementing hooks with educational error messages  
**Testing**: Run examples in development environment before deploying to production  
**Customization**: Modify error types and messages to match your specific hook requirements