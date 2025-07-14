# shmup-yours Roadmap

## Project Vision 🎯
Browser-based multiplayer retro shooter focused on instant fun and competitive gameplay.

## Development Philosophy
- MVP first, polish later
- Performance over features
- Player feedback drives priorities
- Developer velocity over complex architecture

## Current State → Next Milestones
**Today:** Task template system, project foundation  
**Next 2 weeks:** Core game mechanics implementation  
**Next 4 weeks:** Alpha testing with 4-8 players  
**Next 8 weeks:** Beta release with full feature set

## Feature Pipeline

### 🏗️ Foundation (In Progress)
**Goal:** Stable development workflow and basic multiplayer
- [x] Monorepo structure with Yarn workspaces
- [x] Task template system for AI agent management
- [x] Docker development environment
- [x] Project documentation and workflow guidelines
- [ ] Core multiplayer lobby system
- [ ] Basic player movement and controls
- [ ] WebSocket real-time communication

### 🎮 Core Gameplay (Next)
**Goal:** Complete game mechanics implementation
- [ ] Real-time combat with bullets and mines
- [ ] Physics-based collision detection (Planck.js)
- [ ] Game state synchronization across clients
- [ ] Match timing and scoring system (5-minute matches)
- [ ] Basic leaderboard functionality
- [ ] Player health and respawn mechanics

### 📱 Multi-Device Support (Following)
**Goal:** Playable on all devices and screen sizes
- [ ] Mobile-first responsive design (Bootstrap 5)
- [ ] Touch controls for mobile gameplay
- [ ] Progressive Web App (PWA) features
- [ ] Cross-browser compatibility testing
- [ ] Performance optimization for mobile devices

### 🎨 Polish & Experience (Future)
**Goal:** Professional-quality user experience
- [ ] Sound effects and background music
- [ ] Visual effects and animations (Canvas-based)
- [ ] Spectator mode for non-players
- [ ] Advanced leaderboard with statistics
- [ ] Performance optimization and scaling
- [ ] Accessibility improvements (WCAG compliance)

## Considerations & Research Areas
**Items we've identified but haven't committed to:**
- AI-powered bots for single-player practice
- Tournament/bracket system for competitive play
- Custom game modes (team play, capture the flag)
- Integration with external leaderboard services
- Monetization strategies (cosmetics, premium features)
- Mobile app store distribution
- Server clustering for high-scale multiplayer

## Technical Decisions Made
**Architecture Choices:**
- **Monorepo:** Yarn Workspaces for frontend/backend/test isolation
- **Backend:** Node.js with `ws` WebSocket library (not socket.io)
- **Frontend:** Vanilla JS, HTML5 Canvas, Bootstrap 5
- **Physics:** Planck.js for consistent client/server simulation
- **Testing:** Jest (backend), Vitest (frontend)
- **No Database:** Anonymous play, daily leaderboard resets
- **No TypeScript:** Rapid prototyping priority

## Community Input Welcome 💬
- Feature priority feedback via GitHub Discussions
- Bug reports and performance issues via GitHub Issues
- Gameplay balance suggestions via community channels
- Contributions welcome following CONTRIBUTING.md guidelines

## Success Metrics
**Foundation Success:** AI agent task system working, dev environment stable  
**Alpha Success:** 4-8 players can play stable 5-minute matches  
**Beta Success:** 50+ concurrent players, <1% crash rate  
**Release Success:** 500+ daily active players, positive community feedback

## Release Strategy
**No Traditional Releases:** Continuous deployment to main branch  
**Quality Gates:** All features must pass E2E tests before merge  
**Rollback Plan:** Quick revert capability for breaking changes  
**User Communication:** VERSION.md tracks current state and known issues

---
**Last Updated:** 2025-07-13  
**Next Review:** 2025-07-20 (weekly roadmap assessment)  
**Maintained by:** Technical Product Manager  
**Community Input:** GitHub Discussions
