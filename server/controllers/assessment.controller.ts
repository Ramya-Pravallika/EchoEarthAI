import { Request, Response } from "express";
import { getCarbonAssessmentReflection } from "../../src/services/gemini/gemini.service";
import { AssessmentAnswersSchema } from "../validators/assessment.validator";

export async function createAssessment(req: Request, res: Response) {
  try {
    const rawData = req.body;
    const validationResult = AssessmentAnswersSchema.safeParse(rawData.answers);

    if (!validationResult.success) {
      res.status(400).json({ error: "Malformed style answers payload.", details: validationResult.error.format() });
      return;
    }

    const reflection = await getCarbonAssessmentReflection(validationResult.data as any);
    res.json(reflection);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to compile AI carbon evaluation report.", details: error.message });
  }
}
