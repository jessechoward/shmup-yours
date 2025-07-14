# WebSocket Protocol Implementation Patterns

## Architecture Integration

This document outlines implementation patterns for integrating the WebSocket protocol with the game architecture defined in `GAME_DESIGN.md` and `WEBSOCKET_PROTOCOL.md`.

## Server-Side Implementation Structure

### WebSocket Server Setup
```javascript
// backend/src/websocket-server.js
const WebSocket = require('ws');

class GameWebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // playerId -> WebSocket
    this.messageHandlers = new Map();
    this.sequenceCounter = 0;
    
    this.setupMessageHandlers();
    this.wss.on('connection', this.handleConnection.bind(this));
  }
  
  setupMessageHandlers() {
    this.messageHandlers.set('CLIENT_CONNECT', this.handleClientConnect.bind(this));
    this.messageHandlers.set('PLAYER_INPUT', this.handlePlayerInput.bind(this));
    this.messageHandlers.set('PING_REQUEST', this.handlePingRequest.bind(this));
    this.messageHandlers.set('CHAT_MESSAGE', this.handleChatMessage.bind(this));
  }
}
```

### Message Broadcasting Patterns
```javascript
// Broadcast to all clients
broadcast(message) {
  const serialized = JSON.stringify(message);
  this.clients.forEach((ws, playerId) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(serialized);
    }
  });
}

// Send to specific client
sendToClient(playerId, message) {
  const ws = this.clients.get(playerId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Broadcast except sender
broadcastExcept(excludePlayerId, message) {
  const serialized = JSON.stringify(message);
  this.clients.forEach((ws, playerId) => {
    if (playerId !== excludePlayerId && ws.readyState === WebSocket.OPEN) {
      ws.send(serialized);
    }
  });
}
```

## Client-Side Implementation Structure

### WebSocket Client Manager
```javascript
// frontend/src/websocket-client.js
class GameWebSocketClient {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.ws = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.sequenceCounter = 0;
    this.messageHandlers = new Map();
    
    this.setupMessageHandlers();
  }
  
  connect(serverUrl, handle) {
    this.ws = new WebSocket(serverUrl);
    
    this.ws.onopen = () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this.sendMessage('CLIENT_CONNECT', {
        handle: handle,
        clientId: this.generateClientId(),
        protocolVersion: '1.0'
      });
    };
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
    
    this.ws.onclose = () => {
      this.connected = false;
      this.handleDisconnection();
    };
  }
  
  setupMessageHandlers() {
    this.messageHandlers.set('SERVER_WELCOME', this.handleServerWelcome.bind(this));
    this.messageHandlers.set('WORLD_STATE_DELTA', this.handleWorldStateDelta.bind(this));
    this.messageHandlers.set('WORLD_STATE_FULL', this.handleWorldStateFull.bind(this));
    this.messageHandlers.set('SERVER_CORRECTION', this.handleServerCorrection.bind(this));
    this.messageHandlers.set('MATCH_START', this.handleMatchStart.bind(this));
    this.messageHandlers.set('MATCH_END', this.handleMatchEnd.bind(this));
  }
}
```

## State Synchronization Patterns

### Server Authority with Client Prediction
```javascript
// Client-side prediction
class ClientPrediction {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.inputHistory = [];
    this.lastServerUpdate = null;
  }
  
  applyInput(input) {
    // Apply input immediately for responsiveness
    this.gameEngine.applyPlayerInput(this.playerId, input);
    
    // Store input for rollback if needed
    this.inputHistory.push({
      input: input,
      timestamp: Date.now(),
      sequence: this.sequenceCounter++
    });
    
    // Send to server
    this.websocketClient.sendMessage('PLAYER_INPUT', {
      keys: input.keys,
      clientTimestamp: input.timestamp
    });
  }
  
  handleServerCorrection(correction) {
    // Roll back to server state
    this.gameEngine.setPlayerState(correction.playerId, correction.correctedState);
    
    // Replay inputs that occurred after server timestamp
    const replayInputs = this.inputHistory.filter(
      input => input.timestamp > correction.serverTimestamp
    );
    
    replayInputs.forEach(input => {
      this.gameEngine.applyPlayerInput(this.playerId, input.input);
    });
  }
}
```

