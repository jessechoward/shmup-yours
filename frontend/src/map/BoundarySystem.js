/**
 * BoundarySystem.js
 * 
 * Manages floating boundary mechanics to prevent infinite drift.
 * Integrates with Planck.js physics for smooth force application.
 * 
 * Design Philosophy:
 * - Floating boundaries (not hard walls)
 * - Gradual force application to push players back
 * - No instant teleportation or collision stopping
 * - Smooth physics integration
 */

class BoundarySystem {
    constructor(physicsWorld) {
        this.world = physicsWorld; // Planck.js world instance
        this.boundaries = [];
        this.boundaryBodies = []; // Physics bodies for boundaries
        
        // Boundary physics parameters
        this.FORCE_MULTIPLIER = 1.0;
        this.MAX_BOUNDARY_FORCE = 1000;
        this.FORCE_FALLOFF_DISTANCE = 32; // Distance over which force falls off
        this.VISUAL_WARNING_DISTANCE = 64; // Distance at which visual warnings appear
    }
    
    /**
     * Initialize boundary system with map configuration
     * @param {object} boundaryConfig - Boundary configuration from MapGenerator
     */
    initialize(boundaryConfig) {
        this.boundaries = boundaryConfig.boundaries;
        this.createBoundaryPhysicsBodies();
    }
    
    /**
     * Create Planck.js physics bodies for boundaries
     */
    createBoundaryPhysicsBodies() {
        this.boundaryBodies = [];
        
        this.boundaries.forEach((boundary, index) => {
            // Create sensor body (no collision, only force detection)
            const bodyDef = {
                type: 'static',
                position: { 
                    x: boundary.x + boundary.width / 2, 
                    y: boundary.y + boundary.height / 2 
                },
                userData: {
                    type: 'boundary',
                    id: index,
                    direction: boundary.direction,
                    force: boundary.force
                }
            };
            
            const body = this.world.createBody(bodyDef);
            
            // Create fixture as sensor
            const fixtureDef = {
                shape: this.world.Box(boundary.width / 2, boundary.height / 2),
                isSensor: true, // Allows objects to pass through but detects collision
                userData: {
                    type: 'boundary',
                    boundaryIndex: index
                }
            };
            
            body.createFixture(fixtureDef);
            this.boundaryBodies.push(body);
        });
    }
    
    /**
     * Update boundary forces each physics tick
     * @param {Array} players - Array of player objects with physics bodies
     */
    update(players) {
        players.forEach(player => {
            this.applyBoundaryForces(player);
        });
    }
    
    /**
     * Apply boundary forces to a player based on their position
     * @param {object} player - Player object with physics body
     */
    applyBoundaryForces(player) {
        if (!player.body || !player.body.isActive()) return;
        
        const playerPos = player.body.getPosition();
        
        this.boundaries.forEach((boundary, index) => {
            const distance = this.calculateDistanceToBoundary(playerPos, boundary);
            
            if (distance < this.FORCE_FALLOFF_DISTANCE) {
                const force = this.calculateBoundaryForce(distance, boundary);
                player.body.applyForce(force, playerPos);
                
                // Trigger visual warning if within warning distance
                if (distance < this.VISUAL_WARNING_DISTANCE) {
                    this.triggerBoundaryWarning(player, boundary, distance);
                }
            }
        });
    }
    
    /**
     * Calculate distance from player to boundary
     * @param {object} playerPos - Player position {x, y}
     * @param {object} boundary - Boundary configuration
     * @returns {number} Distance to boundary edge
     */
    calculateDistanceToBoundary(playerPos, boundary) {
        let distance = 0;
        
        switch (boundary.direction) {
        case 'down': // Top boundary
            distance = Math.max(0, boundary.y + boundary.height - playerPos.y);
            break;
        case 'up': // Bottom boundary
            distance = Math.max(0, playerPos.y - boundary.y);
            break;
        case 'right': // Left boundary
            distance = Math.max(0, boundary.x + boundary.width - playerPos.x);
            break;
        case 'left': // Right boundary
            distance = Math.max(0, playerPos.x - boundary.x);
            break;
        }
        
        return distance;
    }
    
    /**
     * Calculate force to apply based on distance to boundary
     * @param {number} distance - Distance to boundary
     * @param {object} boundary - Boundary configuration
     * @returns {object} Force vector {x, y}
     */
    calculateBoundaryForce(distance, boundary) {
        // Force increases exponentially as player gets closer to boundary
        const normalizedDistance = Math.max(0, distance / this.FORCE_FALLOFF_DISTANCE);
        const forceStrength = (1 - normalizedDistance) * (1 - normalizedDistance); // Quadratic falloff
        
        const maxForce = Math.min(boundary.force.x || boundary.force.y, this.MAX_BOUNDARY_FORCE);
        
        return {
            x: boundary.force.x * forceStrength * this.FORCE_MULTIPLIER,
            y: boundary.force.y * forceStrength * this.FORCE_MULTIPLIER
        };
    }
    
