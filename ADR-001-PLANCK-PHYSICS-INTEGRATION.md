# ADR-001: Planck.js Physics Integration Patterns

## Status
**ACCEPTED** - December 2024

## Context

Shmup-Yours requires deterministic physics simulation shared between client (browser) and server (Node.js) environments for asteroids-style space combat gameplay. The game features:

- **Movement**: Rotation + thrust mechanics with minimal friction
- **Heat System**: Engines and weapons generate heat affecting performance  
- **Multiplayer**: 2-16 players with real-time projectiles and collisions
- **Architecture**: Single-server, single-game-world design with server authority
- **Performance**: 5-minute matches requiring responsive, smooth gameplay

## Decision

We will implement **Shared Deterministic Physics** using Planck.js with **Server-Authoritative Architecture** and **Client-Side Prediction** for optimal performance and consistency.

## Detailed Architecture

### 1. Shared Planck.js World Setup

#### World Configuration (Shared Module)
```javascript
// shared/physics-config.js (used by both client and server)
export const PHYSICS_CONFIG = {
  // World settings for deterministic simulation
  gravity: { x: 0, y: 0 }, // Space environment - no gravity
  velocityIterations: 8,   // Physics solver iterations
  positionIterations: 3,   // Position correction iterations
  
  // Game-specific constants
  timeStep: 1/60,          // 60 FPS fixed timestep
  maxSubSteps: 3,          // Maximum sub-steps per frame
  
  // Ship physics
  thrustForce: 500,        // Base engine thrust
  rotationSpeed: 3.0,      // Radians per second
  linearDamping: 0.05,     // Minimal friction in space
  angularDamping: 0.1,     // Rotational friction
  
  // Heat system
  maxHeat: 100,           // Maximum heat before overheating
  heatDecayRate: 10,      // Heat units cooled per second
  thrustHeatGeneration: 15, // Heat per second when thrusting
  weaponHeatGeneration: 25  // Heat per weapon fire
};

// Factory function for consistent world creation
export function createPhysicsWorld() {
  const world = new planck.World(PHYSICS_CONFIG.gravity);
  world.setGravity(PHYSICS_CONFIG.gravity);
  return world;
}
```

#### Ship Entity Creation (Shared)
```javascript
// shared/entities/ship.js
export function createShipBody(world, position, playerId) {
  const shipDef = {
    type: 'dynamic',
    position: position,
    angle: 0,
    linearDamping: PHYSICS_CONFIG.linearDamping,
    angularDamping: PHYSICS_CONFIG.angularDamping,
    userData: {
      type: 'ship',
      playerId: playerId,
      heat: 0,
      overheated: false
    }
  };
  
  const body = world.createBody(shipDef);
  
  // Ship collision shape (triangle for asteroids-style feel)
  const vertices = [
    planck.Vec2(0, 1),   // Nose
    planck.Vec2(-0.5, -0.5), // Left wing
    planck.Vec2(0.5, -0.5)   // Right wing
  ];
  
  body.createFixture({
    shape: planck.Polygon(vertices),
    density: 1.0,
    friction: 0.1,
    restitution: 0.3,
    filterCategoryBits: 0x0001,
    filterMaskBits: 0xFFFF
  });
  
  return body;
}
```

### 2. Physics State Synchronization Protocol

#### Message Types
```javascript
// shared/messages/physics.js
export const PHYSICS_MESSAGES = {
  // Server → Client: Authoritative state updates
  WORLD_STATE: 'physics:world_state',
  ENTITY_UPDATE: 'physics:entity_update',
  COLLISION_EVENT: 'physics:collision',
  
  // Client → Server: Input commands
  PLAYER_INPUT: 'physics:input',
  
  // Synchronization
  PHYSICS_SYNC: 'physics:sync'
};

// State snapshot format
export const WorldStateMessage = {
  timestamp: 0,           // Server timestamp
  tick: 0,               // Physics tick number
  entities: [
    {
      id: 'string',        // Entity identifier
      type: 'ship|projectile|obstacle',
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      angle: 0,
      angularVelocity: 0,
      heat: 0,             // For ships
      health: 100          // Entity health
    }
  ],
  events: [               // Physics events since last update
    {
      type: 'collision|explosion|heat_overheat',
      entities: ['id1', 'id2'],
      timestamp: 0
    }
  ]
};
```

