# 🚨 Yarn Lock Conflict Resolution

## Overview
Comprehensive resolution procedures for yarn.lock conflicts and dependency resolution issues that help agents understand and fix lockfile problems while maintaining workspace integrity.

---

## 🚨 Yarn Lock Merge Conflict

### 📚 Why This Issue Occurs
Yarn lock conflicts happen when:
- Multiple developers add/update dependencies simultaneously
- Branch merges create conflicting dependency resolutions  
- Package versions are pinned differently across branches
- Yarn cache becomes corrupted or inconsistent

**Project Impact**: Unresolved conflicts break builds and create inconsistent development environments.

### 🔧 Quick Fix (90% of cases)

#### Standard Merge Conflict Resolution:
```bash
# 1. Accept the conflict and regenerate from package.json
git checkout yarn.lock
echo "Regenerating yarn.lock from package.json..."

# 2. Clean any cached state that might interfere
yarn cache clean

# 3. Regenerate lockfile with current package.json
yarn install

# 4. Verify workspace integrity
yarn workspaces info
yarn check --verify-tree

# 5. Test that critical scripts work
yarn workspace backend test --passWithNoTests
yarn workspace frontend test --passWithNoTests

# 6. Commit the regenerated lockfile
git add yarn.lock
git commit -m "Resolve yarn.lock conflict - regenerated from package.json"
```

#### If Auto-Resolution Fails:
```bash
# Method 2: Careful manual resolution
echo "Manual merge resolution required..."

# 1. Back up current state
cp yarn.lock yarn.lock.backup

# 2. Reset to base state
git checkout $(git merge-base HEAD FETCH_HEAD) -- yarn.lock

# 3. Apply changes incrementally
git checkout HEAD -- package.json */package.json
yarn install

# 4. Test incremental resolution
yarn check || echo "Dependency resolution needed"
```

### 🔍 Verification Steps
```bash
# 1. Verify lockfile is valid
yarn check --verify-tree

# 2. Check for duplicate dependencies
yarn list --depth=0 | grep -E "warning.*different"

# 3. Ensure workspace dependencies resolve correctly
yarn workspaces run yarn list --depth=0

# 4. Test build process
yarn workspace backend build --dry-run || yarn workspace backend dev --help
yarn workspace frontend build --dry-run || yarn workspace frontend dev --help

# 5. Verify no conflicting lockfiles exist
find . -name "package-lock.json" -type f | wc -l
# Should output: 0
```

### 🆘 When to Escalate
**Escalate after 5 minutes if**:
- Dependency resolution creates version incompatibilities
- Workspace dependencies fail to resolve after regeneration
- Build process fails due to missing or incompatible packages
- Critical project dependencies show version conflicts

---

## 🚨 Dependency Version Conflicts

### 📚 Why This Rule Exists
Version conflicts occur when different parts of the monorepo require incompatible versions of the same package, breaking builds and causing runtime errors.

### 🔧 Quick Fix (90% of cases)

#### Identify and Resolve Version Conflicts:
```bash
# 1. Identify conflicting packages
yarn why <package-name>
echo "Checking for version conflicts..."

# 2. Check workspace dependency mismatches
yarn workspaces run yarn list --depth=1 | grep -A5 -B5 "warning"

# 3. Force resolution using yarn resolutions (package.json)
cat > resolution-temp.json << 'EOF'
{
  "resolutions": {
    "package-name": "^version"
  }
}
EOF

# 4. Apply resolution to root package.json
# Add resolutions field manually or merge with existing
echo "Add the resolution to package.json, then:"
yarn install

# 5. Verify resolution worked
yarn why <package-name>
```

#### Workspace-Specific Conflicts:
```bash
# For conflicts between workspaces
echo "Resolving workspace dependency conflicts..."

# 1. Check all workspace package.json files
find . -name "package.json" -not -path "./node_modules/*" -exec echo "=== {} ===" \; -exec cat {} \;

# 2. Identify version mismatches
grep -r "\"package-name\":" */package.json

# 3. Standardize versions across workspaces
# Update package.json files to use same version range
# Then regenerate lockfile
yarn install

# 4. Test workspace interoperability
yarn workspace backend test --passWithNoTests
yarn workspace frontend test --passWithNoTests
yarn workspace test test --passWithNoTests
```

### 🔍 Verification Steps
```bash
# 1. Check no version conflicts remain
yarn list --depth=1 | grep -i "warning\|error" || echo "✅ No version warnings"

# 2. Verify workspace integrity
yarn workspaces info

# 3. Test cross-workspace dependencies
yarn workspace backend yarn why <shared-package>
yarn workspace frontend yarn why <shared-package>

# 4. Verify build compatibility
yarn workspace backend build --dry-run
yarn workspace frontend build --dry-run
```

---

## 🚨 Corrupted Yarn Cache/Integrity Issues

