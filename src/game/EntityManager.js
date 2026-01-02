export class EntityManager {
  constructor(grid) {
    this.grid = grid
    this.entities = []
  }

  add(entity) {
    if (!this.entities.includes(entity)) {
      this.entities.push(entity)
      this.grid.addToCell(entity.position.x, entity.position.y, entity)
    }
  }

  remove(entity) {
    const index = this.entities.indexOf(entity)
    if (index > -1) {
      this.entities.splice(index, 1)
      this.grid.removeFromCell(entity.position.x, entity.position.y, entity)
      entity.destroy()
    }
  }

  update(deltaTime, game) {
    // Update all active entities
    for (const entity of this.entities) {
      if (entity.active) {
        // Store old position
        const oldPos = entity.position.clone()

        // Update entity
        entity.update(deltaTime, game)

        // Update grid if position changed
        if (!oldPos.equals(entity.position)) {
          this.grid.removeFromCell(oldPos.x, oldPos.y, entity)
          this.grid.addToCell(entity.position.x, entity.position.y, entity)
        }
      }
    }

    // Remove inactive entities
    this.entities = this.entities.filter(entity => {
      if (!entity.active) {
        this.grid.removeFromCell(entity.position.x, entity.position.y, entity)
        return false
      }
      return true
    })
  }

  render(ctx, tileSize) {
    for (const entity of this.entities) {
      if (entity.active) {
        entity.render(ctx, tileSize)
      }
    }
  }

  getEntitiesAt(x, y) {
    return this.grid.getCell(x, y)
  }

  getEntitiesByType(type) {
    return this.entities.filter(e => e.type === type && e.active)
  }

  clear() {
    this.entities = []
    this.grid.clear()
  }
}
