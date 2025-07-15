/**
 * TileAssetManager.js
 * 
 * Manages loading, caching, and rendering of tilemap assets.
 * Handles space junk obstacle tiles and background elements.
 * 
 * Design Philosophy:
 * - Efficient tile caching and reuse
 * - Space-themed assets (panels, pipes, debris, hulls)
 * - Modern pixel art style inspired by SubSpace
 * - Optimized for Canvas rendering
 */

class TileAssetManager {
    constructor() {
        this.tileSize = 32;
        this.assets = new Map();
        this.loadingPromises = new Map();
        this.tileSheets = new Map();
        this.generatedTiles = new Map();
        
        // Tile type definitions
        this.tileTypes = {
            0: { name: 'empty', color: 'transparent' },
            1: { name: 'panels', color: '#4a5568', pattern: 'metal_panel' },
            2: { name: 'pipes', color: '#2d3748', pattern: 'pipe_segment' },
            3: { name: 'debris', color: '#1a202c', pattern: 'scattered_debris' },
            4: { name: 'hulls', color: '#2b6cb0', pattern: 'hull_plating' }
        };
        
        // Asset paths for tile graphics
        this.assetPaths = {
            panels: '/assets/tiles/panels.png',
            pipes: '/assets/tiles/pipes.png', 
            debris: '/assets/tiles/debris.png',
            hulls: '/assets/tiles/hulls.png',
            tilesheet: '/assets/tiles/space_tileset.png'
        };
    }
    
    /**
     * Initialize asset manager and begin loading tiles
     * @returns {Promise} Promise that resolves when all assets are loaded
     */
    async initialize() {
        try {
            // First try to load individual tile assets
            await this.loadTileAssets();
        } catch (error) {
            console.warn('Individual tile assets not found, generating procedural tiles:', error.message);
            // Fall back to procedural generation if assets not available
            this.generateProceduralTiles();
        }
        
        return Promise.resolve();
    }
    
    /**
     * Load tile assets from files
     * @returns {Promise} Promise that resolves when assets are loaded
     */
    async loadTileAssets() {
        const loadPromises = [];
        
        // Load tilesheet if available
        const tilesheetPromise = this.loadImage(this.assetPaths.tilesheet)
            .then(image => {
                this.tileSheets.set('main', image);
                return this.extractTilesFromSheet(image);
            })
            .catch(() => {
                // Tilesheet not available, load individual tiles
                return this.loadIndividualTiles();
            });
        
        loadPromises.push(tilesheetPromise);
        
        return Promise.all(loadPromises);
    }
    
    /**
     * Load individual tile images
     * @returns {Promise} Promise that resolves when individual tiles are loaded
     */
    async loadIndividualTiles() {
        const loadPromises = Object.entries(this.assetPaths).map(([key, path]) => {
            if (key === 'tilesheet') return Promise.resolve();
            
            return this.loadImage(path)
                .then(image => {
                    this.assets.set(key, image);
                })
                .catch(error => {
                    console.warn(`Failed to load ${key} tile:`, error.message);
                    // Generate fallback tile
                    this.generateFallbackTile(key);
                });
        });
        
        return Promise.all(loadPromises);
    }
    
