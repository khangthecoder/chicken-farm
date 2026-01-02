# Chicken Chaos - Implementation Task Breakdown

## Quick Reference

**Recommended Tech Stack**: Vanilla JavaScript + HTML5 Canvas
**Development Timeline**: ~5 weeks (35 days)
**Priority**: Quick prototype first, performance optimization, mobile-friendly

---

## Phase 1: Core Prototype (Week 1-2) - CRITICAL PATH

### Day 1: Project Setup & Foundation
- [ ] Create project directory structure
- [ ] Initialize package.json (if using Vite or build tools)
- [ ] Setup index.html with canvas element
- [ ] Create basic CSS for full-screen canvas
- [ ] Implement Game.js with requestAnimationFrame loop
- [ ] Create Grid.js class with toroidal wraparound logic
- [ ] Test: Grid wrap() function works correctly at edges
- [ ] Create Constants.js for all configurable values
- [ ] Setup Vector2.js utility class for position math

**Deliverable**: Game loop running, grid system tested

### Day 2-3: Core Entities
- [ ] Create Entity base class (position, type, active, update, render)
- [ ] Implement Player.js entity
  - [ ] 8-directional movement (WASD + diagonals)
  - [ ] Grid-based position
  - [ ] Render as colored square (placeholder)
- [ ] Create Chicken.js entity
  - [ ] Random cardinal direction on spawn
  - [ ] Move forward in assigned direction
  - [ ] Render as colored square (placeholder)
- [ ] Implement InputSystem.js
  - [ ] Keyboard input detection (WASD, arrows)
  - [ ] Queue movement input for next tick
  - [ ] Handle diagonal combinations
- [ ] Create EntityManager.js
  - [ ] Add/remove entities
  - [ ] Update all entities
  - [ ] Render all entities
- [ ] Test: Player can move 8-directionally, chickens move forward

**Deliverable**: Player and chickens moving on grid

### Day 4-5: Collision & Explosions
- [ ] Implement CollisionSystem.js
  - [ ] Grid-based collision detection (same tile = collision)
  - [ ] Chicken-to-chicken collision detection
  - [ ] Player-to-explosion collision detection
- [ ] Create Explosion.js entity
  - [ ] Expanding phase (1-2 steps)
  - [ ] Fade phase (2-4 steps)
  - [ ] Danger area tracking (which tiles are dangerous)
- [ ] Implement chain reaction logic
  - [ ] Explosion checks 3x3 area for chickens
  - [ ] Trigger secondary explosions recursively
  - [ ] Track chain length counter
- [ ] Add explosion timing (size-based duration)
  - [ ] Single: 3 steps total
  - [ ] 2-3 chain: 4 steps
  - [ ] 4+ chain: 6 steps
- [ ] Test: Chickens collide and explode, chains work

**Deliverable**: Working collision and explosion system with chains

### Day 6: Chicken Spawning
- [ ] Implement SpawnSystem.js
- [ ] Initial spawn logic
  - [ ] Calculate 5-10% of grid tiles
  - [ ] Spawn chickens at random positions
  - [ ] Assign random cardinal directions
- [ ] Event-triggered spawning
  - [ ] 60% chance: 1 chicken
  - [ ] 30% chance: 2 chickens
  - [ ] 10% chance: 3 chickens
  - [ ] Trigger on explosion events
- [ ] Safe spawn location algorithm
  - [ ] Find tiles 3-4 tiles from player
  - [ ] Avoid occupied tiles (chicken, player, barrier, explosion)
  - [ ] Retry logic if no valid tile found
- [ ] Spawn telegraph effect
  - [ ] 1-step warning visual (colored tile flash)
- [ ] Test: Chickens spawn safely, explosions trigger new spawns

**Deliverable**: Dynamic chicken spawning system

### Day 7: Health & Game Loop
- [ ] Add health system to Player.js
  - [ ] 3 lives/hearts
  - [ ] Damage on explosion collision
  - [ ] Invulnerability frames (1 step after hit)
