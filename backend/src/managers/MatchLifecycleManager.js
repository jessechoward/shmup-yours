const { MATCH_CONFIG, MATCH_STATES, PLAYER_STATES } = require('../config/match-config');
const TimerManager = require('./TimerManager');
const HandleRegistry = require('./HandleRegistry');
const SessionManager = require('./SessionManager');
const PlayerQueueManager = require('./PlayerQueueManager');

/**
 * MatchLifecycleManager is the central coordinator for the match system.
 * Manages state transitions, timers, and coordinates all other managers.
 */
class MatchLifecycleManager {
  constructor() {
    // Initialize all manager components
    this.timerManager = new TimerManager();
    this.handleRegistry = new HandleRegistry();
    this.sessionManager = new SessionManager();
    this.playerQueueManager = new PlayerQueueManager(this.sessionManager, this.handleRegistry);

    // Match state
    this.currentState = MATCH_STATES.SERVER_START;
    this.currentMatch = null;
    this.matchHistory = [];
    this.serverResetTimer = null;

    // Event listeners for external systems
    this.eventListeners = {
      stateChange: [],
      matchStart: [],
      matchEnd: [],
      playerRelegated: [],
      serverReset: []
    };

    // Server lifecycle
    this.serverStartTime = Date.now();
    this.totalMatches = 0;
  }

  /**
   * Start the server and begin match lifecycle
   */
  startServer() {
    console.log('Starting match lifecycle server...');
    
    // Reset all state
    this.currentState = MATCH_STATES.SERVER_START;
    this.currentMatch = null;
    this.serverStartTime = Date.now();
    this.totalMatches = 0;

    // Schedule server reset
    this._scheduleServerReset();

    // Begin with intermission state
    this._transitionToIntermission();

    this._emitEvent('stateChange', { 
      newState: this.currentState, 
      timestamp: Date.now() 
    });
  }

  /**
   * Process a server tick - called regularly for maintenance
   */
  processServerTick() {
    // Clean up stale sessions
    const staleSessions = this.sessionManager.cleanupStaleSessions();
    if (staleSessions > 0) {
      console.log(`Cleaned up ${staleSessions} stale sessions`);
    }

    // Clean up player queue
    const removedFromQueue = this.playerQueueManager.cleanupQueue();
    if (removedFromQueue > 0) {
      console.log(`Removed ${removedFromQueue} disconnected players from queue`);
    }

    // Check for relegations if we're in intermission
    if (this.currentState === MATCH_STATES.INTERMISSION) {
      this._processRelegations();
    }
  }

  /**
   * Handle new player connection
   * @param {string} connectionId - WebSocket connection ID
   * @returns {string} - Session ID for the new player
   */
  handlePlayerConnect(connectionId) {
    const sessionId = this.sessionManager.createSession(connectionId);
    console.log(`New player connected: ${sessionId}`);
    return sessionId;
  }

  /**
   * Handle player disconnection
   * @param {string} connectionId - WebSocket connection ID
   */
  handlePlayerDisconnect(connectionId) {
    const sessionId = this.sessionManager.markDisconnected(connectionId);
    if (sessionId) {
      // Remove from queue if present
      this.playerQueueManager.removePlayerFromQueue(sessionId);
      
      // Mark handle as inactive but keep it reserved
      this.handleRegistry.markHandleInactive(sessionId);
      
      console.log(`Player disconnected: ${sessionId}`);
    }
  }

  /**
   * Handle player claiming a handle
   * @param {string} sessionId - Player's session
   * @param {string} handle - Desired handle
   * @returns {Object} - Result of handle claim attempt
   */
  handleClaimHandle(sessionId, handle) {
    const claimResult = this.handleRegistry.claimHandle(sessionId, handle);
    
    if (claimResult.success) {
      this.sessionManager.setSessionHandle(sessionId, handle);
      console.log(`Handle claimed: ${handle} by ${sessionId}`);
    }
    
    return claimResult;
  }

