# Server Reset Procedures and Memory Management

## Overview

This document outlines the server reset procedures and memory management strategies for the shmup-yours match lifecycle system, implementing the 24-hour reset cycle and cleanup requirements from GAME_DESIGN.md.

## Server Reset Architecture

### Reset Triggers

**Scheduled Reset (Primary)**
- Default: 24 hours after server start
- Configurable via `MATCH_CONFIG.SERVER_RESET_INTERVAL`
- Automatically scheduled when server starts
- Uses TimerManager for reliable scheduling

**Manual Reset (Administrative)**
- Emergency reset capability via `forceServerReset()`
- Can be triggered by admin command or critical error
- Immediate execution with proper cleanup sequence

### Reset Sequence

```
1. Pre-Reset Notification
   ├─ Emit 'serverReset' event to all listeners
   ├─ Log reset statistics (uptime, total matches)
   └─ Set state to SERVER_RESET

2. Timer Cleanup
   ├─ Cancel all active timers (matches, intermissions)
   ├─ Clear scheduled server reset timer
   └─ Reset server start time

3. State Cleanup
   ├─ Reset all handles (HandleRegistry.resetAllHandles())
   ├─ Clear all player sessions (SessionManager.resetAllSessions())
   ├─ Clear player queue (PlayerQueueManager.resetQueue())
   └─ Clear match history and current match data

4. Restart Sequence
   ├─ Brief pause (1 second) for cleanup completion
   ├─ Reinitialize all managers with fresh state
   ├─ Schedule new 24-hour reset timer
   └─ Transition to INTERMISSION state
```

## Memory Management Strategy

### Core Principles

**Handle Persistence Rules**
- Handles claimed during server session remain reserved until reset
- No handle reuse even after player disconnect (per GAME_DESIGN.md)
- Only server reset frees all handles completely
- Handle conflicts impossible due to strict reservation system

**Session Data Lifecycle**
- Active sessions persist across disconnections (handle remains reserved)
- Performance history limited to last 10 matches per player
- Automatic cleanup of stale disconnected sessions (30min default)
- Complete session reset only during server reset

**Queue Management**
- FIFO queue with automatic cleanup of disconnected players
- Maximum queue size enforcement (50 players default)
- Real-time queue position updates
- Queue reset during server reset

### Memory Cleanup Procedures

#### Continuous Cleanup (processServerTick)
```javascript
// Called every 30 seconds during normal operation
processServerTick() {
  // Clean up sessions disconnected > 30 minutes
  const staleSessions = sessionManager.cleanupStaleSessions(30 * 60 * 1000);
  
  // Remove disconnected players from queue
  const removedFromQueue = playerQueueManager.cleanupQueue();
  
  // Process relegations during intermission
  if (currentState === INTERMISSION) {
    processRelegations();
  }
}
```

#### Handle Memory Management
```javascript
class HandleRegistry {
  // Handles stored in Map for O(1) access
  handles: Map<string, HandleData>
  sessionToHandle: Map<string, string>
  
  // Only freed on server reset - no individual handle release
  resetAllHandles() {
    this.handles.clear();
    this.sessionToHandle.clear();
    this.lastReset = Date.now();
  }
}
```

#### Session Memory Management
```javascript
class SessionManager {
  // Limited performance history per session
  trackPerformance(sessionId, matchResult) {
    session.performanceHistory.push(matchResult);
    
    // Keep only recent history (prevent memory growth)
    if (session.performanceHistory.length > 10) {
      session.performanceHistory = session.performanceHistory.slice(-10);
    }
  }
  
  // Automatic stale session cleanup
  cleanupStaleSessions(maxIdleTime) {
    // Remove sessions inactive for > maxIdleTime
    // Preserves handles until server reset
  }
}
```

## Reset Configuration

### Default Settings
```javascript
const RESET_CONFIG = {
  SERVER_RESET_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  STALE_SESSION_TIMEOUT: 30 * 60 * 1000,      // 30 minutes
  MATCH_HISTORY_LIMIT: 100,                   // Last 100 matches
  PERFORMANCE_HISTORY_LIMIT: 10,              // Last 10 matches per player
  MAINTENANCE_TICK_INTERVAL: 30 * 1000        // 30 seconds
};
```

### Configurable Options
```javascript
// Custom reset interval (must be > 1 hour for stability)
matchManager.setResetInterval(12 * 60 * 60 * 1000); // 12 hours

// Custom stale session timeout
sessionManager.setStaleTimeout(60 * 60 * 1000); // 1 hour

// Emergency reset trigger
matchManager.forceServerReset();
```

## Reset Event System

