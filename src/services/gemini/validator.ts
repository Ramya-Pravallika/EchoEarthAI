import { z } from "zod";

export const geminiResponseSchema = z.object({
  analysis: z.string().optional(),
  vitalityMood: z.string().optional(),
  microTip: z.string().optional(),
});
