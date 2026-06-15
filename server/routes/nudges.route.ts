import { Router, Request, Response } from "express";
import { NudgesRequestSchema } from "../validators/assessment.validator";
import { promptBuilder } from "../services/prompt.service";
import { generateContentWithRetry } from "../services/gemini.service";
import { responseParser } from "../../src/services/gemini/parser";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const rawData = req.body;
    const validation = NudgesRequestSchema.safeParse(rawData);

    if (!validation.success) {
      res.status(400).json({ error: "Malformed user nudge credentials." });
      return;
    }

    const { identityTitle, breakdown, adoptedIds } = validation.data;
    const apiKey = process.env.GEMINI_API_KEY;

    const fallbackNudges = [
      {
        title: "Plan Seasonal Salad Bowls",
        description: "Choosing seasonal, locally grown organic foods over packaged imports scales down transportation overhead.",
        category: "food",
        impactLevel: "Medium"
      },
      {
        title: "Snuff Out Phantom Chargers",
        description: "Standard power bricks draw energy even when idle. Unplug your device chargers when full.",
        category: "energy",
        impactLevel: "Low"
      },
      {
        title: "The 48-Hour Cart Cool-down",
        description: "Give shopping items 48 hours in your digital checkout cart to cultivate intentional material acquisitions.",
        category: "shopping",
        impactLevel: "Low"
      }
    ];

    if (!apiKey) {
      res.json({ nudges: fallbackNudges });
      return;
    }

    const prompt = promptBuilder.buildNudgesPrompt(identityTitle || "Aware Companion", breakdown, adoptedIds || []);

    try {
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                description: { type: "STRING" },
                category: { type: "STRING" },
                impactLevel: { type: "STRING" }
              },
              required: ["title", "description", "category", "impactLevel"]
            }
          }
        }
      });

      const parsed = responseParser.parseJSON(response.text || "[]", []);
      res.json({ nudges: parsed.length ? parsed : fallbackNudges });
    } catch (apiError: any) {
      console.warn("Nudges API fallback on connection error:", apiError.message);
      res.json({ nudges: fallbackNudges });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to compile custom behavior nudges." });
  }
});

export default router;
