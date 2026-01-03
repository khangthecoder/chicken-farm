import { Vector2 } from '../utils/Vector2.js'
import { Explosion } from '../entities/Explosion.js'
import { Item } from '../entities/Item.js'
import { CHAIN_REACTION_DELAY } from '../utils/Constants.js'

export class CollisionSystem {
  checkCollisions(entityManager, grid) {
    const collisions = []
    const collidedChickens = new Set() // Track chickens already in collisions


    // Check all grid cells for multiple chickens on same tile
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const entities = entityManager.getEntitiesAt(x, y)
        const chickens = entities.filter(e => e.type === 'chicken' && !collidedChickens.has(e))

        // Chicken-to-chicken collision (same tile)
        if (chickens.length >= 2) {
          chickens.forEach(c => collidedChickens.add(c))
          collisions.push({
            type: 'chicken-collision',
            position: new Vector2(x, y),
            entities: chickens
          })
        }
      }
    }

    // Check for nearby chickens (within 2 tiles) - catch chickens that are close
    const allChickens = entityManager.getEntitiesByType('chicken').filter(c => !collidedChickens.has(c))
    for (let i = 0; i < allChickens.length; i++) {
      for (let j = i + 1; j < allChickens.length; j++) {
        const c1 = allChickens[i]
        const c2 = allChickens[j]

        // Calculate Manhattan distance
        const dx = Math.abs(c2.position.x - c1.position.x)
        const dy = Math.abs(c2.position.y - c1.position.y)
        const distance = dx + dy

        // If chickens are close (within 2 tiles), make them explode
        if (distance <= 2) {
          collidedChickens.add(c1)
          collidedChickens.add(c2)
          collisions.push({
            type: 'chicken-collision',
            position: new Vector2(c1.position.x, c1.position.y),
            entities: [c1, c2]
          })
        }
      }
    }

    // Check for player-explosion collisions (3x3 area around explosions)
    const player = entityManager.getEntitiesByType('player')[0]
    if (player) {
      const explosions = entityManager.getEntitiesByType('explosion')
      for (const explosion of explosions) {
        if (!explosion.isDeadly()) continue

        // Check 3x3 area around explosion
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const checkPos = grid.wrap(
              explosion.position.x + dx,
              explosion.position.y + dy
            )

            // If player is in this position, they take damage
            if (player.position.x === checkPos.x && player.position.y === checkPos.y) {
              collisions.push({
                type: 'player-explosion',
                position: new Vector2(checkPos.x, checkPos.y),
                entities: [player, explosion]
              })
              break // Only add one collision per explosion
            }
          }
        }
      }
    }

    return collisions
  }

  handleCollisions(collisions, entityManager, game) {
    const newExplosions = []

    for (const collision of collisions) {
      if (collision.type === 'chicken-collision') {
        // Remove all colliding chickens
        for (const chicken of collision.entities) {
          entityManager.remove(chicken)
        }

        // Create explosion
        const explosion = new Explosion(collision.position.x, collision.position.y, 1)
        newExplosions.push(explosion)

        // Trigger screen shake (reduced intensity)
        game.triggerScreenShake(1.5, 3)

        // Spawn item with reduced chance
        const itemSpawnChance = Math.random()
        if (itemSpawnChance < 0.1) {  // 10% chance to spawn item
          const itemType = Math.random() < 0.6 ? 'speed' : 'shield'  // 60% speed, 40% shield
          const item = new Item(collision.position.x, collision.position.y, itemType)

          // Scatter in random direction
          const directions = [
            new Vector2(1, 0), new Vector2(-1, 0),
            new Vector2(0, 1), new Vector2(0, -1),
            new Vector2(1, 1), new Vector2(-1, -1),
            new Vector2(1, -1), new Vector2(-1, 1)
          ]
          const randomDir = directions[Math.floor(Math.random() * directions.length)]
          item.scatter(randomDir)

          entityManager.add(item)
        }

        // Track for statistics
        game.explosionCount = (game.explosionCount || 0) + 1
      }
      else if (collision.type === 'player-explosion') {
        const player = collision.entities[0]
        if (player.takeDamage()) {
          if (player.health <= 0) {
            game.gameOver()
          }
        }
      }
    }

    // Add new explosions and check for chain reactions
    for (const explosion of newExplosions) {
      entityManager.add(explosion)

      // Check for chain reactions after a small delay
      setTimeout(() => {
        this.checkChainReaction(explosion, entityManager, game)
      }, CHAIN_REACTION_DELAY)
    }
  }

  checkChainReaction(explosion, entityManager, game, chainLength = 1) {
    // Check 3x3 area around explosion
    const checkPositions = [
      { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
      { x: -1, y: 0 },  { x: 0, y: 0 },  { x: 1, y: 0 },
      { x: -1, y: 1 },  { x: 0, y: 1 },  { x: 1, y: 1 }
    ]

    const chainedChickens = []
    for (const offset of checkPositions) {
      const checkPos = game.grid.wrap(
        explosion.position.x + offset.x,
        explosion.position.y + offset.y
      )

      const entities = entityManager.getEntitiesAt(checkPos.x, checkPos.y)
      const chickens = entities.filter(e => e.type === 'chicken')

      for (const chicken of chickens) {
        if (!chainedChickens.includes(chicken)) {
          chainedChickens.push(chicken)
        }
      }
    }

    // Trigger chain explosions
    if (chainedChickens.length > 0) {
      // Show combo text at the first chained chicken position
      const firstChicken = chainedChickens[0]
      const comboText = `x${chainLength + 1} COMBO!`
      const comboColor = this.getComboColor(chainLength + 1)
      game.addFloatingText(comboText, firstChicken.position.x, firstChicken.position.y, comboColor)

      for (const chicken of chainedChickens) {
        entityManager.remove(chicken)

        const chainExplosion = new Explosion(
          chicken.position.x,
          chicken.position.y,
          chainLength + 1
        )
        entityManager.add(chainExplosion)
        game.explosionCount = (game.explosionCount || 0) + 1

        // Trigger screen shake (intensity increases with chain length, but capped)
        const shakeIntensity = 1.5 + (chainLength * 0.5)  // 2, 2.5, 3, 3.5, etc.
        const shakeDuration = 3 + Math.min(chainLength, 2)  // Max 5 ticks
        game.triggerScreenShake(shakeIntensity, shakeDuration)

        // Recursive chain reaction
        setTimeout(() => {
          this.checkChainReaction(chainExplosion, entityManager, game, chainLength + 1)
        }, CHAIN_REACTION_DELAY)
      }

      game.biggestChain = Math.max(game.biggestChain || 0, chainLength + 1)
    }
  }

  getComboColor(chainLength) {
    // Color changes based on chain length
    if (chainLength >= 5) return '#FF00FF'  // Magenta for huge combos
    if (chainLength >= 4) return '#FF0000'  // Red for big combos
    if (chainLength >= 3) return '#FF8C00'  // Orange for good combos
    return '#FFD700'  // Gold for regular combos
  }
}
