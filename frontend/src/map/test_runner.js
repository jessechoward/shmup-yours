/**
 * Test runner for Map Generation and Boundary System
 * 
 * Simple validation tests to ensure the architecture works correctly.
 * Run with: node frontend/src/map/test_runner.js
 */

// Mock Canvas API for Node.js testing
global.Image = class {
    constructor() {
        this.onload = null;
        this.onerror = null;
        this.src = '';
        this.width = 32;
        this.height = 32;
    }
};

global.document = {
    createElement: (tag) => {
        if (tag === 'canvas') {
            return {
                width: 32,
                height: 32,
                getContext: () => ({
                    clearRect: () => {},
                    drawImage: () => {},
                    fillRect: () => {},
                    strokeRect: () => {},
                    beginPath: () => {},
                    moveTo: () => {},
                    lineTo: () => {},
                    closePath: () => {},
                    stroke: () => {},
                    fill: () => {},
                    arc: () => {},
                    setLineDash: () => {},
                    save: () => {},
                    restore: () => {},
                    translate: () => {},
                    scale: () => {},
                    fillStyle: '#000000',
                    strokeStyle: '#000000',
                    lineWidth: 1,
                    font: '12px Arial'
                })
            };
        }
        return {};
    }
};

// Mock Planck.js for testing
const mockPhysicsWorld = {
    createBody: (def) => ({
        createFixture: (fixtureDef) => ({
            getUserData: () => fixtureDef.userData
        }),
        getUserData: () => def.userData,
        isActive: () => true,
        getPosition: () => ({ x: 0, y: 0 }),
        applyForce: () => {}
    }),
    destroyBody: () => {},
    Box: (w, h) => ({ width: w * 2, height: h * 2 })
};

