import { Chicken } from '../entities/Chicken.js'
import { Vector2 } from '../utils/Vector2.js'
import {
  SPAWN_DISTANCE_FROM_PLAYER,
  INITIAL_SPAWN_PERCENTAGE,
  SPAWN_PROBABILITY
} from '../utils/Constants.js'

export class SpawnSystem {
  constructor() {
    this.spawnProbability = 0.6  // Base probability
  }

  initialSpawn(entityManager, grid, player) {
    const totalTiles = grid.width * grid.height
    const spawnCount = Math.floor(totalTiles * INITIAL_SPAWN_PERCENTAGE)

    for (let i = 0; i < spawnCount; i++) {
      const pos = this.findSafeSpawnLocation(grid, player, entityManager)
      if (pos) {
        const direction = this.randomDirection()
        const chicken = new Chicken(pos.x, pos.y, direction)
        entityManager.add(chicken)
      }
    }
  }

  onExplosion(entityManager, grid, player) {
    // Random number of chickens to spawn (50%, 35%, 15% distribution)
    const rand = Math.random()
    let spawnCount
    if (rand < SPAWN_PROBABILITY.ONE_CHICKEN) spawnCount = 1
    else if (rand < SPAWN_PROBABILITY.TWO_CHICKENS) spawnCount = 2
    else spawnCount = 3

    for (let i = 0; i < spawnCount; i++) {
      const pos = this.findSafeSpawnLocation(grid, player, entityManager)
      if (pos) {
        const direction = this.randomDirection()
        const chicken = new Chicken(pos.x, pos.y, direction)
        entityManager.add(chicken)
      }
    }
  }

  findSafeSpawnLocation(grid, player, entityManager) {
    const minDistance = SPAWN_DISTANCE_FROM_PLAYER
    const maxAttempts = 20

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Math.floor(Math.random() * grid.width)
      const y = Math.floor(Math.random() * grid.height)

      // Check distance from player
      const dx = Math.abs(x - player.position.x)
      const dy = Math.abs(y - player.position.y)
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < minDistance) {
        continue
      }

      // Check if tile is empty
      const entities = entityManager.getEntitiesAt(x, y)
      if (entities.length === 0) {
        return new Vector2(x, y)
      }
    }

    return null  // Failed to find safe location
  }

  randomDirection() {
    const directions = ['north', 'south', 'east', 'west']
    return directions[Math.floor(Math.random() * directions.length)]
  }
}