### Delta State Processing
```javascript
// Server-side delta generation
class StateDeltaManager {
  constructor() {
    this.lastSentState = new Map(); // playerId -> lastState
  }
  
  generateDelta(currentWorldState) {
    const delta = {
      players: {},
      projectiles: [],
      removedProjectiles: []
    };
    
    // Compare current state with last sent state
    for (const [playerId, currentState] of currentWorldState.players) {
      const lastState = this.lastSentState.get(playerId);
      
      if (!lastState || this.hasSignificantChange(currentState, lastState)) {
        delta.players[playerId] = this.getChangedProperties(currentState, lastState);
      }
    }
    
    // Update last sent state
    this.lastSentState = new Map(currentWorldState.players);
    
    return delta;
  }
  
  hasSignificantChange(current, last) {
    const positionThreshold = 1.0; // pixels
    const velocityThreshold = 0.1;
    const rotationThreshold = 0.05; // radians
    
    return (
      Math.abs(current.position.x - last.position.x) > positionThreshold ||
      Math.abs(current.position.y - last.position.y) > positionThreshold ||
      Math.abs(current.velocity.x - last.velocity.x) > velocityThreshold ||
      Math.abs(current.velocity.y - last.velocity.y) > velocityThreshold ||
      Math.abs(current.rotation - last.rotation) > rotationThreshold
    );
  }
}
```

## Connection Management Patterns

### Reconnection Strategy
```javascript
// Client-side reconnection with exponential backoff
class ReconnectionManager {
  constructor(websocketClient) {
    this.websocketClient = websocketClient;
    this.reconnectDelay = 1000; // Start with 1 second
    this.maxReconnectDelay = 30000; // Cap at 30 seconds
    this.maxAttempts = 10;
    this.attempts = 0;
  }
  
  async attemptReconnection() {
    if (this.attempts >= this.maxAttempts) {
      this.websocketClient.emit('reconnection-failed');
      return;
    }
    
    this.attempts++;
    
    try {
      await this.websocketClient.connect();
      this.resetReconnectionState();
    } catch (error) {
      // Exponential backoff
      this.reconnectDelay = Math.min(
        this.reconnectDelay * 2,
        this.maxReconnectDelay
      );
      
      setTimeout(() => {
        this.attemptReconnection();
      }, this.reconnectDelay);
    }
  }
  
  resetReconnectionState() {
    this.attempts = 0;
    this.reconnectDelay = 1000;
  }
}
```

### State Recovery on Reconnection
```javascript
// Server-side state recovery
class PlayerStateManager {
  constructor() {
    this.disconnectedPlayers = new Map(); // playerId -> { state, timeout }
    this.stateRetentionTime = 30000; // 30 seconds
  }
  
  handlePlayerDisconnect(playerId) {
    const playerState = this.gameEngine.getPlayerState(playerId);
    
    this.disconnectedPlayers.set(playerId, {
      state: playerState,
      timeout: Date.now() + this.stateRetentionTime
    });
    
    // Remove player from active game but keep state
    this.gameEngine.setPlayerInactive(playerId);
  }
  
  handlePlayerReconnect(playerId) {
    const saved = this.disconnectedPlayers.get(playerId);
    
    if (saved && Date.now() < saved.timeout) {
      // Restore player state
      this.gameEngine.restorePlayerState(playerId, saved.state);
      this.disconnectedPlayers.delete(playerId);
      
      // Send full world state for synchronization
      return this.gameEngine.getFullWorldState();
    }
    
    return null; // Player needs to rejoin normally
  }
}
```

## Message Validation Patterns

### Input Validation and Sanitization
```javascript
// Server-side message validation
class MessageValidator {
  constructor() {
    this.validators = new Map();
    this.setupValidators();
  }
  
  setupValidators() {
    this.validators.set('PLAYER_INPUT', (data) => {
      return (
        data.keys &&
        typeof data.keys.thrust === 'boolean' &&
        typeof data.keys.rotateLeft === 'boolean' &&
        typeof data.keys.rotateRight === 'boolean' &&
        typeof data.keys.fire === 'boolean' &&
        typeof data.clientTimestamp === 'number'
      );
    });
    
    this.validators.set('CHAT_MESSAGE', (data) => {
      return (
        typeof data.message === 'string' &&
        data.message.length <= 200 &&
        data.message.trim().length > 0
      );
    });
  }
  
  validateMessage(message) {
    if (!message.type || !message.timestamp || !message.sequence) {
      return { valid: false, error: 'Missing required fields' };
    }
    
    const validator = this.validators.get(message.type);
    if (!validator) {
      return { valid: false, error: 'Unknown message type' };
    }
    
    if (!validator(message.data)) {
      return { valid: false, error: 'Invalid message data' };
    }
    
    return { valid: true };
  }
}
```

