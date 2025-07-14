# Common Code Patterns

## File Structure Patterns
```
src/
├── server/
│   ├── game/           # Game engine and logic
│   ├── websocket/      # WebSocket server setup
│   ├── handlers/       # Message handlers
│   └── utils/          # Utility functions
├── client/
│   ├── components/     # Frontend components (framework TBD, prefer Vue)
│   ├── services/       # WebSocket client, game client
│   ├── utils/          # Client-side utilities
│   └── styles/         # CSS/styling files
└── shared/
    └── constants/      # Common constants and enums
```

## WebSocket Message Pattern
```javascript
// Message structure (use JSDoc for documentation)
/**
 * @typedef {Object} GameMessage
 * @property {'player_join'|'player_move'|'game_state'|'player_leave'} type
 * @property {any} payload
 * @property {number} timestamp
 */

// Handler pattern
const handleMessage = (ws, message) => {
  switch (message.type) {
    case 'player_join':
      // Handle player joining
      break;
    // ... other cases
  }
};
```

## Game State Pattern
```javascript
/**
 * @typedef {Object} GameState
 * @property {Map<string, Player>} players
 * @property {'intermission'|'active'|'ending'} gamePhase
 * @property {number} matchStartTime
 * @property {number} intermissionStartTime
 */

// Server authoritative updates
const updateGameState = (newState) => {
  Object.assign(gameState, newState);
  broadcastToAllClients('game_state', gameState);
};
```

## Player Management Pattern
```javascript
/**
 * @typedef {Object} Player
 * @property {string} handle
 * @property {'active'|'inactive'|'viewer'} status
 * @property {number} lastActivity
 * @property {{x: number, y: number}} position
 */

// Handle reservation
const reserveHandle = (handle) => {
  if (reservedHandles.has(handle)) return false;
  reservedHandles.add(handle);
  return true;
};
```

## Testing Patterns
```javascript
// Game logic tests (isolated)
describe('Game Engine', () => {
  let gameState;
  
  beforeEach(() => {
    gameState = createInitialGameState();
  });
  
  test('should transition from intermission to active', () => {
    // Test game phase transitions
  });
});

// WebSocket tests (integration)
describe('WebSocket Integration', () => {
  let wsServer;
  let client;
  
  beforeEach(async () => {
    wsServer = await createTestServer();
    client = new WebSocket('ws://localhost:test-port');
  });
});
```

## Frontend Component Patterns (Framework TBD - prefer Vue.js)
```javascript
// Vue.js Single File Component (when framework is chosen)
// GameComponent.vue
/**
 * Game component with WebSocket integration
 */
export default {
  name: 'GameComponent',
  data() {
    return {
      gameState: null,
      playerPosition: { x: 0, y: 0 }
    };
  },
  mounted() {
    this.initWebSocket();
  },
  methods: {
    initWebSocket() {
      this.ws = new WebSocket('ws://localhost:8080');
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'game_state') {
          this.gameState = message.payload;
        }
      };
    },
    movePlayer(direction) {
      this.ws.send(JSON.stringify({
        type: 'player_move',
        payload: { direction },
        timestamp: Date.now()
      }));
    }
  }
};
```
