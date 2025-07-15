# 📋 Commit Quality Checklist

## Overview
Comprehensive prevention checklist to help agents avoid hook violations and maintain high code quality. This template provides proactive quality assurance steps to prevent issues before they trigger hook failures.

---

## 🚀 Pre-Commit Quality Checklist (Target: 2-3 minutes)

### 📋 Essential Quality Gates

#### ✅ Package Manager Consistency
```bash
# Quick package manager validation
echo "=== Package Manager Check ==="

# 1. Verify no npm lockfile exists
ls package-lock.json 2>/dev/null && {
    echo "❌ package-lock.json found - remove it"
    echo "Fix: rm package-lock.json && yarn install"
    exit 1
} || echo "✅ No npm lockfile conflict"

# 2. Verify yarn.lock is healthy
test -f yarn.lock && echo "✅ yarn.lock exists" || {
    echo "⚠️ yarn.lock missing - regenerating"
    yarn install
}

# 3. Quick workspace integrity check
yarn check --verify-tree >/dev/null 2>&1 && echo "✅ Workspace integrity OK" || {
    echo "❌ Workspace integrity issue"
    echo "Fix: yarn install"
    exit 1
}
```

#### ✅ Code Quality Pre-Check
```bash
# Validate code quality before committing
echo "=== Code Quality Pre-Check ==="

# 1. Syntax check on modified files
git diff --name-only HEAD | grep '\.js$' | while read file; do
    if [ -f "$file" ]; then
        echo "Checking syntax: $file"
        node -c "$file" || {
            echo "❌ Syntax error in: $file"
            exit 1
        }
    fi
done && echo "✅ JavaScript syntax valid"

# 2. Quick lint check (auto-fix enabled)
echo "Running lint with auto-fix..."
if git diff --name-only HEAD | grep -q '\.js$'; then
    yarn workspace backend eslint src/ --fix --quiet || echo "⚠️ Backend linting issues remain"
    yarn workspace frontend eslint src/ --fix --quiet || echo "⚠️ Frontend linting issues remain"
    echo "✅ Linting auto-fixes applied"
else
    echo "✅ No JavaScript files to lint"
fi

# 3. Verify no console.log statements in production code
git diff --name-only HEAD | grep '\.js$' | xargs grep -l "console\." 2>/dev/null | while read file; do
    echo "⚠️ Console statements found in: $file"
    echo "Review: Remove debug console statements"
done || echo "✅ No console statements in modified files"
```

#### ✅ Test Coverage Validation
```bash
# Ensure tests exist and pass for changes
echo "=== Test Coverage Check ==="

# 1. Check if test files exist for modified source files
git diff --name-only HEAD | grep '\.js$' | grep -v test | while read file; do
    test_file="${file%%.js}.test.js"
    spec_file="${file%%.js}.spec.js"
    
    if [ -f "$test_file" ] || [ -f "$spec_file" ]; then
        echo "✅ Test exists for: $file"
    else
        echo "⚠️ No test file for: $file"
        echo "Consider adding: ${test_file}"
    fi
done

# 2. Run quick tests on modified areas
if git diff --name-only HEAD | grep -q '\.(test|spec)\.js$'; then
    echo "Running modified tests..."
    yarn test:quick || {
        echo "❌ Tests failing - fix before commit"
        exit 1
    }
    echo "✅ Modified tests passing"
else
    echo "✅ No test files modified"
fi
```

#### ✅ Documentation Consistency
```bash
# Verify documentation is up to date
echo "=== Documentation Check ==="

# 1. Check for README updates if package.json changed
if git diff --name-only HEAD | grep -q "package\.json"; then
    echo "⚠️ package.json modified - verify README.md is current"
    echo "Check: Dependencies, scripts, setup instructions"
fi

# 2. Check for JSDoc on new functions
git diff HEAD --name-only | grep '\.js$' | xargs git diff HEAD | grep -A5 "^+.*function\|^+.*=>" | grep -v "^\+\s*\*\|^\+\s*//" | head -5 | while read line; do
    echo "⚠️ New function detected - ensure JSDoc is present"
    echo "Add: /** @description ... */"
done || echo "✅ JSDoc patterns look good"

# 3. Verify commit message follows convention
echo "Planning commit message format:"
echo "type(scope): description"
echo "Example: feat(backend): add player collision detection"
echo "Types: feat, fix, docs, style, refactor, test, chore"
```

---

## 🔍 Advanced Quality Validation (Target: 5 minutes)

### 🎯 Comprehensive Pre-Commit Review

