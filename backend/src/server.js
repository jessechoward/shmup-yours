import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { RoomManager } from './rooms.js';
import { MessageHandler } from './messageHandler.js';

class GameServer {
  constructor(port = 3001) {
    this.port = port;
    this.server = createServer();
    this.wss = new WebSocketServer({ server: this.server });
    this.roomManager = new RoomManager();
    this.messageHandler = new MessageHandler(this.roomManager);
    
    this.setupWebSocketHandlers();
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, request) => {
      const clientId = this.generateClientId();
      ws.clientId = clientId;
      
      console.log(`[${new Date().toISOString()}] Client ${clientId} connected from ${request.socket.remoteAddress}`);
      
      // Send welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        clientId: clientId,
        message: 'Connected to shmup-yours server'
      }));

      // Handle incoming messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.messageHandler.handleMessage(ws, message);
        } catch (error) {
          console.error(`[${clientId}] Invalid message format:`, error.message);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        console.log(`[${new Date().toISOString()}] Client ${clientId} disconnected`);
        this.roomManager.removePlayerFromAllRooms(clientId);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`[${clientId}] WebSocket error:`, error.message);
      });
    });
  }

  generateClientId() {
    return 'client_' + Math.random().toString(36).substr(2, 9);
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`🚀 WebSocket server running on port ${this.port}`);
      console.log(`📡 Server-authoritative architecture enabled`);
      console.log(`🎮 Ready for multiplayer connections`);
    });
  }

  stop() {
    this.wss.close();
    this.server.close();
  }
}

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new GameServer();
  server.start();

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.stop();
    process.exit(0);
  });
}

export { GameServer };
