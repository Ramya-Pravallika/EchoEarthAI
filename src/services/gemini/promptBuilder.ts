import { AssessmentAnswers } from "../../types/index";

/**
 * Prompt Builder Utility Service for standardizing and sanitizing large language model prompts
 */

export const promptBuilder = {
  /**
   * Generates prompt for the Conversational Carbon Assessment
   */
  buildAssessmentPrompt(answers: AssessmentAnswers): string {
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
1. Generate an accurate approximate carbon footprint calculation in Metric Tons per year (estimatedTotalCO2) based on lifestyle research constants, broken down across transportation, food, energy, shopping, and waste.
2. Formulate a personalized Carbon Identity (e.g. "The Horizon Voyager" if travel heavily contributes, "The Conscious Urbanite" if balanced electric). Give it an empathetic description that points out strengths first. Explain the dominant contributor in user-friendly terms without guilt.
3. Recommend exactly 4 customized, highly target-oriented Carbon Interventions. Rank them sequentially starting from Lowest Effort/Highest Impact to Medium/High effort. Each intervention must comprise concrete, step-by-step guidance and cost-savings classifications.
4. Establish 3 immediate, simple "Daily Missions" related to their habits that they can tick off today.

Be kind, encouraging, supportive, and avoid guilt-triggering vocabulary. Double-check calculations to maintain reasonable accuracy (typically between 2 and 25 metric tons CO2e per household).
`;
  },

  /**
   * Generates prompt for the Weekly Narrative Report
   */
  buildNarrativeReportPrompt(params: {
    identityTitle: string;
    co2Value: number;
    actionsAdoptedCount: number;
    totalPoints: number;
    ecoMood: string;
  }): string {
    const { identityTitle, co2Value, actionsAdoptedCount, totalPoints, ecoMood } = params;
    return `
Write a supportive, poetic, and highly focused Carbon Reflection Report based on the customer's transition metrics.

USER METRICS:
- Carbon Profile Title: "${identityTitle || "The Aware Citizens"}"
- Current Carbon Emissions: ${co2Value || 0} metric tons CO2e/year
- Carbon Actions Adopted: ${actionsAdoptedCount || 0} out of 4 proposed steps
- Eco Ecosystem Vitality Points: ${totalPoints || 0}
- Current Living Ecosystem Mood: "${ecoMood || "Moderate"}"

INSTRUCTIONS:
1. Write a beautifully crafted 2-paragraph "Weekly Reflection" from EchoEarth AI. Focus on the beauty of incremental improvements, describing how their small decisions are actively healing their virtual ecosystem representation.
2. Maintain an inspiring, narrative tone. Avoid lists, markdown headings, raw percentages, or carbon statistics tables. Focus on human emotion, reflective beauty, and positive behavioral feedback.
3. Keep it brief (between 150 - 220 words).
`;
  },

  /**
   * Generates prompt for the Reflection Journal Analysis
   */
  buildJournalPrompt(entry: string, identityTitle: string): string {
    return `
Context: The user is writing in their EchoEarth AI sustainability reflection journal.
Carbon Identity of user: "${identityTitle || "Aware Companion"}"
Their entry: "${entry}"

Tasks:
1. Provide a short, heartfelt response (2-3 sentences max) analyzing their positive emotional alignment or constructive challenges.
2. Determine their 'Vitality Mood' (e.g., Hopeful, Energetic, Reflective, or Motivated) and evaluate the emotional trend.
3. Suggest 1 micro-tip (under 20 words) that connects their feeling today with a concrete, easy carbon win tomorrow.

Respond in structured JSON containing:
- analysis (string)
- vitalityMood (string)
- microTip (string)
`;
  },

  /**
   * Generates prompt for custom Nudges
   */
  buildNudgesPrompt(identityTitle: string, breakdown: any, adoptedIds: string[]): string {
    return `
Generate 3 highly personalized, context-aware nudges for a user running the EchoEarth AI app.
User's Carbon Identity: "${identityTitle || "Aware Citizen"}"
Emissions Breakdown: ${JSON.stringify(breakdown || {})}
Already Pledged Interventions: ${JSON.stringify(adoptedIds || [])}

Requirements:
- Nudges should nudge, never shame. Let's make them constructive and friendly.
- Relate them to realistic triggers (e.g., Friday dining, morning commute, shopping seasons).
- Offer creative alternative behavioral nudges.
- Recommend exactly 3 nudges.
`;
  }
};
export default promptBuilder;
