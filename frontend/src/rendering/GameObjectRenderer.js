/**
 * Game Object Renderer - Handles ships, projectiles, and effects (Layer 5)
 * 
 * Renders dynamic game objects with proper world-to-screen coordinate mapping
 * and performance optimizations for potentially large numbers of objects
 */
export class GameObjectRenderer {
    /**
     * Initialize game object renderer
     * @param {CanvasLayerManager} layerManager - Canvas layer manager instance
     * @param {CoordinateSystem} coordinateSystem - Coordinate system instance
     */
    constructor(layerManager, coordinateSystem) {
        this.layerManager = layerManager;
        this.coordinateSystem = coordinateSystem;
        
        // Object pools for different game object types
        this.gameObjects = {
            ships: [],
            projectiles: [],
            effects: [],
            pickups: []
        };
        
        // Object type configurations
        this.objectTypes = {
            SHIP_PLAYER: {
                color: '#00ff00',
                size: 12,
                shape: 'triangle'
            },
            SHIP_ENEMY: {
                color: '#ff0000',
                size: 12,
                shape: 'triangle'
            },
            PROJECTILE_BULLET: {
                color: '#ffff00',
                size: 3,
                shape: 'circle'
            },
            PROJECTILE_MISSILE: {
                color: '#ff8800',
                size: 5,
                shape: 'rectangle'
            },
            EFFECT_EXPLOSION: {
                color: '#ff4400',
                size: 20,
                shape: 'explosion'
            },
            EFFECT_THRUST: {
                color: '#4488ff',
                size: 8,
                shape: 'thrust'
            },
            PICKUP_HEALTH: {
                color: '#44ff44',
                size: 8,
                shape: 'plus'
            }
        };
        
        // Animation frame for effects
        this.animationFrame = 0;
        
        // Performance tracking
        this.renderedObjects = 0;
        this.culledObjects = 0;
    }
    
    /**
     * Add a game object to the renderer
     * @param {string} category - Object category (ships, projectiles, effects, pickups)
     * @param {object} object - Game object with position, type, and properties
     */
    addObject(category, object) {
        if (this.gameObjects[category]) {
            this.gameObjects[category].push(object);
        } else {
            console.warn(`Unknown object category: ${category}`);
        }
    }
    
    /**
     * Remove a game object from the renderer
     * @param {string} category - Object category
     * @param {object} object - Game object to remove
     */
    removeObject(category, object) {
        if (this.gameObjects[category]) {
            const index = this.gameObjects[category].indexOf(object);
            if (index >= 0) {
                this.gameObjects[category].splice(index, 1);
            }
        }
    }
    
    /**
     * Clear all objects from a category
     * @param {string} category - Object category to clear
     */
    clearCategory(category) {
        if (this.gameObjects[category]) {
            this.gameObjects[category].length = 0;
        }
    }
    
    /**
     * Clear all game objects
     */
    clearAllObjects() {
        for (const category of Object.keys(this.gameObjects)) {
            this.clearCategory(category);
        }
    }
    
    /**
     * Render all game objects
     * @param {number} deltaTime - Time since last frame for animations
     */
    render(deltaTime = 0) {
        const context = this.layerManager.getLayerContext('gameObjects');
        if (!context) {
            console.warn('Game objects layer context not found');
            return;
        }
        
        // Clear the layer
        this.layerManager.clearLayer('gameObjects');
        
        // Reset performance counters
        this.renderedObjects = 0;
        this.culledObjects = 0;
        
        // Update animation frame
        this.animationFrame += deltaTime;
        
        // Render objects in order (back to front)
        this.renderCategory(context, 'effects', deltaTime);
        this.renderCategory(context, 'pickups', deltaTime);
        this.renderCategory(context, 'projectiles', deltaTime);
        this.renderCategory(context, 'ships', deltaTime);
    }
    
    /**
     * Render all objects in a specific category
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {string} category - Object category to render
     * @param {number} deltaTime - Time since last frame
     */
    renderCategory(context, category, deltaTime) {
        const objects = this.gameObjects[category];
        if (!objects) return;
        
        for (const object of objects) {
            if (this.shouldRenderObject(object)) {
                this.renderObject(context, object, deltaTime);
                this.renderedObjects++;
            } else {
                this.culledObjects++;
            }
        }
    }
    
    /**
     * Check if an object should be rendered (viewport culling)
     * @param {object} object - Game object
     * @returns {boolean} True if object should be rendered
     */
    shouldRenderObject(object) {
        if (!object.x || !object.y || !object.type) return false;
        
        const config = this.objectTypes[object.type];
        if (!config) return false;
        
        // Add margin for smooth appearance/disappearance
        const margin = config.size + 20;
        return this.coordinateSystem.isInViewport(object.x, object.y, margin);
    }
    
    /**
     * Render a single game object
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {object} object - Game object
     * @param {number} deltaTime - Time since last frame
     */
    renderObject(context, object, deltaTime) {
        const config = this.objectTypes[object.type];
        if (!config) {
            console.warn(`Unknown object type: ${object.type}`);
            return;
        }
        
        const screenPos = this.coordinateSystem.worldToScreen(object.x, object.y);
        
        context.save();
        context.translate(screenPos.x, screenPos.y);
        
        // Apply rotation if object has it
        if (object.rotation !== undefined) {
            context.rotate(object.rotation);
        }
        
        // Apply opacity if object has it
        if (object.opacity !== undefined) {
            context.globalAlpha = object.opacity;
        }
        
        // Render based on shape type
        switch (config.shape) {
        case 'triangle':
            this.renderTriangle(context, config, object);
            break;
        case 'circle':
            this.renderCircle(context, config, object);
            break;
        case 'rectangle':
            this.renderRectangle(context, config, object);
            break;
        case 'explosion':
            this.renderExplosion(context, config, object, deltaTime);
            break;
        case 'thrust':
            this.renderThrust(context, config, object, deltaTime);
            break;
        case 'plus':
            this.renderPlus(context, config, object);
            break;
        default:
            this.renderCircle(context, config, object); // Fallback
        }
        
        context.restore();
    }
    
