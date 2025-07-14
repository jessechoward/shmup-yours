const { PLAYER_STATES } = require('../config/match-config');

/**
 * SessionManager manages player sessions and connection state.
 * Tracks player lifecycle, performance data, and relegation status.
 */
class SessionManager {
  constructor() {
    this.sessions = new Map(); // sessionId -> session data
    this.connectionToSession = new Map(); // connectionId -> sessionId
    this.nextSessionId = 1;
  }

  /**
   * Create a new player session for a WebSocket connection
   * @param {string} connectionId - WebSocket connection identifier
   * @returns {string} sessionId - Unique session identifier
   */
  createSession(connectionId) {
    const sessionId = `session_${this.nextSessionId++}_${Date.now()}`;
    
    const sessionData = {
      sessionId,
      connectionId,
      handle: null,
      state: PLAYER_STATES.NEW,
      performanceHistory: [],
      relegationStreak: 0,
      totalMatches: 0,
      joinedAt: Date.now(),
      lastActive: Date.now(),
      isConnected: true
    };

    this.sessions.set(sessionId, sessionData);
    this.connectionToSession.set(connectionId, sessionId);

    return sessionId;
  }

  /**
   * Destroy a session (player permanently leaves)
   * @param {string} sessionId - Session to destroy
   * @returns {boolean} - True if session was found and destroyed
   */
  destroySession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      // Clean up connection mapping
      if (session.connectionId) {
        this.connectionToSession.delete(session.connectionId);
      }
      
