# Integration Task Template

## 🔗 Integration Objective
Clear description of how frontend and backend components need to connect.

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
- [ ] API calls work with real backend
- [ ] WebSocket connections establish correctly
- [ ] Data flows from frontend to backend to frontend
- [ ] Error responses handled properly
- [ ] CORS configuration correct (if applicable)
- [ ] Authentication flows work (if applicable)
- [ ] Real-time updates function correctly

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

---
**Time Box:** 15-20 minutes  
**Target:** 15 minutes (escalate if consistently hitting 20+)  
**Agent Focus:** Complete integration with verification  
**Scope:** Connect specific frontend and backend components  
**Success Metric:** End-to-end user flow works correctly
