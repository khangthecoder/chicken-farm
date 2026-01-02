export class HUD {
  constructor() {
    this.startTime = Date.now()
  }

  render(ctx, canvas, game) {
    const player = game.entityManager.getEntitiesByType('player')[0]
    if (!player) return

    ctx.save()

    // Set font
    ctx.font = '16px monospace'
    ctx.textBaseline = 'top'

    // Top left: Lives
    this.renderLives(ctx, player.health, 10, 10)

    // Top right: Level (placeholder for now)
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'right'
    ctx.fillText(`Level 1`, canvas.width - 10, 10)

    // Bottom left: Explosions
    ctx.textAlign = 'left'
    ctx.fillText(`Explosions: ${game.explosionCount || 0}`, 10, canvas.height - 60)

    // Bottom left: Biggest chain
    ctx.fillText(`Best Chain: x${game.biggestChain || 0}`, 10, canvas.height - 40)

    // Bottom left: Time
    const survivalTime = Math.floor((Date.now() - this.startTime) / 1000)
    ctx.fillText(`Time: ${this.formatTime(survivalTime)}`, 10, canvas.height - 20)

    // Center: Game Over message
    if (game.state === 'gameover') {
      this.renderGameOver(ctx, canvas, game)
    }

    ctx.restore()
  }

  renderLives(ctx, health, x, y) {
    ctx.fillStyle = '#FF0000'
    for (let i = 0; i < 3; i++) {
      if (i < health) {
        // Filled heart (filled circle for now)
        ctx.beginPath()
        ctx.arc(x + i * 25 + 10, y + 10, 8, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Empty heart (outline circle)
        ctx.strokeStyle = '#FF0000'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(x + i * 25 + 10, y + 10, 8, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
  }

  renderGameOver(ctx, canvas, game) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Game Over text
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '48px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 60)

    // Stats
    ctx.font = '20px monospace'
    const survivalTime = Math.floor((Date.now() - this.startTime) / 1000)
    ctx.fillText(`Survival Time: ${this.formatTime(survivalTime)}`, canvas.width / 2, canvas.height / 2 - 10)
    ctx.fillText(`Explosions: ${game.explosionCount || 0}`, canvas.width / 2, canvas.height / 2 + 20)
    ctx.fillText(`Best Chain: x${game.biggestChain || 0}`, canvas.width / 2, canvas.height / 2 + 50)

    // Restart instruction
    ctx.font = '16px monospace'
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 100)
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  reset() {
    this.startTime = Date.now()
  }
}