  /**
   * Handle player joining queue
   * @param {string} sessionId - Player's session
   * @returns {Object} - Result of queue join attempt
   */
  handleJoinQueue(sessionId) {
    const session = this.sessionManager.getSession(sessionId);
    if (!session || !session.handle) {
      return { success: false, reason: 'Must claim handle first' };
    }

    return this.playerQueueManager.addPlayerToQueue(sessionId, session.handle);
  }

  /**
   * Handle player leaving queue
   * @param {string} sessionId - Player's session
   * @returns {boolean} - True if successfully removed from queue
   */
  handleLeaveQueue(sessionId) {
    return this.playerQueueManager.removePlayerFromQueue(sessionId);
  }

  /**
   * Record match results and process performance
   * @param {Array} matchResults - Array of player results
   * @param {string} matchResults[].sessionId - Player session
   * @param {number} matchResults[].rank - Final rank (1 = winner)
   * @param {number} matchResults[].score - Final score
   */
  recordMatchResults(matchResults) {
    if (!this.currentMatch) {
      console.error('Attempted to record results without active match');
      return;
    }

    const matchId = this.currentMatch.matchId;
    const totalPlayers = matchResults.length;

    // Record performance for each player
    matchResults.forEach(result => {
      this.sessionManager.trackPerformance(result.sessionId, {
        matchId,
        rank: result.rank,
        score: result.score,
        totalPlayers
      });
    });

    // Store match in history
    this.matchHistory.push({
      ...this.currentMatch,
      results: matchResults,
      endTime: Date.now()
    });

    // Keep only recent match history
    if (this.matchHistory.length > 100) {
      this.matchHistory = this.matchHistory.slice(-100);
    }

    console.log(`Match ${matchId} completed with ${totalPlayers} players`);
  }

  /**
   * Get current server state
   * @returns {Object} - Current state information
   */
  getCurrentState() {
    return {
      state: this.currentState,
      match: this.currentMatch,
      queue: this.playerQueueManager.getQueueStatus(),
      handles: this.handleRegistry.getStatistics(),
      sessions: this.sessionManager.getStatistics(),
      uptime: Date.now() - this.serverStartTime,
      totalMatches: this.totalMatches,
      nextReset: this.serverResetTimer ? this.timerManager.getRemainingTime(this.serverResetTimer) : null
    };
  }