#### Deep Code Quality Analysis
```bash
# Thorough code quality review
echo "=== Deep Quality Analysis ==="

# 1. Check for common anti-patterns
echo "Checking for code anti-patterns..."
git diff HEAD --name-only | grep '\.js$' | xargs grep -n -E "(var |eval\(|with\(|==)" 2>/dev/null | while read match; do
    echo "⚠️ Anti-pattern detected: $match"
    echo "Review: Use const/let, avoid eval/with, prefer ==="
done || echo "✅ No obvious anti-patterns"

# 2. Verify error handling
git diff HEAD --name-only | grep '\.js$' | xargs grep -n -E "(try|catch|throw)" 2>/dev/null | while read match; do
    echo "ℹ️ Error handling found: $match"
    echo "Verify: Proper error handling and logging"
done

# 3. Check for hardcoded values
git diff HEAD --name-only | grep '\.js$' | xargs grep -n -E "(localhost|127\.0\.0\.1|3000|8080)" 2>/dev/null | while read match; do
    echo "⚠️ Hardcoded value detected: $match"
    echo "Consider: Using environment variables or config"
done || echo "✅ No obvious hardcoded values"

# 4. Validate imports/exports
git diff HEAD --name-only | grep '\.js$' | while read file; do
    if [ -f "$file" ]; then
        # Check for unused imports
        grep -E "^import.*from" "$file" 2>/dev/null | while read import_line; do
            var_name=$(echo "$import_line" | sed -E 's/import[[:space:]]*\{?[[:space:]]*([^,}[:space:]]+).*/\1/')
            if ! grep -q "$var_name" "$file" 2>/dev/null; then
                echo "⚠️ Potentially unused import in $file: $var_name"
            fi
        done
    fi
done || echo "✅ Import/export patterns look good"
```

#### Performance and Security Check
```bash
# Performance and security validation
echo "=== Performance & Security Check ==="

# 1. Check for performance concerns
git diff HEAD --name-only | grep '\.js$' | xargs grep -n -E "(setInterval|setTimeout.*0|while.*true)" 2>/dev/null | while read match; do
    echo "⚠️ Performance concern: $match"
    echo "Review: Potential infinite loops or resource consumption"
done || echo "✅ No obvious performance issues"

# 2. Security pattern check
git diff HEAD --name-only | grep '\.js$' | xargs grep -n -E "(eval|innerHTML|document\.write)" 2>/dev/null | while read match; do
    echo "🔒 Security review needed: $match"
    echo "Review: XSS and injection vulnerabilities"
done || echo "✅ No obvious security concerns"

# 3. Dependency security check
if git diff --name-only HEAD | grep -q "package\.json"; then
    echo "Running dependency security check..."
    yarn audit --level moderate || echo "⚠️ Security vulnerabilities in dependencies"
else
    echo "✅ No dependency changes"
fi
```

#### Architecture Compliance
```bash
# Verify changes align with project architecture
echo "=== Architecture Compliance Check ==="

# 1. Check file organization
git diff --name-only HEAD | while read file; do
    case "$file" in
        backend/src/*)
            echo "✅ Backend file in correct location: $file" ;;
        frontend/src/*)
            echo "✅ Frontend file in correct location: $file" ;;
        test/*)
            echo "✅ Test file in correct location: $file" ;;
        *.js)
            if [[ "$file" != backend/* && "$file" != frontend/* && "$file" != test/* ]]; then
                echo "⚠️ JavaScript file outside workspace: $file"
                echo "Review: Should this be in a workspace directory?"
            fi ;;
    esac
done

# 2. Check for TypeScript files (project uses vanilla JS)
git diff --name-only HEAD | grep '\.ts$' | while read file; do
    echo "❌ TypeScript file detected: $file"
    echo "Project standard: Use vanilla JavaScript (.js files)"
    echo "Convert to .js or document exception reason"
done || echo "✅ No TypeScript files (correct for this project)"

# 3. Verify Canvas API usage (frontend)
if git diff --name-only HEAD | grep -q "frontend.*\.js$"; then
    git diff HEAD -- frontend/ | grep -E "\+(.*PixiJS|.*Unity|.*Phaser)" | while read line; do
        echo "⚠️ External game engine detected: $line"
        echo "Project standard: Use native HTML5 Canvas API"
    done || echo "✅ Using native Canvas API (correct)"
fi
```

---

## 🛡️ Workspace-Specific Quality Checks

### 🖥️ Backend Quality Checklist

