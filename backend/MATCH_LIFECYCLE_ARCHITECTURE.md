# Match Lifecycle Management Architecture

## Overview

This document defines the server-side architecture for managing the continuous match lifecycle in shmup-yours, including 5-minute matches, 2-minute intermissions, player queues, and handle management.

## Core Requirements

Based on GAME_DESIGN.md:
- **Match Structure**: 5-minute PvP matches followed by 2-minute intermissions
- **Continuous Cycle**: Matches run continuously until server reset
- **Handle System**: Unique handles claimed for entire server session (no reuse)
- **Player Queue**: Manage waiting players and match balancing
- **Relegation**: Bottom performers kicked after 3 consecutive poor showings
- **Server Reset**: 24-hour default cycle (configurable) with full state cleanup

## State Machine Architecture

### Match Lifecycle State Machine

```
┌─────────────────┐
│   SERVER_START  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    Timer Expires
│   INTERMISSION  │◄──────────────────┐
│   (2 minutes)   │                   │
└─────────┬───────┘                   │
          │ Queue has players         │
          ▼                           │
┌─────────────────┐    Timer Expires  │
│   ACTIVE_MATCH  │───────────────────┘
│   (5 minutes)   │
└─────────┬───────┘
          │ Server Reset Signal
          ▼
┌─────────────────┐
│   SERVER_RESET  │
└─────────────────┘
```

**States:**
- **SERVER_START**: Initial state, server boot/reset
- **INTERMISSION**: 2-minute period for chat, queue processing, and match preparation
- **ACTIVE_MATCH**: 5-minute PvP gameplay period
- **SERVER_RESET**: Cleanup and reset all state

### Player State Machine

```
┌─────────────────┐
│      NEW        │
└─────────┬───────┘
          │ Claim Handle
          ▼
┌─────────────────┐
│     QUEUED      │◄─────────────┐
└─────────┬───────┘              │
          │ Match Start          │ Leave Match
          ▼                      │
┌─────────────────┐              │
│     ACTIVE      │──────────────┘
└─────────┬───────┘
          │ Poor Performance (3x)
          ▼
┌─────────────────┐
│    RELEGATED    │
└─────────────────┘
```

**Player States:**
- **NEW**: Just connected, no handle claimed
- **QUEUED**: Has handle, waiting for match
- **ACTIVE**: Currently playing in match
- **RELEGATED**: Kicked due to poor performance

## Core Components

### 1. MatchLifecycleManager

Central coordinator for the match system.

**Responsibilities:**
- Manage match state transitions
- Coordinate timers and scheduling
- Handle player lifecycle events
- Manage server reset procedures

**Key Methods:**
```javascript
class MatchLifecycleManager {
  startServer()
  startIntermission()
  startMatch()
  resetServer()
  processServerTick()
}
```

### 2. PlayerQueueManager

Manages player queuing and match balancing.

**Responsibilities:**
- Queue management (FIFO with handle validation)
- Match player selection and balancing
- Handle reservation and validation
- Relegation processing

**Key Methods:**
```javascript
class PlayerQueueManager {
  addPlayerToQueue(player, handle)
  removePlayerFromQueue(playerId)
  selectPlayersForMatch()
  relegatePlayer(playerId)
  isHandleAvailable(handle)
}
```

### 3. HandleRegistry

Manages handle claiming and persistence.

**Responsibilities:**
- Handle uniqueness enforcement
- Handle-to-player mapping
- Handle release on server reset only
- Handle reservation during queue/match

**Key Methods:**
```javascript
class HandleRegistry {
  claimHandle(playerId, handle)
  isHandleAvailable(handle)
  getPlayerByHandle(handle)
  resetAllHandles()
}
```

### 4. SessionManager

Manages player sessions and connection state.

**Responsibilities:**
- Player session lifecycle
- Connection state tracking
- Session cleanup on disconnect
- Performance tracking for relegation

**Key Methods:**
```javascript
class SessionManager {
  createSession(connectionId)
  destroySession(sessionId)
  trackPerformance(sessionId, matchResult)
  checkRelegationStatus(sessionId)
}
```

### 5. TimerManager

Handles all timing and scheduling operations.

**Responsibilities:**
- Match and intermission timers
- Server reset scheduling
- Timer persistence across state changes
- Timer cleanup and reset

**Key Methods:**
```javascript
class TimerManager {
  startMatchTimer(duration, callback)
  startIntermissionTimer(duration, callback)
  scheduleServerReset(duration, callback)
  clearAllTimers()
}
```

## Match Flow Sequence

### Typical Match Cycle

```
1. INTERMISSION → Queue Processing
   ├─ Accept new handle claims
   ├─ Process relegations from previous match
   ├─ Select players for next match
   └─ Notify players of upcoming match

2. ACTIVE_MATCH → Game Execution  
   ├─ Move queued players to active
   ├─ Initialize game state
   ├─ Process game updates
   └─ Track performance metrics

3. MATCH_END → Results Processing
   ├─ Calculate performance scores
   ├─ Identify relegation candidates
   ├─ Update session performance history
   └─ Transition to INTERMISSION
```

