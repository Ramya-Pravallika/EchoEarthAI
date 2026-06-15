import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentAnswers } from "../../types/index";
import { promptBuilder } from "./promptBuilder";
import { responseParser } from "./parser";
import { getProgrammaticAssessment } from "../carbon/calculator";

/**
 * Enterprise Service Layer for Google GenAI Integration
 */

// Initialize client with custom built-agent tag for telemetry tracking
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
        timeout: 180000, // 3 minutes timeout for heavy processing
      },
    });
  }
  return aiClient;
}

/**
 * Execute content generation with robust programmatic retries
 */
export async function generateContentWithRetry(params: any, retries = 3, delay = 2000): Promise<any> {
  const ai = getGeminiClient();
  let lastError: any = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini API connection retrying (${i + 1}/${retries}): ${err.message || err}`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Evaluates lifestyle inputs into structured assessment reflecting points
 */
export async function getCarbonAssessmentReflection(answers: AssessmentAnswers): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("API key is missing, routing directly to baseline local calculations");
    return getProgrammaticAssessment(answers);
  }

  const prompt = promptBuilder.buildAssessmentPrompt(answers);

  try {
    const response = await generateContentWithRetry({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an encouraging, expert Carbon Reflection Advisor named EchoEarth AI. Respond strictly with formatted JSON matching the provided schema.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            carbonIdentity: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                dominantHabit: { type: Type.STRING },
                contributorExplanation: { type: Type.STRING }
              },
              required: ["title", "description", "dominantHabit", "contributorExplanation"]
            },
            estimatedTotalCO2: { type: Type.NUMBER },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                transportation: { type: Type.NUMBER },
                food: { type: Type.NUMBER },
                energy: { type: Type.NUMBER },
                shopping: { type: Type.NUMBER },
                waste: { type: Type.NUMBER }
              },
              required: ["transportation", "food", "energy", "shopping", "waste"]
            },
            reasoning: { type: Type.STRING },
            empatheticAnalysis: { type: Type.STRING },
            interventions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  actionId: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  co2Savings: { type: Type.NUMBER },
                  investmentEffort: { type: Type.STRING },
                  costSavings: { type: Type.STRING },
                  empatheticExplanation: { type: Type.STRING },
                  steps: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["actionId", "title", "category", "co2Savings", "investmentEffort", "costSavings", "empatheticExplanation", "steps"]
              }
            },
            dailyMissions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  impactLevel: { type: Type.STRING },
                  isCompleted: { type: Type.BOOLEAN },
                  pointsReward: { type: Type.NUMBER }
                },
                required: ["id", "title", "description", "category", "impactLevel", "isCompleted", "pointsReward"]
              }
            }
          },
          required: ["carbonIdentity", "estimatedTotalCO2", "breakdown", "reasoning", "empatheticAnalysis", "interventions", "dailyMissions"]
        }
      }
    });

    const parsed = responseParser.parseJSON(response.text || "{}", null);
    if (!parsed || !parsed.carbonIdentity) {
      throw new Error("Parsed empty structure");
    }
    return parsed;
  } catch (err: any) {
    console.warn("Carbon Assessment API fell back programmatically:", err.message || err);
    return getProgrammaticAssessment(answers);
  }
}
