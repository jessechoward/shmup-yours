# 🚨 ESLint/Code Quality Violations

## Overview
Educational error messages for code quality violations that help agents understand and resolve linting failures while learning project coding standards.

---

## 🚨 ESLint Configuration Missing

### 📚 Why This Rule Exists
ESLint enforces consistent code style across the project, catches potential bugs early, and maintains readability for collaborative development. Without proper configuration:
- Code style inconsistencies slow down reviews
- Common JavaScript errors slip through to production
- New contributors struggle with project conventions

**Project Standard**: All JavaScript code must pass ESLint checks before commit.

### 🔧 Quick Fix (90% of cases)

#### Initialize ESLint configuration:
```bash
# From project root
yarn add --dev eslint

# For backend workspace (Node.js)
yarn workspace backend add --dev eslint @eslint/js

# For frontend workspace (Browser)
yarn workspace frontend add --dev eslint @eslint/js

# Create basic ESLint config
cat > .eslintrc.js << 'EOF'
module.exports = {
  extends: ['@eslint/js/recommended'],
  env: {
    es2022: true,
    node: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    // Align with project style from .copilot-instructions.md
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'no-var': 'error',
    'prefer-const': 'error'
  }
};
EOF
```

#### Add lint scripts to package.json:
```bash
# Update root package.json
npm pkg set scripts.lint:all="yarn workspaces run lint"

# Update workspace package.json files
yarn workspace backend npm pkg set scripts.lint="eslint src/ --ext .js"
yarn workspace frontend npm pkg set scripts.lint="eslint src/ --ext .js"
```

### 🔍 Verification Steps
```bash
# Test ESLint runs without errors on config
yarn lint:all

# Verify configuration is valid
yarn workspace backend eslint --print-config src/index.js
yarn workspace frontend eslint --print-config src/index.js

# Test fix mode works
yarn workspace backend eslint src/ --fix
```

### 🆘 When to Escalate
**Escalate if** (after 5 minutes of attempts):
- ESLint configuration conflicts with existing code patterns
- Parser errors indicate Node.js/browser environment conflicts
- Cannot determine appropriate ruleset for project architecture

**Escalation Format**:
```markdown
## 🆘 ESLint Setup Escalation
**Issue**: Configuration initialization failed
**Error**: [Paste specific error message]
**Workspace**: [backend/frontend/both]
**Attempted**: [List configuration attempts]
```

---

## 🚨 ESLint Rule Violations Detected

### 📚 Why This Rule Exists
Specific linting rules prevent common bugs and maintain code consistency. Each violation teaches better JavaScript practices.

### 🔧 Quick Fix by Rule Type

#### Unused Variables (`no-unused-vars`)
```javascript
// ❌ Error: 'unusedVar' is defined but never used
const unusedVar = 'hello';
const result = performCalculation();

// ✅ Fix: Remove unused variables
const result = performCalculation();

// ✅ Alternative: Prefix with underscore if keeping for documentation
const _documentationExample = 'hello';
const result = performCalculation();
```

#### Use const instead of let (`prefer-const`)
```javascript
// ❌ Error: 'config' is never reassigned
let config = {
  timeout: 5000,
  retries: 3
};

// ✅ Fix: Use const for values that don't change
const config = {
  timeout: 5000,
  retries: 3
};
```

#### No var declarations (`no-var`)
```javascript
// ❌ Error: Unexpected var, use let or const instead
for (var i = 0; i < items.length; i++) {
  processItem(items[i]);
}

// ✅ Fix: Use let or const
for (let i = 0; i < items.length; i++) {
  processItem(items[i]);
}
```

#### Missing semicolons (`semi`)
```javascript
// ❌ Error: Missing semicolon
const message = 'Hello world'
console.log(message)

// ✅ Fix: Add semicolons
const message = 'Hello world';
console.log(message);
```

#### Console statements (`no-console`)
```javascript
// ❌ Warning: Unexpected console statement
console.log('Debug information');

// ✅ Fix: Use proper logging (backend)
import winston from 'winston';
const logger = winston.createLogger({/* config */});
logger.info('Debug information');

// ✅ Fix: Remove debug logs (frontend)
// console.log('Debug information'); // Remove or replace with proper logging
```

