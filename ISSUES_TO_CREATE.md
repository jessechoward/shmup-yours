# GitHub Issues to Create

## Issue 0: Add Node.js/Yarn-Based Frontend Development Server
**Title:** Implement proper frontend dev server using Yarn (remove Python dependency)

**Description:**
- Add a Node.js-based static file server for the frontend workspace (e.g., use `serve` or similar)
- Create a `dev` script in `frontend/package.json` to start the server (e.g., `yarn dev`)
- Ensure all documentation and instructions reference Yarn, not Python or npx
- Remove any Python server references from docs, scripts, and workflow
- Validate that the demo loads at `http://localhost:3000` (or chosen port) using the new dev server

**Acceptance Criteria:**
- [ ] `yarn dev` starts the frontend server from the `frontend` workspace
- [ ] No Python dependencies or instructions remain
- [ ] Demo loads successfully in browser via Node.js server
- [ ] All team members use Yarn for local development

**Labels:** `infra`, `frontend`, `cleanup`
**Estimated Time:** 20-30 minutes

---

## Issue 0b: Update Documentation to Remove Python References
**Title:** Remove Python server references from all documentation and scripts

**Description:**
- Audit all documentation, README files, and setup guides for any mention of Python or `python3 -m http.server`
- Replace with Yarn-based or Node.js-based dev server instructions
- Ensure all onboarding and quickstart guides are consistent with project stack
- Validate that no Python references remain in any docs or scripts

**Acceptance Criteria:**
- [ ] All documentation references Yarn/Node.js for dev server
- [ ] No mention of Python or `python3 -m http.server` remains
- [ ] Quickstart and onboarding guides are up to date
- [ ] Team members can follow docs without confusion

**Labels:** `infra`, `docs`, `cleanup`
**Estimated Time:** 15-20 minutes

---

## Issue 1: Player Ship Visual Design and Basic Structure
**Title:** Implement player ship as triangle-in-circle (32px diameter)

**Description:**
Create the visual representation of the player ship with:
- 32-pixel diameter circle outline
- Triangle arrow inside pointing in facing direction
- Ship starts at center of viewport
- Ship rotates visually based on facing direction

**Acceptance Criteria:**
- [ ] Ship renders as circle with triangle inside
- [ ] Triangle points in ship's facing direction
- [ ] Ship is 32px total diameter
- [ ] Ship starts centered in viewport
- [ ] Visual rotation matches ship's heading

**Labels:** `enhancement`, `frontend`, `rendering`
**Estimated Time:** 30-45 minutes

---

## Issue 2: Ship Physics and Movement System
**Title:** Implement ship thrust mechanics with velocity limits

**Description:**
Create physics system for ship movement:
- Thrust adds velocity in facing direction
- Reasonable acceleration ramp-up
- Maximum velocity limit
- Zero friction (space physics)
- Ship must reverse thrust to slow down

**Technical Details:**
- Need to define max velocity value
- Acceleration rate for smooth ramp-up
- Velocity vector math for thrust direction

**Acceptance Criteria:**
- [ ] Up arrow adds thrust in facing direction
- [ ] Ship accelerates smoothly to max velocity
- [ ] No friction - ship maintains velocity
- [ ] Ship must reverse thrust to slow down
- [ ] Physics feel responsive but not twitchy

**Labels:** `enhancement`, `physics`, `gameplay`
**Estimated Time:** 45-60 minutes

---

## Issue 3: Ship Rotation Controls
**Title:** Implement arrow key ship rotation controls

**Description:**
Add ship rotation using arrow keys:
- Left arrow: Clockwise rotation
- Right arrow: Counter-clockwise rotation
- Smooth rotation speed
- Visual updates in real-time

**Acceptance Criteria:**
- [ ] Left arrow rotates ship clockwise
- [ ] Right arrow rotates ship counter-clockwise
- [ ] Rotation speed feels natural
- [ ] Visual triangle updates to match heading
- [ ] Multiple key presses work smoothly

**Labels:** `enhancement`, `controls`, `input`
**Estimated Time:** 30 minutes

---

## Issue 4: Laser Bullet Shooting System
**Title:** Implement spacebar shooting with rate limiting

**Description:**
Add laser bullet system:
- Spacebar fires laser bullets
- Rate limited to 3 bullets per second maximum
- Anti-mashing protection
- Bullets travel at 1.5x ship max velocity
- Bullets fade and disappear after 400 pixels

**Technical Details:**
- Need cooldown timer between shots
- Bullet velocity = 1.5 * ship_max_velocity
- Bullet lifespan based on distance traveled
- Visual fade effect as bullets age

**Acceptance Criteria:**
- [ ] Spacebar fires laser bullets
- [ ] Cannot exceed 3 bullets per second
- [ ] Button mashing doesn't increase rate
- [ ] Bullets travel in ship's facing direction
- [ ] Bullets fade and disappear after 400px
- [ ] Bullets travel at 1.5x ship max speed

**Labels:** `enhancement`, `weapons`, `rate-limiting`
**Estimated Time:** 60-75 minutes

---

## Issue 5: Camera Follow with Map Boundaries
**Title:** Implement camera follow with map edge clamping

**Description:**
Camera system that:
- Keeps player ship centered in viewport
- Follows ship movement smoothly
- Clamps to map boundaries (no showing outside map)
- Smooth camera transitions

**Technical Details:**
- Need to define map size/boundaries
- Camera offset calculations
- Boundary detection and clamping logic

**Acceptance Criteria:**
- [ ] Camera follows player ship
- [ ] Ship stays centered in viewport
- [ ] Camera stops at map edges
- [ ] No empty space visible outside map
- [ ] Smooth camera movement

**Labels:** `enhancement`, `camera`, `map-system`
**Estimated Time:** 45 minutes

---

## Missing Elements & Questions:

### 🤔 **What You Might Want to Consider:**

1. **Map Size Definition:**
   - How big is the game world? (e.g., 3000x3000 pixels?)
   - What happens at map edges? (invisible walls, wraparound?)

2. **Ship Physics Values:**
   - What's the max velocity? (e.g., 200 pixels/second?)
   - What's the acceleration rate? (e.g., 400 pixels/second²?)
   - What's the rotation speed? (e.g., 180 degrees/second?)

3. **Collision System:**
   - Do bullets hit map boundaries?
   - Ship collision with map edges?
   - Future: ship-to-ship collisions?

4. **Visual Polish:**
   - Thrust visual effect (flame/particles?)
   - Bullet visual style (line, circle, glow?)
   - Ship color scheme?

### ✅ **Scope Assessment:**

**Perfect Scope!** This is exactly the right amount:
- **Not too much:** Can be implemented incrementally
- **Not too little:** Provides complete basic gameplay loop
- **Well-defined:** Clear acceptance criteria
- **Testable:** Each feature can be verified

### 🎯 **Implementation Order:**
1. Ship visual design (foundation)
2. Ship rotation controls (immediate feedback)
3. Ship physics/thrust (core movement)
4. Shooting system (player action)
5. Camera follow (polish/UX)

Would you like me to:
1. **Create these as actual GitHub issues** using the agent workflow?
2. **Define the missing physics constants** (max velocity, acceleration, etc.)?
3. **Start implementing** the first issue (ship visual design)?

This is a solid foundation that will make the game immediately fun to play! 🚀
