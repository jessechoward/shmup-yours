class MessageHandler {
  constructor(roomManager) {
    this.roomManager = roomManager;
    this.handlers = {
      'join_room': this.handleJoinRoom.bind(this),
      'leave_room': this.handleLeaveRoom.bind(this),
      'list_rooms': this.handleListRooms.bind(this),
      'player_move': this.handlePlayerMove.bind(this),
      'player_shoot': this.handlePlayerShoot.bind(this),
      'chat_message': this.handleChatMessage.bind(this),
      'ping': this.handlePing.bind(this)
    };
  }

  handleMessage(ws, message) {
    const { type, ...data } = message;
    
    if (!type) {
      this.sendError(ws, 'Message type is required');
      return;
    }

    const handler = this.handlers[type];
    if (!handler) {
      this.sendError(ws, `Unknown message type: ${type}`);
      return;
    }

    try {
      handler(ws, data);
    } catch (error) {
      console.error(`Error handling ${type}:`, error.message);
      this.sendError(ws, `Error processing ${type}: ${error.message}`);
    }
  }

  handleJoinRoom(ws, { roomId, playerName }) {
    const playerId = ws.clientId;
    
    try {
      const { room, player } = this.roomManager.joinRoom(roomId, playerId, { 
        name: playerName,
        ws: ws 
      });

      // Send success response to joining player
      ws.send(JSON.stringify({
        type: 'room_joined',
        roomId: room.id,
        player: player,
        room: {
          id: room.id,
          players: Array.from(room.players.values()).map(p => ({
            id: p.id,
            name: p.name,
            position: p.position,
            health: p.health,
            score: p.score
          })),
          gameState: room.gameState,
          settings: room.settings
        }
      }));

      // Notify other players in room
      this.roomManager.broadcastToRoom(room.id, {
        type: 'player_joined',
        player: {
          id: player.id,
          name: player.name,
          position: player.position,
          health: player.health,
          score: player.score
        }
      }, playerId);

    } catch (error) {
      this.sendError(ws, error.message);
    }
  }

  handleLeaveRoom(ws, { roomId }) {
    const playerId = ws.clientId;
    
    if (this.roomManager.leaveRoom(roomId, playerId)) {
      ws.send(JSON.stringify({
        type: 'room_left',
        roomId: roomId
      }));

      // Notify other players
      this.roomManager.broadcastToRoom(roomId, {
        type: 'player_left',
        playerId: playerId
      });
    } else {
      this.sendError(ws, 'Not in specified room or room does not exist');
    }
  }

  handleListRooms(ws, data) {
    const rooms = this.roomManager.listRooms();
    
    ws.send(JSON.stringify({
      type: 'rooms_list',
      rooms: rooms
    }));
  }

  handlePlayerMove(ws, { position, velocity }) {
    const playerId = ws.clientId;
    const room = this.roomManager.getRoomForPlayer(playerId);
    
    if (!room) {
      this.sendError(ws, 'Not in a room');
      return;
    }

    const player = room.players.get(playerId);
    if (!player) {
      this.sendError(ws, 'Player not found in room');
      return;
    }

    // Update player position (server-authoritative with validation)
    if (position) {
      // Validate position bounds
      const { width, height } = room.settings.mapSize;
      player.position.x = Math.max(0, Math.min(width, position.x));
      player.position.y = Math.max(0, Math.min(height, position.y));
    }

    if (velocity) {
      player.velocity = velocity;
    }

    // Broadcast movement to other players
    this.roomManager.broadcastToRoom(room.id, {
      type: 'player_moved',
      playerId: playerId,
      position: player.position,
      velocity: player.velocity,
      timestamp: Date.now()
    }, playerId);
  }

  handlePlayerShoot(ws, { direction, position }) {
    const playerId = ws.clientId;
    const room = this.roomManager.getRoomForPlayer(playerId);
    
    if (!room) {
      this.sendError(ws, 'Not in a room');
      return;
    }

    // Create projectile (server-authoritative)
    const projectile = {
      id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      playerId: playerId,
      position: position || room.players.get(playerId).position,
      direction: direction,
      speed: 300, // pixels per second
      damage: 10,
      createdAt: Date.now()
    };

    // Broadcast projectile to all players in room
    this.roomManager.broadcastToRoom(room.id, {
      type: 'projectile_created',
      projectile: projectile
    });
  }

  handleChatMessage(ws, { message }) {
    const playerId = ws.clientId;
    const room = this.roomManager.getRoomForPlayer(playerId);
    
    if (!room) {
      this.sendError(ws, 'Not in a room');
      return;
    }

    const player = room.players.get(playerId);
    if (!player) {
      this.sendError(ws, 'Player not found');
      return;
    }

    // Broadcast chat message to room
    this.roomManager.broadcastToRoom(room.id, {
      type: 'chat_message',
      playerId: playerId,
      playerName: player.name,
      message: message,
      timestamp: Date.now()
    });
  }

  handlePing(ws, data) {
    ws.send(JSON.stringify({
      type: 'pong',
      timestamp: Date.now(),
      clientTimestamp: data.timestamp
    }));
  }

  sendError(ws, message) {
    ws.send(JSON.stringify({
      type: 'error',
      message: message,
      timestamp: Date.now()
    }));
  }
}

export { MessageHandler };
