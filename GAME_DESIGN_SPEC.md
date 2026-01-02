# Chicken Explosion Game - Design Specification

## 1. Game Overview

### Concept
A fast-paced, arcade-style survival game where players navigate a chaotic battlefield of endlessly-marching chickens. Chickens spawn continuously and march forward in their facing direction until they collide with each other, creating explosive chain reactions. The player must survive these explosions while strategically positioning themselves to collect powerups that spawn from the chaos.

### Core Hook
- **Emergent Chaos**: Simple rules (chickens move forward, collisions explode) create complex, unpredictable situations
- **Risk/Reward Loop**: Explosions are dangerous BUT spawn valuable items - players must dance with danger
- **Strategic Positioning**: Using barriers and wraparound mechanics to create controlled collisions and safe zones

### Target Platform
- **Primary**: Web browser (desktop and mobile)
- **Input**: Keyboard (WASD/Arrows) and touch controls
- **Performance Target**: 60 FPS with 50+ entities on screen

---

## 2. Core Mechanics

### 2.1 Movement System

#### Grid-Based Movement
- **Grid Size**: 20x20 to 30x30 tiles (responsive to screen size)
- **Map Type**: Wraparound (toroidal) - entities exiting one edge appear on opposite edge
- **Tile Size**: Recommended 16x16 or 32x32 pixels for pixel art style

#### Player Movement
- **Direction**: 8-directional (cardinal + diagonals)
- **Speed**: Variable - affected by:
  - Base speed increases over time (difficulty scaling)
  - Speed boost powerup (8-12 step duration)
- **Controls**:
  - Keyboard: WASD or Arrow keys
  - Touch: Swipe or virtual D-pad
  - Gamepad support (optional enhancement)

#### Chicken Movement
- **Direction**: Random cardinal direction (N/S/E/W) assigned at spawn
- **Behavior**: Move forward in assigned direction forever
- **Speed**: Matches base game speed (accelerates with difficulty)
- **Facing**: Never changes direction unless:
  - Hits barrier (stops permanently until collision)
  - Explodes (destroyed)

### 2.2 Game Timing

#### Step-Based System
- **Initial Tick Rate**: ~500-600ms per step (medium pace)
- **Acceleration**: Gradually decreases to ~200-300ms in late game
- **Variable Speed Formula**:
  ```
  tick_rate = max(200, 600 - (level * 30) - (time_survived * 2))
  ```

#### Real-Time with Steps
- Game runs in real-time but entities move in discrete steps
- All chickens move simultaneously each tick
- Player can input movement once per tick
- Visual interpolation between steps for smooth animation

### 2.3 Collision & Explosion System

#### Collision Rules
- **Trigger**: Any chicken-to-chicken collision (from any direction)
- **Player Collision**: Player touching explosion loses 1 life
- **Barrier Collision**: Chicken stops at barrier, becomes stationary obstacle until hit

#### Explosion Mechanics
- **Chain Reactions**: Explosions destroy nearby chickens, triggering cascading explosions
- **Blast Radius**:
  - Primary explosion: Single tile (collision point)
  - Chain radius: 3x3 area (explosion can trigger chickens in adjacent tiles)
- **Timing (Size-Based)**:
  - Single explosion: Expand 1 step, fade 2 steps (3 steps total)
  - 2-3 chain: Expand 1 step, fade 3 steps (4 steps total)
  - 4+ chain: Expand 2 steps, fade 4 steps (6 steps total)

#### Explosion Lifecycle
1. **Frame 0**: Collision detected, chickens destroyed
2. **Expand Phase**: Explosion grows outward (danger zone expands)
3. **Peak**: Full size, maximum danger
4. **Fade Phase**: Explosion shrinks, danger persists but visually fading
5. **Clear**: Explosion removed, tile safe again

### 2.4 Chicken Spawning

#### Spawn Triggers
- **Initial Spawn**: 5-10% of total grid tiles populated at level start
- **Event-Triggered**: Each explosion has chance to spawn 1-3 new chickens
  - 60% chance: Spawn 1 chicken
  - 30% chance: Spawn 2 chickens
  - 10% chance: Spawn 3 chickens
- **Spawn Rate Scaling**: Spawn probability increases slightly each level

#### Spawn Rules
- **Location**: Random tile at least 3-4 tiles from player position
- **Telegraph**: Brief flash/particle effect 1 step before chicken appears
- **Direction**: Random cardinal direction assigned at spawn
- **No Overlap**: Never spawn on occupied tiles (player, chicken, barrier, explosion)

