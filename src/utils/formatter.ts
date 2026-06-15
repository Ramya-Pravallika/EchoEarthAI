export function formatCarbonScore(score: number): string {
  return `${score.toFixed(1)} CO₂ tons/year`;
}

export function formatPoints(points: number): string {
  return `${points.toLocaleString()} pts`;
}
