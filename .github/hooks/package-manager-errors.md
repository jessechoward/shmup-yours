# 🚨 Package Manager Violations

## Overview
Educational error messages for package manager violations that help agents understand and resolve yarn vs npm conflicts while learning project standards.

---

## 🚨 NPM Command Detected - Yarn Required

### 📚 Why This Rule Exists
This project uses **Yarn workspaces** for monorepo management. Using npm commands can:
- Create conflicting lockfiles (`package-lock.json` vs `yarn.lock`)
- Break workspace dependency resolution
- Cause unpredictable builds and deployment failures
- Generate merge conflicts that block PR workflow

**Project Standard**: Always use `yarn` commands for consistency and workspace support.

### 🔧 Quick Fix (90% of cases)

#### Convert npm command to yarn equivalent:
```bash
# If you ran: npm install
yarn install

# If you ran: npm install <package>
yarn add <package>

# If you ran: npm install --save-dev <package>
yarn add --dev <package>

# If you ran: npm run <script>
yarn <script>

# If you ran: npm run dev
yarn dev:backend
# or
yarn dev:frontend
```

#### Clean up conflicting files:
```bash
# Remove npm lockfile if created
rm -f package-lock.json

# Ensure yarn lockfile exists
yarn install
```

### 🔍 Verification Steps
```bash
# 1. Verify no npm lockfile exists
ls package-lock.json 2>/dev/null && echo "❌ Remove package-lock.json" || echo "✅ No npm lockfile"

# 2. Verify yarn lockfile exists and is valid
yarn check

# 3. Test workspace functionality
yarn workspaces info

# 4. Verify your specific command works
yarn <your-intended-command>
```

### 🆘 When to Escalate
**Escalate if** (after attempting fixes above):
- Yarn lockfile becomes corrupted after conversion
- Workspace dependencies show version conflicts
- Build failures persist after cleanup
- Complex dependency resolution errors appear

**Escalation Time**: If not resolved within **5 minutes**, comment on issue:
```markdown
## 🆘 Package Manager Escalation
**Issue**: NPM→Yarn conversion failed
**Attempted Fixes**: [List steps tried]
**Current Error**: [Paste specific error message]
**Workspace Affected**: [backend/frontend/test]
```

