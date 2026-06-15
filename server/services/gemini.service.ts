import { GoogleGenAI } from "@google/genai";

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
        timeout: 180000,
      },
    });
  }
  return aiClient;
}

export async function generateContentWithRetry(params: any, retries = 3, delay = 2000): Promise<any> {
  const ai = getGeminiClient();
  let lastError: any = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini API server retrying (${i + 1}/${retries}): ${err.message || err}`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
}