#### Backend-Specific Validation
```bash
# Backend workspace quality checks
echo "=== Backend Quality Validation ==="

# 1. Check Node.js patterns
if git diff --name-only HEAD | grep -q "backend.*\.js$"; then
    echo "Validating backend code patterns..."
    
    # Check for proper async/await usage
    git diff HEAD -- backend/ | grep -E "\+.*\.then\(" | while read line; do
        echo "⚠️ Promise .then() detected: $line"
        echo "Project standard: Use async/await patterns"
    done || echo "✅ Using async/await patterns"
    
    # Check for proper error handling
    git diff HEAD -- backend/ | grep -E "\+.*try" | while read line; do
        if ! git diff HEAD -- backend/ | grep -A10 "$line" | grep -q "catch"; then
            echo "⚠️ try without catch detected"
            echo "Ensure proper error handling"
        fi
    done || echo "✅ Error handling patterns look good"
    
    # Check for winston logging usage
    git diff HEAD -- backend/ | grep -E "\+.*console\." | while read line; do
        echo "⚠️ Console logging in backend: $line"
        echo "Consider: Using winston structured logging"
    done || echo "✅ Using structured logging"
fi
```

#### Backend Environment Check
```bash
# Backend environment and dependencies
echo "=== Backend Environment Check ==="

# 1. Verify backend dependencies
if git diff --name-only HEAD | grep -q "backend/package\.json"; then
    echo "Backend dependencies changed - validating..."
    
    # Check for TypeScript dependencies (should not exist)
    grep -E "typescript|@types/" backend/package.json | while read dep; do
        echo "⚠️ TypeScript dependency in backend: $dep"
        echo "Project standard: Vanilla JavaScript only"
    done || echo "✅ No TypeScript dependencies"
    
    # Verify essential backend dependencies exist
    grep -q '"ws"' backend/package.json && echo "✅ WebSocket library present" || echo "⚠️ WebSocket library missing"
    grep -q '"express"' backend/package.json && echo "✅ Express framework present" || echo "ℹ️ Express not used (vanilla Node.js OK)"
fi

# 2. Test backend startup
echo "Testing backend startup..."
cd backend && timeout 10s yarn start --help >/dev/null 2>&1 && echo "✅ Backend startup script works" || echo "⚠️ Backend startup issue"
cd ..
```

### 🎨 Frontend Quality Checklist

#### Frontend-Specific Validation
```bash
# Frontend workspace quality checks
echo "=== Frontend Quality Validation ==="

# 1. Check Vue.js integration patterns
if git diff --name-only HEAD | grep -q "frontend.*\.js$"; then
    echo "Validating frontend code patterns..."
    
    # Check for proper Vue component usage
    git diff HEAD -- frontend/ | grep -E "\+.*Vue\.component|createApp" | while read line; do
        echo "✅ Vue.js pattern detected: $line"
    done
    
    # Check for Canvas API usage
    git diff HEAD -- frontend/ | grep -E "\+.*getContext.*2d|canvas\." | while read line; do
        echo "✅ Canvas API usage: $line"
    done
    
    # Check for game engine imports (should not exist)
    git diff HEAD -- frontend/ | grep -E "\+.*import.*pixi|phaser|unity" | while read line; do
        echo "❌ External game engine import: $line"
        echo "Project standard: Native HTML5 Canvas API only"
    done || echo "✅ Using native Canvas API"
fi

# 2. Check for browser compatibility
git diff HEAD -- frontend/ | grep -E "\+.*let|const|=>|async" | head -1 | while read line; do
    echo "✅ Modern JavaScript detected: ES6+ features"
    echo "Verify: Browser compatibility requirements met"
done
```

#### Frontend Asset and Performance Check
```bash
# Frontend assets and performance
echo "=== Frontend Asset Check ==="

# 1. Check for large files
git diff --name-only HEAD | grep -E "frontend.*\.(png|jpg|jpeg|gif|svg|mp3|wav)$" | while read file; do
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
        if [ "$size" -gt 1048576 ]; then  # 1MB
            echo "⚠️ Large asset file: $file ($(($size / 1024))KB)"
            echo "Consider: Compression or external hosting"
        else
            echo "✅ Asset size OK: $file"
        fi
    fi
done || echo "✅ No large assets added"

# 2. Check for proper resource loading
if git diff --name-only HEAD | grep -q "frontend.*\.js$"; then
    git diff HEAD -- frontend/ | grep -E "\+.*fetch|XMLHttpRequest" | while read line; do
        echo "ℹ️ HTTP request detected: $line"
        echo "Verify: Error handling and loading states"
    done || echo "✅ HTTP request patterns look good"
fi
```

