# Vue.js + Canvas Integration Architecture

## 🎯 Overview

This document defines the architecture for integrating Vue.js UI components with HTML5 Canvas game rendering, ensuring clean separation of concerns while enabling efficient state sharing and communication.

## 🏗️ Core Architecture Principles

### Separation of Concerns
- **Canvas Layer**: Pure game rendering (ships, terrain, effects, particles)
- **Vue.js Layer**: UI components (chat, lobby, HUD, menus, overlays)
- **Shared State**: Centralized game state management
- **Communication**: Event-driven patterns between layers

### Performance Isolation
- Canvas rendering loop independent of Vue reactivity
- UI updates throttled to prevent interference with game loop
- State mutations optimized for both Canvas and Vue consumption

## 🔧 Component Architecture

### 1. App Structure Layout
```
GameApp (Vue 3)
├── GameCanvas (Canvas Component)
├── GameHUD (Vue Component)
├── ChatPanel (Vue Component)
├── LobbyInterface (Vue Component)
└── MenuOverlay (Vue Component)
```

### 2. Layer Composition
```css
/* Z-index layering */
.game-container {
  position: relative;
}

.canvas-layer {
  z-index: 1;
  position: absolute;
}

.hud-layer {
  z-index: 10;
  position: absolute;
  pointer-events: none; /* Allow canvas interaction */
}

.ui-layer {
  z-index: 20;
  position: absolute;
  pointer-events: auto; /* UI interactions */
}

.overlay-layer {
  z-index: 30;
  position: absolute;
}
```

### 3. Canvas Integration Component
```vue
<template>
  <div class="game-container">
    <!-- Canvas Game Area -->
    <canvas 
      ref="gameCanvas"
      class="canvas-layer"
      :width="gameViewport.width"
      :height="gameViewport.height"
      @click="handleCanvasClick"
      @mousemove="handleCanvasMouseMove"
    />
    
    <!-- Vue UI Overlays -->
    <GameHUD 
      class="hud-layer"
      :player-stats="currentPlayer"
      :game-state="gameState"
    />
    
    <ChatPanel 
      v-if="showChat"
      class="ui-layer"
      :messages="chatMessages"
      @send-message="sendChatMessage"
    />
    
    <LobbyInterface
      v-if="gamePhase === 'lobby'"
      class="overlay-layer"
      :players="players"
      :room-settings="roomSettings"
    />
  </div>
</template>
```

## 📊 State Management Architecture

### 1. Pinia Store Structure
```javascript
// stores/gameStore.js
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Game State
    gamePhase: 'lobby', // 'lobby' | 'playing' | 'intermission'
    matchTimer: 0,
    currentMatch: null,
    
    // Player State
    players: new Map(),
    currentPlayerId: null,
    
    // Canvas State (read-only for Vue)
    gameObjects: [],
    gameWorld: {
      bounds: { width: 5120, height: 3840 },
      viewport: { x: 0, y: 0, width: 1024, height: 768 }
    },
    
    // UI State
    chatMessages: [],
    hudVisible: true,
    menuVisible: false,
    
    // WebSocket State
    connected: false,
    connectionStatus: 'disconnected'
  }),
  
  getters: {
    currentPlayer: (state) => 
      state.players.get(state.currentPlayerId),
    
    alivePlayers: (state) => 
      Array.from(state.players.values()).filter(p => p.alive),
    
    gameStats: (state) => ({
      playerCount: state.players.size,
      timeRemaining: state.matchTimer,
      phase: state.gamePhase
    })
  },
  
  actions: {
    // State Updates from WebSocket
    updateGameState(serverState) {
      this.players = new Map(serverState.players)
      this.gameObjects = serverState.gameObjects
      this.matchTimer = serverState.matchTimer
      this.gamePhase = serverState.phase
    },
    
    // UI Actions
    sendChatMessage(message) {
      // Dispatch to WebSocket
      this.chatMessages.push({
        id: Date.now(),
        playerId: this.currentPlayerId,
        message,
        timestamp: Date.now()
      })
    },
    
    // Canvas Interactions
    handleCanvasClick(event) {
      // Convert to game coordinates and dispatch
      const gameCoords = this.screenToGameCoords(event)
      // Send to game engine via WebSocket
    }
  }
})
```

