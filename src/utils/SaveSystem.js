export class SaveSystem {
  constructor() {
    this.storageKey = 'chicken-chaos-highscores'
  }

  saveScore(scoreData) {
    // Get existing scores
    const scores = this.getHighScores()

    // Add new score with timestamp
    scores.push({
      ...scoreData,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString()
    })

    // Sort by survival time (descending)
    scores.sort((a, b) => b.survivalTime - a.survivalTime)

    // Keep only top 10
    const top10 = scores.slice(0, 10)

    // Save to localStorage
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(top10))
      console.log('💾 Score saved successfully!')
      return true
    } catch (error) {
      console.error('Failed to save score:', error)
      return false
    }
  }

  getHighScores() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to load high scores:', error)
      return []
    }
  }

  getBestScore() {
    const scores = this.getHighScores()
    return scores.length > 0 ? scores[0] : null
  }

  isNewHighScore(survivalTime) {
    const scores = this.getHighScores()

    // If less than 10 scores, it's always a high score
    if (scores.length < 10) return true

    // Check if better than worst score
    return survivalTime > scores[scores.length - 1].survivalTime
  }

  clearScores() {
    try {
      localStorage.removeItem(this.storageKey)
      console.log('🗑️ All scores cleared!')
      return true
    } catch (error) {
      console.error('Failed to clear scores:', error)
      return false
    }
  }
}
