import { Entity } from './Entity.js'

export class Barrier extends Entity {
  constructor(x, y) {
    super(x, y, 'barrier')
  }

  update(deltaTime, game) {
    // Barriers don't move or update
  }

  render(ctx, tileSize) {
    const x = this.position.x * tileSize
    const y = this.position.y * tileSize

    // Draw gray stone barrier
    ctx.fillStyle = '#888888'
    ctx.fillRect(x, y, tileSize, tileSize)

    // Add some texture
    ctx.fillStyle = '#666666'
    ctx.fillRect(x + 2, y + 2, tileSize - 4, 4)
    ctx.fillRect(x + 2, y + tileSize - 6, tileSize - 4, 4)

    // Border
    ctx.strokeStyle = '#444444'
    ctx.lineWidth = 2
    ctx.strokeRect(x, y, tileSize, tileSize)
  }
}
