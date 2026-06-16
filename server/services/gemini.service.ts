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

function isQuotaOrAuthError(err: any): boolean {
  if (!err) return false;
  const errMsg = (err.statusText || err.message || String(err)).toLowerCase();
  const errCode = err.status || err.statusCode || err.error?.code || err.code;

  if (errCode === 429 || errCode === "RESOURCE_EXHAUSTED") return true;
  if (errCode === 401 || errCode === 403 || errCode === "UNAUTHENTICATED" || errCode === "PERMISSION_DENIED") return true;

  if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("limit") || errMsg.includes("exhausted")) return true;
  if (errMsg.includes("key") || errMsg.includes("auth") || errMsg.includes("permission") || errMsg.includes("credential")) return true;

  return false;
}

export async function generateContentWithRetry(params: any, retries = 3, delay = 2000): Promise<any> {
  const ai = getGeminiClient();
  let lastError: any = null;
  for (let i = 0; i < retries; i++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: any) {
      lastError = err;
      
      const cleanMessage = err.message || String(err);
      if (isQuotaOrAuthError(err)) {
        console.warn(`[Gemini API Server Config/Quota Alert] Fail-fast triggered. Skipping retry for: ${cleanMessage}`);
        throw err; // Fail fast immediately
      }

      console.warn(`Gemini API server retrying (${i + 1}/${retries}): ${cleanMessage}`);
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  throw lastError;
}
