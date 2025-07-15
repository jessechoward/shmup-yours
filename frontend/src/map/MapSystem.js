/**
 * MapSystem.js
 * 
 * Main coordinator for map generation, boundaries, and asset management.
 * Provides unified interface for map operations and rendering.
 * 
 * Design Philosophy:
 * - Single entry point for all map operations
 * - Coordinates MapGenerator, BoundarySystem, and TileAssetManager
 * - Handles map lifecycle and state management
 * - Provides efficient rendering interface
 */

import MapGenerator from './MapGenerator.js';
import BoundarySystem from './BoundarySystem.js';
import TileAssetManager from './TileAssetManager.js';

class MapSystem {
    constructor(physicsWorld) {
        this.physicsWorld = physicsWorld;
        
        // Component systems
        this.mapGenerator = new MapGenerator();
        this.boundarySystem = new BoundarySystem(physicsWorld);
        this.assetManager = new TileAssetManager();
        
        // Current map state
        this.currentMap = null;
        this.isInitialized = false;
        this.isReady = false;
        
        // Rendering optimization
        this.visibleTiles = new Map();
        this.lastViewport = null;
        this.tileRenderCache = new Map();
        
        // Performance metrics
        this.metrics = {
            generationTime: 0,
            renderTime: 0,
            tileCount: 0,
            lastUpdate: 0
        };
    }
    
    /**
     * Initialize map system
     * @returns {Promise} Promise that resolves when system is ready
     */
    async initialize() {
        try {
            // Initialize asset manager first
            await this.assetManager.initialize();
            this.isInitialized = true;
            this.isReady = true;
            
            return Promise.resolve();
        } catch (error) {
            console.error('Failed to initialize map system:', error);
            throw error;
        }
    }
    
    /**
     * Generate new map based on player count
     * @param {number} playerCount - Number of active players
     * @returns {Promise<object>} Generated map configuration
     */
    async generateMap(playerCount) {
        if (!this.isInitialized) {
            throw new Error('MapSystem not initialized. Call initialize() first.');
        }
        
        const startTime = performance.now();
        
        try {
            // Generate map configuration
            this.currentMap = this.mapGenerator.generateMap(playerCount);
            
            // Initialize boundary system with new map
            this.boundarySystem.initialize(this.currentMap.boundaries);
            
            // Clear render cache for new map
            this.clearRenderCache();
            
            // Update metrics
            this.metrics.generationTime = performance.now() - startTime;
            this.metrics.tileCount = this.currentMap.obstacles.length;
            this.metrics.lastUpdate = Date.now();
            
            return this.currentMap;
        } catch (error) {
            console.error('Failed to generate map:', error);
            throw error;
        }
    }
    
    /**
     * Update map system each frame
     * @param {Array} players - Array of player objects
     * @param {object} viewport - Current viewport {x, y, width, height}
     */
    update(players, viewport) {
        if (!this.currentMap) return;
        
        // Update boundary forces
        this.boundarySystem.update(players);
        
        // Update visible tiles for rendering optimization
        this.updateVisibleTiles(viewport);
    }
    
    /**
     * Render map to canvas context
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     * @param {object} viewport - Current viewport {x, y, width, height}
     * @param {object} camera - Camera transform {x, y, scale}
     */
    render(ctx, viewport, camera) {
        if (!this.currentMap || !this.assetManager.isReady()) return;
        
        const startTime = performance.now();
        
        try {
            // Save context state
            ctx.save();
            
            // Apply camera transform
            ctx.translate(-camera.x, -camera.y);
            ctx.scale(camera.scale, camera.scale);
            
            // Render background layers (parallax)
            this.renderBackgroundLayers(ctx, viewport, camera);
            
            // Render terrain tilemap
            this.renderTilemap(ctx, viewport, camera);
            
            // Render boundary warnings (if any players are near boundaries)
            this.renderBoundaryWarnings(ctx, viewport, camera);
            
            // Restore context state
            ctx.restore();
            
            // Update metrics
            this.metrics.renderTime = performance.now() - startTime;
        } catch (error) {
            console.error('Map rendering error:', error);
            ctx.restore(); // Ensure context is restored even on error
        }
    }
    