#### Update Frequency Strategy
```javascript
// Server physics loop
const PHYSICS_UPDATE_RATE = 60; // 60 Hz for smooth simulation
const NETWORK_SEND_RATE = 20;   // 20 Hz for network efficiency
const ticksPerNetworkUpdate = PHYSICS_UPDATE_RATE / NETWORK_SEND_RATE; // 3 ticks

let physicsTick = 0;

function physicsLoop() {
  // Always run physics at 60 Hz
  world.step(PHYSICS_CONFIG.timeStep);
  physicsTick++;
  
  // Send network updates at 20 Hz
  if (physicsTick % ticksPerNetworkUpdate === 0) {
    broadcastWorldState();
  }
}
```

### 3. Client Prediction & Server Authority

#### Client-Side Prediction Implementation
```javascript
// client/physics/prediction.js
class PhysicsPrediction {
  constructor() {
    this.localWorld = createPhysicsWorld();
    this.serverStates = new Map(); // Timestamped server states
    this.inputHistory = [];        // Local input history
    this.lastServerUpdate = 0;
  }
  
  // Apply local input immediately for responsiveness
  applyLocalInput(input) {
    const localShip = this.getLocalShip();
    this.applyInputToShip(localShip, input);
    
    // Store input for reconciliation
    this.inputHistory.push({
      input: input,
      timestamp: Date.now(),
      tick: this.currentTick
    });
    
    // Run local physics step
    this.localWorld.step(PHYSICS_CONFIG.timeStep);
  }
  
  // Reconcile with server state
  reconcileServerState(serverState) {
    this.serverStates.set(serverState.timestamp, serverState);
    
    // Find corresponding local state
    const localState = this.getStateAtTimestamp(serverState.timestamp);
    
    if (this.statesDiffer(localState, serverState)) {
      // Rollback and replay from server state
      this.rollbackAndReplay(serverState);
    }
    
    this.lastServerUpdate = serverState.timestamp;
  }
  
  rollbackAndReplay(authorativeState) {
    // Reset local world to server state
    this.applyServerState(authorativeState);
    
    // Replay inputs that occurred after server timestamp
    const replayInputs = this.inputHistory.filter(
      input => input.timestamp > authorativeState.timestamp
    );
    
    for (const inputData of replayInputs) {
      this.applyInputToShip(this.getLocalShip(), inputData.input);
      this.localWorld.step(PHYSICS_CONFIG.timeStep);
    }
  }
}
```

#### Server Authority Implementation
```javascript
// server/physics/authority.js
class PhysicsAuthority {
  constructor() {
    this.world = createPhysicsWorld();
    this.pendingInputs = new Map(); // Player inputs to process
    this.lastProcessedInput = new Map(); // Track input sequence
  }
  
  processPlayerInput(playerId, input, sequenceNumber) {
    // Validate input sequence to prevent replay attacks
    const lastSeq = this.lastProcessedInput.get(playerId) || 0;
    if (sequenceNumber <= lastSeq) {
      return; // Ignore old or duplicate inputs
    }
    
    this.lastProcessedInput.set(playerId, sequenceNumber);
    
    // Apply input to ship
    const ship = this.getPlayerShip(playerId);
    if (ship && this.validateInput(input)) {
      this.applyInputToShip(ship, input);
    }
  }
  
  validateInput(input) {
    // Validate input to prevent cheating
    return (
      typeof input.thrust === 'boolean' &&
      typeof input.rotateLeft === 'boolean' &&
      typeof input.rotateRight === 'boolean' &&
      typeof input.fire === 'boolean'
    );
  }
  
  applyInputToShip(shipBody, input) {
    const userData = shipBody.getUserData();
    
    // Check heat system constraints
    if (userData.overheated) {
      return; // Ship is overheated, no actions allowed
    }
    
    // Apply rotation
    if (input.rotateLeft) {
      shipBody.setAngularVelocity(-PHYSICS_CONFIG.rotationSpeed);
    } else if (input.rotateRight) {
      shipBody.setAngularVelocity(PHYSICS_CONFIG.rotationSpeed);
    }
    
    // Apply thrust
    if (input.thrust) {
      const angle = shipBody.getAngle();
      const thrustVector = planck.Vec2(
        Math.cos(angle) * PHYSICS_CONFIG.thrustForce,
        Math.sin(angle) * PHYSICS_CONFIG.thrustForce
      );
      shipBody.applyForceToCenter(thrustVector);
      
      // Generate heat
      userData.heat += PHYSICS_CONFIG.thrustHeatGeneration * PHYSICS_CONFIG.timeStep;
    }
    
    // Apply weapon fire
    if (input.fire) {
      this.fireWeapon(shipBody);
      userData.heat += PHYSICS_CONFIG.weaponHeatGeneration;
    }
    
    // Update heat system
    this.updateHeatSystem(userData);
  }
}
```

