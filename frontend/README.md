# Shmup-Yours Frontend

Canvas-based frontend for the shmup-yours multiplayer space combat game.

## Architecture

This frontend implements a **5-layer Canvas rendering pipeline** optimized for real-time multiplayer gameplay:

1. **Background Layer 1-3**: Parallax star fields (0.1x, 0.3x, 0.6x scroll rates)
2. **Terrain Layer**: Static obstacles and boundaries (32x32 tile system)
3. **Game Objects Layer**: Ships, projectiles, and effects

## Key Features

- **Fixed 1024x768 viewport** (no scaling/zooming)
- **Pure HTML5 Canvas API** (no external game engines)
- **Efficient parallax scrolling** with different rates per layer
- **World-to-screen coordinate mapping** for seamless physics integration
- **Viewport culling** for optimal performance
- **Object pooling** and lifecycle management

## Quick Start

### Run Demo
```bash
cd frontend/src
python3 -m http.server 8080
# Open http://localhost:8080
```

### Controls
- **WASD**: Manual camera movement
- **Arrow Keys**: Ship movement  
- **Mouse Drag**: Pan camera
- **Space**: Toggle demo on/off

## Architecture Documentation

See [CANVAS_RENDERING_ARCHITECTURE.md](./CANVAS_RENDERING_ARCHITECTURE.md) for complete technical specifications.

## Structure
- **src/**: Source code for the SPA and Canvas rendering system
- **test/**: Frontend tests
- **CANVAS_RENDERING_ARCHITECTURE.md**: Complete technical documentation

## Integration Points

- **Planck.js Physics**: Seamless coordinate system integration
- **WebSocket Updates**: Efficient position serialization
- **Vue.js Components**: UI overlays for chat, HUD, lobby

## Performance Targets

- **60 FPS** consistent rendering
- **100+ simultaneous objects** with culling
- **2-16 players** with minimal performance impact
- **<16ms render time** per frame

## Browser Compatibility

- Chrome 90+
- Firefox 88+ 
- Safari 14+
- Edge 90+

Requires HTML5 Canvas, ES6 modules, and RequestAnimationFrame support.
