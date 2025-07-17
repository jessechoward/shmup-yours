# Task: Implement proper frontend dev server using Yarn (remove Python dependency)

## Problem Statement
Current frontend demo relies on Python for static file serving, which is inconsistent with our Node.js/Yarn stack. We need a Node.js-based dev server and updated scripts/documentation.

## Expected Deliverables
- Node.js-based static file server for frontend workspace (e.g., `serve` or similar)
- `dev` script in `frontend/package.json` to start the server (e.g., `yarn dev`)
- All documentation and instructions reference Yarn, not Python or npx
- Python server references removed from docs, scripts, workflow
- Demo loads at `http://localhost:3000` (or chosen port) using new dev server

## Success Criteria
- [ ] `yarn dev` starts the frontend server from the `frontend` workspace
- [ ] No Python dependencies or instructions remain
- [ ] Demo loads successfully in browser via Node.js server
- [ ] All team members use Yarn for local development

## Time Constraints
Research: 10 minutes, Implementation: 20 minutes
