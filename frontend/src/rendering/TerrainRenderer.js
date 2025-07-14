/**
 * Terrain Renderer - Handles static obstacles and boundaries (Layer 4)
 * 
 * Renders space junk, obstacles, and terrain using tile-based system
 * inspired by SubSpace maps but with modern pixel art style
 */
export class TerrainRenderer {
    /**
     * Initialize terrain renderer
     * @param {CanvasLayerManager} layerManager - Canvas layer manager instance
     * @param {CoordinateSystem} coordinateSystem - Coordinate system instance
     */
    constructor(layerManager, coordinateSystem) {
        this.layerManager = layerManager;
        this.coordinateSystem = coordinateSystem;
        
        // Tile system configuration
        this.TILE_SIZE = 32; // 32x32 pixel tiles
        this.tilemap = [];
        this.tilesetLoaded = false;
        
        // Tile types for space junk theme
        this.tileTypes = {
            EMPTY: 0,
            ASTEROID_SMALL: 1,
            ASTEROID_MEDIUM: 2,
            ASTEROID_LARGE: 3,
            SPACE_JUNK_1: 4,
            SPACE_JUNK_2: 5,
            SPACEPORT_PANEL: 6,
            PIPE_HORIZONTAL: 7,
            PIPE_VERTICAL: 8,
            PIPE_CORNER: 9,
            DEBRIS_FIELD: 10
        };
        
        // Colors for different tile types (until proper sprites are loaded)
        this.tileColors = {
            [this.tileTypes.EMPTY]: null,
            [this.tileTypes.ASTEROID_SMALL]: '#666',
            [this.tileTypes.ASTEROID_MEDIUM]: '#777',
            [this.tileTypes.ASTEROID_LARGE]: '#888',
            [this.tileTypes.SPACE_JUNK_1]: '#994444',
            [this.tileTypes.SPACE_JUNK_2]: '#449944',
            [this.tileTypes.SPACEPORT_PANEL]: '#4444aa',
            [this.tileTypes.PIPE_HORIZONTAL]: '#aa8844',
            [this.tileTypes.PIPE_VERTICAL]: '#aa8844',
            [this.tileTypes.PIPE_CORNER]: '#aa8844',
            [this.tileTypes.DEBRIS_FIELD]: '#555'
        };
        
        this.generateSampleTerrain();
    }
    
    /**
     * Generate sample terrain for testing
     */
    generateSampleTerrain() {
        const worldBounds = this.coordinateSystem.getWorldBounds();
        const tilesX = Math.ceil(worldBounds.width / this.TILE_SIZE);
        const tilesY = Math.ceil(worldBounds.height / this.TILE_SIZE);
        
        // Initialize empty tilemap
        this.tilemap = [];
        for (let y = 0; y < tilesY; y++) {
            this.tilemap[y] = [];
            for (let x = 0; x < tilesX; x++) {
                this.tilemap[y][x] = this.tileTypes.EMPTY;
            }
        }
        
        // Add some sample obstacles
        this.addSampleObstacles(tilesX, tilesY);
    }
    
    /**
     * Add sample obstacles to the terrain
     * @param {number} tilesX - Number of tiles horizontally
     * @param {number} tilesY - Number of tiles vertically
     */
    addSampleObstacles(tilesX, tilesY) {
        // Create some asteroid clusters
        for (let cluster = 0; cluster < 5; cluster++) {
            const centerX = Math.floor(Math.random() * (tilesX - 10)) + 5;
            const centerY = Math.floor(Math.random() * (tilesY - 10)) + 5;
            const radius = 2 + Math.floor(Math.random() * 3);
            
            this.addAsteroidCluster(centerX, centerY, radius);
        }
        
        // Add some pipe structures
        for (let pipe = 0; pipe < 3; pipe++) {
            const startX = Math.floor(Math.random() * (tilesX - 20)) + 10;
            const startY = Math.floor(Math.random() * (tilesY - 20)) + 10;
            
            this.addPipeStructure(startX, startY);
        }
        
        // Add debris fields
        for (let field = 0; field < 8; field++) {
            const x = Math.floor(Math.random() * tilesX);
            const y = Math.floor(Math.random() * tilesY);
            const size = 2 + Math.floor(Math.random() * 4);
            
            this.addDebrisField(x, y, size);
        }
        
        // Add boundary walls
        this.addBoundaryWalls(tilesX, tilesY);
    }
    
