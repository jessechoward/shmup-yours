/**
 * Frontend Module Index
 * 
 * Main entry point for frontend modules.
 * Provides clean exports for all game systems.
 */

// Map generation and boundary system
export { default as MapSystem } from './map/index.js';
export { 
    MapGenerator, 
    BoundarySystem, 
    TileAssetManager 
} from './map/index.js';

// Example implementations
export { default as MapSystemExample } from './map/MapSystemExample.js';