    /**
     * Render parallax background layers
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} viewport - Current viewport
     * @param {object} camera - Camera transform
     */
    renderBackgroundLayers(ctx, viewport, camera) {
        this.currentMap.backgroundLayers.forEach(layer => {
            // Calculate parallax offset
            const parallaxX = camera.x * layer.parallaxX;
            const parallaxY = camera.y * layer.parallaxY;
            
            // Render stars for this layer
            this.renderStarLayer(ctx, layer, parallaxX, parallaxY, viewport);
        });
    }
    
    /**
     * Render a star background layer
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} layer - Layer configuration
     * @param {number} offsetX - Parallax X offset
     * @param {number} offsetY - Parallax Y offset
     * @param {object} viewport - Current viewport
     */
    renderStarLayer(ctx, layer, offsetX, offsetY, viewport) {
        ctx.fillStyle = this.getStarColor(layer.density);
        
        // Generate deterministic star positions based on layer ID
        const seed = this.hashString(layer.id);
        const rng = this.seededRandom(seed);
        
        for (let i = 0; i < layer.starCount; i++) {
            const x = (rng() * this.currentMap.dimensions.width * 2) - offsetX;
            const y = (rng() * this.currentMap.dimensions.height * 2) - offsetY;
            
            // Only render stars within viewport (with some margin)
            if (x >= viewport.x - 50 && x <= viewport.x + viewport.width + 50 &&
                y >= viewport.y - 50 && y <= viewport.y + viewport.height + 50) {
                
                const size = layer.density === 'sparse' ? 1 : layer.density === 'medium' ? 1.5 : 2;
                ctx.fillRect(x, y, size, size);
            }
        }
    }
    
