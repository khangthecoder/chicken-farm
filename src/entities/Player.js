import { Entity } from './Entity.js'
import { PLAYER_LIVES, INVULNERABILITY_TICKS } from '../utils/Constants.js'

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, 'player')
    this.health = PLAYER_LIVES
    this.invulnerable = 0  // Invulnerability ticks
  }

  update(deltaTime, game) {
    if (this.invulnerable > 0) {
      this.invulnerable--
    }

    // Get input from InputSystem
    const direction = game.inputSystem.getMovementDirection()

    if (direction.x !== 0 || direction.y !== 0) {
      this.move(direction, game.grid)
    }
  }

  move(direction, grid) {
    // Calculate new position with wraparound
    const newPos = grid.wrap(
      this.position.x + direction.x,
      this.position.y + direction.y
    )

    // Update position
    this.position.x = newPos.x
    this.position.y = newPos.y
  }

  takeDamage() {
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

    // Draw blue square
    ctx.fillStyle = '#4444FF'
    ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4)
  }
}
