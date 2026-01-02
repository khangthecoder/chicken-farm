export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  add(other) {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  subtract(other) {
    return new Vector2(this.x - other.x, this.y - other.y)
  }

  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  equals(other) {
    return this.x === other.x && this.y === other.y
  }

  clone() {
    return new Vector2(this.x, this.y)
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    const len = this.length()
    if (len === 0) return new Vector2(0, 0)
    return new Vector2(this.x / len, this.y / len)
  }

  static distance(a, b) {
    const dx = b.x - a.x
    const dy = b.y - a.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  static zero() {
    return new Vector2(0, 0)
  }
}
