# Common Code Patterns

## File Structure Patterns
```
src/
├── server/
│   ├── game/           # Game engine and logic
│   ├── websocket/      # WebSocket server setup
│   ├── handlers/       # Message handlers
│   └── types/          # TypeScript interfaces
├── client/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # WebSocket client, game client
│   └── types/          # Shared TypeScript interfaces
└── shared/
    └── types/          # Common interfaces (game state, messages)
```

## WebSocket Message Pattern
```typescript
// Message structure
interface GameMessage {
  type: 'player_join' | 'player_move' | 'game_state' | 'player_leave';
  payload: any;
  timestamp: number;
}

// Handler pattern
const handleMessage = (ws: WebSocket, message: GameMessage) => {
  switch (message.type) {
    case 'player_join':
      // Handle player joining
      break;
    // ... other cases
  }
};
```

## Game State Pattern
```typescript
interface GameState {
  players: Map<string, Player>;
  gamePhase: 'intermission' | 'active' | 'ending';
  matchStartTime: number;
  intermissionStartTime: number;
}

// Server authoritative updates
const updateGameState = (newState: Partial<GameState>) => {
  Object.assign(gameState, newState);
  broadcastToAllClients('game_state', gameState);
};
```

## Player Management Pattern
```typescript
interface Player {
  handle: string;
  status: 'active' | 'inactive' | 'viewer';
  lastActivity: number;
  position: { x: number; y: number };
}

// Handle reservation
const reserveHandle = (handle: string): boolean => {
  if (reservedHandles.has(handle)) return false;
  reservedHandles.add(handle);
  return true;
};
```

## Testing Patterns
```typescript
// Game logic tests (isolated)
describe('Game Engine', () => {
  let gameState: GameState;
  
  beforeEach(() => {
    gameState = createInitialGameState();
  });
  
  test('should transition from intermission to active', () => {
    // Test game phase transitions
  });
});

// WebSocket tests (integration)
describe('WebSocket Integration', () => {
  let wsServer: WebSocketServer;
  let client: WebSocket;
  
  beforeEach(async () => {
    wsServer = await createTestServer();
    client = new WebSocket('ws://localhost:test-port');
  });
});
```

## React Component Patterns
```typescript
// Game component with WebSocket hook
const GameComponent: React.FC = () => {
  const { gameState, sendMessage } = useWebSocket();
  const { playerPosition, movePlayer } = usePlayerControls();
  
  return (
    <div>
      <GameCanvas gameState={gameState} />
      <PlayerControls onMove={movePlayer} />
    </div>
  );
};

// Custom hook for WebSocket
const useWebSocket = () => {
  const [gameState, setGameState] = useState<GameState>();
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'game_state') {
        setGameState(message.payload);
      }
    };
  }, []);
  
  return { gameState, sendMessage };
};
```