    /**
     * Add an asteroid cluster
     * @param {number} centerX - Center X tile coordinate
     * @param {number} centerY - Center Y tile coordinate
     * @param {number} radius - Cluster radius
     */
    addAsteroidCluster(centerX, centerY, radius) {
        for (let y = centerY - radius; y <= centerY + radius; y++) {
            for (let x = centerX - radius; x <= centerX + radius; x++) {
                if (this.isValidTilePosition(x, y)) {
                    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                    if (distance <= radius && Math.random() < 0.7) {
                        let tileType = this.tileTypes.ASTEROID_SMALL;
                        if (distance < radius * 0.3) {
                            tileType = this.tileTypes.ASTEROID_LARGE;
                        } else if (distance < radius * 0.6) {
                            tileType = this.tileTypes.ASTEROID_MEDIUM;
                        }
                        
                        this.setTile(x, y, tileType);
                    }
                }
            }
        }
    }
    
    /**
     * Add a pipe structure
     * @param {number} startX - Starting X coordinate
     * @param {number} startY - Starting Y coordinate
     */
    addPipeStructure(startX, startY) {
        // Create L-shaped pipe
        const direction = Math.random() < 0.5 ? 1 : -1;
        const length = 5 + Math.floor(Math.random() * 5);
        
        // Horizontal segment
        for (let i = 0; i < length; i++) {
            const x = startX + i * direction;
            if (this.isValidTilePosition(x, startY)) {
                this.setTile(x, startY, this.tileTypes.PIPE_HORIZONTAL);
            }
        }
        
        // Vertical segment
        for (let i = 1; i < length - 2; i++) {
            const y = startY + i;
            if (this.isValidTilePosition(startX + (length - 1) * direction, y)) {
                this.setTile(startX + (length - 1) * direction, y, this.tileTypes.PIPE_VERTICAL);
            }
        }
        
        // Corner piece
        if (this.isValidTilePosition(startX + (length - 1) * direction, startY)) {
            this.setTile(startX + (length - 1) * direction, startY, this.tileTypes.PIPE_CORNER);
        }
    }
    
    /**
     * Add a debris field
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} size - Field size
     */
    addDebrisField(x, y, size) {
        for (let dy = 0; dy < size; dy++) {
            for (let dx = 0; dx < size; dx++) {
                if (this.isValidTilePosition(x + dx, y + dy) && Math.random() < 0.4) {
                    const tileType = Math.random() < 0.5 ? 
                        this.tileTypes.DEBRIS_FIELD : 
                        this.tileTypes.SPACE_JUNK_1;
                    this.setTile(x + dx, y + dy, tileType);
                }
            }
        }
    }
    
    /**
     * Add boundary walls around the world
     * @param {number} tilesX - Number of tiles horizontally
     * @param {number} tilesY - Number of tiles vertically
     */
    addBoundaryWalls(tilesX, tilesY) {
        // Top and bottom walls
        for (let x = 0; x < tilesX; x++) {
            this.setTile(x, 0, this.tileTypes.SPACEPORT_PANEL);
            this.setTile(x, tilesY - 1, this.tileTypes.SPACEPORT_PANEL);
        }
        
        // Left and right walls
        for (let y = 0; y < tilesY; y++) {
            this.setTile(0, y, this.tileTypes.SPACEPORT_PANEL);
            this.setTile(tilesX - 1, y, this.tileTypes.SPACEPORT_PANEL);
        }
    }
    
    /**
     * Set a tile at specific coordinates
     * @param {number} tileX - Tile X coordinate
     * @param {number} tileY - Tile Y coordinate
     * @param {number} tileType - Type of tile
     */
    setTile(tileX, tileY, tileType) {
        if (this.isValidTilePosition(tileX, tileY)) {
            this.tilemap[tileY][tileX] = tileType;
        }
    }
    
    /**
     * Get tile at specific coordinates
     * @param {number} tileX - Tile X coordinate
     * @param {number} tileY - Tile Y coordinate
     * @returns {number} Tile type
     */
    getTile(tileX, tileY) {
        if (this.isValidTilePosition(tileX, tileY)) {
            return this.tilemap[tileY][tileX];
        }
        return this.tileTypes.EMPTY;
    }
    
