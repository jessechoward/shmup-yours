# Shmup-Yours: Game Design Document

## Core Philosophy
"Lightweight office game server for work friends - temporary fun, not permanent infrastructure"

**Target Deployment**: 2 containers (frontend SPA + backend game server)  
**Duration**: 1-2 weeks temporary deployments  
**Platform**: Any cloud VM or office LAN  
**Purpose**: Fun and social bonding, not monetization  

---

## Game Loop & Timing

### Match Structure
- **Active Match**: 5 minutes PvP combat
- **Intermission**: 2 minutes trash talk and strategy
- **Cycle**: Continuous matches until server reset

### Server Lifecycle
- **Default Reset**: 24 hours (configurable)
- **Statistics**: All stats/leaderboards reset on server restart
- **Philosophy**: Fresh chances for newcomers, temporary fame/shame

---

## Player Systems

### Handle Management
**Core Rule**: Choose handle to join → Handle becomes "taken" for entire server session

**Mechanics**:
- No handle reuse, even by same player after leaving
- Handle only freed on server reset
- Creates commitment pressure ("don't leave or lose your name")
- Provides opportunity for newcomers after reset

### Chat Privilege System
```
Spectators/Queue Players: Read-only (can observe trash talk)
New Players: Read-only until completing first match
Veterans: Full chat privileges during 2-minute intermissions
```

**Philosophy**: "Put up or shut up" - earn your voice through play

---

## Relegation System

### Core Mechanics
**Automatic Relegation**: Bottom performers for 3 consecutive matches = immediate kick

**Consequences**:
- Kicked from server immediately  
- Handle lost forever (until server reset)
- Public shame notification to remaining players
- Queue spot opens for waiting players

### Performance-Based Scaling (TBD - Requires Testing)

**Scaling Philosophy**: 
- Number of players determines relegation depth
- Even with minimal players, poor performance = relegation
- "Please beat on me some more!" - relegated players can rejoin queue

**Examples (Subject to Performance Testing)**:
```
4 Players, No Queue: Last place 3x = relegation
6 Players: Bottom 2 for 3x = relegation  
8 Players: Bottom 3 for 3x = relegation
12+ Players: Bottom 4 for 3x = relegation
```

**Testing Requirements**:
- [ ] Determine maximum concurrent players per server
- [ ] Performance test optimal player counts
- [ ] Create definitive relegation scaling table
- [ ] Validate social dynamics with different player counts

---

## Architecture

### Single Game Server Model
- **One server instance = one game world**
- **All active players in same arena**
- **No multiple rooms - single unified game state**

### Viewer/Spectator System
**Architecture**: Viewer proxy pattern
```
Game Server ←→ Direct Player Connections (WebSocket)
     ↓
Viewer Proxy ←→ Spectator Connections (WebSocket)
```

**Benefits**:
- Game server only handles active players
- Single event stream copied to unlimited viewers  
- Reduced load on core game logic
- Viewers don't impact game performance

### Chat System
**MVP**: Integrated with game server (2-minute intermissions only)  
**Future**: Separate chat server for scalability  
**Timing**: Chat only during intermissions, not during active matches

---

## Map Design

### Strategic Arena Concept
**Inspiration**: Paintball arena with cover and obstacles  
**Size**: 2-5 screens × 2-5 screens (scales with player capacity)

**Design Principles**:
- Large enough for maneuvering and tactics
- Small enough to ensure constant engagement  
- Strategic cover for retreats and cornering
- No safe hiding spots - always potential combat

### Technical Specifications
**Game Type**: 2D sprite/pixel game
**Rendering**: Native HTML5 Canvas API (no external game engines)
**Viewport**: Fixed 1024×768 resolution
**Map Structure**: 2D tilemap system

**Visual Layers** (back to front):
1. **Background Layer 1**: Sparse starmap (slowest scroll rate)
2. **Background Layer 2**: Sparse starmap (medium scroll rate) 
3. **Background Layer 3**: Sparse starmap (fastest scroll rate)
4. **Terrain Layer**: Paintball field obstacles using space-themed tiles

