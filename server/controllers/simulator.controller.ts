import { Request, Response } from "express";
import { NarrativeReportRequestSchema } from "../validators/assessment.validator";
import { promptBuilder } from "../services/prompt.service";
import { generateContentWithRetry } from "../services/gemini.service";

export async function simulateEcosystem(req: Request, res: Response) {
  try {
    const rawData = req.body;
    const validation = NarrativeReportRequestSchema.safeParse(rawData);

    if (!validation.success) {
      res.status(400).json({ error: "Invalid report configuration tags." });
      return;
    }

    const p = validation.data;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.json({
        narrative: `Dear Guardian of the Earth, your specialized journey as "${p.identityTitle || "A Conscious Explorer"}" has created a beautiful ripple of awareness today. Maintaining a current emission profile of ${p.co2Value || 4.2} metric tons means you have unlocked active environmental tracks.\n\nWith ${p.actionsAdoptedCount || 0} critical interventions pledged and a biome vitality score of ${p.totalPoints || 0}, your garden is shifting towards a state of "${p.ecoMood || "Vibrant"}" harmony. Every single carbon-minimizing step you celebrate today protects vulnerable canopies and breathes fresh oxygen back into our shared future.`
      });
      return;
    }

    const prompt = promptBuilder.buildNarrativeReportPrompt({
      identityTitle: p.identityTitle || "Conscious Explorer",
      co2Value: p.co2Value || 10,
      actionsAdoptedCount: p.actionsAdoptedCount || 0,
      totalPoints: p.totalPoints || 0,
      ecoMood: p.ecoMood || "Blooming",
    });

    try {
      const response = await generateContentWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are EchoEarth AI, writing an artistic, empathetic reflective narrative for the user.",
        },
      });

      res.json({
        narrative: response.text || "Your ecosystem is starting to breathe with greater ease. Every action you adopt reflects in the light of the mirror, letting life take root."
      });
    } catch (apiError: any) {
      res.json({
        narrative: `Dear Guardian of the Earth, your specialized journey as "${p.identityTitle || "A Conscious Explorer"}" has created a beautiful ripple of awareness today. Maintaining a current emission profile of ${p.co2Value || 4.2} metric tons means you have unlocked active environmental tracks.\n\nWith ${p.actionsAdoptedCount || 0} critical interventions pledged and a biome vitality score of ${p.totalPoints || 0}, your garden is shifting towards a state of "${p.ecoMood || "Vibrant"}" harmony. Every single carbon-minimizing step you celebrate today protects vulnerable canopies and breathes fresh oxygen back into our shared future.`
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to compile AI narrative report." });
  }
}
