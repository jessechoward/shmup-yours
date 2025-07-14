# Vue.js + Canvas Integration Guidelines

## 🎯 Overview

This document provides practical implementation guidelines for integrating Vue.js UI components with Canvas game rendering, including setup instructions, best practices, and common patterns.

## 🚀 Project Setup Guide

### 1. Dependencies and Configuration

#### Package.json Setup
```json
{
  "name": "@shmup-yours/frontend-vue",
  "version": "0.1.0",
  "type": "module",
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.0",
    "lodash-es": "^4.17.21"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@vue/test-utils": "^2.4.0",
    "@pinia/testing": "^0.1.0"
  }
}
```

#### Vite Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/ws': {
        target: 'ws://localhost:3001',
        ws: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'pinia'],
          'canvas': ['./src/canvas/index.js'],
          'ui': ['./src/components/index.js']
        }
      }
    }
  }
})
```

### 2. Project Structure
```
frontend/
├── src/
│   ├── main.js                    # Vue app entry
│   ├── App.vue                    # Root component
│   ├── components/                # Vue UI components
│   │   ├── GameCanvas.vue         # Canvas wrapper
│   │   ├── GameHUD.vue           # HUD overlay
│   │   ├── ChatPanel.vue         # Chat interface
│   │   ├── LobbyInterface.vue    # Lobby UI
│   │   └── MenuOverlay.vue       # Game menus
│   ├── stores/                    # Pinia stores
│   │   ├── gameStore.js          # Game state
│   │   ├── uiStore.js            # UI state
│   │   └── connectionStore.js    # WebSocket state
│   ├── composables/               # Vue composables
│   │   ├── useGameStateBridge.js # State synchronization
│   │   ├── useCanvasIntegration.js # Canvas events
│   │   ├── useInputHandler.js    # Input management
│   │   └── useWebSocketClient.js # WebSocket connection
│   ├── canvas/                    # Canvas game engine
│   │   ├── renderer/              # Rendering system
│   │   ├── events/               # Event system
│   │   ├── input/                # Input handling
│   │   └── utils/                # Canvas utilities
│   ├── websocket/                 # WebSocket layer
│   │   ├── messageRouter.js      # Message routing
│   │   ├── gameClient.js         # WebSocket client
│   │   └── protocols.js          # Message protocols
│   └── utils/                     # Shared utilities
│       ├── performance.js        # Performance monitoring
│       ├── eventBatcher.js       # Event batching
│       └── constants.js          # Game constants
└── tests/                         # Test files
    ├── unit/                      # Unit tests
    ├── integration/               # Integration tests
    └── e2e/                       # End-to-end tests
```

## 🔧 Implementation Patterns

### 1. Main Application Setup
```javascript
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setupCanvas } from './canvas/setup'
import { setupWebSocket } from './websocket/setup'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize game systems
const canvas = setupCanvas()
const websocket = setupWebSocket(pinia)

// Provide to all components
app.provide('gameCanvas', canvas)
app.provide('gameWebSocket', websocket)

app.mount('#app')
```

### 2. Root Component Architecture
```vue
<!-- src/App.vue -->
<template>
  <div id="app" class="game-app">
    <!-- Connection Status -->
    <ConnectionStatus :status="connectionStatus" />
    
    <!-- Main Game Container -->
    <div class="game-container" :class="gameContainerClasses">
      <!-- Canvas Game Area -->
      <GameCanvas 
        ref="gameCanvasRef"
        :width="gameViewport.width"
        :height="gameViewport.height"
        @canvas-ready="onCanvasReady"
      />
      
      <!-- Vue UI Overlays -->
      <GameHUD 
        v-if="gamePhase === 'playing' && hudVisible"
        :player-stats="currentPlayer"
        :game-stats="gameStats"
      />
      
      <ChatPanel 
        v-if="chatVisible"
        :messages="chatMessages"
        :can-chat="canChat"
        @send-message="sendChatMessage"
      />
      
      <LobbyInterface
        v-if="gamePhase === 'lobby'"
        :players="players"
        :room-settings="roomSettings"
        @join-game="joinGame"
        @leave-game="leaveGame"
      />
      
      <MenuOverlay
        v-if="menuVisible"
        :menu-type="activeMenu"
        @close-menu="closeMenu"
      />
    </div>
    
    <!-- Debug Panel (development only) -->
    <DebugPanel v-if="isDevelopment" :performance-stats="performanceStats" />
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'
import { useCanvasIntegration } from '@/composables/useCanvasIntegration'
import { useWebSocketClient } from '@/composables/useWebSocketClient'