### 🔧 Automatic Fixes
```bash
# Fix auto-fixable issues
yarn workspace backend eslint src/ --fix
yarn workspace frontend eslint src/ --fix

# Check remaining issues
yarn lint:all
```

### 🔍 Verification Steps
```bash
# Run linting on specific file
yarn workspace <workspace> eslint <file-path>

# Run full lint check
yarn lint:all

# Verify no errors remain
echo $?  # Should output: 0
```

### 🆘 When to Escalate
- Rule violations involve complex refactoring (>15 minutes)
- Fixing one rule breaks others in a cycle
- Rules conflict with external library patterns
- Auto-fix creates logical errors

---

## 🚨 Linting Performance Issues

### 📚 Why This Rule Exists
ESLint should complete quickly to maintain development velocity. Slow linting indicates configuration problems or overly broad file scanning.

### 🔧 Quick Fix (90% of cases)

#### Optimize ESLint configuration:
```javascript
// .eslintrc.js - Add performance optimizations
module.exports = {
  extends: ['@eslint/js/recommended'],
  env: {
    es2022: true,
    node: true,
    browser: true
  },
  // Performance: Ignore unnecessary files
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js',
    'coverage/',
    '.husky/'
  ],
  // Performance: Limit parsing overhead
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
};
```

#### Create .eslintignore file:
```bash
# Create performance-focused ignore file
cat > .eslintignore << 'EOF'
# Dependencies
node_modules/
yarn.lock
package-lock.json

# Build outputs
dist/
build/
*.min.js

# Test coverage
coverage/

# OS and editor files
.DS_Store
*.swp
*.swo

# Git hooks
.husky/
.git/
EOF
```

#### Limit scope in package.json scripts:
```javascript
// Update package.json scripts for performance
{
  "scripts": {
    "lint": "eslint src/ --ext .js --cache",
    "lint:fix": "eslint src/ --ext .js --fix --cache"
  }
}
```

### 🔍 Verification Steps
```bash
# Time the linting process
time yarn lint:all

# Check cache is working
ls -la .eslintcache

# Verify file scope is appropriate
yarn workspace backend eslint src/ --debug 2>&1 | grep "Processing"
```

### 🆘 When to Escalate
- Linting takes >30 seconds on small codebases
- Memory usage grows excessively during linting
- Configuration optimizations break rule detection

---

## 🚨 ESLint Version Conflicts

### 📚 Why This Rule Exists
Different ESLint versions across workspaces can cause inconsistent rule enforcement and configuration conflicts.

### 🔧 Quick Fix (90% of cases)

#### Standardize ESLint versions:
```bash
# Check current versions
yarn workspace backend list --pattern eslint
yarn workspace frontend list --pattern eslint

# Remove conflicting versions
yarn workspace backend remove eslint
yarn workspace frontend remove eslint

# Install consistent version at root
yarn add --dev eslint@latest

# Verify version consistency
yarn workspaces run npm list eslint
```

#### Update configurations for version compatibility:
```javascript
// Check for deprecated config patterns
// Old format (ESLint < 9.0):
module.exports = {
  extends: ['eslint:recommended']
};

// New format (ESLint >= 9.0):
import js from '@eslint/js';
export default [
  js.configs.recommended
];
```

### 🔍 Verification Steps
```bash
# Verify version consistency
yarn workspaces run npm list eslint

# Test configuration compatibility
yarn lint:all

# Check for deprecation warnings
yarn workspace backend eslint src/ 2>&1 | grep -i "deprecat"
```

### 🆘 When to Escalate
- Version upgrades break existing rule configurations
- Workspace-specific ESLint requirements conflict
- Plugin compatibility issues across versions

---

## 🚨 Custom Rule Configuration Errors

### 📚 Why This Rule Exists
Project-specific rules enforce coding standards that align with the architecture defined in `.copilot-instructions.md` and `GAME_DESIGN.md`.

### 🔧 Quick Fix for Common Custom Rules

