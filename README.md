# Chicken Chaos - Project Overview

A fast-paced, arcade-style survival game where players navigate a chaotic battlefield of endlessly-marching chickens that explode on collision, creating cascading chain reactions.

## Quick Links

- **[Game Design Specification](./GAME_DESIGN_SPEC.md)** - Complete design document with all mechanics, visuals, audio, and technical architecture
- **[Implementation Tasks](./IMPLEMENTATION_TASKS.md)** - Detailed task breakdown for development (35-day plan)

## Game Concept

### Core Loop
1. Chickens spawn everywhere and march forward in their facing direction
2. When chickens collide, they explode
3. Explosions can trigger chain reactions
4. Items spawn from explosions (speed boost, shield)
5. Player navigates the chaos, collecting items while avoiding explosions
6. Survive for the level duration to progress to the next level

### Key Features
- **Grid-based movement** with toroidal wraparound (wrap-around edges)
- **8-directional player movement** vs 4-directional chicken movement
- **Chain reaction explosions** with visual combos and screen shake
- **Event-triggered spawning** - explosions spawn more chickens
- **Progressive difficulty** - endless levels with increasing challenge
- **Barriers** introduced in later levels that chickens stop at
- **Pixel art aesthetic** with pastel color palette
- **Mobile-friendly** with touch controls

## Tech Stack (Recommended)

**Platform**: Web (HTML5 Canvas)
**Language**: Vanilla JavaScript (ES6+)
**Rendering**: Canvas 2D API
**Audio**: Web Audio API
**Build Tool**: Vite (optional, recommended)
**Deployment**: GitHub Pages, Netlify, or Vercel

### Why Vanilla JS?
- Full control over grid-based rendering
- Lightweight (< 2MB total including assets)
- Excellent performance for mobile
- No framework overhead
- Easy to optimize

## Development Timeline

**Total Duration**: ~5 weeks (35 days)

1. **Phase 1** (Week 1-2): Core Prototype - Playable mechanics
2. **Phase 2** (Week 3-4): Polish & Content - Visuals, audio, progression
3. **Phase 3** (Week 5): Optimization & Release - Mobile support, deployment

See [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md) for detailed day-by-day breakdown.

## Key Mechanics Summary

### Player
- 3 lives (classic arcade style)
- 8-directional movement (including diagonals)
- Can collect powerups from explosions
- Speed increases over time and with powerups

### Chickens
- Move forward in random cardinal direction forever
- 4-directional movement (N/S/E/W)
- Collide with each other → explosion
- Stop at barriers until hit by another chicken
- Spawn continuously (triggered by explosions)

### Explosions
- **Expanding then fading** visual effect
- **Chain reaction capable** - can trigger nearby chickens
- **Size-based timing** - bigger chains last longer
- **30-50% chance** to spawn items

### Items
- **Speed Boost** (60% drop rate) - Move faster for 8-12 steps
- **Shield** (40% drop rate) - Invulnerability for 8-12 steps
- **Scatter from explosion** in directional pattern

### Levels
- **Time-based survival** - survive X seconds to complete level
- **Increasing duration** - Level 1: 30s, Level 2: 40s, etc.
- **Endless progression** - levels continue infinitely
- **New mechanics unlock**:
  - Level 3: Barriers introduced
  - Level 5: Dash ability
  - Level 10: Teleport ability

## Design Principles

1. **Simple rules, complex outcomes** - Easy to learn, hard to master
2. **Risk/reward** - Explosions are dangerous but spawn valuable items
3. **Performance first** - Must run smoothly on mobile devices
4. **Quick prototype** - Get playable version fast, iterate based on feedback
5. **Mobile-friendly** - Touch controls, responsive design, small bundle size

## Visual Style

- **Pixel art** (16-bit era inspired)
- **Pastel colors** (soft, approachable aesthetic)
- **Top-down 2D** view
- **Animated sprites** for all entities
- **Particle effects** for explosions and items
- **Screen shake** and combo counters for juice

## Audio Style

- **Chiptune/8-bit music** (upbeat, ~120-140 BPM)
- **Retro sound effects** (explosions, movement, items)
- **Adaptive audio** (pitch/volume changes for chains)

## File Structure

```
chicken-farm/
├── README.md                      # This file
├── GAME_DESIGN_SPEC.md           # Complete design specification
├── IMPLEMENTATION_TASKS.md        # Development task breakdown
├── index.html                     # Entry point (to be created)
├── src/
│   ├── main.js                    # Game initialization
│   ├── game/                      # Core game systems
│   ├── entities/                  # Player, chickens, explosions, items
│   ├── systems/                   # Input, movement, spawning, progression
│   ├── rendering/                 # Canvas rendering, particles, camera
│   ├── audio/                     # Audio management
│   ├── ui/                        # HUD, menus
│   └── utils/                     # Vector math, save manager, constants
└── assets/
    ├── sprites/                   # Pixel art sprites
    ├── sounds/                    # SFX and music
    └── fonts/                     # Bitmap fonts
```

## Getting Started

### Prerequisites
- Text editor (VS Code recommended)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: Node.js (for Vite build tool)

### Quick Start (Vanilla JS - No Build Tool)

1. Create `index.html` with a canvas element
2. Create `src/main.js` with game loop
3. Open `index.html` in browser
4. Start coding!

### Quick Start (With Vite - Recommended)

```bash
# Initialize project
npm init -y
npm install vite --save-dev

# Add scripts to package.json:
# "dev": "vite"
# "build": "vite build"

# Run dev server
npm run dev

# Visit http://localhost:5173
```

## Next Steps

1. **Review** [GAME_DESIGN_SPEC.md](./GAME_DESIGN_SPEC.md) thoroughly
2. **Check out** [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md) for detailed tasks
3. **Set up** project structure and development environment
4. **Start** with Phase 1, Day 1 tasks
5. **Playtest** frequently and iterate on feedback

## Performance Targets

- **Desktop**: 60 FPS with 100+ entities
- **Mobile**: 60 FPS with 50+ entities
- **Load Time**: < 3 seconds on 3G
- **Bundle Size**: < 2MB total
- **Memory**: < 100MB RAM usage

## Success Metrics

- **Average Session**: > 5 minutes
- **Level 5 Completion**: > 60% of players
- **Level 10 Completion**: > 20% of players
- **Fun Rating**: > 4.0/5.0

## Resources

### Recommended Tools
- **Graphics**: Aseprite, GIMP, Piskel
- **Audio**: Audacity, BFXR, BeepBox
- **Code**: VS Code, Chrome DevTools

### Asset Sources
- **Graphics**: OpenGameArt.org, Kenney.nl, itch.io
- **Audio**: Freesound.org, Incompetech.com
- **Music**: BeepBox.co, OpenGameArt.org

## Questions & Support

For design questions, refer to:
- Section in [GAME_DESIGN_SPEC.md](./GAME_DESIGN_SPEC.md)
- "Open Questions & Future Considerations" (Section 14)

For implementation help:
- Check [IMPLEMENTATION_TASKS.md](./IMPLEMENTATION_TASKS.md)
- Review dependency graph and critical path

## License

*Add your license here*

## Credits

*Add your credits here*

---

**Project Status**: Planning Complete, Ready for Implementation
**Created**: 2026-01-02
**Last Updated**: 2026-01-02
