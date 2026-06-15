export function calculateCarbonOffset(treesPlanted: number): number {
  // 1 tree absorbs ~22kg CO2 per year = 0.022 Metric Tons
  return treesPlanted * 0.022;
}

export function formatCO2Value(tons: number): string {
  return `${tons.toFixed(2)} Metric Tons CO2e`;
}