// Components
import GameCanvas from '@/components/GameCanvas.vue'
import GameHUD from '@/components/GameHUD.vue'
import ChatPanel from '@/components/ChatPanel.vue'
import LobbyInterface from '@/components/LobbyInterface.vue'
import MenuOverlay from '@/components/MenuOverlay.vue'
import ConnectionStatus from '@/components/ConnectionStatus.vue'
import DebugPanel from '@/components/DebugPanel.vue'

// Stores
const gameStore = useGameStore()
const uiStore = useUIStore()

// Injected services
const gameCanvas = inject('gameCanvas')
const gameWebSocket = inject('gameWebSocket')

// Refs
const gameCanvasRef = ref(null)

// Computed properties
const gamePhase = computed(() => gameStore.serverState.gamePhase)
const currentPlayer = computed(() => gameStore.currentPlayer)
const gameStats = computed(() => gameStore.gameStats)
const players = computed(() => Array.from(gameStore.serverState.players.values()))
const gameViewport = computed(() => gameStore.clientState.viewport)
const connectionStatus = computed(() => gameStore.connection.status)

const hudVisible = computed(() => uiStore.hud.visible && gamePhase.value === 'playing')
const chatVisible = computed(() => uiStore.chat.visible)
const canChat = computed(() => uiStore.canShowChat)
const menuVisible = computed(() => uiStore.activeMenus.length > 0)
const activeMenu = computed(() => uiStore.activeMenus[0] || null)

const gameContainerClasses = computed(() => ({
  'game-playing': gamePhase.value === 'playing',
  'game-lobby': gamePhase.value === 'lobby',
  'game-intermission': gamePhase.value === 'intermission',
  'menu-active': menuVisible.value
}))

const isDevelopment = computed(() => import.meta.env.DEV)
const performanceStats = computed(() => uiStore.performanceMetrics)

// Composables
const { setupCanvasIntegration } = useCanvasIntegration(gameCanvasRef, gameCanvas)
const { connect, sendMessage } = useWebSocketClient(gameWebSocket)

// Event handlers
const onCanvasReady = (canvasElement) => {
  setupCanvasIntegration(canvasElement)
}

const sendChatMessage = (message) => {
  sendMessage({
    type: 'chat_message',
    data: { message },
    timestamp: Date.now()
  })
}

const joinGame = (playerHandle) => {
  sendMessage({
    type: 'join_game',
    data: { handle: playerHandle },
    timestamp: Date.now()
  })
}

const leaveGame = () => {
  sendMessage({
    type: 'leave_game',
    timestamp: Date.now()
  })
}

const closeMenu = () => {
  uiStore.hideAllMenus()
}

// Lifecycle
onMounted(() => {
  connect()
})
</script>

<style scoped>
.game-app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  font-family: 'Courier New', monospace;
}

.game-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-container.menu-active {
  filter: blur(2px);
}

.game-playing .game-container {
  cursor: crosshair;
}
</style>
```

### 3. Canvas Component Implementation
```vue
<!-- src/components/GameCanvas.vue -->
<template>
  <canvas
    ref="canvasRef"
    :width="width"
    :height="height"
    class="game-canvas"
    @click="handleCanvasClick"
    @mousemove="handleCanvasMouseMove"
    @contextmenu.prevent="handleCanvasRightClick"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

// Props
const props = defineProps({
  width: { type: Number, default: 1024 },
  height: { type: Number, default: 768 }
})

// Emits
const emit = defineEmits(['canvas-ready', 'canvas-click', 'canvas-mousemove'])

// Stores
const gameStore = useGameStore()
const uiStore = useUIStore()

// Injected services
const gameCanvas = inject('gameCanvas')

// Refs
const canvasRef = ref(null)

// Canvas setup
onMounted(() => {
  if (canvasRef.value && gameCanvas) {
    gameCanvas.initialize(canvasRef.value)
    emit('canvas-ready', canvasRef.value)
    startRenderLoop()
  }
})

// Render loop
let renderLoopId = null
const startRenderLoop = () => {
  const render = (timestamp) => {
    if (gameCanvas && canvasRef.value) {
      const gameState = gameStore.renderData
      gameCanvas.render(gameState, timestamp)
    }
    renderLoopId = requestAnimationFrame(render)
  }
  render()
}

const stopRenderLoop = () => {
  if (renderLoopId) {
    cancelAnimationFrame(renderLoopId)
    renderLoopId = null
  }
}

// Event handlers
const handleCanvasClick = (event) => {
  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const gameCoords = {
    x: (x / rect.width) * props.width,
    y: (y / rect.height) * props.height
  }
  
  emit('canvas-click', { coordinates: gameCoords, originalEvent: event })
}

