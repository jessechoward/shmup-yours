# Architecture Quick Reference

## Core Design (Single Source of Truth)
**Location**: `GAME_DESIGN.md` - Always reference this file for architectural decisions.

## Key Architectural Principles
1. **Single-server deployment** - No microservices, one Node.js process
2. **Single game world** - No rooms/lobbies, all players share same space
3. **In-memory state** - No database initially, game state in server memory
4. **WebSocket communication** - Real-time bidirectional messaging
5. **Handle-based identity** - Players reserve handles, no accounts/auth

## Critical Patterns
- **Game Loop**: 5-minute matches + 2-minute intermissions
- **Player States**: Active (playing) → Inactive (timeout) → Viewer (relegated)
- **Message Flow**: Client ↔ WebSocket ↔ Game Engine ↔ All Clients
- **State Sync**: Server is authoritative, clients receive updates

## Anti-Patterns (Do NOT implement)
- ❌ Room-based architecture
- ❌ Database persistence layer
- ❌ Authentication/user accounts
- ❌ Microservices separation
- ❌ REST API for game actions

## Dependencies
- Game engine must be completed before client communication
- WebSocket server must be set up before real-time features
- Handle reservation must work before player management
- Basic game loop before advanced features

## Testing Strategy
- Unit tests for game logic (isolated)
- Integration tests for WebSocket communication
- E2E tests for complete player workflows
- No database tests (in-memory only)
