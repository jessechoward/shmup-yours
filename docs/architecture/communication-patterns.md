# Vue.js + Canvas Communication Patterns

## 🎯 Overview

This document defines the communication patterns between Vue.js UI components and Canvas game rendering, establishing clear protocols for event handling, message passing, and state synchronization.

## 🔄 Communication Architecture

### 1. Communication Channels
```
┌─────────────────────────────────────────────────────────────┐
│                     WebSocket Server                       │
└─────────────────────┬───────────────────────────────────────┘
                      │ Server Messages
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Message Router                           │
│            (WebSocket Event Handler)                       │
└─────────┬─────────────────────────────────┬─────────────────┘
          │                                 │
          ▼                                 ▼
┌─────────────────────┐              ┌─────────────────────┐
│    Pinia Store      │◄────────────►│  Canvas Renderer    │
│  (State Manager)    │  State Sync  │  (Game Engine)      │
└─────────┬───────────┘              └─────────┬───────────┘
          │                                    │
          ▼                                    ▼
┌─────────────────────┐              ┌─────────────────────┐
│  Vue Components     │              │   Custom Events    │
│   (UI Layer)        │              │  (Canvas → Vue)    │
└─────────────────────┘              └─────────────────────┘
```

### 2. Event Flow Types

#### Server → Client Flow
- Game state updates
- Player actions
- Match events
- Chat messages

#### Client → Server Flow
- Input commands
- Chat messages
- Menu actions
- Connection events

#### Canvas → Vue Flow
- Visual effects completion
- Collision events
- Animation triggers
- Performance metrics

#### Vue → Canvas Flow
- UI state changes
- User interactions
- Configuration updates
- Viewport changes

## 📡 WebSocket Communication Layer

### 1. Message Router Implementation
```javascript
// websocket/messageRouter.js
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

export class MessageRouter {
  constructor() {
    this.gameStore = useGameStore()
    this.uiStore = useUIStore()
    this.eventBus = new EventTarget()
    this.handlers = new Map()
    
    this.setupMessageHandlers()
  }
  
  setupMessageHandlers() {
    this.handlers.set('game_state', this.handleGameState.bind(this))
    this.handlers.set('player_joined', this.handlePlayerJoined.bind(this))
    this.handlers.set('player_left', this.handlePlayerLeft.bind(this))
    this.handlers.set('chat_message', this.handleChatMessage.bind(this))
    this.handlers.set('match_start', this.handleMatchStart.bind(this))
    this.handlers.set('match_end', this.handleMatchEnd.bind(this))
    this.handlers.set('player_death', this.handlePlayerDeath.bind(this))
    this.handlers.set('weapon_fired', this.handleWeaponFired.bind(this))
  }
  
  routeMessage(message) {
    try {
      const { type, data, timestamp } = JSON.parse(message.data)
      const handler = this.handlers.get(type)
      
      if (handler) {
        handler(data, timestamp)
      } else {
        console.warn(`Unhandled message type: ${type}`)
      }
    } catch (error) {
      console.error('Message routing error:', error)
    }
  }
  
  // Message Handlers
  handleGameState(data, timestamp) {
    this.gameStore.updateServerState({
      type: 'full_state',
      data,
      timestamp
    })
    
    // Emit for Canvas renderer
    this.emitCanvasEvent('state_update', data)
  }
  
  handlePlayerJoined(data, timestamp) {
    this.gameStore.updateServerState({
      type: 'player_update',
      data,
      timestamp
    })
    
    // UI notification
    this.uiStore.addSystemMessage({
      type: 'player_joined',
      message: `${data.handle} joined the game`,
      timestamp
    })
  }
  
  handleChatMessage(data, timestamp) {
    this.uiStore.addChatMessage({
      ...data,
      timestamp
    })
    
    // Audio notification for new messages
    this.emitCanvasEvent('play_sound', { 
      sound: 'chat_notification',
      volume: 0.3 
    })
  }
  
  handleMatchStart(data, timestamp) {
    this.gameStore.updateServerState({
      type: 'match_timer',
      data: { phase: 'playing', ...data },
      timestamp
    })
    
    this.uiStore.hideAllMenus()
    this.emitCanvasEvent('match_start', data)
  }
  
  handlePlayerDeath(data, timestamp) {
    this.gameStore.updateServerState({
      type: 'player_death',
      data,
      timestamp
    })
    
    // Trigger death animation
    this.emitCanvasEvent('player_death', data)
    
    // Show death UI if it's current player
    if (data.playerId === this.gameStore.clientState.currentPlayerId) {
      this.uiStore.showDeathOverlay(data)
    }
  }
  
  // Canvas Event Emission
  emitCanvasEvent(type, data) {
    const event = new CustomEvent('canvasEvent', {
      detail: { type, data, timestamp: Date.now() }
    })
    this.eventBus.dispatchEvent(event)
  }
  
  // Subscribe to Canvas events
  onCanvasEvent(callback) {
    this.eventBus.addEventListener('canvasEvent', callback)
    return () => this.eventBus.removeEventListener('canvasEvent', callback)
  }
}
```