    /**
     * Render terrain tilemap
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} viewport - Current viewport
     * @param {object} camera - Camera transform
     */
    renderTilemap(ctx, viewport, camera) {
        const tilemap = this.currentMap.tilemap;
        const tileSize = tilemap.tileSize;
        
        // Calculate visible tile range
        const startX = Math.max(0, Math.floor((viewport.x) / tileSize));
        const endX = Math.min(tilemap.width - 1, Math.ceil((viewport.x + viewport.width) / tileSize));
        const startY = Math.max(0, Math.floor((viewport.y) / tileSize));
        const endY = Math.min(tilemap.height - 1, Math.ceil((viewport.y + viewport.height) / tileSize));
        
        // Render visible tiles
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tileId = tilemap.grid[y][x];
                if (tileId === 0) continue; // Skip empty tiles
                
                const tileAsset = this.assetManager.getTile(tileId);
                if (tileAsset) {
                    ctx.drawImage(
                        tileAsset,
                        x * tileSize,
                        y * tileSize,
                        tileSize,
                        tileSize
                    );
                }
            }
        }
    }
    
    /**
     * Render boundary warning effects
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {object} viewport - Current viewport
     * @param {object} camera - Camera transform
     */
    renderBoundaryWarnings(ctx, viewport, camera) {
        const boundaryData = this.boundarySystem.getBoundaryData();
        
        boundaryData.forEach(boundary => {
            // Only render warnings that are visible
            if (this.isRectVisible(boundary.visualWarningZone, viewport)) {
                ctx.strokeStyle = 'rgba(255, 100, 100, 0.3)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                
                ctx.strokeRect(
                    boundary.visualWarningZone.x,
                    boundary.visualWarningZone.y,
                    boundary.visualWarningZone.width,
                    boundary.visualWarningZone.height
                );
                
                ctx.setLineDash([]); // Reset line dash
            }
        });
    }
    
    /**
     * Update visible tiles for rendering optimization
     * @param {object} viewport - Current viewport
     */
    updateVisibleTiles(viewport) {
        if (!this.currentMap) return;
        
        // Only update if viewport changed significantly
        if (this.lastViewport && 
            Math.abs(viewport.x - this.lastViewport.x) < 50 &&
            Math.abs(viewport.y - this.lastViewport.y) < 50) {
            return;
        }
        
        this.visibleTiles.clear();
        const tilemap = this.currentMap.tilemap;
        const tileSize = tilemap.tileSize;
        
        // Calculate visible tile range with buffer
        const buffer = tileSize * 2;
        const startX = Math.max(0, Math.floor((viewport.x - buffer) / tileSize));
        const endX = Math.min(tilemap.width - 1, Math.ceil((viewport.x + viewport.width + buffer) / tileSize));
        const startY = Math.max(0, Math.floor((viewport.y - buffer) / tileSize));
        const endY = Math.min(tilemap.height - 1, Math.ceil((viewport.y + viewport.height + buffer) / tileSize));
        
        // Store visible tiles
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tileId = tilemap.grid[y][x];
                if (tileId !== 0) {
                    this.visibleTiles.set(`${x},${y}`, { x, y, tileId });
                }
            }
        }
        
        this.lastViewport = { ...viewport };
    }
    
    /**
     * Get map configuration for physics integration
     * @returns {object} Map configuration for physics
     */
    getPhysicsConfiguration() {
        if (!this.currentMap) return null;
        
        return {
            dimensions: this.currentMap.dimensions,
            obstacles: this.currentMap.obstacles,
            boundaries: this.currentMap.boundaries,
            tilemap: this.currentMap.tilemap
        };
    }
    
    /**
     * Check if position has collision
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @returns {boolean} True if position has collision
     */
    hasCollisionAt(x, y) {
        if (!this.currentMap) return false;
        
        const tilemap = this.currentMap.tilemap;
        const tileX = Math.floor(x / tilemap.tileSize);
        const tileY = Math.floor(y / tilemap.tileSize);
        
        if (tileX < 0 || tileX >= tilemap.width || tileY < 0 || tileY >= tilemap.height) {
            return false;
        }
        
        return tilemap.grid[tileY][tileX] !== 0;
    }
    
    /**
     * Get star color based on layer density
     * @param {string} density - Layer density
     * @returns {string} Star color
     */
    getStarColor(density) {
        switch (density) {
        case 'sparse': return '#ffffff';
        case 'medium': return '#e2e8f0';
        case 'dense': return '#cbd5e0';
        default: return '#ffffff';
        }
    }
    
    /**
     * Simple string hash function
     * @param {string} str - String to hash
     * @returns {number} Hash value
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    /**
     * Seeded random number generator
     * @param {number} seed - Random seed
     * @returns {Function} Random function
     */
    seededRandom(seed) {
        let x = Math.sin(seed) * 10000;
        return function() {
            x = Math.sin(++seed) * 10000;
            return x - Math.floor(x);
        };
    }
    
    /**
     * Check if rectangle is visible in viewport
     * @param {object} rect - Rectangle {x, y, width, height}
     * @param {object} viewport - Viewport {x, y, width, height}
     * @returns {boolean} True if rectangle is visible
     */
    isRectVisible(rect, viewport) {
        return !(rect.x + rect.width < viewport.x ||
                rect.x > viewport.x + viewport.width ||
                rect.y + rect.height < viewport.y ||
                rect.y > viewport.y + viewport.height);
    }
    
    /**
     * Clear render cache
     */
    clearRenderCache() {
        this.visibleTiles.clear();
        this.tileRenderCache.clear();
        this.lastViewport = null;
    }
    
    /**
     * Get performance metrics
     * @returns {object} Performance metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }
    
    /**
     * Cleanup map system
     */
    cleanup() {
        if (this.boundarySystem) {
            this.boundarySystem.cleanup();
        }
        
        if (this.assetManager) {
            this.assetManager.cleanup();
        }
        
        this.clearRenderCache();
        this.currentMap = null;
        this.isInitialized = false;
        this.isReady = false;
    }
}

export default MapSystem;