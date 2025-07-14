# Map Generation and Boundary System Architecture

## Overview

This document outlines the architecture for the map generation, obstacle placement, and floating boundary system that scales from 2-5 screen areas based on player count. The system uses a tilemap-based approach with space junk obstacles and floating boundaries that prevent infinite drift.

## System Components

### 1. MapGenerator.js
**Purpose**: Procedural generation and scaling of game maps based on player count.

**Key Features**:
- Scalable map dimensions (2-5 screen areas: 2048x1536 to 5120x3840)
- Strategic obstacle placement using space junk theme
- Tilemap-based collision system
- Parallax background layer configuration

**Scaling Algorithm**:
```javascript
// Player count to screen mapping
2-4 players  = 2 screens (2048x1536)
5-8 players  = 3 screens (2560x1920) 
9-12 players = 4 screens (3072x2304)
13+ players  = 5 screens (5120x3840)
```

**Obstacle Density**:
- Low (≤4 players): 15% coverage
- Medium (5-8 players): 25% coverage  
- High (9+ players): 35% coverage

### 2. BoundarySystem.js
**Purpose**: Manages floating boundary mechanics to prevent infinite drift.

**Key Features**:
- Floating boundaries with gradual force application
- Planck.js physics integration
- Visual warning system
- No hard collision walls

**Boundary Physics**:
- Force increases exponentially as players approach boundary
- Configurable force strength and falloff distance
- Sensor-based detection (players can enter boundary zones)
- Smooth physics integration with Planck.js

### 3. TileAssetManager.js
**Purpose**: Manages loading, caching, and rendering of tilemap assets.

**Key Features**:
- Space junk asset management (panels, pipes, debris, hulls)
- Procedural tile generation fallback
- Efficient caching and reuse
- Modern pixel art style

**Asset Types**:
- **Panels**: Metal plating with rivets
- **Pipes**: Industrial pipe segments
- **Debris**: Scattered space junk
- **Hulls**: Ship hull plating

### 4. MapSystem.js
**Purpose**: Main coordinator for all map operations and rendering.

**Key Features**:
- Unified interface for map operations
- Performance optimization with visible tile culling
- Parallax background rendering
- Boundary warning visualization

## Architecture Patterns

### Component Coordination
```
MapSystem (Coordinator)
├── MapGenerator (Procedural generation)
├── BoundarySystem (Physics boundaries) 
└── TileAssetManager (Asset management)
```

### Data Flow
1. **Generation**: MapGenerator creates map configuration
2. **Physics Setup**: BoundarySystem initializes physics bodies
3. **Asset Loading**: TileAssetManager loads/generates tiles
4. **Rendering**: MapSystem coordinates efficient rendering
5. **Updates**: BoundarySystem applies forces each frame

## Technical Specifications

### Map Dimensions
- **Base Screen**: 1024×768 pixels
- **Tile Size**: 32×32 pixels
- **Aspect Ratio**: 4:3 maintained across all sizes
- **Tile Alignment**: All dimensions rounded to tile boundaries

### Physics Integration
- **Engine**: Planck.js for consistent simulation
- **Boundaries**: Sensor bodies (no collision, force only)
- **Obstacles**: Static collision bodies from tilemap
- **Force Application**: Applied each physics tick

### Performance Optimizations
- **Visible Tile Culling**: Only render tiles in viewport
- **Asset Caching**: Reuse loaded/generated tiles
- **Parallax Layers**: Efficient star field rendering
- **Viewport Updates**: Only recalculate when camera moves significantly

## Scaling Algorithms

### Map Size Calculation
```javascript
// Calculate total area based on player count
const baseArea = 1024 * 768; // Base screen area
const totalArea = baseArea * screenCount;
const aspectRatio = 4/3;

// Maintain aspect ratio
const width = Math.sqrt(totalArea * aspectRatio);
const height = Math.sqrt(totalArea / aspectRatio);

// Round to tile boundaries
const tiledWidth = Math.ceil(width / TILE_SIZE) * TILE_SIZE;
const tiledHeight = Math.ceil(height / TILE_SIZE) * TILE_SIZE;
```

### Obstacle Placement Strategy
1. **Density Calculation**: Based on player count and map size
2. **Cluster Generation**: Strategic cover placement
3. **Shape Variety**: L-shaped, linear, and compact formations
4. **No Safe Zones**: Ensures constant engagement potential

### Boundary Force Calculation
```javascript
// Force increases quadratically as player approaches boundary
const normalizedDistance = distance / FORCE_FALLOFF_DISTANCE;
const forceStrength = (1 - normalizedDistance) * (1 - normalizedDistance);
const appliedForce = maxForce * forceStrength;
```

## Integration Points

### With Physics System (Planck.js)
- Static bodies for obstacle collision
- Sensor bodies for boundary detection
- Force application for boundary pushback
- Contact listener for boundary events

### With Rendering System (Canvas)
- Tilemap rendering with visible tile culling
- Parallax background layers
- Boundary warning visualization
- Efficient asset management

### With Game State
- Player count-based map generation
- Real-time boundary force updates
- Collision detection for gameplay
- Performance metrics tracking

## Configuration

### Boundary Parameters
```javascript
BOUNDARY_WIDTH: 64,        // Thickness of boundary zone
BOUNDARY_FORCE: 500,       // Maximum force applied
FORCE_FALLOFF_DISTANCE: 32, // Distance over which force falls off
VISUAL_WARNING_DISTANCE: 64 // Distance for visual warnings
```

### Obstacle Parameters
```javascript
OBSTACLE_DENSITY: {
    LOW: 0.15,    // 15% map coverage
    MEDIUM: 0.25, // 25% map coverage  
    HIGH: 0.35    // 35% map coverage
}
```

### Performance Parameters
```javascript
TILE_SIZE: 32,            // Consistent tile dimensions
MIN_SCREENS: 2,           // Minimum map size
MAX_SCREENS: 5,           // Maximum map size
VIEWPORT_UPDATE_THRESHOLD: 50 // Pixel threshold for viewport updates
```

## Testing Strategy

### Unit Tests
- Map generation with different player counts
- Boundary force calculations
- Asset loading and fallback generation
- Tile collision detection

### Integration Tests
- Physics body creation and cleanup
- Boundary force application
- Asset manager initialization
- Map system coordination

### Performance Tests
- Rendering performance with different map sizes
- Memory usage with asset caching
- Physics simulation overhead
- Viewport culling effectiveness

## Future Enhancements

### Procedural Map Rotation
- Multiple map layouts per session
- Rotation between matches
- Map voting system

### Advanced Obstacle Patterns
- More complex strategic formations
- Dynamic obstacle positioning
- Environmental hazards

### Enhanced Visual Effects
- Animated boundary warnings
- Particle effects for boundaries
- Dynamic lighting on obstacles

## Dependencies

### Required Systems
- **Issue #17**: Planck.js physics integration
- **Issue #18**: Canvas rendering pipeline
- HTML5 Canvas API support
- ES6 module system

### Asset Dependencies
- Space junk tile assets (optional - fallback generation available)
- Modern pixel art style guide
- 32×32 tile dimensions standard

## Performance Characteristics

### Memory Usage
- **Tilemap**: O(width × height) for grid storage
- **Assets**: O(1) per tile type with caching
- **Physics**: O(1) per boundary + O(obstacles)

### CPU Usage
- **Generation**: One-time cost per map
- **Rendering**: O(visible tiles) per frame
- **Physics**: O(players) per physics tick
- **Updates**: Minimal overhead with optimization

This architecture provides a scalable, efficient, and maintainable foundation for the map generation and boundary system while meeting all the specified requirements.