const handleCanvasMouseMove = (event) => {
  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  emit('canvas-mousemove', { x, y, originalEvent: event })
}

const handleCanvasRightClick = (event) => {
  // Handle right-click context actions
  uiStore.showContextMenu({
    x: event.clientX,
    y: event.clientY,
    actions: ['target', 'move_here', 'cancel']
  })
}

// Watch for canvas size changes
watch([() => props.width, () => props.height], ([newWidth, newHeight]) => {
  if (gameCanvas) {
    gameCanvas.resize(newWidth, newHeight)
  }
})

// Cleanup
onUnmounted(() => {
  stopRenderLoop()
  if (gameCanvas) {
    gameCanvas.destroy()
  }
})
</script>

<style scoped>
.game-canvas {
  border: 2px solid #333;
  background: #000;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
```

## 🎮 HUD Component Patterns

### 1. Modular HUD Architecture
```vue
<!-- src/components/GameHUD.vue -->
<template>
  <div class="game-hud">
    <!-- Top HUD Elements -->
    <div class="hud-top">
      <PlayerHealth 
        :health="playerStats.health"
        :max-health="playerStats.maxHealth"
        :shield="playerStats.shield"
      />
      
      <WeaponHeat 
        :heat="playerStats.weaponHeat"
        :max-heat="playerStats.maxWeaponHeat"
        :overheated="playerStats.overheated"
      />
      
      <MatchTimer 
        :time-remaining="gameStats.timeRemaining"
        :phase="gameStats.phase"
      />
    </div>
    
    <!-- Side HUD Elements -->
    <div class="hud-left">
      <PlayerList 
        :players="alivePlayers"
        :current-player-id="currentPlayerId"
      />
    </div>
    
    <div class="hud-right">
      <ScorePanel 
        :scores="gameStats.scores"
        :current-player-id="currentPlayerId"
      />
    </div>
    
    <!-- Bottom HUD Elements -->
    <div class="hud-bottom">
      <Minimap 
        :players="alivePlayers"
        :viewport="viewport"
        :world-bounds="worldBounds"
        @viewport-change="updateViewport"
      />
      
      <ControlHints 
        :control-scheme="controlScheme"
        :visible="showControlHints"
      />
    </div>
    
    <!-- Dynamic Elements -->
    <DamageIndicators 
      :damage-events="damageEvents"
      @animation-complete="clearDamageEvent"
    />
    
    <NotificationToasts 
      :notifications="notifications"
      @dismiss="dismissNotification"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

// Child components
import PlayerHealth from './hud/PlayerHealth.vue'
import WeaponHeat from './hud/WeaponHeat.vue'
import MatchTimer from './hud/MatchTimer.vue'
import PlayerList from './hud/PlayerList.vue'
import ScorePanel from './hud/ScorePanel.vue'
import Minimap from './hud/Minimap.vue'
import ControlHints from './hud/ControlHints.vue'
import DamageIndicators from './hud/DamageIndicators.vue'
import NotificationToasts from './hud/NotificationToasts.vue'

// Props
const props = defineProps({
  playerStats: { type: Object, required: true },
  gameStats: { type: Object, required: true }
})

// Stores
const gameStore = useGameStore()
const uiStore = useUIStore()

// Computed properties
const alivePlayers = computed(() => gameStore.alivePlayers)
const currentPlayerId = computed(() => gameStore.clientState.currentPlayerId)
const viewport = computed(() => gameStore.clientState.viewport)
const worldBounds = computed(() => gameStore.serverState.worldBounds)
const controlScheme = computed(() => uiStore.settings.controlScheme)
const showControlHints = computed(() => uiStore.settings.showControlHints)
const damageEvents = computed(() => uiStore.damageEvents)
const notifications = computed(() => uiStore.notifications)

// Event handlers
const updateViewport = (newViewport) => {
  gameStore.updateViewport(newViewport)
}

const clearDamageEvent = (eventId) => {
  uiStore.clearDamageEvent(eventId)
}

const dismissNotification = (notificationId) => {
  uiStore.dismissNotification(notificationId)
}
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
  font-family: 'Courier New', monospace;
  color: #fff;
}

