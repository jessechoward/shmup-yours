/**
 * MapGenerator.js
 * 
 * Handles procedural generation and scaling of game maps based on player count.
 * Maps scale from 2-5 screen areas (2048x1536 to 5120x3840) using tilemap system.
 * 
 * Design Philosophy:
 * - Paintball arena with strategic cover
 * - Space junk obstacles (panels, pipes, debris)
 * - No safe hiding spots - always potential combat
 * - Floating boundaries prevent infinite drift
 */

class MapGenerator {
    constructor() {
        // Base screen dimensions
        this.BASE_SCREEN_WIDTH = 1024;
        this.BASE_SCREEN_HEIGHT = 768;
        
        // Tile dimensions for consistent collision detection
        this.TILE_SIZE = 32;
        
        // Map scaling configuration
        this.MIN_SCREENS = 2;
        this.MAX_SCREENS = 5;
        
        // Obstacle density parameters
        this.OBSTACLE_DENSITY = {
            LOW: 0.15,    // 15% coverage
            MEDIUM: 0.25, // 25% coverage  
            HIGH: 0.35    // 35% coverage
        };
        
        // Boundary parameters
        this.BOUNDARY_WIDTH = 64; // Floating boundary thickness
        this.BOUNDARY_FORCE = 500; // Force applied to push players back
    }
    
    /**
     * Generate map based on player count
     * @param {number} playerCount - Number of active players (2-20)
     * @returns {Object} Complete map configuration
     */
    generateMap(playerCount) {
        const mapSize = this.calculateMapSize(playerCount);
        const obstacleLayout = this.generateObstacleLayout(mapSize, playerCount);
        const boundaries = this.generateBoundarySystem(mapSize);
        const backgroundLayers = this.generateBackgroundLayers(mapSize);
        
        return {
            dimensions: mapSize,
            obstacles: obstacleLayout,
            boundaries: boundaries,
            backgroundLayers: backgroundLayers,
            tilemap: this.generateTilemap(mapSize, obstacleLayout),
            metadata: {
                playerCount: playerCount,
                generatedAt: Date.now(),
                version: '1.0.0'
            }
        };
    }
    
    /**
     * Calculate map dimensions based on player count
     * @param {number} playerCount 
     * @returns {Object} Map dimensions
     */
    calculateMapSize(playerCount) {
        // Scale factor based on player count
        // 2-4 players = 2 screens, 5-8 = 3 screens, 9-12 = 4 screens, 13+ = 5 screens
        let screens;
        if (playerCount <= 4) screens = 2;
        else if (playerCount <= 8) screens = 3;
        else if (playerCount <= 12) screens = 4;
        else screens = 5;
        
        // Clamp to min/max
        screens = Math.max(this.MIN_SCREENS, Math.min(this.MAX_SCREENS, screens));
        
        // Calculate dimensions (square-ish aspect ratio)
        const baseArea = this.BASE_SCREEN_WIDTH * this.BASE_SCREEN_HEIGHT;
        const totalArea = baseArea * screens;
        const aspectRatio = 4/3; // Maintain 4:3 aspect ratio
        
        const width = Math.sqrt(totalArea * aspectRatio);
        const height = Math.sqrt(totalArea / aspectRatio);
        
        // Round to tile boundaries
        const tiledWidth = Math.ceil(width / this.TILE_SIZE) * this.TILE_SIZE;
        const tiledHeight = Math.ceil(height / this.TILE_SIZE) * this.TILE_SIZE;
        
        return {
            width: tiledWidth,
            height: tiledHeight,
            screens: screens,
            tileWidth: tiledWidth / this.TILE_SIZE,
            tileHeight: tiledHeight / this.TILE_SIZE
        };
    }
    
