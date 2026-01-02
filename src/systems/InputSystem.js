import { Vector2 } from '../utils/Vector2.js'

export class InputSystem {
  constructor() {
    this.keys = new Map()
    this.setupListeners()
  }

  setupListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys.set(e.key.toLowerCase(), true)

      // Prevent default for game keys
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'r'].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    })

    window.addEventListener('keyup', (e) => {
      this.keys.set(e.key.toLowerCase(), false)
    })
  }

  isKeyPressed(key) {
    return this.keys.get(key.toLowerCase()) === true
  }

  getMovementDirection() {
    let x = 0
    let y = 0

    // Horizontal movement
    if (this.isKeyPressed('a') || this.isKeyPressed('arrowleft')) {
      x -= 1
    }
    if (this.isKeyPressed('d') || this.isKeyPressed('arrowright')) {
      x += 1
    }

    // Vertical movement
    if (this.isKeyPressed('w') || this.isKeyPressed('arrowup')) {
      y -= 1
    }
    if (this.isKeyPressed('s') || this.isKeyPressed('arrowdown')) {
      y += 1
    }

    // Return normalized direction for 8-directional movement
    return new Vector2(x, y)
  }
}
