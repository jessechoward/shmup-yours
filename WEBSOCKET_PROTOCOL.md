# WebSocket Game State Protocol Specification

## Overview

This document defines the WebSocket communication protocol for real-time game state synchronization in shmup-yours, a multiplayer 2D space shooter supporting 2-16 concurrent players with minimal latency.

## Protocol Design Principles

### 1. Server Authority
- Server maintains authoritative game state
- Clients receive state updates and send input commands
- Server validates all player actions and physics simulations

### 2. Client Prediction
- Clients predict local player movement for responsiveness
- Server corrections reconcile prediction mismatches
- Rollback mechanism for handling server corrections

### 3. Minimal Latency
- Frequent physics updates (60 FPS server, 20 FPS network sync)
- Delta compression for state updates
- Prioritized message types for critical game events

### 4. Robust Error Handling
- Automatic reconnection with state recovery
- Handle drops and timeouts gracefully
- Maintain game continuity during connection issues

## Message Format Structure

### Base Message Format (JSON)
```json
{
  "type": "MESSAGE_TYPE",
  "timestamp": 1640995200000,
  "sequence": 42,
  "data": {
    // Message-specific payload
  }
}
```

### Message Fields
- `type`: String identifier for message type
- `timestamp`: Server timestamp in milliseconds (Unix epoch)
- `sequence`: Monotonic sequence number for ordering and duplicate detection
- `data`: Message-specific payload object

## Message Types

### 1. Connection Management

#### CLIENT_CONNECT
**Direction**: Client → Server  
**Purpose**: Initial connection and handle reservation  
```json
{
  "type": "CLIENT_CONNECT",
  "timestamp": 1640995200000,
  "sequence": 1,
  "data": {
    "handle": "PlayerName",
    "clientId": "uuid-client-identifier",
    "protocolVersion": "1.0"
  }
}
```

#### SERVER_WELCOME
**Direction**: Server → Client  
**Purpose**: Confirm connection and provide initial game state  
```json
{
  "type": "SERVER_WELCOME",
  "timestamp": 1640995200000,
  "sequence": 1,
  "data": {
    "playerId": "uuid-player-id",
    "gameState": "INTERMISSION",
    "matchTimeRemaining": 120000,
    "worldState": {
      // Initial world state snapshot
    }
  }
}
```

#### CONNECTION_ERROR
**Direction**: Server → Client  
**Purpose**: Connection rejection or error notification  
```json
{
  "type": "CONNECTION_ERROR",
  "timestamp": 1640995200000,
  "sequence": 1,
  "data": {
    "errorCode": "HANDLE_TAKEN",
    "message": "Handle 'PlayerName' is already in use"
  }
}
```

### 2. Player Input

#### PLAYER_INPUT
**Direction**: Client → Server  
**Purpose**: Send player control inputs  
```json
{
  "type": "PLAYER_INPUT",
  "timestamp": 1640995200000,
  "sequence": 42,
  "data": {
    "keys": {
      "thrust": true,
      "rotateLeft": false,
      "rotateRight": true,
      "fire": true
    },
    "clientTimestamp": 1640995200050
  }
}
```

### 3. Physics State Updates

#### WORLD_STATE_DELTA
**Direction**: Server → All Clients  
**Purpose**: Incremental world state updates  
```json
{
  "type": "WORLD_STATE_DELTA",
  "timestamp": 1640995200000,
  "sequence": 100,
  "data": {
    "players": {
      "player-uuid-1": {
        "position": { "x": 512, "y": 384 },
        "velocity": { "x": 2.5, "y": -1.2 },
        "rotation": 1.57,
        "angularVelocity": 0.1,
        "heat": 0.3,
        "health": 100
      }
    },
    "projectiles": [
      {
        "id": "proj-123",
        "position": { "x": 520, "y": 380 },
        "velocity": { "x": 10, "y": 0 },
        "ownerId": "player-uuid-1"
      }
    ],
    "removedProjectiles": ["proj-120", "proj-121"]
  }
}
```

#### WORLD_STATE_FULL
**Direction**: Server → Client  
**Purpose**: Complete world state (for new connections or recovery)  
```json
{
  "type": "WORLD_STATE_FULL",
  "timestamp": 1640995200000,
  "sequence": 100,
  "data": {
    "players": {
      // All player states
    },
    "projectiles": [
      // All active projectiles
    ],
    "terrain": {
      // Static terrain/obstacle data
    }
  }
}
```

### 4. Game Events

#### PLAYER_DEATH
**Direction**: Server → All Clients  
**Purpose**: Notify of player elimination  
```json
{
  "type": "PLAYER_DEATH",
  "timestamp": 1640995200000,
  "sequence": 150,
  "data": {
    "playerId": "player-uuid-1",
    "killerId": "player-uuid-2",
    "position": { "x": 512, "y": 384 },
    "cause": "PROJECTILE"
  }
}
```

#### PLAYER_RESPAWN
**Direction**: Server → All Clients  
**Purpose**: Player respawn notification  
```json
{
  "type": "PLAYER_RESPAWN",
  "timestamp": 1640995200000,
  "sequence": 155,
  "data": {
    "playerId": "player-uuid-1",
    "position": { "x": 100, "y": 100 },
    "rotation": 0,
    "invulnerabilityTime": 3000
  }
}
```

### 5. Match Lifecycle

