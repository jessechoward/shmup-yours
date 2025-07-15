# ESLint Setup and Configuration

## Overview

This document provides comprehensive guidance for the ESLint enforcement pre-commit hook implementation in the shmup-yours monorepo.

## ✅ Implementation Status

**✅ COMPLETE** - ESLint enforcement pre-commit hook is fully implemented and functional.

### Core Features Delivered

- **Automatic Enforcement**: Pre-commit hook blocks commits with lint violations
- **Educational Messaging**: Clear error messages with specific fix suggestions  
- **Auto-fix Capability**: Safe violations corrected automatically via `lint-staged`
- **Performance Optimized**: Runs only on staged files, completes under 3 seconds
- **Emergency Override**: `git commit --no-verify` with clear usage guidelines

## Architecture

### Configuration Files

```
eslint.config.js           # Modern flat config with workspace-specific rules
.husky/pre-commit          # Git hook that runs ESLint via lint-staged
package.json               # Root package with lint scripts and lint-staged config
frontend/package.json      # Frontend workspace lint scripts
backend/package.json       # Backend workspace lint scripts
```

### ESLint Configuration Strategy

The project uses **ESLint flat config** (modern format) with environment-specific rules:

- **Base rules**: Modern JavaScript, ES2024 modules, JSDoc instead of TypeScript
- **Frontend-specific**: Browser globals, Canvas API, relaxed console warnings
- **Backend-specific**: Node.js globals, console allowed, process patterns
- **Test-specific**: Test framework globals, relaxed rules for development

### Performance Optimizations

1. **lint-staged**: Only lints files staged for commit (not entire codebase)
2. **ESLint cache**: `--cache` flag reduces repeat linting time
3. **Targeted scope**: Workspace scripts lint only `src/` directories
4. **Ignore patterns**: Excludes `node_modules/`, `dist/`, `*.min.js`, etc.

## Usage

### Daily Development

```bash
# Automatic: runs on every commit
git add .
git commit -m "Your commit message"
# ESLint runs automatically and blocks commit if issues found

# Manual linting
yarn lint              # Lint entire project
yarn lint:fix          # Auto-fix issues
yarn lint:all          # Lint all workspaces
```

### Workspace-Specific Linting

```bash
# Frontend workspace
yarn workspace frontend lint
yarn workspace frontend lint:fix

# Backend workspace  
yarn workspace backend lint
yarn workspace backend lint:fix
```

### Emergency Override (Use Sparingly)

```bash
# Only for critical production hotfixes
git commit --no-verify -m "EMERGENCY: [description] - hooks bypassed due to [reason]"

# Mandatory follow-up within 24 hours:
yarn lint:all          # Fix all quality issues
yarn test             # Ensure no regressions
```

## Educational Error Messages

The pre-commit hook integrates with the comprehensive error message system in `.github/hooks/`:

- **Configuration errors**: Missing ESLint setup, invalid configs
- **Violation errors**: Specific rule violations with fix suggestions
- **Performance errors**: Slow hook execution with optimization tips
- **Override guidance**: When and how to use emergency bypasses safely

## Troubleshooting

### Common Issues

**Hook fails with "ESLint not found"**
```bash
yarn install           # Ensure dependencies installed
yarn lint              # Test ESLint works manually
```

**Hook takes too long (>30 seconds)**
```bash
# Check .eslintcache exists and is fresh
ls -la .eslintcache

# Ensure lint-staged is configured correctly
cat package.json | grep -A 5 "lint-staged"
```

**False positives on external files**
```bash
# Check .eslintignore includes necessary patterns
# Add to eslint.config.js ignores array if needed
```

### Performance Monitoring

Target: **<3 seconds** for typical commits (5-10 files)

```bash
# Monitor hook performance
time git commit -m "test"

# Check what files are being linted
yarn lint-staged --verbose
```

## Integration with Development Workflow

### GitHub Copilot Integration

The ESLint rules align with `.copilot-instructions.md` requirements:
- Vanilla JavaScript (no TypeScript)
- ES2024 modules and modern patterns
- JSDoc for documentation
- 4-space indentation, single quotes

### IDE Integration

Recommended VS Code settings:
```json
{
  "eslint.workingDirectories": ["frontend", "backend"],
  "eslint.format.enable": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Quality Standards Enforced

### Code Style
- 4-space indentation (aligns with existing code)
- Single quotes for strings
- Semicolons required
- Modern ES2024 syntax (const/let, arrow functions)

### Code Quality
- No unused variables (relaxed to warnings for development)
- No undefined variables
- Proper async/await patterns
- JSDoc documentation encouraged

### Environment-Specific Rules
- **Frontend**: Browser APIs available, console warnings
- **Backend**: Node.js APIs available, console allowed
- **Tests**: Test framework globals, relaxed rules

## Maintenance

### Updating ESLint

```bash
# Update to latest ESLint version
yarn add --dev eslint@latest @eslint/js@latest

# Test configuration compatibility
yarn lint

# Update workspace dependencies if needed
yarn workspaces run npm update eslint
```

### Adding New Rules

Edit `eslint.config.js` and add rules to appropriate environment section:

```javascript
// Example: Add new rule for all files
rules: {
  'new-rule': 'error'
}

// Example: Add rule for frontend only
files: ['frontend/src/**/*.js'],
rules: {
  'frontend-specific-rule': 'warn'
}
```

### Monitoring Performance

The pre-commit hook tracks execution time and warns if >30 seconds:

```bash
# Hook output includes timing
✅ All pre-commit checks passed! (2s)

# Performance issues trigger educational warnings
🚨 Performance Issue Detected...
```

## Success Metrics

- ✅ **Zero build failures** due to lint issues in CI
- ✅ **<3 second execution** time for typical commits
- ✅ **Educational feedback** helps developers learn project standards
- ✅ **Emergency override** available but rarely needed
- ✅ **Consistent code style** across frontend and backend

---

**Implementation Complete**: ESLint enforcement pre-commit hook successfully blocks lint violations while providing educational feedback to maintain development velocity.