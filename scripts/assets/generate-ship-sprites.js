#!/usr/bin/env node

/**
 * Ship Sprite Generator
 * 
 * Generates placeholder PNG ship sprites for programmer art.
 * Each sprite is 32x32 pixels with a circle outline and triangle arrow
 * pointing in the facing direction.
 * 
 * Generates 8 variants for different facing directions (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
 */

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Configuration
const SPRITE_SIZE = 32;
const OUTPUT_DIR = path.join(process.cwd(), 'assets', 'ships');
const CIRCLE_RADIUS = 12;
const TRIANGLE_SIZE = 8;

// Colors
const BACKGROUND_COLOR = 'transparent';
const CIRCLE_COLOR = '#00FF00'; // Green outline
const TRIANGLE_COLOR = '#00FF00'; // Green fill
const LINE_WIDTH = 2;

/**
 * Converts degrees to radians
 */
function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}

/**
 * Draws a ship sprite with the given rotation
 * @param {number} rotation - Rotation in degrees (0 = pointing right)
 * @returns {Canvas} The canvas with the drawn sprite
 */
function createShipSprite(rotation) {
    const canvas = createCanvas(SPRITE_SIZE, SPRITE_SIZE);
    const ctx = canvas.getContext('2d');
    
    // Set up the canvas
    ctx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    
    const centerX = SPRITE_SIZE / 2;
    const centerY = SPRITE_SIZE / 2;
    
    // Draw circle outline
    ctx.strokeStyle = CIRCLE_COLOR;
    ctx.lineWidth = LINE_WIDTH;
    ctx.beginPath();
    ctx.arc(centerX, centerY, CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw triangle arrow pointing in the facing direction
    ctx.fillStyle = TRIANGLE_COLOR;
    ctx.strokeStyle = TRIANGLE_COLOR;
    ctx.lineWidth = 1;
    
    // Calculate triangle points based on rotation
    const angleRad = degreesToRadians(rotation);
    
    // Triangle tip (pointing direction)
    const tipX = centerX + Math.cos(angleRad) * TRIANGLE_SIZE;
    const tipY = centerY + Math.sin(angleRad) * TRIANGLE_SIZE;
    
    // Triangle base points (perpendicular to pointing direction)
    const baseAngle1 = angleRad + degreesToRadians(140);
    const baseAngle2 = angleRad + degreesToRadians(220);
    
    const base1X = centerX + Math.cos(baseAngle1) * (TRIANGLE_SIZE * 0.7);
    const base1Y = centerY + Math.sin(baseAngle1) * (TRIANGLE_SIZE * 0.7);
    
    const base2X = centerX + Math.cos(baseAngle2) * (TRIANGLE_SIZE * 0.7);
    const base2Y = centerY + Math.sin(baseAngle2) * (TRIANGLE_SIZE * 0.7);
    
    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(base1X, base1Y);
    ctx.lineTo(base2X, base2Y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    return canvas;
}

/**
 * Generates all ship sprite variants
 */
function generateAllSprites() {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    const directions = [
        { angle: 0, name: 'right' },
        { angle: 45, name: 'down-right' },
        { angle: 90, name: 'down' },
        { angle: 135, name: 'down-left' },
        { angle: 180, name: 'left' },
        { angle: 225, name: 'up-left' },
        { angle: 270, name: 'up' },
        { angle: 315, name: 'up-right' }
    ];
    
    console.log('Generating ship sprites...');
    
    directions.forEach(({ angle, name }) => {
        const canvas = createShipSprite(angle);
        const buffer = canvas.toBuffer('image/png');
        const filename = `ship-${name}-${angle}deg.png`;
        const filepath = path.join(OUTPUT_DIR, filename);
        
        fs.writeFileSync(filepath, buffer);
        console.log(`Generated: ${filename}`);
    });
    
    console.log(`\nAll ship sprites generated successfully!`);
    console.log(`Location: ${OUTPUT_DIR}`);
    console.log(`Total sprites: ${directions.length}`);
}

// Run the generator if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    generateAllSprites();
}

export { generateAllSprites, createShipSprite };