export class Renderer {
  static clear(ctx, width, height) {
    ctx.fillStyle = '#2a2a2a'
    ctx.fillRect(0, 0, width, height)
  }

  static drawGrid(ctx, grid, tileSize) {
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 0.5

    // Draw vertical lines
    for (let x = 0; x <= grid.width; x++) {
      ctx.beginPath()
      ctx.moveTo(x * tileSize, 0)
      ctx.lineTo(x * tileSize, grid.height * tileSize)
      ctx.stroke()
    }

    // Draw horizontal lines
    for (let y = 0; y <= grid.height; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * tileSize)
      ctx.lineTo(grid.width * tileSize, y * tileSize)
      ctx.stroke()
    }
  }
}
