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
        
        // Demo objects
        this.demoShip = {
            x: 1024,
            y: 768,
            rotation: 0,
            type: 'SHIP_PLAYER',
            size: 16
        };
        
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
            
            // Toggle demo on/off with spacebar
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleDemo();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse controls for camera
        let isDragging = false;
        let lastMouseX = 0;
        let lastMouseY = 0;
        
        document.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - lastMouseX;
                const deltaY = e.clientY - lastMouseY;
                
                const cameraPos = this.coordinateSystem.getCameraPosition();
                this.coordinateSystem.setCameraPosition(
                    cameraPos.x - deltaX * 2,
                    cameraPos.y - deltaY * 2
                );
                this.layerManager.setCameraPosition(cameraPos.x - deltaX * 2, cameraPos.y - deltaY * 2);
                
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    /**
     * Toggle demo on/off
     */
    toggleDemo() {
        if (this.isRunning) {
            this.stopDemo();
        } else {
            this.startDemo();
        }
    }
    
    /**
     * Start the rendering demo
     */
    startDemo() {
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.renderLoop();
        console.log('Canvas 5-Layer Rendering Demo Started');
        console.log('Controls:');
        console.log('- WASD: Move camera');
        console.log('- Arrow Keys: Move ship');
        console.log('- Mouse drag: Pan camera');
        console.log('- Space: Toggle demo');
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
        
        // Update camera movement (automatic demo movement)
        if (!this.isManualControl()) {
            this.updateCameraMovement();
        }
        
        // Update game objects
        this.gameObjectRenderer.updateObjects(this.deltaTime);
        
        // Spawn new projectiles occasionally
        if (Math.random() < 0.02) {
            this.spawnProjectile();
        }
        
        // Spawn new effects occasionally
        if (Math.random() < 0.01) {
            this.spawnExplosion();
        }
        
        // Update ship rotation
        this.demoShip.rotation += this.deltaTime * 0.002;
        
        // Add thrust effect behind ship
        const thrustEffect = {
            x: this.demoShip.x - Math.cos(this.demoShip.rotation) * 12,
            y: this.demoShip.y - Math.sin(this.demoShip.rotation) * 12,
            type: 'EFFECT_THRUST',
            intensity: 0.7 + Math.random() * 0.3,
            rotation: this.demoShip.rotation + Math.PI,
            age: 0,
            maxAge: 100
        };
        
        this.gameObjectRenderer.addObject('effects', thrustEffect);
    }
    
    /**
     * Handle keyboard input
     */
    handleInput() {
        const cameraPos = this.coordinateSystem.getCameraPosition();
        const moveSpeed = this.deltaTime * 0.3;
        let moved = false;
        
        // Camera movement with WASD
        if (this.keys['KeyW']) {
            this.coordinateSystem.setCameraPosition(cameraPos.x, cameraPos.y - moveSpeed);
            moved = true;
        }
        if (this.keys['KeyS']) {
            this.coordinateSystem.setCameraPosition(cameraPos.x, cameraPos.y + moveSpeed);
            moved = true;
        }
        if (this.keys['KeyA']) {
            this.coordinateSystem.setCameraPosition(cameraPos.x - moveSpeed, cameraPos.y);
            moved = true;
        }
        if (this.keys['KeyD']) {
            this.coordinateSystem.setCameraPosition(cameraPos.x + moveSpeed, cameraPos.y);
            moved = true;
        }
        
        // Ship movement with arrow keys
        const shipMoveSpeed = this.deltaTime * 0.2;
        if (this.keys['ArrowUp']) {
            this.demoShip.y -= shipMoveSpeed;
        }
        if (this.keys['ArrowDown']) {
            this.demoShip.y += shipMoveSpeed;
        }
        if (this.keys['ArrowLeft']) {
            this.demoShip.x -= shipMoveSpeed;
        }
        if (this.keys['ArrowRight']) {
            this.demoShip.x += shipMoveSpeed;
        }
        
        // Update layer manager camera position if moved
        if (moved) {
            const newPos = this.coordinateSystem.getCameraPosition();
            this.layerManager.setCameraPosition(newPos.x, newPos.y);
        }
    }
    
    /**
     * Check if user is manually controlling camera
     */
    isManualControl() {
        return this.keys['KeyW'] || this.keys['KeyS'] || this.keys['KeyA'] || this.keys['KeyD'];
    }
    
    /**
     * Update automatic camera movement for demo
     */
    updateCameraMovement() {
        const worldBounds = this.coordinateSystem.getWorldBounds();
        const cameraPos = this.coordinateSystem.getCameraPosition();
        
        // Bounce camera around the world for demo
        let newX = cameraPos.x + this.cameraVelocity.x * this.deltaTime * 0.001;
        let newY = cameraPos.y + this.cameraVelocity.y * this.deltaTime * 0.001;
        
        // Bounce off world boundaries
        if (newX <= 512 || newX >= worldBounds.width - 512) {
            this.cameraDirection.x *= -1;
            this.cameraVelocity.x = this.cameraDirection.x * (30 + Math.random() * 40);
        }
        
        if (newY <= 384 || newY >= worldBounds.height - 384) {
            this.cameraDirection.y *= -1;
            this.cameraVelocity.y = this.cameraDirection.y * (20 + Math.random() * 30);
        }
        
        this.coordinateSystem.setCameraPosition(newX, newY);
        this.layerManager.setCameraPosition(newX, newY);
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