### 2. WebSocket Client Implementation
```javascript
// websocket/gameClient.js
export class GameWebSocketClient {
  constructor(messageRouter) {
    this.router = messageRouter
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
    this.heartbeatInterval = null
  }
  
  connect(url = 'ws://localhost:3001') {
    try {
      this.ws = new WebSocket(url)
      this.setupEventHandlers()
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.scheduleReconnect()
    }
  }
  
  setupEventHandlers() {
    this.ws.onopen = this.handleOpen.bind(this)
    this.ws.onmessage = this.handleMessage.bind(this)
    this.ws.onclose = this.handleClose.bind(this)
    this.ws.onerror = this.handleError.bind(this)
  }
  
  handleOpen() {
    console.log('WebSocket connected')
    this.reconnectAttempts = 0
    this.startHeartbeat()
    
    // Update connection status
    const gameStore = useGameStore()
    gameStore.connection.status = 'connected'
  }
  
  handleMessage(event) {
    // Route message through message router
    this.router.routeMessage(event)
  }
  
  handleClose() {
    console.log('WebSocket disconnected')
    this.stopHeartbeat()
    
    const gameStore = useGameStore()
    gameStore.connection.status = 'disconnected'
    
    this.scheduleReconnect()
  }
  
  handleError(error) {
    console.error('WebSocket error:', error)
  }
  
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('Cannot send message: WebSocket not connected')
    }
  }
  
  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }
  
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({ type: 'ping', timestamp: Date.now() })
    }, 30000) // Ping every 30 seconds
  }
  
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }
}
```

## 🎮 Canvas-Vue Communication Bridge

### 1. Canvas Event System
```javascript
// canvas/eventSystem.js
export class CanvasEventSystem {
  constructor(canvas) {
    this.canvas = canvas
    this.eventTarget = new EventTarget()
    this.eventQueue = []
    this.processingEvents = false
  }
  
  // Emit events from Canvas to Vue
  emit(type, data) {
    const event = new CustomEvent('gameCanvasEvent', {
      detail: { type, data, timestamp: Date.now() }
    })
    
    // Queue events to prevent overwhelming Vue reactivity
    this.eventQueue.push(event)
    
    if (!this.processingEvents) {
      this.processEventQueue()
    }
  }
  
  processEventQueue() {
    this.processingEvents = true
    
    // Process events in batches
    const batchSize = 10
    const batch = this.eventQueue.splice(0, batchSize)
    
    batch.forEach(event => {
      this.eventTarget.dispatchEvent(event)
    })
    
    if (this.eventQueue.length > 0) {
      // Continue processing in next frame
      requestAnimationFrame(() => this.processEventQueue())
    } else {
      this.processingEvents = false
    }
  }
  
  // Subscribe to events
  on(type, callback) {
    const handler = (event) => {
      if (event.detail.type === type) {
        callback(event.detail.data)
      }
    }
    
    this.eventTarget.addEventListener('gameCanvasEvent', handler)
    return () => this.eventTarget.removeEventListener('gameCanvasEvent', handler)
  }
  
  // Common event emitters
  emitPlayerHit(playerId, damage, weapon) {
    this.emit('player_hit', { playerId, damage, weapon })
  }
  
  emitProjectileHit(projectileId, targetId) {
    this.emit('projectile_hit', { projectileId, targetId })
  }
  
  emitAnimationComplete(animationType, entityId) {
    this.emit('animation_complete', { animationType, entityId })
  }
  
  emitPerformanceMetrics(fps, renderTime, objectCount) {
    this.emit('performance_update', { fps, renderTime, objectCount })
  }
}
```

