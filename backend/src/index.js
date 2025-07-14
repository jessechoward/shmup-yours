const MatchLifecycleManager = require('./managers/MatchLifecycleManager');

/**
 * Main entry point for the shmup-yours backend server
 * This demonstrates the match lifecycle management system
 */

// Initialize the match lifecycle manager
const matchManager = new MatchLifecycleManager();

// Set up event listeners to monitor system behavior
matchManager.addEventListener('stateChange', (data) => {
  console.log(`[STATE CHANGE] New state: ${data.newState}`);
});

matchManager.addEventListener('matchStart', (data) => {
  console.log(`[MATCH START] ${data.match.matchId} with ${data.match.playerCount} players`);
});

matchManager.addEventListener('matchEnd', (data) => {
  const duration = data.match.endTime - data.match.startTime;
  console.log(`[MATCH END] ${data.match.matchId} completed in ${Math.round(duration / 1000)}s`);
});

matchManager.addEventListener('playerRelegated', (data) => {
  console.log(`[RELEGATION] Player ${data.handle} (${data.sessionId}) relegated after ${data.relegationStreak} poor performances`);
});

matchManager.addEventListener('serverReset', (data) => {
  console.log(`[SERVER RESET] Server ran for ${Math.round(data.uptime / 1000)}s with ${data.totalMatches} total matches`);
});

// Start the server
console.log('=== Shmup-Yours Match Lifecycle Manager ===');
console.log('Architecture research implementation for issue #21');
console.log('');

matchManager.startServer();

// Set up regular maintenance tick (every 30 seconds)
setInterval(() => {
  matchManager.processServerTick();
}, 30000);

// Log current state every minute for monitoring
setInterval(() => {
  const state = matchManager.getCurrentState();
  console.log(`[STATUS] State: ${state.state}, Queue: ${state.queue.totalInQueue}, Active Sessions: ${state.sessions.connectedSessions}, Uptime: ${Math.round(state.uptime / 1000)}s`);
}, 60000);

// Example of simulating player activity (for demonstration purposes)
function simulatePlayerActivity() {
  console.log('\n=== Simulating Player Activity ===');
  
  // Simulate 4 players connecting and joining queue
  const players = [];
  for (let i = 1; i <= 4; i++) {
    const connectionId = `demo_connection_${i}`;
    const sessionId = matchManager.handlePlayerConnect(connectionId);
    const handle = `DemoPlayer${i}`;
    
    // Claim handle
    const claimResult = matchManager.handleClaimHandle(sessionId, handle);
    console.log(`Player ${i}: Handle claim ${claimResult.success ? 'SUCCESS' : 'FAILED'} - ${handle}`);
    
    if (claimResult.success) {
      // Join queue
      const queueResult = matchManager.handleJoinQueue(sessionId);
      console.log(`Player ${i}: Queue join ${queueResult.success ? 'SUCCESS' : 'FAILED'} - Position ${queueResult.position || 'N/A'}`);
      
      players.push({ sessionId, connectionId, handle });
    }
  }
  
  // Simulate match results after some time
  setTimeout(() => {
    if (players.length >= 2) {
      console.log('\n=== Simulating Match Results ===');
      const matchResults = players.map((player, index) => ({
        sessionId: player.sessionId,
        rank: index + 1, // First player wins, others ranked by index
        score: 1000 - (index * 200) // Descending scores
      }));
      
      matchManager.recordMatchResults(matchResults);
      console.log('Match results recorded for demonstration');
    }
  }, 8000); // Wait for match to be in progress
  
  return players;
}

// Start simulation after a brief delay
setTimeout(() => {
  simulatePlayerActivity();
}, 3000);

// Export the manager for external use (when used as module)
module.exports = matchManager;