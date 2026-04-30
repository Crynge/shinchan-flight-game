# Architecture

## Runtime model

The game is intentionally split into three layers:

1. `main.ts`
   - Builds the cinematic shell around the game canvas
   - Creates persistent services for state, HUD, and analytics
   - Boots Phaser with shared services injected through the registry

2. `scenes/`
   - `BootScene`: generates a full texture pack at runtime so the repo is self-contained
   - `MenuScene`: teaches controls and frames the run
   - `GameScene`: owns the gameplay loop, swing physics, wind, spawning, and fail detection
   - `WaterSplashScene`: turns failure into a satisfying transition instead of a hard cut
   - `GameOverScene`: summarizes the run and loops back into replay

3. `entities/` + `systems/`
   - Entities encapsulate movement and visuals
   - Systems isolate input, analytics, HUD updates, and persistence

## Physics choice

The swing mechanic uses Matter.js through Phaser:

- Bochan is a drawn container with manual vertical flight movement
- a static invisible Matter anchor tracks Bochan's nose each frame
- Shinchan is a Matter sprite constrained to that anchor
- wind applies lateral force to Shinchan
- collision failure is handled with a deterministic bounds check against obstacles and water

That hybrid approach keeps the swinging expressive without turning the whole scene into heavy rigid-body simulation.

## Performance strategy

- runtime-generated textures keep the repo light and remove asset fetch stalls
- obstacle pooling avoids constant object creation during long runs
- lane + wind configuration lives in JSON so tuning does not require code edits
- the UI shell is DOM-based while the moment-to-moment gameplay stays on the canvas
- no framework overhead beyond Vite and Phaser

## Test strategy

- `tests/gameMath.test.ts` covers grading and shared math utilities
- `tests/browser_smoke.py` verifies a built app in Chromium using the workspace Playwright helper
- `.github/workflows/ci.yml` runs `npm ci`, `npm run build`, and `npm run test`
