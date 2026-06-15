export const promptBuilder = {
  buildAssessmentPrompt(answers: any): string {
    const t = (answers.transportation || {}) as any;
    const f = (answers.food || {}) as any;
    const e = (answers.energy || {}) as any;
    const s = (answers.shopping || {}) as any;
    const w = (answers.waste || {}) as any;

    return `
You are EchoEarth AI, an empathetic, highly analytical carbon footprint expert.
Evaluate the following lifestyle assessment dataset and generate a structured JSON carbon reflection profiling.

ASSESSMENT METRICS:
- Transportation Commute Method: ${t.commuteMethod || "None"} (Approx. ${t.commuteMiles || 0} miles/week)
- Airplane Travel Intensity: ${t.flightsLength || "None"}
- Primary Diet Type: ${f.dietType || "Balanced"}
- Organic & Local Sourcing: ${f.organicLocal || "Sometimes"}
- Level of Household Food Waste: ${f.foodWaste || "Medium"}
- Home Physical Size: ${e.homeSize || "Apartment"}
- Household Heating Source: ${e.heatingSource || "Electric"}
- Green Electricity Subscription: ${e.greenElectricity ? "Yes (100% clean)" : "No"}
- Fast Fashion & Shopping Volume: ${s.purchaseFrequency || "Moderate"}
- Second-Hand Purchases Preference: ${s.secondHand || "Sometimes"}
- Recycling Rigor Level: ${w.recyclingLevel || "Partial"}
- Composting At Home: ${w.composting ? "Yes" : "No"}
- Single-Use Plastics Intake: ${w.singleUsePlastics || "Moderate"}

YOUR GOALS:
1. Generate an approximate carbon footprint calculation (Metric Tons/year) based on lifestyle research constants, broken down across transportation, food, energy, shopping, and waste.
2. Formulate a personalized Carbon Identity.
3. Recommend exactly 4 customized, highly target-oriented Carbon Interventions.
4. Establish 3 immediate, simple "Daily Missions".

Respond in structured JSON.
`;
  },

  buildNarrativeReportPrompt(params: any): string {
    const { identityTitle, co2Value, actionsAdoptedCount, totalPoints, ecoMood } = params;
    return `
Write a supportive, poetic, and highly focused Carbon Reflection Report based on the customer's transition metrics.

USER METRICS:
- Carbon Profile Title: "${identityTitle || "The Aware Citizens"}"
- Current Carbon Emissions: ${co2Value || 0} metric tons CO2e/year
- Carbon Actions Adopted: ${actionsAdoptedCount || 0} out of 4 proposed steps
- Eco Ecosystem Vitality Points: ${totalPoints || 0}
- Current Living Ecosystem Mood: "${ecoMood || "Moderate"}"

Write a beautifully crafted 2-paragraph "Weekly Reflection" from EchoEarth AI.
Keep it brief (between 150 - 220 words). No markdown headings or tables.
`;
  },

  buildJournalPrompt(entry: string, identityTitle: string): string {
    return `
Context: The user is writing in their EchoEarth AI sustainability reflection journal.
Carbon Identity of user: "${identityTitle || "Aware Companion"}"
Their entry: "${entry}"

Tasks:
1. Provide a short, heartfelt response (2-3 sentences max) analyzing their positive emotional alignment or constructive challenges.
2. Determine their 'Vitality Mood' (e.g., Hopeful, Energetic, Reflective, or Motivated) and evaluate the emotional trend.
3. Suggest 1 micro-tip (under 20 words) that connects their feeling today with a concrete, easy carbon win tomorrow.

Respond in structured JSON containing fields: analysis, vitalityMood, microTip.
`;
  },

  buildNudgesPrompt(identityTitle: string, breakdown: any, adoptedIds: string[]): string {
    return `
Generate 3 highly personalized, context-aware nudges for a user running the EchoEarth AI app.
User's Carbon Identity: "${identityTitle || "Aware Citizen"}"
Emissions Breakdown: ${JSON.stringify(breakdown || {})}
Already Pledged Interventions: ${JSON.stringify(adoptedIds || [])}

Recommend exactly 3 nudges as an array of objects containing title, description, category, and impactLevel.
`;
  }
};
export default promptBuilder;
