/**
 * Canvas 5-Layer Rendering Pipeline Demo
 * 
 * Demonstrates the complete rendering architecture with:
 * - 3 parallax background layers
 * - Terrain layer with obstacles
 * - Game objects layer with ships and projectiles
 */

import { CanvasLayerManager } from './rendering/CanvasLayerManager.js';
import { CoordinateSystem } from './rendering/CoordinateSystem.js';
import { ParallaxRenderer } from './rendering/ParallaxRenderer.js';
import { TerrainRenderer } from './rendering/TerrainRenderer.js';
import { GameObjectRenderer } from './rendering/GameObjectRenderer.js';

class RenderingDemo {
    constructor() {
        // Initialize core systems
        this.layerManager = new CanvasLayerManager();
        this.coordinateSystem = new CoordinateSystem();
        
        // Initialize renderers
        this.parallaxRenderer = new ParallaxRenderer(this.layerManager, this.coordinateSystem);
        this.terrainRenderer = new TerrainRenderer(this.layerManager, this.coordinateSystem);
        this.gameObjectRenderer = new GameObjectRenderer(this.layerManager, this.coordinateSystem);
        
        // Demo state
        this.isRunning = false;
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        
        // Camera movement for demo
        this.cameraVelocity = { x: 50, y: 30 }; // pixels per second
        this.cameraDirection = { x: 1, y: 1 };
        
        // Demo objects - Player ship with physics properties
        this.demoShip = {
            x: 1024,
            y: 768,
            rotation: 0,
            velocity: { x: 0, y: 0 },
            maxSpeed: 400, // Increased for testing
            acceleration: 600, // Increased for testing
            rotationSpeed: 6, // Increased for testing
            type: 'SHIP_PLAYER',
            size: 16,
            shieldRadius: 20
        };
        
        // Bullet system
        this.bullets = [];
        this.lastBulletTime = 0;
        this.bulletFireRate = 333; // 3 bullets per second (1000ms / 3 = 333ms)
        
        this.projectiles = [];
        this.effects = [];
        
        // Controls
        this.keys = {};
        this.setupEventListeners();
        
        // UI elements
        this.debugInfo = {
            fps: document.getElementById('fps'),
            worldPos: document.getElementById('worldPos'),
            cameraPos: document.getElementById('cameraPos')
        };
        
        this.initializeDemo();
    }
    
    /**
     * Initialize the demo with sample objects
     */
    initializeDemo() {
        // Add demo ship
        this.gameObjectRenderer.addObject('ships', this.demoShip);
        
        // Add some sample projectiles
        for (let i = 0; i < 10; i++) {
            const projectile = {
                x: 800 + Math.random() * 400,
                y: 600 + Math.random() * 300,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                type: 'PROJECTILE_BULLET',
                age: 0,
                maxAge: 3000 + Math.random() * 2000
            };
            
            this.gameObjectRenderer.addObject('projectiles', projectile);
            this.projectiles.push(projectile);
        }
        
        // Add some effects
        for (let i = 0; i < 5; i++) {
            const explosion = {
                x: 1000 + Math.random() * 200,
                y: 700 + Math.random() * 200,
                type: 'EFFECT_EXPLOSION',
                age: 0,
                maxAge: 1500,
                size: 30 + Math.random() * 20
            };
            
            this.gameObjectRenderer.addObject('effects', explosion);
            this.effects.push(explosion);
        }
        
        // Add pickups
        for (let i = 0; i < 3; i++) {
            const pickup = {
                x: 1200 + Math.random() * 300,
                y: 800 + Math.random() * 200,
                type: 'PICKUP_HEALTH',
                rotation: 0
            };
            
            this.gameObjectRenderer.addObject('pickups', pickup);
        }
    }
    
    /**
     * Set up event listeners for controls
     */
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Fire bullet with spacebar
            if (e.code === 'Space') {
                e.preventDefault();
                this.fireBullet();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Note: Removed mouse controls for camera - camera now follows player automatically
    }
    