### 📚 Why This Issue Occurs
Cache corruption happens due to:
- Interrupted yarn install processes
- Disk space issues during package installation
- Network failures during package downloads
- Conflicting yarn versions or corrupted global cache

### 🔧 Quick Fix (90% of cases)

#### Complete Cache Reset and Reinstall:
```bash
# 1. Clear all cached state
echo "Clearing yarn cache and node_modules..."
yarn cache clean --all

# 2. Remove all node_modules directories
rm -rf node_modules
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# 3. Remove yarn cache directory (if needed)
yarn cache dir | xargs rm -rf

# 4. Clean reinstall from package.json
yarn install

# 5. Verify integrity
yarn check --verify-tree
yarn check --integrity
```

#### If Integrity Errors Persist:
```bash
# Deep cache cleaning for persistent issues
echo "Performing deep yarn reset..."

# 1. Clear system-wide yarn cache
yarn cache clean --all
rm -rf ~/.yarn/cache

# 2. Clear npm cache (if mixed package managers were used)
npm cache clean --force

# 3. Remove and regenerate lockfile
rm yarn.lock
yarn install

# 4. Verify and test
yarn check --verify-tree
yarn workspaces run yarn check
```

### 🔍 Verification Steps
```bash
# 1. Verify cache is healthy
yarn cache verify

# 2. Check package integrity
yarn check --integrity

# 3. Verify all workspaces have valid node_modules
find . -name "node_modules" -type d | while read dir; do
  echo "Checking: $dir"
  test -d "$dir" && echo "✅ Exists" || echo "❌ Missing"
done

# 4. Test package availability
node -e "console.log(require('some-dependency/package.json').version)" || echo "Dependencies not accessible"
```

---

## 🚨 Yarn Workspace Resolution Issues

### 📚 Why This Rule Exists
Workspace resolution issues occur when:
- Dependencies are installed in wrong workspace locations
- Cross-workspace dependencies cannot be resolved
- Hoisting conflicts create duplicate packages
- Workspace configuration becomes inconsistent

### 🔧 Quick Fix (90% of cases)

#### Reset Workspace Structure:
```bash
# 1. Verify workspace configuration
echo "Current workspace configuration:"
yarn workspaces info

# 2. Check root package.json workspace configuration
cat package.json | grep -A10 "workspaces"

# 3. Ensure workspace package.json files are valid
for workspace in frontend backend test; do
  echo "=== Validating $workspace ==="
  if [ -f "$workspace/package.json" ]; then
    node -c "$workspace/package.json" && echo "✅ Valid JSON" || echo "❌ Invalid JSON"
    cat "$workspace/package.json" | head -10
  else
    echo "❌ Missing package.json in $workspace"
  fi
done

# 4. Reinstall with proper workspace structure
rm -rf node_modules */node_modules
yarn install

# 5. Verify workspace dependency resolution
yarn workspace backend run yarn list --depth=0
yarn workspace frontend run yarn list --depth=0
yarn workspace test run yarn list --depth=0
```

#### Cross-Workspace Dependency Issues:
```bash
# Fix issues where workspaces can't find each other
echo "Resolving cross-workspace dependencies..."

# 1. Check workspace interdependencies
grep -r "workspace:" */package.json || echo "No workspace dependencies found"

# 2. Verify workspace names match
yarn workspaces info | grep -E "frontend|backend|test"

# 3. Reinstall to fix hoisting issues
yarn install --check-files

# 4. Test workspace commands work
yarn workspace backend --version
yarn workspace frontend --version  
yarn workspace test --version
```

### 🔍 Verification Steps
```bash
# 1. Verify all workspaces are recognized
yarn workspaces info | jq '.[]' 2>/dev/null || yarn workspaces info

# 2. Test workspace command execution
yarn workspace backend run echo "Backend workspace working"
yarn workspace frontend run echo "Frontend workspace working"
yarn workspace test run echo "Test workspace working"

# 3. Verify dependency hoisting is correct
ls -la node_modules/ | head -20
echo "Workspace-specific dependencies:"
ls -la */node_modules/ 2>/dev/null | head -10 || echo "No workspace-specific node_modules (expected)"

# 4. Test cross-workspace script execution
yarn dev:backend --help || echo "Backend scripts not accessible"
yarn dev:frontend --help || echo "Frontend scripts not accessible"
```

---

## 🚨 Emergency Yarn Lock Override

### 📚 When Override is Appropriate
- Critical production deployment blocked by lockfile issues
- External dependency service temporarily unavailable
- Merge conflicts in lockfile block urgent hotfix
- Workspace corruption prevents normal development

### 🔧 Safe Override Procedure

