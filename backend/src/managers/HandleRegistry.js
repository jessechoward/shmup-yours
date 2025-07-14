/**
 * HandleRegistry manages the unique handle claiming system.
 * Ensures handle uniqueness across the entire server session until reset.
 */
class HandleRegistry {
  constructor() {
    this.handles = new Map(); // handle -> { sessionId, claimedAt, isActive }
    this.sessionToHandle = new Map(); // sessionId -> handle
    this.lastReset = Date.now();
  }

  /**
   * Attempt to claim a handle for a player session
   * @param {string} sessionId - Player's session identifier
   * @param {string} handle - Desired handle to claim
   * @returns {Object} - { success: boolean, reason?: string }
   */
  claimHandle(sessionId, handle) {
    // Validate handle format
    if (!this._isValidHandle(handle)) {
      return { 
        success: false, 
        reason: 'Invalid handle format. Must be 3-20 alphanumeric characters.' 
      };
    }

    // Check if handle is already taken
    if (this.handles.has(handle)) {
      return { 
        success: false, 
        reason: 'Handle is already taken for this server session.' 
      };
    }

    // Check if this session already has a handle
    if (this.sessionToHandle.has(sessionId)) {
      return { 
        success: false, 
        reason: 'Session already has a claimed handle.' 
      };
    }

    // Claim the handle
    this.handles.set(handle, {
      sessionId,
      claimedAt: Date.now(),
      isActive: true
    });

    this.sessionToHandle.set(sessionId, handle);

    return { success: true };
  }

  /**
   * Check if a handle is available for claiming
   * @param {string} handle - Handle to check
   * @returns {boolean} - True if handle is available
   */
  isHandleAvailable(handle) {
    return !this.handles.has(handle) && this._isValidHandle(handle);
  }

  /**
   * Get the session ID associated with a handle
   * @param {string} handle - Handle to look up
   * @returns {string|null} - Session ID or null if not found
   */
  getSessionByHandle(handle) {
    const handleData = this.handles.get(handle);
    return handleData ? handleData.sessionId : null;
  }

  /**
   * Get the handle associated with a session
   * @param {string} sessionId - Session ID to look up
   * @returns {string|null} - Handle or null if not found
   */
  getHandleBySession(sessionId) {
    return this.sessionToHandle.get(sessionId) || null;
  }

  /**
   * Mark a handle as inactive (player disconnected but handle remains reserved)
   * @param {string} sessionId - Session that disconnected
   * @returns {boolean} - True if handle was found and marked inactive
   */
  markHandleInactive(sessionId) {
    const handle = this.sessionToHandle.get(sessionId);
    if (handle) {
      const handleData = this.handles.get(handle);
      if (handleData) {
        handleData.isActive = false;
        return true;
      }
    }
    return false;
  }

  /**
   * Reactivate a handle when player reconnects with same session
   * @param {string} sessionId - Session that reconnected
   * @returns {boolean} - True if handle was found and reactivated
   */
  reactivateHandle(sessionId) {
    const handle = this.sessionToHandle.get(sessionId);
    if (handle) {
      const handleData = this.handles.get(handle);
      if (handleData) {
        handleData.isActive = true;
        return true;
      }
    }
    return false;
  }

  /**
   * Get all currently claimed handles
   * @returns {Array} - Array of handle information objects
   */
  getAllHandles() {
    const result = [];
    for (const [handle, data] of this.handles.entries()) {
      result.push({
        handle,
        sessionId: data.sessionId,
        claimedAt: data.claimedAt,
        isActive: data.isActive
      });
    }
    return result;
  }

  /**
   * Get count of total claimed handles
   * @returns {number} - Number of claimed handles
   */
  getClaimedHandleCount() {
    return this.handles.size;
  }

  /**
   * Get count of active handles (connected players)
   * @returns {number} - Number of active handles
   */
  getActiveHandleCount() {
    let count = 0;
    for (const handleData of this.handles.values()) {
      if (handleData.isActive) {
        count++;
      }
    }
    return count;
  }

  /**
   * Reset all handles - only called during server reset
   * This is the ONLY way handles are freed according to game design
   */
  resetAllHandles() {
    this.handles.clear();
    this.sessionToHandle.clear();
    this.lastReset = Date.now();
  }

  /**
   * Get time since last reset
   * @returns {number} - Milliseconds since last handle reset
   */
  getTimeSinceReset() {
    return Date.now() - this.lastReset;
  }

  /**
   * Validate handle format according to game rules
   * @private
   * @param {string} handle - Handle to validate
   * @returns {boolean} - True if handle format is valid
   */
  _isValidHandle(handle) {
    if (typeof handle !== 'string') {
      return false;
    }

    // Must be 3-20 characters
    if (handle.length < 3 || handle.length > 20) {
      return false;
    }

    // Only alphanumeric characters and underscores
    const validPattern = /^[a-zA-Z0-9_]+$/;
    return validPattern.test(handle);
  }

  /**
   * Get registry statistics for monitoring
   * @returns {Object} - Statistics about handle usage
   */
  getStatistics() {
    return {
      totalClaimed: this.getClaimedHandleCount(),
      currentlyActive: this.getActiveHandleCount(),
      timeSinceReset: this.getTimeSinceReset(),
      lastResetTime: this.lastReset
    };
  }
}

module.exports = HandleRegistry;