  /**
   * Add event listener for lifecycle events
   * @param {string} event - Event name
   * @param {function} callback - Event callback
   */
  addEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].push(callback);
    }
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {function} callback - Event callback to remove
   */
  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      const index = this.eventListeners[event].indexOf(callback);
      if (index !== -1) {
        this.eventListeners[event].splice(index, 1);
      }
    }
  }

  /**
   * Force server reset (admin command)
   */
  forceServerReset() {
    console.log('Force server reset initiated');
    this._executeServerReset();
  }

  // Private methods for state management

  /**
   * Transition to intermission state
   * @private
   */
  _transitionToIntermission() {
    this.currentState = MATCH_STATES.INTERMISSION;
    this.currentMatch = null;

    console.log('Starting intermission period');

    // Start intermission timer
    this.timerManager.startIntermissionTimer(
      MATCH_CONFIG.INTERMISSION_DURATION,
      () => this._attemptMatchStart()
    );

    this._emitEvent('stateChange', { 
      newState: this.currentState, 
      timestamp: Date.now() 
    });
  }

  /**
   * Attempt to start a match
   * @private
   */
  _attemptMatchStart() {
    // Check if we have enough players
    if (!this.playerQueueManager.canStartMatch()) {
      console.log('Not enough players for match, extending intermission');
      // Restart intermission timer
      this.timerManager.startIntermissionTimer(
        MATCH_CONFIG.INTERMISSION_DURATION,
        () => this._attemptMatchStart()
      );
      return;
    }

    // Select players for match
    const selectedPlayers = this.playerQueueManager.selectPlayersForMatch();
    
    if (selectedPlayers.length === 0) {
      console.log('No players selected for match, extending intermission');
      this._transitionToIntermission();
      return;
    }

    this._startMatch(selectedPlayers);
  }

  /**
   * Start an active match
   * @private
   */
  _startMatch(playerSessions) {
    this.currentState = MATCH_STATES.ACTIVE_MATCH;
    this.totalMatches++;

    this.currentMatch = {
      matchId: `match_${this.totalMatches}_${Date.now()}`,
      startTime: Date.now(),
      endTime: null,
      playerSessions,
      playerCount: playerSessions.length
    };

    console.log(`Starting match ${this.currentMatch.matchId} with ${playerSessions.length} players`);

    // Start match timer
    this.timerManager.startMatchTimer(
      MATCH_CONFIG.MATCH_DURATION,
      () => this._endMatch()
    );

    this._emitEvent('matchStart', {
      match: this.currentMatch,
      timestamp: Date.now()
    });

    this._emitEvent('stateChange', { 
      newState: this.currentState, 
      timestamp: Date.now() 
    });
  }

  /**
   * End the current match
   * @private
   */
  _endMatch() {
    if (this.currentMatch) {
      console.log(`Ending match ${this.currentMatch.matchId}`);
      
      this.currentMatch.endTime = Date.now();

      this._emitEvent('matchEnd', {
        match: this.currentMatch,
        timestamp: Date.now()
      });

      // Requeue players for next match
      const requeueResult = this.playerQueueManager.requeuePlayers(this.currentMatch.playerSessions);
      
      // Handle relegations from requeue
      requeueResult.failed.forEach(failure => {
        if (failure.reason === 'relegated' && failure.data) {
          this._emitEvent('playerRelegated', failure.data);
        }
      });
    }

    // Transition back to intermission
    this._transitionToIntermission();
  }

  /**
   * Process relegations during intermission
   * @private
   */
  _processRelegations() {
    const activeSessions = this.sessionManager.getSessionsByState(PLAYER_STATES.ACTIVE);
    const queuedSessions = this.sessionManager.getSessionsByState(PLAYER_STATES.QUEUED);
    
    // Check all non-relegated players for relegation
    [...activeSessions, ...queuedSessions].forEach(session => {
      if (this.sessionManager.checkRelegationStatus(session.sessionId)) {
        const relegationData = this.playerQueueManager.relegatePlayer(session.sessionId);
        if (relegationData) {
          console.log(`Player relegated: ${relegationData.handle}`);
          this._emitEvent('playerRelegated', relegationData);
        }
      }
    });
  }

  /**
   * Schedule server reset timer
   * @private
   */
  _scheduleServerReset() {
    this.serverResetTimer = this.timerManager.scheduleServerReset(
      MATCH_CONFIG.SERVER_RESET_INTERVAL,
      () => this._executeServerReset()
    );

    console.log(`Server reset scheduled for ${new Date(Date.now() + MATCH_CONFIG.SERVER_RESET_INTERVAL)}`);
  }

  /**
   * Execute server reset
   * @private
   */
  _executeServerReset() {
    console.log('Executing server reset...');
    
    this.currentState = MATCH_STATES.SERVER_RESET;
    
    this._emitEvent('serverReset', { 
      timestamp: Date.now(),
      uptime: Date.now() - this.serverStartTime,
      totalMatches: this.totalMatches
    });

    // Clear all timers
    this.timerManager.clearAllTimers();

    // Reset all manager state
    this.handleRegistry.resetAllHandles();
    this.sessionManager.resetAllSessions();
    this.playerQueueManager.resetQueue();
    this.timerManager.resetServerStartTime();

    // Reset match state
    this.currentMatch = null;
    this.matchHistory = [];
    this.serverResetTimer = null;

    // Restart server
    setTimeout(() => {
      this.startServer();
    }, 1000); // Brief pause before restart
  }

  /**
   * Emit event to listeners
   * @private
   */
  _emitEvent(eventName, data) {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Event listener error for ${eventName}:`, error);
        }
      });
    }
  }
}

module.exports = MatchLifecycleManager;