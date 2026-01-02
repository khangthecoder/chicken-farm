import { Game } from './game/Game.js'

// Wait for DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas')

  if (!canvas) {
    console.error('Canvas element not found!')
    return
  }

  // Create and start the game
  const game = new Game(canvas)
  game.start()

  console.log('Chicken Chaos started!')
  console.log('Controls: WASD or Arrow keys to move')
  console.log('Press R to restart after game over')
})
