# shmup-yours
Destroy your enemies. Blow up your friends. Leave your morals behind. Only the scoreboard matters.

<p align="center">
  <strong>Go back to school, nerd! Heroes were born to die! Shmup-yours, buddy! 💥😎</strong>
</p>
## Overview

🕹️ **Shmup-Yours** is a fast-paced, 2D browser-based multiplayer retro shooter that brings the arcade spirit to your fingertips! With intuitive controls inspired by classic games, you’ll thrust, rotate, and blast your way to the top of the leaderboard—all from your web browser. 

<em>Warning: May cause excessive flexing, uncontrollable trash talk, and a sudden urge to call your mom after getting vaporized. If you’re not top dog, you’re just kibble.</em>

🎮 **Controls:**  
- Arrow keys for movement: ⬆️ Thrust, ⬅️ Rotate left, ➡️ Rotate right  
- Spacebar to fire (hold for rapid fire—no button mashing!)  
- B to charge and drop mines (hold for up to 5 seconds for max power, release to deploy; you can’t shoot while charging a mine!)

👾 **Jump In or Watch:**  
Enter your handle and dive straight into the action, or sit back and spectate ongoing matches. No downloads, no waiting—just pure gameplay.  
<em>Don’t like what you see? Join the fray and show ‘em how it’s done. Or just watch and judge from the sidelines like a true keyboard warrior.</em>

⏱️ **Match Structure:**  
- 5-minute matches with 2-minute breaks  
- Winner is the player with the most kills  
- Join or leave anytime—your handle is unique for each session, just like the high score boards of old-school arcades!

<em>Five minutes to glory, two minutes to cry about it. If you’re not first, you’re last—so get in, get out, and get over yourself.</em>

💥 **Combat Mechanics:**  
- Bullets deal 10% shield damage per hit  
- Mines deal 1–50% damage based on charge level  
- Mines lose power over time, so timing is everything!

<em>Bullets tickle, mines maim. Charge up, drop hot, and pray your enemies have good dental insurance.</em>

💬 **Social Features:**  
- Chat with other players between matches  
- Viewers can watch the carnage unfold, but only players get to chat

<em>Talk smack, make friends, or just type “GG” and pretend you meant it. Viewers: you’re here for the drama, not the dialogue.</em>

🏆 **Leaderboards:**  
- Continuously scrolling, always fresh  
- Server resets every 24 hours—new day, new heroes!  
- No historical scores—just glory in the moment.  
- Tagline: “Go back to school, nerd! Heroes were born to die! Shmup-yours, buddy!” 😎

<em>Yesterday’s hero is today’s zero. Leaderboard wipes keep the egos in check and the action spicy. If you want a legacy, go write a memoir.</em>
## Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Monorepo-Yarn%20Workspaces-blue?logo=yarn" alt="Yarn Workspaces" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/WebSockets-ws-ff69b4?logo=websocket" alt="WebSockets" />
  <img src="https://img.shields.io/badge/Frontend-HTML5%20Canvas-orange?logo=html5" alt="HTML5 Canvas" />
  <img src="https://img.shields.io/badge/Bootstrap-5-blueviolet?logo=bootstrap" alt="Bootstrap 5" />
  <img src="https://img.shields.io/badge/Physics-Planck.js-yellow?logo=javascript" alt="Planck.js" />
  <img src="https://img.shields.io/badge/Testing-Jest%20%26%20Vitest-red?logo=jest" alt="Jest & Vitest" />
  <img src="https://img.shields.io/badge/Linting-ESLint-blue?logo=eslint" alt="ESLint" />
  <img src="https://img.shields.io/badge/Pre-commit-Husky-lightgrey?logo=git" alt="Husky" />
  <img src="https://img.shields.io/badge/Logging-Winston-9cf?logo=winston" alt="Winston" />
</p>

**Monorepo Architecture:** Powered by Yarn Workspaces, seamlessly integrating both frontend and backend under one roof for streamlined development and deployment.

**Backend:** Built with vanilla Node.js, the game server leverages blazing-fast WebSockets (via the `ws` library) for real-time multiplayer action. Robust logging is handled by Winston, and code quality is ensured with Jest for both unit and BDD-style testing.

**Frontend:** A modern Single Page Application (SPA) using HTML5 Canvas for immersive gameplay visuals, styled with Bootstrap 5 for a sleek, responsive interface. Vitest powers frontend testing for reliability.

**Physics Engine:** Both client and server utilize Planck.js for consistent, high-performance physics simulation.

**Code Quality & Workflow:** ESLint (v8.x) enforces code standards across the monorepo, while Husky ensures pre-commit and pre-push validation for a smooth, error-free development experience.

**Design Decisions:** No TypeScript—prioritizing rapid prototyping and iteration speed.

**Player Experience:** No database, no login—players jump in and out, keeping the action fast and anonymous.
## Gameplay

## Developer Resources
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [DESIGN.md](DESIGN.md)
- [WebSocket Protocol Specification](WEBSOCKET_PROTOCOL.md)
- [WebSocket Implementation Guide](WEBSOCKET_IMPLEMENTATION.md)
- [Protocol Quick Reference](WEBSOCKET_SUMMARY.md)

## Credits