// Import the modules
import MapGenerator from './MapGenerator.js';
import BoundarySystem from './BoundarySystem.js';
import TileAssetManager from './TileAssetManager.js';
import MapSystem from './MapSystem.js';

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    test(name, testFn) {
        this.tests.push({ name, fn: testFn });
    }
    
    async run() {
        console.log('🚀 Running Map System Tests\n');
        
        for (const test of this.tests) {
            try {
                await test.fn();
                console.log(`✅ ${test.name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${test.name}: ${error.message}`);
                this.failed++;
            }
        }
        
        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
    
    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }
    
    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}: expected ${expected}, got ${actual}`);
        }
    }
    
    assertRange(value, min, max, message) {
        if (value < min || value > max) {
            throw new Error(`${message}: expected ${value} to be between ${min} and ${max}`);
        }
    }
}

const runner = new TestRunner();

// Test MapGenerator
runner.test('MapGenerator - Player count scaling', () => {
    const generator = new MapGenerator();
    
    // Test 2 players (should be 2 screens)
    const map2 = generator.generateMap(2);
    runner.assertEqual(map2.dimensions.screens, 2, 'Map for 2 players should be 2 screens');
    
    // Test 5 players (should be 3 screens)
    const map5 = generator.generateMap(5);
    runner.assertEqual(map5.dimensions.screens, 3, 'Map for 5 players should be 3 screens');
    
    // Test 10 players (should be 4 screens)
    const map10 = generator.generateMap(10);
    runner.assertEqual(map10.dimensions.screens, 4, 'Map for 10 players should be 4 screens');
    
    // Test 15 players (should be 5 screens)
    const map15 = generator.generateMap(15);
    runner.assertEqual(map15.dimensions.screens, 5, 'Map for 15 players should be 5 screens');
    
    console.log('  📏 Map dimensions test passed');
});

runner.test('MapGenerator - Obstacle density', () => {
    const generator = new MapGenerator();
    
    // Test low density (2 players)
    const map2 = generator.generateMap(2);
    const totalTiles2 = map2.dimensions.tileWidth * map2.dimensions.tileHeight;
    const obstacleRatio2 = map2.obstacles.length / totalTiles2;
    runner.assertRange(obstacleRatio2, 0.1, 0.2, 'Low density should be around 15%');
    
    // Test high density (15 players)
    const map15 = generator.generateMap(15);
    const totalTiles15 = map15.dimensions.tileWidth * map15.dimensions.tileHeight;
    const obstacleRatio15 = map15.obstacles.length / totalTiles15;
    runner.assertRange(obstacleRatio15, 0.3, 0.4, 'High density should be around 35%');
    
    console.log('  🎯 Obstacle density test passed');
});

runner.test('MapGenerator - Boundary system', () => {
    const generator = new MapGenerator();
    const map = generator.generateMap(4);
    
    runner.assertEqual(map.boundaries.type, 'floating', 'Should use floating boundaries');
    runner.assertEqual(map.boundaries.boundaries.length, 4, 'Should have 4 boundaries (top, bottom, left, right)');
    
    // Check boundary directions
    const directions = map.boundaries.boundaries.map(b => b.direction);
    runner.assert(directions.includes('up'), 'Should have up boundary');
    runner.assert(directions.includes('down'), 'Should have down boundary');
    runner.assert(directions.includes('left'), 'Should have left boundary');
    runner.assert(directions.includes('right'), 'Should have right boundary');
    
    console.log('  🚧 Boundary system test passed');
});

runner.test('MapGenerator - Tilemap generation', () => {
    const generator = new MapGenerator();
    const map = generator.generateMap(4);
    
    runner.assert(map.tilemap, 'Should generate tilemap');
    runner.assertEqual(map.tilemap.tileSize, 32, 'Tile size should be 32');
    runner.assert(Array.isArray(map.tilemap.grid), 'Grid should be an array');
    runner.assert(map.tilemap.grid.length > 0, 'Grid should not be empty');
    runner.assert(Array.isArray(map.tilemap.grid[0]), 'Grid rows should be arrays');
    
    console.log('  🗺️ Tilemap generation test passed');
});

runner.test('BoundarySystem - Initialization', () => {
    const boundary = new BoundarySystem(mockPhysicsWorld);
    const generator = new MapGenerator();
    const map = generator.generateMap(4);
    
    boundary.initialize(map.boundaries);
    runner.assertEqual(boundary.boundaries.length, 4, 'Should initialize with 4 boundaries');
    
    console.log('  🏁 Boundary system initialization test passed');
});

runner.test('BoundarySystem - Force calculation', () => {
    const boundary = new BoundarySystem(mockPhysicsWorld);
    
    // Test force calculation
    const testBoundary = {
        direction: 'down',
        force: { x: 0, y: 500 },
        x: 0, y: 0, width: 100, height: 64
    };
    
    const force = boundary.calculateBoundaryForce(16, testBoundary); // Half distance
    runner.assert(force.y > 0, 'Force should be positive for down boundary');
    runner.assert(force.y < 500, 'Force should be less than maximum at half distance');
    
    console.log('  ⚡ Boundary force calculation test passed');
});

runner.test('TileAssetManager - Procedural generation', () => {
    const assetManager = new TileAssetManager();
    
    // Test procedural generation directly
    assetManager.generateProceduralTiles();
    runner.assert(assetManager.isReady(), 'Asset manager should be ready after procedural generation');
    
    // Test tile retrieval
    const panelTile = assetManager.getTile(1); // panels
    runner.assert(panelTile, 'Should have panel tile');
    
    const pipeTile = assetManager.getTile(2); // pipes
    runner.assert(pipeTile, 'Should have pipe tile');
    
    console.log('  🎨 Asset manager procedural generation test passed');
});

runner.test('MapSystem - Synchronous operations', () => {
    const mapSystem = new MapSystem(mockPhysicsWorld);
    
    // Test without full async initialization
    mapSystem.isInitialized = true;
    mapSystem.isReady = true;
    mapSystem.assetManager.generateProceduralTiles();
    
    const map = mapSystem.mapGenerator.generateMap(6);
    runner.assert(map, 'Should generate map');
    runner.assertEqual(map.dimensions.screens, 3, 'Should generate 3-screen map for 6 players');
    
    // Set current map and test physics configuration
    mapSystem.currentMap = map;
    const physicsConfig = mapSystem.getPhysicsConfiguration();
    runner.assert(physicsConfig, 'Should provide physics configuration');
    runner.assert(physicsConfig.obstacles, 'Should include obstacles');
    runner.assert(physicsConfig.boundaries, 'Should include boundaries');
    
    console.log('  🎮 Map system operations test passed');
});

// Run all tests
runner.run().then(success => {
    if (success) {
        console.log('\n🎉 All tests passed! Map system is working correctly.');
        process.exit(0);
    } else {
        console.log('\n💥 Some tests failed. Please check the implementation.');
        process.exit(1);
    }
}).catch(error => {
    console.error('\n💥 Test runner error:', error);
    process.exit(1);
});