#!/bin/bash
# Educational Hook Error Message Functions
# Shared functions for displaying educational error messages that guide rather than frustrate

# Color definitions for consistent formatting
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Common header for all error messages
show_error_header() {
    local error_type="$1"
    local context="$2"
    
    echo -e "${RED}${BOLD}🚨 ${error_type} Detected${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    if [ -n "$context" ]; then
        echo -e "${CYAN}Context: ${context}${NC}"
        echo ""
    fi
}

# Common footer with escalation info
show_error_footer() {
    local resolution_time="$1"
    local escalation_time="$2"
    
    echo ""
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⏱️  Target Resolution Time: ${resolution_time:-"5 minutes"}${NC}"
    echo -e "${YELLOW}🆘 Escalate if not resolved within: ${escalation_time:-"5 minutes"}${NC}"
    echo -e "${BLUE}📖 Full documentation: .github/hooks/README.md${NC}"
    echo ""
}

# Package Manager Error Messages
show_package_manager_error() {
    local detected_manager="$1"  # e.g., "npm"
    local required_manager="$2"  # e.g., "yarn"
    local context="$3"           # Current directory or operation
    
    show_error_header "Package Manager Violation" "Using $detected_manager instead of $required_manager in $context"
    
    echo -e "${BOLD}📚 Why This Rule Exists${NC}"
    echo "This project uses ${BOLD}$required_manager workspaces${NC} for monorepo management. Using $detected_manager can:"
    echo "• Create conflicting lockfiles (package-lock.json vs yarn.lock)"
    echo "• Break workspace dependency resolution"
    echo "• Cause unpredictable builds and deployment failures"
    echo ""
    
    echo -e "${BOLD}🔧 Quick Fix (90% of cases)${NC}"
    echo -e "${GREEN}# Convert your command:${NC}"
    
    case "$detected_manager" in
        "npm")
            echo -e "${RED}# Instead of: npm install${NC}"
            echo -e "${GREEN}yarn install${NC}"
            echo ""
            echo -e "${RED}# Instead of: npm install <package>${NC}"
            echo -e "${GREEN}yarn add <package>${NC}"
            echo ""
            echo -e "${RED}# Instead of: npm run dev${NC}"
            echo -e "${GREEN}yarn dev:backend  # or yarn dev:frontend${NC}"
            echo ""
            echo -e "${GREEN}# Clean up conflicting files:${NC}"
            echo -e "${GREEN}rm -f package-lock.json${NC}"
            echo -e "${GREEN}yarn install${NC}"
            ;;
        *)
            echo -e "${GREEN}Use $required_manager instead of $detected_manager${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${BOLD}🔍 Verification Steps${NC}"
    echo -e "${GREEN}# 1. Verify no conflicting lockfile:${NC}"
    echo -e "${GREEN}ls package-lock.json 2>/dev/null && echo '❌ Remove package-lock.json' || echo '✅ No npm lockfile'${NC}"
    echo ""
    echo -e "${GREEN}# 2. Test yarn functionality:${NC}"
    echo -e "${GREEN}yarn check${NC}"
    echo -e "${GREEN}yarn workspaces info${NC}"
    
    show_error_footer "5 minutes" "5 minutes"
    
    # Show reference to detailed documentation
    echo -e "${BLUE}📖 Detailed guidance: .github/hooks/package-manager-errors.md${NC}"
}