- [ ] Create game state management
  - [ ] Playing state
  - [ ] Game Over state
  - [ ] Level transition state
- [ ] Implement basic HUD.js
  - [ ] Render lives (hearts)
  - [ ] Render current level
  - [ ] Render survival time
  - [ ] Render explosion count
- [ ] Game over logic
  - [ ] Trigger when health = 0
  - [ ] Display final stats
  - [ ] Restart option
- [ ] Test: Taking damage works, game over triggers correctly

**Deliverable**: Complete game loop with win/loss states

### Day 8-10: Playtesting & Balancing
- [ ] Playtest core mechanics thoroughly
- [ ] Balance tick rate (start ~500ms, test range)
- [ ] Adjust spawn rates (too many/few chickens?)
- [ ] Test difficulty curve (is progression smooth?)
- [ ] Fix critical bugs discovered in testing
- [ ] Document bugs and balance issues for Phase 2
- [ ] Get feedback from 3-5 external testers
- [ ] Iteration: Adjust constants based on feedback

**Deliverable**: Balanced, playable prototype

---

## Phase 2: Polish & Content (Week 3-4)

### Day 11-14: Visual Design & Sprites
- [ ] Create pixel art sprites (or commission/find assets)
  - [ ] Player sprite (24x24px, 8 directions or rotatable)
    - [ ] Idle animation (2-4 frames)
    - [ ] Walk animation (4-6 frames)
    - [ ] Hit flash (3-4 frames)
  - [ ] Chicken sprite (20x20px, 4 cardinal directions)
    - [ ] Walk animation (2-4 frames)
  - [ ] Explosion sprite (32-64px)
    - [ ] Expand frames (3-4)
    - [ ] Peak frames (1-2)
    - [ ] Fade frames (3-4)
  - [ ] Item sprites (16x16px)
    - [ ] Speed boost (lightning bolt, 2 frame pulse)
    - [ ] Shield (bubble, gentle rotation)
  - [ ] Barrier sprite (16x16px, static or subtle animation)
- [ ] Create SpriteSheet.js manager
  - [ ] Load sprite atlas
  - [ ] Frame extraction
  - [ ] Animation playback
- [ ] Implement Renderer.js updates
  - [ ] Sprite rendering instead of colored squares
  - [ ] Animation frame progression
  - [ ] Sprite rotation/flipping
- [ ] Create ParticleSystem.js
  - [ ] Explosion particles (debris, sparks)
  - [ ] Item spawn particles (sparkles)
  - [ ] Collection particles (star burst)
- [ ] Implement screen shake
  - [ ] Shake intensity based on chain size
  - [ ] Camera offset during shake
  - [ ] Ease out animation
- [ ] Add combo counter UI
  - [ ] "x2 COMBO!" text popup
  - [ ] Position above explosion
  - [ ] Scale up, fade out animation
- [ ] Apply pastel color palette
  - [ ] Background colors
  - [ ] UI colors
  - [ ] Sprite tinting/recoloring
- [ ] Test: All sprites render correctly, animations smooth

**Deliverable**: Polished visual presentation

### Day 15-16: Items & Powerups
- [ ] Create Item.js entity
  - [ ] Speed boost type
  - [ ] Shield type
  - [ ] Position on grid
  - [ ] Collection detection
- [ ] Implement item scatter physics
  - [ ] Directional scatter from explosion
  - [ ] 2-4 tile scatter distance
  - [ ] Smooth movement animation
- [ ] Add powerup effects to Player.js
  - [ ] Speed boost: Move 1.5x faster (every 2/3 tick)
  - [ ] Shield: Immune to explosion damage
  - [ ] Duration tracking (8-12 steps)
  - [ ] Visual feedback (glow, bubble)
