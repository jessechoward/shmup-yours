# Ship Sprite Generation

This document describes the process and implementation for generating placeholder PNG ship sprites for the shmup-yours game.

## Overview

The ship sprite generator creates 32x32 pixel PNG images that serve as programmer art placeholders. Each sprite features:
- A circle outline (green, 2px line width)
- A triangle arrow pointing in the facing direction (green fill)
- Transparent background
- 8 directional variants (45-degree increments)

## Generated Sprites

The following 8 ship sprites are generated:

| Direction | Angle | Filename |
|-----------|-------|----------|
| Right | 0° | `ship-right-0deg.png` |
| Down-Right | 45° | `ship-down-right-45deg.png` |
| Down | 90° | `ship-down-90deg.png` |
| Down-Left | 135° | `ship-down-left-135deg.png` |
| Left | 180° | `ship-left-180deg.png` |
| Up-Left | 225° | `ship-up-left-225deg.png` |
| Up | 270° | `ship-up-270deg.png` |
| Up-Right | 315° | `ship-up-right-315deg.png` |

## Implementation

### Dependencies

- **canvas**: Node.js library for creating and manipulating HTML5 Canvas elements
- Added as a dev dependency to the root workspace

### Generation Script

Location: `scripts/assets/generate-ship-sprites.js`

The script uses the following approach:
1. Creates a 32x32 canvas for each sprite
2. Draws a circle outline with 12px radius at the center
3. Calculates triangle points based on the rotation angle
4. Draws a filled triangle arrow pointing in the specified direction
5. Saves each sprite as a PNG file to `assets/ships/`

### Configuration

Key parameters in the generation script:
- `SPRITE_SIZE`: 32 pixels (width and height)
- `CIRCLE_RADIUS`: 12 pixels
- `TRIANGLE_SIZE`: 8 pixels
- `CIRCLE_COLOR`: #00FF00 (green)
- `TRIANGLE_COLOR`: #00FF00 (green)
- `LINE_WIDTH`: 2 pixels

## Usage

### Generating Sprites

To generate or regenerate all ship sprites:

```bash
yarn generate:ship-sprites
```

Or run the script directly:

```bash
node scripts/assets/generate-ship-sprites.js
```

### Output Location

All generated sprites are saved to: `assets/ships/`

### Integration

The sprites can be loaded in the game using standard image loading techniques:

```javascript
// Example usage in game code
const shipSprites = {
  right: 'assets/ships/ship-right-0deg.png',
  downRight: 'assets/ships/ship-down-right-45deg.png',
  down: 'assets/ships/ship-down-90deg.png',
  // ... etc
};
```

## Technical Details

### Canvas Rendering

The generation uses HTML5 Canvas API through the node-canvas library:
- 2D rendering context
- Vector-based drawing (circles and triangles)
- Anti-aliased rendering
- PNG export with transparency

### Coordinate System

- Origin (0,0) at top-left corner
- Positive X axis points right
- Positive Y axis points down
- Rotation angles measured clockwise from positive X axis

### File Naming Convention

Files are named using the pattern: `ship-{direction}-{angle}deg.png`
- `{direction}`: Human-readable direction name
- `{angle}`: Numerical angle in degrees

## Future Improvements

These placeholder sprites can be enhanced or replaced with:
- More detailed artwork
- Animation frames
- Different ship types
- Color variations
- Higher resolution variants

The generation script provides a foundation that can be extended to create more sophisticated sprites while maintaining the same programmatic approach.