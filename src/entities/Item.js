import { Entity } from './Entity.js'
import { Vector2 } from '../utils/Vector2.js'

export class Item extends Entity {
  constructor(x, y, itemType) {
    super(x, y, 'item')
    this.itemType = itemType  // 'speed' or 'shield'
    this.duration = Math.floor(Math.random() * 11) + 20  // 20-30 steps (when collected)
    this.scatterVelocity = null  // For scatter animation
    this.scatterSteps = 0
    this.lifetime = 25  // 5 seconds at 200ms tick rate (will fade away after this)
  }

  // Start scatter animation away from explosion
  scatter(direction) {
    // Scatter 2-4 tiles away from explosion
    const distance = Math.floor(Math.random() * 3) + 2
    this.scatterVelocity = new Vector2(direction.x * distance, direction.y * distance)
    this.scatterSteps = 3  // Takes 3 ticks to scatter
  }

  update(deltaTime, game) {
    // Handle scatter animation
    if (this.scatterSteps > 0 && this.scatterVelocity) {
      const moveX = Math.floor(this.scatterVelocity.x / this.scatterSteps)
      const moveY = Math.floor(this.scatterVelocity.y / this.scatterSteps)

      const newPos = game.grid.wrap(
        this.position.x + moveX,
        this.position.y + moveY
      )

      this.position.x = newPos.x
      this.position.y = newPos.y

      this.scatterSteps--
      if (this.scatterSteps === 0) {
        this.scatterVelocity = null
      }
    }

    // Decrease lifetime and despawn after 5 seconds
    this.lifetime--
    if (this.lifetime <= 0) {
      this.destroy()
    }
  }

  render(ctx, tileSize) {
    const x = this.position.x * tileSize + tileSize / 2
    const y = this.position.y * tileSize + tileSize / 2

    // Pulse animation
    const pulseScale = 1 + Math.sin(Date.now() / 200) * 0.2

    // Fade out in the last second (5 ticks)
    let alpha = 1.0
    if (this.lifetime <= 5) {
      alpha = this.lifetime / 5
    }

    ctx.save()
    ctx.globalAlpha = alpha

    if (this.itemType === 'speed') {
      // Blue lightning bolt (speed boost)
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(pulseScale, pulseScale)

      ctx.fillStyle = '#00BFFF'
      ctx.strokeStyle = '#0080FF'
      ctx.lineWidth = 2

      // Draw lightning bolt shape
      ctx.beginPath()
      ctx.moveTo(-4, -8)
      ctx.lineTo(2, -2)
      ctx.lineTo(-1, -2)
      ctx.lineTo(4, 8)
      ctx.lineTo(-2, 2)
      ctx.lineTo(1, 2)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.restore()
    } else if (this.itemType === 'shield') {
      // Green shield/bubble
      ctx.save()
      ctx.translate(x, y)
      ctx.scale(pulseScale, pulseScale)

      ctx.strokeStyle = '#00FF00'
      ctx.lineWidth = 3
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'

      ctx.beginPath()
      ctx.arc(0, 0, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      ctx.restore()
    }

    ctx.restore() // Restore globalAlpha
  }
}
