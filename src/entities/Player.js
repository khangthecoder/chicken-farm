import { Entity } from './Entity.js'
import { PLAYER_LIVES, INVULNERABILITY_TICKS } from '../utils/Constants.js'

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, 'player')
    this.health = PLAYER_LIVES
    this.invulnerable = 0  // Invulnerability ticks
    this.activePowerups = []  // Array of active powerups {type, duration}
  }

  update(deltaTime, game) {
    if (this.invulnerable > 0) {
      this.invulnerable--
    }

    // Update powerups
    this.updatePowerups()

    // Check for item collection
    this.collectItems(game)

    // Get input from InputSystem
    const direction = game.inputSystem.getMovementDirection()

    if (direction.x !== 0 || direction.y !== 0) {
      this.move(direction, game)
    }
  }

  updatePowerups() {
    // Decrease duration of active powerups
    this.activePowerups = this.activePowerups.filter(powerup => {
      powerup.duration--
      return powerup.duration > 0
    })
  }

  collectItems(game) {
    const items = game.entityManager.getEntitiesAt(this.position.x, this.position.y)
      .filter(e => e.type === 'item')

    for (const item of items) {
      this.addPowerup(item.itemType, item.duration)
      game.entityManager.remove(item)
      console.log(`✨ Collected ${item.itemType} powerup!`)
    }
  }

  addPowerup(type, duration) {
    // Remove existing powerup of same type
    this.activePowerups = this.activePowerups.filter(p => p.type !== type)

    // Add new powerup
    this.activePowerups.push({ type, duration })
  }

  hasPowerup(type) {
    return this.activePowerups.some(p => p.type === type)
  }

  move(direction, game) {
    // Base speed is 1, with speed boost it's 2
    const moveSpeed = this.hasPowerup('speed') ? 2 : 1

    // Calculate new position with wraparound
    const newPos = game.grid.wrap(
      this.position.x + (direction.x * moveSpeed),
      this.position.y + (direction.y * moveSpeed)
    )

    // Check if target position has any chickens or barriers
    const entitiesAtTarget = game.entityManager.getEntitiesAt(newPos.x, newPos.y)
    const hasChicken = entitiesAtTarget.some(e => e.type === 'chicken')
    const hasBarrier = entitiesAtTarget.some(e => e.type === 'barrier')

    // Only move if there's no chicken or barrier blocking the way
    if (!hasChicken && !hasBarrier) {
      this.position.x = newPos.x
      this.position.y = newPos.y
    }
    // If blocked, try moving just 1 tile instead
    else {
      const fallbackPos = game.grid.wrap(
        this.position.x + direction.x,
        this.position.y + direction.y
      )
      const fallbackEntities = game.entityManager.getEntitiesAt(fallbackPos.x, fallbackPos.y)
      const fallbackHasChicken = fallbackEntities.some(e => e.type === 'chicken')
      const fallbackHasBarrier = fallbackEntities.some(e => e.type === 'barrier')

      if (!fallbackHasChicken && !fallbackHasBarrier) {
        this.position.x = fallbackPos.x
        this.position.y = fallbackPos.y
      }
    }
  }

  takeDamage() {
    // Shield powerup blocks all damage
    if (this.hasPowerup('shield')) {
      console.log('🛡️ Damage blocked by shield!')
      return false
    }

    if (this.invulnerable === 0) {
      this.health--
      this.invulnerable = INVULNERABILITY_TICKS
      return true  // Damage was taken
    }
    return false  // Damage was blocked by invulnerability
  }

  render(ctx, tileSize) {
    const x = this.position.x * tileSize
    const y = this.position.y * tileSize

    // Flash when invulnerable
    if (this.invulnerable > 0 && this.invulnerable % 2 === 0) {
      return
    }

    // Draw powerup effects
    if (this.hasPowerup('shield')) {
      // Green shield bubble
      ctx.strokeStyle = '#00FF00'
      ctx.lineWidth = 3
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)'
      ctx.beginPath()
      ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize / 2 + 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    if (this.hasPowerup('speed')) {
      // Speed lines
      ctx.strokeStyle = '#00BFFF'
      ctx.lineWidth = 2
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(x - 5 - i * 3, y + 5 + i * 5)
        ctx.lineTo(x - 2 - i * 3, y + 5 + i * 5)
        ctx.stroke()
      }
    }

    // Draw blue square
    ctx.fillStyle = '#4444FF'
    ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4)
  }
}