    /**
     * Fire a bullet from the player ship
     */
    fireBullet() {
        const currentTime = performance.now();
        
        // Rate limiting: max 3 bullets per second
        if (currentTime - this.lastBulletTime < this.bulletFireRate) {
            return;
        }
        
        this.lastBulletTime = currentTime;
        
        // Calculate bullet spawn position (tip of the ship)
        const shipTipDistance = this.demoShip.size / 2 + 5;
        const bulletX = this.demoShip.x + Math.cos(this.demoShip.rotation) * shipTipDistance;
        const bulletY = this.demoShip.y + Math.sin(this.demoShip.rotation) * shipTipDistance;
        
        // Calculate bullet velocity (1.5x max ship speed)
        const bulletSpeed = this.demoShip.maxSpeed * 1.5;
        const bulletVelocity = {
            x: Math.cos(this.demoShip.rotation) * bulletSpeed,
            y: Math.sin(this.demoShip.rotation) * bulletSpeed
        };
        
        const bullet = {
            x: bulletX,
            y: bulletY,
            vx: bulletVelocity.x,
            vy: bulletVelocity.y,
            type: 'PROJECTILE_BULLET',
            age: 0,
            maxAge: 2000, // 2 seconds at bullet speed = ~600 pixels range
            maxRange: 600,
            startX: bulletX,
            startY: bulletY
        };
        
        this.gameObjectRenderer.addObject('projectiles', bullet);
        this.bullets.push(bullet);
    }
    
