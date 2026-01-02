import { Grid } from './Grid.js'
import { EntityManager } from './EntityManager.js'
import { CollisionSystem } from './CollisionSystem.js'
import { InputSystem } from '../systems/InputSystem.js'
import { SpawnSystem } from '../systems/SpawnSystem.js'
import { Renderer } from '../rendering/Renderer.js'
import { HUD } from '../ui/HUD.js'
import { Player } from '../entities/Player.js'
import { GRID_WIDTH, GRID_HEIGHT, TILE_SIZE, INITIAL_TICK_RATE } from '../utils/Constants.js'

export class Game {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    // Set canvas size
    this.canvas.width = GRID_WIDTH * TILE_SIZE
    this.canvas.height = GRID_HEIGHT * TILE_SIZE

    // Core systems
    this.grid = new Grid(GRID_WIDTH, GRID_HEIGHT)
    this.entityManager = new EntityManager(this.grid)
    this.collisionSystem = new CollisionSystem()
    this.inputSystem = new InputSystem()
    this.spawnSystem = new SpawnSystem()
    this.hud = new HUD()

    // Game state
    this.state = 'playing'  // 'playing', 'paused', 'gameover'
    this.tickRate = INITIAL_TICK_RATE
    this.accumulator = 0
    this.lastTime = 0

    // Statistics
    this.explosionCount = 0
    this.biggestChain = 0

    // Listen for restart
    this.inputSystem.keys.set('r', false)

    // Initialize game
    this.init()
  }

  init() {
    // Create player at center of grid
    const centerX = Math.floor(GRID_WIDTH / 2)
    const centerY = Math.floor(GRID_HEIGHT / 2)
    this.player = new Player(centerX, centerY)
    this.entityManager.add(this.player)

    // Initial chicken spawn
    this.spawnSystem.initialSpawn(this.entityManager, this.grid, this.player)

    console.log('Game initialized!')
  }

  loop(currentTime) {
    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime
    this.accumulator += deltaTime

    // Check for restart
    if (this.state === 'gameover' && this.inputSystem.isKeyPressed('r')) {
      this.reset()
    }

    // Fixed timestep updates
    while (this.accumulator >= this.tickRate) {
      if (this.state === 'playing') {
        this.update(this.tickRate)
      }
      this.accumulator -= this.tickRate
    }

    // Render
    this.render()

    requestAnimationFrame((t) => this.loop(t))
  }

  update(deltaTime) {
    // Update all entities
    this.entityManager.update(deltaTime, this)

    // Check for collisions
    const collisions = this.collisionSystem.checkCollisions(this.entityManager, this.grid)
    this.collisionSystem.handleCollisions(collisions, this.entityManager, this)

    // Spawn chickens from explosions
    const explosions = this.entityManager.getEntitiesByType('explosion')
    for (const explosion of explosions) {
      if (explosion.timer === 1) {  // Just created
        this.spawnSystem.onExplosion(this.entityManager, this.grid, this.player)
      }
    }
  }

  render() {
    // Clear canvas
    Renderer.clear(this.ctx, this.canvas.width, this.canvas.height)

    // Draw grid (optional, for debugging)
    Renderer.drawGrid(this.ctx, this.grid, TILE_SIZE)

    // Render all entities
    this.entityManager.render(this.ctx, TILE_SIZE)

    // Render HUD
    this.hud.render(this.ctx, this.canvas, this)
  }

  reset() {
    // Clear all entities
    this.entityManager.clear()

    // Reset statistics
    this.explosionCount = 0
    this.biggestChain = 0

    // Reset state
    this.state = 'playing'

    // Reset HUD
    this.hud.reset()

    // Reinitialize
    this.init()

    console.log('Game reset!')
  }

  start() {
    this.lastTime = performance.now()
    requestAnimationFrame((t) => this.loop(t))
  }
}
