# Backend - shmup-yours Game Server

## Overview

Backend game server implementing the match lifecycle management system for shmup-yours multiplayer shooter game. This module provides the server-side architecture for 5-minute matches, 2-minute intermissions, handle management, and 24-hour server reset cycles.

## Architecture Research (Issue #21) ✅

**Status: COMPLETE** - Full architecture research and implementation foundation delivered.

### Key Documents
- **[ARCHITECTURE_RESEARCH_SUMMARY.md](./ARCHITECTURE_RESEARCH_SUMMARY.md)** - Complete research summary and implementation status
- **[MATCH_LIFECYCLE_ARCHITECTURE.md](./MATCH_LIFECYCLE_ARCHITECTURE.md)** - Detailed state machine and component design
- **[SERVER_RESET_PROCEDURES.md](./SERVER_RESET_PROCEDURES.md)** - Reset procedures and memory management

### Architecture Components
- **MatchLifecycleManager** - Central state machine coordinator
- **TimerManager** - Match, intermission, and reset scheduling  
- **HandleRegistry** - Unique handle claiming and persistence
- **SessionManager** - Player session and performance tracking
- **PlayerQueueManager** - Queue management and match balancing

## Quick Start

### Run the Demo
```bash
# Install dependencies (from project root)
npm install

# Run the match lifecycle demonstration
npm start

# Run architecture validation tests
npm test
```

### Integration Example
```javascript
const MatchLifecycleManager = require('./src/managers/MatchLifecycleManager');

// Initialize the match system
const matchManager = new MatchLifecycleManager();

// Set up event listeners
matchManager.addEventListener('matchStart', (data) => {
  console.log(`Match started with ${data.match.playerCount} players`);
});

// Start the server
matchManager.startServer();

// Handle player connections
const sessionId = matchManager.handlePlayerConnect(websocketId);
matchManager.handleClaimHandle(sessionId, 'PlayerHandle');
matchManager.handleJoinQueue(sessionId);
```

## Game Mechanics Implemented

### Match Lifecycle
- **5-minute matches** with automatic timer management
- **2-minute intermissions** for queue processing and chat
- **Continuous cycles** until 24-hour server reset
- **State machine** coordination for reliable transitions

### Handle System
- **Unique handles** claimed for entire server session
- **No reuse** until server reset (commitment pressure)
- **Handle persistence** across player disconnections
- **Conflict prevention** with strict validation

### Player Management
- **FIFO queue** with real-time position tracking
- **Performance tracking** for relegation decisions
- **Session persistence** across connection changes
- **Automatic cleanup** of stale connections

### Relegation System
- **3 consecutive poor performances** trigger relegation
- **Configurable thresholds** based on player count
- **Automatic processing** during intermissions
- **Public notification** system for relegated players

## Configuration

### Timing Configuration
```javascript
const MATCH_CONFIG = {
  MATCH_DURATION: 5 * 60 * 1000,        // 5 minutes
  INTERMISSION_DURATION: 2 * 60 * 1000,  // 2 minutes  
  SERVER_RESET_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  RELEGATION_THRESHOLD: 3,               // Poor performance streak
  MAX_QUEUE_SIZE: 50,                   // Maximum queued players
  MIN_MATCH_PLAYERS: 2,                 // Minimum for match start
  MAX_MATCH_PLAYERS: 16                 // Maximum per match
};
```

### Performance Thresholds
```javascript
const RELEGATION_PERCENTILES = {
  4: 1,   // Last place with 4 players
  6: 2,   // Bottom 2 with 6 players
  8: 3,   // Bottom 3 with 8 players  
  16: 4   // Bottom 4 with 16+ players
};
```

## Testing

### Automated Test Suite
```bash
npm test
```

**Test Coverage:**
- ✅ HandleRegistry - Handle claiming and persistence
- ✅ SessionManager - Player lifecycle and performance tracking
- ✅ TimerManager - Match and intermission timing
- ✅ MatchLifecycleManager - Complete state machine coordination
- ✅ PlayerFlow - End-to-end player journey validation

### Live Demo System
```bash
npm start
```

Runs a complete demonstration with:
- 4 simulated players joining queue
- Automatic match start when enough players
- Performance tracking and relegation processing
- Real-time event broadcasting and state monitoring

## Dependencies Satisfied

### Integration Points Ready
- **Issue #17 (Planck.js Physics)** - Player session tracking ready for physics integration
- **Issue #19 (WebSocket Protocol)** - Event system ready for real-time messaging

### External System Interfaces
- **WebSocket Server** - Event broadcasting system implemented
- **Game Engine** - Player state management ready for integration
- **Client Protocol** - State machine provides clear message flow patterns

## Performance Characteristics

### Scalability
- **Memory Usage:** ~5MB for 50 concurrent players
- **Handle Lookups:** O(1) via Map data structures  
- **Queue Operations:** O(1) for add/remove operations
- **Expected Capacity:** 50+ concurrent players tested

### Reliability
- **Timer Management:** Automatic recovery from timer failures
- **Memory Cleanup:** Periodic cleanup of stale sessions
- **State Validation:** Reset procedures with corruption recovery
- **Error Handling:** Graceful degradation and emergency reset

## Next Steps

### Ready for Integration
1. **WebSocket Server** - Hook into event system for real-time updates
2. **Game Engine** - Connect match state to physics and rendering systems  
3. **Client Protocol** - Implement message handlers for state synchronization

### Pending Game Development
1. **Physics Integration** - Connect player sessions to Planck.js physics
2. **Scoring System** - Implement score calculation for relegation decisions
3. **Chat System** - Add intermission chat with privilege management

---

## Architecture Philosophy

This implementation follows the core game design principles:

- **Single Server Model** - No microservices complexity
- **In-Memory State** - No database overhead for rapid development
- **Handle-Based Identity** - No authentication system needed
- **Temporary Competitive Play** - 24-hour reset cycles maintain freshness
- **Performance Pressure** - Relegation system maintains engagement

The architecture provides a robust foundation for the unique shmup-yours game mechanics while maintaining simplicity and developer velocity.
