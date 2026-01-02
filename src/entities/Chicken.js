import { Entity } from './Entity.js'
import { Vector2 } from '../utils/Vector2.js'

export class Chicken extends Entity {
  constructor(x, y, direction) {
    super(x, y, 'chicken')
    this.direction = direction  // 'north', 'south', 'east', 'west'
    this.isStationary = false
  }

  update(deltaTime, game) {
    if (this.isStationary) {
      return  // Don't move if stopped at barrier
    }

    const directionVector = this.getDirectionVector()
    this.move(directionVector, game.grid)
  }

  getDirectionVector() {
    const directions = {
      'north': { x: 0, y: -1 },
      'south': { x: 0, y: 1 },
      'east': { x: 1, y: 0 },
      'west': { x: -1, y: 0 }
    }
    return new Vector2(
      directions[this.direction].x,
      directions[this.direction].y
    )
  }

  move(direction, grid) {
    const newPos = grid.wrap(
      this.position.x + direction.x,
      this.position.y + direction.y
    )
    this.position.x = newPos.x
    this.position.y = newPos.y
  }

  render(ctx, tileSize) {
    const x = this.position.x * tileSize + tileSize / 2
    const y = this.position.y * tileSize + tileSize / 2
    const radius = tileSize / 3

    // Draw yellow circle
    ctx.fillStyle = '#FFFF00'
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()

    // Draw direction indicator (small line)
    const dir = this.getDirectionVector()
    ctx.strokeStyle = '#FF8800'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + dir.x * radius, y + dir.y * radius)
    ctx.stroke()
  }
}
