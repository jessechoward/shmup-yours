const { MATCH_CONFIG, PLAYER_STATES } = require('../config/match-config');

/**
 * PlayerQueueManager manages player queuing and match balancing.
 * Handles queue operations, player selection for matches, and relegation processing.
 */
class PlayerQueueManager {
  constructor(sessionManager, handleRegistry) {
    this.sessionManager = sessionManager;
    this.handleRegistry = handleRegistry;
    this.playerQueue = []; // Array of sessionIds in queue order (FIFO)
    this.queuedAt = new Map(); // sessionId -> timestamp when queued
  }

  /**
   * Add a player to the queue
   * @param {string} sessionId - Player session to add
   * @param {string} handle - Player's handle
   * @returns {Object} - { success: boolean, position?: number, reason?: string }
   */
  addPlayerToQueue(sessionId, handle) {
    // Validate session exists
    const session = this.sessionManager.getSession(sessionId);
    if (!session) {
      return { success: false, reason: 'Invalid session' };
    }

    // Check if handle is claimed by this session
    const sessionHandle = this.handleRegistry.getHandleBySession(sessionId);
    if (sessionHandle !== handle) {
      return { success: false, reason: 'Handle not claimed by this session' };
    }

    // Check if player is already queued
    if (this.playerQueue.includes(sessionId)) {
      return { success: false, reason: 'Player already in queue' };
    }

    // Check queue capacity
    if (this.playerQueue.length >= MATCH_CONFIG.MAX_QUEUE_SIZE) {
      return { success: false, reason: 'Queue is full' };
    }

    // Check if player is relegated
    if (session.state === PLAYER_STATES.RELEGATED) {
      return { success: false, reason: 'Relegated players cannot rejoin queue' };
    }

    // Add to queue
    this.playerQueue.push(sessionId);
    this.queuedAt.set(sessionId, Date.now());
    
    // Update session state
    this.sessionManager.updateSessionState(sessionId, PLAYER_STATES.QUEUED);

    return { 
      success: true, 
      position: this.playerQueue.length,
      queueSize: this.playerQueue.length 
    };
  }

  /**
   * Remove a player from the queue
   * @param {string} sessionId - Player session to remove
   * @returns {boolean} - True if player was found and removed
   */
  removePlayerFromQueue(sessionId) {
    const index = this.playerQueue.indexOf(sessionId);
    if (index !== -1) {
      this.playerQueue.splice(index, 1);
      this.queuedAt.delete(sessionId);
      
      // Update session state if still exists
      const session = this.sessionManager.getSession(sessionId);
      if (session && session.state === PLAYER_STATES.QUEUED) {
        this.sessionManager.updateSessionState(sessionId, PLAYER_STATES.NEW);
      }
      
      return true;
    }
    return false;
  }

  /**
   * Select players for the next match
   * @returns {Array} - Array of sessionIds selected for match
   */
  selectPlayersForMatch() {
    // Ensure we have minimum players
    if (this.playerQueue.length < MATCH_CONFIG.MIN_MATCH_PLAYERS) {
      return [];
    }

    // Determine how many players to select
    const playersToSelect = Math.min(
      this.playerQueue.length,
      MATCH_CONFIG.MAX_MATCH_PLAYERS
    );

    // Select players from front of queue (FIFO)
    const selectedPlayers = this.playerQueue.splice(0, playersToSelect);

    // Update selected players' states
    selectedPlayers.forEach(sessionId => {
      this.queuedAt.delete(sessionId);
      this.sessionManager.updateSessionState(sessionId, PLAYER_STATES.ACTIVE);
    });

    return selectedPlayers;
  }

  /**
   * Process relegation for a player
   * @param {string} sessionId - Player to potentially relegate
   * @returns {Object|null} - Relegation data if player was relegated, null otherwise
   */
  relegatePlayer(sessionId) {
    // Check if player should be relegated
    if (!this.sessionManager.checkRelegationStatus(sessionId)) {
      return null;
    }

    // Remove from queue if present
    this.removePlayerFromQueue(sessionId);

    // Relegate the player
    const relegationData = this.sessionManager.relegatePlayer(sessionId);

    if (relegationData) {
      // Handle is now "lost" but remains reserved until server reset
      this.handleRegistry.markHandleInactive(sessionId);
    }

    return relegationData;
  }

