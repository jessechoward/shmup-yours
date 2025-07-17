#!/usr/bin/env python3
"""
Process Status Dashboard (Python version)
Comprehensive process management tool replacing shell scripts.
Provides both structured JSON output and human-readable dashboard.
No external dependencies required - uses only Python standard library.
"""
import json
import sys
import argparse
from process_status.git_utils import update_git_state
from process_status.core import collect_all_data
from process_status.display import (
    print_dashboard_header, print_prs_table, print_copilot_issues,
    print_recommended_actions, print_dashboard_footer, print_detailed_pr_analysis
)

def main():
    parser = argparse.ArgumentParser(description="Process Status Dashboard")
    parser.add_argument("--dashboard", "-d", action="store_true", 
                       help="Display human-readable dashboard instead of JSON")
    parser.add_argument("--no-update", action="store_true",
                       help="Skip git fetch/pull operations")
    
    args = parser.parse_args()
    
    # Update git state unless disabled
    if not args.no_update:
        update_git_state()
    
    # Collect all data
    data = collect_all_data()
    
    if args.dashboard:
        # Human-readable dashboard
        print_dashboard_header(data)
        print_prs_table(data.get('prs', []))
        print_detailed_pr_analysis(data.get('prs', []))
        print_copilot_issues(data.get('copilot_issues', []))
        print_recommended_actions(data.get('recommended_actions', []))
        print_dashboard_footer()
    else:
        # Structured JSON output
        print(json.dumps(data, indent=2))

if __name__ == "__main__":
    main()