    /**
     * Check if tile position is valid
     * @param {number} tileX - Tile X coordinate
     * @param {number} tileY - Tile Y coordinate
     * @returns {boolean} True if position is valid
     */
    isValidTilePosition(tileX, tileY) {
        return tileX >= 0 && tileX < this.tilemap[0]?.length &&
               tileY >= 0 && tileY < this.tilemap.length;
    }
    
    /**
     * Render the terrain layer
     */
    render() {
        const context = this.layerManager.getLayerContext('terrain');
        if (!context) {
            console.warn('Terrain layer context not found');
            return;
        }
        
        // Clear the layer
        this.layerManager.clearLayer('terrain');
        
        // Get viewport bounds to only render visible tiles
        const viewportBounds = this.coordinateSystem.getViewportBounds();
        
        // Calculate tile range to render
        const startTileX = Math.max(0, Math.floor(viewportBounds.left / this.TILE_SIZE));
        const endTileX = Math.min(this.tilemap[0]?.length || 0, 
                                 Math.ceil(viewportBounds.right / this.TILE_SIZE));
        const startTileY = Math.max(0, Math.floor(viewportBounds.top / this.TILE_SIZE));
        const endTileY = Math.min(this.tilemap.length, 
                                 Math.ceil(viewportBounds.bottom / this.TILE_SIZE));
        
        // Render visible tiles
        for (let tileY = startTileY; tileY < endTileY; tileY++) {
            for (let tileX = startTileX; tileX < endTileX; tileX++) {
                const tileType = this.getTile(tileX, tileY);
                if (tileType !== this.tileTypes.EMPTY) {
                    this.renderTile(context, tileX, tileY, tileType);
                }
            }
        }
    }
    
    /**
     * Render a single tile
     * @param {CanvasRenderingContext2D} context - Canvas context
     * @param {number} tileX - Tile X coordinate
     * @param {number} tileY - Tile Y coordinate
     * @param {number} tileType - Type of tile
     */
    renderTile(context, tileX, tileY, tileType) {
        const worldX = tileX * this.TILE_SIZE;
        const worldY = tileY * this.TILE_SIZE;
        const screenPos = this.coordinateSystem.worldToScreen(worldX, worldY);
        
        // Only render if tile is visible on screen
        if (this.coordinateSystem.rectIntersectsViewport(worldX, worldY, 
                                                         this.TILE_SIZE, this.TILE_SIZE)) {
            const color = this.tileColors[tileType];
            if (color) {
                context.fillStyle = color;
                context.fillRect(
                    Math.floor(screenPos.x),
                    Math.floor(screenPos.y),
                    this.TILE_SIZE,
                    this.TILE_SIZE
                );
                
                // Add simple border for definition
                context.strokeStyle = '#333';
                context.lineWidth = 1;
                context.strokeRect(
                    Math.floor(screenPos.x),
                    Math.floor(screenPos.y),
                    this.TILE_SIZE,
                    this.TILE_SIZE
                );
            }
        }
    }
    
    /**
     * Check for collision at world coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {boolean} True if collision detected
     */
    checkCollision(worldX, worldY) {
        const tileX = Math.floor(worldX / this.TILE_SIZE);
        const tileY = Math.floor(worldY / this.TILE_SIZE);
        const tileType = this.getTile(tileX, tileY);
        
        return tileType !== this.tileTypes.EMPTY;
    }
    
    /**
     * Get tilemap dimensions
     * @returns {{width: number, height: number}} Tilemap dimensions in tiles
     */
    getTilemapDimensions() {
        return {
            width: this.tilemap[0]?.length || 0,
            height: this.tilemap.length
        };
    }
    
    /**
     * Convert world coordinates to tile coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {{x: number, y: number}} Tile coordinates
     */
    worldToTile(worldX, worldY) {
        return {
            x: Math.floor(worldX / this.TILE_SIZE),
            y: Math.floor(worldY / this.TILE_SIZE)
        };
    }
    
    /**
     * Convert tile coordinates to world coordinates
     * @param {number} tileX - Tile X coordinate
     * @param {number} tileY - Tile Y coordinate
     * @returns {{x: number, y: number}} World coordinates
     */
    tileToWorld(tileX, tileY) {
        return {
            x: tileX * this.TILE_SIZE,
            y: tileY * this.TILE_SIZE
        };
    }
}