# ESLint Error Messages
show_eslint_error() {
    local error_type="$1"     # e.g., "configuration", "violations", "performance"
    local specific_error="$2" # Specific error details
    local files_affected="$3" # Files with issues
    
    show_error_header "ESLint/Code Quality Violation" "Type: $error_type"
    
    case "$error_type" in
        "configuration")
            echo -e "${BOLD}📚 Why This Rule Exists${NC}"
            echo "ESLint enforces consistent code style and catches potential bugs early."
            echo "Missing configuration prevents quality enforcement across the project."
            echo ""
            
            echo -e "${BOLD}🔧 Quick Fix (90% of cases)${NC}"
            echo -e "${GREEN}# Initialize ESLint:${NC}"
            echo -e "${GREEN}yarn add --dev eslint @eslint/js${NC}"
            echo -e "${GREEN}# Create .eslintrc.js with project standards${NC}"
            echo -e "${GREEN}# Add lint scripts to package.json${NC}"
            ;;
            
        "violations")
            echo -e "${BOLD}📚 Why This Rule Exists${NC}"
            echo "Specific linting rules prevent bugs and maintain consistency:"
            echo ""
            
            echo -e "${BOLD}🔧 Quick Fix (90% of cases)${NC}"
            echo -e "${GREEN}# Auto-fix many issues:${NC}"
            echo -e "${GREEN}yarn workspace backend eslint src/ --fix${NC}"
            echo -e "${GREEN}yarn workspace frontend eslint src/ --fix${NC}"
            echo ""
            echo -e "${GREEN}# Check remaining issues:${NC}"
            echo -e "${GREEN}yarn lint:all${NC}"
            
            if [ -n "$specific_error" ]; then
                echo ""
                echo -e "${YELLOW}Specific error: $specific_error${NC}"
            fi
            ;;
            
        "performance")
            echo -e "${BOLD}📚 Why This Rule Exists${NC}"
            echo "ESLint should complete quickly to maintain development velocity."
            echo ""
            
            echo -e "${BOLD}🔧 Quick Fix (90% of cases)${NC}"
            echo -e "${GREEN}# Enable caching:${NC}"
            echo -e "${GREEN}yarn workspace backend eslint src/ --cache${NC}"
            echo -e "${GREEN}# Create .eslintignore for performance${NC}"
            echo -e "${GREEN}# Limit scope to src/ directories only${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${BOLD}🔍 Verification Steps${NC}"
    echo -e "${GREEN}yarn lint:all${NC}"
    echo -e "${GREEN}echo \$?  # Should output: 0${NC}"
    
    show_error_footer "5 minutes" "5 minutes"
    echo -e "${BLUE}📖 Detailed guidance: .github/hooks/eslint-errors.md${NC}"
}

# Performance Error Messages
show_performance_error() {
    local issue_type="$1"    # e.g., "timeout", "memory", "slow-tests"
    local duration="$2"      # How long the operation took
    local target="$3"        # Target performance (e.g., "30 seconds")
    
    show_error_header "Hook Performance Issue" "Type: $issue_type, Duration: $duration, Target: $target"
    
    echo -e "${BOLD}📚 Why This Rule Exists${NC}"
    echo "Pre-commit hooks must complete quickly (target: <$target) to maintain productivity."
    echo "Slow hooks create friction that encourages bypassing quality gates."
    echo ""
    
    case "$issue_type" in
        "timeout")
            echo -e "${BOLD}🔧 Quick Fix (90% of cases)${NC}"
            echo -e "${GREEN}# Use lint-staged for staged files only:${NC}"
            echo -e "${GREEN}npx lint-staged  # Instead of yarn lint:all${NC}"
            echo ""
            echo -e "${GREEN}# Enable caching:${NC}"
            echo -e "${GREEN}export ESLINT_CACHE=true${NC}"
            echo -e "${GREEN}yarn workspace backend eslint src/ --cache${NC}"
            ;;
            
        "memory")
            echo -e "${BOLD}🔧 Quick Fix (90% of cases)${NC}"
            echo -e "${GREEN}# Limit Node.js memory:${NC}"
            echo -e "${GREEN}export NODE_OPTIONS='--max-old-space-size=2048'${NC}"
            echo ""
            echo -e "${GREEN}# Process files in batches:${NC}"
            echo -e "${GREEN}find . -name '*.js' -print0 | xargs -0 -n 10 eslint${NC}"
            ;;
            
        "slow-tests")
            echo -e "${BOLD}🔧 Quick Fix (90% of cases)${NC}"
            echo -e "${GREEN}# Run only changed tests:${NC}"
            echo -e "${GREEN}yarn test:changed  # Instead of yarn test:all${NC}"
            echo ""
            echo -e "${GREEN}# Use parallel execution:${NC}"
            echo -e "${GREEN}jest --maxWorkers=2${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${BOLD}🔍 Verification Steps${NC}"
    echo -e "${GREEN}time .husky/pre-commit  # Should complete in <$target${NC}"
    
    show_error_footer "5 minutes" "5 minutes"
    echo -e "${BLUE}📖 Detailed guidance: .github/hooks/performance-errors.md${NC}"
}