- [ ] Implement item spawning logic
  - [ ] 30-50% chance per explosion
  - [ ] 60% speed boost, 40% shield
  - [ ] Spawn item entity at explosion location
  - [ ] Trigger scatter animation
- [ ] Add collection feedback
  - [ ] Particle effect on collect
  - [ ] Sound placeholder (for audio phase)
  - [ ] HUD update (show active powerup + timer)
- [ ] Test: Items spawn, scatter, collect correctly. Powerups work.

**Deliverable**: Functional powerup system

### Day 17-18: Audio Integration
- [ ] Setup AudioManager.js wrapper for Web Audio API
  - [ ] Load audio files
  - [ ] Play sound with volume control
  - [ ] Music playback with looping
  - [ ] Master/SFX/Music volume separation
- [ ] Create or source sound effects
  - [ ] Explosion sounds (single, chain, big chain)
  - [ ] Movement sounds (footsteps, clucks)
  - [ ] Item sounds (spawn, collect)
  - [ ] Powerup sounds (activate, warning)
  - [ ] UI sounds (menu click, game over)
- [ ] Create or source background music
  - [ ] Upbeat chiptune loop (~1-2 minutes)
  - [ ] Layered arrangement (optional)
- [ ] Integrate sounds into game events
  - [ ] Play explosion sound on collision
  - [ ] Vary pitch/volume for chains
  - [ ] Player footstep sounds
  - [ ] Chicken cluck ambience
  - [ ] Item spawn/collect sounds
  - [ ] Powerup feedback sounds
- [ ] Add music playback
  - [ ] Start on game start
  - [ ] Loop seamlessly
  - [ ] Pause on pause menu
- [ ] Test: All sounds trigger correctly, volume balanced

**Deliverable**: Complete audio experience

### Day 19-20: Level Progression
- [ ] Create ProgressionSystem.js
- [ ] Implement level duration tracking
  - [ ] Level 1: 30s
  - [ ] Level 2: 40s
  - [ ] Level 3: 50s
  - [ ] Formula: `30 + (level - 1) * 10` (caps at 120s)
- [ ] Add level completion detection
  - [ ] Check if survival time >= level duration
  - [ ] Trigger level complete event
- [ ] Implement level transition
  - [ ] Display "LEVEL X COMPLETE!" overlay (2 seconds)
  - [ ] Increment level number
  - [ ] Maintain player position and health
  - [ ] Continue seamlessly
- [ ] Add difficulty scaling
  - [ ] Decrease tick rate by ~30ms per level
  - [ ] Increase spawn probability by 5% per level
  - [ ] Track current difficulty multiplier
- [ ] Update HUD to show level progress
  - [ ] Display current level prominently
  - [ ] Show speed multiplier
  - [ ] Optional: Progress bar for level duration
- [ ] Test: Levels progress correctly, difficulty scales smoothly

**Deliverable**: Full level progression system

### Day 21-22: Barriers & Obstacles
- [ ] Create Barrier.js entity
  - [ ] Static position on grid
  - [ ] Blocks player movement
  - [ ] Stops chickens on collision
- [ ] Implement barrier collision logic
  - [ ] Chicken hits barrier → stops moving, becomes stationary
  - [ ] Stationary chicken + moving chicken → explosion
  - [ ] Player cannot walk through barriers
- [ ] Create procedural barrier placement
  - [ ] Random but aesthetic patterns
  - [ ] Avoid blocking large areas
  - [ ] Ensure player has space to maneuver
- [ ] Level-based barrier introduction
  - [ ] Level 1-2: No barriers
  - [ ] Level 3+: 3-5 barrier clusters
  - [ ] Level 7+: More complex patterns
- [ ] Add barrier sprites and rendering
- [ ] Test: Barriers block correctly, chickens stop and explode as expected

**Deliverable**: Functional barrier system

