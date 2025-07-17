/**
 * Parallax Renderer - Handles the 3 background star layers with different scroll rates
 * 
 * Creates depth illusion through different scrolling speeds:
 * - Layer 1: Slowest (0.1x) - Distant stars
 * - Layer 2: Medium (0.3x) - Mid-distance stars  
 * - Layer 3: Fastest (0.6x) - Near stars
 */
export class ParallaxRenderer {
    /**
     * Initialize parallax renderer
     * @param {CanvasLayerManager} layerManager - Canvas layer manager instance
     * @param {CoordinateSystem} coordinateSystem - Coordinate system instance
     */
    constructor(layerManager, coordinateSystem) {
        this.layerManager = layerManager;
        this.coordinateSystem = coordinateSystem;
        
        // Star field configurations for each background layer
        this.layers = {
            background1: {
                stars: [],
                scrollRate: 0.1,
                starCount: 50,
                starSizes: [1, 2],
                starColors: ['#ccc', '#fff'],
                density: 0.3 // Sparse
            },
            background2: {
                stars: [],
                scrollRate: 0.3,
                starCount: 80,
                starSizes: [1, 2, 3],
                starColors: ['#ddd', '#fff', '#ffffaa'],
                density: 0.5 // Medium
            },
            background3: {
                stars: [],
                scrollRate: 0.6,
                starCount: 120,
                starSizes: [2, 3, 4],
                starColors: ['#fff', '#ffffaa', '#aaffff'],
                density: 0.7 // Dense
            }
        };
        
        this.generateStarFields();
    }
    
    /**
     * Generate star fields for all background layers
     */
    generateStarFields() {
        const worldBounds = this.coordinateSystem.getWorldBounds();
        
        for (const [layerName, config] of Object.entries(this.layers)) {
            config.stars = this.generateStars(
                config.starCount,
                config.starSizes,
                config.starColors,
                worldBounds.width * 2, // Generate larger field for parallax
                worldBounds.height * 2
            );
        }
    }
    
    /**
     * Generate stars for a specific layer
     * @param {number} count - Number of stars to generate
     * @param {number[]} sizes - Array of possible star sizes
     * @param {string[]} colors - Array of possible star colors
     * @param {number} fieldWidth - Width of star field
     * @param {number} fieldHeight - Height of star field
     * @returns {Array} Array of star objects
     */
    generateStars(count, sizes, colors, fieldWidth, fieldHeight) {
        const stars = [];
        
        for (let i = 0; i < count; i++) {
            const star = {
                x: Math.random() * fieldWidth - fieldWidth / 4,
                y: Math.random() * fieldHeight - fieldHeight / 4,
                size: sizes[Math.floor(Math.random() * sizes.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: 0.3 + Math.random() * 0.7, // Varying brightness
                twinkle: Math.random() * Math.PI * 2 // For animation
            };
            stars.push(star);
        }
        
        return stars;
    }
    
    /**
     * Render a specific background layer
     * @param {string} layerName - Name of the layer to render
     * @param {number} deltaTime - Time since last frame (for animations)
     */
    renderLayer(layerName, deltaTime = 0) {
        const layer = this.layers[layerName];
        if (!layer) {
            console.warn(`Parallax layer not found: ${layerName}`);
            return;
        }
        
        const context = this.layerManager.getLayerContext(layerName);
        if (!context) {
            console.warn(`Canvas context not found for layer: ${layerName}`);
            return;
        }
        
        // Clear the layer
        this.layerManager.clearLayer(layerName);
        
        // Get parallax offset
        const offset = this.coordinateSystem.getParallaxOffset(layer.scrollRate);
        const viewportBounds = this.coordinateSystem.getViewportBounds();
        
        // Render stars
        for (const star of layer.stars) {
            const screenPos = this.coordinateSystem.worldToScreenParallax(
                star.x, star.y, layer.scrollRate
            );
            
            // Only render stars that are visible (with margin for smooth scrolling)
            if (this.isStarVisible(screenPos.x, screenPos.y, star.size)) {
                this.renderStar(context, screenPos.x, screenPos.y, star, deltaTime);
            }
        }
    }
    
    /**
     * Check if a star is visible on screen
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @param {number} size - Star size
     * @returns {boolean} True if star is visible
     */
    isStarVisible(screenX, screenY, size) {
        const margin = size + 10; // Small margin for smooth appearance
        return screenX >= -margin &&
               screenX <= this.layerManager.VIEWPORT_WIDTH + margin &&
               screenY >= -margin &&
               screenY <= this.layerManager.VIEWPORT_HEIGHT + margin;
    }
    
    /**
     * Render a single star
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {number} x - Screen X coordinate
     * @param {number} y - Screen Y coordinate
     * @param {object} star - Star object
     * @param {number} deltaTime - Time since last frame
     */
    renderStar(context, x, y, star, deltaTime) {
        context.save();
        
        // Animate twinkle effect
        star.twinkle += deltaTime * 0.002;
        const twinkleIntensity = (Math.sin(star.twinkle) + 1) * 0.5;
        const alpha = star.opacity * (0.7 + twinkleIntensity * 0.3);
        
        context.globalAlpha = alpha;
        context.fillStyle = star.color;
        
        // Draw star based on size
        if (star.size <= 2) {
            // Small stars - just pixels
            context.fillRect(Math.floor(x), Math.floor(y), star.size, star.size);
        } else {
            // Larger stars - draw as plus signs
            const halfSize = Math.floor(star.size / 2);
            
            // Horizontal line
            context.fillRect(
                Math.floor(x - halfSize), 
                Math.floor(y), 
                star.size, 
                1
            );
            
            // Vertical line
            context.fillRect(
                Math.floor(x), 
                Math.floor(y - halfSize), 
                1, 
                star.size
            );
        }
        
        context.restore();
    }
    
    /**
     * Render all background layers
     * @param {number} deltaTime - Time since last frame
     */
    renderAllLayers(deltaTime = 0) {
        this.renderLayer('background1', deltaTime);
        this.renderLayer('background2', deltaTime);
        this.renderLayer('background3', deltaTime);
    }
    
    /**
     * Update star field when world bounds change
     * @param {number} worldWidth - New world width
     * @param {number} worldHeight - New world height
     */
    updateWorldBounds(worldWidth, worldHeight) {
        // Regenerate star fields for new world size
        for (const [layerName, config] of Object.entries(this.layers)) {
            config.stars = this.generateStars(
                config.starCount,
                config.starSizes,
                config.starColors,
                worldWidth * 2,
                worldHeight * 2
            );
        }
    }
    
    /**
     * Get configuration for a specific layer
     * @param {string} layerName - Name of the layer
     * @returns {object} Layer configuration
     */
    getLayerConfig(layerName) {
        return this.layers[layerName];
    }
    
    /**
     * Update layer configuration
     * @param {string} layerName - Name of the layer
     * @param {object} config - New configuration
     */
    updateLayerConfig(layerName, config) {
        if (this.layers[layerName]) {
            Object.assign(this.layers[layerName], config);
            
            // Regenerate stars if count or other properties changed
            if (config.starCount || config.starSizes || config.starColors) {
                const worldBounds = this.coordinateSystem.getWorldBounds();
                this.layers[layerName].stars = this.generateStars(
                    this.layers[layerName].starCount,
                    this.layers[layerName].starSizes,
                    this.layers[layerName].starColors,
                    worldBounds.width * 2,
                    worldBounds.height * 2
                );
            }
        }
    }
}