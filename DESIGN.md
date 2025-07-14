# DESIGN.md

## 1. Project Structure 🗂️

**What:**  
- Monorepo managed with Yarn Workspaces.  
- Three main workspaces: `frontend/`, `backend/`, `test/`.  
- Each workspace contains its own `src/`, `test/`, and `README.md`.

**Why:**  
- Workspace isolation keeps code organized and maintainable.  
- Enables independent development, testing, and deployment for frontend and backend.  
- Centralizes shared resources and documentation for easier collaboration.  
- Makes it easy to add or remove packages without affecting unrelated parts of the codebase.

---

## 2. Package/Library Manager: Yarn vs npm 🧶

**What:**  
- Yarn Workspaces are used for monorepo management.

**Why:**  
- Yarn Workspaces provide native support for managing multiple packages in a single repository, with efficient dependency hoisting and workspace scripts.  
- Yarn is faster and more reliable for monorepo workflows than npm, especially for dependency resolution and linking.  
- Yarn’s workspace commands simplify running scripts and tests across all packages.  
- npm workspaces are improving, but Yarn is more mature and better documented for this use case.

---

## 3. Technology Choices ⚙️

**Backend:**  
- **What:** Node.js (Alpine), `ws` for WebSockets, Winston for logging, Jest for testing.  
- **Why:** Node.js is lightweight and widely supported. `ws` is a minimal, fast WebSocket library (chosen over socket.io for simplicity and performance). Winston provides flexible logging. Jest is a proven testing framework for backend JS.

**Frontend:**  
- **What:** HTML5 Canvas for rendering, Bootstrap 5 for UI, Vitest for testing.  
- **Why:** Canvas is ideal for fast, retro-style 2D games. Bootstrap provides a modern, responsive UI with minimal effort. Vitest is fast and integrates well with modern frontend tooling.

**Physics:**  
- **What:** Planck.js for both client and server.  
- **Why:** Using the same physics engine everywhere ensures consistent simulation and gameplay. Planck.js is lightweight and well-suited for arcade-style games.

**Code Quality:**  
- **What:** ESLint v8.x, Prettier, Husky for pre-commit/pre-push hooks.  
- **Why:** Enforces code standards and formatting automatically. Husky ensures checks run before code is committed or pushed, reducing errors and improving consistency.

---

## 4. Design Decisions 💡

**No TypeScript (for now):**  
- **Why:** Prioritizes rapid prototyping and iteration speed. TypeScript can be added later if needed, but starting with vanilla JS lowers the barrier for contributors and speeds up initial development.

**No database, no login:**  
- **Why:** Keeps the player experience fast and anonymous. No need for account management or persistent storage; leaderboards reset daily to keep things fresh.

**Docker-based dev environment:**  
- **Why:** Ensures reproducibility and easy onboarding. Developers can run the project the same way regardless of their local setup.

---

## 5. Workflow Conventions 🔄

**What:**  
- GitHub Issues for all work.  
- Branch naming: `feature/<issue-number>-desc`, `bugfix/<issue-number>-desc`.  
- PRs linked to issues.  
- Rebasing before merge to avoid conflicts.  
- Conventional commit messages.

**Why:**  
- Promotes collaboration and traceability.  
- Minimizes merge conflicts and keeps history clean.  
- Makes onboarding and code review easier.

---

## 6. How to Make Decisions 🧭

**What:**  
- When adding new packages, tools, or workflows, refer to the "why" sections above.  
- Prefer solutions that are simple, widely adopted, and easy to maintain.  
- Document any new decisions in DESIGN.md to keep rationale clear for future contributors.

**Why:**  
- Consistency in decision-making helps keep the project maintainable and welcoming to new contributors.  
- Clear documentation of rationale prevents confusion and reduces the risk of unnecessary churn.

---

## 7. References 📚

- [Yarn Workspaces Documentation](https://classic.yarnpkg.com/en/docs/workspaces/)
- [Planck.js](https://github.com/shakiba/planck.js)
- [Jest](https://jestjs.io/)
- [Vitest](https://vitest.dev/)
- [ESLint](https://eslint.org/)
- [Bootstrap 5](https://getbootstrap.com/)
- [Husky](https://typicode.github.io/husky/)

---

If you have questions or want to propose a change, open an issue or start a discussion! 🚀
