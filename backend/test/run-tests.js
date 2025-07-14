/**
 * Simple test runner for the match lifecycle architecture
 * Tests core functionality without external dependencies
 */

const MatchLifecycleManager = require('../src/managers/MatchLifecycleManager');
const HandleRegistry = require('../src/managers/HandleRegistry');
const SessionManager = require('../src/managers/SessionManager');
const TimerManager = require('../src/managers/TimerManager');

// Simple assertion helpers
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected: ${expected}, Actual: ${actual}`);
  }
}

// Test suite
const tests = {
  
  testHandleRegistry() {
    console.log('Testing HandleRegistry...');
    const registry = new HandleRegistry();
    
    // Test handle claiming
    let result = registry.claimHandle('session1', 'TestPlayer');
    assert(result.success, 'Should successfully claim valid handle');
    
    // Test duplicate handle
    result = registry.claimHandle('session2', 'TestPlayer');
    assert(!result.success, 'Should reject duplicate handle');
    
    // Test invalid handle
    result = registry.claimHandle('session3', 'ab');
    assert(!result.success, 'Should reject handle too short');
    
    // Test handle lookup
    assertEquals(registry.getSessionByHandle('TestPlayer'), 'session1', 'Should find session by handle');
    assertEquals(registry.getHandleBySession('session1'), 'TestPlayer', 'Should find handle by session');
    
    // Test statistics
    const stats = registry.getStatistics();
    assertEquals(stats.totalClaimed, 1, 'Should have 1 claimed handle');
    assertEquals(stats.currentlyActive, 1, 'Should have 1 active handle');
    
    console.log('✓ HandleRegistry tests passed');
  },

  testSessionManager() {
    console.log('Testing SessionManager...');
    const sessionManager = new SessionManager();
    
    // Test session creation
    const sessionId = sessionManager.createSession('conn1');
    assert(sessionId.startsWith('session_'), 'Should create valid session ID');
    
    // Test session retrieval
    const session = sessionManager.getSession(sessionId);
    assert(session !== null, 'Should retrieve created session');
    assertEquals(session.connectionId, 'conn1', 'Should have correct connection ID');
    
    // Test session state update
    const updated = sessionManager.updateSessionState(sessionId, 'QUEUED');
    assert(updated, 'Should update session state');
    assertEquals(session.state, 'QUEUED', 'Should have updated state');
    
    // Test performance tracking
    const tracked = sessionManager.trackPerformance(sessionId, {
      matchId: 'test_match',
      rank: 1,
      score: 1000,
      totalPlayers: 4
    });
    assert(tracked, 'Should track performance');
    assertEquals(session.totalMatches, 1, 'Should increment total matches');
    
    console.log('✓ SessionManager tests passed');
  },

  testTimerManager() {
    console.log('Testing TimerManager...');
    const timerManager = new TimerManager();
    
    return new Promise((resolve) => {
      let callbackExecuted = false;
      
      // Test timer creation
      const timerId = timerManager.startMatchTimer(100, () => {
        callbackExecuted = true;
      });
      
      assert(timerId.includes('MATCH'), 'Should create timer with correct type');
      
      // Test timer is active
      const remainingTime = timerManager.getRemainingTime(timerId);
      assert(remainingTime > 0, 'Should have remaining time');
      
      // Wait for callback
      setTimeout(() => {
        assert(callbackExecuted, 'Timer callback should have executed');
        
        // Test timer cleanup
        const remainingAfter = timerManager.getRemainingTime(timerId);
        assertEquals(remainingAfter, -1, 'Timer should be removed after execution');
        
        console.log('✓ TimerManager tests passed');
        resolve();
      }, 150);
    });
  },

  async testMatchLifecycleManager() {
    console.log('Testing MatchLifecycleManager...');
    const matchManager = new MatchLifecycleManager();
    
    // Test server start
    matchManager.startServer();
    const state = matchManager.getCurrentState();
    assertEquals(state.state, 'INTERMISSION', 'Should start in intermission state');
    
    // Test player connection
    const sessionId = matchManager.handlePlayerConnect('test_conn');
    assert(sessionId.startsWith('session_'), 'Should create session for new connection');
    
    // Test handle claiming
    const claimResult = matchManager.handleClaimHandle(sessionId, 'TestHandle');
    assert(claimResult.success, 'Should claim handle successfully');
    
    // Test queue joining
    const queueResult = matchManager.handleJoinQueue(sessionId);
    assert(queueResult.success, 'Should join queue successfully');
    assertEquals(queueResult.position, 1, 'Should be first in queue');
    
    // Test current state includes queue info
    const stateWithQueue = matchManager.getCurrentState();
    assertEquals(stateWithQueue.queue.totalInQueue, 1, 'Should have 1 player in queue');
    
    console.log('✓ MatchLifecycleManager tests passed');
  },

  async testPlayerFlow() {
    console.log('Testing complete player flow...');
    const matchManager = new MatchLifecycleManager();
    
    let eventsReceived = [];
    
    // Listen for events
    matchManager.addEventListener('stateChange', (data) => {
      eventsReceived.push(`stateChange:${data.newState}`);
    });
    
    matchManager.addEventListener('matchStart', (data) => {
      eventsReceived.push(`matchStart:${data.match.playerCount}`);
    });
    
    // Start server
    matchManager.startServer();
    
    // Add multiple players
    const players = [];
    for (let i = 1; i <= 3; i++) {
      const sessionId = matchManager.handlePlayerConnect(`conn${i}`);
      const claimResult = matchManager.handleClaimHandle(sessionId, `Player${i}`);
      const queueResult = matchManager.handleJoinQueue(sessionId);
      
      assert(claimResult.success && queueResult.success, `Player ${i} should join successfully`);
      players.push(sessionId);
    }
    
    // Test queue status
    const queueStatus = matchManager.getCurrentState().queue;
    assertEquals(queueStatus.totalInQueue, 3, 'Should have 3 players in queue');
    assert(queueStatus.canStartMatch, 'Should be able to start match');
    
    console.log('✓ Complete player flow tests passed');
  }
};

// Run all tests
async function runTests() {
  console.log('=== Running Match Lifecycle Architecture Tests ===\n');
  
  try {
    // Run synchronous tests
    tests.testHandleRegistry();
    tests.testSessionManager();
    
    // Run asynchronous tests
    await tests.testTimerManager();
    await tests.testMatchLifecycleManager();
    await tests.testPlayerFlow();
    
    console.log('\n🎉 All tests passed! Match lifecycle architecture is working correctly.');
    console.log('\n=== Test Summary ===');
    console.log('✓ HandleRegistry: Unique handle claiming and management');
    console.log('✓ SessionManager: Player session lifecycle and performance tracking');
    console.log('✓ TimerManager: Match and intermission timing');
    console.log('✓ MatchLifecycleManager: State machine coordination');
    console.log('✓ Player Flow: Complete player journey from connection to queue');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, tests };