### 4. Network Optimization

#### State Compression
```javascript
// shared/network/compression.js
export function compressWorldState(worldState) {
  return {
    t: worldState.timestamp,
    k: worldState.tick,
    e: worldState.entities.map(entity => [
      entity.id,
      Math.round(entity.position.x * 100), // 2 decimal precision
      Math.round(entity.position.y * 100),
      Math.round(entity.angle * 1000),     // 3 decimal precision
      Math.round(entity.velocity.x * 100),
      Math.round(entity.velocity.y * 100),
      entity.heat || 0,
      entity.health || 100
    ])
  };
}

export function decompressWorldState(compressed) {
  return {
    timestamp: compressed.t,
    tick: compressed.k,
    entities: compressed.e.map(([id, px, py, a, vx, vy, h, hp]) => ({
      id,
      position: { x: px / 100, y: py / 100 },
      angle: a / 1000,
      velocity: { x: vx / 100, y: vy / 100 },
      heat: h,
      health: hp
    }))
  };
}
```

#### Delta Compression
```javascript
// Only send changed entities
export function createDeltaUpdate(previousState, currentState) {
  const delta = {
    timestamp: currentState.timestamp,
    tick: currentState.tick,
    changed: [],
    removed: []
  };
  
  // Find changed entities
  for (const entity of currentState.entities) {
    const previous = previousState.entities.find(e => e.id === entity.id);
    if (!previous || hasSignificantChange(previous, entity)) {
      delta.changed.push(entity);
    }
  }
  
  // Find removed entities
  for (const entity of previousState.entities) {
    if (!currentState.entities.find(e => e.id === entity.id)) {
      delta.removed.push(entity.id);
    }
  }
  
  return delta;
}
```

## Implementation Guidelines

### 1. Server Setup (15-20 minutes)
```bash
# Add Planck.js dependency
yarn workspace backend add planck-js

# Create physics module structure
mkdir -p backend/src/physics/{world,entities,systems}
mkdir -p shared/physics
```

### 2. Shared Physics Module (15-20 minutes)
1. Create `shared/physics/config.js` with world configuration
2. Create `shared/physics/entities/ship.js` for ship physics
3. Create `shared/physics/messages.js` for network protocol

### 3. Server Physics Loop (15-20 minutes)
1. Implement `PhysicsAuthority` class in `backend/src/physics/authority.js`
2. Add physics loop to main server with 60Hz updates
3. Integrate with WebSocket for input processing

### 4. Client Prediction (15-20 minutes)
1. Implement `PhysicsPrediction` class in `frontend/src/physics/prediction.js`
2. Add client-side physics world matching server configuration
3. Implement rollback and replay mechanisms

## Benefits

1. **Deterministic**: Identical physics across all environments
2. **Responsive**: Client prediction provides immediate feedback
3. **Authoritative**: Server prevents cheating and maintains consistency
4. **Efficient**: 20Hz network updates with 60Hz local simulation
5. **Scalable**: Delta compression reduces bandwidth usage
6. **Maintainable**: Shared physics code reduces duplication

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Physics desync between client/server | Shared configuration module, deterministic timesteps |
| High network bandwidth | Delta compression, 20Hz update rate |
| Client prediction complexity | Gradual rollout, extensive testing |
| Heat system cheating | Server-side validation of all heat calculations |
| Performance with 16 players | Profiling, spatial partitioning if needed |

## Success Metrics

- ✅ Physics simulation runs identically on browser and Node.js
- ✅ Input responsiveness < 50ms (client prediction working)
- ✅ Network bandwidth < 10KB/s per player at 20Hz
- ✅ No desync issues during 5-minute matches
- ✅ Heat system prevents overheating exploits

## References

- [Planck.js Documentation](https://piqnt.com/planck.js/)
- [Game Physics for Client-Server Games](https://www.gabrielgambetta.com/client-server-game-architecture.html)
- [Real-Time Multiplayer Game Architecture](https://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html)

---

**Decision made by**: Architecture Team  
**Implementation target**: Sprint 1 - Foundation  
**Review date**: After MVP completion