### Rate Limiting Implementation
```javascript
// Server-side rate limiting
class RateLimiter {
  constructor() {
    this.clientLimits = new Map(); // clientId -> { count, window }
    this.windowSize = 1000; // 1 second
    this.maxMessages = 60; // 60 messages per second
    this.burstAllowance = 10;
  }
  
  checkRateLimit(clientId) {
    const now = Date.now();
    const clientData = this.clientLimits.get(clientId) || { count: 0, window: now };
    
    // Reset window if expired
    if (now - clientData.window > this.windowSize) {
      clientData.count = 0;
      clientData.window = now;
    }
    
    clientData.count++;
    this.clientLimits.set(clientId, clientData);
    
    // Check against limits
    const allowedMessages = this.maxMessages + this.burstAllowance;
    return clientData.count <= allowedMessages;
  }
}
```

## Integration with Planck.js Physics

### Physics State Synchronization
```javascript
// Convert Planck.js state to network format
class PhysicsNetworkAdapter {
  constructor(physicsWorld) {
    this.physicsWorld = physicsWorld;
  }
  
  extractPlayerState(body) {
    const position = body.getPosition();
    const velocity = body.getLinearVelocity();
    
    return {
      position: { x: Math.round(position.x * 10) / 10, y: Math.round(position.y * 10) / 10 },
      velocity: { x: Math.round(velocity.x * 100) / 100, y: Math.round(velocity.y * 100) / 100 },
      rotation: Math.round(body.getAngle() * 1000) / 1000,
      angularVelocity: Math.round(body.getAngularVelocity() * 1000) / 1000
    };
  }
  
  applyNetworkState(body, networkState) {
    body.setPosition(networkState.position);
    body.setLinearVelocity(networkState.velocity);
    body.setAngle(networkState.rotation);
    body.setAngularVelocity(networkState.angularVelocity);
  }
}
```

## Performance Optimization Patterns

### Message Batching
```javascript
// Server-side message batching
class MessageBatcher {
  constructor(websocketServer) {
    this.websocketServer = websocketServer;
    this.batchQueue = [];
    this.batchInterval = 50; // 20 FPS
    
    setInterval(() => {
      this.flushBatch();
    }, this.batchInterval);
  }
  
  addToBatch(message) {
    this.batchQueue.push(message);
  }
  
  flushBatch() {
    if (this.batchQueue.length === 0) return;
    
    const batchedMessage = {
      type: 'BATCH',
      timestamp: Date.now(),
      sequence: this.websocketServer.getNextSequence(),
      data: {
        messages: this.batchQueue
      }
    };
    
    this.websocketServer.broadcast(batchedMessage);
    this.batchQueue = [];
  }
}
```

### Interpolation and Extrapolation
```javascript
// Client-side entity interpolation
class EntityInterpolator {
  constructor() {
    this.entities = new Map(); // entityId -> interpolation data
  }
  
  updateEntity(entityId, networkState, timestamp) {
    let entity = this.entities.get(entityId);
    
    if (!entity) {
      entity = {
        current: networkState,
        previous: networkState,
        lastUpdate: timestamp
      };
    } else {
      entity.previous = entity.current;
      entity.current = networkState;
      entity.lastUpdate = timestamp;
    }
    
    this.entities.set(entityId, entity);
  }
  
  interpolatePosition(entityId, renderTime) {
    const entity = this.entities.get(entityId);
    if (!entity) return null;
    
    const timeDelta = renderTime - entity.lastUpdate;
    const interpolationTime = Math.min(timeDelta / 50, 1); // 50ms interpolation window
    
    return {
      x: this.lerp(entity.previous.position.x, entity.current.position.x, interpolationTime),
      y: this.lerp(entity.previous.position.y, entity.current.position.y, interpolationTime)
    };
  }
  
  lerp(a, b, t) {
    return a + (b - a) * t;
  }
}
```

## Testing Integration

### WebSocket Test Utilities
```javascript
// test/websocket-test-utils.js
class WebSocketTestClient {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.receivedMessages = [];
  }
  
  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.serverUrl);
      
      this.ws.onopen = () => resolve();
      this.ws.onerror = (error) => reject(error);
      this.ws.onmessage = (event) => {
        this.receivedMessages.push(JSON.parse(event.data));
      };
    });
  }
  
  sendMessage(type, data) {
    const message = {
      type,
      timestamp: Date.now(),
      sequence: this.getNextSequence(),
      data
    };
    
    this.ws.send(JSON.stringify(message));
    return message;
  }
  
  waitForMessage(type, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const check = () => {
        const message = this.receivedMessages.find(msg => msg.type === type);
        if (message) {
          resolve(message);
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error(`Timeout waiting for message type: ${type}`));
          return;
        }
        
        setTimeout(check, 10);
      };
      
      check();
    });
  }
}
```

---

**Document Version**: 1.0  
**Last Updated**: January 2025  
**Related Documents**: `WEBSOCKET_PROTOCOL.md`, `GAME_DESIGN.md`