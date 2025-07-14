# Vue.js + Canvas State Management Patterns

## 🎯 Overview

This document defines the state management patterns for coordinating Vue.js UI components with Canvas game rendering, ensuring efficient data flow and minimal performance impact.

## 🗂️ State Architecture

### 1. State Layer Separation
```
┌─────────────────────────────────────────┐
│                 WebSocket               │
│            (Server Authority)           │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│              Pinia Store                │
│           (Central State Hub)           │
└─────────┬───────────────────────┬───────┘
          │                       │
┌─────────▼─────────┐    ┌────────▼───────┐
│    Vue Components │    │  Canvas Engine │
│   (Reactive UI)   │    │ (Imperative)   │
└───────────────────┘    └────────────────┘
```

### 2. State Categories

#### Game State (Server Authoritative)
- Player positions and rotations
- Game objects (projectiles, effects)
- Match timer and phase
- World/terrain data

#### UI State (Client Local)
- Chat panel visibility
- Menu states
- HUD element positions
- User preferences

#### Hybrid State (Shared)
- Player statistics for HUD
- Connection status
- Input state for prediction

## 📊 Pinia Store Design

### 1. Core Game Store
```javascript
// stores/gameStore.js
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Server State (read-only from client perspective)
    serverState: {
      players: new Map(),
      gameObjects: [],
      terrain: [],
      matchTimer: 0,
      gamePhase: 'lobby',
      worldBounds: { width: 5120, height: 3840 }
    },
    
    // Client State
    clientState: {
      currentPlayerId: null,
      viewport: { x: 0, y: 0, width: 1024, height: 768 },
      lastUpdateTime: 0,
      interpolationData: new Map()
    },
    
    // Connection State
    connection: {
      status: 'disconnected', // 'disconnected' | 'connecting' | 'connected'
      latency: 0,
      lastPingTime: 0
    }
  }),

  getters: {
    currentPlayer() {
      return this.serverState.players.get(this.clientState.currentPlayerId)
    },
    
    alivePlayers() {
      return Array.from(this.serverState.players.values())
        .filter(player => player.alive)
    },
    
    gameStats() {
      return {
        playerCount: this.serverState.players.size,
        timeRemaining: this.serverState.matchTimer,
        phase: this.serverState.gamePhase,
        isPlaying: this.serverState.gamePhase === 'playing'
      }
    },
    
    renderData() {
      return {
        players: this.serverState.players,
        gameObjects: this.serverState.gameObjects,
        terrain: this.serverState.terrain,
        viewport: this.clientState.viewport
      }
    }
  },

  actions: {
    // Server state updates (WebSocket messages)
    updateServerState(payload) {
      const { type, data } = payload
      
      switch (type) {
        case 'full_state':
          this.serverState = { ...this.serverState, ...data }
          break
          
        case 'player_update':
          this.serverState.players.set(data.id, data)
          break
          
        case 'game_objects_update':
          this.serverState.gameObjects = data
          break
          
        case 'match_timer':
          this.serverState.matchTimer = data.timeRemaining
          this.serverState.gamePhase = data.phase
          break
      }
      
      this.clientState.lastUpdateTime = Date.now()
    },
    
    // Client prediction and interpolation
    updateClientPrediction(deltaTime) {
      // Update viewport based on current player position
      const player = this.currentPlayer
      if (player) {
        this.clientState.viewport.x = player.x - this.clientState.viewport.width / 2
        this.clientState.viewport.y = player.y - this.clientState.viewport.height / 2
      }
    }
  }
})
```

### 2. UI-Specific Store
```javascript
// stores/uiStore.js
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    // Chat system
    chat: {
      visible: true,
      expanded: false,
      messages: [],
      unreadCount: 0
    },
    
    // HUD elements
    hud: {
      visible: true,
      health: { visible: true, position: 'top-left' },
      weaponHeat: { visible: true, position: 'top-center' },
      minimap: { visible: true, position: 'bottom-right' },
      scores: { visible: true, position: 'bottom-left' }
    },
    
    // Menu states
    menus: {
      main: false,
      settings: false,
      lobby: false,
      gameOver: false
    },
    
    // Input state
    input: {
      keys: new Set(),
      mouse: { x: 0, y: 0, buttons: 0 },
      gamepad: null
    }
  }),

  getters: {
    canShowChat() {
      // Based on game design chat privilege system
      const gameStore = useGameStore()
      const player = gameStore.currentPlayer
      
      return player && (
        player.isVeteran || 
        gameStore.serverState.gamePhase === 'intermission'
      )
    },
    
    activeMenus() {
      return Object.entries(this.menus)
        .filter(([key, active]) => active)
        .map(([key]) => key)
    }
  },

  actions: {
    // Chat actions
    addChatMessage(message) {
      this.chat.messages.push({
        id: Date.now(),
        ...message,
        timestamp: Date.now()
      })
      
      if (this.chat.messages.length > 100) {
        this.chat.messages = this.chat.messages.slice(-50)
      }
      
      if (!this.chat.expanded) {
        this.chat.unreadCount++
      }
    },
    
    markChatRead() {
      this.chat.unreadCount = 0
    },
    
    // Menu actions
    showMenu(menuType) {
      // Close all other menus
      Object.keys(this.menus).forEach(key => {
        this.menus[key] = key === menuType
      })
    },
    
    hideAllMenus() {
      Object.keys(this.menus).forEach(key => {
        this.menus[key] = false
      })
    },
    
    // Input handling
    updateInputState(inputType, data) {
      switch (inputType) {
        case 'keydown':
          this.input.keys.add(data.code)
          break
        case 'keyup':
          this.input.keys.delete(data.code)
          break
        case 'mousemove':
          this.input.mouse.x = data.x
          this.input.mouse.y = data.y
          break
        case 'mousedown':
          this.input.mouse.buttons |= (1 << data.button)
          break
        case 'mouseup':
          this.input.mouse.buttons &= ~(1 << data.button)
          break
      }
    }
  }
})
```

