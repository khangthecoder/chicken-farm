export class Grid {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.cells = new Array(width * height).fill(null).map(() => [])
  }

  // Toroidal wraparound - entities exiting one edge appear on the opposite edge
  wrap(x, y) {
    const wrappedX = ((x % this.width) + this.width) % this.width
    const wrappedY = ((y % this.height) + this.height) % this.height
    return { x: wrappedX, y: wrappedY }
  }

  // Convert 2D coordinates to 1D array index
  getIndex(x, y) {
    const wrapped = this.wrap(x, y)
    return wrapped.y * this.width + wrapped.x
  }

  // Get all entities at a position
  getCell(x, y) {
    const index = this.getIndex(x, y)
    return this.cells[index] || []
  }

  // Add an entity to a cell
  addToCell(x, y, entity) {
    const index = this.getIndex(x, y)
    if (!this.cells[index].includes(entity)) {
      this.cells[index].push(entity)
    }
  }

  // Remove an entity from a cell
  removeFromCell(x, y, entity) {
    const index = this.getIndex(x, y)
    this.cells[index] = this.cells[index].filter(e => e !== entity)
  }

  // Check if a cell is empty
  isEmpty(x, y) {
    return this.getCell(x, y).length === 0
  }

  // Clear all cells
  clear() {
    this.cells = new Array(this.width * this.height).fill(null).map(() => [])
  }
}