    /**
     * Render a triangle (typically for ships)
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {object} config - Object type configuration
     * @param {object} object - Game object
     */
    renderTriangle(context, config, object) {
        const size = object.size || config.size;
        const color = object.color || config.color;
        
        context.fillStyle = color;
        context.strokeStyle = '#fff';
        context.lineWidth = 1;
        
        context.beginPath();
        context.moveTo(0, -size / 2);
        context.lineTo(-size / 3, size / 2);
        context.lineTo(size / 3, size / 2);
        context.closePath();
        
        context.fill();
        context.stroke();
    }
    
    /**
     * Render a circle
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {object} config - Object type configuration
     * @param {object} object - Game object
     */
    renderCircle(context, config, object) {
        const size = object.size || config.size;
        const color = object.color || config.color;
        
        context.fillStyle = color;
        context.strokeStyle = '#fff';
        context.lineWidth = 1;
        
        context.beginPath();
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
        context.fill();
        context.stroke();
    }
    
    /**
     * Render a rectangle
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {object} config - Object type configuration
     * @param {object} object - Game object
     */
    renderRectangle(context, config, object) {
        const size = object.size || config.size;
        const color = object.color || config.color;
        const width = object.width || size;
        const height = object.height || size / 2;
        
        context.fillStyle = color;
        context.strokeStyle = '#fff';
        context.lineWidth = 1;
        
        context.fillRect(-width / 2, -height / 2, width, height);
        context.strokeRect(-width / 2, -height / 2, width, height);
    }
    
    /**
     * Render an explosion effect
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {object} config - Object type configuration
     * @param {object} object - Game object
     * @param {number} deltaTime - Time since last frame
     */
    renderExplosion(context, config, object, deltaTime) {
        const age = object.age || 0;
        const maxAge = object.maxAge || 1000; // 1 second explosion
        const progress = Math.min(age / maxAge, 1);
        const size = (object.size || config.size) * (1 + progress * 2);
        
        // Fade out over time
        context.globalAlpha *= (1 - progress);
        
        // Draw expanding circles
        for (let i = 0; i < 3; i++) {
            const radius = size * (0.3 + i * 0.3) * progress;
            const alpha = (1 - progress) * (1 - i * 0.3);
            
            context.globalAlpha = alpha;
            context.fillStyle = i === 0 ? '#ffff00' : config.color;
            
            context.beginPath();
            context.arc(0, 0, radius, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    /**
     * Render thrust effect
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {object} config - Object type configuration
     * @param {object} object - Game object
     * @param {number} deltaTime - Time since last frame
     */
    renderThrust(context, config, object, deltaTime) {
        const size = object.size || config.size;
        const intensity = object.intensity || 1;
        const flicker = Math.sin(this.animationFrame * 0.01) * 0.3 + 0.7;
        
        context.globalAlpha *= intensity * flicker;
        context.fillStyle = config.color;
        
        // Draw flame shape
        context.beginPath();
        context.moveTo(0, size / 2);
        context.lineTo(-size / 4, size);
        context.lineTo(size / 4, size);
        context.closePath();
        context.fill();
    }
    
    /**
     * Render plus shape (for pickups)
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {object} config - Object type configuration
     * @param {object} object - Game object
     */
    renderPlus(context, config, object) {
        const size = object.size || config.size;
        const color = object.color || config.color;
        const thickness = 2;
        
        context.fillStyle = color;
        context.strokeStyle = '#fff';
        context.lineWidth = 1;
        
        // Horizontal bar
        context.fillRect(-size / 2, -thickness / 2, size, thickness);
        context.strokeRect(-size / 2, -thickness / 2, size, thickness);
        
        // Vertical bar
        context.fillRect(-thickness / 2, -size / 2, thickness, size);
        context.strokeRect(-thickness / 2, -size / 2, thickness, size);
    }
    
    /**
     * Update objects (remove expired, update animations)
     * @param {number} deltaTime - Time since last frame
     */
    updateObjects(deltaTime) {
        for (const [category, objects] of Object.entries(this.gameObjects)) {
            for (let i = objects.length - 1; i >= 0; i--) {
                const object = objects[i];
                
                // Update object age if it has one
                if (object.age !== undefined) {
                    object.age += deltaTime;
                    
                    // Remove expired objects
                    if (object.maxAge && object.age >= object.maxAge) {
                        objects.splice(i, 1);
                        continue;
                    }
                }
                
                // Update object position if it has velocity
                if (object.vx !== undefined && object.vy !== undefined) {
                    object.x += object.vx * deltaTime * 0.001;
                    object.y += object.vy * deltaTime * 0.001;
                }
            }
        }
    }
    
    /**
     * Get performance metrics
     * @returns {{rendered: number, culled: number, total: number}}
     */
    getPerformanceMetrics() {
        let total = 0;
        for (const objects of Object.values(this.gameObjects)) {
            total += objects.length;
        }
        
        return {
            rendered: this.renderedObjects,
            culled: this.culledObjects,
            total: total
        };
    }
    
    /**
     * Get object count by category
     * @returns {object} Object counts by category
     */
    getObjectCounts() {
        const counts = {};
        for (const [category, objects] of Object.entries(this.gameObjects)) {
            counts[category] = objects.length;
        }
        return counts;
    }
}