    /**
     * Trigger visual warning when player approaches boundary
     * @param {object} player - Player object
     * @param {object} boundary - Boundary configuration
     * @param {number} distance - Distance to boundary
     */
    triggerBoundaryWarning(player, boundary, distance) {
        // This will be handled by the rendering system
        const warningIntensity = 1 - (distance / this.VISUAL_WARNING_DISTANCE);
        
        player.boundaryWarning = {
            active: true,
            direction: boundary.direction,
            intensity: warningIntensity,
            timestamp: Date.now()
        };
    }
    
    /**
     * Check if position is within valid play area
     * @param {object} position - Position to check {x, y}
     * @returns {boolean} True if position is within boundaries
     */
    isWithinBoundaries(position) {
        return this.boundaries.every(boundary => {
            switch (boundary.direction) {
            case 'down': // Top boundary
                return position.y > boundary.y + boundary.height;
            case 'up': // Bottom boundary
                return position.y < boundary.y;
            case 'right': // Left boundary
                return position.x > boundary.x + boundary.width;
            case 'left': // Right boundary
                return position.x < boundary.x;
            default:
                return true;
            }
        });
    }
    
    /**
     * Get boundary configuration for rendering
     * @returns {Array} Array of boundary configurations
     */
    getBoundaryData() {
        return this.boundaries.map((boundary, index) => ({
            ...boundary,
            id: index,
            visualWarningZone: {
                x: boundary.x - (boundary.direction === 'right' ? this.VISUAL_WARNING_DISTANCE : 0),
                y: boundary.y - (boundary.direction === 'down' ? this.VISUAL_WARNING_DISTANCE : 0),
                width: boundary.width + (boundary.direction === 'left' || boundary.direction === 'right' ? this.VISUAL_WARNING_DISTANCE : 0),
                height: boundary.height + (boundary.direction === 'up' || boundary.direction === 'down' ? this.VISUAL_WARNING_DISTANCE : 0)
            }
        }));
    }
    
    /**
     * Cleanup boundary physics bodies
     */
    cleanup() {
        this.boundaryBodies.forEach(body => {
            if (body && this.world) {
                this.world.destroyBody(body);
            }
        });
        this.boundaryBodies = [];
        this.boundaries = [];
    }
    
    /**
     * Handle boundary sensor events (called by physics contact listener)
     * @param {object} contact - Planck.js contact object
     * @param {boolean} began - True if contact began, false if ended
     */
    handleBoundaryContact(contact, began) {
        const fixtureA = contact.getFixtureA();
        const fixtureB = contact.getFixtureB();
        
        let boundaryFixture = null;
        let playerFixture = null;
        
        // Determine which fixture is the boundary
        if (fixtureA.getUserData()?.type === 'boundary') {
            boundaryFixture = fixtureA;
            playerFixture = fixtureB;
        } else if (fixtureB.getUserData()?.type === 'boundary') {
            boundaryFixture = fixtureB;
            playerFixture = fixtureA;
        }
        
        if (!boundaryFixture || !playerFixture) return;
        
        const boundaryIndex = boundaryFixture.getUserData().boundaryIndex;
        const playerBody = playerFixture.getBody();
        
        if (began) {
            // Player entered boundary zone
            this.onPlayerEnterBoundary(playerBody, boundaryIndex);
        } else {
            // Player left boundary zone
            this.onPlayerLeaveBoundary(playerBody, boundaryIndex);
        }
    }
    
    /**
     * Called when player enters boundary zone
     * @param {object} playerBody - Planck.js player body
     * @param {number} boundaryIndex - Index of boundary
     */
    onPlayerEnterBoundary(playerBody, boundaryIndex) {
        const userData = playerBody.getUserData();
        if (userData && userData.type === 'player') {
            userData.inBoundaryZone = true;
            userData.boundaryIndex = boundaryIndex;
        }
    }
    
    /**
     * Called when player leaves boundary zone
     * @param {object} playerBody - Planck.js player body
     * @param {number} boundaryIndex - Index of boundary
     */
    onPlayerLeaveBoundary(playerBody, boundaryIndex) {
        const userData = playerBody.getUserData();
        if (userData && userData.type === 'player') {
            userData.inBoundaryZone = false;
            userData.boundaryIndex = null;
        }
    }
}

export default BoundarySystem;