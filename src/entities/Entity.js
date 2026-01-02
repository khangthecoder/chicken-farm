import { Vector2 } from '../utils/Vector2.js'

export class Entity {
  constructor(x, y, type) {
    this.id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.position = new Vector2(x, y)
    this.type = type
    this.active = true
  }

  update(deltaTime, game) {
    // Override in subclasses
  }

  render(ctx, tileSize) {
    // Override in subclasses
  }

  destroy() {
    this.active = false
  }
}