    /**
     * Generate strategic obstacle layout using space junk theme
     * @param {Object} mapSize - Map dimensions
     * @param {number} playerCount - Number of players for density calculation
     * @returns {Array} Array of obstacle definitions
     */
    generateObstacleLayout(mapSize, playerCount) {
        const obstacles = [];
        
        // Determine obstacle density based on player count
        let density;
        if (playerCount <= 4) density = this.OBSTACLE_DENSITY.LOW;
        else if (playerCount <= 8) density = this.OBSTACLE_DENSITY.MEDIUM;
        else density = this.OBSTACLE_DENSITY.HIGH;
        
        // Calculate total obstacle tiles
        const totalTiles = mapSize.tileWidth * mapSize.tileHeight;
        const obstacleTiles = Math.floor(totalTiles * density);
        
        // Generate obstacle clusters for strategic gameplay
        const clusters = this.generateObstacleClusters(mapSize, obstacleTiles);
        
        // Convert clusters to individual obstacle tiles
        clusters.forEach(cluster => {
            cluster.tiles.forEach(tile => {
                obstacles.push({
                    x: tile.x * this.TILE_SIZE,
                    y: tile.y * this.TILE_SIZE,
                    width: this.TILE_SIZE,
                    height: this.TILE_SIZE,
                    type: cluster.type,
                    tileX: tile.x,
                    tileY: tile.y
                });
            });
        });
        
        return obstacles;
    }
    
    /**
     * Generate obstacle clusters for strategic cover placement
     * @param {Object} mapSize - Map dimensions
     * @param {number} targetTiles - Target number of obstacle tiles
     * @returns {Array} Array of obstacle clusters
     */
    generateObstacleClusters(mapSize, targetTiles) {
        const clusters = [];
        const obstacleTypes = ['panels', 'pipes', 'debris', 'hulls'];
        let tilesPlaced = 0;
        
        // Calculate appropriate number of clusters
        // Aim for clusters of 4-8 tiles each, so divide target by average cluster size
        const avgClusterSize = 6;
        const numClusters = Math.ceil(targetTiles / avgClusterSize);
        
        for (let i = 0; i < numClusters && tilesPlaced < targetTiles; i++) {
            const cluster = {
                type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)],
                centerX: Math.floor(Math.random() * mapSize.tileWidth),
                centerY: Math.floor(Math.random() * mapSize.tileHeight),
                tiles: []
            };
            
            // Generate cluster shape (L-shaped, linear, or compact)
            const clusterShape = ['l_shape', 'linear', 'compact'][Math.floor(Math.random() * 3)];
            
            // Calculate remaining tiles needed
            const remainingTiles = targetTiles - tilesPlaced;
            const remainingClusters = numClusters - i;
            const targetClusterSize = Math.min(8, Math.max(2, Math.floor(remainingTiles / remainingClusters)));
            
            cluster.tiles = this.generateClusterTiles(cluster.centerX, cluster.centerY, clusterShape, targetClusterSize, mapSize);
            tilesPlaced += cluster.tiles.length;
            
