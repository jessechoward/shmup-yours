#!/bin/bash
# Test script for educational hook error messages
# Validates that all error message functions work correctly

set -e

echo "🧪 Testing Educational Hook Error Message System"
echo "================================================="

# Source the error message functions
if [ ! -f ".github/hooks/error-messages.sh" ]; then
    echo "❌ Error: .github/hooks/error-messages.sh not found"
    exit 1
fi

source .github/hooks/error-messages.sh

echo ""
echo "✅ Successfully loaded error message functions"

# Test 1: Package Manager Error
echo ""
echo "📦 Test 1: Package Manager Error Message"
echo "----------------------------------------"
show_package_manager_error "npm" "yarn" "/test/project"

# Test 2: ESLint Configuration Error
echo ""
echo "🔍 Test 2: ESLint Configuration Error"
echo "------------------------------------"
show_eslint_error "configuration" "Missing ESLint config" ""

# Test 3: ESLint Violations Error
echo ""
echo "🔍 Test 3: ESLint Violations Error"
echo "---------------------------------"
show_eslint_error "violations" "no-unused-vars" "src/index.js"

# Test 4: Performance Timeout Error
echo ""
echo "⚡ Test 4: Performance Timeout Error"
echo "-----------------------------------"
show_performance_error "timeout" "45s" "30s"

# Test 5: Memory Performance Error
echo ""
echo "⚡ Test 5: Memory Performance Error"
echo "---------------------------------"
show_performance_error "memory" "6GB" "4GB"

# Test 6: Emergency Override Information
echo ""
echo "🚨 Test 6: Emergency Override Information"
echo "---------------------------------------"
show_emergency_override_info "production-hotfix"

# Test 7: Available Functions List
echo ""
echo "📋 Test 7: Available Functions List"
echo "----------------------------------"
show_available_errors

echo ""
echo "🎉 All tests completed successfully!"
echo ""
echo "📋 Test Summary:"
echo "✅ Package manager error messages"
echo "✅ ESLint error messages (configuration & violations)"
echo "✅ Performance error messages (timeout & memory)"
echo "✅ Emergency override guidance"
echo "✅ Function availability listing"
echo ""
echo "🔧 Integration ready: Functions can be used in Git hooks"
echo "📖 See .github/hooks/integration-examples.md for usage patterns"