### Event Broadcasting
```javascript
// Server reset event with statistics
{
  event: 'serverReset',
  data: {
    timestamp: Date.now(),
    uptime: 86400000,        // 24 hours in milliseconds
    totalMatches: 45,        // Matches completed this session
    totalPlayers: 127,       // Unique players this session
    handlesUsed: 89,         // Handles claimed this session
    resetReason: 'scheduled' // 'scheduled' | 'manual' | 'error'
  }
}
```

### External System Integration
```javascript
// WebSocket server integration
matchManager.addEventListener('serverReset', (data) => {
  // Notify all connected clients
  broadcast({
    type: 'SERVER_RESET',
    message: 'Server resetting in 5 seconds. All handles will be freed.',
    nextAvailable: Date.now() + 5000
  });
  
  // Close all connections after notification
  setTimeout(() => {
    closeAllConnections();
  }, 5000);
});
```

## Error Recovery

### Critical Error Handling
```javascript
// Automatic reset on critical errors
process.on('uncaughtException', (error) => {
  console.error('Critical error, forcing server reset:', error);
  matchManager.forceServerReset();
});

// Memory pressure detection
setInterval(() => {
  const memUsage = process.memoryUsage();
  if (memUsage.heapUsed > MAX_HEAP_SIZE) {
    console.warn('High memory usage, triggering reset');
    matchManager.forceServerReset();
  }
}, 60000);
```

### State Corruption Recovery
```javascript
// Validation during reset
_executeServerReset() {
  try {
    // Validate clean state after reset
    assert(this.handleRegistry.getClaimedHandleCount() === 0);
    assert(this.sessionManager.getActivePlayerCount() === 0);
    assert(this.playerQueueManager.getQueueSize() === 0);
    assert(this.timerManager.getActiveTimers().length === 0);
  } catch (error) {
    console.error('State validation failed after reset:', error);
    // Force complete reinitialization
    this._forceReinitialize();
  }
}
```

## Monitoring and Observability

### Reset Metrics
```javascript
// Track reset history for analysis
{
  resetHistory: [
    {
      timestamp: 1752476400000,
      reason: 'scheduled',
      uptime: 86400000,
      totalMatches: 45,
      peakConcurrentPlayers: 16,
      memoryUsageAtReset: { heapUsed: 45000000, heapTotal: 67000000 }
    }
  ]
}
```

### Health Checks
```javascript
// Periodic health validation
function validateSystemHealth() {
  return {
    handleRegistryHealthy: handleRegistry.getStatistics().totalClaimed < MAX_HANDLES,
    sessionManagerHealthy: sessionManager.getActivePlayerCount() < MAX_PLAYERS,
    timerManagerHealthy: timerManager.getActiveTimers().length < MAX_TIMERS,
    memoryHealthy: process.memoryUsage().heapUsed < MAX_HEAP_SIZE,
    nextResetIn: timerManager.getRemainingTime(serverResetTimer)
  };
}
```

## Performance Considerations

### Memory Footprint
- **Handles**: ~100 bytes per claimed handle
- **Sessions**: ~1KB per active session (including performance history)
- **Queue**: ~50 bytes per queued player
- **Match History**: ~5KB per completed match
- **Timers**: ~200 bytes per active timer

### Expected Capacity
```
Maximum Concurrent Players: 50
Maximum Handles per Session: 50  
Maximum Memory Usage: ~5MB (excluding Node.js overhead)
Reset Frequency: 24 hours (1 reset per day)
Expected Uptime: 99.9%
```

### Optimization Strategies
- Use Maps for O(1) handle and session lookups
- Limit historical data to prevent unbounded growth
- Batch cleanup operations to reduce overhead
- Efficient timer management with automatic cleanup
- Memory-mapped data structures for large player counts

## Testing Reset Procedures

### Automated Reset Testing
```javascript
// Test reset completeness
function testServerReset() {
  // Set up test state
  const manager = new MatchLifecycleManager();
  manager.startServer();
  
  // Add test data
  addTestPlayers(10);
  runTestMatches(3);
  
  // Trigger reset
  manager.forceServerReset();
  
  // Validate clean state
  assertResetComplete(manager);
}
```

### Load Testing Reset Performance
```javascript
// Test reset with maximum load
function testResetUnderLoad() {
  // Create maximum players and handles
  simulateMaxLoad(50);
  
  // Measure reset time
  const startTime = Date.now();
  manager.forceServerReset();
  const resetTime = Date.now() - startTime;
  
  // Validate reset completed within acceptable time
  assert(resetTime < 1000, 'Reset should complete within 1 second');
}
```

---

This reset architecture ensures reliable 24-hour cycles while maintaining the core game philosophy of temporary competitive play with handle commitment pressure.