### 2. Game Engine State Bridge
```javascript
// composables/useGameStateBridge.js
import { watch, ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

export function useGameStateBridge(canvasRenderer) {
  const gameStore = useGameStore()
  const renderState = ref(null)
  
  // Bridge WebSocket updates to Canvas
  watch(() => gameStore.gameObjects, (newGameObjects) => {
    if (canvasRenderer) {
      canvasRenderer.updateGameObjects(newGameObjects)
    }
  }, { deep: true })
  
  // Bridge Canvas events to Vue
  const setupCanvasEventBridge = (canvas) => {
    canvas.addEventListener('gameEvent', (event) => {
      switch (event.detail.type) {
        case 'playerHit':
          gameStore.updatePlayerStats(event.detail.data)
          break
        case 'scoreUpdate':
          gameStore.updateScore(event.detail.data)
          break
      }
    })
  }
  
  return {
    renderState,
    setupCanvasEventBridge
  }
}
```

## 🔄 Communication Patterns

### 1. WebSocket → State → Components Flow
```javascript
// websocket/gameClient.js
export class GameWebSocketClient {
  constructor(gameStore) {
    this.store = gameStore
    this.ws = null
  }
  
  connect() {
    this.ws = new WebSocket('ws://localhost:3001')
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      
      switch (message.type) {
        case 'game_state':
          this.store.updateGameState(message.data)
          break
        case 'player_joined':
          this.store.addPlayer(message.data)
          break
        case 'chat_message':
          this.store.addChatMessage(message.data)
          break
      }
    }
  }
  
  sendAction(action) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(action))
    }
  }
}
```

### 2. Canvas → Vue Event Communication
```javascript
// canvas/gameRenderer.js
export class GameCanvasRenderer {
  constructor(canvas, eventTarget = window) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.eventTarget = eventTarget
  }
  
  emitGameEvent(type, data) {
    const event = new CustomEvent('gameEvent', {
      detail: { type, data }
    })
    this.eventTarget.dispatchEvent(event)
  }
  
  render(gameState) {
    // Render game objects
    this.renderPlayers(gameState.players)
    this.renderTerrain(gameState.terrain)
    
    // Emit events for UI updates
    if (gameState.scoreChanged) {
      this.emitGameEvent('scoreUpdate', gameState.scores)
    }
  }
}
```

### 3. Vue → Canvas Input Handling
```vue
<script setup>
import { useGameStore } from '@/stores/gameStore'
import { useInputHandler } from '@/composables/useInputHandler'

const gameStore = useGameStore()
const { handleKeyDown, handleKeyUp, handleMouseMove } = useInputHandler()

const onCanvasClick = (event) => {
  const rect = event.target.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Convert to game coordinates
  const gameCoords = {
    x: (x / rect.width) * gameStore.gameWorld.viewport.width,
    y: (y / rect.height) * gameStore.gameWorld.viewport.height
  }
  
  // Send to game via WebSocket
  gameStore.sendAction({
    type: 'mouse_click',
    coordinates: gameCoords
  })
}
</script>
```

## 🎮 HUD and Overlay Integration

### 1. HUD Component Architecture
```vue
<!-- components/GameHUD.vue -->
<template>
  <div class="game-hud">
    <div class="hud-top">
      <PlayerHealth :health="playerStats.health" />
      <WeaponHeat :heat="playerStats.weaponHeat" />
      <MatchTimer :time="gameStats.timeRemaining" />
    </div>
    
    <div class="hud-bottom">
      <Minimap 
        :players="alivePlayers"
        :viewport="gameWorld.viewport"
        :world-bounds="gameWorld.bounds"
      />
      <ScorePanel :scores="gameStats.scores" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const playerStats = computed(() => gameStore.currentPlayer)
const gameStats = computed(() => gameStore.gameStats)
const alivePlayers = computed(() => gameStore.alivePlayers)
const gameWorld = computed(() => gameStore.gameWorld)
</script>

<style scoped>
.game-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.hud-top, .hud-bottom {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

.hud-top {
  align-items: flex-start;
}

.hud-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  align-items: flex-end;
}
</style>
```