### Day 23-24: UI & Menus
- [ ] Create MenuSystem.js
- [ ] Implement Main Menu
  - [ ] Title screen
  - [ ] "Start Game" button
  - [ ] "High Scores" button (view stats)
  - [ ] "Settings" button
  - [ ] "Controls" button (help screen)
- [ ] Implement Pause Menu (ESC key)
  - [ ] Pause game state
  - [ ] Resume button
  - [ ] Restart button
  - [ ] Settings button
  - [ ] Quit to main menu button
- [ ] Create Settings Menu
  - [ ] Volume sliders (Master, SFX, Music)
  - [ ] Screen shake toggle
  - [ ] Particle density selector (Low/Med/High)
  - [ ] Controls display
- [ ] Implement Game Over Screen
  - [ ] Display final stats:
    - Level reached
    - Survival time
    - Explosions triggered
    - Biggest chain
    - Total score
  - [ ] High score indicator
  - [ ] Retry button
  - [ ] Main menu button
- [ ] Polish HUD
  - [ ] Better visual design (icons, fonts)
  - [ ] Smooth transitions (powerup timer countdown)
  - [ ] Damage flash effect
- [ ] Add keyboard navigation for menus
- [ ] Test: All menus functional, settings persist

**Deliverable**: Complete UI/menu system

---

## Phase 3: Optimization & Release (Week 5)

### Day 25-26: Mobile Support
- [ ] Implement touch input in InputSystem.js
  - [ ] Option 1: Swipe detection (swipe direction = move)
  - [ ] Option 2: Virtual joystick (on-screen D-pad)
  - [ ] Test both, pick better feel
- [ ] Make grid responsive
  - [ ] Detect screen size
  - [ ] Adjust grid size (20x20 for small screens, 30x30 for large)
  - [ ] Scale canvas to fit screen
- [ ] Optimize for mobile performance
  - [ ] Reduce particle density on mobile
  - [ ] Lower audio quality on mobile (optional)
  - [ ] Disable screen shake on motion-sensitive devices (setting)
- [ ] Add mobile-specific UI
  - [ ] Larger touch targets for buttons
  - [ ] Virtual ability button (if special abilities added)
  - [ ] Fullscreen mode on mobile browsers
- [ ] Test on multiple devices
  - [ ] iOS Safari (iPhone)
  - [ ] Chrome Mobile (Android)
  - [ ] Different screen sizes (phone, tablet)
- [ ] Fix mobile-specific bugs

**Deliverable**: Mobile-ready game

### Day 27-28: Performance Optimization
- [ ] Implement object pooling
  - [ ] Explosion pool (reuse explosion objects)
  - [ ] Particle pool (reuse particle objects)
  - [ ] Prevent garbage collection spikes
- [ ] Optimize rendering
  - [ ] Only render on-screen entities (culling)
  - [ ] Use layered canvas (static background, dynamic entities)
  - [ ] Reduce overdraw
- [ ] Optimize collision detection
  - [ ] Spatial partitioning (only check nearby grid cells)
  - [ ] Early exit optimizations
- [ ] Optimize audio
  - [ ] Limit simultaneous sounds (max 8-10)
  - [ ] Use audio sprites (combine sounds into one file)
- [ ] Add FPS monitoring
  - [ ] Track current FPS
  - [ ] Adaptive quality (reduce particles if FPS < 45)
  - [ ] Debug overlay (optional, dev mode only)
- [ ] Profile and identify bottlenecks
  - [ ] Chrome DevTools profiler
  - [ ] Optimize hot paths
- [ ] Test performance on low-end devices

**Deliverable**: Optimized, performant game

### Day 29: Save System & Persistence
- [ ] Create SaveManager.js
  - [ ] LocalStorage integration
  - [ ] Save data versioning
  - [ ] Migration logic for version updates
- [ ] Implement high score tracking
  - [ ] Save best score
  - [ ] Display on game over screen
  - [ ] Display on main menu
