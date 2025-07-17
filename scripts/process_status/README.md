# Process Status Dashboard

A comprehensive process management tool for GitHub workflows, providing both structured JSON output and human-readable dashboards.

## Features

- **Git Integration**: Automatic `git fetch --all` and `git pull` to ensure up-to-date information
- **PR Analysis**: Track pull request status, mergeability, and progress
- **GitHub Copilot Monitoring**: Special analysis for GitHub Copilot assigned issues
- **Progress Tracking**: Branch commit counts, elapsed time, and activity monitoring
- **Action Recommendations**: Prioritized recommendations based on current state
- **Dual Output**: JSON for automation, colored dashboard for humans

## Usage

### Dashboard View (Human-readable)
```bash
python3 scripts/process_status.py --dashboard
```

### JSON Output (Machine-readable)
```bash
python3 scripts/process_status.py
```

### Skip Git Updates
```bash
python3 scripts/process_status.py --no-update --dashboard
```

### Convenience Scripts
```bash
# Equivalent to --dashboard
./scripts/process-dashboard.sh
```

## Module Structure

- `core.py` - Main data collection and orchestration
- `git_utils.py` - Git repository operations and branch analysis  
- `github_utils.py` - GitHub API interactions via `gh` CLI
- `analysis.py` - Progress analysis and status determination
- `display.py` - Human-readable dashboard formatting

## Dependencies

- Python 3.6+ (uses only standard library)
- `gh` CLI tool (GitHub CLI)
- `git` command line tool

## Output Format

### JSON Structure
```json
{
  "timestamp": "2025-07-17T06:54:47.195758+00:00",
  "dashboard_type": "process_management",
  "git_status": {
    "current_branch": "main",
    "last_commit": "abc1234 Latest commit message",
    "last_updated": "2025-07-17T06:54:38.348453+00:00"
  },
  "prs": [...],
  "copilot_issues": [...],
  "summary": {
    "blocked_count": 0,
    "ready_for_review_count": 0,
    "total_prs": 1,
    "copilot_active_issues": 1
  },
  "recommended_actions": [...]
}
```

### Dashboard Features

- **Color Coding**: Status-based colors (red=blocked, green=ready, yellow=needs attention)
- **Icons**: Visual indicators for status, priority, and actions
- **Progress Tracking**: Commit counts and elapsed time formatting
- **Action Priorities**: High/Medium/Low priority recommendations

## GitHub Copilot Integration

Special handling for GitHub Copilot assigned issues:

- **Progress Detection**: Identifies yarn.lock-only PRs vs real implementation
- **Status Analysis**: Planning, in-progress, draft, ready states
- **Timing Metrics**: Tracks pickup time and implementation velocity
- **Issue-PR Linking**: Automatically connects issues to their related PRs

## Extension Points

The modular design allows easy extension:

- Add new analysis functions to `analysis.py`
- Extend GitHub data collection in `github_utils.py`
- Add new display formats in `display.py`
- Integrate additional git operations in `git_utils.py`
