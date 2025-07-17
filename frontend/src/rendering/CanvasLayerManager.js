/**
 * Canvas Layer Manager - Core rendering pipeline for 5-layer system
 * 
 * Manages the 5 distinct rendering layers:
 * 1. Background Layer 1 (Slowest parallax stars)
 * 2. Background Layer 2 (Medium parallax stars) 
 * 3. Background Layer 3 (Fastest parallax stars)
 * 4. Terrain Layer (Static obstacles and boundaries)
 * 5. Game Objects Layer (Ships, projectiles, effects)
 */
export class CanvasLayerManager {
    /**
     * Initialize the layer manager with fixed 1024x768 viewport
     */
    constructor() {
        this.VIEWPORT_WIDTH = 1024;
        this.VIEWPORT_HEIGHT = 768;
        
        // Get all canvas layers
        this.layers = {
            background1: {
                canvas: document.getElementById('backgroundLayer1'),
                context: null,
                scrollRate: 0.1, // Slowest parallax
                lastRender: 0
            },
            background2: {
                canvas: document.getElementById('backgroundLayer2'),
                context: null,
                scrollRate: 0.3, // Medium parallax
                lastRender: 0
            },
            background3: {
                canvas: document.getElementById('backgroundLayer3'),
                context: null,
                scrollRate: 0.6, // Fastest parallax
                lastRender: 0
            },
            terrain: {
                canvas: document.getElementById('terrainLayer'),
                context: null,
                scrollRate: 1.0, // No parallax - moves with world
                lastRender: 0
            },
            gameObjects: {
                canvas: document.getElementById('gameObjectsLayer'),
                context: null,
                scrollRate: 1.0, // No parallax - moves with world
                lastRender: 0
            }
        };
        
        this.initializeContexts();
        
        // Performance tracking
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.fps = 60;
        
        // Camera/world position
        this.cameraX = 0;
        this.cameraY = 0;
    }
    
    /**
     * Initialize 2D contexts for all layers
     */
    initializeContexts() {
        for (const [layerName, layer] of Object.entries(this.layers)) {
            if (!layer.canvas) {
                throw new Error(`Canvas element not found for layer: ${layerName}`);
            }
            
            layer.context = layer.canvas.getContext('2d');
            
            // Set optimal rendering settings
            layer.context.imageSmoothingEnabled = false; // Pixel-perfect rendering
            layer.context.textBaseline = 'top';
        }
    }
    
    /**
     * Clear a specific layer
     * @param {string} layerName - Name of the layer to clear
     */
    clearLayer(layerName) {
        const layer = this.layers[layerName];
        if (layer && layer.context) {
            layer.context.clearRect(0, 0, this.VIEWPORT_WIDTH, this.VIEWPORT_HEIGHT);
        }
    }
    
    /**
     * Clear all layers
     */
    clearAllLayers() {
        for (const layerName of Object.keys(this.layers)) {
            this.clearLayer(layerName);
        }
    }
    
    /**
     * Get the 2D context for a specific layer
     * @param {string} layerName - Name of the layer
     * @returns {CanvasRenderingContext2D} The 2D context
     */
    getLayerContext(layerName) {
        return this.layers[layerName]?.context;
    }
    
    /**
     * Update camera position for viewport management
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     */
    setCameraPosition(x, y) {
        this.cameraX = x;
        this.cameraY = y;
    }
    
    /**
     * Get current camera position
     * @returns {{x: number, y: number}} Camera position
     */
    getCameraPosition() {
        return { x: this.cameraX, y: this.cameraY };
    }
    
    /**
     * Get parallax offset for a specific layer
     * @param {string} layerName - Name of the layer
     * @returns {{x: number, y: number}} Parallax offset
     */
    getParallaxOffset(layerName) {
        const layer = this.layers[layerName];
        if (!layer) return { x: 0, y: 0 };
        
        return {
            x: this.cameraX * layer.scrollRate,
            y: this.cameraY * layer.scrollRate
        };
    }
    
    /**
     * Update performance metrics
     * @param {number} currentTime - Current timestamp
     */
    updatePerformanceMetrics(currentTime) {
        if (currentTime - this.lastFrameTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFrameTime = currentTime;
        }
        this.frameCount++;
    }
    
    /**
     * Get current performance metrics
     * @returns {{fps: number, frameCount: number}}
     */
    getPerformanceMetrics() {
        return {
            fps: this.fps,
            frameCount: this.frameCount
        };
    }
    
    /**
     * Check if a layer needs to be redrawn based on camera movement
     * @param {string} layerName - Name of the layer
     * @param {number} threshold - Movement threshold to trigger redraw
     * @returns {boolean} True if layer needs redraw
     */
    layerNeedsRedraw(layerName, threshold = 1) {
        const layer = this.layers[layerName];
        if (!layer) return false;
        
        const offset = this.getParallaxOffset(layerName);
        const movement = Math.abs(offset.x - layer.lastRender) + Math.abs(offset.y - layer.lastRender);
        
        return movement >= threshold;
    }
    
    /**
     * Mark a layer as rendered at current position
     * @param {string} layerName - Name of the layer
     */
    markLayerRendered(layerName) {
        const layer = this.layers[layerName];
        if (layer) {
            const offset = this.getParallaxOffset(layerName);
            layer.lastRender = offset.x + offset.y;
        }
    }
    
    /**
     * Get viewport bounds in world coordinates
     * @returns {{left: number, top: number, right: number, bottom: number}}
     */
    getViewportBounds() {
        // Camera position is top-left offset, so bounds are straightforward
        return {
            left: this.cameraX,
            top: this.cameraY,
            right: this.cameraX + this.VIEWPORT_WIDTH,
            bottom: this.cameraY + this.VIEWPORT_HEIGHT
        };
    }
    
    /**
     * Check if a world coordinate is visible in viewport
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @param {number} margin - Additional margin for culling
     * @returns {boolean} True if coordinate is visible
     */
    isInViewport(worldX, worldY, margin = 0) {
        const bounds = this.getViewportBounds();
        return worldX >= bounds.left - margin &&
               worldX <= bounds.right + margin &&
               worldY >= bounds.top - margin &&
               worldY <= bounds.bottom + margin;
    }
}