            clusters.push(cluster);
        }
        
        return clusters;
    }
    
    /**
     * Generate tiles for a specific cluster shape
     * @param {number} centerX - Cluster center X coordinate  
     * @param {number} centerY - Cluster center Y coordinate
     * @param {string} shape - Cluster shape type
     * @param {number} size - Number of tiles in cluster
     * @param {Object} mapSize - Map boundaries
     * @returns {Array} Array of tile coordinates
     */
    generateClusterTiles(centerX, centerY, shape, size, mapSize) {
        const tiles = [];
        
        switch (shape) {
            case 'l_shape':
                // Create L-shaped cover
                for (let i = 0; i < Math.min(size, 6); i++) {
                    if (i < 3) {
                        tiles.push({ x: centerX + i, y: centerY });
                    } else {
                        tiles.push({ x: centerX, y: centerY + (i - 2) });
                    }
                }
                break;
                
            case 'linear':
                // Create linear cover (horizontal or vertical)
                const horizontal = Math.random() > 0.5;
                for (let i = 0; i < Math.min(size, 5); i++) {
                    if (horizontal) {
                        tiles.push({ x: centerX + i - 2, y: centerY });
                    } else {
                        tiles.push({ x: centerX, y: centerY + i - 2 });
                    }
                }
                break;
                
            case 'compact':
                // Create compact 2x2 or 3x3 cover
                const compactSize = size <= 4 ? 2 : 3;
                for (let x = 0; x < compactSize; x++) {
                    for (let y = 0; y < compactSize; y++) {
                        if (tiles.length < size) {
                            tiles.push({ x: centerX + x - 1, y: centerY + y - 1 });
                        }
                    }
                }
                break;
        }
        
        // Filter tiles to ensure they're within map bounds
        return tiles.filter(tile => 
            tile.x >= 0 && tile.x < mapSize.tileWidth &&
            tile.y >= 0 && tile.y < mapSize.tileHeight
        );
    }
    
    /**
     * Generate floating boundary system to prevent infinite drift
     * @param {Object} mapSize - Map dimensions
     * @returns {Object} Boundary configuration
     */
    generateBoundarySystem(mapSize) {
        return {
            type: 'floating',
            boundaries: [
                // Top boundary
                {
                    x: 0,
                    y: -this.BOUNDARY_WIDTH,
                    width: mapSize.width,
                    height: this.BOUNDARY_WIDTH,
                    force: { x: 0, y: this.BOUNDARY_FORCE },
                    direction: 'down'
                },
                // Bottom boundary  
                {
                    x: 0,
                    y: mapSize.height,
                    width: mapSize.width,
                    height: this.BOUNDARY_WIDTH,
                    force: { x: 0, y: -this.BOUNDARY_FORCE },
                    direction: 'up'
                },
                // Left boundary
                {
                    x: -this.BOUNDARY_WIDTH,
                    y: 0,
                    width: this.BOUNDARY_WIDTH,
                    height: mapSize.height,
                    force: { x: this.BOUNDARY_FORCE, y: 0 },
                    direction: 'right'
                },
                // Right boundary
                {
                    x: mapSize.width,
                    y: 0,
                    width: this.BOUNDARY_WIDTH,
                    height: mapSize.height,
                    force: { x: -this.BOUNDARY_FORCE, y: 0 },
                    direction: 'left'
                }
            ]
        };
    }
    
    /**
     * Generate parallax background layers for visual depth
     * @param {Object} mapSize - Map dimensions
     * @returns {Array} Background layer configuration
     */
    generateBackgroundLayers(mapSize) {
        return [
            {
                id: 'stars_far',
                scrollRate: 0.1,
                density: 'sparse',
                starCount: Math.floor(mapSize.width * mapSize.height / 50000),
                parallaxX: 0.1,
                parallaxY: 0.1
            },
            {
                id: 'stars_medium', 
                scrollRate: 0.3,
                density: 'medium',
                starCount: Math.floor(mapSize.width * mapSize.height / 30000),
                parallaxX: 0.3,
                parallaxY: 0.3
            },
            {
                id: 'stars_near',
                scrollRate: 0.6,
                density: 'dense',
                starCount: Math.floor(mapSize.width * mapSize.height / 20000),
                parallaxX: 0.6,
                parallaxY: 0.6
            }
        ];
    }
    
    /**
     * Generate tilemap data structure for rendering and collision
     * @param {Object} mapSize - Map dimensions
     * @param {Array} obstacles - Obstacle layout
     * @returns {Object} Tilemap configuration
     */
    generateTilemap(mapSize, obstacles) {
        // Create empty tilemap grid
        const grid = Array(mapSize.tileHeight).fill(null).map(() => 
            Array(mapSize.tileWidth).fill(0)
        );
        
        // Place obstacles in tilemap
        obstacles.forEach(obstacle => {
            if (obstacle.tileX >= 0 && obstacle.tileX < mapSize.tileWidth &&
                obstacle.tileY >= 0 && obstacle.tileY < mapSize.tileHeight) {
                grid[obstacle.tileY][obstacle.tileX] = this.getTileIdForObstacle(obstacle.type);
            }
        });
        
        return {
            width: mapSize.tileWidth,
            height: mapSize.tileHeight,
            tileSize: this.TILE_SIZE,
            grid: grid,
            tileTypes: {
                0: 'empty',
                1: 'panels',
                2: 'pipes', 
                3: 'debris',
                4: 'hulls'
            }
        };
    }
    
    /**
     * Get tile ID for obstacle type
     * @param {string} obstacleType - Type of obstacle
     * @returns {number} Tile ID
     */
    getTileIdForObstacle(obstacleType) {
        const typeMap = {
            'panels': 1,
            'pipes': 2,
            'debris': 3,
            'hulls': 4
        };
        return typeMap[obstacleType] || 1;
    }
}

export default MapGenerator;