.hud-top {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.hud-left {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.hud-right {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.hud-bottom {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
</style>
```

## 💬 Chat System Implementation

### 1. Chat Panel Component
```vue
<!-- src/components/ChatPanel.vue -->
<template>
  <div 
    class="chat-panel" 
    :class="{ 
      'chat-expanded': expanded,
      'chat-disabled': !canChat 
    }"
  >
    <!-- Chat Messages -->
    <div 
      ref="messagesContainer"
      class="chat-messages"
      @scroll="handleScroll"
    >
      <TransitionGroup name="message" tag="div">
        <div
          v-for="message in visibleMessages"
          :key="message.id"
          class="chat-message"
          :class="getMessageClasses(message)"
        >
          <span class="message-time">
            {{ formatTime(message.timestamp) }}
          </span>
          <span class="message-author">
            {{ getPlayerName(message.playerId) }}:
          </span>
          <span class="message-text">
            {{ message.message }}
          </span>
        </div>
      </TransitionGroup>
    </div>
    
    <!-- Chat Input -->
    <div v-if="canChat" class="chat-input-container">
      <input
        ref="chatInput"
        v-model="currentMessage"
        type="text"
        placeholder="Press Enter to chat..."
        maxlength="200"
        class="chat-input"
        @keyup.enter="sendMessage"
        @keyup.escape="collapseChat"
        @focus="expandChat"
        @blur="handleInputBlur"
      />
      <div class="chat-hint">
        {{ chatHint }}
      </div>
    </div>
    
    <!-- Chat Status -->
    <div v-else class="chat-status">
      {{ chatStatusMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

// Props
const props = defineProps({
  messages: { type: Array, default: () => [] },
  canChat: { type: Boolean, default: false }
})

// Emits
const emit = defineEmits(['send-message'])

// Stores
const gameStore = useGameStore()
const uiStore = useUIStore()

// Refs
const messagesContainer = ref(null)
const chatInput = ref(null)
const currentMessage = ref('')
const expanded = ref(false)
const autoScroll = ref(true)

// Computed properties
const visibleMessages = computed(() => {
  const messageLimit = expanded.value ? 50 : 10
  return props.messages.slice(-messageLimit)
})

const chatHint = computed(() => {
  const player = gameStore.currentPlayer
  if (!player) return ''
  
  if (player.isVeteran) {
    return 'Veteran chat privileges'
  } else if (gameStore.serverState.gamePhase === 'intermission') {
    return 'Intermission chat active'
  } else {
    return 'Complete a match to earn chat privileges'
  }
})

const chatStatusMessage = computed(() => {
  if (gameStore.serverState.gamePhase === 'playing') {
    return 'Chat disabled during matches'
  } else {
    return 'Earn chat privileges by playing'
  }
})

// Methods
const sendMessage = () => {
  if (currentMessage.value.trim() && props.canChat) {
    emit('send-message', currentMessage.value.trim())
    currentMessage.value = ''
    collapseChat()
  }
}

const expandChat = () => {
  expanded.value = true
  uiStore.markChatRead()
}

const collapseChat = () => {
  expanded.value = false
  chatInput.value?.blur()
}

const handleInputBlur = () => {
  // Delay collapse to allow for click events
  setTimeout(() => {
    if (!chatInput.value?.matches(':focus')) {
      collapseChat()
    }
  }, 100)
}

const handleScroll = () => {
  if (messagesContainer.value) {
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.value
    autoScroll.value = scrollTop + clientHeight >= scrollHeight - 10
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value && autoScroll.value) {
    nextTick(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    })
  }
}

const getMessageClasses = (message) => ({
  'message-system': message.type === 'system',
  'message-player': message.type === 'player',
  'message-veteran': message.isVeteran,
  'message-own': message.playerId === gameStore.clientState.currentPlayerId
})

const getPlayerName = (playerId) => {
  const player = gameStore.serverState.players.get(playerId)
  return player?.handle || 'Unknown'
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watch for new messages
watch(() => props.messages.length, () => {
  scrollToBottom()
})

// Global key handler for quick chat access
const handleGlobalKeydown = (event) => {
  if (event.key === 'Enter' && !expanded.value && props.canChat) {
    event.preventDefault()
    chatInput.value?.focus()
  }
}

document.addEventListener('keydown', handleGlobalKeydown)
</script>

<style scoped>
.chat-panel {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 400px;
  max-height: 300px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #333;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  transition: all 0.3s ease;
}

.chat-panel.chat-expanded {
  max-height: 500px;
  background: rgba(0, 0, 0, 0.9);
}

.chat-panel.chat-disabled {
  opacity: 0.6;
}

.chat-messages {
  max-height: 250px;
  overflow-y: auto;
  padding: 8px;
}

.chat-message {
  margin-bottom: 4px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  color: #666;
  margin-right: 4px;
}

.message-author {
  color: #4CAF50;
  font-weight: bold;
}

.message-text {
  color: #fff;
}

.message-system .message-text {
  color: #FFC107;
  font-style: italic;
}

.message-veteran .message-author {
  color: #FF6B35;
}

.message-own .message-author {
  color: #2196F3;
}

.chat-input-container {
  border-top: 1px solid #333;
  padding: 8px;
}

.chat-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #444;
  border-radius: 2px;
  padding: 4px 8px;
  color: #fff;
  font-family: inherit;
  font-size: inherit;
}

.chat-input:focus {
  outline: none;
  border-color: #4CAF50;
  background: rgba(255, 255, 255, 0.15);
}

.chat-hint {
  font-size: 10px;
  color: #888;
  margin-top: 4px;
}

.chat-status {
  padding: 8px;
  text-align: center;
  color: #888;
  font-style: italic;
}

/* Message transitions */
.message-enter-active {
  transition: all 0.3s ease;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
```

## 🧪 Testing Patterns

### 1. Component Testing
```javascript
// tests/components/GameHUD.test.js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import GameHUD from '@/components/GameHUD.vue'
import { useGameStore } from '@/stores/gameStore'

describe('GameHUD', () => {
  let wrapper
  let gameStore
  
  beforeEach(() => {
    wrapper = mount(GameHUD, {
      props: {
        playerStats: {
          health: 100,
          maxHealth: 100,
          weaponHeat: 0,
          maxWeaponHeat: 100
        },
        gameStats: {
          timeRemaining: 300,
          phase: 'playing',
          scores: []
        }
      },
      global: {
        plugins: [createTestingPinia()]
      }
    })
    
    gameStore = useGameStore()
  })
  
  it('displays player health correctly', () => {
    expect(wrapper.find('[data-testid="player-health"]').text()).toContain('100')
  })
  
  it('shows weapon heat indicator', () => {
    expect(wrapper.find('[data-testid="weapon-heat"]').exists()).toBe(true)
  })
  
  it('updates when player stats change', async () => {
    await wrapper.setProps({
      playerStats: { ...wrapper.props('playerStats'), health: 50 }
    })
    
    expect(wrapper.find('[data-testid="player-health"]').text()).toContain('50')
  })
})
```

### 2. Integration Testing
```javascript
// tests/integration/canvasVueSync.test.js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import GameCanvas from '@/components/GameCanvas.vue'
import { useGameStore } from '@/stores/gameStore'

describe('Canvas Vue Synchronization', () => {
  let wrapper
  let mockCanvas
  
  beforeEach(() => {
    mockCanvas = {
      initialize: vi.fn(),
      render: vi.fn(),
      resize: vi.fn(),
      destroy: vi.fn(),
      eventSystem: {
        on: vi.fn(() => () => {}),
        emit: vi.fn()
      }
    }
    
    wrapper = mount(GameCanvas, {
      props: { width: 800, height: 600 },
      global: {
        plugins: [createTestingPinia()],
        provide: { gameCanvas: mockCanvas }
      }
    })
  })
  
  it('initializes canvas on mount', () => {
    expect(mockCanvas.initialize).toHaveBeenCalled()
  })
  
  it('emits canvas events to Vue', async () => {
    const gameStore = useGameStore()
    
    // Simulate canvas event
    const eventCallback = mockCanvas.eventSystem.on.mock.calls
      .find(call => call[0] === 'player_hit')[1]
    
    eventCallback({ playerId: 'p1', damage: 25 })
    
    // Verify event was processed
    expect(gameStore.updatePlayerStats).toHaveBeenCalledWith({
      playerId: 'p1',
      damage: 25
    })
  })
})
```

## 📋 Performance Best Practices

### 1. Render Loop Optimization
- Separate Canvas rendering from Vue reactivity
- Use `requestAnimationFrame` for Canvas updates
- Throttle UI updates to prevent overwhelming Vue
- Batch state updates when possible

### 2. Memory Management
- Clean up event listeners on component unmount
- Limit chat message history
- Remove old game objects from state
- Use object pooling for frequently created objects

### 3. Network Optimization
- Batch input events before sending to server
- Compress repeated state updates
- Use binary protocols for high-frequency data
- Implement client-side prediction for responsiveness

## 🚀 Deployment Considerations

### 1. Build Optimization
```javascript
// vite.config.js optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'pinia'],
          'game-canvas': ['./src/canvas/index.js'],
          'ui-components': ['./src/components/index.js']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### 2. Asset Management
- Preload critical game assets
- Use sprite atlases for efficient loading
- Implement progressive loading for large assets
- Cache assets in browser storage

This implementation guide provides the foundation for successfully integrating Vue.js UI components with Canvas game rendering while maintaining performance and clean architecture.