- [ ] Add statistics persistence
  - [ ] Total games played
  - [ ] Total survival time
  - [ ] Total explosions
  - [ ] Biggest chain ever
  - [ ] Highest level reached
- [ ] Save settings
  - [ ] Volume levels
  - [ ] Screen shake preference
  - [ ] Particle density
  - [ ] Control scheme (if multiple options)
- [ ] Add stats viewer
  - [ ] "High Scores" menu option
  - [ ] Display all persistent stats
  - [ ] Reset stats option (with confirmation)
- [ ] Test: Data persists across sessions, no corruption

**Deliverable**: Working save/persistence system

### Day 30-32: Testing & Bug Fixes
- [ ] Cross-browser testing
  - [ ] Chrome (desktop + mobile)
  - [ ] Firefox (desktop + mobile)
  - [ ] Safari (desktop + iOS)
  - [ ] Edge (desktop)
- [ ] Create test checklist
  - [ ] All core mechanics work
  - [ ] All UI screens functional
  - [ ] Settings persist
  - [ ] No critical bugs
  - [ ] Performance meets targets
- [ ] Bug fixing sprint
  - [ ] Fix all critical bugs
  - [ ] Fix high-priority bugs
  - [ ] Document known minor bugs
- [ ] Balance pass
  - [ ] Adjust difficulty scaling if needed
  - [ ] Fine-tune spawn rates
  - [ ] Adjust powerup durations
  - [ ] Polish explosion timing
- [ ] Accessibility check
  - [ ] Keyboard-only playable
  - [ ] Touch-only playable
  - [ ] Readable on different screen sizes
  - [ ] Color contrast (pastel palette concern)
- [ ] Get external testers (5-10 people)
  - [ ] Gather feedback
  - [ ] Identify pain points
  - [ ] Note feature requests for post-release
- [ ] Final polish pass

**Deliverable**: Tested, polished, ready-to-ship game

### Day 33-35: Build & Deployment
- [ ] Optimize assets
  - [ ] Compress images (TinyPNG, ImageOptim)
  - [ ] Compress audio (Audacity, online tools)
  - [ ] Create sprite atlases (combine separate images)
- [ ] Setup build process
  - [ ] Minify JavaScript (if using bundler)
  - [ ] Minify CSS
  - [ ] Create production build
  - [ ] Verify bundle size < 2MB
- [ ] Create deployment package
  - [ ] index.html
  - [ ] Bundled JS/CSS
  - [ ] Optimized assets
  - [ ] README or instructions
- [ ] Choose hosting platform
  - [ ] Option A: GitHub Pages (free, easy for static sites)
  - [ ] Option B: Netlify (free, auto-deploy from git)
  - [ ] Option C: Vercel (free, optimized for web apps)
- [ ] Deploy to hosting
  - [ ] Upload files / connect git repo
  - [ ] Configure domain (optional)
  - [ ] Test live deployment
- [ ] Create itch.io page (optional, great for game hosting)
  - [ ] Upload build
  - [ ] Write description
  - [ ] Add screenshots/GIFs
  - [ ] Set visibility (public/private)
- [ ] Share with community
  - [ ] Post to relevant subreddits (r/gamedev, r/webgames)
  - [ ] Share on social media
  - [ ] Submit to web game directories
  - [ ] Gather feedback
- [ ] Monitor analytics (if implemented)
  - [ ] Track plays
  - [ ] Monitor performance
  - [ ] Note common issues

**Deliverable**: Live, publicly accessible game

---

## Phase 4: Post-Release Enhancements (Ongoing)

### High Priority (Based on Spec)
- [ ] Special abilities system (Level 5+)
  - [ ] Dash ability (5 tile dash, 10s cooldown)
  - [ ] Teleport ability (Level 10, click to teleport, 15s cooldown)
  - [ ] Ability UI (icons, cooldown timers)
- [ ] Achievement system
  - [ ] Define achievements (see spec Appendix D)
  - [ ] Achievement tracking
  - [ ] Achievement notifications
  - [ ] Achievement viewer screen