#### Document the Override:
```bash
# Create documentation BEFORE override
cat > YARN_LOCK_OVERRIDE_$(date +%Y%m%d_%H%M).md << EOF
# Yarn Lock Emergency Override

## Override Details
**Date**: $(date)
**Reason**: [Specific reason for override]
**Affected Workspaces**: [List affected workspaces]
**Issue**: [Link to issue or description]

## Lockfile State
**Original yarn.lock**: $(wc -l yarn.lock) lines
**Conflict Type**: [Merge conflict/corruption/version conflict]
**Failed Resolution**: [What standard fixes were attempted]

## Override Action
**Method**: [Temporary removal/force regeneration/manual edit]
**Scope**: [Specific packages or full regeneration]
**Risk Assessment**: [Potential impact of override]

## Restoration Plan
**Timeline**: [When proper resolution will be completed]
**Validation**: [How to verify override didn't break functionality]
**Cleanup**: [Steps to restore proper lockfile management]
EOF

git add YARN_LOCK_OVERRIDE_*.md
git commit -m "EMERGENCY: Document yarn.lock override - [reason]"
```

#### Execute Override:
```bash
# Method 1: Temporary lockfile bypass
mv yarn.lock yarn.lock.emergency-backup
yarn install --no-lockfile
echo "⚠️ EMERGENCY: yarn.lock regenerated - manual verification required"

# Method 2: Force regeneration with known good state
rm yarn.lock
yarn install
echo "⚠️ EMERGENCY: yarn.lock force-regenerated from package.json"

# Immediate verification
yarn check --verify-tree || echo "❌ Override created integrity issues"
```

### 🔍 Post-Override Verification (Required)
```bash
# 1. Test all workspaces still function
yarn workspace backend test --passWithNoTests
yarn workspace frontend test --passWithNoTests
yarn workspace test test --passWithNoTests

# 2. Verify no critical dependencies lost
yarn list --depth=0 | grep -E "(express|vue|jest|eslint)" || echo "⚠️ Critical dependencies missing"

# 3. Test development commands
yarn dev:backend --help
yarn dev:frontend --help

# 4. Plan restoration
echo "TODO: Review regenerated yarn.lock for unintended version changes"
echo "TODO: Test full build and deployment pipeline"
echo "TODO: Monitor for runtime issues related to dependency changes"
```

### 🆘 Escalation for Overrides
**Always escalate if**:
- Override affects critical production dependencies
- Workspace functionality breaks after override
- Version changes introduce security vulnerabilities
- Cannot restore proper lockfile management within 24 hours

---

## 📋 Prevention Strategies

### 🔧 Avoiding Future Conflicts

#### Pre-Merge Validation:
```bash
# Run before merging any branch that touches dependencies
echo "=== Pre-merge lockfile validation ==="

# 1. Check for lockfile conflicts before merge
git show HEAD:yarn.lock > yarn.lock.head
git show FETCH_HEAD:yarn.lock > yarn.lock.fetch 2>/dev/null || echo "No yarn.lock in merge target"

# 2. Verify current lockfile is healthy
yarn check --verify-tree

# 3. Test that current dependencies work
yarn workspace backend build --dry-run
yarn workspace frontend build --dry-run

# 4. Create merge strategy
echo "Merge strategy: Regenerate yarn.lock from merged package.json"
```

#### Dependency Update Best Practices:
```bash
# Safe dependency update process
echo "=== Safe Dependency Update Process ==="

# 1. Update one workspace at a time
yarn workspace backend add <package>@<version>
yarn check --verify-tree

# 2. Test the workspace works
yarn workspace backend test --passWithNoTests
yarn workspace backend build --dry-run

# 3. Commit incrementally
git add backend/package.json yarn.lock
git commit -m "Add <package>@<version> to backend workspace"

# 4. Test full monorepo compatibility
yarn test:all || echo "Integration testing required"
```

---

## 📖 Integration References

### 🔗 Related Templates
- **[hook-violation-resolution.md]**: Primary diagnosis for all hook failures
- **[package-manager-errors.md]**: Yarn vs npm violations and command patterns
- **[emergency-overrides.md]**: When and how to bypass quality gates safely
- **[pre-commit-setup-validation.md]**: Ensuring hooks work with dependency changes

### 🛠️ Error Message Integration
```bash
# Use existing error message system for detailed guidance
source .github/hooks/error-messages.sh

# For yarn-specific issues
show_package_manager_error "npm" "yarn" "dependency resolution"
```

### 📊 Success Metrics
- **Resolution Time**: 90% of conflicts resolved within 5 minutes
- **Override Rate**: <5% of conflicts require emergency override
- **Prevention**: Conflicts decrease through improved merge practices
- **Workspace Integrity**: 100% of resolutions maintain workspace functionality

---

**Created**: July 2025  
**Integration**: Part of resolution playbook system (#40)  
**Dependencies**: References error message system (#42), aligns with workflow patterns (#37)  
**Usage**: Specific guidance for yarn.lock and dependency conflicts**