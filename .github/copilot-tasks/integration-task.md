# Integration Task Template

## 🔗 Integration Objective
Clear description of how frontend and backend components need to connect.

## 🚀 Development Environment Setup
**Quality Gates Activation:**
```bash
# Enable Husky hooks for quality enforcement
yarn install  # Installs dependencies including hook infrastructure
yarn workspace backend install
yarn workspace frontend install

# Verify quality gates are active
yarn lint:all    # Should run ESLint across all workspaces
yarn test:all    # Should run tests (if configured)
```

**Hook Verification:**
```bash
# Test that quality gates are working
echo "console.log('test')" > temp-test-file.js
git add temp-test-file.js
git commit -m "test quality gates" --dry-run
# Should trigger linting and other quality checks
rm temp-test-file.js
```

## 🛡️ Quality Gate Compliance
**Pre-Implementation Validation:**
- [ ] Quality hooks are active and functional
- [ ] ESLint configuration is working (`yarn lint:all`)
- [ ] Test infrastructure is operational (if applicable)
- [ ] Workspace isolation is maintained (yarn workspaces)

**Common Quality Violations & Quick Fixes:**
```bash
# ESLint violations - Auto-fix most issues:
yarn workspace frontend eslint src/ --fix
yarn workspace backend eslint src/ --fix

# Package manager violations - Use yarn only:
# ❌ Don't use: npm install
# ✅ Use instead: yarn install
# ❌ Don't use: npm install <package>
# ✅ Use instead: yarn workspace frontend add <package>
```

**Violation Resolution:**
- Educational error messages will guide you to quick fixes
- 90% of violations have copy-paste resolution commands
- Escalate after 5 minutes if resolution unclear
- Reference: `.github/hooks/README.md` for detailed guidance

## 📋 Components to Integrate
**Backend Components:**
- API endpoints: `POST /api/game/join`
- WebSocket events: `player-joined`, `game-state-update`
- Data structures: `GameState`, `Player`

**Frontend Components:**
- UI components: `GameJoinComponent`, `GameLobby`
- State management: Game state updates
- Event handlers: WebSocket message handling

## 🔧 Integration Specifications
**Data Flow:**
```
User Input (Frontend) 
  → API Call (Frontend → Backend)
  → Data Processing (Backend)
  → WebSocket Event (Backend → Frontend)
  → UI Update (Frontend)
```

**Contract Verification:**
- API request/response formats match
- WebSocket event structures align
- Error handling flows work end-to-end

**Files to Modify:**
- `frontend/src/services/gameApi.js` - API client
- `frontend/src/services/websocket.js` - WebSocket handling
- `backend/src/routes/game.js` - Any integration fixes

## 📦 Integration Context
**API Contracts:**
```javascript
// Frontend API client
const joinGame = async (handle) => {
  const response = await fetch('/api/game/join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle })
  })
  return response.json()
}

// Backend implementation
app.post('/api/game/join', (req, res) => {
  const { handle } = req.body
  // Implementation details...
})
```

**WebSocket Events:**
```javascript
// Frontend listener
websocket.on('player-joined', (data) => {
  updateGameState(data.gameState)
})

// Backend emitter
websocket.broadcast('player-joined', {
  playerId: newPlayer.id,
  gameState: currentGameState
})
```

## ✅ Integration Checklist
**Quality Compliance (Required for all tasks):**
- [ ] All commits pass quality gates (ESLint, tests, etc.)
- [ ] No package manager violations (yarn-only enforcement)
- [ ] Educational error messages reviewed if violations occurred
- [ ] Quality hook performance remains under 30 seconds
- [ ] No emergency overrides used (except documented emergencies)

**Integration Verification:**
- [ ] API calls work with real backend
- [ ] WebSocket connections establish correctly
- [ ] Data flows from frontend to backend to frontend
- [ ] Error responses handled properly
- [ ] CORS configuration correct (if applicable)
- [ ] Authentication flows work (if applicable)
- [ ] Real-time updates function correctly

**Pre-Commit Verification:**
- [ ] `git commit` completes without quality gate failures
- [ ] Hook execution time is reasonable (<30 seconds)
- [ ] All code follows project conventions automatically enforced
- [ ] No `--no-verify` flags used (unless emergency documented)

## 🧪 Testing Requirements
**Manual Verification:**
- Open frontend in browser
- Perform user actions
- Verify backend receives correct data
- Confirm frontend updates appropriately

**Integration Points to Verify:**
- Form submission → API call → Success response
- API error → Error message display
- WebSocket event → Real-time UI update

## 🔗 Dependencies
**Prerequisites:**
- Backend feature implementation complete
- Frontend feature implementation complete
- Backend tests passing
- Frontend tests passing

**Environment Setup:**
- Both frontend and backend running
- Database/state management initialized
- WebSocket server active

**Resolution Playbook References:**
- Package Manager Issues: `.github/hooks/package-manager-errors.md`
- ESLint/Quality Issues: `.github/hooks/eslint-errors.md`  
- Performance Issues: `.github/hooks/performance-errors.md`
- Emergency Procedures: `.github/hooks/emergency-overrides.md`

---
**Time Box:** 15-20 minutes  
**Target:** 15 minutes (escalate if consistently hitting 20+)  
**Agent Focus:** Complete integration with verification  
**Scope:** Connect specific frontend and backend components  
**Success Metric:** End-to-end user flow works correctly, quality hooks compliant
