# Canvas 5-Layer Rendering Pipeline Architecture

## Overview

This document defines the HTML5 Canvas rendering architecture for the shmup-yours game, implementing a 5-layer rendering system optimized for a fixed 1024x768 viewport with efficient parallax scrolling and coordinate system management.

## Architecture Decision

**Selected Approach**: Multi-canvas layered architecture with independent 2D contexts per layer.

**Rationale**: 
- Provides optimal performance through selective layer rendering
- Enables efficient parallax scrolling with different rates per layer
- Allows independent optimization strategies per layer type
- Maintains clean separation of concerns
- Integrates seamlessly with Planck.js coordinate system

## Layer Structure

### Layer 1-3: Parallax Background Layers
- **Purpose**: Create depth illusion through differential scrolling
- **Layer 1**: Distant stars (0.1x scroll rate) - Slowest movement
- **Layer 2**: Mid-distance stars (0.3x scroll rate) - Medium movement  
- **Layer 3**: Near stars (0.6x scroll rate) - Fastest movement
- **Content**: Sparse star fields with varying sizes and brightness
- **Optimization**: Only redraws when camera movement exceeds threshold

### Layer 4: Terrain Layer
- **Purpose**: Static obstacles and world boundaries
- **Content**: Space junk, obstacles, spaceport panels, pipes
- **System**: 32x32 pixel tile-based rendering
- **Scroll Rate**: 1.0x (moves with world, no parallax)
- **Optimization**: Viewport culling - only renders visible tiles

### Layer 5: Game Objects Layer
- **Purpose**: Dynamic game elements
- **Content**: Ships, projectiles, effects, pickups
- **Scroll Rate**: 1.0x (moves with world, no parallax)
- **Optimization**: Object culling, pooling, and LOD management

## Coordinate System

### World vs Viewport Coordinates

```javascript
// World Coordinates: Absolute position in game world
worldX = 2048, worldY = 1536

// Screen Coordinates: Position on 1024x768 viewport
screenX = worldX - cameraX + viewportWidth/2
screenY = worldY - cameraY + viewportHeight/2
```

### Key Specifications
- **Viewport**: Fixed 1024x768 pixels (no scaling/zooming)
- **World Size**: Configurable 2048x1536 to 5120x3840 pixels
- **Camera Bounds**: Clamped to keep viewport within world boundaries
- **Parallax Calculation**: `offset = cameraPosition × layerScrollRate`

## Performance Optimizations

### Viewport Culling
- Objects outside viewport (plus margin) are not rendered
- Tiles outside visible area are skipped
- Reduces rendering calls by 70-90% in typical scenarios

### Layer Management
- **Selective Rendering**: Only redraw layers when necessary
- **Movement Thresholds**: Background layers skip frames for small movements
- **Context Caching**: 2D contexts initialized once and reused

### Object Pooling
- Game objects managed in categorized pools
- Expired objects removed automatically
- Memory allocation minimized through reuse

## Integration Points

### Planck.js Physics
- World coordinates align with physics simulation
- Seamless conversion between rendering and physics systems
- Fixed timestep coordination for deterministic behavior

### WebSocket Updates
- Efficient serialization of world positions
- Delta compression for position updates
- Client-side prediction with server reconciliation

## Implementation Components

### Core Classes

1. **CanvasLayerManager**
   - Manages 5 canvas elements and their 2D contexts
   - Handles layer clearing and context state
   - Provides performance metrics and viewport management

2. **CoordinateSystem**
   - World-to-screen coordinate conversion
   - Camera position management with bounds checking
   - Parallax offset calculations
   - Viewport intersection testing

3. **ParallaxRenderer**
   - Manages 3 background star field layers
   - Implements differential scrolling rates
   - Handles star generation and animation
   - Optimizes rendering through visibility culling

4. **TerrainRenderer**
   - Tile-based rendering system (32x32 tiles)
   - Collision detection integration
   - Dynamic tilemap generation
   - Viewport-based tile culling

5. **GameObjectRenderer**
   - Dynamic object rendering and management
   - Object pooling and lifecycle management
   - Shape-based rendering (triangles, circles, effects)
   - Animation and effect systems

## Rendering Pipeline

### Frame Render Sequence
1. **Clear all layers** (if necessary)
2. **Render Background Layer 1** (parallax 0.1x)
3. **Render Background Layer 2** (parallax 0.3x)
4. **Render Background Layer 3** (parallax 0.6x)
5. **Render Terrain Layer** (static obstacles)
6. **Render Game Objects Layer** (ships, projectiles, effects)
7. **Update performance metrics**

### Performance Targets
- **Target FPS**: 60 FPS consistently
- **Render Time**: <16ms per frame
- **Object Capacity**: 100+ simultaneous objects
- **Player Capacity**: 2-16 players with minimal impact

## Layer Configuration

### HTML Structure
```html
<div id="gameContainer">
  <canvas id="backgroundLayer1" class="canvas-layer" width="1024" height="768"></canvas>
  <canvas id="backgroundLayer2" class="canvas-layer" width="1024" height="768"></canvas>
  <canvas id="backgroundLayer3" class="canvas-layer" width="1024" height="768"></canvas>
  <canvas id="terrainLayer" class="canvas-layer" width="1024" height="768"></canvas>
  <canvas id="gameObjectsLayer" class="canvas-layer" width="1024" height="768"></canvas>
</div>
```

### CSS Layering
```css
.canvas-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 1024px;
  height: 768px;
}
```

## Usage Example

```javascript
// Initialize rendering system
const layerManager = new CanvasLayerManager();
const coordinateSystem = new CoordinateSystem();
const parallaxRenderer = new ParallaxRenderer(layerManager, coordinateSystem);
const terrainRenderer = new TerrainRenderer(layerManager, coordinateSystem);
const gameObjectRenderer = new GameObjectRenderer(layerManager, coordinateSystem);

// Render frame
function renderFrame(deltaTime) {
  parallaxRenderer.renderAllLayers(deltaTime);
  terrainRenderer.render();
  gameObjectRenderer.render(deltaTime);
  layerManager.updatePerformanceMetrics(performance.now());
}
```

## Testing and Validation

### Performance Metrics
- **FPS Monitoring**: Real-time frame rate tracking
- **Object Counts**: Rendered vs culled object statistics
- **Layer Render Times**: Individual layer performance profiling

### Visual Validation
- **Parallax Effect**: Different scroll rates create depth perception
- **Coordinate Accuracy**: Objects maintain correct world positions
- **Culling Verification**: Objects appear/disappear at viewport edges

## Browser Compatibility

### Requirements
- **HTML5 Canvas**: 2D context support
- **ES6 Modules**: Import/export syntax
- **RequestAnimationFrame**: Smooth animation loop
- **Performance.now()**: High-resolution timing

### Tested Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Considerations

### Scalability
- WebGL migration path for 3D effects
- Web Workers for background processing
- Canvas texture atlasing for sprites
- Level-of-detail (LOD) system expansion

### Optimization Opportunities
- Dirty rectangle rendering
- Canvas texture caching
- Batch rendering for similar objects
- Predictive culling based on movement

---

*This architecture provides the foundation for efficient, scalable Canvas rendering while maintaining the simplicity and performance required for real-time multiplayer gameplay.*