## 🔄 Data Flow Patterns

### 1. WebSocket → Store → Components
```javascript
// composables/useWebSocketBridge.js
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

export function useWebSocketBridge() {
  const gameStore = useGameStore()
  const uiStore = useUIStore()
  
  const handleWebSocketMessage = (message) => {
    const { type, data } = JSON.parse(message.data)
    
    switch (type) {
      case 'game_state':
        gameStore.updateServerState({ type: 'full_state', data })
        break
        
      case 'player_joined':
        gameStore.updateServerState({ type: 'player_update', data })
        break
        
      case 'chat_message':
        uiStore.addChatMessage(data)
        break
        
      case 'match_start':
        gameStore.updateServerState({ type: 'match_timer', data })
        uiStore.hideAllMenus()
        break
    }
  }
  
  return { handleWebSocketMessage }
}
```

### 2. Canvas State Synchronization
```javascript
// composables/useCanvasSync.js
import { watch, ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'

export function useCanvasSync(canvasRenderer) {
  const gameStore = useGameStore()
  const lastSyncTime = ref(0)
  
  // Sync render data to canvas (throttled)
  watch(
    () => gameStore.renderData,
    (newRenderData) => {
      const now = Date.now()
      if (now - lastSyncTime.value >= 16) { // 60 FPS max
        canvasRenderer.updateState(newRenderData)
        lastSyncTime.value = now
      }
    },
    { deep: true, immediate: true }
  )
  
  // Handle canvas events back to store
  const setupCanvasEventHandlers = (canvas) => {
    canvas.addEventListener('playerDeath', (event) => {
      // Update UI to show death animation, respawn timer, etc.
      const { playerId } = event.detail
      if (playerId === gameStore.clientState.currentPlayerId) {
        uiStore.showMenu('gameOver')
      }
    })
    
    canvas.addEventListener('scoreUpdate', (event) => {
      // Canvas can emit score changes for immediate UI feedback
      // (still validated by server)
      gameStore.updateServerState({
        type: 'score_update',
        data: event.detail
      })
    })
  }
  
  return { setupCanvasEventHandlers }
}
```

### 3. Input Event Flow
```javascript
// composables/useInputManager.js
import { onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/uiStore'
import { useGameStore } from '@/stores/gameStore'

export function useInputManager(websocket) {
  const uiStore = useUIStore()
  const gameStore = useGameStore()
  
  const handleKeyDown = (event) => {
    // Update UI state
    uiStore.updateInputState('keydown', { code: event.code })
    
    // Send to server for game actions
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
      websocket.send(JSON.stringify({
        type: 'input',
        action: 'keydown',
        key: event.code,
        timestamp: Date.now()
      }))
    }
    
    // Handle UI-only keys
    if (event.code === 'Enter' && !uiStore.chat.expanded) {
      uiStore.chat.expanded = true
      event.preventDefault()
    }
  }
  
  const handleKeyUp = (event) => {
    uiStore.updateInputState('keyup', { code: event.code })
    
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) {
      websocket.send(JSON.stringify({
        type: 'input',
        action: 'keyup',
        key: event.code,
        timestamp: Date.now()
      }))
    }
  }
  
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  })
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
  })
}
```

## ⚡ Performance Patterns

### 1. State Update Batching
```javascript
// utils/stateBatcher.js
export class StateBatcher {
  constructor(store, batchSize = 10, flushInterval = 16) {
    this.store = store
    this.batchSize = batchSize
    this.flushInterval = flushInterval
    this.pendingUpdates = []
    this.flushTimer = null
  }
  
  addUpdate(updateFn) {
    this.pendingUpdates.push(updateFn)
    
    if (this.pendingUpdates.length >= this.batchSize) {
      this.flush()
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.flushInterval)
    }
  }
  
  flush() {
    if (this.pendingUpdates.length === 0) return
    
    // Apply all updates in a single reactive update
    this.store.$patch(() => {
      this.pendingUpdates.forEach(updateFn => updateFn())
    })
    
    this.pendingUpdates = []
    this.flushTimer = null
  }
}
```