# Emergency Override Messages
show_emergency_override_info() {
    local situation="$1"  # e.g., "production-hotfix", "infrastructure-failure"
    
    show_error_header "Emergency Override Guidance" "Situation: $situation"
    
    echo -e "${BOLD}📚 When Override is Justified${NC}"
    echo "Emergency overrides should be RARE exceptions for:"
    echo "• Production hotfix (critical bug affecting users)"
    echo "• Security patch (urgent vulnerability fix)"
    echo "• Infrastructure failure (hooks broken, blocking all commits)"
    echo ""
    echo -e "${RED}${BOLD}NOT justified for convenience or regular development!${NC}"
    echo ""
    
    echo -e "${BOLD}🔧 Safe Override Procedure${NC}"
    echo -e "${GREEN}# 1. Document the emergency FIRST:${NC}"
    echo -e "${GREEN}# Create EMERGENCY_OVERRIDE_\$(date +%Y%m%d_%H%M).md${NC}"
    echo ""
    echo -e "${GREEN}# 2. Use --no-verify with full documentation:${NC}"
    echo -e "${GREEN}git commit --no-verify -m 'EMERGENCY HOTFIX: [description] - hooks bypassed due to [reason]'${NC}"
    echo ""
    echo -e "${GREEN}# 3. Plan immediate cleanup (within 24-48 hours)${NC}"
    
    echo ""
    echo -e "${BOLD}🔍 Mandatory Cleanup${NC}"
    echo -e "${GREEN}# Within 24 hours:${NC}"
    echo -e "${GREEN}yarn test:all && yarn lint:all${NC}"
    echo -e "${GREEN}# Restore hook functionality${NC}"
    echo -e "${GREEN}# Fix any quality issues found${NC}"
    
    show_error_footer "Immediate" "Always escalate for overrides"
    echo -e "${BLUE}📖 Complete override procedures: .github/hooks/emergency-overrides.md${NC}"
}

# Utility function to show all available error types
show_available_errors() {
    echo -e "${BOLD}Available Error Message Functions:${NC}"
    echo ""
    echo -e "${GREEN}show_package_manager_error <detected> <required> <context>${NC}"
    echo "  Example: show_package_manager_error 'npm' 'yarn' '\$PWD'"
    echo ""
    echo -e "${GREEN}show_eslint_error <type> <specific_error> <files>${NC}"
    echo "  Example: show_eslint_error 'violations' 'no-unused-vars' 'src/index.js'"
    echo ""
    echo -e "${GREEN}show_performance_error <type> <duration> <target>${NC}"
    echo "  Example: show_performance_error 'timeout' '45s' '30s'"
    echo ""
    echo -e "${GREEN}show_emergency_override_info <situation>${NC}"
    echo "  Example: show_emergency_override_info 'production-hotfix'"
    echo ""
    echo -e "${BLUE}📖 Documentation: .github/hooks/README.md${NC}"
}

# Export functions for use in hooks
export -f show_error_header
export -f show_error_footer
export -f show_package_manager_error
export -f show_eslint_error
export -f show_performance_error
export -f show_emergency_override_info
export -f show_available_errors