  /**
   * Get current queue status
   * @returns {Object} - Queue information
   */
  getQueueStatus() {
    const queueData = this.playerQueue.map((sessionId, index) => {
      const session = this.sessionManager.getSession(sessionId);
      const queueTime = this.queuedAt.get(sessionId);
      
      return {
        position: index + 1,
        sessionId,
        handle: session ? session.handle : 'Unknown',
        queuedAt: queueTime,
        waitTime: queueTime ? Date.now() - queueTime : 0
      };
    });

    return {
      totalInQueue: this.playerQueue.length,
      maxQueueSize: MATCH_CONFIG.MAX_QUEUE_SIZE,
      canStartMatch: this.playerQueue.length >= MATCH_CONFIG.MIN_MATCH_PLAYERS,
      players: queueData
    };
  }

  /**
   * Get player's position in queue
   * @param {string} sessionId - Player to check
   * @returns {number} - Position in queue (1-based), or -1 if not in queue
   */
  getPlayerPosition(sessionId) {
    const index = this.playerQueue.indexOf(sessionId);
    return index !== -1 ? index + 1 : -1;
  }

  /**
   * Get estimated wait time for a player
   * @param {string} sessionId - Player to check
   * @returns {number} - Estimated wait time in milliseconds, or -1 if not in queue
   */
  getEstimatedWaitTime(sessionId) {
    const position = this.getPlayerPosition(sessionId);
    if (position === -1) {
      return -1;
    }

    // Estimate based on match duration and position
    const matchesAhead = Math.floor((position - 1) / MATCH_CONFIG.MAX_MATCH_PLAYERS);
    const cycleTime = MATCH_CONFIG.MATCH_DURATION + MATCH_CONFIG.INTERMISSION_DURATION;
    
    return matchesAhead * cycleTime;
  }

  /**
   * Clean up queue by removing disconnected/invalid players
   * @returns {number} - Number of players removed from queue
   */
  cleanupQueue() {
    const initialSize = this.playerQueue.length;
    
    this.playerQueue = this.playerQueue.filter(sessionId => {
      const session = this.sessionManager.getSession(sessionId);
      
      // Remove if session doesn't exist, is disconnected, or relegated
      if (!session || !session.isConnected || session.state === PLAYER_STATES.RELEGATED) {
        this.queuedAt.delete(sessionId);
        return false;
      }
      
      return true;
    });

    return initialSize - this.playerQueue.length;
  }

  /**
   * Check if queue has enough players for a match
   * @returns {boolean} - True if match can be started
   */
  canStartMatch() {
    return this.playerQueue.length >= MATCH_CONFIG.MIN_MATCH_PLAYERS;
  }

  /**
   * Requeue players after a match (for intermission processing)
   * @param {Array} sessionIds - Players to put back in queue
   * @returns {Object} - Status of requeue operation
   */
  requeuePlayers(sessionIds) {
    const requeued = [];
    const failed = [];

    sessionIds.forEach(sessionId => {
      const session = this.sessionManager.getSession(sessionId);
      
      // Only requeue if player is still connected and not relegated
      if (session && session.isConnected && session.state !== PLAYER_STATES.RELEGATED) {
        // Check relegation status first
        if (this.sessionManager.checkRelegationStatus(sessionId)) {
          // Player should be relegated instead of requeued
          const relegationData = this.relegatePlayer(sessionId);
          failed.push({ sessionId, reason: 'relegated', data: relegationData });
        } else {
          // Add back to end of queue
          this.playerQueue.push(sessionId);
          this.queuedAt.set(sessionId, Date.now());
          this.sessionManager.updateSessionState(sessionId, PLAYER_STATES.QUEUED);
          requeued.push(sessionId);
        }
      } else {
        failed.push({ sessionId, reason: 'disconnected or invalid' });
      }
    });

    return { requeued, failed };
  }

  /**
   * Reset the queue - called during server reset
   */
  resetQueue() {
    this.playerQueue = [];
    this.queuedAt.clear();
  }

  /**
   * Get queue statistics for monitoring
   * @returns {Object} - Queue statistics
   */
  getStatistics() {
    const now = Date.now();
    let totalWaitTime = 0;
    let longestWait = 0;

    this.playerQueue.forEach(sessionId => {
      const queueTime = this.queuedAt.get(sessionId);
      if (queueTime) {
        const waitTime = now - queueTime;
        totalWaitTime += waitTime;
        longestWait = Math.max(longestWait, waitTime);
      }
    });

    const averageWaitTime = this.playerQueue.length > 0 ? totalWaitTime / this.playerQueue.length : 0;

    return {
      currentQueueSize: this.playerQueue.length,
      maxQueueSize: MATCH_CONFIG.MAX_QUEUE_SIZE,
      canStartMatch: this.canStartMatch(),
      averageWaitTime,
      longestWait,
      utilizationPercent: (this.playerQueue.length / MATCH_CONFIG.MAX_QUEUE_SIZE) * 100
    };
  }
}

module.exports = PlayerQueueManager;