#### Spawn Cap
- **No Hard Cap**: Chickens continue spawning based on performance
- **Performance-Based**: Monitor frame rate, reduce spawn rate if FPS drops below 45

### 2.5 Items & Powerups

#### Item Types
1. **Speed Boost** (Common - 60% of drops)
   - Duration: 8-12 steps
   - Effect: Player moves 1.5x faster (can move every 2/3 tick)
   - Visual: Speed lines, character glow

2. **Shield** (Uncommon - 40% of drops)
   - Duration: 8-12 steps
   - Effect: Immune to explosion damage
   - Visual: Bubble/forcefield around player

#### Item Spawning
- **Trigger**: 30-50% chance per explosion (not chain, just initial collision)
- **Scatter Behavior**:
  - Items ejected in direction opposite to collision vector
  - Scatter distance: 2-4 tiles from explosion center
  - Items pushed outward, never inward
- **Persistence**: Items stay on ground until collected (no despawn timer)

#### Collection
- **Method**: Player walks over item tile
- **Feedback**:
  - Particle effect
  - Collect sound
  - HUD update showing active powerup

### 2.6 Barriers & Obstacles

#### Barrier Introduction
- **Level 1-2**: No barriers (learn base mechanics)
- **Level 3+**: Barriers introduced in patterns
- **Procedural Placement**: Random but aesthetically pleasing patterns

#### Barrier Behavior
- **Chicken Interaction**:
  - Chicken hits barrier → stops moving
  - Becomes stationary obstacle
  - Remains until another chicken collides → both explode
- **Player Interaction**: Blocks movement (solid wall)
- **Strategic Value**:
  - Create choke points for controlled collisions
  - Safe zones behind barriers (until chickens accumulate)

---

## 3. Level Design & Progression

### 3.1 Level Structure

#### Endless Procedural Mode
- Levels continue infinitely with increasing difficulty
- Each "level" is a survival duration checkpoint
- No final level, pure endurance challenge

#### Level Duration (Increasing)
```
Level 1: 30 seconds
Level 2: 40 seconds
Level 3: 50 seconds
Level 4: 60 seconds
Level 5+: 60 + (level - 4) * 10 seconds (caps at 120 seconds)
```

### 3.2 Difficulty Progression

#### Scaling Factors
1. **Speed Increase**: Tick rate decreases by ~30ms per level
2. **Spawn Rate**: +5% chicken spawn probability per level
3. **New Mechanics**: Introduced at specific level milestones

#### Mechanic Introduction Schedule
- **Level 1-2**: Pure survival, learn basics
- **Level 3**: Barriers introduced (3-5 barrier clusters)
- **Level 5**: Special abilities unlock (dash ability - 5 tile dash, 10 second cooldown)
- **Level 7**: More complex barrier patterns
- **Level 10**: Teleport ability unlock (click to teleport, 15 second cooldown)
- **Level 12+**: Barrier density increases, more chaos

### 3.3 Win/Loss Conditions

#### Level Completion
- **Objective**: Survive for level's required duration
- **Success**: Immediately progress to next level
- **No Loading**: Seamless transition (brief 2 second "LEVEL X" text overlay)

#### Game Over
- **Trigger**: Health reaches 0 (all 3 lives lost)
- **Stats Display**:
  - Final level reached
  - Total survival time
  - Total explosions triggered
  - Biggest chain reaction
  - Items collected
- **Options**: Restart, View Stats, Share Score

---

## 4. Visual Design

### 4.1 Art Style

