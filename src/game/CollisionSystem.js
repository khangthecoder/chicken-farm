import { Vector2 } from '../utils/Vector2.js'
import { Explosion } from '../entities/Explosion.js'
import { CHAIN_REACTION_DELAY } from '../utils/Constants.js'

export class CollisionSystem {
  checkCollisions(entityManager, grid) {
    const collisions = []

    // Check all grid cells for multiple chickens
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const entities = entityManager.getEntitiesAt(x, y)
        const chickens = entities.filter(e => e.type === 'chicken')

        // Chicken-to-chicken collision
        if (chickens.length >= 2) {
          collisions.push({
            type: 'chicken-collision',
            position: new Vector2(x, y),
            entities: chickens
          })
        }

        // Player-to-explosion collision
        const player = entities.find(e => e.type === 'player')
        const explosion = entities.find(e => e.type === 'explosion' && e.isDeadly())
        if (player && explosion) {
          collisions.push({
            type: 'player-explosion',
            position: new Vector2(x, y),
            entities: [player, explosion]
          })
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

        // Track for statistics
        game.explosionCount = (game.explosionCount || 0) + 1
      }
      else if (collision.type === 'player-explosion') {
        const player = collision.entities[0]
        if (player.takeDamage()) {
          console.log(`Player hit! Health: ${player.health}`)

          if (player.health <= 0) {
            game.state = 'gameover'
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
      for (const chicken of chainedChickens) {
        entityManager.remove(chicken)

        const chainExplosion = new Explosion(
          chicken.position.x,
          chicken.position.y,
          chainLength + 1
        )
        entityManager.add(chainExplosion)
        game.explosionCount = (game.explosionCount || 0) + 1

        // Recursive chain reaction
        setTimeout(() => {
          this.checkChainReaction(chainExplosion, entityManager, game, chainLength + 1)
        }, CHAIN_REACTION_DELAY)
      }

      game.biggestChain = Math.max(game.biggestChain || 0, chainLength + 1)
    }
  }
}
