/**
 * MapSystemExample.js
 * 
 * Example implementation showing how to use the Map Generation and Boundary System.
 * This demonstrates the complete workflow from initialization to rendering.
 */

import MapSystem from './index.js';

class MapSystemExample {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.mapSystem = null;
        this.physicsWorld = null; // Would be initialized with Planck.js
        
        // Example game state
        this.players = [];
        this.camera = { x: 0, y: 0, scale: 1 };
        this.viewport = { x: 0, y: 0, width: 1024, height: 768 };
        
        this.animationId = null;
        this.isRunning = false;
    }
    
    /**
     * Initialize the example
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {object} physicsWorld - Planck.js physics world instance
     */
    async initialize(canvas, physicsWorld) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.physicsWorld = physicsWorld;
        
        // Initialize map system
        this.mapSystem = new MapSystem(physicsWorld);
        await this.mapSystem.initialize();
        
        console.log('Map system initialized successfully');
    }
    
    /**
     * Generate a new map for given player count
     * @param {number} playerCount - Number of active players
     */
    async generateNewMap(playerCount) {
        if (!this.mapSystem) {
            throw new Error('Map system not initialized');
        }
        
        console.log(`Generating map for ${playerCount} players...`);
        
        const map = await this.mapSystem.generateMap(playerCount);
        
        console.log('Map generated:', {
            dimensions: map.dimensions,
            obstacleCount: map.obstacles.length,
            boundaryCount: map.boundaries.boundaries.length,
            backgroundLayers: map.backgroundLayers.length
        });
        
        // Center camera on map
        this.camera.x = map.dimensions.width / 2 - this.viewport.width / 2;
        this.camera.y = map.dimensions.height / 2 - this.viewport.height / 2;
        
        return map;
    }
    
    /**
     * Start the example game loop
     */
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.gameLoop();
    }
    
    /**
     * Stop the example
     */
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    /**
     * Main game loop
     */
    gameLoop() {
        if (!this.isRunning) return;
        
        // Update systems
        this.update();
        
        // Render frame
        this.render();
        
        // Schedule next frame
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    /**
     * Update game systems
     */
    update() {
        if (!this.mapSystem) return;
        
        // Update viewport based on camera
        this.viewport.x = this.camera.x;
        this.viewport.y = this.camera.y;
        
        // Update map system (boundary forces, etc.)
        this.mapSystem.update(this.players, this.viewport);
        
        // Update camera (example: follow first player)
        if (this.players.length > 0) {
            this.updateCameraFollow(this.players[0]);
        }
    }
    
    /**
     * Render game frame
     */
    render() {
        if (!this.ctx || !this.mapSystem) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render map system
        this.mapSystem.render(this.ctx, this.viewport, this.camera);
        
        // Render UI overlay
        this.renderUI();
    }
    
    /**
     * Update camera to follow a target
     * @param {object} target - Target object with position
     */
    updateCameraFollow(target) {
        if (!target.body) return;
        
        const pos = target.body.getPosition();
        const targetX = pos.x - this.viewport.width / 2;
        const targetY = pos.y - this.viewport.height / 2;
        
        // Smooth camera movement
        const smoothing = 0.1;
        this.camera.x += (targetX - this.camera.x) * smoothing;
        this.camera.y += (targetY - this.camera.y) * smoothing;
    }
    
    /**
     * Render UI overlay with debug information
     */
    renderUI() {
        const metrics = this.mapSystem.getMetrics();
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px monospace';
        
        let y = 20;
        const info = [
            `Generation Time: ${metrics.generationTime.toFixed(2)}ms`,
            `Render Time: ${metrics.renderTime.toFixed(2)}ms`,
            `Tile Count: ${metrics.tileCount}`,
            `Camera: (${Math.round(this.camera.x)}, ${Math.round(this.camera.y)})`,
            `Scale: ${this.camera.scale.toFixed(2)}`,
        ];
        
        info.forEach(text => {
            this.ctx.fillText(text, 10, y);
            y += 18;
        });
    }
    
    /**
     * Add a mock player for demonstration
     * @param {number} x - Player X position
     * @param {number} y - Player Y position
     */
    addPlayer(x, y) {
        const player = {
            id: this.players.length,
            body: {
                getPosition: () => ({ x, y }),
                setPosition: (pos) => { x = pos.x; y = pos.y; },
                isActive: () => true
            },
            boundaryWarning: null
        };
        
        this.players.push(player);
        return player;
    }
    
    /**
     * Handle keyboard input for camera control
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboard(event) {
        const speed = 10;
        
        switch (event.key) {
        case 'ArrowUp':
        case 'w':
            this.camera.y -= speed;
            break;
        case 'ArrowDown':
        case 's':
            this.camera.y += speed;
            break;
        case 'ArrowLeft':
        case 'a':
            this.camera.x -= speed;
            break;
        case 'ArrowRight':
        case 'd':
            this.camera.x += speed;
            break;
        case '=':
        case '+':
            this.camera.scale = Math.min(2, this.camera.scale + 0.1);
            break;
        case '-':
            this.camera.scale = Math.max(0.5, this.camera.scale - 0.1);
            break;
        }
    }
    
    /**
     * Cleanup resources
     */
    cleanup() {
        this.stop();
        
        if (this.mapSystem) {
            this.mapSystem.cleanup();
        }
        
        this.players = [];
        this.mapSystem = null;
        this.physicsWorld = null;
    }
}

export default MapSystemExample;

// Example usage in HTML page:
/*
<!DOCTYPE html>
<html>
<head>
    <title>Map System Example</title>
    <style>
        canvas { border: 1px solid #ccc; }
        .controls { margin: 10px 0; }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="1024" height="768"></canvas>
    <div class="controls">
        <button onclick="generateMap2()">2 Players</button>
        <button onclick="generateMap5()">5 Players</button>
        <button onclick="generateMap10()">10 Players</button>
        <button onclick="generateMap15()">15 Players</button>
        <p>Use WASD or arrow keys to move camera, +/- to zoom</p>
    </div>
    
    <script type="module">
        import MapSystemExample from './MapSystemExample.js';
        
        // Mock Planck.js world for example
        const mockPhysicsWorld = {
            createBody: () => ({ createFixture: () => {} }),
            destroyBody: () => {},
            Box: () => ({})
        };
        
        const canvas = document.getElementById('gameCanvas');
        const example = new MapSystemExample();
        
        async function init() {
            await example.initialize(canvas, mockPhysicsWorld);
            example.start();
            
            // Add some mock players
            example.addPlayer(512, 384);
            
            // Set up keyboard controls
            document.addEventListener('keydown', (e) => example.handleKeyboard(e));
        }
        
        // Global functions for buttons
        window.generateMap2 = () => example.generateNewMap(2);
        window.generateMap5 = () => example.generateNewMap(5);
        window.generateMap10 = () => example.generateNewMap(10);
        window.generateMap15 = () => example.generateNewMap(15);
        
        init().catch(console.error);
    </script>
</body>
</html>
*/