      // Remove session
      this.sessions.delete(sessionId);
      return true;
    }
    return false;
  }

  /**
   * Get session data by session ID
   * @param {string} sessionId - Session to retrieve
   * @returns {Object|null} - Session data or null if not found
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get session ID by connection ID
   * @param {string} connectionId - WebSocket connection ID
   * @returns {string|null} - Session ID or null if not found
   */
  getSessionByConnection(connectionId) {
    return this.connectionToSession.get(connectionId) || null;
  }

  /**
   * Update session state
   * @param {string} sessionId - Session to update
   * @param {string} newState - New state from PLAYER_STATES
   * @returns {boolean} - True if session was found and updated
   */
  updateSessionState(sessionId, newState) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.state = newState;
      session.lastActive = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Set handle for a session
   * @param {string} sessionId - Session to update
   * @param {string} handle - Player's claimed handle
   * @returns {boolean} - True if session was found and updated
   */
  setSessionHandle(sessionId, handle) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.handle = handle;
      session.lastActive = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Track performance data for relegation calculation
   * @param {string} sessionId - Player session
   * @param {Object} matchResult - Match performance data
   * @param {string} matchResult.matchId - Unique match identifier
   * @param {number} matchResult.rank - Player's rank in match (1 = best)
   * @param {number} matchResult.score - Player's score
   * @param {number} matchResult.totalPlayers - Total players in match
   * @returns {boolean} - True if performance was recorded
   */
  trackPerformance(sessionId, matchResult) {
    const session = this.sessions.get(sessionId);
    if (session) {
      // Add to performance history
      session.performanceHistory.push({
        ...matchResult,
        timestamp: Date.now()
      });

      // Update total matches
      session.totalMatches++;

      // Update relegation streak
      const isBottomPerformer = this._isBottomPerformer(matchResult.rank, matchResult.totalPlayers);
      if (isBottomPerformer) {
        session.relegationStreak++;
      } else {
        session.relegationStreak = 0; // Reset streak on good performance
      }

      // Keep only recent performance history (last 10 matches)
      if (session.performanceHistory.length > 10) {
        session.performanceHistory = session.performanceHistory.slice(-10);
      }

      session.lastActive = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Check if a player should be relegated based on performance
   * @param {string} sessionId - Player session to check
   * @returns {boolean} - True if player should be relegated
   */
  checkRelegationStatus(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    const { RELEGATION_THRESHOLD, MINIMUM_PLAYERS_FOR_RELEGATION } = require('../config/match-config').MATCH_CONFIG;

    // Don't relegate if player hasn't played enough matches
    if (session.totalMatches < RELEGATION_THRESHOLD) {
      return false;
    }

    // Don't relegate if there aren't enough total players
    const activePlayers = this.getActivePlayerCount();
    if (activePlayers < MINIMUM_PLAYERS_FOR_RELEGATION) {
      return false;
    }

    // Check if player has consecutive poor performances
    return session.relegationStreak >= RELEGATION_THRESHOLD;
  }

  /**
   * Relegate a player (kick them from server)
   * @param {string} sessionId - Player to relegate
   * @returns {Object|null} - Relegation data or null if session not found
   */
  relegatePlayer(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      const relegationData = {
        sessionId,
        handle: session.handle,
        relegationStreak: session.relegationStreak,
        totalMatches: session.totalMatches,
        relegatedAt: Date.now()
      };

      // Update session state
      session.state = PLAYER_STATES.RELEGATED;
      session.lastActive = Date.now();

      return relegationData;
    }
    return null;
  }

  /**
   * Mark session as disconnected but keep session data
   * @param {string} connectionId - Disconnected connection
   * @returns {string|null} - Session ID that was disconnected
   */
  markDisconnected(connectionId) {
    const sessionId = this.connectionToSession.get(connectionId);
    if (sessionId) {
      const session = this.sessions.get(sessionId);
      if (session) {
        session.isConnected = false;
        session.lastActive = Date.now();
        this.connectionToSession.delete(connectionId);
        return sessionId;
      }
    }
    return null;
  }

  /**
   * Reconnect a session with new connection ID
   * @param {string} sessionId - Session to reconnect
   * @param {string} newConnectionId - New WebSocket connection ID
   * @returns {boolean} - True if session was found and reconnected
   */
  reconnectSession(sessionId, newConnectionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      // Clean up old connection mapping if exists
      if (session.connectionId) {
        this.connectionToSession.delete(session.connectionId);
      }

      // Update connection info
      session.connectionId = newConnectionId;
      session.isConnected = true;
      session.lastActive = Date.now();
      this.connectionToSession.set(newConnectionId, sessionId);

      return true;
    }
    return false;
  }

  /**
   * Get all sessions with a specific state
   * @param {string} state - State to filter by (from PLAYER_STATES)
   * @returns {Array} - Array of session data
   */
  getSessionsByState(state) {
    const result = [];
    for (const session of this.sessions.values()) {
      if (session.state === state) {
        result.push(session);
      }
    }
    return result;
  }

  /**
   * Get count of active connected players
   * @returns {number} - Number of connected players
   */
  getActivePlayerCount() {
    let count = 0;
    for (const session of this.sessions.values()) {
      if (session.isConnected && session.state !== PLAYER_STATES.RELEGATED) {
        count++;
      }
    }
    return count;
  }

  /**
   * Get session statistics for monitoring
   * @returns {Object} - Statistics about current sessions
   */
  getStatistics() {
    const states = {};
    let connectedCount = 0;
    let totalSessions = 0;

    for (const session of this.sessions.values()) {
      totalSessions++;
      
      if (session.isConnected) {
        connectedCount++;
      }

      states[session.state] = (states[session.state] || 0) + 1;
    }

    return {
      totalSessions,
      connectedSessions: connectedCount,
      stateBreakdown: states
    };
  }

  /**
   * Clean up stale sessions (disconnected for too long)
   * @param {number} maxIdleTime - Maximum idle time in milliseconds
   * @returns {number} - Number of sessions cleaned up
   */
  cleanupStaleSessions(maxIdleTime = 30 * 60 * 1000) { // 30 minutes default
    const now = Date.now();
    const staleSessions = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      if (!session.isConnected && (now - session.lastActive) > maxIdleTime) {
        staleSessions.push(sessionId);
      }
    }

    // Remove stale sessions
    staleSessions.forEach(sessionId => this.destroySession(sessionId));

    return staleSessions.length;
  }

  /**
   * Reset all sessions - called during server reset
   */
  resetAllSessions() {
    this.sessions.clear();
    this.connectionToSession.clear();
    this.nextSessionId = 1;
  }

  /**
   * Determine if a rank constitutes bottom performance for relegation
   * @private
   * @param {number} rank - Player's rank (1 = best)
   * @param {number} totalPlayers - Total players in match
   * @returns {boolean} - True if this is considered bottom performance
   */
  _isBottomPerformer(rank, totalPlayers) {
    const { RELEGATION_PERCENTILES } = require('../config/match-config').MATCH_CONFIG;
    
    // Find the appropriate threshold based on total players
    let threshold = 1; // Default to last place only
    
    for (const [playerCount, bottomCount] of Object.entries(RELEGATION_PERCENTILES)) {
      if (totalPlayers >= parseInt(playerCount)) {
        threshold = bottomCount;
      }
    }

    // Bottom performers are those ranked in the bottom threshold
    const bottomRankThreshold = totalPlayers - threshold + 1;
    return rank >= bottomRankThreshold;
  }
}

module.exports = SessionManager;