### Medium Priority
- [ ] Different chicken types
  - [ ] Fast chicken (2 tiles per step)
  - [ ] Zigzag chicken (random direction changes)
  - [ ] Armored chicken (2 hits to explode)
- [ ] More obstacle varieties
  - [ ] Destructible barriers (explosions destroy them)
  - [ ] Portals (connect two locations)
  - [ ] Ice tiles (player slides)
- [ ] Visual themes/skins
  - [ ] Alternative color palettes
  - [ ] Seasonal themes (Halloween, Christmas)
  - [ ] Unlockable player skins

### Low Priority / Nice-to-Have
- [ ] Online leaderboard (requires backend)
- [ ] Daily challenges (pre-set seeds)
- [ ] Level editor (custom levels)
- [ ] Replay system (save/share moments)
- [ ] Procedural music (adaptive to game state)
- [ ] Tutorial mode (interactive guide)
- [ ] Accessibility improvements
  - [ ] Colorblind modes
  - [ ] Screen reader support
  - [ ] Assist mode (easier difficulty)

---

## Dependency Graph (Critical Path)

```
Setup (Day 1)
  ↓
Core Entities (Day 2-3)
  ↓
Collision & Explosions (Day 4-5)
  ↓
Spawning (Day 6)
  ↓
Health & Game Loop (Day 7)
  ↓
Playtesting (Day 8-10)
  ↓
┌─────────────┬──────────────┬─────────────┐
│             │              │             │
Visual       Items         Audio       Progression
(Day 11-14)  (Day 15-16)   (Day 17-18)  (Day 19-20)
│             │              │             │
└─────────────┴──────────────┴─────────────┘
  ↓
Barriers (Day 21-22) + UI/Menus (Day 23-24)
  ↓
Mobile Support (Day 25-26)
  ↓
Optimization (Day 27-28)
  ↓
Save System (Day 29)
  ↓
Testing (Day 30-32)
  ↓
Deployment (Day 33-35)
  ↓
Post-Release (Ongoing)
```

---

## Risk Mitigation Checklist

- [ ] **Performance**: Profile regularly, implement object pooling early
- [ ] **Mobile Controls**: Test multiple schemes, user test early
- [ ] **Difficulty Balance**: Make params tunable, extensive playtesting
- [ ] **Chain Clarity**: Strong visual hierarchy, staggered timing, audio feedback
- [ ] **Bundle Size**: Compress assets aggressively, use sprite atlases

---

## Daily Check-In Questions

Use these to stay on track:

1. **Does the current feature work as specified?**
2. **Have I tested this feature thoroughly?**
3. **Is performance still acceptable? (check FPS)**
4. **Have I committed working code to git?**
5. **Am I on schedule, or do I need to adjust scope?**

---

## Testing Checklist (Use before each phase completion)

### Core Mechanics
- [ ] Player moves in 8 directions correctly
- [ ] Chickens move forward in assigned direction
- [ ] Collisions trigger explosions
- [ ] Chain reactions work correctly
- [ ] Explosions damage player
- [ ] Health system works (3 lives)
- [ ] Game over triggers correctly

### Spawning
- [ ] Chickens spawn at game start
- [ ] Explosions trigger new spawns
- [ ] Spawns avoid player (3-4 tiles)
- [ ] Spawn telegraph visible

### Items & Powerups
- [ ] Items spawn from explosions (30-50% chance)
- [ ] Items scatter in correct direction
- [ ] Collecting items works
- [ ] Speed boost increases player speed
- [ ] Shield prevents damage
- [ ] Powerups expire after 8-12 steps

### Level Progression
- [ ] Level duration increases correctly
- [ ] Level transitions smoothly
- [ ] Difficulty scales (speed, spawn rate)
- [ ] Level number displayed correctly

