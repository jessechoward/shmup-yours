/**
 * Configuration constants for the match lifecycle management system
 */

const MATCH_CONFIG = {
  // Core timing constants from GAME_DESIGN.md
  MATCH_DURATION: 5 * 60 * 1000,        // 5 minutes in milliseconds
  INTERMISSION_DURATION: 2 * 60 * 1000,  // 2 minutes in milliseconds
  SERVER_RESET_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  
  // Player management
  MIN_MATCH_PLAYERS: 2,                 // Minimum players to start a match
  MAX_MATCH_PLAYERS: 16,                // Maximum players per match (TBD from testing)
  MAX_QUEUE_SIZE: 50,                   // Maximum queued players
  
  // Relegation system
  RELEGATION_THRESHOLD: 3,              // Consecutive poor performances before relegation
  MINIMUM_PLAYERS_FOR_RELEGATION: 4,   // Don't relegate with too few players
  
  // Performance-based relegation scaling (subject to testing)
  RELEGATION_PERCENTILES: {
    4: 1,   // Last place with 4 players
    6: 2,   // Bottom 2 with 6 players  
    8: 3,   // Bottom 3 with 8 players
    12: 4,  // Bottom 4 with 12 players
    16: 4   // Bottom 4 with 16+ players
  }
};

const MATCH_STATES = {
  SERVER_START: 'SERVER_START',
  INTERMISSION: 'INTERMISSION', 
  ACTIVE_MATCH: 'ACTIVE_MATCH',
  SERVER_RESET: 'SERVER_RESET'
};

const PLAYER_STATES = {
  NEW: 'NEW',           // Just connected, no handle claimed
  QUEUED: 'QUEUED',     // Has handle, waiting for match
  ACTIVE: 'ACTIVE',     // Currently playing in match
  RELEGATED: 'RELEGATED' // Kicked due to poor performance
};

const TIMER_TYPES = {
  MATCH: 'MATCH',
  INTERMISSION: 'INTERMISSION', 
  SERVER_RESET: 'SERVER_RESET'
};

module.exports = {
  MATCH_CONFIG,
  MATCH_STATES,
  PLAYER_STATES,
  TIMER_TYPES
};