    /**
     * Start the rendering demo
     */
    startDemo() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.renderLoop();
        console.log('Space Shooter Demo Started');
        console.log('Controls:');
        console.log('- ← → Arrow Keys: Rotate ship');
        console.log('- ↑ Up Arrow: Thrust forward');
        console.log('- Space: Fire bullets (max 3/second)');
        console.log('- Camera follows player automatically');
    }
    
    /**
     * Stop the rendering demo
     */
    stopDemo() {
        this.isRunning = false;
        console.log('Canvas 5-Layer Rendering Demo Stopped');
    }
    
    /**
     * Main render loop
     */
    renderLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        this.deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // Update systems
        this.updateDemo();
        this.render();
        this.updateUI();
        
        // Continue loop
        requestAnimationFrame(() => this.renderLoop());
    }
    
    /**
     * Update demo logic
     */
    updateDemo() {
        // Handle input
        this.handleInput();
        
        // Update game objects
        this.gameObjectRenderer.updateObjects(this.deltaTime);
        
        // Update bullets with range checking
        this.updateBullets();
        
        // Spawn new projectiles occasionally (for demo)
        if (Math.random() < 0.02) {
            this.spawnProjectile();
        }
        
        // Spawn new effects occasionally (for demo)
        if (Math.random() < 0.01) {
            this.spawnExplosion();
        }
        
        // Add thrust effect behind ship when thrusting
        if (this.keys['ArrowUp']) {
            const thrustEffect = {
                x: this.demoShip.x - Math.cos(this.demoShip.rotation) * 15,
                y: this.demoShip.y - Math.sin(this.demoShip.rotation) * 15,
                type: 'EFFECT_THRUST',
                intensity: 0.7 + Math.random() * 0.3,
                rotation: this.demoShip.rotation + Math.PI,
                age: 0,
                maxAge: 150
            };
            
            this.gameObjectRenderer.addObject('effects', thrustEffect);
        }
    }
    
    /**
     * Handle keyboard input for space shooter controls
     */
    handleInput() {
        const deltaSeconds = this.deltaTime * 0.001;
        
        // Ship rotation with Left/Right arrows
        if (this.keys['ArrowLeft']) {
            this.demoShip.rotation -= this.demoShip.rotationSpeed * deltaSeconds;
        }
        if (this.keys['ArrowRight']) {
            this.demoShip.rotation += this.demoShip.rotationSpeed * deltaSeconds;
        }
        
        // Ship thrust with Up arrow (physics-based acceleration)
        if (this.keys['ArrowUp']) {
            // Apply thrust in the direction the ship is facing
            const thrustX = Math.cos(this.demoShip.rotation) * this.demoShip.acceleration * deltaSeconds;
            const thrustY = Math.sin(this.demoShip.rotation) * this.demoShip.acceleration * deltaSeconds;
            
            this.demoShip.velocity.x += thrustX;
            this.demoShip.velocity.y += thrustY;
            
            // Cap velocity to max speed
            const currentSpeed = Math.sqrt(
                this.demoShip.velocity.x ** 2 + this.demoShip.velocity.y ** 2
            );
            if (currentSpeed > this.demoShip.maxSpeed) {
                const scale = this.demoShip.maxSpeed / currentSpeed;
                this.demoShip.velocity.x *= scale;
                this.demoShip.velocity.y *= scale;
            }
        }
        
        // Apply momentum/inertia and damping
        this.updateShipPhysics(deltaSeconds);
        
        // Update camera to follow player
        this.updatePlayerFollowingCamera();
    }
    
    /**
     * Update ship physics with momentum and damping
     */
    updateShipPhysics(deltaSeconds) {
        // Apply velocity to position
        this.demoShip.x += this.demoShip.velocity.x * deltaSeconds;
        this.demoShip.y += this.demoShip.velocity.y * deltaSeconds;
        
        // Apply damping (space friction)
        const damping = 0.98; // Slight damping for realistic space feel
        this.demoShip.velocity.x *= damping;
        this.demoShip.velocity.y *= damping;
        
        // Check world boundaries and apply collision
        const worldBounds = this.coordinateSystem.getWorldBounds();
        const radius = this.demoShip.shieldRadius;
        
        if (this.demoShip.x - radius < 0) {
            this.demoShip.x = radius;
            this.demoShip.velocity.x = Math.abs(this.demoShip.velocity.x) * 0.5; // Bounce with energy loss
        }
        if (this.demoShip.x + radius > worldBounds.width) {
            this.demoShip.x = worldBounds.width - radius;
            this.demoShip.velocity.x = -Math.abs(this.demoShip.velocity.x) * 0.5;
        }
        if (this.demoShip.y - radius < 0) {
            this.demoShip.y = radius;
            this.demoShip.velocity.y = Math.abs(this.demoShip.velocity.y) * 0.5;
        }
        if (this.demoShip.y + radius > worldBounds.height) {
            this.demoShip.y = worldBounds.height - radius;
            this.demoShip.velocity.y = -Math.abs(this.demoShip.velocity.y) * 0.5;
        }
    }
    
    /**
     * Update camera to follow player with map edge constraints
     */
    updatePlayerFollowingCamera() {
        const worldBounds = this.coordinateSystem.getWorldBounds();
        const viewport = { width: 1024, height: 768 }; // Fixed viewport size
        
        // Calculate desired camera position (center player on screen)
        let desiredCameraX = this.demoShip.x - viewport.width / 2;
        let desiredCameraY = this.demoShip.y - viewport.height / 2;
        
        // Clamp camera to world boundaries
        desiredCameraX = Math.max(0, Math.min(desiredCameraX, worldBounds.width - viewport.width));
        desiredCameraY = Math.max(0, Math.min(desiredCameraY, worldBounds.height - viewport.height));
        
        // Apply smooth camera following (lerp for smoothness)
        const cameraPos = this.coordinateSystem.getCameraPosition();
        const lerpFactor = 0.2; // Smooth but responsive following
        const newCameraX = cameraPos.x + (desiredCameraX - cameraPos.x) * lerpFactor;
        const newCameraY = cameraPos.y + (desiredCameraY - cameraPos.y) * lerpFactor;
        
        // Update camera position
        this.coordinateSystem.setCameraPosition(newCameraX, newCameraY);
        this.layerManager.setCameraPosition(newCameraX, newCameraY);
    }
    
    /**
     * Update bullets with range checking and cleanup
     */
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // Check range limit
            const distanceFromStart = Math.sqrt(
                (bullet.x - bullet.startX) ** 2 + 
                (bullet.y - bullet.startY) ** 2
            );
            
            if (distanceFromStart >= bullet.maxRange) {
                // Remove bullet that exceeded range
                this.gameObjectRenderer.removeObject('projectiles', bullet);
                this.bullets.splice(i, 1);
                continue;
            }
            
            // Check world boundary collision
            const worldBounds = this.coordinateSystem.getWorldBounds();
            if (bullet.x < 0 || bullet.x > worldBounds.width || 
                bullet.y < 0 || bullet.y > worldBounds.height) {
                this.gameObjectRenderer.removeObject('projectiles', bullet);
                this.bullets.splice(i, 1);
                continue;
            }
        }
    }
    
    /**
     * Spawn a new projectile
     */
    spawnProjectile() {
        const cameraPos = this.coordinateSystem.getCameraPosition();
        const projectile = {
            x: cameraPos.x + (Math.random() - 0.5) * 1200,
            y: cameraPos.y + (Math.random() - 0.5) * 900,
            vx: (Math.random() - 0.5) * 300,
            vy: (Math.random() - 0.5) * 300,
            type: Math.random() < 0.8 ? 'PROJECTILE_BULLET' : 'PROJECTILE_MISSILE',
            age: 0,
            maxAge: 2000 + Math.random() * 3000
        };
        
        this.gameObjectRenderer.addObject('projectiles', projectile);
        this.projectiles.push(projectile);
    }
    
    /**
     * Spawn a new explosion
     */
    spawnExplosion() {
        const cameraPos = this.coordinateSystem.getCameraPosition();
        const explosion = {
            x: cameraPos.x + (Math.random() - 0.5) * 800,
            y: cameraPos.y + (Math.random() - 0.5) * 600,
            type: 'EFFECT_EXPLOSION',
            age: 0,
            maxAge: 1000 + Math.random() * 1000,
            size: 20 + Math.random() * 30
        };
        
        this.gameObjectRenderer.addObject('effects', explosion);
        this.effects.push(explosion);
    }
    
    /**
     * Render all layers
     */
    render() {
        // Update performance metrics
        this.layerManager.updatePerformanceMetrics(this.lastFrameTime);
        
        // Render layers in order (back to front)
        this.parallaxRenderer.renderAllLayers(this.deltaTime);
        this.terrainRenderer.render();
        this.gameObjectRenderer.render(this.deltaTime);
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        const metrics = this.layerManager.getPerformanceMetrics();
        const cameraPos = this.coordinateSystem.getCameraPosition();
        const objectMetrics = this.gameObjectRenderer.getPerformanceMetrics();
        
        if (this.debugInfo.fps) {
            this.debugInfo.fps.textContent = metrics.fps;
        }
        
        if (this.debugInfo.worldPos) {
            this.debugInfo.worldPos.textContent = `${Math.round(cameraPos.x)}, ${Math.round(cameraPos.y)}`;
        }
        
        if (this.debugInfo.cameraPos) {
            this.debugInfo.cameraPos.textContent = 
                `Objects: ${objectMetrics.rendered}/${objectMetrics.total} (${objectMetrics.culled} culled)`;
        }
    }
}

// Initialize demo when page loads
document.addEventListener('DOMContentLoaded', () => {
    const demo = new RenderingDemo();
    
    // Auto-start demo
    demo.startDemo();
    
    // Add instructions to console
    console.log('Canvas 5-Layer Rendering Pipeline Demo');
    console.log('=====================================');
    console.log('This demo showcases the complete rendering architecture:');
    console.log('1. Background Layer 1: Slowest parallax stars (0.1x scroll rate)');
    console.log('2. Background Layer 2: Medium parallax stars (0.3x scroll rate)');
    console.log('3. Background Layer 3: Fastest parallax stars (0.6x scroll rate)');
    console.log('4. Terrain Layer: Static obstacles and boundaries');
    console.log('5. Game Objects Layer: Ships, projectiles, and effects');
    console.log('');
    console.log('Features demonstrated:');
    console.log('- Fixed 1024x768 viewport');
    console.log('- World-to-screen coordinate mapping');
    console.log('- Parallax scrolling with different rates');
    console.log('- Viewport culling for performance');
    console.log('- Layer-based rendering pipeline');
    console.log('- Object pooling and management');
    console.log('');
    console.log('Press Space to toggle the demo on/off');
    
    // Make demo instance globally available for debugging
    window.renderingDemo = demo;
});