#### MATCH_START
**Direction**: Server → All Clients  
**Purpose**: Signal start of 5-minute match phase  
```json
{
  "type": "MATCH_START",
  "timestamp": 1640995200000,
  "sequence": 200,
  "data": {
    "matchDuration": 300000,
    "participants": [
      {
        "playerId": "player-uuid-1",
        "handle": "Player1",
        "spawnPosition": { "x": 100, "y": 100 }
      }
    ]
  }
}
```

#### MATCH_END
**Direction**: Server → All Clients  
**Purpose**: Signal end of match and display results  
```json
{
  "type": "MATCH_END",
  "timestamp": 1640995200000,
  "sequence": 250,
  "data": {
    "results": [
      {
        "playerId": "player-uuid-1",
        "handle": "Player1",
        "kills": 5,
        "deaths": 2,
        "score": 150,
        "rank": 1
      }
    ],
    "relegatedPlayers": ["player-uuid-3"]
  }
}
```

#### INTERMISSION_START
**Direction**: Server → All Clients  
**Purpose**: Begin 2-minute intermission period  
```json
{
  "type": "INTERMISSION_START",
  "timestamp": 1640995200000,
  "sequence": 251,
  "data": {
    "duration": 120000,
    "chatEnabled": true
  }
}
```

### 6. Chat System

#### CHAT_MESSAGE
**Direction**: Client → Server → All Clients  
**Purpose**: Chat during intermission periods  
```json
{
  "type": "CHAT_MESSAGE",
  "timestamp": 1640995200000,
  "sequence": 300,
  "data": {
    "senderId": "player-uuid-1",
    "senderHandle": "Player1",
    "message": "Good game everyone!",
    "chatPrivilege": "VETERAN"
  }
}
```

### 7. Error Handling

#### SERVER_CORRECTION
**Direction**: Server → Client  
**Purpose**: Correct client prediction errors  
```json
{
  "type": "SERVER_CORRECTION",
  "timestamp": 1640995200000,
  "sequence": 180,
  "data": {
    "playerId": "player-uuid-1",
    "correctedState": {
      "position": { "x": 510, "y": 382 },
      "velocity": { "x": 2.0, "y": -1.0 }
    },
    "serverTimestamp": 1640995199950
  }
}
```

#### PING_REQUEST / PING_RESPONSE
**Direction**: Bidirectional  
**Purpose**: Network latency measurement  
```json
{
  "type": "PING_REQUEST",
  "timestamp": 1640995200000,
  "sequence": 400,
  "data": {
    "clientTimestamp": 1640995200000
  }
}
```

## State Synchronization Strategy

### Update Frequencies
- **Physics Simulation**: 60 FPS server-side
- **Network Updates**: 20 FPS (every 50ms)
- **Full State Sync**: Every 5 seconds or on player join
- **Ping Checks**: Every 1 second

### Delta Compression
- Only send changed properties in `WORLD_STATE_DELTA`
- Use position/velocity thresholds to reduce noise
- Combine multiple small updates into single messages

### Client Prediction Model
1. Client applies input immediately for local player
2. Client simulates physics for smooth movement
3. Server corrections override client predictions
4. Client uses linear interpolation for other players

## Error Handling and Recovery

### Connection Drop Handling
1. Client detects connection loss (ping timeout)
2. Client attempts automatic reconnection (exponential backoff)
3. Server maintains player state for 30 seconds after disconnect
4. On reconnection, server sends `WORLD_STATE_FULL` for recovery

### Message Ordering
- Use sequence numbers for duplicate detection
- Buffer out-of-order messages briefly
- Request retransmission for gaps in sequence

### Validation and Security
- Server validates all player inputs against game rules
- Rate limiting on message frequency
- Basic sanity checks on movement physics
- No client-side validation of other players

## Bandwidth Optimization

### Message Prioritization
1. **Critical**: Player deaths, match state changes
2. **High**: Local player corrections, input acknowledgments  
3. **Medium**: Other player position updates
4. **Low**: Chat messages, non-essential events

### Compression Strategies
- Quantize positions to reasonable precision (1 decimal place)
- Use shorter field names in production (`pos` vs `position`)
- Consider binary format for high-frequency messages (future optimization)

### Adaptive Quality
- Reduce update frequency for distant players
- Lower precision for non-critical state updates
- Skip redundant updates when objects are stationary

## Protocol Versioning

### Version Negotiation
- Client sends protocol version in `CLIENT_CONNECT`
- Server responds with supported version or error
- Maintain backward compatibility for at least 2 versions

### Migration Strategy
- Graceful degradation for unsupported features
- Feature flags for protocol capabilities
- Clear version deprecation timeline

## Implementation Guidelines

### WebSocket Library Integration
- Use `ws` library on Node.js backend
- Native WebSocket API on browser frontend
- Implement heartbeat mechanism for connection health

### Message Validation
```javascript
// Example message validation schema
const messageSchema = {
  type: { required: true, type: 'string' },
  timestamp: { required: true, type: 'number' },
  sequence: { required: true, type: 'number' },
  data: { required: true, type: 'object' }
};
```

### Rate Limiting
- Maximum 60 messages per second per client
- Burst allowance of 10 messages
- Temporary connection suspension for violations

## Future Considerations

### Binary Protocol Migration
- Consider MessagePack or Protocol Buffers for production
- Maintain JSON compatibility for debugging
- Benchmark bandwidth savings vs implementation complexity

### Advanced Features
- Message compression (gzip/deflate)
- Multi-channel WebSocket streams
- Server-side message batching
- Client-side interpolation/extrapolation improvements

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Related Issues**: #17 (Planck.js physics integration), #19 (WebSocket protocol specification)