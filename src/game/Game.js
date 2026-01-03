import { Grid } from './Grid.js'
import { EntityManager } from './EntityManager.js'
import { CollisionSystem } from './CollisionSystem.js'
import { InputSystem } from '../systems/InputSystem.js'
import { SpawnSystem } from '../systems/SpawnSystem.js'
import { Renderer } from '../rendering/Renderer.js'
import { HUD } from '../ui/HUD.js'
import { Player } from '../entities/Player.js'
import { Barrier } from '../entities/Barrier.js'
import { SaveSystem } from '../utils/SaveSystem.js'
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
    this.saveSystem = new SaveSystem()

    // Game state
    this.state = 'playing'  // 'playing', 'paused', 'gameover'
    this.tickRate = INITIAL_TICK_RATE
    this.accumulator = 0
    this.lastTime = 0

    // Level progression
    this.currentLevel = 1
    this.levelStartTime = 0
    this.levelDuration = 30000  // 30 seconds for level 1 (in milliseconds)

    // Statistics
    this.explosionCount = 0
    this.biggestChain = 0

    // Screen shake
    this.screenShake = {
      intensity: 0,
      duration: 0,
      maxDuration: 0
    }

    // Floating text popups for combo feedback
    this.floatingTexts = []

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

    // Start level timer
    this.levelStartTime = Date.now()

    console.log('Game initialized!')
  }

  checkLevelComplete() {
    const elapsedTime = Date.now() - this.levelStartTime

    if (elapsedTime >= this.levelDuration) {
      this.advanceLevel()
    }
  }

  advanceLevel() {
    this.currentLevel++

    // Increase level duration: Level 1=30s, 2=40s, 3=50s, etc. (max 120s)
    this.levelDuration = Math.min(120000, 30000 + (this.currentLevel - 1) * 10000)

    // Decrease tick rate (faster game) by 10ms per level (min 100ms)
    this.tickRate = Math.max(100, INITIAL_TICK_RATE - (this.currentLevel - 1) * 10)

    // Reset level timer
    this.levelStartTime = Date.now()

    console.log(`🎉 LEVEL ${this.currentLevel}! Duration: ${this.levelDuration/1000}s, Tick rate: ${this.tickRate}ms`)

    // Spawn barriers only once at level 3
    if (this.currentLevel === 3) {
      this.spawnBarriers()
    }

    // Show level transition briefly
    this.showLevelTransition = true
    setTimeout(() => {
      this.showLevelTransition = false
    }, 2000)
  }

  spawnBarriers() {
    // Spawn 3-5 barrier clusters
    const clusterCount = Math.floor(Math.random() * 3) + 3  // 3 to 5 clusters

    for (let i = 0; i < clusterCount; i++) {
      // Random cluster position
      const centerX = Math.floor(Math.random() * GRID_WIDTH)
      const centerY = Math.floor(Math.random() * GRID_HEIGHT)

      // Cluster size: 1-3 barriers
      const clusterSize = Math.floor(Math.random() * 3) + 1

      // Spawn barriers in a small cluster
      for (let j = 0; j < clusterSize; j++) {
        const offsetX = Math.floor(Math.random() * 3) - 1  // -1, 0, or 1
        const offsetY = Math.floor(Math.random() * 3) - 1

        const barrierPos = this.grid.wrap(centerX + offsetX, centerY + offsetY)

        // Don't spawn on player
        if (barrierPos.x === this.player.position.x && barrierPos.y === this.player.position.y) {
          continue
        }

        // Check if position is empty
        const entitiesAt = this.entityManager.getEntitiesAt(barrierPos.x, barrierPos.y)
        if (entitiesAt.length === 0) {
          const barrier = new Barrier(barrierPos.x, barrierPos.y)
          this.entityManager.add(barrier)
        }
      }
    }

    console.log(`🧱 Spawned ${clusterCount} barrier clusters for level ${this.currentLevel}`)
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
    // Check for level completion
    this.checkLevelComplete()

    // Update screen shake
    this.updateScreenShake()

    // Update floating texts
    this.updateFloatingTexts()

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

  updateScreenShake() {
    if (this.screenShake.duration > 0) {
      this.screenShake.duration--

      // Decay intensity over time
      const progress = this.screenShake.duration / this.screenShake.maxDuration
      this.screenShake.intensity = this.screenShake.intensity * progress
    } else {
      this.screenShake.intensity = 0
    }
  }

  triggerScreenShake(intensity, duration) {
    // Stack shake effects (don't replace if already shaking)
    this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity)
    this.screenShake.duration = Math.max(this.screenShake.duration, duration)
    this.screenShake.maxDuration = Math.max(this.screenShake.maxDuration, duration)
  }

  addFloatingText(text, x, y, color = '#FFD700') {
    this.floatingTexts.push({
      text,
      x: x * TILE_SIZE + TILE_SIZE / 2,
      y: y * TILE_SIZE,
      color,
      alpha: 1.0,
      velocity: -2,  // Move upward
      life: 30  // Ticks to live
    })
  }

  updateFloatingTexts() {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const text = this.floatingTexts[i]
      text.life--
      text.y += text.velocity
      text.alpha = text.life / 30  // Fade out

      if (text.life <= 0) {
        this.floatingTexts.splice(i, 1)
      }
    }
  }

  renderFloatingTexts(ctx) {
    ctx.save()
    ctx.font = 'bold 20px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'

    for (const text of this.floatingTexts) {
      ctx.globalAlpha = text.alpha
      ctx.fillStyle = text.color
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 3

      // Outline for better visibility
      ctx.strokeText(text.text, text.x, text.y)
      ctx.fillText(text.text, text.x, text.y)
    }

    ctx.restore()
  }

  render() {
    // Clear canvas
    Renderer.clear(this.ctx, this.canvas.width, this.canvas.height)

    // Apply screen shake
    this.ctx.save()
    if (this.screenShake.intensity > 0) {
      const offsetX = (Math.random() - 0.5) * this.screenShake.intensity
      const offsetY = (Math.random() - 0.5) * this.screenShake.intensity
      this.ctx.translate(offsetX, offsetY)
    }

    // Draw grid (optional, for debugging)
    Renderer.drawGrid(this.ctx, this.grid, TILE_SIZE)

    // Render all entities
    this.entityManager.render(this.ctx, TILE_SIZE)

    // Render floating texts (affected by screen shake)
    this.renderFloatingTexts(this.ctx)

    // Restore before rendering HUD (HUD shouldn't shake)
    this.ctx.restore()

    // Render HUD
    this.hud.render(this.ctx, this.canvas, this)
  }

  gameOver() {
    if (this.state === 'gameover') return  // Already game over

    this.state = 'gameover'

    // Calculate final stats
    const survivalTime = Math.floor((Date.now() - this.hud.startTime) / 1000)

    // Save score
    const scoreData = {
      survivalTime,
      explosions: this.explosionCount,
      biggestChain: this.biggestChain,
      levelReached: this.currentLevel
    }

    this.saveSystem.saveScore(scoreData)

    // Check if it's a new high score
    const isHighScore = this.saveSystem.isNewHighScore(survivalTime)
    if (isHighScore) {
      console.log('🎉 NEW HIGH SCORE!')
    }
  }

  reset() {
    // Clear all entities
    this.entityManager.clear()

    // Reset statistics
    this.explosionCount = 0
    this.biggestChain = 0

    // Reset level
    this.currentLevel = 1
    this.levelDuration = 30000
    this.tickRate = INITIAL_TICK_RATE

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
