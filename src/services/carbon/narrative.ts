export function generateNarrativeReportFallback(p: {
  identityTitle?: string;
  co2Value?: number;
  actionsAdoptedCount?: number;
  totalPoints?: number;
  ecoMood?: string;
}): string {
  return `Dear Guardian of the Earth, your specialized journey as "${p.identityTitle || "A Conscious Explorer"}" has created a beautiful ripple of awareness today. Maintaining a current emission profile of ${p.co2Value || 4.2} metric tons means you have unlocked active environmental tracks.\n\nWith ${p.actionsAdoptedCount || 0} critical interventions pledged and a biome vitality score of ${p.totalPoints || 0}, your garden is shifting towards a state of "${p.ecoMood || "Vibrant"}" harmony. Every single carbon-minimizing step you celebrate today protects vulnerable canopies and breathes fresh oxygen back into our shared future.`;
}