**Art Style**: Modern pixel art remake inspired by SubSpace maps
**Terrain Assets**: Space junk, spaceport panels, pipes, geometric obstacles
**Design Philosophy**: Clean, minimal features - less frills than SubSpace

### Map Progression
**Current**: Single arena per server session
**Future**: Map rotation between matches
**Advanced**: Procedural map generation

---

## Player Capacity & Performance

### Current Unknowns (Requires Testing)
- [ ] Maximum concurrent players per Node.js server
- [ ] Optimal map size for different player counts
- [ ] Network performance with real-time updates
- [ ] Viewer proxy capacity limits

### Testing Goals
1. **Performance Benchmarking**: Find breaking points
2. **Social Dynamics**: Test relegation at different scales  
3. **Map Scaling**: Optimal arena size per player count
4. **Network Load**: WebSocket message frequency limits

---

## Social Engineering

### Psychological Mechanics
1. **Commitment Device**: Handle loss prevents casual leaving
2. **Performance Pressure**: Relegation threat maintains engagement
3. **FOMO**: Queue visibility creates demand
4. **Temporary Fame**: Stats reset gives everyone chances
5. **Earned Respect**: Chat privileges through completion
6. **Public Accountability**: Relegation notifications create shame

### Campy Humor Integration
- Trash talk encouragement during intermissions
- "Put up or shut up" attitude
- Shame-based relegation messaging
- Temporary glory celebration

---

## MVP Implementation Priorities

### Phase 1: Core Game Engine
- [ ] Single server, direct player connections
- [ ] 5-minute match timer with 2-minute intermissions
- [ ] Basic PvP combat and movement
- [ ] Handle reservation system

### Phase 2: Social Systems  
- [ ] Performance tracking and relegation logic
- [ ] Chat system with privilege management
- [ ] Basic spectator viewing

### Phase 3: Optimization
- [ ] Viewer proxy implementation
- [ ] Performance testing and scaling
- [ ] Relegation table finalization

### Phase 4: Polish
- [ ] Map rotation system
- [ ] Enhanced social features
- [ ] Deployment automation

---

## Technical Specifications

### Server Requirements
- **Node.js**: Single-threaded game server
- **WebSocket**: Real-time communication
- **Memory**: Player state, match history, handle registry
- **CPU**: Game loop, collision detection, network updates

### Performance Targets (To Be Determined)
- [ ] Target FPS for server-side game loop
- [ ] Maximum concurrent players
- [ ] Network message frequency
- [ ] Viewer proxy scaling limits

---

## Game Technical Specifications

### Rendering & Display
- **Engine**: Native HTML5 Canvas API (no external libraries)
- **Viewport**: Fixed 1024×768 resolution
- **Game Type**: 2D sprite/pixel top-down shooter
- **Map System**: 2D tilemap with multiple scrolling background layers

### Visual Architecture
**Layer Stack** (back to front):
1. **Background Layer 1**: Sparse starmap (slowest parallax scroll)
2. **Background Layer 2**: Sparse starmap (medium parallax scroll) 
3. **Background Layer 3**: Sparse starmap (fastest parallax scroll)
4. **Terrain Layer**: Space-themed obstacles and boundaries
5. **Game Objects**: Ships, projectiles, effects
6. **UI Overlay**: HUD, chat, scores

### Art Direction
- **Style**: Modern pixel art inspired by SubSpace/Continuum
- **Terrain**: Space junk, spaceport panels, pipes, geometric shapes
- **Philosophy**: Clean and minimal - fewer features than original SubSpace
- **Assets**: Tile-based terrain system for consistent collision detection

---

## Decision Points Requiring Testing

1. **Player Capacity**: What's the maximum players per server?
2. **Relegation Scaling**: Final table based on performance testing
3. **Map Dimensions**: Optimal size for different player counts  
4. **Tick Rate**: Server update frequency for smooth gameplay
5. **Viewer Limits**: When do we need viewer proxy vs direct connections?

---

*This document will be updated based on performance testing and MVP development results*
