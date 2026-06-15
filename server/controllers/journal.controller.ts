import { Request, Response } from "express";
import { JournalAnalysisRequestSchema } from "../validators/assessment.validator";
import { promptBuilder } from "../services/prompt.service";
import { generateContentWithRetry } from "../services/gemini.service";
import { responseParser } from "../../src/services/gemini/parser";

export async function analyzeJournal(req: Request, res: Response) {
  try {
    const rawData = req.body;
    const validation = JournalAnalysisRequestSchema.safeParse(rawData);

    if (!validation.success) {
      res.status(400).json({ error: "Malformed user journal parameters." });
      return;
    }

    const { entry, identityTitle } = validation.data;
    const apiKey = process.env.GEMINI_API_KEY;

    const entryLower = entry.toLowerCase();
    let defaultMood = "Reflective";
    let defaultAnalysis = `A deeply thoughtful reflection. Your daily journal entries represent high levels of behavioral awareness. By writing about your choices, you are training your focus on sustainable conservation. Keep taking pride in this continuous path!`;
    let defaultMicroTip = "Unplug your bedroom media consoles tonight to secure a simple environmental win.";

    if (entryLower.includes("happy") || entryLower.includes("proud") || entryLower.includes("good") || entryLower.includes("great") || entryLower.includes("completed")) {
      defaultMood = "Hopeful";
      defaultAnalysis = `What a beautiful sensation of progress! Connecting positive emotions to green choices is exactly how sustainable habits lock in. Celebrating small wins builds an incredible foundation for our collective EchoEarth ecosystem.`;
      defaultMicroTip = "Celebrate your bright energy by checking off another small action option tomorrow.";
    } else if (entryLower.includes("hard") || entryLower.includes("difficult") || entryLower.includes("failed") || entryLower.includes("struggle")) {
      defaultMood = "Reflective";
      defaultAnalysis = `Patience is a primary element of healing. Shifting habits takes time, and minor setbacks are simply learning steps on a long road. Focus on non-judgmental awareness today and start fresh tomorrow.`;
      defaultMicroTip = "Keep it simple tomorrow: drink water from a reusable glass container.";
    }

    if (!apiKey) {
      res.json({ analysis: defaultAnalysis, vitalityMood: defaultMood, microTip: defaultMicroTip });
      return;
    }

    const prompt = promptBuilder.buildJournalPrompt(entry, identityTitle || "Conscious Explorer");

    try {
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              analysis: { type: "STRING" },
              vitalityMood: { type: "STRING" },
              microTip: { type: "STRING" }
            },
            required: ["analysis", "vitalityMood", "microTip"]
          }
        }
      });

      const parsed = responseParser.parseJSON(response.text || "{}", null);
      if (parsed && parsed.analysis) {
        res.json(parsed);
      } else {
        throw new Error("Invalid format");
      }
    } catch (apiError: any) {
      console.warn("Journal API fallback on connection fault:", apiError.message);
      res.json({ analysis: defaultAnalysis, vitalityMood: defaultMood, microTip: defaultMicroTip });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to analyze journal." });
  }
}