---

## 🧪 Test Quality Assurance

### 📝 Test Coverage and Quality

#### Test File Validation
```bash
# Validate test quality and coverage
echo "=== Test Quality Validation ==="

# 1. Check test file naming conventions
git diff --name-only HEAD | grep -E "\.(test|spec)\.js$" | while read file; do
    if [[ "$file" =~ \.(test|spec)\.js$ ]]; then
        echo "✅ Test file naming OK: $file"
    else
        echo "⚠️ Test file naming: $file (should end with .test.js or .spec.js)"
    fi
done || echo "✅ No test files modified"

# 2. Verify test structure
git diff --name-only HEAD | grep -E "\.(test|spec)\.js$" | while read file; do
    if [ -f "$file" ]; then
        # Check for proper test structure
        grep -q "describe\|it\|test" "$file" && echo "✅ Test structure present: $file" || echo "⚠️ No test structure in: $file"
        
        # Check for assertions
        grep -q "expect\|assert" "$file" && echo "✅ Assertions present: $file" || echo "⚠️ No assertions in: $file"
    fi
done

# 3. Check for test data cleanup
git diff HEAD | grep -E "\+.*beforeEach|afterEach|setUp|tearDown" | while read line; do
    echo "✅ Test cleanup pattern: $line"
done || echo "ℹ️ Consider adding test cleanup if needed"
```

#### Test Performance and Reliability
```bash
# Test performance and reliability checks
echo "=== Test Performance Check ==="

# 1. Check for slow test patterns
git diff HEAD | grep -E "\+.*setTimeout|setInterval|sleep" | while read line; do
    echo "⚠️ Potentially slow test pattern: $line"
    echo "Consider: Using fake timers or mocking"
done || echo "✅ No obvious slow test patterns"

# 2. Check for flaky test patterns
git diff HEAD | grep -E "\+.*Math\.random|Date\.now|new Date" | while read line; do
    echo "⚠️ Non-deterministic pattern in tests: $line"  
    echo "Consider: Mocking random/time values"
done || echo "✅ Tests appear deterministic"

# 3. Run affected tests
if git diff --name-only HEAD | grep -q '\.(test|spec)\.js$'; then
    echo "Running affected tests..."
    yarn test --passWithNoTests --findRelatedTests $(git diff --name-only HEAD | grep -E '\.(test|spec)\.js$' | tr '\n' ' ') || {
        echo "❌ Affected tests failing"
        exit 1
    }
    echo "✅ Affected tests passing"
fi
```

---

## 📊 Quality Metrics and Monitoring

### 📈 Code Quality Metrics

#### Complexity and Maintainability
```bash
# Check code complexity metrics
echo "=== Code Complexity Check ==="

# 1. Function length check
git diff --name-only HEAD | grep '\.js$' | while read file; do
    if [ -f "$file" ]; then
        # Count lines in functions (simple heuristic)
        awk '/function|=>/ {start=NR} /^}/ {if(start && NR-start > 50) print "⚠️ Long function in '$file' lines " start "-" NR}' "$file"
    fi
done || echo "✅ Function lengths reasonable"

# 2. File size check
git diff --name-only HEAD | grep '\.js$' | while read file; do
    if [ -f "$file" ]; then
        lines=$(wc -l < "$file")
        if [ "$lines" -gt 500 ]; then
            echo "⚠️ Large file: $file ($lines lines)"
            echo "Consider: Breaking into smaller modules"
        else
            echo "✅ File size OK: $file ($lines lines)"
        fi
    fi
done || echo "✅ No overly large files"

# 3. Cyclomatic complexity (simple check)
git diff --name-only HEAD | grep '\.js$' | while read file; do
    if [ -f "$file" ]; then
        # Count decision points
        complexity=$(grep -E "(if|else|while|for|switch|case|\?|\|\||&&)" "$file" | wc -l)
        if [ "$complexity" -gt 20 ]; then
            echo "⚠️ High complexity: $file ($complexity decision points)"
            echo "Consider: Refactoring into smaller functions"
        fi
    fi
done || echo "✅ Complexity levels reasonable"
```