### 2. Chat Panel Integration
```vue
<!-- components/ChatPanel.vue -->
<template>
  <div class="chat-panel" :class="{ 'chat-expanded': expanded }">
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in visibleMessages" 
        :key="message.id"
        class="chat-message"
        :class="`player-${message.playerId}`"
      >
        <span class="player-name">{{ getPlayerName(message.playerId) }}</span>
        <span class="message-text">{{ message.message }}</span>
      </div>
    </div>
    
    <div v-if="canChat" class="chat-input">
      <input
        v-model="currentMessage"
        @keyup.enter="sendMessage"
        @focus="expanded = true"
        @blur="expanded = false"
        placeholder="Type message..."
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const currentMessage = ref('')
const expanded = ref(false)
const messagesContainer = ref(null)

const visibleMessages = computed(() => {
  return gameStore.chatMessages.slice(-10) // Show last 10 messages
})

const canChat = computed(() => {
  // Chat privilege system from game design
  const player = gameStore.currentPlayer
  return player && (player.isVeteran || gameStore.gamePhase === 'intermission')
})

const sendMessage = () => {
  if (currentMessage.value.trim()) {
    gameStore.sendChatMessage(currentMessage.value.trim())
    currentMessage.value = ''
  }
}

// Auto-scroll to bottom on new messages
watch(visibleMessages, () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
})
</script>
```

## ⚡ Performance Optimization

### 1. Render Loop Separation
```javascript
// canvas/gameLoop.js
export class GameRenderLoop {
  constructor(renderer, stateStore) {
    this.renderer = renderer
    this.store = stateStore
    this.lastRender = 0
    this.running = false
  }
  
  start() {
    this.running = true
    this.renderFrame()
  }
  
  renderFrame = (timestamp = 0) => {
    if (!this.running) return
    
    const deltaTime = timestamp - this.lastRender
    this.lastRender = timestamp
    
    // Get current state snapshot (no reactivity)
    const gameState = this.store.$state
    
    // Render at 60fps
    this.renderer.render(gameState, deltaTime)
    
    requestAnimationFrame(this.renderFrame)
  }
  
  stop() {
    this.running = false
  }
}
```

### 2. State Update Throttling
```javascript
// composables/useThrottledUpdates.js
import { ref, watch } from 'vue'
import { throttle } from 'lodash-es'

export function useThrottledUpdates(source, updateFn, delay = 16) {
  const throttledUpdate = throttle(updateFn, delay)
  
  watch(source, throttledUpdate, { deep: true })
  
  return { throttledUpdate }
}
```

### 3. Component Optimization
```vue
<script setup>
import { computed, watchEffect, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

// Use computed for derived state (cached)
const playerStats = computed(() => gameStore.currentPlayer)

// Throttle expensive operations
const throttledHUDUpdate = throttle((stats) => {
  // Update HUD components
}, 100) // Update HUD max 10 times per second

watchEffect(() => {
  throttledHUDUpdate(playerStats.value)
})

onUnmounted(() => {
  throttledHUDUpdate.cancel()
})
</script>
```

## 🛠️ Development Guidelines

### 1. Component Creation Rules
- **Pure UI Components**: Use Vue.js with reactive state
- **Game Rendering**: Use Canvas with imperative updates
- **Shared State**: Always go through Pinia store
- **Events**: Use CustomEvents for Canvas → Vue communication

### 2. State Management Rules
- **Game State**: WebSocket → Store → Both Canvas & Vue
- **UI State**: Vue components → Store → Other Vue components
- **Input Events**: Vue → Store → WebSocket → Server

### 3. Performance Guidelines
- Keep Canvas rendering loop independent of Vue reactivity
- Use computed properties for derived UI state
- Throttle non-critical UI updates
- Avoid deep watching on large game state objects

### 4. Testing Approach
- **Unit Tests**: Individual Vue components with mocked game state
- **Integration Tests**: Canvas + Vue interaction through store
- **E2E Tests**: Full game flow with multiple players

## 📋 Implementation Checklist

- [ ] Set up Vue 3 + Pinia project structure
- [ ] Create game canvas wrapper component
- [ ] Implement WebSocket bridge to Pinia store
- [ ] Build HUD overlay components
- [ ] Integrate chat panel with privilege system
- [ ] Create lobby interface components
- [ ] Add input handling bridge
- [ ] Implement performance optimizations
- [ ] Add comprehensive testing

This architecture ensures clean separation between game rendering and UI while maintaining efficient state sharing and optimal performance for real-time multiplayer gaming.