### 2. Selective Reactivity
```javascript
// composables/useSelectiveReactivity.js
import { computed, watchEffect } from 'vue'
import { useGameStore } from '@/stores/gameStore'

export function useSelectiveReactivity() {
  const gameStore = useGameStore()
  
  // Only react to specific state changes
  const playerHealth = computed(() => 
    gameStore.currentPlayer?.health ?? 0
  )
  
  const criticalUI = computed(() => ({
    health: playerHealth.value,
    weaponHeat: gameStore.currentPlayer?.weaponHeat ?? 0,
    timeRemaining: gameStore.serverState.matchTimer
  }))
  
  // Separate watchers for different update frequencies
  watchEffect(() => {
    // High frequency updates (every frame)
    updatePlayerPosition(gameStore.currentPlayer?.position)
  })
  
  watchEffect(() => {
    // Medium frequency updates (10 FPS)
    updateScoreboard(gameStore.gameStats)
  }, { flush: 'post' })
  
  return { criticalUI }
}
```

### 3. Memory Management
```javascript
// composables/useStateCleanup.js
import { onUnmounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

export function useStateCleanup() {
  const gameStore = useGameStore()
  const cleanupTasks = []
  
  // Clean up old game objects
  const cleanupGameObjects = watch(
    () => gameStore.serverState.gameObjects,
    (newObjects) => {
      // Remove objects older than 5 seconds
      const cutoff = Date.now() - 5000
      gameStore.serverState.gameObjects = newObjects.filter(
        obj => obj.timestamp > cutoff
      )
    }
  )
  
  // Clean up old chat messages
  const cleanupChat = watch(
    () => gameStore.chat?.messages?.length ?? 0,
    (length) => {
      if (length > 100) {
        gameStore.chat.messages = gameStore.chat.messages.slice(-50)
      }
    }
  )
  
  cleanupTasks.push(cleanupGameObjects, cleanupChat)
  
  onUnmounted(() => {
    cleanupTasks.forEach(cleanup => cleanup())
  })
}
```

## 🧪 Testing Patterns

### 1. Store Testing
```javascript
// tests/stores/gameStore.test.js
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'

describe('Game Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  
  it('updates server state correctly', () => {
    const store = useGameStore()
    
    store.updateServerState({
      type: 'player_update',
      data: { id: 'p1', x: 100, y: 200, health: 100 }
    })
    
    expect(store.serverState.players.get('p1')).toEqual({
      id: 'p1', x: 100, y: 200, health: 100
    })
  })
  
  it('calculates game stats correctly', () => {
    const store = useGameStore()
    store.serverState.players.set('p1', { alive: true })
    store.serverState.players.set('p2', { alive: false })
    
    expect(store.gameStats.playerCount).toBe(2)
    expect(store.alivePlayers).toHaveLength(1)
  })
})
```

### 2. Integration Testing
```javascript
// tests/integration/canvasVueSync.test.js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import GameCanvas from '@/components/GameCanvas.vue'

describe('Canvas Vue Sync', () => {
  let wrapper
  let mockRenderer
  
  beforeEach(() => {
    mockRenderer = {
      updateState: vi.fn(),
      render: vi.fn()
    }
    
    wrapper = mount(GameCanvas, {
      global: {
        plugins: [createTestingPinia()]
      },
      props: {
        renderer: mockRenderer
      }
    })
  })
  
  it('syncs state changes to canvas', async () => {
    const gameStore = useGameStore()
    
    gameStore.updateServerState({
      type: 'player_update',
      data: { id: 'p1', x: 150, y: 250 }
    })
    
    await wrapper.vm.$nextTick()
    
    expect(mockRenderer.updateState).toHaveBeenCalledWith(
      expect.objectContaining({
        players: expect.any(Map)
      })
    )
  })
})
```

## 📋 Implementation Guidelines

### 1. State Update Principles
- Server state is read-only for Vue components
- All mutations go through Pinia actions
- Use computed properties for derived state
- Batch updates when possible

### 2. Performance Guidelines
- Throttle Canvas state updates to 60 FPS
- Use shallow watching for large objects
- Clean up old data regularly
- Separate UI state from game state

### 3. Testing Strategy
- Unit test stores in isolation
- Integration test Vue-Canvas communication
- Mock WebSocket for predictable testing
- Test state cleanup and memory usage

This state management architecture ensures efficient coordination between Vue.js UI and Canvas rendering while maintaining performance and clean separation of concerns.