### 2. Vue Canvas Integration Composable
```javascript
// composables/useCanvasIntegration.js
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'

export function useCanvasIntegration(canvasRef, renderer) {
  const gameStore = useGameStore()
  const uiStore = useUIStore()
  const eventHandlers = []
  
  const setupCanvasEvents = () => {
    if (!renderer || !renderer.eventSystem) return
    
    // Player events
    const unsubscribePlayerHit = renderer.eventSystem.on('player_hit', (data) => {
      // Update UI with hit feedback
      uiStore.showDamageIndicator(data)
      
      // Update health display
      if (data.playerId === gameStore.clientState.currentPlayerId) {
        uiStore.triggerHealthPulse()
      }
    })
    
    // Animation events
    const unsubscribeAnimationComplete = renderer.eventSystem.on('animation_complete', (data) => {
      if (data.animationType === 'death' && data.entityId === gameStore.clientState.currentPlayerId) {
        uiStore.showRespawnTimer()
      }
    })
    
    // Performance events
    const unsubscribePerformance = renderer.eventSystem.on('performance_update', (data) => {
      uiStore.updatePerformanceMetrics(data)
    })
    
    eventHandlers.push(
      unsubscribePlayerHit,
      unsubscribeAnimationComplete,
      unsubscribePerformance
    )
  }
  
  const setupStateWatchers = () => {
    // Watch for game state changes that affect canvas
    const unsubscribeGameState = watch(
      () => gameStore.renderData,
      (newData) => {
        if (renderer) {
          renderer.updateGameState(newData)
        }
      },
      { deep: true }
    )
    
    // Watch for UI changes that affect canvas
    const unsubscribeUIState = watch(
      () => uiStore.hud.visible,
      (visible) => {
        if (renderer) {
          renderer.setHUDVisible(visible)
        }
      }
    )
    
    eventHandlers.push(unsubscribeGameState, unsubscribeUIState)
  }
  
  const setupInputForwarding = () => {
    if (!canvasRef.value) return
    
    const canvas = canvasRef.value
    
    const handleCanvasClick = (event) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      // Convert to game coordinates
      const gameCoords = {
        x: (x / rect.width) * gameStore.clientState.viewport.width,
        y: (y / rect.height) * gameStore.clientState.viewport.height
      }
      
      // Send click event to server
      const gameClient = useGameClient()
      gameClient.send({
        type: 'mouse_click',
        coordinates: gameCoords,
        timestamp: Date.now()
      })
    }
    
    const handleCanvasContextMenu = (event) => {
      event.preventDefault()
      // Handle right-click for different actions
    }
    
    canvas.addEventListener('click', handleCanvasClick)
    canvas.addEventListener('contextmenu', handleCanvasContextMenu)
    
    eventHandlers.push(
      () => canvas.removeEventListener('click', handleCanvasClick),
      () => canvas.removeEventListener('contextmenu', handleCanvasContextMenu)
    )
  }
  
  onMounted(() => {
    setupCanvasEvents()
    setupStateWatchers()
    setupInputForwarding()
  })
  
  onUnmounted(() => {
    eventHandlers.forEach(unsubscribe => unsubscribe())
  })
  
  return {
    setupCanvasEvents,
    setupStateWatchers,
    setupInputForwarding
  }
}
```

## 🎯 Input Communication Patterns

### 1. Input Event Aggregation
```javascript
// input/inputAggregator.js
export class InputAggregator {
  constructor(websocketClient) {
    this.ws = websocketClient
    this.inputBuffer = []
    this.sendRate = 16 // Send at 60fps max
    this.lastSendTime = 0
    this.currentInputState = {
      keys: new Set(),
      mouse: { x: 0, y: 0, buttons: 0 },
      timestamp: 0
    }
  }
  
  updateInput(inputType, data) {
    const now = Date.now()
    
    switch (inputType) {
      case 'keydown':
        this.currentInputState.keys.add(data.code)
        break
      case 'keyup':
        this.currentInputState.keys.delete(data.code)
        break
      case 'mousemove':
        this.currentInputState.mouse.x = data.x
        this.currentInputState.mouse.y = data.y
        break
      case 'mousedown':
        this.currentInputState.mouse.buttons |= (1 << data.button)
        break
      case 'mouseup':
        this.currentInputState.mouse.buttons &= ~(1 << data.button)
        break
    }
    
    this.currentInputState.timestamp = now
    
    // Send input if enough time has passed
    if (now - this.lastSendTime >= this.sendRate) {
      this.sendInputState()
    }
  }
  
  sendInputState() {
    this.ws.send({
      type: 'input_state',
      state: {
        keys: Array.from(this.currentInputState.keys),
        mouse: { ...this.currentInputState.mouse },
        timestamp: this.currentInputState.timestamp
      }
    })
    
    this.lastSendTime = this.currentInputState.timestamp
  }
}
```

