import { Entity } from './Entity.js'
import { EXPLOSION_TIMERS, TILE_SIZE } from '../utils/Constants.js'

export class Explosion extends Entity {
  constructor(x, y, chainLength = 1) {
    super(x, y, 'explosion')
    this.chainLength = chainLength
    this.phase = 'expand'  // 'expand', 'fade', 'done'
    this.timer = 0
    this.maxTimer = this.getMaxTimer()
    this.radius = 0
    this.maxRadius = this.getMaxRadius()
  }

  getMaxTimer() {
    // Based on chain length (from spec)
    if (this.chainLength === 1) return EXPLOSION_TIMERS.SINGLE
    if (this.chainLength <= 3) return EXPLOSION_TIMERS.CHAIN_SMALL
    return EXPLOSION_TIMERS.CHAIN_LARGE
  }

  getMaxRadius() {
    return TILE_SIZE / 2 + (this.chainLength * 2)
  }

  update(deltaTime, game) {
    this.timer++

    // Expand phase (first 1-2 ticks)
    if (this.timer < Math.ceil(this.maxTimer / 3)) {
      this.phase = 'expand'
      this.radius = (this.timer / (this.maxTimer / 3)) * this.maxRadius
    }
    // Fade phase
    else if (this.timer < this.maxTimer) {
      this.phase = 'fade'
    }
    // Done
    else {
      this.destroy()
    }
  }

  render(ctx, tileSize) {
    const x = this.position.x * tileSize + tileSize / 2
    const y = this.position.y * tileSize + tileSize / 2

    // Color based on phase and chain
    let alpha = 1.0
    if (this.phase === 'fade') {
      alpha = 1.0 - ((this.timer - (this.maxTimer / 3)) / (this.maxTimer * 2 / 3))
    }

    // Outer circle (orange)
    ctx.fillStyle = `rgba(255, 160, 122, ${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, this.radius, 0, Math.PI * 2)
    ctx.fill()

    // Inner circle (red/pink)
    ctx.fillStyle = `rgba(255, 182, 193, ${alpha * 0.8})`
    ctx.beginPath()
    ctx.arc(x, y, this.radius * 0.6, 0, Math.PI * 2)
    ctx.fill()
  }

  isDeadly() {
    // Explosion is deadly during expand and fade phases
    return this.phase === 'expand' || this.phase === 'fade'
  }
}