### Server Reset Flow

```
1. Reset Signal → Cleanup Initiation
   ├─ Notify all connected players
   ├─ Complete current match (if active)
   └─ Begin cleanup procedures

2. State Cleanup → Memory Management
   ├─ Clear all handles (HandleRegistry.resetAllHandles())
   ├─ Clear player queues
   ├─ Reset performance tracking
   └─ Clear timer state

3. Server Restart → Fresh State
   ├─ Reinitialize all managers
   ├─ Start fresh intermission
   └─ Accept new connections
```

## Data Structures

### Player Session Data
```javascript
{
  sessionId: "uuid",
  connectionId: "websocket-id", 
  handle: "player-handle",
  state: "QUEUED|ACTIVE|RELEGATED",
  performanceHistory: [
    { matchId: "uuid", rank: 3, score: 1250 }
  ],
  relegationStreak: 0,
  joinedAt: timestamp,
  lastActive: timestamp
}
```

### Match State Data
```javascript
{
  matchId: "uuid",
  state: "INTERMISSION|ACTIVE_MATCH",
  startTime: timestamp,
  endTime: timestamp,
  activePlayers: ["sessionId1", "sessionId2"],
  queuedPlayers: ["sessionId3", "sessionId4"],
  currentTimer: {
    type: "MATCH|INTERMISSION",
    remaining: milliseconds,
    callback: function
  }
}
```

### Handle Registry Data
```javascript
{
  handles: {
    "player-handle": {
      sessionId: "uuid",
      claimedAt: timestamp,
      isActive: boolean
    }
  },
  reservedCount: number,
  lastReset: timestamp
}
```

## Configuration

### Timing Configuration
```javascript
const CONFIG = {
  MATCH_DURATION: 5 * 60 * 1000,        // 5 minutes
  INTERMISSION_DURATION: 2 * 60 * 1000,  // 2 minutes
  SERVER_RESET_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  RELEGATION_THRESHOLD: 3,               // 3 consecutive poor performances
  MAX_QUEUE_SIZE: 50,                   // Maximum queued players
  MIN_MATCH_PLAYERS: 2,                 // Minimum players to start match
  MAX_MATCH_PLAYERS: 16                 // Maximum players per match
};
```

### Performance Thresholds
```javascript
const RELEGATION_CONFIG = {
  CONSECUTIVE_BOTTOM_THRESHOLD: 3,       // Poor performance streak
  MINIMUM_PLAYERS_FOR_RELEGATION: 4,    // Don't relegate with too few players
  RELEGATION_PERCENTILES: {
    4: 1,   // Last place with 4 players
    6: 2,   // Bottom 2 with 6 players  
    8: 3,   // Bottom 3 with 8 players
    16: 4   // Bottom 4 with 16+ players
  }
};
```

## Memory Management

### Cleanup Procedures

**On Player Disconnect:**
- Remove from queue (but keep handle reserved)
- Mark session as inactive
- Clean up game state references
- Do NOT release handle until server reset

**On Server Reset:**
- Clear all handles completely
- Reset all performance tracking
- Clear match history
- Reinitialize all state managers
- Force disconnect all players

**Periodic Cleanup:**
- Clean up stale WebSocket connections
- Garbage collect old performance data
- Validate handle registry consistency

## Error Handling

### Critical Error Scenarios

**Timer Failures:**
- Fallback timer implementation
- Manual state progression if needed
- Graceful degradation to basic functionality

**Player Disconnect During Match:**
- Continue match with remaining players
- Handle minimum player thresholds
- Adjust relegation calculations accordingly

**Memory Pressure:**
- Limit queue size and connection count
- Implement backpressure for new connections
- Emergency server reset if needed

**Handle Conflicts:**
- Strict validation on handle claiming
- Handle collision resolution
- Audit trail for handle conflicts

## Testing Strategy

### Unit Testing
- Individual state machine transitions
- Timer functionality and edge cases
- Handle registry operations
- Performance calculation accuracy

### Integration Testing
- Complete match lifecycle flows
- Player queue processing
- Server reset procedures
- Error recovery scenarios

### Load Testing
- Maximum concurrent players
- Memory usage under load
- Timer accuracy under load
- Handle registry performance

## Future Considerations

### Scalability Improvements
- Multiple server instances (requires handle synchronization)
- Database persistence for cross-server resets
- Distributed timer management

### Feature Extensions
- Custom match durations
- Tournament bracket integration
- Advanced relegation algorithms
- Player statistics persistence

---

This architecture provides the foundation for reliable match lifecycle management while maintaining the core game philosophy of temporary, handle-based competitive play.