#### Enforce project patterns:
```javascript
// .eslintrc.js - Align with project standards
module.exports = {
  extends: ['@eslint/js/recommended'],
  rules: {
    // Align with Vanilla JS requirement (no TypeScript)
    'no-undef': 'error',
    'no-unused-vars': 'error',
    
    // Enforce modern ES modules (project standard)
    'no-var': 'error',
    'prefer-const': 'error',
    
    // Backend-specific: Proper async/await patterns
    'require-await': 'error',
    'no-return-await': 'error',
    
    // Frontend-specific: Canvas API patterns
    'no-global-assign': 'error',
    
    // Project standard: JSDoc instead of TypeScript
    'valid-jsdoc': 'warn'
  },
  // Environment-specific overrides
  overrides: [
    {
      files: ['backend/src/**/*.js'],
      env: { node: true, browser: false },
      rules: {
        'no-console': 'off'  // Allow console in backend
      }
    },
    {
      files: ['frontend/src/**/*.js'],
      env: { browser: true, node: false },
      rules: {
        'no-console': 'warn'  // Warn about console in frontend
      }
    }
  ]
};
```

#### JSDoc enforcement (TypeScript alternative):
```javascript
// Add JSDoc rules aligned with project standards
"rules": {
  "valid-jsdoc": ["warn", {
    "requireReturn": false,
    "requireReturnDescription": false,
    "preferType": {
      "Boolean": "boolean",
      "Number": "number", 
      "String": "string"
    }
  }],
  "require-jsdoc": ["warn", {
    "require": {
      "FunctionDeclaration": true,
      "MethodDefinition": true,
      "ClassDeclaration": true
    }
  }]
}
```

### 🔍 Verification Steps
```bash
# Test custom rules on sample code
yarn workspace backend eslint src/index.js --no-ignore

# Verify environment-specific rules
yarn workspace frontend eslint src/index.js --no-ignore

# Check JSDoc rule enforcement
yarn lint:all | grep -i "jsdoc"
```

### 🆘 When to Escalate
- Custom rules conflict with external libraries
- Environment-specific rules break shared code
- JSDoc requirements conflict with existing patterns

---

## 🚨 Emergency Override for ESLint

### 📚 When Override is Appropriate
- Critical hotfix requires immediate deployment
- External library incompatible with current rules
- Rule conflict blocks urgent bug fix

### 🔧 Safe Override Procedure

#### Temporary rule disabling:
```bash
# Document the override
cat > ESLINT_OVERRIDE.md << EOF
# ESLint Override

**Date**: $(date)
**File/Rule**: [Specific file or rule]
**Reason**: [Why override was necessary]
**Scope**: [Specific lines or functions]
**Cleanup Plan**: [How to restore compliance]
**Timeline**: [When cleanup will occur]
EOF

# Use inline disabling (minimal scope)
// eslint-disable-next-line no-console
console.log('Emergency debug for production issue');

# Or file-level (document why)
/* eslint-disable no-console */
// EMERGENCY: Production debugging - remove after fix
console.log('Debug info');
/* eslint-enable no-console */
```

#### Temporary config override:
```bash
# Create override config for urgent fixes
cat > .eslintrc.override.js << 'EOF'
module.exports = {
  extends: ['./.eslintrc.js'],
  rules: {
    // Temporarily disable blocking rule
    'no-console': 'off'
  }
};
EOF

# Use override config
yarn workspace backend eslint --config .eslintrc.override.js src/
```

### 🔍 Post-Override Cleanup (Required)
```bash
# 1. Remove inline disables
grep -r "eslint-disable" src/ && echo "Clean up disable comments"

# 2. Remove override config
rm -f .eslintrc.override.js

# 3. Restore full compliance
yarn lint:all

# 4. Clean up documentation
git rm ESLINT_OVERRIDE.md
git commit -m "Restore ESLint compliance after emergency override"
```

### 🆘 Escalation for Overrides
**Always escalate** if:
- Override affects core code quality standards
- Cannot restore compliance within 24 hours
- Override reveals architectural issues requiring broader changes

---

**Integration**: Follows patterns from `.copilot-instructions.md`  
**Performance Target**: 90% auto-fix success, 5-minute manual resolution  
**Escalation SLA**: Comment within 5 minutes if standard fixes fail