### 2. Input Component Integration
```vue
<!-- components/GameInput.vue -->
<template>
  <div class="game-input-handler" @keydown="handleKeyDown" @keyup="handleKeyUp">
    <slot />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useInputAggregator } from '@/composables/useInputAggregator'

const { aggregator } = useInputAggregator()

const handleKeyDown = (event) => {
  // Prevent default for game keys
  if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'].includes(event.code)) {
    event.preventDefault()
  }
  
  aggregator.updateInput('keydown', { code: event.code })
}

const handleKeyUp = (event) => {
  aggregator.updateInput('keyup', { code: event.code })
}

const handleMouseMove = (event) => {
  aggregator.updateInput('mousemove', {
    x: event.clientX,
    y: event.clientY
  })
}

const handleMouseDown = (event) => {
  aggregator.updateInput('mousedown', { button: event.button })
}

const handleMouseUp = (event) => {
  aggregator.updateInput('mouseup', { button: event.button })
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mousedown', handleMouseDown)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mousedown', handleMouseDown)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>
```

## 🔧 Performance Communication Patterns

### 1. Event Throttling and Batching
```javascript
// utils/eventBatcher.js
export class EventBatcher {
  constructor(flushInterval = 16) {
    this.events = []
    this.flushInterval = flushInterval
    this.flushTimer = null
    this.subscribers = new Map()
  }
  
  addEvent(type, data) {
    this.events.push({ type, data, timestamp: Date.now() })
    
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.flushInterval)
    }
  }
  
  flush() {
    if (this.events.length === 0) return
    
    // Group events by type
    const groupedEvents = this.events.reduce((groups, event) => {
      if (!groups[event.type]) groups[event.type] = []
      groups[event.type].push(event)
      return groups
    }, {})
    
    // Notify subscribers with batched events
    Object.entries(groupedEvents).forEach(([type, events]) => {
      const handlers = this.subscribers.get(type) || []
      handlers.forEach(handler => handler(events))
    })
    
    this.events = []
    this.flushTimer = null
  }
  
  subscribe(type, handler) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, [])
    }
    this.subscribers.get(type).push(handler)
    
    return () => {
      const handlers = this.subscribers.get(type)
      const index = handlers.indexOf(handler)
      if (index > -1) handlers.splice(index, 1)
    }
  }
}
```

### 2. Priority-Based Event Handling
```javascript
// utils/priorityEventHandler.js
export class PriorityEventHandler {
  constructor() {
    this.queues = {
      high: [],    // Critical UI updates
      medium: [],  // Standard game events
      low: []      // Non-essential updates
    }
    this.processing = false
  }
  
  addEvent(priority, event) {
    if (this.queues[priority]) {
      this.queues[priority].push(event)
    }
    
    if (!this.processing) {
      this.processEvents()
    }
  }
  
  processEvents() {
    this.processing = true
    
    // Process high priority events first
    this.processQueue('high', 10) // Process up to 10 high priority events
    this.processQueue('medium', 5) // Then 5 medium priority events
    this.processQueue('low', 2)   // Finally 2 low priority events
    
    // Continue processing in next frame if there are more events
    if (this.hasEvents()) {
      requestAnimationFrame(() => this.processEvents())
    } else {
      this.processing = false
    }
  }
  
  processQueue(priority, maxEvents) {
    const queue = this.queues[priority]
    const events = queue.splice(0, maxEvents)
    
    events.forEach(event => {
      try {
        event.handler(event.data)
      } catch (error) {
        console.error(`Error processing ${priority} priority event:`, error)
      }
    })
  }
  
  hasEvents() {
    return Object.values(this.queues).some(queue => queue.length > 0)
  }
}
```

## 📋 Implementation Guidelines

### 1. Event Naming Conventions
- **Server Events**: `snake_case` (e.g., `game_state`, `player_joined`)
- **Canvas Events**: `camelCase` (e.g., `playerHit`, `animationComplete`)
- **Vue Events**: `kebab-case` (e.g., `send-message`, `update-settings`)

### 2. Message Structure Standards
```javascript
// Server → Client Message
{
  type: 'game_state',
  data: { /* payload */ },
  timestamp: 1234567890,
  sequence: 123 // For ordering
}

// Canvas → Vue Event
{
  type: 'playerHit',
  data: { playerId: 'p1', damage: 25 },
  timestamp: 1234567890
}

// Client → Server Message
{
  type: 'input_state',
  data: { keys: ['KeyW'], mouse: { x: 100, y: 200 } },
  timestamp: 1234567890,
  playerId: 'current_player_id'
}
```

### 3. Error Handling Patterns
- Always wrap message parsing in try-catch
- Implement exponential backoff for reconnections
- Queue messages when disconnected
- Provide fallback UI states for connection issues

### 4. Testing Communication
- Mock WebSocket connections for testing
- Test event ordering and timing
- Verify state synchronization accuracy
- Test performance under high event load

This communication architecture ensures reliable, performant message passing between all system components while maintaining clear separation of concerns.