### 📖 Additional Resources
- [.copilot-instructions.md](./.copilot-instructions.md) - Full development commands
- [Yarn Workspaces Documentation](https://classic.yarnpkg.com/en/docs/workspaces/)

---

## 🚨 Wrong Package Manager Command Pattern

### 📚 Why This Rule Exists
Using incorrect command patterns can break our monorepo workspace setup and create dependency conflicts.

### 🔧 Quick Fix - Command Conversion Chart

#### Root Level Operations (Most Common):
```bash
# ❌ Wrong: npm install
# ✅ Correct:
yarn install

# ❌ Wrong: npm run dev
# ✅ Correct:
yarn dev:backend
yarn dev:frontend

# ❌ Wrong: npm run test
# ✅ Correct:
yarn test:all
yarn test:unit
yarn test:integration
```

#### Workspace-Specific Operations:
```bash
# ❌ Wrong: cd backend && npm install <package>
# ✅ Correct:
yarn workspace backend add <package>

# ❌ Wrong: cd frontend && npm run build
# ✅ Correct:
yarn workspace frontend build

# ❌ Wrong: cd test && npm install --save-dev <package>
# ✅ Correct:
yarn workspace test add --dev <package>
```

#### Quality Commands:
```bash
# ❌ Wrong: npm run lint
# ✅ Correct:
yarn lint:all

# ❌ Wrong: cd backend && npm run lint
# ✅ Correct:
yarn workspace backend lint
```

### 🔍 Verification Steps
```bash
# Test the corrected command
yarn <corrected-command>

# Verify workspace integrity
yarn workspaces info

# Check for conflicting files
find . -name "package-lock.json" -type f
```

### 🆘 When to Escalate
- Command conversion chart doesn't cover your use case
- Workspace-specific commands fail after correction
- Dependencies not resolving correctly across workspaces

---

## 🚨 Package-lock.json Detected

### 📚 Why This Rule Exists
`package-lock.json` conflicts with `yarn.lock` and breaks deterministic builds. Only one lockfile type should exist.

### 🔧 Quick Fix (90% of cases)

#### Remove conflicting lockfile:
```bash
# Remove npm lockfile
rm -f package-lock.json

# Regenerate yarn lockfile if needed
yarn install

# Check for workspace-level conflicts
find . -name "package-lock.json" -delete
```

#### If accidentally committed:
```bash
# Remove from git
git rm package-lock.json

# Update .gitignore to prevent future issues
echo "package-lock.json" >> .gitignore

# Recommit with yarn lockfile
git add yarn.lock .gitignore
git commit -m "Fix package manager: remove npm lockfile, ensure yarn"
```

### 🔍 Verification Steps
```bash
# Verify no npm lockfiles exist
find . -name "package-lock.json" -type f | wc -l
# Should output: 0

# Verify yarn lockfile exists and is valid
test -f yarn.lock && echo "✅ yarn.lock exists" || echo "❌ Missing yarn.lock"
yarn check
```

### 🆘 When to Escalate
- Yarn lockfile becomes corrupted after npm lockfile removal
- Dependency versions conflict between npm and yarn resolutions
- Build process fails after lockfile cleanup

---

## 🚨 Workspace Command Context Error

### 📚 Why This Rule Exists
Running global commands from workspace directories can install dependencies in wrong locations and break monorepo structure.

### 🔧 Quick Fix (90% of cases)

#### Return to root and use workspace syntax:
```bash
# Return to project root
cd /path/to/shmup-yours

# Use workspace-specific commands
yarn workspace backend add <package>
yarn workspace frontend add <package>
yarn workspace test add <package>

# Or use global commands from root
yarn dev:backend
yarn dev:frontend
yarn test:all
```

#### Common Workspace Patterns:
```bash
# Development
yarn workspace backend dev
yarn workspace frontend dev

# Testing
yarn workspace backend test
yarn workspace frontend test

# Building
yarn workspace backend build
yarn workspace frontend build

# Linting
yarn workspace backend lint
yarn workspace frontend lint
```

### 🔍 Verification Steps
```bash
# Check current directory
pwd
# Should be: /path/to/shmup-yours (project root)

# Verify workspace structure
yarn workspaces info

# Test workspace command
yarn workspace <workspace-name> <command>
```

### 🆘 When to Escalate
- Workspace commands fail from project root
- Dependencies installed in wrong workspace
- Workspace structure appears corrupted

---

## 🚨 Dependency Version Conflicts

### 📚 Why This Rule Exists
Mixed package managers can create conflicting dependency resolutions that cause runtime errors and build failures.

### 🔧 Quick Fix (90% of cases)

#### Clean and reinstall with yarn:
```bash
# Remove all node_modules
rm -rf node_modules
find . -name "node_modules" -type d -exec rm -rf {} +

# Remove npm artifacts
rm -f package-lock.json
find . -name "package-lock.json" -delete

# Clean yarn cache
yarn cache clean

# Reinstall with yarn
yarn install

# Verify workspace dependencies
yarn workspaces info
```

#### For specific dependency conflicts:
```bash
# Check dependency resolution
yarn why <package-name>

# Force resolution if needed (in package.json)
"resolutions": {
  "<package-name>": "^<version>"
}

# Reinstall after resolution
yarn install
```

### 🔍 Verification Steps
```bash
# Check for version conflicts
yarn check

# Verify build works
yarn dev:backend &
sleep 5
curl -f http://localhost:3000/health || echo "Backend not ready"
kill %1

# Test workspace integrity
yarn workspaces run test
```

### 🆘 When to Escalate
- Conflicts persist after complete reinstall
- Specific dependency versions required for compatibility
- Build errors continue despite clean dependency tree

---

## 🚨 Emergency Override for Package Manager

### 📚 When Override is Appropriate
- Critical hotfix required immediately
- Blocking issue prevents normal workflow
- External dependency temporarily requires npm

### 🔧 Safe Override Procedure

#### Document the override:
```bash
# Create override documentation
cat > PACKAGE_MANAGER_OVERRIDE.md << EOF
# Emergency Package Manager Override

**Date**: $(date)
**Issue**: [Brief description]
**Reason**: [Why override was necessary]
**Commands Used**: [Specific npm commands]
**Cleanup Plan**: [How to restore yarn workflow]
**Timeline**: [When cleanup will occur]
EOF

# Commit override documentation
git add PACKAGE_MANAGER_OVERRIDE.md
git commit -m "EMERGENCY: Package manager override - [reason]"
```

#### Minimize impact:
```bash
# Use npm only for specific action
npm install <specific-package> --save-dev

# Document what was changed
git diff package.json

# Plan immediate cleanup
echo "TODO: Convert to yarn and remove package-lock.json" >> PACKAGE_MANAGER_OVERRIDE.md
```

### 🔍 Post-Override Cleanup (Required)
```bash
# 1. Remove npm artifacts
rm -f package-lock.json

# 2. Reinstall with yarn
yarn install

# 3. Verify no functionality lost
yarn test:all

# 4. Clean up override documentation
git rm PACKAGE_MANAGER_OVERRIDE.md
git commit -m "Clean up after package manager override"
```

### 🆘 Escalation for Overrides
**Always escalate** if:
- Override affects multiple workspaces
- Dependencies become permanently incompatible with yarn
- Override cleanup causes build failures

---

**Integration**: References patterns from `.copilot-instructions.md`  
**Performance Target**: 90% self-resolution within 5 minutes  
**Escalation SLA**: Comment within 5 minutes if fixes fail