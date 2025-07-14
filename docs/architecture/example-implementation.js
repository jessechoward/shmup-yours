// Example Vue.js + Canvas Integration Implementation
// This demonstrates the key patterns defined in the architecture

// 1. Game Store (Pinia) - Centralized state management
export const useGameStore = defineStore('game', {
  state: () => ({
    // Server-authoritative game state
    players: new Map(),
    gameObjects: [],
    matchTimer: 0,
    gamePhase: 'lobby',
    
    // Client state
    currentPlayerId: null,
    viewport: { x: 0, y: 0, width: 1024, height: 768 },
    
    // Connection state
    connectionStatus: 'disconnected'
  }),
  
  getters: {
    currentPlayer: (state) => state.players.get(state.currentPlayerId),
    renderData: (state) => ({
      players: state.players,
      gameObjects: state.gameObjects,
      viewport: state.viewport
    })
  },
  
  actions: {
    updateServerState(data) {
      // Update from WebSocket messages
      Object.assign(this, data)
    }
  }
})

// 2. Canvas Integration Composable - Bridge between Vue and Canvas
export function useCanvasIntegration(canvasRef, renderer) {
  const gameStore = useGameStore()
  
  // Watch game state changes and update Canvas
  watch(() => gameStore.renderData, (newData) => {
    if (renderer) {
      renderer.updateState(newData)
    }
  }, { deep: true })
  
  // Handle Canvas events and update Vue state
  const setupCanvasEvents = () => {
    renderer.eventSystem.on('playerHit', (data) => {
      gameStore.updatePlayerHealth(data)
    })
    
    renderer.eventSystem.on('scoreUpdate', (data) => {
      gameStore.updateScores(data)
    })
  }
  
  return { setupCanvasEvents }
}

// 3. Main Game Component - Orchestrates Vue UI + Canvas rendering
const GameApp = {
  template: `
    <div class="game-container">
      <!-- Canvas Game Area -->
      <canvas 
        ref="gameCanvas"
        :width="viewport.width"
        :height="viewport.height"
        @click="handleCanvasClick"
      />
      
      <!-- Vue UI Overlays -->
      <GameHUD 
        v-if="gamePhase === 'playing'"
        :player-stats="currentPlayer"
        :game-stats="gameStats"
      />
      
      <ChatPanel 
        :messages="chatMessages"
        :can-chat="canChat"
        @send-message="sendChatMessage"
      />
      
      <LobbyInterface
        v-if="gamePhase === 'lobby'"
        :players="players"
        @join-game="joinGame"
      />
    </div>
  `,
  
  setup() {
    const gameStore = useGameStore()
    const gameCanvas = ref(null)
    const renderer = inject('gameRenderer')
    
    // State from store
    const currentPlayer = computed(() => gameStore.currentPlayer)
    const gamePhase = computed(() => gameStore.gamePhase)
    const viewport = computed(() => gameStore.viewport)
    
    // Canvas integration
    const { setupCanvasEvents } = useCanvasIntegration(gameCanvas, renderer)
    
    onMounted(() => {
      renderer.initialize(gameCanvas.value)
      setupCanvasEvents()
    })
    
    return {
      gameCanvas,
      currentPlayer,
      gamePhase,
      viewport,
      handleCanvasClick: (event) => {
        // Convert mouse coordinates to game coordinates
        const gameCoords = screenToGameCoords(event, viewport.value)
        // Send to server via WebSocket
        websocket.send({ type: 'mouse_click', coordinates: gameCoords })
      }
    }
  }
}

// 4. WebSocket Message Router - Handles server communication
export class MessageRouter {
  constructor(gameStore, uiStore) {
    this.gameStore = gameStore
    this.uiStore = uiStore
  }
  
  routeMessage(message) {
    const { type, data } = JSON.parse(message.data)
    
    switch (type) {
      case 'game_state':
        this.gameStore.updateServerState(data)
        break
        
      case 'chat_message':
        this.uiStore.addChatMessage(data)
        break
        
      case 'player_joined':
        this.gameStore.addPlayer(data)
        this.uiStore.showNotification(`${data.handle} joined`)
        break
    }
  }
}

// 5. Canvas Event System - Emits events from Canvas to Vue
export class CanvasEventSystem {
  constructor() {
    this.eventTarget = new EventTarget()
  }
  
  emit(type, data) {
    const event = new CustomEvent('gameEvent', {
      detail: { type, data }
    })
    this.eventTarget.dispatchEvent(event)
  }
  
  on(type, callback) {
    const handler = (event) => {
      if (event.detail.type === type) {
        callback(event.detail.data)
      }
    }
    this.eventTarget.addEventListener('gameEvent', handler)
    return () => this.eventTarget.removeEventListener('gameEvent', handler)
  }
}

// This example demonstrates:
// 1. Centralized state management with Pinia
// 2. Clean separation between Canvas rendering and Vue UI
// 3. Event-driven communication between layers
// 4. WebSocket integration for server communication
// 5. Performance-conscious patterns (watchers, event batching)