### Barriers
- [ ] Chickens stop at barriers
- [ ] Stopped chickens explode when hit
- [ ] Player blocked by barriers
- [ ] Barriers spawn at correct levels

### UI/Menus
- [ ] Main menu functional
- [ ] Pause menu works (ESC)
- [ ] Settings persist
- [ ] Game over shows correct stats
- [ ] HUD displays correct info

### Mobile
- [ ] Touch controls work
- [ ] Grid scales to screen
- [ ] Performance acceptable on mobile
- [ ] UI readable on small screens

### Performance
- [ ] 60 FPS with 50+ entities (desktop)
- [ ] 60 FPS with 30+ entities (mobile)
- [ ] No memory leaks
- [ ] Load time < 3 seconds

### Save System
- [ ] High score saves
- [ ] Stats persist
- [ ] Settings save
- [ ] Data doesn't corrupt

---

## Resources & Assets Needed

### Graphics
- [ ] Player sprite sheet (24x24, 8 directions or rotatable)
- [ ] Chicken sprite sheet (20x20, 4 directions)
- [ ] Explosion sprite sheet (32-64px, 8-10 frames)
- [ ] Item sprites (16x16, 2 types)
- [ ] Barrier sprites (16x16)
- [ ] UI elements (hearts, icons, buttons)
- [ ] Particle textures (small pixels for debris)

### Audio
- [ ] Explosion sounds (single, chain, big - 3 files)
- [ ] Movement sounds (footstep, cluck - 2 files)
- [ ] Item sounds (spawn, collect - 2 files)
- [ ] Powerup sounds (activate, warning - 2 files)
- [ ] UI sounds (click, game over - 2 files)
- [ ] Background music loop (1 file, ~1-2 minutes)

### Tools Recommended
- **Graphics**:
  - Aseprite (pixel art editor) - $20 or compile from source (free)
  - GIMP (free, general image editor)
  - Piskel (free, web-based pixel editor)
- **Audio**:
  - Audacity (free, audio editing)
  - BFXR or SFXR (free, 8-bit sound effect generator)
  - BeepBox (free, web-based chiptune composer)
- **Development**:
  - VS Code (free, code editor)
  - Chrome DevTools (built-in, debugging & profiling)
  - Git (version control)
  - Optional: Vite (build tool, fast dev server)

### Asset Sources (if not creating your own)
- **Graphics**:
  - OpenGameArt.org (free, CC-licensed game art)
  - itch.io asset packs (free and paid)
  - Kenney.nl (free, high-quality game assets)
- **Audio**:
  - Freesound.org (free, CC-licensed sounds)
  - Incompetech.com (free, royalty-free music by Kevin MacLeod)
  - OpenGameArt.org (also has music/sfx)

---

## Quick Start Commands

### If Using Vite (Recommended Build Tool)

```bash
# Initialize project
npm init -y
npm install vite --save-dev

# Add to package.json scripts:
# "dev": "vite"
# "build": "vite build"
# "preview": "vite preview"

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### If Using Plain HTML/JS (No Build Tool)

```bash
# Just open index.html in browser
# Or use a simple local server:

# Python 3
python -m http.server 8000

# Node.js (install http-server globally)
npx http-server -p 8000

# Then visit: http://localhost:8000
```

---

## Progress Tracking

Mark completion dates as you finish each phase:

- [ ] **Phase 1 Complete**: ___________
- [ ] **Phase 2 Complete**: ___________
- [ ] **Phase 3 Complete**: ___________
- [ ] **Deployment Complete**: ___________

**Project Start Date**: ___________
**Target Completion Date**: ___________
**Actual Completion Date**: ___________

---

## Notes & Learnings

Use this space to document:
- Design decisions and why they were made
- Technical challenges and solutions
- Playtesting feedback and responses
- Ideas for future features
- Things you'd do differently next time

---

**Last Updated**: 2026-01-02
**Document Version**: 1.0
**Status**: Ready for Development
