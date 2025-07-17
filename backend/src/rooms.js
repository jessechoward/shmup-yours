class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.playerRooms = new Map(); // Track which room each player is in
    this.maxPlayersPerRoom = 4;
    this.maxRooms = 100;
  }

  createRoom(roomId = null) {
    if (this.rooms.size >= this.maxRooms) {
      throw new Error('Maximum number of rooms reached');
    }

    const id = roomId || this.generateRoomId();
    
    if (this.rooms.has(id)) {
      throw new Error(`Room ${id} already exists`);
    }

    const room = {
      id,
      players: new Map(),
      gameState: 'waiting', // waiting, playing, ended
      createdAt: Date.now(),
      settings: {
        maxPlayers: this.maxPlayersPerRoom,
        tickRate: 60,
        mapSize: { width: 800, height: 600 }
      }
    };

    this.rooms.set(id, room);
    console.log(`🏠 Room ${id} created`);
    return room;
  }

  joinRoom(roomId, playerId, playerData = {}) {
    let room = this.rooms.get(roomId);
    
    // Auto-create room if it doesn't exist
    if (!room) {
      room = this.createRoom(roomId);
    }

    // Check if room is full
    if (room.players.size >= room.settings.maxPlayers) {
      throw new Error(`Room ${roomId} is full`);
    }

    // Check if player is already in another room
    if (this.playerRooms.has(playerId)) {
      this.leaveRoom(this.playerRooms.get(playerId), playerId);
    }

    // Add player to room
    const player = {
      id: playerId,
      name: playerData.name || `Player${room.players.size + 1}`,
      position: { x: 100 + room.players.size * 50, y: 300 },
      health: 100,
      score: 0,
      joinedAt: Date.now(),
      ...playerData
    };

    room.players.set(playerId, player);
    this.playerRooms.set(playerId, roomId);

    console.log(`👤 Player ${playerId} joined room ${roomId} (${room.players.size}/${room.settings.maxPlayers})`);
    
    return { room, player };
  }

  leaveRoom(roomId, playerId) {
    const room = this.rooms.get(roomId);
    if (!room) return false;

    const removed = room.players.delete(playerId);
    this.playerRooms.delete(playerId);

    if (removed) {
      console.log(`👋 Player ${playerId} left room ${roomId} (${room.players.size}/${room.settings.maxPlayers})`);
      
      // Remove empty rooms
      if (room.players.size === 0) {
        this.rooms.delete(roomId);
        console.log(`🗑️ Removed empty room ${roomId}`);
      }
    }

    return removed;
  }

  removePlayerFromAllRooms(playerId) {
    const roomId = this.playerRooms.get(playerId);
    if (roomId) {
      this.leaveRoom(roomId, playerId);
    }
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  getRoomForPlayer(playerId) {
    const roomId = this.playerRooms.get(playerId);
    return roomId ? this.rooms.get(roomId) : null;
  }

  listRooms() {
    return Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      playerCount: room.players.size,
      maxPlayers: room.settings.maxPlayers,
      gameState: room.gameState,
      createdAt: room.createdAt
    }));
  }

  broadcastToRoom(roomId, message, excludePlayerId = null) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    const messageStr = JSON.stringify(message);
    
    room.players.forEach((player, playerId) => {
      if (playerId !== excludePlayerId && player.ws && player.ws.readyState === 1) {
        player.ws.send(messageStr);
      }
    });
  }

  generateRoomId() {
    return 'room_' + Math.random().toString(36).substr(2, 8);
  }

  // Update player's WebSocket reference
  updatePlayerConnection(playerId, ws) {
    const room = this.getRoomForPlayer(playerId);
    if (room && room.players.has(playerId)) {
      room.players.get(playerId).ws = ws;
    }
  }

  // Get room statistics
  getStats() {
    return {
      totalRooms: this.rooms.size,
      totalPlayers: this.playerRooms.size,
      roomDetails: this.listRooms()
    };
  }
}

export { RoomManager };
