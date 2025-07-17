#!/bin/bash
# Convenience wrapper for process status dashboard
# Maintains compatibility with old shell script interface

cd "$(dirname "$0")/.."
python3 scripts/process_status.py --dashboard "$@"
