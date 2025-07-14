# WebSocket Protocol Summary

## Quick Reference Guide

This document provides a concise overview of the WebSocket game state protocol for shmup-yours implementation teams.

## Protocol Overview

### Core Design
- **Format**: JSON messages with consistent structure
- **Authority**: Server-authoritative with client prediction
- **Updates**: 20 FPS network sync, 60 FPS physics simulation
- **Players**: Support for 2-16 concurrent players
- **Latency**: Optimized for minimal delay real-time gameplay

### Key Message Types

| Category | Message Type | Direction | Purpose |
|----------|-------------|-----------|---------|
| **Connection** | `CLIENT_CONNECT` | Client → Server | Initial connection & handle reservation |
| | `SERVER_WELCOME` | Server → Client | Connection confirmation & initial state |
| **Gameplay** | `PLAYER_INPUT` | Client → Server | Player control inputs |
| | `WORLD_STATE_DELTA` | Server → All | Incremental world updates |
| | `SERVER_CORRECTION` | Server → Client | Prediction error corrections |
| **Match** | `MATCH_START` | Server → All | Begin 5-minute match |
| | `MATCH_END` | Server → All | End match, show results |
| | `INTERMISSION_START` | Server → All | Begin 2-minute intermission |
| **Events** | `PLAYER_DEATH` | Server → All | Player elimination |
| | `CHAT_MESSAGE` | Bidirectional | Chat during intermission |

## Message Format

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

## State Synchronization

### Update Frequencies
- **Physics**: 60 FPS server simulation
- **Network**: 20 FPS (50ms intervals)
- **Full Sync**: Every 5 seconds or on join
- **Ping**: Every 1 second

### Client Prediction Flow
1. Client applies input immediately
2. Client sends input to server
3. Server validates and simulates
4. Server sends corrections if needed
5. Client reconciles differences

## Integration Points

### Game Design Integration
- **Match Lifecycle**: 5min matches + 2min intermissions
- **Handle System**: Permanent handle reservation per server session
- **Relegation**: Bottom performers kicked after 3 consecutive losses
- **Chat Privileges**: Veterans only during intermissions

### Physics Integration (Planck.js)
- Deterministic simulation on server and client
- Position/velocity/rotation synchronization
- Heat system affects thrust/weapon mechanics
- Collision detection for projectiles and ships

### Error Handling
- **Connection Drops**: 30-second state retention
- **Reconnection**: Exponential backoff with full state recovery
- **Validation**: Server validates all inputs
- **Rate Limiting**: 60 messages/second per client

## Implementation Checklist

### Server Implementation
- [ ] WebSocket server setup with `ws` library
- [ ] Message validation and rate limiting
- [ ] State delta generation and broadcasting
- [ ] Player connection/disconnection handling
- [ ] Match lifecycle management
- [ ] Chat system with privilege checking
- [ ] Physics integration with Planck.js

### Client Implementation
- [ ] WebSocket client with auto-reconnection
- [ ] Client prediction for local player
- [ ] Server correction handling and rollback
- [ ] Interpolation for other players
- [ ] UI updates for match/intermission states
- [ ] Chat interface during intermissions
- [ ] Error handling and connection status display

### Testing Requirements
- [ ] Unit tests for message validation
- [ ] Integration tests for connection flows
- [ ] Load tests with multiple concurrent players
- [ ] Network simulation for lag/packet loss
- [ ] Reconnection scenario testing
- [ ] Match lifecycle testing

## Performance Targets

### Bandwidth Usage
- **Per Player**: ~1-2 KB/second during active gameplay
- **Peak Usage**: Match start/end events
- **Optimization**: Delta compression reduces traffic by ~70%

### Latency Requirements
- **Input Response**: <50ms local prediction
- **State Updates**: <100ms network round-trip
- **Maximum Acceptable**: 200ms (connection quality warning)

### Scalability Limits
- **Concurrent Players**: 2-16 per server instance
- **Message Rate**: 60 messages/second per client maximum
- **Memory Usage**: ~1MB per active player (including physics state)

## Configuration Parameters

### Server Settings
```javascript
const config = {
  physics: {
    updateRate: 60,        // FPS
    networkRate: 20        // FPS
  },
  connection: {
    pingInterval: 1000,    // ms
    stateRetention: 30000, // ms
    maxReconnectTime: 300000 // ms (5 minutes)
  },
  limits: {
    maxPlayersPerServer: 16,
    maxMessagesPerSecond: 60,
    maxChatMessageLength: 200
  },
  match: {
    matchDuration: 300000,      // 5 minutes
    intermissionDuration: 120000 // 2 minutes
  }
};
```

## File Structure

```
/
├── WEBSOCKET_PROTOCOL.md          # Complete protocol specification
├── WEBSOCKET_IMPLEMENTATION.md    # Implementation patterns and code examples
├── WEBSOCKET_SUMMARY.md          # This quick reference guide
└── backend/src/
    ├── websocket-server.js       # WebSocket server implementation
    ├── message-handlers.js       # Message type handlers
    ├── state-manager.js          # Game state synchronization
    └── protocol-validator.js     # Message validation
```

## Development Workflow

### Protocol Changes
1. Update `WEBSOCKET_PROTOCOL.md` specification
2. Update implementation patterns in `WEBSOCKET_IMPLEMENTATION.md`
3. Implement changes in server and client code
4. Update tests for new message types
5. Update this summary document

### Debugging Tools
- Message logging with sequence numbers
- WebSocket inspector for browser debugging
- Server-side message statistics
- Client-side prediction vs server state visualization

## Common Issues and Solutions

### High Latency
- Check client prediction implementation
- Verify interpolation for other players
- Monitor network update frequency
- Consider reducing non-essential message types

### Connection Stability
- Implement proper ping/pong heartbeat
- Use exponential backoff for reconnection
- Handle WebSocket close codes appropriately
- Maintain state recovery for temporary disconnects

### State Desynchronization
- Ensure deterministic physics simulation
- Validate server correction handling
- Check for floating-point precision issues
- Monitor sequence number gaps

---

**Quick Links:**
- [Complete Protocol Specification](./WEBSOCKET_PROTOCOL.md)
- [Implementation Patterns](./WEBSOCKET_IMPLEMENTATION.md)
- [Game Design Document](./GAME_DESIGN.md)
- [Architecture Overview](./.github/copilot-context/architecture.md)

**Document Version**: 1.0  
**Last Updated**: January 2025