/**
 * Secure Response Parser & Sanitizer Service for LLM outputs
 */

export const responseParser = {
  /**
   * Safe JSON parser with robust try-catch block to prevent runtime crashes
   */
  parseJSON<T>(rawText: string, fallback: T): T {
    if (!rawText) return fallback;
    try {
      // Strip any accidental markdown formatting blocks (e.g. ```json ... ```)
      let cleanText = rawText.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.substring(7);
      } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.substring(3);
      }
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();
      return JSON.parse(cleanText) as T;
    } catch (e) {
      console.warn("Failed to parse LLM response into structured JSON:", e);
      return fallback;
    }
  }
};
export default responseParser;
