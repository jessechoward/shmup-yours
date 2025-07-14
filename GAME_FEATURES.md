# Game Features & Mechanics Specification

## Core Gameplay Overview
**Game Type:** Multiplayer retro shooter (2-8 players)  
**Match Duration:** 5 minutes  
**Objective:** Highest score wins (frags + survival time)  
**Architecture:** Server-authoritative with client rendering

## Server-Authoritative Design Principles

### **All Input → Server First**
```
Player Input → WebSocket → Server Processing → State Update → Broadcast to All Clients
```

**Benefits:**
- Consistent latency for all players
- Eliminates client-side cheating
- Deterministic game state
- Simplified client implementation (render only)

### **Client Responsibilities**
- **Input Capture:** Keyboard/touch input → send to server
- **State Rendering:** Receive game state → render on Canvas
- **Interpolation:** Smooth movement between server updates
- **Prediction:** Local input prediction for responsiveness

### **Server Responsibilities**
- **Input Processing:** Validate and process all player inputs
- **Game Logic:** Physics, collisions, scoring, timing
- **State Management:** Maintain authoritative game state
- **Broadcasting:** Send state updates to all clients (60 FPS target)

## Core Features Checklist

### 🏗️ **Foundation (Week 1)**
- [ ] **Multiplayer Lobby System**
  - [ ] Create/join rooms (2-8 players)
  - [ ] Player ready states
  - [ ] Room lifecycle management
  - [ ] Basic chat functionality

- [ ] **WebSocket Infrastructure**
  - [ ] Real-time bidirectional communication
  - [ ] Connection management and reconnection
  - [ ] Message queuing and reliability
  - [ ] Rate limiting and validation

- [ ] **Basic Player System**
  - [ ] Player spawn/despawn
  - [ ] Server-side player state management
  - [ ] Input validation and processing
  - [ ] Position synchronization

### 🎮 **Core Gameplay (Week 2)**
- [ ] **Movement System**
  - [ ] WASD/Arrow key movement input
  - [ ] Server-side position calculation
  - [ ] Collision with arena boundaries
  - [ ] Smooth client-side interpolation

- [ ] **Combat System**
  - [ ] Mouse/touch aiming (client → server)
  - [ ] Server-side bullet physics
  - [ ] Hit detection and damage calculation
  - [ ] Player health and respawn mechanics

- [ ] **Scoring System**
  - [ ] Frag counting (kill/death tracking)
  - [ ] Survival time scoring
  - [ ] Real-time leaderboard updates
  - [ ] Match end conditions

### 🎨 **Visual & Polish (Week 3-4)**
- [ ] **Graphics & Animation**
  - [ ] Player sprite rendering
  - [ ] Bullet trail effects
  - [ ] Explosion/hit animations
  - [ ] Arena/map design

- [ ] **User Interface**
  - [ ] HUD (health, ammo, score)
  - [ ] Minimap or radar
  - [ ] Chat overlay
  - [ ] Spectator mode for dead players

- [ ] **Audio System**
  - [ ] Shooting sound effects
  - [ ] Hit/explosion sounds
  - [ ] Background music
  - [ ] Spatial audio positioning

## Detailed Mechanics Specification

### **Player Movement**
```javascript
// Client Input (60 FPS)
{
  type: 'player_input',
  keys: {w: true, a: false, s: false, d: true},
  timestamp: Date.now()
}

// Server Processing (60 FPS)
- Validate input timing and rate limits
- Calculate new position based on movement speed
- Check boundary and obstacle collisions
- Update authoritative player state
- Broadcast position to all clients
```

### **Combat Mechanics**
```javascript
// Client Aim Input
{
  type: 'aim_input', 
  mouseX: 320, mouseY: 240,
  firing: true,
  timestamp: Date.now()
}

// Server Bullet Physics
- Calculate bullet trajectory from player position
- Raycast or physics simulation for bullet path
- Check hit detection against all players
- Apply damage and update health
- Broadcast hit effects to all clients
```

### **Game State Synchronization**
```javascript
// Server State Broadcast (60 FPS)
{
  type: 'game_state',
  timestamp: Date.now(),
  players: [
    {id: 'p1', x: 100, y: 200, health: 80, score: 15},
    {id: 'p2', x: 300, y: 150, health: 100, score: 12}
  ],
  bullets: [
    {id: 'b1', x: 250, y: 175, vx: 5, vy: 0}
  ],
  match: {timeLeft: 180, status: 'active'}
}
```

## Technical Architecture

### **Backend Stack**
- **Runtime:** Node.js with ES modules
- **WebSocket:** Native `ws` library (not socket.io)
- **Physics:** Planck.js for deterministic simulation
- **State Management:** In-memory game state objects
- **Timing:** Server tick rate at 60 FPS

### **Frontend Stack**
- **Rendering:** HTML5 Canvas with 2D context
- **Input:** Vanilla JS event listeners
- **WebSocket:** Native WebSocket API
- **Animation:** RequestAnimationFrame loop
- **UI Framework:** Bootstrap 5 for lobby/menus

### **Communication Protocol**
```javascript
// Message Types
CLIENT_TO_SERVER: [
  'join_room', 'leave_room', 'player_ready',
  'player_input', 'aim_input', 'chat_message'
]

SERVER_TO_CLIENT: [
  'room_update', 'game_state', 'player_joined', 
  'player_left', 'match_start', 'match_end'
]
```

## Performance Targets

### **Network Performance**
- **Update Rate:** 60 FPS server ticks
- **Latency Tolerance:** <100ms for responsive gameplay
- **Bandwidth:** <50KB/s per player (optimized state updates)
- **Concurrent Players:** 2-8 per match, 50+ total server capacity

### **Client Performance**
- **Frame Rate:** 60 FPS rendering on modern browsers
- **Device Support:** Desktop browsers + mobile (touch controls)
- **Memory Usage:** <100MB per client tab
- **Load Time:** <2 seconds initial game load

## MVP Success Criteria

### **Technical Milestones**
- [ ] 2 players can join a room and see each other moving
- [ ] Real-time shooting and hit detection working
- [ ] 5-minute matches complete successfully
- [ ] Scoring and winner determination functional
- [ ] Playable on both desktop and mobile

### **User Experience Goals**
- [ ] Intuitive controls (WASD + mouse, touch friendly)
- [ ] Responsive gameplay (minimal input lag)
- [ ] Clear visual feedback for all actions
- [ ] Simple lobby/matchmaking flow
- [ ] Fun for 5-minute play sessions

---
**Architecture Owner:** Technical Product Manager  
**Implementation Priority:** Server-authoritative design above all else  
**Quality Gate:** All features must work reliably in multiplayer context  
**Timeline:** 2-week MVP, 4-week polished beta