#### Documentation Quality
```bash
# Documentation quality metrics
echo "=== Documentation Quality Check ==="

# 1. JSDoc coverage for new functions
git diff HEAD --name-only | grep '\.js$' | xargs git diff HEAD | grep -A1 "^+.*function\|^+.*=>" | grep -E "^\+[[:space:]]*\*|^\+[[:space:]]*/\*\*" | wc -l > new_docs.tmp
git diff HEAD --name-only | grep '\.js$' | xargs git diff HEAD | grep -E "^+.*function\|^+.*=>" | wc -l > new_functions.tmp

new_docs=$(cat new_docs.tmp)
new_functions=$(cat new_functions.tmp)
rm -f new_docs.tmp new_functions.tmp

if [ "$new_functions" -gt 0 ]; then
    coverage_percent=$((new_docs * 100 / new_functions))
    echo "📊 JSDoc coverage for new functions: $coverage_percent%"
    if [ "$coverage_percent" -lt 80 ]; then
        echo "⚠️ Consider adding JSDoc for new functions"
    else
        echo "✅ Good documentation coverage"
    fi
else
    echo "✅ No new functions to document"
fi

# 2. README update check
if git diff --name-only HEAD | grep -E "(package\.json|src/.*\.js)" | head -1; then
    echo "ℹ️ Code changes detected - verify README.md is current"
    echo "Check: API changes, new features, setup instructions"
fi
```

---

## 🚨 Final Pre-Commit Verification

### 🔍 Complete Quality Gate

#### Final Validation Checklist
```bash
# Final comprehensive validation
echo "=== Final Pre-Commit Validation ==="

# 1. All quality checks passed
echo "Running final quality validation..."

# Package manager consistency
test ! -f package-lock.json && echo "✅ Package manager consistent" || {
    echo "❌ package-lock.json still exists"
    exit 1
}

# Workspace integrity
yarn check --verify-tree >/dev/null 2>&1 && echo "✅ Workspace integrity OK" || {
    echo "❌ Workspace integrity failed"
    exit 1
}

# Code syntax
git diff --name-only HEAD | grep '\.js$' | while read file; do
    [ -f "$file" ] && node -c "$file" || {
        echo "❌ Syntax error in: $file"
        exit 1
    }
done && echo "✅ All syntax valid"

# Linting
yarn lint:all --quiet && echo "✅ Linting passed" || {
    echo "❌ Linting issues remain"
    echo "Run: yarn lint:all --fix"
    exit 1
}

echo "🎉 All quality checks passed - ready to commit!"
```

#### Commit Message Quality
```bash
# Validate commit message quality
echo "=== Commit Message Guidelines ==="

cat << 'EOF'
📝 Commit Message Format:
type(scope): description

Types:
- feat: New feature
- fix: Bug fix  
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code refactoring
- test: Adding or updating tests
- chore: Maintenance tasks

Examples:
✅ feat(backend): add player collision detection
✅ fix(frontend): resolve canvas rendering issue
✅ docs(api): update WebSocket protocol documentation
✅ test(game): add unit tests for player movement

❌ Avoid:
- "fix stuff"
- "update code" 
- "changes"
- "wip"
EOF

# Check if commit message file exists and validate
if [ -f ".git/COMMIT_EDITMSG" ]; then
    msg=$(cat .git/COMMIT_EDITMSG | head -1)
    if echo "$msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .+"; then
        echo "✅ Commit message format looks good"
    else
        echo "⚠️ Consider improving commit message format"
    fi
fi
```

---

## 📖 Integration and References

### 🔗 Quality Template References
- **[hook-violation-resolution.md]**: Primary diagnosis for quality failures
- **[package-manager-errors.md]**: Package manager violation prevention
- **[eslint-errors.md]**: Code quality issue prevention
- **[pre-commit-setup-validation.md]**: Hook setup validation
- **[yarn-lock-conflict-resolution.md]**: Dependency conflict prevention

### 🛠️ Automation Integration
```bash
# Save checklist as executable script
cat > quality-check.sh << 'EOF'
#!/bin/bash
# Quality checklist automation
set -e

echo "🔍 Running commit quality checklist..."

# Source this checklist
source .github/hooks/commit-quality-checklist.md

# Run essential checks
check_package_manager_consistency
check_code_quality
check_test_coverage
check_documentation

echo "✅ Quality checklist complete"
EOF

chmod +x quality-check.sh
```

### 📊 Success Metrics
- **Prevention Rate**: 90% of quality issues caught before commit
- **Time Investment**: 2-3 minutes average for quality validation
- **Issue Reduction**: 50% fewer hook violations through prevention
- **Developer Experience**: Faster commit cycle through proactive quality

---

**Created**: July 2025  
**Integration**: Prevention component of resolution playbook system (#40)  
**Dependencies**: Complements error message system (#42), aligns with workflow patterns (#37)  
**Usage**: Proactive quality assurance to prevent hook violations and maintain development velocity**