    /**
     * Load image from path
     * @param {string} path - Image path
     * @returns {Promise<Image>} Promise that resolves with loaded image
     */
    loadImage(path) {
        if (this.loadingPromises.has(path)) {
            return this.loadingPromises.get(path);
        }
        
        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
            img.src = path;
        });
        
        this.loadingPromises.set(path, promise);
        return promise;
    }
    
    /**
     * Extract individual tiles from a tilesheet
     * @param {Image} tilesheet - Loaded tilesheet image
     */
    extractTilesFromSheet(tilesheet) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        
        // Assuming 4x4 tilesheet layout (16 tiles total)
        const tilesPerRow = Math.floor(tilesheet.width / this.tileSize);
        const tilesPerColumn = Math.floor(tilesheet.height / this.tileSize);
        
        let tileIndex = 0;
        for (let row = 0; row < tilesPerColumn && tileIndex < 4; row++) {
            for (let col = 0; col < tilesPerRow && tileIndex < 4; col++) {
                // Clear canvas
                ctx.clearRect(0, 0, this.tileSize, this.tileSize);
                
                // Extract tile
                ctx.drawImage(
                    tilesheet,
                    col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize,
                    0, 0, this.tileSize, this.tileSize
                );
                
                // Store extracted tile
                const tileType = Object.keys(this.tileTypes)[tileIndex + 1]; // Skip empty tile
                if (tileType && this.tileTypes[tileType]) {
                    const extractedCanvas = document.createElement('canvas');
                    extractedCanvas.width = this.tileSize;
                    extractedCanvas.height = this.tileSize;
                    const extractedCtx = extractedCanvas.getContext('2d');
                    extractedCtx.drawImage(canvas, 0, 0);
                    
                    this.assets.set(this.tileTypes[tileType].name, extractedCanvas);
                }
                
                tileIndex++;
            }
        }
    }
    
    /**
     * Generate procedural tiles when assets are not available
     */
    generateProceduralTiles() {
        Object.entries(this.tileTypes).forEach(([id, tileType]) => {
            if (id === '0') return; // Skip empty tile
            
            const canvas = this.generateTileCanvas(tileType);
            this.assets.set(tileType.name, canvas);
            this.generatedTiles.set(tileType.name, true);
        });
    }
    
    /**
     * Generate a canvas for a specific tile type
     * @param {object} tileType - Tile type configuration
     * @returns {HTMLCanvasElement} Generated tile canvas
     */
    generateTileCanvas(tileType) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        
        switch (tileType.pattern) {
        case 'metal_panel':
            this.drawMetalPanel(ctx);
            break;
        case 'pipe_segment':
            this.drawPipeSegment(ctx);
            break;
        case 'scattered_debris':
            this.drawScatteredDebris(ctx);
            break;
        case 'hull_plating':
            this.drawHullPlating(ctx);
            break;
        default:
            this.drawSolidTile(ctx, tileType.color);
        }
        
        return canvas;
    }
    
    /**
     * Draw metal panel pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawMetalPanel(ctx) {
        const size = this.tileSize;
        
        // Base metal color
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(0, 0, size, size);
        
        // Panel lines
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(4, 4);
        ctx.lineTo(size - 4, 4);
        ctx.lineTo(size - 4, size - 4);
        ctx.lineTo(4, size - 4);
        ctx.closePath();
        ctx.stroke();
        
        // Rivets
        ctx.fillStyle = '#718096';
        ctx.beginPath();
        ctx.arc(8, 8, 2, 0, Math.PI * 2);
        ctx.arc(size - 8, 8, 2, 0, Math.PI * 2);
        ctx.arc(8, size - 8, 2, 0, Math.PI * 2);
        ctx.arc(size - 8, size - 8, 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    /**
     * Draw pipe segment pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawPipeSegment(ctx) {
        const size = this.tileSize;
        
        // Base pipe color
        ctx.fillStyle = '#2d3748';
        ctx.fillRect(0, 0, size, size);
        
        // Pipe body
        ctx.fillStyle = '#4a5568';
        ctx.fillRect(6, 6, size - 12, size - 12);
        
        // Pipe highlights
        ctx.strokeStyle = '#718096';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(6, 8);
        ctx.lineTo(size - 6, 8);
        ctx.moveTo(8, 6);
        ctx.lineTo(8, size - 6);
        ctx.stroke();
        
        // Connection points
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(0, size / 2 - 3, 6, 6);
        ctx.fillRect(size - 6, size / 2 - 3, 6, 6);
        ctx.fillRect(size / 2 - 3, 0, 6, 6);
        ctx.fillRect(size / 2 - 3, size - 6, 6, 6);
    }
    
    /**
     * Draw scattered debris pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawScatteredDebris(ctx) {
        const size = this.tileSize;
        
        // Dark background
        ctx.fillStyle = '#1a202c';
        ctx.fillRect(0, 0, size, size);
        
        // Random debris pieces
        ctx.fillStyle = '#4a5568';
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * (size - 4);
            const y = Math.random() * (size - 4);
            const w = 2 + Math.random() * 6;
            const h = 2 + Math.random() * 6;
            ctx.fillRect(x, y, w, h);
        }
        
        // Smaller debris
        ctx.fillStyle = '#718096';
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    
    /**
     * Draw hull plating pattern
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawHullPlating(ctx) {
        const size = this.tileSize;
        
        // Base hull color
        ctx.fillStyle = '#2b6cb0';
        ctx.fillRect(0, 0, size, size);
        
        // Plating lines
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, size / 3);
        ctx.lineTo(size, size / 3);
        ctx.moveTo(0, 2 * size / 3);
        ctx.lineTo(size, 2 * size / 3);
        ctx.moveTo(size / 3, 0);
        ctx.lineTo(size / 3, size);
        ctx.moveTo(2 * size / 3, 0);
        ctx.lineTo(2 * size / 3, size);
        ctx.stroke();
        
        // Hull damage
        ctx.fillStyle = '#1a365d';
        ctx.fillRect(size / 2 - 2, size / 4, 4, 2);
        ctx.fillRect(3 * size / 4, 3 * size / 4, 3, 2);
    }
    
    /**
     * Draw solid colored tile
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {string} color - Tile color
     */
    drawSolidTile(ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.tileSize, this.tileSize);
    }
    
    /**
     * Generate fallback tile for missing assets
     * @param {string} tileKey - Tile type key
     */
    generateFallbackTile(tileKey) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.tileSize;
        canvas.height = this.tileSize;
        
        // Find tile type by name
        const tileType = Object.values(this.tileTypes).find(t => t.name === tileKey);
        if (tileType) {
            this.drawSolidTile(ctx, tileType.color);
        } else {
            this.drawSolidTile(ctx, '#666666');
        }
        
        this.assets.set(tileKey, canvas);
        this.generatedTiles.set(tileKey, true);
    }
    
    /**
     * Get tile asset for rendering
     * @param {number} tileId - Tile type ID
     * @returns {HTMLCanvasElement|Image|null} Tile asset
     */
    getTile(tileId) {
        const tileType = this.tileTypes[tileId];
        if (!tileType || tileId === 0) return null; // Empty tile
        
        return this.assets.get(tileType.name);
    }
    
    /**
     * Get tile name by ID
     * @param {number} tileId - Tile type ID
     * @returns {string} Tile name
     */
    getTileName(tileId) {
        const tileType = this.tileTypes[tileId];
        return tileType ? tileType.name : 'empty';
    }
    
    /**
     * Check if asset manager is ready
     * @returns {boolean} True if all assets are loaded
     */
    isReady() {
        // Check if we have at least the basic tile types
        const requiredTiles = ['panels', 'pipes', 'debris', 'hulls'];
        return requiredTiles.every(tile => this.assets.has(tile));
    }
    
    /**
     * Get loading progress
     * @returns {number} Loading progress (0-1)
     */
    getLoadingProgress() {
        const totalAssets = Object.keys(this.assetPaths).length;
        const loadedAssets = this.assets.size;
        return Math.min(1, loadedAssets / totalAssets);
    }
    
    /**
     * Cleanup assets
     */
    cleanup() {
        this.assets.clear();
        this.loadingPromises.clear();
        this.tileSheets.clear();
        this.generatedTiles.clear();
    }
}

export default TileAssetManager;