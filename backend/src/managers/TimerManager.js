const { TIMER_TYPES } = require('../config/match-config');

/**
 * TimerManager handles all timing and scheduling operations for the match lifecycle.
 * Responsible for match timers, intermission timers, and server reset scheduling.
 */
class TimerManager {
  constructor() {
    this.activeTimers = new Map();
    this.serverStartTime = Date.now();
  }

  /**
   * Start a match timer with specified duration and callback
   * @param {number} duration - Timer duration in milliseconds
   * @param {function} callback - Function to call when timer expires
   * @returns {string} timerId - Unique identifier for this timer
   */
  startMatchTimer(duration, callback) {
    return this._startTimer(TIMER_TYPES.MATCH, duration, callback);
  }

  /**
   * Start an intermission timer with specified duration and callback
   * @param {number} duration - Timer duration in milliseconds  
   * @param {function} callback - Function to call when timer expires
   * @returns {string} timerId - Unique identifier for this timer
   */
  startIntermissionTimer(duration, callback) {
    return this._startTimer(TIMER_TYPES.INTERMISSION, duration, callback);
  }

  /**
   * Schedule a server reset after specified duration
   * @param {number} duration - Duration until reset in milliseconds
   * @param {function} callback - Function to call when reset time is reached
   * @returns {string} timerId - Unique identifier for this timer
   */
  scheduleServerReset(duration, callback) {
    return this._startTimer(TIMER_TYPES.SERVER_RESET, duration, callback);
  }

  /**
   * Cancel a specific timer by ID
   * @param {string} timerId - Timer to cancel
   * @returns {boolean} - True if timer was found and cancelled
   */
  cancelTimer(timerId) {
    const timer = this.activeTimers.get(timerId);
    if (timer) {
      clearTimeout(timer.timeoutId);
      this.activeTimers.delete(timerId);
      return true;
    }
    return false;
  }

  /**
   * Cancel all timers of a specific type
   * @param {string} timerType - Type of timers to cancel (from TIMER_TYPES)
   */
  cancelTimersByType(timerType) {
    for (const [timerId, timer] of this.activeTimers.entries()) {
      if (timer.type === timerType) {
        clearTimeout(timer.timeoutId);
        this.activeTimers.delete(timerId);
      }
    }
  }

  /**
   * Clear all active timers - used during server reset
   */
  clearAllTimers() {
    for (const [timerId, timer] of this.activeTimers.entries()) {
      clearTimeout(timer.timeoutId);
    }
    this.activeTimers.clear();
  }

  /**
   * Get remaining time for a specific timer
   * @param {string} timerId - Timer to check
   * @returns {number} - Remaining time in milliseconds, or -1 if timer not found
   */
  getRemainingTime(timerId) {
    const timer = this.activeTimers.get(timerId);
    if (timer) {
      const elapsed = Date.now() - timer.startTime;
      return Math.max(0, timer.duration - elapsed);
    }
    return -1;
  }

  /**
   * Get all active timers with their status
   * @returns {Object} - Map of timer information
   */
  getActiveTimers() {
    const result = {};
    for (const [timerId, timer] of this.activeTimers.entries()) {
      result[timerId] = {
        type: timer.type,
        startTime: timer.startTime,
        duration: timer.duration,
        remaining: this.getRemainingTime(timerId)
      };
    }
    return result;
  }

  /**
   * Get server uptime in milliseconds
   * @returns {number} - Time since server start
   */
  getServerUptime() {
    return Date.now() - this.serverStartTime;
  }

  /**
   * Reset the server start time - called during server reset
   */
  resetServerStartTime() {
    this.serverStartTime = Date.now();
  }

  /**
   * Internal method to create and manage timers
   * @private
   */
  _startTimer(type, duration, callback) {
    const timerId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    const timeoutId = setTimeout(() => {
      // Remove timer from active list
      this.activeTimers.delete(timerId);
      
      // Execute callback with error handling
      try {
        callback();
      } catch (error) {
        console.error(`Timer callback error for ${timerId}:`, error);
      }
    }, duration);

    // Store timer metadata
    this.activeTimers.set(timerId, {
      type,
      timeoutId,
      startTime,
      duration,
      callback
    });

    return timerId;
  }
}

module.exports = TimerManager;