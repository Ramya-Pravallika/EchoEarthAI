import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI securely
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Server API Routes
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Conversational Carbon Assessment API route
app.post("/api/carbon-assessment", async (req: Request, res: Response): Promise<void> => {
  try {
    const { answers } = req.body;
    if (!answers) {
      res.status(400).json({ error: "No answers provided for the carbon assessment" });
      return;
    }

    if (!apiKey) {
      res.status(500).json({
        error: "Gemini API Key is missing. Please add it via Secrets panel.",
      });
      return;
    }

    const t = answers.transportation || {};
    const f = answers.food || {};
    const e = answers.energy || {};
    const s = answers.shopping || {};
    const w = answers.waste || {};

    const prompt = `
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

    const response = await ai.models.generateContent({
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
                title: { type: Type.STRING, description: "Empowering title matching their profile, e.g. 'The Modern Woodland Nomad'" },
                description: { type: Type.STRING, description: "Empathetic, holistic analysis of their lifestyle strengths and habits" },
                dominantHabit: { type: Type.STRING, description: "Main category responsible for emissions (e.g., Road Commutes, Home Heating, Meat-Rich Food)" },
                contributorExplanation: { type: Type.STRING, description: "Friendly explanation of why their dominant habit contributes most, highlighting alternative perspectives" }
              },
              required: ["title", "description", "dominantHabit", "contributorExplanation"]
            },
            estimatedTotalCO2: { type: Type.NUMBER, description: "Calculated annual metric tons of CO2 equivalent (minimum 0.5, typically between 3 and 25)" },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                transportation: { type: Type.NUMBER, description: "CO2 metric tons per year from transportation" },
                food: { type: Type.NUMBER, description: "CO2 metric tons per year from diet and waste" },
                energy: { type: Type.NUMBER, description: "CO2 metric tons per year from heating & electrical usage" },
                shopping: { type: Type.NUMBER, description: "CO2 metric tons per year from retail consumption practices" },
                waste: { type: Type.NUMBER, description: "CO2 metric tons per year from trash disposal habits" }
              },
              required: ["transportation", "food", "energy", "shopping", "waste"]
            },
            reasoning: { type: Type.STRING, description: "Internal cognitive check summarizing calculation values, carbon facts, and logic of interventions" },
            empatheticAnalysis: { type: Type.STRING, description: "Empathetic, comforting summary linking their current choices with their potential to affect change." },
            interventions: {
              type: Type.ARRAY,
              description: "Array of exactly 4 actionable carbon-saving guidelines.",
              items: {
                type: Type.OBJECT,
                properties: {
                  actionId: { type: Type.STRING, description: "Unique string code identifier (e.g. 'action_commute', 'action_food')" },
                  title: { type: Type.STRING, description: "Short motivational intervention title" },
                  category: { type: Type.STRING, description: "Must match one of: transportation, food, energy, shopping, waste" },
                  co2Savings: { type: Type.NUMBER, description: "Estimated year/savings in metric tons of CO2" },
                  investmentEffort: { type: Type.STRING, description: "Must be one of: Low, Medium, High" },
                  costSavings: { type: Type.STRING, description: "Must be one of: Low, Medium, High" },
                  empatheticExplanation: { type: Type.STRING, description: "Warm paragraph telling them how this specific habit shifts their dynamic" },
                  steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Step-by-step execution roadmap"
                  }
                },
                required: ["actionId", "title", "category", "co2Savings", "investmentEffort", "costSavings", "empatheticExplanation", "steps"]
              }
            },
            dailyMissions: {
              type: Type.ARRAY,
              description: "Array of exactly 3 simple complete-able tasks for the day.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Unique string code ID" },
                  title: { type: Type.STRING, description: "Brief mission title" },
                  description: { type: Type.STRING, description: "A simple microtask with actionable context" },
                  category: { type: Type.STRING, description: "Must match one of: transportation, food, energy, shopping, waste" },
                  impactLevel: { type: Type.STRING, description: "Low, Medium, or High" },
                  isCompleted: { type: Type.BOOLEAN, description: "Defaults to false" },
                  pointsReward: { type: Type.NUMBER, description: "Reward value typically between 15 and 40 points" }
                },
                required: ["id", "title", "description", "category", "impactLevel", "isCompleted", "pointsReward"]
              }
            }
          },
          required: ["carbonIdentity", "estimatedTotalCO2", "breakdown", "reasoning", "empatheticAnalysis", "interventions", "dailyMissions"]
        }
      }
    });

    const cleanText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(cleanText));
  } catch (error: any) {

    console.error(error);

    res.status(500).json({

        error: error.message,

        stack: error.stack

    });

}
});

// Weekly Narrative / Ecosystem Report generator
app.post("/api/narrative-report", async (req: Request, res: Response): Promise<void> => {
  try {
    const { identityTitle, co2Value, actionsAdoptedCount, totalPoints, ecoMood } = req.body;

    if (!apiKey) {
      res.status(500).json({
        error: "Gemini API Key is missing. Please add it via Secrets panel.",
      });
      return;
    }

    const prompt = `
Write a supportive, poetic, and highly focused Carbon Reflection Report based on the customer's transition metrics.

USER METRICS:
- Carbon Profile Title: "${identityTitle || 'The Aware Citizens'}"
- Current Carbon Emissions: ${co2Value || 0} metric tons CO2e/year
- Carbon Actions Adopted: ${actionsAdoptedCount || 0} out of 4 proposed steps
- Eco Ecosystem Vitality Points: ${totalPoints || 0}
- Current Living Ecosystem Mood: "${ecoMood || 'Moderate'}"

INSTRUCTIONS:
1. Write a beautifully crafted 2-paragraph "Weekly Reflection" from EchoEarth AI. Focus on the beauty of incremental improvements, describing how their small decisions are actively healing their virtual ecosystem representation.
2. Maintain an inspiring, narrative tone. Avoid lists, markdown headings, raw percentages, or carbon statistics tables. Focus on human emotion, reflective beauty, and positive behavioral feedback.
3. Keep it brief (between 150 - 220 words).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are EchoEarth AI, writing an artistic, empathetic reflective narrative for the user.",
      }
    });

    res.json({ narrative: response.text || "Your ecosystem is starting to breathe with greater ease. Every action you adopt reflects in the light of the mirror, letting life take root." });
  } catch (error: any) {
    console.error("Narrative Report error:", error);
    res.status(500).json({ error: "Failed to compile AI narrative report", details: error.message });
  }
});

