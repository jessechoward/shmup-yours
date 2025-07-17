# Ship Sprites

This directory contains placeholder PNG ship sprites for the shmup-yours game.

## Sprites

8 directional ship sprites (32x32 pixels each):
- `ship-right-0deg.png` - Facing right (0°)
- `ship-down-right-45deg.png` - Facing down-right (45°)
- `ship-down-90deg.png` - Facing down (90°)
- `ship-down-left-135deg.png` - Facing down-left (135°)
- `ship-left-180deg.png` - Facing left (180°)
- `ship-up-left-225deg.png` - Facing up-left (225°)
- `ship-up-270deg.png` - Facing up (270°)
- `ship-up-right-315deg.png` - Facing up-right (315°)

## Generation

These sprites are generated programmatically using the script at `scripts/assets/generate-ship-sprites.js`.

To regenerate: `yarn generate:ship-sprites`

## Visual Style

- Circle outline with triangle arrow inside
- Green color (#00FF00)
- Transparent background
- Triangle points in the facing direction

See `docs/ship-sprite-generation.md` for detailed documentation.