#### Pixel Art Aesthetic
- **Style**: 16-bit era inspired (SNES/Genesis quality)
- **Palette**: Pastel/soft colors
  - Background: Light lavender/cream (#E8D5F2, #FFF8E7)
  - Chickens: Soft yellow, peach, white variants (#FFE5B4, #FFDAB9)
  - Explosions: Warm oranges, soft reds (#FFA07A, #FFB6C1)
  - Items: Cool blues, gentle greens (#ADD8E6, #98FB98)
  - Barriers: Soft grays, browns (#D3D3D3, #DEB887)

#### Sprite Requirements
1. **Player Character** (Human)
   - Idle: 2-4 frame loop
   - Walk: 4-6 frames per direction (8 directions = 48 frames OR use rotation)
   - Hit: 3-4 frame flash
   - Powered up: Add glow overlay

2. **Chicken**
   - Idle/Walk: 2-4 frame loop
   - Facing indicator: Beak/head points in movement direction
   - Size: ~16x16 or 24x24 pixels
   - 4 rotations (N/S/E/W)

3. **Explosion**
   - Expand: 3-4 frames growing
   - Peak: 1-2 frames full size
   - Fade: 3-4 frames shrinking
   - Total: 8-10 frame sequence
   - Particle effects: Small pixel debris

4. **Items**
   - Speed Boost: Lightning bolt or shoe icon, 2 frame pulse
   - Shield: Bubble or star icon, gentle rotation
   - Shine/sparkle animation: 4 frames

5. **Barriers**
   - Static sprite: Stone wall, fence, or crate
   - Optional: Subtle idle animation (vines swaying, etc.)

### 4.2 Visual Feedback

#### Explosion Effects
- **Chain Combo Display**:
  - Text popup: "x2 COMBO!" "x5 CHAIN!"
  - Position: Above explosion center
  - Animation: Scale up quickly, fade out
  - Color: Intensifies with chain length (yellow → orange → red)

- **Screen Shake**:
  - Intensity based on chain size
  - Single explosion: 2px shake, 0.1s duration
  - 5+ chain: 8px shake, 0.3s duration

#### Danger Indicators
- **Pre-Explosion Warning**:
  - Danger zone tiles highlighted with pulsing red outline
  - 1 step before explosion is dangerous
  - Helps player predict safe movement

- **Spawn Telegraph**:
  - Brief sparkle effect at spawn location
  - 1 step warning before chicken appears
  - Subtle sound cue

#### UI Overlays
- **Damage Feedback**:
  - Screen flash red when hit
  - Hearts/lives shake briefly
  - Player sprite flashes white

- **Powerup Feedback**:
  - Item collection: Star burst particle effect
  - Active powerup: Icon pulses in HUD
  - Powerup ending: Icon flashes rapidly (last 2 seconds)

### 4.3 Camera & Viewport

#### Top-Down 2D View
- **Angle**: Directly overhead (90° top-down)
- **Zoom**: Fit entire grid on screen with padding
- **Responsive Scaling**:
  - Desktop: Show full 30x30 grid
  - Mobile: May reduce to 20x20 or add zoom controls

#### Viewport Considerations
- **Mobile Portrait**: 20x25 grid (taller)
- **Mobile Landscape**: 30x20 grid (wider)
- **Desktop**: Square 30x30 optimal

---

## 5. Audio Design

### 5.1 Sound Effects

#### Core Gameplay Sounds
1. **Explosions**
   - Single explosion: Pop/thud sound
   - Chain reactions: Rapid-fire pops with rising pitch
   - Big chains (5+): Add bass rumble layer

2. **Movement**
   - Player footsteps: Soft tap per step
   - Chicken clucks: Occasional ambient clucks, higher pitch per step
   - Volume scales with entity count (normalize to prevent overwhelming)

3. **Items**
   - Spawn: Magical twinkle
   - Collection: Pleasant chime
   - Powerup activation: Power-up sound (rising synth)
   - Powerup ending: Warning beep (last 2 seconds)

4. **UI/Feedback**
   - Level complete: Triumphant jingle
   - Game over: Descending sad trombone
   - Hit/damage: Sharp impact sound
   - Combo: Ascending arpeggio per chain level

### 5.2 Music

#### Background Track
- **Style**: Upbeat chiptune/8-bit music
- **Tempo**: Matches game pace (120-140 BPM)
- **Layering**: Add instrument layers as level increases
  - Level 1: Simple melody
  - Level 3: Add bass line
  - Level 5: Add percussion
  - Level 7+: Full arrangement

#### Adaptive Music (Optional Enhancement)
- Music tempo increases with game speed
- Intensity rises with chicken density
- Special "danger" layer when health is low

---

## 6. User Interface

### 6.1 HUD Elements

#### In-Game HUD (Minimalist)
Top Bar:
```
[❤️❤️❤️] Lives        [⚡ 0:08] Active Powerup        [Level 5]
```

Bottom Bar:
```
[💥 27] Explosions        [Speed: x1.3]        [Time: 1:23]
```

- **Lives**: Heart icons (filled/empty)
- **Active Powerup**: Icon + remaining time
- **Level**: Current level number
- **Explosions**: Total explosions triggered this session
- **Speed**: Current game speed multiplier
- **Time**: Total survival time

### 6.2 Menus

#### Main Menu
```
╔════════════════════════════╗
║   CHICKEN CHAOS!          ║
║                           ║
║   [  START GAME  ]        ║
║   [  HIGH SCORES ]        ║
║   [  SETTINGS    ]        ║
║   [  CONTROLS    ]        ║
║                           ║
╚════════════════════════════╝
```

#### Pause Menu (ESC key)
```
╔════════════════════════════╗
║   PAUSED                  ║
║                           ║
║   [  RESUME      ]        ║
║   [  RESTART     ]        ║
║   [  SETTINGS    ]        ║
║   [  QUIT        ]        ║
╚════════════════════════════╝
```

#### Game Over Screen
```
╔════════════════════════════╗
║   GAME OVER!              ║
║                           ║
║   Level Reached:    8     ║
║   Survival Time:  4:32    ║
║   Explosions:      142    ║
║   Best Chain:      x7     ║
║                           ║
║   High Score: 8,450 pts   ║
║                           ║
║   [  RETRY  ]  [  MENU  ] ║
╚════════════════════════════╝
```

### 6.3 Settings Menu

#### Options
- **Volume**: Master, SFX, Music (0-100%)
- **Controls**: Keyboard/Gamepad mapping display
- **Graphics**:
  - Screen shake (On/Off)
  - Particle density (Low/Med/High)
- **Accessibility**:
  - Colorblind mode (Future enhancement)
  - Reduced motion (Disable shake/animations)

---

## 7. Technical Architecture

### 7.1 Technology Stack Recommendation

#### Option A: Vanilla JavaScript + Canvas (RECOMMENDED for this project)
**Why**:
- Full control over grid-based rendering
- Lightweight, no framework overhead
- Easy to optimize for performance
- Simple deployment (single HTML file possible)
- Perfect for pixel art and particle effects

**Tech Stack**:
- HTML5 Canvas for rendering
- Vanilla ES6+ JavaScript
- Web Audio API for sound
- LocalStorage for save data
- Optional: Vite for dev tooling and bundling

**Pros**:
- Maximum performance control
- Minimal dependencies
- Smallest bundle size
- Easy to understand and debug
- Great learning experience

**Cons**:
- More manual work (no built-in physics, scene management)
- Need to build game loop, entity system from scratch

#### Option B: Phaser.js (Alternative if you want faster prototyping)
**Why**:
- Built-in sprite system, physics, scenes
- Excellent documentation and community
- Good for rapid prototyping

**Cons**:
- Larger bundle size (~900KB)
- May be overkill for grid-based game
- Less control over optimization

**Recommendation**: Start with **Vanilla JS + Canvas** for this project because:
1. Grid-based gameplay doesn't need complex physics
2. Performance optimization is a priority
3. Mobile-friendly requires small bundle size
4. Full control over rendering pipeline

### 7.2 Architecture Overview

#### File Structure
```
chicken-chaos/
├── index.html
├── src/
│   ├── main.js                 # Entry point, game initialization
│   ├── game/
│   │   ├── Game.js             # Main game loop and state management
│   │   ├── Grid.js             # Grid system, toroidal wraparound
│   │   ├── EntityManager.js    # Manage all entities (chickens, player, items)
│   │   └── CollisionSystem.js  # Collision detection and explosion chains
│   ├── entities/
│   │   ├── Player.js           # Player entity
│   │   ├── Chicken.js          # Chicken entity
│   │   ├── Explosion.js        # Explosion entity
│   │   ├── Item.js             # Item/powerup entity
│   │   └── Barrier.js          # Barrier obstacle
│   ├── systems/
│   │   ├── InputSystem.js      # Keyboard/touch input handling
│   │   ├── MovementSystem.js   # Entity movement logic
│   │   ├── SpawnSystem.js      # Chicken spawning logic
│   │   └── ProgressionSystem.js # Level progression, difficulty scaling
│   ├── rendering/
│   │   ├── Renderer.js         # Canvas rendering
│   │   ├── SpriteSheet.js      # Sprite management
│   │   ├── ParticleSystem.js   # Explosion particles, effects
│   │   └── Camera.js           # Viewport management
│   ├── audio/
│   │   ├── AudioManager.js     # Web Audio API wrapper
│   │   └── sounds/             # Sound effect files
│   ├── ui/
│   │   ├── HUD.js              # In-game HUD
│   │   ├── MenuSystem.js       # Menus (main, pause, game over)
│   │   └── UIRenderer.js       # UI rendering
│   └── utils/
│       ├── Vector2.js          # 2D vector math
│       ├── SaveManager.js      # LocalStorage persistence
│       └── Constants.js        # Game constants and config
├── assets/
│   ├── sprites/
│   │   ├── player.png
│   │   ├── chicken.png
│   │   ├── explosion.png
│   │   ├── items.png
│   │   └── barriers.png
│   ├── sounds/
│   │   ├── explosion.wav
│   │   ├── collect.wav
│   │   └── music.mp3
│   └── fonts/
└── dist/                       # Built files
```

#### Core Systems

##### 1. Entity Component System (Simple)
```javascript
// Base entity class
class Entity {
  constructor(x, y, type) {
    this.id = generateId();
    this.position = { x, y };
    this.type = type;
    this.active = true;
  }

  update(deltaTime) {}
  render(ctx) {}
}
```

##### 2. Game Loop (Fixed Timestep)
```javascript
class Game {
  constructor() {
    this.tickRate = 500; // ms per step
    this.accumulator = 0;
    this.lastTime = 0;
  }

  loop(currentTime) {
    const deltaTime = currentTime - this.lastTime;
    this.accumulator += deltaTime;

    // Fixed timestep updates
    while (this.accumulator >= this.tickRate) {
      this.update(this.tickRate);
      this.accumulator -= this.tickRate;
    }

    // Variable rendering (smooth animation)
    this.render(this.accumulator / this.tickRate);

    requestAnimationFrame((t) => this.loop(t));
  }
}
```

##### 3. Grid System (Toroidal Wraparound)
```javascript
class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.cells = Array(width * height).fill(null);
  }

  wrap(x, y) {
    return {
      x: (x + this.width) % this.width,
      y: (y + this.height) % this.height
    };
  }

  getCell(x, y) {
    const pos = this.wrap(x, y);
    return this.cells[pos.y * this.width + pos.x];
  }
}
```

### 7.3 Performance Optimization

#### Strategies
1. **Object Pooling**: Reuse explosion, particle objects
2. **Spatial Partitioning**: Only check collisions in nearby grid cells
3. **Render Culling**: Only render on-screen entities
4. **Lazy Particle Spawning**: Reduce particle count on low-end devices
5. **Delta Compression**: Smooth interpolation between grid steps
6. **Web Workers** (Optional): Offload pathfinding, collision to worker thread

#### Mobile Optimization
- Touch controls with virtual joystick
- Reduce particle effects on mobile
- Smaller grid size (20x20) on small screens
- Disable screen shake on motion-sensitive devices
- Lower audio sample rate on mobile

---

## 8. Scoring & Progression

### 8.1 Scoring System

#### Point Sources
```
Base Explosion:        100 pts
Chain Multiplier:      x2, x3, x4... (per chain length)
Item Collection:       50 pts
Level Completion:      500 pts × level number
Survival Bonus:        10 pts per second survived
```

#### Example Scoring
```
Single explosion:      100 pts
3-chain explosion:     100 + 200 + 300 = 600 pts
5-chain explosion:     100 + 200 + 300 + 400 + 500 = 1,500 pts
Collecting speed item: 50 pts
Completing Level 5:    2,500 pts
```

### 8.2 Statistics Tracking

#### Session Stats (displayed at game over)
- Level reached
- Total survival time
- Total explosions triggered
- Biggest chain combo
- Items collected
- Total score

#### Persistent Stats (LocalStorage)
- All-time high score
- Total games played
- Total survival time (all sessions)
- Total explosions (all sessions)
- Biggest chain ever
- Highest level reached

#### Achievements (Future Enhancement)
- "Chain Master": Achieve 10-chain combo
- "Speed Demon": Complete level with 2x speed active
- "Iron Chicken": Complete level without losing a life
- "Survivor": Reach Level 10
- "Explosive Expert": Trigger 1000 total explosions

---

## 9. Development Roadmap

### Phase 1: Core Prototype (Week 1-2)
**Goal**: Playable vertical slice with core mechanics

**Tasks**:
1. **Setup** (Day 1)
   - Initialize project structure
   - Setup Canvas rendering
   - Basic game loop implementation
   - Grid system with toroidal wraparound

2. **Core Entities** (Day 2-3)
   - Player entity (8-directional movement)
   - Chicken entity (cardinal movement)
   - Basic sprite rendering (colored squares acceptable)
   - Input system (keyboard WASD)

3. **Collision & Explosions** (Day 4-5)
   - Collision detection (grid-based)
   - Single explosion implementation
   - Chain reaction system
   - Explosion timing (expand/fade)

4. **Spawning** (Day 6)
   - Initial chicken spawn
   - Event-triggered spawning
   - Spawn location algorithm (away from player)
   - Spawn telegraph

5. **Health & Game Loop** (Day 7)
   - Player health system (3 lives)
   - Damage from explosions
   - Game over state
   - Basic HUD (lives, level, time)

6. **Playtesting** (Day 8-10)
   - Balance tick rate
   - Adjust spawn rates
   - Test difficulty curve
   - Fix critical bugs

### Phase 2: Polish & Content (Week 3-4)
**Goal**: Full game experience with art, audio, progression

**Tasks**:
7. **Visual Design** (Day 11-14)
   - Create pixel art sprites (player, chickens, explosions)
   - Implement sprite animations
   - Add particle effects
   - Screen shake implementation
   - Combo counter UI

8. **Items & Powerups** (Day 15-16)
   - Item entity system
   - Speed boost powerup
   - Shield powerup
   - Item scatter physics
   - Collection feedback

9. **Audio** (Day 17-18)
   - Integrate Web Audio API
   - Add explosion sounds
   - Movement sound effects
   - Item collection sounds
   - Background music loop

10. **Level Progression** (Day 19-20)
    - Level transition system
    - Difficulty scaling
    - Variable tick rate
    - Increasing duration per level

11. **Barriers** (Day 21-22)
    - Barrier entity implementation
    - Chicken stop behavior
    - Procedural barrier placement
    - Level-based introduction (Level 3+)

12. **UI/Menus** (Day 23-24)
    - Main menu
    - Pause menu
    - Settings menu
    - Game over screen with stats
    - HUD polish

### Phase 3: Optimization & Release (Week 5)
**Goal**: Mobile-ready, performant, deployed

**Tasks**:
13. **Mobile Support** (Day 25-26)
    - Touch controls (virtual joystick or swipe)
    - Responsive grid sizing
    - Performance optimization for mobile
    - Test on multiple devices

14. **Performance** (Day 27-28)
    - Object pooling for explosions/particles
    - Render optimization
    - Audio optimization
    - FPS monitoring and adaptive quality

15. **Save/Persistence** (Day 29)
    - LocalStorage integration
    - High score tracking
    - Statistics persistence
    - Save data versioning

16. **Testing & Bug Fixes** (Day 30-32)
    - Cross-browser testing
    - Mobile device testing
    - Bug fixing
    - Balance adjustments

17. **Deployment** (Day 33-35)
    - Build optimization (minification)
    - Asset optimization (image compression)
    - Deploy to hosting (Netlify, Vercel, GitHub Pages)
    - Share and gather feedback

### Phase 4: Post-Release (Ongoing)
**Enhancements** (based on feedback):
- Special abilities (dash, teleport)
- Different chicken types
- More obstacle varieties
- Endless mode leaderboard (online)
- Accessibility improvements
- Additional powerups
- Visual themes/skins
- Sound effect variety

---

## 10. Technical Specifications

### 10.1 Performance Requirements

#### Target Specifications
- **Desktop**: 60 FPS with 100+ entities
- **Mobile**: 60 FPS with 50+ entities
- **Load Time**: < 3 seconds on 3G connection
- **Bundle Size**: < 2MB total (code + assets)
- **Memory**: < 100MB RAM usage

#### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### 10.2 Asset Specifications

#### Sprites
- **Format**: PNG with transparency
- **Color Depth**: 32-bit RGBA
- **Atlas**: Combine into sprite sheets to reduce HTTP requests
- **Sizes**:
  - Player: 24x24px
  - Chicken: 20x20px
  - Items: 16x16px
  - Explosion frames: 32x32px to 64x64px

#### Audio
- **Format**: MP3 for music, WAV for SFX (cross-browser compatibility)
- **Sample Rate**: 44.1kHz
- **Bit Rate**: 128kbps for music, 192kbps for important SFX
- **Max File Sizes**: Music < 1MB, SFX < 50KB each

#### Fonts
- **Primary**: Web-safe or Google Fonts
- **Pixel Font**: Use bitmap font for retro aesthetic
- **Sizes**: 8px, 12px, 16px, 24px

### 10.3 Data Models

#### Game State
```javascript
{
  level: 5,
  score: 12450,
  lives: 2,
  time: 245.6, // seconds
  explosionCount: 87,
  biggestChain: 6,
  tickRate: 350,
  activePowerups: [
    { type: 'speed', remaining: 5 }
  ]
}
```

#### Entity Data
```javascript
{
  id: 'chicken_42',
  type: 'chicken',
  position: { x: 15, y: 22 },
  direction: 'north',
  isStationary: false,
  sprite: 'chicken_yellow'
}
```

#### Save Data (LocalStorage)
```javascript
{
  version: '1.0.0',
  stats: {
    highScore: 45200,
    gamesPlayed: 23,
    totalSurvivalTime: 3456,
    totalExplosions: 1892,
    biggestChain: 12,
    highestLevel: 15
  },
  settings: {
    volumeMaster: 80,
    volumeSFX: 100,
    volumeMusic: 60,
    screenShake: true,
    particleDensity: 'high'
  }
}
```

---

## 11. Risk Mitigation & Challenges

### Identified Challenges

#### 1. Performance with High Entity Count
**Risk**: Game lags when 100+ chickens on screen
**Mitigation**:
- Implement object pooling early
- Use spatial partitioning for collision detection
- Profile regularly, optimize hot paths
- Add performance-based spawn cap as fallback

#### 2. Touch Control Feel on Mobile
**Risk**: Touch controls feel imprecise or laggy
**Mitigation**:
- Prototype multiple control schemes (swipe, virtual joystick, tap-to-move)
- User test on actual devices early
- Add input buffering for more responsive feel
- Consider hybrid control (swipe for movement + tap for abilities)

#### 3. Difficulty Balancing
**Risk**: Game too easy or too hard, poor difficulty curve
**Mitigation**:
- Extensive playtesting with different skill levels
- Make difficulty parameters easily tunable (external config file)
- Consider difficulty modes (Easy, Normal, Hard)
- Gather analytics on player progression (what level do most people die?)

#### 4. Chain Reaction Clarity
**Risk**: Players can't track complex chain reactions, feels chaotic
**Mitigation**:
- Strong visual hierarchy (primary explosion vs chains)
- Staggered timing (slight delay between chain steps)
- Clear audio feedback (pitch/volume changes)
- Slow-motion effect on huge chains (optional)

#### 5. Mobile Bundle Size
**Risk**: Large asset files slow mobile loading
**Mitigation**:
- Aggressive image compression (TinyPNG, ImageOptim)
- Use sprite atlases to reduce requests
- Lazy-load audio files
- Progressive enhancement (load low-res first, upgrade)

---

## 12. Success Metrics

### Key Performance Indicators (KPIs)

#### Engagement
- **Average Session Length**: Target > 5 minutes
- **Sessions per User**: Target > 3 sessions
- **Retention**: 40%+ return within 7 days

#### Progression
- **Level 5 Completion Rate**: Target > 60%
- **Level 10 Completion Rate**: Target > 20%
- **Average Level Reached**: Target ≥ 6

#### Technical
- **Load Time**: < 3 seconds (75th percentile)
- **FPS**: > 55 FPS (95th percentile)
- **Crash Rate**: < 1%

#### User Feedback
- **Fun Rating**: Target > 4.0/5.0
- **Difficulty Balance**: "Just Right" > 60%
- **Would Recommend**: > 70%

---

## 13. Appendix

### A. Control Scheme

#### Keyboard
```
Movement:
  W, A, S, D  OR  Arrow Keys

Actions:
  SPACE     - Use special ability (when unlocked)
  ESC       - Pause menu
  R         - Quick restart (when dead)
```

#### Touch (Mobile)
```
Movement:
  Swipe in direction  OR  Virtual D-pad

Actions:
  Tap ability icon  - Use special ability
  Pinch             - Zoom (optional)
  Menu button       - Pause
```

#### Gamepad (Optional)
```
Movement:
  Left Stick  OR  D-Pad

Actions:
  A Button    - Use ability
  START       - Pause
```

### B. Color Palette

#### Pastel Theme Colors
```
Background:
  Sky:       #E8D5F2 (Light lavender)
  Ground:    #FFF8E7 (Cream)

Chickens:
  Primary:   #FFE5B4 (Peach)
  Secondary: #FFDAB9 (Peach puff)
  Accent:    #FFFFFF (White)

Explosions:
  Inner:     #FFB6C1 (Light pink)
  Outer:     #FFA07A (Light coral)
  Flash:     #FFFFFF (White)

Items:
  Speed:     #ADD8E6 (Light blue)
  Shield:    #98FB98 (Pale green)

UI:
  Primary:   #D8BFD8 (Thistle)
  Text:      #4A4A4A (Dark gray)
  Warning:   #FFA07A (Light coral)
  Success:   #98FB98 (Pale green)

Barriers:
  Stone:     #D3D3D3 (Light gray)
  Wood:      #DEB887 (Burlywood)
```

### C. Sound Effect Descriptions

#### Explosion Sounds
- **Single**: Soft "poof" with slight bass (0.2s duration)
- **Chain 2-3**: Rapid pops, rising pitch (0.4s duration)
- **Chain 4-6**: Crackling sequence + bass rumble (0.8s duration)
- **Chain 7+**: Full explosion with echo (1.2s duration)

#### Movement Sounds
- **Player Steps**: Soft taps, randomized pitch (0.1s)
- **Chicken Clucks**: Short "bok" sound, randomized (0.15s)
- **Ambient**: Occasional distant clucks (background layer)

#### Item Sounds
- **Spawn**: Magical sparkle, ascending chime (0.3s)
- **Collect**: Pleasant bell tone (0.2s)
- **Speed Active**: Whoosh sound (0.4s)
- **Shield Active**: Energy shield hum (0.5s)
- **Powerup Warning**: Beep-beep-beep (last 2 seconds)

### D. Achievement Ideas (Future)

#### Tier 1 (Easy)
- **First Steps**: Complete Level 1
- **Chain Beginner**: Trigger a 3-chain
- **Collector**: Collect 10 items in a single game
- **Survivor**: Survive for 60 seconds

#### Tier 2 (Medium)
- **Chain Master**: Trigger a 7-chain
- **Speed Demon**: Complete a level with speed boost active
- **Untouchable**: Complete a level without taking damage
- **Level 10 Club**: Reach Level 10

#### Tier 3 (Hard)
- **Chain Legend**: Trigger a 12-chain
- **Marathon**: Survive for 10 minutes
- **Perfect Game**: Complete 3 levels without losing a life
- **High Roller**: Score 50,000 points

#### Tier 4 (Expert)
- **Chaos Conductor**: Trigger 500 total explosions
- **Eternal Survivor**: Reach Level 20
- **Platinum**: Unlock all other achievements

---

## 14. Open Questions & Future Considerations

### Questions for Future Design Decisions

1. **Should there be different chicken types?**
   - Fast chickens (move 2 tiles per step)
   - Zigzag chickens (change direction randomly)
   - Armored chickens (require 2 hits to explode)

2. **Should explosions damage barriers?**
   - Adds depth but may complicate barrier strategy
   - Could introduce "destructible" vs "permanent" barriers

3. **Should there be a "combo meter" that builds over time?**
   - Rewards sustained chain reactions
   - Could multiply score or unlock temporary abilities

4. **Online leaderboards?**
   - Requires backend server
   - Adds competitive element
   - Consider weekly/daily challenges

5. **Procedural music generation?**
   - Music changes based on current game state
   - Technically complex but very engaging

### Future Feature Ideas

- **Daily Challenges**: Pre-set seeds, compete for high scores
- **Custom Levels**: Level editor, share codes with friends
- **Chicken Skins**: Unlockable cosmetic variants
- **Player Skins**: Unlockable character sprites
- **Challenge Modes**:
  - No powerups mode
  - Maximum chickens mode
  - Speed run mode (complete levels as fast as possible)
- **Replays**: Save and share incredible moments
- **Tutorial**: Interactive tutorial explaining mechanics
- **Accessibility**:
  - Colorblind modes
  - Screen reader support
  - One-handed mode
  - Assist mode (slower speed, more lives)

---

## 15. Conclusion

This game combines simple, intuitive mechanics with emergent complexity and strategic depth. The core loop of "avoid explosions while strategically positioning to collect items" creates a compelling risk/reward dynamic that should keep players engaged.

The pixel art aesthetic with pastel colors provides a charming, approachable visual style that contrasts nicely with the chaotic gameplay. The mobile-first, performance-optimized approach ensures the game can reach a wide audience.

By starting with a solid vertical slice (Phase 1) and iterating based on playtesting, the project can quickly validate core mechanics before investing in polish and content. The modular architecture allows for easy expansion with new features post-launch.

**Next Steps**:
1. Review and approve this specification
2. Begin Phase 1 implementation (core prototype)
3. Schedule regular playtesting sessions
4. Iterate on feedback and refine mechanics

---

**Document Version**: 1.0
**Last Updated**: 2026-01-02
**Author**: Claude (based on user interview)
**Status**: Ready for Implementation
