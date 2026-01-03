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

    // Top right: Level
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'right'
    ctx.fillText(`Level ${game.currentLevel || 1}`, canvas.width - 10, 10)

    // Top center: Active powerups
    ctx.textAlign = 'center'
    let powerupY = 10
    for (const powerup of player.activePowerups) {
      const icon = powerup.type === 'speed' ? '⚡' : '🛡️'
      const color = powerup.type === 'speed' ? '#00BFFF' : '#00FF00'

      // Flash when almost expired
      if (powerup.duration <= 2) {
        if (Math.floor(Date.now() / 200) % 2 === 0) continue
      }

      ctx.fillStyle = color
      ctx.fillText(`${icon} ${powerup.duration}`, canvas.width / 2, powerupY)
      powerupY += 20
    }

    // Bottom left: Explosions
    ctx.textAlign = 'left'
    ctx.fillText(`Explosions: ${game.explosionCount || 0}`, 10, canvas.height - 60)

    // Bottom left: Biggest chain
    ctx.fillText(`Best Chain: x${game.biggestChain || 0}`, 10, canvas.height - 40)

    // Bottom left: Time
    const survivalTime = Math.floor((Date.now() - this.startTime) / 1000)
    ctx.fillText(`Time: ${this.formatTime(survivalTime)}`, 10, canvas.height - 20)

    // Bottom right: Level progress bar
    const levelElapsed = Date.now() - game.levelStartTime
    const levelProgress = Math.min(1, levelElapsed / game.levelDuration)
    const barWidth = 100
    const barHeight = 10
    const barX = canvas.width - barWidth - 10
    const barY = canvas.height - 20

    ctx.fillStyle = '#333'
    ctx.fillRect(barX, barY, barWidth, barHeight)
    ctx.fillStyle = '#00FF00'
    ctx.fillRect(barX, barY, barWidth * levelProgress, barHeight)
    ctx.strokeStyle = '#FFF'
    ctx.lineWidth = 1
    ctx.strokeRect(barX, barY, barWidth, barHeight)

    // Center: Level transition
    if (game.showLevelTransition) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#FFD700'
      ctx.font = '48px monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`LEVEL ${game.currentLevel}`, canvas.width / 2, canvas.height / 2)
    }

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
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 100)

    // Stats
    ctx.font = '20px monospace'
    const survivalTime = Math.floor((Date.now() - this.startTime) / 1000)

    // Check if new high score
    const isHighScore = game.saveSystem.isNewHighScore(survivalTime)
    if (isHighScore && survivalTime > 0) {
      ctx.fillStyle = '#FFD700'
      ctx.font = 'bold 24px monospace'
      ctx.fillText('🏆 NEW HIGH SCORE! 🏆', canvas.width / 2, canvas.height / 2 - 60)
      ctx.font = '20px monospace'
      ctx.fillStyle = '#FFFFFF'
    }

    ctx.fillText(`Survival Time: ${this.formatTime(survivalTime)}`, canvas.width / 2, canvas.height / 2 - 20)
    ctx.fillText(`Level Reached: ${game.currentLevel}`, canvas.width / 2, canvas.height / 2 + 5)
    ctx.fillText(`Explosions: ${game.explosionCount || 0}`, canvas.width / 2, canvas.height / 2 + 30)
    ctx.fillText(`Best Chain: x${game.biggestChain || 0}`, canvas.width / 2, canvas.height / 2 + 55)

    // Best score
    const bestScore = game.saveSystem.getBestScore()
    if (bestScore) {
      ctx.font = '16px monospace'
      ctx.fillStyle = '#AAAAAA'
      ctx.fillText(`Best Time: ${this.formatTime(bestScore.survivalTime)}`, canvas.width / 2, canvas.height / 2 + 90)
    }

    // Restart instruction
    ctx.font = '16px monospace'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText('Press R to restart', canvas.width / 2, canvas.height / 2 + 120)
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
