// Grid configuration
export const GRID_WIDTH = 30
export const GRID_HEIGHT = 30
export const TILE_SIZE = 20  // pixels

// Game timing
export const INITIAL_TICK_RATE = 200  // milliseconds per game tick

// Player configuration
export const PLAYER_LIVES = 3
export const INVULNERABILITY_TICKS = 2  // Number of ticks player is invulnerable after hit

// Spawning configuration
export const SPAWN_DISTANCE_FROM_PLAYER = 3  // Minimum tiles away from player
export const INITIAL_SPAWN_PERCENTAGE = 0.09  // 9% of grid tiles populated at start

// Spawn probability after explosion (50%, 35%, 15% for 1, 2, 3 chickens)
export const SPAWN_PROBABILITY = {
  ONE_CHICKEN: 0.5,
  TWO_CHICKENS: 0.85,  // Cumulative: 0.5 + 0.35
  THREE_CHICKENS: 1.0  // Cumulative: 0.85 + 0.15
}

// Explosion timing (in game ticks)
export const EXPLOSION_TIMERS = {
  SINGLE: 3,      // Single explosion
  CHAIN_SMALL: 4, // 2-3 chain
  CHAIN_LARGE: 6  // 4+ chain
}

// Chain reaction configuration
export const CHAIN_REACTION_DELAY = 50  // milliseconds before checking for chain reactions