// AI Sustainability Coach Chat endpoint
app.post("/api/coach-chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { history, message, identityTitle, estimatedTotalCO2 } = req.body;
    if (!apiKey) {
      res.status(500).json({ error: "Gemini API key is missing. Add it in secrets." });
      return;
    }

    const conversationHistory = history || [];
    const contents = conversationHistory.map((m: any) => ({
      role: m.role || "user",
      parts: [{ text: m.text || "" }]
    }));

    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const systemInstruction = `You are EchoEarth AI's Sustainability Coach. 
Your user has a Carbon Identity of "${identityTitle || "A Conscious Explorer"}" and an annual footprint of estimated ${estimatedTotalCO2 || 10} metric tons.
Always be exceptionally encouraging, supportive, and full of action-oriented psychology.
Keep answers concise, extremely practical, and free from guilt. Highlight easy wins first. Write in a clear, formatted human tone. Under 150 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ reply: response.text || "I am here to guide you on your positive environmental journey! Every small habit builds a greener forest." });
  } catch (error: any) {
    console.error("Coach Chat API error:", error);
    res.status(500).json({ error: "Failed to communicate with AI Coach" });
  }
});

// AI Reflection Journal Analysis endpoint
app.post("/api/journal-analysis", async (req: Request, res: Response): Promise<void> => {
  try {
    const { entry, identityTitle } = req.body;
    if (!entry) {
      res.status(400).json({ error: "No entry provided" });
      return;
    }
    if (!apiKey) {
      res.status(500).json({ error: "Gemini API key is missing. Add it in secrets." });
      return;
    }

    const prompt = `
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            vitalityMood: { type: Type.STRING },
            microTip: { type: Type.STRING }
          },
          required: ["analysis", "vitalityMood", "microTip"]
        }
      }
    });

    const text = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Journal Analysis API error:", error);
    res.status(500).json({ error: "Failed to parse reflection" });
  }
});

// Dynamic AI Contextual Nudge Generator endpoint
app.post("/api/nudges", async (req: Request, res: Response): Promise<void> => {
  try {
    const { identityTitle, breakdown, adoptedIds } = req.body;
    if (!apiKey) {
      res.status(500).json({ error: "Gemini API key is missing. Add it in secrets." });
      return;
    }

    const prompt = `
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

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING, description: "Must match transportation, food, energy, shopping, waste" },
              impactLevel: { type: Type.STRING, description: "Low, Medium, High" }
            },
            required: ["title", "description", "category", "impactLevel"]
          }
        }
      }
    });

    const text = response.text ? response.text.trim() : "[]";
    res.json({ nudges: JSON.parse(text) });
  } catch (error: any) {
    console.error("Nudges API error:", error);
    res.status(500).json({ error: "Failed to generate AI nudges" });
  }
});

// Setup Vite Dev Server / Static Asset fallback
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EchoEarth AI running standard full-stack on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
