/**
 * Coordinate System - World to viewport mapping for fixed 1024x768 viewport
 * 
 * Handles conversion between world coordinates and screen coordinates
 * for the fixed viewport rendering system
 */
export class CoordinateSystem {
    /**
     * Initialize coordinate system
     * @param {number} viewportWidth - Viewport width (1024)
     * @param {number} viewportHeight - Viewport height (768)
     */
    constructor(viewportWidth = 1024, viewportHeight = 768) {
        this.VIEWPORT_WIDTH = viewportWidth;
        this.VIEWPORT_HEIGHT = viewportHeight;
        
        // Camera position in world coordinates
        this.cameraX = 0;
        this.cameraY = 0;
        
        // World bounds (can be larger than viewport)
        this.worldWidth = 5120;  // 5x viewport width (max from game design)
        this.worldHeight = 3840; // 5x viewport height (max from game design)
    }
    
    /**
     * Set camera position in world coordinates (top-left offset)
     * @param {number} x - Camera X offset (top-left corner)
     * @param {number} y - Camera Y offset (top-left corner)
     */
    setCameraPosition(x, y) {
        // Clamp camera to world bounds (classic 2D camera system)
        this.cameraX = Math.max(0, Math.min(this.worldWidth - this.VIEWPORT_WIDTH, x));
        this.cameraY = Math.max(0, Math.min(this.worldHeight - this.VIEWPORT_HEIGHT, y));
    }
    
    /**
     * Get current camera position
     * @returns {{x: number, y: number}} Camera position in world coordinates
     */
    getCameraPosition() {
        return { x: this.cameraX, y: this.cameraY };
    }
    
    /**
     * Convert world coordinates to screen coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {{x: number, y: number}} Screen coordinates
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.cameraX,
            y: worldY - this.cameraY
        };
    }
    
    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {{x: number, y: number}} World coordinates
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.cameraX,
            y: screenY + this.cameraY
        };
    }
    
    /**
     * Get viewport bounds in world coordinates
     * @returns {{left: number, top: number, right: number, bottom: number}}
     */
    getViewportBounds() {
        // Camera position is top-left offset, so bounds are straightforward
        return {
            left: this.cameraX,
            top: this.cameraY,
            right: this.cameraX + this.VIEWPORT_WIDTH,
            bottom: this.cameraY + this.VIEWPORT_HEIGHT
        };
    }
    
    /**
     * Check if a world point is visible in the viewport
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @param {number} margin - Additional margin for culling
     * @returns {boolean} True if point is visible
     */
    isInViewport(worldX, worldY, margin = 0) {
        const bounds = this.getViewportBounds();
        return worldX >= bounds.left - margin &&
               worldX <= bounds.right + margin &&
               worldY >= bounds.top - margin &&
               worldY <= bounds.bottom + margin;
    }
    
    /**
     * Check if a world rectangle intersects the viewport
     * @param {number} worldX - World X coordinate of rectangle
     * @param {number} worldY - World Y coordinate of rectangle
     * @param {number} width - Rectangle width
     * @param {number} height - Rectangle height
     * @param {number} margin - Additional margin for culling
     * @returns {boolean} True if rectangle intersects viewport
     */
    rectIntersectsViewport(worldX, worldY, width, height, margin = 0) {
        const bounds = this.getViewportBounds();
        
        return !(worldX + width < bounds.left - margin ||
                worldX > bounds.right + margin ||
                worldY + height < bounds.top - margin ||
                worldY > bounds.bottom + margin);
    }
    
    /**
     * Get the center of the viewport in world coordinates
     * @returns {{x: number, y: number}} Center position in world coordinates
     */
    getViewportCenter() {
        return { x: this.cameraX, y: this.cameraY };
    }
    
    /**
     * Move camera by relative offset
     * @param {number} deltaX - X offset
     * @param {number} deltaY - Y offset
     */
    moveCamera(deltaX, deltaY) {
        this.setCameraPosition(this.cameraX + deltaX, this.cameraY + deltaY);
    }
    
    /**
     * Set world bounds for camera clamping
     * @param {number} width - World width
     * @param {number} height - World height
     */
    setWorldBounds(width, height) {
        this.worldWidth = Math.max(width, this.VIEWPORT_WIDTH);
        this.worldHeight = Math.max(height, this.VIEWPORT_HEIGHT);
        
        // Re-clamp camera position to new bounds
        this.setCameraPosition(this.cameraX, this.cameraY);
    }
    
    /**
     * Get world bounds
     * @returns {{width: number, height: number}}
     */
    getWorldBounds() {
        return {
            width: this.worldWidth,
            height: this.worldHeight
        };
    }
    
    /**
     * Calculate parallax offset for a given scroll rate
     * @param {number} scrollRate - Parallax scroll rate (0.0 to 1.0)
     * @returns {{x: number, y: number}} Parallax offset
     */
    getParallaxOffset(scrollRate) {
        return {
            x: this.cameraX * scrollRate,
            y: this.cameraY * scrollRate
        };
    }
    
    /**
     * Convert world coordinates to screen with parallax offset
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @param {number} scrollRate - Parallax scroll rate
     * @returns {{x: number, y: number}} Screen coordinates with parallax
     */
    worldToScreenParallax(worldX, worldY, scrollRate) {
        const offset = this.getParallaxOffset(scrollRate);
        return {
            x: worldX - offset.x + this.VIEWPORT_WIDTH / 2,
            y: worldY - offset.y + this.VIEWPORT_HEIGHT / 2
        };
    }
}